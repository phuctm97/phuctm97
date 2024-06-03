import type { ReactNode } from "react";

import { Anchor } from "react95";

import { DefaultWindow } from "./default-window";

export function WelcomeWindow(): ReactNode {
  return (
    <DefaultWindow window="Welcome">
      <h1 css="font-size: 2rem; font-weight: bold;">
        Welcome to{" "}
        <Anchor
          href="https://x.com/phuctm97"
          target="_blank"
          rel="noopener noreferrer"
        >
          @phuctm97
        </Anchor>
      </h1>
    </DefaultWindow>
  );
}
