'use client'
import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useSiteAuth, announceAuthChange } from './AuthProvider'
export function ProfileForm({ id, name, phone }: { id: number; name: string; phone?: string | null }) {
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const { refresh } = useSiteAuth()
  const router = useRouter()
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage('')
    const form = new FormData(event.currentTarget)
    try {
      const response = await fetch(`/api/students/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: String(form.get('name')).trim(), phone: String(form.get('phone')).trim() }) })
      if (!response.ok) throw Error('Your profile could not be saved. Please check your session and try again.')
      await refresh(); try { announceAuthChange() } catch {}
      router.refresh(); setMessage('Profile updated.')
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to save your profile.') } finally { setBusy(false) }
  }
  return <form onSubmit={submit} className="mt-8 space-y-5"><div><label htmlFor="profile-name" className="block text-sm font-semibold text-slate-700">Full name</label><input id="profile-name" name="name" defaultValue={name} required minLength={2} maxLength={100} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" /></div><div><label htmlFor="profile-phone" className="block text-sm font-semibold text-slate-700">Phone</label><input id="profile-phone" name="phone" type="tel" defaultValue={phone || ''} maxLength={40} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" /></div><button disabled={busy} className="rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white disabled:opacity-50">{busy ? 'Saving…' : 'Save Profile'}</button>{message && <p role="status" className="text-sm text-slate-700">{message}</p>}</form>
}
