"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createBouquetDraftQueryString } from "@/lib/bouquet-draft";
import { useLanguage } from "@/components/i18n/language-provider";
import {
  getDefaultBouquetCardMessage,
  getDefaultBouquetCardTitle,
  replaceCount
} from "@/lib/i18n";
import {
  createAbsoluteShareUrl,
  createLocalizedQueryString,
  openBouquetPath
} from "@/lib/site-paths";
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
  const { language, translations, createLocalizedPath, localizeLabel } =
    useLanguage();
  const [cardTitle, setCardTitle] = useState(
    initialCardTitle?.trim() || getDefaultBouquetCardTitle(language)
  );
  const [cardMessage, setCardMessage] = useState(
    initialCardMessage?.trim() || getDefaultBouquetCardMessage(language)
  );
  const [selectedBackgroundIds, setSelectedBackgroundIds] = useState(
    createInitialBackgroundSelectionFromIds(backgrounds, initialBackgroundIds)
  );
  const [flowerSelection, setFlowerSelection] = useState<FlowerSelection>(
    createInitialFlowerSelectionFromIds(flowers, initialFlowerIds)
  );
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");
  const previousLanguageRef = useRef(language);

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
  const digitalBouquetPath = createLocalizedPath(
    openBouquetPath,
    currentDraftQueryString
  );

  const backgroundError =
    selectedBackgrounds.length === 0 ? translations.builder.backgroundError : null;
  const flowerError =
    totalFlowers < MIN_FLOWERS
      ? replaceCount(translations.builder.flowerErrorMin, MIN_FLOWERS)
      : totalFlowers > MAX_FLOWERS
        ? replaceCount(translations.builder.flowerErrorMax, MAX_FLOWERS)
        : null;
  const isValid = !backgroundError && !flowerError;

  useEffect(() => {
    const previousLanguage = previousLanguageRef.current;

    if (previousLanguage === language) {
      return;
    }

    const previousDefaultTitle = getDefaultBouquetCardTitle(previousLanguage);
    const previousDefaultMessage = getDefaultBouquetCardMessage(previousLanguage);

    if (cardTitle.trim() === previousDefaultTitle) {
      setCardTitle(getDefaultBouquetCardTitle(language));
    }

    if (cardMessage.trim() === previousDefaultMessage) {
      setCardMessage(getDefaultBouquetCardMessage(language));
    }

    previousLanguageRef.current = language;
  }, [cardMessage, cardTitle, language]);

  useEffect(() => {
    const selectedFlowerIds = getSelectedFlowerIds(flowers, flowerSelection);
    const queryString = createBouquetDraftQueryString({
      backgroundIds: selectedBackgroundIds,
      flowerIds: selectedFlowerIds,
      cardTitle,
      cardMessage
    });
    const localizedQueryString = createLocalizedQueryString(queryString, language);
    const nextSearch = localizedQueryString ? `?${localizedQueryString}` : "";

    if (window.location.search === nextSearch) {
      return;
    }

    // Keep the current bouquet shareable without triggering a full app navigation.
    window.history.replaceState(
      window.history.state,
      "",
      `${window.location.pathname}${nextSearch}${window.location.hash}`
    );
  }, [
    cardMessage,
    cardTitle,
    flowerSelection,
    flowers,
    language,
    selectedBackgroundIds
  ]);

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
      await navigator.clipboard.writeText(createAbsoluteShareUrl(digitalBouquetPath));
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
  }

  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <div className={styles.layout}>
          <div className={styles.controls}>
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <span className={styles.step}>{`${translations.builder.step} 1`}</span>
                  <h2>{translations.builder.backgroundTitle}</h2>
                </div>
                <strong>{`${selectedBackgrounds.length} ${translations.builder.selected}`}</strong>
              </div>

              <p className={styles.helper}>{translations.builder.backgroundHelper}</p>

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
                          alt={localizeLabel(background.label)}
                          fill
                          sizes="(max-width: 720px) 44vw, 18vw"
                          className={styles.assetImage}
                        />
                      </div>
                      <span>{localizeLabel(background.label)}</span>
                    </button>
                  );
                })}
              </div>

              {backgroundError ? <p className={styles.error}>{backgroundError}</p> : null}
            </section>

            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <span className={styles.step}>{`${translations.builder.step} 2`}</span>
                  <h2>{translations.builder.flowerTitle}</h2>
                </div>
                <strong>{`${totalFlowers} / 9 ${translations.builder.selected}`}</strong>
              </div>

              <p className={styles.helper}>{translations.builder.flowerHelper}</p>

              <div className={styles.flowerGrid}>
                {flowers.map((flower) => {
                  const quantity = flowerSelection[flower.id] ?? 0;

                  return (
                    <article key={flower.id} className={styles.flowerCard}>
                      <div className={styles.flowerThumb}>
                        <Image
                          src={flower.src}
                          alt={localizeLabel(flower.label)}
                          fill
                          sizes="(max-width: 720px) 40vw, 12vw"
                          className={styles.assetImage}
                        />
                      </div>

                      <div className={styles.flowerBody}>
                        <div className={styles.flowerMeta}>
                          <strong>{localizeLabel(flower.label)}</strong>
                          <span>
                            {quantity === 0
                              ? translations.builder.notSelectedYet
                              : `${quantity} ${translations.builder.quantitySelected}`}
                          </span>
                        </div>

                        <div className={styles.quantityControls}>
                          <button
                            type="button"
                            className={styles.quantityButton}
                            onClick={() => updateFlowerQuantity(flower.id, -1)}
                            disabled={quantity === 0}
                            aria-label={`${translations.builder.removeOne} ${localizeLabel(
                              flower.label
                            )}`}
                          >
                            -
                          </button>
                          <span className={styles.quantityValue}>{quantity}</span>
                          <button
                            type="button"
                            className={styles.quantityButton}
                            onClick={() => updateFlowerQuantity(flower.id, 1)}
                            disabled={totalFlowers >= MAX_FLOWERS}
                            aria-label={`${translations.builder.addOne} ${localizeLabel(
                              flower.label
                            )}`}
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
                  <span className={styles.step}>{`${translations.builder.step} 3`}</span>
                  <h2>{translations.builder.cardTitle}</h2>
                </div>
                <strong>{translations.builder.cardReady}</strong>
              </div>

              <p className={styles.helper}>{translations.builder.cardHelper}</p>

              <div className={styles.messageForm}>
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>{translations.builder.titleLabel}</span>
                  <input
                    type="text"
                    value={cardTitle}
                    onChange={(event) => setCardTitle(event.target.value)}
                    placeholder={translations.builder.titlePlaceholder}
                    maxLength={40}
                  />
                </label>

                <label className={styles.field}>
                  <span className={styles.fieldLabel}>{translations.builder.messageLabel}</span>
                  <textarea
                    value={cardMessage}
                    onChange={(event) => setCardMessage(event.target.value)}
                    placeholder={translations.builder.messagePlaceholder}
                    rows={4}
                    maxLength={180}
                  />
                </label>
              </div>
            </section>

            <section className={styles.summaryCard} aria-live="polite">
              <div>
                <span className={styles.step}>{`${translations.builder.step} 4`}</span>
                <h2>
                  {isValid
                    ? translations.builder.summaryReady
                    : translations.builder.summaryIncomplete}
                </h2>
              </div>

              <p className={styles.helper}>
                {isValid
                  ? translations.builder.summaryValid
                  : translations.builder.summaryInvalid}
              </p>

              <div className={styles.summaryStats}>
                <div>
                  <span>{translations.builder.backgrounds}</span>
                  <strong>{selectedBackgrounds.length}</strong>
                </div>
                <div>
                  <span>{translations.builder.flowers}</span>
                  <strong>{totalFlowers}</strong>
                </div>
              </div>

              <button
                type="button"
                className={`${styles.completeButton} ${isValid ? styles.completeButtonReady : ""}`}
                disabled={!isValid}
              >
                {isValid
                  ? translations.builder.completeReady
                  : translations.builder.completeIncomplete}
              </button>

              <div className={styles.digitalBouquetCard}>
                <div className={styles.digitalBouquetHeader}>
                  <div>
                    <span className={styles.step}>{translations.builder.digitalKicker}</span>
                    <h3>{translations.builder.digitalTitle}</h3>
                  </div>
                </div>

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
                    {translations.builder.openDigital}
                  </Link>

                  <button
                    type="button"
                    className={styles.digitalBouquetCopy}
                    onClick={copyDigitalBouquetLink}
                    disabled={!isValid}
                  >
                    {copyState === "copied"
                      ? translations.builder.linkCopied
                      : copyState === "error"
                        ? translations.builder.linkCopyFailed
                        : translations.builder.copyLink}
                  </button>
                </div>
              </div>
            </section>
          </div>

          <div className={styles.previewPanel}>
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
      </div>
    </section>
  );
}
