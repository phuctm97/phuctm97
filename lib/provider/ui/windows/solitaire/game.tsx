import type { ReactNode } from "react";

import type { Card } from "~/lib/solitaire-card-interface";
import type { Type } from "~/lib/solitaire-types";

import { useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import styled from "styled-components";

import {
  backgroundPositionFacingDown,
  cardHeight,
  cardWidth,
} from "~/lib/solitaire-constant";
import { stock } from "~/lib/solitaire-global";
import { tableauAtom } from "~/lib/solitaire-tableau-atom";
import { isBlack, shuffleCards, updateCardInfo } from "~/lib/solitaire-utils";

import { Foundation } from "./foundation";
import { Pile } from "./pile";
import { Tableau } from "./tableau";
import { Waste } from "./waste";

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background-color: green;
  position: relative;
  overflow: hidden; /* important for win effect */
  touch-action: none;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
`;

const Upper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  padding: 5px;
`;

export function init(): Record<number, Card[]> {
  const cards: Card[] = [];
  const types: Type[] = ["clubs", "diamonds", "hearts", "spades"];

  for (const [index, type] of types.entries()) {
    for (let number = 1; number <= 13; number++) {
      cards.push({
        id: `${type}-${number.toString()}`,
        type,
        black: isBlack(type),
        number,
        facingUp: false,
        place: "tableau",
        column: -1, // temporary
        backgroundPositionFacingUp: `${(cardWidth * -(number - 1)).toString()}px ${(cardHeight * -index).toString()}px`,
        backgroundPositionFacingDown,
      });
    }
  }

  shuffleCards(cards);

  // tableau cards
  const tableau: Record<number, Card[]> = {};
  for (let index = 0; index < 7; index++) {
    tableau[index] = cards.splice(0, index + 1);
    tableau[index][index].facingUp = true;

    for (const card of tableau[index])
      updateCardInfo(card, { column: index, place: "tableau" });
  }

  // waste cards
  stock.push(...cards);
  for (const card of stock)
    updateCardInfo(card, { facingUp: true, place: "waste" });

  return tableau;
}

export function Game(): ReactNode {
  const [loading, setLoading] = useState(true);
  const setTableau = useSetAtom(tableauAtom);

  useEffect(() => {
    const tableau = init();
    setTableau(tableau);
    setLoading(false);
  }, [setTableau]);

  if (loading) return undefined;

  return (
    <DndProvider backend={HTML5Backend}>
      <Wrapper>
        <Upper>
          <Pile />
          <Waste />
          {/* empty space */}
          <div style={{ width: cardWidth, height: cardHeight }} />
          <Foundation />
        </Upper>
        <Tableau />
      </Wrapper>
    </DndProvider>
  );
}
