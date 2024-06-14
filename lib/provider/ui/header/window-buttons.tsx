import type { ReactNode } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { useAtomValue, useSetAtom } from "jotai";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, MenuList, MenuListItem } from "react95";
import styled from "styled-components";

import {
  isActiveWindowAtomFamily,
  openWindowAtom,
  openWindowsAtom,
} from "~/lib/window";

const StyledButton = styled(Button)`
  flex-grow: 1;
  flex-shrink: 1;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: start;
  font-weight: bold;
  margin-right: 4px;
`;

interface WindowButtonProps {
  window: string;
  maxWidth?: number;
}

function WindowButton({ window, maxWidth }: WindowButtonProps): ReactNode {
  const openWindow = useSetAtom(openWindowAtom);
  const handleClick = useCallback(() => {
    openWindow(window);
  }, [window, openWindow]);
  const isActive = useAtomValue(isActiveWindowAtomFamily(window));
  return (
    <StyledButton active={isActive} style={{ maxWidth }} onClick={handleClick}>
      <span css="max-width: 100%; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">
        {window}
      </span>
    </StyledButton>
  );
}

const StyledMenuListItem = styled(MenuListItem)`
  width: 100%;
  &:hover {
    color: ${({ theme }) => theme.materialText};
    background-color: transparent;
  }
  &:focus {
    outline: none;
    color: ${({ theme }) => theme.materialTextInvert};
    background-color: ${({ theme }) => theme.hoverBackground};
  }
`;

interface ConnectedMenuListItemProps {
  window: string;
}

function ConnectedMenuListItem({
  window,
}: ConnectedMenuListItemProps): ReactNode {
  const openWindow = useSetAtom(openWindowAtom);
  const handleSelect = useCallback(() => {
    openWindow(window);
  }, [window, openWindow]);
  const isActive = useAtomValue(isActiveWindowAtomFamily(window));
  return (
    <DropdownMenuItem onSelect={handleSelect} asChild>
      <StyledMenuListItem primary={isActive}>{window}</StyledMenuListItem>
    </DropdownMenuItem>
  );
}

interface MoreButtonProps {
  windows: string[];
}

function MoreButton({ windows }: MoreButtonProps): ReactNode {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button css="flex-shrink: 0; margin-right: 4px;">…</Button>
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent side="top" asChild>
          <MenuList css="width: 200px;">
            {windows.map((window) => (
              <ConnectedMenuListItem key={window} window={window} />
            ))}
          </MenuList>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
}

export function WindowButons(): ReactNode {
  const ref = useRef<HTMLDivElement>(null);
  const windows = useAtomValue(openWindowsAtom);
  const { length } = windows;
  const [split, setSplit] = useState(0);
  const [hasMoreCapacity, setHasMoreCapacity] = useState<boolean>();
  useEffect(() => {
    const handleResize = (): void => {
      if (!ref.current) return;
      const { width } = ref.current.getBoundingClientRect();
      const capacity = Math.max(Math.floor(width / 204), 1);
      if (capacity > length) {
        setSplit(0);
        setHasMoreCapacity(true);
      } else if (capacity === length) {
        setSplit(0);
        setHasMoreCapacity(false);
      } else {
        setSplit(capacity);
        setHasMoreCapacity(undefined);
      }
    };
    handleResize();
    addEventListener("resize", handleResize);
    return () => {
      removeEventListener("resize", handleResize);
    };
  }, [ref, length, setSplit, setHasMoreCapacity]);
  return (
    <div
      ref={ref}
      css="flex-grow: 1; flex-shrink: 1; display: flex; overflow: hidden;"
    >
      {split ? (
        <>
          {windows.slice(0, split).map((window) => (
            <WindowButton key={window} window={window} />
          ))}
          <MoreButton windows={windows.slice(split)} />
        </>
      ) : typeof hasMoreCapacity === "boolean" ? (
        windows.map((window) => (
          <WindowButton
            key={window}
            window={window}
            maxWidth={hasMoreCapacity ? 200 : undefined}
          />
        ))
      ) : undefined}
    </div>
  );
}
