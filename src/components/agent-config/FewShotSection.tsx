import { GlassCard } from '@/components/GlassCard'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { AppButton } from '@/components/AppButton'
import { AgentConfig, FewShotExample } from '@/hooks/use-agent-config'
import { Plus, Trash2, BookOpen, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'

interface FewShotSectionProps {
  config: AgentConfig
  onChange: (field: keyof AgentConfig, value: any) => void
}

export function FewShotSection({ config, onChange }: FewShotSectionProps) {
  const examples = config.few_shot_examples || []

  const addExample = () => {
    if (examples.length >= 10) return
    const newExample: FewShotExample = {
      id: crypto.randomUUID(),
      question: '',
      answer: '',
    }
    onChange('few_shot_examples', [...examples, newExample])
  }

  const updateExample = (
    id: string,
    field: 'question' | 'answer',
    value: string,
  ) => {
    const updated = examples.map((ex) =>
      ex.id === id ? { ...ex, [field]: value } : ex,
    )
    onChange('few_shot_examples', updated)
  }

  const removeExample = (id: string) => {
    onChange(
      'few_shot_examples',
      examples.filter((ex) => ex.id !== id),
    )
  }

  const loadTemplates = () => {
    const templates = [
      {
        id: crypto.randomUUID(),
        question: 'Quanto custa o botox?',
        answer:
          'Os valores variam conforme a avaliação, mas começam a partir de R$ X. Gostaria de agendar uma avaliação gratuita?',
      },
      {
        id: crypto.randomUUID(),
        question: 'Onde vocês ficam?',
        answer:
          'Estamos na Rua das Flores, 123. Temos estacionamento no local!',
      },
    ]
    onChange('few_shot_examples', [...examples, ...templates].slice(0, 10))
  }

  return (
    <div className="space-y-6" id="few_shot_examples">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-gray-800">
            Treinamento de Respostas (Few-Shot)
          </h3>
          <p className="text-sm text-gray-500">
            Ensine ao agente como responder perguntas comuns.
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <AppButton variant="outline" size="sm">
                <BookOpen className="w-4 h-4 mr-2" /> Templates
              </AppButton>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Templates de Perguntas Frequentes</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <p className="text-sm text-gray-600">
                  Adicione estes exemplos para basear o comportamento do agente.
                </p>
                <AppButton onClick={loadTemplates} className="w-full">
                  Adicionar Exemplos Padrão
                </AppButton>
              </div>
            </DialogContent>
          </Dialog>

          <AppButton onClick={addExample} disabled={examples.length >= 10}>
            <Plus className="w-4 h-4 mr-2" /> Novo Exemplo
          </AppButton>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {examples.length === 0 && (
          <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl">
            <p className="text-gray-400">
              Nenhum exemplo adicionado. Adicione pelo menos um.
            </p>
          </div>
        )}

        {examples.map((example, index) => {
          const isValid =
            example.question.trim().length > 0 &&
            example.answer.trim().length > 0

          return (
            <GlassCard
              key={example.id}
              size="md"
              className={cn(
                'relative group transition-all',
                !isValid
                  ? 'border-amber-300 bg-amber-50/30'
                  : 'border-emerald-100/50',
              )}
            >
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <AppButton
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50"
                  onClick={() => removeExample(example.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </AppButton>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-2 items-center">
                  <Label className="text-right text-gray-500 text-xs uppercase font-bold pr-2">
                    Usuário diz:
                  </Label>
                  <Input
                    value={example.question}
                    onChange={(e) =>
                      updateExample(example.id, 'question', e.target.value)
                    }
                    placeholder="Ex: Qual o valor da limpeza?"
                    className="bg-white/80"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-2 items-start">
                  <Label className="text-right text-brand-lime-dark text-xs uppercase font-bold pr-2 mt-3">
                    Agente responde:
                  </Label>
                  <Textarea
                    value={example.answer}
                    onChange={(e) =>
                      updateExample(example.id, 'answer', e.target.value)
                    }
                    placeholder="Ex: A limpeza custa R$ 150..."
                    className="bg-white/80 min-h-[80px]"
                  />
                </div>
              </div>

              {!isValid && (
                <div
                  className="absolute -left-2 top-1/2 -translate-y-1/2 bg-amber-400 w-1 h-12 rounded-r-full"
                  title="Preencha todos os campos"
                />
              )}
            </GlassCard>
          )
        })}
      </div>
    </div>
  )
}
