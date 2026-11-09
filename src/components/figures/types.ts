/**
 * Data model for network figures: a figure is devices, cables between them,
 * and steps. Each step is one moment of the explanation: packets that travel,
 * a CLI command, a table, port states. Coordinates are viewBox units.
 */

export type DeviceKind = 'pc' | 'switch' | 'router' | 'server' | 'cloud';

/** The four T568B pair colours. A striped cable is the white-banded conductor. */
export type Conductor = 'orange' | 'green' | 'blue' | 'brown';

/** How a cable runs between two devices. Defaults to `straight` when aligned, else `hvh`. */
export type Route = 'straight' | 'hv' | 'vh' | 'hvh' | 'vhv';

export type PortState = 'forwarding' | 'blocking' | 'down';

export interface FigDevice {
  id: string;
  kind: DeviceKind;
  /** Shown under the device, e.g. `R1`. Defaults to `id`. */
  label?: string;
  x: number;
  y: number;
  /** Second line under the label, e.g. an IP address. Steps can change it. */
  note?: string;
  /** Put the label above the tile, for devices with a cable entering from below. */
  labelTop?: boolean;
}

export interface FigLink {
  /** Device ids at each end. */
  a: string;
  b: string;
  /** Interface names at each end, e.g. `g0/1`. Used for labels and `ports` keys. */
  aPort?: string;
  bPort?: string;
  color?: Conductor;
  striped?: boolean;
  /** Small chip at the cable's middle, e.g. `trunk`. */
  label?: string;
  route?: Route;
}

export interface FigPacket {
  /** Device ids the packet visits in order; each pair must share a link. */
  path: string[];
  /** Text on the packet, e.g. `DISCOVER`. Keep it under ~10 characters. */
  label: string;
  /** Optional dark prefix segment, e.g. `VLAN 10`. */
  tag?: string;
  color?: Conductor;
  /** The packet is discarded just before the last device (blocked port, ACL). */
  drop?: boolean;
}

export interface FigCli {
  /** Device whose prompt is shown, e.g. `R1` → `R1#`. */
  device: string;
  cmd: string;
  out?: string[];
}

export interface FigTable {
  title: string;
  cols: string[];
  rows: string[][];
  /** Row indexes to highlight as new in this step. */
  fresh?: number[];
}

export interface FigStep {
  /** One sentence, under ~20 words. Read aloud by screen readers. */
  caption: string;
  packets?: FigPacket[];
  /** Device ids to keep at full strength; everything else dims. */
  focus?: string[];
  /** Keyed `DEVICE:port`, e.g. `SW3:g0/2`. Carries forward to later steps. */
  ports?: Record<string, PortState>;
  /** Replaces device notes. Carries forward to later steps. */
  notes?: Record<string, string>;
  /** Carries forward until a later step sets another. */
  cli?: FigCli;
  /** Carries forward until a later step sets another. */
  table?: FigTable;
}

export interface Figure {
  id: string;
  /** Short mono kicker above the title, e.g. `DHCP`. */
  kicker: string;
  /** The claim the figure proves, one sentence. */
  title: string;
  /** viewBox width and height. 640 × 280 suits most figures. */
  size: [number, number];
  devices: FigDevice[];
  links: FigLink[];
  steps: FigStep[];
}
