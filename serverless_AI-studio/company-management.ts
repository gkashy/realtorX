// supabase/functions/company-management/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};
Deno.serve(async (req)=>{
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders
    });
  }
  try {
    // Initialize Supabase client with service role
    const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
    // Get user from JWT token
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
      case 'create':
        return await createCompany(supabase, user.id, data.name);
      case 'invite':
        return await inviteUser(supabase, data.company_id, data.email, data.role);
      case 'join':
        return await joinCompany(supabase, user.id, data.token);
      case 'get_context':
        return await getUserContext(supabase, user.id);
      default:
        return new Response('Invalid action', {
          status: 400
        });
    }
  } catch (error) {
    console.error('Error:', error);
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
async function createCompany(supabase, userAuthId, companyName) {
  const { data, error } = await supabase.rpc('create_company_with_owner', {
    company_name: companyName,
    user_auth_id: userAuthId
  });
  if (error) throw error;
  return new Response(JSON.stringify({
    success: true,
    company_id: data,
    message: 'Company created successfully'
  }), {
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json'
    }
  });
}
async function getUserContext(supabase, userAuthId) {
  const { data, error } = await supabase.rpc('get_user_context', {
    user_auth_id: userAuthId // Pass the user ID as parameter
  });
  if (error) throw error;
  return new Response(JSON.stringify({
    success: true,
    data: data[0] || null
  }), {
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json'
    }
  });
}
async function inviteUser(supabase, companyId, email, role) {
  const { data: token, error } = await supabase.rpc('invite_user_to_company', {
    company_id: companyId,
    email: email,
    role: role
  });
  if (error) throw error;
  return new Response(JSON.stringify({
    success: true,
    invite_token: token,
    message: 'Invitation sent successfully'
  }), {
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json'
    }
  });
}
async function joinCompany(supabase, userAuthId, token) {
  // Get invitation details
  const { data: invitation, error: inviteError } = await supabase.from('invitations').select('*').eq('token', token).is('used_at', null) // Better syntax
  .gt('expires_at', 'now()').single();
  if (inviteError || !invitation) {
    throw new Error('Invalid or expired invitation');
  }
  // Get user ID
  const { data: user, error: userError } = await supabase.from('users').select('id').eq('auth_id', userAuthId).single();
  if (userError || !user) {
    throw new Error('User not found');
  }
  // Add user to company
  const { error: membershipError } = await supabase.from('company_memberships').insert({
    company_id: invitation.company_id,
    user_id: user.id,
    role: invitation.role
  });
  if (membershipError) throw membershipError;
  // Mark invitation as used
  await supabase.from('invitations').update({
    used_at: new Date().toISOString()
  }).eq('id', invitation.id);
  // Update user's default company if they don't have one
  await supabase.from('users').update({
    default_company_id: invitation.company_id
  }).eq('id', user.id).is('default_company_id', null);
  return new Response(JSON.stringify({
    success: true,
    company_id: invitation.company_id,
    message: 'Successfully joined company'
  }), {
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json'
    }
  });
}
