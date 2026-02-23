import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { WhatsAppSettings } from '@/components/settings/WhatsAppSettings'
import { OrganizationSettings } from '@/components/settings/OrganizationSettings'
import { TeamSettings } from '@/components/settings/TeamSettings'
import { MessageSquare, Building2, Users } from 'lucide-react'

export default function Settings() {
  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="flex flex-col gap-2">
        <p className="text-gray-500">
          Gerencie sua organização, equipe e integrações do sistema.
        </p>
      </div>

      <Tabs defaultValue="organization" className="w-full">
        <TabsList className="mb-6 grid w-full max-w-[600px] grid-cols-3 bg-white/40 p-1 h-12 rounded-xl">
          <TabsTrigger
            value="organization"
            className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <Building2 className="h-4 w-4" /> Organização
          </TabsTrigger>
          <TabsTrigger
            value="whatsapp"
            className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <MessageSquare className="h-4 w-4" /> WhatsApp
          </TabsTrigger>
          <TabsTrigger
            value="team"
            className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <Users className="h-4 w-4" /> Equipe
          </TabsTrigger>
        </TabsList>

        <TabsContent value="organization" className="mt-0">
          <OrganizationSettings />
        </TabsContent>

        <TabsContent value="whatsapp" className="mt-0">
          <WhatsAppSettings />
        </TabsContent>

        <TabsContent value="team" className="mt-0">
          <TeamSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}
