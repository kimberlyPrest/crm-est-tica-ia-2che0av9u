import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Menu, X, Star, ArrowRight, Plus } from 'lucide-react';

// --- Components ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#eef0ee]/85 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-[1100px] mx-auto px-6 h-[68px] flex items-center justify-between">
        <a href="#" className="flex items-center gap-2.5 no-underline">
          <div className="w-[38px] h-[38px] bg-[#d9f0b0] rounded-xl flex items-center justify-center text-xl">
            🩺
          </div>
          <span className="font-display font-extrabold text-xl text-[#1a1a1a] tracking-tight">
            Clinic<span className="text-[#84CC16]">AI</span>
          </span>
        </a>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-9 list-none">
          {['Problema', 'Solução', 'Como funciona', 'FAQ'].map((item) => (
            <li key={item}>
              <a
                href={`#${item.toLowerCase().replace(' ', '-')}`}
                className="text-sm font-medium text-[#4b5563] hover:text-[#1a1a1a] transition-colors"
              >
                {item}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex">
          <a
            href="#cta"
            className="inline-flex items-center gap-2 bg-[#84CC16] text-white font-display font-bold text-[13px] px-6 py-2.5 rounded-full shadow-[0_4px_20px_rgba(132,204,22,0.4)] hover:bg-[#76b814] hover:-translate-y-0.5 transition-all duration-200"
          >
            Começar Agora
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-[#1a1a1a]"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#eef0ee] border-b border-gray-200 overflow-hidden"
          >
            <ul className="flex flex-col p-6 gap-4">
              {['Problema', 'Solução', 'Como funciona', 'FAQ'].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase().replace(' ', '-')}`}
                    className="block text-base font-medium text-[#4b5563]"
                    onClick={() => setIsOpen(false)}
                  >
                    {item}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#cta"
                  className="block text-center bg-[#84CC16] text-white font-display font-bold text-sm px-6 py-3 rounded-full"
                  onClick={() => setIsOpen(false)}
                >
                  Começar Agora
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  return (
    <section id="hero" className="pt-[120px] pb-20 min-h-screen flex items-center">
      <div className="max-w-[1100px] mx-auto px-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 bg-[#d9f0b0] text-[#3a6b00] font-display text-[11px] font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-7">
              <span className="w-1.5 h-1.5 bg-[#84CC16] rounded-full"></span>
              Para clínicas que investem em tráfego pago
            </span>
            <h1 className="font-display font-extrabold text-[clamp(36px,5vw,62px)] leading-[1.15] text-[#1a1a1a] tracking-tight mb-5">
              O lead chegou.
              <br />
              Sua clínica
              <br />
              <span className="text-[#84CC16]">já respondeu.</span>
            </h1>
            <p className="text-[17px] text-[#4b5563] leading-[1.7] mb-9 max-w-[440px]">
              Enquanto sua concorrente ainda está digitando{' '}
              <em className="not-italic text-[#1a1a1a] font-medium">"Olá, tudo bem?"</em>, o
              ClinicAI já qualificou, educou e agendou o mesmo cliente — em menos de 5 segundos, com
              a voz da sua marca.
            </p>
            <div className="flex flex-wrap gap-3 mb-10">
              <a
                href="#cta"
                className="inline-flex items-center gap-2.5 bg-[#84CC16] text-white font-display font-bold text-[15px] px-8 py-4 rounded-full shadow-[0_4px_20px_rgba(132,204,22,0.4)] hover:bg-[#76b814] hover:-translate-y-0.5 transition-all duration-200"
              >
                Começar Agora
                <ArrowRight size={16} strokeWidth={2.5} />
              </a>
              <a
                href="#como-funciona"
                className="inline-flex items-center gap-2 bg-white text-[#4b5563] font-display font-semibold text-[15px] px-7 py-4 rounded-full border-[1.5px] border-[#e5e7eb] hover:border-[#84CC16] hover:text-[#84CC16] transition-all duration-200"
              >
                Como funciona na prática
              </a>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex">
                {['DS', 'AM', 'SC'].map((initials, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full border-2 border-[#eef0ee] bg-[#d9f0b0] flex items-center justify-center font-display text-[11px] font-bold text-[#3a6b00] ${
                      i > 0 ? '-ml-2' : ''
                    }`}
                  >
                    {initials}
                  </div>
                ))}
                <div className="w-8 h-8 rounded-full border-2 border-[#eef0ee] bg-[#e0f2fe] flex items-center justify-center font-display text-[11px] font-bold text-[#0369a1] -ml-2">
                  +
                </div>
              </div>
              <p className="text-[13px] text-[#9ca3af]">+200 clínicas já convertendo mais com ClinicAI</p>
            </div>
          </motion.div>

          {/* Chat Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="bg-white rounded-[28px] shadow-[0_4px_40px_rgba(0,0,0,0.07)] overflow-hidden max-w-[360px] mx-auto">
              <div className="bg-[#075E54] px-[18px] py-3.5 flex items-center gap-3 text-white">
                <div className="w-[38px] h-[38px] rounded-full bg-[#d9f0b0] flex items-center justify-center text-lg">
                  🤖
                </div>
                <div>
                  <p className="font-display font-bold text-sm">Lara · ClinicAI</p>
                  <p className="text-[11px] opacity-70 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#84CC16] rounded-full"></span> Online agora
                  </p>
                </div>
              </div>
              <motion.div 
                className="bg-[#f0f2f0] p-4 flex flex-col gap-2.5 min-h-[300px]"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 1 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 1.5,
                      delayChildren: 0.8
                    }
                  }
                }}
              >
                <motion.div className="flex justify-end" variants={{ hidden: { opacity: 0, y: 10, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1 } }}>
                  <div>
                    <div className="bg-[#005c4b] text-white rounded-[18px_18px_4px_18px] px-3.5 py-2.5 text-[13.5px] leading-relaxed font-medium max-w-[82%] ml-auto">
                      Quanto custa o botox?
                    </div>
                    <p className="text-[10px] text-[#9ca3af] mt-1 text-right">10:42 ✓✓</p>
                  </div>
                </motion.div>
                <motion.div className="flex justify-start" variants={{ hidden: { opacity: 0, y: 10, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1 } }}>
                  <div>
                    <div className="bg-white text-[#1a1a1a] rounded-[18px_18px_18px_4px] px-3.5 py-2.5 text-[13.5px] leading-relaxed shadow-[0_1px_4px_rgba(0,0,0,0.06)] max-w-[82%]">
                      Oi! 🌿 A partir de R$890. A Dra. Ana gravou um áudio explicando como funciona
                      aqui — quer ouvir antes de decidir?
                    </div>
                    <p className="text-[10px] text-[#9ca3af] mt-1">10:42</p>
                  </div>
                </motion.div>
                <motion.div className="flex justify-end" variants={{ hidden: { opacity: 0, y: 10, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1 } }}>
                  <div>
                    <div className="bg-[#005c4b] text-white rounded-[18px_18px_4px_18px] px-3.5 py-2.5 text-[13.5px] leading-relaxed font-medium max-w-[82%] ml-auto">
                      Sim! Tem horário amanhã à tarde?
                    </div>
                    <p className="text-[10px] text-[#9ca3af] mt-1 text-right">10:43 ✓✓</p>
                  </div>
                </motion.div>
                <motion.div className="flex justify-start" variants={{ hidden: { opacity: 0, y: 10, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1 } }}>
                  <div>
                    <div className="bg-white text-[#1a1a1a] rounded-[18px_18px_18px_4px] px-3.5 py-2.5 text-[13.5px] leading-relaxed shadow-[0_1px_4px_rgba(0,0,0,0.06)] max-w-[82%]">
                      Temos às 14h e 16h30 🗓️ Qual prefere? Já bloqueio na agenda!
                    </div>
                    <p className="text-[10px] text-[#9ca3af] mt-1">10:43</p>
                  </div>
                </motion.div>
              </motion.div>
              <div className="bg-white px-4 py-3 flex items-center gap-2.5 border-t border-[#e5e7eb]">
                <Plus size={20} className="text-[#9ca3af]" />
                <div className="flex-1 h-9 bg-[#dde8f0] rounded-full"></div>
                <span className="text-xl grayscale opacity-50">🎤</span>
              </div>
            </div>
            <motion.div 
              className="flex items-center gap-2 bg-white rounded-2xl px-4 py-2.5 shadow-[0_4px_40px_rgba(0,0,0,0.07)] mt-3 max-w-[220px] mx-auto"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 4.5, duration: 0.5 }}
            >
              <div className="w-2 h-2 bg-[#84CC16] rounded-full shrink-0"></div>
              <p className="font-display text-xs font-bold text-[#1a1a1a]">
                Resposta em <span className="text-[#84CC16]">4 segundos</span>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Ticker = () => {
  return (
    <div className="bg-white border-y border-[#e5e7eb] py-3.5 overflow-hidden">
      <div className="flex gap-0 w-max animate-ticker">
        {Array(14)
          .fill([
            '+200 clínicas ativas',
            'Resposta <5 segundos',
            'Atendimento 24h / 7 dias',
            'Taxa de conversão 3× maior',
            'Setup em 48h',
            'Sem contrato de fidelidade',
            'Dados 100% seguros',
          ])
          .flat()
          .map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-8 font-display text-xs font-bold text-[#9ca3af] whitespace-nowrap uppercase tracking-widest border-r border-[#e5e7eb]"
            >
              <span className="w-1.5 h-1.5 bg-[#84CC16] rounded-full shrink-0"></span>
              {item}
            </div>
          ))}
      </div>
      <style>{`
        @keyframes ticker {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-ticker {
          animation: ticker 90s linear infinite;
        }
      `}</style>
    </div>
  );
};

const ProblemSection = () => {
  return (
    <section id="problema" className="py-20">
      <div className="max-w-[1100px] mx-auto px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Left Column: Text */}
          <div>
            <span className="inline-flex items-center gap-2 bg-[#fee2e2] text-[#991b1b] font-display text-[11px] font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-6">
              O Problema
            </span>
            <h2 className="font-display font-extrabold text-[clamp(28px,4vw,48px)] leading-[1.15] text-[#1a1a1a] tracking-tight mb-6">
              Você investe R$3.000
              <br />
              em anúncio.
              <br />
              O lead chega. <span className="text-[#ef4444]">E some.</span>
            </h2>
            <p className="text-lg text-[#4b5563] leading-[1.7]">
              Não é falta de interesse do cliente. É falta de velocidade da sua operação. Cada minuto
              de silêncio no WhatsApp vale dinheiro — e você está pagando esse preço.
            </p>
          </div>

          {/* Right Column: Quote Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-[28px] p-10 shadow-[0_4px_40px_rgba(0,0,0,0.07)] relative flex items-center"
          >
            {/* Green accent bar */}
            <div className="absolute left-0 top-12 bottom-12 w-1.5 bg-[#84CC16] rounded-r-full"></div>
            
            <div className="pl-8">
              <p className="font-display text-[22px] md:text-2xl font-medium italic text-[#1a1a1a] leading-relaxed mb-6">
                "A demora em responder leads custa até{' '}
                <span className="text-[#84CC16] font-bold not-italic">70% das oportunidades</span> de venda em clínicas de
                estética."
              </p>
              <p className="text-xs text-[#9ca3af] font-bold uppercase tracking-widest flex items-center gap-2">
                — Harvard Business Review
              </p>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: '⏳',
              title: '"Vou te responder em instantes" — 4h depois',
              desc: 'Sua atendente está no meio de 12 conversas. O lead que perguntou sobre botox às 14h já marcou na clínica vizinha às 14h08. Você nem soube.',
            },
            {
              icon: '🤖',
              title: 'O chatbot que espanta mais do que converte',
              desc: '"Digite 1 para preços, 2 para procedimentos…" O cliente que veio pelo seu anúncio de R$80 abandona na segunda mensagem. Frustrante para ele, caro para você.',
            },
            {
              icon: '📅',
              title: 'Quinta-feira com 6 horários vazios na agenda',
              desc: 'Não é que não tem demanda. É que a demanda não virou agendamento. Cada horário ocioso é margem de lucro que evaporou sem chance de reaver.',
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white rounded-[28px] p-8 shadow-[0_4px_40px_rgba(0,0,0,0.07)] hover:-translate-y-1 hover:shadow-[0_8px_40px_rgba(0,0,0,0.1)] transition-all duration-200"
            >
              <div className="w-11 h-11 bg-[#d9f0b0] rounded-full flex items-center justify-center text-xl shrink-0 mb-4">
                {item.icon}
              </div>
              <h3 className="font-display font-extrabold text-[17px] text-[#1a1a1a] mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-[#4b5563] leading-[1.65]">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const SolutionSection = () => {
  return (
    <section id="solucao" className="py-20 bg-white">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 bg-[#d9f0b0] text-[#3a6b00] font-display text-[11px] font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-4">
            <span className="w-1.5 h-1.5 bg-[#84CC16] rounded-full"></span>
            Solução
          </span>
          <h2 className="font-display font-extrabold text-[clamp(28px,4vw,48px)] leading-[1.15] text-[#1a1a1a] tracking-tight my-3.5">
            Não é automação.
            <br />
            É uma recepcionista <span className="text-[#84CC16]">que pensa.</span>
          </h2>
          <p className="text-base text-[#4b5563] max-w-[520px] mx-auto leading-[1.7]">
            Qualquer ferramenta envia mensagem automática. O ClinicAI entende o contexto, raciocina
            e toma a ação certa — como uma profissional treinada faria.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-[#d9f0b0] rounded-[28px] p-9 relative overflow-hidden hover:-translate-y-1 transition-transform duration-200"
          >
            <div className="absolute top-5 right-6 font-display text-[64px] font-black text-black/5 leading-none pointer-events-none">
              01
            </div>
            <div className="w-11 h-11 bg-[#d9f0b0] rounded-full flex items-center justify-center text-xl shrink-0 mb-4 border border-black/5">
              🧠
            </div>
            <h3 className="font-display font-extrabold text-xl text-[#1a1a1a] mb-2.5">
              IA que interpreta, não só responde
            </h3>
            <p className="text-sm text-[#4b5563] leading-[1.7]">
              Quando a paciente diz{' '}
              <em className="not-italic font-semibold">
                "tenho medo de agulha mas quero resultado"
              </em>
              , a IA não joga um menu. Ela acolhe, envia o áudio certo da Dra. e guia até o
              agendamento — com naturalidade real.
            </p>
            <p className="mt-3.5 text-xs font-bold text-[#3a6b00]">
              ⚡ Powered by Google Gemini Flash
            </p>
          </motion.div>

          {[
            {
              num: '02',
              icon: '🗂️',
              title: 'CRM que trabalha enquanto você dorme',
              desc: 'Cada resposta move o lead no Kanban — de "Curioso" para "Quente" para "Agendado" — automaticamente. Quando sua equipe chega de manhã, os leads já estão triados e organizados.',
            },
            {
              num: '03',
              icon: '📊',
              title: 'Visão completa da sua máquina de vendas',
              desc: 'Qual campanha gerou mais consultas hoje? Qual horário tem mais no-show? Tudo em um painel — sem precisar abrir 4 ferramentas differentes.',
            },
            {
              num: '04',
              icon: '🔗',
              title: 'Escale campanhas sem escalar equipe',
              desc: 'Um número de WhatsApp? Dez? A mesma IA atende todos em paralelo com o mesmo padrão de qualidade — sem contratar, treinar ou gerenciar mais secretárias.',
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i + 1) * 0.1 }}
              className="bg-[#eef0ee] rounded-[28px] p-9 relative overflow-hidden hover:-translate-y-1 transition-transform duration-200"
            >
              <div className="absolute top-5 right-6 font-display text-[64px] font-black text-black/5 leading-none pointer-events-none">
                {item.num}
              </div>
              <div className="w-11 h-11 bg-[#d9f0b0] rounded-full flex items-center justify-center text-xl shrink-0 mb-4">
                {item.icon}
              </div>
              <h3 className="font-display font-extrabold text-xl text-[#1a1a1a] mb-2.5">
                {item.title}
              </h3>
              <p className="text-sm text-[#4b5563] leading-[1.7]">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const MetricsSection = () => {
  return (
    <section id="metricas" className="py-20">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-14">
          {[
            { num: '<5s', label: 'Para o lead receber\na primeira resposta' },
            { num: '24/7', label: 'Atendendo — inclusive\ndomingo às 23h' },
            { num: '3×', label: 'Mais volume sem\ncontratar ninguém' },
            { num: '↓', label: 'No-show com lembretes\nautomáticos' },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white rounded-[28px] p-7 text-center shadow-[0_4px_40px_rgba(0,0,0,0.07)]"
            >
              <div className="font-display text-[44px] font-black text-[#84CC16] leading-none tracking-tight mb-2">
                {stat.num}
              </div>
              <div className="text-[13px] text-[#9ca3af] leading-relaxed whitespace-pre-line">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-[28px] shadow-[0_4px_40px_rgba(0,0,0,0.07)] overflow-hidden max-w-[760px] mx-auto overflow-x-auto">
          <div className="grid grid-cols-3 border-b border-[#e5e7eb] min-w-[600px]">
            <div className="p-4"></div>
            <div className="p-4 text-center">
              <p className="font-display text-xs font-bold uppercase tracking-widest text-[#9ca3af] mb-1.5">
                Recepção Tradicional
              </p>
              <span className="text-[22px]">👤</span>
            </div>
            <div className="p-4 text-center bg-[#d9f0b0]">
              <p className="font-display text-xs font-bold uppercase tracking-widest text-[#3a6b00] mb-1.5">
                ClinicAI
              </p>
              <span className="text-[22px]">🤖</span>
            </div>
          </div>
          {[
            {
              name: 'Horário de atendimento',
              old: '8h–18h (dias úteis)',
              ai: '24h / 7 dias',
            },
            {
              name: 'Tempo de resposta',
              old: '30 min – 2h',
              ai: '< 5 segundos',
            },
            {
              name: 'Follow-up automático',
              old: <X className="text-red-500 mx-auto" size={18} />,
              ai: <Check className="text-[#84CC16] mx-auto" size={18} />,
            },
            {
              name: 'Qualificação de leads',
              old: 'Depende da equipe',
              ai: 'Automática e instantânea',
            },
            {
              name: 'Escala com campanhas',
              old: <X className="text-red-500 mx-auto" size={18} />,
              ai: <Check className="text-[#84CC16] mx-auto" size={18} />,
            },
            {
              name: 'Custo mensal',
              old: 'R$3.000–5.000 + encargos',
              ai: 'Fixo e previsível',
            },
          ].map((row, i) => (
            <div
              key={i}
              className={`grid grid-cols-3 border-b border-[#e5e7eb] min-w-[600px] ${
                i === 5 ? 'border-b-0' : ''
              }`}
            >
              <div className="p-3.5 px-4 text-sm font-medium text-[#1a1a1a] flex items-center">
                {row.name}
              </div>
              <div className="p-3.5 px-4 text-sm text-[#9ca3af] text-center flex items-center justify-center">
                {row.old}
              </div>
              <div className="p-3.5 px-4 text-sm text-[#3a6b00] font-semibold text-center bg-[#84CC16]/5 flex items-center justify-center">
                {row.ai}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  return (
    <section id="como-funciona" className="py-20 bg-white">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 bg-[#d9f0b0] text-[#3a6b00] font-display text-[11px] font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-4">
            <span className="w-1.5 h-1.5 bg-[#84CC16] rounded-full"></span>
            Como Funciona
          </span>
          <h2 className="font-display font-extrabold text-[clamp(28px,4vw,48px)] leading-[1.15] text-[#1a1a1a] tracking-tight my-3.5">
            Da campanha ao agendamento —
            <br />
            <span className="text-[#84CC16]">sem intervenção humana</span>
          </h2>
          <p className="text-base text-[#4b5563] max-w-[520px] mx-auto leading-[1.7]">
            Do primeiro "oi" ao horário bloqueado na grade — automático, humanizado e com o tom da
            sua clínica.
          </p>
        </div>

        <div className="max-w-[640px] mx-auto">
          {[
            {
              title: 'O anúncio converte. A IA atende na hora.',
              desc: 'A pessoa clica no seu anúncio às 23h17. Em menos de 5 segundos recebe uma resposta personalizada — com o nome da sua clínica, no tom da sua marca. Não um "nosso horário é 8h–18h".',
            },
            {
              title: 'A IA educa, aquece e vende — sem script fixo',
              desc: 'Ela entende o que a pessoa quer, envia a tabela de preços, dispara o áudio real da Dra. e responde objeções com naturalidade. Cada conversa é única.',
            },
            {
              title: 'Horário bloqueado. Agenda preenchida.',
              desc: 'A IA consulta a grade em tempo real, oferece horários e bloqueia o slot — sem "vou verificar e te aviso". O lead agendado recebe confirmação e lembrete automático.',
            },
            {
              title: 'Sua equipe só entra quando faz sentido',
              desc: 'Caso clínico complexo ou lead VIP? A IA passa o bastão com todo o histórico já visível no painel. Zero redigitação. Zero contexto perdido.',
            },
          ].map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="grid grid-cols-[56px_1fr] gap-5 pb-8 relative group"
            >
              {i !== 3 && (
                <div className="absolute left-[27px] top-16 bottom-0 w-0.5 bg-gradient-to-b from-[#b8e068] to-transparent"></div>
              )}
              <div className="w-[54px] h-[54px] rounded-full bg-[#d9f0b0] flex items-center justify-center font-display font-black text-xl text-[#3a6b00] shrink-0 relative z-10">
                {i + 1}
              </div>
              <div>
                <h3 className="font-display font-bold text-[19px] text-[#1a1a1a] mb-2 pt-3">
                  {step.title}
                </h3>
                <p className="text-sm text-[#4b5563] leading-[1.7]">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Ana Costa',
      role: 'Gestora de Clínica',
      text: 'Reduzimos nosso custo com recepção em 40% e aumentamos a conversão em 25% no primeiro mês.',
      img: 'https://picsum.photos/seed/ana/200/200'
    },
    {
      name: 'Dr. Pedro Santos',
      role: 'Cirurgião Plástico',
      text: 'A integração com o CRM Kanban facilitou muito a vida da minha equipe de vendas. Tudo automático.',
      img: 'https://picsum.photos/seed/pedro/200/200'
    },
    {
      name: 'Dra. Sarah Miller',
      role: 'Harmonização Facial',
      text: 'Antes eu perdia leads de fim de semana. Agora chego na segunda-feira com 5 consultas já pagas na agenda.',
      img: 'https://picsum.photos/seed/sarah/200/200'
    },
    {
      name: 'Dr. Marcos Silva',
      role: 'Dermatologista',
      text: 'A IA é impressionante. Ela entende o que o paciente quer saber preço e conduz para a avaliação de forma sutil.',
      img: 'https://picsum.photos/seed/marcos/200/200'
    },
  ];

  const scrollList = [...testimonials, ...testimonials, ...testimonials];

  return (
    <section id="depoimentos" className="py-20 overflow-hidden">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 bg-[#d9f0b0] text-[#3a6b00] font-display text-[11px] font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-4">
            <span className="w-1.5 h-1.5 bg-[#84CC16] rounded-full"></span>
            Resultados Reais
          </span>
          <h2 className="font-display font-extrabold text-[clamp(28px,4vw,48px)] leading-[1.15] text-[#1a1a1a] tracking-tight my-3.5">
            Clínicas que pararam de <span className="text-[#84CC16]">perder lead</span>
          </h2>
        </div>
      </div>

      <div className="flex w-max animate-scroll hover:pause">
        {scrollList.map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-[28px] p-8 shadow-[0_4px_40px_rgba(0,0,0,0.07)] w-[400px] mx-4 flex flex-col shrink-0"
          >
            <div className="flex items-center gap-4 mb-6">
              <img 
                src={item.img} 
                alt={item.name}
                className="w-14 h-14 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div>
                <h3 className="font-display font-bold text-lg text-[#1a1a1a]">{item.name}</h3>
                <p className="text-sm text-[#84CC16] font-medium">{item.role}</p>
              </div>
            </div>
            <p className="text-[#4b5563] italic leading-relaxed mb-8 flex-grow">"{item.text}"</p>
            <div className="flex gap-1">
              {[...Array(5)].map((_, j) => (
                <Star key={j} size={18} className="fill-[#fbbf24] text-[#fbbf24]" />
              ))}
            </div>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 120s linear infinite;
        }
        .hover\\:pause:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

const WhoIsItFor = () => {
  return (
    <section id="para-quem" className="py-20 bg-white">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 bg-[#d9f0b0] text-[#3a6b00] font-display text-[11px] font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-4">
            <span className="w-1.5 h-1.5 bg-[#84CC16] rounded-full"></span>
            Para quem é
          </span>
          <h2 className="font-display font-extrabold text-[clamp(28px,4vw,48px)] leading-[1.15] text-[#1a1a1a] tracking-tight my-3.5">
            Feito para quem paga para trazer cliente
            <br />e quer ver isso <span className="text-[#84CC16]">virar lucro</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[860px] mx-auto">
          {[
            {
              icon: '👔',
              role: 'Gestor / Dono',
              title: 'Você investe em tráfego. O retorno some no WhatsApp.',
              desc: 'Quer uma operação que converta leads em macas preenchidas, sem depender de quem está online no plantão.',
              checks: [
                'Veja em tempo real quantos leads estão quentes agora',
                'Saiba qual campanha gerou mais consultas, não só cliques',
                'Triplique o atendimento sem nova contratação',
                'Durma sabendo que nenhum lead foi ignorado',
              ],
            },
            {
              icon: '💼',
              role: 'Recepção / Closers',
              title: 'Sua equipe fecha. A IA faz o trabalho repetitivo.',
              desc: 'Sua atendente não deveria gastar 80% do tempo respondendo "qual o valor do botox?" pela décima vez.',
              checks: [
                'Receba leads já aquecidos e com contexto completo',
                'Assuma qualquer conversa com um único clique',
                'Gerencie a agenda sem planilha, post-it ou grupo de WA',
                'Notificação imediata dos leads prontos para fechar',
              ],
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-[#eef0ee] rounded-[28px] p-9"
            >
              <div className="w-11 h-11 bg-[#d9f0b0] rounded-full flex items-center justify-center text-xl shrink-0 mb-3.5">
                {item.icon}
              </div>
              <span className="inline-flex items-center gap-2 bg-[#d9f0b0] text-[#3a6b00] font-display text-[11px] font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-3.5">
                <span className="w-1.5 h-1.5 bg-[#84CC16] rounded-full"></span>
                {item.role}
              </span>
              <h3 className="font-display font-extrabold text-xl text-[#1a1a1a] mb-2.5">
                {item.title}
              </h3>
              <p className="text-sm text-[#4b5563] leading-[1.7] mb-6">{item.desc}</p>
              <ul className="flex flex-col gap-2.5">
                {item.checks.map((check, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-sm text-[#4b5563]">
                    <span className="text-[#84CC16] font-extrabold text-sm mt-px">✓</span>
                    {check}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FAQ = () => {
  return (
    <section id="faq" className="py-20">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 bg-[#d9f0b0] text-[#3a6b00] font-display text-[11px] font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-4">
            <span className="w-1.5 h-1.5 bg-[#84CC16] rounded-full"></span>
            FAQ
          </span>
          <h2 className="font-display font-extrabold text-[clamp(28px,4vw,48px)] leading-[1.15] text-[#1a1a1a] tracking-tight my-3.5">
            Perguntas frequentes
          </h2>
        </div>

        <div className="max-w-[680px] mx-auto flex flex-col gap-2.5">
          {[
            {
              q: 'A IA soa robótica para os pacientes?',
              a: 'Não. O ClinicAI é treinado com o vocabulário, o estilo e o tom da sua clínica. Muitos pacientes só descobrem que falaram com uma IA quando perguntam diretamente.',
            },
            {
              q: 'A IA consegue entender áudios no WhatsApp?',
              a: 'Sim. Utilizamos modelos avançados de transcrição para entender áudios com precisão humana e responder em texto ou áudio conforme sua configuração.',
            },
            {
              q: 'E se o paciente pedir para falar com um humano?',
              a: 'O sistema detecta a intenção e notifica sua equipe instantaneamente. Um humano assume a conversa com um clique.',
            },
            {
              q: 'Quanto tempo leva para implementar?',
              a: 'Em até 48 horas sua clínica já está rodando com a IA treinada com seus preços, procedimentos e o tom de voz da sua marca.',
            },
            {
              q: 'Preciso trocar meu sistema de agenda atual?',
              a: 'Não necessariamente. O ClinicAI possui seu próprio calendário integrado, mas também pode se conectar a sistemas externos.',
            },
          ].map((item, i) => (
            <details
              key={i}
              className="bg-white rounded-[18px] shadow-[0_4px_40px_rgba(0,0,0,0.07)] overflow-hidden group"
            >
              <summary className="list-none flex items-center justify-between p-5 px-6 cursor-pointer font-display text-[15px] font-semibold text-[#1a1a1a] gap-4">
                {item.q}
                <div className="w-7 h-7 bg-[#d9f0b0] rounded-full flex items-center justify-center text-base shrink-0 transition-transform duration-200 group-open:rotate-45">
                  +
                </div>
              </summary>
              <div className="px-6 pb-5 text-sm text-[#4b5563] leading-[1.7] border-t border-[#e5e7eb] pt-4">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTA = () => {
  return (
    <section id="cta" className="pb-[100px]">
      <div className="max-w-[1100px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-[#d9f0b0] rounded-[36px] px-6 py-[72px] text-center relative overflow-hidden"
        >
          <div className="absolute -top-20 -right-20 w-[300px] h-[300px] bg-[#84CC16]/25 rounded-full pointer-events-none"></div>
          <div className="absolute -bottom-[60px] -left-[60px] w-[240px] h-[240px] bg-[#84CC16]/15 rounded-full pointer-events-none"></div>

          <div className="w-[72px] h-[72px] bg-[#d9f0b0] rounded-full flex items-center justify-center text-[34px] mx-auto mb-7 relative z-10">
            🚀
          </div>
          <h2 className="font-display font-extrabold text-[clamp(28px,4.5vw,52px)] leading-[1.15] text-[#1a1a1a] tracking-tight mb-4 relative z-10">
            Quantos leads sua clínica
            <br />
            vai perder essa semana?
          </h2>
          <p className="text-[17px] text-[#3a4a20] max-w-[500px] mx-auto leading-[1.7] mb-9 relative z-10">
            Cada dia sem o ClinicAI é mais um lead respondido 4 horas depois, mais uma quinta-feira
            com horário vazio, mais uma campanha que não converteu o que devia.
          </p>
          <div className="flex flex-wrap justify-center gap-3 relative z-10">
            <a
              href="/login"
              className="inline-flex items-center gap-2.5 bg-[#1a1a1a] text-white font-display font-bold text-[15px] px-8 py-4 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.25)] hover:bg-[#333] hover:-translate-y-0.5 transition-all duration-200"
            >
              Começar Agora
              <ArrowRight size={16} strokeWidth={2.5} />
            </a>
          </div>
          <p className="text-[13px] text-[#5a7030] mt-5 relative z-10">
            Demo gratuita · Setup em até 48h · Garantia de 7 dias · Sem contrato de fidelidade
          </p>
        </motion.div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-[#1a1a1a] py-12 text-[#6b7280]">
      <div className="max-w-[1100px] mx-auto px-6 flex flex-col items-center gap-6">
        <a href="#" className="flex items-center gap-2.5 no-underline">
          <div className="w-9 h-9 bg-[#d9f0b0] rounded-[10px] flex items-center justify-center text-lg">
            🩺
          </div>
          <span className="font-display font-extrabold text-lg text-white tracking-tight">
            Clinic<span className="text-[#84CC16]">AI</span>
          </span>
        </a>
        <ul className="flex gap-8 list-none">
          {['Termos de Uso', 'Privacidade', 'Suporte'].map((item, i) => (
            <li key={i}>
              <a
                href="#"
                className={`text-[13px] transition-colors hover:text-white ${
                  item === 'Suporte' ? 'text-[#84CC16]' : 'text-[#6b7280]'
                }`}
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
        <p className="text-xs text-[#374151] text-center">
          © {new Date().getFullYear()} ClinicAI Tecnologia LTDA · Todos os direitos reservados
        </p>
      </div>
    </footer>
  );
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#eef0ee] font-sans text-[#1a1a1a] overflow-x-hidden">
      <Navbar />
      <Hero />
      <Ticker />
      <ProblemSection />
      <SolutionSection />
      <MetricsSection />
      <HowItWorks />
      <Testimonials />
      <WhoIsItFor />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}
