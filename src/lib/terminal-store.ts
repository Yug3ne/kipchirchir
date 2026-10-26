import { useSyncExternalStore } from "react";

let open = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export const terminal = {
  open() {
    open = true;
    emit();
  },
  close() {
    open = false;
    emit();
  },
  toggle() {
    open = !open;
    emit();
  },
};

export function useTerminalOpen(): boolean {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => open,
    () => false,
  );
}

/** Ask the hero playground to retrain from scratch. */
export const RETRAIN_EVENT = "playground:retrain";
