import type { ReactNode } from "react";

import { Bulb, Faxcover140, Progman24 } from "@react95/icons";
import { useCallback, useState } from "react";
import { Anchor, Button, Frame, Separator } from "react95";
import { createHatchedBackground, createScrollbars } from "react95/dist/common";
import styled from "styled-components";

import { Window } from "~/lib/window";

const StyledFrame = styled(Frame)`
  flex-grow: 1;
  flex-shrink: 1;
  padding: 20px;
  margin-right: 20px;
  overflow: auto;
  ${({ theme }) =>
    createHatchedBackground({
      mainColor: theme.tooltip,
      secondaryColor: theme.canvas,
    })};
  ${createScrollbars()}
`;

function openGithub(): void {
  open("https://github.com/phuctm97/phuctm97", "_blank", "noopener noreferrer");
}

function openXOrTwitter(): void {
  open("https://x.com/phuctm97", "_blank", "noopener noreferrer");
}

type Tab = "aboutWebsite" | "aboutAuthor" | "acknowledgements";

interface ContentProps {
  tab: Tab;
}

function Content({ tab }: ContentProps): ReactNode {
  switch (tab) {
    case "aboutWebsite": {
      return (
        <>
          <h2 css="font-weight: bold;">
            <Bulb
              variant="32x32_4"
              css="margin-bottom: -6px; margin-right: 4px;"
            />{" "}
            Fun facts about this website:
          </h2>
          <ul css="margin-left: 40px; margin-top: 20px;">
            <li css="list-style: square;">
              It is designed to blend yesterday’s look (Windows 95) with
              tomorrow’s tech (in-browser ChatGPT).
            </li>
            <li css="list-style: square; margin-top: 6px;">
              It is built for the modern web: 100% in-browser, no installation,
              no expensive API calls, no privacy concerns.
            </li>
            <li css="list-style: square; margin-top: 6px;">
              Because everything runs in a browser, it is secure by default,
              accessible to everyone, and works on many devices.
            </li>
            <li css="list-style: square; margin-top: 6px;">
              For extra transparency, its source code is available on{" "}
              <Anchor
                href="https://github.com/phuctm97/phuctm97"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </Anchor>
              . A star would be greatly appreciated!
            </li>
          </ul>
        </>
      );
    }
    case "aboutAuthor": {
      return (
        <>
          <h2 css="font-weight: bold;">
            <Progman24
              variant="32x32_4"
              css="margin-bottom: -6px; margin-right: 4px;"
            />{" "}
            Hello, World! I&apos;m Phuc…
          </h2>
          <ul css="margin-left: 40px; margin-top: 20px;">
            <li css="list-style: square;">
              I&apos;m an indie hacker. I make a living by building and selling
              independent software products.
            </li>
            <li css="list-style: square; margin-top: 6px;">
              I&apos;m a digital nomad based in Vietnam. I travel the world
              while working on my projects.
            </li>
            <li css="list-style: square; margin-top: 6px;">
              I post about what I&apos;ve built, learned, and random thoughts on{" "}
              <Anchor
                href="https://x.com/phuctm97"
                target="_blank"
                rel="noopener noreferrer"
              >
                X/Twitter
              </Anchor>{" "}
              every day.
            </li>
            <li css="list-style: square; margin-top: 6px;">
              In my free time, I like to cover Vietnamese songs and build fun
              projects like this website.
            </li>
          </ul>
        </>
      );
    }
    case "acknowledgements": {
      return (
        <>
          <h2 css="font-weight: bold;">
            <Faxcover140
              variant="32x32_4"
              css="margin-bottom: -6px; margin-right: 4px;"
            />{" "}
            Special thanks to these amazing projects:
          </h2>
          <ul css="margin-left: 40px; margin-top: 20px;">
            <li css="list-style: square;">
              <Anchor
                href="https://nextjs.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                Next.js
              </Anchor>{" "}
              &{" "}
              <Anchor
                href="https://react.dev"
                target="_blank"
                rel="noopener noreferrer"
              >
                React
              </Anchor>
              : Web Framework & Library
            </li>
            <li css="list-style: square; margin-top: 6px;">
              <Anchor
                href="https://www.typescriptlang.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                TypeScript
              </Anchor>
              : Programming Language
            </li>
            <li css="list-style: square; margin-top: 6px;">
              <Anchor
                href="https://styled-components.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Styled Components
              </Anchor>
              : CSS-in-JS
            </li>
            <li css="list-style: square; margin-top: 6px;">
              <Anchor
                href="https://webllm.mlc.ai"
                target="_blank"
                rel="noopener noreferrer"
              >
                WebLLM
              </Anchor>
              : In-Browser LLM
            </li>
            <li css="list-style: square; margin-top: 6px;">
              <Anchor
                href="https://react95.io"
                target="_blank"
                rel="noopener noreferrer"
              >
                React95
              </Anchor>
              : UI Components
            </li>
            <li css="list-style: square; margin-top: 6px;">
              <Anchor
                href="https://react95.github.io/React95"
                target="_blank"
                rel="noopener noreferrer"
              >
                React95 Icons
              </Anchor>
              : UI Icons
            </li>
            <li css="list-style: square; margin-top: 6px;">
              <Anchor
                href="https://jotai.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                Jotai
              </Anchor>
              : State Management
            </li>
            <li css="list-style: square; margin-top: 6px;">
              <Anchor
                href="https://eslint.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                ESLint
              </Anchor>
              ,{" "}
              <Anchor
                href="https://prettier.io"
                target="_blank"
                rel="noopener noreferrer"
              >
                Prettier
              </Anchor>
              , and more: Development Tools
            </li>
          </ul>
          <p css="margin-left: 8px; margin-top: 20px;">
            This project is for non-commercial purposes only. All trademarks are
            used for recreational purposes only and have no affiliation with the
            respective owners. Windows and all associated assets are the
            property of Microsoft Corporation. ChatGPT and all associated assets
            are the property of OpenAI.
          </p>
        </>
      );
    }
  }
}

