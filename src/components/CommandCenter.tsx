"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BadgeDollarSign,
  CalendarDays,
  Check,
  MapPinned,
  Megaphone,
  Sparkles,
  Store,
  UsersRound
} from "lucide-react";
import { cn } from "@/lib/utils";

const journeys = [
  {
    id: "leasing",
    label: "Leasing",
    intent: "Flagship, luxury, F&B, pop-up",
    title: "Open where the audience is already moving.",
    copy:
      "Build a tenant story around adjacency, visitor intent, attraction draw, and launch-ready visibility instead of a static vacancy list.",
    metric: "500",
    metricLabel: "nearly stores",
    image: "/media/real/official-leasing-shop.jpg",
    video: null,
    videoWebm: null,
    accent: "#f1bd4f",
    icon: Store,
    outcomes: ["Anchor adjacency", "Pop-up launch", "Tourist conversion"],
    hotspots: [
      {
        label: "Flagship corridor",
        x: 34,
        y: 43,
        title: "High-intent retail path",
        copy: "Position the brand inside a route where shopping, dining, and entertainment are already layered."
      },
      {
        label: "Launch unit",
        x: 61,
        y: 55,
        title: "Fast market entry",
        copy: "Use a pop-up or short-term retail story to test demand before a larger commitment."
      },
      {
        label: "Dining spillover",
        x: 73,
        y: 35,
        title: "Longer dwell, stronger baskets",
        copy: "Connect the tenant pitch to meal breaks, family itineraries, and all-day destination behavior."
      }
    ]
  },
  {
    id: "sponsorship",
    label: "Sponsorship",
    intent: "Activations, media, naming",
    title: "Turn attention into owned presence.",
    copy:
      "A sponsor can see how media, crowd energy, sampling, signage, and content can become one theatrical property moment.",
    metric: "32M+",
    metricLabel: "annual guests",
    image: "/media/events-platform.webp",
    video: "/media/moa-sponsorship.mp4",
    videoWebm: "/media/moa-sponsorship.webm",
    accent: "#40d8d0",
    icon: Megaphone,
    outcomes: ["Rotunda takeover", "Retail media", "Sampling moment"],
    hotspots: [
      {
        label: "Rotunda stage",
        x: 50,
        y: 48,
        title: "The center of the story",
        copy: "Own a public moment with multi-level sightlines, social content, and immediate crowd response."
      },
      {
        label: "Media wall",
        x: 28,
        y: 34,
        title: "Attention becomes inventory",
        copy: "Convert traffic into visible impressions across signage, content surfaces, and campaign prompts."
      },
      {
        label: "Sampling lane",
        x: 69,
        y: 66,
        title: "Hands-on conversion",
        copy: "Pair product trial with destination energy while guests are already in discovery mode."
      }
    ]
  },
  {
    id: "events",
    label: "Events",
    intent: "Launches, tours, corporate",
    title: "Book a venue with audience built in.",
    copy:
      "Event partners can preview scale, crowd paths, spectacle, and handoff from live programming into commercial action.",
    metric: "400+",
    metricLabel: "events yearly",
    image: "/media/events-module.webp",
    video: "/media/moa-live.mp4",
    videoWebm: "/media/moa-live.webm",
    accent: "#f36b3f",
    icon: CalendarDays,
    outcomes: ["Public launch", "Tour stop", "Corporate event"],
    hotspots: [
      {
        label: "Main arrival",
        x: 42,
        y: 37,
        title: "Instant audience pressure",
        copy: "Create a launch that feels public from the first minute because the property is already active."
      },
      {
        label: "Production zone",
        x: 58,
        y: 53,
        title: "Scale without abstraction",
        copy: "Show stage, lighting, crowd flow, and brand presence in the same visual decision space."
      },
      {
        label: "Retail handoff",
        x: 75,
        y: 43,
        title: "After the applause",
        copy: "Turn event attention into store visits, partner offers, and measurable follow-through."
      }
    ]
  }
] as const;

type JourneyId = (typeof journeys)[number]["id"];

