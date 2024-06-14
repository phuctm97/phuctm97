import type { Metadata, Viewport } from "next";
import type { PropsWithChildren, ReactNode } from "react";

import { fontMono } from "~/lib/font-mono";
import { fontSans } from "~/lib/font-sans";
import { i18n } from "~/lib/i18n";
import { Provider } from "~/lib/provider";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_VERCEL_ENV === "production" &&
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL
        ? `https://${process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL}`
        : "http://localhost:43815",
  ),
  title: "A portfolio with Windows 95 UI and ChatGPT-like AI",
  description:
    "I'm Minh-Phuc Tran, an indie hacker. I built this portfolio to blend yesterday’s look (Windows 95) with tomorrow’s tech (in-browser ChatGPT).",
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "white",
  colorScheme: "only light",
};

export default function Layout({ children }: PropsWithChildren): ReactNode {
  return (
    <html lang={i18n.lang} dir={i18n.dir}>
      <body className={`${fontSans.variable} ${fontMono.variable}`}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
