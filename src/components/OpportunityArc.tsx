"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Building2, Radio, Sparkles, UsersRound } from "lucide-react";
import MetricCounter from "@/components/MetricCounter";
import { mallFacts } from "@/data/mall";
import { cn } from "@/lib/utils";

const arcMoments = [
  {
    id: "scale",
    eyebrow: "Scale",
    title: "First, make the audience undeniable.",
    copy:
      "The commercial story begins with proof of gravity: millions of visits, a city-scale footprint, and demand that a single tenant or sponsor could not manufacture alone.",
    image: "/media/ai-scale-concept.webp",
    video: null,
    videoWebm: null,
    icon: UsersRound,
    accent: "#f1bd4f",
    proof: "32M+ annual guests"
  },
  {
    id: "energy",
    eyebrow: "Energy",
    title: "Then show the property in motion.",
    copy:
      "Movement turns facts into desire. The prospect sees lights, crowd paths, media surfaces, and attraction energy behaving like a live commercial stage.",
    image: "/media/ai-energy-concept.webp",
    video: "/media/ai-activation-loop.mp4",
    videoWebm: "/media/ai-activation-loop.webm",
    icon: Radio,
    accent: "#40d8d0",
    proof: "400+ hosted events"
  },
  {
    id: "ownership",
    eyebrow: "Ownership",
    title: "Finally, make the opportunity feel personal.",
    copy:
      "The pitch resolves when the viewer can imagine their brand, store, or launch owning a real moment inside the destination.",
    image: "/media/ai-ownership-concept.webp",
    video: null,
    videoWebm: null,
    icon: Building2,
    accent: "#f36b3f",
    proof: "Leasing, sponsorship, events"
  }
] as const;

type ArcId = (typeof arcMoments)[number]["id"];

export default function OpportunityArc() {
  const [activeId, setActiveId] = useState<ArcId>("energy");
  const [videoReady, setVideoReady] = useState(false);

  const active = useMemo(
    () => arcMoments.find((moment) => moment.id === activeId) ?? arcMoments[1],
    [activeId]
  );
  const ActiveIcon = active.icon;

  return (
    <section id="arc" className="arc-shell section-shell overflow-hidden">
      <div className="section-inner">
        <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
          <div data-reveal>
            <p className="eyebrow">Narrative arc</p>
            <h2 className="section-title mt-5">Scale becomes energy. Energy becomes opportunity.</h2>
          </div>
          <p data-reveal className="body-large">
            Instead of separate proof blocks, the sales story now moves through a single emotional
            sequence: prove the audience, make the place feel alive, then invite the prospect to
            imagine ownership.
          </p>
        </div>

        <div className="arc-board mt-10 grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="reveal-card min-h-[680px] bg-[#070504]">
            <Image
              key={`${active.id}-still`}
              src={active.image}
              alt=""
              fill
              sizes="(max-width: 1280px) 100vw, 70vw"
              className="object-cover opacity-95 saturate-[1.18]"
              unoptimized
            />
            {active.video ? (
              <video
                key={active.video}
                className={cn(
                  "absolute inset-0 h-full w-full object-cover saturate-[1.2] transition duration-700",
                  videoReady ? "opacity-82" : "opacity-0"
                )}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster={active.image}
                onCanPlay={() => setVideoReady(true)}
                onLoadedData={() => setVideoReady(true)}
              >
                {active.videoWebm ? <source src={active.videoWebm} type="video/webm" /> : null}
                <source src={active.video} type="video/mp4" />
              </video>
            ) : null}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.68),rgba(0,0,0,0.1)_54%,rgba(0,0,0,0.42))]" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.62))]" />
            <div className="arc-lens" style={{ backgroundColor: active.accent }} />

            <div className="absolute left-4 right-4 top-4 z-10 flex flex-wrap items-center justify-between gap-3">
              <span className="media-badge">AI-generated concept motion</span>
              <span className="media-badge">Real MOA media base</span>
            </div>

            <motion.div
              key={active.id}
              className="absolute bottom-0 left-0 z-10 max-w-3xl p-5 sm:p-8 lg:p-10"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                className="inline-flex h-12 w-12 items-center justify-center rounded-full text-black"
                style={{ backgroundColor: active.accent }}
              >
                <ActiveIcon size={20} aria-hidden="true" />
              </div>
              <p className="mt-6 text-sm font-bold uppercase" style={{ color: active.accent }}>
                {active.eyebrow}
              </p>
              <h3 className="mt-3 max-w-2xl text-4xl font-bold leading-none text-white sm:text-6xl">
                {active.title}
              </h3>
              <p className="mt-5 max-w-2xl text-base leading-7 text-white/72">{active.copy}</p>
            </motion.div>

            <div className="absolute right-4 top-20 z-10 hidden w-64 rounded-[8px] border border-white/14 bg-black/42 p-4 backdrop-blur-2xl md:block">
              <p className="text-xs font-bold uppercase text-white/42">Commercial proof</p>
              <p className="mt-3 text-3xl font-bold leading-none text-white">{active.proof}</p>
            </div>
          </div>

          <aside className="glass rounded-[8px] p-5">
            <div className="grid gap-3">
              {arcMoments.map((moment, index) => {
                const Icon = moment.icon;
                const selected = moment.id === activeId;
                return (
                  <button
                    key={moment.id}
                    type="button"
                    onClick={() => {
                      setActiveId(moment.id);
                      setVideoReady(false);
                    }}
                    className={cn(
                      "rounded-[8px] border p-4 text-left transition duration-300",
                      selected
                        ? "border-white/28 bg-white text-black"
                        : "border-white/10 bg-white/[0.04] text-white hover:border-white/28"
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                        style={{
                          backgroundColor: selected ? moment.accent : "rgba(255,255,255,0.08)",
                          color: selected ? "#050506" : moment.accent
                        }}
                      >
                        <Icon size={18} aria-hidden="true" />
                      </span>
                      <span>
                        <span className="block text-xs font-bold uppercase opacity-60">
                          Chapter 0{index + 1}
                        </span>
                        <span className="mt-1 block text-2xl font-bold leading-none">{moment.eyebrow}</span>
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 rounded-[8px] border border-white/12 bg-black/30 p-4">
              <Sparkles size={20} className="text-[#f1bd4f]" aria-hidden="true" />
              <p className="mt-4 text-lg font-bold leading-6 text-white">
                The generated layer previews what the real partnership could become.
              </p>
              <p className="mt-3 text-sm leading-6 text-white/56">
                It makes the sales promise visual before the production plan exists.
              </p>
            </div>

            <a href="#takeover" className="cta-button mt-5 w-full">
              Personalize the moment
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </aside>
        </div>

        <div className="metric-grid mt-10">
          {mallFacts.map((fact, index) => (
            <MetricCounter key={fact.label} {...fact} delay={index * 0.08} />
          ))}
        </div>
      </div>
    </section>
  );
}
