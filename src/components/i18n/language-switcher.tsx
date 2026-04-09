"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
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
  const [isOpen, setIsOpen] = useState(false);
  const dropdownId = useId();
  const switcherRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!switcherRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div
      ref={switcherRef}
      className={`${styles.switcher} ${
        align === "start" ? styles.alignStart : styles.alignCenter
      }`}
      data-open={isOpen ? "true" : "false"}
    >
      <span className={styles.label}>{translations.languageLabel}</span>
      <div className={styles.dropdown}>
        <button
          type="button"
          className={styles.trigger}
          aria-expanded={isOpen}
          aria-controls={dropdownId}
          onClick={() => setIsOpen((current) => !current)}
        >
          <span>{translations.languageNames[language]}</span>
          <span className={styles.chevron} aria-hidden="true">
            ▾
          </span>
        </button>

        {isOpen ? (
          <div id={dropdownId} className={styles.menu} role="menu">
            {supportedLanguages.map((entry) => {
              const isActive = entry === language;

              return (
                <Link
                  key={entry}
                  href={createLanguageSwitchPath(entry as LanguageCode)}
                  className={`${styles.option} ${isActive ? styles.active : ""}`}
                  aria-current={isActive ? "page" : undefined}
                  role="menuitem"
                  onClick={() => setIsOpen(false)}
                >
                  {translations.languageNames[entry]}
                </Link>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}
