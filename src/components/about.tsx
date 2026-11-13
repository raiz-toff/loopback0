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
            I’m Rajkumar Neupane, a CCNA- and CCST-certified networking graduate in Toronto, looking for a network support or NOC role.
          </li>
          <li className="pl-1">
            Product tester at Geek Squad City by day, doing hardware diagnostics and QA. By night, I build and break routing topologies on a MikroTik and Cisco Catalyst home lab with Proxmox, EVE-NG and Cisco CML.
          </li>
          <li className="pl-1">
            Passed the CCNA on the first attempt after 300+ practice labs in 19 days. The ones I’ve written up are at{" "}
            <Link
              href="/docs"
              className="font-medium underline decoration-border underline-offset-3 transition-colors hover:text-foreground hover:decoration-foreground"
            >
              /docs
            </Link>
            . Before networking, I spent 10 months on chip-level board repair with a <SolderingIronText /> in Kathmandu.
          </li>
        </ul>

        <div className="pt-1">
          <Link
            href="/about"
            className="link-underline inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Read my story
            <span aria-hidden>→</span>
          </Link>
        </div>
      </PanelContent>
    </Panel>
  );
}
