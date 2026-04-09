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
  const { translations, createLocalizedPath } = useLanguage();
  const wrapperClassName = `${styles.wrapper} ${
    visualMode === "mobile-only" ? styles.singleColumnDesktop : ""
  }`;

  const content = (
    <div className={wrapperClassName}>
      <div className={styles.copy}>
        <span className="eyebrow">{translations.hero.eyebrow}</span>
        <h1>{translations.hero.title}</h1>
        <p>{translations.hero.description}</p>

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
