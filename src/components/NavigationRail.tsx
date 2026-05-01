"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { navItems } from "@/data/navigation";
import { cn } from "@/lib/utils";

export default function NavigationRail() {
  const [activeId, setActiveId] = useState<(typeof navItems)[number]["id"]>(navItems[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) {
          setActiveId(visible.target.id as (typeof navItems)[number]["id"]);
        }
      },
      { rootMargin: "-38% 0px -50% 0px", threshold: [0.05, 0.2, 0.45] }
    );

    navItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  const jumpTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav
      aria-label="Experience navigation"
      className="fixed bottom-4 left-1/2 z-40 hidden w-[calc(100%-1.5rem)] max-w-5xl -translate-x-1/2 rounded-full border border-white/12 bg-black/48 px-2 py-2 shadow-2xl backdrop-blur-2xl md:block lg:bottom-6"
    >
      <div className="flex items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => jumpTo(item.id)}
            className={cn(
              "min-h-10 shrink-0 rounded-full px-4 text-sm font-semibold text-white/56 transition",
              activeId === item.id && "bg-white text-black",
              activeId !== item.id && "hover:bg-white/10 hover:text-white"
            )}
          >
            {item.label}
          </button>
        ))}
        <a
          href="https://www.mallofamerica.com/leasing"
          target="_blank"
          rel="noreferrer"
          className="ml-auto inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full bg-[#d5a546] px-4 text-sm font-bold text-black transition hover:bg-[#f3ca76]"
        >
          Inquire
          <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      </div>
    </nav>
  );
}
