import Image from "next/image";
import { labLog, links } from "@/data/profile";
import { Panel, PanelHeader, PanelTitle } from "./panel";
import { ArrowUpRightIcon } from "./icons";

export default function LabLog() {
  const entries = labLog.slice(0, 4);

  return (
    <Panel id="lab-log" className="bg-tech-pattern">
      <PanelHeader>
        <PanelTitle>
          Labs
        </PanelTitle>
      </PanelHeader>

      <ul className="grid sm:grid-cols-2">
        {entries.map((entry, i) => (
          <li
            key={entry.href}
            className={[
              // hairline grid: every cell but the last row gets a bottom rule;
              // on two columns, left cells get a right rule
              i < entries.length - 1 ? "border-b border-line" : "",
              i < entries.length - 2 ? "sm:border-b" : "sm:border-b-0",
              i % 2 === 0 ? "sm:border-r sm:border-line" : "",
              i >= entries.length - 2 ? "sm:!border-b-0" : "",
            ].join(" ")}
          >
            <a href={entry.href} className="group block p-4">
              <div className="overflow-hidden rounded-md border border-line">
                <Image
                  src={entry.image}
                  alt=""
                  width={880}
                  height={495}
                  sizes="(min-width: 768px) 352px, (min-width: 640px) 50vw, 100vw"
                  className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
              </div>

              <p className="mt-3 font-mono text-xs text-muted-foreground/70">
                {entry.date}
              </p>

              <h3 className="mt-1 flex items-baseline gap-1.5 text-base font-medium">
                <span className="decoration-current/30 underline-offset-3 transition-colors group-hover:underline">
                  {entry.title}
                </span>
                <ArrowUpRightIcon className="size-3.5 shrink-0 self-center text-muted-foreground/50 transition-colors group-hover:text-foreground" />
              </h3>

              <p className="mt-1 text-pretty text-sm leading-relaxed text-muted-foreground">
                {entry.blurb}
              </p>
            </a>
          </li>
        ))}
      </ul>

      <a
        href={links.labs}
        className="screen-line-top diagonal-stripes group flex w-full items-center justify-center py-3.5 transition-all duration-200 hover:brightness-125"
      >
        <span className="flex items-center gap-2 rounded-md border border-line bg-background/90 px-3 py-1.5 font-mono text-xs text-muted-foreground shadow-xs backdrop-blur-xs transition-all duration-200 group-hover:border-border group-hover:bg-background group-hover:text-foreground group-hover:shadow-sm">
          <span>all labs</span>
          <span className="text-muted-foreground/40 transition-transform group-hover:translate-x-0.5">→</span>
          <span className="font-semibold text-foreground">/docs</span>
        </span>
      </a>
    </Panel>
  );
}
