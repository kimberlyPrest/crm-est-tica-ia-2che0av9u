import { GlassCard } from '@/components/GlassCard'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Input } from '@/components/ui/input'
import { AgentConfig } from '@/hooks/use-agent-config'
import { Sunrise, Sunset, Power } from 'lucide-react'
import { cn } from '@/lib/utils'

interface GlobalControlsProps {
  config: AgentConfig
  onChange: (field: keyof AgentConfig, value: any) => void
  onToggle: () => void
}

export function GlobalControls({
  config,
  onChange,
  onToggle,
}: GlobalControlsProps) {
  const isTimeInvalid =
    config.auto_schedule_enabled &&
    config.auto_schedule_start_time === config.auto_schedule_end_time

  return (
    <div className="space-y-6">
      <GlassCard className="flex items-center justify-between p-6 border-l-4 border-l-brand-lime">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-brand-slate">
              Status do Agente
            </h3>
            {config.is_enabled && (
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-lime opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-lime"></span>
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500">
            Controle mestre para ativar ou desativar o assistente virtual.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={cn(
              'text-sm font-medium',
              config.is_enabled ? 'text-brand-lime-dark' : 'text-gray-400',
            )}
          >
            {config.is_enabled ? 'ATIVO' : 'INATIVO'}
          </span>
          <Switch
            checked={config.is_enabled}
            onCheckedChange={onToggle}
            className="data-[state=checked]:bg-brand-lime"
          />
        </div>
      </GlassCard>

      <GlassCard className="p-0 overflow-hidden">
        <div className="p-6 pb-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="auto-schedule"
              checked={config.auto_schedule_enabled}
              onCheckedChange={(checked) =>
                onChange('auto_schedule_enabled', !!checked)
              }
            />
            <Label
              htmlFor="auto-schedule"
              className="text-base font-semibold cursor-pointer"
            >
              Horário de Funcionamento Automático
            </Label>
          </div>
          <p className="text-sm text-gray-500 mt-2 ml-6">
            O agente só responderá automaticamente dentro do horário definido.
            Fora deste horário, ele permanecerá inativo ou enviará mensagem de
            ausência.
          </p>
        </div>

        <Accordion
          type="single"
          collapsible
          value={config.auto_schedule_enabled ? 'item-1' : ''}
        >
          <AccordionItem value="item-1" className="border-0">
            <AccordionContent>
              <div className="px-6 pb-6 pt-2 ml-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-gray-600">
                    <Sunrise className="h-4 w-4 text-orange-500" /> Início
                    (Ativação)
                  </Label>
                  <Input
                    type="time"
                    value={config.auto_schedule_start_time}
                    onChange={(e) =>
                      onChange('auto_schedule_start_time', e.target.value)
                    }
                    className={cn(
                      isTimeInvalid &&
                        'border-red-500 focus-visible:ring-red-500',
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-gray-600">
                    <Sunset className="h-4 w-4 text-purple-500" /> Fim
                    (Desativação)
                  </Label>
                  <Input
                    type="time"
                    value={config.auto_schedule_end_time}
                    onChange={(e) =>
                      onChange('auto_schedule_end_time', e.target.value)
                    }
                    className={cn(
                      isTimeInvalid &&
                        'border-red-500 focus-visible:ring-red-500',
                    )}
                  />
                </div>
                {isTimeInvalid && (
                  <p className="col-span-2 text-xs text-red-500 font-medium">
                    O horário de início e fim não podem ser iguais.
                  </p>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </GlassCard>
    </div>
  )
}
