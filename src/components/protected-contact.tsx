"use client";

import { useState } from "react";
import { useIsClient } from "@/hooks/use-is-client";
import { playCopySuccessSound } from "@/lib/soundcn/sound-engine";
import { haptic } from "@/lib/haptic";
import { CheckIcon, CopyIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

export function decodeB64(b64: string): string {
  try {
    return atob(b64);
  } catch {
    return "";
  }
}

export function formatPhoneNumber(e164: string): string {
  const m = e164.match(/^\+1(\d{3})(\d{3})(\d{4})$/);
  return m ? `+1 ${m[1]} ${m[2]} ${m[3]}` : e164;
}

export function ProtectedPhone({
  phoneB64,
  className,
  displayMask,
  showCopy = true,
}: {
  phoneB64: string;
  className?: string;
  displayMask?: string;
  showCopy?: boolean;
}) {
  const mounted = useIsClient();
  const [href, setHref] = useState<string | undefined>(undefined);
  const [copied, setCopied] = useState(false);

  const phone = mounted ? decodeB64(phoneB64) : "";
  const formatted = displayMask || (phone ? formatPhoneNumber(phone) : "");

  // Lazy-inject `tel:` only on pointer/focus interaction to avoid automated scrapers
  const handleActivate = () => {
    if (phone && !href) {
      setHref(`tel:${phone}`);
    }
  };

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!phone) return;
    try {
      void playCopySuccessSound();
      haptic();
      await navigator.clipboard.writeText(formatPhoneNumber(phone));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  if (!mounted) {
    // SSR payload: no plaintext phone in static HTML
    return (
      <span className={cn("inline-flex items-center gap-1.5 font-mono", className)}>
        <span className="inline-block h-3.5 w-28 animate-pulse rounded bg-muted/40 align-middle" />
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-center gap-1.5 font-mono group/contact", className)}>
      <a
        href={href || `tel:${phone}`}
        onPointerEnter={handleActivate}
        onTouchStart={handleActivate}
        onFocus={handleActivate}
        onClick={(e) => {
          if (!href) {
            e.preventDefault();
            window.location.href = `tel:${phone}`;
          }
        }}
        className="link text-inherit hover:text-foreground select-all"
        title="Call phone number"
      >
        {formatted}
      </a>

      {showCopy && (
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? "Copied phone number" : "Copy phone number"}
          title={copied ? "Copied!" : "Copy to clipboard"}
          className={cn(
            "inline-flex size-5 shrink-0 items-center justify-center rounded transition-all",
            "text-muted-foreground/60 hover:bg-muted hover:text-foreground active:scale-95",
            "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 group-hover/contact:opacity-100 pointer-coarse:opacity-100",
            copied && "opacity-100 text-led-green"
          )}
        >
          {copied ? (
            <CheckIcon className="size-3.5 text-led-green" />
          ) : (
            <CopyIcon className="size-3.5" />
          )}
        </button>
      )}
    </span>
  );
}

export function ProtectedEmail({
  emailB64,
  className,
  displayMask,
  showCopy = true,
}: {
  emailB64: string;
  className?: string;
  displayMask?: string;
  showCopy?: boolean;
}) {
  const mounted = useIsClient();
  const [href, setHref] = useState<string | undefined>(undefined);
  const [copied, setCopied] = useState(false);

  const email = mounted ? decodeB64(emailB64) : "";
  const formatted = displayMask || email;

  // Lazy-inject `mailto:` only on human pointer/focus interaction
  const handleActivate = () => {
    if (email && !href) {
      setHref(`mailto:${email}`);
    }
  };

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!email) return;
    try {
      void playCopySuccessSound();
      haptic();
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  if (!mounted) {
    // SSR payload: no plaintext email in static HTML
    return (
      <span className={cn("inline-flex items-center gap-1.5 font-mono", className)}>
        <span className="inline-block h-3.5 w-36 animate-pulse rounded bg-muted/40 align-middle" />
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-center gap-1.5 font-mono group/contact", className)}>
      <a
        href={href || `mailto:${email}`}
        onPointerEnter={handleActivate}
        onTouchStart={handleActivate}
        onFocus={handleActivate}
        onClick={(e) => {
          if (!href) {
            e.preventDefault();
            window.location.href = `mailto:${email}`;
          }
        }}
        className="link break-all text-inherit hover:text-foreground select-all"
        title="Send email"
      >
        {formatted}
      </a>

      {showCopy && (
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? "Copied email address" : "Copy email address"}
          title={copied ? "Copied!" : "Copy to clipboard"}
          className={cn(
            "inline-flex size-5 shrink-0 items-center justify-center rounded transition-all",
            "text-muted-foreground/60 hover:bg-muted hover:text-foreground active:scale-95",
            "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 group-hover/contact:opacity-100 pointer-coarse:opacity-100",
            copied && "opacity-100 text-led-green"
          )}
        >
          {copied ? (
            <CheckIcon className="size-3.5 text-led-green" />
          ) : (
            <CopyIcon className="size-3.5" />
          )}
        </button>
      )}
    </span>
  );
}
