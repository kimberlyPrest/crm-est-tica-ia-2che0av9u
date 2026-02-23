import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { GlassCard } from '@/components/GlassCard'
import { AppButton } from '@/components/AppButton'
import { toast } from 'sonner'
import { FileText, Mic, Trash2, Plus, Loader2 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export interface KBFile {
  id: string
  name: string
  file_path: string
  file_type: string
  is_active: boolean
  uploaded_at: string
}

export interface KBAudio {
  id: string
  name: string
  audio_path: string
  trigger_keywords: string[] | null
  is_active: boolean
  uploaded_at: string
}

export default function FilesPage() {
  const [files, setFiles] = useState<KBFile[]>([])
  const [audios, setAudios] = useState<KBAudio[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [filesResponse, audiosResponse] = await Promise.all([
        supabase
          .from('knowledge_base_files')
          .select('*')
          .order('uploaded_at', { ascending: false }),
        supabase
          .from('knowledge_base_audios')
          .select('*')
          .order('uploaded_at', { ascending: false }),
      ])

      if (filesResponse.error) throw filesResponse.error
      if (audiosResponse.error) throw audiosResponse.error

      setFiles(filesResponse.data || [])
      setAudios(audiosResponse.data || [])
    } catch (error) {
      console.error('Error fetching knowledge base data:', error)
      toast.error('Erro ao carregar arquivos e áudios')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteFile = async (id: string, fileName: string) => {
    const confirm = window.confirm(
      `Deseja deletar permanentemente o arquivo ${fileName}?`,
    )
    if (!confirm) return

    try {
      const { error } = await supabase
        .from('knowledge_base_files')
        .delete()
        .eq('id', id)
      if (error) throw error
      toast.success('Arquivo excluído com sucesso')
      setFiles(files.filter((f) => f.id !== id))
    } catch (error) {
      console.error(error)
      toast.error('Erro ao excluir arquivo')
    }
  }

  const handleDeleteAudio = async (id: string, fileName: string) => {
    const confirm = window.confirm(
      `Deseja deletar permanentemente o áudio ${fileName}?`,
    )
    if (!confirm) return

    try {
      const { error } = await supabase
        .from('knowledge_base_audios')
        .delete()
        .eq('id', id)
      if (error) throw error
      toast.success('Áudio excluído com sucesso')
      setAudios(audios.filter((a) => a.id !== id))
    } catch (error) {
      console.error(error)
      toast.error('Erro ao excluir áudio')
    }
  }

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-lime" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in relative">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
        <div className="flex flex-col gap-2">
          <p className="text-gray-500">
            Gerencie os documentos e áudios que a IA pode enviar aos clientes.
          </p>
        </div>
        <AppButton
          onClick={() => toast.info('Funcionalidade de upload em breve')}
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Upload
        </AppButton>
      </div>

      <Tabs defaultValue="files" className="w-full">
        <TabsList className="mb-6 grid w-full max-w-[400px] grid-cols-2 bg-white/40 p-1 h-12 rounded-xl">
          <TabsTrigger
            value="files"
            className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <FileText className="h-4 w-4" /> Documentos ({files.length})
          </TabsTrigger>
          <TabsTrigger
            value="audios"
            className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <Mic className="h-4 w-4" /> Áudios ({audios.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="files" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {files.length === 0 && (
              <div className="col-span-full p-8 text-center text-gray-500 bg-white/40 rounded-xl border border-dashed border-gray-300">
                Nenhum documento cadastrado.
              </div>
            )}
            {files.map((file) => (
              <GlassCard
                key={file.id}
                className="flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                      <FileText className="h-6 w-6" />
                    </div>
                    <h3
                      className="font-bold text-gray-800 line-clamp-2"
                      title={file.name}
                    >
                      {file.name}
                    </h3>
                  </div>
                  <div className="space-y-2 mt-4">
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <span className="font-semibold">Status:</span>
                      {file.is_active ? '✅ Ativo' : '❌ Inativo'}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full border border-gray-200">
                        {file.file_type || 'Documento'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex gap-2 justify-end border-t border-gray-100 pt-4">
                  <AppButton
                    variant="ghost"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => handleDeleteFile(file.id, file.name)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </AppButton>
                </div>
              </GlassCard>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="audios" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {audios.length === 0 && (
              <div className="col-span-full p-8 text-center text-gray-500 bg-white/40 rounded-xl border border-dashed border-gray-300">
                Nenhum áudio cadastrado.
              </div>
            )}
            {audios.map((audio) => (
              <GlassCard
                key={audio.id}
                className="flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                      <Mic className="h-6 w-6" />
                    </div>
                    <h3
                      className="font-bold text-gray-800 line-clamp-2"
                      title={audio.name}
                    >
                      {audio.name}
                    </h3>
                  </div>
                  <div className="space-y-2 mt-4">
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <span className="font-semibold">Status:</span>
                      {audio.is_active ? '✅ Ativo' : '❌ Inativo'}
                    </p>
                    <div className="mt-2">
                      <span className="text-xs font-semibold text-gray-500">
                        Gatilhos:
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {audio.trigger_keywords?.map((kw, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-purple-50 text-purple-600 text-xs rounded-full border border-purple-100"
                          >
                            {kw}
                          </span>
                        ))}
                        {(!audio.trigger_keywords ||
                          audio.trigger_keywords.length === 0) && (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full border border-gray-200">
                            Sem gatilhos
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex gap-2 justify-end border-t border-gray-100 pt-4">
                  <AppButton
                    variant="ghost"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => handleDeleteAudio(audio.id, audio.name)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </AppButton>
                </div>
              </GlassCard>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
