import type { ReactNode } from "react";

import { useAtomValue } from "jotai";

import { NotepadWindow } from "~/lib/notepad-window";
import { WelcomeWindow } from "~/lib/welcome-window";
import { openWindowsAtom, Window } from "~/lib/window";

import { ChatGPTWindow } from "./chatgpt-window";

interface ConnectedWindowProps {
  window: string;
}

function ConnectedWindow({ window }: ConnectedWindowProps): ReactNode {
  switch (window) {
    case "Welcome": {
      return <WelcomeWindow />;
    }
    case "Notepad": {
      return <NotepadWindow />;
    }
    case "ChatGPT": {
      return <ChatGPTWindow />;
    }
    default: {
      return <Window window={window}>N/A</Window>;
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
