import type { ReactNode } from "react";
import type { CSSProperties } from "styled-components";

import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { useCallback, useEffect, useRef } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Button, Toolbar } from "react95";
import styled from "styled-components";

import { atomWithWriteOnly } from "~/lib/atom-with-write-only";
import { Window } from "~/lib/window";

import img from "./spritesheet.png";

const cardWidth = 71;
const cardHeight = 96;
const backgroundPositionFacingDown = `${(cardWidth * -Math.floor(Math.random() * 12) + 1).toString()}px ${(cardHeight * -4).toString()}px`;
const backgroundPositionEmpty = `${(cardWidth * -1).toString()}px ${(cardHeight * -5).toString()}px`;
const absolute: CSSProperties = {
  position: "absolute",
  left: 0,
  top: 0,
};
const stock: Card[] = [];

type Type = "clubs" | "diamonds" | "hearts" | "spades";
type Place = "waste" | "foundation" | "tableau";

interface Card {
  id: string;
  type: "clubs" | "diamonds" | "hearts" | "spades";
  black: boolean;
  number: number;
  facingUp: boolean;
  place: "waste" | "foundation" | "tableau";
  column: number;
  backgroundPositionFacingUp?: string;
  backgroundPositionFacingDown?: string;
}

const foundationAtom = atom<Record<number, Card[]>>({
  0: [],
  1: [],
  2: [],
  3: [],
});
const wasteAtom = atom<Card[]>([]);
const tableauAtom = atom<Record<number, Card[]>>({});

interface MoveCardParams {
  card: Card;
  from: {
    place: Place;
    column: number;
  };
  to: {
    place: Place;
    column: number;
  };
}

const moveCardAtom = atomWithWriteOnly(
  (get, set, { card, from, to }: MoveCardParams) => {
    switch (from.place) {
      case "tableau": {
        const tableau = { ...get(tableauAtom) };

        if (to.place === "tableau") {
          const targetColumn = tableau[to.column];

          if (!canMoveToTableau(card, targetColumn)) return;

          const sourceColumn = tableau[from.column];
          const cardIndex = sourceColumn.findIndex((c) => c.id === card.id);
          const cardsToMove = sourceColumn.splice(cardIndex);

          for (const c of cardsToMove) {
            c.place = to.place;
            c.column = to.column;
          }

          const lastCard = sourceColumn.at(-1);
          if (lastCard) lastCard.facingUp = true;

          tableau[to.column].push(...cardsToMove);
          set(tableauAtom, tableau);
        } else if (to.place === "foundation") {
          const foundation = { ...get(foundationAtom) };
          const targetColumn = foundation[to.column];

          if (!canMoveToFoundation(card, targetColumn)) return;

          const sourceColumn = tableau[from.column];
          const cardIndex = sourceColumn.findIndex((c) => c.id === card.id);
          const cardsToMove = sourceColumn.splice(cardIndex);

          for (const c of cardsToMove) {
            c.place = to.place;
            c.column = to.column;
          }

          const lastCard = sourceColumn.at(-1);
          if (lastCard) lastCard.facingUp = true;

          foundation[to.column].push(card);
          set(foundationAtom, foundation);
          set(tableauAtom, tableau);
        }

        break;
      }
      case "waste": {
        const waste = [...get(wasteAtom)];
        const cardIndex = waste.findIndex((c) => c.id === card.id);
        const [movedCard] = waste.splice(cardIndex, 1);

        if (to.place === "tableau") {
          const tableau = { ...get(tableauAtom) };
          const targetColumn = tableau[to.column];

          if (!canMoveToTableau(movedCard, targetColumn)) return;

          movedCard.place = to.place;
          movedCard.column = to.column;
          set(wasteAtom, waste);

          tableau[to.column].push(movedCard);
          set(tableauAtom, tableau);
        } else if (to.place === "foundation") {
          const foundation = { ...get(foundationAtom) };
          const targetColumn = foundation[to.column];

          if (!canMoveToFoundation(movedCard, targetColumn)) return;

          movedCard.place = to.place;
          movedCard.column = to.column;
          set(wasteAtom, waste);

          foundation[to.column].push(movedCard);
          set(foundationAtom, foundation);
        }

        break;
      }
      case "foundation": {
        if (to.place === "tableau") {
          const foundation = { ...get(foundationAtom) };
          const [movedCard] = foundation[from.column].splice(-1, 1);
          const tableau = { ...get(tableauAtom) };
          const targetColumn = tableau[to.column];

          if (!canMoveToTableau(movedCard, targetColumn)) return;

          movedCard.place = to.place;
          movedCard.column = to.column;

          set(foundationAtom, foundation);

          tableau[to.column].push(movedCard);
          set(tableauAtom, tableau);
        }

        break;
      }
    }
  },
);

function canMoveToFoundation(sourceCard: Card, targetColumn: Card[]): boolean {
  const lastCard = targetColumn.at(-1);

  if (!lastCard) return sourceCard.number === 1;
  return (
    lastCard.type === sourceCard.type &&
    lastCard.number === sourceCard.number - 1
  );
}

function canMoveToTableau(sourceCard: Card, targetColumn: Card[]): boolean {
  const lastCard = targetColumn.at(-1);

  if (!lastCard) return sourceCard.number === 13;
  return (
    lastCard.black !== sourceCard.black &&
    lastCard.number === sourceCard.number + 1
  );
}

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background-color: green;
  position: relative;
  overflow: hidden;
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

