import { Metadata } from "next";
import Link from "next/link";
import { DownloadIcon, ArrowLeftIcon, CheckCircle2 } from "lucide-react";
import { ResumeDownloadButton } from "@/components/resume-download-button";
import { HandwrittenArrow, HandwrittenNote } from "@/components/handwritten-note";
import { MapPinIcon, PhoneIcon, MailIcon, GlobeIcon, LinkedInIcon } from "@/components/icons";
import { ProtectedPhone, ProtectedEmail } from "@/components/protected-contact";
import { PublishBottomNav } from "@/components/bottom-nav/context";

export const metadata: Metadata = {
  title: "Resume | Rajkumar Neupane",
  description: "Professional resume and experience of Rajkumar Neupane.",
};

export default function ResumePage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 py-12 px-4 sm:px-6 lg:px-8 print:py-0 print:px-0">
      <div className="mx-auto max-w-4xl">
        <PublishBottomNav
          primary={{ kind: "resume-pdf", label: "Download PDF" }}
          back={{ label: "Front page", href: "/" }}
        />
        {/* Navigation / Action Bar */}
        <div className="mb-8 flex items-center justify-between print:hidden">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeftIcon className="size-4" />
            Back to Home
          </Link>
          <div className="relative">
            <ResumeDownloadButton className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm font-bold text-background transition-colors hover:bg-foreground/90 shadow-sm disabled:opacity-70">
              <DownloadIcon className="size-4" />
              Download PDF
            </ResumeDownloadButton>
            {/* The PDF is fetched from private storage, so the first click can lag. */}
            <HandwrittenNote className="top-3 left-full ml-3 hidden w-44 flex-col items-start xl:flex" aria-hidden>
              <HandwrittenArrow className="size-7 -scale-y-100 -rotate-12 -translate-x-1.5" />
              <span className="ml-2 -rotate-6 whitespace-nowrap">
                might take a sec,
                <br />
                hosted privately 🔒
              </span>
            </HandwrittenNote>
          </div>
        </div>

        {/* Resume Paper */}
        <div id="resume-paper" className="bg-background sm:rounded-2xl sm:border border-line sm:p-14 sm:shadow-sm print:p-0 print:border-0 print:shadow-none print:rounded-none">
          
          {/* Header */}
          <header className="mb-10 border-b border-line pb-8 print:mb-5 print:pb-4">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              Rajkumar Neupane
            </h1>
            <p className="mt-3 text-xl font-medium text-foreground/80">
              Network Support Technician <span className="mx-2 text-muted-foreground">|</span> CCNA Certified
            </p>
            
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-muted-foreground font-medium">
              <div className="flex items-center gap-1.5">
                <MapPinIcon className="size-4" />
                <span>Toronto, ON (Open to Relocate)</span>
              </div>
              <div className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                <PhoneIcon className="size-4 shrink-0" />
                <ProtectedPhone phoneB64="KzE0Mzc2NjUzMzkw" />
              </div>
              <div className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                <MailIcon className="size-4 shrink-0" />
                <ProtectedEmail emailB64="bi5yYWprdW1hci53b3Jrc3BhY2VAZ21haWwuY29t" />
              </div>
              <a href="https://rajkumarneupane.com" className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                <GlobeIcon className="size-4" />
                <span>rajkumarneupane.com</span>
              </a>
              <a href="https://www.linkedin.com/in/rjneupane/" className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                <LinkedInIcon className="size-4" />
                <span>linkedin.com/in/rjneupane</span>
              </a>
            </div>
          </header>

          <main className="space-y-12 print:space-y-4">
            
            {/* Professional Summary */}
            <section>
              <h2 className="mb-4 text-xl font-bold tracking-tight text-foreground border-l-4 border-foreground pl-3 print:mb-2">Professional Summary</h2>
              <p className="text-base leading-relaxed text-foreground/80">
                CCNA and CCST certified technician with a Computer Systems Technician — Networking diploma from Canadore College and a background in component-level hardware repair. Currently performs hardware and network diagnostics on 30+ devices daily at the Best Buy Canada Geek Squad City depot. Runs a multi-vendor home lab (Cisco, MikroTik, Proxmox) with documented VLAN, OSPF, STP, and ACL topologies at rajkumarneupane.com/docs. Seeking NOC, network support, systems, or technical support roles in Canada.
              </p>
            </section>

            {/* Technical Skills */}
            <section>
              <h2 className="mb-5 text-xl font-bold tracking-tight text-foreground border-l-4 border-foreground pl-3 print:mb-2">Technical Skills</h2>
              <div className="grid gap-4 text-sm leading-relaxed text-foreground/80">
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                  <span className="font-bold text-foreground w-48 shrink-0">Networking Protocols</span>
                  <span className="text-muted-foreground">TCP/IP, DNS, DHCP, VLANs, STP, LACP, OSPF, EIGRP, RIP, static routing, IPv4/IPv6, Ethernet</span>
                </div>
                <div className="w-full h-px bg-line/50"></div>
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                  <span className="font-bold text-foreground w-48 shrink-0">Hardware & Infra</span>
                  <span className="text-muted-foreground">Cisco Catalyst switches, ISR routers, MikroTik hAP ax2, HP/Juniper switches, structured cabling, patch panels, crimpers, rack-and-stack, board-level diagnostics, component triage, ESD safety protocols</span>
                </div>
                <div className="w-full h-px bg-line/50"></div>
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                  <span className="font-bold text-foreground w-48 shrink-0">OS & Virtualization</span>
                  <span className="text-muted-foreground">Cisco IOS, Proxmox, VMware, VirtualBox, Linux (Ubuntu, Kali), Windows Server, Windows 10/11, macOS, ChromeOS, Wireshark, CML, EVE-NG, Packet Tracer, PC-Doctor, MemTest86, CrystalDiskInfo, NIST 800-88</span>
                </div>
                <div className="w-full h-px bg-line/50"></div>
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                  <span className="font-bold text-foreground w-48 shrink-0">Scripting & Dev</span>
                  <span className="text-muted-foreground">Python (network automation), Bash, JavaScript, TypeScript, React Native, SQLite, Git, GitHub, REST APIs</span>
                </div>
              </div>
            </section>

            {/* Professional Experience */}
            <section>
              <h2 className="mb-6 text-xl font-bold tracking-tight text-foreground border-l-4 border-foreground pl-3 print:mb-2">Professional Experience</h2>
              <div className="space-y-8 border-l border-line ml-1.5 pl-6">
                
                {/* Best Buy */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-1.5 size-3 rounded-full bg-foreground ring-4 ring-background"></div>
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-foreground">Product Tester (Hardware Diagnostics & QA)</h3>
                      <div className="text-base font-medium text-foreground/70">Best Buy Canada (Geek Squad City) · Brampton, ON</div>
                    </div>
                    <span className="mt-1 sm:mt-0 text-sm font-bold text-muted-foreground bg-secondary px-2.5 py-1 rounded-md">Aug 2026 – Present</span>
                  </div>
                  <ul className="list-inside list-disc space-y-2 text-sm leading-relaxed text-foreground/80 marker:text-muted-foreground mt-3">
                    <li>Perform comprehensive hardware and network diagnostic evaluations on 30+ client and enterprise devices daily at central technology repair depot.</li>
                    <li>Execute component-level triage isolating motherboard, CPU, RAM, and GPU defects using PC-Doctor, MemTest86, and OEM diagnostic suites.</li>
                    <li>Validate physical Ethernet and wireless interfaces, verifying link-speed negotiation, packet integrity, and DHCP lease assignments.</li>
                    <li>Enforce NIST 800-88 data sanitization standards across SATA and NVMe SSDs; re-flash corrupted UEFI/BIOS firmware and deploy clean OS images.</li>
                    <li>Record root-cause failure codes in the enterprise Service Order ticketing system and release devices only after they pass post-refurbishment QA under ESD standards.</li>
                  </ul>
                </div>

                {/* DoorDash */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-1.5 size-3 rounded-full bg-foreground ring-4 ring-background"></div>
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-foreground">Delivery Driver (Independent Contractor)</h3>
                      <div className="text-base font-medium text-foreground/70">DoorDash · Greater Toronto Area</div>
                    </div>
                    <span className="mt-1 sm:mt-0 text-sm font-bold text-muted-foreground bg-secondary px-2.5 py-1 rounded-md">2025 – 2026</span>
                  </div>
                  <ul className="list-inside list-disc space-y-2 text-sm leading-relaxed text-foreground/80 marker:text-muted-foreground mt-3">
                    <li>Completed 8,000+ deliveries across the GTA while job-searching after graduation; tracked every shift, kilometre, and expense.</li>
                    <li>Built Comma, an offline-first React Native and PWA earnings tracker with background GPS and HST set-aside calculations, to replace spreadsheet tracking.</li>
                  </ul>
                </div>

                {/* Canadore College */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-1.5 size-3 rounded-full bg-muted-foreground ring-4 ring-background"></div>
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-foreground">Peer Technical Mentor (Volunteer)</h3>
                      <div className="text-base font-medium text-foreground/70">Canadore College · Toronto, ON</div>
                    </div>
                    <span className="mt-1 sm:mt-0 text-sm font-bold text-muted-foreground bg-secondary px-2.5 py-1 rounded-md">Oct 2023 – Apr 2025</span>
                  </div>
                  <ul className="list-inside list-disc space-y-2 text-sm leading-relaxed text-foreground/80 marker:text-muted-foreground mt-3">
                    <li>Acted as the go-to technical support resource for classmates across the Computer Systems Technician program.</li>
                    <li>Configured and troubleshot Cisco routers and switches in physical lab environments, guiding peers through VLAN segmentation, OSPF routing, STP convergence, and ACLs.</li>
                    <li>Supported students with VMware and VirtualBox environments, Linux server administration, and Windows Server configurations.</li>
                  </ul>
                </div>

                {/* Nepamed Healthcare */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-1.5 size-3 rounded-full bg-muted-foreground ring-4 ring-background"></div>
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-foreground">Operations Coordinator</h3>
                      <div className="text-base font-medium text-foreground/70">Nepamed Healthcare · Kathmandu, Nepal</div>
                    </div>
                    <span className="mt-1 sm:mt-0 text-sm font-bold text-muted-foreground bg-secondary px-2.5 py-1 rounded-md">Sep 2022 – Aug 2023</span>
                  </div>
                  <ul className="list-inside list-disc space-y-2 text-sm leading-relaxed text-foreground/80 marker:text-muted-foreground mt-3">
                    <li>Managed logistics, inventory systems, and distribution workflows for medical products across regional vendors.</li>
                    <li>Maintained daily financial and operational records tracking inventory turnover, order fulfillment, and logistics overhead.</li>
                    <li>Coordinated distribution schedules between suppliers, the warehouse, and regional customers.</li>
                  </ul>
                </div>

                {/* Kantipur */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-1.5 size-3 rounded-full bg-muted-foreground ring-4 ring-background"></div>
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-foreground">Computer Hardware Technician</h3>
                      <div className="text-base font-medium text-foreground/70">Kantipur Technical Institute · Kathmandu, Nepal</div>
                    </div>
                    <span className="mt-1 sm:mt-0 text-sm font-bold text-muted-foreground bg-secondary px-2.5 py-1 rounded-md">2021 – 2022 (10 months)</span>
                  </div>
                  <ul className="list-inside list-disc space-y-2 text-sm leading-relaxed text-foreground/80 marker:text-muted-foreground mt-3">
                    <li>Completed intensive chip-level hardware repair training covering soldering, schematic analysis, and board diagnostics.</li>
                    <li>Diagnosed and repaired motherboards, power supplies, display panels, and internal storage on laptops and mobile devices.</li>
                  </ul>
                </div>

              </div>
            </section>

            {/* Key Projects */}
            <section>
              <h2 className="mb-6 text-xl font-bold tracking-tight text-foreground border-l-4 border-foreground pl-3 print:mb-2">Key Projects</h2>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="rounded-xl border border-line bg-secondary/20 p-5">
                  <h3 className="font-bold text-foreground text-base mb-1">Multi-Vendor Enterprise Home Lab</h3>
                  <div className="text-sm font-medium text-muted-foreground mb-4">Physical Infrastructure & Virtual Topologies</div>
                  <ul className="space-y-2 text-sm leading-relaxed text-foreground/80">
                    <li className="flex gap-2.5"><CheckCircle2 className="size-4 shrink-0 text-foreground mt-0.5" /> <span>Designed and maintain a physical network featuring a MikroTik hAP ax2 edge router trunked to a Cisco Catalyst managed switch.</span></li>
                    <li className="flex gap-2.5"><CheckCircle2 className="size-4 shrink-0 text-foreground mt-0.5" /> <span>Executed end-to-end structured cabling with hand-terminated Cat6 runs, patch panels, and Klein crimping verified by continuity testing.</span></li>
                    <li className="flex gap-2.5"><CheckCircle2 className="size-4 shrink-0 text-foreground mt-0.5" /> <span>Deployed a Proxmox hypervisor hosting virtualized Linux servers, local DNS/DHCP, and high-scale simulated topologies via Cisco CML and EVE-NG.</span></li>
                  </ul>
                </div>

                <div className="rounded-xl border border-line bg-secondary/20 p-5">
                  <h3 className="font-bold text-foreground text-base mb-1">COMMA — Gig Driver Financial Platform</h3>
                  <div className="text-sm font-medium text-muted-foreground mb-4">React Native · TypeScript · IndexedDB</div>
                  <ul className="space-y-2 text-sm leading-relaxed text-foreground/80">
                    <li className="flex gap-2.5"><CheckCircle2 className="size-4 shrink-0 text-foreground mt-0.5" /> <span>Architected a personal finance application for gig delivery drivers, motivated by 8,000+ completed GTA DoorDash deliveries.</span></li>
                    <li className="flex gap-2.5"><CheckCircle2 className="size-4 shrink-0 text-foreground mt-0.5" /> <span>Built cross-platform mobile application using React Native, Expo, TypeScript, and SQLite featuring background GPS tracking.</span></li>
                    <li className="flex gap-2.5"><CheckCircle2 className="size-4 shrink-0 text-foreground mt-0.5" /> <span>Engineered automated tax calculations for Canadian HST set-aside and true net hourly rate after fuel and vehicle depreciation.</span></li>
                  </ul>
                </div>
              </div>
            </section>

            <div className="grid gap-8 sm:grid-cols-2 pt-4 border-t border-line">
              {/* Certifications */}
              <section>
                <h2 className="mb-4 text-xl font-bold tracking-tight text-foreground border-l-4 border-foreground pl-3 print:mb-2">Certifications</h2>
                <ul className="space-y-3 text-sm leading-relaxed text-foreground/80">
                  <li className="flex items-start gap-2">
                    <div className="mt-1 size-1.5 rounded-full bg-foreground shrink-0" />
                    <div><span className="font-bold text-foreground">Cisco Certified Network Associate (CCNA)</span><br/><span className="text-muted-foreground">Cisco · Nov 2025</span></div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-1 size-1.5 rounded-full bg-muted-foreground shrink-0" />
                    <div><span className="font-bold text-foreground">Cisco Certified Support Technician (CCST) Networking</span><br/><span className="text-muted-foreground">Cisco · Apr 2025 · Lifetime, no expiry</span></div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-1 size-1.5 rounded-full bg-muted-foreground shrink-0" />
                    <div><span className="font-bold text-foreground">Google IT Support Professional Certificate</span><br/><span className="text-muted-foreground">Coursera · Jan 2026</span></div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-1 size-1.5 rounded-full bg-muted-foreground shrink-0" />
                    <div><span className="font-bold text-foreground">Network Support and Security</span><br/><span className="text-muted-foreground">Cisco</span></div>
                  </li>
                </ul>
              </section>

              {/* Education */}
              <section>
                <h2 className="mb-4 text-xl font-bold tracking-tight text-foreground border-l-4 border-foreground pl-3 print:mb-2">Education</h2>
                <div className="text-sm leading-relaxed text-foreground/80">
                  <div className="text-lg font-bold text-foreground">Computer Systems Technician — Networking Diploma</div>
                  <div className="text-muted-foreground mb-3 font-medium">Canadore College, Toronto, ON <br/>Sep 2023 – Apr 2025</div>
                  <p className="mt-2 text-sm text-foreground/80 bg-secondary/30 p-3 rounded-lg border border-line">
                    <span className="font-bold">Key Coursework:</span> Enterprise Routing & Switching, VLAN Architecture, Network Security, Firewall Configuration, Linux/Windows Server Administration.
                  </p>
                </div>
              </section>
            </div>

          </main>
        </div>
      </div>
    </div>
  );
}
