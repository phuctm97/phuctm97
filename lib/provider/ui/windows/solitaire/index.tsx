import type { ReactNode } from "react";
import type { CSSProperties } from "styled-components";

import { Winmine1 } from "@react95/icons";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { HTML5toTouch } from "rdndmb-html5-to-touch";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { MultiBackend, usePreview } from "react-dnd-multi-backend";
import {
  Button,
  Toolbar,
  Window as React95Window,
  WindowContent,
  WindowHeader,
} from "react95";
import styled from "styled-components";

import { atomWithWriteOnly } from "~/lib/atom-with-write-only";
import { Window } from "~/lib/window";

import img from "./spritesheet.png";

const spriteWidth = 923;
const spriteHeight = 576;
const originalCardWidth = 71;
const originalCardHeight = 96;

let currentCardDimensions = {
  cardWidth: originalCardWidth,
  cardHeight: originalCardHeight,
};

const cardDimensionsAtom = atom({
  cardWidth: originalCardWidth,
  cardHeight: originalCardHeight,
  scale: 1,
});

// Atom to update card dimensions based on screen size
const updateCardDimensionsAtom = atom(
  (get) => get(cardDimensionsAtom),
  (get, set) => {
    let scale = 1;

    // For small mobile devices
    if (
      typeof matchMedia !== "undefined" &&
      matchMedia("(max-width: 480px)").matches
    )
      scale = 0.5;
    // For mobile devices
    else if (
      typeof matchMedia !== "undefined" &&
      matchMedia("(max-width: 768px)").matches
    )
      scale = 0.7;
    // For tablets
    else if (
      typeof matchMedia !== "undefined" &&
      matchMedia("(max-width: 1024px)").matches
    )
      scale = 0.85;

    const cardWidth = originalCardWidth * scale;
    const cardHeight = originalCardHeight * scale;

    set(cardDimensionsAtom, {
      cardWidth,
      cardHeight,
      scale,
    });

    currentCardDimensions = { cardWidth, cardHeight };
  },
);

const facingDownRandom = Math.floor(Math.random() * 12) + 1;
const getBackgroundPositionFacingDown = (
  cardWidth: number,
  cardHeight: number,
): string => {
  const position = `${(cardWidth * -facingDownRandom).toString()}px ${(cardHeight * -4).toString()}px`;
  return position;
};

const getBackgroundPositionEmpty = (
  cardWidth: number,
  cardHeight: number,
): string =>
  `${(cardWidth * -1).toString()}px ${(cardHeight * -5).toString()}px`;

const getPileMargin = (index: number, scale: number): string => {
  if (scale <= 0.7) return "0";
  return index === 0
    ? "0 0 0 2px"
    : index === 1
      ? "2px 0 0 4px"
      : "3px 0 0 6px";
};

const stock: Card[] = [];

const foundationPositions: Record<string, { left: number; top: number }> = {};

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
const autoMoveAtom = atom<boolean>(false);
const playTimeAtom = atom<number>(0);
const openWinWindowAtom = atom<boolean>(false);

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

// Add this new helper function for animations
async function animateCardToFoundation(
  card: Card,
  sourceColumn: Card[],
  toColumn: number,
  zindex: number,
): Promise<void> {
  return new Promise<void>((resolve) => {
    const sourceElement = document.querySelector(`#${card.id}`);
    if (sourceElement) {
      // add z-index style to sourceElement
      (sourceElement as HTMLElement).style.zIndex = zindex.toString();
      (sourceElement as HTMLElement).style.position = "relative";

      const sourceRect = {
        left: sourceElement.getBoundingClientRect().left,
        top: sourceElement.getBoundingClientRect().top,
      };

      // Calculate stack offset based on current card height
      const stackOffset = currentCardDimensions.cardHeight * 0.15; // 15% of card height

      if (sourceColumn.length > 1)
        sourceRect.top += (sourceColumn.length - 1) * stackOffset;

      const targetPosition = {
        left: foundationPositions[`foundation-${toColumn.toString()}`].left,
        top: foundationPositions[`foundation-${toColumn.toString()}`].top,
      };

      const animation = sourceElement.animate(
        [
          { transform: "translate(0, 0)" },
          {
            transform: `translate(${String(
              targetPosition.left - sourceRect.left,
            )}px, ${String(targetPosition.top - sourceRect.top)}px)`,
          },
        ],
        {
          duration: 200,
          easing: "ease-in-out",
          fill: "forwards",
        },
      );

      animation.onfinish = () => {
        resolve();
      };
    } else {
      resolve();
    }
  });
}

// Update the moveCardAtom to use the new animation function
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

