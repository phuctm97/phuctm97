"use client";

import type { PropsWithChildren, ReactNode } from "react";

import { DirectionProvider } from "@radix-ui/react-direction";
import { Provider as JotaiProvider } from "jotai";
import { useServerInsertedHTML } from "next/navigation";
import { useState } from "react";
import { styleReset } from "react95";
import originalTheme from "react95/dist/themes/original";
import {
  createGlobalStyle,
  ServerStyleSheet,
  StyleSheetManager,
  ThemeProvider,
} from "styled-components";

import { i18n } from "~/i18n";
import { runtime } from "~/runtime";

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

function Container({ children }: PropsWithChildren): ReactNode {
  return (
    <ThemeProvider theme={originalTheme}>
      <GlobalStyle />
      <DirectionProvider dir={i18n.dir}>
        <JotaiProvider>{children}</JotaiProvider>
      </DirectionProvider>
    </ThemeProvider>
  );
}

function createServerStyleSheet(): ServerStyleSheet {
  return new ServerStyleSheet();
}

function ServerContainer({ children }: PropsWithChildren): ReactNode {
  const [serverStyleSheet] = useState(createServerStyleSheet);
  useServerInsertedHTML(() => {
    try {
      return serverStyleSheet.getStyleElement();
    } finally {
      serverStyleSheet.instance.clearTag();
    }
  });
  return (
    <StyleSheetManager sheet={serverStyleSheet.instance}>
      <Container>{children}</Container>
    </StyleSheetManager>
  );
}

export function Provider({ children }: PropsWithChildren): ReactNode {
  return runtime === "browser" ? (
    <Container>{children}</Container>
  ) : (
    <ServerContainer>{children}</ServerContainer>
  );
}
