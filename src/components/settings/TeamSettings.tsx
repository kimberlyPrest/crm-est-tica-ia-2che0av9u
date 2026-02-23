import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { GlassCard } from '@/components/GlassCard'
import { AppButton } from '@/components/AppButton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Loader2, UserPlus } from 'lucide-react'

type UserRow = {
  id: string
  name: string
  email: string
  role: string
  is_active: boolean
}

export function TeamSettings() {
  const { organizationId } = useAuth()
  const [users, setUsers] = useState<UserRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUsers() {
      if (!organizationId) return
      try {
        const { data, error } = await supabase
          .from('users')
          .select('id, name, email, role, is_active')
          .eq('organization_id', organizationId)
          .order('name')

        if (error) throw error
        setUsers(data || [])
      } catch (error) {
        console.error('Error fetching users:', error)
        toast.error('Erro ao carregar equipe')
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [organizationId])

  if (loading) {
    return (
      <GlassCard className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-brand-lime" />
      </GlassCard>
    )
  }

  return (
    <GlassCard>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-brand-slate">Equipe</h2>
          <p className="text-sm text-gray-500">
            Gerencie os membros da sua organização.
          </p>
        </div>
        <AppButton onClick={() => toast.info('Adição de membros em breve.')}>
          <UserPlus className="h-4 w-4 mr-2" />
          Novo Membro
        </AppButton>
      </div>

      <div className="bg-white/40 rounded-xl border border-white/20 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Função</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-8 text-gray-500"
                >
                  Nenhum membro encontrado.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium text-gray-800">
                    {user.name}
                  </TableCell>
                  <TableCell className="text-gray-600">{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize bg-white/50">
                      {user.role === 'admin' ? 'Administrador' : 'Equipe'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.is_active ? (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200">
                        Ativo
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="bg-gray-100 text-gray-600"
                      >
                        Inativo
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </GlassCard>
  )
}
