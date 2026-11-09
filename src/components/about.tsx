import Link from "next/link";
import { identity } from "@/data/profile";
import { Greeting } from "./greeting";
import { Panel, PanelContent, PanelHeader, PanelTitle } from "./panel";
import { SolderingIronText } from "./soldering-iron-text";

export default function About({ className }: { className?: string } = {}) {
  return (
    <Panel id="about" className={className}>
      <PanelHeader>
        <PanelTitle>
          <Greeting />
        </PanelTitle>
      </PanelHeader>
      <PanelContent className="space-y-4">
        <ul className="list-disc space-y-3.5 pl-4 sm:pl-5 text-pretty text-base leading-relaxed text-foreground/90 marker:text-muted-foreground/60">
          <li className="pl-1">
            I’m Rajkumar Neupane — a Network Support Technician in Toronto, CCNA &amp; CCST certified, focused on bulletproof infrastructure reliability and Layer 1–3 troubleshooting.
          </li>
          <li className="pl-1">
            Hardware triage technician at Geek Squad City by day; home-lab builder configuring and breaking routing topologies across Proxmox, EVE-NG, and Cisco CML by night.
          </li>
          <li className="pl-1">
            Drilled 300+ hands-on network lab simulations into CLI muscle memory, documented in my lab notes at{" "}
            <Link
              href="/docs"
              className="font-medium underline decoration-border underline-offset-3 transition-colors hover:text-foreground hover:decoration-foreground"
            >
              /docs
            </Link>
            , grounded in 10 months of chip-level board repair with a <SolderingIronText /> in Kathmandu.
          </li>
        </ul>

        <div className="pt-1">
          <Link
            href="/about"
            className="link-underline inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Read the full story
            <span aria-hidden>→</span>
          </Link>
        </div>
      </PanelContent>
    </Panel>
  );
}
