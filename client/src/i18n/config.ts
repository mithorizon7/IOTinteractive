import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enUI from "../locales/en/ui.json";
import enContent from "../locales/en/content.json";
import ruUI from "../locales/ru/ui.json";
import ruContent from "../locales/ru/content.json";
import lvUI from "../locales/lv/ui.json";
import lvContent from "../locales/lv/content.json";

const resources = {
  en: {
    ui: enUI,
    content: enContent,
  },
  ru: {
    ui: ruUI,
    content: ruContent,
  },
  lv: {
    ui: lvUI,
    content: lvContent,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    supportedLngs: ["en", "ru", "lv"],
    defaultNS: "ui",
    ns: ["ui", "content"],

    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "i18nextLng",
    },

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: false,
    },
  });

export default i18n;
