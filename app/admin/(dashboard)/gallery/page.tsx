import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Trash2 } from "lucide-react";
import { createGalleryImage, deleteGalleryImage } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

const categories = [
  "HOTEL",
  "ROOMS",
  "RESTAURANT",
  "SWIMMING_POOL",
  "GYM",
  "EVENTS",
  "CONFERENCE",
  "GARDEN",
  "SURROUNDINGS",
  "TOURISM",
];

export default async function AdminGalleryPage() {
  const images = await prisma.galleryImage.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-brand-charcoal">Gallery</h1>
        <p className="text-sm text-brand-charcoal/60">Upload and categorize photos shown on the public gallery.</p>
      </div>

      <div className="rounded-2xl border border-black/5 bg-white p-6">
        <h2 className="font-display text-lg font-semibold text-brand-charcoal">Add Photo</h2>
        <p className="mt-1 text-xs text-brand-charcoal/50">
          Paste an image URL (e.g. from Cloudinary) — direct file upload can be wired to Cloudinary&apos;s
          upload API in production.
        </p>
        <form action={createGalleryImage} className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="url">Image URL</Label>
            <Input id="url" name="url" required placeholder="https://res.cloudinary.com/..." />
          </div>
          <div>
            <Label htmlFor="alt">Alt Text</Label>
            <Input id="alt" name="alt" />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select id="category" name="category" required>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c.replace("_", " ")}
                </option>
              ))}
            </Select>
          </div>
          <div className="sm:col-span-2">
            <Button type="submit">Add Photo</Button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((image) => (
          <div key={image.id} className="group relative overflow-hidden rounded-xl">
            <div className="relative h-32 w-full">
              <Image src={image.url} alt={image.alt || "Gallery image"} fill sizes="25vw" className="object-cover" />
            </div>
            <form action={deleteGalleryImage.bind(null, image.id)}>
              <button
                className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Delete photo"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </form>
            <span className="absolute bottom-0 left-0 right-0 bg-black/50 px-2 py-1 text-[10px] font-medium text-white">
              {image.category.replace("_", " ")}
            </span>
          </div>
        ))}
      </div>
      {images.length === 0 && <p className="text-center text-sm text-brand-charcoal/50">No photos yet.</p>}
    </div>
  );
}
