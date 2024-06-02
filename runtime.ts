import type { Runtime } from "next";

export const runtime: Runtime =
  typeof document === "undefined"
    ? typeof EdgeRuntime === "undefined"
      ? "nodejs"
      : "edge"
    : "browser";
