import type { Metadata } from "next";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { PageHero } from "@/components/layout/page-hero";
import { getFacilityIcon } from "@/lib/icon-map";
import { demoImages } from "@/lib/demo-images";

export const metadata: Metadata = {
  title: "Facilities & Services",
  description: "Discover the facilities and services available at Lira Grand Hotel.",
};

export const dynamic = "force-dynamic";

export default async function FacilitiesPage() {
  const facilities = await prisma.facility.findMany({
    where: { isActive: true },
    include: { images: { orderBy: { position: "asc" } } },
    orderBy: { createdAt: "asc" },
  });

  return (
    <>
      <PageHero
        title="Facilities & Services"
        subtitle="Everything you need for a relaxing and productive stay"
        image={demoImages.pool}
      />

      <section className="py-16 sm:py-24">
        <Container>
          {facilities.length === 0 ? (
            <p className="text-center text-brand-charcoal/60">Facility information coming soon.</p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {facilities.map((facility) => {
                const Icon = getFacilityIcon(facility.icon);
                const image = facility.images[0]?.url;
                return (
                  <Card key={facility.id} className="overflow-hidden">
                    {image && (
                      <div className="relative h-48 w-full">
                        <Image src={image} alt={facility.name} fill sizes="33vw" className="object-cover" />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-3 font-display text-lg font-semibold text-brand-charcoal">
                        {facility.name}
                      </h3>
                      <p className="mt-2 text-sm text-brand-charcoal/70">{facility.description}</p>
                      {facility.openingHours && (
                        <p className="mt-3 text-xs font-medium uppercase tracking-wide text-brand-secondary">
                          {facility.openingHours}
                        </p>
                      )}
                      {facility.additionalInfo && (
                        <p className="mt-2 text-xs text-brand-charcoal/50">{facility.additionalInfo}</p>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
