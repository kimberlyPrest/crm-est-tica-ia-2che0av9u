import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')!

interface FewShotExample {
  question: string
  answer: string
}

interface AgentConfigFields {
  agent_name?: string
  role_definition?: string
  company_info?: string
  tone?: string
  knowledge_instructions?: string
  guardrails?: string
  human_handover_rules?: string
  few_shot_examples?: FewShotExample[]
  organization_id?: string
}

function buildSystemPrompt(
  config: AgentConfigFields,
  audios: { name: string; trigger_keywords?: string[] }[],
  files: { name: string }[],
): string {
  const parts: string[] = []

  parts.push(`Você é ${config.agent_name || 'um assistente virtual'}.`)

  if (config.role_definition) {
    parts.push(`\n\n## FUNÇÃO E PAPEL\n${config.role_definition}`)
  }

  if (config.company_info) {
    parts.push(`\n\n## INFORMAÇÕES DA EMPRESA\n${config.company_info}`)
  }

  if (config.tone) {
    parts.push(`\n\n## TOM DE VOZ E ESTILO\n${config.tone}`)
  }

  if (config.knowledge_instructions) {
    parts.push(
      `\n\n## BASE DE CONHECIMENTO E INSTRUÇÕES\n${config.knowledge_instructions}`,
    )
  }

  if (config.guardrails) {
    parts.push(`\n\n## REGRAS E RESTRIÇÕES\n${config.guardrails}`)
  }

  if (config.human_handover_rules) {
    parts.push(
      `\n\n## QUANDO TRANSFERIR PARA ATENDIMENTO HUMANO\n${config.human_handover_rules}`,
    )
  }

  if (config.few_shot_examples && config.few_shot_examples.length > 0) {
    const examples = config.few_shot_examples
      .map(
        (ex, i) =>
          `Exemplo ${i + 1}:\nCliente: ${ex.question}\nVocê: ${ex.answer}`,
      )
      .join('\n\n')
    parts.push(`\n\n## EXEMPLOS DE ATENDIMENTO\n${examples}`)
  }

  if (audios.length > 0 || files.length > 0) {
    const audioList = audios
      .map(
        (a) =>
          `- Áudio: "${a.name}" (Gatilhos: ${a.trigger_keywords?.join(', ') || 'N/A'})`,
      )
      .join('\n')
    const fileList = files.map((f) => `- Documento: "${f.name}"`).join('\n')
    parts.push(
      `\n\n## MÍDIAS DISPONÍVEIS\nÁudios pré-gravados:\n${audioList || 'Nenhum'}\n\nDocumentos/PDFs:\n${fileList || 'Nenhum'}`,
    )
  }

  parts.push(
    '\n\n[MODO TESTE: Esta é uma simulação. Responda como responderia no WhatsApp real.]',
  )

  return parts.join('')
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { config, conversationHistory } = await req.json()

    if (!config) {
      throw new Error('config é obrigatório')
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Busca arquivos da base de conhecimento da organização
    let audios: { name: string; trigger_keywords?: string[] }[] = []
    let files: { name: string }[] = []

    if (config.organization_id) {
      const [audiosRes, filesRes] = await Promise.all([
        supabase
          .from('knowledge_base_audios')
          .select('name, trigger_keywords')
          .eq('is_active', true)
          .eq('organization_id', config.organization_id),
        supabase
          .from('knowledge_base_files')
          .select('name')
          .eq('is_active', true)
          .eq('organization_id', config.organization_id),
      ])
      audios = audiosRes.data || []
      files = filesRes.data || []
    }

    // Monta o system prompt a partir dos campos da interface
    const systemPrompt = buildSystemPrompt(config, audios, files)

    // Monta o histórico de conversa para o Gemini
    // O Gemini exige alternância user/model, começando com user
    const history = (conversationHistory || []) as {
      role: string
      content: string
    }[]

    const contents = history.map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }))

    // Valida que o último item é do user (Gemini exige)
    if (
      contents.length === 0 ||
      contents[contents.length - 1].role !== 'user'
    ) {
      throw new Error('A última mensagem do histórico deve ser do usuário')
    }

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`

    const res = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: { text: systemPrompt } },
        contents,
        generationConfig: { temperature: 0.7, maxOutputTokens: 600 },
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      throw new Error(`Gemini Error: ${errText}`)
    }

    const geminiData = await res.json()
    const response = geminiData.candidates?.[0]?.content?.parts?.[0]?.text

    if (!response) {
      throw new Error('Sem resposta do Gemini')
    }

    return new Response(JSON.stringify({ response }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    console.error('[GenerateAgentResponse] Erro:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
