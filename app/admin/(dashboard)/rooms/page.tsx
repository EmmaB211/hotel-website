import { prisma } from "@/lib/prisma";
import { RoomsManager } from "@/components/admin/rooms-manager";

export default async function AdminRoomsPage() {
  const rooms = await prisma.room.findMany({
    include: { images: true, amenities: true },
    orderBy: { createdAt: "desc" },
  });

  return <RoomsManager initialRooms={rooms} />;
}
