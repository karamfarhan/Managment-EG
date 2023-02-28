<<<<<<< HEAD
// import React from "react";
// import { createRoot } from 'react-dom/client';
// import i18n from "i18next";
// import { useTranslation, initReactI18next } from "react-i18next";
=======
// import i18n from "i18next";
// import { initReactI18next } from "react-i18next";

// import translateEn from "../public/locale/en.json";
// import translateAr from "../public/locale/ar.json";

// const resources = {
//   en: {
//     translation: translateEn,
//   },
//   ar: {
//     translation: translateAr,
//   },
// };
>>>>>>> c9f6c2a (charts_part_one)

// i18n
//   .use(initReactI18next) // passes i18n down to react-i18next
//   .init({
<<<<<<< HEAD
//     // the translations
//     // (tip move them in a JSON file and import them,
//     // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
//     resources: {
//       en: {
//         translation: {
//           "Welcome to React": "Welcome to React and react-i18next"
//         }
//       }
//     },
//     lng: "en", // if you're using a language detector, do not define the lng option
//     fallbackLng: "en",

//     interpolation: {
//       escapeValue: false // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
//     }
//   });

// function App() {
//   const { t } = useTranslation();

//   return <h2>{t('Welcome to React')}</h2>;
// }

// // append app to dom
// const root = createRoot(document.getElementById('root'));
// root.render(
//   <App />
// );
=======
//     resources,
//     lng: "ar", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
//     // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
//     // if you're using a language detector, do not define the lng option

//     interpolation: {
//       escapeValue: false, // react already safes from xss
//     },
//   });

// export default i18n;
>>>>>>> c9f6c2a (charts_part_one)
