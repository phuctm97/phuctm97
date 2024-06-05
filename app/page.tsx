"use client";

import type { ReactNode } from "react";

import { useAtomValue } from "jotai";
import styled from "styled-components";

import { ChatGPT } from "~/lib/chatgpt";
import { Notepad } from "~/lib/notepad";
import { Welcome } from "~/lib/welcome";
import { openWindowsAtom } from "~/lib/window";

import { Header } from "./header";

interface WindowProps {
  window: string;
}

function Window({ window }: WindowProps): ReactNode {
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
  }
}

function Windows(): ReactNode {
  const openWindows = useAtomValue(openWindowsAtom);
  return (
    <>
      {openWindows.map((window) => (
        <Window key={window} window={window} />
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
        <Windows />
      </Main>
    </>
  );
}
