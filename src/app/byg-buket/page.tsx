import type { Metadata } from "next";
import { BouquetBuilder } from "@/components/builder/bouquet-builder";
import { getBouquetCatalog } from "@/lib/bouquet-catalog";
import { parseBouquetDraftFromSearchParams } from "@/lib/bouquet-draft";

export const metadata: Metadata = {
  title: "Byg din buket",
  description:
    "Vælg en bund og 6 til 9 blomster, og byg en buket til en, du holder af."
};

type BuildBouquetPageProps = {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function BuildBouquetPage({
  searchParams
}: BuildBouquetPageProps) {
  const { backgrounds, flowers } = await getBouquetCatalog();
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const initialDraft = parseBouquetDraftFromSearchParams(resolvedSearchParams);

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
