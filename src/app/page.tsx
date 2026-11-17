import { HomeHero } from '@/components/home/hero/HomeHero';
import { JourneySection } from '@/components/home/journey/JourneySection';
import { CoursesSection } from '@/components/home/courses/CoursesSection';
import { CampusSection } from '@/components/home/campus/CampusSection';
import { WhyChooseSection } from '@/components/home/why/WhyChooseSection';
import { FaqSection } from '@/components/home/faq/FaqSection';

export default function HomePage() {
  return <>
    <HomeHero />
    <JourneySection />
    <CoursesSection />
    <CampusSection />
    <WhyChooseSection />
    <FaqSection />
  </>;
}
