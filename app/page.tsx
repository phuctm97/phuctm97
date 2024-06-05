"use client";

import type { ReactNode } from "react";

import { useAtomValue } from "jotai";
import styled from "styled-components";

import { ChatGPT } from "~/lib/chatgpt";
import { Notepad } from "~/lib/notepad";
import { Welcome } from "~/lib/welcome";
import { openWindowsAtom, Window } from "~/lib/window";

import { Header } from "./header";

interface OpenWindowProps {
  window: string;
}

function OpenWindow({ window }: OpenWindowProps): ReactNode {
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
      return <Window window={window} />;
    }
  }
}

function OpenWindows(): ReactNode {
  const openWindows = useAtomValue(openWindowsAtom);
  return (
    <>
      {openWindows.map((openWindow) => (
        <OpenWindow key={openWindow} window={openWindow} />
      ))}
    </>
  );
}

const Main = styled.main`
  position: relative;
  z-index: 0;
  width: 100%;
  height: calc(100% - 48px);
  overflow: hidden;
`;

export default function Page(): ReactNode {
  return (
    <>
      <Header />
      <Main>
        <OpenWindows />
      </Main>
    </>
  );
}
