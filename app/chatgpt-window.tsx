import type { ChangeEventHandler, ReactNode } from "react";

import { MLCEngine } from "@mlc-ai/web-llm";
import { atom, useAtomValue } from "jotai";
import { useCallback, useState } from "react";
import { Button, Hourglass, ProgressBar, TextInput } from "react95";
import styled from "styled-components";

import { readonly } from "~/lib/readonly";

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

const Input = styled.div`
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

function ConnectedContent(): ReactNode {
  return <Content>Work in progress…</Content>;
}

function ConnectedInput(): ReactNode {
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
    <Input>
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
    </Input>
  );
}

function Loaded(): ReactNode {
  return (
    <>
      <ConnectedContent />
      <ConnectedInput />
    </>
  );
}

const engineUnloadedAtom = atom<MLCEngine | undefined>(undefined);

const engineLoadedAtom = atom<MLCEngine | undefined>(undefined);

const engineProgressAtom = atom<number | undefined>(undefined);

const engineWritableAtom = atom(
  (get) => get(engineLoadedAtom),
  (get, set) => {
    if (get(engineUnloadedAtom)) return;
    const engine = new MLCEngine();
    set(engineUnloadedAtom, engine);
    engine.setInitProgressCallback(({ progress }) => {
      set(engineProgressAtom, progress);
    });
    void engine
      .reload("Hermes-2-Pro-Mistral-7B-q4f16_1-MLC")
      .catch((error: unknown) => {
        console.error("Failed to load engine", error);
        set(engineProgressAtom, undefined);
        set(engineUnloadedAtom, undefined);
      })
      .then(() => {
        set(engineLoadedAtom, engine);
      });
  },
);

engineWritableAtom.onMount = (set) => {
  set();
};

const engineAtom = readonly(engineWritableAtom);

function ConnectedProgress(): ReactNode {
  const progress = useAtomValue(engineProgressAtom);
  return typeof progress === "number" ? (
    <ProgressBar variant="tile" value={Math.floor(progress * 100)} />
  ) : (
    <Hourglass />
  );
}

function Loading(): ReactNode {
  return (
    <Content>
      <ConnectedProgress />
    </Content>
  );
}

function Loadable(): ReactNode {
  const engine = useAtomValue(engineAtom);
  return engine ? <Loaded /> : <Loading />;
}

export function ChatGPTWindow(): ReactNode {
  return (
    <StyledWindow window="ChatGPT" defaultWidth={740} defaultHeight={460}>
      <Loadable />
    </StyledWindow>
  );
}
