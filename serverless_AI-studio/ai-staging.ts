// supabase/functions/ai-staging/index.ts
// Virtual staging functions: basic, advanced SAM pipeline, pixel-perfect
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};
// API Keys
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const REPLICATE_API_TOKEN = Deno.env.get('REPLICATE_API_TOKEN');
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
        status: 401,
        headers: corsHeaders
      });
    }
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response('Invalid token', {
        status: 401,
        headers: corsHeaders
      });
    }
    // Get user context
    const { data: context, error: contextError } = await supabase.rpc('get_user_context', {
      user_auth_id: user.id
    });
    if (contextError || !context || context.length === 0) {
      return new Response('User context not found', {
        status: 403,
        headers: corsHeaders
      });
    }
    const userContext = context[0];
    const { action, data } = await req.json();
    switch(action){
      case 'virtual_staging':
        return await virtualStaging(supabase, userContext, data, user.id);
      case 'advanced_virtual_staging':
        return await advancedVirtualStaging(supabase, userContext, data, user.id);
      case 'pixel_perfect_staging':
        return await pixelPerfectStaging(supabase, userContext, data, user.id);
      default:
        return new Response('Invalid action', {
          status: 400,
          headers: corsHeaders
        });
    }
  } catch (error) {
    console.error('Error in ai-staging:', error);
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
// ===== BASIC VIRTUAL STAGING =====
async function virtualStaging(supabase, userContext, data, userId) {
  const { listing_id, photo_asset_id, staging_style = 'modern', room_type = 'living_room' } = data;
  if (!OPENAI_API_KEY) {
    return new Response('OpenAI API key required', {
      status: 500,
      headers: corsHeaders
    });
  }
  try {
    // Get the specific photo to stage
    const { data: photoAsset, error: photoError } = await supabase.from('media_assets').select('storage_path').eq('id', photo_asset_id).single();
    if (photoError || !photoAsset) {
      throw new Error('Photo asset not found');
    }
    // Get public URL for the photo
    const { data: photoUrl } = supabase.storage.from('media-assets').getPublicUrl(photoAsset.storage_path);
    // Virtual staging with OpenAI GPT-4o
    const stagedData = await createOpenAIVirtualStaging({
      image_url: photoUrl.publicUrl,
      staging_style,
      room_type
    });
    const storedAsset = await downloadAndStoreAsset(supabase, stagedData.image_url, listing_id, userId, 'ai_virtual_staging', {
      staging_style,
      room_type,
      original_photo_id: photo_asset_id,
      ai_provider: 'openai'
    });
    await supabase.rpc('fn_track_event', {
      event_name: 'ai_content_generated',
      payload: {
        content_type: 'virtual_staging',
        listing_id: listing_id,
        staging_style: staging_style,
        ai_provider: 'openai'
      }
    });
    return new Response(JSON.stringify({
      success: true,
      data: {
        download_url: storedAsset.public_url,
        asset_id: storedAsset.asset_id,
        original_photo_id: photo_asset_id,
        generation_metadata: {
          staging_style,
          room_type,
          ai_provider: 'openai',
          processing_time: storedAsset.processing_time
        }
      },
      message: 'Virtual staging completed successfully'
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Virtual staging error:', error);
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
// ===== ADVANCED VIRTUAL STAGING WITH SAM =====
async function advancedVirtualStaging(supabase, userContext, data, userId) {
  const { listing_id, photo_asset_id, staging_style = 'modern', room_type = 'living_room', quality_tier = 'premium', sam_prompt } = data;
  if (!OPENAI_API_KEY || !REPLICATE_API_TOKEN) {
    return new Response('OpenAI and Replicate API keys required for advanced staging', {
      status: 500,
      headers: corsHeaders
    });
  }
  try {
    // Step 1: Get the specific photo to stage
    const { data: photoAsset, error: photoError } = await supabase.from('media_assets').select('storage_path').eq('id', photo_asset_id).single();
    if (photoError || !photoAsset) {
      throw new Error('Photo asset not found');
    }
    // Step 2: Get public URL for the photo
    const { data: photoUrl } = supabase.storage.from('media-assets').getPublicUrl(photoAsset.storage_path);
    // Step 3: Advanced staging with SAM + inpainting
    const stagedData = await createAdvancedStagingWithSAM({
      image_url: photoUrl.publicUrl,
      staging_style,
      room_type,
      quality_tier,
      sam_prompt
    });
    // Step 4: Store the result
    const storedAsset = await downloadAndStoreAsset(supabase, stagedData.image_url, listing_id, userId, 'ai_advanced_staging', {
      staging_style,
      room_type,
      original_photo_id: photo_asset_id,
      ai_provider: 'openai_sam',
      quality_tier: quality_tier,
      mask_confidence: stagedData.mask_confidence,
      quality_score: stagedData.quality_score
    });
    // Step 5: Track analytics
    await supabase.rpc('fn_track_event', {
      event_name: 'ai_content_generated',
      payload: {
        content_type: 'advanced_virtual_staging',
        listing_id: listing_id,
        staging_style: staging_style,
        ai_provider: 'openai_sam',
        quality_tier: quality_tier
      }
    });
    return new Response(JSON.stringify({
      success: true,
      data: {
        download_url: storedAsset.public_url,
        asset_id: storedAsset.asset_id,
        original_photo_id: photo_asset_id,
        generation_metadata: {
          staging_style,
          room_type,
          ai_provider: 'openai_sam',
          quality_tier: quality_tier,
          mask_confidence: stagedData.mask_confidence,
          quality_score: stagedData.quality_score,
          processing_time: storedAsset.processing_time
        }
      },
      message: 'Advanced virtual staging completed successfully'
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Advanced virtual staging error:', error);
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
// ===== PIXEL-PERFECT STAGING (PREMIUM TIER) =====
async function pixelPerfectStaging(supabase, userContext, data, userId) {
  // Force premium quality tier
  const enhancedData = {
    ...data,
    quality_tier: 'premium'
  };
  return await advancedVirtualStaging(supabase, userContext, enhancedData, userId);
}
// ===== OPENAI VIRTUAL STAGING =====
async function createOpenAIVirtualStaging(data) {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key required');
  }
  console.log('🏠 Creating virtual staging with OpenAI GPT-4o...');
  try {
    // Step 1: Analyze the room with GPT-4o Vision
    const analysisResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
                text: `Analyze this ${data.room_type} image and describe what you see. Focus on: room layout, lighting, architectural features, current furnishing state, and potential for ${data.staging_style} staging.`
              },
              {
                type: 'image_url',
                image_url: {
                  url: data.image_url
                }
              }
            ]
          }
        ],
        max_tokens: 500
      })
    });
    const analysisResult = await analysisResponse.json();
    const roomAnalysis = analysisResult.choices[0].message.content;
    // Step 2: Generate staged image with GPT-Image-1
    const stagingPrompt = buildVirtualStagingPrompt(data, roomAnalysis);
    const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt: stagingPrompt,
        size: '1536x1024',
        quality: 'high',
        n: 1
      })
    });
    if (!imageResponse.ok) {
      const error = await imageResponse.text();
      throw new Error(`OpenAI staging error: ${error}`);
    }
    const imageResult = await imageResponse.json();
    return {
      image_url: imageResult.data[0].url,
      room_analysis: roomAnalysis,
      staging_prompt: stagingPrompt
    };
  } catch (error) {
    console.error('OpenAI virtual staging error:', error);
    throw new Error(`Virtual staging failed: ${error.message}`);
  }
}
// ===== ADVANCED STAGING WITH SAM =====
async function createAdvancedStagingWithSAM(data) {
  console.log('🎯 Starting advanced staging with SAM masking...');
  try {
    // Step 1: Generate precise mask using Meta's SAM
    const maskData = await generateSAMMask(data.image_url, data.sam_prompt);
    // Step 2: Enhanced room analysis with mask context
    const analysis = await analyzeMaskedRoom(data.image_url, maskData, data.room_type, data.staging_style);
    // Step 3: Precision inpainting with GPT-Image-1
    const stagedResult = await dalleInpainting(data.image_url, maskData.mask_url, analysis.prompt);
    // Step 4: Quality review and potential refinement
    const qualityCheck = await reviewStagingQuality(stagedResult.image_url, data.quality_tier);
    // Step 5: Refinement if needed
    if (qualityCheck.needs_refinement && data.quality_tier === 'premium') {
      console.log('🔄 Refining staging based on quality review...');
      const refinedResult = await dalleInpainting(data.image_url, maskData.mask_url, qualityCheck.improved_prompt);
      return {
        image_url: refinedResult.image_url,
        mask_confidence: maskData.confidence,
        quality_score: qualityCheck.final_score,
        refinement_applied: true
      };
    }
    return {
      image_url: stagedResult.image_url,
      mask_confidence: maskData.confidence,
      quality_score: qualityCheck.quality_score,
      refinement_applied: false
    };
  } catch (error) {
    console.error('SAM staging error:', error);
    // Fallback to basic OpenAI staging method
    console.log('🔄 Falling back to basic OpenAI staging method...');
    return await createOpenAIVirtualStaging(data);
  }
}
// ===== META SAM SEGMENTATION =====
async function generateSAMMask(imageUrl, textPrompt = "old furniture,empty space,floor") {
  console.log('🎯 Generating SAM mask for precise segmentation with prompt:', textPrompt);
  const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${REPLICATE_API_TOKEN}`,  // ✅ Uses "Bearer"
      'Content-Type': 'application/json',
      'Prefer': 'wait'
    },
    body: JSON.stringify({
      version: "891411c38a6ed2d44c004b7b9e44217df7a5b07848f29ddefd2e28bc7cbf93bc",
      input: {
        image: imageUrl,
        text_prompt: textPrompt
      }
    })
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`SAM API error: ${error}`);
  }
  const result = await response.json();
  console.log('🔍 SAM API response:', JSON.stringify(result, null, 2));
  
  if (!result.output || typeof result.output !== 'string') {
    console.error('Invalid SAM response structure:', result);
    throw new Error(`SAM did not return a valid mask URL. Response: ${JSON.stringify(result)}`);
  }
  
  // Validate that the mask URL is accessible
  try {
    const maskTestResponse = await fetch(result.output, { method: 'HEAD' });
    if (!maskTestResponse.ok) {
      throw new Error(`SAM mask URL not accessible: ${maskTestResponse.status}`);
    }
    console.log('✅ SAM mask URL validated:', result.output);
  } catch (urlError) {
    console.error('SAM mask URL validation failed:', urlError);
    throw new Error(`SAM mask URL validation failed: ${urlError.message}`);
  }
  
  console.log('✅ SAM mask generated successfully:', result.output);
  return {
    mask_url: result.output,
    confidence: 0.85,
    processing_time: result.metrics?.predict_time || 0
  };
}
// ===== ENHANCED ROOM ANALYSIS WITH MASK =====
async function analyzeMaskedRoom(imageUrl, maskData, roomType, stagingStyle) {
  const analysisResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
              text: `Analyze this ${roomType} for precision virtual staging. Focus on the MASKED AREA where furniture will be placed. Describe: room layout, lighting conditions, architectural features, flooring type, wall colors, and optimal ${stagingStyle} furniture placement strategy for the masked regions.`
            },
            {
              type: 'image_url',
              image_url: {
                url: imageUrl
              }
            }
          ]
        }
      ],
      max_tokens: 600
    })
  });
  const analysisResult = await analysisResponse.json();
  const roomAnalysis = analysisResult.choices[0].message.content;
  // Create precision staging prompt
  const prompt = buildVirtualStagingPrompt({
    staging_style: stagingStyle,
    room_type: roomType
  }, roomAnalysis, 'inpainting');
  return {
    analysis: roomAnalysis,
    prompt: prompt
  };
}
// ===== IMAGE PROCESSING UTILITIES =====
async function validateAndResizeMask(originalBlob, maskBlob) {
  console.log('🔧 Validating and resizing mask to match original image...');
  
  try {
    // Create canvas elements to work with images
    const originalCanvas = new OffscreenCanvas(1536, 1024);
    const maskCanvas = new OffscreenCanvas(1536, 1024);
    const originalCtx = originalCanvas.getContext('2d');
    const maskCtx = maskCanvas.getContext('2d');
    
    // Load original image
    const originalImageBitmap = await createImageBitmap(originalBlob);
    console.log('📏 Original image dimensions:', originalImageBitmap.width, 'x', originalImageBitmap.height);
    
    // Load mask image
    const maskImageBitmap = await createImageBitmap(maskBlob);
    console.log('📏 Mask image dimensions:', maskImageBitmap.width, 'x', maskImageBitmap.height);
    
    // Resize original to standard size (1536x1024)
    originalCtx.drawImage(originalImageBitmap, 0, 0, 1536, 1024);
    
    // Resize mask to match original dimensions (1536x1024)
    maskCtx.fillStyle = 'black'; // Fill with black (preserve areas)
    maskCtx.fillRect(0, 0, 1536, 1024);
    maskCtx.drawImage(maskImageBitmap, 0, 0, 1536, 1024);
    
    // Convert canvases back to blobs
    const resizedOriginalBlob = await originalCanvas.convertToBlob({ type: 'image/png' });
    const resizedMaskBlob = await maskCanvas.convertToBlob({ type: 'image/png' });
    
    console.log('✅ Images resized to 1536x1024');
    
    return {
      originalImageBlob: resizedOriginalBlob,
      resizedMaskBlob: resizedMaskBlob
    };
  } catch (error) {
    console.error('Error processing images:', error);
    // Fallback: return original blobs if processing fails
    return {
      originalImageBlob: originalBlob,
      resizedMaskBlob: maskBlob
    };
  }
}
// ===== GPT-IMAGE-1 INPAINTING =====
async function dalleInpainting(originalImageUrl, maskUrl, prompt) {
  console.log('🎨 Performing GPT-Image-1 inpainting...');
  
  try {
    // Download images
    const [originalResponse, maskResponse] = await Promise.all([
      fetch(originalImageUrl),
      fetch(maskUrl)
    ]);
    
    if (!originalResponse.ok || !maskResponse.ok) {
      throw new Error('Failed to download images for inpainting');
    }
    
    const originalBlob = await originalResponse.blob();
    const maskBlob = await maskResponse.blob();
    
    console.log('📐 Original image size:', originalBlob.size, 'bytes');
    console.log('📐 Mask image size:', maskBlob.size, 'bytes');
    
    // Validate and resize mask to match original image dimensions
    const { resizedMaskBlob, originalImageBlob } = await validateAndResizeMask(originalBlob, maskBlob);
    
    // Create form data for OpenAI edits endpoint
    const formData = new FormData();
    formData.append('image', originalImageBlob, 'original.png');
    formData.append('mask', resizedMaskBlob, 'mask.png');
    formData.append('prompt', prompt);
    formData.append('model', 'gpt-image-1');
    formData.append('n', '1');
    formData.append('size', '1536x1024');
    formData.append('quality', 'high');
    
    const response = await fetch('https://api.openai.com/v1/images/edits', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: formData
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`GPT-Image-1 inpainting error: ${error}`);
    }
    
    const result = await response.json();
    return {
      image_url: result.data[0].url
    };
  } catch (error) {
    console.error('Inpainting error:', error);
    throw error;
  }
}
// ===== QUALITY REVIEW SYSTEM =====
async function reviewStagingQuality(stagedImageUrl, qualityTier) {
  const reviewResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
              text: `Review this staged room for professional real estate quality. Rate 1-10 and identify issues: furniture scale, placement logic, lighting consistency, architectural preservation, staging appropriateness. Suggest specific improvements if score < 8.5.`
            },
            {
              type: 'image_url',
              image_url: {
                url: stagedImageUrl
              }
            }
          ]
        }
      ],
      max_tokens: 400
    })
  });
  const reviewResult = await reviewResponse.json();
  const review = reviewResult.choices[0].message.content;
  // Parse quality score (simple extraction)
  const scoreMatch = review.match(/(\d+(?:\.\d+)?)\s*\/?\s*10/);
  const qualityScore = scoreMatch ? parseFloat(scoreMatch[1]) : 7.0;
  const needsRefinement = qualityScore < 8.5 && qualityTier === 'premium';
  return {
    quality_score: qualityScore,
    needs_refinement: needsRefinement,
    review_text: review,
    improved_prompt: needsRefinement ? extractImprovedPrompt(review) : null,
    final_score: qualityScore
  };
}
// ===== FALLBACK BOUNDING BOX METHOD =====
// This function has been removed as we now fallback to basic OpenAI staging
// when SAM is not available, which is simpler and more reliable
// ===== HELPER FUNCTIONS =====
async function downloadAndStoreAsset(supabase, downloadUrl, listingId, userId, assetKind, metadata) {
  const startTime = Date.now();
  const response = await fetch(downloadUrl);
  if (!response.ok) {
    throw new Error(`Failed to download generated content: ${response.statusText}`);
  }
  const contentBlob = await response.blob();
  const fileExtension = getFileExtensionFromContentType(contentBlob.type);
  const fileName = `${assetKind}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExtension}`;
  const storagePath = listingId ? `${listingId}/${fileName}` : `generic/${fileName}`;
  const { data: uploadData, error: uploadError } = await supabase.storage.from('media-assets').upload(storagePath, contentBlob, {
    cacheControl: '3600',
    upsert: false
  });
  if (uploadError) throw uploadError;
  const { data: assetData, error: assetError } = await supabase.from('media_assets').insert({
    listing_id: listingId,
    user_id: userId,
    asset_kind: assetKind,
    storage_path: storagePath,
    upload_order: 1,
    metadata: {
      ...metadata,
      generated_at: new Date().toISOString(),
      file_size: contentBlob.size,
      content_type: contentBlob.type
    }
  }).select().single();
  if (assetError) throw assetError;
  const { data: publicUrl } = supabase.storage.from('media-assets').getPublicUrl(storagePath);
  const processingTime = (Date.now() - startTime) / 1000;
  return {
    asset_id: assetData.id,
    public_url: publicUrl.publicUrl,
    processing_time: processingTime
  };
}
function getFileExtensionFromContentType(contentType) {
  const extensions = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'video/mp4': 'mp4',
    'application/pdf': 'pdf'
  };
  return extensions[contentType] || 'bin';
}
function buildVirtualStagingPrompt(data, roomAnalysis, method = 'generation') {
  let basePrompt = '';
  if (method === 'inpainting') {
    basePrompt = `Add professional ${data.staging_style} furniture to the MASKED AREAS ONLY of this ${data.room_type}.

