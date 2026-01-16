import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { AppButton } from '@/components/AppButton'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import { CRMStatus } from '@/hooks/use-crm-data'

const formSchema = z.object({
  name: z.string().optional(),
  phone: z
    .string()
    .min(10, 'Telefone inválido')
    .transform((val) => val.replace(/\D/g, '')), // Clean for validation/submission if needed, but we keep format in UI
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  status_id: z.string().min(1, 'Selecione um status'),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface NewLeadModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  statuses: CRMStatus[]
  onSuccess?: () => void
}

export function NewLeadModal({
  open,
  onOpenChange,
  statuses,
  onSuccess,
}: NewLeadModalProps) {
  const [loading, setLoading] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      status_id: '',
      notes: '',
    },
  })

  // Set default status to "Novo" when statuses load
  useEffect(() => {
    if (statuses.length > 0 && !form.getValues('status_id')) {
      const newStatus = statuses.find((s) => s.name === 'Novo')
      if (newStatus) {
        form.setValue('status_id', newStatus.id)
      } else {
        form.setValue('status_id', statuses[0].id)
      }
    }
  }, [statuses, form])

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{2})/, '($1) ')
        .replace(/(\d{5})(\d{4})/, '$1-$2')
    }
    return value
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value)
    if (formatted.length <= 15) {
      form.setValue('phone', formatted)
    }
  }

  const onSubmit = async (values: FormValues) => {
    setLoading(true)
    try {
      // Unmask phone for storage if desired, keeping masked for now as per usual display requirements
      // But typically we store clean or consistent. Let's store clean numbers or consistent format.
      // Acceptance criteria asks for mask in UI. Supabase type is string.
      // Let's store as is or cleaned. Let's store exactly what is in the input for now to match mask requirements strictly.

      const { error } = await supabase.from('leads').insert({
        name: values.name || 'Sem Nome',
        phone: values.phone,
        email: values.email || null,
        status_id: values.status_id,
        notes: values.notes || null,
        created_at: new Date().toISOString(),
      })

      if (error) throw error

      toast.success('Lead criado com sucesso!')
      form.reset()
      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      console.error('Error creating lead:', error)
      toast.error('Erro ao criar lead')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] glass border-white/40">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-brand-slate">
            Novo Lead
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nome do cliente"
                      className="bg-white/50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="(XX) XXXXX-XXXX"
                        className="bg-white/50"
                        {...field}
                        onChange={(e) => {
                          handlePhoneChange(e)
                          field.onChange(e)
                        }}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status Inicial</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-white/50">
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {statuses.map((status) => (
                          <SelectItem key={status.id} value={status.id}>
                            <div className="flex items-center gap-2">
                              <div
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: status.color }}
                              />
                              {status.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="email@exemplo.com"
                      className="bg-white/50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detalhes adicionais..."
                      className="bg-white/50 min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <AppButton
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancelar
              </AppButton>
              <AppButton type="submit" variant="pill" loading={loading}>
                Criar Lead
              </AppButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
