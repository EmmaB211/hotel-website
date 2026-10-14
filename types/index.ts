import type { Prisma } from "@prisma/client";

export type RoomWithRelations = Prisma.RoomGetPayload<{
  include: { images: true; amenities: true };
}>;

export type FacilityWithImages = Prisma.FacilityGetPayload<{
  include: { images: true };
}>;

export type BookingWithRelations = Prisma.BookingGetPayload<{
  include: { room: true; guest: true };
}>;
