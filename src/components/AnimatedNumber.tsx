"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedNumberProps {
  value: number;
  duration?: number;       // ms
  className?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export default function AnimatedNumber({
  value,
  duration = 600,
  className = "",
  prefix = "",
  suffix = "",
  decimals = 0,
}: AnimatedNumberProps) {
  const [display, setDisplay] = useState(value);
  const prevRef  = useRef(value);
  const rafRef   = useRef<number>();
  const startRef = useRef<number>();

  useEffect(() => {
    const from = prevRef.current;
    const to   = value;
    if (from === to) return;

    // إلغاء أي animation شغالة
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    startRef.current = undefined;

    // easeOutExpo
    function easeOutExpo(t: number) {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function tick(timestamp: number) {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed  = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = easeOutExpo(progress);
      const current  = from + (to - from) * eased;

      setDisplay(current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDisplay(to);
        prevRef.current = to;
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [value, duration]);

  const formatted = decimals > 0
    ? display.toFixed(decimals)
    : Math.round(display).toLocaleString("en-EG");

  return (
    <span className={className}>
      {prefix}{formatted}{suffix}
    </span>
  );
}
