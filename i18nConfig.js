const i18nConfig = {
    locales: ["en", "he", "ru"],
    defaultLocale: "en",
    prefixDefault: true,
    "pages": {
      "*": ["common"]
    },
    // "loadLocaleFrom": (lang, ns) =>
    //   import(`./public/locales/${lang}/${ns}.json`).then((m) => m.default)
  }

  module.exports = i18nConfig;