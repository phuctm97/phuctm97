import type { PropsWithChildren, ReactNode } from "react";

import localFont from "next/font/local";

import { i18n } from "~/i18n";

import { Provider } from "./_provider";

const font = localFont({
  src: [
    { path: "../node_modules/react95/dist/fonts/ms_sans_serif.woff2" },
    {
      path: "../node_modules/react95/dist/fonts/ms_sans_serif_bold.woff2",
      weight: "bold",
    },
  ],
});

export default function Layout({ children }: PropsWithChildren): ReactNode {
  return (
    <html lang={i18n.lang} dir={i18n.dir}>
      <body className={font.className}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
