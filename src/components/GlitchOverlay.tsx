import { motion } from 'motion/react'
import type { AccountPath } from '../destinations'
import { Terminal } from './Terminal'
import { MobileFrame } from './MobileFrame'
import type { BugReport } from './DataForm'

export function GlitchOverlay({
  report,
  path,
  onDone,
}: {
  report: BugReport
  path: AccountPath
  onDone: () => void
}) {
  return (
    <MobileFrame step={2}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="screen-title">
          <div className="mini-label">
            <span /> LENDO SEU DISPOSITIVO
          </div>
          <h1>
            Conhecendo melhor<br />
            <em>seu aparelho.</em>
          </h1>
          <p>Aguarde a exibição dos dados disponíveis no seu navegador. Não alteramos configurações do aparelho.</p>
        </div>

        <div className="analysis-device">
          {report.modelo}
          <span>{report.rede.tipo === 'wifi' ? 'Wi-Fi' : '4G / 5G'} · informado por você</span>
        </div>

        <div className="bp-terminal-window">
          <Terminal report={report} onDone={onDone} />
        </div>

        <div className="small-notice">
          <span className="notice-symbol">i</span>
          <p>
            {path === 'create'
              ? 'Aguarde a análise terminar. Depois, o botão para criar sua conta no site será liberado.'
              : 'Aguarde a análise terminar. Depois, o botão para acessar sua conta será liberado.'}
          </p>
        </div>
      </motion.div>
    </MobileFrame>
  )
}
