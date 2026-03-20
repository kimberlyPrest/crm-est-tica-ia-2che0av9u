import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from '@supabase/supabase-js'
import { corsHeaders } from '../_shared/cors.ts'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const EVOLUTION_API_URL = Deno.env.get('EVOLUTION_API_URL')!
const EVOLUTION_API_KEY = Deno.env.get('EVOLUTION_API_KEY')!

Deno.serve(async (req) => {
  // 1. Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 2. Auth Check
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Missing Authorization header')
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Validate User (using anon key would be standard, but we use service role for DB actions later.
    // We verify the token manually or use a client with the token.)
    const supabaseAuth = createClient(
      SUPABASE_URL,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      {
        global: { headers: { Authorization: authHeader } },
      },
    )
    const {
      data: { user },
      error: authError,
    } = await supabaseAuth.auth.getUser()

    if (authError || !user) {
      return new Response(
        JSON.stringify({
          error: 'Unauthorized',
          message: 'Invalid or missing token',
        }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    // 3. Input Validation
    const { leadId, message, sentBy, messageType = 'text', mediaUrl } = await req.json().catch(() => ({}))

    if (!leadId || (!message && !mediaUrl) || !sentBy) {
      return new Response(
        JSON.stringify({
          error: 'Bad Request',
          message: 'Missing required fields: leadId, message (or mediaUrl), sentBy',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    if (!['ai', 'human', 'system'].includes(sentBy)) {
      return new Response(
        JSON.stringify({
          error: 'Bad Request',
          message: 'Invalid sentBy value. Must be ai, human, or system',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    const trimmedMessage = message ? message.trim() : ''

    // 4. Rate Limiting (20 messages per minute per lead context)
    const oneMinuteAgo = new Date(Date.now() - 60000).toISOString()
    const { count: recentMessagesCount, error: rateLimitError } = await supabase
      .from('messages')
      .select('id', { count: 'exact', head: true })
      .eq('lead_id', leadId)
      .eq('direction', 'outbound')
      .gte('created_at', oneMinuteAgo)

    if (rateLimitError) {
      throw new Error(`Rate limit check failed: ${rateLimitError.message}`)
    }

    if ((recentMessagesCount || 0) >= 20) {
      return new Response(
        JSON.stringify({
          error: 'Too Many Requests',
          message:
            'Rate limit exceeded. Please wait before sending more messages to this lead.',
        }),
        {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    // 5. Fetch Lead
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('phone, name')
      .eq('id', leadId)
      .single()

    if (leadError || !lead) {
      return new Response(
        JSON.stringify({ error: 'Not Found', message: 'Lead not found' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    if (!lead.phone) {
      return new Response(
        JSON.stringify({
          error: 'Bad Request',
          message: 'Lead has no phone number',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    // 6. Fetch Active Instance
    const { data: instance, error: instanceError } = await supabase
      .from('whatsapp_instances')
      .select('id, instance_name')
      .eq('connection_status', 'connected')
      .limit(1)
      .maybeSingle()

    if (instanceError) {
      throw new Error(
        `Database error fetching instance: ${instanceError.message}`,
      )
    }

    if (!instance) {
      return new Response(
        JSON.stringify({
          error: 'Service Unavailable',
          message: 'No connected WhatsApp instance found',
        }),
        {
          status: 503,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    // 7. Normalize Phone
    const cleanPhone = lead.phone.replace(/[^0-9]/g, '')
    const remoteJid = `${cleanPhone}@s.whatsapp.net`

    // 8. Send to Evolution API
    let sendUrl = `${EVOLUTION_API_URL}/message/sendText/${instance.instance_name}`
    let bodyPayload: any = {
      number: remoteJid,
      text: trimmedMessage,
      linkPreview: false,
    }

    if (messageType === 'audio' && mediaUrl) {
      sendUrl = `${EVOLUTION_API_URL}/message/sendWhatsAppAudio/${instance.instance_name}`
      bodyPayload = {
        number: remoteJid,
        audio: mediaUrl,
        delay: 2000
      }
    } else if (messageType === 'document' && mediaUrl) {
      sendUrl = `${EVOLUTION_API_URL}/message/sendMedia/${instance.instance_name}`
      bodyPayload = {
        number: remoteJid,
        mediatype: "document",
        media: mediaUrl,
        delay: 2000
      }
    }

    let evolutionData: any = null
    let attempt = 0
    const maxRetries = 1

    while (attempt <= maxRetries) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 15000) // 15s timeout

        const response = await fetch(sendUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: EVOLUTION_API_KEY,
          },
          body: JSON.stringify(bodyPayload),
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (response.ok) {
          evolutionData = await response.json()
          break
        }

        // If 500 or 503, retry
        if (response.status === 500 || response.status === 503) {
          throw new Error(`Temporary API Error: ${response.status}`)
        }

        // Non-retryable error
        const errorText = await response.text()
        throw new Error(
          `Evolution API Error (${response.status}): ${errorText}`,
        )
      } catch (err: any) {
        attempt++
        console.warn(
          `[evolution-send-message] Attempt ${attempt} failed:`,
          err.message,
        )

        if (attempt > maxRetries) {
          // Log failure to DB as per requirements
          const failureMessage = `[ERRO DE ENVIO] ${trimmedMessage} - Detalhes: ${err.message}`
          await supabase.from('messages').insert({
            lead_id: leadId,
            content: failureMessage.slice(0, 4000), // Ensure it fits
            direction: 'outbound',
            sent_by: sentBy,
            message_type: 'text',
            whatsapp_instance_id: instance.id,
          })

          return new Response(
            JSON.stringify({
              error: 'External Service Error',
              message: `Failed to send message after retries: ${err.message}`,
            }),
            {
              status: 502,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            },
          )
        }

        // Wait 2s before retry
        await new Promise((r) => setTimeout(r, 2000))
      }
    }

    // 9. Process Success
    const messageId = evolutionData?.key?.id
    if (!messageId) {
      console.warn(
        '[evolution-send-message] Warning: No messageId returned from Evolution API',
      )
    }

    // 10. Database Updates
    const { data: storedMessage, error: msgError } = await supabase
      .from('messages')
      .insert({
        lead_id: leadId,
        content: messageType === 'audio' ? '[Áudio Enviado]' : messageType === 'document' ? '[Documento Enviado]' : trimmedMessage,
        direction: 'outbound',
        sent_by: sentBy,
        message_type: messageType,
        meta_message_id: messageId,
        whatsapp_instance_id: instance.id,
      })
      .select()
      .single()

    if (msgError) {
      console.error(
        '[evolution-send-message] Failed to store message:',
        msgError,
      )
      // We still return success because the message WAS sent
    }

    // Update Lead
    await supabase
      .from('leads')
      .update({
        last_interaction_at: new Date().toISOString(),
        has_pending_message: false,
      })
      .eq('id', leadId)

    // Log Activity
    const senderLabel =
      sentBy === 'ai' ? 'IA' : sentBy === 'human' ? 'Humano' : 'Sistema'
    await supabase.from('activities').insert({
      lead_id: leadId,
      type: 'message_sent',
      description: `Mensagem enviada por ${senderLabel}`,
      whatsapp_instance_id: instance.id,
    })

    return new Response(
      JSON.stringify({
        success: true,
        messageId: storedMessage?.id,
        metaMessageId: messageId,
        sentAt: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error: any) {
    console.error('[evolution-send-message] Critical error:', error)
    return new Response(
      JSON.stringify({
        error: 'Internal Server Error',
        message: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})
