import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { bookingFormSchema } from "@/lib/validations";
import { isRoomAvailable, nextBookingReference } from "@/lib/booking";
import { nightsBetween } from "@/lib/utils";
import { sendBookingConfirmationEmail } from "@/lib/email";

// Simple in-memory rate limiter (per-process). For production, replace with a
// shared store (e.g. Redis) behind a reverse proxy.
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10;

function isRateLimited(ip: string) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = bookingFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const data = parsed.data;

  try {
    const room = await prisma.room.findUnique({ where: { id: data.roomId } });
    if (!room) {
      return NextResponse.json({ error: "Selected room does not exist." }, { status: 404 });
    }

    const available = await isRoomAvailable(data.roomId, data.checkIn, data.checkOut, data.numRooms);
    if (!available) {
      return NextResponse.json(
        { error: "This room is not available for the selected dates. Please choose different dates or another room." },
        { status: 409 }
      );
    }

    const nights = nightsBetween(data.checkIn, data.checkOut);
    const totalAmount = Number(room.pricePerNight) * nights * data.numRooms;

    const guest = await prisma.guest.upsert({
      where: { email: data.email },
      update: { fullName: data.fullName, phone: data.phone },
      create: { fullName: data.fullName, email: data.email, phone: data.phone },
    });

    const reference = await nextBookingReference();

    const booking = await prisma.booking.create({
      data: {
        reference,
        roomId: data.roomId,
        guestId: guest.id,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        adults: data.adults,
        children: data.children,
        numRooms: data.numRooms,
        specialRequests: data.specialRequests || null,
        totalAmount,
        currency: room.currency,
        status: "PENDING",
      },
      include: { room: true, guest: true },
    });

    // Fire-and-forget email; do not block the response on SMTP delivery.
    sendBookingConfirmationEmail(booking).catch((err) =>
      console.error("[bookings] Failed to send confirmation email:", err)
    );

    return NextResponse.json({ reference: booking.reference }, { status: 201 });
  } catch (error) {
    console.error("[bookings] Failed to create booking:", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
