"use client";

import { Suspense, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/components/i18n/language-provider";
import {
  createBouquetDraftQueryString,
  createRandomBouquetDraft,
  parseBouquetDraftFromUrlSearchParams
} from "@/lib/bouquet-draft";
import {
  getDefaultBouquetCardMessage,
  getDefaultBouquetCardTitle
} from "@/lib/i18n";
import {
  buildBouquetPath,
  createLocalizedPath,
  createLocalizedQueryString
} from "@/lib/site-paths";
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
  fallbackDraft: BouquetDraft,
  language: Parameters<typeof getDefaultBouquetCardTitle>[0]
) {
  const hasSelection =
    Boolean(draft.backgroundIds?.length) || Boolean(draft.flowerIds?.length);

  if (!hasSelection) {
    return fallbackDraft;
  }

  return {
    backgroundIds: draft.backgroundIds ?? [],
    flowerIds: draft.flowerIds ?? [],
    cardTitle: draft.cardTitle?.trim() || getDefaultBouquetCardTitle(language),
    cardMessage: draft.cardMessage?.trim() || getDefaultBouquetCardMessage(language)
  };
}

function OpenBouquetPageContent({
  backgrounds,
  flowers
}: OpenBouquetPageProps) {
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const fallbackDraft = useMemo(
    () => createRandomBouquetDraft(backgrounds, flowers, language),
    [backgrounds, flowers, language]
  );
  const initialDraft = parseBouquetDraftFromUrlSearchParams(searchParams);
  const draft = useMemo(
    () => resolveDraft(initialDraft, fallbackDraft, language),
    [fallbackDraft, initialDraft, language]
  );
  const selectedBackgrounds = useMemo(
    () => resolveBackgrounds(backgrounds, draft.backgroundIds),
    [backgrounds, draft.backgroundIds]
  );
  const selectedFlowers = useMemo(
    () => resolveFlowers(flowers, draft.flowerIds),
    [draft.flowerIds, flowers]
  );
  const currentDraftQueryString = createBouquetDraftQueryString(draft);
  const builderPath = createLocalizedPath(
    buildBouquetPath,
    language,
    currentDraftQueryString
  );

  useEffect(() => {
    const localizedQueryString = createLocalizedQueryString(
      currentDraftQueryString,
      language
    );
    const nextSearch = localizedQueryString ? `?${localizedQueryString}` : "";

    if (window.location.search === nextSearch) {
      return;
    }

    window.history.replaceState(
      window.history.state,
      "",
      `${window.location.pathname}${nextSearch}${window.location.hash}`
    );
  }, [currentDraftQueryString, language]);

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
  const { language } = useLanguage();

  return (
    <Suspense
      fallback={
        <OpenBouquetExperience
          backgrounds={backgrounds}
          flowers={flowers.slice(0, 9)}
          cardTitle={getDefaultBouquetCardTitle(language)}
          cardMessage={getDefaultBouquetCardMessage(language)}
          builderPath={createLocalizedPath(buildBouquetPath, language)}
        />
      }
    >
      <OpenBouquetPageContent backgrounds={backgrounds} flowers={flowers} />
    </Suspense>
  );
}
