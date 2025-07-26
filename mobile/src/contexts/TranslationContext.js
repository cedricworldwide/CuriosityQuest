import React, { createContext, useContext, useState } from 'react';
import en from '../locales/en.js';
import zh from '../locales/zh.js';

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

  return (
    <TranslationContext.Provider value={{ lang, t, setLanguage: setLang }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  return useContext(TranslationContext);
}