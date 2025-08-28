// supabase/functions/ai-brand-kit-manager/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
Deno.serve(async (req)=>{
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders
    });
  }
  try {
    const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
    // Authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response('Missing Authorization header', {
        status: 401
      });
    }
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response('Invalid token', {
        status: 401
      });
    }
    // Get user context
    const { data: context, error: contextError } = await supabase.rpc('get_user_context', {
      user_auth_id: user.id
    });
    if (contextError || !context || context.length === 0) {
      return new Response('User context not found', {
        status: 403
      });
    }
    const userContext = context[0];
    const { action, data } = await req.json();
    switch(action){
      case 'create_from_description':
        return await createFromDescription(supabase, userContext, data);
      case 'analyze_logo':
        return await analyzeLogo(supabase, userContext, data);
      case 'extract_from_website':
        return await extractFromWebsite(supabase, userContext, data);
      case 'generate_variations':
        return await generateVariations(supabase, data);
      case 'suggest_improvements':
        return await suggestImprovements(supabase, data);
      case 'analyze_competitor':
        return await analyzeCompetitor(supabase, data);
      default:
        return new Response('Invalid action', {
          status: 400
        });
    }
  } catch (error) {
    console.error('Error in ai-brand-kit-manager:', error);
    return new Response(JSON.stringify({
      error: error.message
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
});
async function createFromDescription(supabase, userContext, data) {
  const { company_description, market_focus, target_audience, style_preference } = data;
  if (!OPENAI_API_KEY) {
    return new Response('OpenAI API key not configured', {
      status: 500
    });
  }
  const prompt = `Create a comprehensive brand kit for a real estate company with these details:

Company Description: ${company_description}
Market Focus: ${market_focus} (e.g., luxury homes, first-time buyers, commercial)
Target Audience: ${target_audience}
Style Preference: ${style_preference} (e.g., modern, traditional, luxury)

Provide a detailed JSON response with:
{
  "brand_name_suggestions": ["suggestion1", "suggestion2", "suggestion3"],
  "color_palette": {
    "primary": "#hexcode",
    "secondary": "#hexcode", 
    "accent": "#hexcode",
    "neutral_light": "#hexcode",
    "neutral_dark": "#hexcode",
    "reasoning": "explanation of color psychology"
  },
  "typography": {
    "heading_font": "font name",
    "body_font": "font name", 
    "accent_font": "font name",
    "reasoning": "why these fonts work"
  },
  "brand_voice": {
    "personality": ["adjective1", "adjective2", "adjective3"],
    "tone_description": "2-3 sentence description",
    "do_say": ["phrase1", "phrase2", "phrase3"],
    "dont_say": ["phrase1", "phrase2", "phrase3"],
    "example_tagline": "suggested tagline"
  },
  "visual_style": {
    "logo_direction": "description of suggested logo style",
    "imagery_style": "description of photo/video style",
    "layout_preference": "clean/busy/minimalist/etc"
  },
  "market_insights": {
    "why_this_works": "explanation for this market",
    "competitive_advantage": "how this differentiates",
    "psychological_impact": "buyer psychology reasoning"
  }
}`;
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a professional brand strategist specializing in real estate marketing. Create scientifically-backed, market-appropriate brand recommendations.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });
    const aiResponse = await response.json();
    const brandRecommendations = JSON.parse(aiResponse.choices[0].message.content);
    // Create the brand kit in database with AI suggestions
    const { data: brandKit, error: brandError } = await supabase.from('brand_kits').insert({
      company_id: userContext.company_id,
      name: `AI Generated - ${brandRecommendations.brand_name_suggestions[0]}`,
      theme: {
        colors: brandRecommendations.color_palette,
        typography: brandRecommendations.typography,
        visual_style: brandRecommendations.visual_style
      },
      voice: JSON.stringify(brandRecommendations.brand_voice),
      ai_generated: true,
      ai_insights: brandRecommendations.market_insights,
      is_default: false
    }).select().single();
    if (brandError) throw brandError;
    // Track analytics
    await supabase.rpc('fn_track_event', {
      event_name: 'ai_brand_kit_created',
      payload: {
        brand_kit_id: brandKit.id,
        source: 'description',
        market_focus: market_focus
      }
    });
    return new Response(JSON.stringify({
      success: true,
      data: {
        brand_kit: brandKit,
        ai_recommendations: brandRecommendations
      },
      message: 'AI-powered brand kit created successfully'
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('OpenAI API error:', error);
    return new Response('Failed to generate brand recommendations', {
      status: 500
    });
  }
}
async function analyzeLogo(supabase, userContext, data) {
  const { image_url, company_info } = data;
  if (!OPENAI_API_KEY) {
    return new Response('OpenAI API key not configured', {
      status: 500
    });
  }
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'system',
            content: 'You are a brand analyst. Analyze logos and extract comprehensive brand elements for real estate companies.'
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analyze this real estate company logo and extract brand elements. Company context: ${company_info}

Provide JSON response:
{
  "extracted_colors": ["#hex1", "#hex2", "#hex3"],
  "logo_style": "modern/traditional/luxury/minimalist/etc",
  "suggested_palette": {
    "primary": "#hexcode",
    "secondary": "#hexcode",
    "accent": "#hexcode",
    "complementary": ["#hex1", "#hex2"]
  },
  "font_suggestions": {
    "matches_logo": ["font1", "font2"],
    "complementary": ["font1", "font2"]
  },
  "brand_personality": ["adjective1", "adjective2", "adjective3"],
  "voice_recommendation": "suggested brand voice based on visual style",
  "market_positioning": "luxury/mid-market/affordable/commercial",
  "improvements": ["suggestion1", "suggestion2"]
}`
              },
              {
                type: 'image_url',
                image_url: {
                  url: image_url
                }
              }
            ]
          }
        ],
        max_tokens: 1500
      })
    });
    const aiResponse = await response.json();
    const logoAnalysis = JSON.parse(aiResponse.choices[0].message.content);
    // Create brand kit from logo analysis
    const { data: brandKit, error: brandError } = await supabase.from('brand_kits').insert({
      company_id: userContext.company_id,
      name: 'Logo-Based Brand Kit',
      theme: {
        colors: logoAnalysis.suggested_palette,
        typography: logoAnalysis.font_suggestions,
        logo_style: logoAnalysis.logo_style
      },
      voice: logoAnalysis.voice_recommendation,
      ai_generated: true,
      ai_insights: {
        source: 'logo_analysis',
        extracted_colors: logoAnalysis.extracted_colors,
        improvements: logoAnalysis.improvements,
        positioning: logoAnalysis.market_positioning
      },
      is_default: false
    }).select().single();
    if (brandError) throw brandError;
    return new Response(JSON.stringify({
      success: true,
      data: {
        brand_kit: brandKit,
        logo_analysis: logoAnalysis
      },
      message: 'Brand kit created from logo analysis'
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Logo analysis error:', error);
    return new Response('Failed to analyze logo', {
      status: 500
    });
  }
}
async function extractFromWebsite(supabase, userContext, data) {
  const { website_url, additional_context } = data;
  if (!OPENAI_API_KEY) {
    return new Response('OpenAI API key not configured', {
      status: 500
    });
  }
  try {
    // Fetch website content
    const websiteResponse = await fetch(website_url);
    const websiteHtml = await websiteResponse.text();
    // Extract text content (simplified - in production use a proper HTML parser)
    const textContent = websiteHtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 3000) // Limit content length
    ;
    const prompt = `Analyze this real estate company website and extract brand elements:

Website URL: ${website_url}
Website Content: ${textContent}
Additional Context: ${additional_context}

Extract and provide JSON:
{
  "company_name": "extracted company name",
  "brand_colors": {
    "detected_primary": "#hexcode",
    "detected_secondary": "#hexcode",
    "suggested_palette": {
      "primary": "#hexcode",
      "secondary": "#hexcode", 
      "accent": "#hexcode"
    }
  },
  "content_tone": "analyzed tone from website copy",
  "target_market": "inferred target market",
  "service_focus": "primary services offered",
  "brand_voice": {
    "personality": ["trait1", "trait2", "trait3"],
    "tone": "professional/casual/luxury/friendly etc",
    "messaging_themes": ["theme1", "theme2", "theme3"]
  },
  "competitive_positioning": "how they position themselves",
  "suggestions": {
    "improvements": ["improvement1", "improvement2"],
    "opportunities": ["opportunity1", "opportunity2"]
  }
}`;
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a brand strategist analyzing real estate company websites to extract brand elements and provide strategic recommendations.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1500
      })
    });
    const aiResponse = await response.json();
    const websiteAnalysis = JSON.parse(aiResponse.choices[0].message.content);
    // Create brand kit from website analysis
    const { data: brandKit, error: brandError } = await supabase.from('brand_kits').insert({
      company_id: userContext.company_id,
      name: `${websiteAnalysis.company_name} - Website Extract`,
      theme: {
        colors: websiteAnalysis.brand_colors.suggested_palette,
        detected_colors: websiteAnalysis.brand_colors,
        service_focus: websiteAnalysis.service_focus
      },
      voice: JSON.stringify(websiteAnalysis.brand_voice),
      website_url: website_url,
      ai_generated: true,
      ai_insights: {
        source: 'website_analysis',
        content_tone: websiteAnalysis.content_tone,
        target_market: websiteAnalysis.target_market,
        positioning: websiteAnalysis.competitive_positioning,
        suggestions: websiteAnalysis.suggestions
      },
      is_default: false
    }).select().single();
    if (brandError) throw brandError;
    return new Response(JSON.stringify({
      success: true,
      data: {
        brand_kit: brandKit,
        website_analysis: websiteAnalysis
      },
      message: 'Brand kit extracted from website successfully'
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Website analysis error:', error);
    return new Response('Failed to analyze website', {
      status: 500
    });
  }
}
async function generateVariations(supabase, data) {
  const { base_brand_kit_id, variation_requests } = data;
  // Get the base brand kit
  const { data: baseBrand, error: brandError } = await supabase.from('brand_kits').select('*').eq('id', base_brand_kit_id).single();
  if (brandError || !baseBrand) {
    return new Response('Base brand kit not found', {
      status: 404
    });
  }
  const prompt = `Create ${variation_requests.length} brand variations based on this existing brand kit:

Base Brand: ${JSON.stringify(baseBrand.theme)}
Voice: ${baseBrand.voice}

Create variations for:
${variation_requests.map((req)=>`- ${req}`).join('\n')}

Provide JSON array with variations:
[
  {
    "name": "variation name",
    "use_case": "when to use this variation",
    "theme": {
      "colors": {"primary": "#hex", "secondary": "#hex", "accent": "#hex"},
      "adjustments": "what changed from base"
    },
    "voice_adjustments": "how voice changes for this variation"
  }
]`;
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 1500
      })
    });
    const aiResponse = await response.json();
    const variations = JSON.parse(aiResponse.choices[0].message.content);
    return new Response(JSON.stringify({
      success: true,
      data: {
        variations
      },
      message: 'Brand variations generated successfully'
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Variation generation error:', error);
    return new Response('Failed to generate variations', {
      status: 500
    });
  }
}
async function suggestImprovements(supabase, data) {
  // Implementation for brand improvement suggestions
  return new Response(JSON.stringify({
    success: true,
    message: 'Improvement suggestions feature coming soon'
  }), {
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json'
    }
  });
}
async function analyzeCompetitor(supabase, data) {
  // Implementation for competitor analysis
  return new Response(JSON.stringify({
    success: true,
    message: 'Competitor analysis feature coming soon'
  }), {
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json'
    }
  });
}
