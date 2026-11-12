import { NameplateCover } from '@/components/covers';
import { OverviewGrid, OverviewHeading, OverviewPicture, type OverviewItem } from './overview-parts';

// Overview of /docs/labs: every lab or lab group as a picture card, in the two
// groups the section is organised by.

const NETWORKING: OverviewItem[] = [
  {
    label: 'Multi-Vendor',
    href: '/docs/labs/multi-vendor',
    headline: 'Multi-Vendor Interoperability',
    detail: 'Get Cisco and Arista talking to each other over OSPF and BGP.',
    visual: <OverviewPicture src="/img/lab-log/multi-vendor.jpg" alt="Multi-vendor lab" />,
  },
  {
    label: 'SOHO Setup',
    href: '/docs/labs/office-setup',
    headline: 'Office Network Setup',
    detail: 'A small office build with VLAN segmentation and ROAS inter-VLAN routing.',
    visual: <OverviewPicture src="/img/lab-log/office-setup-topology.svg" alt="Office network topology" />,
  },
  {
    label: 'L2 Switching',
    headline: 'VLAN & Trunking',
    detail: 'Layer 2 segmentation: private VLANs, access ports, and trunking.',
    visual: <OverviewPicture src="/img/lab-log/access-vlan.png" alt="Access port VLAN lab" />,
    links: [
      { label: 'Overview', href: '/docs/labs/vlan-labs' },
      { label: 'Access Port', href: '/docs/labs/vlan-labs/access-vlan' },
      { label: 'Trunk Port', href: '/docs/labs/vlan-labs/vlan-trunk' },
    ],
  },
  {
    label: 'Routing',
    href: '/docs/labs/vlan-labs/intervlan-routing',
    headline: 'Inter-VLAN Routing',
    detail: 'Router-on-a-Stick (ROAS) and Layer 3 switching to route between VLANs.',
    visual: <OverviewPicture src="/img/lab-log/intervlan-routing.svg" alt="Inter-VLAN routing topology" />,
  },
];

const WINDOWS: OverviewItem[] = [
  {
    label: 'Windows Server',
    headline: 'Active Directory & Services',
    detail: 'Deploy AD DS, configure central DHCP servers, and implement Group Policy Objects (GPOs).',
    visual: <OverviewPicture src="/img/lab-log/active-directory.jpg" alt="Active Directory lab" />,
    links: [
      { label: 'AD Setup', href: '/docs/labs/windows-powershell/active-directory' },
      { label: 'DHCP Server', href: '/docs/labs/windows-powershell/dhcp-server' },
      { label: 'Group Policy', href: '/docs/labs/windows-powershell/group-policy' },
    ],
  },
  {
    label: 'Automation',
    headline: 'PowerShell Administration',
    detail: 'Automate AD account management, remote software installs, and build full Windows Forms admin GUIs.',
    visual: <OverviewPicture src="/img/lab-log/remoting.jpg" alt="PowerShell remoting lab" />,
    links: [
      { label: 'Deployment', href: '/docs/labs/windows-powershell/centralized-deployment' },
      { label: 'GUI Dashboard', href: '/docs/labs/windows-powershell/powershell-gui' },
      { label: 'AD Scripts', href: '/docs/labs/windows-powershell/powershell-advanced' },
    ],
  },
  {
    label: 'Scripting Utilities',
    headline: 'Administrative Tools',
    detail: 'Targeted utility scripts for directory administration and automated input validation.',
    visual: <NameplateCover name="scripts" label="PowerShell utilities" />,
    links: [
      { label: 'Basic AD Script', href: '/docs/labs/windows-powershell/powershell-basic' },
      { label: 'IP Validator', href: '/docs/labs/windows-powershell/ip-checking' },
    ],
  },
];

/** Overview page body for the Labs section. Registered as an MDX component. */
export function LabsOverview() {
  return (
    <div className="not-prose">
      <OverviewHeading>Networking & Switching</OverviewHeading>
      <OverviewGrid items={NETWORKING} />
      <OverviewHeading>Windows Server & PowerShell</OverviewHeading>
      <OverviewGrid items={WINDOWS} />
    </div>
  );
}
