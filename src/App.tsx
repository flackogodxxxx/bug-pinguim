import { AnimatePresence, motion, MotionConfig } from 'motion/react'
import { useEffect, useState } from 'react'
import { Login } from './components/Login'
import { TrialNotice } from './components/TrialNotice'
import { AccountChoice } from './components/AccountChoice'
import { Landing } from './components/Landing'
import type { BugReport } from './components/DataForm'
import { DataForm } from './components/DataForm'
import { GlitchOverlay } from './components/GlitchOverlay'
import { Success } from './components/Success'
import type { AccountPath } from './destinations'
import { auth, onAuthStateChanged, logout } from './lib/firebase'
import { MobileFrame } from './components/MobileFrame'
type Stage = 'login'|'trial'|'choice'|'landing'|'form'|'hacking'|'success'

const slideUp = {
 initial: { opacity: 0, y: 32 },
 animate: { opacity: 1, y: 0, transition: { duration: .4, ease: [.22,1,.36,1] as [number,number,number,number] } },
 exit:    { opacity: 0, y: -18, transition: { duration: .25 } },
}

export default function App(){
 const [stage,setStage]=useState<Stage>('login'); const [loggedUser,setLoggedUser]=useState<string>(''); const [path,setPath]=useState<AccountPath>('create'); const [report,setReport]=useState<BugReport|null>(null)
 const [authReady,setAuthReady]=useState(!auth)
 const [authenticated,setAuthenticated]=useState(false)
 const [authError,setAuthError]=useState('')
 useEffect(()=>{
  if (!auth) return
  let currentUid: string | null = null
  return onAuthStateChanged(auth, user=>{
   setAuthError('')
   setAuthenticated(Boolean(user))
   if (user) {
    setLoggedUser(user.displayName || user.email?.split('@')[0] || 'Usuário')
    if (currentUid !== user.uid) { setReport(null); setPath('create'); setStage('trial') }
    currentUid = user.uid
   } else {
    currentUid = null
    setReport(null); setLoggedUser(''); setPath('create'); setStage('login')
   }
   setAuthReady(true)
  }, ()=>{
   currentUid = null
   setAuthenticated(false); setReport(null); setLoggedUser(''); setStage('login')
   setAuthError('Não foi possível verificar sua sessão. Recarregue a página para tentar novamente.')
   setAuthReady(true)
  })
 },[])
 useEffect(()=>{window.scrollTo({top:0,behavior:'smooth'})},[stage])
 return <MotionConfig reducedMotion="never"><div className="min-h-screen text-foreground">
 {!authReady ? <div className="suspense-gate"><div className="suspense-spinner" /></div>
 : authError ? <MobileFrame><p role="alert" className="login-error">{authError}</p></MobileFrame>
 : !authenticated ? <motion.div key="login" {...slideUp}><Login /></motion.div>
 : <AnimatePresence mode="wait">
  {stage==='trial' && <motion.div key="trial" {...slideUp}><TrialNotice username={loggedUser} onContinue={()=>setStage('choice')}/></motion.div>}
  {stage==='choice' && <motion.div key="choice" {...slideUp}><AccountChoice onChoose={p=>{setPath(p);setStage('landing')}} onLogout={logout}/></motion.div>}
  {stage==='landing' && <motion.div key="landing" {...slideUp}><Landing onBug={()=>setStage('form')}/></motion.div>}
  {stage==='form' && <motion.div key="form" {...slideUp}><DataForm onBack={()=>setStage('choice')} onSubmit={r=>{setReport(r);setStage('hacking')}}/></motion.div>}
  {stage==='hacking' && report && <motion.div key="hacking" {...slideUp}><GlitchOverlay report={report} path={path} onDone={()=>setStage('success')}/></motion.div>}
  {stage==='success' && report && <motion.div key="success" {...slideUp}><Success report={report} path={path} onRestart={()=>{setReport(null);setStage('choice')}}/></motion.div>}
 </AnimatePresence>}
 </div></MotionConfig>
}
