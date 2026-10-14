import { z } from "zod";

export const bookingFormSchema = z
  .object({
    roomId: z.string().min(1, "Please select a room"),
    checkIn: z.coerce.date({ message: "Check-in date is required" }),
    checkOut: z.coerce.date({ message: "Check-out date is required" }),
    adults: z.coerce.number().int().min(1, "At least 1 adult is required").max(10),
    children: z.coerce.number().int().min(0).max(10),
    numRooms: z.coerce.number().int().min(1).max(10),
    fullName: z.string().min(2, "Full name is required").max(100),
    email: z.string().email("Enter a valid email address"),
    phone: z.string().min(7, "Enter a valid phone number").max(20),
    specialRequests: z.string().max(1000).optional().or(z.literal("")),
  })
  .refine((data) => data.checkOut > data.checkIn, {
    message: "Check-out date must be after check-in date",
    path: ["checkOut"],
  });

export type BookingFormValues = z.infer<typeof bookingFormSchema>;

export const availabilitySearchSchema = z
  .object({
    checkIn: z.coerce.date(),
    checkOut: z.coerce.date(),
    adults: z.coerce.number().int().min(1),
    children: z.coerce.number().int().min(0),
    numRooms: z.coerce.number().int().min(1),
  })
  .refine((data) => data.checkOut > data.checkIn, {
    message: "Check-out date must be after check-in date",
    path: ["checkOut"],
  });

export type AvailabilitySearchValues = z.infer<typeof availabilitySearchSchema>;

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name is required").max(100),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().max(20).optional().or(z.literal("")),
  subject: z.string().min(2, "Subject is required").max(150),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export const eventQuoteFormSchema = z.object({
  fullName: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(7).max(20),
  eventType: z.string().max(100).optional().or(z.literal("")),
  eventDate: z.coerce.date().optional(),
  guestCount: z.coerce.number().int().min(1).optional(),
  message: z.string().max(2000).optional().or(z.literal("")),
});

export type EventQuoteFormValues = z.infer<typeof eventQuoteFormSchema>;

export const adminLoginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type AdminLoginValues = z.infer<typeof adminLoginSchema>;

export const roomFormSchema = z.object({
  name: z.string().min(2).max(150),
  category: z.string().min(2).max(100),
  description: z.string().min(10),
  shortSummary: z.string().max(300).optional().or(z.literal("")),
  pricePerNight: z.coerce.number().positive(),
  maxAdults: z.coerce.number().int().min(1),
  maxChildren: z.coerce.number().int().min(0),
  bedType: z.string().min(2),
  sizeSqm: z.coerce.number().int().positive().optional(),
  totalUnits: z.coerce.number().int().min(1),
  status: z.enum(["AVAILABLE", "UNAVAILABLE", "MAINTENANCE"]),
});

export type RoomFormValues = z.infer<typeof roomFormSchema>;
