export type DeviceStatus = 'up' | 'degraded' | 'down' | 'planned' | 'unknown';
export type LinkMode = 'access' | 'trunk' | 'routed' | 'peering' | 'tunnel' | 'stack';

export function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(' ');
}
