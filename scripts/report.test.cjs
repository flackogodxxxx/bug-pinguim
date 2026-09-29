const test=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const ts=require('typescript');const vm=require('node:vm')
function copyHandler(clipboard){
 const source=fs.readFileSync('src/components/Success.tsx','utf8');const ast=ts.createSourceFile('Success.tsx',source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);let initializer
 function visit(n){if(ts.isVariableDeclaration(n)&&n.name.getText(ast)==='handleCopy')initializer=n.initializer.getText(ast);ts.forEachChild(n,visit)}visit(ast)
 assert(initializer,'copy handler exists')
 const states=[];const errors=[];const sandbox={exports:{},navigator:{clipboard},report:{modelo:'Test',rede:{tipo:'wifi',nome:'Test'}},details:null,summary:'Relatório real',copyState:'idle',setCopied:v=>states.push(v?'copied':'idle'),setCopyState:v=>states.push(v),setCopyError:v=>errors.push(v),setTimeout:()=>1,clearTimeout:()=>{},copyTimer:{current:null},mounted:{current:true}}
 vm.runInNewContext(ts.transpileModule('export const handleCopy = '+initializer,{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,sandbox)
 return {run:sandbox.exports.handleCopy,states,errors}
}
test('copy success only appears after clipboard resolves',async()=>{
 let resolve;const promise=new Promise(r=>resolve=r);const h=copyHandler({writeText:()=>promise});const result=h.run();assert(!h.states.includes('copied'));resolve();await result;assert(h.states.includes('copied'))
})
test('missing clipboard reports failure rather than success',async()=>{const h=copyHandler(undefined);await h.run();assert(!h.states.includes('copied'));assert(h.errors.some(Boolean))})
test('rejected clipboard reports failure',async()=>{const h=copyHandler({writeText:()=>Promise.reject(new Error('permission denied'))});await h.run();assert(!h.states.includes('copied'));assert(h.errors.some(Boolean))})
test('result screen does not claim unmeasured improvements',()=>{const source=fs.readFileSync('src/components/Success.tsx','utf8');assert.doesNotMatch(source,/60 \/ 120 FPS|Delay Zero|Pacotes Priorizados|Taxa de FPS desbloqueada|100% OTIMIZADO/)})
