import styles from "../page.module.css";
import { getBouquetCatalog } from "@/lib/bouquet-catalog";
import { createRandomBouquetDraft } from "@/lib/bouquet-draft";
import { HeroSection } from "@/components/sections/hero-section";
import { RandomBouquetShowcase } from "@/components/sections/random-bouquet-showcase";

export default async function HomePage() {
  const { backgrounds, flowers } = await getBouquetCatalog();
  const initialDraft = createRandomBouquetDraft(backgrounds, flowers);

  return (
    <div className={styles.homeShell}>
      <div className={styles.contentColumn}>
        <HeroSection contained={false} visualMode="hidden" />
      </div>
      <div className={styles.previewColumn}>
        <RandomBouquetShowcase
          backgrounds={backgrounds}
          flowers={flowers}
          initialDraft={initialDraft}
        />
      </div>
    </div>
  );
}
