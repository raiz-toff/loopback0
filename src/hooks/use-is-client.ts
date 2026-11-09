import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * Reports whether the component is rendering in the browser.
 *
 * @returns `false` during SSR and hydration, `true` after hydration.
 */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
