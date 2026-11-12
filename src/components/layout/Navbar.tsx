'use client'

import Link from 'next/link'
import { useState } from 'react'
import { SearchBox } from '@/components/SearchBox'
import { NavDropdown } from '@/components/layout/NavDropdown'
import Image from 'next/image'
import type { Media } from '@/payload-types'
import { LogoutButton, useSiteAuth } from '@/components/auth/AuthProvider'
import { CartLink, useCart } from '@/components/commerce/CartProvider'

const publicLinks = [{ href: '/courses', label: 'Courses' }, { href: '/demos', label: 'Free Demos' }]

const trainingLinks = [
  { href: '/training', label: 'All Training Programs' },
  { href: '/training/beginner-training', label: 'Beginner Training' },
  { href: '/training/professional-training', label: 'Professional Training' },
  { href: '/training/corporate-training', label: 'Corporate Training' },
  { href: '/training/personalized-training', label: 'Personalized Training' },
  { href: '/training/campus-training', label: 'Campus Training' },
  { href: '/training/opt-training', label: 'OPT Training' },
  { href: '/work-experience-program', label: 'Work Experience Program' },
  { href: '/classroom-training', label: 'Classroom Training' },
  { href: '/online-training', label: 'Online Training' },
  { href: '/weekend-training', label: 'Weekend Training' },
  { href: '/internships', label: 'Internships' },
  { href: '/new-batches', label: 'New Batches' },
]

const servicesLinks = [
  { href: '/services', label: 'Business Services' },
  { href: '/placement-registration', label: 'Placement Registration' },
  { href: '/job-assistance', label: 'Job Assistance' },
  { href: '/workshops', label: 'Workshops' },
  { href: '/real-time-projects', label: 'Real-Time Projects' },
]

const publicGroups = [
  { label: 'Training', items: trainingLinks },
  { label: 'Services', items: servicesLinks },
]

export function Navbar({ logo }: { logo?: number | null | Media }) {
  const { user } = useSiteAuth()
  const cart = useCart()
  const [open, setOpen] = useState(false)
  const [openGroup, setOpenGroup] = useState<string | null>(null)
  const navLinks = !user ? publicLinks : user.collection === 'students'
    ? [{ href: '/courses', label: 'Courses' }, { href: '/learning', label: 'My Learning' }, { href: '/dashboard', label: 'My Dashboard' }, { href: '/profile', label: 'Student Profile' }]
    : user.role === 'trainer'
      ? [{ href: '/trainer', label: 'Trainer Dashboard' }, { href: '/trainer#assigned-courses', label: 'Assigned Courses' }, { href: '/trainer#recordings', label: 'Recordings' }]
      : [{ href: '/admin', label: 'Payload CMS' }, { href: '/admin/account', label: 'Account' }]
  const dropdownGroups = user ? [] : publicGroups
  const trailingLinks = user ? [] : [{ href: '/login', label: 'Student Login' }]

  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center">
  {typeof logo === 'object' && logo?.url ? (
    <Image
      src={logo.url}
      alt={logo.alt || 'TinitiateAI'}
      width={190}
      height={64}
      className="h-12 w-auto object-contain"
    />
  ) : <Image src="/azure/images/tinitiatelogo.png" alt="Tinitiate AI" width={190} height={40} className="h-10 w-auto" priority />}
</Link>

        {!user && !cart.ids.length && <SearchBox className="mx-4 hidden max-w-44 flex-1 xl:flex" />}
        {user && <span className="mx-3 max-w-28 truncate rounded-full bg-brand-50 px-3 py-2 text-xs font-semibold text-brand-800 sm:max-w-44" title={user.name} aria-label={`Signed in as ${user.name}`}>{user.name}</span>}

        <div className="hidden items-center gap-4 xl:flex">
          <nav className="flex items-center gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-slate-600 transition hover:text-brand-600"
              >
                {link.label}
              </Link>
            ))}
            {dropdownGroups.map((group) => (
              <NavDropdown key={group.label} label={group.label} items={group.items} />
            ))}
            {trailingLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-slate-600 transition hover:text-brand-600"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <CartLink className="rounded-full bg-brand-50 px-3 py-2 text-sm font-semibold text-brand-800" />
          {user && <LogoutButton className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50" />}

          {!user && <Link
            href="/book-a-demo"
            className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
          >
            Book a Demo
          </Link>}
        </div>

        <button
          className="flex items-center justify-center rounded-md p-2 text-slate-700 xl:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls="mobile-navigation"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <div id="mobile-navigation" className="max-h-[75vh] overflow-y-auto border-t border-slate-200 bg-white px-4 py-4 xl:hidden">
          {!user && <SearchBox className="mb-4" />}
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-2 text-sm font-medium text-slate-700"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {dropdownGroups.map((group) => (
              <div key={group.label}>
                <button
                  onClick={() => setOpenGroup((v) => (v === group.label ? null : group.label))}
                  className="flex w-full items-center justify-between py-2 text-left text-sm font-medium text-slate-700"
                >
                  {group.label}
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className={`transition-transform ${openGroup === group.label ? 'rotate-180' : ''}`}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                {openGroup === group.label && (
                  <div className="ml-3 flex flex-col border-l border-slate-100 pl-3">
                    {group.items.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="py-2 text-sm text-slate-600"
                        onClick={() => setOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {trailingLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-2 text-sm font-medium text-slate-700"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <CartLink className="my-2 rounded-full bg-brand-50 px-4 py-3 text-sm font-semibold text-brand-800" />
            {user && <LogoutButton className="mt-3 w-full rounded-full bg-brand-600 px-4 py-3 text-center text-sm font-semibold text-white disabled:opacity-50" />}
            {!user && <Link
              href="/book-a-demo"
              className="mt-3 rounded-full bg-brand-600 px-4 py-2 text-center text-sm font-semibold text-white"
              onClick={() => setOpen(false)}
            >
              Book a Demo
            </Link>}
          </nav>
        </div>
      )}
    </header>
  )
}
