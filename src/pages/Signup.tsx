import { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { GlassCard } from '@/components/GlassCard'
import { AppButton } from '@/components/AppButton'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, UserPlus } from 'lucide-react'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'

const Signup = () => {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      setIsLoading(false)
      return
    }

    try {
      const { error: signUpError } = await signUp(email, password, name)

      if (signUpError) {
        console.error(signUpError)
        setError('Falha ao criar conta. Verifique os dados e tente novamente.')
        toast.error('Ocorreu um erro ao criar a conta')
      } else {
        toast.success('Conta criada com sucesso! Verifique seu e-mail.')
        navigate('/verify-email')
      }
    } catch (err) {
      setError('Ocorreu um erro inesperado')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F9FAFB] to-[#E5E7EB] p-4">
      <GlassCard className="w-full max-w-[400px] flex flex-col gap-6" size="lg">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-brand-lime/20 text-brand-lime mb-2">
            <UserPlus className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-brand-slate">Criar Conta</h1>
          <p className="text-sm text-gray-500">Cadastre-se no CRM Estética</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="text-sm font-semibold text-gray-700"
            >
              Nome
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-full bg-white/60 border-gray-200 focus:ring-2 focus:ring-brand-lime focus:border-transparent h-10 transition-all"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-semibold text-gray-700"
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-full bg-white/60 border-gray-200 focus:ring-2 focus:ring-brand-lime focus:border-transparent h-10 transition-all"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-sm font-semibold text-gray-700"
            >
              Senha
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-full bg-white/60 border-gray-200 focus:ring-2 focus:ring-brand-lime focus:border-transparent h-10 transition-all"
              required
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 p-3 rounded-lg">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <AppButton
            type="submit"
            variant="pill"
            className="w-full mt-2"
            loading={isLoading}
          >
            {isLoading ? 'Criando...' : 'Criar Conta'}
          </AppButton>

          <p className="text-center text-sm text-gray-500 mt-4">
            Já tem uma conta?{' '}
            <Link
              to="/login"
              className="text-brand-lime font-semibold hover:underline"
            >
              Entrar
            </Link>
          </p>
        </form>
      </GlassCard>
    </div>
  )
}

export default Signup
