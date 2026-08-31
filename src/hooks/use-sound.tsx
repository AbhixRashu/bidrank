"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";

type SoundType = "new-bid" | "outbid" | "new-number-one" | "bid-placed" | "crown-taken";

let sharedCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!sharedCtx || sharedCtx.state === "closed") {
    try {
      sharedCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    } catch {
      return null;
    }
  }
  if (sharedCtx.state === "suspended") {
    sharedCtx.resume().catch(() => {});
  }
  return sharedCtx;
}

function synthNote(
  ctx: AudioContext,
  freq: number,
  duration: number,
  type: OscillatorType = "sine",
  delay = 0,
  volume = 0.12
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
  gain.gain.setValueAtTime(volume, ctx.currentTime + delay);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);
  osc.start(ctx.currentTime + delay);
  osc.stop(ctx.currentTime + delay + duration);
}

function playSynth(type: SoundType) {
  const ctx = getAudioContext();
  if (!ctx) return;

  switch (type) {
    case "new-bid":
    case "bid-placed": {
      // Pleasant ascending coin-drop arpeggio
      synthNote(ctx, 880, 0.08, "sine", 0, 0.10);
      synthNote(ctx, 1100, 0.08, "sine", 0.07, 0.10);
      synthNote(ctx, 1320, 0.10, "sine", 0.14, 0.10);
      synthNote(ctx, 1540, 0.12, "sine", 0.22, 0.08);
      break;
    }
    case "outbid": {
      // Descending warning buzzer
      synthNote(ctx, 440, 0.18, "sawtooth", 0, 0.06);
      synthNote(ctx, 370, 0.18, "sawtooth", 0.12, 0.06);
      synthNote(ctx, 310, 0.22, "sawtooth", 0.24, 0.06);
      break;
    }
    case "new-number-one": {
      // Triumphant ascending horn fanfare
      synthNote(ctx, 523, 0.10, "sine", 0, 0.10);
      synthNote(ctx, 659, 0.10, "sine", 0.10, 0.10);
      synthNote(ctx, 784, 0.12, "sine", 0.20, 0.10);
      synthNote(ctx, 1047, 0.15, "sine", 0.32, 0.12);
      synthNote(ctx, 1319, 0.12, "triangle", 0.42, 0.08);
      synthNote(ctx, 1568, 0.20, "sine", 0.54, 0.06);
      break;
    }
    case "crown-taken": {
      // Dramatic dramatic descending tone then rise
      synthNote(ctx, 660, 0.12, "triangle", 0, 0.08);
      synthNote(ctx, 550, 0.15, "triangle", 0.12, 0.08);
      synthNote(ctx, 740, 0.12, "triangle", 0.30, 0.08);
      synthNote(ctx, 990, 0.18, "triangle", 0.42, 0.08);
      break;
    }
  }
}

function SoundToggleUI({ muted, onToggle }: { muted: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="p-2 rounded-lg hover:bg-[#F8F7F3] transition-colors text-gray-500 hover:text-[#101114]"
      aria-label={muted ? "Unmute sounds" : "Mute sounds"}
      title={muted ? "Unmute sounds" : "Mute sounds"}
    >
      {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
    </button>
  );
}

export function useSound() {
  const [muted, setMuted] = useState(true);
  const mutedRef = useRef(true);

  useEffect(() => {
    const stored = localStorage.getItem("indbid-sound-muted");
    const isMuted = stored === null ? true : stored === "true";
    mutedRef.current = isMuted;
    setMuted(isMuted);
  }, []);

  const toggleMute = useCallback(() => {
    const newMuted = !mutedRef.current;
    mutedRef.current = newMuted;
    setMuted(newMuted);
    localStorage.setItem("indbid-sound-muted", String(newMuted));
    // Warm up AudioContext on first unmute to avoid autoplay policy block
    if (!newMuted) {
      getAudioContext();
    }
  }, []);

  const play = useCallback((type: SoundType) => {
    if (mutedRef.current) return;
    playSynth(type);
  }, []);

  return { play, toggleMute, isMuted: muted, SoundToggle: SoundToggleUI };
}
