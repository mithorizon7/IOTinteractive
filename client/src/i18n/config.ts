import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enUI from '../locales/en/ui.json';
import enContent from '../locales/en/content.json';
// Uncomment when Finnish and Russian translations are complete:
// import fiUI from '../locales/fi/ui.json';
// import fiContent from '../locales/fi/content.json';
// import ruUI from '../locales/ru/ui.json';
// import ruContent from '../locales/ru/content.json';

const resources = {
  en: {
    ui: enUI,
    content: enContent,
  },
  // Uncomment when translations are ready:
  // fi: {
  //   ui: fiUI,
  //   content: fiContent,
  // },
  // ru: {
  //   ui: ruUI,
  //   content: ruContent,
  // },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en'], // Add 'fi', 'ru' when translations are ready
    defaultNS: 'ui',
    ns: ['ui', 'content'],
    
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    
    interpolation: {
      escapeValue: false,
    },
    
    react: {
      useSuspense: false,
    },
  });

export default i18n;
