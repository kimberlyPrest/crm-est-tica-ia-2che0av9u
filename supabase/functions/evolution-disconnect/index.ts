import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from '@supabase/supabase-js'
import { corsHeaders } from '../_shared/cors.ts'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!
const EVOLUTION_API_URL = Deno.env.get('EVOLUTION_API_URL')!
const EVOLUTION_API_KEY = Deno.env.get('EVOLUTION_API_KEY')!

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { instanceId } = await req.json().catch(() => ({}))

    if (!instanceId) {
       return new Response(JSON.stringify({ error: 'Missing instanceId' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 1. Auth & Role Verification
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        global: { headers: { Authorization: authHeader } }
    })
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()

    if (authError || !user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }

    const { data: userData } = await supabaseAdmin.from('users').select('role').eq('id', user.id).single()
    if (!userData || userData.role !== 'admin') {
         return new Response(JSON.stringify({ error: 'Forbidden: Admins only' }), {
            status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }

    // 2. Get Instance Info
    const { data: instance, error: instError } = await supabaseAdmin
        .from('whatsapp_instances')
        .select('instance_name')
        .eq('id', instanceId)
        .single()
    
    if (instError || !instance) {
        return new Response(JSON.stringify({ error: 'Instance not found' }), {
            status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }

    // 3. Call Evolution API (Logout & Delete)
    const callApi = async (path: string, method: string = 'DELETE') => {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 8000) // 8s timeout
        try {
            const res = await fetch(`${EVOLUTION_API_URL}${path}`, {
                method,
                headers: { 'apikey': EVOLUTION_API_KEY },
                signal: controller.signal
            })
            clearTimeout(timeout)
            return res
        } catch (err) {
            clearTimeout(timeout)
            throw err
        }
    }

    let apiSuccess = true
    let apiErrorMsg = ''

    try {
        // Logout
        console.log(`[Disconnect] Logging out ${instance.instance_name}`)
        await callApi(`/instance/logout/${instance.instance_name}`)
        
        // Delete
        console.log(`[Disconnect] Deleting ${instance.instance_name}`)
        const delRes = await callApi(`/instance/delete/${instance.instance_name}`)
        if (!delRes.ok && delRes.status !== 404) {
             // 404 is fine (already deleted)
             apiSuccess = false
             apiErrorMsg = `Delete failed: ${delRes.status}`
        }
    } catch (err: any) {
        console.error('[Disconnect] API Error:', err)
        apiSuccess = false
        apiErrorMsg = err.message
    }

    // 4. Update Database
    console.log('[Disconnect] Updating database...')
    
    // Update whatsapp_instances
    await supabaseAdmin.from('whatsapp_instances').update({
        connection_status: 'disconnected',
        phone_number: null,
        profile_name: null,
        profile_picture_url: null,
        qr_code: null,
        connection_error_message: apiSuccess ? 'Desconectado manualmente' : `Desconectado manualmente (Erro API: ${apiErrorMsg})`,
        last_disconnected_at: new Date().toISOString()
    }).eq('id', instanceId)

    // Update agent_config
    await supabaseAdmin.from('agent_config').update({
        active_whatsapp_instance_id: null
    }).eq('active_whatsapp_instance_id', instanceId)

    // Log Activity
    await supabaseAdmin.from('activities').insert({
        type: 'whatsapp_disconnected',
        description: 'WhatsApp desconectado manualmente',
        whatsapp_instance_id: instanceId
    })

    if (!apiSuccess) {
         return new Response(JSON.stringify({ partialSuccess: true, error: apiErrorMsg }), {
            status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }

    return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error: any) {
    console.error('[Disconnect] Critical Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
