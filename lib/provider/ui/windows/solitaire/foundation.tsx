import type { ReactNode } from "react";

import { useAtomValue } from "jotai";

import { absolute } from "~/lib/solitaire-constant";

import { Card } from "./card";
import { foundationAtom } from "./foudation-atom";
import { Holder } from "./holder";

export function Foundation(): ReactNode {
  const foundation = useAtomValue(foundationAtom);

  return (
    <>
      {Object.entries(foundation).map(([index, cards]) => (
        <Holder place="foundation" columnIndex={Number(index)} key={index}>
          {cards.map((card) => (
            <Card key={card.id} card={card} style={absolute} />
          ))}
        </Holder>
      ))}
    </>
  );
}
