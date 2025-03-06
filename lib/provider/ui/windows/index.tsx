import type { ReactNode } from "react";

import { useAtomValue } from "jotai";

import { openWindowsAtom } from "~/lib/window";

import { ChatGPT } from "./chatgpt";
import { Community } from "./community";
import { ControlPanel } from "./control-panel";
import { Exception } from "./exception";
import { NotFound } from "./not-found";
import { Notepad } from "./notepad";
import { Solitaire } from "./solitaire";
import { Welcome } from "./welcome";

interface WindowProps {
  window: string;
}

function Window({ window }: WindowProps): ReactNode {
  switch (window) {
    case "Welcome": {
      return <Welcome />;
    }
    case "Community": {
      return <Community />;
    }
    case "Control Panel": {
      return <ControlPanel />;
    }
    case "Notepad": {
      return <Notepad />;
    }
    case "ChatGPT": {
      return <ChatGPT />;
    }
    case "Solitaire": {
      return <Solitaire />;
    }
    case "404": {
      return <NotFound />;
    }
    case "5xx": {
      return <Exception />;
    }
  }
}

export function Windows(): ReactNode {
  const openWindows = useAtomValue(openWindowsAtom);
  return (
    <>
      {openWindows.map((window) => (
        <Window key={window} window={window} />
      ))}
    </>
  );
}
