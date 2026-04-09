import type { Metadata } from "next";
import { OpenBouquetPage } from "@/components/open-bouquet/open-bouquet-page";
import { getBouquetCatalog } from "@/lib/bouquet-catalog";

export const metadata: Metadata = {
  title: "Open buket",
  description:
    "Aabn et digitalt kort og se blomsterbuketten folde sig ud med animationer og personlig hilsen."
};

export default async function OpenBouquetRoute() {
  const { backgrounds, flowers } = await getBouquetCatalog();

  return <OpenBouquetPage backgrounds={backgrounds} flowers={flowers} />;
}
