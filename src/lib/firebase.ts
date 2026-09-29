import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  type Auth,
  type User,
} from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId
)

let app: FirebaseApp | undefined
let auth: Auth | undefined

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
    auth = getAuth(app)
  } catch (err) {
    console.error('Falha ao inicializar o Firebase:', err)
  }
}

export { app, auth, onAuthStateChanged }

/**
 * Converte um nome de usuário simples (ex: "cliente1") em um e-mail interno compatível com o Firebase
 * (ex: "cliente1@pinguim.com"), ou mantém se já for um e-mail com "@".
 */
export function normalizeUserToEmail(input: string): string {
  const clean = input.trim().toLowerCase()
  if (clean.includes('@')) {
    return clean
  }
  // Remove espaços ou caracteres especiais não suportados em e-mail
  const sanitized = clean.replace(/[^a-z0-9._-]/g, '')
  return `${sanitized}@pinguim.com`
}

/**
 * Faz login aceitando tanto um nome de usuário (ex: "joao") quanto um e-mail completo ("joao@gmail.com").
 * Se a pessoa digitar apenas o usuário sem "@", o app completa automaticamente com "@gmail.com".
 */
export async function loginWithUserOrEmail(userOrEmail: string, pass: string): Promise<User> {
  if (!auth) throw new Error('firebase-not-configured')
  const clean = userOrEmail.trim().toLowerCase()

  // Se já tem @ (ex: usuario@gmail.com, usuario@outro.com)
  if (clean.includes('@')) {
    const cred = await signInWithEmailAndPassword(auth, clean, pass)
    return cred.user
  }

  // Se digitou apenas o usuário sem @, tenta com @gmail.com
  const sanitized = clean.replace(/[^a-z0-9._-]/g, '')
  try {
    const cred = await signInWithEmailAndPassword(auth, `${sanitized}@gmail.com`, pass)
    return cred.user
  } catch (err: unknown) {
    const fbErr = err as { code?: string }
    // Fallback: se não achar com @gmail.com, tenta também @pinguim.com
    if (fbErr?.code === 'auth/user-not-found' || fbErr?.code === 'auth/invalid-credential') {
      try {
        const cred2 = await signInWithEmailAndPassword(auth, `${sanitized}@pinguim.com`, pass)
        return cred2.user
      } catch {
        // Se ambos falharem, propaga o erro de credencial inválida
      }
    }
    throw err
  }
}

export async function loginWithGoogle(): Promise<User> {
  if (!auth) throw new Error('firebase-not-configured')
  const provider = new GoogleAuthProvider()
  const cred = await signInWithPopup(auth, provider)
  return cred.user
}

export async function logout(): Promise<void> {
  if (!auth) return
  await signOut(auth)
}

export function formatAuthError(errorCode: string): string {
  switch (errorCode) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Usuário ou senha incorretos. Confira e tente novamente.'
    case 'auth/email-already-in-use':
      return 'Este usuário já está cadastrado.'
    case 'auth/weak-password':
      return 'A senha precisa ter no mínimo 6 caracteres.'
    case 'auth/invalid-email':
      return 'Formato de usuário ou e-mail inválido.'
    case 'auth/user-disabled':
      return 'Esta conta foi desativada.'
    case 'auth/too-many-requests':
      return 'Muitas tentativas seguidas. Aguarde alguns instantes.'
    case 'auth/network-request-failed':
      return 'Sem conexão com a internet. Verifique sua rede.'
    case 'auth/popup-closed-by-user':
      return 'Janela de login fechada antes de concluir.'
    case 'firebase-not-configured':
      return 'Firebase ainda não configurado no arquivo .env.'
    default:
      return 'Erro ao autenticar. Verifique suas credenciais.'
  }
}
