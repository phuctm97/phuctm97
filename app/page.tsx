"use client";

import type { ReactNode } from "react";

import styled from "styled-components";

import { Header } from "./header";
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
      <Header />
      <Main>
        <Windows />
      </Main>
    </>
  );
}
