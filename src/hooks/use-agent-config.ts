import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { z } from 'zod'

export interface FewShotExample {
  id: string
  question: string
  answer: string
}

export interface AgentConfig {
  id: string
  is_enabled: boolean
  auto_schedule_enabled: boolean
  auto_schedule_start_time: string
  auto_schedule_end_time: string
  agent_name: string
  role_definition: string
  company_info: string
  tone: string
  knowledge_instructions: string
  guardrails: string
  human_handover_rules: string
  few_shot_examples: FewShotExample[]
}

const defaultConfig: AgentConfig = {
  id: '',
  is_enabled: false,
  auto_schedule_enabled: false,
  auto_schedule_start_time: '09:00',
  auto_schedule_end_time: '18:00',
  agent_name: 'Assistente Virtual',
  role_definition: '',
  company_info: '',
  tone: '',
  knowledge_instructions: '',
  guardrails: '',
  human_handover_rules: '',
  few_shot_examples: [],
}

const configSchema = z.object({
  agent_name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  role_definition: z
    .string()
    .min(50, 'Definição do papel deve ter pelo menos 50 caracteres'),
  company_info: z
    .string()
    .min(100, 'Informações da empresa devem ter pelo menos 100 caracteres'),
  tone: z
    .string()
    .min(30, 'Definição de tom deve ter pelo menos 30 caracteres'),
  few_shot_examples: z
    .array(
      z.object({
        question: z.string().min(1),
        answer: z.string().min(1),
      }),
    )
    .min(1, 'Adicione pelo menos 1 exemplo completo'),
})

export function useAgentConfig() {
  const [config, setConfig] = useState<AgentConfig>(defaultConfig)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [activeFiles, setActiveFiles] = useState<
    { name: string; type: 'file' | 'audio' }[]
  >([])

  // Load Config
  useEffect(() => {
    async function loadConfig() {
      try {
        setLoading(true)

        // Load files for reference
        const { data: files } = await supabase
          .from('knowledge_base_files')
          .select('name')
          .eq('is_active', true)
        const { data: audios } = await supabase
          .from('knowledge_base_audios')
          .select('name')
          .eq('is_active', true)

        setActiveFiles([
          ...(files?.map((f) => ({ name: f.name, type: 'file' as const })) ||
            []),
          ...(audios?.map((a) => ({ name: a.name, type: 'audio' as const })) ||
            []),
        ])

        // Get current user and organization_id
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError) throw userError

        const { data: userData, error: orgError } = await supabase
          .from('users')
          .select('organization_id')
          .eq('id', user?.id)
          .single()

        if (orgError || !userData?.organization_id) {
          console.error('Organization not found for user')
          toast.error('Erro de permissão da organização')
          setLoading(false)
          return
        }

        const orgId = userData.organization_id

        // Load Agent Config
        let { data, error } = await supabase
          .from('agent_config')
          .select('*')
          .eq('organization_id', orgId)
          .limit(1)
          .maybeSingle()

        if (error) throw error

        if (!data) {
          // Create default if not exists
          const { data: newData, error: createError } = await supabase
            .from('agent_config')
            .insert({
              agent_name: defaultConfig.agent_name,
              is_enabled: false,
              organization_id: orgId
            })
            .select()
            .single()

          if (createError) throw createError
          data = newData
        }

        // Check for local draft
        const localDraft = localStorage.getItem('agent_config_draft')
        if (localDraft) {
          const draft = JSON.parse(localDraft)
          if (
            draft.updated_at &&
            data.updated_at &&
            new Date(draft.updated_at) > new Date(data.updated_at)
          ) {
            const useDraft = window.confirm(
              'Existe um rascunho não salvo mais recente. Deseja restaurá-lo?',
            )
            if (useDraft) {
              setConfig({
                ...defaultConfig,
                ...draft,
                few_shot_examples: draft.few_shot_examples || [],
              })
              setHasUnsavedChanges(true)
              setLoading(false)
              return
            }
          }
        }

        if (data) {
          setConfig({
            ...defaultConfig,
            ...data,
            auto_schedule_start_time: data.auto_schedule_start_time || '09:00',
            auto_schedule_end_time: data.auto_schedule_end_time || '18:00',
            few_shot_examples:
              (data.few_shot_examples as unknown as FewShotExample[]) || [],
          })
        }
      } catch (error) {
        console.error('Error loading config:', error)
        toast.error('Erro ao carregar configurações')
      } finally {
        setLoading(false)
      }
    }

    loadConfig()
  }, [])

  // Auto-save draft
  useEffect(() => {
    if (!hasUnsavedChanges || loading) return

    const timer = setTimeout(() => {
      localStorage.setItem(
        'agent_config_draft',
        JSON.stringify({
          ...config,
          updated_at: new Date().toISOString(),
        }),
      )
    }, 30000)

    return () => clearTimeout(timer)
  }, [config, hasUnsavedChanges, loading])

  const handleChange = useCallback((field: keyof AgentConfig, value: any) => {
    setConfig((prev) => ({ ...prev, [field]: value }))
    setHasUnsavedChanges(true)
  }, [])

  const toggleEnabled = async () => {
    const newState = !config.is_enabled
    handleChange('is_enabled', newState)

    // Immediate save for toggle
    try {
      const { error } = await supabase
        .from('agent_config')
        .update({ is_enabled: newState })
        .eq('id', config.id)
      if (error) throw error
      toast[newState ? 'success' : 'warning'](
        `Agente ${newState ? 'Ativado' : 'Desativado'}`,
      )
    } catch (error) {
      handleChange('is_enabled', !newState) // Revert
      toast.error('Erro ao alterar status do agente')
    }
  }

  const saveConfig = async () => {
    setErrors([])
    setSaving(true)
    try {
      // Validation
      const result = configSchema.safeParse(config)
      if (!result.success) {
        const formattedErrors = result.error.issues.map((e) => e.message)
        setErrors(formattedErrors)
        toast.error('Corrija os erros antes de salvar')

        // Scroll to error (simplified)
        const firstErrorPath = result.error.issues[0].path[0]
        const element = document.getElementById(String(firstErrorPath))
        if (element)
          element.scrollIntoView({ behavior: 'smooth', block: 'center' })

        setSaving(false)
        return
      }

      const { error } = await supabase
        .from('agent_config')
        .update({
          agent_name: config.agent_name,
          auto_schedule_enabled: config.auto_schedule_enabled,
          auto_schedule_start_time: config.auto_schedule_start_time,
          auto_schedule_end_time: config.auto_schedule_end_time,
          role_definition: config.role_definition,
          company_info: config.company_info,
          tone: config.tone,
          knowledge_instructions: config.knowledge_instructions,
          guardrails: config.guardrails,
          human_handover_rules: config.human_handover_rules,
          few_shot_examples: config.few_shot_examples as unknown as any, // Cast for JSONB
          updated_at: new Date().toISOString(),
        })
        .eq('id', config.id)

      if (error) throw error

      toast.success('Configurações salvas com sucesso!')
      setHasUnsavedChanges(false)
      localStorage.removeItem('agent_config_draft')
    } catch (error) {
      console.error('Error saving:', error)
      toast.error('Erro ao salvar configurações')
    } finally {
      setSaving(false)
    }
  }

  return {
    config,
    loading,
    saving,
    errors,
    hasUnsavedChanges,
    activeFiles,
    handleChange,
    toggleEnabled,
    saveConfig,
  }
}