const initAtom = atomWithWriteOnly((get, set) => {
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
        backgroundPositionFacingUp: `${(originalCardWidth * -(number - 1)).toString()}px ${(originalCardHeight * -index).toString()}px`,
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

  set(autoMoveAtom, false);
  set(tableauAtom, tableau);
  set(playTimeAtom, 0);
});

const absolute: CSSProperties = {
  position: "absolute",
  left: 0,
  top: 0,
};

function Game(): ReactNode {
  const initialized = useRef(false);
  const tableau = useAtomValue(tableauAtom);
  const foundation = useAtomValue(foundationAtom);
  const initGame = useSetAtom(initAtom);
  const dimensions = useAtomValue(cardDimensionsAtom);
  const updateCardDimensions = useSetAtom(updateCardDimensionsAtom);

  useEffect(() => {
    updateCardDimensions();
  }, [updateCardDimensions]);

  useEffect(() => {
    if (initialized.current) return;

    initGame();
    initialized.current = true;
  }, [foundation, initGame, tableau]);

  if (Object.keys(tableau).length === 0) return undefined;

  return (
    <DndProvider backend={MultiBackend} options={HTML5toTouch}>
      <Wrapper>
        <Upper>
          <Pile />
          <Waste />
          {/* empty space */}
          <div
            style={{
              width: dimensions.cardWidth,
              height: dimensions.cardHeight,
            }}
          />
          <Foundation />
        </Upper>
        <Tableau />
        <PlayTime />
      </Wrapper>
      <CardPreview />
    </DndProvider>
  );
}

const PlayTime = (): ReactNode => {
  const playTime = useAtomValue(playTimeAtom);
  return (
    <span style={{ position: "absolute", bottom: 5, left: 10 }}>
      Elapsed Time: {Math.floor(playTime / 60)} min {playTime % 60} sec
    </span>
  );
};

const CardPreview = (): ReactNode => {
  const preview = usePreview<DragItem>();
  if (!preview.display) return null;

  const { item, style } = preview;
  return <CardStyled card={item.droppedCard} style={style} />;
};

const CardStyled = styled.div<{
  card: Card;
}>`
  display: flex;
  cursor: pointer;
  width: ${() => useAtomValue(cardDimensionsAtom).cardWidth}px;
  height: ${() => useAtomValue(cardDimensionsAtom).cardHeight}px;
  background-image: url(${img.src});
  background-size: ${() => {
    const { scale } = useAtomValue(cardDimensionsAtom);
    return scale === 1
      ? ""
      : `${String(spriteWidth * scale)}px ${String(spriteHeight * scale)}px`;
  }};
  background-position: ${({ card }) => {
    const { cardWidth, cardHeight, scale } = useAtomValue(cardDimensionsAtom);
    if (card.facingUp) {
      const [x, y] = card.backgroundPositionFacingUp?.split(" ") ?? [];
      const xValue = Number.parseInt(x) * scale;
      const yValue = Number.parseInt(y) * scale;
      return `${String(xValue)}px ${String(yValue)}px`;
    } else {
      return getBackgroundPositionFacingDown(cardWidth, cardHeight);
    }
  }};
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
      <div id={card.id}>
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
  width: ${() => useAtomValue(cardDimensionsAtom).cardWidth}px;
  height: ${() => useAtomValue(cardDimensionsAtom).cardHeight}px;
`;

