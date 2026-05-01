"use client";

import { useState } from "react";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const paths = [
  {
    id: "flagship",
    title: "Flagship",
    fit: "Category leaders building a Midwest destination address.",
    points: ["High-visibility corridors", "Tourist + regional traffic", "Launch moments tied to events"]
  },
  {
    id: "luxury",
    title: "Luxury",
    fit: "Premium brands that need audience breadth without losing polish.",
    points: ["Elevated adjacencies", "Private-client programming", "Editorial visual system"]
  },
  {
    id: "fnb",
    title: "F&B",
    fit: "Restaurants and concepts that convert dwell time into repeat habit.",
    points: ["45+ eatery ecosystem", "Family and traveler demand", "Event-driven surges"]
  },
  {
    id: "popup",
    title: "Pop-up",
    fit: "Fast activation for launches, seasonal retail, and market testing.",
    points: ["Short-cycle openings", "Digital amplification", "Measured conversion windows"]
  }
] as const;

export default function LeasingModule() {
  const [activeId, setActiveId] = useState<(typeof paths)[number]["id"]>("flagship");
  const active = paths.find((path) => path.id === activeId) ?? paths[0];

  return (
    <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
      <div className="glass rounded-[8px] p-5">
        <p className="eyebrow">Leasing</p>
        <h3 className="mt-5 text-4xl font-bold leading-none text-white">Choose the right presence.</h3>
        <div className="mt-8 grid gap-2">
          {paths.map((path) => (
            <button
              key={path.id}
              type="button"
              onClick={() => setActiveId(path.id)}
              className={cn(
                "rounded-[8px] border p-4 text-left transition",
                activeId === path.id
                  ? "border-[#d5a546] bg-[#d5a546] text-black"
                  : "border-white/10 bg-white/[0.04] text-white/68 hover:border-white/28 hover:text-white"
              )}
            >
              <span className="text-lg font-bold">{path.title}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="reveal-card min-h-[420px] p-6">
        <div
          className="absolute inset-0 module-image opacity-68 saturate-[1.15]"
          style={{ backgroundImage: "url('/media/leasing-module.webp')" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.74),rgba(0,0,0,0.26))]" />
        <div className="relative z-10 max-w-xl">
          <p className="text-sm font-bold uppercase text-[#d5a546]">Path: {active.title}</p>
          <h4 className="mt-4 text-5xl font-bold leading-none text-white">{active.fit}</h4>
          <div className="mt-8 space-y-4">
            {active.points.map((point) => (
              <div key={point} className="flex items-start gap-3 text-white/76">
                <CheckCircle2 size={18} aria-hidden="true" className="mt-1 shrink-0 text-[#8dd35f]" />
                <span>{point}</span>
              </div>
            ))}
          </div>
          <a
            href="https://www.mallofamerica.com/leasing"
            target="_blank"
            rel="noreferrer"
            className="cta-button mt-10"
          >
            Start leasing conversation
            <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
}
