const assert = require('node:assert/strict')
const { test } = require('node:test')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const ts = require('typescript')
const root = path.resolve(__dirname, '..')

// Execute real TSX handlers without a browser or Firebase network access.
function harness(file, firebase = {}) {
  const state = [], refs = [], effects = [], cleanups = []
  let cursor = 0, refCursor = 0, effectCursor = 0
  const jsx = (type, props) => ({ type, props: props || {} })
  const react = {
    useState(initial) {
      const i = cursor++
      if (!(i in state)) state[i] = typeof initial === 'function' ? initial() : initial
      return [state[i], value => { state[i] = typeof value === 'function' ? value(state[i]) : value }]
    },
    useRef(initial) { const i = refCursor++; return refs[i] ||= { current: initial } },
    useEffect(effect) { const i = effectCursor++; if (!effects[i]) { effects[i] = effect; cleanups.push(effect()) } },
  }
  const cache = {}
  function load(relative) {
    if (cache[relative]) return cache[relative]
    const output = ts.transpileModule(fs.readFileSync(path.join(root, relative), 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 },
    }).outputText
    const module = { exports: {} }
    const requireMock = name => {
      if (name === 'react') return react
      if (name === 'react/jsx-runtime') return { jsx, jsxs: jsx, Fragment: 'Fragment' }
      if (name === 'motion/react') return { motion: new Proxy({}, { get: (_, p) => `motion.${p}` }), AnimatePresence: 'AnimatePresence', MotionConfig: 'MotionConfig' }
      if (name.endsWith('/firebase')) return firebase
      if (name.endsWith('/destinations')) return load('src/destinations.ts')
      return new Proxy({}, { get: (_, p) => p })
    }
    vm.runInNewContext(output, { module, exports: module.exports, require: requireMock, window: { scrollTo() {} }, console })
    return cache[relative] = module.exports
  }
  const mod = load(file)
  const component = mod.default || Object.values(mod).find(v => typeof v === 'function')
  return { render(props = {}) { cursor = refCursor = effectCursor = 0; return component(props) }, unmount() { cleanups.forEach(fn => fn?.()) } }
}
function nodes(tree) {
  if (Array.isArray(tree)) return tree.flatMap(nodes)
  if (!tree || typeof tree !== 'object') return []
  return [tree, ...nodes(tree.props?.children)]
}
function find(tree, predicate) { return nodes(tree).find(predicate) }
const has = (tree, type) => !!find(tree, node => node.type === type)
test('missing Firebase and observer errors never grant access', () => {
  const missing = harness('src/App.tsx', { auth: undefined })
  assert.equal(has(missing.render(), 'Login'), true)
  let fail
  const app = harness('src/App.tsx', {
    auth: {}, onAuthStateChanged: (_auth, _next, error) => { fail = error; return () => {} },
  })
  app.render()
  fail(new Error('unavailable'))
  const tree = app.render()
  assert.ok(find(tree, n => n.props.role === 'alert'))
  assert.equal(has(tree, 'TrialNotice'), false)
  assert.equal(has(tree, 'AccountChoice'), false)
})

test('observer gates protected screens, restores session and clears revoked sessions', () => {
  let notify, unsubscribed = false
  const app = harness('src/App.tsx', {
    auth: {},
    onAuthStateChanged: (_auth, next) => { notify = next; return () => { unsubscribed = true } },
  })
  let tree = app.render()
  assert.equal(has(tree, 'Login'), false, 'wait for initial Firebase state')
  assert.equal(has(tree, 'TrialNotice'), false)
  assert.ok(find(tree, n => n.props.role === 'status'))
  notify({ uid: 'u1', displayName: 'Cliente', email: 'cliente@example.test' })
  tree = app.render()
  assert.equal(has(tree, 'TrialNotice'), true)
  assert.equal(find(tree, n => n.type === 'TrialNotice').props.username, 'Cliente')
  find(tree, n => n.type === 'TrialNotice').props.onContinue()
  assert.equal(has(app.render(), 'AccountChoice'), true)
  notify({ uid: 'u1', displayName: 'Cliente' })
  assert.equal(has(app.render(), 'AccountChoice'), true, 'same session must not reset navigation')
  notify(null)
  tree = app.render()
  assert.equal(has(tree, 'Login'), true)
  assert.equal(has(tree, 'AccountChoice'), false)
  app.unmount()
  assert.equal(unsubscribed, true)
})

test('logout is awaited, failure stays visible and retry can complete', async () => {
  let notify, rejectLogout, resolveLogout, attempts = 0
  const app = harness('src/App.tsx', {
    auth: {}, onAuthStateChanged: (_auth, next) => { notify = next; return () => {} },
    logout: () => { attempts++; return new Promise((resolve, reject) => { resolveLogout = resolve; rejectLogout = reject }) },
  })
  app.render()
  notify({ uid: 'u1', email: 'cliente@example.test' })
  find(app.render(), n => n.type === 'TrialNotice').props.onContinue()
  const props = find(app.render(), n => n.type === 'AccountChoice').props
  const choice = harness('src/components/AccountChoice.tsx')
  let tree = choice.render(props)
  const button = find(tree, n => n.props.className?.includes('restart-button'))
  const pending = button.props.onClick()
  await button.props.onClick()
  assert.equal(attempts, 1, 'ignore duplicate clicks during signOut')
  tree = choice.render(props)
  assert.equal(find(tree, n => n.props.className?.includes('restart-button')).props.disabled, true)
  assert.equal(has(app.render(), 'AccountChoice'), true, 'do not navigate before signOut resolves')
  rejectLogout(new Error('offline'))
  await pending
  tree = choice.render(props)
  assert.ok(find(tree, n => n.props.role === 'alert'))
  assert.equal(has(app.render(), 'AccountChoice'), true, 'failed logout preserves session')
  const retry = find(tree, n => n.props.className?.includes('restart-button')).props.onClick()
  resolveLogout()
  await retry
  assert.equal(attempts, 2)
  notify(null)
  assert.equal(has(app.render(), 'Login'), true)
})

test('login always asks Firebase, including the former local bypass', async () => {
  let attempts = 0, granted = 0
  const app = harness('src/components/Login.tsx', {
    isFirebaseConfigured: true,
    loginWithUserOrEmail: async () => { attempts++; throw { code: 'auth/invalid-credential' } },
    formatAuthError: () => 'Credenciais inválidas',
  })
  let tree = app.render({ onLogin: () => granted++ })
  find(tree, n => n.props.id === 'username').props.onChange({ target: { value: 'risk' } })
  find(tree, n => n.props.id === 'password').props.onChange({ target: { value: 'Risk' } })
  tree = app.render({ onLogin: () => granted++ })
  await find(tree, n => n.type === 'form').props.onSubmit({ preventDefault() {} })
  assert.equal(attempts, 1)
  assert.equal(granted, 0)
  assert.ok(find(app.render(), n => n.props.role === 'alert'))
  assert.doesNotMatch(fs.readFileSync(path.join(root, 'src/destinations.ts'), 'utf8'), /acceptsLogin/)
})
