import { motion } from 'motion/react'
import { ArrowRight, Sparkles, Clock, CheckCircle2 } from 'lucide-react'
import { MobileFrame } from './MobileFrame'
import { Button } from './ui/button'

export function TrialNotice({
  username,
  onContinue,
}: {
  username?: string
  onContinue: () => void
}) {
  return (
    <MobileFrame>
      <section className="auth-intro">
        <div className="auth-art" aria-hidden="true">
          <div className="auth-orbit" />
          <div className="auth-orbit orbit-two" />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <span key={i} className={'ice-mote mote-' + i} />
          ))}
          <div className="auth-logo-float">
            <img src="/brand-penguin.webp" alt="" width="164" height="164" fetchPriority="high" />
          </div>
          <span className="ice-stamp">
            <Sparkles size={12} /> ACESSO LIBERADO
          </span>
        </div>

        <div className="auth-heading" data-reveal>
          <span className="section-eyebrow">LICENÇA ATIVA</span>
          <h1>
            Seu teste grátis<br />
            <em>está liberado.</em>
          </h1>
          <p>
            {username ? `Bem-vindo, ${username}. ` : ''}
            Você tem <strong className="tabular-nums text-foreground">3 dias</strong> corridos para utilizar o diagnóstico no seu aparelho.
          </p>
        </div>
      </section>

      <div className="auth-glass mobile-form">
        <div className="auth-panel-title">
          <span>STATUS</span>
          <span className="text-emerald-400 flex items-center gap-1.5 font-medium">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Disponível agora
          </span>
        </div>

        <div className="rounded-xl border border-primary/30 bg-primary/10 p-4 text-left shadow-inner">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-accent">
              <Clock size={22} />
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-accent">
                Período de Demonstração
              </span>
              <p className="text-base font-bold tabular-nums text-foreground">
                3 Dias Liberados
              </p>
            </div>
          </div>

          <div className="mt-3.5 space-y-2.5 border-t border-primary/20 pt-3 text-xs text-muted-foreground">
            <div className="flex items-start gap-2 text-foreground/90">
              <CheckCircle2 size={16} className="text-accent shrink-0 mt-0.5" />
              <span>Leitura completa de hardware, tela e conexão em tempo real</span>
            </div>
            <div className="flex items-start gap-2 text-foreground/90">
              <CheckCircle2 size={16} className="text-accent shrink-0 mt-0.5" />
              <span>Sem renovação automática nem cobranças surpresa ao fim do teste</span>
            </div>
          </div>
        </div>

        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <Button onClick={onContinue} className="mobile-primary auth-submit w-full">
            <span>Continuar para a análise</span>
            <span className="cta-arrow">
              <ArrowRight size={20} />
            </span>
          </Button>
        </motion.div>

        <p className="auth-footnote">Toque em Continuar para configurar e iniciar a verificação.</p>
      </div>
    </MobileFrame>
  )
}
