import { CcnaBlueprint } from './ccna-blueprint';
import { CcnaCoverage, CcnaDomains } from './ccna-progress';
import { OverviewHeading, OverviewPoints } from './overview-parts';

// Overview of /docs/ccna-labs: exam coverage, the six domains, the blueprint
// and the platforms the labs run on.

const PLATFORMS = [
  { title: 'Cisco Modeling Labs (CML)', text: 'Direct Cisco reference platform with native IOL and IOSv images.' },
  { title: 'Cisco Packet Tracer', text: 'Lightweight simulator for initial syntax and basic topology validation.' },
  { title: 'GNS3 / EVE-NG', text: 'Multi-vendor emulation environments for connecting Cisco IOS to Linux and server endpoints.' },
  { title: 'In every lab', text: 'A topology diagram, CLI configuration commands, and output verification steps.' },
];

/** Overview page body for the CCNA Labs section. Registered as an MDX component. */
export function CcnaOverview() {
  return (
    <>
      <CcnaCoverage />
      <CcnaDomains />
      <div className="not-prose">
        <OverviewHeading>Exam blueprint (v1.1)</OverviewHeading>
      </div>
      <CcnaBlueprint />
      <div className="not-prose">
        <OverviewHeading>Lab environments</OverviewHeading>
        <OverviewPoints items={PLATFORMS} />
      </div>
    </>
  );
}
