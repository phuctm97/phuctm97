import type { ReactNode } from "react";

import { TextInput } from "react95";
import styled from "styled-components";

import { Window } from "~/lib/window";

const StyledWindow = styled(Window)`
  padding: 6px;
`;

const StyledTextInput = styled(TextInput)`
  flex-grow: 1;
  flex-shrink: 1;
`;

export function NotepadWindow(): ReactNode {
  return (
    <StyledWindow window="Notepad" defaultWidth={400} defaultHeight={400}>
      <StyledTextInput spellCheck={false} multiline />
    </StyledWindow>
  );
}
