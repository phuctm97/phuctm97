"use client";

import type { PropsWithError } from "next";
import type { ReactNode } from "react";

import { useHydrateAtoms } from "jotai/utils";

import { exceptionAtom } from "~/lib/exception-atom";
import { Windows } from "~/lib/window";

export default function Error(props: PropsWithError): ReactNode {
  useHydrateAtoms([[exceptionAtom, props]]);
  return <Windows windows={["5xx"]} />;
}
