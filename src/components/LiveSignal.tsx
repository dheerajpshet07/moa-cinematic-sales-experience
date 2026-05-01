"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Radio, UsersRound, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const signals = [
  {
    id: "leasing",
    label: "Leasing signal",
    title: "Show the traffic, then show the lease.",
    metric: "32M+",
    detail: "annual guests",
    icon: UsersRound,
    copy:
      "Real movement matters. The prospect sees that this is not an abstract audience segment; it is a place people already choose."
  },
  {
    id: "sponsor",
    label: "Sponsor signal",
    title: "Turn attention into inventory.",
    metric: "360",
    detail: "degrees of presence",
    icon: Radio,
    copy:
      "A sponsor can imagine media, signage, sampling, content, and crowd response in the same physical moment."
  },
  {
    id: "event",
    label: "Event signal",
    title: "Make the venue feel bookable now.",
    metric: "400+",
    detail: "events every year",
    icon: Zap,
    copy:
      "The sales story becomes tangible: the property is already a stage, and the next launch can belong inside it."
  }
] as const;

type SignalId = (typeof signals)[number]["id"];

export default function LiveSignal() {
  const [activeId, setActiveId] = useState<SignalId>("leasing");
  const [videoReady, setVideoReady] = useState(false);
  const active = signals.find((signal) => signal.id === activeId) ?? signals[0];
  const Icon = active.icon;

  return (
    <>
      <div className="section-inner">
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <div data-reveal>
            <p className="eyebrow">Live property signal</p>
            <h2 className="section-title mt-5">Proof you can feel.</h2>
          </div>
          <p data-reveal className="body-large">
            The pitch becomes harder to ignore when the viewer sees real movement,
            hears the optional room tone, and reads the same property through
            leasing, sponsorship, and event demand.
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-[1fr_390px]">
          <div className="reveal-card min-h-[620px] bg-[#050506]">
            <video
              className={cn(
                "absolute inset-0 h-full w-full object-cover saturate-[1.18] transition duration-1000",
                videoReady ? "opacity-88" : "opacity-0"
              )}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster="/media/events-platform.webp"
              onCanPlay={() => setVideoReady(true)}
              onLoadedData={() => setVideoReady(true)}
            >
              <source src="/media/moa-live.webm" type="video/webm" />
              <source src="/media/moa-live.mp4" type="video/mp4" />
            </video>
            <div
              className="absolute inset-0 bg-cover bg-center transition duration-700"
              style={{
                backgroundImage: "url('/media/events-platform.webp')",
                opacity: videoReady ? 0 : 0.72
              }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.68),rgba(0,0,0,0.08)_52%,rgba(0,0,0,0.46))]" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.5))]" />
            <div className="absolute left-5 right-5 top-5 flex flex-wrap items-center justify-between gap-3">
              <div className="media-badge">
                Official media motion
              </div>
              <div className="flex items-center gap-2 rounded-full border border-white/14 bg-black/42 px-3 py-2 text-xs font-bold uppercase text-white/54 backdrop-blur-xl">
                <span className="h-2 w-2 rounded-full bg-[#8dd35f] shadow-[0_0_18px_rgba(141,211,95,0.8)]" />
                On property
              </div>
            </div>

            <motion.div
              key={active.id}
              className="absolute bottom-0 left-0 max-w-2xl p-5 sm:p-8 lg:p-10"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-black">
                <Icon size={20} aria-hidden="true" />
              </div>
              <p className="mt-6 text-sm font-bold uppercase text-[#d5a546]">{active.label}</p>
              <h3 className="mt-3 text-4xl font-bold leading-none text-white sm:text-6xl">
                {active.title}
              </h3>
              <p className="mt-5 max-w-xl text-base leading-7 text-white/68">{active.copy}</p>
            </motion.div>
          </div>

          <aside className="glass rounded-[8px] p-5">
            <div className="grid gap-3">
              {signals.map((signal) => (
                <button
                  key={signal.id}
                  type="button"
                  onClick={() => setActiveId(signal.id)}
                  className={cn(
                    "rounded-[8px] border p-4 text-left transition",
                    activeId === signal.id
                      ? "border-[#d5a546] bg-[#d5a546] text-black"
                      : "border-white/10 bg-white/[0.04] text-white hover:border-white/28"
                  )}
                >
                  <span className="block text-sm font-bold uppercase opacity-70">{signal.label}</span>
                  <span className="mt-3 flex items-end gap-2">
                    <span className="text-4xl font-bold leading-none">{signal.metric}</span>
                    <span className="pb-1 text-sm font-semibold opacity-70">{signal.detail}</span>
                  </span>
                </button>
              ))}
            </div>
            <a
              href="https://www.mallofamerica.com/partnership-opportunities"
              target="_blank"
              rel="noreferrer"
              className="cta-button mt-5 w-full"
            >
              Start a partnership conversation
              <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          </aside>
        </div>
      </div>
    </>
  );
}
