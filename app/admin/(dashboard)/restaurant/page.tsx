import { prisma } from "@/lib/prisma";
import { Trash2, Power } from "lucide-react";
import { createMenuItem, toggleMenuItemAvailability, deleteMenuItem } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

const categories = [
  "BREAKFAST",
  "STARTERS",
  "MAIN_COURSE",
  "LOCAL_CUISINE",
  "INTERNATIONAL_CUISINE",
  "DESSERTS",
  "BEVERAGES",
];

export default async function AdminRestaurantPage() {
  const menuItems = await prisma.menuItem.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-brand-charcoal">Restaurant Menu</h1>
        <p className="text-sm text-brand-charcoal/60">Manage digital menu items shown on the public site.</p>
      </div>

      <div className="rounded-2xl border border-black/5 bg-white p-6">
        <h2 className="font-display text-lg font-semibold text-brand-charcoal">Add Menu Item</h2>
        <form action={createMenuItem} className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" required />
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
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" required />
          </div>
          <div>
            <Label htmlFor="price">Price (UGX)</Label>
            <Input id="price" name="price" type="number" required />
          </div>
          <div>
            <Label htmlFor="image">Image URL</Label>
            <Input id="image" name="image" placeholder="https://..." />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit">Add Menu Item</Button>
          </div>
        </form>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-black/5 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-brand-cream text-xs uppercase text-brand-charcoal/50">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {menuItems.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-3 font-medium">{item.name}</td>
                <td className="px-4 py-3">{item.category.replace("_", " ")}</td>
                <td className="px-4 py-3">{formatCurrency(item.price.toString(), item.currency)}</td>
                <td className="px-4 py-3">
                  <Badge variant={item.isAvailable ? "success" : "neutral"}>
                    {item.isAvailable ? "Available" : "Unavailable"}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <form action={toggleMenuItemAvailability.bind(null, item.id, !item.isAvailable)}>
                      <button className="rounded-lg p-2 hover:bg-black/5" aria-label="Toggle availability">
                        <Power className="h-4 w-4" />
                      </button>
                    </form>
                    <form action={deleteMenuItem.bind(null, item.id)}>
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
        {menuItems.length === 0 && (
          <p className="p-6 text-center text-sm text-brand-charcoal/50">No menu items yet.</p>
        )}
      </div>
    </div>
  );
}
