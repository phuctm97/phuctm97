import type {
  MouseEvent as ReactMouseEvent,
  MouseEventHandler,
  PropsWithChildren,
  ReactNode,
} from "react";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useAtomValue, useSetAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";
import {
  Button,
  Window as React95Window,
  WindowContent,
  WindowHeader,
} from "react95";
import styled from "styled-components";

import { setDragVisible } from "~/lib/set-drag-visible";
import { useNullableState } from "~/lib/use-nullable-state";

import {
  closeWindowAtom,
  isActiveWindowAtomFamily,
  openWindowAtom,
} from "./jotai";

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

const StyledWindow = styled(React95Window)`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  overflow: hidden;
`;

function getMaxSize(element: HTMLElement): Pick<Rect, "width" | "height"> {
  return element.parentElement
    ? {
        width: element.parentElement.clientWidth,
        height: element.parentElement.clientHeight,
      }
    : { width: innerWidth, height: innerHeight };
}

function getDragAnchor(element: HTMLElement, event: ReactMouseEvent): Anchor {
  const rect = element.getBoundingClientRect();
  return {
    left: rect.left - event.clientX,
    top: rect.top - event.clientY,
    width: rect.width,
    height: rect.height,
    isResize: false,
  };
}

function getResizeAnchor(element: HTMLElement, event: MouseEvent): Anchor {
  const rect = element.getBoundingClientRect();
  return {
    left: rect.left,
    top: rect.top,
    width: rect.width - event.clientX,
    height: rect.height - event.clientY,
    isResize: true,
  };
}

function resizeRect(element: HTMLElement, rect: Rect): Rect {
  const maxSize = getMaxSize(element);
  const width = Math.min(rect.width, maxSize.width);
  const height = Math.min(rect.height, maxSize.height);
  return {
    left: Math.min(Math.max(rect.left, 0), maxSize.width - width),
    top: Math.min(Math.max(rect.top, 0), maxSize.height - height),
    width,
    height,
  };
}

export type WindowProps = PropsWithChildren<{
  window: string;
  className?: string;
  defaultWidth?: number;
  defaultHeight?: number;
}>;

export function Window({
  window,
  className,
  defaultWidth,
  defaultHeight,
  children,
}: WindowProps): ReactNode {
  const [element, ref] = useNullableState<HTMLElement>();
  const [rect, setRect] = useState<Rect>();
  useEffect(() => {
    if (!element) {
      setRect(undefined);
      return;
    }
    const { left, top, width, height } = element.getBoundingClientRect();
    setRect(resizeRect(element, { left, top, width, height }));
  }, [element, setRect]);
  const [anchor, setAnchor] = useState<Anchor>();
  useEffect(() => {
    if (!element) {
      setAnchor(undefined);
      return;
    }
    if (!anchor) {
      const handleResize = (): void => {
        setRect((rect) => (rect ? resizeRect(element, rect) : rect));
      };
      handleResize();
      addEventListener("resize", handleResize);
      return () => {
        removeEventListener("resize", handleResize);
      };
    }
    const handleMouseMove = (event: MouseEvent): void => {
      const maxSize = getMaxSize(element);
      setRect(
        anchor.isResize
          ? {
              left: anchor.left,
              top: anchor.top,
              width: Math.min(
                Math.max(anchor.width + event.clientX, 100),
                maxSize.width - anchor.left,
              ),
              height: Math.min(
                Math.max(anchor.height + event.clientY, 100),
                maxSize.height - anchor.top,
              ),
            }
          : {
              left: Math.min(
                Math.max(anchor.left + event.clientX, 0),
                maxSize.width - anchor.width,
              ),
              top: Math.min(
                Math.max(anchor.top + event.clientY, 0),
                maxSize.height - anchor.height,
              ),
              width: anchor.width,
              height: anchor.height,
            },
      );
    };
    const handleMouseUp = (event: MouseEvent): void => {
      setAnchor(undefined);
      handleMouseMove(event);
      setDragVisible(false);
    };
    addEventListener("mousemove", handleMouseMove);
    addEventListener("mouseup", handleMouseUp);
    return () => {
      removeEventListener("mousemove", handleMouseMove);
      removeEventListener("mouseup", handleMouseUp);
    };
  }, [element, anchor, setRect, setAnchor]);
  const openWindow = useSetAtom(openWindowAtom);
  const [resizeElement, resizeRef] = useNullableState<HTMLElement>();
  useEffect(() => {
    if (!element || !resizeElement) return;
    const handleMouseDown = (event: MouseEvent): void => {
      event.stopPropagation();
      openWindow(window);
      setDragVisible(true);
      setAnchor((anchor) => anchor ?? getResizeAnchor(element, event));
    };
    resizeElement.addEventListener("mousedown", handleMouseDown);
    return () => {
      resizeElement.removeEventListener("mousedown", handleMouseDown);
    };
  }, [element, resizeElement, window, openWindow, setAnchor]);
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
      if (!element) return;
      event.stopPropagation();
      openWindow(window);
      setDragVisible(true);
      setAnchor((anchor) => anchor ?? getDragAnchor(element, event));
    },
    [element, window, openWindow, setAnchor],
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
      <WindowContent
        className={className}
        css="flex-grow: 1; flex-shrink: 1; display: flex; flex-direction: column; align-items: stretch; overflow: hidden;"
      >
        {children}
      </WindowContent>
    </StyledWindow>
  );
}
