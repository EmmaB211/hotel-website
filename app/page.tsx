import { Hero } from "@/components/home/hero";
import { AboutSection } from "@/components/home/about-section";
import { FeaturedRooms } from "@/components/home/featured-rooms";
import { FacilitiesPreview } from "@/components/home/facilities-preview";
import { OffersSection } from "@/components/home/offers-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { CtaSection } from "@/components/home/cta-section";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutSection />
      <FeaturedRooms />
      <FacilitiesPreview />
      <OffersSection />
      <TestimonialsSection />
      <CtaSection />
    </>
  );
}
