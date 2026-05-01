"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

export default function SoundToggle() {
  const [enabled, setEnabled] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const contextRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<Array<AudioNode>>([]);
  const rafRef = useRef<number | null>(null);

  const stopSynth = () => {
    nodesRef.current.forEach((node) => node.disconnect());
    nodesRef.current = [];
    contextRef.current?.close();
    contextRef.current = null;
  };

  const startSynthFallback = () => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      return;
    }
    const context = new AudioContextClass();
    const master = context.createGain();
    master.gain.setValueAtTime(0.0001, context.currentTime);
    master.gain.exponentialRampToValueAtTime(0.045, context.currentTime + 1.2);

    const low = context.createOscillator();
    low.type = "sine";
    low.frequency.value = 58;

    const shimmer = context.createOscillator();
    shimmer.type = "triangle";
    shimmer.frequency.value = 173;

    const shimmerGain = context.createGain();
    shimmerGain.gain.value = 0.018;

    low.connect(master);
    shimmer.connect(shimmerGain);
    shimmerGain.connect(master);
    master.connect(context.destination);

    low.start();
    shimmer.start();

    contextRef.current = context;
    nodesRef.current = [low, shimmer, shimmerGain, master];
  };

  useEffect(() => {
    if (!enabled) {
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
      stopSynth();
      return;
    }

    const audio = new Audio("/media/moa-live-audio.ogg");
    audio.loop = true;
    audio.volume = 0;
    audioRef.current = audio;

    audio
      .play()
      .then(() => {
        const start = performance.now();
        const ramp = (now: number) => {
          const progress = Math.min((now - start) / 1200, 1);
          audio.volume = 0.24 * progress;
          if (progress < 1) {
            rafRef.current = window.requestAnimationFrame(ramp);
          }
        };
        rafRef.current = window.requestAnimationFrame(ramp);
      })
      .catch(() => {
        startSynthFallback();
      });

    return () => {
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      audio.pause();
      audioRef.current = null;
      stopSynth();
    };
  }, [enabled]);

  const Icon = enabled ? Volume2 : VolumeX;

  return (
    <button
      type="button"
      aria-label={enabled ? "Turn ambient sound off" : "Turn ambient sound on"}
      onClick={() => setEnabled((value) => !value)}
      className="fixed right-4 top-4 z-50 inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/25 bg-white/16 px-3 text-sm font-bold text-white shadow-[0_18px_55px_rgba(0,0,0,0.35)] backdrop-blur-xl transition hover:border-white/45 hover:bg-white/24"
    >
      <Icon aria-hidden="true" size={18} />
      <span>{enabled ? "Sound on" : "Sound"}</span>
    </button>
  );
}
