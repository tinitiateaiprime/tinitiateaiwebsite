import { HomeHero } from '@/components/home/hero/HomeHero';
import { FeatureTiles } from '@/components/home/FeatureTiles';
import { RoleShowcase } from '@/components/home/hero/RoleShowcase';
import { PopularCourses } from '@/components/home/courses/PopularCourses';
import { PathsSection } from '@/components/home/courses/PathsSection';
import { TrainingServices } from '@/components/home/services/TrainingServices';
import { WhyChooseSection } from '@/components/home/why/WhyChooseSection';
import { DomainsSection } from '@/components/home/domains/DomainsSection';
import { ToolsMarquee } from '@/components/home/ToolsMarquee';
import { FounderNote } from '@/components/home/FounderNote';
import { CampusSection } from '@/components/home/campus/CampusSection';
import { FaqSection } from '@/components/home/faq/FaqSection';

/**
 * A bright, catalogue-style homepage: hero with course search → what you get →
 * pick a job and watch what you'll build →
 * courses by category → career paths → how we train → why us (numbers) →
 * domains → tools → who is behind it (CEO note, campus visit) → FAQ + form.
 */
export default function HomePage() {
  return <>
    <HomeHero />
    <FeatureTiles />
    <RoleShowcase />
    <PopularCourses />
    <PathsSection />
    <TrainingServices />
    <WhyChooseSection />
    <DomainsSection />
    <ToolsMarquee />
    <FounderNote />
    <CampusSection />
    <FaqSection />
  </>;
}
