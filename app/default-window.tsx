import type {
  Dispatch,
  MouseEventHandler,
  PropsWithChildren,
  ReactNode,
  SetStateAction,
} from "react";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useAtomValue, useSetAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";
import { Button, Window, WindowContent, WindowHeader } from "react95";
import { styled } from "styled-components";

import { mainAtom } from "./main";
import { useNullableState } from "./use-nullable-state";
import {
  closeWindowAtom,
  isActiveWindowAtomFamily,
  openWindowAtom,
} from "./window";

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
  const handleClick = useCallback<MouseEventHandler<HTMLButtonElement>>(
    (event) => {
      event.stopPropagation();
      closeWindow(window);
    },
    [window, closeWindow],
  );
  const handleMouseDown = useCallback<MouseEventHandler<HTMLButtonElement>>(
    (event) => {
      event.stopPropagation();
    },
    [],
  );
  return (
    <Button onClick={handleClick} onMouseDown={handleMouseDown}>
      <CloseIcon />
      <VisuallyHidden>Close</VisuallyHidden>
    </Button>
  );
}

interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

function fixRect(rect: Rect, mainRect: DOMRect): Rect {
  const width = Math.min(rect.width, mainRect.width);
  const height = Math.min(rect.height, mainRect.height);
  const left = Math.min(Math.max(rect.left, 0), mainRect.width - width);
  const top = Math.min(Math.max(rect.top, 0), mainRect.height - height);
  return rect.width === width &&
    rect.height === height &&
    rect.left === left &&
    rect.top === top
    ? rect
    : { left, top, width, height };
}

interface HeaderProps {
  window: string;
  isActive: boolean;
  rect: Rect | undefined;
  onRectChange: Dispatch<SetStateAction<Rect | undefined>>;
}

function Header({
  window,
  isActive,
  rect,
  onRectChange,
}: HeaderProps): ReactNode {
  const main = useAtomValue(mainAtom);
  const [anchor, setAnchor] = useState<Rect>();
  useEffect(() => {
    if (!main) return;
    if (!anchor) {
      const handleResize = (): void => {
        onRectChange((rect) =>
          rect ? fixRect(rect, main.getBoundingClientRect()) : rect,
        );
      };
      handleResize();
      addEventListener("resize", handleResize);
      return () => {
        removeEventListener("resize", handleResize);
      };
    }
    const setEvent = (event: MouseEvent): void => {
      onRectChange({
        left: Math.min(
          Math.max(anchor.left + event.clientX, 0),
          main.clientWidth - anchor.width,
        ),
        top: Math.min(
          Math.max(anchor.top + event.clientY, 0),
          main.clientHeight - anchor.height,
        ),
        width: anchor.width,
        height: anchor.height,
      });
    };
    const handleMouseMove = (event: MouseEvent): void => {
      setEvent(event);
      document.documentElement.dataset.dragVisible = "";
    };
    const handleMouseUp = (event: MouseEvent): void => {
      setAnchor(undefined);
      setEvent(event);
      delete document.documentElement.dataset.dragVisible;
    };
    addEventListener("mousemove", handleMouseMove);
    addEventListener("mouseup", handleMouseUp);
    return () => {
      removeEventListener("mousemove", handleMouseMove);
      removeEventListener("mouseup", handleMouseUp);
    };
  }, [onRectChange, main, anchor, setAnchor]);
  const openWindow = useSetAtom(openWindowAtom);
  const handleMouseDown = useCallback<MouseEventHandler<HTMLDivElement>>(
    (event) => {
      event.stopPropagation();
      openWindow(window);
      if (!rect) return;
      setAnchor({
        left: rect.left - event.clientX,
        top: rect.top - event.clientY,
        width: rect.width,
        height: rect.height,
      });
    },
    [window, openWindow, rect, setAnchor],
  );
  return (
    <WindowHeader
      active={isActive}
      css="display: flex; align-items: center; justify-content: space-between; user-select: none; cursor: default;"
      onMouseDown={handleMouseDown}
    >
      <span css="margin-right: 4px;">{window}</span>
      <CloseButton window={window} />
    </WindowHeader>
  );
}

interface StyledWindowProps {
  $isActive: boolean;
  $rect: Rect | undefined;
}

const StyledWindow = styled(Window)<StyledWindowProps>`
  position: absolute;
  z-index: ${({ $isActive }) => ($isActive ? "1" : "0")};
  left: ${({ $rect }) => ($rect ? `${$rect.left.toString()}px` : "50%")};
  top: ${({ $rect }) => ($rect ? `${$rect.top.toString()}px` : "50%")};
  transform: ${({ $rect }) => ($rect ? "none" : "translate(-50%, -50%)")};
  width: ${({ $rect }) => ($rect ? `${$rect.width.toString()}px` : "auto")};
  height: ${({ $rect }) => ($rect ? `${$rect.height.toString()}px` : "auto")};
  max-width: 100%;
  max-height: 100%;
`;

export type DefaultWindowProps = PropsWithChildren<{
  window: string;
}>;

export function DefaultWindow({
  window,
  children,
}: DefaultWindowProps): ReactNode {
  const [element, ref] = useNullableState<HTMLElement>();
  const [rect, setRect] = useState<Rect>();
  useEffect(() => {
    if (!element) {
      setRect(undefined);
      return;
    }
    const { left, top, width, height } = element.getBoundingClientRect();
    setRect({ left, top, width, height });
  }, [element, setRect]);
  const isActive = useAtomValue(isActiveWindowAtomFamily(window));
  return (
    <StyledWindow ref={ref} $isActive={isActive} $rect={rect}>
      <Header
        window={window}
        isActive={isActive}
        rect={rect}
        onRectChange={setRect}
      />
      <WindowContent>{children}</WindowContent>
    </StyledWindow>
  );
}
