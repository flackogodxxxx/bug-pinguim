import { useRef, useState } from 'react'
import { motion } from 'motion/react'
import { ArrowRight, Eye, EyeOff, UserRound, KeyRound, Snowflake, Loader2 } from 'lucide-react'
import { MobileFrame } from './MobileFrame'
import { Button } from './ui/button'
import { Input } from './ui/input'
import {
  loginWithUserOrEmail,
  formatAuthError,
  isFirebaseConfigured,
} from '../lib/firebase'

export function Login() {
  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!isFirebaseConfigured) {
      setError('Firebase não configurado no .env.')
      return
    }

    setLoading(true)
    try {
      await loginWithUserOrEmail(user, password)
      setPassword('')
      // App advances only when Firebase confirms the session via its observer.
    } catch (err: unknown) {
      const fbErr = err as { code?: string; message?: string }
      setError(formatAuthError(fbErr?.code || fbErr?.message || 'unknown'))
      const form = formRef.current
      if (form) {
        form.classList.remove('shake')
        void form.offsetWidth
        form.classList.add('shake')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <MobileFrame>
      <section className="auth-intro">
        <div className="auth-art" aria-hidden="true">
          <div className="auth-orbit" />
          <div className="auth-orbit orbit-two" />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <span key={i} className={'ice-mote mote-' + i} />
          ))}
          <div className="auth-logo-float">
            <img src="/brand-penguin.webp" alt="" width="164" height="164" fetchPriority="high" />
          </div>
          <span className="ice-stamp">
            <Snowflake size={12} /> BUG PINGUIM
          </span>
        </div>
        <div className="auth-heading" data-reveal>
          <span className="section-eyebrow">DIAGNÓSTICO E LEITURA</span>
          <h1>
            Acesse com seu<br />
            <em>usuário e senha.</em>
          </h1>
          <p>Digite as credenciais fornecidas para liberar a análise no seu aparelho.</p>
        </div>
      </section>

      <form ref={formRef} className="auth-glass mobile-form" onSubmit={handleSubmit}>
        <div className="auth-panel-title">
          <span>IDENTIFICAÇÃO</span>
          <span>Acesso Seguro</span>
        </div>

        <div className="field-group">
          <label htmlFor="username">Usuário</label>
          <div className="auth-input">
            <UserRound size={18} />
            <Input
              id="username"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              required
              value={user}
              aria-invalid={Boolean(error)}
              onChange={(e) => {
                setUser(e.target.value)
                setError('')
              }}
              placeholder="Digite seu usuário"
              disabled={loading}
            />
          </div>
        </div>

        <div className="field-group">
          <label htmlFor="password">Senha</label>
          <div className="password-field auth-input">
            <KeyRound size={18} />
            <Input
              id="password"
              type={visible ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={password}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'login-error' : undefined}
              onChange={(e) => {
                setPassword(e.target.value)
                setError('')
              }}
              placeholder="Digite sua senha"
              disabled={loading}
            />
            <motion.button
              whileTap={{ scale: 0.88 }}
              type="button"
              onClick={() => setVisible(!visible)}
              aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
              aria-pressed={visible}
              disabled={loading}
            >
              {visible ? <EyeOff size={18} /> : <Eye size={18} />}
            </motion.button>
          </div>
        </div>

        {error && (
          <p id="login-error" role="alert" className="login-error">
            {error}
          </p>
        )}

        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <Button type="submit" disabled={loading} className="mobile-primary auth-submit w-full">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={18} className="animate-spin" />
                <span>Verificando acesso...</span>
              </span>
            ) : (
              <>
                <span>Entrar no Bug</span>
                <span className="cta-arrow">
                  <ArrowRight size={20} />
                </span>
              </>
            )}
          </Button>
        </motion.div>

        <p className="auth-footnote">Acesso exclusivo com credenciais fornecidas previamente.</p>
      </form>
    </MobileFrame>
  )
}
