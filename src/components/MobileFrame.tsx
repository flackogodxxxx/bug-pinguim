import { useLayoutEffect, useRef, type ReactNode } from 'react'
import { ArrowLeft, Shield } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function MobileFrame({ children, step = 0, onBack }: { children: ReactNode; step?: number; onBack?: () => void }) {
 const root = useRef<HTMLDivElement>(null)
 useLayoutEffect(() => {
  const ctx = gsap.context(() => {
   const select = gsap.utils.selector(root)
   gsap.to(select('.ice-aurora'), { x: 18, y: 12, opacity: .55, duration: 7, repeat: -1, yoyo: true, ease: 'sine.inOut' })
   gsap.from(select('.mobile-header'), { y: -12, opacity: 0, duration: .65, ease: 'power3.out' })
   const entrance = select('[data-reveal], .screen-title, .field-group, .analysis-device, .bp-terminal-window, .result-summary, .success-mark')
   if (entrance.length) gsap.from(entrance, { y: 24, opacity: 0, duration: .85, stagger: .09, delay: .12, ease: 'power3.out', clearProps: 'transform,opacity' })
   if (select('.auth-logo-float').length) {
    gsap.from(select('.auth-art'), { opacity: 0, scale: .92, duration: 1.1, ease: 'power3.out' })
    gsap.to(select('.auth-logo-float'), { y: -7, rotation: 1.2, duration: 3.8, repeat: -1, yoyo: true, ease: 'sine.inOut' })
    gsap.to(select('.auth-orbit'), { rotation: 360, duration: 70, repeat: -1, ease: 'none' })
    gsap.to(select('.ice-mote'), { y: -16, opacity: .25, duration: 2.4, stagger: .35, repeat: -1, yoyo: true, ease: 'sine.inOut' })
    gsap.from(select('.auth-panel-title, .auth-submit, .auth-footnote'), { opacity: 0, y: 12, stagger: .12, delay: .35, duration: .7, clearProps: 'transform,opacity' })
   }
   const steps = select('.mobile-steps li')
   if (steps.length) gsap.from(steps, { opacity: 0, y: 8, stagger: .12, duration: .55 })
   const traces = root.current?.querySelectorAll<SVGPathElement>('.circuit-trace') ?? []
   traces.forEach(path => {
    const length = path.getTotalLength()
    gsap.fromTo(path, { strokeDasharray: length, strokeDashoffset: length }, { strokeDashoffset: 0, duration: 2.2, delay: .5, ease: 'power2.inOut' })
   })
   if (select('.core-halo').length) gsap.to(select('.core-halo'), { scale: 1.15, opacity: .45, duration: 3.2, repeat: -1, yoyo: true, ease: 'sine.inOut', transformOrigin: '50% 50%' })
   if (select('.core-chip').length) gsap.to(select('.core-chip'), { y: -5, duration: 3.5, repeat: -1, yoyo: true, ease: 'sine.inOut' })
   if (select('.circuit-node').length) gsap.to(select('.circuit-node'), { opacity: .3, duration: 1.8, stagger: .25, repeat: -1, yoyo: true, ease: 'sine.inOut' })
   select('.simple-flow > div').forEach((el: Element) => gsap.from(el, { y: 22, opacity: 0, duration: .7, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 94%', once: true } }))
  }, root)
  return () => ctx.revert()
 }, [step])
 return <div ref={root} className="mobile-shell"><div className="ambient-grid" aria-hidden="true"/><div className="ice-aurora" aria-hidden="true"/><header className="mobile-header">{onBack ? <button className="back-button" onClick={onBack} aria-label="Voltar"><ArrowLeft size={20}/></button> : <span className="brand-mark"><img src="/icon-192.png" alt="" width="43" height="43"/></span>}<span className="brand-wordmark">BUG PINGUIM<small>ANÁLISE DO DISPOSITIVO</small></span><span className="brand-end"><Shield size={14}/> LOCAL</span></header>{step > 0 && <ol className="mobile-steps" aria-label="Seu progresso">{['Seu celular','Análise','Pronto'].map((label,i)=><li key={label} className={i+1 <= step ? 'active' : ''} aria-current={i+1 === step ? 'step' : undefined}>{label}</li>)}</ol>}<main>{children}</main><footer className="mobile-footer"><span className="footer-rule"/>BUG PINGUIM<span>Sem instalar nada. Direto no navegador.</span></footer></div>
}
