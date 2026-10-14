import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/rooms",
    "/facilities",
    "/restaurant",
    "/gallery",
    "/tourism",
    "/events",
    "/about",
    "/contact",
    "/booking",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
  }));

  let roomRoutes: MetadataRoute.Sitemap = [];
  try {
    const rooms = await prisma.room.findMany({ select: { slug: true, updatedAt: true } });
    roomRoutes = rooms.map((room) => ({
      url: `${baseUrl}/rooms/${room.slug}`,
      lastModified: room.updatedAt,
    }));
  } catch {
    // Database unavailable at build time — sitemap will still include static routes.
  }

  return [...staticRoutes, ...roomRoutes];
}
