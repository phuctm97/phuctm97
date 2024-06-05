import type { PropsWithChildren, ReactNode } from "react";

import { DirectionProvider } from "@radix-ui/react-direction";
import { Provider } from "jotai";
import { styleReset } from "react95";
import originalTheme from "react95/dist/themes/original";
import { createGlobalStyle, ThemeProvider } from "styled-components";

import { i18n } from "~/i18n";

const GlobalStyle = createGlobalStyle`
  ${styleReset}
  html, body {
    width: 100%;
    height: 100%;
    overflow: hidden;
    color: ${({ theme }) => theme.materialText};
    background-color: ${({ theme }) => theme.desktopBackground};
  }
  html[data-drag-visible] * {
    user-select: none !important;
    cursor: default !important;
  }
`;

export function UI({ children }: PropsWithChildren): ReactNode {
  return (
    <ThemeProvider theme={originalTheme}>
      <GlobalStyle />
      <DirectionProvider dir={i18n.dir}>
        <Provider>{children}</Provider>
      </DirectionProvider>
    </ThemeProvider>
  );
}
