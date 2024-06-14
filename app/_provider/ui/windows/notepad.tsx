import type { ChangeEventHandler, ReactNode } from "react";

import { atom, useAtom } from "jotai";
import { useCallback } from "react";
import { TextInput } from "react95";
import styled from "styled-components";

import { Window } from "~/lib/window";

const valueAtom = atom("");

const StyledTextInput = styled(TextInput)`
  flex-grow: 1;
  flex-shrink: 1;
`;

function Input(): ReactNode {
  const [value, setValue] = useAtom(valueAtom);
  const handleChange = useCallback<ChangeEventHandler<HTMLTextAreaElement>>(
    (event) => {
      setValue(event.target.value);
    },
    [setValue],
  );
  return (
    <StyledTextInput
      value={value}
      onChange={handleChange}
      placeholder="Write something…"
      spellCheck={false}
      multiline
    />
  );
}

const StyledWindow = styled(Window)`
  padding: 6px;
`;

export function Notepad(): ReactNode {
  return (
    <StyledWindow window="Notepad" defaultWidth={400} defaultHeight={400}>
      <Input />
    </StyledWindow>
  );
}
