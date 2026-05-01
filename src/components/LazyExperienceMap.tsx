"use client";

import { lazy, Suspense, useEffect, useRef, useState } from "react";

const ExperienceMap = lazy(() => import("@/components/ExperienceMap"));

export default function LazyExperienceMap() {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return undefined;
    }
    const shouldLoad = () => {
      if (window.scrollY + window.innerHeight * 2.2 >= node.offsetTop) {
        setVisible(true);
        return true;
      }
      return false;
    };
    if (shouldLoad()) {
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "900px 0px 900px 0px" }
    );
    const onScroll = () => {
      if (shouldLoad()) {
        observer.disconnect();
        window.removeEventListener("scroll", onScroll);
      }
    };
    observer.observe(node);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section ref={ref} id="takeover" className="section-shell overflow-hidden">
      <Suspense fallback={<div className="section-inner reveal-card min-h-[680px] animate-pulse bg-white/[0.04]" />}>
        {visible ? <ExperienceMap /> : <div className="section-inner reveal-card min-h-[680px] bg-white/[0.025]" />}
      </Suspense>
    </section>
  );
}
