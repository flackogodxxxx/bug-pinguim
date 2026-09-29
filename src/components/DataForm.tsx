import { useState } from 'react'
import { motion } from 'motion/react'
import { ArrowRight, Wifi, Signal, Check, LockKeyhole } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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

  return (
    <MobileFrame step={1} onBack={onBack}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="screen-title">
          <h1>
            Qual aparelho você<br />
            <em>está usando?</em>
          </h1>
          <p>Informe o modelo e o tipo de conexão para calibrar a leitura.</p>
        </div>

        <form
          className="mobile-form"
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
          <div className="field-group">
            <label htmlFor="modelo">Modelo do celular</label>
            <Input
              id="modelo"
              value={modelo}
              onChange={(e) => setModelo(e.target.value)}
              placeholder="Ex: iPhone 14, Galaxy S23, Moto G84..."
              required
              maxLength={100}
              autoComplete="off"
            />
            <p>Se tiver dúvida, consulte em Configurações → Sobre o telefone.</p>
          </div>

          <fieldset className="field-group">
            <legend>Tipo de conexão ativa</legend>
            <div className="network-options">
              {(
                [
                  { value: 'wifi', label: 'Wi-Fi', Icon: Wifi },
                  { value: '4g', label: '4G / 5G', Icon: Signal },
                ] as const
              ).map(({ value, label, Icon }) => (
                <motion.label
                  key={value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className={'network-choice cursor-pointer ' + (tipo === value ? 'selected' : '')}
                >
                  <input
                    type="radio"
                    name="rede"
                    value={value}
                    checked={tipo === value}
                    onChange={() => setTipo(value)}
                  />
                  <Icon size={23} />
                  <span>{label}</span>
                  {tipo === value && <Check size={15} className="network-check" />}
                </motion.label>
              ))}
            </div>
          </fieldset>

          {tipo === 'wifi' && (
            <div className="field-group">
              <label htmlFor="wifi">Nome da rede Wi-Fi</label>
              <Input
                id="wifi"
                value={wifi}
                onChange={(e) => setWifi(e.target.value)}
                placeholder="Nome da sua rede Wi-Fi"
                required
                maxLength={100}
                autoComplete="off"
              />
              <p>Apenas o nome visível da rede. Nunca solicitamos sua senha.</p>
            </div>
          )}

          <div className="small-notice">
            <LockKeyhole size={18} />
            <p>Os dados informados são armazenados apenas no navegador para gerar seu relatório.</p>
          </div>

          <motion.div
            whileHover={valid ? { scale: 1.01 } : {}}
            whileTap={valid ? { scale: 0.98 } : {}}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <Button type="submit" disabled={!valid} className="mobile-primary w-full">
              <span>Iniciar verificação</span>
              <ArrowRight size={20} />
            </Button>
          </motion.div>

          {!valid && <p className="button-note">Preencha o modelo e a rede para habilitar a análise.</p>}
        </form>
      </motion.div>
    </MobileFrame>
  )
}
