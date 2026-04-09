"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { parseBouquetDraftFromUrlSearchParams } from "@/lib/bouquet-draft";
import type { BouquetAsset } from "@/types/bouquet";
import { BouquetBuilder } from "./bouquet-builder";

type BouquetBuilderPageProps = {
  backgrounds: BouquetAsset[];
  flowers: BouquetAsset[];
};

function BouquetBuilderPageContent({
  backgrounds,
  flowers
}: BouquetBuilderPageProps) {
  const searchParams = useSearchParams();
  const initialDraft = parseBouquetDraftFromUrlSearchParams(searchParams);

  return (
    <BouquetBuilder
      backgrounds={backgrounds}
      flowers={flowers}
      initialBackgroundIds={initialDraft.backgroundIds}
      initialFlowerIds={initialDraft.flowerIds}
      initialCardTitle={initialDraft.cardTitle}
      initialCardMessage={initialDraft.cardMessage}
    />
  );
}

export function BouquetBuilderPage({
  backgrounds,
  flowers
}: BouquetBuilderPageProps) {
  return (
    <Suspense fallback={<BouquetBuilder backgrounds={backgrounds} flowers={flowers} />}>
      <BouquetBuilderPageContent backgrounds={backgrounds} flowers={flowers} />
    </Suspense>
  );
}
