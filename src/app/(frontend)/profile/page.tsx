import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Container } from '@/components/ui/Container'
import { siteUser, identity } from '@/lib/auth/session'
import { SessionBoundary } from '@/components/auth/AuthProvider'
import { ProfileForm } from '@/components/auth/ProfileForm'
export const metadata = { title: 'Student Profile | Tinitiate AI' }
export default async function ProfilePage() {
  const user = await siteUser()
  if (user?.collection !== 'students') redirect('/login?redirect=/profile')
  return <SessionBoundary account={identity(user)!}><Container className="py-14"><div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10"><Link href="/dashboard" className="text-sm font-semibold text-brand-700">← My Dashboard</Link><h1 className="mt-6 text-3xl font-bold text-slate-900">My Profile</h1><p className="mt-3 text-slate-600">Keep your learning account details up to date.</p><p className="mt-6 break-all rounded-xl bg-slate-50 p-4 text-sm text-slate-700"><span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Account email</span>{user.email}</p><ProfileForm id={user.id} name={user.name} phone={user.phone} /></div></Container></SessionBoundary>
}
