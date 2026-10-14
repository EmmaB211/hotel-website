"use client";

import { Printer, Download, MessageCircle, Home } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { buildWhatsappLink, cn } from "@/lib/utils";

interface ConfirmationActionsProps {
  reference: string;
  guestName: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
}

export function ConfirmationActions({
  reference,
  guestName,
  roomName,
  checkIn,
  checkOut,
}: ConfirmationActionsProps) {
  const whatsappMessage = `Hello ${siteConfig.name}, I would like to confirm my booking ${reference} for ${guestName} — ${roomName}, ${checkIn} to ${checkOut}.`;
  const whatsappHref = buildWhatsappLink(siteConfig.whatsapp, whatsappMessage);

  return (
    <div className="mt-8 grid gap-3 sm:grid-cols-2">
      <button onClick={() => window.print()} className={cn(buttonVariants({ variant: "outline", size: "md" }))}>
        <Printer className="h-4 w-4" /> Print Booking
      </button>
      <button onClick={() => window.print()} className={cn(buttonVariants({ variant: "outline", size: "md" }))}>
        <Download className="h-4 w-4" /> Download Confirmation
      </button>
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(buttonVariants({ variant: "secondary", size: "md" }))}
      >
        <MessageCircle className="h-4 w-4" /> Contact via WhatsApp
      </a>
      <Link href="/" className={cn(buttonVariants({ variant: "primary", size: "md" }))}>
        <Home className="h-4 w-4" /> Return to Homepage
      </Link>
    </div>
  );
}
