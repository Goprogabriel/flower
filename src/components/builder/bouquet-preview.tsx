import Image from "next/image";
import type { CSSProperties } from "react";
import type { BouquetAsset } from "@/types/bouquet";
import styles from "./bouquet-preview.module.css";

type BouquetPreviewProps = {
  backgrounds: BouquetAsset[];
  flowers: BouquetAsset[];
  totalFlowers: number;
  isValid: boolean;
  cardTitle: string;
  cardMessage: string;
  showHeader?: boolean;
  showMessagePreview?: boolean;
};

const backgroundSlots: CSSProperties[] = [
  {
    width: "92%",
    height: "78%",
    left: "50%",
    top: "22%",
    transform: "translateX(-50%) rotate(-3deg)",
    zIndex: 1
  },
  {
    width: "84%",
    height: "74%",
    left: "49%",
    top: "26%",
    transform: "translateX(-50%) rotate(4deg)",
    zIndex: 2
  },
  {
    width: "78%",
    height: "72%",
    left: "52%",
    top: "28%",
    transform: "translateX(-50%) rotate(-1deg)",
    zIndex: 3
  }
];

const flowerSlots: CSSProperties[] = [
  {
    width: "28%",
    height: "28%",
    left: "50%",
    top: "14%",
    transform: "translateX(-50%) rotate(-2deg)",
    zIndex: 15
  },
  {
    width: "25%",
    height: "25%",
    left: "30%",
    top: "20%",
    transform: "translateX(-50%) rotate(-18deg)",
    zIndex: 13
  },
  {
    width: "25%",
    height: "25%",
    left: "70%",
    top: "22%",
    transform: "translateX(-50%) rotate(16deg)",
    zIndex: 13
  },
  {
    width: "24%",
    height: "24%",
    left: "18%",
    top: "40%",
    transform: "translateX(-50%) rotate(-24deg)",
    zIndex: 10
  },
  {
    width: "24%",
    height: "24%",
    left: "82%",
    top: "41%",
    transform: "translateX(-50%) rotate(22deg)",
    zIndex: 10
  },
  {
    width: "23%",
    height: "23%",
    left: "50%",
    top: "36%",
    transform: "translateX(-50%) rotate(4deg)",
    zIndex: 14
  },
  {
    width: "20%",
    height: "20%",
    left: "36%",
    top: "55%",
    transform: "translateX(-50%) rotate(-14deg)",
    zIndex: 9
  },
  {
    width: "20%",
    height: "20%",
    left: "64%",
    top: "56%",
    transform: "translateX(-50%) rotate(12deg)",
    zIndex: 9
  },
  {
    width: "18%",
    height: "18%",
    left: "50%",
    top: "62%",
    transform: "translateX(-50%) rotate(2deg)",
    zIndex: 8
  }
];

export function BouquetPreview({
  backgrounds,
  flowers,
  totalFlowers,
  isValid,
  cardTitle,
  cardMessage,
  showHeader = true,
  showMessagePreview = true
}: BouquetPreviewProps) {
  return (
    <aside className={styles.panel}>
      {showHeader ? (
        <div className={styles.panelHeader}>
          <span className={styles.kicker}>Forhåndsvisning</span>
          <strong>{isValid ? "Buketten er klar" : "Din buket"}</strong>
        </div>
      ) : null}

      <div className={styles.canvas}>
        <div className={styles.canvasGlow} />
        <div className={styles.canvasStage}>
          {backgrounds.length === 0 ? (
            <div className={styles.emptyState}>
              Vælg mindst 1 bund for at se buketten.
            </div>
          ) : null}

          {backgrounds.map((background, index) => (
            <div
              key={background.id}
              className={styles.backgroundLayer}
              style={backgroundSlots[index % backgroundSlots.length]}
            >
              <Image
                src={background.src}
                alt={background.label}
                fill
                sizes="(max-width: 960px) 80vw, 40vw"
                className={styles.assetImage}
                priority={index === 0}
              />
            </div>
          ))}

          {flowers.slice(0, flowerSlots.length).map((flower, index) => (
            <div
              key={`${flower.id}-${index}`}
              className={styles.flowerLayer}
              style={flowerSlots[index]}
            >
              <Image
                src={flower.src}
                alt={flower.label}
                fill
                sizes="(max-width: 960px) 24vw, 12vw"
                className={styles.assetImage}
              />
            </div>
          ))}
        </div>
      </div>

      <div className={styles.statusGrid}>
        <div className={styles.statusCard}>
          <span>Bunde</span>
          <strong>{backgrounds.length}</strong>
        </div>
        <div className={styles.statusCard}>
          <span>Blomster</span>
          <strong>{totalFlowers} / 9</strong>
        </div>
      </div>

      {showMessagePreview ? (
        <div className={styles.messagePreview}>
          <span className={styles.messageKicker}>Brev</span>
          <div className={styles.letter}>
            <div className={styles.letterPaper}>
              <span className={styles.letterTitle}>{cardTitle.trim() || "Til dig"}</span>
              <p>{cardMessage.trim() || "Skriv en lille hilsen til kortet."}</p>
              <span className={styles.letterSignature}>Med varme tanker</span>
            </div>
          </div>
        </div>
      ) : null}
    </aside>
  );
}
