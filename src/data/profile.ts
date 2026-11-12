// Single source of truth for the front-face content.
// Everything here is real — pulled from labs, posts, and certs.

export const identity = {
  name: "Rajkumar Neupane",
  role: "Network Support Technician",
  location: "Toronto, Canada",
  origin: "Kathmandu, Nepal",
  timeZone: "America/Toronto",
  status: "",
  emailB64: "bi5yYWprdW1hci53b3Jrc3BhY2VAZ21haWwuY29t",
  // base64 — kept out of plaintext to deter trivial scraping; decoded client-side.
  phoneB64: "KzE0Mzc2NjUzMzkw",
  flipSentences: [
    "Depot diagnostics by day. Enterprise labs by night.",
    "CCNA · CCST certified · Toronto.",
  ],
  // Short teaser for the homepage panel. The full narrative lives at /story.
  aboutTeaser:
    "I didn't start in IT with simulators; I started with a multimeter and soldering iron in Kathmandu fixing dead circuits. Running high-volume hardware diagnostics at Geek Squad City by day and labbing enterprise routing on real Cisco and MikroTik gear by night.",
};

// ── The full story, told chapter by chapter, for /story ─────────────────
export type StoryChapter = {
  id: string;
  title: string;
  paragraphs: string[];
};

export const story: StoryChapter[] = [
  {
    id: "foundation",
    title: "The Foundation",
    paragraphs: [
      "My start in IT wasn't with simulators. It was with a multimeter and a soldering iron back in Kathmandu. I spent 10 months at Kantipur Technical Institute learning chip-level repair. I'll be honest, at first, just prying open a customer's laptop case was terrifying. I was always worried about snapping a ribbon cable.",
      "Diagnosing a dead board meant relying entirely on PDF schematics. You can't just guess how power flows through a circuit; you have to physically trace the voltage drops to isolate the fault.",
      "It wasn't a glamorous environment at all. But dealing with hardware at the component level taught me the absolute baseline of troubleshooting: finding the exact point of failure.",
    ],
  },
  {
    id: "detour",
    title: "The Detour That Mattered",
    paragraphs: [
      "Before I ever touched a router, I worked in logistics and supply chain ops at Nepamed Healthcare. I didn't actually plan on leaving logistics, but watching an entire warehouse grind to a halt just because a system went down makes you realize who really runs the building.",
      "That environment basically proved to me that infrastructure is only valuable if it moves data reliably. Throwing expensive tech at a wall without solving a real operational problem is just generating noise.",
    ],
  },
  {
    id: "now",
    title: "Now",
    paragraphs: [
      "Eventually, I packed up and relocated to Toronto for the Computer Systems Networking diploma at Canadore College. The coursework gave me the theory, but I knew I needed brute-force repetition to actually pass the CCNA.",
      "Since I definitely couldn't afford physical Catalyst switches, I deployed Proxmox on an old decommissioned desktop. Over one month, I ran 19 consecutive 10-hour study sessions and completed over 300 hands-on lab topologies. Nowadays, my home lab runs Proxmox hosting EVE-NG, Cisco CML, and GitLab. I intentionally break, rebuild, and document things daily just so the CLI syntax stays in my muscle memory.",
      "By day, I work the depot floor at Geek Squad City in Brampton. It's a lot of high-volume hardware triage. I run diagnostics across Windows, macOS, and mobile, and make sure devices meet strict QA standards before they get recertified.",
    ],
  },
  {
    id: "off-the-clock",
    title: "Off the Clock",
    paragraphs: [
      "When I'm away from the routing tables, I still use Photoshop and Lightroom for photography.",
      "But motorcycles are my main hobby right now. I'm specifically into adventure (ADV) riding and touring, and I do all the maintenance myself. The habit actually started back in Nepal, where I'd maintain and customize my own mountain bike, welding and grinding parts by hand.",
      "Turns out, taking a physical machine apart to figure out how it ticks uses the exact same diagnostic mindset as isolating a network fault. You learn the boundaries of a system by breaking it, and then forcing yourself to put it back together.",
    ],
  },
];

// Workshop photos accompanying the "Off the Clock" chapter — real shots, Kathmandu.
export const workshopPhotos: { src: string; alt: string; caption: string }[] = [
  { src: "/img/welding.jpg", alt: "Welding on a rooftop in Kathmandu", caption: "welding" },
  { src: "/img/grinding.jpg", alt: "Grinding steel for a rooftop railing", caption: "grinding" },
  { src: "/img/soldering.jpg", alt: "Soldering a circuit board", caption: "soldering" },
];

