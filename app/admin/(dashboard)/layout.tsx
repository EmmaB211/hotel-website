import { redirect } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  BedDouble,
  CalendarCheck,
  Waves,
  UtensilsCrossed,
  Images,
  Compass,
  Tag,
  MessageSquareQuote,
  LogOut,
} from "lucide-react";
import { getSession } from "@/lib/auth";
import { logoutAdmin } from "@/lib/actions/admin";
import { siteConfig } from "@/config/site";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/rooms", label: "Rooms", icon: BedDouble },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/admin/facilities", label: "Facilities", icon: Waves },
  { href: "/admin/restaurant", label: "Restaurant", icon: UtensilsCrossed },
  { href: "/admin/gallery", label: "Gallery", icon: Images },
  { href: "/admin/tourism", label: "Tourism", icon: Compass },
  { href: "/admin/offers", label: "Offers", icon: Tag },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
];

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="flex min-h-screen bg-brand-cream">
      <aside className="hidden w-64 flex-col bg-brand-charcoal text-white/80 lg:flex">
        <div className="px-6 py-6">
          <span className="font-display text-lg font-bold text-white">{siteConfig.shortName}</span>
          <p className="text-xs text-white/50">Admin Dashboard</p>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-white/10 hover:text-white"
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <form action={logoutAdmin} className="p-3">
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-white/10 hover:text-white">
            <LogOut className="h-4 w-4" /> Log Out
          </button>
        </form>
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-black/5 bg-white px-6 py-4 lg:hidden">
          <span className="font-display text-lg font-bold text-brand-charcoal">{siteConfig.shortName} Admin</span>
          <form action={logoutAdmin}>
            <button className="text-sm font-medium text-brand-primary">Log Out</button>
          </form>
        </header>
        <main className="p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
