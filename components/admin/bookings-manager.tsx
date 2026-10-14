"use client";

import * as React from "react";
import { toast } from "sonner";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { BookingWithRelations } from "@/types";

const statusOptions = ["PENDING", "CONFIRMED", "CHECKED_IN", "COMPLETED", "CANCELLED"] as const;

export function BookingsManager({ initialBookings }: { initialBookings: BookingWithRelations[] }) {
  const [bookings, setBookings] = React.useState(initialBookings);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("");

  const fetchBookings = React.useCallback(async () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (statusFilter) params.set("status", statusFilter);
    const res = await fetch(`/api/admin/bookings?${params.toString()}`);
    if (res.ok) {
      const json = await res.json();
      setBookings(json.bookings);
    }
  }, [search, statusFilter]);

  React.useEffect(() => {
    const timeout = setTimeout(fetchBookings, 300);
    return () => clearTimeout(timeout);
  }, [fetchBookings]);

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/admin/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      toast.success("Booking status updated");
      fetchBookings();
    } else {
      toast.error("Failed to update booking");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-brand-charcoal">Bookings</h1>
        <p className="text-sm text-brand-charcoal/60">View, search, and manage guest reservations.</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-charcoal/40" />
          <Input
            placeholder="Search by reference, guest name, or email..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="sm:w-52">
          <option value="">All Statuses</option>
          {statusOptions.map((s) => (
            <option key={s} value={s}>
              {s.replace("_", " ")}
            </option>
          ))}
        </Select>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-black/5 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-brand-cream text-xs uppercase text-brand-charcoal/50">
            <tr>
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3">Guest</th>
              <th className="px-4 py-3">Room</th>
              <th className="px-4 py-3">Dates</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {bookings.map((b) => (
              <tr key={b.id}>
                <td className="px-4 py-3 font-medium">{b.reference}</td>
                <td className="px-4 py-3">
                  <div>{b.guest.fullName}</div>
                  <div className="text-xs text-brand-charcoal/50">{b.guest.email}</div>
                </td>
                <td className="px-4 py-3">{b.room.name}</td>
                <td className="px-4 py-3 text-xs">
                  {formatDate(b.checkIn)} — {formatDate(b.checkOut)}
                </td>
                <td className="px-4 py-3">{formatCurrency(b.totalAmount.toString(), b.currency)}</td>
                <td className="px-4 py-3">
                  <Select
                    value={b.status}
                    onChange={(e) => updateStatus(b.id, e.target.value)}
                    className="h-9 w-40"
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>
                        {s.replace("_", " ")}
                      </option>
                    ))}
                  </Select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {bookings.length === 0 && (
          <p className="p-6 text-center text-sm text-brand-charcoal/50">No bookings found.</p>
        )}
      </div>
    </div>
  );
}
