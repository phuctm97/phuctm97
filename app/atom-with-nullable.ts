import type { PrimitiveAtom } from "jotai";

import { atom } from "jotai";

export function atomWithNullable<T>(): PrimitiveAtom<NonNullable<T> | null> {
  return atom<NonNullable<T> | null>(null);
}
