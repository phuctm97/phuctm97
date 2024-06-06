import type { ChangeEventHandler, ReactNode } from "react";

import { atom, useAtom } from "jotai";
import { useCallback } from "react";
import { TextInput } from "react95";
import styled from "styled-components";

import { Window } from "~/lib/window";

const StyledTextInput = styled(TextInput)`
  flex-grow: 1;
  flex-shrink: 1;
`;

export const notepadAtom = atom("");

function Input(): ReactNode {
  const [notepad, setNotepad] = useAtom(notepadAtom);
  const handleChange = useCallback<ChangeEventHandler<HTMLTextAreaElement>>(
    (event) => {
      setNotepad(event.target.value);
    },
    [setNotepad],
  );
  return (
    <StyledTextInput
      value={notepad}
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
