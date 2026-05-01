"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CalendarPlus, Lightbulb, UsersRound } from "lucide-react";
import { cn } from "@/lib/utils";

const eventModes = [
  {
    id: "launch",
    title: "Product Launch",
    crowd: 72,
    light: "#d5a546",
    audience: "Retail press, creators, family traffic",
    outcome: "Hero reveal, retail conversion, earned media"
  },
  {
    id: "festival",
    title: "Cultural Festival",
    crowd: 88,
    light: "#e45835",
    audience: "Regional community, tourists, repeat guests",
    outcome: "Multi-day dwell time, sponsor affinity, food traffic"
  },
  {
    id: "tour",
    title: "Performance Stop",
    crowd: 96,
    light: "#51d2cd",
    audience: "Fans, families, destination shoppers",
    outcome: "Spectacle, social lift, booking momentum"
  }
] as const;

export default function EventSimulator() {
  const [modeId, setModeId] = useState<(typeof eventModes)[number]["id"]>("launch");
  const active = eventModes.find((mode) => mode.id === modeId) ?? eventModes[0];
  const crowd = useMemo(
    () =>
      Array.from({ length: 110 }, (_, index) => ({
        id: index,
        left: 8 + ((index * 17) % 84),
        top: 44 + ((index * 23) % 48),
        delay: (index % 12) * 0.06
      })),
    []
  );

  return (
    <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="reveal-card min-h-[430px] bg-[#070707]">
        <div
          className="absolute inset-0 module-image opacity-46"
          style={{ backgroundImage: "url('/media/events-platform.webp')" }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,transparent,rgba(0,0,0,0.82)_72%)]" />
        <motion.div
          key={active.id}
          className="absolute left-1/2 top-[18%] h-[38%] w-[46%] -translate-x-1/2 rounded-b-full"
          initial={{ opacity: 0, scaleX: 0.45 }}
          animate={{ opacity: 0.52, scaleX: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            background: `linear-gradient(180deg, ${active.light}88, transparent)`,
            filter: "blur(18px)"
          }}
        />
        <div className="absolute left-1/2 top-[38%] h-16 w-[42%] -translate-x-1/2 rounded-[8px] border border-white/20 bg-black/55 shadow-[0_0_60px_rgba(213,165,70,0.22)]" />
        {crowd.map((dot, index) => {
          const visible = index < active.crowd;
          return (
            <motion.span
              key={dot.id}
              className="absolute h-1.5 w-1.5 rounded-full bg-white/80"
              style={{ left: `${dot.left}%`, top: `${dot.top}%` }}
              initial={false}
              animate={{
                opacity: visible ? 0.32 + (index % 4) * 0.14 : 0,
                scale: visible ? 1 : 0.2,
                y: visible ? [0, -3, 0] : 0
              }}
              transition={{
                opacity: { duration: 0.28 },
                scale: { duration: 0.28 },
                y: { duration: 1.9, delay: dot.delay, repeat: Infinity, ease: "easeInOut" }
              }}
            />
          );
        })}
        <div className="absolute bottom-5 left-5 right-5 z-10 flex flex-wrap gap-2">
          {eventModes.map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => setModeId(mode.id)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-bold transition",
                mode.id === active.id
                  ? "border-white bg-white text-black"
                  : "border-white/14 bg-black/42 text-white/70 hover:border-white/38 hover:text-white"
              )}
            >
              {mode.title}
            </button>
          ))}
        </div>
      </div>

      <motion.div
        key={active.id}
        className="glass rounded-[8px] p-6"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32 }}
      >
        <CalendarPlus size={24} aria-hidden="true" className="text-[#d5a546]" />
        <h3 className="mt-5 text-4xl font-bold leading-none">{active.title}</h3>
        <div className="mt-8 space-y-5">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-bold uppercase text-white/50">
              <UsersRound size={15} aria-hidden="true" />
              Audience
            </div>
            <p className="text-lg leading-7 text-white/78">{active.audience}</p>
          </div>
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-bold uppercase text-white/50">
              <Lightbulb size={15} aria-hidden="true" />
              Commercial Result
            </div>
            <p className="text-lg leading-7 text-white/78">{active.outcome}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
