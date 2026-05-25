"use client";

import { useEffect, useRef, useState } from "react";

// ── Desktop-only: هيشتغل بس لو مفيش touch screen ──────────────────────────
export default function CustomCursor() {
  const cursorDotRef   = useRef<HTMLDivElement>(null);
  const cursorRingRef  = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [label,   setLabel]   = useState("");
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    // ── شيك إن الجهاز مش touch ──────────────────────────────────────────
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    // إخفاء الـ cursor الأصلي
    document.documentElement.style.cursor = "none";

    const dot  = cursorDotRef.current;
    const ring = cursorRingRef.current;
    if (!dot || !ring) return;

    let mouseX = 0, mouseY = 0;
    let ringX  = 0, ringY  = 0;
    let raf: number;

    // ── تتبع الماوس ────────────────────────────────────────────────────
    function onMouseMove(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setVisible(true);

      // تحديث الـ dot فوراً
      dot!.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;

      // ── Label بناءً على العنصر اللي تحته ──────────────────────────
      const el = document.elementFromPoint(mouseX, mouseY);
      if (!el) { setLabel(""); return; }

      const tag = el.tagName.toLowerCase();
      const role = el.getAttribute("role");
      const isBtn    = tag === "button" || role === "button";
      const isLink   = tag === "a" || el.closest("a");
      const isInput  = ["input","textarea","select"].includes(tag);
      const isImg    = el.closest("[data-cursor='zoom']") || el.closest(".group");
      const isCart   = el.closest("[data-cursor='cart']");
      const isWish   = el.closest("[data-cursor='wish']");

      if (isCart)       setLabel("CART");
      else if (isWish)  setLabel("♥");
      else if (isBtn)   setLabel("CLICK");
      else if (isLink && isImg) setLabel("VIEW");
      else if (isLink)  setLabel("GO");
      else if (isInput) setLabel("TYPE");
      else              setLabel("");
    }

    // ── Ring يلحق بـ smooth interpolation ──────────────────────────────
    function animate() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring!.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(animate);
    }

    function onMouseLeave() { setVisible(false); }
    function onMouseEnter() { setVisible(true);  }
    function onMouseDown()  { setClicked(true);  }
    function onMouseUp()    { setClicked(false); }

    document.addEventListener("mousemove",  onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);
    document.addEventListener("mousedown",  onMouseDown);
    document.addEventListener("mouseup",    onMouseUp);
    raf = requestAnimationFrame(animate);

    return () => {
      document.documentElement.style.cursor = "";
      document.removeEventListener("mousemove",  onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      document.removeEventListener("mousedown",  onMouseDown);
      document.removeEventListener("mouseup",    onMouseUp);
      cancelAnimationFrame(raf);
    };
  }, []);

  // ── Magnetic effect على الأزرار ─────────────────────────────────────────
  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    const STRENGTH = 0.35; // قوة الجذب

    function onBtnMouseMove(e: MouseEvent) {
      const btn = e.currentTarget as HTMLElement;
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) * STRENGTH;
      const dy = (e.clientY - cy) * STRENGTH;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    }

    function onBtnMouseLeave(e: MouseEvent) {
      const btn = e.currentTarget as HTMLElement;
      btn.style.transform = "translate(0, 0)";
      btn.style.transition = "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)";
    }

    function onBtnMouseEnter(e: MouseEvent) {
      const btn = e.currentTarget as HTMLElement;
      btn.style.transition = "transform 0.1s ease";
    }

    // تطبيق على كل الأزرار والروابط في الصفحة
    function attachMagnetic() {
      const targets = document.querySelectorAll<HTMLElement>(
        "button:not([disabled]), a[href], [role='button']"
      );
      targets.forEach((el) => {
        if (el.dataset.magnetic === "attached") return;
        el.dataset.magnetic = "attached";
        el.addEventListener("mousemove",  onBtnMouseMove  as EventListener);
        el.addEventListener("mouseleave", onBtnMouseLeave as EventListener);
        el.addEventListener("mouseenter", onBtnMouseEnter as EventListener);
      });
    }

    // أول تشغيل
    attachMagnetic();

    // Observer لو اتضاف عناصر جديدة
    const observer = new MutationObserver(attachMagnetic);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* ── Dot — النقطة الصغيرة المباشرة ── */}
      <div
        ref={cursorDotRef}
        aria-hidden="true"
        className="fixed top-0 left-0 pointer-events-none z-[99999] will-change-transform"
        style={{
          opacity: visible ? 1 : 0,
          transition: "opacity 0.2s ease",
        }}
      >
        <div
          style={{
            width:  clicked ? "6px" : "8px",
            height: clicked ? "6px" : "8px",
            background: "var(--brand-accent)",
            borderRadius: "50%",
            transition: "width 0.15s ease, height 0.15s ease",
          }}
        />
      </div>

      {/* ── Ring — الحلقة اللي بتتبع بـ lag ── */}
      <div
        ref={cursorRingRef}
        aria-hidden="true"
        className="fixed top-0 left-0 pointer-events-none z-[99998] will-change-transform flex items-center justify-center"
        style={{
          opacity: visible ? 1 : 0,
          transition: "opacity 0.2s ease",
        }}
      >
        <div
          style={{
            width:  label ? "56px" : clicked ? "28px" : "36px",
            height: label ? "56px" : clicked ? "28px" : "36px",
            border: `1.5px solid ${label ? "var(--brand-accent)" : "rgba(26,26,26,0.35)"}`,
            borderRadius: "50%",
            background: label ? "var(--brand-black)" : "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "width 0.25s cubic-bezier(0.16,1,0.3,1), height 0.25s cubic-bezier(0.16,1,0.3,1), background 0.2s ease, border-color 0.2s ease",
          }}
        >
          {label && (
            <span style={{
              color: "var(--brand-accent)",
              fontSize: label === "♥" ? "14px" : "8px",
              fontWeight: 900,
              letterSpacing: "0.1em",
              userSelect: "none",
              whiteSpace: "nowrap",
            }}>
              {label}
            </span>
          )}
        </div>
      </div>
    </>
  );
}
