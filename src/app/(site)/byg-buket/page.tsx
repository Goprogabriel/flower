import type { Metadata } from "next";
import { BouquetBuilderPage } from "@/components/builder/bouquet-builder-page";
import { getBouquetCatalog } from "@/lib/bouquet-catalog";

export const metadata: Metadata = {
  title: "Byg din buket",
  description:
    "Vælg en bund og 6 til 9 blomster, og byg en buket til en, du holder af."
};

export default async function BuildBouquetPage() {
  const { backgrounds, flowers } = await getBouquetCatalog();

  return <BouquetBuilderPage backgrounds={backgrounds} flowers={flowers} />;
}
