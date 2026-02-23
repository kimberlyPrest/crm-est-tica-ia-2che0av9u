import { GlassCard } from '@/components/GlassCard'
import { AppButton } from '@/components/AppButton'
import { Bot, FileText, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function KnowledgeBase() {
  const navigate = useNavigate()

  const cards = [
    {
      title: 'Agente IA',
      description:
        'Configure a personalidade, regras e comportamento do seu assistente virtual.',
      icon: Bot,
      color: 'bg-brand-lime/10 text-brand-lime-dark',
      action: () => navigate('/base-conhecimento/agente-ia'),
    },
    {
      title: 'Arquivos e Áudios',
      description:
        'Gerencie os documentos e áudios que o agente usa como base de conhecimento.',
      icon: FileText,
      color: 'bg-sky-100 text-sky-600',
      action: () => navigate('/base-conhecimento/arquivos'),
    },
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-brand-slate">
          Base de Conhecimento
        </h1>
        <p className="text-gray-500">
          Centralize as informações do seu negócio para potencializar a IA.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        {cards.map((card) => (
          <GlassCard
            key={card.title}
            size="md"
            className="group hover:scale-[1.02] transition-all cursor-pointer flex flex-col justify-between h-[280px]"
            onClick={card.action}
          >
            <div className="space-y-4">
              <div
                className={`h-12 w-12 rounded-xl flex items-center justify-center ${card.color}`}
              >
                <card.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  {card.title}
                </h3>
                <p className="text-sm text-gray-500 mt-2">{card.description}</p>
              </div>
            </div>

            <div className="flex justify-end">
              <AppButton
                variant="ghost"
                className="group-hover:translate-x-1 transition-transform"
                onClick={(e) => {
                  e.stopPropagation()
                  card.action()
                }}
              >
                Acessar <ArrowRight className="ml-2 h-4 w-4" />
              </AppButton>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
