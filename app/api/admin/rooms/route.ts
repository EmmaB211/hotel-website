import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { roomFormSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rooms = await prisma.room.findMany({
    include: { images: true, amenities: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ rooms });
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = roomFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const data = parsed.data;
  const slug = slugify(data.name);

  const room = await prisma.room.create({
    data: {
      slug,
      name: data.name,
      category: data.category,
      description: data.description,
      shortSummary: data.shortSummary || null,
      pricePerNight: data.pricePerNight,
      maxAdults: data.maxAdults,
      maxChildren: data.maxChildren,
      bedType: data.bedType,
      sizeSqm: data.sizeSqm || null,
      totalUnits: data.totalUnits,
      status: data.status,
    },
  });

  return NextResponse.json({ room }, { status: 201 });
}
