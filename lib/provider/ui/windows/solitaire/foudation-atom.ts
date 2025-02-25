import type { Card } from "~/lib/solitaire-card-interface";

import { atom } from "jotai";

export const foundationAtom = atom<Record<number, Card[]>>({
  0: [],
  1: [],
  2: [],
  3: [],
});
