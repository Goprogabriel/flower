"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  createBouquetDraftQueryString,
  defaultBouquetCardMessage,
  defaultBouquetCardTitle
} from "@/lib/bouquet-draft";
import type { BouquetAsset } from "@/types/bouquet";
import { BouquetPreview } from "./bouquet-preview";
import styles from "./bouquet-builder.module.css";

type BouquetBuilderProps = {
  backgrounds: BouquetAsset[];
  flowers: BouquetAsset[];
  initialBackgroundIds?: string[];
  initialFlowerIds?: string[];
  initialCardTitle?: string;
  initialCardMessage?: string;
};

type FlowerSelection = Record<string, number>;

const MIN_FLOWERS = 6;
const MAX_FLOWERS = 9;

function createInitialFlowerSelection(flowers: BouquetAsset[]) {
  const selection: FlowerSelection = {};

  flowers.slice(0, MIN_FLOWERS).forEach((flower) => {
    selection[flower.id] = 1;
  });

  return selection;
}

function createInitialBackgroundSelection(backgrounds: BouquetAsset[]) {
  return backgrounds.length > 0 ? [backgrounds[0].id] : [];
}

function createInitialFlowerSelectionFromIds(
  flowers: BouquetAsset[],
  initialFlowerIds?: string[]
) {
  if (!initialFlowerIds?.length) {
    return createInitialFlowerSelection(flowers);
  }

  const flowerIds = new Set(flowers.map((flower) => flower.id));
  const selection: FlowerSelection = {};

  initialFlowerIds.forEach((flowerId) => {
    if (!flowerIds.has(flowerId)) {
      return;
    }

    selection[flowerId] = (selection[flowerId] ?? 0) + 1;
  });

  const totalFlowers = getTotalFlowers(selection);

  if (totalFlowers < MIN_FLOWERS || totalFlowers > MAX_FLOWERS) {
    return createInitialFlowerSelection(flowers);
  }

  return selection;
}

function createInitialBackgroundSelectionFromIds(
  backgrounds: BouquetAsset[],
  initialBackgroundIds?: string[]
) {
  if (!initialBackgroundIds?.length) {
    return createInitialBackgroundSelection(backgrounds);
  }

  const backgroundIds = new Set(backgrounds.map((background) => background.id));
  const uniqueIds = Array.from(
    new Set(initialBackgroundIds.filter((backgroundId) => backgroundIds.has(backgroundId)))
  );

  return uniqueIds.length > 0
    ? uniqueIds
    : createInitialBackgroundSelection(backgrounds);
}

function getSelectedFlowers(flowers: BouquetAsset[], selection: FlowerSelection) {
  return flowers.flatMap((flower) =>
    Array.from({ length: selection[flower.id] ?? 0 }, () => flower)
  );
}

function getSelectedFlowerIds(flowers: BouquetAsset[], selection: FlowerSelection) {
  return flowers.flatMap((flower) =>
    Array.from({ length: selection[flower.id] ?? 0 }, () => flower.id)
  );
}

function getTotalFlowers(selection: FlowerSelection) {
  return Object.values(selection).reduce((total, amount) => total + amount, 0);
}

