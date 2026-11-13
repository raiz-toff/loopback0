import { NameplateCover } from '@/components/covers';
import { OverviewGrid, OverviewHeading, OverviewHero, OverviewPicture, OverviewPoints, OverviewStory, type OverviewItem } from './overview-parts';
import { StarlightLinkButton as LinkButton } from './starlight-compat';
import { Topology } from './topology';

// Overview of /docs/labs/vlan-labs.

const STORY = [
  { text: 'One switch is split into two VLANs. Hosts reach their own VLAN and nothing else.', href: '/docs/labs/vlan-labs/access-vlan', page: 'Access ports' },
  { text: 'An 802.1Q trunk carries both VLANs between two switches over one cable.', href: '/docs/labs/vlan-labs/vlan-trunk', page: 'Trunking' },
  {
    text: 'The VLANs finally talk: first through one router port per VLAN, then through Router-on-a-Stick sub-interfaces.',
    href: '/docs/labs/vlan-labs/intervlan-routing',
    page: 'Inter-VLAN routing',
  },
];

const LABS: OverviewItem[] = [
  {
    label: 'Lab 1',
    href: '/docs/labs/vlan-labs/access-vlan',
    headline: 'Access Ports',
    detail: 'Configure VLANs on a Cisco 2960 switch and assign access ports to them.',
    visual: <OverviewPicture src="/img/lab-log/access-vlan.png" alt="Access port VLAN topology" />,
  },
  {
    label: 'Lab 2',
    href: '/docs/labs/vlan-labs/vlan-trunk',
    headline: 'VLAN Trunking (802.1Q)',
    detail: 'Carry several VLANs between two switches over one trunk link.',
    visual: <NameplateCover name="trunk" label="VLAN trunking lab" />,
  },
  {
    label: 'Lab 3',
    href: '/docs/labs/vlan-labs/intervlan-routing',
    headline: 'Inter-VLAN Routing',
    detail: 'Route between VLANs with physical router ports, then with Router-on-a-Stick.',
    visual: <OverviewPicture src="/img/lab-log/intervlan-routing.svg" alt="Inter-VLAN routing topology" />,
  },
];

const CONCEPTS = [
  { title: '802.1Q encapsulation', text: 'Frames are tagged so a trunk link can carry several VLANs.' },
  { title: 'VTP', text: 'One switch shares its VLAN database with the others.' },
  { title: 'Router-on-a-Stick', text: 'Sub-interfaces on one router port route between VLANs.' },
  { title: 'Access and trunk ports', text: 'Which ports belong to one VLAN, and which carry tagged frames.' },
];

/** Overview page body for the VLAN & Trunking lab series. Registered as an MDX component. */
export function VlanLabsOverview() {
  return (
    <>
      <Topology src="/projects/network-map/inter_vlan_lab.html" title="Inter-VLAN routing lab: the final topology of the series" height={420} madeWithMarrow={false} />
      <OverviewHero
        actions={
          <LinkButton href="/docs/labs/vlan-labs/access-vlan" icon="right-arrow">
            Start with Lab 1
          </LinkButton>
        }
      />
      <OverviewStory steps={STORY} />
      <div className="not-prose">
        <OverviewHeading>The labs</OverviewHeading>
        <OverviewGrid items={LABS} />
        <OverviewHeading>Concepts covered</OverviewHeading>
        <OverviewPoints items={CONCEPTS} />
      </div>
    </>
  );
}
