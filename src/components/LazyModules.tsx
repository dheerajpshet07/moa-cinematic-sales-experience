"use client";

import { lazy, Suspense, useEffect, useRef, useState } from "react";

const ModulesExperience = lazy(() => import("@/components/ModulesExperience"));

export default function LazyModules() {
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
    <section ref={ref} id="modules" className="section-shell modules-shell">
      <Suspense fallback={<div className="section-inner reveal-card min-h-[720px] animate-pulse bg-white/[0.04]" />}>
        {visible ? <ModulesExperience /> : <div className="section-inner reveal-card min-h-[720px] bg-white/[0.025]" />}
      </Suspense>
    </section>
  );
}
