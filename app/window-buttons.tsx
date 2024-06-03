import type { ReactNode } from "react";

import { useAtomValue } from "jotai";
import { Button } from "react95";

import { activeWindowsAtom } from "./window";

export function WindowButons(): ReactNode {
  const windows = useAtomValue(activeWindowsAtom);
  return (
    <>
      {windows.map((window) => (
        <Button
          key={window}
          css="width: 200px; display: flex; flex-direction: row; align-items: center; justify-content: start; font-weight: bold; margin-right: 4px;"
        >
          {window}
        </Button>
      ))}
    </>
  );
}
