import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { GlassCard } from '@/components/GlassCard'
import { AppButton } from '@/components/AppButton'
import { toast } from 'sonner'
import { FileText, Upload, Trash2, Plus, Loader2 } from 'lucide-react'

export interface KBFile {
  id: string
  name: string
  file_path: string
  file_type: string
  is_active: boolean
  uploaded_at: string
}

export default function FilesPage() {
  const [files, setFiles] = useState<KBFile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFiles()
  }, [])

  const fetchFiles = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('knowledge_base_files')
        .select('*')
        .order('uploaded_at', { ascending: false })

      if (error) throw error
      setFiles(data || [])
    } catch (error) {
      console.error('Error fetching files:', error)
      toast.error('Erro ao carregar arquivos')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, fileName: string) => {
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

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-lime" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in relative">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold text-brand-slate">
          Arquivos de Conhecimento
        </h1>
        <p className="text-gray-500">
          Gerencie PDFs, planilhas e documentos que a IA pode acessar.
        </p>
      </div>

      <div className="flex justify-end mb-4">
        <AppButton
          onClick={() => toast.info('Funcionalidade de upload em breve')}
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Arquivo
        </AppButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {files.length === 0 && (
          <div className="col-span-full p-8 text-center text-gray-500 bg-white/40 rounded-xl border border-dashed border-gray-300">
            Nenhum arquivo cadastrado.
          </div>
        )}
        {files.map((file) => (
          <GlassCard key={file.id} className="flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-sky-100 text-sky-600 rounded-xl">
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
                <p className="text-xs text-gray-500">
                  <span className="font-semibold">Status:</span>{' '}
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
                onClick={() => handleDelete(file.id, file.name)}
              >
                <Trash2 className="h-4 w-4" />
              </AppButton>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
