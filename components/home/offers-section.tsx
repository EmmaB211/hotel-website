import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";

export async function OffersSection() {
  const offers = await prisma.specialOffer.findMany({
    where: { isActive: true, validTo: { gte: new Date() } },
    orderBy: { validFrom: "asc" },
    take: 3,
  });

  if (offers.length === 0) return null;

  return (
    <section className="py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Special Offers"
          title="Packages Made For You"
          description="Take advantage of limited-time packages designed for couples, families, and business travelers."
        />

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {offers.map((offer) => (
            <Card key={offer.id} className="overflow-hidden">
              {offer.image && (
                <div className="relative h-48 w-full">
                  <Image src={offer.image} alt={offer.title} fill sizes="33vw" className="object-cover" />
                </div>
              )}
              <div className="p-6">
                <h3 className="font-display text-lg font-semibold text-brand-charcoal">{offer.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-brand-charcoal/70">{offer.description}</p>

                <div className="mt-4 flex items-center gap-2">
                  {offer.discountedPrice && (
                    <span className="font-display text-xl font-bold text-brand-primary">
                      {formatCurrency(offer.discountedPrice.toString(), offer.currency)}
                    </span>
                  )}
                  {offer.originalPrice && (
                    <span className="text-sm text-brand-charcoal/40 line-through">
                      {formatCurrency(offer.originalPrice.toString(), offer.currency)}
                    </span>
                  )}
                </div>

                <Badge variant="accent" className="mt-3">
                  Valid until {formatDate(offer.validTo)}
                </Badge>

                <Link
                  href="/contact"
                  className={buttonVariants({ variant: "primary", size: "md" }) + " mt-5 w-full"}
                >
                  Claim Offer
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