function Waste(): ReactNode {
  const waste = useAtomValue(wasteAtom);
  const tableau = useAtomValue(tableauAtom);
  const setAutoMove = useSetAtom(autoMoveAtom);
  const [isDisabled, setIsDisabled] = useState(false);

  // check can solved the game by the cards in waste, stock, and tableau are facing up
  const isCanSolved = useMemo(
    () =>
      waste.length === 0 &&
      stock.length === 0 &&
      Object.values(tableau).every((cards) =>
        cards.every((card) => card.facingUp),
      ),
    [waste, tableau],
  );

  return (
    <WasteWrapper>
      {isCanSolved && (
        <Button
          variant="menu"
          size="sm"
          style={{
            height: "50px",
            position: "absolute",
            transform: "translate(-50%, 50%)",
            boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
            zIndex: 1000,
          }}
          onClick={() => {
            setAutoMove(true);
            setIsDisabled(true);
          }}
          disabled={isDisabled}
          title="Auto-solve the game if possible"
        >
          Solve game
        </Button>
      )}
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
  width: ${() => useAtomValue(cardDimensionsAtom).cardWidth}px;
`;

function BoardColumn({
  cards,
  columnIndex,
}: {
  cards: Card[];
  columnIndex: number;
}): ReactNode {
  const autoMove = useAtomValue(autoMoveAtom);
  const { cardHeight } = useAtomValue(cardDimensionsAtom);
  const stackOffset = cardHeight * 0.15;

  let nestedComponents: ReactNode | undefined = undefined;

  for (let index = cards.length - 1; index >= 0; index--) {
    nestedComponents = (
      <CardComponent
        key={cards[index].id}
        card={cards[index]}
        style={{
          position: "absolute",
          left: 0,
          top: index === 0 ? 0 : `${String(stackOffset)}px`, // vertical offset for stacking cards
        }}
        canDrag={cards[index].facingUp}
        canDrop={cards.length - 1 === index}
      >
        {nestedComponents}
      </CardComponent>
    );
  }

  if (autoMove) {
    return (
      <Holder
        place="tableau"
        columnIndex={columnIndex}
        canDrop={cards.length === 0}
      >
        {cards.map((card, index) => (
          <CardComponent
            key={card.id}
            card={card}
            style={{
              position: "absolute",
              left: 0,
              top: `${String(index * stackOffset)}px`, // vertical offset for stacking cards
            }}
            canDrag={false}
            canDrop={false}
          />
        ))}
      </Holder>
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

  useEffect(() => {
    const found0 = document.querySelector("#foundation-0");
    if (found0) {
      foundationPositions["foundation-0"] = {
        left: found0.getBoundingClientRect().left,
        top: found0.getBoundingClientRect().top,
      };
    }
    const found1 = document.querySelector("#foundation-1");
    if (found1) {
      foundationPositions["foundation-1"] = {
        left: found1.getBoundingClientRect().left,
        top: found1.getBoundingClientRect().top,
      };
    }
    const found2 = document.querySelector("#foundation-2");
    if (found2) {
      foundationPositions["foundation-2"] = {
        left: found2.getBoundingClientRect().left,
        top: found2.getBoundingClientRect().top,
      };
    }
    const found3 = document.querySelector("#foundation-3");
    if (found3) {
      foundationPositions["foundation-3"] = {
        left: found3.getBoundingClientRect().left,
        top: found3.getBoundingClientRect().top,
      };
    }
  }, []);

  return (
    <>
      {Object.entries(foundation).map(([index, cards]) => (
        <Holder
          place="foundation"
          columnIndex={Number(index)}
          key={index}
          id={`foundation-${index}`}
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
  const autoMove = useAtomValue(autoMoveAtom);
  const autoMoveToFoundation = useSetAtom(autoMoveToFoundationAtom);

  useEffect(() => {
    const autoMoveHandler = async (): Promise<void> => {
      await autoMoveToFoundation();
    };

    if (autoMove) void autoMoveHandler();
  }, [autoMove, autoMoveToFoundation]);

  return (
    <TableauWrapperStyled>
      {Object.entries(tableau).map(([index, cards]) => (
        <BoardColumn key={index} cards={cards} columnIndex={Number(index)} />
      ))}
    </TableauWrapperStyled>
  );
}

const HolderStyled = styled.div`
  width: ${() => useAtomValue(cardDimensionsAtom).cardWidth}px;
  height: ${() => useAtomValue(cardDimensionsAtom).cardHeight}px;
  background-image: url(${img.src});
  background-position: ${() => {
    const { cardWidth, cardHeight } = useAtomValue(cardDimensionsAtom);
    return `${(cardWidth * -0).toString()}px ${(cardHeight * -4).toString()}px`;
  }};
  background-size: ${() => {
    const { scale } = useAtomValue(cardDimensionsAtom);
    return scale === 1
      ? ""
      : `${String(spriteWidth * scale)}px ${String(spriteHeight * scale)}px`;
  }};
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
  id,
}: {
  children: ReactNode;
  place: Place;
  columnIndex: number;
  canDrop?: boolean;
  id?: string;
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
    <div id={id}>
      <HolderStyled>{children}</HolderStyled>
    </div>,
  );
}

const PileStyled = styled.div`
  display: flex;
  cursor: pointer;
  position: relative;
  width: ${() => useAtomValue(cardDimensionsAtom).cardWidth}px;
  height: ${() => useAtomValue(cardDimensionsAtom).cardHeight}px;
`;

const PileHolderStyled = styled.div<{
  $position: string;
  $margin: string;
}>`
  width: ${() => useAtomValue(cardDimensionsAtom).cardWidth}px;
  height: ${() => useAtomValue(cardDimensionsAtom).cardHeight}px;
  background-image: url(${img.src});
  background-size: ${() => {
    const { scale } = useAtomValue(cardDimensionsAtom);
    return scale === 1
      ? ""
      : `${String(spriteWidth * scale)}px ${String(spriteHeight * scale)}px`;
  }};
  position: absolute;
  left: 0;
  top: 0;
  user-select: none;
  background-position: ${({ $position }) => $position};
  margin: ${({ $margin }) => $margin};
`;

