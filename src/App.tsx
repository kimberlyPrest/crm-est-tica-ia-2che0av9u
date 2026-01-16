import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider } from '@/hooks/use-auth'
import { AuthGuard } from '@/components/layout/AuthGuard'

import Index from './pages/Index'
import Dashboard from './pages/Dashboard'
import Crm from './pages/Crm'
import Clientes from './pages/Clientes'
import Agenda from './pages/Agenda'
import KnowledgeBase from './pages/KnowledgeBase'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'
import MainLayout from './components/layout/MainLayout'

const App = () => (
  <BrowserRouter
    future={{ v7_startTransition: false, v7_relativeSplatPath: false }}
  >
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route
            path="/"
            element={
              <AuthGuard>
                <Index />
              </AuthGuard>
            }
          />

          <Route
            element={
              <AuthGuard>
                <MainLayout />
              </AuthGuard>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/crm" element={<Crm />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/agenda" element={<Agenda />} />
            <Route path="/base-conhecimento" element={<KnowledgeBase />} />
            <Route path="/configuracoes" element={<Settings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </AuthProvider>
  </BrowserRouter>
)

export default App
