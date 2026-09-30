import { useRef, useState } from 'react'
import { motion } from 'motion/react'
import { ArrowRight, Check, LogOut, ScanLine, ShieldCheck, Sparkles, UserPlus, UserRound } from 'lucide-react'
import { MobileFrame } from './MobileFrame'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import type { AccountPath } from '../destinations'

const routes = [
  {
    value: 'create',
    Icon: UserPlus,
    eyebrow: 'Primeiro acesso',
    title: 'Criar conta',
    text: 'Guarde o resultado e siga com um cadastro novo depois da leitura.',
    action: 'Liberar cadastro',
  },
  {
    value: 'existing',
    Icon: UserRound,
    eyebrow: 'Ja tenho conta',
    title: 'Entrar na conta',
    text: 'Use seu login atual e continue com o mesmo acesso apos a leitura.',
    action: 'Abrir login',
  },
] as const

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
      setLogoutError('Nao foi possivel sair deste acesso. Sua sessao continua ativa. Tente novamente.')
    } finally {
      logoutPending.current = false
      setLoggingOut(false)
    }
  }

  const activeRoute = routes.find((route) => route.value === selected)

  return (
    <MobileFrame>
      <section className="choice-screen">
        <div className="choice-status-row" data-reveal>
          <Badge variant="secondary" className="choice-status">
            <Check size={14} />
            acesso confirmado
          </Badge>
          <span className="choice-status-copy">Leitura pronta para iniciar</span>
        </div>

        <div className="choice-hero" data-reveal>
          <h1>
            Escolha como quer
            <mark>continuar.</mark>
          </h1>
          <p>Primeiro fazemos a leitura do aparelho. Depois liberamos o caminho certo para voce.</p>
        </div>

        <div className="choice-scan-card" data-reveal aria-hidden="true">
          <div>
            <ScanLine size={18} />
            <span>proximo passo</span>
            <strong>leitura local</strong>
          </div>
          <Progress value={66} className="choice-scan-progress" />
        </div>

        <fieldset className="choice-route-list" disabled={loggingOut}>
          <legend className="sr-only">Escolha se deseja criar uma conta ou usar sua conta existente</legend>

          {routes.map(({ value, Icon, eyebrow, title, text, action }) => (
            <motion.label
              key={value}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 420, damping: 28 }}
              className={'choice-route ' + (selected === value ? 'is-selected' : '')}
              data-reveal
            >
              <input
                type="radio"
                name="account-path"
                value={value}
                checked={selected === value}
                onChange={() => setSelected(value)}
              />
              <span className="choice-route-icon">
                <Icon size={22} strokeWidth={1.8} />
              </span>
              <span className="choice-route-copy">
                <span>{eyebrow}</span>
                <strong>{title}</strong>
                <small>{text}</small>
              </span>
              <span className="choice-route-action">
                {selected === value ? <Check size={15} /> : <ArrowRight size={16} />}
                <small>{action}</small>
              </span>
            </motion.label>
          ))}
        </fieldset>

        <div className="choice-bottom" data-reveal>
          <div className="choice-bottom-note" aria-live="polite">
            <ShieldCheck size={17} />
            <p>
              {selected
                ? `${activeRoute?.title}: a leitura roda agora e o destino abre em seguida.`
                : 'Toque em uma rota para liberar o botao de continuar.'}
            </p>
          </div>

          <motion.div
            whileHover={selected ? { scale: 1.01 } : {}}
            whileTap={selected ? { scale: 0.98 } : {}}
            transition={{ type: 'spring', stiffness: 420, damping: 28 }}
          >
            <Button
              disabled={!selected || loggingOut}
              onClick={() => !logoutPending.current && selected && onChoose(selected)}
              className="mobile-primary choice-cta w-full"
            >
              <span>
                {activeRoute ? activeRoute.action : 'Escolha uma rota'}
                <small>{activeRoute ? 'Comecar leitura do aparelho' : 'Cadastro ou login'}</small>
              </span>
              <ArrowRight size={20} />
            </Button>
          </motion.div>
        </div>

        <motion.button
          whileTap={{ scale: 0.96 }}
          className="restart-button choice-logout"
          onClick={handleLogout}
          disabled={loggingOut}
          aria-busy={loggingOut}
        >
          {loggingOut ? <Sparkles size={15} /> : <LogOut size={15} />}
          {loggingOut ? 'Saindo...' : 'Sair deste acesso'}
        </motion.button>

        {logoutError && <p role="alert" className="login-error">{logoutError}</p>}
      </section>
    </MobileFrame>
  )
}
