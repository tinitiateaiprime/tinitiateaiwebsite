import { HomeHero } from '@/components/home/hero/HomeHero';
import { TrustStrip } from '@/components/home/TrustStrip';
import { PathsSection } from '@/components/home/courses/PathsSection';
import { JourneySection } from '@/components/home/journey/JourneySection';
import { WhyChooseSection } from '@/components/home/why/WhyChooseSection';
import { CampusSection } from '@/components/home/campus/CampusSection';
import { FaqSection } from '@/components/home/faq/FaqSection';

/**
 * Order follows the visitor's questions: what is this and is it for me (hero,
 * facts) → which path (paths) → how does it work (steps) → why you (benefits,
 * campus) → last doubts + the form (FAQ).
 */
export default function HomePage() {
  return <>
    <HomeHero />
    <TrustStrip />
    <PathsSection />
    <JourneySection />
    <WhyChooseSection />
    <CampusSection />
    <FaqSection />
  </>;
}
