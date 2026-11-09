"use client";

import { useCallback, useEffect, useRef } from "react";

// Synthesized footstep sound for the walkable floor.
// Synthesized via WebAudio for zero network latency and clean mixing.
export function useStepSound() {
  const ctxRef = useRef<AudioContext | null>(null);
  const parityRef = useRef(0);

  useEffect(() => {
    return () => {
      void ctxRef.current?.close().catch(() => {});
      ctxRef.current = null;
    };
  }, []);

  const playStep = useCallback(() => {
    try {
      const Ctor =
        window.AudioContext ??
        (window as Window & { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!Ctor) return;
      const ctx = (ctxRef.current ??= new Ctor());
      if (ctx.state === "suspended") void ctx.resume();

      const t = ctx.currentTime;
      const parity = (parityRef.current ^= 1);
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Alternate feet: low pitches sweeping down
      osc.frequency.setValueAtTime(parity ? 180 : 155, t);
      osc.frequency.exponentialRampToValueAtTime(75, t + 0.09);

      // Louder walking volume (0.32 gain instead of 0.09)
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.32, t + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.12);
      osc.onended = () => {
        osc.disconnect();
        gain.disconnect();
      };
    } catch {
      // ignore
    }
  }, []);

  return [playStep] as const;
}
