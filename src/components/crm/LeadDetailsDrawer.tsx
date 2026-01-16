import { useEffect, useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { AppButton } from '@/components/AppButton'
import { CRMLead } from '@/hooks/use-crm-data'
import { useLeadDetails } from '@/hooks/use-lead-details'
import { supabase } from '@/lib/supabase/client'
import {
  Phone,
  Mail,
  Calendar,
  DollarSign,
  AlertTriangle,
  Ban,
  RotateCcw,
  X,
  Plus,
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface LeadDetailsDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  lead: CRMLead | null
  onUpdate: () => void
  onAction: (action: string, lead: CRMLead) => void
}

export function LeadDetailsDrawer({
  open,
  onOpenChange,
  lead,
  onUpdate,
  onAction,
}: LeadDetailsDrawerProps) {
  const {
    messages,
    activities,
    loading: detailsLoading,
  } = useLeadDetails(lead?.id || null)
  const [localLead, setLocalLead] = useState<Partial<CRMLead>>({})
  const [newTag, setNewTag] = useState('')

  useEffect(() => {
    if (lead) {
      setLocalLead(lead)
    }
  }, [lead])

  // Debounced update for basic info
  useEffect(() => {
    if (!lead || !localLead) return

    const timer = setTimeout(async () => {
      const hasChanges =
        localLead.name !== lead.name ||
        localLead.phone !== lead.phone ||
        localLead.email !== lead.email ||
        localLead.notes !== lead.notes

      if (hasChanges) {
        try {
          await supabase
            .from('leads')
            .update({
              name: localLead.name,
              phone: localLead.phone,
              email: localLead.email,
              notes: localLead.notes,
            })
            .eq('id', lead.id)
          onUpdate()
        } catch (error) {
          console.error('Error updating lead:', error)
        }
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [localLead, lead, onUpdate])

  const handleTagAdd = async () => {
    if (!lead || !newTag.trim()) return
    const currentTags = lead.tags || []
    if (currentTags.includes(newTag)) return

    const updatedTags = [...currentTags, newTag]
    await updateTags(updatedTags)
    setNewTag('')
  }

  const handleTagRemove = async (tagToRemove: string) => {
    if (!lead) return
    const updatedTags = (lead.tags || []).filter((t) => t !== tagToRemove)
    await updateTags(updatedTags)
  }

  const updateTags = async (tags: string[]) => {
    if (!lead) return
    try {
      await supabase.from('leads').update({ tags }).eq('id', lead.id)
      setLocalLead((prev) => ({ ...prev, tags }))
      onUpdate()
      toast.success('Tags atualizadas')
    } catch (error) {
      toast.error('Erro ao atualizar tags')
    }
  }

  const toggleAiBlock = async () => {
    if (!lead) return
    try {
      await supabase
        .from('leads')
        .update({ ai_agent_blocked: !lead.ai_agent_blocked })
        .eq('id', lead.id)
      onUpdate()
      toast.success(
        lead.ai_agent_blocked
          ? 'IA desbloqueada'
          : 'IA bloqueada para este lead',
      )
    } catch (error) {
      toast.error('Erro ao alterar status da IA')
    }
  }

  const returnToFlow = async () => {
    if (!lead) return
    try {
      await supabase
        .from('leads')
        .update({
          ai_agent_blocked: false,
          has_pending_message: false,
        })
        .eq('id', lead.id)
      onUpdate()
      toast.success('Lead retornado ao fluxo automático')
    } catch (error) {
      toast.error('Erro ao retornar lead ao fluxo')
    }
  }

  if (!lead) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[700px] p-0 flex flex-col bg-white/95 backdrop-blur-xl border-l border-white/20"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-start gap-4">
          <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
            <AvatarFallback
              className="text-2xl font-bold text-white"
              style={{ backgroundColor: lead.status?.color || '#cbd5e1' }}
            >
              {lead.name?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <SheetTitle className="text-2xl font-bold text-brand-slate">
              {lead.name}
            </SheetTitle>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <a
                href={`tel:${lead.phone}`}
                className="flex items-center gap-1 hover:text-brand-lime transition-colors"
              >
                <Phone className="h-3 w-3" /> {lead.phone}
              </a>
              {lead.email && (
                <a
                  href={`mailto:${lead.email}`}
                  className="flex items-center gap-1 hover:text-brand-lime transition-colors"
                >
                  <Mail className="h-3 w-3" /> {lead.email}
                </a>
              )}
            </div>
            <div className="flex gap-2 pt-2">
              <Badge
                style={{
                  backgroundColor: lead.status?.color + '20',
                  color: lead.status?.color,
                }}
              >
                {lead.status?.name}
              </Badge>
              {lead.ai_agent_blocked && (
                <Badge variant="destructive">IA Bloqueada</Badge>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="info" className="h-full flex flex-col">
            <TabsList className="w-full justify-start px-6 pt-2 pb-0 bg-transparent border-b h-12">
              <TabsTrigger value="info">Informações</TabsTrigger>
              <TabsTrigger value="messages">Mensagens</TabsTrigger>
              <TabsTrigger value="history">Histórico</TabsTrigger>
            </TabsList>

            {/* Info Tab */}
            <TabsContent value="info" className="flex-1 overflow-auto p-6">
              <div className="space-y-6">
                <div className="grid gap-4">
                  <h3 className="font-semibold text-gray-900">Dados do Lead</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-500">
                        Nome
                      </label>
                      <Input
                        value={localLead.name || ''}
                        onChange={(e) =>
                          setLocalLead({ ...localLead, name: e.target.value })
                        }
                        className="bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-500">
                        Telefone
                      </label>
                      <Input
                        value={localLead.phone || ''}
                        onChange={(e) =>
                          setLocalLead({ ...localLead, phone: e.target.value })
                        }
                        className="bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-500">
                        Email
                      </label>
                      <Input
                        value={localLead.email || ''}
                        onChange={(e) =>
                          setLocalLead({ ...localLead, email: e.target.value })
                        }
                        className="bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-500">
                    Observações
                  </label>
                  <Textarea
                    value={localLead.notes || ''}
                    onChange={(e) =>
                      setLocalLead({ ...localLead, notes: e.target.value })
                    }
                    className="min-h-[120px] bg-white"
                    placeholder="Notas internas sobre o lead..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-500">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {localLead.tags?.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="gap-1 pr-1 bg-white border"
                      >
                        {tag}
                        <button
                          onClick={() => handleTagRemove(tag)}
                          className="hover:bg-gray-200 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Nova tag..."
                      className="max-w-[150px] h-8 text-sm bg-white"
                      onKeyDown={(e) => e.key === 'Enter' && handleTagAdd()}
                    />
                    <AppButton
                      size="sm"
                      variant="outline"
                      className="h-8"
                      onClick={handleTagAdd}
                    >
                      <Plus className="h-4 w-4" />
                    </AppButton>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Messages Tab */}
            <TabsContent value="messages" className="flex-1 overflow-hidden">
              <ScrollArea className="h-full p-6">
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-400 py-10">
                      Nenhuma mensagem encontrada
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={cn(
                          'flex flex-col max-w-[80%]',
                          msg.direction === 'outbound'
                            ? 'ml-auto items-end'
                            : 'items-start',
                        )}
                      >
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-xs font-medium text-gray-600">
                            {msg.sent_by}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {format(new Date(msg.created_at), 'HH:mm')}
                          </span>
                        </div>
                        <div
                          className={cn(
                            'p-3 rounded-2xl text-sm shadow-sm',
                            msg.direction === 'outbound'
                              ? 'bg-brand-lime text-brand-slate rounded-tr-none'
                              : 'bg-white border border-gray-100 rounded-tl-none',
                          )}
                        >
                          {msg.content}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history" className="flex-1 overflow-hidden">
              <ScrollArea className="h-full p-6">
                <div className="relative border-l-2 border-gray-100 ml-4 space-y-8">
                  {activities.map((activity) => (
                    <div key={activity.id} className="relative pl-6">
                      <div
                        className={cn(
                          'absolute -left-[9px] top-0 h-4 w-4 rounded-full border-2 border-white shadow-sm',
                          activity.type === 'status_change'
                            ? 'bg-amber-400'
                            : activity.type === 'deal_closed'
                              ? 'bg-lime-500'
                              : 'bg-gray-300',
                        )}
                      />
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-800">
                          {activity.description}
                        </p>
                        <span className="text-xs text-gray-500">
                          {format(
                            new Date(activity.created_at),
                            "dd 'de' MMM 'às' HH:mm",
                            { locale: ptBR },
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>

        {/* Quick Actions Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <AppButton
              variant="outline"
              className="w-full justify-start text-xs h-auto py-2 flex-col gap-1"
              onClick={() => onAction('schedule', lead)}
            >
              <Calendar className="h-4 w-4 mb-1 text-sky-500" />
              Agendar
            </AppButton>
            <AppButton
              variant="outline"
              className="w-full justify-start text-xs h-auto py-2 flex-col gap-1"
              onClick={() => onAction('sale', lead)}
            >
              <DollarSign className="h-4 w-4 mb-1 text-lime-500" />
              Vender
            </AppButton>
            <AppButton
              variant="outline"
              className="w-full justify-start text-xs h-auto py-2 flex-col gap-1"
              onClick={() => onAction('lost', lead)}
            >
              <AlertTriangle className="h-4 w-4 mb-1 text-amber-500" />
              Perdido
            </AppButton>
            <AppButton
              variant={lead.ai_agent_blocked ? 'default' : 'outline'}
              className={cn(
                'w-full justify-start text-xs h-auto py-2 flex-col gap-1',
                lead.ai_agent_blocked
                  ? 'bg-red-100 text-red-600 hover:bg-red-200 border-red-200'
                  : '',
              )}
              onClick={toggleAiBlock}
            >
              <Ban className="h-4 w-4 mb-1" />
              {lead.ai_agent_blocked ? 'Desbloquear IA' : 'Bloquear IA'}
            </AppButton>
          </div>
          {lead.status?.name === 'Ser Humano' && (
            <div className="mt-2">
              <AppButton
                variant="pill"
                className="w-full"
                onClick={returnToFlow}
              >
                <RotateCcw className="mr-2 h-4 w-4" /> Retornar ao Fluxo
              </AppButton>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
