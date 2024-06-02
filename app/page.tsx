"use client";

import type { ReactNode } from "react";

import { AppBar, Toolbar } from "react95";

import { Clock } from "./clock";
import { Start } from "./start";
import { Welcome } from "./welcome";

export default function Page(): ReactNode {
  return (
    <>
      <AppBar css="top: auto; bottom: 0;">
        <Toolbar css="justify-content: space-between;">
          <Start />
          <Clock />
        </Toolbar>
      </AppBar>
      <main css="position: relative; width: 100%; height: calc(100% - 48px);">
        <Welcome />
      </main>
    </>
  );
}
