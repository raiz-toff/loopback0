import type { Figure } from '@/components/figures/types';

const COLS = ['VLAN', 'MAC address', 'Port'];
const A = ['10', '0050.79a6.000a', 'g0/1'];
const C = ['10', '0050.79a6.000c', 'g0/3'];

export const macLearning: Figure = {
  id: 'mac-learning',
  kicker: 'Switching',
  title: 'A switch learns where each host lives from the frames it sends.',
  size: [640, 300],
  devices: [
    { id: 'SW1', kind: 'switch', x: 320, y: 82, labelTop: true },
    { id: 'A', label: 'PC-A', kind: 'pc', x: 110, y: 210 },
    { id: 'B', label: 'PC-B', kind: 'pc', x: 320, y: 210 },
    { id: 'C', label: 'PC-C', kind: 'pc', x: 530, y: 210 },
  ],
  links: [
    { a: 'A', b: 'SW1', aPort: 'eth0', bPort: 'g0/1', route: 'vh', color: 'green' },
    { a: 'B', b: 'SW1', aPort: 'eth0', bPort: 'g0/2', color: 'green', striped: true },
    { a: 'C', b: 'SW1', aPort: 'eth0', bPort: 'g0/3', route: 'vh', color: 'blue' },
  ],
  steps: [
    {
      caption: 'The MAC table starts empty. SW1 has no idea which host sits behind which port.',
      table: { title: 'SW1 · mac address-table', cols: COLS, rows: [] },
    },
    {
      caption: 'PC-A sends a frame to PC-C. SW1 reads the source MAC and records A on g0/1.',
      packets: [{ path: ['A', 'SW1'], label: 'A→C', color: 'green' }],
      table: { title: 'SW1 · mac address-table', cols: COLS, rows: [A], fresh: [0] },
    },
    {
      caption: 'SW1 has not seen PC-C yet, so it floods the frame out every other port.',
      packets: [
        { path: ['SW1', 'B'], label: 'A→C', color: 'green' },
        { path: ['SW1', 'C'], label: 'A→C', color: 'green' },
      ],
    },
    {
      caption: 'PC-C replies. SW1 learns C is on g0/3 and forwards the reply only to g0/1.',
      packets: [{ path: ['C', 'SW1', 'A'], label: 'C→A', color: 'blue' }],
      table: { title: 'SW1 · mac address-table', cols: COLS, rows: [A, C], fresh: [1] },
    },
    {
      caption: 'From now on A and C talk directly. PC-B never sees their frames.',
      packets: [{ path: ['A', 'SW1', 'C'], label: 'A→C', color: 'green' }],
      focus: ['A', 'SW1', 'C'],
    },
  ],
};
