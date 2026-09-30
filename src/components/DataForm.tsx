import { useState } from 'react'
import { motion } from 'motion/react'
import { ArrowRight, Check, LockKeyhole, Signal, Smartphone, Wifi } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { MobileFrame } from './MobileFrame'

export interface BugReport {
  modelo: string
  rede: { tipo: 'wifi' | '4g'; nome?: string }
}

export function DataForm({
  onBack,
  onSubmit,
}: {
  onBack: () => void
  onSubmit: (report: BugReport) => void
}) {
  const [modelo, setModelo] = useState('')
  const [tipo, setTipo] = useState<'wifi' | '4g'>('wifi')
  const [wifi, setWifi] = useState('')

  const valid = Boolean(modelo.trim() && (tipo === '4g' || wifi.trim()))
  const progress = modelo.trim() ? (tipo === '4g' || wifi.trim() ? 100 : 58) : 28

  return (
    <MobileFrame step={1} onBack={onBack}>
      <motion.section className="reading-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="reading-status-row" data-reveal>
          <Badge variant="secondary" className="reading-status">
            <Smartphone size={14} />
            preparar leitura
          </Badge>
          <span>{valid ? 'pronto para iniciar' : 'faltam dados'}</span>
        </div>

        <div className="reading-hero" data-reveal>
          <h1>
            Identifique o
            <mark>aparelho.</mark>
          </h1>
          <p>Esses dados ajudam a separar o que voce informou do que o navegador consegue detectar sozinho.</p>
        </div>

        <form
          className="reading-form"
          onSubmit={(e) => {
            e.preventDefault()
            if (valid) {
              onSubmit({
                modelo: modelo.trim(),
                rede: tipo === 'wifi' ? { tipo: 'wifi', nome: wifi.trim() } : { tipo: '4g' },
              })
            }
          }}
        >
          <div className="reading-progress-card" data-reveal aria-hidden="true">
            <div>
              <span>progresso</span>
              <strong>{valid ? 'dados completos' : 'aguardando entrada'}</strong>
            </div>
            <Progress value={progress} className="reading-progress" />
          </div>

          <div className="field-group reading-field" data-reveal>
            <label htmlFor="modelo">Modelo do celular</label>
            <div className="reading-input">
              <Smartphone size={18} />
              <Input
                id="modelo"
                value={modelo}
                onChange={(e) => setModelo(e.target.value)}
                placeholder="Ex: iPhone 14, Galaxy S23"
                required
                maxLength={100}
                autoComplete="off"
              />
            </div>
            <p>Se nao souber, procure em Configuracoes &gt; Sobre o telefone.</p>
          </div>

          <fieldset className="field-group reading-field" data-reveal>
            <legend>Conexao ativa agora</legend>
            <div className="reading-network-options">
              {(
                [
                  { value: 'wifi', label: 'Wi-Fi', detail: 'rede local', Icon: Wifi },
                  { value: '4g', label: '4G / 5G', detail: 'dados moveis', Icon: Signal },
                ] as const
              ).map(({ value, label, detail, Icon }) => (
                <motion.label
                  key={value}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 28 }}
                  className={'reading-network-choice ' + (tipo === value ? 'is-selected' : '')}
                >
                  <input
                    type="radio"
                    name="rede"
                    value={value}
                    checked={tipo === value}
                    onChange={() => setTipo(value)}
                  />
                  <Icon size={21} />
                  <span>
                    <strong>{label}</strong>
                    <small>{detail}</small>
                  </span>
                  {tipo === value && <Check size={15} />}
                </motion.label>
              ))}
            </div>
          </fieldset>

          {tipo === 'wifi' && (
            <div className="field-group reading-field" data-reveal>
              <label htmlFor="wifi">Nome da rede Wi-Fi</label>
              <div className="reading-input">
                <Wifi size={18} />
                <Input
                  id="wifi"
                  value={wifi}
                  onChange={(e) => setWifi(e.target.value)}
                  placeholder="Nome visivel da rede"
                  required
                  maxLength={100}
                  autoComplete="off"
                />
              </div>
              <p>Nunca pedimos a senha da sua rede.</p>
            </div>
          )}

          <div className="reading-privacy" data-reveal>
            <LockKeyhole size={18} />
            <p>As informacoes ficam na sessao atual para montar o relatorio da leitura.</p>
          </div>

          <motion.div
            whileHover={valid ? { scale: 1.01 } : {}}
            whileTap={valid ? { scale: 0.98 } : {}}
            transition={{ type: 'spring', stiffness: 420, damping: 28 }}
            data-reveal
          >
            <Button type="submit" disabled={!valid} className="mobile-primary reading-cta w-full">
              <span>
                Iniciar verificacao
                <small>{valid ? 'Ler dados do navegador' : 'Preencha os campos acima'}</small>
              </span>
              <ArrowRight size={20} />
            </Button>
          </motion.div>
        </form>
      </motion.section>
    </MobileFrame>
  )
}
