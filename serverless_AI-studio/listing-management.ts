// supabase/functions/listing-management/index.ts
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
    const { action, data, listing_id } = await req.json();
    switch(action){
      case 'create':
        return await createListing(supabase, userContext, data);
      case 'read':
        return await readListing(supabase, listing_id);
      case 'update':
        return await updateListing(supabase, listing_id, data);
      case 'delete':
        return await deleteListing(supabase, listing_id);
      case 'publish':
        return await publishListing(supabase, listing_id);
      case 'list':
        return await listListings(supabase, userContext);
      default:
        return new Response('Invalid action', {
          status: 400
        });
    }
  } catch (error) {
    console.error('Error in listing-management:', error);
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
async function createListing(supabase, userContext, listingData) {
  // Verify user can create listings (agent+ role)
  if (![
    'owner',
    'admin',
    'agent'
  ].includes(userContext.role)) {
    return new Response('Insufficient permissions', {
      status: 403
    });
  }
  const { data, error } = await supabase.from('listings').insert({
    ...listingData,
    company_id: userContext.company_id,
    status: 'draft'
  }).select().single();
  if (error) throw error;
  // Track analytics
  await supabase.rpc('fn_track_event', {
    event_name: 'listing_created',
    payload: {
      listing_id: data.id,
      action: 'create'
    }
  });
  return new Response(JSON.stringify({
    success: true,
    data: data,
    message: 'Listing created successfully'
  }), {
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json'
    }
  });
}
async function readListing(supabase, listingId) {
  const { data, error } = await supabase.from('listings').select(`
      *,
      media_assets(*),
      virtual_tours(*),
      company:companies(name)
    `).eq('id', listingId).single();
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
async function updateListing(supabase, listingId, updateData) {
  const { data, error } = await supabase.from('listings').update(updateData).eq('id', listingId).select().single();
  if (error) throw error;
  return new Response(JSON.stringify({
    success: true,
    data: data,
    message: 'Listing updated successfully'
  }), {
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json'
    }
  });
}
async function deleteListing(supabase, listingId) {
  // Soft delete by setting status to archived
  const { data, error } = await supabase.from('listings').update({
    status: 'archived'
  }).eq('id', listingId).select().single();
  if (error) throw error;
  return new Response(JSON.stringify({
    success: true,
    message: 'Listing archived successfully'
  }), {
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json'
    }
  });
}
async function publishListing(supabase, listingId) {
  const { data, error } = await supabase.from('listings').update({
    status: 'active'
  }).eq('id', listingId).select().single();
  if (error) throw error;
  return new Response(JSON.stringify({
    success: true,
    data: data,
    message: 'Listing published successfully'
  }), {
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json'
    }
  });
}
async function listListings(supabase, userContext) {
  const { data, error } = await supabase.from('listings').select(`
      id,
      title,
      address,
      price,
      beds,
      baths,
      sqft,
      status,
      created_at,
      media_assets(id, storage_path, asset_kind)
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
