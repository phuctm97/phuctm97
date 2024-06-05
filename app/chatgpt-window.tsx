import type { MLCEngine } from "@mlc-ai/web-llm";
import type { ChangeEventHandler, ReactNode } from "react";

import { User4 } from "@react95/icons";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { loadable } from "jotai/utils";
import { useCallback, useState } from "react";
import { Button, Hourglass, ProgressBar, TextInput } from "react95";
import styled from "styled-components";

import { atomWithWriteOnly } from "~/lib/atom-with-write-only";
import { readonly } from "~/lib/readonly";

import { DefaultWindow } from "./default-window";

const StyledWindow = styled(DefaultWindow)`
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

const refreshableAtom = atom(0);

const writableAtom = atom<Promise<MLCEngine>, [Progress], undefined>(
  (get, { setSelf }) => {
    get(refreshableAtom);
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

const anAtom = readonly(writableAtom);

function Content(): ReactNode {
  return (
    <Container>
      <p>Work in progress…</p>
    </Container>
  );
}

function Input(): ReactNode {
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
    <Inputs>
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
  margin-bottom: 16px;
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
      <Hourglass />
      <p css="margin-top: 12px;">Starting…</p>
    </Container>
  );
}

const loadableAtom = loadable(anAtom);

const tryAgainAtom = atomWithWriteOnly((get, set) => {
  set(refreshableAtom, (refreshable) => refreshable + 1);
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
          <Content />
          <Input />
        </>
      );
    }
  }
}

export function ChatGPTWindow(): ReactNode {
  return (
    <StyledWindow window="ChatGPT" defaultWidth={736} defaultHeight={470}>
      <Loadable />
    </StyledWindow>
  );
}
