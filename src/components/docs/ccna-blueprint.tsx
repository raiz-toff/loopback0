'use client';

import { useState } from 'react';

const DOMAINS = [
  {
    title: '1.0 Network Fundamentals',
    weight: '20%',
    focus: 'IPv4 subnetting, IPv6 addressing, interface errors, speed and duplex negotiation',
    topics: [
      '1.1 Explain the role and function of network components (routers, L2/L3 switches, firewalls, APs, controllers, endpoints, servers, PoE).',
      '1.2 Describe characteristics of network topology architectures (two-tier, three-tier, spine-leaf, WAN, SOHO, on-premises, and cloud).',
      '1.3 Compare physical interface and cabling types (single-mode, multimode, copper, point-to-point, shared media).',
      '1.4 Identify interface and cable issues (collisions, errors, mismatch duplex, and/or speed).',
      '1.5 Compare TCP to UDP.',
      '1.6 Configure and verify IPv4 addressing and subnetting.',
      '1.7 Describe private IPv4 addressing.',
      '1.8 Configure and verify IPv6 addressing and prefix.',
      '1.9 Describe IPv6 address types (global unicast, unique local, link-local, anycast, multicast, modified EUI-64).',
      '1.10 Verify IP parameters for Client OS (Windows, Mac OS, Linux).',
      '1.11 Describe wireless principles (nonoverlapping channels, SSID, RF, encryption).',
      '1.12 Explain virtualization fundamentals (server virtualization, containers, and VRFs).',
      '1.13 Describe switching concepts (MAC learning and aging, frame switching, frame flooding, MAC address table).',
    ],
  },
  {
    title: '2.0 Network Access',
    weight: '20%',
    focus: 'VLANs, 802.1Q trunks, Rapid PVST+, EtherChannel (LACP), CDP and LLDP',
    topics: [
      '2.1 Configure and verify VLANs (normal range) spanning multiple switches (access ports, default VLAN, inter-VLAN connectivity).',
      '2.2 Configure and verify interswitch connectivity (trunk ports, 802.1Q, native VLAN).',
      '2.3 Configure and verify Layer 2 discovery protocols (CDP and LLDP).',
      '2.4 Configure and verify (Layer 2/Layer 3) EtherChannel (LACP).',
      '2.5 Interpret basic operations of Rapid PVST+ Spanning Tree Protocol (root port, root bridge, port states and roles, PortFast, BPDU guard, root guard, loop guard, BPDU filter).',
      '2.6 Describe Cisco Wireless Architectures and AP modes.',
      '2.7 Describe physical infrastructure connections of WLAN components (AP, WLC, access/trunk ports, LAG).',
      '2.8 Describe network device management access (Telnet, SSH, HTTP, HTTPS, console, TACACS+/RADIUS, cloud managed).',
      '2.9 Interpret the wireless LAN GUI configuration for client connectivity (WLAN creation, security settings, QoS profiles).',
    ],
  },
  {
    title: '3.0 IP Connectivity',
    weight: '25%',
    focus: 'Routing table logic, IPv4/IPv6 static routing, single-area OSPFv2 adjacencies',
    topics: [
      '3.1 Interpret the components of routing table (protocol codes, prefix, mask, next hop, administrative distance, metric, gateway of last resort).',
      '3.2 Determine how a router makes a forwarding decision by default (longest prefix match, administrative distance, metric).',
      '3.3 Configure and verify IPv4 and IPv6 static routing (default route, network route, host route, floating static).',
      '3.4 Configure and verify single area OSPFv2 (neighbor adjacencies, point-to-point, broadcast DR/BDR selection, router ID).',
      '3.5 Describe the purpose, functions, and concepts of first hop redundancy protocols.',
    ],
  },
  {
    title: '4.0 IP Services',
    weight: '10%',
    focus: 'Inside source NAT (static/pools), NTP client/server, DHCP client and relay, SSH',
    topics: [
      '4.1 Configure and verify inside source NAT using static and pools.',
      '4.2 Configure and verify NTP operating in a client and server mode.',
      '4.3 Explain the role of DHCP and DNS within the network.',
      '4.4 Explain the function of SNMP in network operations.',
      '4.5 Describe the use of syslog features, including facilities and severity levels.',
      '4.6 Configure and verify DHCP client and relay.',
      '4.7 Explain forwarding per-hop behavior (PHB) for QoS (classification, marking, queuing, congestion, policing, shaping).',
      '4.8 Configure network devices for remote access using SSH.',
      '4.9 Describe capabilities and functions of TFTP/FTP in the network.',
    ],
  },
  {
    title: '5.0 Security Fundamentals',
    weight: '15%',
    focus: 'Standard and extended ACLs, Port Security, DHCP snooping, Dynamic ARP Inspection',
    topics: [
      '5.1 Define key security concepts (threats, vulnerabilities, exploits, mitigation techniques).',
      '5.2 Describe security program elements (user awareness, training, physical access control).',
      '5.3 Configure and verify device access control using local passwords.',
      '5.4 Describe security password policy elements (management, complexity, MFA, certificates, biometrics).',
      '5.5 Describe IPsec remote access and site-to-site VPNs.',
      '5.6 Configure and verify access control lists (ACLs).',
      '5.7 Configure and verify Layer 2 security features (DHCP snooping, Dynamic ARP Inspection, port security).',
      '5.8 Compare authentication, authorization, and accounting concepts.',
      '5.9 Describe wireless security protocols (WPA, WPA2, WPA3).',
      '5.10 Configure and verify WLAN within the GUI using WPA2 PSK.',
    ],
  },
  {
    title: '6.0 Automation and Programmability',
    weight: '10%',
    focus: 'REST API formats, JSON parsing, controller architectures, configuration management',
    topics: [
      '6.1 Explain how automation impacts network management.',
      '6.2 Compare traditional networks with controller-based networking.',
      '6.3 Describe controller-based, software-defined architecture (overlay, underlay, fabric, separation of control/data planes, northbound and southbound APIs).',
      '6.4 Explain AI (generative and predictive) and machine learning in network operations.',
      '6.5 Describe characteristics of REST-based APIs (authentication types, CRUD, HTTP verbs, data encoding).',
      '6.6 Recognize capabilities of configuration management mechanisms such as Ansible and Terraform.',
      '6.7 Recognize components of JSON-encoded data.',
    ],
  },
];

