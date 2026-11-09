"use client";

import { useCallback } from "react";
import { playClickSound } from "@/lib/soundcn/sound-engine";

export function useClickSound(options?: { volume?: number }) {
  const play = useCallback(() => {
    void playClickSound(options);
  }, [options?.volume]);

  return [play] as const;
}
