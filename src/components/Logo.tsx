import Image from 'next/image';
import { cn } from '@/lib/cn';

/** The wordmark in both colours; CSS shows the one that suits the background (see .logo-on-* in globals.css). */
export function Logo({ className, priority }: { className?: string; priority?: boolean }) {
  return <>
    <Image src="/tinitiate-logo-transparent.png" width={2001} height={269} alt="Tinitiate AI" priority={priority} className={cn('logo-on-light block h-auto', className)} />
    <Image src="/masterclasses/tinitiate_header-banner.png" width={1261} height={132} alt="Tinitiate AI" priority={priority} className={cn('logo-on-dark h-auto', className)} />
  </>;
}
