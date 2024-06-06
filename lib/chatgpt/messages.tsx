import type { ReactNode } from "react";

import { useAtomValue } from "jotai";
import { createScrollbars } from "react95";
import styled from "styled-components";

import { Message } from "./message";
import { messagesAtom } from "./messages-atom";

function ConnectedMessages(): ReactNode {
  const messages = useAtomValue(messagesAtom);
  return (
    <>
      {messages.map((message, key) => (
        <Message key={key} message={message} />
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
      <ConnectedMessages />
    </Container>
  );
}
