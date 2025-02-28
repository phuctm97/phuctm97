import type { CSSProperties } from "styled-components";

export const cardWidth = 71;
export const cardHeight = 96;
export const backgroundPositionFacingDown = `${(cardWidth * -Math.floor(Math.random() * 12) + 1).toString()}px ${(cardHeight * -4).toString()}px`;
export const backgroundPositionEmpty = `${(cardWidth * -1).toString()}px ${(cardHeight * -5).toString()}px`;
export const absolute: CSSProperties = {
  position: "absolute",
  left: 0,
  top: 0,
};
export const stock: Card[] = [];

export type Type = "clubs" | "diamonds" | "hearts" | "spades";
export type Place = "waste" | "foundation" | "tableau";
export type MoveType =
  | "waste_to_foundation"
  | "waste_to_tableau"
  | "tableau_to_foundation"
  | "tableau_to_tableau";

export interface Card {
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
