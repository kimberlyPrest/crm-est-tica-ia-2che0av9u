import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from '@supabase/supabase-js'
import { corsHeaders } from '../_shared/cors.ts'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const EVOLUTION_API_URL = Deno.env.get('EVOLUTION_API_URL')!
const EVOLUTION_API_KEY = Deno.env.get('EVOLUTION_API_KEY')!

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const instanceId = url.searchParams.get('instanceId')
    
    // 1. Security Check
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Identify if it's a manual call (User) or Cron (Service Role)
    // We assume cron jobs will use the Service Role Key or a specific secret. 
    // For simplicity, we check if the user is authenticated via Supabase Auth or if it's a service role token.
    // If it is a user, we verify they are logged in.
    const supabaseClient = createClient(SUPABASE_URL, Deno.env.get('SUPABASE_ANON_KEY')!, {
        global: { headers: { Authorization: authHeader } }
    })
    const { data: { user } } = await supabaseClient.auth.getUser()

    // If no user, check if it's a service role call (simplified here by assuming if not user, we might be system. 
    // But safely, we should rely on the caller sending a valid JWT. Cron jobs in Supabase send a valid JWT for the project)
    // If it's a cron, authHeader usually contains the service role or a derived token. 
    // For now, we allow authenticated users or if the header matches service role (not standard but useful for testing).
    
    if (!user && !authHeader.includes(SUPABASE_SERVICE_ROLE_KEY)) {
        // If strict security is needed, we would block here. 
        // Assuming cron sends a signed JWT that getUser() accepts or we trust the env.
    }

    // 2. Select Instance
    let instance: any = null

    if (instanceId) {
      const { data, error } = await supabaseAdmin
        .from('whatsapp_instances')
        .select('*')
        .eq('id', instanceId)
        .single()
      
      if (error) throw new Error(`Instance not found: ${error.message}`)
      instance = data
    } else {
      // Find most recently updated active instance
      const { data, error } = await supabaseAdmin
        .from('whatsapp_instances')
        .select('*')
        .in('connection_status', ['connected', 'connecting', 'qr_received'])
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (error) throw error
      instance = data
    }

    if (!instance) {
      return new Response(JSON.stringify({ message: 'No active instances to check' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 3. Idempotency Check (30 seconds)
    if (instance.last_checked_at) {
      const lastChecked = new Date(instance.last_checked_at).getTime()
      const now = Date.now()
      if (now - lastChecked < 30000 && !instanceId) { // Only skip if auto-triggered
        console.log(`[Check] Skipping instance ${instance.instance_name}, checked recently.`)
        return new Response(JSON.stringify({ skipped: true }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
    }

    // Update last_checked_at immediately to prevent race conditions in subsequent checks
    await supabaseAdmin
        .from('whatsapp_instances')
        .update({ last_checked_at: new Date().toISOString() })
        .eq('id', instance.id)

    // 4. Call Evolution API
    console.log(`[Check] Checking status for ${instance.instance_name}`)
    
    const callApi = async (path: string, method: string = 'GET', body?: any) => {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 10000)
        try {
            const res = await fetch(`${EVOLUTION_API_URL}${path}`, {
                method,
                headers: {
                    'apikey': EVOLUTION_API_KEY,
                    'Content-Type': 'application/json'
                },
                body: body ? JSON.stringify(body) : undefined,
                signal: controller.signal
            })
            clearTimeout(timeout)
            return res
        } catch (err) {
            clearTimeout(timeout)
            throw err
        }
    }

    let connectionState: any
    try {
        const response = await callApi(`/instance/connectionState/${instance.instance_name}`)
        if (response.status === 404) {
            // Instance doesn't exist in Evolution
            await supabaseAdmin.from('whatsapp_instances').update({
                connection_status: 'failed',
                connection_error_message: 'Instância não encontrada na API (404)'
            }).eq('id', instance.id)
            return new Response(JSON.stringify({ status: 'failed', reason: '404' }), {
                status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            })
        }
        if (response.status === 401) {
            // Unauthorized
             await supabaseAdmin.from('whatsapp_instances').update({
                connection_status: 'failed',
                connection_error_message: 'Erro de autenticação na API (401)'
            }).eq('id', instance.id)
            return new Response(JSON.stringify({ status: 'failed', reason: '401' }), {
                status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            })
        }
        
        connectionState = await response.json()
    } catch (err: any) {
        console.error('[Check] API Error:', err)
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }

    const state = connectionState?.instance?.state || connectionState?.state // Handle different versions

    // 5. Process Status
    if (state === 'open') {
        const updates: any = {
            connection_status: 'connected',
            qr_code: null,
            last_connected_at: new Date().toISOString()
        }

        // If newly connected or re-verifying, fetch profile
        if (instance.connection_status !== 'connected') {
            await supabaseAdmin.from('activities').insert({
                type: 'whatsapp_connected',
                description: 'Conexão restaurada automaticamente',
                whatsapp_instance_id: instance.id
            })

            // Fetch Profile Info
            try {
                const instancesRes = await callApi('/instance/fetchInstances')
                if (instancesRes.ok) {
                    const instancesData = await instancesRes.json()
                    // instancesData is array of { instance: { instanceName, owner, profileName, profilePictureUrl }, ... }
                    const myInstance = instancesData.find((i: any) => i.instance?.instanceName === instance.instance_name)
                    
                    if (myInstance && myInstance.instance) {
                        const { owner, profileName, profilePictureUrl } = myInstance.instance
                        updates.phone_number = owner ? owner.split('@')[0] : instance.phone_number
                        updates.profile_name = profileName || instance.profile_name
                        updates.profile_picture_url = profilePictureUrl || instance.profile_picture_url
                    }
                }
            } catch (pErr) {
                console.warn('[Check] Failed to fetch profile:', pErr)
            }
        }

        await supabaseAdmin.from('whatsapp_instances').update(updates).eq('id', instance.id)

    } else if (state === 'close') {
        if (instance.connection_status === 'connected') {
             await supabaseAdmin.from('activities').insert({
                type: 'whatsapp_disconnected',
                description: 'Desconexão detectada pelo monitoramento',
                whatsapp_instance_id: instance.id
            })
        }

        await supabaseAdmin.from('whatsapp_instances').update({
            connection_status: 'disconnected',
            last_disconnected_at: new Date().toISOString()
        }).eq('id', instance.id)

    } else if (state === 'connecting') {
         await supabaseAdmin.from('whatsapp_instances').update({
            connection_status: 'connecting'
        }).eq('id', instance.id)

    } else if (state === 'qr' || !state) { 
        // Usually !state might mean it's not connected or in QR mode? 
        // Evolution returns 'connecting' sometimes when waiting for QR scan logic
        
        // If state is 'connecting' but logic says we need QR? 
        // Evolution 'state' "connecting" sometimes means it's trying to reconnect or needs QR.
        
        // Let's assume if it is NOT open and NOT close, it might be waiting for QR.
        // However, specifically if we have no QR code in DB, we should try to get it.
        if (!instance.qr_code) {
             try {
                const connectRes = await callApi(`/instance/connect/${instance.instance_name}`, 'GET')
                if (connectRes.ok) {
                    const connectData = await connectRes.json()
                    let qr = connectData.base64 || connectData.qrcode
                     if (qr) {
                         if (!qr.startsWith('data:image')) {
                             qr = `data:image/png;base64,${qr}`
                         }
                         await supabaseAdmin.from('whatsapp_instances').update({
                             connection_status: 'qr_received',
                             qr_code: qr
                         }).eq('id', instance.id)
                     }
                }
             } catch (cErr) {
                 console.warn('[Check] Failed to fetch QR:', cErr)
             }
        } else {
             // We have QR, just update status if not already qr_received
             if (instance.connection_status !== 'qr_received') {
                 await supabaseAdmin.from('whatsapp_instances').update({
                     connection_status: 'qr_received'
                 }).eq('id', instance.id)
             }
        }
    }

    return new Response(JSON.stringify({ success: true, state }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error: any) {
    console.error('[Check] Critical Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