export const links = {
  // The docs merged into this site — lab notes live at /docs now.
  labs: "/docs",
  projects: "/docs/projects",
  blog: "/blog",
  github: "https://github.com/raiz-toff",
  linkedin: "https://www.linkedin.com/in/rjneupane",
  credly: "https://www.credly.com/users/rajkumarneupane",
  gallery: "/gallery",
  resume: "/resume",
  resumeHtml: "/resume",
};

export const socialLinks: { name: string; handle: string; href: string }[] = [
  { name: "GitHub", handle: "raiz-toff", href: links.github },
  { name: "LinkedIn", handle: "rjneupane", href: links.linkedin },
  { name: "Credly", handle: "rajkumarneupane", href: links.credly },
];

// ── Experience, oldest chapter last ─────────────────────────────────────
// Structured company → positions, styled after chanhdai.com's WorkExperience.
// `kind` maps to an icon inside the WorkExperience component (data stays JSX-free).
export type ExperienceProject = {
  name: string;
  /** Overview page of the project. */
  href: string;
  /** What it is, in a few words. */
  blurb: string;
  /** Root-absolute thumbnail, 16:9 or wider. */
  image: string;
  /** Short status shown after the name, such as "retired". */
  status?: string;
};

export type ExperiencePosition = {
  title: string;
  /** Shown verbatim, so the narrative periods stay intact. */
  period: string;
  employmentType?: string;
  kind: "server" | "grad" | "briefcase" | "wrench" | "tester";
  notes: string[];
  skills?: string[];
  /** Projects that came out of this role, linked to their overview page. */
  projects?: ExperienceProject[];
  /** Start expanded on load. */
  expanded?: boolean;
};

export type ExperienceCompany = {
  id: string;
  org: string;
  where: string;
  website?: string;
  /** URL to the company/school logo. Falls back to a neutral dot when omitted. */
  logo?: string;
  current?: boolean;
  positions: ExperiencePosition[];
};

