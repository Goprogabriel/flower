"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  createBouquetDraftQueryString,
  createRandomBouquetDraft,
  defaultBouquetCardMessage,
  defaultBouquetCardTitle,
  parseBouquetDraftFromUrlSearchParams
} from "@/lib/bouquet-draft";
import { buildBouquetPath, createPathWithQuery } from "@/lib/site-paths";
import type { BouquetAsset, BouquetDraft } from "@/types/bouquet";
import { OpenBouquetExperience } from "./open-bouquet-experience";

type OpenBouquetPageProps = {
  backgrounds: BouquetAsset[];
  flowers: BouquetAsset[];
};

function resolveBackgrounds(backgrounds: BouquetAsset[], backgroundIds: string[]) {
  return Array.from(new Set(backgroundIds))
    .map((backgroundId) => backgrounds.find((background) => background.id === backgroundId))
    .filter((background): background is BouquetAsset => Boolean(background));
}

function resolveFlowers(flowers: BouquetAsset[], flowerIds: string[]) {
  return flowerIds
    .map((flowerId) => flowers.find((flower) => flower.id === flowerId))
    .filter((flower): flower is BouquetAsset => Boolean(flower));
}

function resolveDraft(
  draft: Partial<BouquetDraft>,
  fallbackDraft: BouquetDraft
) {
  const hasSelection =
    Boolean(draft.backgroundIds?.length) || Boolean(draft.flowerIds?.length);

  if (!hasSelection) {
    return fallbackDraft;
  }

  return {
    backgroundIds: draft.backgroundIds ?? [],
    flowerIds: draft.flowerIds ?? [],
    cardTitle: draft.cardTitle?.trim() || defaultBouquetCardTitle,
    cardMessage: draft.cardMessage?.trim() || defaultBouquetCardMessage
  };
}

function OpenBouquetPageContent({
  backgrounds,
  flowers
}: OpenBouquetPageProps) {
  const searchParams = useSearchParams();
  const [fallbackDraft] = useState(() => createRandomBouquetDraft(backgrounds, flowers));
  const initialDraft = parseBouquetDraftFromUrlSearchParams(searchParams);
  const draft = useMemo(
    () => resolveDraft(initialDraft, fallbackDraft),
    [fallbackDraft, initialDraft]
  );
  const selectedBackgrounds = useMemo(
    () => resolveBackgrounds(backgrounds, draft.backgroundIds),
    [backgrounds, draft.backgroundIds]
  );
  const selectedFlowers = useMemo(
    () => resolveFlowers(flowers, draft.flowerIds),
    [draft.flowerIds, flowers]
  );
  const builderPath = createPathWithQuery(
    buildBouquetPath,
    createBouquetDraftQueryString(draft)
  );

  return (
    <OpenBouquetExperience
      backgrounds={selectedBackgrounds}
      flowers={selectedFlowers}
      cardTitle={draft.cardTitle}
      cardMessage={draft.cardMessage}
      builderPath={builderPath}
    />
  );
}

export function OpenBouquetPage({
  backgrounds,
  flowers
}: OpenBouquetPageProps) {
  return (
    <Suspense
      fallback={
        <OpenBouquetExperience
          backgrounds={backgrounds}
          flowers={flowers.slice(0, 9)}
          cardTitle={defaultBouquetCardTitle}
          cardMessage={defaultBouquetCardMessage}
          builderPath={buildBouquetPath}
        />
      }
    >
      <OpenBouquetPageContent backgrounds={backgrounds} flowers={flowers} />
    </Suspense>
  );
}
