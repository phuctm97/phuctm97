import type { PropsWithChildren, ReactNode } from "react";

import { useServerInsertedHTML } from "next/navigation";
import { useState } from "react";
import { ServerStyleSheet, StyleSheetManager } from "styled-components";

function createServerStyleSheet(): ServerStyleSheet {
  return new ServerStyleSheet();
}

export function SSR({ children }: PropsWithChildren): ReactNode {
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
