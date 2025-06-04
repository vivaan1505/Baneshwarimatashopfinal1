import { createClient } from 'npm:@supabase/supabase-js@2.31.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Get user IDs from request body
    const { userIds } = await req.json();
    if (!Array.isArray(userIds)) {
      throw new Error('Invalid userIds format');
    }

    // Fetch users data
    const { data: users, error } = await supabaseAdmin.auth.admin.listUsers();
    if (error) throw error;

    // Filter users by the requested IDs
    const filteredUsers = users.users.filter(user => 
      userIds.includes(user.id)
    ).map(user => ({
      id: user.id,
      email: user.email,
      user_metadata: user.user_metadata
    }));

    return new Response(
      JSON.stringify(filteredUsers),
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error('Error in list-users function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: corsHeaders
      }
    );
  }
});