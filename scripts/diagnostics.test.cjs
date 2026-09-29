const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const ts = require('typescript')
const vm = require('node:vm')
function load(nav = {}, extra = {}) {
 const file = fs.existsSync('src/lib/diagnostics.ts') ? 'src/lib/diagnostics.ts' : 'src/components/Terminal.tsx'
 const src = fs.readFileSync(file,'utf8') + '\nexport { collectDeviceInfo, buildStableLines };'
 const output=ts.transpileModule(src,{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText
 const sandbox={exports:{},require:()=>({}),navigator:{userAgent:'',...nav},screen:{width:390,height:844,colorDepth:24},window:{devicePixelRatio:3},document:{createElement:()=>({getContext:()=>null})},Intl,...extra}
 vm.runInNewContext(output,sandbox)
 return sandbox.exports
}
test('missing browser APIs do not become invented measurements',()=>{
 const info=load().collectDeviceInfo()
 for(const key of ['cores','ram','conexao','bateria','idioma']) assert.equal(info[key],'Não disponível',key)
})
test('zero connection estimates remain zero and are labeled estimates',()=>{
 const info=load({connection:{downlink:0,rtt:0}}).collectDeviceInfo()
 assert.match(info.conexao,/0 Mbps/);assert.match(info.conexao,/0 ms/);assert.match(info.conexao,/estimativ/i)
})
test('generic user agent platform is not claimed as exact phone model',()=>{
 assert.equal(load({userAgent:'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}).collectDeviceInfo().modelo,'Não disponível')
})
test('logs identify supplied data and never claim game modifications',()=>{
 const api=load();const text=api.buildStableLines(api.collectDeviceInfo(),{modelo:'Meu celular',rede:{tipo:'wifi',nome:'Minha rede'}}).map(x=>x.text).join('\n')
 assert.match(text,/informad/i);assert.doesNotMatch(text,/\[PATCH\]|calibrado|patches.*sucesso|priorizando|desativando anti-aliasing/i)
})
