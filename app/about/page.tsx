import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { demoImages } from "@/lib/demo-images";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/layout/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About Us",
  description: `Learn more about ${siteConfig.name}, a premium hotel in Lira City, Uganda.`,
};

const values = [
  { title: "Hospitality", description: "Warm, personal service rooted in African tradition." },
  { title: "Comfort", description: "Thoughtfully designed rooms and spaces for genuine rest." },
  { title: "Trust", description: "Reliable service, transparent pricing, and guest safety." },
  { title: "Community", description: "Proudly showcasing the culture and tourism of Lira City." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero title="About Us" subtitle="Our story, our values, our commitment to you" image={demoImages.lobby} />

      <section className="py-16 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="relative h-80 overflow-hidden rounded-2xl sm:h-96">
            <Image src={demoImages.heroExterior} alt={siteConfig.name} fill sizes="50vw" className="object-cover" />
          </div>
          <div>
            <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary">
              Our Story
            </span>
            <h2 className="font-display text-3xl font-semibold text-brand-charcoal">
              Serving Lira City Since {siteConfig.yearEstablished}
            </h2>
            <p className="mt-4 leading-relaxed text-brand-charcoal/70">{siteConfig.description}</p>
            <p className="mt-4 leading-relaxed text-brand-charcoal/70">
              With {siteConfig.totalRooms} well-appointed rooms and {siteConfig.totalFacilities} facilities,
              we combine modern comfort with genuine Northern Ugandan hospitality — welcoming business
              travelers, tourists, and families alike.
            </p>
            <Link href="/rooms" className={buttonVariants({ variant: "primary", size: "lg" }) + " mt-6"}>
              Explore Our Rooms
            </Link>
          </div>
        </Container>
      </section>

      <section className="bg-brand-cream py-16 sm:py-24">
        <Container>
          <SectionHeading eyebrow="What We Stand For" title="Our Values" />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div key={value.title} className="rounded-2xl bg-white p-6 text-center shadow-sm">
                <h3 className="font-display text-lg font-semibold text-brand-charcoal">{value.title}</h3>
                <p className="mt-2 text-sm text-brand-charcoal/70">{value.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