export function CcnaBlueprint() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="not-content my-6 rounded-lg border border-line bg-card/40 transition-colors">
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        className="flex flex-col sm:flex-row cursor-pointer sm:items-center justify-between gap-3 p-4 hover:bg-accent/30 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <span className="font-semibold text-foreground text-sm sm:text-base">
            Cisco CCNA Exam Topics & Blueprint (v1.1)
          </span>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-mono text-primary">
            200-301
          </span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className="inline-flex items-center justify-center gap-1.5 rounded-md border border-line bg-background/80 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent self-start sm:self-auto"
        >
          {isOpen ? 'Collapse Blueprint' : 'See Blueprint Breakdown'}
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-line p-4 space-y-6 animate-in fade-in-50 duration-200">
          <p className="text-xs text-muted-foreground">
            Official 120-minute exam curriculum. Review full topics on{' '}
            <a
              href="https://learningnetwork.cisco.com/s/ccna-exam-topics"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline hover:text-primary/80"
            >
              Cisco Learning Network
            </a>
            .
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-line text-muted-foreground">
                  <th className="pb-2 font-medium">Domain</th>
                  <th className="pb-2 font-medium">Weight</th>
                  <th className="pb-2 font-medium">Hands-on Focus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60">
                {DOMAINS.map((domain) => (
                  <tr key={domain.title} className="hover:bg-accent/20">
                    <td className="py-2.5 font-medium text-foreground pr-4">
                      {domain.title}
                    </td>
                    <td className="py-2.5 font-mono text-primary font-semibold pr-4">
                      {domain.weight}
                    </td>
                    <td className="py-2.5 text-muted-foreground">
                      {domain.focus}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-4 pt-2">
            {DOMAINS.map((domain) => (
              <div
                key={domain.title}
                className="rounded-md border border-line/60 bg-background/40 p-3"
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-line/40">
                  <span className="font-semibold text-xs text-foreground">
                    {domain.title}
                  </span>
                  <span className="text-xs font-mono text-primary">
                    {domain.weight}
                  </span>
                </div>
                <ul className="space-y-1.5 text-xs text-muted-foreground">
                  {domain.topics.map((topic, i) => (
                    <li key={i} className="leading-relaxed">
                      • {topic}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function ModuleBlueprint({ module }: { module: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const domain = DOMAINS.find((d) => d.title.startsWith(module) || d.title.includes(module));
  if (!domain) return null;

  return (
    <div className="not-content my-5 rounded-lg border border-line bg-card/40 transition-colors">
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        className="flex flex-col sm:flex-row cursor-pointer sm:items-center justify-between gap-2.5 p-3.5 hover:bg-accent/30 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <span className="font-semibold text-foreground text-sm">
            {domain.title}
          </span>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-mono font-semibold text-primary">
            {domain.weight}
          </span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className="inline-flex items-center justify-center gap-1 rounded-md border border-line bg-background/80 px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-accent self-start sm:self-auto"
        >
          {isOpen ? 'Hide Exam Topics' : 'See Exam Topics'}
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-line p-3.5 space-y-3 animate-in fade-in-50 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs text-muted-foreground pb-2 border-b border-line/40">
            <span>Hands-on Focus: {domain.focus}</span>
            <span className="font-mono text-primary font-medium">{domain.weight} of exam</span>
          </div>
          <ul className="space-y-1.5 text-xs text-foreground/90">
            {domain.topics.map((topic, i) => (
              <li key={i} className="leading-relaxed flex items-start gap-2">
                <span className="text-primary font-bold select-none">•</span>
                <span>{topic}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

