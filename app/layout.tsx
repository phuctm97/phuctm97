import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "A portfolio with Windows 95 UI and ChatGPT-like AI",
  description:
    "I'm Minh-Phuc Tran, an indie hacker. I built this portfolio to blend yesterday’s look (Windows 95) with tomorrow’s tech (in-browser ChatGPT).",
  alternates: {
    canonical: process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
      ? new URL(
          `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`,
        )
      : undefined,
  },
};

export default function Layout({ children }: PropsWithChildren): ReactNode {
  return (
    <html lang={i18n.lang} dir={i18n.dir}>
      <body className={font.className}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
