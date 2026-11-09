import type { Figure } from '@/components/figures/types';

export const stpLoop: Figure = {
  id: 'stp-loop',
  kicker: 'Spanning Tree',
  title: 'STP blocks one port so a loop of switches cannot melt the network.',
  size: [640, 300],
  devices: [
    { id: 'SW1', kind: 'switch', x: 320, y: 70, note: 'priority 4096' },
    { id: 'SW2', kind: 'switch', x: 130, y: 210, note: 'priority 32768' },
    { id: 'SW3', kind: 'switch', x: 510, y: 210, note: 'priority 32768' },
  ],
  links: [
    { a: 'SW2', b: 'SW1', aPort: 'g0/1', bPort: 'g0/1', route: 'vh', color: 'orange' },
    { a: 'SW3', b: 'SW1', aPort: 'g0/1', bPort: 'g0/2', route: 'vh', color: 'green' },
    { a: 'SW2', b: 'SW3', aPort: 'g0/2', bPort: 'g0/2', color: 'brown', striped: true },
  ],
  steps: [
    {
      caption: 'Three switches cabled in a triangle form a loop. One broadcast could circle it forever.',
      packets: [{ path: ['SW2', 'SW3', 'SW1', 'SW2'], label: 'BCAST', color: 'orange' }],
    },
    {
      caption: 'The switches trade BPDUs. SW1 has the lowest bridge ID, so it becomes the root bridge.',
      packets: [
        { path: ['SW1', 'SW2'], label: 'BPDU', color: 'blue' },
        { path: ['SW1', 'SW3'], label: 'BPDU', color: 'blue' },
      ],
      notes: { SW1: 'root bridge' },
      cli: { device: 'SW1', cmd: 'show spanning-tree vlan 1', out: ['Root ID  Priority 4097', '         This bridge is the root'] },
    },
    {
      caption: 'Every other switch keeps its best path to the root. SW3 loses the tie-break and blocks g0/2.',
      ports: { 'SW3:g0/2': 'blocking' },
      focus: ['SW3', 'SW2'],
      cli: { device: 'SW3', cmd: 'show spanning-tree vlan 1 | include Gi0/2', out: ['Gi0/2  Altn BLK 4  128.2  P2p'] },
    },
    {
      caption: 'The same broadcast now dies at the blocked port. The loop is gone and the cable waits as a backup.',
      packets: [
        { path: ['SW2', 'SW3'], label: 'BCAST', color: 'orange', drop: true },
        { path: ['SW2', 'SW1', 'SW3'], label: 'BCAST', color: 'orange' },
      ],
    },
  ],
};
