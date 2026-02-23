import { GlassCard } from '@/components/GlassCard'
import { AgentConfig } from '@/hooks/use-agent-config'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { AppButton } from '@/components/AppButton'
import { Send, Sparkles, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

interface AgentPreviewProps {
  config: AgentConfig
  className?: string
}

export function AgentPreview({ config, className }: AgentPreviewProps) {
  const [messages, setMessages] = useState<
    { role: 'user' | 'agent'; content: string }[]
  >([{ role: 'user', content: 'Olá, quanto custa uma limpeza de pele?' }])
  const [loading, setLoading] = useState(false)
  const [userInput, setUserInput] = useState('')

  // Simulate debounced preview update based on config changes
  const [simulatedResponse, setSimulatedResponse] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      let response = `Olá! Sou ${config.agent_name || 'a assistente'}. `
      if ((config.tone || '').toLowerCase().includes('emoji')) {
        response += '✨ '
      }
      if ((config.company_info || '').toLowerCase().includes('preços')) {
        response +=
          'Sobre valores, preciso fazer uma avaliação personalizada antes! '
      } else {
        response +=
          'Posso te ajudar com agendamentos e dúvidas sobre nossos tratamentos. '
      }

      setSimulatedResponse(response)
    }, 500)
    return () => clearTimeout(timer)
  }, [config.agent_name, config.tone, config.company_info])

  const handleTestGemini = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.functions.invoke(
        'generate-agent-response',
        {
          body: {
            message: messages[messages.length - 1].content,
            config: config,
          },
        },
      )

      if (error) throw error

      if (data?.response) {
        setMessages((prev) => [
          ...prev,
          { role: 'agent', content: data.response },
        ])
      } else {
        // Fallback simulation if edge function is not deployed/mocked
        setMessages((prev) => [
          ...prev,
          { role: 'agent', content: simulatedResponse + ' (Simulado)' },
        ])
      }
    } catch (error) {
      console.error('Gemini test error:', error)
      setMessages((prev) => [
        ...prev,
        { role: 'agent', content: simulatedResponse + ' (Offline)' },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleSend = () => {
    if (!userInput.trim()) return
    setMessages((prev) => [...prev, { role: 'user', content: userInput }])
    setUserInput('')
    // Trigger response generation after user input
    setTimeout(handleTestGemini, 500)
  }

  return (
    <GlassCard
      className={cn(
        'flex flex-col h-[600px] border-2 border-gray-100 overflow-hidden',
        className,
      )}
    >
      <div className="p-4 border-b border-gray-100 bg-white/50 flex items-center justify-between">
        <h4 className="font-bold text-gray-700 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-brand-lime-dark" /> Preview em Tempo
          Real
        </h4>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-gray-500">Online</span>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4 bg-gray-50/30">
        <div className="space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={cn(
                'flex gap-3',
                msg.role === 'user' ? 'flex-row-reverse' : '',
              )}
            >
              <Avatar className="h-8 w-8 border border-white shadow-sm">
                <AvatarFallback
                  className={
                    msg.role === 'agent'
                      ? 'bg-brand-lime text-brand-slate'
                      : 'bg-gray-200'
                  }
                >
                  {msg.role === 'agent' ? config.agent_name?.[0] || 'A' : 'U'}
                </AvatarFallback>
              </Avatar>
              <div
                className={cn(
                  'p-3 rounded-2xl text-sm max-w-[80%] shadow-sm',
                  msg.role === 'agent'
                    ? 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                    : 'bg-brand-lime text-brand-slate rounded-tr-none',
                )}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback>...</AvatarFallback>
              </Avatar>
              <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100">
                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-3 border-t border-gray-100 bg-white/50 space-y-3">
        <AppButton
          variant="outline"
          size="sm"
          className="w-full text-xs border-brand-lime/30 text-brand-lime-dark hover:bg-brand-lime/10"
          onClick={handleTestGemini}
          disabled={loading}
        >
          <Sparkles className="w-3 h-3 mr-2" /> Testar resposta com Gemini
        </AppButton>

        <div className="relative">
          <Input
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Digite uma mensagem..."
            className="pr-10 bg-white"
          />
          <button
            onClick={handleSend}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-lime-dark"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </GlassCard>
  )
}
