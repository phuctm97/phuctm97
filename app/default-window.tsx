import type { MouseEventHandler, PropsWithChildren, ReactNode } from "react";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useAtomValue, useSetAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";
import { Button, Window, WindowContent, WindowHeader } from "react95";
import styled from "styled-components";

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
    <Button
      css="flex-shrink: 0;"
      onClick={handleClick}
      onMouseDown={handleMouseDown}
    >
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

interface Anchor extends Rect {
  isResize: boolean;
}

const StyledWindow = styled(Window)`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  overflow: hidden;
`;

function resizeRect(rect: Rect, main: HTMLElement): Rect {
  const width = Math.min(rect.width, main.clientWidth);
  const height = Math.min(rect.height, main.clientHeight);
  const left = Math.min(Math.max(rect.left, 0), main.clientWidth - width);
  const top = Math.min(Math.max(rect.top, 0), main.clientHeight - height);
  return { left, top, width, height };
}

export type DefaultWindowProps = PropsWithChildren<{
  window: string;
  defaultWidth?: number;
  defaultHeight?: number;
}>;

export function DefaultWindow({
  window,
  defaultWidth,
  defaultHeight,
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
  const [resizeElement, resizeRef] = useNullableState<HTMLElement>();
  const openWindow = useSetAtom(openWindowAtom);
  const [anchor, setAnchor] = useState<Anchor>();
  useEffect(() => {
    if (!rect || !resizeElement) return;
    const handleMouseDown = (event: MouseEvent): void => {
      event.stopPropagation();
      openWindow(window);
      document.documentElement.dataset.dragVisible = "";
      setAnchor(
        (anchor) =>
          anchor ?? {
            left: rect.left,
            top: rect.top,
            width: rect.width - event.clientX,
            height: rect.height - event.clientY,
            isResize: true,
          },
      );
    };
    resizeElement.addEventListener("mousedown", handleMouseDown);
    return () => {
      resizeElement.removeEventListener("mousedown", handleMouseDown);
    };
  }, [window, rect, resizeElement, openWindow, setAnchor]);
  const main = useAtomValue(mainAtom);
  useEffect(() => {
    if (!main) {
      delete document.documentElement.dataset.dragVisible;
      return;
    }
    if (!anchor) {
      const handleResize = (): void => {
        setRect((rect) => (rect ? resizeRect(rect, main) : rect));
      };
      handleResize();
      addEventListener("resize", handleResize);
      return () => {
        removeEventListener("resize", handleResize);
      };
    }
    const handleMouseMove = (event: MouseEvent): void => {
      setRect(
        anchor.isResize
          ? {
              left: anchor.left,
              top: anchor.top,
              width: Math.min(
                Math.max(anchor.width + event.clientX, 100),
                main.clientWidth - anchor.left,
              ),
              height: Math.min(
                Math.max(anchor.height + event.clientY, 100),
                main.clientHeight - anchor.top,
              ),
            }
          : {
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
            },
      );
    };
    const handleMouseUp = (event: MouseEvent): void => {
      setAnchor(undefined);
      delete document.documentElement.dataset.dragVisible;
      handleMouseMove(event);
    };
    addEventListener("mousemove", handleMouseMove);
    addEventListener("mouseup", handleMouseUp);
    return () => {
      removeEventListener("mousemove", handleMouseMove);
      removeEventListener("mouseup", handleMouseUp);
    };
  }, [main, anchor, setRect, setAnchor]);
  const handleMouseDown = useCallback<MouseEventHandler<HTMLElement>>(
    (event) => {
      event.stopPropagation();
      openWindow(window);
    },
    [window, openWindow],
  );
  const handleWindowHeaderMouseDown = useCallback<
    MouseEventHandler<HTMLDivElement>
  >(
    (event) => {
      if (!rect) return;
      event.stopPropagation();
      openWindow(window);
      document.documentElement.dataset.dragVisible = "";
      setAnchor(
        (anchor) =>
          anchor ?? {
            left: rect.left - event.clientX,
            top: rect.top - event.clientY,
            width: rect.width,
            height: rect.height,
            isResize: false,
          },
      );
    },
    [window, rect, openWindow, setAnchor],
  );
  const isActive = useAtomValue(isActiveWindowAtomFamily(window));
  return (
    <StyledWindow
      ref={ref}
      resizeRef={resizeRef}
      style={{
        zIndex: isActive ? 1 : 0,
        ...(rect ?? {
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: defaultWidth ? "100%" : "auto",
          maxWidth: defaultWidth ?? "100%",
          height: defaultHeight ? "100%" : "auto",
          maxHeight: defaultHeight ?? "100%",
        }),
      }}
      resizable
      onMouseDown={handleMouseDown}
    >
      <WindowHeader
        active={isActive}
        css="flex-shrink: 0; display: flex; align-items: center; justify-content: space-between; user-select: none; cursor: default;"
        onMouseDown={handleWindowHeaderMouseDown}
      >
        <span css="white-space: nowrap; text-overflow: ellipsis; overflow: hidden; margin-right: 4px;">
          {window}
        </span>
        <CloseButton window={window} />
      </WindowHeader>
      <WindowContent css="flex-grow: 1; flex-shrink: 1; display: flex; flex-direction: column; align-items: stretch; overflow: hidden;">
        {children}
      </WindowContent>
    </StyledWindow>
  );
}
