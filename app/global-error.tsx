"use client";

import type { PropsWithError } from "next";
import type { CSSProperties, ReactNode } from "react";

import { useEffect } from "react";
import originalTheme from "react95/dist/themes/original";

import { fontSans } from "~/lib/font-sans";
import { i18n } from "~/lib/i18n";

const baseStyle: CSSProperties = {
  boxSizing: "border-box",
  margin: 0,
  padding: 0,
  width: "100%",
  textSizeAdjust: "100%",
  color: originalTheme.headerText,
  backgroundColor: originalTheme.headerBackground,
};

export default function GlobalError({ reset }: PropsWithError): ReactNode {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      event.preventDefault();
      if (reset) reset();
      else location.reload();
    };
    addEventListener("keydown", handleKeyDown);
    return () => {
      removeEventListener("keydown", handleKeyDown);
    };
  }, [reset]);
  return (
    <html
      lang={i18n.lang}
      dir={i18n.dir}
      style={{
        ...fontSans.style,
        ...baseStyle,
        colorScheme: "light",
        fontSize: "16px",
        display: "block",
        height: "100%",
        overflow: "hidden auto",
      }}
    >
      <body
        style={{
          ...baseStyle,
          fontSize: "1rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100%",
          padding: "1rem",
          overflow: "hidden",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "1rem",
            fontWeight: "bold",
            padding: "0 0.5rem",
            color: originalTheme.headerBackground,
            backgroundColor: originalTheme.headerText,
          }}
        >
          Windows
        </h1>
        <p
          style={{
            marginBottom: 0,
            marginTop: "1rem",
            fontSize: "1rem",
            fontWeight: "normal",
          }}
        >
          A fatal exception has occurred.
        </p>
        <p
          style={{
            marginBottom: 0,
            marginTop: "1rem",
            fontSize: "1rem",
            fontWeight: "normal",
          }}
        >
          Press any key to continue _
        </p>
      </body>
    </html>
  );
}
