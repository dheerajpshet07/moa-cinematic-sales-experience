"use client";

import { useEffect, useRef, useState } from "react";
import { formatNumber } from "@/lib/utils";

type MetricCounterProps = {
  value: number;
  suffix: string;
  label: string;
  detail: string;
  delay?: number;
};

export default function MetricCounter({
  value,
  suffix,
  label,
  detail,
  delay = 0
}: MetricCounterProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return undefined;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) {
        return;
      }
      observer.disconnect();
      window.setTimeout(() => {
        const start = performance.now();
        const duration = 1450;
        const step = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(value * eased);
          if (progress < 1) {
            window.requestAnimationFrame(step);
          }
        };
        window.requestAnimationFrame(step);
      }, delay * 1000);
    }, {
      threshold: 0.4
    });

    observer.observe(node);
    const fallback = window.setTimeout(() => {
      setDisplay(value);
    }, 3200 + delay * 1000);

    return () => {
      window.clearTimeout(fallback);
      observer.disconnect();
    };
  }, [delay, value]);

  return (
    <div ref={ref} className="metric-cell">
      <div className="flex items-end gap-1">
        <span className="text-5xl font-bold text-white sm:text-6xl">{formatNumber(display)}</span>
        <span className="pb-2 text-2xl font-bold text-[#d5a546]">{suffix}</span>
      </div>
      <p className="mt-3 text-sm font-bold uppercase text-white/64">{label}</p>
      <p className="mt-5 text-sm leading-6 text-white/54">{detail}</p>
    </div>
  );
}
