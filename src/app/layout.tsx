import type { Metadata } from 'next';
import { Geist_Mono, Instrument_Sans } from 'next/font/google';
import './globals.css';

const sans = Instrument_Sans({ subsets: ['latin'], variable: '--font-instrument', display: 'swap' });
const mono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono', display: 'swap' });
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

export const metadata: Metadata = {
  title: { default: 'Tinitiate AI — Courses & MasterClasses', template: '%s | Tinitiate AI' },
  description: 'Explore practical IT, software engineering, cloud, data, and AI courses and interactive MasterClasses.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body className="flex min-h-screen flex-col bg-white text-slate-900 antialiased">
        <SiteHeader />
        <main id="main-content" tabIndex={-1} className="min-w-0 flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
