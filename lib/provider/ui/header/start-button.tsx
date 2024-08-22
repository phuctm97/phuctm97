import type { ReactNode } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Logo } from "@react95/icons";
import { useSetAtom } from "jotai";
import { useCallback, useState } from "react";
import { Button, MenuList, MenuListItem } from "react95";
import styled from "styled-components";

import { openWindowAtom } from "~/lib/window";

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
  return (
    <DropdownMenuItem onSelect={handleSelect} asChild>
      <StyledMenuListItem>{window}</StyledMenuListItem>
    </DropdownMenuItem>
  );
}

export function StartButton(): ReactNode {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          active={isOpen}
          css="flex-shrink: 0; font-weight: bold; margin-right: 4px;"
        >
          <Logo variant="32x32_4" css="margin-right: 4px;" />
          Start
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent side="top" asChild>
          <MenuList css="width: 200px;">
            {["Welcome", "ChatGPT", "Notepad", "P Community"].map((window) => (
              <ConnectedMenuListItem key={window} window={window} />
            ))}
          </MenuList>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
}
