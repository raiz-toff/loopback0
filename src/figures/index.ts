import type { Figure } from '@/components/figures/types';
import { dhcpDora } from './dhcp-dora';
import { macLearning } from './mac-learning';
import { stpLoop } from './stp-loop';

/** Every figure usable as `<NetFigure id="…" />` in MDX. Add new ones here. */
export const figures: Record<string, Figure> = {
  [dhcpDora.id]: dhcpDora,
  [macLearning.id]: macLearning,
  [stpLoop.id]: stpLoop,
};
