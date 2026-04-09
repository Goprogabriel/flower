"use client";

import {
  Suspense,
  createContext,
  useContext,
  useEffect,
  useMemo
} from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  defaultLanguage,
  getLanguage,
  getTranslations,
  localizeAssetLabel,
  type LanguageCode,
  type Translations
} from "@/lib/i18n";
import { createLocalizedPath } from "@/lib/site-paths";

type LanguageContextValue = {
  language: LanguageCode;
  translations: Translations;
  createLocalizedPath: (path: string, queryString?: string) => string;
  createLanguageSwitchPath: (language: LanguageCode) => string;
  localizeLabel: (label: string) => string;
};

const defaultTranslations = getTranslations(defaultLanguage);

function getFallbackLocation() {
  if (typeof window === "undefined") {
    return {
      pathname: "/",
      search: ""
    };
  }

  return {
    pathname: window.location.pathname,
    search: window.location.search
  };
}

const defaultValue: LanguageContextValue = {
  language: defaultLanguage,
  translations: defaultTranslations,
  createLocalizedPath: (path, queryString) =>
    createLocalizedPath(path, defaultLanguage, queryString),
  createLanguageSwitchPath: (language) => {
    const location = getFallbackLocation();

    return createLocalizedPath(location.pathname, language, location.search);
  },
  localizeLabel: (label) => localizeAssetLabel(label, defaultLanguage)
};

const LanguageContext = createContext<LanguageContextValue>(defaultValue);

type LanguageProviderProps = {
  children: React.ReactNode;
};

function LanguageProviderContent({ children }: LanguageProviderProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const language = getLanguage(searchParams.get("lang"));
  const searchString = searchParams.toString();

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      translations: getTranslations(language),
      createLocalizedPath: (path, queryString) =>
        createLocalizedPath(path, language, queryString),
      createLanguageSwitchPath: (nextLanguage) =>
        createLocalizedPath(pathname || "/", nextLanguage, searchString),
      localizeLabel: (label) => localizeAssetLabel(label, language)
    }),
    [language, pathname, searchString]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  return (
    <Suspense
      fallback={
        <LanguageContext.Provider value={defaultValue}>
          {children}
        </LanguageContext.Provider>
      }
    >
      <LanguageProviderContent>{children}</LanguageProviderContent>
    </Suspense>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
