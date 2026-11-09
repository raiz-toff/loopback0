"use client";

import { useState, type ReactNode } from "react";
import { downloadResume } from "@/lib/resume-download";
import { haptic } from "@/lib/haptic";

type Status = "idle" | "loading" | "error";

/**
 * Button that fetches the resume PDF on click (no crawlable PDF link).
 *
 * @param props.children - Idle label/content.
 * @param props.className - Classes for the button.
 * @param props.onDone - Called after a successful download starts.
 */
export function ResumeDownloadButton({
  children,
  className,
  onDone,
}: {
  children: ReactNode;
  className?: string;
  onDone?: () => void;
}) {
  const [status, setStatus] = useState<Status>("idle");

  const handleClick = async () => {
    if (status === "loading") return;
    haptic();
    setStatus("loading");
    try {
      await downloadResume();
      setStatus("idle");
      onDone?.();
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={status === "loading"}
      aria-busy={status === "loading"}
      aria-live="polite"
      className={className}
    >
      {status === "loading" ? "Preparing…" : status === "error" ? "Try again later" : children}
    </button>
  );
}
