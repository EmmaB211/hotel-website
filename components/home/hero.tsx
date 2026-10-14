"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { demoImages } from "@/lib/demo-images";
import { buttonVariants } from "@/components/ui/button";
import { BookingWidget } from "@/components/home/booking-widget";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section className="relative flex min-h-[92vh] flex-col justify-center overflow-hidden">
      <Image
        src={demoImages.heroExterior}
        alt="Lira Grand Hotel exterior at golden hour"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-32 pb-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <span className="mb-5 inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur">
            {siteConfig.name} &middot; Lira City, Uganda
          </span>
          <h1 className="font-display text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            {siteConfig.tagline}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85">
            {siteConfig.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/booking" className={buttonVariants({ variant: "accent", size: "lg" })}>
              Book Your Stay
            </Link>
            <Link
              href="/rooms"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "border-white text-white hover:bg-white/10")}
            >
              Explore Rooms
            </Link>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
        className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6 lg:px-8"
      >
        <BookingWidget />
      </motion.div>
    </section>
  );
}
