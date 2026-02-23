import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')!

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { leadId, messageContent, messageId, agentConfigId, organizationId } =
      await req.json()
    console.log(
      `[GeminiAgent] Processing message ${messageId} for lead ${leadId} in org ${organizationId}`,
    )

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // 1. Fetch Agent Config
    const { data: config, error: configError } = await supabase
      .from('agent_config')
      .select('prompt_context, name')
      .eq('id', agentConfigId)
      .single()

    if (configError || !config) throw new Error('Agent config not found')

    // 2. Fetch Conversation History (last 10 messages)
    const { data: history, error: historyError } = await supabase
      .from('messages')
      .select('content, direction')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false })
      .limit(10)

    if (historyError) throw historyError

    // Reverse history to chronological order
    const formattedHistory = (history || []).reverse().map((msg) => {
      const role = msg.direction === 'inbound' ? 'user' : 'model'
      return { role, parts: [{ text: msg.content }] }
    })

    // 3. Fetch Knowledge Base Resources (Active Only & Scoped to Org)
    const [{ data: audios }, { data: files }] = await Promise.all([
      supabase
        .from('knowledge_base_audios')
        .select('name, trigger_keywords')
        .eq('is_active', true)
        .eq('organization_id', organizationId),
      supabase
        .from('knowledge_base_files')
        .select('name')
        .eq('is_active', true)
        .eq('organization_id', organizationId),
    ])

    const availableAudios = (audios || [])
      .map(
        (a) =>
          `- Áudio: "${a.name}" (Assuntos/Gatilhos: ${a.trigger_keywords?.join(', ') || 'N/A'})`,
      )
      .join('\n')
    const availableFiles = (files || [])
      .map((f) => `- Documento/PDF: "${f.name}"`)
      .join('\n')

    let enhancedContext =
      config.prompt_context || `Você é o assistente ${config.name || 'IA'}.`
    if (availableAudios || availableFiles) {
      enhancedContext += `\n\n--- INFORMAÇÕES DE MÍDIA DISPONÍVEIS ---\nVocê possui acesso ao envio das seguintes mídias pré-gravadas/documentos. Sempre que for apropriado pelo contexto da conversa, utilize suas ferramentas (Functions) para enviar a mídia exata listada abaixo pelo nome exato.\n\nÁudios Prontos:\n${availableAudios || 'Nenhum'}\n\nDocumentos/PDFs:\n${availableFiles || 'Nenhum'}`
    }

    // 4. Define Gemini Tools (Function Calling)
    const geminiTools = [
      {
        functionDeclarations: [
          {
            name: 'atualizar_status_lead',
            description:
              "Atualiza o estágio do CRM do lead atual baseado na intenção da conversa. Ex: 'Ser Humano', 'Qualificado'.",
            parameters: {
              type: 'OBJECT',
              properties: {
                status_nome: {
                  type: 'STRING',
                  description: 'O nome do novo status a ser atualizado.',
                },
              },
              required: ['status_nome'],
            },
          },
          {
            name: 'enviar_audio',
            description:
              'Envia um arquivo de áudio pré-gravado da base de conhecimento.',
            parameters: {
              type: 'OBJECT',
              properties: {
                nome_audio: {
                  type: 'STRING',
                  description:
                    'O nome exato do áudio listado no contexto para ser enviado.',
                },
              },
              required: ['nome_audio'],
            },
          },
          {
            name: 'enviar_documento',
            description:
              'Envia um arquivo/documento/PDF da base de conhecimento.',
            parameters: {
              type: 'OBJECT',
              properties: {
                nome_arquivo: {
                  type: 'STRING',
                  description:
                    'O nome exato do documento/PDF listado no contexto.',
                },
              },
              required: ['nome_arquivo'],
            },
          },
          {
            name: 'consultar_disponibilidade_agenda',
            description:
              'Consulta os horários livres na agenda em uma data específica.',
            parameters: {
              type: 'OBJECT',
              properties: {
                data: {
                  type: 'STRING',
                  description: 'Data no formato YYYY-MM-DD',
                },
              },
              required: ['data'],
            },
          },
          {
            name: 'agendar_horario',
            description:
              'Agenda um atendimento para o lead atual num horário disponível.',
            parameters: {
              type: 'OBJECT',
              properties: {
                data: {
                  type: 'STRING',
                  description: 'Data no formato YYYY-MM-DD',
                },
                hora: { type: 'STRING', description: 'Hora no formato HH:mm' },
              },
              required: ['data', 'hora'],
            },
          },
        ],
      },
    ]

    // 5. Call Gemini API Function
    async function runGemini(contents: any[]) {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`

      const res = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: { text: enhancedContext } },
          contents,
          tools: geminiTools,
          generationConfig: { temperature: 0.7 },
        }),
      })

      if (!res.ok) {
        const errText = await res.text()
        throw new Error(`Gemini Error: ${errText}`)
      }
      return await res.json()
    }

    let currentContents = [...formattedHistory]
    let geminiData = await runGemini(currentContents)
    let candidate = geminiData.candidates?.[0]?.content

    // Check if Gemini invoked a function
    if (candidate?.parts?.[0]?.functionCall) {
      const functionCall = candidate.parts[0].functionCall
      console.log(`[GeminiAgent] Function Call: ${functionCall.name}`)
      let functionResponse: any = {}

      if (functionCall.name === 'atualizar_status_lead') {
        const statusName = functionCall.args.status_nome
        const { data: statusObj } = await supabase
          .from('status')
          .select('id')
          .ilike('name', `%${statusName}%`)
          .maybeSingle()
        if (statusObj) {
          await supabase
            .from('leads')
            .update({ status_id: statusObj.id })
            .eq('id', leadId)
          functionResponse = {
            success: true,
            message: `Status atualizado para ${statusName}`,
          }
        } else {
          functionResponse = {
            error: `Status ${statusName} não encontrado no CRM.`,
          }
        }
      } else if (functionCall.name === 'enviar_audio') {
        const audioName = functionCall.args.nome_audio
        const { data: audioRecord } = await supabase
          .from('knowledge_base_audios')
          .select('audio_path')
          .ilike('name', `%${audioName}%`)
          .eq('organization_id', organizationId)
          .maybeSingle()
        if (audioRecord && audioRecord.audio_path) {
          await supabase.functions.invoke('evolution-send-message', {
            body: {
              leadId,
              message: 'Audio',
              sentBy: 'ai',
              messageType: 'audio',
              mediaUrl: audioRecord.audio_path,
            },
          })
          functionResponse = {
            success: true,
            message: `Áudio ${audioName} enviado.`,
          }
        } else {
          functionResponse = {
            error: `Áudio ${audioName} não encontrado na base.`,
          }
        }
      } else if (functionCall.name === 'enviar_documento') {
        const fileName = functionCall.args.nome_arquivo
        const { data: fileRecord } = await supabase
          .from('knowledge_base_files')
          .select('file_path')
          .ilike('name', `%${fileName}%`)
          .eq('organization_id', organizationId)
          .maybeSingle()
        if (fileRecord && fileRecord.file_path) {
          await supabase.functions.invoke('evolution-send-message', {
            body: {
              leadId,
              message: 'Documento',
              sentBy: 'ai',
              messageType: 'document',
              mediaUrl: fileRecord.file_path,
            },
          })
          functionResponse = {
            success: true,
            message: `Documento ${fileName} enviado.`,
          }
        } else {
          functionResponse = {
            error: `Documento ${fileName} não encontrado na base.`,
          }
        }
      } else if (functionCall.name === 'consultar_disponibilidade_agenda') {
        functionResponse = { disponivel: 'Verifique 09:00 ou 14:00 (simulado)' }
      } else if (functionCall.name === 'agendar_horario') {
        const startTime = new Date(
          `${functionCall.args.data}T${functionCall.args.hora}:00Z`,
        )
        await supabase.from('appointments').insert({
          lead_id: leadId,
          scheduled_at: startTime.toISOString(),
          status: 'scheduled',
        })
        functionResponse = {
          success: true,
          message: `Agendado para ${functionCall.args.data} as ${functionCall.args.hora}`,
        }
      }

      // Append Function Calling sequence to history and call Gemini again for the final response
      currentContents.push({ role: 'model', parts: [{ functionCall }] })
      currentContents.push({
        role: 'user',
        parts: [
          {
            functionResponse: {
              name: functionCall.name,
              response: { name: functionCall.name, content: functionResponse },
            },
          },
        ],
      })

      geminiData = await runGemini(currentContents)
      candidate = geminiData.candidates?.[0]?.content
    }

    const aiResponse = candidate?.parts?.[0]?.text
    if (!aiResponse) throw new Error('No valid response from Gemini')

    console.log(`[GeminiAgent] Final AI response generated for lead ${leadId}`)

    // 6. Send final text response via Evolution API
    const { error: invokeError } = await supabase.functions.invoke(
      'evolution-send-message',
      {
        body: {
          leadId,
          message: aiResponse,
          sentBy: 'ai',
          messageType: 'text',
        },
      },
    )

    if (invokeError)
      throw new Error(`Error invoking send-message: ${invokeError.message}`)

    return new Response(
      JSON.stringify({ success: true, status: 'processed' }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error: any) {
    console.error('[GeminiAgent] Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
