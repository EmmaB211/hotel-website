import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { SectionHeading } from "@/components/ui/section-heading";
import { RoomCard } from "@/components/rooms/room-card";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export async function FeaturedRooms() {
  const rooms = await prisma.room.findMany({
    where: { status: "AVAILABLE" },
    include: { images: { orderBy: { position: "asc" } }, amenities: true },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "asc" }],
    take: 3,
  });

  if (rooms.length === 0) return null;

  return (
    <section className="bg-brand-cream py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Accommodation"
          title="Rooms Designed for Comfort"
          description="From cozy standard rooms to spacious suites, each room blends modern comfort with warm African hospitality."
        />

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/rooms" className={buttonVariants({ variant: "primary", size: "lg" })}>
            View All Rooms
          </Link>
        </div>
      </Container>
    </section>
  );
}
