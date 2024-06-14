/// <reference types="@edge-runtime/types" />

import "next";
import "react";

import type { Atom, getDefaultStore, WritableAtom } from "jotai";
import type { Theme } from "react95/dist/themes/types";
import type { CSSProp } from "styled-components";

declare module "jotai" {
  type Store = ReturnType<typeof getDefaultStore>;
  type Read<Value> = Atom<Value>["read"];
  type Write<Value, Args extends unknown[], Result> = WritableAtom<
    Value,
    Args,
    Result
  >["write"];
}

declare module "next" {
  type Runtime = "edge" | "nodejs" | "browser";
  interface PropsWithError<T = unknown> extends T {
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
