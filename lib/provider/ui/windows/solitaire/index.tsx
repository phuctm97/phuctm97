import type { ReactNode } from "react";

import { useSetAtom } from "jotai";
import { Button, Toolbar } from "react95";
import styled from "styled-components";

import { stock } from "~/lib/solitaire-global";
import { Window } from "~/lib/window";

import { foundationAtom } from "./foudation-atom";
import { Game, init } from "./game";
import { tableauAtom } from "./tableau-atom";
import { wasteAtom } from "./waste-atom";

export function Solitaire(): ReactNode {
  const setWaste = useSetAtom(wasteAtom);
  const setFoundation = useSetAtom(foundationAtom);
  const setTableau = useSetAtom(tableauAtom);

  const resetGame = (): void => {
    setWaste([]);
    setFoundation({ 0: [], 1: [], 2: [], 3: [] });
    stock.length = 0;
  };

  const handleNewGame = (): void => {
    resetGame();
    const tableau = init();
    setTableau(tableau);
  };

  return (
    <StyledWindow window="Solitaire" defaultWidth={1200} defaultHeight={600}>
      <Toolbar noPadding>
        <Button variant="menu" size="sm" onClick={handleNewGame}>
          New Game
        </Button>
        <Button variant="menu" size="sm">
          Help
        </Button>
      </Toolbar>

      <Game />
    </StyledWindow>
  );
}

const StyledWindow = styled(Window)``;
