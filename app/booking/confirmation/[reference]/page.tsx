import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle2, Phone, Mail } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { ConfirmationActions } from "@/components/booking/confirmation-actions";
import { formatCurrency, formatDate, nightsBetween } from "@/lib/utils";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Booking Confirmation",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

interface ConfirmationPageProps {
  params: Promise<{ reference: string }>;
}

export default async function BookingConfirmationPage({ params }: ConfirmationPageProps) {
  const { reference } = await params;

  const booking = await prisma.booking.findUnique({
    where: { reference },
    include: { room: true, guest: true },
  });

  if (!booking) notFound();

  const nights = nightsBetween(booking.checkIn, booking.checkOut);

  return (
    <section className="py-16 sm:py-24 print:py-6">
      <Container className="max-w-2xl">
        <div className="rounded-2xl border border-black/5 bg-white p-8 shadow-sm sm:p-10">
          <div className="flex flex-col items-center text-center">
            <CheckCircle2 className="h-16 w-16 text-brand-secondary" />
            <h1 className="mt-4 font-display text-3xl font-bold text-brand-charcoal">
              Booking Received Successfully
            </h1>
            <p className="mt-2 text-brand-charcoal/70">
              Thank you, {booking.guest.fullName}. We&apos;ve received your reservation request.
            </p>
            <Badge variant="accent" className="mt-4 text-sm">
              Reference: {booking.reference}
            </Badge>
          </div>

          <dl className="mt-8 divide-y divide-black/5 rounded-xl border border-black/5">
            {[
              ["Guest Name", booking.guest.fullName],
              ["Room", booking.room.name],
              ["Check-in", formatDate(booking.checkIn)],
              ["Check-out", formatDate(booking.checkOut)],
              ["Nights", String(nights)],
              ["Guests", `${booking.adults} adults, ${booking.children} children`],
              ["Status", booking.status.replace("_", " ")],
              [
                "Total Estimated",
                formatCurrency(booking.totalAmount.toString(), booking.currency),
              ],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between px-5 py-3 text-sm">
                <dt className="text-brand-charcoal/60">{label}</dt>
                <dd className="font-medium text-brand-charcoal">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 rounded-xl bg-brand-cream p-5 text-sm text-brand-charcoal/80">
            <p className="font-semibold text-brand-charcoal">{siteConfig.name}</p>
            <p className="mt-1 flex items-center gap-2">
              <Phone className="h-4 w-4" /> {siteConfig.phoneDisplay}
            </p>
            <p className="mt-1 flex items-center gap-2">
              <Mail className="h-4 w-4" /> {siteConfig.email}
            </p>
          </div>

          <div className="print:hidden">
            <ConfirmationActions
              reference={booking.reference}
              guestName={booking.guest.fullName}
              roomName={booking.room.name}
              checkIn={formatDate(booking.checkIn)}
              checkOut={formatDate(booking.checkOut)}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
