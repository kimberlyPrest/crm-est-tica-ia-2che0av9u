import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Authenticate User to get Organization Context
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) throw new Error('Missing Authorization header')

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    )

    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser()

    if (authError || !user) throw new Error('Unauthorized')

    // Get Organization ID from public.users
    const { data: userData, error: userError } = await supabaseClient
      .from('users')
      .select('organization_id')
      .eq('id', user.id)
      .single()

    if (userError || !userData) throw new Error('User profile not found')
    const organizationId = userData.organization_id

    // 2. Setup Service Role Client for Admin Ops (Insert into whatsapp_instances)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const EVOLUTION_API_URL = Deno.env.get('EVOLUTION_API_URL')!
    const EVOLUTION_API_KEY = Deno.env.get('EVOLUTION_API_KEY')!

    if (!EVOLUTION_API_URL || !EVOLUTION_API_KEY) {
      throw new Error('Evolution API configuration is missing')
    }

    // Generate instance name: unique per org to avoid collision
    const instanceName = `instance_${organizationId.replace(/-/g, '').slice(0, 12)}`

    // Call Evolution API
    const createRes = await fetch(`${EVOLUTION_API_URL}/instance/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': EVOLUTION_API_KEY,
      },
      body: JSON.stringify({
        instanceName,
        qrcode: true,
        integration: 'WHATSAPP-BAILEYS',
        webhook: Deno.env.get('WEBHOOK_URL') // Optional, if they have a global webhook configured
      }),
    })

    if (!createRes.ok) {
      const errorText = await createRes.text()
      throw new Error(`Evolution API Error: ${errorText}`)
    }

    const evoData = await createRes.json()
    const qrCode = evoData?.qrcode?.base64 || evoData?.hash?.qrcode || null // Adjust based on Evolution API version

    // Upsert instance into DB
    const { data: instance, error: dbError } = await supabaseAdmin
      .from('whatsapp_instances')
      .upsert(
        {
          instance_name: instanceName,
          organization_id: organizationId,
          connection_status: 'connecting',
          updated_at: new Date().toISOString(),
          qr_code: qrCode,
        },
        { onConflict: 'instance_name' },
      )
      .select()
      .single()

    if (dbError) throw dbError

    return new Response(
      JSON.stringify({
        status: 'connecting',
        instanceId: instance.id,
        instanceName,
        qr: instance.qr_code,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
