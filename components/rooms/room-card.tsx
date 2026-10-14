import Image from "next/image";
import Link from "next/link";
import { Users, BedDouble, Maximize, Wifi } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { formatCurrency, cn } from "@/lib/utils";
import type { RoomWithRelations } from "@/types";

export function RoomCard({ room }: { room: RoomWithRelations }) {
  const cover = room.images[0];

  return (
    <Card className="group overflow-hidden">
      <div className="relative h-56 w-full overflow-hidden">
        {cover ? (
          <Image
            src={cover.url}
            alt={cover.alt || room.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-brand-cream text-brand-charcoal/40">
            No image
          </div>
        )}
        {room.status !== "AVAILABLE" && (
          <Badge variant="warning" className="absolute left-3 top-3">
            {room.status === "MAINTENANCE" ? "Under Maintenance" : "Unavailable"}
          </Badge>
        )}
        {room.isFeatured && (
          <Badge variant="accent" className="absolute right-3 top-3">
            Featured
          </Badge>
        )}
      </div>

      <div className="p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-primary">{room.category}</p>
        <h3 className="mt-1 font-display text-xl font-semibold text-brand-charcoal">{room.name}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-brand-charcoal/70">
          {room.shortSummary || room.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-4 text-xs text-brand-charcoal/60">
          <span className="flex items-center gap-1.5">
            <Users className="h-4 w-4" /> {room.maxAdults} Adults{room.maxChildren ? ` + ${room.maxChildren} Kids` : ""}
          </span>
          <span className="flex items-center gap-1.5">
            <BedDouble className="h-4 w-4" /> {room.bedType}
          </span>
          {room.sizeSqm && (
            <span className="flex items-center gap-1.5">
              <Maximize className="h-4 w-4" /> {room.sizeSqm} m&sup2;
            </span>
          )}
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-black/5 pt-5">
          <div>
            <span className="font-display text-xl font-bold text-brand-charcoal">
              {formatCurrency(room.pricePerNight.toString(), room.currency)}
            </span>
            <span className="text-sm text-brand-charcoal/60"> / night</span>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/rooms/${room.slug}`}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              View Room
            </Link>
            <Link
              href={`/booking?roomId=${room.id}`}
              className={cn(buttonVariants({ variant: "primary", size: "sm" }))}
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function RoomAmenityIcon({ name }: { name: string }) {
  return (
    <span className="flex items-center gap-2 rounded-lg bg-brand-cream px-3 py-2 text-sm text-brand-charcoal/80">
      <Wifi className="h-4 w-4 text-brand-primary" />
      {name}
    </span>
  );
}
