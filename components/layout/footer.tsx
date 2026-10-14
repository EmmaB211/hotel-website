import Link from "next/link";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { FacebookIcon, InstagramIcon, TwitterIcon } from "@/components/ui/social-icons";
import { siteConfig, navLinks } from "@/config/site";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="bg-brand-charcoal text-white/80">
      <Container className="grid gap-10 py-16 lg:grid-cols-4">
        <div>
          <h3 className="font-display text-xl font-bold text-white">{siteConfig.name}</h3>
          <p className="mt-4 text-sm leading-relaxed">{siteConfig.description}</p>
          <div className="mt-5 flex gap-3">
            {siteConfig.social.facebook && (
              <a href={siteConfig.social.facebook} aria-label="Facebook" className="rounded-full bg-white/10 p-2 hover:bg-white/20">
                <FacebookIcon className="h-4 w-4" />
              </a>
            )}
            {siteConfig.social.instagram && (
              <a href={siteConfig.social.instagram} aria-label="Instagram" className="rounded-full bg-white/10 p-2 hover:bg-white/20">
                <InstagramIcon className="h-4 w-4" />
              </a>
            )}
            {siteConfig.social.twitter && (
              <a href={siteConfig.social.twitter} aria-label="Twitter" className="rounded-full bg-white/10 p-2 hover:bg-white/20">
                <TwitterIcon className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {navLinks.slice(1).map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-brand-accent">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Contact</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              {siteConfig.address.full}
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0" />
              <a href={`tel:${siteConfig.phone.replace(/\s+/g, "")}`} className="hover:text-brand-accent">
                {siteConfig.phoneDisplay}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0" />
              <a href={`mailto:${siteConfig.email}`} className="hover:text-brand-accent">
                {siteConfig.email}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Clock className="h-4 w-4 shrink-0" />
              Reception: {siteConfig.openingHours.reception}
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Newsletter</h4>
          <p className="mb-4 text-sm">Get updates on offers and Lira City tourism news.</p>
          <form className="flex gap-2">
            <Input
              type="email"
              required
              placeholder="Your email"
              className="border-white/20 bg-white/10 text-white placeholder:text-white/50"
            />
            <Button type="submit" variant="accent" size="md">
              Join
            </Button>
          </form>
        </div>
      </Container>

      <div className="border-t border-white/10 py-6 text-center text-xs text-white/50">
        &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved. Demo content for
        development purposes.
      </div>
    </footer>
  );
}
