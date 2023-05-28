import "./layout.css";

import type { Metadata } from "next";
import type { FC, PropsWithChildren } from "react";

import { Inconsolata, Inter } from "next/font/google";

import { Configuration } from "./configuration";
import { Shell } from "./shell";

const info = {
  url: new URL("https://www.phuctm97.com"),
  title: { default: "Minh-Phuc Tran", template: "%s | Minh-Phuc Tran" },
  description:
    "I'm a full-time indie hacker. I build Internet products to solve problems for myself and others. I then charge a small fee to keep the lights on and live independently.",
};

export const metadata: Metadata = {
  metadataBase: info.url,
  title: info.title,
  description: info.description,
  applicationName: "Minh-Phuc Tran",
  authors: [{ url: info.url, name: "Minh-Phuc Tran" }],
  keywords: [
    "phuctm97",
    "Minh-Phuc Tran",
    "phuctm",
    "Phuc Tran",
    "Minh-Phuc",
    "Phuc",
  ],
  creator: "Minh-Phuc Tran",
  publisher: "Minh-Phuc Tran",
  generator: "Next.js",
  openGraph: {
    url: "/",
    title: info.title,
    description: info.description,
    siteName: "Minh-Phuc Tran",
    locale: "en_US",
    type: "profile",
    username: "phuctm97",
    firstName: "Phuc",
    lastName: "Tran",
    gender: "male",
  },
  twitter: {
    card: "summary",
    site: "@phuctm97",
    creator: "@phuctm97",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: "/",
  },
};

const inconsolata = Inconsolata({
  variable: "--tw-font-inconsolata",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--tw-font-inter",
  subsets: ["latin"],
});

const Layout: FC<PropsWithChildren> = ({ children }) => (
  <html className={`${inconsolata.variable} ${inter.variable}`} lang="en">
    <body>
      <Configuration>
        <Shell>{children}</Shell>
      </Configuration>
    </body>
  </html>
);

export default Layout;
