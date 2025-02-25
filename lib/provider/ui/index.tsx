import type { PropsWithChildren, ReactNode } from "react";

import { DirectionProvider } from "@radix-ui/react-direction";
import { Provider, useAtomValue } from "jotai";
import { styleReset } from "react95";
import styled, { createGlobalStyle, ThemeProvider } from "styled-components";

import { i18n } from "~/lib/i18n";
import { themeAtom } from "~/lib/theme-atom";

import { Header } from "./header";
import { Windows } from "./windows";

const Style = createGlobalStyle`
  ${styleReset}
  html, body {
    width: 100%;
    height: 100%;
    overflow: hidden;
    color: ${({ theme }) => theme.materialText};
    background-color: ${({ theme }) => theme.desktopBackground};
  }
  html, body, * {
    color-scheme: light;
    font-family: var(--font-sans);
  }
  code {
    font-family: var(--font-mono);
    font-size: 1.25em;
  }
  html[data-drag-visible] * {
    user-select: none !important;
    cursor: default !important;
  }
`;

const Main = styled.main`
  position: relative;
  z-index: 0;
  width: 100%;
  height: calc(100% - 48px);
  overflow: hidden;
`;

function Document({ children }: PropsWithChildren): ReactNode {
  const theme = useAtomValue(themeAtom);
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

export function UI({ children }: PropsWithChildren): ReactNode {
  return (
    <Provider>
      <Document>
        <Style />
        <DirectionProvider dir={i18n.dir}>
          <Header />
          <Main>
            {children}
            <Windows />
          </Main>
        </DirectionProvider>
      </Document>
    </Provider>
  );
}
