"use client";

import { useEffect, useState } from "react";

export default function CursorAura() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    setEnabled(canHover);

    if (!canHover) {
      return;
    }

    const aura = document.querySelector<HTMLElement>("[data-cursor-aura]");
    const onMove = (event: PointerEvent) => {
      if (!aura) {
        return;
      }
      aura.style.transform = `translate3d(${event.clientX - 80}px, ${event.clientY - 80}px, 0)`;
    };

    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  if (!enabled) {
    return null;
  }

  return (
    <div
      data-cursor-aura
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-50 h-40 w-40 rounded-full opacity-60 mix-blend-screen blur-2xl transition-transform duration-200 ease-out"
      style={{
        background:
          "radial-gradient(circle, rgba(213,165,70,0.32), rgba(81,210,205,0.12) 34%, transparent 68%)"
      }}
    />
  );
}
