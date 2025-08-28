// supabase/functions/ai-webhooks/index.ts
// Webhook handlers for external AI providers: Pixverse, Runway, Veo3, Replicate, ElevenLabs
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
    const supabase1 = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
    // Parse webhook route
    const url = new URL(req.url);
    const provider = url.pathname.split('/')[1]; // Extract provider from path
    console.log(`🔗 Webhook received from provider: ${provider}`);
    const webhookData = await req.json();
    switch(provider){
      case 'pixverse':
        return await handlePixverseWebhook(supabase1, webhookData);
      case 'runway':
        return await handleRunwayWebhook(supabase1, webhookData);
      case 'veo3':
        return await handleVeo3Webhook(supabase1, webhookData);
      case 'replicate':
        return await handleReplicateWebhook(supabase1, webhookData);
      case 'elevenlabs':
        return await handleElevenLabsWebhook(supabase1, webhookData);
      default:
        console.error('Unknown webhook provider:', provider);
        return new Response('Unknown provider', {
          status: 400
        });
    }
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response('Webhook processing failed', {
      status: 500
    });
  }
});
// ===== PIXVERSE WEBHOOK (NEW PRIMARY PROVIDER) =====
async function handlePixverseWebhook(supabase1, webhookData) {
  const { video_id, status, video_url, error_message } = webhookData;
  try {
    // Find job by external video ID
    const { data: job, error: jobError } = await supabase1.from('ai_generation_jobs').select('*').eq('external_job_id', video_id).single();
    if (jobError || !job) {
      console.error('Job not found for Pixverse video:', video_id);
      return new Response('Job not found', {
        status: 404
      });
    }
    console.log(`🎬 Processing Pixverse webhook for job ${job.id}, status: ${status}`);
    if (status === 'completed' && video_url) {
      // Download and store the generated video
      const storedAsset = await downloadAndStoreAsset(supabase1, video_url, job.listing_id, job.user_id, job.job_type, {
        ...job.parameters,
        ai_provider: 'pixverse',
        video_quality: '540p',
        duration: 5
      });
      // Update job as completed
      await supabase1.from('ai_generation_jobs').update({
        status: 'completed',
        result_data: {
          asset_id: storedAsset.asset_id,
          download_url: storedAsset.public_url,
          video_url: video_url,
          processing_metadata: {
            ai_provider: 'pixverse',
            video_quality: '540p',
            duration: 5
          }
        },
        progress_percentage: 100,
        processing_time_seconds: (Date.now() - new Date(job.created_at).getTime()) / 1000,
        updated_at: new Date().toISOString()
      }).eq('id', job.id);
      // Send notification to user
      await notifyUserJobComplete(supabase1, job, storedAsset);
      // ===== CRITICAL: SEQUENTIAL PROCESSING LOGIC =====
      if (job.job_type === 'video_pair_generation' && job.parameters?.parent_job_id) {
        await handleSequentialVideoProcessing(supabase1, job);
      }
    } else if (status === 'failed') {
      // Update job as failed
      await supabase1.from('ai_generation_jobs').update({
        status: 'failed',
        error_message: error_message || 'Pixverse video generation failed',
        updated_at: new Date().toISOString()
      }).eq('id', job.id);
      console.error(`❌ Pixverse job ${job.id} failed: ${error_message}`);
    }
    return new Response('Pixverse webhook processed', {
      status: 200
    });
  } catch (error) {
    console.error('Pixverse webhook error:', error);
    return new Response('Webhook processing failed', {
      status: 500
    });
  }
}
// ===== SEQUENTIAL PROCESSING LOGIC (CRITICAL NEW FEATURE) =====
async function handleSequentialVideoProcessing(supabase1, completedJob) {
  const parentJobId = completedJob.parameters.parent_job_id;
  const currentSequenceOrder = completedJob.parameters.sequence_order;
  console.log(`🎬 Video pair ${completedJob.id} completed (sequence ${currentSequenceOrder}). Processing next in sequence...`);
  try {
    // Get all video pair jobs for this parent (master job)
    const { data: allVideoPairs, error: pairsError } = await supabase1.from('ai_generation_jobs').select('*').eq('parameters->parent_job_id', parentJobId).eq('job_type', 'video_pair_generation').order('parameters->sequence_order', {
      ascending: true
    });
    if (pairsError) {
      console.error('Error fetching video pairs:', pairsError);
      return;
    }
    // Check completion status
    const completedPairs = allVideoPairs.filter((job)=>job.status === 'completed');
    const failedPairs = allVideoPairs.filter((job)=>job.status === 'failed');
    const queuedPairs = allVideoPairs.filter((job)=>job.status === 'queued');
    const processingPairs = allVideoPairs.filter((job)=>job.status === 'processing');
    console.log(`📊 Video pairs status: ${completedPairs.length} completed, ${failedPairs.length} failed, ${queuedPairs.length} queued, ${processingPairs.length} processing`);
    // If there are failed jobs, fail the entire tour
    if (failedPairs.length > 0) {
      console.error(`❌ ${failedPairs.length} video pairs failed. Failing master job.`);
      await supabase1.from('ai_generation_jobs').update({
        status: 'failed',
        error_message: `${failedPairs.length} video pairs failed`,
        updated_at: new Date().toISOString()
      }).eq('id', parentJobId);
      return;
    }
    // Find next job in sequence to queue
    const nextJob = queuedPairs.find((job)=>job.parameters?.sequence_order === currentSequenceOrder + 1 && job.parameters?.wait_for_previous === true);
    if (nextJob) {
      // Queue the next video pair job
      console.log(`🔄 Queuing next video pair job ${nextJob.id} (sequence ${nextJob.parameters.sequence_order})`);
      // Re-queue to external worker for processing
      await queueNextVideoJob(nextJob);
    } else if (completedPairs.length === allVideoPairs.length) {
      // All video pairs completed - queue master job for assembly
      console.log(`🎥 All ${allVideoPairs.length} video pairs completed! Queuing master job for assembly...`);
      await supabase1.from('ai_generation_jobs').update({
        status: 'queued',
        progress_percentage: 90,
        updated_at: new Date().toISOString()
      }).eq('id', parentJobId).eq('job_type', 'video_tour_master');
      console.log(`✅ Master job ${parentJobId} queued for final video assembly`);
    }
  } catch (error) {
    console.error('Sequential processing error:', error);
  }
}
// Queue next video job to external worker
async function queueNextVideoJob(job) {
  try {
    const queueData = {
      job_id: job.id,
      job_type: job.job_type,
      parameters: job.parameters,
      ai_provider: job.ai_provider,
      webhook_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/ai-webhooks/${job.ai_provider}`,
      is_video_pair: true,
      sequential_processing: true,
      video_pair_data: job.parameters?.video_pair_data,
      sequence_order: job.parameters?.sequence_order,
      parent_job_id: job.parameters?.parent_job_id,
      user_id: job.user_id,
      company_id: job.company_id,
      listing_id: job.listing_id,
      priority: job.priority
    };
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
      throw new Error(`Worker failed: ${workerResponse.status}`);
    }
    console.log(`✅ Successfully queued next video job ${job.id} to worker`);
  } catch (error) {
    console.error(`❌ Failed to queue next video job ${job.id}:`, error);
    // Mark job as failed if we can't queue it
    await supabase.from('ai_generation_jobs').update({
      status: 'failed',
      error_message: `Failed to queue for processing: ${error.message}`,
      updated_at: new Date().toISOString()
    }).eq('id', job.id);
  }
}
// ===== RUNWAY ML WEBHOOK (UPDATED) =====
async function handleRunwayWebhook(supabase1, webhookData) {
  const { task_id, status, output_url, error_message } = webhookData;
  try {
    // Find job by external task ID
    const { data: job, error: jobError } = await supabase1.from('ai_generation_jobs').select('*').eq('external_job_id', task_id).single();
    if (jobError || !job) {
      console.error('Job not found for task:', task_id);
      return new Response('Job not found', {
        status: 404
      });
    }
    if (status === 'completed' && output_url) {
      // Download and store the generated video
      const storedAsset = await downloadAndStoreAsset(supabase1, output_url, job.listing_id, job.user_id, job.job_type, {
        ...job.parameters,
        ai_provider: 'runway'
      });
      // Update job as completed
      await supabase1.from('ai_generation_jobs').update({
        status: 'completed',
        result_data: {
          asset_id: storedAsset.asset_id,
          download_url: storedAsset.public_url
        },
        processing_time_seconds: (Date.now() - new Date(job.created_at).getTime()) / 1000,
        updated_at: new Date().toISOString()
      }).eq('id', job.id);
      // Send notification to user
      await notifyUserJobComplete(supabase1, job, storedAsset);
      // ===== UPDATED: Handle video_pair_generation instead of video_scene =====
      if (job.job_type === 'video_pair_generation' && job.parameters?.parent_job_id) {
        await handleSequentialVideoProcessing(supabase1, job);
      }
    } else if (status === 'failed') {
      // Update job as failed
      await supabase1.from('ai_generation_jobs').update({
        status: 'failed',
        error_message: error_message || 'Video generation failed',
        updated_at: new Date().toISOString()
      }).eq('id', job.id);
    }
    return new Response('Webhook processed', {
      status: 200
    });
  } catch (error) {
    console.error('Runway webhook error:', error);
    return new Response('Webhook processing failed', {
      status: 500
    });
  }
}
// ===== VEO3 WEBHOOK (UPDATED) =====
async function handleVeo3Webhook(supabase1, webhookData) {
  const { generation_id, status, video_url, error_message } = webhookData;
  try {
    // Find job by external task ID
    const { data: job, error: jobError } = await supabase1.from('ai_generation_jobs').select('*').eq('external_job_id', generation_id).single();
    if (jobError || !job) {
      console.error('Job not found for Veo 3 generation:', generation_id);
      return new Response('Job not found', {
        status: 404
      });
    }
    if (status === 'completed' && video_url) {
      // Download and store the generated video
      const storedAsset = await downloadAndStoreAsset(supabase1, video_url, job.listing_id, job.user_id, job.job_type, {
        ...job.parameters,
        ai_provider: 'veo3'
      });
      // Update job as completed
      await supabase1.from('ai_generation_jobs').update({
        status: 'completed',
        result_data: {
          asset_id: storedAsset.asset_id,
          download_url: storedAsset.public_url,
          video_quality: 'ultra_cinematic'
        },
        processing_time_seconds: (Date.now() - new Date(job.created_at).getTime()) / 1000,
        updated_at: new Date().toISOString()
      }).eq('id', job.id);
      // Send notification to user
      await notifyUserJobComplete(supabase1, job, storedAsset);
      // ===== UPDATED: Handle video_pair_generation instead of video_scene =====
      if (job.job_type === 'video_pair_generation' && job.parameters?.parent_job_id) {
        await handleSequentialVideoProcessing(supabase1, job);
      }
    } else if (status === 'failed') {
      // Update job as failed
      await supabase1.from('ai_generation_jobs').update({
        status: 'failed',
        error_message: error_message || 'Veo 3 video generation failed',
        updated_at: new Date().toISOString()
      }).eq('id', job.id);
    }
    return new Response('Veo 3 webhook processed', {
      status: 200
    });
  } catch (error) {
    console.error('Veo 3 webhook error:', error);
    return new Response('Webhook processing failed', {
      status: 500
    });
  }
}
// ===== REPLICATE WEBHOOK (UPDATED) =====
async function handleReplicateWebhook(supabase1, webhookData) {
  // Similar to handleRunwayWebhook but for Replicate virtual staging
  const { id: prediction_id, status, output, error } = webhookData;
  try {
    const { data: job, error: jobError } = await supabase1.from('ai_generation_jobs').select('*').eq('external_job_id', prediction_id).single();
    if (jobError || !job) {
      return new Response('Job not found', {
        status: 404
      });
    }
    if (status === 'succeeded' && output) {
      const storedAsset = await downloadAndStoreAsset(supabase1, output[0], job.listing_id, job.user_id, job.job_type, {
        ...job.parameters,
        ai_provider: 'replicate'
      });
      await supabase1.from('ai_generation_jobs').update({
        status: 'completed',
        result_data: {
          asset_id: storedAsset.asset_id,
          download_url: storedAsset.public_url
        },
        processing_time_seconds: (Date.now() - new Date(job.created_at).getTime()) / 1000,
        updated_at: new Date().toISOString()
      }).eq('id', job.id);
      await notifyUserJobComplete(supabase1, job, storedAsset);
      // ===== UPDATED: Handle video_pair_generation instead of video_scene =====
      if (job.job_type === 'video_pair_generation' && job.parameters?.parent_job_id) {
        await handleSequentialVideoProcessing(supabase1, job);
      }
    } else if (status === 'failed') {
      await supabase1.from('ai_generation_jobs').update({
        status: 'failed',
        error_message: error?.detail || 'Virtual staging failed',
        updated_at: new Date().toISOString()
      }).eq('id', job.id);
    }
    return new Response('Webhook processed', {
      status: 200
    });
  } catch (error) {
    console.error('Replicate webhook error:', error);
    return new Response('Webhook processing failed', {
      status: 500
    });
  }
}
// ===== ELEVENLABS WEBHOOK =====
async function handleElevenLabsWebhook(supabase1, webhookData) {
  // Similar pattern for ElevenLabs voice generation
  return new Response('ElevenLabs webhook not implemented yet', {
    status: 200
  });
}
// ===== HELPER FUNCTIONS =====
async function downloadAndStoreAsset(supabase1, downloadUrl, listingId, userId, assetKind, metadata) {
  const startTime = Date.now();
  // Download the generated content
  const response = await fetch(downloadUrl);
  if (!response.ok) {
    throw new Error(`Failed to download generated content: ${response.statusText}`);
  }
  const contentBlob = await response.blob();
  // Generate storage path
  const fileExtension = getFileExtensionFromContentType(contentBlob.type);
  const fileName = `${assetKind}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExtension}`;
  const storagePath = listingId ? `${listingId}/${fileName}` : `generic/${fileName}`;
  // Upload to Supabase Storage
  const { data: uploadData, error: uploadError } = await supabase1.storage.from('media-assets').upload(storagePath, contentBlob, {
    cacheControl: '3600',
    upsert: false
  });
  if (uploadError) throw uploadError;
  // Create media asset record
  const { data: assetData, error: assetError } = await supabase1.from('media_assets').insert({
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
  // Get public URL
  const { data: publicUrl } = supabase1.storage.from('media-assets').getPublicUrl(storagePath);
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
async function notifyUserJobComplete(supabase1, job, result) {
  // Implement your notification system here
  console.log(`📧 Notifying user ${job.user_id} that job ${job.id} is complete`);
  // Example: Create in-app notification
  await supabase1.from('notifications').insert({
    user_id: job.user_id,
    type: 'ai_content_ready',
    title: `Your ${job.job_type.replace('_', ' ')} is ready!`,
    message: `Your AI-generated content has been processed and is ready for download.`,
    data: {
      job_id: job.id,
      download_url: result.public_url,
      asset_id: result.asset_id
    },
    created_at: new Date().toISOString()
  });
// Example: Send Supabase Realtime event
/*
  await supabase
    .channel('ai_jobs')
    .send({
      type: 'broadcast',
      event: 'job_complete',
      payload: {
        user_id: job.user_id,
        job_id: job.id,
        job_type: job.job_type,
        result: result
      }
    });
  */ }
