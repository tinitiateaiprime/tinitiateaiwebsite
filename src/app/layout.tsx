import type { Metadata } from 'next';
import { Caveat, Geist_Mono, Instrument_Sans } from 'next/font/google';
import './globals.css';

const sans = Instrument_Sans({ subsets: ['latin'], variable: '--font-instrument', display: 'swap' });
const mono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono', display: 'swap' });
const hand = Caveat({ subsets: ['latin'], weight: ['500', '700'], variable: '--font-caveat', display: 'swap' });
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { CtaBand, MobileCtaBar } from '@/components/ConversionBar';
import { themeScript } from '@/components/ThemeToggle';

export const metadata: Metadata = {
  title: { default: 'Tinitiate AI — Live, Mentor-Led Training in AI, Cloud, Data & Full Stack', template: '%s | Tinitiate AI' },
  description: 'Become job-ready in AI, Cloud, Data Engineering or Full Stack development. Live online classes with industry mentors, real projects and interview preparation. Your first 2 sessions are free.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} ${hand.variable}`} suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
      <body className="flex min-h-screen flex-col bg-surface text-ink antialiased">
        <SiteHeader />
        <main id="main-content" tabIndex={-1} className="min-w-0 flex-1">{children}</main>
        <CtaBand />
        <SiteFooter />
        <MobileCtaBar />
      </body>
    </html>
  );
}
