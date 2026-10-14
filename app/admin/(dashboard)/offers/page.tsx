import { prisma } from "@/lib/prisma";
import { Trash2, Power } from "lucide-react";
import { createOffer, toggleOfferActive, deleteOffer } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function AdminOffersPage() {
  const offers = await prisma.specialOffer.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-brand-charcoal">Special Offers</h1>
        <p className="text-sm text-brand-charcoal/60">Manage promotional packages shown on the homepage.</p>
      </div>

      <div className="rounded-2xl border border-black/5 bg-white p-6">
        <h2 className="font-display text-lg font-semibold text-brand-charcoal">Create Offer</h2>
        <form action={createOffer} className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" required />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" required />
          </div>
          <div>
            <Label htmlFor="originalPrice">Original Price (UGX)</Label>
            <Input id="originalPrice" name="originalPrice" type="number" />
          </div>
          <div>
            <Label htmlFor="discountedPrice">Discounted Price (UGX)</Label>
            <Input id="discountedPrice" name="discountedPrice" type="number" />
          </div>
          <div>
            <Label htmlFor="validFrom">Valid From</Label>
            <Input id="validFrom" name="validFrom" type="date" required />
          </div>
          <div>
            <Label htmlFor="validTo">Valid To</Label>
            <Input id="validTo" name="validTo" type="date" required />
          </div>
          <div>
            <Label htmlFor="image">Image URL</Label>
            <Input id="image" name="image" placeholder="https://..." />
          </div>
          <div>
            <Label htmlFor="terms">Terms</Label>
            <Input id="terms" name="terms" />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit">Create Offer</Button>
          </div>
        </form>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-black/5 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-brand-cream text-xs uppercase text-brand-charcoal/50">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Valid Until</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {offers.map((o) => (
              <tr key={o.id}>
                <td className="px-4 py-3 font-medium">{o.title}</td>
                <td className="px-4 py-3">
                  {o.discountedPrice ? formatCurrency(o.discountedPrice.toString(), o.currency) : "—"}
                </td>
                <td className="px-4 py-3">{formatDate(o.validTo)}</td>
                <td className="px-4 py-3">
                  <Badge variant={o.isActive ? "success" : "neutral"}>{o.isActive ? "Active" : "Disabled"}</Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <form action={toggleOfferActive.bind(null, o.id, !o.isActive)}>
                      <button className="rounded-lg p-2 hover:bg-black/5" aria-label="Toggle active">
                        <Power className="h-4 w-4" />
                      </button>
                    </form>
                    <form action={deleteOffer.bind(null, o.id)}>
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
        {offers.length === 0 && <p className="p-6 text-center text-sm text-brand-charcoal/50">No offers yet.</p>}
      </div>
    </div>
  );
}
