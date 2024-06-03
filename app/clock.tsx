import type { ReactNode } from "react";

import { useEffect, useState } from "react";
import { Frame, Tooltip } from "react95";

import { i18n } from "~/i18n";

export function Clock(): ReactNode {
  const [time, setTime] = useState(0);
  const [count, setCount] = useState(0);
  useEffect(() => {
    const time = Date.now();
    setTime(time);
    const timeout = setTimeout(
      () => {
        setCount((count) => count + 1);
      },
      60_000 - (time % 60_000),
    );
    return () => {
      clearTimeout(timeout);
    };
  }, [count, setTime, setCount]);
  const date = time ? new Date(time) : undefined;
  return (
    <Tooltip
      position="left"
      text={
        date?.toLocaleDateString(i18n.locale, {
          day: "numeric",
          month: "long",
          year: "numeric",
        }) ?? "…"
      }
    >
      <Frame
        variant="status"
        css="width: 84px; height: 36px; display: flex; flex-direction: row; align-items: center; justify-content: center; user-select: none; cursor: default;"
      >
        {date?.toLocaleTimeString(i18n.locale, {
          hour: "numeric",
          minute: "2-digit",
        }) ?? "…"}
      </Frame>
    </Tooltip>
  );
}
