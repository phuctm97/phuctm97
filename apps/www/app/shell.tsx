"use client";

import type { FC, PropsWithChildren } from "react";

import {
  ScrollArea,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from "@radix-ui/react-scroll-area";

export const Shell: FC<PropsWithChildren> = ({ children }) => (
  <ScrollArea className="scroll-area h-full w-full">
    <ScrollAreaViewport className="scroll-area-viewport w-full">
      {children}
    </ScrollAreaViewport>
    <ScrollAreaScrollbar
      className="scroll-area-scrollbar"
      orientation="vertical"
    >
      <ScrollAreaThumb className="scroll-area-thumb" />
    </ScrollAreaScrollbar>
  </ScrollArea>
);
