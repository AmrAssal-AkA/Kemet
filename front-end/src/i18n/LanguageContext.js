import { createContext, useContext, useEffect, useMemo, useState } from "react";

import ar from "./dictionaries/ar";
import en from "./dictionaries/en";

const STORAGE_KEY = "kemet-language";
const DEFAULT_LANGUAGE = "en";
const dictionaries = { en, ar };

const LanguageContext = createContext(null);

function normalizeLanguage(value) {
  return value === "ar" ? "ar" : "en";
}

function getDictionaryValue(dictionary, key) {
  return Object.prototype.hasOwnProperty.call(dictionary, key)
    ? dictionary[key]
    : undefined;
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(DEFAULT_LANGUAGE);

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem(STORAGE_KEY);
    setLanguageState(normalizeLanguage(savedLanguage));
  }, []);

  useEffect(() => {
    const normalizedLanguage = normalizeLanguage(language);
    document.documentElement.lang = normalizedLanguage;
    document.documentElement.dir = normalizedLanguage === "ar" ? "rtl" : "ltr";
    window.localStorage.setItem(STORAGE_KEY, normalizedLanguage);
  }, [language]);

  const value = useMemo(() => {
    const normalizedLanguage = normalizeLanguage(language);
    const isArabic = normalizedLanguage === "ar";

    function setLanguage(nextLanguage) {
      setLanguageState(normalizeLanguage(nextLanguage));
    }

    function toggleLanguage() {
      setLanguageState((current) => (normalizeLanguage(current) === "ar" ? "en" : "ar"));
    }

    function t(key) {
      const activeValue = getDictionaryValue(dictionaries[normalizedLanguage], key);
      if (activeValue !== undefined && activeValue !== "") return activeValue;

      const englishValue = getDictionaryValue(en, key);
      if (englishValue !== undefined && englishValue !== "") return englishValue;

      return key;
    }

    return {
      language: normalizedLanguage,
      setLanguage,
      toggleLanguage,
      t,
      isArabic,
    };
  }, [language]);

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
}