function Pile(): ReactNode {
  const [waste, setWaste] = useAtom(wasteAtom);
  const { cardWidth, cardHeight, scale } = useAtomValue(cardDimensionsAtom);
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
        <PileHolderStyled
          $position={getBackgroundPositionEmpty(cardWidth, cardHeight)}
          $margin="0"
        />
      ) : (
        <>
          <PileHolderStyled
            $position={getBackgroundPositionFacingDown(cardWidth, cardHeight)}
            $margin={getPileMargin(0, scale)}
          />
          <PileHolderStyled
            $position={getBackgroundPositionFacingDown(cardWidth, cardHeight)}
            $margin={getPileMargin(1, scale)}
          />
          <PileHolderStyled
            $position={getBackgroundPositionFacingDown(cardWidth, cardHeight)}
            $margin={getPileMargin(2, scale)}
          />
        </>
      )}
    </PileStyled>
  );
}

// Add this helper function to find valid moves
function findValidFoundationMove(
  tableau: Record<number, Card[]>,
  foundation: Record<number, Card[]>,
): { card: Card; from: number; to: number } | null {
  // Check each tableau column
  for (const [fromColumn, cards] of Object.entries(tableau)) {
    if (cards.length === 0) continue;

    const last = cards.at(-1);
    if (!last) continue;

    for (const [toColumn, foundationCards] of Object.entries(foundation)) {
      if (canMoveToFoundation(last, foundationCards)) {
        return {
          card: last,
          from: Number(fromColumn),
          to: Number(toColumn),
        };
      }
    }
  }
  return null;
}

const autoMoveToFoundationAtom = atomWithWriteOnly(async (get, set) => {
  const tableau = get(tableauAtom);
  const foundation = get(foundationAtom);
  let length = Object.values(tableau).flat().length;
  let zindex = 1;
  while (length > 0) {
    const move = findValidFoundationMove(tableau, foundation);
    if (move) {
      await animateCardToFoundation(
        move.card,
        tableau[move.from],
        move.to,
        zindex++,
      );

      const cardIndex = tableau[move.from].findIndex(
        (c) => c.id === move.card.id,
      );
      const [movedCard] = tableau[move.from].splice(cardIndex, 1);

      foundation[move.to].push(movedCard);
      length--;
    } else {
      break;
    }
  }

  // handle for win the game by open win window
  if (length === 0) set(openWinWindowAtom, true);
});

const WinWindow = styled(React95Window)`
  width: 300px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
`;

function Win(): ReactNode {
  const setOpenWinWindow = useSetAtom(openWinWindowAtom);
  const playTime = useAtomValue(playTimeAtom);
  return (
    <WinWindow>
      <WindowHeader>
        Congratulations!
        <Button
          style={{ position: "absolute", right: "8px", top: "7px" }}
          size="sm"
          onClick={() => {
            setOpenWinWindow(false);
          }}
        >
          X
        </Button>
      </WindowHeader>
      <WindowContent>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "10px",
            gap: "10px",
          }}
        >
          <Winmine1 variant="32x32_4" />
          <div>You won the game!</div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: "10px",
            gap: "10px",
          }}
        >
          <div>
            Consumed time in {Math.floor(playTime / 60)} min {playTime % 60} sec
          </div>
        </div>
      </WindowContent>
    </WinWindow>
  );
}

export function Solitaire(): ReactNode {
  const setWaste = useSetAtom(wasteAtom);
  const setFoundation = useSetAtom(foundationAtom);
  const initGame = useSetAtom(initAtom);
  const setPlayTime = useSetAtom(playTimeAtom);
  const openWinWindow = useAtomValue(openWinWindowAtom);
  const updateCardDimensions = useSetAtom(updateCardDimensionsAtom);

  useEffect(() => {
    updateCardDimensions();
  }, [updateCardDimensions]);

  const handleNewGame = (): void => {
    setWaste([]);
    setFoundation({ 0: [], 1: [], 2: [], 3: [] });
    stock.length = 0;
    initGame();
  };

  useEffect(() => {
    if (openWinWindow) return;

    const interval = setInterval(() => {
      setPlayTime((previousTime) => previousTime + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [openWinWindow, setPlayTime]);

  return (
    <Window window="Solitaire" defaultWidth={1200} defaultHeight={600}>
      <Toolbar noPadding>
        <Button variant="menu" size="sm" onClick={handleNewGame}>
          New Game
        </Button>
      </Toolbar>
      {openWinWindow && <Win />}
      <Game />
    </Window>
  );
}
