"use client";

import type { ReactNode } from "react";

import { AppBar, Toolbar } from "react95";

import { Main } from "~/lib/main";

import { Clock } from "./clock";
import { StartButton } from "./start-button";
import { WindowButons } from "./window-buttons";
import { Windows } from "./windows";

export default function Page(): ReactNode {
  return (
    <>
      <AppBar css="top: auto; bottom: 0;">
        <Toolbar css="display: flex;">
          <StartButton />
          <WindowButons />
          <Clock />
        </Toolbar>
      </AppBar>
      <Main>
        <Windows />
      </Main>
    </>
  );
}
