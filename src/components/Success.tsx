import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { ArrowUpRight, Check, Copy, RotateCcw, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { MobileFrame } from './MobileFrame'
import type { BugReport } from './DataForm'
import { DESTINATIONS, type AccountPath } from '../destinations'
import { currentDiagnostic, UNAVAILABLE } from '../lib/diagnostics'

export function Success({
  report,
  path,
  onRestart,
}: {
  report: BugReport
  path: AccountPath
  onRestart: () => void
}) {
  const details = currentDiagnostic(report)
  const [copyState, setCopyState] = useState<'idle' | 'copying' | 'copied'>('idle')
  const [copyError, setCopyError] = useState('')
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
      if (copyTimer.current) clearTimeout(copyTimer.current)
    }
  }, [])

  const rows = [
    ['Aparelho informado', report.modelo],
    ['Rede informada', report.rede.tipo === 'wifi' ? report.rede.nome || UNAVAILABLE : 'Dados moveis (4G/5G)'],
    ['Sistema identificado', details?.os || UNAVAILABLE],
    ['Navegador', details?.browser || UNAVAILABLE],
    ['Processadores logicos expostos', details?.cores || UNAVAILABLE],
    ['Memoria estimada pelo navegador', details?.ram || UNAVAILABLE],
    ['Tela em pixels CSS', details?.tela || UNAVAILABLE],
    ['Renderizador WebGL', details?.gpu || UNAVAILABLE],
    ['Conexao estimada pelo navegador', details?.conexao || UNAVAILABLE],
  ]

  const summary = [
    'BUG PINGUIM - RELATORIO DE LEITURA',
    ...rows.map(([label, value]) => `${label}: ${value}`),
    'Nao disponivel: informacao nao fornecida pelo navegador.',
    'A leitura nao modifica o jogo, a rede ou as configuracoes do aparelho.',
  ].join('\n')

  const handleCopy = async () => {
    if (copyState === 'copying') return
    if (copyTimer.current) clearTimeout(copyTimer.current)
    setCopyError('')
    setCopyState('copying')
    try {
      if (!navigator.clipboard?.writeText) throw new Error('clipboard-unavailable')
      await navigator.clipboard.writeText(summary)
      if (!mounted.current) return
      setCopyState('copied')
      copyTimer.current = setTimeout(() => setCopyState('idle'), 2200)
    } catch {
      if (!mounted.current) return
      setCopyState('idle')
      setCopyError('Nao foi possivel copiar. Voce pode selecionar o texto do relatorio abaixo.')
    }
  }

  return (
    <MobileFrame step={3}>
      <motion.section
        className="result-screen"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="result-mark" data-reveal aria-hidden="true">
          <span />
          <Check size={34} />
        </div>

        <div className="result-hero" data-reveal>
          <Badge variant="secondary" className="result-status">
            <ShieldCheck size={14} />
            leitura concluida
          </Badge>
          <h1>
            Relatorio pronto.
            <mark>Pode continuar.</mark>
          </h1>
          <p>Separamos os dados informados por voce dos sinais que o navegador conseguiu expor.</p>
        </div>

        <Card className="result-report-card" data-reveal>
          <CardContent className="result-report-content">
            <div className="result-report-head">
              <div>
                <span>destino liberado</span>
                <strong>{path === 'create' ? 'Criar conta' : 'Entrar na conta'}</strong>
              </div>
              <Badge variant="outline">ok</Badge>
            </div>

            <dl className="result-detail-list">
              {rows.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>

            <p className="result-disclaimer">
              Valores de memoria e conexao podem ser estimativas. Campos indisponiveis aparecem sem chute.
            </p>

            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={handleCopy}
              disabled={copyState === 'copying'}
              className="result-copy-button"
            >
              {copyState === 'copied' ? <Check size={15} /> : <Copy size={15} />}
              <span>{copyState === 'copying' ? 'Copiando...' : copyState === 'copied' ? 'Relatorio copiado' : 'Copiar relatorio'}</span>
            </motion.button>

            {copyError && (
              <div className="result-copy-fallback">
                <p role="alert">{copyError}</p>
                <textarea
                  aria-label="Relatorio para copiar manualmente"
                  readOnly
                  value={summary}
                  onFocus={(e) => e.currentTarget.select()}
                />
              </div>
            )}
          </CardContent>
        </Card>

        <div className="result-actions" data-reveal>
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 420, damping: 28 }}
          >
            <Button asChild className="mobile-primary result-cta w-full">
              <a href={DESTINATIONS[path]} target="_blank" rel="noreferrer">
                <span>
                  {path === 'create' ? 'Criar minha conta' : 'Abrir minha conta'}
                  <small>Continuar em pinguimsurf.com</small>
                </span>
                <ArrowUpRight size={20} />
              </a>
            </Button>
          </motion.div>

          <motion.div
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 420, damping: 28 }}
          >
            <Button variant="ghost" onClick={onRestart} className="restart-button result-restart">
              <RotateCcw size={15} /> Repetir leitura
            </Button>
          </motion.div>
        </div>
      </motion.section>
    </MobileFrame>
  )
}
