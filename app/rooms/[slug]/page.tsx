import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Users, BedDouble, Maximize, Check } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/ui/container";
import { RoomGallery } from "@/components/rooms/room-gallery";
import { RoomCard } from "@/components/rooms/room-card";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

interface RoomDetailPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

async function getRoom(slug: string) {
  return prisma.room.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { position: "asc" } },
      amenities: true,
    },
  });
}

export async function generateMetadata({ params }: RoomDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const room = await getRoom(slug);
  if (!room) return { title: "Room Not Found" };

  return {
    title: room.name,
    description: room.shortSummary || room.description,
    openGraph: {
      title: `${room.name} | ${siteConfig.name}`,
      description: room.shortSummary || room.description,
      images: room.images[0] ? [room.images[0].url] : undefined,
    },
  };
}

export default async function RoomDetailPage({ params }: RoomDetailPageProps) {
  const { slug } = await params;
  const room = await getRoom(slug);
  if (!room) notFound();

  const similarRooms = await prisma.room.findMany({
    where: { category: room.category, id: { not: room.id } },
    include: { images: { orderBy: { position: "asc" } }, amenities: true },
    take: 3,
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: room.name,
    description: room.description,
    image: room.images[0]?.url,
    offers: {
      "@type": "Offer",
      price: room.pricePerNight.toString(),
      priceCurrency: room.currency,
      availability:
        room.status === "AVAILABLE" ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
    },
  };

  return (
    <>
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="py-12 sm:py-16">
        <Container className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-primary">
              {room.category}
            </p>
            <h1 className="mt-1 font-display text-3xl font-bold text-brand-charcoal sm:text-4xl">
              {room.name}
            </h1>

            <div className="mt-4 flex flex-wrap gap-4 text-sm text-brand-charcoal/70">
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4" /> {room.maxAdults} Adults
                {room.maxChildren ? ` + ${room.maxChildren} Children` : ""}
              </span>
              <span className="flex items-center gap-1.5">
                <BedDouble className="h-4 w-4" /> {room.bedType}
              </span>
              {room.sizeSqm && (
                <span className="flex items-center gap-1.5">
                  <Maximize className="h-4 w-4" /> {room.sizeSqm} m&sup2;
                </span>
              )}
              {room.status !== "AVAILABLE" && <Badge variant="warning">Currently Unavailable</Badge>}
            </div>

            <div className="mt-8">
              <RoomGallery images={room.images} roomName={room.name} />
            </div>

            <div className="mt-10">
              <h2 className="font-display text-2xl font-semibold text-brand-charcoal">Description</h2>
              <p className="mt-3 leading-relaxed text-brand-charcoal/75">{room.description}</p>
            </div>

            {room.amenities.length > 0 && (
              <div className="mt-10">
                <h2 className="font-display text-2xl font-semibold text-brand-charcoal">Amenities</h2>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {room.amenities.map((amenity) => (
                    <div key={amenity.id} className="flex items-center gap-2 text-sm text-brand-charcoal/80">
                      <Check className="h-4 w-4 text-brand-secondary" />
                      {amenity.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-3xl font-bold text-brand-charcoal">
                  {formatCurrency(room.pricePerNight.toString(), room.currency)}
                </span>
                <span className="text-sm text-brand-charcoal/60">/ night</span>
              </div>
              <p className="mt-2 text-sm text-brand-charcoal/60">
                Taxes and service charges may apply. Prices subject to availability.
              </p>
              <Link
                href={`/booking?roomId=${room.id}`}
                className={cn(buttonVariants({ variant: "accent", size: "lg" }), "mt-6 w-full")}
              >
                Reserve This Room
              </Link>
              <a
                href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
                  `Hello, I would like to enquire about the ${room.name} at ${siteConfig.name}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "mt-3 w-full")}
              >
                Ask on WhatsApp
              </a>
            </div>
          </aside>
        </Container>

        {similarRooms.length > 0 && (
          <Container className="mt-20">
            <h2 className="font-display text-2xl font-semibold text-brand-charcoal">Similar Rooms</h2>
            <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {similarRooms.map((r) => (
                <RoomCard key={r.id} room={r} />
              ))}
            </div>
          </Container>
        )}
      </div>
    </>
  );
}
