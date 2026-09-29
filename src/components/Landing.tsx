import { motion } from 'motion/react'
import { ArrowRight, Fingerprint, Wifi, ShieldCheck, Smartphone, ScanLine, ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MobileFrame } from './MobileFrame'

export function Landing({ onBug }: { onBug: () => void }) {
  return (
    <MobileFrame>
      <section className="mobile-hero">
        <div className="mini-label" data-reveal>
          <span /> LEITURA DE HARDWARE <span className="label-rule" />
        </div>
        <h1 data-reveal>
          Diagnóstico do seu<br />
          <em>aparelho em tempo real.</em>
        </h1>
        <p data-reveal>
          Identifique modelo, tela, núcleos de CPU, taxa de quadros e estabilidade de conexão direto no navegador.
        </p>

        <div className="device-visual" data-reveal aria-hidden="true">
          <div className="device-top">
            <span className="visual-dot" />
            <span>LEITURA DO DISPOSITIVO</span>
          </div>
          <div className="circuit-stage">
            <div className="core-halo" />
            <svg className="circuit-board" viewBox="0 0 360 230" fill="none">
              <g stroke="#486d59" strokeWidth="1">
                <path className="circuit-trace" d="M0 48H76L120 92H152" />
                <path className="circuit-trace" d="M0 114H152" />
                <path className="circuit-trace" d="M28 215V181L115 135H152" />
                <path className="circuit-trace" d="M360 49H286L241 93H207" />
                <path className="circuit-trace" d="M360 116H207" />
                <path className="circuit-trace" d="M334 214V178L243 135H207" />
                <path className="circuit-trace" d="M180 0V72M180 157V230" />
              </g>
              <g fill="#a0e1b5">
                {[
                  [76, 48],
                  [28, 181],
                  [286, 49],
                  [334, 178],
                  [120, 92],
                  [241, 93],
                ].map(([cx, cy], i) => (
                  <circle className="circuit-node" key={i} cx={cx} cy={cy} r="2.5" />
                ))}
              </g>
            </svg>
            <span className="circuit-caption caption-left">APARELHO</span>
            <span className="circuit-caption caption-right">CONEXÃO</span>
            <div className="core-chip">
              <span className="chip-corner corner-a" />
              <span className="chip-corner corner-b" />
              <Fingerprint size={52} strokeWidth={1} />
              <span>PGM</span>
            </div>
            <div className="circuit-bottom">
              <span>DADOS REAIS</span>
              <span>SEM APLICATIVOS</span>
            </div>
          </div>
          <div className="device-bottom">
            <span>
              <Wifi size={14} /> Wi-Fi ou 4G / 5G
            </span>
            <span>
              Você escolhe <ArrowUpRight size={12} />
            </span>
          </div>
        </div>

        <div data-reveal>
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <Button className="mobile-primary w-full" onClick={onBug}>
              <span>
                INICIAR ANÁLISE<small>Começar leitura agora</small>
              </span>
              <span className="cta-arrow">
                <ArrowRight size={21} />
              </span>
            </Button>
          </motion.div>
          <p className="button-note">
            <ShieldCheck size={14} /> Executado localmente. Sem alterar configurações do celular.
          </p>
        </div>
      </section>

      <section className="simple-flow">
        <div className="section-eyebrow">COMO FUNCIONA</div>
        <h2>
          Diagnóstico guiado.<br />
          <span>Direto no seu celular.</span>
        </h2>
        {[
          {
            Icon: Smartphone,
            t: '1. Identifique o aparelho',
            d: 'Informe o modelo do seu celular e a rede utilizada para calibrar a leitura.',
          },
          {
            Icon: ScanLine,
            t: '2. Acompanhe o terminal',
            d: 'Veja a extração de métricas de CPU, GPU, tela e latência em tempo real.',
          },
        ].map(({ Icon, t, d }) => (
          <motion.div
            className="flow-card"
            key={t}
            whileHover={{ scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          >
            <span className="flow-icon">
              <Icon size={20} strokeWidth={1.5} />
            </span>
            <div>
              <h3>{t}</h3>
              <p>{d}</p>
            </div>
          </motion.div>
        ))}
      </section>

      <div className="privacy-panel">
        <ShieldCheck size={21} />
        <div>
          <h3>Leitura segura via navegador</h3>
          <p>
            O diagnóstico lê somente as APIs padrões disponibilizadas pelo seu navegador. Nenhum arquivo pessoal ou aplicativo é acessado.
          </p>
        </div>
      </div>
    </MobileFrame>
  )
}
