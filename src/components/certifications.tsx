"use client";

import { useState } from "react";
import { certInterfaces, type Issuer } from "@/data/profile";
import { Panel, PanelHeader, PanelTitle, PanelTitleSup } from "./panel";
import {
  ArrowUpRightIcon,
  ChevronDownIcon,
  CiscoIcon,
  GoogleIcon,
  NvidiaIcon,
  PacktIcon,
  RedHatIcon,
} from "./icons";

const VISIBLE_COUNT = 4;

const ISSUER_ICONS: Partial<
  Record<Issuer, (props: React.ComponentProps<"svg">) => React.ReactElement>
> = {
  google: GoogleIcon,
  cisco: CiscoIcon,
  nvidia: NvidiaIcon,
  redhat: RedHatIcon,
  packt: PacktIcon,
};

const ISSUER_INITIALS: Partial<Record<Issuer, string>> = {
  yonsei: "Y",
  "illinois-tech": "IIT",
};

type IssuerStyle = {
  badge: string;
  icon?: string;
};

const ISSUER_STYLES: Record<Issuer, IssuerStyle> = {
  cisco: {
    badge:
      "bg-[#049FD9]/12 border-[#049FD9]/30 text-[#049FD9] ring-[#049FD9]/20 shadow-2xs",
    icon: "text-[#049FD9]",
  },
  google: {
    badge:
      "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 ring-zinc-300/40 dark:ring-zinc-700/50 shadow-2xs",
    icon: "",
  },
  nvidia: {
    badge:
      "bg-[#76B900]/12 border-[#76B900]/30 text-[#76B900] ring-[#76B900]/20 shadow-2xs",
    icon: "text-[#76B900]",
  },
  redhat: {
    badge:
      "bg-[#EE0000]/12 border-[#EE0000]/30 text-[#EE0000] ring-[#EE0000]/20 shadow-2xs",
    icon: "text-[#EE0000]",
  },
  packt: {
    badge:
      "bg-[#F15A24]/12 border-[#F15A24]/30 text-[#F15A24] ring-[#F15A24]/20 shadow-2xs",
    icon: "text-[#F15A24]",
  },
  yonsei: {
    badge:
      "bg-[#164194]/12 border-[#164194]/30 text-[#164194] dark:text-[#5B8DEF] ring-[#164194]/20 shadow-2xs",
    icon: "text-[#164194] dark:text-[#5B8DEF]",
  },
  "illinois-tech": {
    badge:
      "bg-[#C8102E]/12 border-[#C8102E]/30 text-[#C8102E] dark:text-[#FF5C6F] ring-[#C8102E]/20 shadow-2xs",
    icon: "text-[#C8102E] dark:text-[#FF5C6F]",
  },
};

function IssuerMark({ issuer }: { issuer: Issuer }) {
  const Icon = ISSUER_ICONS[issuer];
  const style = ISSUER_STYLES[issuer];
  if (Icon) {
    return (
      <Icon
        className={`size-4.5 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
          style?.icon ?? "text-muted-foreground"
        }`}
      />
    );
  }
  return (
    <span
      className={`font-mono text-[10px] font-bold tracking-tight transition-transform duration-200 group-hover:scale-110 ${
        style?.icon ?? "text-muted-foreground"
      }`}
    >
      {ISSUER_INITIALS[issuer]}
    </span>
  );
}