export function BouquetBuilder({
  backgrounds,
  flowers,
  initialBackgroundIds,
  initialFlowerIds,
  initialCardTitle,
  initialCardMessage
}: BouquetBuilderProps) {
  const [cardTitle, setCardTitle] = useState(
    initialCardTitle?.trim() || defaultBouquetCardTitle
  );
  const [cardMessage, setCardMessage] = useState(
    initialCardMessage?.trim() || defaultBouquetCardMessage
  );
  const [selectedBackgroundIds, setSelectedBackgroundIds] = useState(
    createInitialBackgroundSelectionFromIds(backgrounds, initialBackgroundIds)
  );
  const [flowerSelection, setFlowerSelection] = useState<FlowerSelection>(
    createInitialFlowerSelectionFromIds(flowers, initialFlowerIds)
  );
  const [shareOrigin, setShareOrigin] = useState("");
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");

  const selectedBackgrounds = backgrounds.filter((background) =>
    selectedBackgroundIds.includes(background.id)
  );
  const selectedFlowers = getSelectedFlowers(flowers, flowerSelection);
  const totalFlowers = selectedFlowers.length;
  const currentDraftQueryString = createBouquetDraftQueryString({
    backgroundIds: selectedBackgroundIds,
    flowerIds: getSelectedFlowerIds(flowers, flowerSelection),
    cardTitle,
    cardMessage
  });
  const digitalBouquetPath = `/open-buket?${currentDraftQueryString}`;
  const digitalBouquetUrl = shareOrigin
    ? `${shareOrigin}${digitalBouquetPath}`
    : digitalBouquetPath;

  const backgroundError =
    selectedBackgrounds.length === 0 ? "Du skal vælge mindst 1 bund." : null;
  const flowerError =
    totalFlowers < MIN_FLOWERS
      ? `Du skal vælge mindst ${MIN_FLOWERS} blomster.`
      : totalFlowers > MAX_FLOWERS
        ? `Du kan højst vælge ${MAX_FLOWERS} blomster.`
        : null;
  const isValid = !backgroundError && !flowerError;

  useEffect(() => {
    setShareOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    const selectedFlowerIds = getSelectedFlowerIds(flowers, flowerSelection);
    const queryString = createBouquetDraftQueryString({
      backgroundIds: selectedBackgroundIds,
      flowerIds: selectedFlowerIds,
      cardTitle,
      cardMessage
    });
    const nextSearch = queryString ? `?${queryString}` : "";

    if (window.location.search === nextSearch) {
      return;
    }

    // Keep the current bouquet shareable without triggering a full app navigation.
    window.history.replaceState(
      window.history.state,
      "",
      `${window.location.pathname}${nextSearch}${window.location.hash}`
    );
  }, [cardMessage, cardTitle, flowerSelection, flowers, selectedBackgroundIds]);

  useEffect(() => {
    if (copyState === "idle") {
      return;
    }

    const timeoutId = window.setTimeout(() => setCopyState("idle"), 2200);

    return () => window.clearTimeout(timeoutId);
  }, [copyState]);

  function toggleBackground(backgroundId: string) {
    setSelectedBackgroundIds((current) =>
      current.includes(backgroundId)
        ? current.filter((id) => id !== backgroundId)
        : [...current, backgroundId]
    );
  }

  function updateFlowerQuantity(flowerId: string, delta: number) {
    setFlowerSelection((current) => {
      const currentTotal = getTotalFlowers(current);
      const currentAmount = current[flowerId] ?? 0;

      if (delta > 0 && currentTotal >= MAX_FLOWERS) {
        return current;
      }

      if (delta < 0 && currentAmount === 0) {
        return current;
      }

      const nextAmount = Math.max(0, currentAmount + delta);
      const nextSelection = { ...current };

      if (nextAmount === 0) {
        delete nextSelection[flowerId];
      } else {
        nextSelection[flowerId] = nextAmount;
      }

      return nextSelection;
    });
  }

  async function copyDigitalBouquetLink() {
    if (!isValid) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}${digitalBouquetPath}`
      );
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
  }

  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <div className={styles.hero}>
          <div className={styles.heroCopy}>
            <h1>Sammensæt din egen blomsterbuket</h1>
            <p>
              Vælg mindst én bund og mellem 6 og 9 blomster. Du må gerne vælge
              den samme blomst flere gange, så buketten får præcis det udtryk, du ønsker.
            </p>
          </div>
        </div>

        <div className={styles.layout}>
          <div className={styles.controls}>
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <span className={styles.step}>Trin 1</span>
                  <h2>Vælg bund</h2>
                </div>
                <strong>{selectedBackgrounds.length} valgt</strong>
              </div>

              <p className={styles.helper}>
                Vælg den eller de grønne bunde, der skal samle buketten og give den fylde.
              </p>

              <div className={styles.backgroundGrid}>
                {backgrounds.map((background) => {
                  const isSelected = selectedBackgroundIds.includes(background.id);

                  return (
                    <button
                      key={background.id}
                      type="button"
                      className={`${styles.backgroundCard} ${isSelected ? styles.selected : ""}`}
                      onClick={() => toggleBackground(background.id)}
                      aria-pressed={isSelected}
                    >
                      <div className={styles.backgroundThumb}>
                        <Image
                          src={background.src}
                          alt={background.label}
                          fill
                          sizes="(max-width: 720px) 44vw, 18vw"
                          className={styles.assetImage}
                        />
                      </div>
                      <span>{background.label}</span>
                    </button>
                  );
                })}
              </div>

              {backgroundError ? <p className={styles.error}>{backgroundError}</p> : null}
            </section>

            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <span className={styles.step}>Trin 2</span>
                  <h2>Vælg blomster</h2>
                </div>
                <strong>{totalFlowers} / 9 valgt</strong>
              </div>

              <p className={styles.helper}>
                Vælg mellem 6 og 9 blomster. Den samme blomst kan lægges i buketten
                flere gange ved at trykke på plus.
              </p>

              <div className={styles.flowerGrid}>
                {flowers.map((flower) => {
                  const quantity = flowerSelection[flower.id] ?? 0;

                  return (
                    <article key={flower.id} className={styles.flowerCard}>
                      <div className={styles.flowerThumb}>
                        <Image
                          src={flower.src}
                          alt={flower.label}
                          fill
                          sizes="(max-width: 720px) 40vw, 12vw"
                          className={styles.assetImage}
                        />
                      </div>

                      <div className={styles.flowerBody}>
                        <div className={styles.flowerMeta}>
                          <strong>{flower.label}</strong>
                          <span>{quantity === 0 ? "Ikke valgt endnu" : `${quantity} stk. valgt`}</span>
                        </div>

                        <div className={styles.quantityControls}>
                          <button
                            type="button"
                            className={styles.quantityButton}
                            onClick={() => updateFlowerQuantity(flower.id, -1)}
                            disabled={quantity === 0}
                            aria-label={`Fjern en ${flower.label}`}
                          >
                            -
                          </button>
                          <span className={styles.quantityValue}>{quantity}</span>
                          <button
                            type="button"
                            className={styles.quantityButton}
                            onClick={() => updateFlowerQuantity(flower.id, 1)}
                            disabled={totalFlowers >= MAX_FLOWERS}
                            aria-label={`Tilføj en ${flower.label}`}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              {flowerError ? <p className={styles.error}>{flowerError}</p> : null}
            </section>

            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <span className={styles.step}>Trin 3</span>
                  <h2>Tilføj et kort</h2>
                </div>
                <strong>Klar til hilsen</strong>
              </div>

              <p className={styles.helper}>
                Skriv en lille titel og en personlig tekst til den, der skal have buketten.
              </p>

              <div className={styles.messageForm}>
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>Titel</span>
                  <input
                    type="text"
                    value={cardTitle}
                    onChange={(event) => setCardTitle(event.target.value)}
                    placeholder="Til dig"
                    maxLength={40}
                  />
                </label>

                <label className={styles.field}>
                  <span className={styles.fieldLabel}>Tekst</span>
                  <textarea
                    value={cardMessage}
                    onChange={(event) => setCardMessage(event.target.value)}
                    placeholder="Skriv en lille hilsen"
                    rows={4}
                    maxLength={180}
                  />
                </label>
              </div>
            </section>

            <section className={styles.summaryCard} aria-live="polite">
              <div>
                <span className={styles.step}>Trin 4</span>
                <h2>{isValid ? "Din buket er klar" : "Du mangler et par valg"}</h2>
              </div>

              <p className={styles.helper}>
                {isValid
                  ? "Du har valgt mindst 1 bund og mellem 6 og 9 blomster."
                  : "Færdiggør både bund og blomster, før buketten er klar."}
              </p>

              <div className={styles.summaryStats}>
                <div>
                  <span>Bunde</span>
                  <strong>{selectedBackgrounds.length}</strong>
                </div>
                <div>
                  <span>Blomster</span>
                  <strong>{totalFlowers}</strong>
                </div>
              </div>

              <button
                type="button"
                className={`${styles.completeButton} ${isValid ? styles.completeButtonReady : ""}`}
                disabled={!isValid}
              >
                {isValid ? "Klar buket" : "Færdiggør valgene"}
              </button>

              <div className={styles.digitalBouquetCard}>
                <div className={styles.digitalBouquetHeader}>
                  <div>
                    <span className={styles.step}>Digital buket</span>
                    <h3>Del kortet og buketten med animation</h3>
                  </div>
                </div>

                <p className={styles.helper}>
                  Linket aabner en side, hvor kortet foerst folder sig ud, og
                  buketten derefter kommer frem.
                </p>

                <div className={styles.digitalBouquetActions}>
                  <Link
                    href={digitalBouquetPath}
                    className={`${styles.digitalBouquetLink} ${
                      !isValid ? styles.digitalBouquetLinkDisabled : ""
                    }`}
                    aria-disabled={!isValid}
                    onClick={(event) => {
                      if (!isValid) {
                        event.preventDefault();
                      }
                    }}
                  >
                    Aabn digital buket
                  </Link>

                  <button
                    type="button"
                    className={styles.digitalBouquetCopy}
                    onClick={copyDigitalBouquetLink}
                    disabled={!isValid}
                  >
                    {copyState === "copied"
                      ? "Link kopieret"
                      : copyState === "error"
                        ? "Kunne ikke kopiere"
                        : "Kopier link"}
                  </button>
                </div>

                <p className={styles.digitalBouquetUrl}>
                  {isValid
                    ? digitalBouquetUrl
                    : "Faerdiggoer buketten for at faa et delbart link."}
                </p>
              </div>
            </section>
          </div>

          <BouquetPreview
            backgrounds={selectedBackgrounds}
            flowers={selectedFlowers}
            totalFlowers={totalFlowers}
            isValid={Boolean(isValid)}
            cardTitle={cardTitle}
            cardMessage={cardMessage}
          />
        </div>
      </div>
    </section>
  );
}
