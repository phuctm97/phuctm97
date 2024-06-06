import type { ChatCompletionMessageParam } from "@mlc-ai/web-llm";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { AnchorProps } from "react95";

import { memo } from "react";
import Markdown from "react-markdown";
import { Anchor, GroupBox } from "react95";
import remarkGfm from "remark-gfm";
import styled from "styled-components";

type MarkdownProps = ComponentPropsWithoutRef<typeof Markdown>;

const remarkPlugins: MarkdownProps["remarkPlugins"] = [remarkGfm];

const components: MarkdownProps["components"] = {
  a: ({ node, ...props }) => (
    <Anchor
      {...(props as AnchorProps)}
      target="_blank"
      rel="noopener noreferrer"
    />
  ),
};

const StyledMarkdown = styled(Markdown)`
  pre {
    padding: 16px;
  }
  pre > code {
    line-height: 1.25;
  }
  & > :not(:last-child) {
    margin-bottom: 12px;
  }
`;

function MarkdownContent({
  children,
}: Pick<MarkdownProps, "children">): ReactNode {
  return (
    <StyledMarkdown remarkPlugins={remarkPlugins} components={components}>
      {children}
    </StyledMarkdown>
  );
}

const OptimizedContent =
  process.env.NODE_ENV === "production"
    ? memo(MarkdownContent, (a, b) => a.children === b.children)
    : MarkdownContent;

const StyledGroupBox = styled(GroupBox)`
  margin-right: 8px;
`;

export interface MessageProps {
  message: ChatCompletionMessageParam;
}

export function Message({ message }: MessageProps): ReactNode {
  switch (message.role) {
    case "user": {
      return (
        <StyledGroupBox label="You">
          {typeof message.content === "string" ? (
            <OptimizedContent>{message.content}</OptimizedContent>
          ) : (
            "N/A"
          )}
        </StyledGroupBox>
      );
    }
    case "assistant": {
      return (
        <StyledGroupBox label="ChatGPT">
          <OptimizedContent>{message.content}</OptimizedContent>
        </StyledGroupBox>
      );
    }
  }
}
