import type { ReactNode } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Logo } from "@react95/icons";
import { useState } from "react";
import { Button, MenuList, MenuListItem } from "react95";
import { styled } from "styled-components";

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

export function Start(): ReactNode {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button active={isOpen} css="font-weight: bold;">
          <Logo variant="32x32_4" css="margin-right: 4px;" />
          Start
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent side="top" asChild>
          <MenuList css="width: 200px;">
            {["Welcome", "Notepad", "ChatGPT"].map((key) => (
              <DropdownMenuItem key={key} asChild>
                <StyledMenuListItem>{key}</StyledMenuListItem>
              </DropdownMenuItem>
            ))}
          </MenuList>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
}
