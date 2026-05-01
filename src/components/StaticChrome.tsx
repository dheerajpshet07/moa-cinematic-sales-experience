export default function StaticChrome() {
  return (
    <>
      <div
        className="pointer-events-none fixed right-4 top-4 z-40 inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/25 bg-white/16 px-3 text-sm font-bold text-white shadow-[0_18px_55px_rgba(0,0,0,0.35)] backdrop-blur-xl"
        aria-hidden="true"
      >
        <span>Sound</span>
      </div>
      <div
        className="loader-auto fixed inset-0 z-[100] flex items-center justify-center bg-[#050506]"
        aria-hidden="true"
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="light-sweep" />
          <div
            className="absolute inset-x-[18%] top-1/2 h-px origin-left bg-[linear-gradient(90deg,transparent,#d5a546,#51d2cd,transparent)]"
            style={{ animation: "loaderPulse 1.8s ease-in-out infinite" }}
          />
        </div>
        <div className="relative z-10 text-center">
          <p className="eyebrow justify-center">Mall of America</p>
          <p className="mt-5 text-sm font-semibold uppercase text-white/55">
            Destination signal loading
          </p>
        </div>
      </div>
      <div className="noise" />
    </>
  );
}
