import { prisma } from "@/lib/prisma";
import { Trash2 } from "lucide-react";
import { createAttraction, deleteAttraction } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default async function AdminTourismPage() {
  const attractions = await prisma.touristAttraction.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-brand-charcoal">Tourism</h1>
        <p className="text-sm text-brand-charcoal/60">Manage tourist attractions shown on the tourism page.</p>
      </div>

      <div className="rounded-2xl border border-black/5 bg-white p-6">
        <h2 className="font-display text-lg font-semibold text-brand-charcoal">Add Attraction</h2>
        <form action={createAttraction} className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" required />
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input id="location" name="location" required />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" required />
          </div>
          <div>
            <Label htmlFor="distanceFromHotel">Distance From Hotel</Label>
            <Input id="distanceFromHotel" name="distanceFromHotel" placeholder="e.g. 12 km" />
          </div>
          <div>
            <Label htmlFor="travelTime">Travel Time</Label>
            <Input id="travelTime" name="travelTime" placeholder="e.g. 20 minutes" />
          </div>
          <div>
            <Label htmlFor="thingsToDo">Things To Do (comma separated)</Label>
            <Input id="thingsToDo" name="thingsToDo" placeholder="Hiking, Photography, ..." />
          </div>
          <div>
            <Label htmlFor="image">Image URL</Label>
            <Input id="image" name="image" placeholder="https://..." />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit">Add Attraction</Button>
          </div>
        </form>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-black/5 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-brand-cream text-xs uppercase text-brand-charcoal/50">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Distance</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {attractions.map((a) => (
              <tr key={a.id}>
                <td className="px-4 py-3 font-medium">{a.name}</td>
                <td className="px-4 py-3">{a.location}</td>
                <td className="px-4 py-3">{a.distanceFromHotel || "—"}</td>
                <td className="px-4 py-3">
                  <form action={deleteAttraction.bind(null, a.id)} className="flex justify-end">
                    <button className="rounded-lg p-2 text-red-600 hover:bg-red-50" aria-label="Delete">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {attractions.length === 0 && (
          <p className="p-6 text-center text-sm text-brand-charcoal/50">No attractions yet.</p>
        )}
      </div>
    </div>
  );
}
