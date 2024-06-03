import type { PrimitiveAtom } from "jotai";

import { atom } from "jotai";

export function atomWithOptional<T>(): PrimitiveAtom<
  NonNullable<T> | undefined
> {
  return atom<NonNullable<T> | undefined>(undefined);
}
