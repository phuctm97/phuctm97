import type { ReactNode } from "react";

import { DefaultWindow } from "./default-window";

export function WelcomeWindow(): ReactNode {
  return (
    <DefaultWindow window="Welcome">
      <h1 css="font-size: 2rem; font-weight: bold;">Welcome to @phuctm97</h1>
    </DefaultWindow>
  );
}
