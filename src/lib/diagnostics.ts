import type { BugReport } from '../components/DataForm'
export const UNAVAILABLE = 'Não disponível'
export interface DeviceInfo {
 modelo: string; browser: string; os: string; cores: string; ram: string; gpu: string
 tela: string; cor: string; dpr: string; conexao: string; bateria: string; fuso: string; idioma: string
}
export interface TermLine { text: string; color: 'cmd' | 'ok' | 'warn' | 'err' | 'dim'; speed?: number; pauseAfter?: number }
export function collectDeviceInfo(): DeviceInfo {
 const ua = navigator.userAgent || ''
 const conn = (navigator as Navigator & { connection?: { effectiveType?: string; downlink?: number; rtt?: number } }).connection
 const ram = (navigator as Navigator & { deviceMemory?: number }).deviceMemory
 const model = ua.match(/(SM-[A-Z0-9]+|Pixel \d+[a-z]*|Moto G\d+|Redmi [A-Za-z0-9]+|POCO [A-Za-z0-9]+)/i)?.[1]
 const browser = /Edg\//.test(ua) ? 'Microsoft Edge' : /Chrome\/|CriOS\//.test(ua) ? 'Google Chrome' : /Firefox\/|FxiOS\//.test(ua) ? 'Mozilla Firefox' : /Safari\//.test(ua) ? 'Apple Safari' : UNAVAILABLE
 const os = /Windows/.test(ua) ? 'Windows' : /Android/.test(ua) ? 'Android' : /iPhone|iPad/.test(ua) ? 'iOS' : /Mac OS X/.test(ua) ? 'macOS' : /Linux/.test(ua) ? 'Linux' : UNAVAILABLE
 let gpu = UNAVAILABLE
 try {
  const gl = document.createElement('canvas').getContext('webgl')
  if (gl) {
   const ext = gl.getExtension('WEBGL_debug_renderer_info')
   const renderer = ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : null
   if (typeof renderer === 'string' && renderer) gpu = renderer
   gl.getExtension('WEBGL_lose_context')?.loseContext()
  }
 } catch { /* restricted API remains unavailable */ }
 const estimates: string[] = []
 if (conn?.effectiveType) estimates.push(`tipo efetivo ${conn.effectiveType}`)
 if (typeof conn?.downlink === 'number' && Number.isFinite(conn.downlink)) estimates.push(`${conn.downlink} Mbps`)
 if (typeof conn?.rtt === 'number' && Number.isFinite(conn.rtt)) estimates.push(`RTT ${conn.rtt} ms`)
 let fuso = UNAVAILABLE
 try { fuso = Intl.DateTimeFormat().resolvedOptions().timeZone || UNAVAILABLE } catch { /* no timezone */ }
 return {
  modelo: model || UNAVAILABLE, browser, os,
  cores: navigator.hardwareConcurrency > 0 ? String(navigator.hardwareConcurrency) : UNAVAILABLE,
  ram: typeof ram === 'number' && ram > 0 ? `${ram} GB (estimativa do navegador)` : UNAVAILABLE,
  gpu, tela: screen.width > 0 && screen.height > 0 ? `${screen.width} × ${screen.height} px CSS` : UNAVAILABLE,
  cor: screen.colorDepth > 0 ? `${screen.colorDepth} bits` : UNAVAILABLE,
  dpr: window.devicePixelRatio > 0 ? `${window.devicePixelRatio}x` : UNAVAILABLE,
  conexao: estimates.length ? `${estimates.join(' · ')} (estimativas do navegador; não é ping do jogo)` : UNAVAILABLE,
  bateria: UNAVAILABLE, fuso, idioma: navigator.language || UNAVAILABLE,
 }
}
export function buildStableLines(info: DeviceInfo, report: BugReport): TermLine[] {
 const data: [string,string][] = [
  ['Aparelho informado', report.modelo],
  ['Rede informada', report.rede.tipo === 'wifi' ? `Wi-Fi: ${report.rede.nome || UNAVAILABLE}` : 'Dados móveis (4G/5G)'],
  ['Modelo identificado no navegador',info.modelo],['Sistema',info.os],['Navegador',info.browser],
  ['Processadores lógicos expostos pelo navegador',info.cores],['Memória',info.ram],['Renderizador WebGL',info.gpu],
  ['Tela',info.tela],['Densidade de pixels',info.dpr],['Conexão',info.conexao],['Fuso horário',info.fuso],['Idioma',info.idioma],
 ]
 return [
  {text:'> Iniciando relatório local do navegador',color:'cmd',speed:12,pauseAfter:200},
  ...data.map(([label,value]):TermLine=>({text:`[${value === UNAVAILABLE ? 'INFO' : 'OK'}] ${label}: ${value}`,color:value === UNAVAILABLE ? 'dim' : 'ok',speed:9,pauseAfter:140})),
  {text:'[INFO] Campos não disponíveis não foram estimados por este aplicativo.',color:'dim',speed:9,pauseAfter:150},
  {text:'> Leitura concluída. Pronto para continuar.',color:'cmd',speed:12,pauseAfter:500},
 ]
}
// The current run is passed in memory to avoid presenting stale localStorage as a new result.
let latest: { info: DeviceInfo; report: BugReport } | null = null
export function rememberDiagnostic(info: DeviceInfo, report: BugReport) { latest = { info, report } }
export function currentDiagnostic(report: BugReport): DeviceInfo | null { return latest?.report === report ? latest.info : null }
