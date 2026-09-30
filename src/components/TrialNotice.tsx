import { motion } from 'motion/react'
import { ArrowRight, CheckCircle2, LockKeyholeOpen, ScanLine, ShieldCheck, Zap } from 'lucide-react'
import { MobileFrame } from './MobileFrame'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Card, CardContent, CardFooter } from './ui/card'
import { Separator } from './ui/separator'

export function TrialNotice({
  username,
  onContinue,
}: {
  username?: string
  onContinue: () => void
}) {
  return (
    <MobileFrame>
      <section className="trial-screen">
        <div className="auth-heading trial-copy" data-reveal>
          <h1>
            <span>Teste liberado.</span>
            <strong>Comece em 1 minuto.</strong>
          </h1>
          <p className="trial-copy-lead">
            {username ? `Bem-vindo, ${username}. ` : ''}
            Use os proximos <mark>3 dias</mark> para descobrir se tela, hardware e conexao estao prontos para rodar sem dor de cabeca.
          </p>
        </div>

        <Card className="trial-pass" data-reveal>
          <CardContent className="trial-pass-content">
            <div className="trial-pass-top">
              <Badge variant="outline" className="trial-live-badge">
                <span aria-hidden="true" />
                teste ativo
              </Badge>
              <span className="trial-pass-mode">
                <ShieldCheck size={14} />
                para sozinho no fim
              </span>
            </div>

            <div className="trial-access-pass" aria-label="Passe de teste gratis ativo por 72 horas">
              <div className="trial-access-rail" aria-hidden="true">
                <span>BUG PINGUIM</span>
              </div>

              <div className="trial-access-main">
                <span className="trial-access-kicker">
                  <LockKeyholeOpen size={15} />
                  acesso liberado
                </span>

                <div className="trial-access-number">
                  <strong className="tabular-nums">72</strong>
                  <span>horas</span>
                </div>

                <p>Rode o diagnostico completo antes de criar sua conta definitiva.</p>
              </div>

              <div className="trial-access-scan" aria-hidden="true">
                <ScanLine size={18} />
              </div>
            </div>

            <div className="trial-action-strip" aria-label="Como usar o teste gratis">
              <div className="is-active">
                <Zap size={14} />
                <span>Agora</span>
                <strong>Inicie</strong>
              </div>
              <div>
                <ScanLine size={14} />
                <span>Depois</span>
                <strong>Compare</strong>
              </div>
            </div>

            <Separator className="trial-separator" />

            <div className="trial-proof-grid">
              <div>
                <CheckCircle2 size={17} />
                <span><strong>Veja o estado real</strong> do aparelho antes de criar a conta.</span>
              </div>
              <div>
                <CheckCircle2 size={17} />
                <span><strong>Sem pegadinha:</strong> acabou o prazo, o teste para sozinho.</span>
              </div>
            </div>
          </CardContent>

          <CardFooter className="trial-pass-footer">
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="w-full"
            >
              <Button onClick={onContinue} className="mobile-primary auth-submit w-full">
                <span>
                  Usar meu teste
                  <small>Rodar diagnostico agora</small>
                </span>
                <span className="cta-arrow">
                  <ArrowRight size={20} />
                </span>
              </Button>
            </motion.div>
          </CardFooter>
        </Card>
      </section>
    </MobileFrame>
  )
}
