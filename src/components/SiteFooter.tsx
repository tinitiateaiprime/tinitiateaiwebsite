import Link from 'next/link';
export function SiteFooter() {
  return <footer className="border-t border-slate-800 bg-slate-950 text-slate-300">
    <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 sm:grid-cols-3">
      <div><h2 className="text-xl font-bold text-white">Tinitiate AI</h2><p className="mt-3 text-sm leading-6">Practical courses and interactive MasterClasses for developers, data professionals, and technology teams.</p></div>
      <div><h3 className="font-semibold text-white">Explore</h3><nav className="mt-3 flex flex-col gap-2 text-sm"><Link href="/courses">Courses</Link><Link href="/masterclasses">MasterClasses</Link><Link href="/training">Training</Link><Link href="/services">Services</Link></nav></div>
      <div><h3 className="font-semibold text-white">Get in touch</h3><p className="mt-3 text-sm">Questions about a course or partnership?</p><Link className="mt-3 inline-block rounded-full bg-white px-5 py-2 font-semibold text-blue-800" href="/request-callback">Send an enquiry</Link></div>
    </div><div className="border-t border-slate-800 px-5 py-5 text-center text-xs">© {new Date().getFullYear()} Tinitiate AI. All rights reserved.</div>
  </footer>;
}
