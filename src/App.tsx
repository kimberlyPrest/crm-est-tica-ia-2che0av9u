import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider } from '@/hooks/use-auth'
import { AuthGuard } from '@/components/layout/AuthGuard'

import Login from './pages/Login'
import Signup from './pages/Signup'
import VerifyEmail from './pages/VerifyEmail'
import Dashboard from './pages/Dashboard'
import Crm from './pages/Crm'
import Clientes from './pages/Clientes'
import Agenda from './pages/Agenda'
import KnowledgeBase from './pages/KnowledgeBase'
import AgentConfigPage from './pages/knowledge-base/AgentConfig'
import FilesPage from './pages/knowledge-base/Files'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'
import MainLayout from './components/layout/MainLayout'

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route
            path="/login"
            element={
              <AuthGuard>
                <Login />
              </AuthGuard>
            }
          />
          <Route
            path="/signup"
            element={
              <AuthGuard>
                <Signup />
              </AuthGuard>
            }
          />
          <Route
            path="/verify-email"
            element={
              <AuthGuard>
                <VerifyEmail />
              </AuthGuard>
            }
          />
          <Route
            path="/"
            element={
              <AuthGuard>
                <Navigate to="/dashboard" replace />
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
            <Route
              path="/base-conhecimento/agente-ia"
              element={<AgentConfigPage />}
            />
            <Route path="/base-conhecimento/arquivos" element={<FilesPage />} />
            <Route path="/configuracoes" element={<Settings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </AuthProvider>
  </BrowserRouter>
)

export default App
