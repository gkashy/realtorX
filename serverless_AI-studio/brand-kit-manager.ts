// supabase/functions/brand-kit-manager/index.ts
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
    // Get user from JWT
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
    // Get user context (company_id, role)
    const { data: context, error: contextError } = await supabase.rpc('get_user_context', {
      user_auth_id: user.id
    });
    if (contextError || !context || context.length === 0) {
      return new Response('User context not found', {
        status: 403
      });
    }
    const userContext = context[0];
    const { action, data, kit_id } = await req.json();
    switch(action){
      case 'create':
        return await createBrandKit(supabase, userContext, data);
      case 'list':
        return await listBrandKits(supabase, userContext);
      case 'update_theme':
        return await updateTheme(supabase, kit_id, data);
      case 'set_default':
        return await setDefault(supabase, userContext, kit_id);
      case 'upload_asset':
        return await uploadAsset(supabase, kit_id, data);
      case 'delete_asset':
        return await deleteAsset(supabase, data.asset_id);
      case 'get_assets':
        return await getAssets(supabase, kit_id);
      default:
        return new Response('Invalid action', {
          status: 400
        });
    }
  } catch (error) {
    console.error('Error in brand-kit-manager:', error);
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
async function createBrandKit(supabase, userContext, kitData) {
  // Verify user can create brand kits (admin+ role)
  if (![
    'owner',
    'admin'
  ].includes(userContext.role)) {
    return new Response('Insufficient permissions - only owners and admins can create brand kits', {
      status: 403
    });
  }
  const { data, error } = await supabase.from('brand_kits').insert({
    company_id: userContext.company_id,
    name: kitData.name,
    theme: kitData.theme || {},
    voice: kitData.voice || '',
    website_url: kitData.website_url || '',
    is_default: kitData.is_default || false
  }).select().single();
  if (error) throw error;
  // If this is set as default, clear other defaults
  if (kitData.is_default) {
    await supabase.rpc('fn_clear_other_defaults', {
      company_id: userContext.company_id,
      new_default_id: data.id
    });
  }
  // Track analytics
  await supabase.rpc('fn_track_event', {
    event_name: 'brand_kit_created',
    payload: {
      brand_kit_id: data.id,
      name: data.name
    }
  });
  return new Response(JSON.stringify({
    success: true,
    data: data,
    message: 'Brand kit created successfully'
  }), {
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json'
    }
  });
}
async function listBrandKits(supabase, userContext) {
  const { data, error } = await supabase.from('brand_kits').select(`
      id,
      name,
      is_default,
      theme,
      voice,
      website_url,
      created_at,
      brand_assets(
        id,
        asset_kind,
        storage_path,
        alt_text,
        status
      )
    `).eq('company_id', userContext.company_id).order('created_at', {
    ascending: false
  });
  if (error) throw error;
  return new Response(JSON.stringify({
    success: true,
    data: data
  }), {
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json'
    }
  });
}
async function updateTheme(supabase, kitId, themeData) {
  const { data, error } = await supabase.from('brand_kits').update({
    theme: themeData.theme,
    voice: themeData.voice,
    website_url: themeData.website_url
  }).eq('id', kitId).select().single();
  if (error) throw error;
  // Track analytics
  await supabase.rpc('fn_track_event', {
    event_name: 'brand_kit_updated',
    payload: {
      brand_kit_id: kitId,
      action: 'theme_update'
    }
  });
  return new Response(JSON.stringify({
    success: true,
    data: data,
    message: 'Brand kit theme updated successfully'
  }), {
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json'
    }
  });
}
async function setDefault(supabase, userContext, kitId) {
  // Verify user can set defaults (admin+ role)
  if (![
    'owner',
    'admin'
  ].includes(userContext.role)) {
    return new Response('Insufficient permissions', {
      status: 403
    });
  }
  // Clear other defaults first
  await supabase.rpc('fn_clear_other_defaults', {
    company_id: userContext.company_id,
    new_default_id: kitId
  });
  // Set this one as default
  const { data, error } = await supabase.from('brand_kits').update({
    is_default: true
  }).eq('id', kitId).eq('company_id', userContext.company_id).select().single();
  if (error) throw error;
  // Track analytics
  await supabase.rpc('fn_track_event', {
    event_name: 'brand_kit_set_default',
    payload: {
      brand_kit_id: kitId
    }
  });
  return new Response(JSON.stringify({
    success: true,
    data: data,
    message: 'Brand kit set as default successfully'
  }), {
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json'
    }
  });
}
async function uploadAsset(supabase, kitId, assetData) {
  const { files } = assetData;
  // Verify brand kit exists and user has access
  const { data: kit, error: kitError } = await supabase.from('brand_kits').select('id, company_id').eq('id', kitId).single();
  if (kitError || !kit) {
    return new Response('Brand kit not found', {
      status: 404
    });
  }
  const uploadPromises = files.map(async (file)=>{
    const fileExtension = file.name.split('.').pop();
    const fileName = `brand-kits/${kitId}/${crypto.randomUUID()}.${fileExtension}`;
    // Generate presigned upload URL
    const { data: signedUrl, error } = await supabase.storage.from('brand-assets').createSignedUploadUrl(fileName, {
      upsert: true
    });
    if (error) throw error;
    return {
      file_name: file.name,
      upload_url: signedUrl.signedUrl,
      storage_path: fileName,
      asset_kind: getBrandAssetKind(file.type),
      brand_kit_id: kitId
    };
  });
  const uploadUrls = await Promise.all(uploadPromises);
  return new Response(JSON.stringify({
    success: true,
    data: uploadUrls,
    message: 'Upload URLs generated successfully'
  }), {
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json'
    }
  });
}
async function deleteAsset(supabase, assetId) {
  // Get asset info
  const { data: asset, error: assetError } = await supabase.from('brand_assets').select('storage_path').eq('id', assetId).single();
  if (assetError || !asset) {
    return new Response('Asset not found', {
      status: 404
    });
  }
  // Delete from storage
  const { error: storageError } = await supabase.storage.from('brand-assets').remove([
    asset.storage_path
  ]);
  if (storageError) {
    console.error('Storage deletion error:', storageError);
  }
  // Delete from database
  const { error: dbError } = await supabase.from('brand_assets').delete().eq('id', assetId);
  if (dbError) throw dbError;
  return new Response(JSON.stringify({
    success: true,
    message: 'Asset deleted successfully'
  }), {
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json'
    }
  });
}
async function getAssets(supabase, kitId) {
  const { data, error } = await supabase.from('brand_assets').select('*').eq('brand_kit_id', kitId).eq('status', 'published').order('created_at', {
    ascending: false
  });
  if (error) throw error;
  return new Response(JSON.stringify({
    success: true,
    data: data
  }), {
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json'
    }
  });
}
function getBrandAssetKind(mimeType) {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  return 'image' // default
  ;
}
