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
  if (!key) return key;

  // Normalisation de la clé pour supprimer les accents
  const normalizedKey = key
    .normalize("NFD") // Sépare les accents des lettres
    .replace(/[\u0300-\u036f]/g, "") // Supprime les accents
    .replace(/[^a-zA-Z0-9_]/g, "_") // Remplace les caractères spéciaux par des _
    .toLowerCase();

  return translations[normalizedKey] || key;
};

