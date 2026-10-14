import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { siteConfig } from "@/config/site";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number as currency using the site's configured currency (default UGX). */
export function formatCurrency(amount: number | string, currency: string = siteConfig.currency) {
  const value = typeof amount === "string" ? Number(amount) : amount;
  return new Intl.NumberFormat(siteConfig.currencyLocale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions) {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...options,
  }).format(d);
}

export function nightsBetween(checkIn: Date | string, checkOut: Date | string) {
  const start = typeof checkIn === "string" ? new Date(checkIn) : checkIn;
  const end = typeof checkOut === "string" ? new Date(checkOut) : checkOut;
  const ms = end.getTime() - start.getTime();
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
}

/** Generates a booking reference like LIRA-2026-000123 */
export function generateBookingReference(sequence: number) {
  const year = new Date().getFullYear();
  return `LIRA-${year}-${String(sequence).padStart(6, "0")}`;
}

export function buildWhatsappLink(phoneDigitsOnly: string, message: string) {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phoneDigitsOnly}?text=${encoded}`;
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
