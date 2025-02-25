import type { Card } from "~/lib/solitaire-card-interface";

import { atom } from "jotai";

export const tableauAtom = atom<Record<number, Card[]>>({});
