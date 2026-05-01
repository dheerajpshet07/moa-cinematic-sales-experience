"use client";

import CursorAura from "@/components/CursorAura";
import NavigationRail from "@/components/NavigationRail";
import ScrollProgress from "@/components/ScrollProgress";
import SoundToggle from "@/components/SoundToggle";

export default function ClientChrome() {
  return (
    <>
      <ScrollProgress />
      <CursorAura />
      <SoundToggle />
      <NavigationRail />
    </>
  );
}
