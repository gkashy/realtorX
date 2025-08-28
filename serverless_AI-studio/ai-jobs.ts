// supabase/functions/ai-jobs/index.ts
// Job management functions: status checking, results, cancellation, listing
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
      case 'check_job_status':
        return await checkJobStatus(supabase, userContext, data);
      case 'get_job_result':
        return await getJobResult(supabase, userContext, data);
      case 'cancel_job':
        return await cancelJob(supabase, userContext, data);
      case 'list_user_jobs':
        return await listUserJobs(supabase, userContext, data);
      case 'list_templates':
        return await listAvailableTemplates(supabase, userContext);
      default:
        return new Response('Invalid action', {
          status: 400
        });
    }
  } catch (error) {
    console.error('Error in ai-jobs:', error);
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
// ===== CHECK JOB STATUS =====
async function checkJobStatus(supabase, userContext, data) {
  const { job_id } = data;
  try {
    const { data: job, error: jobError } = await supabase.from('ai_generation_jobs').select('*').eq('id', job_id).eq('company_id', userContext.company_id).single();
    if (jobError || !job) {
      throw new Error('Job not found');
    }
    // Enhanced status for video tours and batch jobs
    let childJobsStatus = null;
    if (job.job_type === 'batch_content' || job.job_type === 'video_tour_master') {
      const { data: childJobs } = await supabase.from('ai_generation_jobs').select('id, job_type, status, listing_id, progress_percentage, result_data, parameters').eq('parameters->>parent_job_id', job_id);
      if (childJobs) {
        const completed = childJobs.filter((j)=>j.status === 'completed');
        const failed = childJobs.filter((j)=>j.status === 'failed');
        const processing = childJobs.filter((j)=>j.status === 'processing');
        const queued = childJobs.filter((j)=>j.status === 'queued');
        childJobsStatus = {
          total: childJobs.length,
          completed: completed.length,
          failed: failed.length,
          processing: processing.length,
          queued: queued.length,
          jobs: childJobs
        };
        // Video tour specific status - UPDATED for video pairs
        if (job.job_type === 'video_tour_master') {
          // Sort child jobs by sequence order for proper sequential tracking
          const sortedJobs = childJobs.sort((a, b)=>(a.parameters?.sequence_order || 0) - (b.parameters?.sequence_order || 0));
          childJobsStatus = {
            ...childJobsStatus,
            total_video_pairs: childJobs.length,
            completed_video_pairs: completed.length,
            overall_progress: Math.round(completed.length / childJobs.length * 100),
            sequential_processing: job.parameters?.sequential_processing || false,
            video_pair_details: sortedJobs.map((vj)=>({
                video_pair_id: vj.id,
                sequence_order: vj.parameters?.sequence_order || 0,
                status: vj.status,
                progress: vj.progress_percentage || 0,
                video_url: vj.result_data?.download_url || null,
                custom_prompt: vj.parameters?.video_pair_data?.prompt || null // NEW
              })),
            ready_for_assembly: completed.length === childJobs.length,
            assembly_status: job.status === 'processing' ? 'assembling_final_video' : 'waiting_for_video_pairs',
            current_processing: processing.length > 0 ? processing[0] : null,
            next_in_queue: queued.length > 0 ? queued.find((j)=>(j.parameters?.sequence_order || 0) === Math.min(...queued.map((q)=>q.parameters?.sequence_order || 0))) : null // NEW: next video pair to process
          };
        }
      }
    }
    return new Response(JSON.stringify({
      success: true,
      data: {
        job_id: job.id,
        status: job.status,
        job_type: job.job_type,
        progress_percentage: job.progress_percentage || 0,
        created_at: job.created_at,
        updated_at: job.updated_at,
        estimated_completion: job.estimated_completion,
        error_message: job.error_message,
        result_data: job.result_data,
        child_jobs: childJobsStatus
      }
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Check job status error:', error);
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
// ===== GET JOB RESULT =====
async function getJobResult(supabase, userContext, data) {
  const { job_id } = data;
  try {
    const { data: job, error: jobError } = await supabase.from('ai_generation_jobs').select('*').eq('id', job_id).eq('company_id', userContext.company_id).single();
    if (jobError || !job) {
      throw new Error('Job not found');
    }
    if (job.status !== 'completed') {
      throw new Error(`Job not completed. Current status: ${job.status}`);
    }
    // Get associated media assets if any
    let mediaAssets = null;
    if (job.result_data?.asset_ids) {
      const { data: assets } = await supabase.from('media_assets').select('id, storage_path, asset_kind, metadata').in('id', job.result_data.asset_ids);
      if (assets) {
        // Generate public URLs for assets
        mediaAssets = assets.map((asset)=>{
          const { data: publicUrl } = supabase.storage.from('media-assets').getPublicUrl(asset.storage_path);
          return {
            ...asset,
            download_url: publicUrl.publicUrl
          };
        });
      }
    }
    return new Response(JSON.stringify({
      success: true,
      data: {
        job_id: job.id,
        job_type: job.job_type,
        status: job.status,
        result_data: job.result_data,
        media_assets: mediaAssets,
        processing_time: job.processing_time_seconds,
        completed_at: job.updated_at
      }
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Get job result error:', error);
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
// ===== CANCEL JOB =====
async function cancelJob(supabase, userContext, data) {
  const { job_id, reason = 'User cancelled' } = data;
  try {
    // Update job status to cancelled
    const { data: job, error: jobError } = await supabase.from('ai_generation_jobs').update({
      status: 'cancelled',
      error_message: reason,
      updated_at: new Date().toISOString()
    }).eq('id', job_id).eq('company_id', userContext.company_id).eq('status', 'queued') // Can only cancel queued jobs
    .select().single();
    if (jobError || !job) {
      throw new Error('Job not found or cannot be cancelled');
    }
    // Cancel any child jobs if it's a batch or video tour - UPDATED for video pairs
    if (job.job_type === 'batch_content' || job.job_type === 'video_tour_master') {
      await supabase.from('ai_generation_jobs').update({
        status: 'cancelled',
        error_message: 'Parent job cancelled',
        updated_at: new Date().toISOString()
      }).eq('parameters->>parent_job_id', job_id).eq('status', 'queued');
    }
    // Track analytics
    await supabase.rpc('fn_track_event', {
      event_name: 'ai_job_cancelled',
      payload: {
        job_id: job_id,
        job_type: job.job_type,
        reason: reason
      }
    });
    return new Response(JSON.stringify({
      success: true,
      data: {
        job_id: job_id,
        status: 'cancelled',
        message: 'Job cancelled successfully'
      }
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Cancel job error:', error);
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
// ===== LIST USER JOBS =====
async function listUserJobs(supabase, userContext, data) {
  const { status_filter, job_type_filter, limit = 20, offset = 0 } = data;
  try {
    let query = supabase.from('ai_generation_jobs').select('id, job_type, status, created_at, updated_at, listing_id, progress_percentage, estimated_completion').eq('company_id', userContext.company_id).order('created_at', {
      ascending: false
    }).range(offset, offset + limit - 1);
    if (status_filter) {
      query = query.eq('status', status_filter);
    }
    if (job_type_filter) {
      query = query.eq('job_type', job_type_filter);
    }
    const { data: jobs, error: jobsError } = await query;
    if (jobsError) throw jobsError;
    // Get total count for pagination
    let countQuery = supabase.from('ai_generation_jobs').select('id', {
      count: 'exact',
      head: true
    }).eq('company_id', userContext.company_id);
    if (status_filter) {
      countQuery = countQuery.eq('status', status_filter);
    }
    if (job_type_filter) {
      countQuery = countQuery.eq('job_type', job_type_filter);
    }
    const { count } = await countQuery;
    return new Response(JSON.stringify({
      success: true,
      data: {
        jobs: jobs || [],
        pagination: {
          total: count || 0,
          limit: limit,
          offset: offset,
          has_more: (count || 0) > offset + limit
        }
      }
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('List jobs error:', error);
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
// ===== LIST AVAILABLE TEMPLATES =====
async function listAvailableTemplates(supabase, userContext) {
  const templates = {
    hero_images: {
      styles: [
        'modern',
        'luxury',
        'minimalist',
        'warm',
        'bold'
      ],
      ai_provider: 'gpt-image-1'
    },
    business_cards: {
      styles: [
        'professional',
        'modern',
        'luxury',
        'minimalist',
        'creative'
      ],
      ai_provider: 'canva'
    },
    social_posts: {
      platforms: [
        'instagram',
        'facebook',
        'linkedin',
        'twitter'
      ],
      types: [
        'listing_showcase',
        'just_listed',
        'open_house',
        'sold',
        'market_update'
      ],
      ai_provider: 'canva'
    },
    flyers: {
      types: [
        'standard',
        'luxury',
        'commercial',
        'rental',
        'open_house'
      ],
      styles: [
        'modern',
        'classic',
        'bold',
        'minimalist'
      ],
      ai_provider: 'canva'
    },
    videos: {
      pixverse_videos: {
        types: [
          'bulk_listing',
          'social_ad',
          'agent_promo',
          'branded_content',
          'slideshow',
          'standard'
        ],
        styles: [
          'slideshow',
          'professional',
          'modern',
          'branded'
        ],
        durations: [
          5,
          10
        ],
        features: [
          'first_last_frame_transitions',
          'sequential_processing'
        ],
        use_cases: [
          'Intelligent image pairing with GPT-4o filtering',
          'Sequential video generation for consistent quality',
          'Custom prompts per video pair transition',
          'Smooth transitions between property areas',
          'Professional real estate video tours'
        ],
        ai_provider: 'pixverse' // UPDATED: from runway
      },
      veo3_videos: {
        types: [
          'cinematic_promo',
          'lifestyle',
          'ultra_cinematic'
        ],
        styles: [
          'cinematic',
          'ultra_cinematic',
          'lifestyle',
          'dramatic'
        ],
        durations: [
          5,
          10,
          15
        ],
        features: [
          'natural_voiceover',
          'environmental_audio',
          'ultra_high_quality'
        ],
        use_cases: [
          'Ultra-cinematic, high-end 10-second promos for listings',
          'Natural voiceovers or environmental audio automatically',
          'Lifestyle shots in ads showing dream life scenarios',
          'Dramatic property reveals with golden hour lighting'
        ],
        ai_provider: 'veo3'
      }
    },
    copy_types: {
      types: [
        'listing_description',
        'social_caption',
        'email_subject',
        'ad_headline',
        'blog_post'
      ],
      tones: [
        'professional',
        'casual',
        'luxury',
        'urgent',
        'friendly'
      ],
      ai_provider: 'openai'
    },
    virtual_staging: {
      styles: [
        'modern',
        'traditional',
        'luxury',
        'minimalist',
        'bohemian'
      ],
      room_types: [
        'living_room',
        'bedroom',
        'kitchen',
        'dining_room',
        'office'
      ],
      features: [
        'furniture_swap',
        'day_night_toggle',
        'clutter_removal',
        'style_themes'
      ],
      ai_provider: 'openai'
    },
    ai_provider_guide: {
      pixverse: {
        best_for: [
          'Intelligent image pair video generation',
          'Sequential processing for consistent quality',
          'GPT-4o powered scene planning and filtering',
          'Custom prompts per transition',
          'Professional real estate video tours',
          'Smooth first-to-last frame transitions'
        ],
        typical_duration: '5-10 seconds per video pair',
        processing_time: '60 seconds per video pair',
        output_quality: 'Professional 540p-1080p',
        special_features: 'First+last frame transition capability' // NEW
      },
      veo3: {
        best_for: [
          'Ultra-cinematic property promos (5-15 seconds)',
          'High-end luxury listings',
          'Lifestyle and aspiration marketing',
          'Content with natural voiceovers',
          'Dramatic property reveals',
          'Premium brand positioning'
        ],
        typical_duration: '5-15 seconds',
        processing_time: '1-2 minutes',
        output_quality: 'Ultra-cinematic, film-grade'
      }
    }
  };
  return new Response(JSON.stringify({
    success: true,
    data: templates,
    message: 'Available templates and AI provider guide retrieved successfully'
  }), {
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json'
    }
  });
}
