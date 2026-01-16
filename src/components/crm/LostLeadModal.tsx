import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { AppButton } from '@/components/AppButton'
import { AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import { CRMLead } from '@/hooks/use-crm-data'

interface LostLeadModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  lead: CRMLead | null
  statusId: string
  onSuccess: () => void
}

const REASONS = [
  'Preço',
  'Concorrente',
  'Desistiu',
  'Não respondeu',
  'Localização',
  'Outro',
]

export function LostLeadModal({
  open,
  onOpenChange,
  lead,
  statusId,
  onSuccess,
}: LostLeadModalProps) {
  const [reason, setReason] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!lead || !reason) {
      toast.error('Selecione um motivo')
      return
    }

    if (reason === 'Outro' && !notes) {
      toast.error('Descreva o motivo')
      return
    }

    setLoading(true)
    try {
      // 1. Update Lead Status and Notes
      const newNote = `Motivo de perda: ${reason}${notes ? ` - ${notes}` : ''}`
      const updatedNotes = lead.notes ? `${lead.notes}\n\n${newNote}` : newNote

      const { error: leadError } = await supabase
        .from('leads')
        .update({
          status_id: statusId,
          notes: updatedNotes,
        })
        .eq('id', lead.id)

      if (leadError) throw leadError

      // 2. Insert Activity
      const { error: activityError } = await supabase
        .from('activities')
        .insert({
          lead_id: lead.id,
          type: 'status_change',
          description: `Marcado como Perdido: ${reason}`,
        })

      if (activityError) throw activityError

      toast.success('Lead marcado como perdido')
      onSuccess()
      onOpenChange(false)
      setReason('')
      setNotes('')
    } catch (error) {
      console.error('Error marking lead as lost:', error)
      toast.error('Erro ao atualizar lead')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass border-white/40 sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <DialogTitle className="text-xl font-bold text-gray-800">
              Marcar como Perdido
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Motivo *</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger className="bg-white/50">
                <SelectValue placeholder="Selecione o motivo..." />
              </SelectTrigger>
              <SelectContent>
                {REASONS.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {reason === 'Outro' && (
            <div className="grid gap-2">
              <Label>Observações *</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Descreva o motivo..."
                className="bg-white/50"
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <AppButton
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancelar
          </AppButton>
          <AppButton
            variant="destructive"
            onClick={handleSubmit}
            loading={loading}
          >
            Confirmar Perda
          </AppButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
