import type { ReactNode } from "react";

import { useAtomValue, useSetAtom } from "jotai";
import { useCallback } from "react";
import { Button } from "react95";

import {
  isActiveWindowAtomFamily,
  openWindowAtom,
  openWindowsAtom,
} from "./window";

interface WindowButtonProps {
  window: string;
}

function WindowButton({ window }: WindowButtonProps): ReactNode {
  const openWindow = useSetAtom(openWindowAtom);
  const handleClick = useCallback(() => {
    openWindow(window);
  }, [window, openWindow]);
  const isActive = useAtomValue(isActiveWindowAtomFamily(window));
  return (
    <Button
      active={isActive}
      css="width: 200px; display: flex; flex-direction: row; align-items: center; justify-content: start; font-weight: bold; margin-right: 4px;"
      onClick={handleClick}
    >
      {window}
    </Button>
  );
}

export function WindowButons(): ReactNode {
  const windows = useAtomValue(openWindowsAtom);
  return (
    <>
      {windows.map((window) => (
        <WindowButton key={window} window={window} />
      ))}
    </>
  );
}
