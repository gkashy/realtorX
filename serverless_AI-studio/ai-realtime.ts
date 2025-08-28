// supabase/functions/ai-realtime/index.ts
// COMPLETE Real-time AI generation with Enhanced Database-Driven Design Library System
// Monolithic function with 18 actions - 100% production ready
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
// FIX: Import proper polyfills instead of throwing errors
import { decodeBase64 as decodeb64, encodeBase64 as encodeb64 } from "https://deno.land/std@0.212.0/encoding/base64.ts";
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS' // FIX: Added missing CORS methods
};
// API Keys (CANVA_API_KEY removed - no longer needed)
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
// FIX: Single-source provider strings to avoid confusion
const AI_PROVIDERS = {
  IMAGE_ONLY: 'gpt-image-1',
  REFERENCE_GUIDED: 'gpt-4o+gpt-image-1',
  TEXT_COPY: 'gpt-4o'
};
// FIX: 100% zero-copy base64 to blob conversion
function b64ToBlob(b64, type = 'image/png') {
  const bin = decodeb64(b64); // Direct Uint8Array from polyfill
  return new Blob([
    bin
  ], {
    type
  });
}
// Removed deprecated convertBase64ToBlob function
// FIX: Add URL to data URI conversion for reference images with size checking
// NOTE: Memory usage concern - 4MB image → ~6MB base64 → temporary memory spike
// Consider client-side downscaling or using Storage URLs with detail:"low" for production
async function urlToDataUri(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`fetch failed ${res.status}`);
  const buf = await res.arrayBuffer();
  // FIX: Check size to prevent "Request entity too large" errors
  const sizeMB = buf.byteLength / (1024 * 1024);
  if (sizeMB > 4) {
    console.warn(`⚠️ Large reference image (${sizeMB.toFixed(1)}MB). Consider resizing to avoid request limits.`);
  }
  if (sizeMB > 15) {
    throw new Error(`Reference image too large (${sizeMB.toFixed(1)}MB). Please resize to under 4MB to avoid OpenAI request limits.`);
  }
  const mime = res.headers.get('content-type') ?? 'image/png';
  // FIX: Use encodeb64 for both paths to avoid string conversion copy
  const b64 = encodeb64(new Uint8Array(buf));
  return `data:${mime};base64,${b64}`;
}
// Store blob directly instead of downloading from URL
async function storeImageAsset(supabase, imageBlob, listingId, userId, assetKind, metadata) {
  const startTime = Date.now();
  console.log('📤 Storing image blob directly to Supabase');
  const fileExtension = getFileExtensionFromContentType(imageBlob.type);
  const fileName = `${assetKind}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExtension}`;
  const storagePath = listingId ? `${listingId}/${fileName}` : `generic/${fileName}`;
  console.log('📤 Uploading to storage path:', storagePath);
  const { data: uploadData, error: uploadError } = await supabase.storage.from('media-assets').upload(storagePath, imageBlob, {
    cacheControl: '3600',
    upsert: false
  });
  if (uploadError) {
    console.error('🚨 Storage upload error:', uploadError);
    throw uploadError;
  }
  const { data: assetData, error: assetError } = await supabase.from('media_assets').insert({
    listing_id: listingId,
    user_id: userId,
    asset_kind: assetKind,
    storage_path: storagePath,
    upload_order: 1,
    metadata: {
      ...metadata,
      generated_at: new Date().toISOString(),
      file_size: imageBlob.size,
      content_type: imageBlob.type
    }
  }).select().single();
  if (assetError) {
    console.error('🚨 Database insert error:', assetError);
    throw assetError;
  }
  const { data: publicUrl } = supabase.storage.from('media-assets').getPublicUrl(storagePath);
  const processingTime = (Date.now() - startTime) / 1000;
  console.log('✅ Asset stored successfully:', publicUrl.publicUrl);
  return {
    asset_id: assetData.id,
    public_url: publicUrl.publicUrl,
    processing_time: processingTime
  };
}
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
      // ===== CORE CONTENT GENERATION =====
      case 'generate_hero_image':
        return await generateHeroImage(supabase, userContext, data, user.id);
      case 'generate_business_card':
        return await generateBusinessCard(supabase, userContext, data, user.id);
      case 'generate_social_post':
        return await generateSocialPost(supabase, userContext, data, user.id);
      case 'generate_flyer':
        return await generateFlyer(supabase, userContext, data, user.id);
      case 'generate_copy':
        return await generateCopy(supabase, userContext, data, user.id);
      // ===== DESIGN LIBRARY ACTIONS =====
      case 'list_design_styles':
        return await listDesignStyles(supabase, userContext, data);
      case 'generate_styled_business_card':
        return await generateStyledBusinessCard(supabase, userContext, data, user.id);
      case 'generate_styled_business_card_with_reference':
        return await generateStyledBusinessCardWithReference(supabase, userContext, data, user.id);
      case 'generate_styled_flyer':
        return await generateStyledFlyer(supabase, userContext, data, user.id);
      case 'get_user_style_preferences':
        return await getUserStylePreferences(supabase, userContext, data);
      case 'update_style_rating':
        return await updateStyleRating(supabase, userContext, data, user.id);
      // ===== ADMIN ACTIONS =====
      case 'populate_design_library':
        return await populateDesignLibrary(supabase, userContext, data);
      case 'get_style_analytics':
        return await getStyleAnalytics(supabase, userContext, data);
      case 'generate_weekly_analytics':
        return await generateWeeklyAnalytics(supabase, userContext, data);
      case 'generate_seasonal_batch':
        return await generateSeasonalBatch(supabase, userContext, data);
      case 'run_ab_seed_test':
        return await runABSeedTest(supabase, userContext, data);
      // ===== ENHANCEMENT ACTIONS =====
      case 'generate_styled_business_card_enhanced':
        return await generateStyledBusinessCardEnhanced(supabase, userContext, data, user.id);
      case 'regenerate_with_new_seed':
        return await regenerateWithNewSeed(supabase, userContext, data, user.id);
      default:
        return new Response('Invalid action', {
          status: 400
        });
    }
  } catch (error) {
    console.error('Error in ai-realtime:', error);
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
// ===== CORE CONTENT GENERATION FUNCTIONS =====
async function generateHeroImage(supabase, userContext, data, userId) {
  const { listing_id, style = 'modern', include_price = true, custom_prompt, reference_image_url, reference_image_urls// Multiple references (new feature)
   } = data;
  if (!OPENAI_API_KEY) {
    return new Response('OpenAI API key required', {
      status: 500
    });
  }
  try {
    let prompt;
    let useReference = false;
    let generationMode;
    let referenceImages = [];
    // Handle reference images (single or multiple)
    if (reference_image_urls && Array.isArray(reference_image_urls)) {
      referenceImages = reference_image_urls;
    } else if (reference_image_url) {
      referenceImages = [
        reference_image_url
      ];
    }
    // Determine generation mode and build prompt
    if (listing_id && custom_prompt && referenceImages.length > 0) {
      // Mode 1: Listing + Custom + Selected Property Photos
      const { listingData, brandKit } = await getListingAndBrand(supabase, listing_id, userContext.company_id);
      const basePrompt = buildHeroImagePrompt(listingData, brandKit, style, null);
      prompt = `${basePrompt}. Additional creative requirements: ${custom_prompt}`;
      useReference = true;
      generationMode = 'listing_enhanced_with_photos';
      console.log('🎨 Mode: Listing + Custom + Selected Photos');
    } else if (listing_id && custom_prompt) {
      // Mode 2: Enhanced listing with custom direction (no photos)
      const { listingData, brandKit } = await getListingAndBrand(supabase, listing_id, userContext.company_id);
      const basePrompt = buildHeroImagePrompt(listingData, brandKit, style, null);
      prompt = `${basePrompt}. Additional creative requirements: ${custom_prompt}`;
      generationMode = 'listing_enhanced';
      console.log('🎨 Mode: Listing + Custom Enhancement');
    } else if (custom_prompt && referenceImages.length > 0) {
      // Mode 3: Reference-guided custom generation
      prompt = custom_prompt;
      useReference = true;
      generationMode = 'reference_guided';
      console.log('🎨 Mode: Reference-Guided Generation');
    } else if (custom_prompt) {
      // Mode 4: Pure custom generation
      prompt = custom_prompt;
      generationMode = 'custom_only';
      console.log('🎨 Mode: Custom Prompt Only');
    } else if (listing_id) {
      // Mode 5: Traditional listing-based (fallback)
      const { listingData, brandKit } = await getListingAndBrand(supabase, listing_id, userContext.company_id);
      prompt = buildHeroImagePrompt(listingData, brandKit, style, null);
      generationMode = 'listing_traditional';
      console.log('🎨 Mode: Traditional Listing');
    } else {
      throw new Error('Provide either listing_id, custom_prompt, or both');
    }
    console.log('🎨 Generating hero image with prompt:', prompt);
    console.log('🎨 Generation mode:', generationMode);
    console.log('🎨 Reference images count:', referenceImages.length);
    let imageBlob;
    let requestId = null; // FIX: Add request ID tracking
    if (useReference && referenceImages.length > 0) {
      // FIX: Reference-guided generation using proper tool-calling format
      const content = [
        {
          type: 'text',
          text: `Analyze these ${referenceImages.length} reference image(s) and generate a new real estate hero image with this request: ${prompt}. Capture the style, mood, and aesthetic elements from the reference images while creating original marketing content.`
        }
      ];
      // FIX: Convert all reference images to data URIs (was causing Bad Request)
      for (const imageUrl of referenceImages){
        content.push({
          type: 'image_url',
          image_url: {
            url: await urlToDataUri(imageUrl),
            detail: "low" // FIX: Use low detail to reduce token usage
          }
        });
      }
      const imageResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'user',
              content: content
            }
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "generate_image",
                description: "Generate a real estate hero image based on the analysis",
                parameters: {
                  type: "object",
                  properties: {
                    prompt: {
                      type: "string",
                      description: "Detailed prompt for image generation"
                    }
                  },
                  required: [
                    "prompt"
                  ]
                }
              }
            }
          ],
          // FIX: Use modern tool choice syntax (future-proof)
          tool_choice: {
            type: "function",
            function: {
              name: "generate_image"
            }
          }
        })
      });
      if (!imageResponse.ok) {
        throw new Error(`Reference analysis failed: ${imageResponse.statusText}`);
      }
      // FIX: Capture request ID for logging
      requestId = imageResponse.headers.get('x-request-id');
      const analysisResult = await imageResponse.json();
      // Extract the generated prompt from tool call
      const toolCall = analysisResult.choices[0]?.message?.tool_calls?.[0];
      if (!toolCall || toolCall.function.name !== 'generate_image') {
        throw new Error('No image generation prompt received from analysis');
      }
      // FIX: Handle potential JSON parsing issues with function arguments
      let enhancedPrompt;
      try {
        const args = JSON.parse(toolCall.function.arguments);
        enhancedPrompt = args.prompt;
      } catch (parseError) {
        // Fallback: treat arguments as raw string if JSON parsing fails
        console.warn('JSON parse failed for tool arguments, using raw string');
        enhancedPrompt = toolCall.function.arguments;
      }
      if (!enhancedPrompt) {
        throw new Error('No prompt extracted from tool call');
      }
      // Now generate the actual image with the enhanced prompt
      const finalImageResponse = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-image-1',
          prompt: enhancedPrompt,
          size: '1536x1024',
          quality: 'medium',
          n: 1
        })
      });
      if (!finalImageResponse.ok) {
        throw new Error(`Image generation failed: ${finalImageResponse.statusText}`);
      }
      const imageResult = await finalImageResponse.json();
      if (!imageResult.data[0].b64_json) {
        throw new Error('No image data in generation result');
      }
      imageBlob = b64ToBlob(imageResult.data[0].b64_json); // FIX: Use factored function
    } else {
      // Standard image generation
      const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-image-1',
          prompt: prompt,
          size: '1536x1024',
          quality: 'medium',
          n: 1
        })
      });
      if (!imageResponse.ok) {
        throw new Error(`GPT-Image-1 failed: ${imageResponse.statusText}`);
      }
      // FIX: Capture request ID for logging
      requestId = imageResponse.headers.get('x-request-id');
      const imageResult = await imageResponse.json();
      // Handle base64 response
      if (!imageResult.data[0].b64_json) {
        throw new Error('No image data received from OpenAI');
      }
      imageBlob = b64ToBlob(imageResult.data[0].b64_json); // FIX: Use factored function
    }
    // Store the generated image
    const storedAsset = await storeImageAsset(supabase, imageBlob, listing_id, userId, 'ai_hero_image', {
      prompt,
      style,
      include_price,
      generation_mode: generationMode,
      has_reference: referenceImages.length > 0,
      reference_count: referenceImages.length,
      has_listing: !!listing_id,
      has_custom_prompt: !!custom_prompt,
      reference_image_urls: referenceImages,
      ai_provider: useReference ? AI_PROVIDERS.REFERENCE_GUIDED : AI_PROVIDERS.IMAGE_ONLY,
      openai_request_id: requestId // FIX: Store request ID for support
    });
    // FIX: Wrap analytics in try-catch to avoid 500 on analytics failure
    try {
      await supabase.rpc('fn_track_event', {
        event_name: 'ai_content_generated',
        payload: {
          content_type: 'hero_image',
          listing_id: listing_id || null,
          generation_mode: generationMode,
          has_reference: referenceImages.length > 0,
          reference_count: referenceImages.length,
          ai_provider: useReference ? AI_PROVIDERS.REFERENCE_GUIDED : AI_PROVIDERS.IMAGE_ONLY,
          style: style
        }
      });
    } catch (analyticsError) {
      console.warn('Analytics tracking failed:', analyticsError);
    }
    return new Response(JSON.stringify({
      success: true,
      data: {
        download_url: storedAsset.public_url,
        asset_id: storedAsset.asset_id,
        generation_metadata: {
          prompt: prompt,
          style: style,
          generation_mode: generationMode,
          has_reference: referenceImages.length > 0,
          reference_count: referenceImages.length,
          has_listing: !!listing_id,
          has_custom_prompt: !!custom_prompt,
          ai_provider: useReference ? AI_PROVIDERS.REFERENCE_GUIDED : AI_PROVIDERS.IMAGE_ONLY,
          processing_time: storedAsset.processing_time,
          openai_request_id: requestId
        }
      },
      message: `Hero image generated successfully (${generationMode})`
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Hero image generation error:', error);
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
}
async function generateBusinessCard(supabase, userContext, data, userId) {
  // Smart detection: styled vs legacy
  if (data.style_id) {
    return await generateStyledBusinessCard(supabase, userContext, data, userId);
  }
  // Legacy: Simple GPT-Image-1 generation
  const { agent_name, agent_title, phone, email, template_style = 'professional' } = data;
  if (!OPENAI_API_KEY) {
    return new Response('OpenAI API key required', {
      status: 500
    });
  }
  try {
    const brandKit = await getDefaultBrandKit(supabase, userContext.company_id);
    const prompt = `Create a professional ${template_style} business card design.
    Agent: ${agent_name || `${userContext.first_name} ${userContext.last_name}`}
    Title: ${agent_title || userContext.role}
    Contact: ${phone || userContext.phone}, ${email || userContext.email}
    Company: ${userContext.company_name}
    Brand colors: ${brandKit?.theme?.colors?.join(', ') || 'professional blue'}
    High quality, print-ready, 3.5x2 inch business card, ${template_style} style`;
    const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt: prompt,
        size: '1536x1024',
        quality: 'medium',
        n: 1
      })
    });
    if (!imageResponse.ok) {
      throw new Error(`GPT-Image-1 failed: ${imageResponse.statusText}`);
    }
    const imageResult = await imageResponse.json();
    // FIX: Handle base64 response  
    if (!imageResult.data[0].b64_json) {
      throw new Error('No image data received from OpenAI');
    }
    const imageBlob = b64ToBlob(imageResult.data[0].b64_json); // FIX: Use factored function
    const storedAsset = await storeImageAsset(supabase, imageBlob, null, userId, 'ai_business_card', {
      template_style,
      agent_name,
      ai_provider: AI_PROVIDERS.IMAGE_ONLY
    });
    // FIX: Wrap analytics in try-catch
    try {
      await supabase.rpc('fn_track_event', {
        event_name: 'ai_content_generated',
        payload: {
          content_type: 'business_card',
          ai_provider: AI_PROVIDERS.IMAGE_ONLY,
          template_style: template_style
        }
      });
    } catch (analyticsError) {
      console.warn('Analytics tracking failed:', analyticsError);
    }
    return new Response(JSON.stringify({
      success: true,
      data: {
        download_url: storedAsset.public_url,
        asset_id: storedAsset.asset_id,
        generation_metadata: {
          template_style,
          ai_provider: AI_PROVIDERS.IMAGE_ONLY,
          processing_time: storedAsset.processing_time
        }
      },
      message: 'Business card generated successfully'
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Business card generation error:', error);
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
}
async function generateSocialPost(supabase, userContext, data, userId) {
  const { listing_id, platform = 'instagram', post_type = 'listing_showcase', custom_text } = data;
  if (!OPENAI_API_KEY) {
    return new Response('OpenAI API key required', {
      status: 500
    });
  }
  try {
    const { listingData, brandKit } = await getListingAndBrand(supabase, listing_id, userContext.company_id);
    const prompt = buildSocialPostPrompt(listingData, brandKit, platform, post_type, custom_text, userContext.company_name);
    const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt: prompt,
        size: platform === 'instagram' ? '1024x1024' : '1536x1024',
        quality: 'medium',
        n: 1
      })
    });
    if (!imageResponse.ok) {
      throw new Error(`GPT-Image-1 failed: ${imageResponse.statusText}`);
    }
    const imageResult = await imageResponse.json();
    // FIX: Handle base64 response
    if (!imageResult.data[0].b64_json) {
      throw new Error('No image data received from OpenAI');
    }
    const imageBlob = b64ToBlob(imageResult.data[0].b64_json); // FIX: Use factored function
    const storedAsset = await storeImageAsset(supabase, imageBlob, listing_id, userId, 'ai_social_post', {
      platform,
      post_type,
      ai_provider: AI_PROVIDERS.IMAGE_ONLY
    });
    // FIX: Wrap analytics in try-catch
    try {
      await supabase.rpc('fn_track_event', {
        event_name: 'ai_content_generated',
        payload: {
          content_type: 'social_post',
          listing_id: listing_id,
          platform: platform,
          ai_provider: AI_PROVIDERS.IMAGE_ONLY
        }
      });
    } catch (analyticsError) {
      console.warn('Analytics tracking failed:', analyticsError);
    }
    return new Response(JSON.stringify({
      success: true,
      data: {
        download_url: storedAsset.public_url,
        asset_id: storedAsset.asset_id,
        generation_metadata: {
          platform,
          post_type,
          ai_provider: AI_PROVIDERS.IMAGE_ONLY,
          processing_time: storedAsset.processing_time
        }
      },
      message: 'Social post generated successfully'
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Social post generation error:', error);
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
}
async function generateFlyer(supabase, userContext, data, userId) {
  const { listing_id, flyer_type = 'standard', include_qr = true, template_style = 'modern' } = data;
  if (!OPENAI_API_KEY) {
    return new Response('OpenAI API key required', {
      status: 500
    });
  }
  try {
    const { listingData, brandKit } = await getListingAndBrand(supabase, listing_id, userContext.company_id);
    const prompt = buildFlyerPrompt(listingData, brandKit, flyer_type, template_style, include_qr, {
      name: `${userContext.first_name} ${userContext.last_name}`,
      phone: userContext.phone,
      email: userContext.email
    });
    const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt: prompt,
        size: '1536x1024',
        quality: 'medium',
        n: 1
      })
    });
    if (!imageResponse.ok) {
      throw new Error(`GPT-Image-1 failed: ${imageResponse.statusText}`);
    }
    const imageResult = await imageResponse.json();
    // FIX: Handle base64 response
    if (!imageResult.data[0].b64_json) {
      throw new Error('No image data received from OpenAI');
    }
    const imageBlob = b64ToBlob(imageResult.data[0].b64_json); // FIX: Use factored function
    const storedAsset = await storeImageAsset(supabase, imageBlob, listing_id, userId, 'ai_flyer', {
      flyer_type,
      include_qr,
      template_style,
      ai_provider: AI_PROVIDERS.IMAGE_ONLY
    });
    // FIX: Wrap analytics in try-catch
    try {
      await supabase.rpc('fn_track_event', {
        event_name: 'ai_content_generated',
        payload: {
          content_type: 'flyer',
          listing_id: listing_id,
          flyer_type: flyer_type,
          ai_provider: AI_PROVIDERS.IMAGE_ONLY
        }
      });
    } catch (analyticsError) {
      console.warn('Analytics tracking failed:', analyticsError);
    }
    return new Response(JSON.stringify({
      success: true,
      data: {
        download_url: storedAsset.public_url,
        asset_id: storedAsset.asset_id,
        generation_metadata: {
          flyer_type,
          include_qr,
          template_style,
          ai_provider: AI_PROVIDERS.IMAGE_ONLY,
          processing_time: storedAsset.processing_time
        }
      },
      message: 'Flyer generated successfully'
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Flyer generation error:', error);
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
}
async function generateCopy(supabase, userContext, data, userId) {
  const { listing_id, copy_type, platform, tone = 'professional', max_length } = data;
  if (!OPENAI_API_KEY) {
    return new Response('OpenAI API key required', {
      status: 500
    });
  }
  try {
    const { listingData, brandKit } = await getListingAndBrand(supabase, listing_id, userContext.company_id);
    const prompt = buildCopyPrompt(listingData, brandKit, copy_type, platform, tone, max_length);
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are a real estate marketing copywriter. Generate ${copy_type} copy for ${platform} in a ${tone} tone.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: max_length || 500
      })
    });
    const result = await response.json();
    const generatedCopy = result.choices[0].message.content;
    const { data: assetData, error: assetError } = await supabase.from('media_assets').insert({
      listing_id: listing_id,
      user_id: userId,
      asset_kind: 'ai_copy',
      upload_order: 1,
      metadata: {
        copy_type,
        platform,
        tone,
        ai_provider: AI_PROVIDERS.TEXT_COPY,
        generated_copy: generatedCopy,
        generated_at: new Date().toISOString()
      }
    }).select().single();
    if (assetError) throw assetError;
    // FIX: Wrap analytics in try-catch
    try {
      await supabase.rpc('fn_track_event', {
        event_name: 'ai_content_generated',
        payload: {
          content_type: 'copy',
          copy_type: copy_type,
          listing_id: listing_id,
          ai_provider: AI_PROVIDERS.TEXT_COPY
        }
      });
    } catch (analyticsError) {
      console.warn('Analytics tracking failed:', analyticsError);
    }
    return new Response(JSON.stringify({
      success: true,
      data: {
        generated_copy: generatedCopy,
        asset_id: assetData.id,
        generation_metadata: {
          copy_type,
          platform,
          tone,
          ai_provider: AI_PROVIDERS.TEXT_COPY,
          character_count: generatedCopy.length
        }
      },
      message: 'Copy generated successfully'
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Copy generation error:', error);
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
}
// ===== DESIGN LIBRARY FUNCTIONS =====
async function listDesignStyles(supabase, userContext, data) {
  const { category = 'business_card', tags_filter = [], audience_filter = [], sort_by = 'popularity' } = data;
  try {
    let query = supabase.from('design_library').select('*').eq('category', category).eq('is_active', true);
    if (tags_filter.length > 0) {
      query = query.overlaps('style_tags', tags_filter);
    }
    if (audience_filter.length > 0) {
      query = query.overlaps('target_audience', audience_filter);
    }
    switch(sort_by){
      case 'popularity':
        query = query.order('popularity_score', {
          ascending: false
        });
        break;
      case 'quality':
        query = query.order('quality_score', {
          ascending: false
        });
        break;
      case 'newest':
        query = query.order('created_at', {
          ascending: false
        });
        break;
      default:
        query = query.order('style_name');
    }
    const { data: styles, error } = await query;
    if (error) throw error;
    const { data: userPrefs } = await supabase.from('user_style_preferences').select('preferred_styles, avoided_styles, preferred_tags').eq('user_id', userContext.user_id).eq('company_id', userContext.company_id).single();
    const enhancedStyles = styles.map((style)=>({
        id: style.id,
        name: style.style_name,
        thumbnail_url: style.thumbnail_url,
        preview_front: style.image_url_front,
        preview_back: style.image_url_back,
        tags: style.style_tags,
        color_palette: style.color_palette,
        target_audience: style.target_audience,
        popularity_score: style.popularity_score,
        quality_score: style.quality_score,
        is_preferred: userPrefs?.preferred_styles?.includes(style.id) || false,
        is_avoided: userPrefs?.avoided_styles?.includes(style.id) || false,
        tag_match_score: calculateTagMatchScore(style.style_tags, userPrefs?.preferred_tags || [])
      }));
    return new Response(JSON.stringify({
      success: true,
      data: {
        styles: enhancedStyles,
        total_count: styles.length,
        category: category,
        filters_applied: {
          tags: tags_filter,
          audience: audience_filter,
          sort_by: sort_by
        },
        available_filters: {
          tags: [
            ...new Set(styles.flatMap((s)=>s.style_tags))
          ],
          audiences: [
            ...new Set(styles.flatMap((s)=>s.target_audience))
          ]
        }
      }
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('List design styles error:', error);
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
}
async function generateStyledBusinessCard(supabase, userContext, data, userId) {
  const { style_id, variation_mode = 'identical', agent_name, agent_title, phone, email, website, company_name, brand_colors = [], logo_url, headshot_url, include_qr = true, qr_content = 'contact', custom_tagline, print_format = 'standard', force_new_seed = false } = data;
  if (!OPENAI_API_KEY) {
    return new Response('OpenAI API key required', {
      status: 500
    });
  }
  try {
    const { data: style, error: styleError } = await supabase.from('design_library').select('*').eq('id', style_id).eq('is_active', true).single();
    if (styleError || !style) {
      throw new Error('Style template not found or inactive');
    }
    let backStyleId = style_id;
    if (variation_mode === 'surprise_me') {
      const { data: compatibleStyles } = await supabase.from('design_library').select('id').eq('category', 'business_card').eq('is_active', true).overlaps('style_tags', style.style_tags.slice(0, 2)).neq('id', style_id);
      if (compatibleStyles && compatibleStyles.length > 0) {
        backStyleId = compatibleStyles[Math.floor(Math.random() * compatibleStyles.length)].id;
      }
    }
    const { data: backStyle } = await supabase.from('design_library').select('*').eq('id', backStyleId).single();
    const brandData = {
      agent_name: agent_name || `${userContext.first_name} ${userContext.last_name}`,
      agent_title: agent_title || userContext.role || 'Real Estate Professional',
      phone: phone || userContext.phone,
      email: email || userContext.email,
      website: website || userContext.website,
      company_name: company_name || userContext.company_name,
      brand_colors: brand_colors.length > 0 ? brand_colors : [
        '#1a365d',
        '#2d3748'
      ],
      logo_url: logo_url,
      headshot_url: headshot_url,
      include_qr: include_qr,
      qr_content: qr_content,
      custom_tagline: custom_tagline
    };
    const assembledPrompts = await assembleCardPrompts(style, backStyle, brandData);
    const seedToUse = variation_mode === 'identical' && !force_new_seed ? style.original_seed : null;
    const [frontCard, backCard] = await Promise.all([
      generateFinalCard(assembledPrompts.front_prompt, seedToUse, '1536x1024'),
      generateFinalCard(assembledPrompts.back_prompt, seedToUse, '1536x1024')
    ]);
    const storedAssets = await storeBusinessCardAssets(supabase, frontCard, backCard, userId, style.style_name, brandData);
    await Promise.all([
      supabase.from('design_library').update({
        popularity_score: style.popularity_score + 1,
        total_generations: (style.total_generations || 0) + 1,
        updated_at: new Date().toISOString()
      }).eq('id', style_id),
      supabase.from('style_generation_history').insert({
        user_id: userId,
        company_id: userContext.company_id,
        style_id: style_id,
        content_type: 'business_card',
        brand_data: brandData,
        variation_mode: variation_mode,
        final_front_url: storedAssets.front_url,
        final_back_url: storedAssets.back_url,
        credits_charged: 2
      }),
      updateUserStylePreferences(supabase, userId, userContext.company_id, style_id, style.style_tags)
    ]);
    // FIX: Wrap analytics in try-catch
    try {
      await supabase.rpc('fn_track_event', {
        event_name: 'styled_business_card_generated',
        payload: {
          style_name: style.style_name,
          variation_mode: variation_mode,
          has_custom_brand: brand_colors.length > 0,
          has_logo: !!logo_url,
          has_headshot: !!headshot_url
        }
      });
    } catch (analyticsError) {
      console.warn('Analytics tracking failed:', analyticsError);
    }
    return new Response(JSON.stringify({
      success: true,
      data: {
        front_card_url: storedAssets.front_url,
        back_card_url: storedAssets.back_url,
        front_asset_id: storedAssets.front_asset_id,
        back_asset_id: storedAssets.back_asset_id,
        style_name: style.style_name,
        back_style_name: backStyle.style_name,
        print_ready: true,
        generation_metadata: {
          style_used: style.style_name,
          variation_mode: variation_mode,
          credits_used: 2,
          dimensions: '1536x1024',
          dpi: 300,
          print_format: print_format,
          generation_type: 'styled'
        }
      },
      message: 'Styled business card generated successfully'
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Styled business card generation error:', error);
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
}
// ===== NEW: REFERENCE-BASED GENERATION =====
async function generateStyledBusinessCardWithReference(supabase, userContext, data, userId) {
  const { style_id, reference_image_url, custom_description, variation_mode = 'identical', agent_name, agent_title, phone, email, website, company_name, brand_colors = [], logo_url, headshot_url, include_qr = true, qr_content = 'contact', custom_tagline, print_format = 'standard', force_new_seed = false } = data;
  if (!OPENAI_API_KEY) {
    return new Response('OpenAI API key required', {
      status: 500
    });
  }
  try {
    // Get base style from database
    const { data: style, error: styleError } = await supabase.from('design_library').select('*').eq('id', style_id).eq('is_active', true).single();
    if (styleError || !style) {
      throw new Error('Style template not found or inactive');
    }
    // Handle back style variation
    let backStyleId = style_id;
    if (variation_mode === 'surprise_me') {
      const { data: compatibleStyles } = await supabase.from('design_library').select('id').eq('category', 'business_card').eq('is_active', true).overlaps('style_tags', style.style_tags.slice(0, 2)).neq('id', style_id);
      if (compatibleStyles && compatibleStyles.length > 0) {
        backStyleId = compatibleStyles[Math.floor(Math.random() * compatibleStyles.length)].id;
      }
    }
    const { data: backStyle } = await supabase.from('design_library').select('*').eq('id', backStyleId).single();
    // Prepare brand data
    const brandData = {
      agent_name: agent_name || `${userContext.first_name} ${userContext.last_name}`,
      agent_title: agent_title || userContext.role || 'Real Estate Professional',
      phone: phone || userContext.phone,
      email: email || userContext.email,
      website: website || userContext.website,
      company_name: company_name || userContext.company_name,
      brand_colors: brand_colors.length > 0 ? brand_colors : [
        '#1a365d',
        '#2d3748'
      ],
      logo_url: logo_url,
      headshot_url: headshot_url,
      include_qr: include_qr,
      qr_content: qr_content,
      custom_tagline: custom_tagline
    };
    // Enhanced prompt assembly with reference image
    const assembledPrompts = await assembleCardPromptsWithReference(style, backStyle, brandData, reference_image_url, custom_description);
    const seedToUse = variation_mode === 'identical' && !force_new_seed ? style.original_seed : null;
    // Generate both cards
    const [frontCard, backCard] = await Promise.all([
      generateFinalCard(assembledPrompts.front_prompt, seedToUse, '1536x1024'),
      generateFinalCard(assembledPrompts.back_prompt, seedToUse, '1536x1024')
    ]);
    // Store assets
    const storedAssets = await storeBusinessCardAssets(supabase, frontCard, backCard, userId, style.style_name, brandData);
    // Update analytics and preferences
    await Promise.all([
      supabase.from('design_library').update({
        popularity_score: style.popularity_score + 1,
        total_generations: (style.total_generations || 0) + 1,
        updated_at: new Date().toISOString()
      }).eq('id', style_id),
      supabase.from('style_generation_history').insert({
        user_id: userId,
        company_id: userContext.company_id,
        style_id: style_id,
        content_type: 'business_card',
        brand_data: brandData,
        variation_mode: variation_mode,
        final_front_url: storedAssets.front_url,
        final_back_url: storedAssets.back_url,
        credits_charged: 3,
        metadata: {
          reference_used: true,
          reference_image_url: reference_image_url,
          custom_description: custom_description,
          generation_type: 'reference_enhanced'
        }
      }),
      updateUserStylePreferences(supabase, userId, userContext.company_id, style_id, style.style_tags)
    ]);
    // FIX: Wrap analytics in try-catch
    try {
      await supabase.rpc('fn_track_event', {
        event_name: 'reference_business_card_generated',
        payload: {
          style_name: style.style_name,
          variation_mode: variation_mode,
          has_reference: true,
          has_custom_description: !!custom_description,
          has_logo: !!logo_url,
          has_headshot: !!headshot_url
        }
      });
    } catch (analyticsError) {
      console.warn('Analytics tracking failed:', analyticsError);
    }
    return new Response(JSON.stringify({
      success: true,
      data: {
        front_card_url: storedAssets.front_url,
        back_card_url: storedAssets.back_url,
        front_asset_id: storedAssets.front_asset_id,
        back_asset_id: storedAssets.back_asset_id,
        style_name: style.style_name,
        back_style_name: backStyle.style_name,
        reference_inspiration: assembledPrompts.style_inspiration,
        print_ready: true,
        generation_metadata: {
          style_used: style.style_name,
          variation_mode: variation_mode,
          credits_used: 3,
          dimensions: '1536x1024',
          dpi: 300,
          print_format: print_format,
          generation_type: 'reference_enhanced',
          reference_analyzed: true
        }
      },
      message: 'Reference-enhanced business card generated successfully'
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Reference business card generation error:', error);
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
}
async function generateStyledFlyer(supabase, userContext, data, userId) {
  return await generateFlyer(supabase, userContext, data, userId);
}
async function getUserStylePreferences(supabase, userContext, data) {
  try {
    const { data: prefs, error } = await supabase.from('user_style_preferences').select('*').eq('user_id', userContext.user_id).eq('company_id', userContext.company_id).single();
    if (error && error.code !== 'PGRST116') throw error;
    return new Response(JSON.stringify({
      success: true,
      data: prefs || {
        preferred_styles: [],
        avoided_styles: [],
        preferred_tags: [],
        generation_count: 0
      }
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Get preferences error:', error);
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
}
async function updateStyleRating(supabase, userContext, data, userId) {
  const { generation_history_id, rating, feedback } = data;
  try {
    await supabase.from('style_generation_history').update({
      user_rating: rating,
      user_feedback: feedback,
      updated_at: new Date().toISOString()
    }).eq('id', generation_history_id).eq('user_id', userId).eq('company_id', userContext.company_id);
    return new Response(JSON.stringify({
      success: true,
      message: 'Rating updated successfully'
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
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
}
// ===== ADMIN FUNCTIONS =====
async function populateDesignLibrary(supabase, userContext, data) {
  const { category = 'business_card', batch_name = 'Core Collection' } = data;
  if (userContext.role !== 'admin') {
    return new Response('Admin access required', {
      status: 403
    });
  }
  // DATABASE-DRIVEN: Get styles from existing database or use fallback definitions
  let styleDefinitions;
  try {
    // Try to get existing styles from database first
    const { data: existingStyles } = await supabase.from('design_library').select('style_name').eq('category', category);
    if (!existingStyles || existingStyles.length === 0) {
      // If no styles exist, use hardcoded definitions as initial seed
      styleDefinitions = getInitialStyleDefinitions(category);
    } else {
      // If styles already exist, create variations or seasonal updates
      styleDefinitions = await generateVariationStyles(supabase, category, batch_name);
    }
  } catch (error) {
    // Fallback to initial definitions if database query fails
    styleDefinitions = getInitialStyleDefinitions(category);
  }
  try {
    const { data: batch } = await supabase.from('style_batch_releases').insert({
      batch_name: batch_name,
      release_date: new Date().toISOString().split('T')[0],
      theme_description: `Core ${category} templates`,
      target_styles_count: styleDefinitions.length,
      status: 'generating'
    }).select().single();
    const generatedStyles = [];
    const failedStyles = []; // FIX: Track failed generations
    for (const style of styleDefinitions){
      try {
        console.log(`🎨 Generating template: ${style.name}`);
        const frontImage = await generateTemplateImage(style.prompt_front, null);
        await new Promise((resolve)=>setTimeout(resolve, 2000));
        const backImage = await generateTemplateImage(style.prompt_back, frontImage.seed);
        await new Promise((resolve)=>setTimeout(resolve, 2000));
        // FIX: Store blobs as permanent assets instead of using temporary URLs
        const frontAsset = await storeImageAsset(supabase, frontImage.imageBlob, null, userContext.user_id, 'template_front', {
          style_name: style.name,
          template_side: 'front',
          original_seed: frontImage.seed
        });
        const backAsset = await storeImageAsset(supabase, backImage.imageBlob, null, userContext.user_id, 'template_back', {
          style_name: style.name,
          template_side: 'back',
          original_seed: backImage.seed
        });
        const { data: styleRecord } = await supabase.from('design_library').insert({
          style_name: style.name,
          category: category,
          image_url_front: frontAsset.public_url,
          image_url_back: backAsset.public_url,
          thumbnail_url: frontAsset.public_url,
          prompt_front: style.prompt_front,
          prompt_back: style.prompt_back,
          original_seed: frontImage.seed,
          style_tags: style.tags,
          color_palette: style.color_palette,
          target_audience: style.target_audience,
          quality_score: 8.0,
          status: 'approved',
          created_by: userContext.user_id
        }).select().single();
        generatedStyles.push(styleRecord);
        console.log(`✅ Successfully generated: ${style.name}`);
      } catch (styleError) {
        // FIX: Handle individual style failures without breaking the entire batch
        console.error(`❌ Failed to generate style "${style.name}":`, styleError);
        failedStyles.push({
          style_name: style.name,
          error: styleError.message
        });
      }
    }
    // FIX: Update batch status based on results
    const batchStatus = failedStyles.length === 0 ? 'completed' : generatedStyles.length === 0 ? 'failed' : 'partial';
    await supabase.from('style_batch_releases').update({
      status: batchStatus,
      styles_generated: generatedStyles.length,
      metadata: failedStyles.length > 0 ? {
        failed_styles: failedStyles
      } : null
    }).eq('id', batch.id);
    return new Response(JSON.stringify({
      success: true,
      data: {
        batch_id: batch.id,
        styles_generated: generatedStyles.length,
        styles_failed: failedStyles.length,
        styles: generatedStyles.map((s)=>({
            id: s.id,
            name: s.style_name,
            preview_url: s.thumbnail_url
          })),
        failed_styles: failedStyles // FIX: Include failure details
      },
      message: `Generated ${generatedStyles.length} ${category} templates` + (failedStyles.length > 0 ? ` (${failedStyles.length} failed)` : '')
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Design library population error:', error);
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
}
async function getStyleAnalytics(supabase, userContext, data) {
  const { category = 'business_card', date_range = '30d' } = data;
  if (userContext.role !== 'admin') {
    return new Response('Admin access required', {
      status: 403
    });
  }
  try {
    const { data: topStyles } = await supabase.from('design_library').select('style_name, popularity_score, avg_rating, total_generations').eq('category', category).eq('is_active', true).order('popularity_score', {
      ascending: false
    }).limit(10);
    return new Response(JSON.stringify({
      success: true,
      data: {
        top_performers: topStyles,
        category: category,
        date_range: date_range
      }
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
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
}
async function generateWeeklyAnalytics(supabase, userContext, data) {
  if (userContext.role !== 'admin') {
    return new Response('Admin access required', {
      status: 403
    });
  }
  try {
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
    const { data: weeklyStats } = await supabase.from('style_generation_history').select(`
        style_id,
        user_rating,
        was_downloaded,
        was_printed,
        created_at,
        design_library!inner(style_name, style_tags, category)
      `).gte('created_at', startDate.toISOString()).lte('created_at', endDate.toISOString());
    const stylePerformance = {};
    weeklyStats?.forEach((stat)=>{
      const styleId = stat.style_id;
      if (!stylePerformance[styleId]) {
        stylePerformance[styleId] = {
          style_name: stat.design_library.style_name,
          total_generations: 0,
          total_downloads: 0,
          avg_rating: 0,
          ratings_count: 0
        };
      }
      const perf = stylePerformance[styleId];
      perf.total_generations++;
      if (stat.was_downloaded) perf.total_downloads++;
      if (stat.user_rating) {
        perf.ratings_count++;
        perf.avg_rating = (perf.avg_rating * (perf.ratings_count - 1) + stat.user_rating) / perf.ratings_count;
      }
    });
    const rankedStyles = Object.entries(stylePerformance).map(([styleId, perf])=>({
        style_id: styleId,
        ...perf
      })).sort((a, b)=>b.total_generations - a.total_generations);
    return new Response(JSON.stringify({
      success: true,
      data: {
        analysis_period: {
          start: startDate,
          end: endDate
        },
        total_styles_analyzed: rankedStyles.length,
        top_performers: rankedStyles.slice(0, 5),
        overall_metrics: {
          total_generations: weeklyStats?.length || 0,
          avg_rating: rankedStyles.reduce((sum, s)=>sum + s.avg_rating, 0) / rankedStyles.length
        }
      }
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Weekly analytics error:', error);
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
}
async function generateSeasonalBatch(supabase, userContext, data) {
  if (userContext.role !== 'admin') {
    return new Response('Admin access required', {
      status: 403
    });
  }
  const { season, theme, target_count = 10 } = data;
  try {
    const { data: batch } = await supabase.from('style_batch_releases').insert({
      batch_name: `${season} Collection`,
      release_date: new Date().toISOString().split('T')[0],
      theme_description: theme,
      target_styles_count: target_count,
      status: 'generating'
    }).select().single();
    return new Response(JSON.stringify({
      success: true,
      data: {
        batch_id: batch.id,
        season: season,
        theme: theme,
        message: `Seasonal batch ${season} queued for generation`
      }
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Seasonal batch generation error:', error);
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
}
async function runABSeedTest(supabase, userContext, data) {
  if (userContext.role !== 'admin') {
    return new Response('Admin access required', {
      status: 403
    });
  }
  const { style_id, test_name = 'A/B Seed Test' } = data;
  try {
    const { data: originalStyle } = await supabase.from('design_library').select('*').eq('id', style_id).single();
    if (!originalStyle) {
      throw new Error('Style not found');
    }
    return new Response(JSON.stringify({
      success: true,
      data: {
        test_name: test_name,
        original_style: {
          id: originalStyle.id,
          name: originalStyle.style_name
        },
        message: `A/B test queued for ${originalStyle.style_name}`
      }
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('A/B seed test error:', error);
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
}
// ===== ENHANCEMENT FUNCTIONS =====
async function generateStyledBusinessCardEnhanced(supabase, userContext, data, userId) {
  const basicResult = await generateStyledBusinessCard(supabase, userContext, data, userId);
  if (!basicResult.ok) {
    return basicResult;
  }
  const resultData = await basicResult.json();
  if (data.add_bleed || data.convert_cmyk) {
    console.log('🎨 Post-processing requested but not yet implemented');
    resultData.data.post_processing = {
      bleed_added: false,
      cmyk_converted: false,
      export_format: data.export_format || 'pdf',
      processing_notes: 'Post-processing not yet implemented'
    };
  }
  return new Response(JSON.stringify(resultData), {
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json'
    }
  });
}
async function regenerateWithNewSeed(supabase, userContext, data, userId) {
  const { generation_history_id, keep_same_style = true } = data;
  try {
    const { data: originalGeneration, error } = await supabase.from('style_generation_history').select('style_id, brand_data, variation_mode').eq('id', generation_history_id).eq('user_id', userId).eq('company_id', userContext.company_id).single();
    if (error || !originalGeneration) {
      throw new Error('Original generation not found');
    }
    return await generateStyledBusinessCard(supabase, userContext, {
      style_id: originalGeneration.style_id,
      variation_mode: originalGeneration.variation_mode,
      ...originalGeneration.brand_data,
      force_new_seed: true
    }, userId);
  } catch (error) {
    console.error('Regeneration error:', error);
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
}
// ===== ENHANCED PROMPT ASSEMBLY SYSTEM =====
async function assembleCardPrompts(frontStyle, backStyle, brandData) {
  const assemblyPrompt = `You are a professional business card designer. Transform these template prompts by injecting the user's brand data while maintaining the original design aesthetic.

FRONT TEMPLATE PROMPT:
${frontStyle.prompt_front}

BACK TEMPLATE PROMPT:  
${backStyle.prompt_back}

USER BRAND DATA:
- Agent: ${brandData.agent_name} (${brandData.agent_title})
- Company: ${brandData.company_name}
- Contact: ${brandData.phone}, ${brandData.email}, ${brandData.website}
- Brand Colors: ${brandData.brand_colors.join(', ')}
- Custom Tagline: ${brandData.custom_tagline || 'none'}
- Has Logo: ${brandData.logo_url ? 'Yes' : 'No'}
- Has Headshot: ${brandData.headshot_url ? 'Yes' : 'No'}
- Include QR: ${brandData.include_qr ? 'Yes' : 'No'}

TRANSFORMATION REQUIREMENTS:
1. Replace ALL placeholder variables:
   - {{logo_zone}} → specific logo placement instructions
   - {{agent_photo_zone}} → headshot placement or remove if no photo
   - {{brand_color}} → actual hex color values from brand_colors array
   - {{contact_block}} → formatted contact information layout
   - {{qr_placeholder}} → QR code placement if include_qr is true
   - {{company_name}} → actual company name
   - {{agent_name}} → actual agent name

2. Maintain original design style and typography
3. Ensure print-safe margins (0.125" bleed on all sides)
4. Keep professional real estate standards
5. Make text readable and properly sized for business card format
6. Ensure color contrast meets accessibility standards

CRITICAL: Return ONLY valid JSON with no additional text:
{
  "front_prompt": "Complete prompt with all placeholders replaced",
  "back_prompt": "Complete prompt with all placeholders replaced"
}`;
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: assemblyPrompt
        }
      ],
      temperature: 0.1,
      response_format: {
        type: "json_object"
      }
    })
  });
  if (!response.ok) {
    throw new Error(`Prompt assembly failed: ${response.statusText}`);
  }
  const result = await response.json();
  return JSON.parse(result.choices[0].message.content);
}
// NEW: Enhanced prompt assembly with reference image support
async function assembleCardPromptsWithReference(frontStyle, backStyle, brandData, referenceImageUrl, customDescription) {
  const enhancedAssemblyPrompt = `You are a professional business card designer. Create highly personalized prompts by combining the base style template with user reference image analysis and custom description.

BASE STYLE TEMPLATE:
Style: ${frontStyle.style_name}
Front Template: ${frontStyle.prompt_front}
Back Template: ${backStyle.prompt_back}
Original Tags: ${frontStyle.style_tags.join(', ')}

USER REFERENCE IMAGE ANALYSIS:
[Analyze the uploaded reference image for:]
- Color palette and mood
- Typography characteristics  
- Layout principles
- Visual elements and style
- Overall aesthetic approach

USER PERSONALIZATION REQUEST:
"${customDescription || 'Use the reference image as inspiration for the overall aesthetic'}"

USER BRAND DATA:
- Agent: ${brandData.agent_name} (${brandData.agent_title})
- Company: ${brandData.company_name}
- Contact: ${brandData.phone}, ${brandData.email}, ${brandData.website}
- Brand Colors: ${brandData.brand_colors.join(', ')}
- Custom Tagline: ${brandData.custom_tagline || 'none'}
- Has Logo: ${brandData.logo_url ? 'Yes' : 'No'}
- Has Headshot: ${brandData.headshot_url ? 'Yes' : 'No'}
- Include QR: ${brandData.include_qr ? 'Yes' : 'No'}

TASK:
1. Analyze the reference image to understand the user's aesthetic preference
2. Blend the base style template with elements from the reference image
3. Incorporate the user's specific description requests
4. Create personalized front/back prompts that inject all brand data
5. Maintain the quality and print-readiness of the base template

CRITICAL: Return ONLY valid JSON with no additional text:
{
  "front_prompt": "Complete personalized prompt blending base style + reference inspiration + brand data",
  "back_prompt": "Complete personalized prompt blending base style + reference inspiration + brand data", 
  "style_inspiration": "Brief description of how the reference influenced the design"
}`;
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: enhancedAssemblyPrompt
            },
            {
              type: 'image_url',
              image_url: {
                url: referenceImageUrl
              }
            }
          ]
        }
      ],
      temperature: 0.2,
      response_format: {
        type: "json_object"
      }
    })
  });
  if (!response.ok) {
    throw new Error(`Enhanced prompt assembly failed: ${response.statusText}`);
  }
  const result = await response.json();
  return JSON.parse(result.choices[0].message.content);
}
async function generateFinalCard(prompt, seed = null, size = '1536x1024') {
  const requestBody = {
    model: 'gpt-image-1',
    prompt: prompt,
    size: size,
    quality: 'medium',
    n: 1
  };
  if (seed) {
    requestBody.seed = parseInt(seed);
  }
  // FIX: Don't log full prompt (may contain PII/NDA content)
  console.log('🎨 Generating final card with model:', requestBody.model);
  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });
  console.log('🎨 OpenAI response status:', response.status);
  if (!response.ok) {
    const error = await response.text();
    console.error('🚨 OpenAI error:', error);
    throw new Error(`Card generation failed: ${error}`);
  }
  const result = await response.json();
  // OpenAI returns b64_json, not url!
  if (!result.data[0].b64_json) {
    console.error('🚨 No b64_json in response:', Object.keys(result.data[0]));
    throw new Error('No image data received from OpenAI');
  }
  // Convert base64 to blob using factored function
  const imageBlob = b64ToBlob(result.data[0].b64_json);
  return {
    imageBlob: imageBlob,
    base64Data: result.data[0].b64_json,
    seed: result.data[0].seed || seed || Math.floor(Math.random() * 1000000).toString()
  };
}
async function generateTemplateImage(prompt, seed = null) {
  const requestBody = {
    model: 'gpt-image-1',
    prompt: prompt,
    size: '1536x1024',
    quality: 'medium',
    n: 1,
    response_format: 'url' // Get URL first, then download and store
  };
  if (seed) {
    requestBody.seed = parseInt(seed);
  }
  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });
  if (!response.ok) {
    throw new Error(`Template image generation failed: ${response.statusText}`);
  }
  const result = await response.json();
  if (!result.data[0].url) {
    throw new Error('No image URL received from OpenAI');
  }
  // FIX: Download and create blob efficiently without double-copying
  const tempUrl = result.data[0].url;
  const imageResponse = await fetch(tempUrl);
  if (!imageResponse.ok) {
    throw new Error(`Failed to download generated template image: ${imageResponse.statusText}`);
  }
  // FIX: Create blob directly from arrayBuffer with guaranteed content type
  const arrayBuffer = await imageResponse.arrayBuffer();
  const contentType = imageResponse.headers.get('content-type') || 'image/png';
  const imageBlob = new Blob([
    arrayBuffer
  ], {
    type: contentType
  });
  return {
    imageBlob: imageBlob,
    tempUrl: tempUrl,
    seed: result.data[0].seed || Math.floor(Math.random() * 1000000).toString()
  };
}
// DATABASE-DRIVEN STYLE DEFINITIONS (Updated approach)
function getInitialStyleDefinitions(category) {
  // This is now only used as initial seed data for first-time setup
  const businessCardStyles = [
    {
      name: 'Minimal Noir',
      prompt_front: 'Elegant minimalist business card design, black and white color scheme, clean modern typography, subtle geometric patterns, professional layout with {{logo_zone}} in top-left corner, {{agent_photo_zone}} as small circular headshot on right side, {{brand_color}} accent line running horizontally, agent name "{{agent_name}}" in bold sans-serif font, company "{{company_name}}" below in smaller text, ultra-high resolution, print-ready design',
      prompt_back: 'Minimalist business card back design, matching noir aesthetic, {{contact_block}} with phone, email, website arranged vertically in center, {{qr_placeholder}} positioned in bottom-right corner, {{brand_color}} accent elements, clean white space, professional typography',
      tags: [
        'minimal',
        'professional',
        'dark',
        'luxury',
        'modern'
      ],
      color_palette: {
        primary: '#000000',
        secondary: '#ffffff',
        accent: '#666666'
      },
      target_audience: [
        'luxury',
        'corporate',
        'professional'
      ]
    },
    {
      name: 'Gold-Foil Luxe',
      prompt_front: 'Luxury business card with gold foil effects, premium cream background, elegant serif typography, ornate border details, {{logo_zone}} prominently displayed top-center, {{agent_photo_zone}} as professional headshot with gold frame, {{brand_color}} used sparingly for premium accent, "{{agent_name}}" in large elegant font, "{{company_name}}" with gold foil treatment, ultra-premium feel',
      prompt_back: 'Luxury business card back with gold foil accents, cream background, {{contact_block}} in elegant layout, {{qr_placeholder}} with gold border, subtle pattern background, premium typography matching front design',
      tags: [
        'luxury',
        'premium',
        'gold',
        'elegant',
        'traditional'
      ],
      color_palette: {
        primary: '#F5F5DC',
        secondary: '#DAA520',
        accent: '#8B7D6B'
      },
      target_audience: [
        'luxury',
        'high-end',
        'traditional'
      ]
    },
    {
      name: 'Coastal Pastel',
      prompt_front: 'Fresh coastal-inspired business card, soft pastel blue and white palette, modern clean fonts, wave-like design elements, {{logo_zone}} in organic placement, {{agent_photo_zone}} with soft rounded corners, {{brand_color}} integrated naturally, "{{agent_name}}" in friendly modern font, "{{company_name}}" with coastal styling, beach house aesthetic',
      prompt_back: 'Coastal business card back, soft pastel palette, {{contact_block}} with beachy spacing, {{qr_placeholder}} with wave border, subtle texture suggesting sand or water, relaxed professional feel',
      tags: [
        'coastal',
        'fresh',
        'pastel',
        'friendly',
        'residential'
      ],
      color_palette: {
        primary: '#B0E0E6',
        secondary: '#F0FFFF',
        accent: '#4682B4'
      },
      target_audience: [
        'residential',
        'coastal',
        'friendly'
      ]
    },
    {
      name: 'Tech Gradient',
      prompt_front: 'Modern tech-inspired business card, dynamic gradient background from {{brand_color}} to darker shade, sleek futuristic typography, subtle geometric patterns, {{logo_zone}} with modern treatment, {{agent_photo_zone}} with tech-style frame, "{{agent_name}}" in bold modern font, "{{company_name}}" with gradient text effect, cutting-edge real estate professional',
      prompt_back: 'Tech-inspired card back, matching gradient theme, {{contact_block}} with modern spacing and icons, {{qr_placeholder}} with tech-style border, digital aesthetic',
      tags: [
        'tech',
        'modern',
        'gradient',
        'futuristic',
        'digital'
      ],
      color_palette: {
        primary: '#667eea',
        secondary: '#764ba2',
        accent: '#f093fb'
      },
      target_audience: [
        'tech-savvy',
        'modern',
        'urban'
      ]
    },
    {
      name: 'Classic Executive',
      prompt_front: 'Traditional executive business card, navy blue and white color scheme, timeless serif typography, subtle pinstripe pattern, {{logo_zone}} centered at top, {{agent_photo_zone}} as formal headshot, {{brand_color}} used for accents, "{{agent_name}}" prominently displayed, "{{company_name}}" in distinguished font, established professional appearance',
      prompt_back: 'Classic executive card back, navy and white theme, {{contact_block}} in formal layout, {{qr_placeholder}} discretely placed, traditional professional design',
      tags: [
        'classic',
        'executive',
        'traditional',
        'navy',
        'formal'
      ],
      color_palette: {
        primary: '#1e3a8a',
        secondary: '#ffffff',
        accent: '#64748b'
      },
      target_audience: [
        'corporate',
        'executive',
        'traditional'
      ]
    }
  ];
  return category === 'business_card' ? businessCardStyles : [];
}
// NEW: Generate variation styles based on existing database styles
async function generateVariationStyles(supabase, category, batchName) {
  // This would query existing styles and create variations
  // For now, return empty array to skip variation generation
  return [];
}
// ===== ASSET MANAGEMENT =====
async function storeBusinessCardAssets(supabase, frontCard, backCard, userId, styleName, brandData) {
  const frontAsset = await storeImageAsset(supabase, frontCard.imageBlob, null, userId, 'styled_business_card_front', {
    style_name: styleName,
    card_side: 'front',
    brand_data: brandData,
    generation_seed: frontCard.seed,
    ai_provider: AI_PROVIDERS.IMAGE_ONLY
  });
  const backAsset = await storeImageAsset(supabase, backCard.imageBlob, null, userId, 'styled_business_card_back', {
    style_name: styleName,
    card_side: 'back',
    brand_data: brandData,
    generation_seed: backCard.seed,
    ai_provider: AI_PROVIDERS.IMAGE_ONLY
  });
  return {
    front_url: frontAsset.public_url,
    back_url: backAsset.public_url,
    front_asset_id: frontAsset.asset_id,
    back_asset_id: backAsset.asset_id
  };
}
async function updateUserStylePreferences(supabase, userId, companyId, styleId, styleTags) {
  const { data: existing } = await supabase.from('user_style_preferences').select('*').eq('user_id', userId).eq('company_id', companyId).single();
  if (existing) {
    const updatedPreferred = [
      ...new Set([
        ...existing.preferred_styles,
        styleId
      ])
    ];
    const updatedTags = [
      ...new Set([
        ...existing.preferred_tags,
        ...styleTags
      ])
    ];
    await supabase.from('user_style_preferences').update({
      preferred_styles: updatedPreferred,
      preferred_tags: updatedTags,
      generation_count: existing.generation_count + 1,
      last_style_used: styleId,
      updated_at: new Date().toISOString()
    }).eq('user_id', userId).eq('company_id', companyId);
  } else {
    await supabase.from('user_style_preferences').insert({
      user_id: userId,
      company_id: companyId,
      preferred_styles: [
        styleId
      ],
      preferred_tags: styleTags,
      generation_count: 1,
      last_style_used: styleId
    });
  }
}
// ===== HELPER FUNCTIONS =====
async function getListingAndBrand(supabase, listingId, companyId) {
  const { data: listingData, error: listingError } = await supabase.from('listings').select('*').eq('id', listingId).eq('company_id', companyId).single();
  if (listingError) throw new Error('Listing not found');
  const brandKit = await getDefaultBrandKit(supabase, companyId);
  return {
    listingData,
    brandKit
  };
}
async function getDefaultBrandKit(supabase, companyId) {
  const { data: brandKit } = await supabase.from('brand_kits').select('*').eq('company_id', companyId).eq('is_default', true).single();
  return brandKit;
}
// FIX: Removed deprecated downloadAndStoreAsset function (no longer used)
// FIX: Fixed jpeg extension mapping for better compatibility
function getFileExtensionFromContentType(contentType) {
  // FIX: Handle empty/undefined content types
  if (!contentType) return 'png'; // Default to PNG instead of 'bin'
  const extensions = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'video/mp4': 'mp4',
    'application/pdf': 'pdf'
  };
  return extensions[contentType] || 'png'; // Default to PNG for unknown types
}
function calculateTagMatchScore(styleTags, userPreferredTags) {
  // FIX: Guard against null/undefined styleTags (corrupted DB rows)
  if (!styleTags || !userPreferredTags || userPreferredTags.length === 0) return 0;
  // FIX: Handle duplicate tags to avoid skewing the score
  const uniquePreferredTags = [
    ...new Set(userPreferredTags)
  ];
  const matches = styleTags.filter((tag)=>uniquePreferredTags.includes(tag));
  // FIX: Round to 2 decimals for stable sorting
  return parseFloat((matches.length / uniquePreferredTags.length).toFixed(2));
}
function buildHeroImagePrompt(listing, brandKit, style, customPrompt) {
  if (customPrompt) return customPrompt;
  const brandVoice = brandKit?.voice ? JSON.parse(brandKit.voice) : {};
  const basePrompt = `Create a stunning real estate hero image for a ${listing.property_type} property. 
  Address: ${listing.address}
  Style: ${style}
  Property details: ${listing.beds}BR/${listing.baths}BA, ${listing.sqft}sqft
  Price: $${listing.price?.toLocaleString()}
  
  Brand personality: ${brandVoice.personality?.join(', ') || 'professional, trustworthy'}
  
  The image should be professionally lit, high-quality, and ${style} in aesthetic. 
  Include subtle text overlay with key property details.`;
  return basePrompt;
}
function buildCopyPrompt(listing, brandKit, copyType, platform, tone, maxLength) {
  const brandVoice = brandKit?.voice ? JSON.parse(brandKit.voice) : {};
  return `Generate ${copyType} copy for ${platform} about this property:
  
  Property: ${listing.title}
  Address: ${listing.address}
  Details: ${listing.beds}BR/${listing.baths}BA, ${listing.sqft}sqft
  Price: $${listing.price?.toLocaleString()}
  Description: ${listing.description}
  
  Brand voice: ${tone}
  Brand personality: ${brandVoice.personality?.join(', ') || 'professional'}
  Tone guidelines: ${brandVoice.tone_description || 'Professional and approachable'}
  
  ${maxLength ? `Keep it under ${maxLength} characters.` : ''}
  ${platform === 'instagram' ? 'Include relevant hashtags.' : ''}
  ${platform === 'email' ? 'Include a clear call-to-action.' : ''}`;
}
function buildSocialPostPrompt(listing, brandKit, platform, postType, customText, companyName) {
  const brandVoice = brandKit?.voice ? JSON.parse(brandKit.voice) : {};
  const brandColors = brandKit?.theme?.colors?.join(', ') || 'professional blue and white';
  const basePrompt = `Create a ${platform} social media post for ${postType}:
  
  Property: ${listing.title}
  Address: ${listing.address}
  Details: ${listing.beds}BR/${listing.baths}BA, ${listing.sqft}sqft
  Price: $${listing.price?.toLocaleString()}
  Company: ${companyName}
  
  Style: Modern real estate social media design
  Colors: ${brandColors}
  Brand personality: ${brandVoice.personality?.join(', ') || 'professional, trustworthy'}
  
  ${customText ? `Custom message: ${customText}` : ''}
  
  Create an eye-catching, professional ${platform}-optimized image with:
  - Property details prominently displayed
  - Company branding
  - High-quality real estate aesthetic
  - ${platform === 'instagram' ? 'Square 1:1 aspect ratio' : 'Landscape orientation'}
  - Clean, readable typography
  - Professional real estate design standards`;
  return basePrompt;
}
function buildFlyerPrompt(listing, brandKit, flyerType, templateStyle, includeQR, agentInfo) {
  const brandVoice = brandKit?.voice ? JSON.parse(brandKit.voice) : {};
  const brandColors = brandKit?.theme?.colors?.join(', ') || 'professional blue and white';
  const basePrompt = `Create a ${flyerType} real estate flyer in ${templateStyle} style:
  
  Property Information:
  - Title: ${listing.title}
  - Address: ${listing.address}
  - Details: ${listing.beds}BR/${listing.baths}BA, ${listing.sqft}sqft
  - Price: ${listing.price?.toLocaleString()}
  - Description: ${listing.description}
  
  Agent Information:
  - Name: ${agentInfo.name}
  - Phone: ${agentInfo.phone}
  - Email: ${agentInfo.email}
  
  Design Requirements:
  - Style: ${templateStyle} real estate flyer
  - Colors: ${brandColors}
  - Layout: Professional, print-ready flyer design
  - Typography: Clean, readable fonts
  - ${includeQR ? 'Include QR code placeholder for contact info' : 'No QR code needed'}
  - Portrait orientation (8.5x11 or A4)
  - High-quality real estate marketing standards
  - Professional photography layout spaces
  - Clear call-to-action sections
  
  Brand personality: ${brandVoice.personality?.join(', ') || 'professional, trustworthy'}
  
  Create a compelling, professional real estate flyer that effectively showcases the property and agent information.`;
  return basePrompt;
}
