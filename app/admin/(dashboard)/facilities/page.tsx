import { prisma } from "@/lib/prisma";
import { Trash2, Power } from "lucide-react";
import { createFacility, toggleFacilityActive, deleteFacility } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { facilityIconMap } from "@/lib/icon-map";

export default async function AdminFacilitiesPage() {
  const facilities = await prisma.facility.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-brand-charcoal">Facilities</h1>
        <p className="text-sm text-brand-charcoal/60">Manage the facilities shown on the public website.</p>
      </div>

      <div className="rounded-2xl border border-black/5 bg-white p-6">
        <h2 className="font-display text-lg font-semibold text-brand-charcoal">Add Facility</h2>
        <form action={createFacility} className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" required />
          </div>
          <div>
            <Label htmlFor="icon">Icon Key</Label>
            <Input id="icon" name="icon" placeholder={Object.keys(facilityIconMap).join(", ")} />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" required />
          </div>
          <div>
            <Label htmlFor="openingHours">Opening Hours</Label>
            <Input id="openingHours" name="openingHours" placeholder="e.g. 7:00 AM - 7:00 PM" />
          </div>
          <div>
            <Label htmlFor="additionalInfo">Additional Info</Label>
            <Input id="additionalInfo" name="additionalInfo" />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit">Add Facility</Button>
          </div>
        </form>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-black/5 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-brand-cream text-xs uppercase text-brand-charcoal/50">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {facilities.map((f) => (
              <tr key={f.id}>
                <td className="px-4 py-3 font-medium">{f.name}</td>
                <td className="max-w-xs truncate px-4 py-3 text-brand-charcoal/60">{f.description}</td>
                <td className="px-4 py-3">
                  <Badge variant={f.isActive ? "success" : "neutral"}>
                    {f.isActive ? "Active" : "Inactive"}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <form action={toggleFacilityActive.bind(null, f.id, !f.isActive)}>
                      <button className="rounded-lg p-2 hover:bg-black/5" aria-label="Toggle active">
                        <Power className="h-4 w-4" />
                      </button>
                    </form>
                    <form action={deleteFacility.bind(null, f.id)}>
                      <button className="rounded-lg p-2 text-red-600 hover:bg-red-50" aria-label="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {facilities.length === 0 && (
          <p className="p-6 text-center text-sm text-brand-charcoal/50">No facilities yet.</p>
        )}
      </div>
    </div>
  );
}
