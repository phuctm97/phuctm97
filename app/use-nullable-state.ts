import type { Dispatch, SetStateAction } from "react";

import { useState } from "react";

export function useNullableState<T>(): [
  NonNullable<T> | null,
  Dispatch<SetStateAction<NonNullable<T> | null>>,
] {
  return useState<NonNullable<T> | null>(null);
}
