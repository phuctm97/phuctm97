import type { ReactNode } from "react";

import { Window, WindowContent, WindowHeader } from "react95";

export function Welcome(): ReactNode {
  return (
    <Window css="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); max-width: 900px; max-height: 600px;">
      <WindowHeader>Welcome</WindowHeader>
      <WindowContent>
        <h1 css="font-size: 2rem; font-weight: bold;">Welcome to @phuctm97</h1>
      </WindowContent>
    </Window>
  );
}
