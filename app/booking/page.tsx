import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/layout/page-hero";
import { BookingForm } from "@/components/booking/booking-form";
import { demoImages } from "@/lib/demo-images";

export const metadata: Metadata = {
  title: "Book Your Stay",
  description: "Reserve your room at Lira Grand Hotel in a few simple steps.",
};

export const dynamic = "force-dynamic";

interface BookingPageProps {
  searchParams: Promise<{ roomId?: string }>;
}

export default async function BookingPage({ searchParams }: BookingPageProps) {
  const { roomId } = await searchParams;

  const rooms = await prisma.room.findMany({
    where: { status: "AVAILABLE" },
    include: { images: true, amenities: true },
    orderBy: { pricePerNight: "asc" },
  });

  return (
    <>
      <PageHero
        title="Book Your Stay"
        subtitle="Reserve your room in a few simple steps"
        image={demoImages.roomDeluxe}
      />

      <section className="py-16 sm:py-24">
        <Container className="max-w-3xl">
          {rooms.length === 0 ? (
            <p className="text-center text-brand-charcoal/60">
              No rooms are currently available for booking. Please contact us directly.
            </p>
          ) : (
            <BookingForm rooms={rooms} defaultRoomId={roomId} />
          )}
        </Container>
      </section>
    </>
  );
}
