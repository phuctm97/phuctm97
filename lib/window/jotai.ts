import type { ReactNode } from "react";

import { atom } from "jotai";
import { atomFamily, useHydrateAtoms } from "jotai/utils";

import { atomWithWriteOnly } from "~/lib/atom-with-write-only";

interface State {
  openWindows: string[];
  activeWindow?: string;
}

function createState(...openWindows: string[]): State {
  return { openWindows, activeWindow: openWindows[0] };
}

const stateAtom = atom(createState());

export interface WindowsProps {
  windows: string[];
}

export function Windows({ windows }: WindowsProps): ReactNode {
  useHydrateAtoms([[stateAtom, createState(...windows)]]);
  return undefined;
}

export const openWindowsAtom = atom((get) => get(stateAtom).openWindows);

export const activeWindowAtom = atom((get) => get(stateAtom).activeWindow);

export const isActiveWindowAtomFamily = atomFamily((window: string) =>
  atom((get) => get(activeWindowAtom) === window),
);

function openWindow(state: State, window: string): State {
  const includesWindow = state.openWindows.includes(window);
  if (includesWindow && state.activeWindow === window) return state;
  return {
    openWindows: includesWindow
      ? state.openWindows
      : [...state.openWindows, window],
    activeWindow: window,
  };
}

export const openWindowAtom = atomWithWriteOnly((get, set, window: string) => {
  set(stateAtom, (state) => openWindow(state, window));
});

function closeWindow(state: State, window: string): State {
  const includesWindow = state.openWindows.includes(window);
  const isActive = state.activeWindow === window;
  if (!includesWindow && !isActive) return state;
  return {
    openWindows: includesWindow
      ? state.openWindows.filter((openWindow) => openWindow !== window)
      : state.openWindows,
    activeWindow: isActive ? undefined : state.activeWindow,
  };
}

export const closeWindowAtom = atomWithWriteOnly((get, set, window: string) => {
  set(stateAtom, (state) => closeWindow(state, window));
});

function toggleActiveWindow(state: State, window: string): State {
  return state.activeWindow === window
    ? { ...state, activeWindow: undefined }
    : openWindow(state, window);
}

export const toggleActiveWindowAtom = atomWithWriteOnly(
  (get, set, window: string) => {
    set(stateAtom, (state) => toggleActiveWindow(state, window));
  },
);
