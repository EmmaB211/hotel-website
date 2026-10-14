import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { FacebookIcon, InstagramIcon, TwitterIcon } from "@/components/ui/social-icons";
import { siteConfig } from "@/config/site";
import { demoImages } from "@/lib/demo-images";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/layout/page-hero";
import { ContactForm } from "@/components/contact/contact-form";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Get in touch with ${siteConfig.name} in Lira City, Uganda.`,
};

export default function ContactPage() {
  return (
    <>
      <PageHero title="Contact Us" subtitle="We'd love to hear from you" image={demoImages.lobby} />

      <section className="py-16 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-semibold text-brand-charcoal">Get in Touch</h2>
            <p className="mt-3 text-brand-charcoal/70">
              Reach out with any questions about rooms, bookings, or events — our team is here to help.
            </p>

            <div className="mt-8 space-y-5 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 text-brand-primary" />
                <span>{siteConfig.address.full}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-brand-primary" />
                <a href={`tel:${siteConfig.phone.replace(/\s+/g, "")}`}>{siteConfig.phoneDisplay}</a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-brand-primary" />
                <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-brand-primary" />
                <span>Reception: {siteConfig.openingHours.reception}</span>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <a href={siteConfig.social.facebook} className="rounded-full bg-brand-primary/10 p-2.5 text-brand-primary hover:bg-brand-primary/20">
                <FacebookIcon className="h-4 w-4" />
              </a>
              <a href={siteConfig.social.instagram} className="rounded-full bg-brand-primary/10 p-2.5 text-brand-primary hover:bg-brand-primary/20">
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a href={siteConfig.social.twitter} className="rounded-full bg-brand-primary/10 p-2.5 text-brand-primary hover:bg-brand-primary/20">
                <TwitterIcon className="h-4 w-4" />
              </a>
            </div>

            <a
              href={siteConfig.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "outline", size: "md" }) + " mt-8"}
            >
              Get Directions
            </a>

            <div className="mt-8 overflow-hidden rounded-2xl border border-black/5">
              <iframe
                title="Hotel location map"
                src={siteConfig.googleMapsEmbedSrc}
                className="h-64 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <div className="rounded-2xl bg-brand-cream p-8">
            <h2 className="font-display text-2xl font-semibold text-brand-charcoal">Send a Message</h2>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
