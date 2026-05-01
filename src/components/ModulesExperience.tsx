"use client";

import { lazy, Suspense, useMemo, useState } from "react";
import { ArrowUpRight, Building2, Plane, UsersRound } from "lucide-react";
import OpportunityCard from "@/components/OpportunityCard";
import { opportunityModules, sourceLinks } from "@/data/mall";
import { cn } from "@/lib/utils";

const LeasingModule = lazy(() => import("@/modules/leasing/LeasingModule"));
const SponsorshipModule = lazy(() => import("@/modules/sponsorship/SponsorshipModule"));
const EventsModule = lazy(() => import("@/modules/events/EventsModule"));

type ModuleId = (typeof opportunityModules)[number]["id"];

function ModuleLoading() {
  return <div className="reveal-card min-h-[430px] animate-pulse bg-white/[0.04]" />;
}

function ReachModule() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
      <div className="reveal-card min-h-[420px] overflow-hidden">
        <div
          className="absolute inset-0 module-image opacity-72 saturate-[1.12]"
          style={{ backgroundImage: "url('/media/access-module.webp')" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.64))]" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <p className="eyebrow">Regional reach</p>
          <h3 className="mt-5 text-5xl font-bold leading-none text-white">
            Twin Cities demand with tourist-scale upside.
          </h3>
        </div>
      </div>
      <div className="glass rounded-[8px] p-6">
        <div className="grid gap-4">
          {[
            {
              icon: Plane,
              title: "Airport proximity",
              copy: "A destination positioned for travelers, layovers, conventions, and regional tourism."
            },
            {
              icon: UsersRound,
              title: "Audience mix",
              copy: "Families, residents, tourists, superfans, shoppers, and eventgoers create more than one demand curve."
            },
            {
              icon: Building2,
              title: "Commercial density",
              copy: "Retail, dining, entertainment, and events stack into an all-day property model."
            }
          ].map((item) => (
            <div key={item.title} className="border-b border-white/10 pb-5 last:border-b-0">
              <item.icon aria-hidden="true" size={22} className="text-[#51d2cd]" />
              <h4 className="mt-3 text-2xl font-bold text-white">{item.title}</h4>
              <p className="mt-2 leading-7 text-white/62">{item.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ModulesExperience() {
  const [activeModule, setActiveModule] = useState<ModuleId>("leasing");

  const activeModuleView = useMemo(() => {
    switch (activeModule) {
      case "leasing":
        return <LeasingModule />;
      case "sponsorship":
        return <SponsorshipModule />;
      case "events":
        return <EventsModule />;
      case "access":
        return <ReachModule />;
      default:
        return null;
    }
  }, [activeModule]);

  return (
    <div className="section-inner">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
        <div data-reveal>
          <p className="eyebrow">Expandable modules</p>
          <h2 className="section-title mt-5">Every path has a business outcome.</h2>
        </div>
        <p data-reveal className="body-large">
          The architecture is built to grow into deeper leasing, sponsorship,
          and venue-specific modules without turning the experience into a
          linear slide sequence.
        </p>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {opportunityModules.map((module) => (
          <OpportunityCard
            key={module.id}
            module={module}
            active={module.id === activeModule}
            onSelect={() => setActiveModule(module.id)}
          />
        ))}
      </div>

      <div className="mt-6">
        <Suspense fallback={<ModuleLoading />}>{activeModuleView}</Suspense>
      </div>

      <div className="mt-14 grid gap-6 lg:grid-cols-[minmax(22rem,0.8fr)_minmax(0,1.2fr)] lg:items-center">
        <div className="min-w-0">
          <p className="eyebrow">Source-backed story</p>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-white/62">
            Facts, audience claims, and commercial paths are intentionally
            separated from the visual layer, so sales teams can update the
            experience as the property evolves.
          </p>
        </div>
        <div className="flex min-w-0 flex-wrap justify-start gap-2 lg:justify-end">
          {sourceLinks.map((source) => (
            <a
              key={source.href}
              href={source.href}
              target="_blank"
              rel="noreferrer"
              className="ghost-button min-h-11"
            >
              {source.label}
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>

      <div className="mt-12 rounded-[8px] border border-white/18 bg-[linear-gradient(135deg,rgba(241,189,79,0.26),rgba(64,216,208,0.18),rgba(243,107,63,0.18))] p-6 sm:p-8 shadow-[0_32px_90px_rgba(0,0,0,0.28)]">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase text-white/56">Commercial close</p>
            <h2 className="mt-3 max-w-4xl font-serif text-5xl font-semibold leading-none text-white sm:text-7xl">
              Put the brand where the audience already wants to be.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {[
              ["Lease", "https://www.mallofamerica.com/leasing"],
              ["Sponsor", "https://www.mallofamerica.com/partnership-opportunities"],
              ["Book event", "https://www.mallofamerica.com/events"]
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className={cn(label === "Lease" ? "cta-button" : "ghost-button bg-black/35 text-white")}
              >
                {label}
                <ArrowUpRight size={17} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
