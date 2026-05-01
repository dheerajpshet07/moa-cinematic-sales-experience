import DeferredChrome from "@/components/DeferredChrome";
import CommandCenter from "@/components/CommandCenter";
import Hero from "@/components/Hero";
import LazyExperienceMap from "@/components/LazyExperienceMap";
import LazyLiveSignal from "@/components/LazyLiveSignal";
import LazyModules from "@/components/LazyModules";
import PropertySection from "@/components/PropertySection";
import StaticChrome from "@/components/StaticChrome";
import StoryPanel from "@/components/StoryPanel";
import { storyBeats } from "@/data/mall";

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <StaticChrome />
      <DeferredChrome />
      <Hero />
      <CommandCenter />
      <PropertySection />
      <LazyLiveSignal />
      {storyBeats.map((beat, index) => (
        <StoryPanel key={beat.id} beat={beat} index={index} />
      ))}
      <LazyExperienceMap />
      <LazyModules />
    </main>
  );
}
