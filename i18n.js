const htmlAttributes = { lang: "en-US", dir: "ltr" };

export const i18n = {
  ...htmlAttributes,
  locale: htmlAttributes.lang,
  shortLocale: htmlAttributes.lang.slice(0, 2),
};
