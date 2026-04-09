"use client";

import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { useLanguage } from "@/components/i18n/language-provider";
import styles from "./site-footer.module.css";

export function SiteFooter() {
  const { translations } = useLanguage();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <p>{translations.footer.description}</p>
        <LanguageSwitcher align="start" />
      </div>
    </footer>
  );
}
