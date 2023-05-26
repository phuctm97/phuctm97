import "server-only";

import type { FC } from "react";

export type SC<P = Record<string, never>> = ((
  props: P,
  context?: object
) => Promise<JSX.Element | null>) &
  Pick<FC<P>, "propTypes" | "contextTypes" | "defaultProps" | "displayName">;

export function ssr<P = Record<string, never>>(Component: SC<P>): FC<P> {
  // @ts-expect-error Workaround TypeScript limitation (see https://github.com/vercel/next.js/issues/42292)
  return Component as FC<P>;
}
