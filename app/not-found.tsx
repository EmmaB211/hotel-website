import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <span className="font-display text-7xl font-bold text-brand-primary">404</span>
      <h1 className="mt-4 font-display text-2xl font-semibold text-brand-charcoal">Page Not Found</h1>
      <p className="mt-2 max-w-md text-brand-charcoal/60">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/" className={buttonVariants({ variant: "primary", size: "lg" }) + " mt-6"}>
        Return to Homepage
      </Link>
    </div>
  );
}