export const experience: ExperienceCompany[] = [
  {
    id: "best-buy",
    org: "Best Buy Canada (Geek Squad City)",
    where: "Brampton, ON",
    website: "https://www.bestbuy.ca",
    logo: "/img/best-buy-logo.png",
    current: true,
    positions: [
      {
        title: "Product Tester (Hardware Diagnostics & QA)",
        period: "August 2026 — present",
        employmentType: "Contract (6-Month)",
        kind: "tester",
        expanded: true,
        notes: [
          "Diagnose, test, and troubleshoot hardware and software issues across diverse consumer electronics including computers, smartphones, tablets, and smart home network devices.",
          "Perform operating system diagnostics and cross-platform troubleshooting on Windows, macOS, Android, and iOS environments.",
          "Implement data sanitation procedures, performing secure factory resets and data wipes in strict compliance with PIPEDA privacy regulations.",
          "Conduct component-level replacements, upgrades, and diagnostic hardware testing; record root-cause failure codes in the service-order system before devices are recertified.",
        ],
        skills: [
          "Hardware Diagnostics",
          "OS Troubleshooting",
          "Windows/macOS/iOS/Android",
          "PIPEDA Compliance",
          "Data Sanitation",
          "Quality Assurance",
        ],
      },
    ],
  },
  {
    id: "home-lab",
    org: "Self-Hosted Enterprise Lab",
    where: "Toronto",
    current: true,
    positions: [
      {
        title: "Home Lab Operator",
        period: "2024 — present",
        employmentType: "Self-directed",
        kind: "server",
        expanded: false,
        notes: [
          "Proxmox VE hosting EVE-NG, Cisco CML, GitLab, and Zabbix/Grafana — broken, rebuilt, and documented daily.",
          "Lab configs versioned in a local GitLab instance with CI/CD pipelines.",
        ],
        projects: [
          {
            name: "Marrow",
            href: "/docs/projects/marrow",
            blurb: "Compiles a YAML description into an interactive network diagram.",
            image: "/blog/covers/marrow.png",
          },
        ],
        skills: [
          "Proxmox VE",
          "EVE-NG",
          "Cisco CML",
          "GitLab CI/CD",
          "Zabbix",
          "Grafana",
        ],
      },
    ],
  },
  {
    id: "doordash",
    org: "DoorDash",
    where: "Greater Toronto Area",
    positions: [
      {
        title: "Delivery Driver",
        period: "2025 — 2026",
        employmentType: "Independent contractor",
        kind: "briefcase",
        notes: [
          "Completed 8,000+ deliveries across the GTA while job-searching after graduation.",
          "Built Comma to replace spreadsheet tracking of shifts, dead miles, expenses, and HST set-asides; used it daily for six months.",
          "Rebuilt it as MileWage: a native Android app that records the shift and a self-hosted server, reached over Tailscale, that keeps the data.",
        ],
        projects: [
          {
            name: "MileWage",
            href: "/docs/projects/milewage",
            blurb: "Mileage tracker that keeps the data on a server you own.",
            image: "/blog/covers/milewage.png",
          },
          {
            name: "Comma",
            href: "/docs/projects/comma",
            blurb: "Offline earnings tracker for gig workers.",
            image: "/blog/covers/comma.png",
            status: "retired",
          },
        ],
        skills: ["Kotlin", "React Native", "TypeScript", "Docker", "Tailscale", "SQLite"],
      },
    ],
  },
  {
    id: "canadore",
    org: "Canadore College",
    where: "Toronto",
    website:
      "https://www.canadorecollege.ca/programs/computer-systems-networking-technician",
    logo: "/img/canadore-college-logo.png",
    positions: [
      {
        title: "Computer Systems Technician – Networking, Diploma",
        period: "Sep 2023 — Apr 2025",
        employmentType: "Diploma",
        kind: "grad",
        notes: [
          "Routing & switching from Packet Tracer through real racks — CST 115, 215, 250.",
          "Windows Server, Active Directory, and Linux administration coursework.",
        ],
        skills: [
          "Routing & Switching",
          "Windows Server",
          "Active Directory",
          "Linux",
          "Packet Tracer",
        ],
      },
      {
        title: "Peer Technical Mentor (Volunteer)",
        period: "Oct 2023 — Apr 2025",
        employmentType: "Volunteer",
        kind: "grad",
        notes: [
          "Walked classmates through VLAN segmentation, OSPF, STP convergence, and ACLs on the physical Cisco racks.",
          "Helped with VMware and VirtualBox setups, Linux server administration, and Windows Server configuration.",
        ],
        skills: ["Cisco IOS", "OSPF", "STP", "ACLs", "VMware"],
      },
    ],
  },
  {
    id: "nepamed",
    org: "Nepamed Healthcare",
    where: "Kathmandu",
    positions: [
      {
        title: "Operations Coordinator",
        period: "Sep 2022 — Aug 2023",
        employmentType: "Full-time",
        kind: "briefcase",
        notes: [
          "Managed regional logistics and supply chain workflows.",
          "Oversaw daily operational infrastructure and mitigated inventory bottlenecks.",
        ],
        skills: ["Logistics", "Supply Chain", "Operations"],
      },
    ],
  },
  {
    id: "kantipur",
    org: "Kantipur Technical Institute",
    where: "Kathmandu",
    website: "https://www.kantipurtechnical.com",
    logo: "/img/kantipur-technical-institute-logo.png",
    positions: [
      {
        title: "Chip-Level Repair Technician (Trainee)",
        period: "2021 — 2022 · 10 months",
        employmentType: "Trainee",
        kind: "wrench",
        notes: [
          "Performed component-level soldering and hardware diagnostics on dead motherboards.",
          "Utilized PDF schematics to trace voltage drops and isolate power faults across circuits.",
        ],
        skills: ["Soldering", "Schematics", "Board Repair"],
      },
    ],
  },
];

// ── Certifications, rendered as an interface-status table ──────────────
export type Issuer =
  | "google"
  | "cisco"
  | "nvidia"
  | "redhat"
  | "packt"
  | "yonsei"
  | "illinois-tech";

export type Interface = {
  port: string;
  desc: string;
  status: "up" | "in progress";
  proto: string;
  issuer: Issuer;
  date?: string;
  href?: string;
  courses?: string[];
};

