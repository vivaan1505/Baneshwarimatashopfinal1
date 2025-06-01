import { createClient } from 'npm:@supabase/supabase-js@2.39.7'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    const { email, password, metadata } = await req.json()

    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: metadata
    })

    if (authError) throw authError
    if (!authData.user) throw new Error('Failed to create user')

    // 2. Create public user
    const { error: publicUserError } = await supabase
      .from('users')
      .insert([{
        id: authData.user.id,
        email: email,
        first_name: metadata.first_name,
        last_name: metadata.last_name
      }])

    if (publicUserError) {
      // Cleanup auth user if public user creation fails
      await supabase.auth.admin.deleteUser(authData.user.id)
      throw publicUserError
    }

    // 3. Add admin role
    const { error: adminError } = await supabase
      .from('admin_users')
      .insert([{
        user_id: authData.user.id,
        role: 'admin'
      }])

    if (adminError) {
      // Cleanup both auth and public user if admin role assignment fails
      await supabase.auth.admin.deleteUser(authData.user.id)
      throw adminError
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Admin user ${email} created successfully.`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: error.message || 'Failed to create admin user'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})