export default function CommandCenter() {
  const [activeId, setActiveId] = useState<JourneyId>("sponsorship");
  const [activeHotspotIndex, setActiveHotspotIndex] = useState(0);
  const [brandName, setBrandName] = useState("YOUR BRAND");
  const [takeover, setTakeover] = useState(true);
  const [videoReady, setVideoReady] = useState(false);

  const activeJourney = useMemo(
    () => journeys.find((journey) => journey.id === activeId) ?? journeys[0],
    [activeId]
  );
  const activeHotspot = activeJourney.hotspots[activeHotspotIndex] ?? activeJourney.hotspots[0];
  const ActiveIcon = activeJourney.icon;

  useEffect(() => {
    setActiveHotspotIndex(0);
    setVideoReady(false);
  }, [activeId]);

  return (
    <section id="command" className="command-shell section-shell overflow-hidden">
      <div className="section-inner">
        <div className="grid gap-8 lg:grid-cols-[0.74fr_1.26fr] lg:items-end">
          <div data-reveal>
            <p className="eyebrow">Interactive command center</p>
            <h2 className="section-title mt-5">Start with the business outcome.</h2>
          </div>
          <p data-reveal className="body-large">
            The pitch no longer moves like a deck. A tenant, sponsor, or event partner can
            choose the commercial path, open the relevant zones, and see the property respond
            around their opportunity.
          </p>
        </div>

        <div className="mt-10 grid gap-4 xl:grid-cols-[340px_minmax(0,1fr)]">
          <aside className="glass rounded-[8px] p-4 sm:p-5">
            <div className="grid gap-3">
              {journeys.map((journey) => {
                const Icon = journey.icon;
                const selected = journey.id === activeId;
                return (
                  <button
                    key={journey.id}
                    type="button"
                    onClick={() => setActiveId(journey.id)}
                    className={cn(
                      "group rounded-[8px] border p-4 text-left transition duration-300",
                      selected
                        ? "border-white/26 bg-white text-black shadow-[0_22px_70px_rgba(0,0,0,0.28)]"
                        : "border-white/12 bg-white/[0.045] text-white hover:border-white/32 hover:bg-white/[0.08]"
                    )}
                    aria-pressed={selected}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
                        style={{
                          backgroundColor: selected ? journey.accent : "rgba(255,255,255,0.08)",
                          color: selected ? "#050506" : journey.accent
                        }}
                      >
                        <Icon size={19} aria-hidden="true" />
                      </span>
                      <span>
                        <span className="block text-lg font-bold">{journey.label}</span>
                        <span className={cn("mt-1 block text-xs font-bold uppercase", selected ? "text-black/55" : "text-white/44")}>
                          {journey.intent}
                        </span>
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 rounded-[8px] border border-white/12 bg-black/30 p-4">
              <p className="text-xs font-bold uppercase text-white/44">Live pitch stack</p>
              <div className="mt-4 grid gap-3">
                {activeJourney.outcomes.map((outcome) => (
                  <div key={outcome} className="flex items-center gap-3 text-sm font-semibold text-white/74">
                    <span
                      className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-black"
                      style={{ backgroundColor: activeJourney.accent }}
                    >
                      <Check size={14} aria-hidden="true" />
                    </span>
                    {outcome}
                  </div>
                ))}
              </div>
            </div>

            <a href="#takeover" className="cta-button mt-4 w-full">
              Open 3D takeover
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </aside>

          <div className="command-stage reveal-card min-h-[680px] bg-[#080504]">
            <Image
              key={`${activeJourney.id}-image`}
              src={activeJourney.image}
              alt=""
              fill
              sizes="(max-width: 1280px) 100vw, 72vw"
              className="object-cover opacity-95 saturate-[1.14]"
              priority={false}
              unoptimized
            />
            {activeJourney.video ? (
              <video
                key={activeJourney.id}
                className={cn(
                  "absolute inset-0 h-full w-full object-cover saturate-[1.18] transition duration-700",
                  videoReady ? "opacity-80" : "opacity-0"
                )}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster={activeJourney.image}
                onCanPlay={() => setVideoReady(true)}
                onLoadedData={() => setVideoReady(true)}
              >
                {activeJourney.videoWebm ? <source src={activeJourney.videoWebm} type="video/webm" /> : null}
                <source src={activeJourney.video} type="video/mp4" />
              </video>
            ) : null}

            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.68),rgba(0,0,0,0.1)_52%,rgba(0,0,0,0.48))]" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.56))]" />
            <div className="command-light" style={{ backgroundColor: activeJourney.accent }} />

            <div className="absolute left-4 right-4 top-4 z-10 flex flex-wrap items-center justify-between gap-3">
              <div className="media-badge">
                Real media + AI concept layer
              </div>
              <div className="flex items-center gap-2 rounded-full border border-white/14 bg-black/42 px-3 py-2 text-xs font-bold uppercase text-white/62 backdrop-blur-xl">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: activeJourney.accent }} />
                {activeJourney.label} mode
              </div>
            </div>

            <motion.div
              key={`${activeJourney.id}-${activeHotspot.label}`}
              className="absolute bottom-0 left-0 z-10 max-w-2xl p-5 sm:p-8"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                className="inline-flex h-12 w-12 items-center justify-center rounded-full text-black"
                style={{ backgroundColor: activeJourney.accent }}
              >
                <ActiveIcon size={20} aria-hidden="true" />
              </div>
              <p className="mt-5 text-sm font-bold uppercase" style={{ color: activeJourney.accent }}>
                {activeHotspot.label}
              </p>
              <h3 className="mt-3 max-w-xl text-4xl font-bold leading-none text-white sm:text-6xl">
                {activeHotspot.title}
              </h3>
              <p className="mt-5 max-w-xl text-base leading-7 text-white/72">{activeHotspot.copy}</p>
            </motion.div>

            {activeJourney.hotspots.map((hotspot, index) => (
              <button
                key={hotspot.label}
                type="button"
                className={cn(
                  "command-hotspot absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded-full border px-3 py-2 text-xs font-bold uppercase backdrop-blur-xl transition",
                  index === activeHotspotIndex
                    ? "bg-white text-black"
                    : "border-white/28 bg-black/38 text-white hover:bg-white hover:text-black"
                )}
                style={{
                  left: `${hotspot.x}%`,
                  top: `${hotspot.y}%`,
                  borderColor: index === activeHotspotIndex ? activeJourney.accent : undefined
                }}
                onMouseEnter={() => setActiveHotspotIndex(index)}
                onFocus={() => setActiveHotspotIndex(index)}
                onClick={() => setActiveHotspotIndex(index)}
              >
                <span
                  className="mr-2 inline-block h-2 w-2 rounded-full align-middle"
                  style={{ backgroundColor: activeJourney.accent }}
                />
                {hotspot.label}
              </button>
            ))}

            <div className="absolute right-4 top-20 z-20 w-[min(22rem,calc(100%-2rem))] rounded-[8px] border border-white/14 bg-black/44 p-4 shadow-2xl backdrop-blur-2xl">
              <p className="text-xs font-bold uppercase text-white/45">Brand simulation</p>
              <div className="mt-3 flex gap-2">
                <input
                  value={brandName}
                  onChange={(event) => setBrandName(event.target.value.slice(0, 22))}
                  className="h-11 min-w-0 flex-1 rounded-full border border-white/14 bg-white/[0.08] px-4 text-sm font-bold uppercase text-white outline-none transition placeholder:text-white/28 focus:border-white/42"
                  placeholder="Your brand"
                />
                <button
                  type="button"
                  onClick={() => setTakeover((value) => !value)}
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/16 bg-white text-black transition hover:scale-105"
                  aria-label={takeover ? "Pause brand takeover" : "Activate brand takeover"}
                >
                  <Sparkles size={18} aria-hidden="true" />
                </button>
              </div>
            </div>

            <motion.div
              className="pointer-events-none absolute left-1/2 top-[42%] z-10 w-[min(520px,78%)] -translate-x-1/2 rounded-[8px] border border-white/18 bg-black/44 px-5 py-4 text-center shadow-[0_0_90px_rgba(0,0,0,0.36)] backdrop-blur-xl"
              animate={{
                opacity: takeover ? 1 : 0.2,
                scale: takeover ? 1 : 0.92
              }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-xs font-bold uppercase" style={{ color: activeJourney.accent }}>
                Now belongs to
              </p>
              <p className="mt-2 truncate text-3xl font-bold uppercase tracking-normal text-white sm:text-6xl">
                {brandName || "YOUR BRAND"}
              </p>
            </motion.div>

            <div className={cn("command-crowd absolute inset-x-0 bottom-0 z-[1] h-36", takeover && "is-live")} />
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {[
            { icon: MapPinned, title: "Non-linear journey", copy: "Every commercial path can be entered directly from the command layer." },
            { icon: UsersRound, title: "Audience-first proof", copy: "The story connects scale, dwell time, and behavior to the selected business case." },
            { icon: BadgeDollarSign, title: "Sales action", copy: "Each path resolves into leasing, sponsorship, or booking intent instead of passive reading." }
          ].map((item) => (
            <div key={item.title} data-reveal className="reveal-card p-5">
              <item.icon size={21} className="text-[#f1bd4f]" aria-hidden="true" />
              <h3 className="mt-4 text-2xl font-bold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-white/58">{item.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
