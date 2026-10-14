import { prisma } from "@/lib/prisma";
import { BookingsManager } from "@/components/admin/bookings-manager";

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    include: { room: true, guest: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return <BookingsManager initialBookings={bookings} />;
}
