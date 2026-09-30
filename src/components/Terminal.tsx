import { useEffect, useMemo, useRef, useState } from "react"
import { cn } from "cn"
import type { BugReport } from "@/components/DataForm"
import { collectDeviceInfo, buildStableLines, rememberDiagnostic, type TermLine } from '../lib/diagnostics'
const COLOR: Record<TermLine['color'], string> = {
 cmd: 'text-accent font-semibold', ok: 'text-primary', warn: 'text-yellow-400', err: 'text-destructive', dim: 'text-muted-foreground',
}
export function Terminal({ report, onDone }: { report: BugReport; onDone: () => void }) {
  const info = useMemo(() => collectDeviceInfo(), [])
  const lines = useMemo(() => buildStableLines(info, report), [info, report])
  const [committed, setCommitted] = useState<TermLine[]>([])
  const [idx, setIdx] = useState(0)
  const [char, setChar] = useState(0)
  const isFinished = idx >= lines.length
  const scrollRef = useRef<HTMLDivElement>(null)

  // Progresso fluido calculado caractere a caractere com travas suaves
  const progress = useMemo(() => {
    if (idx >= lines.length) return 100
    const lineWeight = 100 / lines.length
    const currentLineRatio = lines[idx].text.length > 0 ? char / lines[idx].text.length : 0
    return Math.min(100, Math.round((idx + currentLineRatio) * lineWeight))
  }, [idx, char, lines])

  const current = idx < lines.length ? lines[idx].text.slice(0, char) : ""

  // Keep this run in memory only, so diagnostic details are not retained after the session.
  useEffect(() => {
    rememberDiagnostic(info, report)
  }, [info, report])

  // Máquina de digitação com cadência cinematográfica e legível
  useEffect(() => {
    if (idx >= lines.length) {
      const t = setTimeout(onDone, 1400)
      return () => clearTimeout(t)
    }

    const line = lines[idx]
    if (char < line.text.length) {
      const t = setTimeout(() => {
        setChar((c) => Math.min(line.text.length, c + 1))
      }, line.speed ?? 15)
      return () => clearTimeout(t)
    }

    const pause = line.pauseAfter ?? 300
    const t = setTimeout(() => {
      setCommitted((l) => [...l, line])
      setIdx((i) => i + 1)
      setChar(0)
    }, pause)
    return () => clearTimeout(t)
  }, [idx, char, lines, onDone])

  // Auto-scroll instantâneo
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [committed, current])

  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-xl border bg-black/85 text-left transition-all duration-300",
        isFinished
          ? "border-primary shadow-[0_0_55px_-5px_rgba(109,224,255,0.45)] ring-1 ring-primary/40"
          : "border-primary/30 shadow-[0_0_45px_-10px_rgba(109,224,255,0.25)]"
      )}
    >
      {/* Barra de título do terminal com botões estilo console */}
      <div className="flex items-center gap-2 border-b border-primary/20 bg-[#07101e] px-3.5 py-2.5">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/80 shadow-[0_0_6px_rgba(239,68,68,0.4)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80 shadow-[0_0_6px_rgba(251,191,36,0.4)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80 shadow-[0_0_6px_rgba(52,211,153,0.4)]" />
        </div>
        <span className="ml-2 font-mono text-[11px] text-muted-foreground flex items-center gap-1.5">
          <span className="text-primary font-bold">&gt;_</span> pinguim / leitura-local
        </span>
        <span className="ml-auto flex items-center gap-1.5 font-mono text-[10px] text-emerald-400 font-semibold">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
          LEITURA LOCAL
        </span>
      </div>

      {/* Corpo do terminal com scroll customizado e tipografia mono */}
      <div
        ref={scrollRef}
        className="h-56 overflow-y-auto px-3.5 py-3 font-mono text-[11px] leading-relaxed sm:h-64 sm:text-xs [scrollbar-width:thin] [scrollbar-color:rgba(109,224,255,0.25)_transparent]"
      >
        {committed.map((l, i) => (
          <p key={i} className={cn("whitespace-pre-wrap break-words py-0.5", COLOR[l.color])}>
            {l.text}
          </p>
        ))}
        {idx < lines.length && (
          <p className={cn("whitespace-pre-wrap break-words py-0.5", COLOR[lines[idx].color])}>
            {current}
            <span className="animate-blink text-primary">▌</span>
          </p>
        )}
        {idx >= lines.length && (
          <p className="text-primary py-0.5">
            <span className="animate-blink">▌</span>
          </p>
        )}
      </div>

      {/* Barra de progresso com porcentagem tabular e gradiente com brilho */}
      <div className="border-t border-primary/20 bg-[#07101e] px-3.5 py-2.5">
        <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground">
          <span>exibição do relatório</span>
          <span className="text-accent font-semibold tabular-nums">{progress}%</span>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted/60">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400/80 via-primary/90 to-primary transition-[width] duration-150 ease-out shadow-[0_0_12px_rgba(109,224,255,0.85)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}
