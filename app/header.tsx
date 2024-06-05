import type { ReactNode } from "react";

import { AppBar, Toolbar } from "react95";
import styled from "styled-components";

import { Clock } from "./clock";
import { StartButton } from "./start-button";
import { WindowButons } from "./window-buttons";

const StyledAppBar = styled(AppBar)`
  top: auto;
  bottom: 0;
`;

const StyledToolbar = styled(Toolbar)`
  display: flex;
`;

export function Header(): ReactNode {
  return (
    <StyledAppBar>
      <StyledToolbar>
        <StartButton />
        <WindowButons />
        <Clock />
      </StyledToolbar>
    </StyledAppBar>
  );
}
