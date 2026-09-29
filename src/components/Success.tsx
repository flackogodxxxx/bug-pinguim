import { useState, useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import { ArrowUpRight, Check, RotateCcw, Copy, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
    return () => { mounted.current = false; if (copyTimer.current) clearTimeout(copyTimer.current) }
  }, [])
  const rows = [
    ['Aparelho informado', report.modelo],
    ['Rede informada', report.rede.tipo === 'wifi' ? report.rede.nome || UNAVAILABLE : 'Dados móveis (4G/5G)'],
    ['Sistema identificado', details?.os || UNAVAILABLE],
    ['Navegador', details?.browser || UNAVAILABLE],
    ['Processadores lógicos expostos', details?.cores || UNAVAILABLE],
    ['Memória estimada pelo navegador', details?.ram || UNAVAILABLE],
    ['Tela em pixels CSS', details?.tela || UNAVAILABLE],
    ['Renderizador WebGL', details?.gpu || UNAVAILABLE],
    ['Conexão estimada pelo navegador', details?.conexao || UNAVAILABLE],
  ]
  const summary = [
    'BUG PINGUIM — RELATÓRIO DE LEITURA',
    ...rows.map(([label, value]) => `${label}: ${value}`),
    'Não disponível: informação não fornecida pelo navegador.',
    'A leitura não modifica o jogo, a rede ou as configurações do aparelho.',
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
      setCopyError('Não foi possível copiar. Você pode selecionar o texto do relatório abaixo.')
    }
  }

  return (
    <MobileFrame step={3}>
      <motion.div
        className="success-content py-2"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Ícone comemorativo com anéis pulsantes em ciano */}
        <div className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center">
          <motion.div
            className="absolute inset-0 rounded-full border border-primary/40 bg-primary/10"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [1, 1.4, 1], opacity: [0.55, 0, 0.55] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/20 blur-md"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1.15 }}
            transition={{ duration: 1.8, repeat: Infinity, repeatType: 'reverse' }}
          />
          <motion.div
            className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/60 bg-[#0a1c32] text-primary shadow-[0_0_30px_rgba(109,224,255,0.5)]"
            initial={{ scale: 0.6, rotate: -15, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 350, damping: 20 }}
          >
            <Check size={36} strokeWidth={2.5} />
          </motion.div>
        </div>

        <div className="screen-title mb-6">
          <div className="mini-label justify-center mb-2">
            <span /> LEITURA CONCLUÍDA
          </div>
          <h1>
            Análise pronta.<br />
            <em>Pode continuar.</em>
          </h1>
          <p>Estas são as informações disponíveis no navegador. Nenhuma configuração do jogo ou do celular foi alterada.</p>
        </div>

        {/* Informações da leitura atual, sem resultados de jogos externos */}
        <div className="rounded-xl border border-primary/30 bg-[#071322]/90 p-4 text-left shadow-xl backdrop-blur-sm mb-6">
          <div className="flex items-center justify-between border-b border-primary/20 pb-2.5 mb-3.5">
            <span className="font-mono text-[11px] uppercase tracking-wider text-accent flex items-center gap-1.5 font-semibold">
              <ShieldCheck size={15} className="text-emerald-400" /> Relatório do aparelho
            </span>
            <span className="font-mono text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/40">
              CONCLUÍDO
            </span>
          </div>

          <dl className="space-y-3 text-xs">
            {rows.map(([label,value]) => <div key={label} className="rounded-lg bg-primary/5 border border-primary/15 p-3">
              <dt className="text-muted-foreground mb-1">{label}</dt>
              <dd className="text-foreground break-words">{value}</dd>
            </div>)}
          </dl>
          <p className="mt-3 text-xs text-muted-foreground">Dados informados por você e dados expostos pelo navegador são identificados separadamente. Valores de memória e conexão são estimativas.</p>

          {/* Botão sutil de copiar relatório */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleCopy}
            disabled={copyState === 'copying'}
            className="mt-3.5 flex w-full items-center justify-center gap-1.5 rounded-lg border border-primary/20 bg-primary/10 py-2 font-mono text-[11px] text-primary hover:bg-primary/20 transition-colors"
          >
            {copyState === 'copied' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            <span>{copyState === 'copying' ? 'Copiando…' : copyState === 'copied' ? 'Relatório copiado com sucesso!' : 'Copiar relatório'}</span>
          </motion.button>
          {copyError && <div className="mt-3"><p role="alert" className="text-sm text-destructive">{copyError}</p><textarea aria-label="Relatório para copiar manualmente" readOnly value={summary} className="mt-2 w-full h-48 rounded border border-border bg-background p-3 text-xs" onFocus={e => e.currentTarget.select()} /></div>}
        </div>

        {/* Botão de ação principal com brilho e efeito táctil */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <Button asChild className="mobile-primary w-full shadow-[0_0_25px_rgba(109,224,255,0.4)]">
            <a href={DESTINATIONS[path]} target="_blank" rel="noreferrer">
              <span>{path === 'create' ? 'Continuar para criar conta' : 'Continuar para minha conta'}</span>
              <ArrowUpRight size={20} />
            </a>
          </Button>
        </motion.div>

        <p className="mt-2 text-[11px] text-muted-foreground/80 font-mono text-center">
          Você será encaminhado para pinguimsurf.com
        </p>

        {/* Reiniciar diagnóstico */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <Button variant="ghost" onClick={onRestart} className="restart-button w-full mt-3 text-muted-foreground hover:text-foreground">
            <RotateCcw size={15} /> Repetir análise
          </Button>
        </motion.div>
      </motion.div>
    </MobileFrame>
  )
}
