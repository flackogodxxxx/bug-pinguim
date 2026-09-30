import { motion } from 'motion/react'
import { ArrowRight, BatteryCharging, Fingerprint, Gauge, ShieldCheck, Smartphone, Wifi } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { MobileFrame } from './MobileFrame'

export function Landing({ onBug }: { onBug: () => void }) {
  return (
    <MobileFrame>
      <section className="landing-screen">
        <div className="landing-status-row" data-reveal>
          <Badge variant="secondary" className="landing-status">
            <ShieldCheck size={14} />
            leitura local
          </Badge>
          <span>Sem aplicativo</span>
        </div>

        <div className="landing-hero" data-reveal>
          <h1>
            Vamos ler seu
            <mark>aparelho.</mark>
          </h1>
          <p>
            Informe o modelo, escolha a conexao e deixe o navegador capturar os sinais disponiveis com seguranca.
          </p>
        </div>

        <Card className="landing-scanner" data-reveal>
          <CardContent className="landing-scanner-content">
            <div className="landing-device-shell" aria-hidden="true">
              <span className="landing-scan-line" />
              <div className="landing-device-glass">
                <Smartphone size={30} />
                <strong>pronto para leitura</strong>
                <span>modelo + rede + tela</span>
              </div>
            </div>

            <div className="landing-signal-grid" aria-label="Dados que serao usados na leitura">
              <div>
                <Fingerprint size={16} />
                <span>aparelho</span>
              </div>
              <div>
                <Wifi size={16} />
                <span>conexao</span>
              </div>
              <div>
                <BatteryCharging size={16} />
                <span>estado</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="landing-proof-list" data-reveal>
          <div>
            <Gauge size={17} />
            <span>Voce informa o que o navegador nao consegue adivinhar.</span>
          </div>
          <div>
            <ShieldCheck size={17} />
            <span>A leitura acontece no navegador, sem instalar nada.</span>
          </div>
        </div>

        <div className="landing-action" data-reveal>
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 420, damping: 28 }}
          >
            <Button className="mobile-primary landing-cta w-full" onClick={onBug}>
              <span>
                Comecar leitura
                <small>Informar aparelho e conexao</small>
              </span>
              <span className="cta-arrow">
                <ArrowRight size={21} />
              </span>
            </Button>
          </motion.div>
          <p className="button-note landing-note">
            <ShieldCheck size={14} /> Nada sera alterado no celular.
          </p>
        </div>
      </section>
    </MobileFrame>
  )
}
