import type { Metadata } from "next";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { PageHero } from "@/components/layout/page-hero";
import { demoImages } from "@/lib/demo-images";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Restaurant & Dining",
  description: "Enjoy local and international cuisine at Lira Grand Hotel's restaurant.",
};

export const dynamic = "force-dynamic";

const categoryLabels: Record<string, string> = {
  BREAKFAST: "Breakfast",
  STARTERS: "Starters",
  MAIN_COURSE: "Main Course",
  LOCAL_CUISINE: "Local Cuisine",
  INTERNATIONAL_CUISINE: "International Cuisine",
  DESSERTS: "Desserts",
  BEVERAGES: "Beverages",
};

export default async function RestaurantPage() {
  const menuItems = await prisma.menuItem.findMany({
    where: { isAvailable: true },
    orderBy: { name: "asc" },
  });

  const grouped = menuItems.reduce<Record<string, typeof menuItems>>((acc, item) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <>
      <PageHero
        title="Restaurant & Dining"
        subtitle="A taste of Northern Uganda, served with warmth"
        image={demoImages.restaurantInterior}
      />

      <section className="py-16 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="relative h-72 overflow-hidden rounded-2xl sm:h-96">
            <Image src={demoImages.restaurantFood} alt="Signature dish" fill sizes="50vw" className="object-cover" />
          </div>
          <div>
            <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary">
              Our Restaurant
            </span>
            <h2 className="font-display text-3xl font-semibold text-brand-charcoal">
              Local Flavors, International Standards
            </h2>
            <p className="mt-4 leading-relaxed text-brand-charcoal/70">
              Our restaurant serves breakfast, lunch, and dinner featuring the best of local Northern
              Ugandan cuisine alongside international favorites, complemented by a curated drinks menu.
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-brand-cream py-16 sm:py-24">
        <Container>
          <SectionHeading eyebrow="Digital Menu" title="Explore Our Menu" />

          <div className="mt-14 space-y-14">
            {Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                <h3 className="font-display text-2xl font-semibold text-brand-charcoal">
                  {categoryLabels[category] || category}
                </h3>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start justify-between gap-4 rounded-xl bg-white p-5 shadow-sm"
                    >
                      <div>
                        <h4 className="font-semibold text-brand-charcoal">{item.name}</h4>
                        <p className="mt-1 text-sm text-brand-charcoal/60">{item.description}</p>
                      </div>
                      <span className="whitespace-nowrap font-display font-bold text-brand-primary">
                        {formatCurrency(item.price.toString(), item.currency)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {menuItems.length === 0 && (
              <p className="text-center text-brand-charcoal/60">Menu information coming soon.</p>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
