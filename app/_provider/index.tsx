"use client";

import type { PropsWithChildren, ReactNode } from "react";

import { runtime } from "~/runtime";

import { SSR } from "./ssr";
import { UI } from "./ui";

export function Provider({ children }: PropsWithChildren): ReactNode {
  return runtime === "browser" ? (
    <UI>{children}</UI>
  ) : (
    <SSR>
      <UI>{children}</UI>
    </SSR>
  );
}
