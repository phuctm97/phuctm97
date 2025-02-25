import type { ReactNode } from "react";

import type { Card } from "~/lib/solitaire-card-interface";
import type { Place } from "~/lib/solitaire-types";

import { useSetAtom } from "jotai";
import { useDrop } from "react-dnd";
import styled from "styled-components";

import { cardHeight, cardWidth } from "~/lib/solitaire-constant";
import { moveCardAtom } from "~/lib/solitaire-move-card-atom";
import img from "~/lib/solitaire-spritesheet.png";

const HolderStyled = styled.div`
  width: ${cardWidth}px;
  height: ${cardHeight}px;
  background-image: url(${img.src});
  background-position: ${(cardWidth * -0).toString()}px
    ${(cardHeight * -4).toString()}px;

  border-radius: 5px;
  position: relative;
`;

interface DragItem {
  droppedCard: Card;
  sourcePlace: Place;
  sourceColumn: number;
}

export function Holder({
  children,
  place,
  columnIndex,
  canDrop = true,
}: {
  children: ReactNode;
  place: Place;
  columnIndex: number;
  canDrop?: boolean;
}): ReactNode {
  const moveCard = useSetAtom(moveCardAtom);

  const [, drop] = useDrop({
    accept: "CARD",
    canDrop: () => canDrop,
    drop: ({ droppedCard, sourcePlace, sourceColumn }: DragItem) => {
      moveCard({
        card: droppedCard,
        from: {
          place: sourcePlace,
          column: sourceColumn,
        },
        to: {
          place,
          column: columnIndex,
        },
      });
    },
  });

  return drop(
    <div>
      <HolderStyled>{children}</HolderStyled>
    </div>,
  );
}
