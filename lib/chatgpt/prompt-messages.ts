import type { ChatCompletionSystemMessageParam } from "@mlc-ai/web-llm";

export const promptMessages: ChatCompletionSystemMessageParam[] = [
  { role: "system", content: "You are a helpful assistant." },
];
