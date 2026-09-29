import { useRef, useState } from 'react'
import { motion } from 'motion/react'
import { UserPlus, ArrowRight, LogOut, Timer, Check, UserRound, Sparkles } from 'lucide-react'
import { MobileFrame } from './MobileFrame'
import { Button } from './ui/button'
import type { AccountPath } from '../destinations'

export function AccountChoice({
  onChoose,
  onLogout,
}: {
  onChoose: (path: AccountPath) => void
  onLogout: () => Promise<void>
}) {
  const [selected, setSelected] = useState<AccountPath | null>(null)
  const [loggingOut, setLoggingOut] = useState(false)
  const [logoutError, setLogoutError] = useState('')
  const logoutPending = useRef(false)

  const handleLogout = async () => {
    if (logoutPending.current) return
    logoutPending.current = true
    setLoggingOut(true)
    setLogoutError('')
    try {
      await onLogout()
    } catch {
      setLogoutError('Não foi possível sair deste acesso. Sua sessão continua ativa. Tente novamente.')
    } finally {
      logoutPending.current = false
      setLoggingOut(false)
    }
  }

  return (
    <MobileFrame>
      <div className="choice-welcome" data-reveal>
        <img src="/icon-192.png" width="44" height="44" alt="" />
        <div>
          <span>ACESSO CONFIRMADO</span>
          <p>Login autenticado com sucesso.</p>
        </div>
        <Check size={17} />
      </div>

      <div className="screen-title choice-title">
        <h1>
          Você já possui cadastro<br />
          <em>no Pinguim?</em>
        </h1>
        <p>Defina o destino após a análise do dispositivo.</p>
      </div>

      <fieldset className="route-options" disabled={loggingOut}>
        <legend className="sr-only">Escolha se deseja criar uma conta ou usar sua conta existente</legend>
        {(
          [
            {
              value: 'create',
              Icon: UserPlus,
              kicker: 'NOVO USUÁRIO',
              title: 'Criar uma nova conta',
              text: 'Ainda não possuo cadastro. O link de registro será liberado ao fim da análise.',
              detail: 'Cadastro após a análise',
            },
            {
              value: 'existing',
              Icon: UserRound,
              kicker: 'JÁ CADASTRADO',
              title: 'Acessar minha conta',
              text: 'Já possuo login no site. Seguir direto para a conta ao finalizar.',
              detail: 'Login após a análise',
            },
          ] as const
        ).map(({ value, Icon, kicker, title, text, detail }) => (
          <motion.label
            key={value}
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className={'route-card cursor-pointer ' + (selected === value ? 'route-selected' : '')}
            data-reveal
          >
            <input
              type="radio"
              name="account-path"
              value={value}
              checked={selected === value}
              onChange={() => setSelected(value)}
            />
            <span className="route-card-top">
              <span className="route-icon">
                <Icon size={24} strokeWidth={1.5} />
              </span>
              <span className="route-check">{selected === value && <Check size={14} />}</span>
            </span>
            <span className="route-kicker">{kicker}</span>
            <strong>{title}</strong>
            <span className="route-description">{text}</span>
            <span className="route-detail">
              <Sparkles size={12} />
              {detail}
              <ArrowRight size={15} />
            </span>
          </motion.label>
        ))}
      </fieldset>

      <div className="choice-next">
        <div className="choice-explanation" aria-live="polite">
          <Timer size={18} />
          <p>
            {selected === 'create'
              ? 'A análise do celular será iniciada. Ao concluir, o botão de cadastro no site ficará liberado.'
              : selected === 'existing'
              ? 'A análise do celular será iniciada. Ao concluir, você poderá acessar sua conta normalmente.'
              : 'Selecione uma opção acima para prosseguir para o teste.'}
          </p>
        </div>

        <motion.div
          whileHover={selected ? { scale: 1.01 } : {}}
          whileTap={selected ? { scale: 0.98 } : {}}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <Button
            disabled={!selected || loggingOut}
            onClick={() => !logoutPending.current && selected && onChoose(selected)}
            className="mobile-primary w-full"
          >
            {selected === 'create'
              ? 'Prosseguir para o cadastro'
              : selected === 'existing'
              ? 'Prosseguir para a conta'
              : 'Selecione uma opção'}
            <ArrowRight size={19} />
          </Button>
        </motion.div>

        <p className="choice-sequence">
          Aparelho <span>→</span> Diagnóstico <span>→</span> Site Pinguim
        </p>
      </div>

      <motion.button
        whileTap={{ scale: 0.95 }}
        className="restart-button flex items-center justify-center gap-2 mt-4"
        onClick={handleLogout}
        disabled={loggingOut}
        aria-busy={loggingOut}
      >
        <LogOut size={15} /> {loggingOut ? 'Saindo...' : 'Sair deste acesso'}
      </motion.button>
      {logoutError && <p role="alert" className="login-error">{logoutError}</p>}
    </MobileFrame>
  )
}
