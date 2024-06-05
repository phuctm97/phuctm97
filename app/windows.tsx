import type { ReactNode } from "react";

import { useAtomValue } from "jotai";

import { ChatGPT } from "~/lib/chatgpt";
import { Notepad } from "~/lib/notepad";
import { Welcome } from "~/lib/welcome";
import { openWindowsAtom, Window } from "~/lib/window";

interface ConnectedWindowProps {
  window: string;
}

function ConnectedWindow({ window }: ConnectedWindowProps): ReactNode {
  switch (window) {
    case "Welcome": {
      return <Welcome />;
    }
    case "Notepad": {
      return <Notepad />;
    }
    case "ChatGPT": {
      return <ChatGPT />;
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
