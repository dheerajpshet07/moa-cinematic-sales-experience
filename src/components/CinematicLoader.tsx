"use client";

type CinematicLoaderProps = {
  active: boolean;
};

export default function CinematicLoader({ active }: CinematicLoaderProps) {
  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#050506] transition-opacity duration-700 ${active ? "opacity-100" : "pointer-events-none opacity-0"}`}
      aria-hidden={!active}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="light-sweep" />
        <div
          className="absolute inset-x-[18%] top-1/2 h-px origin-left bg-[linear-gradient(90deg,transparent,#d5a546,#51d2cd,transparent)]"
          style={{ animation: "loaderPulse 1.8s ease-in-out infinite" }}
        />
      </div>
      <div className="relative z-10 translate-y-0 text-center opacity-100 transition duration-700">
        <p className="eyebrow justify-center">Mall of America</p>
        <p className="mt-5 text-sm font-semibold uppercase text-white/55">
          Destination signal loading
        </p>
      </div>
    </div>
  );
}
