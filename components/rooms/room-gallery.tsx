"use client";

import * as React from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface RoomGalleryProps {
  images: { url: string; alt?: string | null }[];
  roomName: string;
}

export function RoomGallery({ images, roomName }: RoomGalleryProps) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [lightboxOpen, setLightboxOpen] = React.useState(false);

  const gallery = images.length > 0 ? images : [{ url: "", alt: roomName }];

  return (
    <div>
      <div className="relative h-80 w-full overflow-hidden rounded-2xl sm:h-[26rem]">
        {gallery[activeIndex].url ? (
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="relative block h-full w-full"
            aria-label="Open image in full screen"
          >
            <Image
              src={gallery[activeIndex].url}
              alt={gallery[activeIndex].alt || roomName}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
              priority
            />
          </button>
        ) : (
          <div className="flex h-full items-center justify-center bg-brand-cream text-brand-charcoal/40">
            No image available
          </div>
        )}
      </div>

      {gallery.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
          {gallery.map((img, index) => (
            <button
              key={img.url + index}
              onClick={() => setActiveIndex(index)}
              className={`relative h-16 overflow-hidden rounded-lg border-2 sm:h-20 ${
                index === activeIndex ? "border-brand-primary" : "border-transparent"
              }`}
            >
              <Image src={img.url} alt={img.alt || roomName} fill sizes="10vw" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
        >
          <button
            onClick={() => setLightboxOpen(false)}
            aria-label="Close full screen image"
            className="absolute right-6 top-6 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </button>
          {gallery.length > 1 && (
            <button
              onClick={() => setActiveIndex((i) => (i - 1 + gallery.length) % gallery.length)}
              aria-label="Previous image"
              className="absolute left-6 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}
          <div className="relative h-[80vh] w-full max-w-4xl">
            <Image
              src={gallery[activeIndex].url}
              alt={gallery[activeIndex].alt || roomName}
              fill
              sizes="90vw"
              className="object-contain"
            />
          </div>
          {gallery.length > 1 && (
            <button
              onClick={() => setActiveIndex((i) => (i + 1) % gallery.length)}
              aria-label="Next image"
              className="absolute right-6 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