export const certInterfaces: Interface[] = [
  {
    port: "Gi0/0",
    desc: "CCNA — Cisco Certified Network Associate",
    status: "up",
    proto: "200-301",
    issuer: "cisco",
    date: "Issued Nov 2025 · Expires Nov 2028",
    href: "https://www.credly.com/badges/af584e8e-7709-4027-9042-183d9a6a4c23/public_url",
  },
  {
    port: "Gi0/1",
    desc: "CCST Networking — Cisco Certified Support Technician (Lifetime)",
    status: "up",
    proto: "Cisco",
    issuer: "cisco",
    date: "Issued Apr 2025",
    href: "https://www.credly.com/badges/35041e90-14b2-41e3-8d26-e31f2317213f/public_url",
  },
  {
    port: "Gi0/2",
    desc: "Google IT Support Professional Certificate (v.3)",
    status: "up",
    proto: "Coursera",
    issuer: "google",
    date: "Issued Jan 2026",
    href: "https://coursera.org/share/01739919e78041c627c40fd2766a2c88",
    courses: [
      "Technical Support Fundamentals",
      "The Bits and Bytes of Computer Networking",
      "Operating Systems and You: Becoming a Power User",
      "System Administration and IT Infrastructure Services",
      "IT Security: Defense Against the Digital Dark Arts",
    ],
  },
  {
    port: "Gi0/3",
    desc: "Cisco Networking Academy — Network Technician pathway",
    status: "up",
    proto: "NetAcad",
    issuer: "cisco",
    date: "Feb — Apr 2025",
    href: "https://www.credly.com/users/rajkumarneupane",
    courses: [
      "Network Technician Career Path",
      "Network Support and Security",
      "Network Addressing and Basic Troubleshooting",
      "Networking Devices and Initial Configuration",
      "Networking Basics",
      "Computer Hardware Basics",
      "Introduction to Packet Tracer",
    ],
  },
  {
    port: "Gi0/4",
    desc: "Supplementary coursework",
    status: "up",
    proto: "Coursera",
    issuer: "yonsei",
    href: "https://www.coursera.org/account/accomplishments/records/3IQEMUUOGVFY",
    courses: [
      "Introduction to TCP/IP — Yonsei University",
      "Introduction to Networking — NVIDIA",
      "Introduction to Contemporary Operating Systems and Hardware 1b — Illinois Tech",
      "CCST Networking Video Training Series — Packt",
    ],
  },
];

// ── The home lab, rendered as a live topology ──────────────────────────
export type TopoNode = {
  id: string;
  label: string;
  kind: "cloud" | "firewall" | "switch" | "host" | "vm" | "endpoint";
  detail: string;
  x: number;
  y: number;
};

export type TopoLink = {
  from: string;
  to: string;
};

export const topoNodes: TopoNode[] = [
  { id: "wan", label: "ISP / WAN", kind: "cloud", detail: "External internet connectivity", x: 60, y: 150 },
  { id: "fw", label: "Edge Router", kind: "firewall", detail: "MikroTik hAP ax2 — NAT, firewall rules, trunk to the core switch", x: 235, y: 150 },
  { id: "sw", label: "Core Switch", kind: "switch", detail: "VLANs, trunking, inter-VLAN routing", x: 410, y: 150 },
  { id: "pve", label: "Proxmox VE", kind: "host", detail: "Type-1 hypervisor hosting virtual infrastructure", x: 610, y: 150 },
  { id: "eve", label: "EVE-NG", kind: "vm", detail: "Multi-vendor topologies, daily practice", x: 800, y: 48 },
  { id: "cml", label: "Cisco CML", kind: "vm", detail: "CCNA prep, automated provisioning", x: 820, y: 150 },
  { id: "git", label: "GitLab", kind: "vm", detail: "Local CI/CD, lab configs as code", x: 800, y: 252 },
  { id: "mon", label: "Zabbix + Grafana", kind: "endpoint", detail: "Infrastructure monitoring and alerting", x: 610, y: 268 },
];

export const topoLinks: TopoLink[] = [
  { from: "wan", to: "fw" },
  { from: "fw", to: "sw" },
  { from: "sw", to: "pve" },
  { from: "pve", to: "eve" },
  { from: "pve", to: "cml" },
  { from: "pve", to: "git" },
  { from: "pve", to: "mon" },
];

// ── Lab log — real entries, each with its cover ─────────────────────────
export type LogEntry = {
  date: string;
  title: string;
  blurb: string;
  href: string;
  image: string;
};

