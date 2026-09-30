import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Button } from './ui/button'
import { MobileFrame } from './MobileFrame'

interface ErrorBoundaryState {
  hasError: boolean
}

export class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error('Erro inesperado na interface:', error, info)
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <MobileFrame>
        <section className="screen-title error-boundary-screen">
          <div className="mini-label">
            <span /> erro de interface
          </div>
          <h1>
            Nao foi possivel<br />
            <em>carregar esta tela.</em>
          </h1>
          <p>Recarregue o aplicativo para iniciar uma nova leitura.</p>
          <Button className="mobile-primary w-full" onClick={() => window.location.reload()}>
            Recarregar
          </Button>
        </section>
      </MobileFrame>
    )
  }
}
