"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to monitoring service in production
    console.error("Global Error Boundary:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#FAF9F6] flex items-center justify-center px-4 text-center font-sans">
        <div>
          <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400 mb-4">
            UNEXPECTED ERROR
          </p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#1A1A1A] mb-3 leading-tight">
            SOMETHING<br/>WENT WRONG.
          </h1>
          <p className="text-sm text-gray-400 max-w-sm mx-auto mb-8 leading-relaxed">
            An unexpected error occurred. Our team has been notified.
            {error.digest && (
              <span className="block mt-2 font-mono text-[10px] text-gray-300">
                Error ID: {error.digest}
              </span>
            )}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={reset}
              className="px-6 py-3 bg-[#1A1A1A] text-white text-[11px] font-black tracking-[0.15em] uppercase hover:bg-[#333] transition-colors"
            >
              Try Again
            </button>
            <Link
              href="/"
              className="px-6 py-3 border border-gray-200 text-[11px] font-black tracking-[0.15em] uppercase text-[#1A1A1A] hover:border-[#1A1A1A] transition-colors"
            >
              Go Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
