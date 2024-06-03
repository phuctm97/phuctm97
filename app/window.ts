import { atom } from "jotai";

import { atomWithWriteOnly } from "./atom-with-write-only";
import { readonly } from "./readonly";

const activeWindowsWritableAtom = atom<string[]>(["Welcome"]);

export const activeWindowsAtom = readonly(activeWindowsWritableAtom);

export const openWindowAtom = atomWithWriteOnly((get, set, window: string) => {
  set(activeWindowsWritableAtom, (activeWindows) =>
    activeWindows.includes(window) ? activeWindows : [...activeWindows, window],
  );
});

export const closeWindowAtom = atomWithWriteOnly((get, set, window: string) => {
  set(activeWindowsWritableAtom, (activeWindows) =>
    activeWindows.includes(window)
      ? activeWindows.filter((activeWindow) => activeWindow !== window)
      : activeWindows,
  );
});
