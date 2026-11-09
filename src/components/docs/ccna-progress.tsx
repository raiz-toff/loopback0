import Link from "next/link";
import { source } from "@/lib/source";
import { CautionTape, HAZARD_STRIPES } from "./hazard";

// The six CCNA 200-301 exam domains, their content folders and exam weights.
const DOMAINS = [
  { n: "1.0", name: "Network Fundamentals", folder: "1.0-network-f", weight: 20 },
  { n: "2.0", name: "Network Access", folder: "2.0-network-a", weight: 20 },
  { n: "3.0", name: "IP Connectivity", folder: "3.0-ip-connect", weight: 25 },
  { n: "4.0", name: "IP Services", folder: "4.0-ip-services", weight: 10 },
  { n: "5.0", name: "Security Fundamentals", folder: "5.0-security-f", weight: 15 },
  { n: "6.0", name: "Automation & Programmability", folder: "6.0-auto-and-p", weight: 10 },
];

/** Each domain with its published lab count: pages below its folder, not its index. */
function domainsWithLabs() {
  const urls = source.getPages().map((p) => p.url);
  return DOMAINS.map((d) => {
    const base = `/docs/ccna-labs/${d.folder}`;
    return { ...d, href: base, labs: urls.filter((u) => u.startsWith(`${base}/`)).length };
  });
}

/**
 * Exam coverage bar, sized by blueprint weight. Domains with labs are solid;
 * the rest is hazard tape still to be laid. Updates as labs are published.
 */
export function CcnaCoverage() {
  const domains = domainsWithLabs();
  const built = domains.filter((d) => d.labs > 0).reduce((sum, d) => sum + d.weight, 0);
  return (
    <figure className="not-prose my-6">
      <div className="flex h-4 overflow-hidden rounded-sm ring-1 ring-black/15">
        {domains.map((d) => (
          <div
            key={d.n}
            title={`${d.n} ${d.name}: ${d.labs ? `${d.labs} lab${d.labs > 1 ? "s" : ""}` : "under construction"}`}
            className="border-r border-fd-background last:border-r-0"
            style={{ width: `${d.weight}%`, background: d.labs ? "#2E7D46" : HAZARD_STRIPES }}
          />
        ))}
      </div>
      <figcaption className="mt-2 flex justify-between font-mono text-[11px] text-fd-muted-foreground">
        <span>{built}% of the exam blueprint has labs</span>
        <span>{100 - built}% under construction</span>
      </figcaption>
    </figure>
  );
}

/** Domain cards. Unbuilt domains are dimmed with caution tape across them. */
export function CcnaDomains() {
  return (
    <div className="not-prose my-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {domainsWithLabs().map((d) => (
        <Link
          key={d.n}
          href={d.href}
          className="relative overflow-hidden rounded-lg border border-fd-border p-3 transition-colors hover:bg-fd-accent/50"
        >
          <div className={d.labs === 0 ? "opacity-40" : undefined}>
            <div className="font-mono text-[11px] text-fd-muted-foreground">
              {d.n} · {d.weight}% of exam
            </div>
            <div className="mt-1 text-[14px] font-medium text-fd-foreground">{d.name}</div>
            <div className="mt-2 font-mono text-[11px] text-fd-muted-foreground">
              {d.labs ? `${d.labs} lab${d.labs > 1 ? "s" : ""}` : "no labs yet"}
            </div>
          </div>
          {d.labs === 0 ? (
            <CautionTape text="WORK IN PROGRESS" className="absolute top-1/2 -left-4 w-[140%] -translate-y-1/2 -rotate-[8deg]" />
          ) : null}
        </Link>
      ))}
    </div>
  );
}
