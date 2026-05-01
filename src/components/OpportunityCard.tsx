"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { opportunityModules } from "@/data/mall";

type Module = (typeof opportunityModules)[number];

type OpportunityCardProps = {
  module: Module;
  active: boolean;
  onSelect: () => void;
};

export default function OpportunityCard({ module, active, onSelect }: OpportunityCardProps) {
  const Icon = module.icon;

  return (
    <button
      type="button"
      onClick={onSelect}
      className="group reveal-card min-h-[25rem] w-full overflow-hidden text-left transition duration-500 hover:-translate-y-1"
      aria-pressed={active}
    >
      <Image
        src={module.image}
        alt=""
        fill
        sizes="(max-width: 1024px) 100vw, 25vw"
        className="object-cover opacity-90 saturate-[1.12] transition duration-1000 group-hover:scale-[1.035] group-hover:opacity-100 group-hover:saturate-[1.25]"
        loading="lazy"
        unoptimized
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.68))]" />
      <div className="absolute inset-0 flex flex-col justify-between p-5">
        <div className="flex items-center justify-between">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/18 bg-black/35 backdrop-blur-xl">
            <Icon aria-hidden="true" size={20} />
          </span>
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/18 bg-white/10 transition group-hover:bg-white group-hover:text-black">
            <ArrowUpRight aria-hidden="true" size={18} />
          </span>
        </div>
        <div>
          <p className="text-sm font-bold uppercase text-white/60">{module.label}</p>
          <h3 className="mt-2 text-3xl font-bold text-white">{module.title}</h3>
          <p className="mt-4 max-h-0 overflow-hidden text-sm leading-6 text-white/68 opacity-0 transition-all duration-500 group-hover:max-h-28 group-hover:opacity-100">
            {module.copy}
          </p>
          {active ? (
            <div className="mt-5 h-1 w-20 rounded-full bg-[#d5a546]" aria-hidden="true" />
          ) : null}
        </div>
      </div>
    </button>
  );
}
