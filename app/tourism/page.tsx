import type { Metadata } from "next";
import Image from "next/image";
import { MapPin, Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { PageHero } from "@/components/layout/page-hero";
import { Card } from "@/components/ui/card";
import { demoImages } from "@/lib/demo-images";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Tourism in Lira",
  description: "Explore tourist attractions, culture, and nature around Lira City, Uganda.",
};

export const dynamic = "force-dynamic";

export default async function TourismPage() {
  const attractions = await prisma.touristAttraction.findMany({
    orderBy: { createdAt: "asc" },
  });

  return (
    <>
      <PageHero
        title="Tourism in Lira"
        subtitle="Discover the culture, nature, and history of Northern Uganda"
        image={demoImages.tourismNature}
      />

      <section className="py-16 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Explore Lira City"
            title="Attractions & Experiences Nearby"
            description="Placeholder content — replace with verified attraction details once confirmed by hotel management."
          />

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {attractions.map((attraction) => (
              <Card key={attraction.id} className="overflow-hidden">
                {attraction.image && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={attraction.image}
                      alt={attraction.name}
                      fill
                      sizes="33vw"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="font-display text-lg font-semibold text-brand-charcoal">
                    {attraction.name}
                  </h3>
                  <p className="mt-2 text-sm text-brand-charcoal/70">{attraction.description}</p>
                  <div className="mt-4 space-y-1.5 text-xs text-brand-charcoal/60">
                    <p className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" /> {attraction.location}
                      {attraction.distanceFromHotel ? ` — ${attraction.distanceFromHotel}` : ""}
                    </p>
                    {attraction.travelTime && (
                      <p className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" /> {attraction.travelTime} from hotel
                      </p>
                    )}
                  </div>
                  {attraction.thingsToDo.length > 0 && (
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {attraction.thingsToDo.map((thing) => (
                        <li
                          key={thing}
                          className="rounded-full bg-brand-primary/10 px-2.5 py-1 text-[11px] font-medium text-brand-primary"
                        >
                          {thing}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {attractions.length === 0 && (
            <p className="mt-10 text-center text-brand-charcoal/60">
              Tourism content coming soon — check back for updates.
            </p>
          )}
        </Container>
      </section>

      <section className="pb-20">
        <Container>
          <div className="overflow-hidden rounded-2xl border border-black/5 shadow-sm">
            <iframe
              title="Map showing Lira City and surroundings"
              src={siteConfig.googleMapsEmbedSrc}
              className="h-96 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </Container>
      </section>
    </>
  );
}
