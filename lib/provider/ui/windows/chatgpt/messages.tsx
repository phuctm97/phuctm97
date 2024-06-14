import type { PropsWithChildren, ReactNode, UIEventHandler } from "react";

import { useAtomValue } from "jotai";
import { useCallback, useEffect, useRef, useState } from "react";
import { createScrollbars } from "react95";
import styled from "styled-components";

import { isGeneratingAtom } from "./is-generating-atom";
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

const ScrollView = styled.div`
  flex-grow: 1;
  flex-shrink: 1;
  padding-top: 8px;
  padding-bottom: 12px;
  margin-bottom: 8px;
  overflow-x: hidden;
  overflow-y: scroll;
  & > :not(:last-child) {
    margin-bottom: 24px;
  }
  ${createScrollbars()}
`;

function ConnectedScrollView({ children }: PropsWithChildren): ReactNode {
  const ref = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  useEffect(() => {
    if (!isScrolling) return;
    const interval = setInterval(() => {
      if (!ref.current) return;
      ref.current.scrollTo({ top: ref.current.scrollHeight });
    }, 100);
    return () => {
      clearInterval(interval);
    };
  }, [ref, isScrolling]);
  const isGenerating = useAtomValue(isGeneratingAtom);
  useEffect(() => {
    if (isGenerating) {
      setIsScrolling(true);
      return;
    }
    const timeout = setTimeout(() => {
      setIsScrolling(false);
    }, 1000);
    return () => {
      clearTimeout(timeout);
    };
  }, [isGenerating, setIsScrolling]);
  const handleScroll = useCallback<UIEventHandler<HTMLDivElement>>(
    (event) => {
      if (!isGenerating) return;
      setIsScrolling(
        event.currentTarget.scrollHeight -
          event.currentTarget.scrollTop -
          event.currentTarget.clientHeight <
          50,
      );
    },
    [isGenerating, setIsScrolling],
  );
  return (
    <ScrollView ref={ref} onScroll={handleScroll}>
      {children}
    </ScrollView>
  );
}

export function Messages(): ReactNode {
  return (
    <ConnectedScrollView>
      <ConnectedMessages />
    </ConnectedScrollView>
  );
}
