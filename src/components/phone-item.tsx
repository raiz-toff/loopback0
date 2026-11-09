"use client";

// Phone number kept base64-encoded in source (see data/profile.ts) and
// revealed only on human interaction, so bots and scrapers never harvest it.

import { IconBox } from "./overview-item";
import { PhoneIcon } from "./icons";
import { ProtectedPhone } from "./protected-contact";

export function PhoneItem({ phoneB64 }: { phoneB64: string }) {
  return (
    <div className="group flex items-center gap-4 font-mono text-sm">
      <IconBox>
        <PhoneIcon />
      </IconBox>
      <div className="text-balance">
        <ProtectedPhone phoneB64={phoneB64} />
      </div>
    </div>
  );
}
