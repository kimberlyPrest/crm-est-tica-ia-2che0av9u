import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "npm:@supabase/supabase-js@2.48.1"
import { corsHeaders } from "../_shared/cors.ts"

Deno.serve(async (req: Request) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const instanceId = url.searchParams.get('instanceId')

    if (!instanceId) {
      throw new Error('instanceId is required')
    }

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Missing Authorization header')
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: authHeader },
      },
    })

    // Fetch instance details
    const { data: instance, error: instanceError } = await supabase
      .from('whatsapp_instances')
      .select('*')
      .eq('id', instanceId)
      .single()

    if (instanceError || !instance) {
      throw new Error('Instance not found')
    }

    const evolutionUrl = Deno.env.get('EVOLUTION_API_URL')
    const evolutionKey = Deno.env.get('EVOLUTION_API_KEY')

    if (!evolutionUrl || !evolutionKey) {
      throw new Error('Evolution API credentials not configured')
    }

    // Fetch status from Evolution API
    const statusRes = await fetch(
      `${evolutionUrl}/instance/connectionState/${instance.instance_name}`,
      {
        headers: {
          apikey: evolutionKey,
        },
      }
    )

    if (!statusRes.ok) {
      throw new Error('Failed to fetch status from Evolution API')
    }

    const statusData = await statusRes.json()
    const state = statusData?.instance?.state

    let newStatus = 'disconnected'
    if (state === 'open') {
      newStatus = 'connected'
    } else if (state === 'connecting') {
      newStatus = 'connecting'
    }

    // If not connected, try to fetch QR Code
    let qrCode = instance.qr_code
    if (newStatus !== 'connected') {
      try {
        const qrRes = await fetch(
          `${evolutionUrl}/instance/connect/${instance.instance_name}`,
          {
            headers: { apikey: evolutionKey },
          }
        )
        if (qrRes.ok) {
          const qrData = await qrRes.json()
          if (qrData?.base64) {
            qrCode = qrData.base64
            newStatus = 'qr_received'
          }
        }
      } catch (e) {
        console.error('Error fetching QR code:', e)
      }
    }

    // Update database
    const { error: updateError } = await supabase
      .from('whatsapp_instances')
      .update({
        connection_status: newStatus,
        qr_code: qrCode,
        updated_at: new Date().toISOString(),
      })
      .eq('id', instanceId)

    if (updateError) throw updateError

    return new Response(JSON.stringify({ success: true, status: newStatus }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
