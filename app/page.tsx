"use client";

import type { ReactNode } from "react";

import { AppBar, Toolbar } from "react95";
import styled from "styled-components";

import { Clock } from "./clock";
import { StartButton } from "./start-button";
import { WindowButons } from "./window-buttons";
import { Windows } from "./windows";

const Main = styled.main`
  position: relative;
  z-index: 0;
  width: 100%;
  height: calc(100% - 48px);
  overflow: hidden;
`;

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
