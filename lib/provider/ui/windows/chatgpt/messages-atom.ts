import type { ChatCompletionMessageParam } from "@mlc-ai/web-llm";

import { atom } from "jotai";

export const messagesAtom = atom<ChatCompletionMessageParam[]>([]);
