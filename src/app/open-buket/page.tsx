import type { Metadata } from "next";
import { OpenBouquetExperience } from "@/components/open-bouquet/open-bouquet-experience";
import { getBouquetCatalog } from "@/lib/bouquet-catalog";
import {
  createBouquetDraftQueryString,
  createRandomBouquetDraft,
  defaultBouquetCardMessage,
  defaultBouquetCardTitle,
  parseBouquetDraftFromSearchParams
} from "@/lib/bouquet-draft";
import type { BouquetAsset, BouquetDraft } from "@/types/bouquet";

export const metadata: Metadata = {
  title: "Open buket",
  description:
    "Aabn et digitalt kort og se blomsterbuketten folde sig ud med animationer og personlig hilsen."
};

type OpenBouquetPageProps = {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
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
  backgrounds: BouquetAsset[],
  flowers: BouquetAsset[]
) {
  const hasSelection =
    Boolean(draft.backgroundIds?.length) || Boolean(draft.flowerIds?.length);

  if (!hasSelection) {
    return createRandomBouquetDraft(backgrounds, flowers);
  }

  return {
    backgroundIds: draft.backgroundIds ?? [],
    flowerIds: draft.flowerIds ?? [],
    cardTitle: draft.cardTitle?.trim() || defaultBouquetCardTitle,
    cardMessage: draft.cardMessage?.trim() || defaultBouquetCardMessage
  };
}

export default async function OpenBouquetPage({
  searchParams
}: OpenBouquetPageProps) {
  const { backgrounds, flowers } = await getBouquetCatalog();
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const initialDraft = parseBouquetDraftFromSearchParams(resolvedSearchParams);
  const draft = resolveDraft(initialDraft, backgrounds, flowers);
  const selectedBackgrounds = resolveBackgrounds(backgrounds, draft.backgroundIds);
  const selectedFlowers = resolveFlowers(flowers, draft.flowerIds);
  const builderPath = `/byg-buket?${createBouquetDraftQueryString(draft)}`;

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
