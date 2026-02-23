import { useAgentConfig } from '@/hooks/use-agent-config'
import { GlobalControls } from '@/components/agent-config/GlobalControls'
import { IdentitySection } from '@/components/agent-config/IdentitySection'
import { KnowledgeSafetySection } from '@/components/agent-config/KnowledgeSafetySection'
import { FewShotSection } from '@/components/agent-config/FewShotSection'
import { AgentPreview } from '@/components/agent-config/AgentPreview'
import { AppButton } from '@/components/AppButton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Save, Loader2, History } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function AgentConfigPage() {
  const {
    config,
    loading,
    saving,
    hasUnsavedChanges,
    activeFiles,
    handleChange,
    toggleEnabled,
    saveConfig,
  } = useAgentConfig()

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-lime" />
      </div>
    )
  }

  return (
    <div className="pb-24 animate-fade-in relative">
      <div className="flex flex-col gap-2 mb-8">
        <p className="text-gray-500">
          Personalize o comportamento, conhecimento e segurança do seu
          assistente virtual.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <GlobalControls
            config={config}
            onChange={handleChange}
            onToggle={toggleEnabled}
          />

          <Tabs defaultValue="identity" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/40 mb-6 p-1 h-12 rounded-xl">
              <TabsTrigger
                value="identity"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Identidade
              </TabsTrigger>
              <TabsTrigger
                value="knowledge"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Conhecimento
              </TabsTrigger>
              <TabsTrigger
                value="training"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Treinamento
              </TabsTrigger>
            </TabsList>

            <TabsContent value="identity" className="mt-0">
              <IdentitySection config={config} onChange={handleChange} />
            </TabsContent>

            <TabsContent value="knowledge" className="mt-0">
              <KnowledgeSafetySection
                config={config}
                onChange={handleChange}
                activeFiles={activeFiles}
              />
            </TabsContent>

            <TabsContent value="training" className="mt-0">
              <FewShotSection config={config} onChange={handleChange} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar Preview */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-24">
            <AgentPreview config={config} />
          </div>
        </div>
      </div>

      {/* Sticky Footer */}
      <div
        className={cn(
          'fixed bottom-0 left-0 md:left-[240px] right-0 p-4 bg-white/80 backdrop-blur-lg border-t border-gray-200 flex justify-between items-center transition-transform duration-300 z-40',
          hasUnsavedChanges ? 'translate-y-0' : 'translate-y-full',
        )}
      >
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <History className="h-4 w-4" />
          <span>Alterações não salvas</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-400 hidden sm:inline">
            Salvo automaticamente no navegador
          </span>
          <AppButton
            onClick={saveConfig}
            loading={saving}
            className="bg-brand-slate text-white hover:bg-gray-800 shadow-lg"
          >
            <Save className="w-4 h-4 mr-2" /> Salvar Configurações
          </AppButton>
        </div>
      </div>
    </div>
  )
}
