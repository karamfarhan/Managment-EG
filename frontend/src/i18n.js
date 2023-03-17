import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import translateEn from "./locales/en.json";
import translateAr from "./locales/ar.json";
const resources = {
  en: {
    translation: translateEn,
  },
  ar: {
    translation: translateAr,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)

  .init({
    resources,
    lng: localStorage.getItem("language") || "en",

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
