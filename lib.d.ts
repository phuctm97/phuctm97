/// <reference types="@edge-runtime/types" />

import "next";
import "react";

import type { Theme } from "react95/dist/themes/types";
import type { CSSProp } from "styled-components";

declare module "next" {
  type Runtime = "edge" | "nodejs" | "browser";
  interface PropsWithError<T extends object = Record<string, never>> extends T {
    error?: Error & { digest?: string };
    reset?: () => void;
  }
}

declare module "react" {
  interface Attributes {
    css?: CSSProp;
  }
}

declare module "styled-components" {
  interface DefaultTheme extends Theme {}
}
