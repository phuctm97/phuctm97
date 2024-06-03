import type { WritableAtom, Write } from "jotai";

import { atom } from "jotai";

function read(): never {
  throw new Error("Can't read atomWithWriteOnly");
}

export function atomWithWriteOnly<Args extends unknown[], Result>(
  write: Write<never, Args, Result>,
): WritableAtom<never, Args, Result> {
  return atom(read, write);
}
