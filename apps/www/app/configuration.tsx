"use client";

import type { FC, PropsWithChildren } from "react";

import { Provider } from "jotai";

export const Configuration: FC<PropsWithChildren> = ({ children }) => (
  <Provider>{children}</Provider>
);
