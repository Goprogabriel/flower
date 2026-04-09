import { bouquetDetails } from "@/content/landing-page";
import { buildBouquetPath } from "@/lib/site-paths";
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
  const wrapperClassName = `${styles.wrapper} ${
    visualMode === "mobile-only" ? styles.singleColumnDesktop : ""
  }`;

  const content = (
    <div className={wrapperClassName}>
      <div className={styles.copy}>
        <span className="eyebrow">Personlige blomster med omtanke</span>
        <h1>Byg din egen blomsterbuket</h1>
        <p>Vælg bund, blomster og kort, og sammensæt en personlig buket på få minutter.</p>

        <div className={styles.actions}>
          <ButtonLink href={buildBouquetPath} size="large">
            Byg din egen buket
          </ButtonLink>
        </div>

        <ul className={styles.metrics} aria-label="Vigtige fordele">
          {bouquetDetails.map((detail) => (
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
