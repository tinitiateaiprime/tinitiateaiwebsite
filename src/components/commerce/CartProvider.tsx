'use client'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { useSiteAuth } from '@/components/auth/AuthProvider'

type Cart = { ids: number[]; ready: boolean; add: (id: number) => void; remove: (id: number) => void; clear: () => void }
const CartContext = createContext<Cart | null>(null)
function safeIDs(value: unknown): number[] { return Array.isArray(value) ? [...new Set(value.filter(id => Number.isSafeInteger(id) && id > 0))].slice(0, 20) : [] }
export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useSiteAuth()
  const key = `tinitiate-course-selection:${user?.collection === 'students' ? user.id : 'guest'}`
  const [state, setState] = useState<{ key: string; ids: number[] }>({ key: '', ids: [] })
  useEffect(() => {
    let active = true
    queueMicrotask(() => {
      let ids: number[] = []
      try {
        ids = safeIDs(JSON.parse(localStorage.getItem(key) || '[]'))
        if (user?.collection === 'students') {
          ids = safeIDs([...ids, ...safeIDs(JSON.parse(localStorage.getItem('tinitiate-course-selection:guest') || '[]'))])
          localStorage.removeItem('tinitiate-course-selection:guest')
          localStorage.setItem(key, JSON.stringify(ids))
        }
      } catch {}
      if (active) setState({ key, ids })
    })
    return () => { active = false }
  }, [key, user?.collection])
  const ids = state.key === key ? state.ids : []
  function save(next: number[]) { const clean = safeIDs(next); setState({ key, ids: clean }); try { localStorage.setItem(key, JSON.stringify(clean)) } catch {} }
  return <CartContext.Provider value={{ ids, ready: state.key === key, add: id => save([...ids, id]), remove: id => save(ids.filter(value => value !== id)), clear: () => save([]) }}>{children}</CartContext.Provider>
}
export function useCart() { const cart = useContext(CartContext); if (!cart) throw Error('Course selection provider is missing'); return cart }
export function SelectCourseButton({ id, title }: { id: number; title: string }) {
  const cart = useCart(); const { user } = useSiteAuth()
  if (user?.collection === 'users') return <Link href={`/login?redirect=${encodeURIComponent(`/checkout?add=${id}`)}`} className="mt-3 block text-center text-sm font-semibold text-brand-700">Use a student account to request this course</Link>
  const selected = cart.ids.includes(id)
  return <button type="button" aria-pressed={selected} aria-label={`${selected ? 'Remove' : 'Select'} ${title}`} onClick={() => selected ? cart.remove(id) : cart.add(id)} disabled={!selected && cart.ids.length >= 20} className={`mt-3 w-full rounded-full border px-5 py-3 text-sm font-semibold disabled:opacity-50 ${selected ? 'border-brand-300 bg-brand-50 text-brand-800' : 'border-slate-300 text-slate-700 hover:bg-slate-50'}`}>{selected ? '✓ Selected — Remove' : 'Select Course'}</button>
}
export function CartLink({ className = '' }: { className?: string }) {
  const { ids } = useCart(); const { user } = useSiteAuth()
  if (!ids.length || user?.collection === 'users') return null
  return <Link href="/checkout" className={className}>Review Selection ({ids.length})</Link>
}
