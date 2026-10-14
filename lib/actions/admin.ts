"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Facilities
// ---------------------------------------------------------------------------

export async function createFacility(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") || "");
  await prisma.facility.create({
    data: {
      slug: `${slugify(name)}-${Date.now().toString(36)}`,
      name,
      description: String(formData.get("description") || ""),
      icon: String(formData.get("icon") || "") || null,
      openingHours: String(formData.get("openingHours") || "") || null,
      additionalInfo: String(formData.get("additionalInfo") || "") || null,
      isDemo: false,
    },
  });
  revalidatePath("/admin/facilities");
  revalidatePath("/facilities");
}

export async function toggleFacilityActive(id: string, isActive: boolean) {
  await requireAdmin();
  await prisma.facility.update({ where: { id }, data: { isActive } });
  revalidatePath("/admin/facilities");
  revalidatePath("/facilities");
}

export async function deleteFacility(id: string) {
  await requireAdmin();
  await prisma.facility.delete({ where: { id } });
  revalidatePath("/admin/facilities");
  revalidatePath("/facilities");
}

// ---------------------------------------------------------------------------
// Menu Items (Restaurant)
// ---------------------------------------------------------------------------

export async function createMenuItem(formData: FormData) {
  await requireAdmin();
  await prisma.menuItem.create({
    data: {
      name: String(formData.get("name") || ""),
      description: String(formData.get("description") || ""),
      category: String(formData.get("category") || "MAIN_COURSE") as never,
      price: Number(formData.get("price") || 0),
      image: String(formData.get("image") || "") || null,
      isDemo: false,
    },
  });
  revalidatePath("/admin/restaurant");
  revalidatePath("/restaurant");
}

export async function toggleMenuItemAvailability(id: string, isAvailable: boolean) {
  await requireAdmin();
  await prisma.menuItem.update({ where: { id }, data: { isAvailable } });
  revalidatePath("/admin/restaurant");
  revalidatePath("/restaurant");
}

export async function deleteMenuItem(id: string) {
  await requireAdmin();
  await prisma.menuItem.delete({ where: { id } });
  revalidatePath("/admin/restaurant");
  revalidatePath("/restaurant");
}

// ---------------------------------------------------------------------------
// Gallery
// ---------------------------------------------------------------------------

export async function createGalleryImage(formData: FormData) {
  await requireAdmin();
  await prisma.galleryImage.create({
    data: {
      url: String(formData.get("url") || ""),
      alt: String(formData.get("alt") || "") || null,
      category: String(formData.get("category") || "HOTEL") as never,
      isDemo: false,
    },
  });
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
}

export async function deleteGalleryImage(id: string) {
  await requireAdmin();
  await prisma.galleryImage.delete({ where: { id } });
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
}

// ---------------------------------------------------------------------------
// Tourist Attractions
// ---------------------------------------------------------------------------

export async function createAttraction(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") || "");
  const thingsToDoRaw = String(formData.get("thingsToDo") || "");
  await prisma.touristAttraction.create({
    data: {
      slug: `${slugify(name)}-${Date.now().toString(36)}`,
      name,
      description: String(formData.get("description") || ""),
      location: String(formData.get("location") || ""),
      distanceFromHotel: String(formData.get("distanceFromHotel") || "") || null,
      travelTime: String(formData.get("travelTime") || "") || null,
      thingsToDo: thingsToDoRaw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      image: String(formData.get("image") || "") || null,
      isDemo: false,
    },
  });
  revalidatePath("/admin/tourism");
  revalidatePath("/tourism");
}

export async function deleteAttraction(id: string) {
  await requireAdmin();
  await prisma.touristAttraction.delete({ where: { id } });
  revalidatePath("/admin/tourism");
  revalidatePath("/tourism");
}

// ---------------------------------------------------------------------------
// Special Offers
// ---------------------------------------------------------------------------

export async function createOffer(formData: FormData) {
  await requireAdmin();
  const title = String(formData.get("title") || "");
  await prisma.specialOffer.create({
    data: {
      slug: `${slugify(title)}-${Date.now().toString(36)}`,
      title,
      description: String(formData.get("description") || ""),
      image: String(formData.get("image") || "") || null,
      originalPrice: formData.get("originalPrice") ? Number(formData.get("originalPrice")) : null,
      discountedPrice: formData.get("discountedPrice") ? Number(formData.get("discountedPrice")) : null,
      validFrom: new Date(String(formData.get("validFrom"))),
      validTo: new Date(String(formData.get("validTo"))),
      terms: String(formData.get("terms") || "") || null,
      isDemo: false,
    },
  });
  revalidatePath("/admin/offers");
  revalidatePath("/");
}

export async function toggleOfferActive(id: string, isActive: boolean) {
  await requireAdmin();
  await prisma.specialOffer.update({ where: { id }, data: { isActive } });
  revalidatePath("/admin/offers");
  revalidatePath("/");
}

export async function deleteOffer(id: string) {
  await requireAdmin();
  await prisma.specialOffer.delete({ where: { id } });
  revalidatePath("/admin/offers");
  revalidatePath("/");
}

// ---------------------------------------------------------------------------
// Testimonials
// ---------------------------------------------------------------------------

export async function approveTestimonial(id: string, isApproved: boolean) {
  await requireAdmin();
  await prisma.testimonial.update({ where: { id }, data: { isApproved } });
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}

export async function deleteTestimonial(id: string) {
  await requireAdmin();
  await prisma.testimonial.delete({ where: { id } });
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export async function logoutAdmin() {
  const { destroySession } = await import("@/lib/auth");
  await destroySession();
  redirect("/admin/login");
}
