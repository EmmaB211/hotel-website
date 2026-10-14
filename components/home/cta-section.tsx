import Image from "next/image";
import Link from "next/link";
import { demoImages } from "@/lib/demo-images";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export function CtaSection() {
  return (
    <section className="relative overflow-hidden py-24">
      <Image
        src={demoImages.heroPool}
        alt="Hotel poolside in the evening"
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-brand-charcoal/70" />
      <Container className="relative z-10 text-center">
        <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">
          Ready to Experience Lira Grand Hotel?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-white/80">
          Reserve your room today and enjoy comfort, warmth, and unforgettable hospitality.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/booking" className={buttonVariants({ variant: "accent", size: "lg" })}>
            Book Your Stay
          </Link>
          <Link
            href="/contact"
            className={buttonVariants({ variant: "outline", size: "lg" }) + " border-white text-white hover:bg-white/10"}
          >
            Contact Us
          </Link>
        </div>
      </Container>
    </section>
  );
}
