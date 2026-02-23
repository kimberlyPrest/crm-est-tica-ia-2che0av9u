import { GlassCard } from '@/components/GlassCard'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { AppButton } from '@/components/AppButton'
import { Badge } from '@/components/ui/badge'
import { AgentConfig } from '@/hooks/use-agent-config'
import { Wand2, Plus, Smile, Briefcase } from 'lucide-react'

interface IdentitySectionProps {
  config: AgentConfig
  onChange: (field: keyof AgentConfig, value: any) => void
}

export function IdentitySection({ config, onChange }: IdentitySectionProps) {
  const handleInsert = (field: keyof AgentConfig, text: string) => {
    const currentValue = String(config[field] || '')
    onChange(field, currentValue + (currentValue ? '\n' : '') + text)
  }

  const loadRoleTemplate = () => {
    const template = `Você é a assistente virtual da Clínica Estética Glow. Seu papel é acolher os clientes com empatia, tirar dúvidas sobre tratamentos faciais e corporais, e agendar avaliações. Você deve sempre priorizar o bem-estar do cliente e nunca prometer resultados médicos irreais.`
    onChange('role_definition', template)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="col-span-1 md:col-span-2 p-6 space-y-6">
          <div className="space-y-4" id="agent_name">
            <div className="flex justify-between">
              <Label className="text-base">Nome do Agente</Label>
              <span className="text-xs text-gray-400">
                {config.agent_name?.length ?? 0}/30
              </span>
            </div>
            <Input
              value={config.agent_name || ''}
              onChange={(e) => onChange('agent_name', e.target.value)}
              maxLength={30}
              placeholder="Ex: Sofia"
              className="font-medium text-lg"
            />
          </div>

          <div className="space-y-4" id="role_definition">
            <div className="flex justify-between items-center">
              <Label className="text-base">Definição do Papel</Label>
              <AppButton
                variant="ghost"
                size="sm"
                className="h-6 text-xs text-brand-lime-dark hover:text-brand-lime-dark"
                onClick={loadRoleTemplate}
              >
                <Briefcase className="w-3 h-3 mr-1" /> Ver exemplo
              </AppButton>
            </div>
            <Textarea
              value={config.role_definition || ''}
              onChange={(e) => onChange('role_definition', e.target.value)}
              maxLength={500}
              placeholder="Descreva quem é o agente e qual seu objetivo principal..."
              className="min-h-[100px]"
            />
            <div className="text-right text-xs text-gray-400">
              {config.role_definition?.length ?? 0}/500
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6 bg-gradient-to-br from-brand-lime/10 to-transparent flex flex-col justify-center items-center text-center">
          <div className="h-16 w-16 rounded-full bg-white shadow-md flex items-center justify-center text-2xl mb-4">
            🤖
          </div>
          <h4 className="font-bold text-gray-800 text-lg mb-1">
            {config.agent_name || 'Assistente'}
          </h4>
          <p className="text-sm text-gray-600 italic">
            "
            {config.role_definition
              ? 'Pronto para ajudar!'
              : 'Defina meu papel...'}
            "
          </p>
        </GlassCard>
      </div>

      <GlassCard className="p-6 space-y-6" id="company_info">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
          <Label className="text-base">Informações da Empresa</Label>
          <div className="flex flex-wrap gap-2">
            {[
              {
                label: '📍 Endereço',
                text: 'Estamos localizados na Rua das Flores, 123, Centro.',
              },
              {
                label: '⏰ Horários',
                text: 'Atendemos de Seg a Sex, das 09h às 18h.',
              },
              {
                label: '💰 Preços',
                text: 'Nossos valores variam conforme avaliação personalizada.',
              },
              {
                label: '📞 Contato',
                text: 'Contato de emergência: (11) 99999-9999.',
              },
            ].map((pill) => (
              <Badge
                key={pill.label}
                variant="outline"
                className="cursor-pointer hover:bg-brand-lime/20 transition-colors"
                onClick={() => handleInsert('company_info', pill.text)}
              >
                <Plus className="w-3 h-3 mr-1" /> {pill.label}
              </Badge>
            ))}
          </div>
        </div>
        <Textarea
          value={config.company_info || ''}
          onChange={(e) => onChange('company_info', e.target.value)}
          maxLength={1000}
          placeholder="Insira dados essenciais: endereço, tabela de preços base, diferenciais, políticas de cancelamento..."
          className="min-h-[150px]"
        />
        <div className="text-right text-xs text-gray-400">
          {config.company_info?.length ?? 0}/1000
        </div>
      </GlassCard>

      <GlassCard className="p-6 space-y-6" id="tone">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
          <Label className="text-base">Tom de Voz</Label>
          <div className="flex flex-wrap gap-2">
            {[
              {
                label: '✨ Usar emojis',
                text: 'Use emojis para tornar a conversa leve e amigável.',
              },
              {
                label: '🤝 Tom formal',
                text: 'Mantenha um tom profissional, respeitoso e direto.',
              },
              {
                label: '🥰 Acolhedor',
                text: 'Seja extremamente acolhedora e demonstre preocupação genuína.',
              },
            ].map((pill) => (
              <Badge
                key={pill.label}
                variant="secondary"
                className="cursor-pointer hover:bg-sky-100 transition-colors bg-sky-50 text-sky-700 border-sky-200"
                onClick={() => handleInsert('tone', pill.text)}
              >
                <Smile className="w-3 h-3 mr-1" /> {pill.label}
              </Badge>
            ))}
          </div>
        </div>
        <Textarea
          value={config.tone || ''}
          onChange={(e) => onChange('tone', e.target.value)}
          maxLength={400}
          placeholder="Como o agente deve se expressar? (Ex: Alegre, empático, usa emojis...)"
          className="min-h-[100px]"
        />
        <div className="text-right text-xs text-gray-400">
          {config.tone?.length ?? 0}/400
        </div>
      </GlassCard>
    </div>
  )
}