export const labLog: LogEntry[] = [
  {
    date: "jan 2026",
    title: "Inter-VLAN routing",
    blurb: "Traditional router-on-a-stick, both verified end to end with passing pings.",
    href: "/docs/labs/vlan-labs/intervlan-routing",
    image: "/img/lab-log/intervlan-routing.svg",
  },
  {
    date: "nov 2025",
    title: "Access port VLANs",
    blurb: "VLANs configured on a Cisco 2960, access ports assigned, segmentation verified.",
    href: "/docs/labs/vlan-labs/access-vlan",
    image: "/img/lab-log/access-vlan.png",
  },
  {
    date: "jan 2026",
    title: "CDP & LLDP across vendors",
    blurb: "Discovery protocols traced across Cisco and non-Cisco gear in EVE-NG.",
    href: "/docs/labs/multi-vendor",
    image: "/img/lab-log/multi-vendor.jpg",
  },
  {
    date: "feb 2026",
    title: "PowerShell remoting at scale",
    blurb: "Software deployed to domain-joined hosts; AD user lifecycle scripted end to end.",
    href: "/docs/labs/windows-powershell/centralized-deployment",
    image: "/img/lab-log/remoting.jpg",
  },
  {
    date: "dec 2025",
    title: "Router-on-a-stick",
    blurb: "802.1Q subinterfaces routing between VLANs over a single trunk.",
    href: "/docs/labs/office-setup",
    image: "/img/lab-log/office-setup-topology.svg",
  },
];

// ── Tech stack — what the lab actually runs on ─────────────────────────
export type StackItem = {
  name: string;
  role: string;
  href: string;
};

export const techStack: StackItem[] = [
  { name: "Cisco IOS", role: "routing & switching", href: "https://www.cisco.com/site/us/en/products/networking/switches-routers/networking-software/ios/index.html" },
  { name: "EVE-NG", role: "multi-vendor emulation", href: "https://www.eve-ng.net/" },
  { name: "Cisco CML", role: "topology validation", href: "https://www.cisco.com/site/us/en/products/networking/cisco-modeling-labs/index.html" },
  { name: "Packet Tracer", role: "where it started", href: "https://www.netacad.com/cisco-packet-tracer" },
  { name: "Proxmox VE", role: "type-1 hypervisor", href: "https://www.proxmox.com/en/proxmox-virtual-environment/overview" },
  { name: "Wireshark", role: "packet analysis", href: "https://www.wireshark.org/" },
  { name: "MikroTik RouterOS", role: "edge routing & firewall", href: "https://mikrotik.com/software" },
  { name: "Linux", role: "ubuntu · fedora", href: "https://www.linux.org/" },
  { name: "Windows Server", role: "ad ds · gpo · dhcp", href: "https://www.microsoft.com/en-us/windows-server" },
  { name: "Python", role: "scripting", href: "https://www.python.org/" },
  { name: "PowerShell", role: "ad · remoting", href: "https://learn.microsoft.com/en-us/powershell/" },
  { name: "Zabbix", role: "monitoring", href: "https://www.zabbix.com/" },
  { name: "Grafana", role: "dashboards", href: "https://grafana.com/" },
  { name: "Docker", role: "containers", href: "https://www.docker.com/" },
  { name: "Git / GitLab", role: "configs as code", href: "https://about.gitlab.com/" },
];

// ── Open source ─────────────────────────────────────────────────────────
export type Project = {
  name: string;
  kind: string;
  stack: string;
  description: string;
  source?: string;
  docs?: string;
};

export const projects: Project[] = [
  {
    name: "Marrow",
    kind: "tool",
    stack: "typescript · elkjs · vite",
    description:
      "A declarative network topology compiler. Compiles YAML network descriptions into self-contained, interactive HTML diagrams and SVG components.",
    source: "https://github.com/raiz-toff/Marrow",
    docs: "/docs/projects/marrow",
  },
  {
    name: "MileWage",
    kind: "app",
    stack: "kotlin · typescript · docker · tailscale",
    description:
      "Self-hosted mileage tracking for gig riders and drivers. A native Android app records the shift; a server you own keeps the miles and the money. Successor to Comma.",
    source: "https://github.com/raiz-toff/Milewage",
    docs: "/docs/projects/milewage",
  },
  {
    name: "tunit",
    kind: "tool",
    stack: "go · single binary",
    description:
      "A system diagnostic, stress and load testing tool for Windows, Linux and macOS. Hardware QC, CPU thermal tests, network checks and HTTP load tests, with no dependencies.",
    source: "https://github.com/raiz-toff/tunit",
    docs: "/docs/projects/tunit",
  },
];
