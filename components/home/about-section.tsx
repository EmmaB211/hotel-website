"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { demoImages } from "@/lib/demo-images";
import { buttonVariants } from "@/components/ui/button";

const stats = [
  { label: "Years of Hospitality", value: `${new Date().getFullYear() - siteConfig.yearEstablished}+` },
  { label: "Well-appointed Rooms", value: `${siteConfig.totalRooms}` },
  { label: "Facilities & Services", value: `${siteConfig.totalFacilities}` },
  { label: "Guest Satisfaction", value: "4.7/5" },
];

export function AboutSection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="relative grid grid-cols-2 gap-4"
        >
          <div className="relative h-64 overflow-hidden rounded-2xl sm:h-80">
            <Image src={demoImages.lobby} alt="Hotel lobby" fill sizes="50vw" className="object-cover" />
          </div>
          <div className="relative mt-8 h-64 overflow-hidden rounded-2xl sm:h-80">
            <Image src={demoImages.pool} alt="Hotel swimming pool" fill sizes="50vw" className="object-cover" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary">
            About the Hotel
          </span>
          <h2 className="font-display text-3xl font-semibold text-brand-charcoal sm:text-4xl">
            A warm retreat in the heart of Lira City
          </h2>
          <p className="mt-5 leading-relaxed text-brand-charcoal/70">{siteConfig.description}</p>

          <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="font-display text-2xl font-bold text-brand-primary">{stat.value}</div>
                <div className="mt-1 text-xs text-brand-charcoal/60">{stat.label}</div>
              </div>
            ))}
          </div>

          <Link href="/about" className={buttonVariants({ variant: "primary", size: "lg" }) + " mt-8"}>
            Discover Our Hotel
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
