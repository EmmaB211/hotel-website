import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/layout/page-hero";
import { GalleryGrid } from "@/components/gallery/gallery-grid";
import { demoImages } from "@/lib/demo-images";

export const metadata: Metadata = {
  title: "Photo Gallery",
  description: "Browse photos of Lira Grand Hotel — rooms, restaurant, pool, events, and more.",
};

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const images = await prisma.galleryImage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <PageHero title="Photo Gallery" subtitle="A visual tour of Lira Grand Hotel" image={demoImages.garden} />

      <section className="py-16 sm:py-24">
        <Container>
          <GalleryGrid images={images} />
        </Container>
      </section>
    </>
  );
}