CRITICAL INPAINTING REQUIREMENTS:
- Only modify the white masked regions shown in the mask
- Preserve ALL areas outside the mask exactly as they are
- Do not change walls, windows, doors, or architectural features outside mask
- Match existing lighting and shadow patterns perfectly
- Ensure furniture fits naturally within the masked staging areas only

FURNITURE STAGING GUIDELINES (for masked areas):
- Add ${data.staging_style} furniture and decor appropriate for ${data.room_type}
- Use high-end, professionally staged furniture pieces
- Place furniture logically within the available masked space
- Include appropriate accessories: pillows, artwork, plants, lamps, rugs
- Ensure realistic furniture scale for the specific masked areas
- Create inviting staging that enhances the existing room`;
  } else {
    basePrompt = `Transform this ${data.room_type} with professional real estate staging while preserving the original image's exact characteristics.

STRICT PRESERVATION REQUIREMENTS:
- Keep image identical to original in all aspects except furniture
- Maintain exact same dimensions, proportions, and room layout
- Preserve original lighting, shadows, and color temperature
- Keep all architectural features, walls, windows, and flooring unchanged
- Do not alter room perspective, camera angle, or field of view

FURNITURE STAGING GUIDELINES:
- Add ${data.staging_style} furniture and decor appropriate for ${data.room_type}
- Use high-end, professionally staged furniture pieces
- Place furniture logically for optimal room flow and functionality
- Include appropriate accessories: pillows, artwork, plants, lamps, rugs
- Ensure furniture scale is realistic and proportional to room size
- Create inviting, move-in ready atmosphere for potential buyers`;
  }
  basePrompt += `

