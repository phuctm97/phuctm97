"use client";

import type { ReactNode } from "react";

import { Windows } from "~/lib/window";

export default function Page(): ReactNode {
  return <Windows windows={["P Community"]} />;
}
