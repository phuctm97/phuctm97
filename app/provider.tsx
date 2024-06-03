"use client";

import type {
  ComponentPropsWithoutRef,
  PropsWithChildren,
  ReactNode,
} from "react";

import isPropValid from "@emotion/is-prop-valid";
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

function createServerStyleSheet(): ServerStyleSheet | undefined {
  if (runtime === "browser") return;
  return new ServerStyleSheet();
}

const shouldForwardProp: ComponentPropsWithoutRef<
  typeof StyleSheetManager
>["shouldForwardProp"] = (prop, target) =>
  typeof target === "string" ? isPropValid(prop) : !prop.startsWith("$");

export function Provider({ children }: PropsWithChildren): ReactNode {
  const [serverStyleSheet] = useState(createServerStyleSheet);
  useServerInsertedHTML(() => {
    if (!serverStyleSheet) return;
    try {
      return serverStyleSheet.getStyleElement();
    } finally {
      serverStyleSheet.instance.clearTag();
    }
  });
  return (
    <StyleSheetManager
      sheet={serverStyleSheet?.instance}
      shouldForwardProp={shouldForwardProp}
      enableVendorPrefixes
    >
      <ThemeProvider theme={originalTheme}>
        <GlobalStyle />
        <DirectionProvider dir={i18n.dir}>
          <JotaiProvider>{children}</JotaiProvider>
        </DirectionProvider>
      </ThemeProvider>
    </StyleSheetManager>
  );
}
