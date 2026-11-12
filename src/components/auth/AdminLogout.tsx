'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@payloadcms/ui'
import { announceAuthChange } from './AuthProvider'

export function AdminLogout() {
  const { setUser, user } = useAuth()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  useEffect(() => {
    async function check() {
      try {
        const response = await fetch('/api/users/me', { cache: 'no-store' })
        if (!response.ok) return
        const current = (await response.json()).user
        if (!current || !['admin', 'editor'].includes(current.role)) window.location.replace('/admin/login')
        else if (current.id !== user?.id || current.role !== user?.role) window.location.reload()
      } catch { /* A transient network failure does not establish logout. */ }
    }
    function changed(event: StorageEvent) { if (event.key === 'tinitiate-auth-change') void check() }
    function restored(event: PageTransitionEvent) { if (event.persisted) window.location.reload(); else void check() }
    window.addEventListener('focus', check)
    window.addEventListener('storage', changed)
    window.addEventListener('pageshow', restored)
    return () => { window.removeEventListener('focus', check); window.removeEventListener('storage', changed); window.removeEventListener('pageshow', restored) }
  }, [user?.id, user?.role])
  return <div><button type="button" disabled={busy} onClick={async () => {
    setBusy(true); setError('')
    try {
      const response = await fetch('/api/users/logout', { method: 'POST' })
      if (!response.ok) throw Error('Logout failed. Please try again.')
      setUser(null)
      try { announceAuthChange() } catch {}
      window.location.replace('/admin/login')
    } catch (err) { setError(err instanceof Error ? err.message : 'Logout failed'); setBusy(false) }
  }} style={{ padding: '9px 18px', borderRadius: 6, border: '1px solid var(--theme-elevation-300)', background: 'var(--theme-elevation-100)', color: 'var(--theme-text)', cursor: 'pointer', fontWeight: 600 }}>{busy ? 'Logging out…' : 'Logout'}</button>{error && <p role="alert">{error}</p>}</div>
}

export function HiddenLogout() { return null }
