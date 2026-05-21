"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center px-4 text-center overflow-hidden">
      {/* Animated background number */}
      <div
        className={`absolute text-[20rem] font-black text-gray-100 select-none pointer-events-none leading-none
          transition-all duration-1000 ${mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
        aria-hidden="true"
      >
        404
      </div>

      {/* Content */}
      <div className={`relative z-10 transition-all duration-700 delay-200 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400 mb-6">
          PAGE NOT FOUND
        </p>

        <h1 className="text-4xl sm:text-5xl font-black tracking-[-0.04em] text-[#1A1A1A] mb-4 leading-none">
          LOST IN<br/>THE VOID.
        </h1>

        <p className="text-sm text-gray-400 max-w-xs mx-auto leading-relaxed mb-10">
          The page you&apos;re looking for has been dropped, moved, or never existed.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
          <Link
            href="/"
            className="px-8 py-4 bg-[#1A1A1A] text-white text-[11px] font-black tracking-[0.2em] uppercase hover:bg-[#333] transition-colors"
          >
            Back to Store
          </Link>
          <Link
            href="/track"
            className="px-8 py-4 border border-gray-200 text-[#1A1A1A] text-[11px] font-black tracking-[0.2em] uppercase hover:border-[#1A1A1A] transition-colors"
          >
            Track Order
          </Link>
        </div>

        <p className="mt-12 text-[10px] font-black tracking-[0.25em] text-gray-300">ASO CLO.</p>
      </div>
    </div>
  );
}
