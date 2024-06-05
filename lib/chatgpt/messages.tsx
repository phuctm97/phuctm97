import type { ChatCompletionMessageParam } from "@mlc-ai/web-llm";
import type { ReactNode } from "react";

import { useAtomValue } from "jotai";
import { createScrollbars, GroupBox } from "react95";
import styled from "styled-components";

import { messagesAtom } from "./messages-atom";

const StyledGroupBox = styled(GroupBox)`
  margin-right: 8px;
`;

interface ItemProps {
  message: ChatCompletionMessageParam;
}

function Item({ message }: ItemProps): ReactNode {
  switch (message.role) {
    case "user": {
      return (
        <StyledGroupBox label="You">
          {typeof message.content === "string" ? message.content : undefined}
        </StyledGroupBox>
      );
    }
    case "assistant": {
      return <StyledGroupBox label="ChatGPT">{message.content}</StyledGroupBox>;
    }
  }
}

function Items(): ReactNode {
  const messages = useAtomValue(messagesAtom);
  return (
    <>
      {messages.map((message, key) => (
        <Item key={key} message={message} />
      ))}
    </>
  );
}

const Container = styled.div`
  flex-grow: 1;
  flex-shrink: 1;
  overflow: auto;
  padding-top: 8px;
  padding-bottom: 12px;
  margin-bottom: 8px;
  overflow-y: scroll;
  & > :not(:last-child) {
    margin-bottom: 24px;
  }
  ${createScrollbars()}
`;

export function Messages(): ReactNode {
  return (
    <Container>
      <Items />
    </Container>
  );
}
