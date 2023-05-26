const twDefaultTheme = require("tailwindcss/defaultTheme");

const jsExtensions = ["js", "mjs", "cjs", "jsx"];

const tsExtensions = jsExtensions.map((ext) => ext.replace("js", "ts"));

const extensions = ["html", ...tsExtensions, ...jsExtensions];

/** @type {import('tailwindcss/types/config').PluginCreator} */
const plugin = ({ addComponents }) => {
  addComponents({
    ".scroll-area": {
      overflow: "hidden",
    },
    ".scroll-area-viewport": {
      width: "100%",
      height: "100%",
      "> *": {
        tableLayout: "fixed",
      },
      "&.w-full > *": {
        width: "100%",
        maxWidth: "100%",
      },
      "&.max-w-full > *": {
        width: "100%",
        maxWidth: "100%",
      },
      "&.h-full > *": {
        height: "100%",
        maxHeight: "100%",
      },
      "&.max-h-full > *": {
        height: "100%",
        maxHeight: "100%",
      },
    },
    ".scroll-area-scrollbar": {
      display: "flex",
      userSelect: "none",
      touchAction: "none",
      "&[data-orientation='vertical']": {
        flexDirection: "row",
        width: 10,
        paddingRight: 2,
      },
      "&[data-orientation='horizontal']": {
        flexDirection: "column",
        height: 10,
        paddingBottom: 2,
      },
    },
    ".scroll-area-thumb": {
      flex: 1,
      background: "rgba(0, 0, 0, 0.1)",
      borderRadius: 9999,
      position: "relative",
      "&::before": {
        content: "''",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "100%",
        height: "100%",
        minWidth: 44,
        minHeight: 44,
      },
    },
  });
};

/** @type {(...dirs: string[]) => import('tailwindcss/types/config').Config} */
const config = (...dirs) => ({
  content: {
    relative: true,
    files: [
      `index.{${extensions.join(",")}}`,
      ...dirs.map((dir) => `${dir}/**/*.{${extensions.join(",")}}`),
    ],
  },
  theme: {
    extend: {
      fontFamily: {
        mono: ["var(--tw-font-inconsolata)", ...twDefaultTheme.fontFamily.mono],
        sans: ["var(--tw-font-inter)", ...twDefaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), plugin],
});

module.exports = config;
