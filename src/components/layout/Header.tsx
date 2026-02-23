import { useAuth } from '@/hooks/use-auth'
import { AppButton } from '@/components/AppButton'
import { LogOut } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useLocation } from 'react-router-dom'

export function Header() {
  const { signOut, user } = useAuth()
  const location = useLocation()

  const getPageTitle = (pathname: string) => {
    if (pathname.startsWith('/base-conhecimento/agente-ia'))
      return 'Base de Conhecimento > Agente IA'
    if (pathname.startsWith('/base-conhecimento/arquivos'))
      return 'Base de Conhecimento > Arquivos'

    switch (pathname) {
      case '/dashboard':
        return 'Dashboard'
      case '/crm':
        return 'CRM'
      case '/clientes':
        return 'Clientes'
      case '/agenda':
        return 'Agenda'
      case '/base-conhecimento':
        return 'Base de Conhecimento'
      case '/configuracoes':
        return 'Configurações'
      default:
        return 'ClinicAI'
    }
  }

  const handleLogout = async () => {
    await signOut()
  }

  const userInitial = user?.email ? user.email[0].toUpperCase() : 'U'
  const userName = user?.user_metadata?.name || user?.email || 'Usuário'

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 border-b border-white/20 bg-white/30 backdrop-blur-md">
      <h1 className="text-3xl font-bold text-brand-slate">
        {getPageTitle(location.pathname)}
      </h1>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
            <AvatarFallback className="bg-brand-lavender text-white font-bold text-xl">
              {userInitial}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-700">{userName}</p>
          </div>
        </div>

        <AppButton
          variant="glass-icon"
          onClick={handleLogout}
          aria-label="Sair"
        >
          <LogOut className="h-5 w-5" />
        </AppButton>
      </div>
    </header>
  )
}
