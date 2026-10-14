"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { bookingFormSchema, type BookingFormValues } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { formatCurrency, nightsBetween } from "@/lib/utils";
import type { RoomWithRelations } from "@/types";

interface BookingFormProps {
  rooms: RoomWithRelations[];
  defaultRoomId?: string;
}

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

export function BookingForm({ rooms, defaultRoomId }: BookingFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      roomId: defaultRoomId || rooms[0]?.id || "",
      adults: 2,
      children: 0,
      numRooms: 1,
      specialRequests: "",
    },
  });

  const watchedRoomId = watch("roomId");
  const watchedCheckIn = watch("checkIn");
  const watchedCheckOut = watch("checkOut");
  const watchedNumRooms = watch("numRooms");

  const selectedRoom = rooms.find((r) => r.id === watchedRoomId);
  const nights =
    watchedCheckIn && watchedCheckOut ? nightsBetween(watchedCheckIn, watchedCheckOut) : 0;
  const estimatedTotal =
    selectedRoom && nights > 0
      ? Number(selectedRoom.pricePerNight) * nights * (watchedNumRooms || 1)
      : 0;

  const onSubmit = async (values: BookingFormValues) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json();

      if (!res.ok) {
        setServerError(json.error || "Something went wrong. Please try again.");
        toast.error(json.error || "Booking failed");
        return;
      }

      toast.success("Booking received successfully!");
      router.push(`/booking/confirmation/${json.reference}`);
    } catch {
      setServerError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
      <section>
        <h2 className="font-display text-xl font-semibold text-brand-charcoal">1. Stay Details</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="roomId">Room</Label>
            <Select id="roomId" {...register("roomId")}>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name} — {formatCurrency(room.pricePerNight.toString(), room.currency)}/night
                </option>
              ))}
            </Select>
            {errors.roomId && <p className="mt-1 text-xs text-red-600">{errors.roomId.message}</p>}
          </div>

          <div>
            <Label htmlFor="checkIn">Check-in Date</Label>
            <Input id="checkIn" type="date" min={todayISO()} {...register("checkIn")} />
            {errors.checkIn && <p className="mt-1 text-xs text-red-600">{errors.checkIn.message}</p>}
          </div>

          <div>
            <Label htmlFor="checkOut">Check-out Date</Label>
            <Input id="checkOut" type="date" min={todayISO()} {...register("checkOut")} />
            {errors.checkOut && <p className="mt-1 text-xs text-red-600">{errors.checkOut.message}</p>}
          </div>

          <div>
            <Label htmlFor="adults">Adults</Label>
            <Input id="adults" type="number" min={1} max={10} {...register("adults")} />
          </div>

          <div>
            <Label htmlFor="children">Children</Label>
            <Input id="children" type="number" min={0} max={10} {...register("children")} />
          </div>

          <div>
            <Label htmlFor="numRooms">Number of Rooms</Label>
            <Input id="numRooms" type="number" min={1} max={10} {...register("numRooms")} />
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-brand-charcoal">2. Your Details</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" {...register("fullName")} placeholder="e.g. Grace Akello" />
            {errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName.message}</p>}
          </div>
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" {...register("email")} placeholder="you@example.com" />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" type="tel" {...register("phone")} placeholder="+256 7XX XXX XXX" />
            {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="specialRequests">Special Requests (optional)</Label>
            <Textarea
              id="specialRequests"
              {...register("specialRequests")}
              placeholder="e.g. Airport pickup, late check-in, dietary requirements..."
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl bg-brand-cream p-6">
        <h2 className="font-display text-xl font-semibold text-brand-charcoal">3. Review & Submit</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-brand-charcoal/60">Room</dt>
            <dd className="font-medium">{selectedRoom?.name || "—"}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-brand-charcoal/60">Nights</dt>
            <dd className="font-medium">{nights || "—"}</dd>
          </div>
          <div className="flex justify-between border-t border-black/10 pt-2 text-base">
            <dt className="font-semibold text-brand-charcoal">Estimated Total</dt>
            <dd className="font-display font-bold text-brand-primary">
              {selectedRoom ? formatCurrency(estimatedTotal, selectedRoom.currency) : "—"}
            </dd>
          </div>
        </dl>

        {serverError && <p className="mt-4 text-sm font-medium text-red-600">{serverError}</p>}

        <Button type="submit" size="lg" className="mt-6 w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Reservation"}
        </Button>
      </section>
    </form>
  );
}
