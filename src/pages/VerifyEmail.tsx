import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'

const VerifyEmail = () => {
  return (
    <div className="min-h-screen bg-[#eef0ee] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center font-sans">
      <div className="bg-white rounded-[28px] p-[36px_24px] sm:p-12 max-w-[600px] w-full shadow-[0_4px_40px_rgba(0,0,0,0.08),0_1px_4px_rgba(0,0,0,0.04)] animate-fade-in-up">
        {/* Header: CRM Estética */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 border border-gray-100">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#d9f0b0] text-sm">
              🩺
            </span>
            <span className="text-sm font-bold text-gray-800 tracking-tight">
              CRM Estética
            </span>
          </div>
        </div>

        {/* Main Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-[#d9f0b0] flex items-center justify-center text-3xl">
            ✉️
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className="text-center mb-8">
          <h1 className="text-[26px] sm:text-[30px] font-[800] text-[#1a1a1a] mb-3 leading-tight tracking-tight">
            Confirme seu cadastro
          </h1>
          <p className="text-[#6b7280] text-base leading-relaxed max-w-[400px] mx-auto">
            Clique no botão abaixo para verificar seu e-mail e ativar sua conta
            no CRM Estética.
          </p>
        </div>

        {/* CTA Section */}
        <div className="flex flex-col items-center gap-4 mb-10">
          <Link to="/login" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto px-8 py-3.5 bg-[#84CC16] hover:bg-[#74b313] text-white font-semibold rounded-full transition-all shadow-sm flex items-center justify-center gap-2">
              <Mail className="w-5 h-5" />
              Ir para o Login
            </button>
          </Link>
          <p className="text-sm text-gray-500">
            Não recebeu o e-mail?{' '}
            <button className="text-[#84CC16] hover:underline font-medium focus:outline-none">
              Reenviar agora
            </button>
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-100 w-full mb-8"></div>

        {/* Next Steps */}
        <div className="mb-10">
          <h2 className="text-[11px] font-bold text-[#9ca3af] tracking-wider uppercase mb-5">
            O QUE ACONTECE A SEGUIR
          </h2>
          <div className="space-y-5">
            <div className="flex items-start gap-4">
              <span className="text-xl leading-none mt-0.5">1️⃣</span>
              <div>
                <h3 className="font-semibold text-[#1a1a1a] text-sm mb-1">
                  Acesse o painel
                </h3>
                <p className="text-sm text-[#6b7280] leading-relaxed">
                  Seu CRM, Kanban de leads e calendário já estarão prontos.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-xl leading-none mt-0.5">2️⃣</span>
              <div>
                <h3 className="font-semibold text-[#1a1a1a] text-sm mb-1">
                  Conecte seu WhatsApp
                </h3>
                <p className="text-sm text-[#6b7280] leading-relaxed">
                  Escaneie o QR Code e seu número já está ativo em menos de 2
                  min.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-xl leading-none mt-0.5">3️⃣</span>
              <div>
                <h3 className="font-semibold text-[#1a1a1a] text-sm mb-1">
                  Sua IA entra em operação
                </h3>
                <p className="text-sm text-[#6b7280] leading-relaxed">
                  Em até 48h configuramos a IA com seus procedimentos e preços.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 mb-10">
          <div className="bg-[#f9fafb] rounded-2xl p-4 text-center border border-gray-50">
            <div className="text-xl font-black text-[#84CC16] mb-1 tracking-tight">
              &lt;5s
            </div>
            <div className="text-[11px] font-medium text-[#6b7280] leading-tight">
              Resposta ao lead
            </div>
          </div>
          <div className="bg-[#f9fafb] rounded-2xl p-4 text-center border border-gray-50">
            <div className="text-xl font-black text-[#84CC16] mb-1 tracking-tight">
              24/7
            </div>
            <div className="text-[11px] font-medium text-[#6b7280] leading-tight">
              Sempre online
            </div>
          </div>
          <div className="bg-[#f9fafb] rounded-2xl p-4 text-center border border-gray-50">
            <div className="text-xl font-black text-[#84CC16] mb-1 tracking-tight">
              3×
            </div>
            <div className="text-[11px] font-medium text-[#6b7280] leading-tight">
              Mais agendamentos
            </div>
          </div>
        </div>

        {/* Security Footer */}
        <div className="text-center bg-gray-50 rounded-xl p-4 border border-gray-100">
          <p className="text-[11px] text-[#9ca3af] leading-relaxed">
            🔒 Link seguro e único · Expira em 24 horas · Só pode ser usado uma
            vez. Se você não criou uma conta, ignore este e-mail.
          </p>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmail
