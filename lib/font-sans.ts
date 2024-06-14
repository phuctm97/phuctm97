import localFont from "next/font/local";

export const fontSans = localFont({
  src: [
    { path: "../node_modules/react95/dist/fonts/ms_sans_serif.woff2" },
    {
      path: "../node_modules/react95/dist/fonts/ms_sans_serif_bold.woff2",
      weight: "bold",
    },
  ],
  variable: "--font-sans",
});
