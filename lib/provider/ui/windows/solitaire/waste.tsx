import type { ReactNode } from "react";

import { useAtomValue } from "jotai";
import styled from "styled-components";

import { absolute, cardHeight, cardWidth } from "~/lib/solitaire-constant";
import { wasteAtom } from "~/lib/solitaire-waste-atom";

import { Card } from "./card";

const WasteWrapper = styled.div`
  display: flex;
  position: relative;
  width: ${cardWidth}px;
  height: ${cardHeight}px;
`;

export function Waste(): ReactNode {
  const waste = useAtomValue(wasteAtom);

  return (
    <WasteWrapper>
      {waste.map((card, index) => (
        <Card
          key={card.id}
          card={card}
          canDrag={index === waste.length - 1}
          style={absolute}
        />
      ))}
    </WasteWrapper>
  );
}
