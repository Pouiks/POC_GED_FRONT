import fr from "../locales/fr";
import en from "../locales/en";

const getBrowserLanguage = () => {
  const lang = navigator.language || navigator.userLanguage || "fr";
  return lang.startsWith("en") ? "en" : "fr";
};

let currentLanguage = getBrowserLanguage();
let translations = currentLanguage === "fr" ? fr : en;

export const setLanguage = (lang) => {
  currentLanguage = lang;
  translations = lang === "fr" ? fr : en;
};

export const translate = (key) => {
  return translations[key] || key; // Renvoie la clé elle-même si aucune traduction n'est trouvée
};