export function Welcome(): ReactNode {
  const [tab, setTab] = useState<Tab>("aboutWebsite");
  const handleClickAboutWebsite = useCallback(() => {
    setTab("aboutWebsite");
  }, [setTab]);
  const handleClickAboutAuthor = useCallback(() => {
    setTab("aboutAuthor");
  }, [setTab]);
  const handleClickAcknowledgements = useCallback(() => {
    setTab("acknowledgements");
  }, [setTab]);
  return (
    <Window window="Welcome" defaultWidth={720} defaultHeight={454}>
      <h1 css="flex-shrink: 0; font-size: 2rem; line-height: 2.625rem; font-weight: bold;">
        Welcome to @phuctm97
      </h1>
      <div css="flex-grow: 1; flex-shrink: 1; display: flex; overflow: hidden; margin-top: 10px;">
        <StyledFrame variant="well">
          <Content tab={tab} />
        </StyledFrame>
        <div css="flex-shrink: 0; display: flex; flex-direction: column; align-items: stretch;">
          <Button css="flex-shrink: 0;" onClick={handleClickAboutWebsite}>
            About this Website
          </Button>
          <Button
            css="flex-shrink: 0; margin-top: 10px;"
            onClick={handleClickAboutAuthor}
          >
            About the Author
          </Button>
          <Separator css="flex-shrink: 0; margin-top: 40px; margin-bottom: 20px;" />
          <Button css="flex-shrink: 0;" onClick={handleClickAcknowledgements}>
            Acknowledgements
          </Button>
          <Button css="flex-shrink: 0; margin-top: 10px;" onClick={openGithub}>
            GitHub ↗
          </Button>
          <Button
            css="flex-shrink: 0; margin-top: 10px;"
            onClick={openXOrTwitter}
          >
            X/Twitter ↗
          </Button>
        </div>
      </div>
    </Window>
  );
}
