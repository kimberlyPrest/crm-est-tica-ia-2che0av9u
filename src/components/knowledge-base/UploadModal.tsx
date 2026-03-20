import { useState, useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { AppButton } from '@/components/AppButton'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface UploadModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function UploadModal({
  open,
  onOpenChange,
  onSuccess,
}: UploadModalProps) {
  const { organizationId } = useAuth()
  const [loading, setLoading] = useState(false)
  const [type, setType] = useState<'document' | 'audio'>('document')
  const [name, setName] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [keywords, setKeywords] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleTypeChange = (val: 'document' | 'audio') => {
    setType(val)
    setFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !name || !organizationId) {
      toast.error('Preencha os campos obrigatórios')
      return
    }

    const fileExt = file.name.split('.').pop()?.toLowerCase() || ''

    if (type === 'document') {
      if (!['pdf', 'docx', 'txt'].includes(fileExt)) {
        toast.error('Formato de documento inválido. Use PDF, DOCX ou TXT.')
        return
      }
    } else {
      if (!['mp3', 'wav', 'ogg'].includes(fileExt)) {
        toast.error('Formato de áudio inválido. Use MP3, WAV ou OGG.')
        return
      }
    }

    try {
      setLoading(true)

      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`
      const filePath = `${organizationId}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('knowledge_base')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) throw uploadError

      const { data: publicUrlData } = supabase.storage
        .from('knowledge_base')
        .getPublicUrl(filePath)

      const fileUrl = publicUrlData.publicUrl

      if (type === 'document') {
        const { error: dbError } = await supabase
          .from('knowledge_base_files')
          .insert({
            name,
            file_path: fileUrl,
            file_type: fileExt,
            organization_id: organizationId,
          })
        if (dbError) throw dbError
      } else {
        const triggerKeywords = keywords
          .split(',')
          .map((k) => k.trim())
          .filter((k) => k.length > 0)

        const { error: dbError } = await supabase
          .from('knowledge_base_audios')
          .insert({
            name,
            audio_path: fileUrl,
            trigger_keywords:
              triggerKeywords.length > 0 ? triggerKeywords : null,
            organization_id: organizationId,
          })
        if (dbError) throw dbError
      }

      toast.success('Upload concluído com sucesso!')
      onSuccess()
      onOpenChange(false)
      // Reset form
      setName('')
      setFile(null)
      setKeywords('')
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (error: any) {
      console.error('Upload error:', error)
      toast.error(error.message || 'Erro ao realizar upload')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Upload</DialogTitle>
          <DialogDescription>
            Adicione novos documentos ou áudios para a base de conhecimento da
            IA.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Tipo de Arquivo</Label>
            <Select value={type} onValueChange={handleTypeChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="document">
                  Documento (PDF, DOCX, TXT)
                </SelectItem>
                <SelectItem value="audio">Áudio (MP3, WAV, OGG)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Nome de Identificação</Label>
            <Input
              placeholder={
                type === 'document'
                  ? 'Ex: Tabela de Preços'
                  : 'Ex: Áudio Boas Vindas'
              }
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Arquivo</Label>
            <Input
              type="file"
              accept={
                type === 'document' ? '.pdf,.docx,.txt' : '.mp3,.wav,.ogg'
              }
              onChange={handleFileChange}
              ref={fileInputRef}
              required
            />
          </div>

          {type === 'audio' && (
            <div className="space-y-2">
              <Label>Gatilhos (separados por vírgula)</Label>
              <Input
                placeholder="Ex: preços, valor, valores, custo"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Palavras que ajudam a IA a entender quando enviar este áudio.
              </p>
            </div>
          )}

          <DialogFooter>
            <AppButton
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </AppButton>
            <AppButton type="submit" disabled={loading || !file || !name}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Fazer Upload
            </AppButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
