import type { ReactNode } from "react";

import { User4 } from "@react95/icons";
import { useAtomValue, useSetAtom } from "jotai";
import { useCallback } from "react";
import { Button } from "react95";
import styled from "styled-components";

import { exceptionAtom } from "~/lib/exception-atom";
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

function ResetButton(): ReactNode {
  const { reset } = useAtomValue(exceptionAtom);
  const closeWindow = useSetAtom(closeWindowAtom);
  const handleClick = useCallback(() => {
    if (reset) reset();
    else closeWindow("5xx");
  }, [reset, closeWindow]);
  return (
    <StyledButton onClick={handleClick}>
      {reset ? "Try again" : "OK"}
    </StyledButton>
  );
}

export function Exception(): ReactNode {
  return (
    <StyledWindow window="5xx" defaultWidth={250} defaultHeight={180}>
      <Message>
        <Icon variant="32x32_4" />
        <p>Sorry, an error occurred.</p>
      </Message>
      <ResetButton />
    </StyledWindow>
  );
}
