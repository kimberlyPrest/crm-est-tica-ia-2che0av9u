import { cn } from '@/lib/utils'
import { Link, useLocation } from 'react-router-dom'
import {
  BarChart3,
  Trello,
  Users,
  Calendar,
  BookOpen,
  Settings,
  Menu,
} from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useIsMobile } from '@/hooks/use-mobile'

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { path: '/crm', label: 'CRM', icon: Trello },
  { path: '/clientes', label: 'Clientes', icon: Users },
  { path: '/agenda', label: 'Agenda', icon: Calendar },
  { path: '/base-conhecimento', label: 'Base de Conhecimento', icon: BookOpen },
  { path: '/configuracoes', label: 'Configurações', icon: Settings },
]

export function Sidebar() {
  const location = useLocation()
  const isMobile = useIsMobile()
  const [open, setOpen] = useState(false)

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="pt-8 pb-8 px-6">
        <h2 className="text-xl font-bold text-brand-slate">
          Clinic<span className="text-brand-lime">AI</span>
        </h2>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path
          const Icon = item.icon
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group',
                isActive
                  ? 'bg-brand-lime-light text-brand-slate font-semibold shadow-sm'
                  : 'text-gray-600 hover:bg-white/50 hover:scale-[1.02]',
              )}
            >
              <Icon
                className={cn(
                  'h-5 w-5',
                  isActive
                    ? 'text-brand-slate'
                    : 'text-gray-500 group-hover:text-brand-slate',
                )}
              />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
      <div className="p-6 text-xs text-gray-400">v0.0.1</div>
    </div>
  )

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden fixed top-4 left-4 z-50 glass"
          >
            <Menu className="h-6 w-6 text-brand-slate" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-[280px] p-0 border-r border-white/40 bg-white/60 backdrop-blur-xl"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Menu de Navegação</SheetTitle>
          </SheetHeader>
          <NavContent />
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <aside className="hidden md:flex flex-col w-[240px] fixed inset-y-0 left-0 border-r border-white/40 bg-white/60 backdrop-blur-xl z-20">
      <NavContent />
    </aside>
  )
}
