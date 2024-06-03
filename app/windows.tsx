import type { ReactNode } from "react";

import { useAtomValue } from "jotai";

import { DefaultWindow } from "./default-window";
import { WelcomeWindow } from "./welcome-window";
import { activeWindowsAtom } from "./window";

interface ConnectedWindowProps {
  window: string;
}

function ConnectedWindow({ window }: ConnectedWindowProps): ReactNode {
  switch (window) {
    case "Welcome": {
      return <WelcomeWindow />;
    }
    default: {
      return <DefaultWindow window={window}>Empty</DefaultWindow>;
    }
  }
}

export function Windows(): ReactNode {
  const windows = useAtomValue(activeWindowsAtom);
  return (
    <>
      {windows.map((window) => (
        <ConnectedWindow key={window} window={window} />
      ))}
    </>
  );
}
