import type { Atom, WritableAtom } from "jotai";

import { atom } from "jotai";

export function readonly<Value, Args extends unknown[], Result>(
  writableAtom: WritableAtom<Value, Args, Result>,
): Atom<Value> {
  return atom((get) => get(writableAtom));
}
