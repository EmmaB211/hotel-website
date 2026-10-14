import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export async function TestimonialsSection() {
  const testimonials = await prisma.testimonial.findMany({
    where: { isApproved: true },
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  if (testimonials.length === 0) return null;

  return (
    <section className="bg-brand-cream py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Guest Reviews"
          title="What Our Guests Say"
          description="Real experiences from guests who have stayed with us in Lira City."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t) => (
            <Card key={t.id} className="flex flex-col p-6">
              <div className="flex gap-0.5 text-brand-accent">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < t.rating ? "fill-current" : "text-black/10"}`} />
                ))}
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-brand-charcoal/80">
                &ldquo;{t.review}&rdquo;
              </p>
              <div className="mt-5 flex items-center gap-3">
                {t.profileImage ? (
                  <div className="relative h-10 w-10 overflow-hidden rounded-full">
                    <Image src={t.profileImage} alt={t.guestName} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary/10 text-sm font-semibold text-brand-primary">
                    {t.guestName.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-brand-charcoal">{t.guestName}</p>
                  <p className="text-xs text-brand-charcoal/50">{formatDate(t.createdAt)}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/contact" className={buttonVariants({ variant: "primary", size: "lg" })}>
            Share Your Experience
          </Link>
        </div>
      </Container>
    </section>
  );
}
