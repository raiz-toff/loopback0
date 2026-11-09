import { identity, socialLinks } from "@/data/profile";
import { Panel, PanelContent } from "./panel";
import ShareMenu from "./share-menu";
import SoundLink from "./sound-link";
import Tooltip from "./tooltip";
import { HandwrittenArrow, HandwrittenNote } from "./handwritten-note";
import {
  AwardIcon,
  GitHubIcon,
  LinkedInIcon,
} from "./icons";

const ICONS: Record<string, React.ReactNode> = {
  GitHub: <GitHubIcon className="size-4.5" />,
  LinkedIn: <LinkedInIcon className="size-4.5" />,
  Credly: <AwardIcon className="size-4.5" />,
};

const tileClass =
  "flex size-9 items-center justify-center rounded-lg border border-line bg-muted/40 text-foreground/80 transition-all hover:border-border hover:bg-muted hover:text-foreground active:scale-95";

export default function SocialLinks() {
  return (
    <Panel className="relative">
      <h2 className="sr-only">Social links</h2>
      <PanelContent className="flex items-center gap-1.5 p-2 sm:p-2.5">
        {socialLinks.map((item) => (
          <Tooltip
            key={item.name}
            label={`${item.name} (@${item.handle})`}
            side="top"
          >
            <SoundLink
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${item.name} — ${item.handle}`}
              className={tileClass}
            >
              {ICONS[item.name]}
            </SoundLink>
          </Tooltip>
        ))}

        <span className="mx-1 h-4 w-px bg-border/80" aria-hidden />

        <Tooltip label="Share profile" side="top">
          <ShareMenu
            title={`${identity.name} — ${identity.role}`}
            url="/"
            triggerClassName={tileClass}
            iconOnly
          />
        </Tooltip>
      </PanelContent>

      <HandwrittenNote
        className="-top-4 right-full mr-4 hidden w-28 flex-col items-end lg:flex"
        aria-hidden
      >
        <span className="-rotate-6 whitespace-nowrap">social links</span>
        <HandwrittenArrow className="size-7 translate-x-3 -scale-x-100 -rotate-6" />
      </HandwrittenNote>
    </Panel>
  );
}

