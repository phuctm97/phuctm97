import type {
  ChatCompletionUserMessageParam,
  MLCEngine,
} from "@mlc-ai/web-llm";
import type { ChangeEventHandler, MouseEventHandler, ReactNode } from "react";

import { User4 } from "@react95/icons";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { loadable } from "jotai/utils";
import { useCallback, useRef } from "react";
import { Button, Hourglass, ProgressBar, TextInput } from "react95";
import styled from "styled-components";

import { atomWithWriteOnly } from "~/lib/atom-with-write-only";
import { readonly } from "~/lib/readonly";
import { Window } from "~/lib/window";

import { Messages } from "./messages";
import { messagesAtom } from "./messages-atom";
import { promptMessages } from "./prompt-messages";

const StyledWindow = styled(Window)`
  padding: 6px;
`;

const StyledTextInput = styled(TextInput)`
  flex-grow: 1;
  flex-shrink: 1;
`;

const Container = styled.div`
  flex-grow: 1;
  flex-shrink: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
  overflow: hidden;
`;

const Inputs = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: stretch;
`;

const Buttons = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  padding-bottom: 32px;
  margin-left: 8px;
  & > :not(:last-child) {
    margin-bottom: 8px;
  }
`;

interface Progress {
  value: number;
  text: string;
}

const progressAtom = atom<Progress | undefined>(undefined);

const engineRefreshableAtom = atom(0);

const engineWritableAtom = atom<Promise<MLCEngine>, [Progress], undefined>(
  (get, { setSelf }) => {
    get(engineRefreshableAtom);
    return import("@mlc-ai/web-llm").then(({ CreateMLCEngine }) =>
      CreateMLCEngine("Hermes-2-Pro-Mistral-7B-q4f16_1-MLC", {
        initProgressCallback: ({ progress, text }) => {
          if (progress > 0)
            setSelf({ value: Math.floor(progress * 100), text });
        },
      }),
    );
  },
  (get, set, progress) => {
    set(progressAtom, progress);
  },
);

const engineAtom = readonly(engineWritableAtom);

const isGeneratingAtom = atom(false);

const contentAtom = atom("");

const sendAtom = atomWithWriteOnly(async (get, set) => {
  if (get(isGeneratingAtom)) return;
  const content = get(contentAtom);
  if (!content) return;
  const messages = get(messagesAtom);
  set(isGeneratingAtom, true);
  set(contentAtom, "");
  const userMessage: ChatCompletionUserMessageParam = { role: "user", content };
  set(messagesAtom, [...messages, userMessage]);
  try {
    const engine = await get(engineAtom);
    const chunks = await engine.chat.completions.create({
      messages: [...promptMessages, ...messages, userMessage],
      stream: true,
    });
    let assistantContent = "";
    for await (const chunk of chunks) {
      for (const choice of chunk.choices) {
        if (choice.delta.role !== "assistant" || !choice.delta.content)
          continue;
        assistantContent += choice.delta.content;
        set(messagesAtom, [
          ...messages,
          userMessage,
          { role: "assistant", content: assistantContent },
        ]);
      }
    }
    assistantContent = await engine.getMessage();
    set(messagesAtom, [
      ...messages,
      userMessage,
      { role: "assistant", content: assistantContent },
    ]);
    set(isGeneratingAtom, false);
  } catch (error) {
    set(messagesAtom, messages);
    set(contentAtom, content);
    set(isGeneratingAtom, false);
    throw error;
  }
});

function Input(): ReactNode {
  const isGenerating = useAtomValue(isGeneratingAtom);
  const ref = useRef<HTMLTextAreaElement>(null);
  const [content, setContent] = useAtom(contentAtom);
  const handleChange = useCallback<ChangeEventHandler<HTMLTextAreaElement>>(
    (event) => {
      setContent(event.target.value);
    },
    [setContent],
  );
  const handleReset = useCallback(() => {
    setContent("");
    ref.current?.focus();
  }, [setContent, ref]);
  const send = useSetAtom(sendAtom);
  const handleSend = useCallback<
    MouseEventHandler<HTMLButtonElement>
  >(async () => {
    await send();
  }, [send]);
  return (
    <Inputs>
      <StyledTextInput
        ref={ref}
        value={content}
        onChange={handleChange}
        placeholder="Message ChatGPT…"
        spellCheck={false}
        multiline
      />
      <Buttons>
        <Button primary disabled={isGenerating} onClick={handleSend}>
          Send
        </Button>
        <Button onClick={handleReset} disabled={!content}>
          Reset
        </Button>
      </Buttons>
    </Inputs>
  );
}

const ProgressContainer = styled.div`
  flex-grow: 1;
  flex-shrink: 1;
  padding: 10px;
  overflow: hidden;
`;

const ProgressView = styled(ProgressBar)`
  margin-top: 12px;
  margin-bottom: 14px;
`;

const NoProgressView = styled(Hourglass)`
  margin-top: 12px;
`;

function Loading(): ReactNode {
  const progress = useAtomValue(progressAtom);
  return progress ? (
    <ProgressContainer>
      <p>Downloading a new model…</p>
      <ProgressView value={progress.value} hideValue />
      <p>{progress.text}</p>
    </ProgressContainer>
  ) : (
    <Container>
      <p>Starting…</p>
      <NoProgressView />
    </Container>
  );
}

const loadableAtom = loadable(engineAtom);

const tryAgainAtom = atomWithWriteOnly((get, set) => {
  set(engineRefreshableAtom, (refreshable) => refreshable + 1);
});

function Loadable(): ReactNode {
  const loadable = useAtomValue(loadableAtom);
  const tryAgain = useSetAtom(tryAgainAtom);
  switch (loadable.state) {
    case "loading": {
      return <Loading />;
    }
    case "hasError": {
      return (
        <Container>
          <div css="display: flex; margin-bottom: 16px;">
            <User4
              variant="32x32_4"
              css="flex-shrink: 0; margin-top: -6px; margin-right: 12px;"
            />
            <p>
              {loadable.error
                ? loadable.error instanceof Error
                  ? loadable.error.message
                  : String(loadable.error)
                : "Sorry, an error occurred"}
            </p>
          </div>
          <Button onClick={tryAgain}>Try again</Button>
        </Container>
      );
    }
    case "hasData": {
      return (
        <>
          <Messages />
          <Input />
        </>
      );
    }
  }
}

export function ChatGPT(): ReactNode {
  return (
    <StyledWindow window="ChatGPT" defaultWidth={750} defaultHeight={484}>
      <Loadable />
    </StyledWindow>
  );
}
