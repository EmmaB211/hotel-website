import { prisma } from "@/lib/prisma";
import { Trash2, Check, Star } from "lucide-react";
import { approveTestimonial, deleteTestimonial } from "@/lib/actions/admin";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export default async function AdminTestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-brand-charcoal">Testimonials</h1>
        <p className="text-sm text-brand-charcoal/60">Approve or remove guest reviews shown on the homepage.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t) => (
          <div key={t.id} className="rounded-2xl border border-black/5 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-brand-charcoal">{t.guestName}</p>
              <Badge variant={t.isApproved ? "success" : "warning"}>
                {t.isApproved ? "Approved" : "Pending"}
              </Badge>
            </div>
            <div className="mt-1 flex gap-0.5 text-brand-accent">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-3.5 w-3.5 ${i < t.rating ? "fill-current" : "text-black/10"}`} />
              ))}
            </div>
            <p className="mt-2 text-sm text-brand-charcoal/70">&ldquo;{t.review}&rdquo;</p>
            <p className="mt-2 text-xs text-brand-charcoal/40">{formatDate(t.createdAt)}</p>
            <div className="mt-4 flex gap-2">
              {!t.isApproved && (
                <form action={approveTestimonial.bind(null, t.id, true)}>
                  <button className="flex items-center gap-1.5 rounded-lg bg-brand-secondary/10 px-3 py-1.5 text-xs font-medium text-brand-secondary hover:bg-brand-secondary/20">
                    <Check className="h-3.5 w-3.5" /> Approve
                  </button>
                </form>
              )}
              <form action={deleteTestimonial.bind(null, t.id)}>
                <button className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100">
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
      {testimonials.length === 0 && (
        <p className="text-center text-sm text-brand-charcoal/50">No testimonials yet.</p>
      )}
    </div>
  );
}
