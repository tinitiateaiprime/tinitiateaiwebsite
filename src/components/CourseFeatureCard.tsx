'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import type { Course } from '@/payload-types'
import { SelectCourseButton } from '@/components/commerce/CartProvider'

export function CourseFeatureCard({
  course,
}: {
  course: Course
  index?: number
}) {
  const cardLogo =
    course.cardLogo && typeof course.cardLogo === 'object'
      ? course.cardLogo
      : course.thumbnail && typeof course.thumbnail === 'object' ? course.thumbnail : null

  const cardLogoUrl = cardLogo?.url || (cardLogo?.filename ? `/media/${cardLogo.filename}` : null)

  const [shareOpen, setShareOpen] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  const [copied, setCopied] = useState(false)

  function handleShare(e: React.MouseEvent) {
    e.preventDefault()

    const url = `${window.location.origin}/courses/${course.slug}`

    setShareUrl(url)
    setCopied(false)
    setShareOpen(true)
  }

  async function copyShareLink() {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)

      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = shareUrl
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)

      setCopied(true)
    }
  }

  function shareOnWhatsApp() {
    const text = `${course.title}\n${shareUrl}`

    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      '_blank',
      'noopener,noreferrer',
    )
  }

  return (
    <>
      <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-indigo-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
        
        {/* Full-width course image */}
        <Link
          href={`/courses/${course.slug}`}
          className="relative block aspect-video w-full overflow-hidden bg-slate-100"
        >
          {cardLogoUrl ? (
            <Image
              src={cardLogoUrl}
              alt={cardLogo?.alt || `${course.title} banner`}
              fill
              sizes="288px"
              className="object-cover transition duration-500 hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-50 via-blue-50 to-violet-50 text-2xl font-bold text-indigo-600">
              {course.bannerLabel || course.title.charAt(0)}
            </div>
          )}

          {/* Premium badge */}
          {course.isPremium && (
            <span className="absolute right-3 top-3 rounded-full border border-amber-300 bg-amber-50/95 px-3 py-1 text-xs font-semibold text-amber-600 shadow-sm">
              ☆ Premium
            </span>
          )}
        </Link>

        {/* Content */}
        <div className="flex flex-1 flex-col p-5">
          <Link href={`/courses/${course.slug}`}>
            <h3 className="text-lg font-bold leading-tight text-slate-950 transition hover:text-indigo-600">
              {course.title}
            </h3>
          </Link>

          <p className="mt-3 text-sm leading-5 text-slate-600">
            {course.shortDescription}
          </p>

          {/* Actions */}
          <div className="mt-auto pt-5">
            <Link
              href={`/courses/${course.slug}`}
              className="flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              View Course
              <span>→</span>
            </Link>
            <SelectCourseButton id={course.id} title={course.title} />

            <button
              type="button"
              onClick={handleShare}
              className="mt-3 flex w-full items-center justify-center gap-2 py-2 text-sm font-semibold text-slate-500 transition hover:text-indigo-600"
            >
              <ShareIcon />
              Share Course
            </button>
          </div>
        </div>
      </div>

      {/* Share popup */}
      {shareOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShareOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Share this course"
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl rounded-xl bg-white p-6 shadow-2xl sm:p-8"
          >
            <button
              type="button"
              aria-label="Close share dialog"
              onClick={() => setShareOpen(false)}
              className="absolute right-5 top-5 text-3xl leading-none text-slate-500 transition hover:text-slate-900"
            >
              ×
            </button>

            <h2 className="pr-10 text-xl font-bold text-violet-600">
              Share this course
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              Share this course&apos;s details with your family &amp; friends
            </p>

            <div className="mt-6 flex overflow-hidden rounded-lg border border-slate-300">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="min-w-0 flex-1 bg-white px-4 py-3 text-sm text-slate-600 outline-none"
              />

              <button
                type="button"
                onClick={copyShareLink}
                className="shrink-0 bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                {copied ? '✓ Copied' : '▣ Copy Link'}
              </button>
            </div>

            <div className="mt-8">
              <button
                type="button"
                onClick={shareOnWhatsApp}
                aria-label="Share on WhatsApp"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-sm transition hover:scale-105 hover:bg-[#20bd5a]"
              >
                <WhatsAppIcon />
              </button>

              <span className="mt-2 block text-xs font-medium text-slate-500">
                WhatsApp
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function ShareIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.6 13.5l6.8 3.9M15.4 6.6L8.6 10.5" />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 32 32"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M16.01 3C8.84 3 3 8.82 3 15.98c0 2.29.6 4.52 1.73 6.48L3 29l6.72-1.76a12.96 12.96 0 0 0 6.28 1.6h.01C23.17 28.84 29 23.02 29 15.86 29 8.7 23.17 3 16.01 3Zm0 23.65h-.01a10.76 10.76 0 0 1-5.49-1.5l-.39-.23-3.99 1.05 1.07-3.89-.25-.4a10.76 10.76 0 0 1-1.65-5.72c0-5.94 4.84-10.78 10.8-10.78 5.95 0 10.79 4.84 10.79 10.78 0 5.95-4.84 10.79-10.88 10.79Zm5.92-8.09c-.32-.16-1.91-.94-2.2-1.05-.3-.11-.51-.16-.73.16-.21.32-.83 1.05-1.02 1.27-.19.21-.38.24-.7.08-.32-.16-1.36-.5-2.59-1.59-.96-.86-1.61-1.92-1.8-2.24-.19-.32-.02-.49.14-.65.15-.14.32-.38.49-.56.16-.19.21-.32.32-.54.11-.21.05-.4-.03-.56-.08-.16-.73-1.75-1-2.4-.26-.63-.53-.54-.73-.55h-.62c-.21 0-.56.08-.86.4-.3.32-1.13 1.1-1.13 2.68 0 1.59 1.16 3.12 1.32 3.34.16.21 2.28 3.48 5.52 4.88.77.33 1.37.53 1.84.68.77.24 1.48.21 2.03.13.62-.09 1.91-.78 2.18-1.54.27-.75.27-1.4.19-1.54-.08-.13-.3-.21-.62-.37Z" />
    </svg>
  )
}
