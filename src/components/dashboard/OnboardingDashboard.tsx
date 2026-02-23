import { Link } from 'react-router-dom'
import { BookOpen, QrCode, Rocket, Send, Mail } from 'lucide-react'

export function OnboardingDashboard() {
  return (
    <div className="max-w-5xl mx-auto py-4 px-2 md:py-8 md:px-4 animate-fade-in">
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-sm font-medium mb-6 border border-emerald-100">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          Conta ativada com sucesso
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-5 flex items-center gap-3 tracking-tight">
          Bem-vindo ao ClinicAI!{' '}
          <span className="text-4xl md:text-5xl">👋</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl leading-relaxed">
          Vamos configurar sua conta e preparar sua IA para atender seus
          clientes. Siga os passos simples abaixo para começar ainda hoje.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {/* Step 1 */}
        <Link to="/base-conhecimento" className="group block">
          <div className="relative mb-6 w-fit">
            <div className="w-[68px] h-[68px] rounded-2xl bg-white border-2 border-[#6de373] flex items-center justify-center text-[#6de373] group-hover:scale-105 transition-transform shadow-sm">
              <BookOpen className="w-8 h-8" />
            </div>
            <div className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-[#6de373] text-gray-900 flex items-center justify-center text-xs font-bold border-2 border-white">
              1
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2.5">
            Treinar a IA
          </h3>
          <p className="text-[15px] text-gray-500 leading-relaxed">
            Alimente a 'Base de Conhecimento' com informações do seu negócio
            para que a IA aprenda como responder seus clientes.
          </p>
        </Link>

        {/* Step 2 */}
        <Link to="/configuracoes" className="group block">
          <div className="relative mb-6 w-fit">
            <div className="w-[68px] h-[68px] rounded-2xl bg-white border-2 border-gray-200 flex items-center justify-center text-gray-400 group-hover:border-gray-300 group-hover:text-gray-600 transition-colors group-hover:scale-105 shadow-sm">
              <QrCode className="w-8 h-8" />
            </div>
            <div className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs font-bold border-2 border-white">
              2
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2.5">
            Conectar WhatsApp
          </h3>
          <p className="text-[15px] text-gray-500 leading-relaxed">
            Escaneie o QR Code para vincular seu número com segurança e
            autorizar o atendimento automatizado.
          </p>
        </Link>

        {/* Step 3 */}
        <Link to="/crm" className="group block">
          <div className="relative mb-6 w-fit">
            <div className="w-[68px] h-[68px] rounded-2xl bg-white border-2 border-gray-200 flex items-center justify-center text-gray-400 group-hover:border-gray-300 group-hover:text-gray-600 transition-colors group-hover:scale-105 shadow-sm">
              <Send className="w-8 h-8" />
            </div>
            <div className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs font-bold border-2 border-white">
              3
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2.5">
            Captar Leads
          </h3>
          <p className="text-[15px] text-gray-500 leading-relaxed">
            Com tudo pronto, comece a atrair interessados e veja a IA
            transformando conversas em agendamentos.
          </p>
        </Link>
      </div>

      <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-[0_4px_40px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden relative">
        <div className="max-w-md relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 tracking-tight">
            Pronto para começar?
          </h2>
          <p className="text-gray-500 mb-8 leading-relaxed text-[15px]">
            Ainda não há atividades registradas. Configure sua base de
            conhecimento agora para ativar seu agente.
          </p>
          <Link
            to="/base-conhecimento"
            className="inline-flex items-center justify-center gap-2 bg-[#6de373] hover:bg-[#5cd462] text-gray-900 font-bold px-8 py-4 rounded-xl transition-all shadow-[0_4px_20px_rgba(109,227,115,0.4)] hover:-translate-y-0.5"
          >
            <Rocket className="w-5 h-5" />
            Iniciar Configuração
          </Link>
        </div>

        <div className="relative w-64 h-64 flex items-center justify-center shrink-0 hidden md:flex">
          <div className="absolute inset-0 rounded-full border border-gray-100 bg-gray-50/30"></div>
          <div className="absolute inset-8 rounded-full border border-gray-100 bg-gray-50/60"></div>
          <div className="absolute inset-16 rounded-full bg-gray-100/50 flex items-center justify-center">
            <Mail className="w-12 h-12 text-gray-300" />
          </div>
          <div className="absolute top-10 right-[-20px] bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-100 flex items-center gap-2 text-xs font-semibold text-gray-600">
            <span className="w-2 h-2 rounded-full bg-[#6de373]"></span>
            WhatsApp Conectado
          </div>
        </div>
      </div>
    </div>
  )
}
