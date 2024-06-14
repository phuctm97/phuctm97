"use client";

import type { ReactNode } from "react";

import { Windows } from "~/lib/window";

export default function NotFound(): ReactNode {
  return <Windows windows={["404"]} />;
}
