/**
 * Central site configuration.
 * DEMO DATA: Replace these values with real hotel details before going to production.
 * Changing values here updates branding across the entire website.
 */

export const siteConfig = {
  // --- Identity ---
  name: "Lira Grand Hotel",
  shortName: "Lira Grand",
  tagline: "Experience Comfort. Discover Lira.",
  description:
    "A premium hotel and tourism destination in the heart of Lira City, Uganda — offering elegant rooms, fine dining, and unforgettable experiences in Northern Uganda.",
  logo: "/images/branding/logo.svg",
  logoDark: "/images/branding/logo-dark.svg",
  favicon: "/favicon.ico",

  // --- Contact ---
  phone: "+256 700 000 000",
  phoneDisplay: "+256 700 000 000",
  whatsapp: "256700000000", // digits only, no + or spaces, used for wa.me links
  email: "info@liragrandhotel.com",
  reservationsEmail: "reservations@liragrandhotel.com",

  // --- Location ---
  address: {
    line1: "Plot 12, Independence Avenue",
    line2: "Lira City",
    city: "Lira",
    region: "Northern Region",
    country: "Uganda",
    postalCode: "",
    full: "Plot 12, Independence Avenue, Lira City, Uganda",
  },
  coordinates: {
    lat: 2.2499,
    lng: 32.9028,
  },
  googleMapsUrl: "https://www.google.com/maps?q=2.2499,32.9028",
  googleMapsEmbedSrc:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.0!2d32.9028!3d2.2499!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMsKwMTQnNTkuNiJOIDMywrA1NDIwLjAiRQ!5e0!3m2!1sen!2sug",

  // --- Hours ---
  openingHours: {
    reception: "Open 24 hours",
    restaurant: "6:00 AM – 10:30 PM",
    bar: "11:00 AM – 12:00 AM",
    pool: "7:00 AM – 7:00 PM",
    gym: "6:00 AM – 9:00 PM",
  },

  // --- Socials ---
  social: {
    facebook: "https://facebook.com/liragrandhotel",
    instagram: "https://instagram.com/liragrandhotel",
    twitter: "https://twitter.com/liragrandhotel",
    tiktok: "https://tiktok.com/@liragrandhotel",
    youtube: "",
  },

  // --- Commerce ---
  currency: "UGX",
  currencyLocale: "en-UG",

  // --- Brand colors (used by tailwind theme + inline usages) ---
  colors: {
    primary: "#8a5a2b", // warm terracotta / African earth tone
    primaryDark: "#5f3c1c",
    secondary: "#1f6b4f", // deep savanna green
    accent: "#d9a441", // golden accent
    cream: "#faf6ef",
    charcoal: "#1c1917",
  },

  // --- Misc ---
  yearEstablished: 2016,
  totalRooms: 42,
  totalFacilities: 8,

  keywords: [
    "hotel in Lira",
    "Lira City hotel",
    "Uganda hotel booking",
    "Northern Uganda accommodation",
    "Lira Grand Hotel",
    "hotels in Uganda",
    "Lira tourism",
  ],
} as const;

export type SiteConfig = typeof siteConfig;

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Rooms", href: "/rooms" },
  { label: "Facilities", href: "/facilities" },
  { label: "Restaurant", href: "/restaurant" },
  { label: "Gallery", href: "/gallery" },
  { label: "Tourism", href: "/tourism" },
  { label: "Events", href: "/events" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;
