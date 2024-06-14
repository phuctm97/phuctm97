import type { ReactNode } from "react";

import { User4 } from "@react95/icons";
import { useSetAtom } from "jotai";
import { useCallback } from "react";
import { Button } from "react95";
import styled from "styled-components";

import { closeWindowAtom, Window } from "~/lib/window";

const StyledWindow = styled(Window)`
  align-items: center;
  justify-content: center;
`;

const StyledButton = styled(Button)`
  min-width: 80px;
`;

const Message = styled.div`
  display: flex;
  margin-bottom: 16px;
`;

const Icon = styled(User4)`
  flex-shrink: 0;
  margin-top: -6px;
  margin-right: 12px;
`;

function OkButton(): ReactNode {
  const closeWindow = useSetAtom(closeWindowAtom);
  const handleClick = useCallback(() => {
    closeWindow("404");
  }, [closeWindow]);
  return <StyledButton onClick={handleClick}>OK</StyledButton>;
}

export function NotFound(): ReactNode {
  return (
    <StyledWindow window="404" defaultWidth={360} defaultHeight={200}>
      <Message>
        <Icon variant="32x32_4" />
        <p>The page you’re looking for doesn’t exist or has been moved.</p>
      </Message>
      <OkButton />
    </StyledWindow>
  );
}
