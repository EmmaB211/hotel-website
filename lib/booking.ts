import { prisma } from "@/lib/prisma";
import { generateBookingReference } from "@/lib/utils";

/**
 * Returns how many units of a room are already booked for a date range that
 * overlaps with the requested range (excluding cancelled bookings).
 */
export async function getBookedUnits(roomId: string, checkIn: Date, checkOut: Date) {
  const overlapping = await prisma.booking.findMany({
    where: {
      roomId,
      status: { not: "CANCELLED" },
      checkIn: { lt: checkOut },
      checkOut: { gt: checkIn },
    },
    select: { numRooms: true },
  });

  return overlapping.reduce((sum, b) => sum + b.numRooms, 0);
}

export async function isRoomAvailable(
  roomId: string,
  checkIn: Date,
  checkOut: Date,
  numRoomsRequested: number
) {
  const room = await prisma.room.findUnique({ where: { id: roomId } });
  if (!room || room.status !== "AVAILABLE") return false;

  const bookedUnits = await getBookedUnits(roomId, checkIn, checkOut);
  return bookedUnits + numRoomsRequested <= room.totalUnits;
}

/** Generates the next sequential booking reference, e.g. LIRA-2026-000123 */
export async function nextBookingReference() {
  const year = new Date().getFullYear();
  const count = await prisma.booking.count({
    where: { reference: { startsWith: `LIRA-${year}-` } },
  });
  return generateBookingReference(count + 1);
}
