import Image from "next/image";
import type { storyBeats } from "@/data/mall";

type StoryBeat = (typeof storyBeats)[number];

type StoryPanelProps = {
  beat: StoryBeat;
  index: number;
};

export default function StoryPanel({ beat, index }: StoryPanelProps) {
  const Icon = beat.icon;

  return (
    <section id={beat.id} className="section-shell overflow-hidden">
      <div className="section-inner grid min-h-[72svh] items-center gap-10 lg:grid-cols-[0.92fr_1.08fr]">
        <div data-reveal className={index % 2 === 0 ? "lg:order-1" : "lg:order-2"}>
          <p className="eyebrow">{beat.eyebrow}</p>
          <h2 className="section-title mt-5">{beat.title}</h2>
          <p className="body-large mt-6">{beat.copy}</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {beat.stats.map((stat) => (
              <div
                key={stat}
                className="reveal-card min-h-28 p-4"
                style={{ borderColor: `${beat.accent}35` }}
              >
                <Icon aria-hidden="true" size={20} color={beat.accent} />
                <p className="mt-5 text-base font-bold text-white">{stat}</p>
              </div>
            ))}
          </div>
        </div>

        <div data-reveal className={index % 2 === 0 ? "lg:order-2" : "lg:order-1"}>
          <div className="group reveal-card aspect-[4/5] max-h-[760px] w-full overflow-hidden lg:aspect-[5/6]">
            <Image
              src={beat.image}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover saturate-[1.12] transition duration-1000 group-hover:scale-[1.025] group-hover:saturate-[1.22]"
              loading="lazy"
              unoptimized
            />
            <div className="absolute left-5 top-5">
              <span className="media-badge">Real property media</span>
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_24%,rgba(0,0,0,0.58))]" />
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
              <p className="max-w-md text-lg font-semibold leading-7 text-white/88">
                {beat.copy.split(".")[0]}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
