// supabase/functions/ai-batch/index.ts
// Batch processing functions: bulk content generation for multiple listings
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};
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
      case 'queue_batch_content':
        return await queueBatchContent(supabase, userContext, data, user.id);
      case 'queue_virtual_staging':
        return await queueVirtualStaging(supabase, userContext, data, user.id);
      default:
        return new Response('Invalid action', {
          status: 400
        });
    }
  } catch (error) {
    console.error('Error in ai-batch:', error);
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
// ===== QUEUE BATCH CONTENT =====
async function queueBatchContent(supabase, userContext, data, userId) {
  const { listing_ids, content_types, batch_settings = {}, priority = 'low' } = data;
  if (!listing_ids || listing_ids.length === 0) {
    throw new Error('At least one listing ID is required');
  }
  if (listing_ids.length > 50) {
    throw new Error('Maximum 50 listings allowed per batch');
  }
  try {
    // Create parent batch job
    const batchJob = await createJob(supabase, {
      user_id: userId,
      company_id: userContext.company_id,
      listing_id: null,
      job_type: 'batch_content',
      status: 'queued',
      priority: priority,
      parameters: {
        listing_ids,
        content_types,
        batch_settings,
        total_items: listing_ids.length * content_types.length
      },
      estimated_duration: listing_ids.length * content_types.length * 30,
      ai_provider: 'multiple'
    });
    // Create individual child jobs for each listing/content type combination
    const childJobs = [];
    for (const listingId of listing_ids){
      for (const contentType of content_types){
        const childJob = await createJob(supabase, {
          user_id: userId,
          company_id: userContext.company_id,
          listing_id: listingId,
          job_type: contentType,
          status: 'queued',
          priority: priority,
          parameters: {
            ...batch_settings,
            parent_job_id: batchJob.id
          },
          estimated_duration: 30,
          ai_provider: getProviderForContentType(contentType)
        });
        childJobs.push(childJob);
      }
    }
    // Queue all jobs for processing
    await queueJobForProcessing(batchJob, supabase);
    for (const childJob of childJobs){
      await queueJobForProcessing(childJob, supabase);
    }
    return new Response(JSON.stringify({
      success: true,
      data: {
        batch_job_id: batchJob.id,
        child_job_ids: childJobs.map((job)=>job.id),
        total_jobs: childJobs.length,
        status: 'queued',
        estimated_completion: new Date(Date.now() + batchJob.estimated_duration * 1000).toISOString(),
        message: `Batch processing queued: ${childJobs.length} content items across ${listing_ids.length} listings.`
      }
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Queue batch error:', error);
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
// ===== QUEUE VIRTUAL STAGING =====
async function queueVirtualStaging(supabase, userContext, data, userId) {
  const { listing_id, photo_asset_id, staging_style = 'modern', room_type = 'living_room', priority = 'normal' } = data;
  try {
    // Validate photo asset exists
    const { data: photoAsset, error: photoError } = await supabase.from('media_assets').select('storage_path').eq('id', photo_asset_id).single();
    if (photoError || !photoAsset) {
      throw new Error('Photo asset not found');
    }
    // Create job record
    const job = await createJob(supabase, {
      user_id: userId,
      company_id: userContext.company_id,
      listing_id: listing_id,
      job_type: 'virtual_staging',
      status: 'queued',
      priority: priority,
      parameters: {
        photo_asset_id,
        staging_style,
        room_type
      },
      estimated_duration: 60,
      ai_provider: 'openai'
    });
    // Queue the job for external processing
    await queueJobForProcessing(job, supabase);
    return new Response(JSON.stringify({
      success: true,
      data: {
        job_id: job.id,
        status: 'queued',
        estimated_completion: new Date(Date.now() + job.estimated_duration * 1000).toISOString(),
        message: 'Virtual staging queued successfully. You will be notified when complete.'
      }
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Queue staging error:', error);
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
// ===== HELPER FUNCTIONS =====
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
    is_scene_job: job.job_type === 'video_scene',
    is_master_job: job.job_type === 'video_tour_master',
    parent_job: job.parameters?.parent_job_id || 'none'
  });
  // Enhanced queue data for scene-based processing
  const queueData = {
    job_id: job.id,
    job_type: job.job_type,
    parameters: job.parameters,
    ai_provider: job.ai_provider,
    webhook_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/ai-webhooks/${job.ai_provider}`,
    // New: Scene-specific data
    is_scene_job: job.job_type === 'video_pair_generation',
    is_master_job: job.job_type === 'video_tour_master',
    scene_data: job.parameters?.scene_data || null,
    parent_job_id: job.parameters?.parent_job_id || null,
    // Additional job context
    user_id: job.user_id,
    company_id: job.company_id,
    listing_id: job.listing_id,
    created_at: job.created_at,
    priority: job.priority
  };
  // ===== SEND TO EXTERNAL QUEUE WORKER (VERCEL) =====
  try {
    console.log(`📤 Sending job ${job.id} to queue worker...`);
    const workerResponse = await fetch('https://ai-queue-worker-ahxf29eo2-gaurav-kashyaps-projects.vercel.app/api/process-queue', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('CRON_SECRET')}`,
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
    // Update job status to indicate it's been queued for processing
    await supabase.from('ai_generation_jobs').update({
      status: 'queued',
      updated_at: new Date().toISOString()
    }).eq('id', job.id);
    return true;
  } catch (error) {
    console.error(`❌ Failed to queue job ${job.id}:`, error);
    // Update job status to failed if worker is unreachable
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
function getProviderForContentType(contentType) {
  const providerMap = {
    'hero_image': 'openai',
    'business_card': 'canva',
    'social_post': 'canva',
    'flyer': 'canva',
    'standard_video': 'runway',
    'bulk_listing_video': 'pixverse',
    'social_ad_video': 'pixverse',
    'agent_promo_video': 'pixverse',
    'cinematic_promo_video': 'veo3',
    'lifestyle_video': 'veo3',
    'virtual_staging': 'openai',
    'copy': 'openai'
  };
  return providerMap[contentType] || 'openai';
}
