import { HeroSection } from '@/components/landing/hero-section';
import { TrustBar } from '@/components/landing/trust-bar';
import { HowItWorks } from '@/components/landing/how-it-works';
import { FeaturesSection } from '@/components/landing/features-section';
import { PreviewSection } from '@/components/landing/preview-section';
import { IndustriesSection } from '@/components/landing/industries-section';
import { TestimonialsSection } from '@/components/landing/testimonials-section';
import { CtaSection } from '@/components/landing/cta-section';

export default function HomePage() {
  return (
    <div className="relative flex flex-col">
      <HeroSection />
      <TrustBar />
      <HowItWorks />
      <FeaturesSection />
      <PreviewSection />
      <IndustriesSection />
      <TestimonialsSection />
      <CtaSection />
    </div>
  );
}
