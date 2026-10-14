import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookingTrendsChart } from "@/components/admin/booking-trends-chart";

export default async function AdminDashboardPage() {
  const now = new Date();

  const [
    totalBookings,
    pendingBookings,
    confirmedBookings,
    cancelledBookings,
    totalRooms,
    revenueAgg,
    recentBookings,
    popularRoomsRaw,
    trendRaw,
  ] = await Promise.all([
    prisma.booking.count(),
    prisma.booking.count({ where: { status: "PENDING" } }),
    prisma.booking.count({ where: { status: "CONFIRMED" } }),
    prisma.booking.count({ where: { status: "CANCELLED" } }),
    prisma.room.count(),
    prisma.booking.aggregate({
      _sum: { totalAmount: true },
      where: { status: { in: ["CONFIRMED", "CHECKED_IN", "COMPLETED"] } },
    }),
    prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { room: true, guest: true },
    }),
    prisma.booking.groupBy({
      by: ["roomId"],
      _count: { roomId: true },
      orderBy: { _count: { roomId: "desc" } },
      take: 5,
    }),
    prisma.booking.findMany({
      where: { createdAt: { gte: new Date(now.getTime() - 13 * 24 * 60 * 60 * 1000) } },
      select: { createdAt: true },
    }),
  ]);

  const occupiedRoomIds = await prisma.booking.findMany({
    where: {
      status: { in: ["CONFIRMED", "CHECKED_IN"] },
      checkIn: { lte: now },
      checkOut: { gt: now },
    },
    select: { roomId: true },
    distinct: ["roomId"],
  });

  const popularRooms = await Promise.all(
    popularRoomsRaw.map(async (r) => {
      const room = await prisma.room.findUnique({ where: { id: r.roomId } });
      return { name: room?.name || "Unknown", bookings: r._count.roomId };
    })
  );

  const trendMap = new Map<string, number>();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    trendMap.set(d.toISOString().split("T")[0], 0);
  }
  for (const b of trendRaw) {
    const key = b.createdAt.toISOString().split("T")[0];
    if (trendMap.has(key)) trendMap.set(key, (trendMap.get(key) || 0) + 1);
  }
  const trendData = Array.from(trendMap.entries()).map(([date, count]) => ({ date, count }));

  const stats = [
    { label: "Total Bookings", value: totalBookings },
    { label: "Pending", value: pendingBookings },
    { label: "Confirmed", value: confirmedBookings },
    { label: "Cancelled", value: cancelledBookings },
    { label: "Total Rooms", value: totalRooms },
    { label: "Occupied Rooms", value: occupiedRoomIds.length },
    { label: "Available Rooms", value: Math.max(0, totalRooms - occupiedRoomIds.length) },
    { label: "Est. Revenue", value: formatCurrency(revenueAgg._sum.totalAmount?.toString() || "0") },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-brand-charcoal">Dashboard</h1>
        <p className="text-sm text-brand-charcoal/60">Overview of bookings and hotel performance.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-brand-charcoal/50">
              {stat.label}
            </p>
            <p className="mt-2 font-display text-2xl font-bold text-brand-charcoal">{stat.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <h2 className="font-display text-lg font-semibold text-brand-charcoal">Booking Trends (14 days)</h2>
          <div className="mt-4 h-64">
            <BookingTrendsChart data={trendData} />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-display text-lg font-semibold text-brand-charcoal">Popular Rooms</h2>
          <ul className="mt-4 space-y-3">
            {popularRooms.map((r) => (
              <li key={r.name} className="flex items-center justify-between text-sm">
                <span className="text-brand-charcoal/80">{r.name}</span>
                <Badge variant="primary">{r.bookings} bookings</Badge>
              </li>
            ))}
            {popularRooms.length === 0 && (
              <p className="text-sm text-brand-charcoal/50">No booking data yet.</p>
            )}
          </ul>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-brand-charcoal">Recent Bookings</h2>
          <Link href="/admin/bookings" className="text-sm font-medium text-brand-primary">
            View all
          </Link>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase text-brand-charcoal/50">
              <tr>
                <th className="pb-2">Reference</th>
                <th className="pb-2">Guest</th>
                <th className="pb-2">Room</th>
                <th className="pb-2">Check-in</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {recentBookings.map((b) => (
                <tr key={b.id}>
                  <td className="py-2.5 font-medium">{b.reference}</td>
                  <td className="py-2.5">{b.guest.fullName}</td>
                  <td className="py-2.5">{b.room.name}</td>
                  <td className="py-2.5">{formatDate(b.checkIn)}</td>
                  <td className="py-2.5">
                    <Badge variant={b.status === "CANCELLED" ? "danger" : "success"}>{b.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {recentBookings.length === 0 && (
            <p className="py-4 text-center text-sm text-brand-charcoal/50">No bookings yet.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
