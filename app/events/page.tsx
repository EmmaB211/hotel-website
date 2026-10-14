import type { Metadata } from "next";
import Image from "next/image";
import { Users, Check } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { PageHero } from "@/components/layout/page-hero";
import { Card } from "@/components/ui/card";
import { EventQuoteForm } from "@/components/events/event-quote-form";
import { demoImages } from "@/lib/demo-images";

export const metadata: Metadata = {
  title: "Conference & Events",
  description: "Host your conference or event at Lira Grand Hotel's fully-equipped halls.",
};

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const halls = await prisma.conferenceHall.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <>
      <PageHero
        title="Conference & Events"
        subtitle="Fully-equipped venues for meetings, conferences, and celebrations"
        image={demoImages.conference}
      />

      <section className="py-16 sm:py-24">
        <Container>
          <SectionHeading eyebrow="Our Venues" title="Conference Halls & Event Spaces" />

          <div className="mt-14 grid gap-8 sm:grid-cols-2">
            {halls.map((hall) => (
              <Card key={hall.id} className="overflow-hidden">
                {hall.image && (
                  <div className="relative h-56 w-full">
                    <Image src={hall.image} alt={hall.name} fill sizes="50vw" className="object-cover" />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="font-display text-xl font-semibold text-brand-charcoal">{hall.name}</h3>
                  <p className="mt-2 text-sm text-brand-charcoal/70">{hall.description}</p>
                  <p className="mt-3 flex items-center gap-1.5 text-sm font-medium text-brand-primary">
                    <Users className="h-4 w-4" /> Up to {hall.capacity} guests
                  </p>
                  {hall.equipment.length > 0 && (
                    <ul className="mt-4 grid grid-cols-2 gap-1.5 text-xs text-brand-charcoal/70">
                      {hall.equipment.map((item) => (
                        <li key={item} className="flex items-center gap-1.5">
                          <Check className="h-3.5 w-3.5 text-brand-secondary" /> {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {halls.length === 0 && (
            <p className="mt-10 text-center text-brand-charcoal/60">
              Conference hall information coming soon.
            </p>
          )}
        </Container>
      </section>

      <section className="bg-brand-cream py-16 sm:py-24">
        <Container className="max-w-2xl">
          <SectionHeading
            eyebrow="Plan Your Event"
            title="Request a Quote"
            description="Tell us about your event and our team will send you a tailored proposal."
          />
          <div className="mt-10 rounded-2xl bg-white p-8 shadow-sm">
            <EventQuoteForm />
          </div>
        </Container>
      </section>
    </>
  );
}
