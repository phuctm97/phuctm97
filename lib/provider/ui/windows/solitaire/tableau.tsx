import type { ReactNode } from "react";

import type { Card } from "~/lib/solitaire-card-interface";

import { useAtomValue } from "jotai";
import styled from "styled-components";

import { cardWidth } from "~/lib/solitaire-constant";
import { tableauAtom } from "~/lib/solitaire-tableau-atom";

import { Card as CardComponent } from "./card";
import { Holder } from "./holder";

const TableauWrapperStyled = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  padding: 5px;
`;

const TableauColumnStyled = styled.div`
  display: flex;
  position: relative;
  width: ${cardWidth}px;
`;

function BoardColumn({
  cards,
  columnIndex,
}: {
  cards: Card[];
  columnIndex: number;
}): ReactNode {
  let nestedComponents: ReactNode | undefined = undefined;

  for (let index = cards.length - 1; index >= 0; index--) {
    nestedComponents = (
      <CardComponent
        key={cards[index].id}
        card={cards[index]}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          margin: `${(index === 0 ? 0 : 15).toString()}px 0 0 0`,
        }}
        canDrag={cards[index].facingUp}
        canDrop={cards.length - 1 === index}
      >
        {nestedComponents}
      </CardComponent>
    );
  }

  return (
    <TableauColumnStyled>
      <Holder
        place="tableau"
        columnIndex={columnIndex}
        canDrop={cards.length === 0}
      >
        {nestedComponents}
      </Holder>
    </TableauColumnStyled>
  );
}

export function Tableau(): ReactNode {
  const tableau = useAtomValue(tableauAtom);

  return (
    <TableauWrapperStyled>
      {Object.entries(tableau).map(([index, cards]) => (
        <BoardColumn key={index} cards={cards} columnIndex={Number(index)} />
      ))}
    </TableauWrapperStyled>
  );
}
