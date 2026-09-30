import { motion } from 'motion/react'
import { Activity, Cpu, Database, ShieldCheck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
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
      <motion.section className="analysis-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="analysis-status-row" data-reveal>
          <Badge variant="secondary" className="analysis-status">
            <Activity size={14} />
            leitura em andamento
          </Badge>
          <span>{path === 'create' ? 'cadastro depois' : 'login depois'}</span>
        </div>

        <div className="analysis-hero" data-reveal>
          <h1>
            Lendo sinais do
            <mark>navegador.</mark>
          </h1>
          <p>Nao mexemos no aparelho. A tela abaixo mostra somente dados disponiveis nesta sessao.</p>
        </div>

        <div className="analysis-summary-card" data-reveal>
          <div className="analysis-device-badge">
            <Cpu size={18} />
            <div>
              <span>aparelho informado</span>
              <strong>{report.modelo}</strong>
            </div>
          </div>
          <div className="analysis-network">
            <Database size={15} />
            <span>{report.rede.tipo === 'wifi' ? `Wi-Fi: ${report.rede.nome || 'nao informado'}` : '4G / 5G informado'}</span>
          </div>
          <Progress value={72} className="analysis-progress" aria-label="Leitura em andamento" />
        </div>

        <div className="analysis-terminal-shell" data-reveal>
          <Terminal report={report} onDone={onDone} />
        </div>

        <div className="analysis-note" data-reveal>
          <ShieldCheck size={17} />
          <p>
            {path === 'create'
              ? 'Quando a leitura terminar, o cadastro sera liberado automaticamente.'
              : 'Quando a leitura terminar, o login sera liberado automaticamente.'}
          </p>
        </div>
      </motion.section>
    </MobileFrame>
  )
}
