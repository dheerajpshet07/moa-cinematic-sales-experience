import { BadgeDollarSign, RadioTower, Sparkles } from "lucide-react";

const tiers = [
  {
    title: "Signal",
    spend: "Awareness",
    surfaces: "Digital signage, social lift, event adjacency"
  },
  {
    title: "Presence",
    spend: "Activation",
    surfaces: "Rotunda build, sampling, media amplification"
  },
  {
    title: "Ownership",
    spend: "Platform",
    surfaces: "Naming-style moments, seasonal program, category exclusivity"
  }
] as const;

export default function SponsorshipModule() {
  return (
    <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
      <div className="reveal-card min-h-[520px] overflow-hidden bg-[#050506]" data-reveal>
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-90 saturate-[1.16]"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/media/sponsorship-module.webp"
        >
          <source src="/media/moa-sponsorship.webm" type="video/webm" />
          <source src="/media/moa-sponsorship.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.66),rgba(0,0,0,0.08)_48%,rgba(0,0,0,0.48))]" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(241,189,79,0.18),transparent_38%,rgba(64,216,208,0.14))]" />
        <div className="absolute left-5 top-5">
          <span className="media-badge">Official sponsorship video</span>
        </div>
        <div className="absolute bottom-0 left-0 max-w-2xl p-6 sm:p-8">
          <p className="text-sm font-bold uppercase text-[#d5a546]">Brand platform</p>
          <h3 className="mt-4 text-5xl font-bold leading-none text-white sm:text-6xl">
            Attention becomes a place a brand can own.
          </h3>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/68">
            Sponsorship is framed as presence, not placement: media, activations,
            event energy, and audience flow operating as one commercial surface.
          </p>
        </div>
      </div>

      <div className="grid gap-3">
        {tiers.map((tier, index) => (
          <div key={tier.title} className="glass rounded-[8px] p-5" data-reveal>
            <div className="flex items-center justify-between">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-black">
                {index === 0 ? (
                  <RadioTower size={19} aria-hidden="true" />
                ) : index === 1 ? (
                  <Sparkles size={19} aria-hidden="true" />
                ) : (
                  <BadgeDollarSign size={19} aria-hidden="true" />
                )}
              </span>
              <span className="text-sm font-bold uppercase text-[#d5a546]">{tier.spend}</span>
            </div>
            <h3 className="mt-6 text-4xl font-bold text-white">{tier.title}</h3>
            <p className="mt-4 text-base leading-7 text-white/64">{tier.surfaces}</p>
            <div className="mt-6 h-1 rounded-full bg-white/10">
              <div
                className="h-1 rounded-full bg-[linear-gradient(90deg,#d5a546,#51d2cd)]"
                style={{ width: `${48 + index * 22}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
