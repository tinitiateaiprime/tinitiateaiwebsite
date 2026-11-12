'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import type { SiteIdentity } from '@/lib/auth/session'

type AuthState = { user: SiteIdentity | null; refresh: () => Promise<SiteIdentity | null>; logout: () => Promise<void> }
const AuthContext = createContext<AuthState | null>(null)
export function announceAuthChange() {
  localStorage.setItem('tinitiate-auth-change', `${Date.now()}:${Math.random()}`)
}

export function AuthProvider({ initialUser, children }: { initialUser: SiteIdentity | null; children: ReactNode }) {
  const [user, setUser] = useState(initialUser)
  const current = useRef(user)
  const version = useRef(0)
  const router = useRouter()
  const refresh = useCallback(async () => {
    const requestVersion = ++version.current
    const response = await fetch('/api/auth/session', { cache: 'no-store' })
    if (!response.ok) throw Error('Unable to verify your session. Please reload.')
    const next = (await response.json()).user as SiteIdentity | null
    if (requestVersion === version.current) { current.current = next; setUser(next) }
    return next
  }, [])

  useEffect(() => {
    let active = true
    async function check() {
      const previous = current.current
      try {
        const next = await refresh()
        if (active && JSON.stringify(previous) !== JSON.stringify(next)) router.refresh()
      } catch { /* Keep a valid screen on transient network loss; server authorization remains required. */ }
    }
    function visible() { if (document.visibilityState === 'visible') void check() }
    function stored(event: StorageEvent) { if (event.key === 'tinitiate-auth-change') void check() }
    function restored(event: PageTransitionEvent) { if (event.persisted) { document.documentElement.style.visibility = 'hidden'; window.location.reload() } else void check() }
    window.addEventListener('focus', check)
    window.addEventListener('storage', stored)
    window.addEventListener('pageshow', restored)
    document.addEventListener('visibilitychange', visible)
    return () => { active = false; window.removeEventListener('focus', check); window.removeEventListener('storage', stored); window.removeEventListener('pageshow', restored); document.removeEventListener('visibilitychange', visible) }
  }, [refresh, router])

  const logout = useCallback(async () => {
    const account = current.current
    if (!account) return
    const response = await fetch(`/api/${account.collection}/logout`, { method: 'POST' })
    if (!response.ok) throw Error('Logout failed. Please try again.')
    ++version.current
    current.current = null
    setUser(null)
    try { announceAuthChange() } catch {}
    // A full navigation discards cached private RSC trees as well as client state.
    window.location.replace(account.collection === 'students' ? '/login?loggedOut=1' : account.role === 'trainer' ? '/login?mode=trainer&loggedOut=1' : '/admin/login')
  }, [])

  return <AuthContext.Provider value={{ user, refresh, logout }}>{children}</AuthContext.Provider>
}

export function useSiteAuth() {
  const value = useContext(AuthContext)
  if (!value) throw Error('Site authentication provider is missing')
  return value
}

export function SessionBoundary({ account, children }: { account: SiteIdentity; children: ReactNode }) {
  const { user } = useSiteAuth()
  return user?.id === account.id && user.collection === account.collection && user.role === account.role ? children : <div className="p-12 text-center text-slate-600">Your session changed. <a href="/login" className="font-semibold text-brand-700 underline">Log in to continue</a>.</div>
}

export function LogoutButton({ className = '' }: { className?: string }) {
  const { logout } = useSiteAuth()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  return <span className="inline-flex flex-col"><button type="button" disabled={busy} className={className} onClick={async () => { setBusy(true); setError(''); try { await logout() } catch (err) { setError(err instanceof Error ? err.message : 'Logout failed'); setBusy(false) } }}>{busy ? 'Logging out…' : 'Logout'}</button>{error && <span role="alert" className="max-w-52 text-xs text-red-700">{error}</span>}</span>
}
