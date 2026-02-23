import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { GlassCard } from '@/components/GlassCard'
import { AppButton } from '@/components/AppButton'
import { toast } from 'sonner'
import {
  Loader2,
  RefreshCw,
  Unplug,
  Smartphone,
  AlertCircle,
  Link as LinkIcon,
  MessageSquare,
  QrCode,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type WhatsAppInstance = {
  id: string
  instance_name: string
  connection_status: string
  qr_code: string | null
  phone_number: string | null
  profile_name: string | null
  updated_at: string | null
}

export function WhatsAppSettings() {
  const { organizationId } = useAuth()
  const [instances, setInstances] = useState<WhatsAppInstance[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchInstances = async () => {
    if (!organizationId) return
    try {
      const { data, error } = await supabase
        .from('whatsapp_instances')
        .select('*')
        .eq('organization_id', organizationId)
        .order('updated_at', { ascending: false })

      if (error) throw error
      setInstances(data || [])
    } catch (error) {
      console.error('Error fetching instances:', error)
      toast.error('Erro ao carregar instância do WhatsApp')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInstances()

    if (!organizationId) return
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'whatsapp_instances',
          filter: `organization_id=eq.${organizationId}`,
        },
        () => {
          fetchInstances()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [organizationId])

  const handleCreateInstance = async () => {
    setActionLoading('create')
    try {
      const { error } = await supabase.functions.invoke(
        'evolution-create-instance',
        { method: 'POST' },
      )
      if (error) throw error

      toast.success('Instância criada! Aguarde o QR Code.')
      await fetchInstances()
    } catch (error) {
      console.error('Error creating instance:', error)
      toast.error('Erro ao criar instância do WhatsApp')
    } finally {
      setActionLoading(null)
    }
  }

  const handleDisconnect = async (instanceId: string) => {
    const confirmed = window.confirm(
      'Tem certeza que deseja desconectar e remover esta instância?',
    )
    if (!confirmed) return

    setActionLoading(`disconnect-${instanceId}`)
    try {
      const { error } = await supabase.functions.invoke(
        'evolution-disconnect',
        {
          body: { instanceId },
        },
      )
      if (error) throw error

      const { error: dbError } = await supabase
        .from('whatsapp_instances')
        .delete()
        .eq('id', instanceId)

      if (dbError) throw dbError

      toast.success('Instância removida com sucesso')
      await fetchInstances()
    } catch (error) {
      console.error('Error disconnecting:', error)
      toast.error('Erro ao remover instância')
    } finally {
      setActionLoading(null)
    }
  }

  const handleRefreshStatus = async (instanceId: string) => {
    setActionLoading(`refresh-${instanceId}`)
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/evolution-check-status?instanceId=${instanceId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        },
      )

      if (!response.ok) throw new Error('Failed to refresh status')

      toast.success('Status atualizado')
      await fetchInstances()
    } catch (error) {
      console.error('Error refreshing status:', error)
      toast.error('Erro ao atualizar status')
    } finally {
      setActionLoading(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return (
          <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
            Conectado
          </Badge>
        )
      case 'qr_received':
        return (
          <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-100">
            Aguardando Leitura de QR Code
          </Badge>
        )
      case 'connecting':
        return (
          <Badge className="bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100">
            Conectando...
          </Badge>
        )
      case 'disconnected':
      case 'failed':
      default:
        return (
          <Badge className="bg-red-100 text-red-700 border-red-200 hover:bg-red-100">
            Desconectado
          </Badge>
        )
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <GlassCard className="flex-1 w-full" size="md">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-[#25D366]/10 flex items-center justify-center text-[#25D366]">
              <Smartphone className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-brand-slate">
                Integração WhatsApp
              </h2>
              <p className="text-sm text-gray-500">
                Conecte seu número para a IA e o CRM interagirem com seus
                clientes.
              </p>
            </div>
          </div>
        </GlassCard>

        {instances.length === 0 && (
          <AppButton
            onClick={handleCreateInstance}
            loading={actionLoading === 'create'}
            className="whitespace-nowrap bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-lg"
          >
            <LinkIcon className="h-4 w-4 mr-2" />
            Conectar novo número
          </AppButton>
        )}
      </div>

      {instances.length === 0 ? (
        <GlassCard className="flex flex-col items-center justify-center py-16 text-center space-y-4 border-dashed bg-white/40">
          <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100">
            <Unplug className="h-10 w-10 text-gray-300" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700">
              Nenhum WhatsApp Conectado
            </h3>
            <p className="text-gray-500 max-w-sm mx-auto mt-1">
              Conecte seu número de atendimento para que a inteligência
              artificial possa responder seus leads automaticamente.
            </p>
          </div>
          <AppButton
            onClick={handleCreateInstance}
            loading={actionLoading === 'create'}
            className="mt-4 bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-md"
          >
            <LinkIcon className="h-4 w-4 mr-2" />
            Conectar novo número
          </AppButton>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {instances.slice(0, 1).map((instance) => (
            <GlassCard
              key={instance.id}
              className="flex flex-col md:flex-row gap-6 bg-white/60"
            >
              <div className="flex-1 space-y-4">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-bold text-xl text-gray-800">
                      {instance.profile_name || instance.instance_name}
                    </h3>
                    {getStatusBadge(instance.connection_status)}
                  </div>
                  {instance.phone_number ? (
                    <p className="text-gray-500 font-medium font-mono text-lg">
                      {instance.phone_number}
                    </p>
                  ) : (
                    <p className="text-gray-400 text-sm">
                      Número não identificado
                    </p>
                  )}
                  <p className="text-xs text-gray-400 font-mono mt-1">
                    ID da Instância: {instance.instance_name}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                  <AppButton
                    variant="outline"
                    size="sm"
                    onClick={() => handleRefreshStatus(instance.id)}
                    loading={actionLoading === `refresh-${instance.id}`}
                    disabled={
                      actionLoading !== null &&
                      actionLoading !== `refresh-${instance.id}`
                    }
                  >
                    <RefreshCw
                      className={cn(
                        'h-4 w-4 mr-2',
                        actionLoading === `refresh-${instance.id}`
                          ? 'animate-spin'
                          : '',
                      )}
                    />
                    Atualizar status / QR Code
                  </AppButton>

                  <AppButton
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100"
                    onClick={() => handleDisconnect(instance.id)}
                    loading={actionLoading === `disconnect-${instance.id}`}
                    disabled={
                      actionLoading !== null &&
                      actionLoading !== `disconnect-${instance.id}`
                    }
                  >
                    <Unplug className="h-4 w-4 mr-2" />
                    Remover Instância
                  </AppButton>
                </div>
              </div>

              {instance.connection_status !== 'connected' &&
                instance.qr_code && (
                  <div className="md:w-72 bg-white rounded-2xl p-6 flex flex-col items-center justify-center border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-center h-10 w-10 bg-yellow-50 rounded-full text-yellow-600 mb-3">
                      <QrCode className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-semibold text-gray-800 mb-4 text-center">
                      Escaneie o QR Code
                    </p>
                    <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                      <img
                        src={instance.qr_code}
                        alt="WhatsApp QR Code"
                        className="w-48 h-48 object-contain"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-4 text-center leading-relaxed">
                      Abra o WhatsApp no seu celular, vá em Aparelhos Conectados
                      e escaneie.
                    </p>
                  </div>
                )}

              {instance.connection_status === 'connected' && (
                <div className="md:w-72 bg-[#25D366]/5 rounded-2xl p-6 flex flex-col items-center justify-center border border-[#25D366]/20">
                  <div className="h-20 w-20 bg-[#25D366]/20 rounded-full flex items-center justify-center text-[#25D366] mb-4 shadow-inner">
                    <MessageSquare className="h-10 w-10" />
                  </div>
                  <p className="text-base font-bold text-gray-800 text-center">
                    WhatsApp Ativo
                  </p>
                  <p className="text-sm text-gray-500 mt-2 text-center font-medium">
                    Pronto para enviar e receber mensagens
                  </p>
                </div>
              )}

              {instance.connection_status !== 'connected' &&
                !instance.qr_code && (
                  <div className="md:w-72 bg-red-50/50 rounded-2xl p-6 flex flex-col items-center justify-center border border-red-100">
                    <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center text-red-500 mb-4 shadow-inner">
                      <AlertCircle className="h-8 w-8" />
                    </div>
                    <p className="text-base font-bold text-red-800 text-center">
                      {instance.connection_status === 'connecting'
                        ? 'Conectando...'
                        : 'Desconectado'}
                    </p>
                    <p className="text-sm text-red-600/80 mt-2 text-center">
                      {instance.connection_status === 'connecting'
                        ? 'Aguarde um momento.'
                        : 'Tente atualizar o status para gerar um novo QR Code.'}
                    </p>
                  </div>
                )}
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  )
}
