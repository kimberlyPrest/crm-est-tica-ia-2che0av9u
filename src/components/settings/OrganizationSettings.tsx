import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { GlassCard } from '@/components/GlassCard'
import { AppButton } from '@/components/AppButton'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Loader2, Save } from 'lucide-react'

export function OrganizationSettings() {
  const { organizationId } = useAuth()
  const [orgName, setOrgName] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function fetchOrg() {
      if (!organizationId) return
      try {
        const { data, error } = await supabase
          .from('organizations')
          .select('name')
          .eq('id', organizationId)
          .single()

        if (error) throw error
        if (data) setOrgName(data.name)
      } catch (error) {
        console.error('Error fetching org:', error)
        toast.error('Erro ao carregar dados da organização')
      } finally {
        setLoading(false)
      }
    }
    fetchOrg()
  }, [organizationId])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!organizationId || !orgName.trim()) return

    setSaving(true)
    try {
      const { error } = await supabase
        .from('organizations')
        .update({ name: orgName.trim(), updated_at: new Date().toISOString() })
        .eq('id', organizationId)

      if (error) throw error
      toast.success('Organização atualizada com sucesso')
    } catch (error) {
      console.error('Error updating org:', error)
      toast.error('Erro ao atualizar organização')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <GlassCard className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-brand-lime" />
      </GlassCard>
    )
  }

  return (
    <GlassCard>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-brand-slate">
          Perfil da Organização
        </h2>
        <p className="text-sm text-gray-500">
          Atualize os dados da sua clínica ou empresa.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 max-w-md">
        <div className="space-y-2">
          <Label htmlFor="orgName">Nome da Organização</Label>
          <Input
            id="orgName"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            className="bg-white/60"
            required
          />
        </div>

        <AppButton type="submit" loading={saving} className="w-full sm:w-auto">
          <Save className="w-4 h-4 mr-2" />
          Salvar Alterações
        </AppButton>
      </form>
    </GlassCard>
  )
}
