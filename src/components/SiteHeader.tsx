import Link from 'next/link';
import Image from 'next/image';
const navigation = [
  { href:'/', label:'Home' },
  { href:'/courses', label:'Courses' },
  { href:'/masterclasses', label:'MasterClasses' },
  { href:'/training', label:'Training' },
  { href:'/services', label:'Services' },
  { href:'/company', label:'Company' },
  { href:'/contact', label:'Contact' },
];
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4">
        <Link href="/" className="flex shrink-0 items-center gap-2 text-xl font-black tracking-tight text-slate-950" aria-label="Tinitiate AI homepage">
          <Image src="/tinitiate-logo.png" width={260} height={80} alt="Tinitiate AI" priority className="block h-auto max-h-[64px] w-[220px] object-contain sm:w-[260px]" />
          
        </Link>
        <nav className="hidden flex-wrap items-center gap-5 lg:flex" aria-label="Main navigation">
          {navigation.map(({href,label})=><Link className="text-sm font-semibold text-slate-700 transition hover:text-blue-700" href={href} key={href}>{label}</Link>)}
        </nav>
        <div className="hidden items-center gap-3 lg:flex"><Link href="/request-callback" className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">Enquire Now</Link></div>
        <details className="relative lg:hidden"><summary className="cursor-pointer rounded-md border px-3 py-2 text-sm font-semibold">Menu</summary>
          <nav className="absolute right-0 top-full mt-2 flex w-56 flex-col rounded-xl border bg-white p-3 shadow-xl" aria-label="Mobile navigation">
            {navigation.map(({href,label})=><Link key={href} href={href} className="rounded-md px-3 py-2 text-sm hover:bg-blue-50">{label}</Link>)}
            <Link href="/request-callback" className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white">Enquire Now</Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
