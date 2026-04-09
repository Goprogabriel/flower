"use client";

import Link from "next/link";
import {
  supportedLanguages,
  type LanguageCode
} from "@/lib/i18n";
import { useLanguage } from "./language-provider";
import styles from "./language-switcher.module.css";

type LanguageSwitcherProps = {
  align?: "start" | "center";
};

export function LanguageSwitcher({
  align = "center"
}: LanguageSwitcherProps) {
  const { language, translations, createLanguageSwitchPath } = useLanguage();

  return (
    <div
      className={`${styles.switcher} ${
        align === "start" ? styles.alignStart : styles.alignCenter
      }`}
      aria-label={translations.languageLabel}
    >
      <span className={styles.label}>{translations.languageLabel}</span>
      <div className={styles.pill}>
        {supportedLanguages.map((entry) => {
          const isActive = entry === language;

          return (
            <Link
              key={entry}
              href={createLanguageSwitchPath(entry as LanguageCode)}
              className={`${styles.option} ${isActive ? styles.active : ""}`}
              aria-current={isActive ? "page" : undefined}
            >
              {translations.languageNames[entry]}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
