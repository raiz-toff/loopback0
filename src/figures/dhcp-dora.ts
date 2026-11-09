import type { Figure } from '@/components/figures/types';

export const dhcpDora: Figure = {
  id: 'dhcp-dora',
  kicker: 'DHCP',
  title: 'DHCP hands a host its address in four messages.',
  size: [640, 200],
  devices: [
    { id: 'PC1', kind: 'pc', x: 90, y: 80, note: 'no IP' },
    { id: 'SW1', kind: 'switch', x: 320, y: 80 },
    { id: 'R1', kind: 'router', x: 550, y: 80, note: 'DHCP server' },
  ],
  links: [
    { a: 'PC1', b: 'SW1', aPort: 'eth0', bPort: 'g0/1', color: 'blue' },
    { a: 'SW1', b: 'R1', aPort: 'g0/2', bPort: 'g0/0', color: 'orange', striped: true },
  ],
  steps: [
    {
      caption: 'PC1 boots with no address, so it broadcasts a DISCOVER to the whole LAN.',
      packets: [{ path: ['PC1', 'SW1', 'R1'], label: 'DISCOVER', color: 'orange' }],
    },
    {
      caption: 'R1 picks a free address from its pool and sends an OFFER of 10.0.10.21.',
      packets: [{ path: ['R1', 'SW1', 'PC1'], label: 'OFFER', color: 'green' }],
      cli: { device: 'R1', cmd: 'show ip dhcp pool', out: ['Pool LAN10 :', ' Total addresses : 254', ' Leased addresses : 0'] },
    },
    {
      caption: 'PC1 broadcasts a REQUEST for that address, telling every server which offer it took.',
      packets: [{ path: ['PC1', 'SW1', 'R1'], label: 'REQUEST', color: 'blue' }],
    },
    {
      caption: 'R1 confirms with an ACK. PC1 now has 10.0.10.21/24 and a default gateway.',
      packets: [{ path: ['R1', 'SW1', 'PC1'], label: 'ACK', color: 'brown' }],
      notes: { PC1: '10.0.10.21/24' },
      cli: {
        device: 'R1',
        cmd: 'show ip dhcp binding',
        out: ['IP address    Hardware address', '10.0.10.21    0050.79a6.0c21'],
      },
    },
  ],
};
