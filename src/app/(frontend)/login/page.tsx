'use client'

import Link from 'next/link'
import { Suspense, useState, type FormEvent } from 'react'
import { useSearchParams } from 'next/navigation'
import { announceAuthChange, useSiteAuth } from '@/components/auth/AuthProvider'
import { Container } from '@/components/ui/Container'

function LoginForm() {
  const { refresh } = useSiteAuth()
  const searchParams = useSearchParams()
  const trainerMode=searchParams.get('mode')==='trainer'
  const requestedRedirect = searchParams.get('redirect') || (trainerMode ? '/trainer' : '/dashboard')
  const redirect = /^\/(?![\/\\])/.test(requestedRedirect) && !/[\\\x00-\x20]/.test(requestedRedirect) ? requestedRedirect : '/dashboard'
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    setError('')

    const formData = new FormData(e.currentTarget)
    try {
      const res = await fetch(trainerMode ? '/api/users/login' : '/api/students/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.get('email'),
          password: formData.get('password'),
        }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.errors?.[0]?.message || 'Invalid email or password.')
      }
      await refresh()
      try { announceAuthChange() } catch {}
      window.location.replace(redirect)
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  return (
    <Container className="flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">{trainerMode ? 'Trainer login' : 'Log in'}</h1>
        <p className="mt-1 text-sm text-slate-500">{trainerMode ? 'Access your assigned courses and recordings.' : 'Access your licensed courses and continue learning.'}</p>
        {searchParams.get('loggedOut') && <p role="status" className="mt-4 text-sm text-emerald-700">You have been logged out.</p>}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              name="email"
              required
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              name="password"
              required
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>
          {status === 'error' && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:opacity-60"
          >
            {status === 'loading' ? 'Logging in…' : 'Log in'}
          </button>
        </form>
        {trainerMode ? <p className="mt-6 text-center text-sm text-slate-500">Trainer access is provided by your training coordinator.</p> : <p className="mt-6 text-center text-sm text-slate-500">
          Don&apos;t have an account?{' '}
          <Link href={searchParams.has('redirect') ? `/signup?redirect=${encodeURIComponent(redirect)}` : '/signup'} className="font-semibold text-brand-600 hover:underline">
            Sign up
          </Link>
        </p>}
      </div>
    </Container>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
