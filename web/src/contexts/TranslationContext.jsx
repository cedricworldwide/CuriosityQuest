import React, { createContext, useContext, useState } from 'react';
import en from '../locales/en.js';
import zh from '../locales/zh.js';

/**
 * TranslationContext provides the current language and a translation
 * function to React components. It stores translations for each
 * supported language and exposes a setter to switch languages.
 */
const languages = { en, zh };

const TranslationContext = createContext({
  lang: 'en',
  t: key => key,
  setLanguage: () => {}
});

export function TranslationProvider({ children }) {
  const [lang, setLang] = useState('en');

  function t(key) {
    const dictionary = languages[lang] || en;
    return dictionary[key] || key;
  }

  function setLanguage(newLang) {
    if (languages[newLang]) setLang(newLang);
  }

  return (
    <TranslationContext.Provider value={{ lang, t, setLanguage }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  return useContext(TranslationContext);
}