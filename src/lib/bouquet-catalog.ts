import { readdir } from "node:fs/promises";
import path from "node:path";
import { withBasePath } from "@/lib/site-paths";
import type { BouquetAsset } from "@/types/bouquet";

const ASSET_ROOT = path.join(process.cwd(), "public", "assets");

function getNumericPrefix(filename: string) {
  const [prefix] = filename.split("-");
  const parsed = Number.parseInt(prefix, 10);

  return Number.isNaN(parsed) ? Number.MAX_SAFE_INTEGER : parsed;
}

function sortAssetNames(left: string, right: string) {
  const prefixDelta = getNumericPrefix(left) - getNumericPrefix(right);

  if (prefixDelta !== 0) {
    return prefixDelta;
  }

  return left.localeCompare(right, "da");
}

function createFlowerLabel(filename: string, occurrence: number) {
  const [prefix] = filename.split("-");
  const variant = String.fromCharCode(64 + occurrence);

  return `Blomst ${prefix}${variant}`;
}

async function readAssetDirectory(
  directory: "baugrund" | "blomster"
): Promise<BouquetAsset[]> {
  const directoryPath = path.join(ASSET_ROOT, directory);
  const files = (await readdir(directoryPath))
    .filter((file) => file.toLowerCase().endsWith(".png"))
    .sort(sortAssetNames);

  const occurrences = new Map<string, number>();

  return files.map((filename) => {
    const [prefix] = filename.split("-");
    const occurrence = (occurrences.get(prefix) ?? 0) + 1;

    occurrences.set(prefix, occurrence);

    const label =
      directory === "baugrund"
        ? `Bund ${prefix}`
        : createFlowerLabel(filename, occurrence);

    return {
      id: `${directory}-${filename.replace(/\.[^.]+$/, "")}`,
      label,
      src: withBasePath(`/assets/${directory}/${filename}`)
    };
  });
}

export async function getBouquetCatalog() {
  const [backgrounds, flowers] = await Promise.all([
    readAssetDirectory("baugrund"),
    readAssetDirectory("blomster")
  ]);

  return {
    backgrounds,
    flowers
  };
}
