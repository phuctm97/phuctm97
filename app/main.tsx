import type { PropsWithChildren, ReactNode } from "react";

import { useSetAtom } from "jotai";

import { atomWithNullable } from "./atom-with-nullable";
import { readonly } from "./readonly";

const mainWritableAtom = atomWithNullable<HTMLElement>();

export const mainAtom = readonly(mainWritableAtom);

export function Main({ children }: PropsWithChildren): ReactNode {
  const ref = useSetAtom(mainWritableAtom);
  return (
    <main
      ref={ref}
      css="position: relative; z-index: 0; width: 100%; height: calc(100% - 48px); overflow: hidden;"
    >
      {children}
    </main>
  );
}
