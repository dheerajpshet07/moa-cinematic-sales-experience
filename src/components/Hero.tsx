import { ArrowDown, CalendarDays, Handshake, MapPinned } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="impact"
      className="relative min-h-[100svh] overflow-hidden bg-[#120a07]"
      aria-label="Mall of America cinematic opening"
    >
      <div data-hero-media className="hero-media-scroll absolute inset-0 will-change-transform">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/media/moa-poster.webp')" }}
        />
        <video
          className="hero-video-reveal absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/media/moa-poster.webp"
        >
          <source src="/media/moa-cinematic.webm" type="video/webm" />
          <source src="/media/moa-cinematic.mp4" type="video/mp4" />
        </video>
        <div className="cinematic-vignette" />
        <div className="light-sweep" />
      </div>

      <div className="relative z-10 flex min-h-[100svh] flex-col justify-end px-5 pb-8 pt-24 sm:px-8 lg:px-14 lg:pb-12">
        <div className="w-full max-w-[1220px] animate-[heroEnter_900ms_cubic-bezier(0.22,1,0.36,1)_both]">
          <div className="flex flex-wrap items-center gap-3">
            <p className="eyebrow">A city under one roof</p>
            <span className="media-badge">Official MOA media</span>
          </div>
          <h1 className="display-title mt-5">Mall of America</h1>
          <p className="body-large mt-6 max-w-2xl">
            Where 32 million annual guests, retail ambition, entertainment gravity,
            and live brand moments converge into a single commercial stage.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a className="cta-button" href="#command">
              <MapPinned size={18} aria-hidden="true" />
              Choose your path
            </a>
            <a className="ghost-button" href="#takeover">
              <Handshake size={18} aria-hidden="true" />
              Place your brand
            </a>
            <a className="ghost-button" href="#platform">
              <CalendarDays size={18} aria-hidden="true" />
              Book the platform
            </a>
          </div>
          <div className="mt-9 hidden max-w-3xl grid-cols-3 gap-5 md:grid">
            <div className="hero-stat">
              <strong>32M+</strong>
              <span>annual guests</span>
            </div>
            <div className="hero-stat">
              <strong>$1B+</strong>
              <span>annual sales</span>
            </div>
            <div className="hero-stat">
              <strong>400+</strong>
              <span>events yearly</span>
            </div>
          </div>
        </div>

        <div className="mt-10 flex items-end justify-between gap-6">
          <div className="hidden overflow-hidden rounded-full border border-white/10 bg-black/30 px-4 py-3 backdrop-blur-xl md:block">
            <div
            className="flex min-w-max gap-8 text-sm font-semibold text-white/70"
              style={{ animation: "ticker 26s linear infinite" }}
            >
              {Array.from({ length: 2 }).map((_, index) => (
                <span className="flex gap-8" key={index}>
                  <span>Leasing</span>
                  <span>Sponsorship</span>
                  <span>Events</span>
                  <span>Retail media</span>
                  <span>Tourism</span>
                  <span>Attractions</span>
                </span>
              ))}
            </div>
          </div>
          <a
            aria-label="Move to interactive command center"
            href="#command"
            className="ml-auto inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-xl transition hover:bg-white/18"
          >
            <ArrowDown size={19} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
