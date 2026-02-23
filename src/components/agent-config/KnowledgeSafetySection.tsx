import { GlassCard } from '@/components/GlassCard'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { AppButton } from '@/components/AppButton'
import { AgentConfig } from '@/hooks/use-agent-config'
import { FileText, Mic, Copy, ShieldAlert, UserCheck } from 'lucide-react'
import { toast } from 'sonner'
import { ScrollArea } from '@/components/ui/scroll-area'

interface KnowledgeSafetySectionProps {
  config: AgentConfig
  onChange: (field: keyof AgentConfig, value: any) => void
  activeFiles: { name: string; type: 'file' | 'audio' }[]
}

export function KnowledgeSafetySection({
  config,
  onChange,
  activeFiles,
}: KnowledgeSafetySectionProps) {
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copiado!')
  }

  const addHandoverRule = (rule: string, checked: boolean) => {
    let current = config.human_handover_rules || ''
    if (checked) {
      if (!current.includes(rule)) {
        onChange(
          'human_handover_rules',
          current + (current ? '\n' : '') + '- ' + rule,
        )
      }
    } else {
      onChange(
        'human_handover_rules',
        current.replace(new RegExp(`- ${rule}\\n?`), '').trim(),
      )
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Knowledge Instructions */}
        <GlassCard
          className="col-span-1 md:col-span-2 p-6 space-y-4"
          id="knowledge_instructions"
        >
          <Label className="text-base">
            Instruções de Base de Conhecimento
          </Label>
          <p className="text-xs text-gray-500">
            Oriente a IA sobre como usar os arquivos carregados na plataforma.
          </p>
          <Textarea
            value={config.knowledge_instructions || ''}
            onChange={(e) => onChange('knowledge_instructions', e.target.value)}
            maxLength={600}
            placeholder="Ex: Consulte o arquivo 'Tabela de Preços 2024' para responder sobre valores..."
            className="min-h-[150px]"
          />
          <div className="text-right text-xs text-gray-400">
            {config.knowledge_instructions?.length ?? 0}/600
          </div>
        </GlassCard>

        {/* Active Files List */}
        <GlassCard className="p-6 flex flex-col h-full bg-gray-50/50">
          <h4 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <FileText className="h-4 w-4" /> Arquivos Ativos
          </h4>
          <ScrollArea className="flex-1 max-h-[200px]">
            {activeFiles.length === 0 ? (
              <p className="text-sm text-gray-400 italic">
                Nenhum arquivo ativo.
              </p>
            ) : (
              <div className="space-y-2">
                {activeFiles.map((file, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 bg-white rounded-md border border-gray-100 text-sm"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      {file.type === 'audio' ? (
                        <Mic className="h-3 w-3 text-purple-500" />
                      ) : (
                        <FileText className="h-3 w-3 text-blue-500" />
                      )}
                      <span
                        className="truncate max-w-[120px]"
                        title={file.name}
                      >
                        {file.name}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopy(file.name)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </GlassCard>
      </div>

      {/* Guardrails */}
      <GlassCard
        className="p-6 space-y-4 border-l-4 border-l-red-400"
        id="guardrails"
      >
        <div className="flex justify-between items-center">
          <Label className="text-base flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-red-500" /> Guardrails
            (Segurança)
          </Label>
          <AppButton
            variant="ghost"
            size="sm"
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={() =>
              onChange(
                'guardrails',
                (config.guardrails || '') +
                  (config.guardrails ? '\n' : '') +
                  'NUNCA invente preços ou tratamentos que não constam na base de conhecimento. Se não souber, transfira para um humano.',
              )
            }
          >
            Usar template de segurança
          </AppButton>
        </div>
        <Textarea
          value={config.guardrails || ''}
          onChange={(e) => onChange('guardrails', e.target.value)}
          maxLength={500}
          placeholder="Defina o que a IA está ESTRITAMENTE proibida de fazer..."
          className="min-h-[100px] border-red-100 focus-visible:ring-red-200"
        />
      </GlassCard>

      {/* Handover Rules */}
      <GlassCard className="p-6 space-y-4" id="human_handover_rules">
        <Label className="text-base flex items-center gap-2">
          <UserCheck className="h-4 w-4 text-brand-lime-dark" /> Regras de
          Transbordo Humano
        </Label>
        <div className="flex flex-wrap gap-4 mb-2">
          {[
            'Cliente solicita cancelamento',
            'Cliente pede desconto',
            'Assunto financeiro complexo',
            'Reclamação ou insatisfação',
          ].map((rule) => (
            <div key={rule} className="flex items-center space-x-2">
              <Checkbox
                id={`rule-${rule}`}
                checked={(config.human_handover_rules || '').includes(rule)}
                onCheckedChange={(checked) => addHandoverRule(rule, !!checked)}
              />
              <label
                htmlFor={`rule-${rule}`}
                className="text-sm cursor-pointer"
              >
                {rule}
              </label>
            </div>
          ))}
        </div>
        <Textarea
          value={config.human_handover_rules || ''}
          onChange={(e) => onChange('human_handover_rules', e.target.value)}
          maxLength={500}
          placeholder="Em quais situações a conversa deve ser transferida para um atendente?"
          className="min-h-[100px]"
        />
      </GlassCard>
    </div>
  )
}
