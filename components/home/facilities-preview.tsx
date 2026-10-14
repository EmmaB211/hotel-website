import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import { getFacilityIcon } from "@/lib/icon-map";

export async function FacilitiesPreview() {
  const facilities = await prisma.facility.findMany({
    where: { isActive: true },
    take: 6,
    orderBy: { createdAt: "asc" },
  });

  if (facilities.length === 0) return null;

  return (
    <section className="py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Facilities & Services"
          title="Everything You Need for a Perfect Stay"
          description="Enjoy a wide range of amenities designed to make your stay relaxing, productive, and memorable."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {facilities.map((facility) => {
            const Icon = getFacilityIcon(facility.icon);
            return (
              <Card key={facility.id} className="p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-brand-charcoal">
                  {facility.name}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-brand-charcoal/70">
                  {facility.description}
                </p>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link href="/facilities" className={buttonVariants({ variant: "outline", size: "lg" })}>
            View All Facilities
          </Link>
        </div>
      </Container>
    </section>
  );
}
