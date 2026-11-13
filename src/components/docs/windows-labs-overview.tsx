import Image from 'next/image';
import { NameplateCover } from '@/components/covers';
import { OverviewGrid, OverviewHeading, OverviewHero, OverviewPicture, OverviewStory, type OverviewItem } from './overview-parts';
import { StarlightLinkButton as LinkButton } from './starlight-compat';

// Overview of /docs/labs/windows-powershell.

const BASE = '/docs/labs/windows-powershell';

const STORY = [
  { text: 'AD DS goes on a Windows Server, the server becomes a domain controller, and users go into a custom OU.', href: `${BASE}/active-directory`, page: 'Active Directory' },
  { text: 'A DHCP scope with exclusion ranges hands out addresses, checked on a Windows 10 client.', href: `${BASE}/dhcp-server`, page: 'DHCP server' },
  { text: 'A Group Policy Object removes the power options for users in one OU.', href: `${BASE}/group-policy`, page: 'Group Policy' },
  { text: 'Software installs are pushed from the domain controller to member workstations with PowerShell remoting.', href: `${BASE}/centralized-deployment`, page: 'Deployment' },
  { text: 'The admin tasks move into PowerShell: menu-driven AD scripts, then a Windows Forms dashboard.', href: `${BASE}/powershell-gui`, page: 'PowerShell GUI' },
];

const SERVER: OverviewItem[] = [
  {
    label: 'Windows Server',
    href: `${BASE}/active-directory`,
    headline: 'Active Directory',
    detail: 'Install AD DS, promote a domain controller and add users in a custom OU.',
    visual: <OverviewPicture src="/img/lab-log/active-directory.jpg" alt="Active Directory lab" />,
  },
  {
    label: 'Windows Server',
    href: `${BASE}/dhcp-server`,
    headline: 'DHCP Server',
    detail: 'Create a scope with exclusion ranges and verify leases on a client.',
    visual: <NameplateCover name="dhcp" label="Windows Server role" />,
  },
  {
    label: 'Windows Server',
    href: `${BASE}/group-policy`,
    headline: 'Group Policy',
    detail: 'Create a GPO, link it to an OU and verify it on a workstation.',
    visual: <NameplateCover name="gpo" label="Group Policy lab" />,
  },
  {
    label: 'Automation',
    href: `${BASE}/centralized-deployment`,
    headline: 'Centralized Deployment',
    detail: 'Push software from the domain controller with remoting and silent installers.',
    visual: <OverviewPicture src="/img/lab-log/remoting.jpg" alt="PowerShell remoting lab" />,
  },
];

const SCRIPTS: OverviewItem[] = [
  {
    label: 'PowerShell',
    href: `${BASE}/powershell-gui`,
    headline: 'PowerShell GUI Dashboard',
    detail: 'A Windows Forms dashboard for AD tasks, backups, health checks and scheduled tasks.',
    visual: <OverviewPicture src="/img/lab-log/powershell-dashboard.png" alt="IT Management Dashboard menu built with Windows Forms" />,
  },
  {
    label: 'PowerShell',
    href: `${BASE}/powershell-basic`,
    headline: 'AD Admin Script (Basic)',
    detail: 'A switch-case menu that creates users and groups and installs server roles.',
    visual: <NameplateCover name="scripts" label="basic AD admin" />,
  },
  {
    label: 'PowerShell',
    href: `${BASE}/powershell-advanced`,
    headline: 'AD Admin Script (Advanced)',
    detail: 'Adds group changes, password resets and account locking.',
    visual: <NameplateCover name="scripts" label="advanced AD admin" />,
  },
  {
    label: 'PowerShell',
    href: `${BASE}/ip-checking`,
    headline: 'IPv4 Validator',
    detail: 'Checks that a string has four numeric octets, each between 0 and 255.',
    visual: <NameplateCover name="ipv4" label="input validator" />,
  },
];

/** Overview page body for the Windows Server & PowerShell lab series. Registered as an MDX component. */
export function WindowsLabsOverview() {
  return (
    <>
      <OverviewHero
        visual={
          <Image
            src="/img/lab-log/powershell-health-checks.png"
            alt="System Health Checks window from the PowerShell GUI lab, showing CPU, memory, disk and event log output"
            width={635}
            height={540}
            sizes="(min-width: 640px) 640px, 100vw"
            className="w-full bg-white"
            priority
          />
        }
        actions={
          <>
            <LinkButton href={`${BASE}/active-directory`} icon="right-arrow">
              Start with Active Directory
            </LinkButton>
            <LinkButton href="https://github.com/raiz-toff/POWERSHELL_SCRIPTING" variant="secondary" icon="github">
              Scripts on GitHub
            </LinkButton>
          </>
        }
        note={
          <>
            <strong className="text-fd-foreground">Note:</strong> These labs were converted from Word and PDF to Markdown with Pandoc and Python. Some formatting artifacts may remain.
          </>
        }
      />
      <OverviewStory steps={STORY} />
      <div className="not-prose">
        <OverviewHeading>Windows Server</OverviewHeading>
        <OverviewGrid items={SERVER} />
        <OverviewHeading>PowerShell scripts</OverviewHeading>
        <OverviewGrid items={SCRIPTS} />
      </div>
    </>
  );
}
