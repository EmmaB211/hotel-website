"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { roomFormSchema, type RoomFormValues } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import type { RoomWithRelations } from "@/types";

export function RoomsManager({ initialRooms }: { initialRooms: RoomWithRelations[] }) {
  const [rooms, setRooms] = React.useState(initialRooms);
  const [editingRoom, setEditingRoom] = React.useState<RoomWithRelations | null>(null);
  const [isFormOpen, setIsFormOpen] = React.useState(false);

  const refresh = async () => {
    const res = await fetch("/api/admin/rooms");
    if (res.ok) {
      const json = await res.json();
      setRooms(json.rooms);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this room? This cannot be undone.")) return;
    const res = await fetch(`/api/admin/rooms/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Room deleted");
      refresh();
    } else {
      toast.error("Failed to delete room");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-charcoal">Rooms</h1>
          <p className="text-sm text-brand-charcoal/60">Manage room types, pricing, and availability.</p>
        </div>
        <Button
          onClick={() => {
            setEditingRoom(null);
            setIsFormOpen(true);
          }}
        >
          <Plus className="h-4 w-4" /> Add Room
        </Button>
      </div>

      {isFormOpen && (
        <RoomForm
          room={editingRoom}
          onClose={() => setIsFormOpen(false)}
          onSaved={() => {
            setIsFormOpen(false);
            refresh();
          }}
        />
      )}

      <div className="overflow-x-auto rounded-2xl border border-black/5 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-brand-cream text-xs uppercase text-brand-charcoal/50">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price/Night</th>
              <th className="px-4 py-3">Capacity</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {rooms.map((room) => (
              <tr key={room.id}>
                <td className="px-4 py-3 font-medium">{room.name}</td>
                <td className="px-4 py-3">{room.category}</td>
                <td className="px-4 py-3">{formatCurrency(room.pricePerNight.toString(), room.currency)}</td>
                <td className="px-4 py-3">
                  {room.maxAdults}A / {room.maxChildren}C
                </td>
                <td className="px-4 py-3">
                  <Badge variant={room.status === "AVAILABLE" ? "success" : "warning"}>{room.status}</Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setEditingRoom(room);
                        setIsFormOpen(true);
                      }}
                      className="rounded-lg p-2 hover:bg-black/5"
                      aria-label={`Edit ${room.name}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(room.id)}
                      className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                      aria-label={`Delete ${room.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rooms.length === 0 && (
          <p className="p-6 text-center text-sm text-brand-charcoal/50">No rooms yet. Add your first room.</p>
        )}
      </div>
    </div>
  );
}

function RoomForm({
  room,
  onClose,
  onSaved,
}: {
  room: RoomWithRelations | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RoomFormValues>({
    resolver: zodResolver(roomFormSchema),
    defaultValues: room
      ? {
          name: room.name,
          category: room.category,
          description: room.description,
          shortSummary: room.shortSummary || "",
          pricePerNight: Number(room.pricePerNight),
          maxAdults: room.maxAdults,
          maxChildren: room.maxChildren,
          bedType: room.bedType,
          sizeSqm: room.sizeSqm || undefined,
          totalUnits: room.totalUnits,
          status: room.status,
        }
      : {
          maxAdults: 2,
          maxChildren: 0,
          totalUnits: 1,
          status: "AVAILABLE",
        },
  });

  const onSubmit = async (values: RoomFormValues) => {
    const url = room ? `/api/admin/rooms/${room.id}` : "/api/admin/rooms";
    const method = room ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (res.ok) {
      toast.success(room ? "Room updated" : "Room created");
      onSaved();
    } else {
      toast.error("Failed to save room");
    }
  };

  return (
    <div className="rounded-2xl border border-black/5 bg-white p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-brand-charcoal">
          {room ? "Edit Room" : "Add Room"}
        </h2>
        <button onClick={onClose} aria-label="Close form" className="rounded-lg p-1.5 hover:bg-black/5">
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 grid gap-4 sm:grid-cols-2" noValidate>
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register("name")} />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Input id="category" placeholder="Standard, Deluxe, Suite..." {...register("category")} />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" {...register("description")} />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="shortSummary">Short Summary</Label>
          <Input id="shortSummary" {...register("shortSummary")} />
        </div>
        <div>
          <Label htmlFor="pricePerNight">Price / Night (UGX)</Label>
          <Input id="pricePerNight" type="number" {...register("pricePerNight")} />
        </div>
        <div>
          <Label htmlFor="bedType">Bed Type</Label>
          <Input id="bedType" placeholder="Queen, King, Twin..." {...register("bedType")} />
        </div>
        <div>
          <Label htmlFor="maxAdults">Max Adults</Label>
          <Input id="maxAdults" type="number" {...register("maxAdults")} />
        </div>
        <div>
          <Label htmlFor="maxChildren">Max Children</Label>
          <Input id="maxChildren" type="number" {...register("maxChildren")} />
        </div>
        <div>
          <Label htmlFor="sizeSqm">Size (m&sup2;)</Label>
          <Input id="sizeSqm" type="number" {...register("sizeSqm")} />
        </div>
        <div>
          <Label htmlFor="totalUnits">Total Units</Label>
          <Input id="totalUnits" type="number" {...register("totalUnits")} />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select id="status" {...register("status")}>
            <option value="AVAILABLE">Available</option>
            <option value="UNAVAILABLE">Unavailable</option>
            <option value="MAINTENANCE">Maintenance</option>
          </Select>
        </div>
        <div className="sm:col-span-2 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{room ? "Save Changes" : "Create Room"}</Button>
        </div>
      </form>
    </div>
  );
}
