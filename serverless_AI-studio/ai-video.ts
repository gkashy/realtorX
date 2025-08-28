// supabase/functions/ai-video/index.ts
// Video generation functions: scene planning, video tours, property videos
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};
// API Keys
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const PIXVERSE_API_KEY = Deno.env.get('PIXVERSE_API_KEY');
const VEO3_API_KEY = Deno.env.get('VEO3_API_KEY');
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
      case 'plan_video_scenes':
        return await planVideoScenes(supabase, userContext, data, user.id);
      case 'queue_video_tour':
        return await queueVideoTour(supabase, userContext, data, user.id);
      case 'generate_video_tour':
        return await generateVideoTour(supabase, userContext, data, user.id);
      case 'queue_property_video':
        return await queuePropertyVideo(supabase, userContext, data, user.id);
      case 'generate_property_video':
        return await generatePropertyVideo(supabase, userContext, data, user.id);
      default:
        return new Response('Invalid action', {
          status: 400
        });
    }
  } catch (error) {
    console.error('Error in ai-video:', error);
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
// ===== VIDEO TOUR SCENE PLANNING =====
async function planVideoScenes(supabase, userContext, data, userId) {
  const { listing_id, uploaded_images, special_requests = "", duration = 30, include_cover = false, include_ending = false } = data;
  if (!OPENAI_API_KEY) {
    return new Response('OpenAI API key required', {
      status: 500
    });
  }
  try {
    const { listingData, brandKit } = await getListingAndBrand(supabase, listing_id, userContext.company_id);
    // Process uploaded images first
    console.log('📤 Processing uploaded images...');
    const processedImages = await processUploadedImages(uploaded_images, listing_id, userId, supabase);
    // Analyze processed images
    const imageAnalysis = await analyzeImagesWithGPT4o(processedImages);
    // Create video pair plan using GPT-4o
    const pairPlanPrompt = buildVideoPairPlannerPrompt(listingData, imageAnalysis, special_requests, include_cover, include_ending);
    const pairResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: 'You are a real estate video production expert specializing in image-to-video transitions. Return ONLY valid JSON.'
          },
          {
            role: 'user',
            content: pairPlanPrompt
          }
        ],
        temperature: 0.3,
        response_format: {
          type: "json_object"
        }
      })
    });
    const pairResult = await pairResponse.json();
    const videoPairPlan = JSON.parse(pairResult.choices[0].message.content);
    // Track analytics
    await supabase.rpc('fn_track_event', {
      event_name: 'video_pairs_planned',
      payload: {
        listing_id: listing_id,
        total_pairs: videoPairPlan.video_pairs.length,
        total_images_used: videoPairPlan.video_pairs.length * 2,
        special_requests: special_requests
      }
    });
    return new Response(JSON.stringify({
      success: true,
      data: {
        video_pair_plan: videoPairPlan,
        total_pairs: videoPairPlan.video_pairs.length,
        total_videos: videoPairPlan.video_pairs.length,
        estimated_generation_time: videoPairPlan.video_pairs.length * 60,
        estimated_final_duration: videoPairPlan.video_pairs.length * 5,
        message: `${videoPairPlan.video_pairs.length} video pairs planned for sequential generation`
      }
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Video pair planning error:', error);
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
// ===== QUEUE VIDEO TOUR =====
async function queueVideoTour(supabase, userContext, data, userId) {
  const { listing_id, video_pair_plan, uploaded_images, watermark_enabled = false, cover_template = null, ending_template = null, priority = 'normal', // MAX Professional features
  max_professional = false, custom_intro_image = null, custom_outro_image = null, custom_music_data = null, transition_type = 'fade', visual_effects = null, background_music_choice = 'luxury', // VOICEOVER FEATURES
  include_voiceover = false, voiceover_script = null, voiceover_voice_id = 'default', voiceover_style = 'professional' } = data;
  try {
    // Create master job for final assembly
    const masterJob = await createJob(supabase, {
      user_id: userId,
      company_id: userContext.company_id,
      listing_id: listing_id,
      job_type: 'video_tour_master',
      status: 'queued',
      priority: priority,
      parameters: {
        // Core video pairs
        video_pair_plan,
        total_pairs: video_pair_plan.video_pairs.length,
        uploaded_images: uploaded_images.length,
        // Standard features
        watermark_enabled,
        cover_template,
        ending_template,
        // MAX Professional features
        max_professional,
        custom_intro_image,
        custom_outro_image,
        custom_music_data,
        transition_type,
        visual_effects,
        background_music_choice,
        // VOICEOVER FEATURES
        include_voiceover,
        voiceover_script,
        voiceover_voice_id,
        voiceover_style,
        // Processing mode
        sequential_processing: true
      },
      estimated_duration: video_pair_plan.video_pairs.length * 60 + 120,
      ai_provider: 'pixverse'
    });
    // Create individual video pair jobs for sequential processing
    const videoPairJobs = [];
    for(let i = 0; i < video_pair_plan.video_pairs.length; i++){
      const videoPair = video_pair_plan.video_pairs[i];
      const videoPairJob = await createJob(supabase, {
        user_id: userId,
        company_id: userContext.company_id,
        listing_id: listing_id,
        job_type: 'video_pair_generation',
        status: 'queued',
        priority: priority,
        parameters: {
          parent_job_id: masterJob.id,
          video_pair_data: videoPair,
          sequence_order: videoPair.sequence_order || i + 1,
          wait_for_previous: i > 0,
          sequential_processing: true
        },
        estimated_duration: 60,
        ai_provider: 'pixverse'
      });
      videoPairJobs.push(videoPairJob);
    }
    // Queue all jobs for processing
    await queueJobForProcessing(masterJob, supabase);
    for (const videoPairJob of videoPairJobs){
      await queueJobForProcessing(videoPairJob, supabase);
    }
    return new Response(JSON.stringify({
      success: true,
      data: {
        master_job_id: masterJob.id,
        video_pair_job_ids: videoPairJobs.map((job)=>job.id),
        total_video_pairs: video_pair_plan.video_pairs.length,
        processing_mode: 'sequential_video_pairs',
        max_professional: max_professional,
        estimated_completion: new Date(Date.now() + masterJob.estimated_duration * 1000).toISOString(),
        message: `Video tour with ${video_pair_plan.video_pairs.length} pairs queued for sequential processing`
      }
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Queue video tour error:', error);
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
// ===== GENERATE VIDEO TOUR (DIRECT) =====
async function generateVideoTour(supabase, userContext, data, userId) {
  // For immediate video tour generation (non-queued)
  return new Response(JSON.stringify({
    success: false,
    message: 'Direct video tour generation not implemented. Use queue_video_tour for best results.'
  }), {
    status: 501,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json'
    }
  });
}
// ===== QUEUE PROPERTY VIDEO =====
async function queuePropertyVideo(supabase, userContext, data, userId) {
  const { listing_id, video_style = 'slideshow', duration = 30, music_style = 'ambient', video_type = 'standard', include_voiceover = false, branding_level = 'standard', priority = 'normal', ai_provider } = data;
  try {
    const { listingData } = await getListingAndBrand(supabase, listing_id, userContext.company_id);
    // Determine AI provider if not already specified
    const finalProvider = ai_provider || determineVideoProvider(video_type, duration, include_voiceover, video_style);
    // Calculate estimated duration based on video type and provider
    let estimatedDuration;
    if (finalProvider === 'veo3') {
      estimatedDuration = video_type === 'cinematic_promo' ? 120 : 90; // 1.5-2 minutes
    } else {
      estimatedDuration = duration > 60 ? 300 : video_type === 'bulk_listing' ? 60 : 120; // 1-5 minutes
    }
    // Create job record
    const job = await createJob(supabase, {
      user_id: userId,
      company_id: userContext.company_id,
      listing_id: listing_id,
      job_type: `${video_type}_video`,
      status: 'queued',
      priority: priority,
      parameters: {
        video_style,
        video_type,
        duration,
        music_style,
        include_voiceover,
        branding_level,
        listing_title: listingData.title,
        listing_address: listingData.address
      },
      estimated_duration: estimatedDuration,
      ai_provider: finalProvider
    });
    // Queue the job for external processing
    await queueJobForProcessing(job, supabase);
    return new Response(JSON.stringify({
      success: true,
      data: {
        job_id: job.id,
        status: 'queued',
        video_type: video_type,
        ai_provider: finalProvider,
        estimated_completion: new Date(Date.now() + job.estimated_duration * 1000).toISOString(),
        message: `${video_type} video generation queued successfully with ${finalProvider}. You will be notified when complete.`
      }
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Queue video error:', error);
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
// ===== GENERATE PROPERTY VIDEO (DIRECT) =====
async function generatePropertyVideo(supabase, userContext, data, userId) {
  const { listing_id, video_style = 'slideshow', duration = 30, music_style = 'ambient' } = data;
  if (!PIXVERSE_API_KEY) {
    return new Response('Pixverse API key required', {
      status: 500
    });
  }
  try {
    const { listingData, brandKit } = await getListingAndBrand(supabase, listing_id, userContext.company_id);
    // Get listing photos
    const { data: mediaAssets } = await supabase.from('media_assets').select('storage_path').eq('listing_id', listing_id).eq('asset_kind', 'image').limit(10);
    if (!mediaAssets || mediaAssets.length === 0) {
      throw new Error('No photos available for video generation');
    }
    // Generate video using Pixverse
    const videoData = await createPixverseVideo({
      photos: mediaAssets,
      listing: listingData,
      style: video_style,
      duration: 5,
      music_style
    });
    const storedAsset = await downloadAndStoreAsset(supabase, videoData.download_url, listing_id, userId, 'ai_property_video', {
      video_style,
      duration: 5,
      music_style,
      ai_provider: 'pixverse'
    });
    await supabase.rpc('fn_track_event', {
      event_name: 'ai_content_generated',
      payload: {
        content_type: 'property_video',
        listing_id: listing_id,
        video_style: video_style,
        ai_provider: 'pixverse'
      }
    });
    return new Response(JSON.stringify({
      success: true,
      data: {
        download_url: storedAsset.public_url,
        asset_id: storedAsset.asset_id,
        generation_metadata: {
          video_style,
          duration: 5,
          music_style,
          ai_provider: 'pixverse',
          processing_time: storedAsset.processing_time
        }
      },
      message: 'Property video generated successfully'
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Property video generation error:', error);
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
// ===== AI PROVIDER ROUTING =====
function determineVideoProvider(videoType, duration, includeVoiceover, videoStyle) {
  // Use Veo 3 when generating ultra-cinematic, high-end promos with natural audio
  const veo3UseCases = [
    'cinematic_promo',
    'lifestyle',
    'ultra_cinematic'
  ];
  const veo3Styles = [
    'cinematic',
    'ultra_cinematic',
    'lifestyle',
    'dramatic'
  ];
  if (veo3UseCases.includes(videoType) || veo3Styles.includes(videoStyle) || includeVoiceover || duration <= 15 && videoStyle === 'cinematic') {
    return 'veo3';
  }
  // Use Pixverse for standard videos (updated from runway)
  const pixverseUseCases = [
    'bulk_listing',
    'social_ad',
    'agent_promo',
    'branded_content',
    'slideshow',
    'standard'
  ];
  if (pixverseUseCases.includes(videoType) || duration > 15) {
    return 'pixverse';
  }
  return 'pixverse'; // Default (updated from runway)
}
// ===== HELPER FUNCTIONS =====
async function processUploadedImages(uploadedImages, listingId, userId, supabase) {
  const processedImages = [];
  for (const [index, imageData] of uploadedImages.entries()){
    try {
      // Handle base64 or blob data
      let imageBlob;
      if (typeof imageData === 'string' && imageData.startsWith('data:')) {
        imageBlob = dataURItoBlob(imageData);
      } else if (imageData instanceof Blob) {
        imageBlob = imageData;
      } else {
        console.warn(`Skipping invalid image data at index ${index}`);
        continue;
      }
      // Upload to Supabase storage
      const fileName = `pair-image-${index}-${Date.now()}.jpg`; // Updated naming
      const storagePath = `${listingId}/pairs/${fileName}`; // Updated path
      const { data: uploadData, error } = await supabase.storage.from('media-assets').upload(storagePath, imageBlob, {
        contentType: imageBlob.type || 'image/jpeg'
      });
      if (!error) {
        const { data: publicUrl } = supabase.storage.from('media-assets').getPublicUrl(storagePath);
        processedImages.push({
          filename: fileName,
          storage_path: storagePath,
          public_url: publicUrl.publicUrl,
          image_index: index + 1 // 1-based indexing for GPT-4o
        });
      } else {
        console.error(`Failed to upload image ${index}:`, error);
      }
    } catch (error) {
      console.error(`Error processing image ${index}:`, error);
    }
  }
  return processedImages;
}
function dataURItoBlob(dataURI) {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for(let i = 0; i < byteString.length; i++){
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([
    ab
  ], {
    type: mimeString
  });
}
async function analyzeImagesWithGPT4o(processedImages) {
  const categories = [];
  const imageFiles = [];
  processedImages.forEach((img, index)=>{
    const filename = img.filename || `image_${index}.jpg`;
    imageFiles.push({
      filename: filename,
      public_url: img.public_url,
      storage_path: img.storage_path,
      image_index: img.image_index
    });
    // Enhanced categorization logic
    const lowerFilename = filename.toLowerCase();
    if (lowerFilename.includes('exterior') || lowerFilename.includes('front') || lowerFilename.includes('curb')) {
      categories.push('exterior');
    } else if (lowerFilename.includes('kitchen') || lowerFilename.includes('living') || lowerFilename.includes('bedroom') || lowerFilename.includes('bathroom')) {
      categories.push('interior');
    } else if (lowerFilename.includes('backyard') || lowerFilename.includes('pool') || lowerFilename.includes('garden') || lowerFilename.includes('patio')) {
      categories.push('lifestyle');
    } else {
      categories.push('general');
    }
  });
  return {
    image_count: processedImages.length,
    categories: [
      ...new Set(categories)
    ],
    image_files: imageFiles
  };
}
function buildVideoPairPlannerPrompt(listingData, imageAnalysis, specialRequests, includeCover, includeEnding) {
  return `
PROPERTY ANALYSIS:
- Property: ${listingData.title} at ${listingData.address}
- Details: ${listingData.beds}BR/${listingData.baths}BA, ${listingData.sqft}sqft, ${listingData.price?.toLocaleString()}
- Total Images Available: ${imageAnalysis.image_count} photos
- Image Categories: ${imageAnalysis.categories.join(', ')}
- Special User Requests: "${specialRequests}"

PIXVERSE API CONSTRAINTS:
- Each video uses EXACTLY 2 images (first_frame_img + last_frame_img)
- Duration: 5 seconds per video
- Quality: 540p for testing
- Motion: normal mode

TASK: Intelligent Image Filtering & Optimal Pairing
- FILTER OUT: Blurry, repetitive, poor quality, or unnecessary images
- STRATEGIC PAIRING: Complementary angles, wide+detail shots, logical spatial flow
- QUALITY OVER QUANTITY: Use best images only (could be 6 from 20, or 24 from 50)

AVAILABLE IMAGES:
${imageAnalysis.image_files.map((img)=>`${img.image_index}. ${img.filename}`).join('\n')}

RETURN JSON FORMAT:
{
  "video_pairs": [
    {
      "pair_id": 1,
      "first_image": {
        "filename": "exact_filename_from_list",
        "image_index": 1
      },
      "last_image": {
        "filename": "exact_filename_from_list", 
        "image_index": 4
      },
      "transition_type": "exterior_approach",
      "prompt": "Professional real estate transition showcasing elegant curb appeal leading to welcoming front entrance",
      "scene_script": "Welcome to this stunning home with beautiful curb appeal and welcoming entrance.",
      "duration": 5,
      "script_duration": 4,
      "sequence_order": 1
    }
  ],
  "total_pairs": "number_of_optimal_pairs_created",
  "images_used": "total_images_selected_from_available",
  "images_filtered_out": "number_of_images_skipped",
  "narrative_flow": "Brief description of overall story arc"
}

PAIRING REQUIREMENTS:
1. FILTER INTELLIGENTLY: Skip repetitive, blurry, or low-value images
2. STRATEGIC PAIRING: Choose complementary shots (wide+detail, left+right side, etc.)
3. SPATIAL LOGIC: Create natural flow through property (exterior → interior → lifestyle)
4. CUSTOM PROMPTS: Each prompt combines our general framework + user's special requests
5. EXACT FILENAMES: Use exact filenames from available images list
6. SEQUENTIAL ORDER: Number pairs for processing order

PROMPT FORMULA FOR EACH PAIR:
"Professional real estate transition [SPECIFIC TRANSITION DESCRIPTION] [INCORPORATE SPECIAL REQUESTS]"

SCENE SCRIPT FORMULA FOR EACH PAIR:
- Generate 4-second voiceover script for each scene
- Match the visual content of the video transition
- Create coherent flow between scenes
- Keep scripts natural and engaging
- Incorporate special requests into scripts

SPECIAL REQUESTS INTEGRATION: "${specialRequests}"
- Weave these requests into individual video prompts AND scene scripts
- Influence overall pairing strategy
- Emphasize requested features/areas in both visuals and narration

FILTERING EXAMPLES:
- Skip: Multiple similar kitchen angles → Keep best 2
- Skip: Blurry photos or poor lighting
- Skip: Utility rooms unless specifically requested
- Keep: Unique angles that showcase different perspectives
- Keep: High-quality images with good composition
`;
}
async function createPixverseVideo(data) {
  if (!PIXVERSE_API_KEY) {
    throw new Error('Pixverse API key required');
  }
  console.log('🎬 Creating video with Pixverse...');
  // First, upload images to Pixverse and get image IDs
  const firstImageId = await uploadImageToPixverse(data.photos[0].storage_path);
  const lastImageId = await uploadImageToPixverse(data.photos[data.photos.length - 1].storage_path);
  // Generate UUID for trace ID
  const traceId = crypto.randomUUID();
  const seed = Math.floor(Math.random() * 2147483647);
  // Use GPT-4o generated prompt if available, otherwise fallback to generic
  const videoPrompt = data.video_pair_data?.prompt || `Professional real estate video showcasing ${data.listing.title}`;
  console.log(`🎯 Using prompt: "${videoPrompt}"`);
  // Real Pixverse API integration
  const response = await fetch('https://app-api.pixverse.ai/openapi/v2/video/transition/generate', {
    method: 'POST',
    headers: {
      'Ai-Trace-Id': traceId,
      'API-KEY': PIXVERSE_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: videoPrompt,
      model: 'v4.5',
      duration: 5,
      quality: '540p',
      motion_mode: 'normal',
      seed: seed,
      first_frame_img: firstImageId,
      last_frame_img: lastImageId
    })
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Pixverse API error: ${error}`);
  }
  const result = await response.json();
  if (result.ErrCode !== 0) {
    throw new Error(`Pixverse API error: ${result.ErrMsg}`);
  }
  return {
    video_id: result.Resp.video_id,
    status: 'processing',
    estimated_time: 60 // Pixverse typically takes ~1 minute
  };
}
async function uploadImageToPixverse(storagePath) {
  // Get the image from Supabase storage
  const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
  const { data: imageData } = await supabase.storage.from('media-assets').download(storagePath);
  if (!imageData) {
    throw new Error(`Failed to download image: ${storagePath}`);
  }
  // Upload to Pixverse (assuming they have an image upload endpoint)
  // Note: This is a placeholder - you'll need to implement the actual Pixverse image upload API
  const uploadResponse = await fetch('https://app-api.pixverse.ai/openapi/v2/image/upload', {
    method: 'POST',
    headers: {
      'API-KEY': PIXVERSE_API_KEY,
      'Content-Type': 'multipart/form-data'
    },
    body: imageData
  });
  if (!uploadResponse.ok) {
    throw new Error(`Failed to upload image to Pixverse: ${uploadResponse.statusText}`);
  }
  const uploadResult = await uploadResponse.json();
  return uploadResult.image_id; // Return the image ID from Pixverse
}
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
async function createJob(supabase, jobData) {
  const { data: job, error: jobError } = await supabase.from('ai_generation_jobs').insert({
    ...jobData,
    status: 'queued',
    progress_percentage: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    estimated_completion: new Date(Date.now() + jobData.estimated_duration * 1000).toISOString()
  }).select().single();
  if (jobError) throw jobError;
  return job;
}
async function queueJobForProcessing(job, supabase) {
  console.log(`🔄 Queuing ${job.job_type} job ${job.id}:`, {
    job_type: job.job_type,
    ai_provider: job.ai_provider,
    priority: job.priority,
    is_video_pair: job.job_type === 'video_pair_generation',
    is_master_job: job.job_type === 'video_tour_master',
    sequence_order: job.parameters?.sequence_order || 'none',
    sequential_processing: job.parameters?.sequential_processing || false,
    has_custom_prompt: !!job.parameters?.video_pair_data?.prompt
  });
  const queueData = {
    job_id: job.id,
    job_type: job.job_type,
    parameters: job.parameters,
    ai_provider: job.ai_provider,
    webhook_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/ai-webhooks/${job.ai_provider}`,
    is_video_pair: job.job_type === 'video_pair_generation',
    is_master_job: job.job_type === 'video_tour_master',
    video_pair_data: job.parameters?.video_pair_data || null,
    sequence_order: job.parameters?.sequence_order || null,
    sequential_processing: job.parameters?.sequential_processing || false,
    parent_job_id: job.parameters?.parent_job_id || null,
    user_id: job.user_id,
    company_id: job.company_id,
    listing_id: job.listing_id,
    created_at: job.created_at,
    priority: job.priority,
    // Add custom prompt explicitly for worker
    custom_prompt: job.parameters?.video_pair_data?.prompt || null
  };
  try {
    console.log(`📤 Sending job ${job.id} to queue worker...`);
    if (queueData.custom_prompt) {
      console.log(`🎯 Job includes custom GPT-4o prompt: "${queueData.custom_prompt.substring(0, 50)}..."`);
    }
    // DEBUG: Check if scene_script is being sent
    if (queueData.video_pair_data?.scene_script) {
      console.log(`🎙️ DEBUG: Sending scene_script to Railway: "${queueData.video_pair_data.scene_script}"`);
    } else {
      console.log(`❌ DEBUG: No scene_script found in video_pair_data being sent to Railway`);
      if (queueData.video_pair_data) {
        console.log(`🔍 DEBUG: video_pair_data keys being sent:`, Object.keys(queueData.video_pair_data));
      }
    }
    const workerResponse = await fetch('https://media-workers-production.up.railway.app/process-queue', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer sk_cron_17519873682_f7e4d9c2a8b5163094e7f2a1c6d8b3e9`,
        'User-Agent': 'Supabase-Edge-Function'
      },
      body: JSON.stringify(queueData)
    });
    if (!workerResponse.ok) {
      const errorText = await workerResponse.text();
      throw new Error(`Queue worker failed (${workerResponse.status}): ${errorText}`);
    }
    const workerResult = await workerResponse.json();
    console.log(`✅ Job ${job.id} successfully queued to external worker:`, workerResult);
    // 🔒 CRITICAL FIX: Only update status to 'queued' if job is NOT already processing/completed
    await supabase.from('ai_generation_jobs').update({
      status: 'queued',
      updated_at: new Date().toISOString()
    }).eq('id', job.id).not('status', 'in', '(processing,completed)') // Don't overwrite processing/completed jobs
    .is('external_job_id', null); // Don't overwrite jobs already sent to APIs
    return true;
  } catch (error) {
    console.error(`❌ Failed to queue job ${job.id}:`, error);
    try {
      await supabase.from('ai_generation_jobs').update({
        status: 'failed',
        error_message: `Queue worker unavailable: ${error.message}`,
        updated_at: new Date().toISOString()
      }).eq('id', job.id);
      console.log(`📝 Updated job ${job.id} status to failed in database`);
    } catch (dbError) {
      console.error(`❌ Failed to update job ${job.id} status in database:`, dbError);
    }
    return false;
  }
}
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
