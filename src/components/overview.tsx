import Link from "next/link";
import { identity, links } from "@/data/profile";
import { CurrentLocalTime } from "./current-local-time";
import { Item } from "./overview-item";
import { Panel, PanelContent } from "./panel";
import { PhoneItem } from "./phone-item";
import { ProtectedEmail } from "./protected-contact";
import {
  BriefcaseIcon,
  GlobeIcon,
  MailIcon,
  MapPinIcon,
} from "./icons";

export default function Overview() {
  return (
    <Panel className="screen-line-top-none screen-line-bottom-none">
      <h2 className="sr-only">Overview</h2>
      <PanelContent className="grid gap-x-4 gap-y-2.5 sm:grid-cols-2">
        <Item icon={<BriefcaseIcon />}>
          {identity.role}
          {identity.status && (
            <>
              {" "}
              <span className="inline-flex items-center gap-1.5 text-led-green">
                <span className="led led-green" aria-hidden />
                {identity.status}
              </span>
            </>
          )}
        </Item>

        <CurrentLocalTime timeZone={identity.timeZone} />

        <Item icon={<MapPinIcon />}>
          {identity.location}
        </Item>

        <PhoneItem phoneB64={identity.phoneB64} />

        <Item icon={<MailIcon />}>
          <ProtectedEmail emailB64={identity.emailB64} />
        </Item>

        <Item icon={<GlobeIcon />}>
          <div className="group flex items-center">
            <Link 
              className="flex items-center font-medium text-foreground transition-colors" 
              href="/docs"
            >
              Docs & Labs
              <span className="ml-1 text-muted-foreground transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true">→</span>
            </Link>

            <div className="flex items-center overflow-hidden transition-all duration-500 max-w-0 opacity-0 group-hover:max-w-[150px] group-hover:opacity-100">
              <span className="mx-2 text-muted-foreground">·</span>
              <a 
                className="whitespace-nowrap text-muted-foreground hover:text-foreground transition-colors" 
                href={links.projects}
              >
                Projects
              </a>
              <span className="mx-2 text-muted-foreground">·</span>
              <Link 
                className="whitespace-nowrap text-muted-foreground hover:text-foreground transition-colors" 
                href="/blog"
              >
                Blog
              </Link>
            </div>
          </div>
        </Item>
      </PanelContent>

      {/* dashed vertical divider between the two columns (chanhdai.com) */}
      <div
        className="pointer-events-none absolute top-px bottom-0 left-1/2 -z-1 w-px -translate-x-[9px] bg-[linear-gradient(to_bottom,var(--line)_4px,transparent_2px)] bg-size-[1px_6px] bg-repeat-y max-sm:hidden"
        aria-hidden
      />
    </Panel>
  );
}
