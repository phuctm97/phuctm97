import type { ChangeEventHandler, ReactNode } from "react";

import { useCallback, useState } from "react";
import { Button, TextInput } from "react95";
import styled from "styled-components";

import { DefaultWindow } from "./default-window";

const StyledWindow = styled(DefaultWindow)`
  padding: 6px;
`;

const StyledTextInput = styled(TextInput)`
  flex-grow: 1;
  flex-shrink: 1;
`;

const Content = styled.div`
  flex-grow: 1;
  flex-shrink: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Control = styled.div`
  display: flex;
  align-items: stretch;
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 32px;
  margin-left: 8px;
  & > :not(:last-child) {
    margin-bottom: 8px;
  }
`;

export function ChatGPTWindow(): ReactNode {
  const [value, setValue] = useState("");
  const handleChange = useCallback<ChangeEventHandler<HTMLTextAreaElement>>(
    (event) => {
      setValue(event.target.value);
    },
    [setValue],
  );
  const handleReset = useCallback(() => {
    setValue("");
  }, [setValue]);
  return (
    <StyledWindow window="ChatGPT" defaultWidth={740} defaultHeight={460}>
      <Content>Work in progress…</Content>
      <Control>
        <StyledTextInput
          value={value}
          onChange={handleChange}
          placeholder="Message ChatGPT…"
          spellCheck={false}
          multiline
        />
        <Buttons>
          <Button primary disabled>
            Send
          </Button>
          <Button onClick={handleReset}>Reset</Button>
        </Buttons>
      </Control>
    </StyledWindow>
  );
}
