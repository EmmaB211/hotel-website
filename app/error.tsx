"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="font-display text-2xl font-semibold text-brand-charcoal">Something Went Wrong</h1>
      <p className="mt-2 max-w-md text-brand-charcoal/60">
        We&apos;re sorry, an unexpected error occurred. Please try again or contact us if the problem persists.
      </p>
      <Button onClick={() => reset()} className="mt-6">
        Try Again
      </Button>
    </div>
  );
}
