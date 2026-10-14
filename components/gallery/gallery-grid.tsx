"use client";

import * as React from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface GalleryImageItem {
  id: string;
  url: string;
  alt: string | null;
  category: string;
}

const categoryLabels: Record<string, string> = {
  HOTEL: "Hotel",
  ROOMS: "Rooms",
  RESTAURANT: "Restaurant",
  SWIMMING_POOL: "Swimming Pool",
  GYM: "Gym",
  EVENTS: "Events",
  CONFERENCE: "Conference",
  GARDEN: "Garden",
  SURROUNDINGS: "Surroundings",
  TOURISM: "Tourism",
};

export function GalleryGrid({ images }: { images: GalleryImageItem[] }) {
  const categories = ["ALL", ...Array.from(new Set(images.map((i) => i.category)))];
  const [activeCategory, setActiveCategory] = React.useState("ALL");
  const [lightboxImage, setLightboxImage] = React.useState<GalleryImageItem | null>(null);

  const filtered =
    activeCategory === "ALL" ? images : images.filter((i) => i.category === activeCategory);

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              activeCategory === cat
                ? "bg-brand-primary text-white"
                : "bg-black/5 text-brand-charcoal/70 hover:bg-black/10"
            )}
          >
            {cat === "ALL" ? "All" : categoryLabels[cat] || cat}
          </button>
        ))}
      </div>

      <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3">
        {filtered.map((image) => (
          <button
            key={image.id}
            onClick={() => setLightboxImage(image)}
            className="relative mb-4 block w-full overflow-hidden rounded-xl break-inside-avoid"
          >
            <Image
              src={image.url}
              alt={image.alt || "Hotel gallery photo"}
              width={600}
              height={450}
              sizes="(max-width: 768px) 100vw, 33vw"
              className="w-full object-cover transition-transform duration-500 hover:scale-105"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-10 text-center text-brand-charcoal/60">No photos in this category yet.</p>
      )}

      {lightboxImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
        >
          <button
            onClick={() => setLightboxImage(null)}
            aria-label="Close"
            className="absolute right-6 top-6 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="relative h-[80vh] w-full max-w-4xl">
            <Image
              src={lightboxImage.url}
              alt={lightboxImage.alt || "Hotel gallery photo"}
              fill
              sizes="90vw"
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
