import styles from "./bouquet-showcase.module.css";

type BouquetShowcaseProps = {
  className?: string;
};

export function BouquetShowcase({ className }: BouquetShowcaseProps) {
  return (
    <div className={`${styles.visual} ${className ?? ""}`}>
      <div className={styles.heroCard}>
        <div className={styles.heroCardTop}>
          <span>Til en du holder af</span>
          <strong>Byg buketten selv</strong>
        </div>

        <div className={styles.bouquetAura}>
          <span className={styles.stemOne} />
          <span className={styles.stemTwo} />
          <span className={styles.stemThree} />
          <span className={styles.stemFour} />
          <span className={styles.ribbon} />
        </div>

        <div className={styles.visualTags}>
          <span>Vælg en bund</span>
          <span>Pluk blomster</span>
          <span>Skriv en hilsen</span>
        </div>

        <div className={styles.noteCard}>
          <span>En enkel tanke</span>
          <p>Skab en buket, der føles varm, rolig og personlig.</p>
        </div>
      </div>
    </div>
  );
}