export default function Certifications() {
  const [expanded, setExpanded] = useState(false);
  const [openCourses, setOpenCourses] = useState<Set<string>>(new Set());
  const hiddenCount = certInterfaces.length - VISIBLE_COUNT;
  const visibleCerts = expanded
    ? certInterfaces
    : certInterfaces.slice(0, VISIBLE_COUNT);

  const toggleCourses = (port: string) => {
    setOpenCourses((prev) => {
      const next = new Set(prev);
      if (next.has(port)) next.delete(port);
      else next.add(port);
      return next;
    });
  };

  return (
    <Panel id="certs">
      <PanelHeader>
        <PanelTitle>
          Certifications
          <PanelTitleSup>({certInterfaces.length})</PanelTitleSup>
        </PanelTitle>
      </PanelHeader>

      <ul>
        {visibleCerts.map((cert, i) => {
          const style = ISSUER_STYLES[cert.issuer];
          const badge = (
            <span
              className={`mx-3.5 sm:mx-4 flex size-7 sm:size-7.5 shrink-0 items-center justify-center rounded-lg border ring-1 ring-offset-1 ring-offset-background transition-all duration-200 group-hover:scale-105 ${
                style?.badge ??
                "border-muted-foreground/15 bg-muted text-muted-foreground ring-line"
              }`}
            >
              <IssuerMark issuer={cert.issuer} />
            </span>
          );

          const meta = (
            <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 font-mono text-xs text-muted-foreground">
              <span>{cert.proto}</span>
              {cert.date && (
                <>
                  <span className="text-border">·</span>
                  <span>{cert.date}</span>
                </>
              )}
              {cert.courses && (
                <>
                  <span className="text-border">·</span>
                  <span>{cert.courses.length} courses</span>
                </>
              )}
            </p>
          );

          const rowClassName =
            i < visibleCerts.length - 1 ? "border-b border-line" : "";

          if (cert.courses) {
            const isOpen = openCourses.has(cert.port);
            return (
              <li key={cert.port} className={rowClassName}>
                <div className="group flex items-center pr-2">
                  {badge}
                  <div className="flex min-w-0 flex-1 items-center border-l border-dashed border-line">
                    <button
                      type="button"
                      onClick={() => toggleCourses(cert.port)}
                      aria-expanded={isOpen}
                      className="flex min-w-0 flex-1 items-center gap-3 p-4 text-left transition-colors hover:bg-muted/30"
                    >
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-medium text-balance transition-colors group-hover:text-foreground">
                          {cert.desc}
                        </h3>
                        {meta}
                      </div>
                      <ChevronDownIcon
                        className={`size-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {cert.href && (
                      <a
                        href={cert.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`View ${cert.desc} credential`}
                        className="shrink-0 p-4 pl-0 text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <ArrowUpRightIcon className="size-4" />
                      </a>
                    )}
                  </div>
                </div>
                {isOpen && (
                  <div className="px-4 pb-4">
                    <ul className="space-y-0.5 border-l border-dashed border-line pl-3">
                      {cert.courses.map((course, ci) => (
                        <li
                          key={course}
                          className="font-mono text-[11px] text-muted-foreground/70"
                        >
                          <span className="text-muted-foreground/40 tabular-nums">
                            {String(ci + 1).padStart(2, "0")}
                          </span>
                          <span className="mx-1.5 text-border">·</span>
                          {course}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            );
          }

          const inner = (
            <div className="group flex items-center pr-2">
              {badge}
              <div className="flex min-w-0 flex-1 items-center gap-3 border-l border-dashed border-line p-4">
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-medium text-balance transition-colors group-hover:text-foreground">
                    {cert.desc}
                  </h3>
                  {meta}
                </div>
                {cert.href && (
                  <ArrowUpRightIcon className="size-4 shrink-0 text-muted-foreground transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                )}
              </div>
            </div>
          );

          return (
            <li key={cert.port} className={rowClassName}>
              {cert.href ? (
                <a
                  href={cert.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block transition-colors hover:bg-muted/30"
                >
                  {inner}
                </a>
              ) : (
                inner
              )}
            </li>
          );
        })}
      </ul>

      {hiddenCount > 0 && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-label={
            expanded
              ? "Show fewer certifications"
              : `Show ${hiddenCount} more certifications`
          }
          className="screen-line-top diagonal-stripes group flex w-full items-center justify-center py-3.5 transition-all duration-200 hover:brightness-125"
        >
          <span className="flex items-center gap-1.5 rounded-md border border-line bg-background/90 px-3 py-1.5 font-mono text-xs text-muted-foreground shadow-xs backdrop-blur-xs transition-all duration-200 group-hover:border-border group-hover:bg-background group-hover:text-foreground group-hover:shadow-sm">
            <span>{expanded ? "Show less" : "Show more"}</span>
            <ChevronDownIcon
              className={`size-3.5 transition-transform duration-200 ${
                expanded ? "rotate-180" : ""
              }`}
            />
          </span>
        </button>
      )}
    </Panel>
  );
}
