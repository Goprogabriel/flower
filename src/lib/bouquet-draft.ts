import type { BouquetAsset, BouquetDraft } from "@/types/bouquet";

const DEFAULT_CARD_TITLE = "Til dig";
const BASE64_PREFIX = "b64:";
const CARD_MESSAGES = [
  "Jeg har plukket denne buket til dig.",
  "En lille buket til en, jeg holder af.",
  "Håber blomsterne gør din dag lidt finere.",
  "Denne buket er valgt med varme tanker."
];

function randomCount(min: number, max: number, random: () => number) {
  return Math.floor(random() * (max - min + 1)) + min;
}

function shuffle<T>(items: T[], random: () => number) {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const nextIndex = Math.floor(random() * (index + 1));
    [copy[index], copy[nextIndex]] = [copy[nextIndex], copy[index]];
  }

  return copy;
}

function pickUniqueIds(
  items: BouquetAsset[],
  count: number,
  random: () => number
) {
  return shuffle(items, random)
    .slice(0, Math.max(1, Math.min(count, items.length)))
    .map((item) => item.id);
}

function pickRepeatedIds(
  items: BouquetAsset[],
  count: number,
  random: () => number
) {
  return Array.from({ length: count }, () => {
    const index = Math.floor(random() * items.length);

    return items[index]?.id ?? "";
  }).filter(Boolean);
}

export function createRandomBouquetDraft(
  backgrounds: BouquetAsset[],
  flowers: BouquetAsset[],
  random: () => number = Math.random
): BouquetDraft {
  if (backgrounds.length === 0 || flowers.length === 0) {
    return {
      backgroundIds: [],
      flowerIds: [],
      cardTitle: DEFAULT_CARD_TITLE,
      cardMessage: CARD_MESSAGES[0]
    };
  }

  const backgroundCount =
    backgrounds.length === 1 ? 1 : randomCount(1, Math.min(2, backgrounds.length), random);
  const flowerCount = randomCount(6, 9, random);
  const cardMessage =
    CARD_MESSAGES[Math.floor(random() * CARD_MESSAGES.length)] ?? CARD_MESSAGES[0];

  return {
    backgroundIds: pickUniqueIds(backgrounds, backgroundCount, random),
    flowerIds: pickRepeatedIds(flowers, flowerCount, random),
    cardTitle: DEFAULT_CARD_TITLE,
    cardMessage
  };
}

function asArray(value: string | string[] | undefined) {
  if (!value) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}

function encodeBase64(value: string) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary);
}

function decodeBase64(value: string) {
  const binary = atob(value);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));

  return new TextDecoder().decode(bytes);
}

function encodeCardField(value: string) {
  return `${BASE64_PREFIX}${encodeBase64(value)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/u, "")}`;
}

function decodeCardField(value: string | undefined) {
  if (!value?.startsWith(BASE64_PREFIX)) {
    return value;
  }

  const normalizedValue = value
    .slice(BASE64_PREFIX.length)
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const paddedValue = normalizedValue.padEnd(
    Math.ceil(normalizedValue.length / 4) * 4,
    "="
  );

  try {
    return decodeBase64(paddedValue);
  } catch {
    return value;
  }
}

export function parseBouquetDraftFromSearchParams(searchParams: {
  [key: string]: string | string[] | undefined;
}): Partial<BouquetDraft> {
  const backgroundIds = asArray(searchParams.background);
  const flowerIds = asArray(searchParams.flower);
  const cardTitle = decodeCardField(asArray(searchParams.cardTitle)[0]);
  const cardMessage = decodeCardField(asArray(searchParams.cardMessage)[0]);

  return {
    backgroundIds,
    flowerIds,
    cardTitle,
    cardMessage
  };
}

export function parseBouquetDraftFromUrlSearchParams(searchParams: {
  getAll: (name: string) => string[];
  get: (name: string) => string | null;
}): Partial<BouquetDraft> {
  const backgroundIds = searchParams.getAll("background");
  const flowerIds = searchParams.getAll("flower");
  const cardTitle = decodeCardField(searchParams.get("cardTitle") ?? undefined);
  const cardMessage = decodeCardField(searchParams.get("cardMessage") ?? undefined);

  return {
    backgroundIds,
    flowerIds,
    cardTitle,
    cardMessage
  };
}

export function createBouquetDraftQueryString(draft: BouquetDraft) {
  const params = new URLSearchParams();

  draft.backgroundIds.forEach((backgroundId) => {
    params.append("background", backgroundId);
  });

  draft.flowerIds.forEach((flowerId) => {
    params.append("flower", flowerId);
  });

  params.set("cardTitle", encodeCardField(draft.cardTitle));
  params.set("cardMessage", encodeCardField(draft.cardMessage));

  return params.toString();
}

export const defaultBouquetCardTitle = DEFAULT_CARD_TITLE;
export const defaultBouquetCardMessage = CARD_MESSAGES[0];
