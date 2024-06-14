import type { PropsWithError } from "next";

import { atom } from "jotai";

export const exceptionAtom = atom<PropsWithError>({});