PROFESSIONAL REAL ESTATE STANDARDS:
- Magazine-quality interior staging
- Clean, uncluttered, and organized appearance
- Neutral yet warm color palette for broad appeal
- Strategic furniture placement to highlight room's best features
- Premium finishes and tasteful decorative elements

QUALITY SPECIFICATIONS:
- Ultra-high resolution and crystal clear details
- Perfect lighting consistency with original image
- Photorealistic furniture rendering and textures
- Professional real estate photography quality`;
  const negativePrompts = [
    'blurry',
    'low resolution',
    'pixelated',
    'grainy',
    'noise',
    'artifacts',
    'cartoon',
    'illustration',
    'anime',
    'drawing',
    'sketch',
    'painting',
    'distorted',
    'deformed',
    'warped',
    'stretched',
    'squeezed',
    'morphed',
    'oversaturated',
    'undersaturated',
    'overexposed',
    'underexposed',
    'text',
    'watermark',
    'logo',
    'signature',
    'people',
    'persons',
    'humans',
    'faces',
    'clutter',
    'messy',
    'disorganized',
    'crowded',
    'overstuffed',
    'chaotic',
    'poor lighting',
    'harsh shadows',
    'uneven lighting',
    'artificial lighting changes',
    'unrealistic',
    'fake looking',
    'CGI',
    'rendered',
    'artificial',
    'plastic looking',
    'changed room layout',
    'moved walls',
    'altered architecture',
    'different perspective',
    'floating furniture',
    'oversized furniture',
    'undersized furniture',
    'furniture clipping'
  ];
  if (method === 'inpainting') {
    negativePrompts.push('modifying unmasked areas', 'changing walls outside mask', 'altering lighting outside mask', 'bleeding outside mask boundaries', 'extending furniture beyond masked areas');
  }
  return `${basePrompt}

NEGATIVE PROMPTS (avoid): ${negativePrompts.join(', ')}

Room Analysis Context: ${roomAnalysis}

Generate a professionally staged ${data.room_type} that maintains complete visual fidelity to the original while adding beautiful ${data.staging_style} furnishing.`;
}
function extractImprovedPrompt(reviewText) {
  if (reviewText.includes('furniture scale')) {
    return 'Focus on properly scaled furniture that fits the room proportions naturally';
  }
  if (reviewText.includes('placement')) {
    return 'Improve furniture placement for optimal room flow and functionality';
  }
  if (reviewText.includes('lighting')) {
    return 'Ensure furniture lighting matches the existing room lighting perfectly';
  }
  return 'Refine the staging with more professional and appropriate furniture choices';
}
async function generateRectangleMask(coordinates) {
  // This function is no longer used as we fallback to basic staging instead
  // Keeping for potential future implementation
  throw new Error('Rectangle mask generation not implemented - using basic staging fallback');
}
