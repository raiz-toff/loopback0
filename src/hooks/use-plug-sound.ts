"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Synthesized RJ45 Ethernet Connector Plug Sound
 * Based on Foley sound design acoustic breakdown:
 * 1. Broad-spectrum plastic snap: Instant transient high-pass noise (4.5kHz+) + resonant plastic peak (5.5kHz).
 * 2. Contact pin scrape: Brief 10ms micro-friction sweep.
 * 3. Connector body thud: Low 180Hz -> 70Hz sine impact with fast 25ms decay.
 * Total duration: ~40ms (ultra-fast, sharp transient).
 */
export function usePlugSound() {
  const ctxRef = useRef<AudioContext | null>(null);
  const noiseBufferRef = useRef<AudioBuffer | null>(null);

  useEffect(() => {
    return () => {
      void ctxRef.current?.close().catch(() => {});
      ctxRef.current = null;
      noiseBufferRef.current = null;
    };
  }, []);

  const playPlug = useCallback((pan: number = 0) => {
    try {
      const Ctor =
        window.AudioContext ??
        (window as Window & { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!Ctor) return;
      const ctx = (ctxRef.current ??= new Ctor());
      if (ctx.state === "suspended") void ctx.resume();

      const t = ctx.currentTime;

      // Create stereo panner node if available, otherwise fallback to destination
      const dest: AudioNode = ctx.createStereoPanner
        ? (() => {
            const panner = ctx.createStereoPanner();
            panner.pan.setValueAtTime(Math.max(-1, Math.min(1, pan)), t);
            panner.connect(ctx.destination);
            return panner;
          })()
        : ctx.destination;

      // 1. Generate & cache static white noise buffer (50ms)
      if (!noiseBufferRef.current) {
        const sampleRate = ctx.sampleRate;
        const length = Math.floor(sampleRate * 0.05); // 50ms
        const buffer = ctx.createBuffer(1, length, sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < length; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        noiseBufferRef.current = buffer;
      }

      // --- LAYER A: Plastic Retention Clip Snap (High-Pass + Resonant Peak) ---
      const snapSource = ctx.createBufferSource();
      snapSource.buffer = noiseBufferRef.current;

      // High-pass filter to cut out low/mid mud and keep sharp plastic top-end
      const hpFilter = ctx.createBiquadFilter();
      hpFilter.type = "highpass";
      hpFilter.frequency.setValueAtTime(4200, t);

      // Resonant peak to simulate plastic tab housing echo (5.5kHz)
      const plasticPeak = ctx.createBiquadFilter();
      plasticPeak.type = "peaking";
      plasticPeak.frequency.setValueAtTime(5500, t);
      plasticPeak.Q.setValueAtTime(3.0, t);
      plasticPeak.gain.setValueAtTime(6, t);

      const snapGain = ctx.createGain();
      // Balanced gain to prevent clipping when panned stereo (0.45 peak)
      snapGain.gain.setValueAtTime(0.0001, t);
      snapGain.gain.linearRampToValueAtTime(0.45, t + 0.0015);
      snapGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.022);

      snapSource.connect(hpFilter);
      hpFilter.connect(plasticPeak);
      plasticPeak.connect(snapGain);
      snapGain.connect(dest);

      snapSource.start(t);
      snapSource.stop(t + 0.025);

      // --- LAYER B: Physical Body Seating (Low Thud) ---
      const thudOsc = ctx.createOscillator();
      const thudGain = ctx.createGain();
      thudOsc.type = "sine";
      thudOsc.frequency.setValueAtTime(220, t);
      thudOsc.frequency.exponentialRampToValueAtTime(65, t + 0.02);

      thudGain.gain.setValueAtTime(0.0001, t);
      thudGain.gain.linearRampToValueAtTime(0.3, t + 0.002);
      thudGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.028);

      thudOsc.connect(thudGain);
      thudGain.connect(dest);

      thudOsc.start(t);
      thudOsc.stop(t + 0.03);

      // --- LAYER C: Micro Pin Contact Scrape (10ms transient lead) ---
      const scrapeOsc = ctx.createOscillator();
      const scrapeGain = ctx.createGain();
      scrapeOsc.type = "triangle";
      scrapeOsc.frequency.setValueAtTime(3200, t);
      scrapeOsc.frequency.exponentialRampToValueAtTime(1400, t + 0.01);

      scrapeGain.gain.setValueAtTime(0.0001, t);
      scrapeGain.gain.linearRampToValueAtTime(0.09, t + 0.001);
      scrapeGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.01);

      scrapeOsc.connect(scrapeGain);
      scrapeGain.connect(dest);

      scrapeOsc.start(t);
      scrapeOsc.stop(t + 0.012);

    } catch (err) {
      console.error("Audio playback failed", err);
    }
  }, []);

  return [playPlug] as const;
}

