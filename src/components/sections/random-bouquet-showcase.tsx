"use client";

import Link from "next/link";
import { useState } from "react";
import { BouquetPreview } from "@/components/builder/bouquet-preview";
import { createBouquetDraftQueryString, createRandomBouquetDraft } from "@/lib/bouquet-draft";
import type { BouquetAsset, BouquetDraft } from "@/types/bouquet";
import styles from "./random-bouquet-showcase.module.css";

type RandomBouquetShowcaseProps = {
  backgrounds: BouquetAsset[];
  flowers: BouquetAsset[];
  initialDraft: BouquetDraft;
};

export function RandomBouquetShowcase({
  backgrounds,
  flowers,
  initialDraft
}: RandomBouquetShowcaseProps) {
  const [draft, setDraft] = useState(initialDraft);

  const selectedBackgrounds = backgrounds.filter((background) =>
    draft.backgroundIds.includes(background.id)
  );
  const selectedFlowers = draft.flowerIds
    .map((flowerId) => flowers.find((flower) => flower.id === flowerId))
    .filter((flower): flower is BouquetAsset => Boolean(flower));

  function regenerateDraft() {
    setDraft(createRandomBouquetDraft(backgrounds, flowers));
  }

  return (
    <div className={styles.wrapper}>
      <BouquetPreview
        backgrounds={selectedBackgrounds}
        flowers={selectedFlowers}
        totalFlowers={selectedFlowers.length}
        isValid
        cardTitle={draft.cardTitle}
        cardMessage={draft.cardMessage}
        showHeader={false}
        showMessagePreview={false}
      />

      <div className={styles.actions}>
        <button type="button" className={styles.regenerateButton} onClick={regenerateDraft}>
          Ny buket
        </button>
        <Link
          href={`/byg-buket?${createBouquetDraftQueryString(draft)}`}
          className={styles.orderButton}
        >
          Tilpas buketten
        </Link>
      </div>
    </div>
  );
}
