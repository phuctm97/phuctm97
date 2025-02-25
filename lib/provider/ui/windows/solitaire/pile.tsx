import type { ReactNode } from "react";

import { useAtom } from "jotai";
import { useCallback } from "react";
import styled from "styled-components";

import {
  backgroundPositionEmpty,
  backgroundPositionFacingDown,
  cardHeight,
  cardWidth,
} from "~/lib/solitaire-constant";
import { stock } from "~/lib/solitaire-global";
import img from "~/lib/solitaire-spritesheet.png";
import { wasteAtom } from "~/lib/solitaire-waste-atom";

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

export function Pile(): ReactNode {
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
