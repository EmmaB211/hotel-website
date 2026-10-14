import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { isRoomAvailable } from "@/lib/booking";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { RoomCard } from "@/components/rooms/room-card";
import { PageHero } from "@/components/layout/page-hero";
import { demoImages } from "@/lib/demo-images";

export const metadata: Metadata = {
  title: "Rooms & Accommodation",
  description: "Explore our range of comfortable rooms and suites in Lira City, Uganda.",
};

export const dynamic = "force-dynamic";

interface RoomsPageProps {
  searchParams: Promise<{
    checkIn?: string;
    checkOut?: string;
    numRooms?: string;
  }>;
}

export default async function RoomsPage({ searchParams }: RoomsPageProps) {
  const params = await searchParams;

  const rooms = await prisma.room.findMany({
    include: { images: { orderBy: { position: "asc" } }, amenities: true },
    orderBy: { pricePerNight: "asc" },
  });

  let availabilityMap: Record<string, boolean> | null = null;

  if (params.checkIn && params.checkOut) {
    const checkIn = new Date(params.checkIn);
    const checkOut = new Date(params.checkOut);
    const numRooms = Number(params.numRooms) || 1;

    if (!Number.isNaN(checkIn.getTime()) && !Number.isNaN(checkOut.getTime()) && checkOut > checkIn) {
      availabilityMap = {};
      for (const room of rooms) {
        availabilityMap[room.id] = await isRoomAvailable(room.id, checkIn, checkOut, numRooms);
      }
    }
  }

  return (
    <>
      <PageHero
        title="Rooms & Accommodation"
        subtitle="Elegant rooms designed for comfort, rest, and productivity"
        image={demoImages.roomSuite}
      />

      <section className="py-16 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Choose Your Stay"
            title="Rooms Built for Every Traveler"
            description="From Standard to Suite, every room includes modern comfort, warm hospitality, and thoughtful details."
          />

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room) => {
              const isAvailable = availabilityMap ? availabilityMap[room.id] : room.status === "AVAILABLE";
              return (
                <div key={room.id} className={isAvailable ? "" : "opacity-60"}>
                  <RoomCard room={room} />
                  {availabilityMap && !isAvailable && (
                    <p className="mt-2 text-center text-xs font-medium text-red-600">
                      Not available for selected dates
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {rooms.length === 0 && (
            <p className="mt-10 text-center text-brand-charcoal/60">
              No rooms are currently listed. Please check back soon.
            </p>
          )}
        </Container>
      </section>
    </>
  );
}
