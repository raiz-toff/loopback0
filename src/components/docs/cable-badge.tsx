'use client';

import React from 'react';
import { cn, type DeviceStatus, type LinkMode } from './topology-types';

export interface CableBadgeProps {
  mode?: LinkMode;
  speed?: string;
  status?: DeviceStatus;
  animated?: boolean;
  label?: string;
  /** 'badge' (standalone pill), 'wire' (stretched cable line with center chip), or 'pill' (compact) */
  variant?: 'badge' | 'wire' | 'pill';
  className?: string;
}

export const MODE_LABEL: Record<LinkMode, string> = {
  trunk: 'Trunk (802.1Q)',
  access: 'Access Port',
  routed: 'Routed L3',
  tunnel: 'Overlay Tunnel',
  peering: 'eBGP Peering',
  stack: 'StackWise Backplane',
};

export const CABLE_STATUS_COLOR: Record<DeviceStatus, string> = {
  up: 'bg-emerald-500 border-emerald-500 text-emerald-500',
  degraded: 'bg-amber-500 border-amber-500 text-amber-500',
  down: 'bg-rose-500 border-rose-500 text-rose-500',
  planned: 'bg-sky-500 border-sky-500 text-sky-500',
  unknown: 'bg-slate-400 border-slate-400 text-slate-400',
};

export function CableBadge({
  mode = 'trunk',
  speed = '10G',
  status = 'up',
  animated = false,
  label,
  variant = 'badge',
  className,
}: CableBadgeProps) {
  // Wire mode: stretches horizontally between devices with extending lines and a center speed pill
  if (variant === 'wire') {
    return (
      <div className={cn('relative flex items-center justify-center w-full my-0.5', className)}>
        {/* Full-width cable wire */}
        <div
          className={cn(
            'w-full transition-all',
            mode === 'trunk' && 'border-y border-emerald-500 h-2 bg-emerald-500/10',
            mode === 'tunnel' && 'border-b-2 border-dashed border-sky-500 h-0',
            mode === 'peering' && 'border-b-2 border-dotted border-purple-500 h-0',
            mode === 'stack' && 'h-1.5 rounded-full bg-indigo-500',
            mode !== 'trunk' &&
              mode !== 'tunnel' &&
              mode !== 'peering' &&
              mode !== 'stack' &&
              cn('h-1 rounded-full', CABLE_STATUS_COLOR[status]?.split(' ')[0]),
          )}
        />

        {/* Center badge chip */}
        <div className="absolute flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-fd-border bg-fd-background shadow-xs text-[10.5px] font-mono font-bold tracking-tight">
          {animated && (
            <span
              className={cn(
                'size-1.5 rounded-full animate-ping',
                status === 'up' ? 'bg-emerald-400' : 'bg-amber-400',
              )}
            />
          )}
          <span className="text-fd-foreground">{label || speed}</span>
          {mode === 'trunk' && (
            <span className="text-[9px] font-sans font-medium text-fd-muted-foreground uppercase">
              Trunk
            </span>
          )}
          {mode === 'tunnel' && (
            <span className="text-[9px] font-sans font-medium text-sky-500 uppercase">
              Tunnel
            </span>
          )}
        </div>
      </div>
    );
  }

  // Pill mode: ultra-compact cable connection for inline text
  if (variant === 'pill') {
    return (
      <span className={cn('relative inline-flex items-center justify-center px-1 shrink-0', className)}>
        <span
          className={cn(
            'w-8 transition-all',
            mode === 'trunk' && 'border-y border-emerald-500 h-1.5 bg-transparent',
            mode === 'tunnel' && 'border-b-2 border-dashed border-sky-500 h-0',
            mode === 'peering' && 'border-b-2 border-dotted border-purple-500 h-0',
            mode !== 'trunk' &&
              mode !== 'tunnel' &&
              mode !== 'peering' &&
              cn('h-0.5', CABLE_STATUS_COLOR[status]?.split(' ')[0]),
          )}
        />
        <span className="absolute flex items-center gap-1 px-1.5 py-0.2 rounded-full border border-fd-border bg-fd-background text-[9px] font-mono font-medium shadow-xs">
          <span>{label || speed}</span>
        </span>
      </span>
    );
  }

  // Standalone badge mode: pill with status LED indicator and optional pulse animation
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-fd-border bg-fd-card text-xs font-mono font-medium shadow-xs transition-colors',
        className,
      )}
    >
      <span className="relative flex size-2">
        {animated && (
          <span
            className={cn(
              'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
              CABLE_STATUS_COLOR[status]?.split(' ')[0],
            )}
          />
        )}
        <span
          className={cn(
            'relative inline-flex rounded-full size-2',
            CABLE_STATUS_COLOR[status]?.split(' ')[0],
          )}
        />
      </span>
      <span className="text-fd-foreground font-semibold">{label || speed}</span>
      <span className="text-fd-muted-foreground border-l border-fd-border pl-2 text-[10px] font-sans font-normal uppercase tracking-wider">
        {MODE_LABEL[mode]}
      </span>
    </div>
  );
}
