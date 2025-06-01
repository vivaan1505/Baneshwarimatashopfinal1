import { createClient } from 'npm:@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    })
  }

  try {
    // Check for required environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error('Missing required environment variables: SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY')
    }

    // Initialize Supabase client with service role key
    const supabaseAdmin = createClient(
      supabaseUrl,
      supabaseServiceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    // Verify the request is from an admin
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header provided' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const {
      data: { user },
      error: verifyError,
    } = await supabaseAdmin.auth.getUser(token)

    if (verifyError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired token' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Check if the user is an admin
    const { data: adminCheck } = await supabaseAdmin
      .from('admin_users')
      .select('role')
      .eq('user_id', user.id)

    if (!adminCheck || adminCheck.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Admin access required' }),
        {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Get the list of user IDs from the request body if provided
    let userIds: string[] = []
    if (req.method === 'POST') {
      try {
        const body = await req.json()
        userIds = body.userIds || []
      } catch (error) {
        console.error('Error parsing request body:', error)
      }
    }

    // Fetch users based on provided IDs or all users if no IDs provided
    const { data: users, error: usersError } = await supabaseAdmin.auth.admin.listUsers()
    if (usersError) {
      throw usersError
    }

    let filteredUsers = users.users
    if (userIds.length > 0) {
      filteredUsers = users.users.filter(user => userIds.includes(user.id))
    }

    // Get admin statuses
    const { data: adminUsers, error: adminUsersError } = await supabaseAdmin
      .from('admin_users')
      .select('user_id, role')

    if (adminUsersError) {
      throw adminUsersError
    }

    // Combine user data with admin status
    const enhancedUsers = filteredUsers.map(user => ({
      ...user,
      is_admin: adminUsers?.some(admin => admin.user_id === user.id) || false
    }))

    return new Response(
      JSON.stringify(enhancedUsers),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Edge function error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        details: Deno.env.get('DENO_ENV') === 'development' ? error.stack : undefined
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: error.status || 500,
      }
    )
  }
})