"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { CalendarDays, Users, BedDouble, Search } from "lucide-react";
import { availabilitySearchSchema, type AvailabilitySearchValues } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

function tomorrowISO() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

export function BookingWidget({ className }: { className?: string }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AvailabilitySearchValues>({
    resolver: zodResolver(availabilitySearchSchema),
    defaultValues: {
      checkIn: new Date(todayISO()),
      checkOut: new Date(tomorrowISO()),
      adults: 2,
      children: 0,
      numRooms: 1,
    },
  });

  const onSubmit = (values: AvailabilitySearchValues) => {
    const params = new URLSearchParams({
      checkIn: new Date(values.checkIn).toISOString().split("T")[0],
      checkOut: new Date(values.checkOut).toISOString().split("T")[0],
      adults: String(values.adults),
      children: String(values.children),
      numRooms: String(values.numRooms),
    });
    router.push(`/rooms?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={
        "grid grid-cols-1 gap-4 rounded-2xl bg-white p-6 shadow-xl sm:grid-cols-2 lg:grid-cols-5 lg:items-end " +
        (className ?? "")
      }
    >
      <div>
        <Label htmlFor="checkIn" className="flex items-center gap-1.5">
          <CalendarDays className="h-4 w-4 text-brand-primary" /> Check-in
        </Label>
        <input
          id="checkIn"
          type="date"
          min={todayISO()}
          defaultValue={todayISO()}
          {...register("checkIn")}
          className="h-11 w-full rounded-lg border border-black/10 px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
        />
        {errors.checkIn && <p className="mt-1 text-xs text-red-600">{errors.checkIn.message}</p>}
      </div>

      <div>
        <Label htmlFor="checkOut" className="flex items-center gap-1.5">
          <CalendarDays className="h-4 w-4 text-brand-primary" /> Check-out
        </Label>
        <input
          id="checkOut"
          type="date"
          min={tomorrowISO()}
          defaultValue={tomorrowISO()}
          {...register("checkOut")}
          className="h-11 w-full rounded-lg border border-black/10 px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
        />
        {errors.checkOut && <p className="mt-1 text-xs text-red-600">{errors.checkOut.message}</p>}
      </div>

      <div>
        <Label htmlFor="adults" className="flex items-center gap-1.5">
          <Users className="h-4 w-4 text-brand-primary" /> Adults
        </Label>
        <input
          id="adults"
          type="number"
          min={1}
          max={10}
          defaultValue={2}
          {...register("adults")}
          className="h-11 w-full rounded-lg border border-black/10 px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
        />
      </div>

      <div>
        <Label htmlFor="children" className="flex items-center gap-1.5">
          <Users className="h-4 w-4 text-brand-primary" /> Children
        </Label>
        <input
          id="children"
          type="number"
          min={0}
          max={10}
          defaultValue={0}
          {...register("children")}
          className="h-11 w-full rounded-lg border border-black/10 px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
        />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row lg:flex-col">
        <div className="flex-1">
          <Label htmlFor="numRooms" className="flex items-center gap-1.5">
            <BedDouble className="h-4 w-4 text-brand-primary" /> Rooms
          </Label>
          <input
            id="numRooms"
            type="number"
            min={1}
            max={10}
            defaultValue={1}
            {...register("numRooms")}
            className="h-11 w-full rounded-lg border border-black/10 px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
          />
        </div>
        <Button type="submit" size="lg" className="w-full lg:mt-0">
          <Search className="h-4 w-4" />
          Search Availability
        </Button>
      </div>
    </form>
  );
}
