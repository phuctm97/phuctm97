"use client";

import type { PropsWithChildren, ReactNode } from "react";

import { useServerInsertedHTML } from "next/navigation";
import { useState } from "react";
import { ServerStyleSheet, StyleSheetManager } from "styled-components";

import { runtime } from "~/runtime";

import { Container } from "./container";

function createServerStyleSheet(): ServerStyleSheet {
  return new ServerStyleSheet();
}

function Server({ children }: PropsWithChildren): ReactNode {
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
      {children}
    </StyleSheetManager>
  );
}

export function Provider({ children }: PropsWithChildren): ReactNode {
  return runtime === "browser" ? (
    <Container>{children}</Container>
  ) : (
    <Server>
      <Container>{children}</Container>
    </Server>
  );
}
