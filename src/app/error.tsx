"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
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
    <section className="flex flex-col items-center justify-center min-h-[60vh] bg-[#F8F7F3] px-4">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 border border-red-100 mb-6">
        <AlertTriangle className="h-7 w-7 text-red-500" />
      </div>
      <h2 className="text-2xl font-bold text-[#101114] mb-2">
        Something went wrong
      </h2>
      <p className="text-gray-500 mb-6 text-center max-w-md">
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      <Button onClick={reset} variant="default" size="lg">
        Try again
      </Button>
    </section>
  );
}
