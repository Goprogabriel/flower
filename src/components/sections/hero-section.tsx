"use client";

import { buildBouquetPath } from "@/lib/site-paths";
import { useLanguage } from "@/components/i18n/language-provider";
import { ButtonLink } from "@/components/ui/button-link";
import { BouquetShowcase } from "./bouquet-showcase";
import styles from "./hero-section.module.css";

type HeroSectionProps = {
  contained?: boolean;
  visualMode?: "default" | "mobile-only" | "hidden";
};

export function HeroSection({
  contained = true,
  visualMode = "default"
}: HeroSectionProps) {
  const { language, translations, createLocalizedPath } = useLanguage();
  const wrapperClassName = `${styles.wrapper} ${
    visualMode === "mobile-only" ? styles.singleColumnDesktop : ""
  }`;
  const titleClassName = `${styles.title} ${
    language === "da" ? "" : styles.localizedTitle
  }`;
  const descriptionClassName = `${styles.description} ${
    language === "da" ? "" : styles.localizedDescription
  }`;

  const content = (
    <div className={wrapperClassName}>
      <div className={styles.copy}>
        <span className="eyebrow">{translations.hero.eyebrow}</span>
        <h1 className={titleClassName}>{translations.hero.title}</h1>
        <p className={descriptionClassName}>{translations.hero.description}</p>

        <div className={styles.actions}>
          <ButtonLink href={createLocalizedPath(buildBouquetPath)} size="large">
            {translations.hero.cta}
          </ButtonLink>
        </div>

        <ul className={styles.metrics} aria-label={translations.hero.metricsLabel}>
          {translations.hero.metrics.map((detail) => (
            <li key={detail.label}>
              <strong>{detail.value}</strong>
              <span>{detail.label}</span>
            </li>
          ))}
        </ul>
      </div>

      {visualMode !== "hidden" ? (
        <BouquetShowcase
          className={
            visualMode === "mobile-only" ? styles.mobileOnlyVisual : undefined
          }
        />
      ) : null}
    </div>
  );

  return (
    <section className="section" id="byg-din-buket">
      {contained ? <div className="container">{content}</div> : content}
    </section>
  );
}
