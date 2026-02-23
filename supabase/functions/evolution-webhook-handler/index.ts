import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

// Initialize Supabase Client with Service Role (Bypasses RLS)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json()
    const { instance, data, event } = body

    console.log(`[Webhook] Received event: ${event} for instance: ${instance}`)

    // 1. Validate Instance and Get Organization ID
    const { data: instanceData, error: instanceError } = await supabase
      .from('whatsapp_instances')
      .select('id, instance_name, organization_id')
      .eq('instance_name', instance)
      .single()

    if (!instanceData || instanceError) {
      console.warn(`[Webhook] Instance not found: ${instance}`)
      return new Response(JSON.stringify({ error: 'Instance not found' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const organizationId = instanceData.organization_id

    // 2. Log Webhook & Check Idempotency
    let messageId: string | null = null
    if (event === 'messages.upsert') {
      messageId = data?.key?.id || data?.id
    }

    if (messageId) {
      const { data: existing } = await supabase
        .from('whatsapp_webhooks')
        .select('id')
        .eq('message_id', messageId)
        .eq('organization_id', organizationId)
        .maybeSingle()

      if (existing) {
        console.log(`[Webhook] Duplicate message ID: ${messageId}`)
        return new Response(
          JSON.stringify({ success: true, duplicate: true }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          },
        )
      }
    }

    const { data: webhookLog, error: logError } = await supabase
      .from('whatsapp_webhooks')
      .insert({
        whatsapp_instance_id: instanceData.id,
        webhook_type: event,
        raw_payload: body,
        processed: false,
        message_id: messageId,
        organization_id: organizationId, // Important: scoped to org
      })
      .select('id')
      .single()

    if (logError) {
      console.error('[Webhook] Log error:', logError)
      throw logError
    }

    // 3. Process Logic
    try {
      if (event === 'connection.update') {
        await handleConnectionUpdate(
          instanceData.id,
          organizationId,
          data,
          supabase,
        )
      } else if (event === 'messages.upsert') {
        await handleMessageUpsert(
          instanceData.id,
          organizationId,
          data,
          supabase,
        )
      } else {
        console.log(`[Webhook] Unhandled event type: ${event}`)
      }

      await supabase
        .from('whatsapp_webhooks')
        .update({
          processed: true,
          processed_at: new Date().toISOString(),
        })
        .eq('id', webhookLog.id)
    } catch (processError: any) {
      console.error('[Webhook] Processing error:', processError)
      await supabase
        .from('whatsapp_webhooks')
        .update({
          processing_error: processError.message,
        })
        .eq('id', webhookLog.id)
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    console.error('[Webhook] Critical error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})

async function handleConnectionUpdate(
  instanceId: string,
  organizationId: string,
  data: any,
  supabase: any,
) {
  const state = data?.state

  if (state === 'open') {
    await supabase
      .from('whatsapp_instances')
      .update({
        connection_status: 'connected',
        qr_code: null,
        last_connected_at: new Date().toISOString(),
      })
      .eq('id', instanceId)

    await supabase.from('activities').insert({
      type: 'whatsapp_connected',
      description: 'WhatsApp conectado com sucesso',
      whatsapp_instance_id: instanceId,
      organization_id: organizationId,
    })
  } else if (state === 'close') {
    await supabase
      .from('whatsapp_instances')
      .update({
        connection_status: 'disconnected',
        last_disconnected_at: new Date().toISOString(),
        connection_error_message: 'Desconectado pelo evento de conexão',
      })
      .eq('id', instanceId)

    await supabase.from('activities').insert({
      type: 'whatsapp_disconnected',
      description: 'WhatsApp desconectado',
      whatsapp_instance_id: instanceId,
      organization_id: organizationId,
    })
  }
}

async function handleMessageUpsert(
  instanceId: string,
  organizationId: string,
  data: any,
  supabase: any,
) {
  const key = data?.key
  const fromMe = key?.fromMe

  if (fromMe) return

  const remoteJid = key?.remoteJid || ''
  const phone = remoteJid.replace('@s.whatsapp.net', '').replace(/[^0-9]/g, '')

  if (!phone) {
    console.warn('[Webhook] Could not extract phone number')
    return
  }

  // Find or Create Lead (Scoped to Organization)
  let leadId = ''

  const { data: existingLead } = await supabase
    .from('leads')
    .select('id, name, status_id, ai_agent_blocked')
    .eq('phone', phone)
    .eq('organization_id', organizationId) // Check org
    .maybeSingle()

  if (existingLead) {
    leadId = existingLead.id
    await supabase
      .from('leads')
      .update({
        last_interaction_at: new Date().toISOString(),
        has_pending_message: true,
      })
      .eq('id', leadId)
  } else {
    // Get default "Novo" status for this Org
    const { data: statusData } = await supabase
      .from('status')
      .select('id')
      .eq('organization_id', organizationId)
      .eq('name', 'Novo') // Prefer Novo
      .limit(1)
      .maybeSingle()

    let statusId = statusData?.id
    if (!statusId) {
      // Fallback
      const { data: anyStatus } = await supabase
        .from('status')
        .select('id')
        .eq('organization_id', organizationId)
        .order('order', { ascending: true })
        .limit(1)
        .maybeSingle()
      statusId = anyStatus?.id
    }

    if (!statusId) throw new Error('No status found for organization')

    const pushName = data?.pushName || 'Lead WhatsApp'

    const { data: newLead, error: createError } = await supabase
      .from('leads')
      .insert({
        phone,
        name: pushName,
        status_id: statusId,
        has_pending_message: true,
        last_interaction_at: new Date().toISOString(),
        organization_id: organizationId,
      })
      .select('id')
      .single()

    if (createError) throw createError
    leadId = newLead.id

    // Log creation activity
    await supabase.from('activities').insert({
      type: 'status_change',
      description: `Lead criado via WhatsApp: ${pushName}`,
      lead_id: leadId,
      whatsapp_instance_id: instanceId,
      organization_id: organizationId,
    })
  }

  // Save Message
  const messageType = data?.messageType || 'unknown'
  let content = ''

  if (data?.message?.conversation) {
    content = data.message.conversation
  } else if (data?.message?.extendedTextMessage?.text) {
    content = data.message.extendedTextMessage.text
  } else if (data?.message?.imageMessage) {
    content = data.message.imageMessage.caption || '[Mídia recebida: Imagem]'
  } else if (data?.message?.audioMessage) {
    content = '[Mídia recebida: Áudio]'
  } else {
    content = '[Mídia recebida]'
  }

  const { data: savedMessage, error: msgError } = await supabase
    .from('messages')
    .insert({
      content,
      direction: 'inbound',
      lead_id: leadId,
      whatsapp_instance_id: instanceId,
      sent_by: 'contact',
      message_type: messageType,
      meta_message_id: key?.id,
      organization_id: organizationId,
    })
    .select('id')
    .single()

  if (msgError) throw msgError

  // AI Orchestration
  await orchestrateAI(
    instanceId,
    organizationId,
    leadId,
    existingLead?.status_id,
    existingLead?.ai_agent_blocked,
    content,
    savedMessage.id,
    supabase,
  )
}

async function orchestrateAI(
  instanceId: string,
  organizationId: string,
  leadId: string,
  statusId: string | undefined,
  agentBlocked: boolean | undefined,
  messageContent: string,
  messageId: string,
  supabase: any,
) {
  // Check Agent Config
  const { data: agentConfig } = await supabase
    .from('agent_config')
    .select('*')
    .eq('active_whatsapp_instance_id', instanceId)
    .eq('is_enabled', true)
    .maybeSingle()

  if (!agentConfig) {
    await notifyHuman(leadId, messageContent, organizationId, supabase)
    return
  }

  // Check Blocked
  if (agentBlocked) {
    await notifyHuman(leadId, messageContent, organizationId, supabase)
    return
  }

  // Check Status "Ser Humano"
  if (statusId) {
    const { data: status } = await supabase
      .from('status')
      .select('name')
      .eq('id', statusId)
      .single()
    if (status && status.name === 'Ser Humano') {
      await notifyHuman(leadId, messageContent, organizationId, supabase)
      return
    }
  }

  // Trigger AI
  console.log(
    `[Webhook] Triggering AI for lead ${leadId} in org ${organizationId}`,
  )
  await supabase.functions.invoke('gemini-process-message', {
    body: {
      leadId,
      messageContent,
      messageId,
      agentConfigId: agentConfig.id,
      organizationId,
    },
  })
}

async function notifyHuman(
  leadId: string,
  messageContent: string,
  organizationId: string,
  supabase: any,
) {
  const snippet = messageContent.slice(0, 100)
  await supabase.from('notifications').insert({
    title: 'Intervenção Necessária',
    message: `Lead requer atenção humana: "${snippet}..."`,
    type: 'lead_to_human',
    priority: 'high',
    lead_id: leadId,
    is_read: false,
    organization_id: organizationId,
  })
}
