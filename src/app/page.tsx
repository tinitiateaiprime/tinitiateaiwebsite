import { HomeHero } from '@/components/home/hero/HomeHero';
import { TrustStrip } from '@/components/home/TrustStrip';
import { PathsSection } from '@/components/home/courses/PathsSection';
import { JourneySection } from '@/components/home/journey/JourneySection';
import { WhyChooseSection } from '@/components/home/why/WhyChooseSection';
import { FounderNote } from '@/components/home/FounderNote';
import { CampusSection } from '@/components/home/campus/CampusSection';
import { FaqSection } from '@/components/home/faq/FaqSection';

/**
 * Order follows the visitor's questions: what is this and is it for me (hero,
 * facts) → which path → how does it work → what else do I get → who is behind
 * it (CEO note, campus visit) → last doubts + the form. Light and dark sections
 * alternate: paths, benefits and campus are the dark ones.
 */
export default function HomePage() {
  return <>
    <HomeHero />
    <TrustStrip />
    <PathsSection />
    <JourneySection />
    <WhyChooseSection />
    <FounderNote />
    <CampusSection />
    <FaqSection />
  </>;
}