function init(setTableau: (tableau: Record<number, Card[]>) => void): void {
  const cards: Card[] = [];
  const types: Type[] = ["clubs", "diamonds", "hearts", "spades"];

  for (const [index, type] of types.entries()) {
    for (let number = 1; number <= 13; number++) {
      cards.push({
        id: `${type}-${number.toString()}`,
        type,
        black: type === "clubs" || type === "spades",
        number,
        facingUp: false,
        place: "tableau",
        column: -1, // temporary
        backgroundPositionFacingUp: `${(cardWidth * -(number - 1)).toString()}px ${(cardHeight * -index).toString()}px`,
        backgroundPositionFacingDown,
      });
    }
  }

  // shuffle cards - Fisher-Yates Shuffle Algorithm
  for (let index = cards.length - 1; index > 0; index--) {
    const index_ = Math.floor(Math.random() * (index + 1));
    [cards[index], cards[index_]] = [cards[index_], cards[index]];
  }

  // tableau cards
  const tableau: Record<number, Card[]> = {};
  for (let index = 0; index < 7; index++) {
    tableau[index] = cards.splice(0, index + 1);
    tableau[index][index].facingUp = true;

    for (const card of tableau[index]) {
      card.column = index;
      card.place = "tableau";
    }
  }

  // waste cards
  stock.push(...cards);
  for (const card of stock) {
    card.facingUp = true;
    card.place = "waste";
  }

  setTableau(tableau);
}

function Game(): ReactNode {
  const initialized = useRef(false);
  const [tableau, setTableau] = useAtom(tableauAtom);

  useEffect(() => {
    if (initialized.current) return;

    init(setTableau);
    initialized.current = true;
  }, [setTableau]);

  if (Object.keys(tableau).length === 0) return undefined;

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

function CardComponent({
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

const WasteWrapper = styled.div`
  display: flex;
  position: relative;
  width: ${cardWidth}px;
  height: ${cardHeight}px;
`;

function Waste(): ReactNode {
  const waste = useAtomValue(wasteAtom);

  return (
    <WasteWrapper>
      {waste.map((card, index) => (
        <CardComponent
          key={card.id}
          card={card}
          canDrag={index === waste.length - 1}
          style={absolute}
        />
      ))}
    </WasteWrapper>
  );
}

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

function Foundation(): ReactNode {
  const foundation = useAtomValue(foundationAtom);

  return (
    <>
      {Object.entries(foundation).map(([index, cards]) => (
        <Holder
          place="foundation"
          columnIndex={Number(index)}
          key={index}
          canDrop={cards.length === 0}
        >
          {cards.map((card) => (
            <CardComponent key={card.id} card={card} style={absolute} />
          ))}
        </Holder>
      ))}
    </>
  );
}

function Tableau(): ReactNode {
  const tableau = useAtomValue(tableauAtom);

  return (
    <TableauWrapperStyled>
      {Object.entries(tableau).map(([index, cards]) => (
        <BoardColumn key={index} cards={cards} columnIndex={Number(index)} />
      ))}
    </TableauWrapperStyled>
  );
}

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

function Holder({
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

const PileStyled = styled.div`
  display: flex;
  cursor: pointer;
  position: relative;
  width: ${cardWidth}px;
  height: ${cardHeight}px;
`;

const PileHolderStyled = styled.div<{
  $index: number;
  $position: string;
}>`
  width: ${cardWidth}px;
  height: ${cardHeight}px;
  background-image: url(${img.src});
  position: absolute;
  left: 0;
  top: 0;
  user-select: none;
  background-position: ${({ $position }) => $position};
  margin: ${({ $index }) =>
    $index === 0 ? "0 0 0 2px" : $index === 1 ? "2px 0 0 4px" : "3px 0 0 6px"};
`;

function Pile(): ReactNode {
  const [waste, setWaste] = useAtom(wasteAtom);
  const handlePileClick = useCallback(() => {
    if (stock.length === 0) {
      stock.push(...waste);
      setWaste([]);
      return;
    }

    const card = stock.shift();
    if (card) setWaste([...waste, card]);
  }, [waste, setWaste]);

  return (
    <PileStyled onClick={handlePileClick}>
      {stock.length === 0 ? (
        <PileHolderStyled $index={0} $position={backgroundPositionEmpty} />
      ) : (
        <>
          <PileHolderStyled
            $index={0}
            $position={backgroundPositionFacingDown}
          />
          <PileHolderStyled
            $index={1}
            $position={backgroundPositionFacingDown}
          />
          <PileHolderStyled
            $index={2}
            $position={backgroundPositionFacingDown}
          />
        </>
      )}
    </PileStyled>
  );
}

export function Solitaire(): ReactNode {
  const setWaste = useSetAtom(wasteAtom);
  const setFoundation = useSetAtom(foundationAtom);
  const setTableau = useSetAtom(tableauAtom);

  const handleNewGame = (): void => {
    setWaste([]);
    setFoundation({ 0: [], 1: [], 2: [], 3: [] });
    stock.length = 0;
    init(setTableau);
  };

  return (
    <Window window="Solitaire" defaultWidth={1200} defaultHeight={600}>
      <Toolbar noPadding>
        <Button variant="menu" size="sm" onClick={handleNewGame}>
          New Game
        </Button>
        <Button variant="menu" size="sm">
          Help
        </Button>
      </Toolbar>
      <Game />
    </Window>
  );
}
