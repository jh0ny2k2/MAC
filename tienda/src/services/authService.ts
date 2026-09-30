import type { AdminSession } from '../types/admin'
import { loadObject, simulateDelay } from './storage'
import adminData from '../data/admin.json'

const KEY = 'admin'
const SESSION_STORAGE_KEY = 'apex.admin.session'

interface AdminAccount {
  email: string
  password: string
  name: string
  role: string
}

function getAccount(): AdminAccount {
  const stored = loadObject<AdminAccount>(KEY, adminData as AdminAccount)
  return { ...(adminData as AdminAccount), ...stored }
}

const SESSION_DEFAULTS: AdminSession | null = null

function readSession(): AdminSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY)
    if (raw) return JSON.parse(raw) as AdminSession
  } catch {
    // no-op
  }
  return SESSION_DEFAULTS
}

function writeSession(session: AdminSession | null): void {
  try {
    if (session) {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
    } else {
      sessionStorage.removeItem(SESSION_STORAGE_KEY)
    }
  } catch {
    // no-op
  }
}

export const authService = {
  async login(email: string, password: string): Promise<AdminSession> {
    await simulateDelay(500)
    const account = getAccount()
    const normalized = email.trim().toLowerCase()
    if (
      normalized !== account.email.toLowerCase() ||
      password !== account.password
    ) {
      throw new Error('Credenciales incorrectas. Inténtalo de nuevo.')
    }
    const session: AdminSession = {
      email: account.email,
      name: account.name,
      role: account.role,
      loggedInAt: new Date().toISOString(),
    }
    writeSession(session)
    return session
  },

  logout(): void {
    writeSession(null)
  },

  getSession(): AdminSession | null {
    return readSession()
  },

  isAuthenticated(): boolean {
    return readSession() !== null
  },
}