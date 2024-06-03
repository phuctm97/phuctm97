import type { PropsWithChildren, ReactNode } from "react";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useSetAtom } from "jotai";
import { useCallback } from "react";
import { Button, Window, WindowContent, WindowHeader } from "react95";
import { styled } from "styled-components";

import { closeWindowAtom } from "./window";

const CloseIcon = styled.span`
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-left: -1px;
  margin-top: -1px;
  transform: rotateZ(45deg);
  position: relative;
  &:before,
  &:after {
    content: "";
    position: absolute;
    background: ${({ theme }) => theme.materialText};
  }
  &:before {
    width: 3px;
    height: 100%;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
  }
  &:after {
    width: 100%;
    height: 3px;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
  }
`;

interface CloseButtonProps {
  window: string;
}

function CloseButton({ window }: CloseButtonProps): ReactNode {
  const closeWindow = useSetAtom(closeWindowAtom);
  const handleClick = useCallback(() => {
    closeWindow(window);
  }, [window, closeWindow]);
  return (
    <Button onClick={handleClick}>
      <CloseIcon />
      <VisuallyHidden>Close</VisuallyHidden>
    </Button>
  );
}

export type DefaultWindowProps = PropsWithChildren<{
  window: string;
}>;

export function DefaultWindow({
  window,
  children,
}: DefaultWindowProps): ReactNode {
  return (
    <Window css="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); max-width: 900px; max-height: 600px;">
      <WindowHeader css="display: flex; flex-direction: row; align-items: center; justify-content: space-between;">
        <span css="margin-right: 4px;">{window}</span>
        <CloseButton window={window} />
      </WindowHeader>
      <WindowContent>{children}</WindowContent>
    </Window>
  );
}
