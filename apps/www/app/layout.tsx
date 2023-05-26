import "./layout.css";

import type { Metadata } from "next";
import type { FC, PropsWithChildren } from "react";

import { Inconsolata, Inter } from "next/font/google";

import { Configuration } from "./configuration";

export const metadata: Metadata = {
  title: "Minh-Phuc Tran",
  description:
    "I'm a full-time indie hacker. I build Internet products to solve problems for myself and others. I then charge a small fee to keep the lights on and live independently.",
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
      <Configuration>{children}</Configuration>
    </body>
  </html>
);

export default Layout;
