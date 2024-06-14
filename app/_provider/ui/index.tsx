import type { PropsWithChildren, ReactNode } from "react";

import { DirectionProvider } from "@radix-ui/react-direction";
import { Provider } from "jotai";
import { styleReset } from "react95";
import originalTheme from "react95/dist/themes/original";
import styled, { createGlobalStyle, ThemeProvider } from "styled-components";

import { i18n } from "~/i18n";

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

export function UI({ children }: PropsWithChildren): ReactNode {
  return (
    <ThemeProvider theme={originalTheme}>
      <Style />
      <DirectionProvider dir={i18n.dir}>
        <Provider>
          <Header />
          <Main>
            {children}
            <Windows />
          </Main>
        </Provider>
      </DirectionProvider>
    </ThemeProvider>
  );
}
