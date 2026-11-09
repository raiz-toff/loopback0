import type { BottomNavLink } from "./context";

/** Homepage anchors, in page order. Ids match the <Panel id> values on the front page. */
export const HOME_SECTIONS: BottomNavLink[] = [
  { label: "About", href: "/#about" },
  { label: "Tech Stack", href: "/#stack" },
  { label: "Experience", href: "/#experience" },
  { label: "Certifications", href: "/#certs" },
  { label: "Blog", href: "/#blog" },
  { label: "Lab Log", href: "/#lab-log" },
  { label: "Projects", href: "/#projects" },
];
