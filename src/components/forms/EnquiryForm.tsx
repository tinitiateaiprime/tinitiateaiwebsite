'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { ArrowRight, CheckCircle2, ChevronDown, Loader2 } from 'lucide-react';

const PATHS = ['AI Engineer', 'Agentic AI Developer', 'Cloud Engineer (AWS / Azure)', 'Data Governance', 'Full Stack Developer', 'Campus or corporate training', 'Not sure yet'];
const TIMES = ['Morning (9 am – 12 pm)', 'Afternoon (12 pm – 4 pm)', 'Evening (4 pm – 8 pm)', 'Weekend'];

const field = 'mt-1.5 block h-12 w-full rounded-xl border border-neutral-300 bg-white px-4 text-[15px] text-ink outline-none transition placeholder:text-neutral-400 focus:border-accent focus:ring-4 focus:ring-accent/15';
const labelCls = 'text-sm font-medium text-neutral-700';

function Select({ name, placeholder, options, defaultValue }: { name: string; placeholder: string; options: string[]; defaultValue: string }) {
  return <span className="relative block">
    <select name={name} required defaultValue={defaultValue} className={`${field} appearance-none pr-10`}>
      <option value="" disabled>{placeholder}</option>
      {options.map(o => <option key={o}>{o}</option>)}
    </select>
    <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 mt-[3px] size-4 -translate-y-1/2 text-neutral-500" />
  </span>;
}

/**
 * The one enquiry form used across the site (homepage FAQ, Contact, Request
 * Callback). Posts to /api/request-callback, which emails contact@tinitiateai.com.
 */
export function EnquiryForm({ course = '', source, submitLabel = 'Send message', messageLabel = 'Your question', messagePlaceholder = 'Ask us anything' }: {
  /** Pre-selected course or topic, e.g. from ?course= in the URL. */
  course?: string;
  /** Where the enquiry came from; added to the email when the visitor leaves no message. */
  source: string;
  submitLabel?: string;
  messageLabel?: string;
  messagePlaceholder?: string;
}) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');
  // A course passed in from a link (e.g. "Generative AI with OpenAI") is offered first.
  const options = course && !PATHS.includes(course) ? [course, ...PATHS] : PATHS;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus('sending'); setError('');
    try {
      const res = await fetch('/api/request-callback', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, message: data.message || `Sent from the ${source}.` }) });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Could not send your message.');
      form.reset();
      setStatus('done');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not send your message.');
      setStatus('error');
    }
  }

  if (status === 'done') return <div role="status" className="flex min-h-[420px] flex-col items-center justify-center text-center">
    <span className="grid size-14 place-items-center rounded-full bg-emerald-50 text-emerald-600"><CheckCircle2 aria-hidden="true" className="size-7" /></span>
    <p className="mt-5 text-xl font-semibold text-ink">Thanks! We&apos;ve got your message.</p>
    <p className="mt-2 max-w-xs text-[15px] leading-6 text-neutral-500">A mentor will call you at your preferred time.</p>
    <button type="button" onClick={() => setStatus('idle')} className="mt-6 text-[15px] font-semibold text-accent underline underline-offset-4">Send another message</button>
  </div>;

  return <form onSubmit={submit} aria-busy={status === 'sending'} className="grid gap-4">
    <div className="grid gap-4 sm:grid-cols-2">
      <label className={labelCls}>Full name<input name="name" required maxLength={120} autoComplete="name" placeholder="Your name" className={field} /></label>
      <label className={labelCls}>Phone / WhatsApp<input name="phone" type="tel" required minLength={7} maxLength={40} autoComplete="tel" placeholder="+91 …" className={field} /></label>
    </div>
    <label className={labelCls}>Email<input name="email" type="email" required maxLength={254} autoComplete="email" placeholder="you@example.com" className={field} /></label>
    <div className="grid gap-4 sm:grid-cols-2">
      <label className={labelCls}>Interested in<Select name="course" placeholder="Choose a path" options={options} defaultValue={course} /></label>
      <label className={labelCls}>Best time to call<Select name="preferredTime" placeholder="Choose a time" options={TIMES} defaultValue="" /></label>
    </div>
    <label className={labelCls}>{messageLabel} <span className="font-normal text-neutral-400">(optional)</span>
      <textarea name="message" rows={3} maxLength={4000} placeholder={messagePlaceholder} className={`${field} h-auto resize-none py-3`} />
    </label>
    <button type="submit" disabled={status === 'sending'} className="group mt-1 inline-flex h-13 items-center justify-center gap-2.5 rounded-full bg-accent text-base font-semibold text-white shadow-[0_8px_24px_-10px_rgb(47_84_235/0.7)] transition-colors hover:bg-[#2443c8] disabled:opacity-70">
      {status === 'sending' ? <><Loader2 aria-hidden="true" className="size-4 animate-spin" />Sending…</> : <>{submitLabel}<ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" /></>}
    </button>
    {status === 'error' && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
    <p className="text-center text-[13px] text-neutral-500">We&apos;ll only use your details to contact you. <Link href="/privacy-policy" className="underline underline-offset-2 hover:text-ink">Privacy policy</Link></p>
  </form>;
}
