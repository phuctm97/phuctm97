"use client";

import type { ReactNode } from "react";

import { AppBar, Toolbar } from "react95";

import { Clock } from "./clock";
import { StartButton } from "./start-button";
import { WindowButons } from "./window-buttons";
import { Windows } from "./windows";

export default function Page(): ReactNode {
  return (
    <>
      <AppBar css="top: auto; bottom: 0;">
        <Toolbar css="justify-content: space-between;">
          <div css="display: flex; flex-direction: row; align-items: stretch;">
            <StartButton />
            <WindowButons />
          </div>
          <Clock />
        </Toolbar>
      </AppBar>
      <main css="position: relative; width: 100%; height: calc(100% - 48px);">
        <Windows />
      </main>
    </>
  );
}
