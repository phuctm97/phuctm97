import type { CSSProperties, ReactNode } from "react";

import type { Card } from "~/lib/solitaire-card-interface";
import type { Place } from "~/lib/solitaire-types";

import { useSetAtom } from "jotai";
import { useDrag, useDrop } from "react-dnd";
import styled from "styled-components";

import { cardHeight, cardWidth } from "~/lib/solitaire-constant";
import { moveCardAtom } from "~/lib/solitaire-move-card-atom";
import img from "~/lib/solitaire-spritesheet.png";

const CardStyled = styled.div<{
  card: Card;
}>`
  display: flex;
  cursor: pointer;
  width: ${cardWidth}px;
  height: ${cardHeight}px;
  background-image: url(${img.src});
  background-position: ${({ card }) =>
    card.facingUp
      ? card.backgroundPositionFacingUp
      : card.backgroundPositionFacingDown};
`;

interface CardProps {
  card: Card;
  canDrag?: boolean;
  canDrop?: boolean;
  style?: CSSProperties;
  children?: ReactNode;
}

interface DragItem {
  droppedCard: Card;
  sourcePlace: Place;
  sourceColumn: number;
}

export function Card({
  card,
  canDrag = true,
  canDrop = true,
  style,
  children,
}: CardProps): ReactNode {
  const moveCard = useSetAtom(moveCardAtom);

  const [{ isDragging }, drag] = useDrag({
    type: "CARD",
    item: {
      droppedCard: card,
      sourcePlace: card.place,
      sourceColumn: card.column,
    },
    canDrag,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

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
          place: card.place,
          column: card.column,
        },
      });
    },
  });

  return drag(
    drop(
      <div>
        <CardStyled
          card={card}
          style={{ ...style, opacity: isDragging ? 0 : 1 }}
        >
          {children}
        </CardStyled>
      </div>,
    ),
  );
}
