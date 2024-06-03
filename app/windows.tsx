import type { ReactNode } from "react";

import { useAtomValue } from "jotai";

import { DefaultWindow } from "./default-window";
import { WelcomeWindow } from "./welcome-window";
import { openWindowsAtom } from "./window";

interface ConnectedWindowProps {
  window: string;
}

function ConnectedWindow({ window }: ConnectedWindowProps): ReactNode {
  switch (window) {
    case "Welcome": {
      return <WelcomeWindow />;
    }
    default: {
      return <DefaultWindow window={window}>Work in progress…</DefaultWindow>;
    }
  }
}

export function Windows(): ReactNode {
  const windows = useAtomValue(openWindowsAtom);
  return (
    <>
      {windows.map((window) => (
        <ConnectedWindow key={window} window={window} />
      ))}
    </>
  );
}
