const htmlAttributes = { lang: "en-US", dir: "ltr" } as const;

export const i18n = { ...htmlAttributes, locale: htmlAttributes.lang } as const;
