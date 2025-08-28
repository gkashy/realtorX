// supabase/functions/media-upload/index.ts
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
    const { action, data } = await req.json();
    switch(action){
      case 'get_upload_urls':
        return await generateUploadUrls(supabase, data);
      case 'confirm_upload':
        return await confirmUpload(supabase, data);
      case 'delete_media':
        return await deleteMedia(supabase, data.media_id);
      default:
        return new Response('Invalid action', {
          status: 400
        });
    }
  } catch (error) {
    console.error('Error in media-upload:', error);
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
async function generateUploadUrls(supabase, data) {
  const { listing_id, files } = data;
  // Verify listing exists and user has access
  const { data: listing, error: listingError } = await supabase.from('listings').select('id, company_id').eq('id', listing_id).single();
  if (listingError || !listing) {
    return new Response('Listing not found', {
      status: 404
    });
  }
  const uploadPromises = files.map(async (file)=>{
    const fileExtension = file.name.split('.').pop();
    const fileName = `${listing_id}/${crypto.randomUUID()}.${fileExtension}`;
    // Generate presigned upload URL
    const { data: signedUrl, error } = await supabase.storage.from('media-assets').createSignedUploadUrl(fileName, {
      upsert: true
    });
    if (error) throw error;
    return {
      file_name: file.name,
      upload_url: signedUrl.signedUrl,
      storage_path: fileName,
      asset_kind: getAssetKind(file.type)
    };
  });
  const uploadUrls = await Promise.all(uploadPromises);
  return new Response(JSON.stringify({
    success: true,
    data: uploadUrls
  }), {
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json'
    }
  });
}
async function confirmUpload(supabase, data) {
  const { listing_id, uploaded_files } = data;
  const insertPromises = uploaded_files.map(async (file)=>{
    return supabase.from('media_assets').insert({
      listing_id: listing_id,
      asset_kind: file.asset_kind,
      storage_path: file.storage_path,
      metadata: {
        original_name: file.file_name,
        file_size: file.file_size,
        upload_timestamp: new Date().toISOString()
      }
    });
  });
  await Promise.all(insertPromises);
  return new Response(JSON.stringify({
    success: true,
    message: 'Media assets confirmed successfully'
  }), {
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json'
    }
  });
}
async function deleteMedia(supabase, mediaId) {
  // Get media asset info
  const { data: media, error: mediaError } = await supabase.from('media_assets').select('storage_path').eq('id', mediaId).single();
  if (mediaError || !media) {
    return new Response('Media not found', {
      status: 404
    });
  }
  // Delete from storage
  const { error: storageError } = await supabase.storage.from('media-assets').remove([
    media.storage_path
  ]);
  if (storageError) {
    console.error('Storage deletion error:', storageError);
  }
  // Delete from database
  const { error: dbError } = await supabase.from('media_assets').delete().eq('id', mediaId);
  if (dbError) throw dbError;
  return new Response(JSON.stringify({
    success: true,
    message: 'Media deleted successfully'
  }), {
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json'
    }
  });
}
function getAssetKind(mimeType) {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  return 'image' // default
  ;
}
