"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { useLanguage } from "@/components/i18n/language-provider";
import {
  getDefaultBouquetCardMessage,
  getDefaultBouquetCardTitle
} from "@/lib/i18n";
import type { BouquetAsset } from "@/types/bouquet";
import styles from "./open-bouquet-experience.module.css";

type OpenBouquetExperienceProps = {
  backgrounds: BouquetAsset[];
  flowers: BouquetAsset[];
  cardTitle: string;
  cardMessage: string;
  builderPath: string;
};

const backgroundSlots: CSSProperties[] = [
  {
    width: "92%",
    height: "78%",
    left: "50%",
    top: "22%",
    transform: "translateX(-50%) rotate(-3deg)",
    zIndex: 1
  },
  {
    width: "84%",
    height: "74%",
    left: "49%",
    top: "26%",
    transform: "translateX(-50%) rotate(4deg)",
    zIndex: 2
  },
  {
    width: "78%",
    height: "72%",
    left: "52%",
    top: "28%",
    transform: "translateX(-50%) rotate(-1deg)",
    zIndex: 3
  }
];

const flowerSlots: CSSProperties[] = [
  {
    width: "28%",
    height: "28%",
    left: "50%",
    top: "14%",
    transform: "translateX(-50%) rotate(-2deg)",
    zIndex: 15
  },
  {
    width: "25%",
    height: "25%",
    left: "30%",
    top: "20%",
    transform: "translateX(-50%) rotate(-18deg)",
    zIndex: 13
  },
  {
    width: "25%",
    height: "25%",
    left: "70%",
    top: "22%",
    transform: "translateX(-50%) rotate(16deg)",
    zIndex: 13
  },
  {
    width: "24%",
    height: "24%",
    left: "18%",
    top: "40%",
    transform: "translateX(-50%) rotate(-24deg)",
    zIndex: 10
  },
  {
    width: "24%",
    height: "24%",
    left: "82%",
    top: "41%",
    transform: "translateX(-50%) rotate(22deg)",
    zIndex: 10
  },
  {
    width: "23%",
    height: "23%",
    left: "50%",
    top: "36%",
    transform: "translateX(-50%) rotate(4deg)",
    zIndex: 14
  },
  {
    width: "20%",
    height: "20%",
    left: "36%",
    top: "55%",
    transform: "translateX(-50%) rotate(-14deg)",
    zIndex: 9
  },
  {
    width: "20%",
    height: "20%",
    left: "64%",
    top: "56%",
    transform: "translateX(-50%) rotate(12deg)",
    zIndex: 9
  },
  {
    width: "18%",
    height: "18%",
    left: "50%",
    top: "62%",
    transform: "translateX(-50%) rotate(2deg)",
    zIndex: 8
  }
];

const floatingPetals = [
  { left: "8%", top: "18%", delay: 0.05 },
  { left: "19%", top: "72%", delay: 0.18 },
  { left: "68%", top: "12%", delay: 0.26 },
  { left: "84%", top: "64%", delay: 0.36 },
  { left: "58%", top: "80%", delay: 0.48 }
] as const;

const planeSparkles = [
  { left: "14%", top: "18%", delay: 0.12, duration: 1.15 },
  { left: "84%", top: "16%", delay: 0.34, duration: 1.32 },
  { left: "18%", top: "80%", delay: 0.24, duration: 1.22 },
  { left: "88%", top: "74%", delay: 0.46, duration: 1.42 }
] as const;

const driftingClouds = [
  { left: "-18%", top: "4%", width: "18rem", delay: -8.5, duration: 24, opacity: 0.58 },
  { left: "10%", top: "10%", width: "13rem", delay: -4.2, duration: 20, opacity: 0.46 },
  { left: "44%", top: "2.5%", width: "15rem", delay: -12.6, duration: 26, opacity: 0.56 },
  { left: "70%", top: "9%", width: "12rem", delay: -2.8, duration: 19, opacity: 0.42 }
] as const;

const windLayers = ["back", "mid", "front"] as const;

const windStreams = [
  { layer: "back", left: "2%", top: "16%", width: "38%", rotate: -10, delay: 0.05, duration: 2.4 },
  { layer: "back", left: "46%", top: "12%", width: "24%", rotate: 9, delay: 0.62, duration: 2.1 },
  { layer: "mid", left: "10%", top: "34%", width: "50%", rotate: -4, delay: 0.28, duration: 2.2 },
  { layer: "mid", left: "56%", top: "28%", width: "26%", rotate: 12, delay: 0.84, duration: 2.4 },
  { layer: "front", left: "14%", top: "54%", width: "42%", rotate: 7, delay: 0.18, duration: 1.9 },
  { layer: "front", left: "52%", top: "58%", width: "34%", rotate: -13, delay: 0.58, duration: 2.05 },
  { layer: "mid", left: "26%", top: "74%", width: "30%", rotate: 10, delay: 0.4, duration: 1.8 }
] as const;

const windCurls = [
  { layer: "back", left: "18%", top: "22%", width: "10%", height: "4.5%", rotate: -12, delay: 0.2, duration: 1.55 },
  { layer: "mid", left: "68%", top: "40%", width: "9%", height: "4.2%", rotate: 14, delay: 0.44, duration: 1.48 },
  { layer: "front", left: "34%", top: "66%", width: "8%", height: "3.8%", rotate: 8, delay: 0.1, duration: 1.24 },
  { layer: "front", left: "72%", top: "18%", width: "7%", height: "3.4%", rotate: -18, delay: 0.52, duration: 1.36 }
] as const;

const introTimeline = {
  revealEnvelope: 2800,
  hidePlane: 3320,
  openCard: 3560,
  revealMessage: 4220,
  revealBouquet: 4900
} as const;

export function OpenBouquetExperience({
  backgrounds,
  flowers,
  cardTitle,
  cardMessage,
  builderPath
}: OpenBouquetExperienceProps) {
  const { language, translations, localizeLabel } = useLanguage();
  const prefersReducedMotion = useReducedMotion();
  const reduceMotion = Boolean(prefersReducedMotion);
  const [isPhoneViewport, setIsPhoneViewport] = useState(false);
  const [showPlane, setShowPlane] = useState(!prefersReducedMotion);
  const [showEnvelope, setShowEnvelope] = useState(prefersReducedMotion);
  const [isCardOpen, setIsCardOpen] = useState(prefersReducedMotion);
  const [showMessage, setShowMessage] = useState(prefersReducedMotion);
  const [showBouquet, setShowBouquet] = useState(prefersReducedMotion);
  const [activeMobilePane, setActiveMobilePane] = useState<0 | 1>(0);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 860px)");
    const updateViewport = () => setIsPhoneViewport(mediaQuery.matches);

    updateViewport();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", updateViewport);

      return () => mediaQuery.removeEventListener("change", updateViewport);
    }

    mediaQuery.addListener(updateViewport);

    return () => mediaQuery.removeListener(updateViewport);
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      setShowPlane(false);
      setShowEnvelope(true);
      setIsCardOpen(true);
      setShowMessage(true);
      setShowBouquet(true);
      return;
    }

    setShowPlane(true);
    setShowEnvelope(false);
    setIsCardOpen(false);
    setShowMessage(false);
    setShowBouquet(false);

    const revealEnvelopeTimer = window.setTimeout(
      () => setShowEnvelope(true),
      introTimeline.revealEnvelope
    );
    const hidePlaneTimer = window.setTimeout(
      () => setShowPlane(false),
      introTimeline.hidePlane
    );
    const openTimer = window.setTimeout(
      () => setIsCardOpen(true),
      introTimeline.openCard
    );
    const messageTimer = window.setTimeout(
      () => setShowMessage(true),
      introTimeline.revealMessage
    );
    const bouquetTimer = window.setTimeout(
      () => setShowBouquet(true),
      introTimeline.revealBouquet
    );

    return () => {
      window.clearTimeout(revealEnvelopeTimer);
      window.clearTimeout(hidePlaneTimer);
      window.clearTimeout(openTimer);
      window.clearTimeout(messageTimer);
      window.clearTimeout(bouquetTimer);
    };
  }, [reduceMotion]);

  useEffect(() => {
    if (!isPhoneViewport) {
      setActiveMobilePane(0);
    }
  }, [isPhoneViewport]);

  const safeTitle = cardTitle.trim() || getDefaultBouquetCardTitle(language);
  const safeMessage = cardMessage.trim() || getDefaultBouquetCardMessage(language);
  const openLetterOffset = isPhoneViewport ? -118 : -168;
  const closedLetterOffset = isPhoneViewport ? 52 : 52;
  const bouquetIntroX = isPhoneViewport ? -72 : -118;
  const bouquetIntroY = isPhoneViewport ? 56 : 72;
  const settledCardMotion = isPhoneViewport
    ? { x: 0, y: -2, rotate: -2.5 }
    : { x: -8, y: -10, rotate: -4 };
  const restingCardMotion = isPhoneViewport
    ? { x: 0, y: 8, rotate: -1 }
    : { x: 0, y: 6, rotate: -1.5 };
  const cardSceneContent = (
    <div className={styles.cardScene}>
      <motion.div
        key={showEnvelope ? "arrival-on" : "arrival-off"}
        className={styles.arrivalBurst}
        initial={false}
        animate={
          showEnvelope
            ? { opacity: [0, 0.95, 0], scale: [0.55, 1.06, 1.42] }
            : { opacity: 0, scale: 0.55 }
        }
        transition={{
          duration: reduceMotion ? 0 : 1.1,
          times: [0, 0.34, 1],
          ease: "easeOut"
        }}
      />

      <motion.div
        className={styles.cardCluster}
        initial={false}
        animate={
          showEnvelope
            ? showBouquet
              ? {
                  opacity: 1,
                  ...settledCardMotion,
                  scale: 1,
                  filter: "blur(0px)"
                }
              : {
                  opacity: 1,
                  ...restingCardMotion,
                  scale: 1,
                  filter: "blur(0px)"
                }
            : {
                opacity: 0,
                x: 0,
                y: 24,
                rotate: -7,
                scale: 0.76,
                filter: "blur(12px)"
              }
        }
        transition={{
          duration: reduceMotion ? 0 : 0.9,
          ease: [0.22, 0.87, 0.26, 1]
        }}
      >
        <div className={styles.envelopeShadow} />
        <div className={styles.envelope}>
          <motion.div
            className={styles.envelopeFlap}
            animate={{ rotateX: isCardOpen ? -180 : 0 }}
            transition={{
              duration: reduceMotion ? 0 : 0.72,
              ease: [0.2, 0.8, 0.2, 1]
            }}
          />
          <div className={styles.envelopeBase} />

          <motion.div
            className={styles.letter}
            animate={
              isCardOpen
                ? {
                    y: openLetterOffset,
                    rotate: -4,
                    boxShadow: "0 28px 50px rgba(117, 85, 48, 0.18)"
                  }
                : {
                    y: closedLetterOffset,
                    rotate: 0,
                    boxShadow: "0 12px 24px rgba(117, 85, 48, 0.08)"
                  }
            }
            transition={{ type: "spring", stiffness: 130, damping: 18 }}
          >
            <AnimatePresence initial={false}>
              {showMessage ? (
                <motion.div
                  className={styles.letterContent}
                  initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.62,
                    ease: "easeOut"
                  }}
                >
                  <span className={styles.letterKicker}>
                    {translations.openBouquet.recipientKicker}
                  </span>
                  <strong>{safeTitle}</strong>
                  <p>{safeMessage}</p>
                  <span className={styles.letterSignature}>
                    {translations.preview.signature}
                  </span>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>

          <div className={styles.envelopeFront} />
        </div>
      </motion.div>
    </div>
  );
  const bouquetSceneContent = (
    <AnimatePresence initial={false}>
      {showBouquet ? (
        <motion.div
          className={styles.bouquetScene}
          initial={{
            opacity: 0,
            x: bouquetIntroX,
            y: bouquetIntroY,
            rotate: -8,
            scale: 0.74,
            filter: "blur(16px)"
          }}
          animate={{
            opacity: 1,
            x: 0,
            y: 0,
            rotate: 0,
            scale: 1,
            filter: "blur(0px)"
          }}
          exit={{ opacity: 0, x: 0, y: 24, scale: 0.96 }}
          transition={{
            duration: reduceMotion ? 0 : 1.05,
            ease: [0.18, 0.9, 0.24, 1]
          }}
        >
          <div className={styles.bouquetFrame}>
            <div className={styles.bouquetGlow} />

            {floatingPetals.map((petal, index) => (
              <motion.span
                key={`${petal.left}-${petal.top}`}
                className={styles.petal}
                style={{ left: petal.left, top: petal.top }}
                animate={{
                  opacity: [0.18, 0.8, 0.18],
                  y: [0, -14, 0],
                  x: [0, 8, 0],
                  rotate: [0, 16, -6]
                }}
                transition={{
                  delay: petal.delay,
                  duration: 3.2 + index * 0.18,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "mirror"
                }}
              />
            ))}

            <div className={styles.canvas}>
              {backgrounds.map((background, index) => (
                <div
                  key={background.id}
                  className={styles.backgroundLayer}
                  style={backgroundSlots[index % backgroundSlots.length]}
                >
                  <Image
                    src={background.src}
                    alt={localizeLabel(background.label)}
                    fill
                    sizes="(max-width: 900px) 70vw, 30vw"
                    className={styles.assetImage}
                    priority={index === 0}
                  />
                </div>
              ))}

              {flowers.slice(0, flowerSlots.length).map((flower, index) => (
                <div
                  key={`${flower.id}-${index}`}
                  className={styles.flowerSlot}
                  style={flowerSlots[index]}
                >
                  <motion.div
                    className={styles.flowerLayer}
                    initial={{ opacity: 0, y: 12, scale: 0.88 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      delay: 0.18 + index * 0.06,
                      duration: reduceMotion ? 0 : 0.42,
                      ease: "easeOut"
                    }}
                  >
                    <Image
                      src={flower.src}
                      alt={localizeLabel(flower.label)}
                      fill
                      sizes="(max-width: 900px) 22vw, 10vw"
                      className={styles.assetImage}
                    />
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      ) : isPhoneViewport ? (
        <div className={styles.mobilePanePlaceholder} />
      ) : null}
    </AnimatePresence>
  );

  return (
    <section className={styles.section}>
      <div className={styles.backgroundWash} />
      <div className={styles.backgroundGlow} />
      {!reduceMotion ? (
        <div className={styles.introScene} aria-hidden="true">
          <div
            className={`${styles.cloudField} ${
              showEnvelope ? styles.cloudFieldSettled : ""
            }`}
          >
            {driftingClouds.map((cloud, index) => (
              <span
                key={`${cloud.left}-${cloud.top}-${index}`}
                className={styles.cloud}
                style={
                  {
                    left: cloud.left,
                    top: cloud.top,
                    width: cloud.width,
                    opacity: cloud.opacity,
                    animationDelay: `${cloud.delay}s`,
                    animationDuration: `${cloud.duration}s`
                  } satisfies CSSProperties
                }
              />
            ))}
          </div>

          <div
            className={`${styles.windField} ${
              showEnvelope ? styles.windFieldSettled : ""
            }`}
          >
            {windLayers.map((layer) => (
              <div
                key={layer}
                className={`${styles.windLayer} ${
                  layer === "back"
                    ? styles.windLayerBack
                    : layer === "mid"
                      ? styles.windLayerMid
                      : styles.windLayerFront
                }`}
              >
                {windStreams
                  .filter((stream) => stream.layer === layer)
                  .map((stream, index) => (
                    <span
                      key={`${layer}-stream-${index}`}
                      className={styles.windStreamFrame}
                      style={
                        {
                          left: stream.left,
                          top: stream.top,
                          width: stream.width,
                          transform: `rotate(${stream.rotate}deg)`
                        } satisfies CSSProperties
                      }
                    >
                      <span
                        className={styles.windStream}
                        style={
                          {
                            animationDelay: `${stream.delay}s`,
                            animationDuration: `${stream.duration}s`
                          } satisfies CSSProperties
                        }
                      />
                    </span>
                  ))}

                {windCurls
                  .filter((curl) => curl.layer === layer)
                  .map((curl, index) => (
                    <span
                      key={`${layer}-curl-${index}`}
                      className={styles.windCurlFrame}
                      style={
                        {
                          left: curl.left,
                          top: curl.top,
                          width: curl.width,
                          height: curl.height,
                          transform: `rotate(${curl.rotate}deg)`
                        } satisfies CSSProperties
                      }
                    >
                      <span
                        className={styles.windCurl}
                        style={
                          {
                            animationDelay: `${curl.delay}s`,
                            animationDuration: `${curl.duration}s`
                          } satisfies CSSProperties
                        }
                      />
                    </span>
                  ))}
              </div>
            ))}
          </div>

          <AnimatePresence initial={false}>
            {showPlane ? (
              <motion.div
                className={styles.paperPlaneFlight}
                initial={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                animate={
                  showEnvelope
                    ? { opacity: 0.26, scale: 0.98, filter: "blur(1px)" }
                    : { opacity: 1, scale: 1, filter: "blur(0px)" }
                }
                exit={{ opacity: 0, scale: 1.08, filter: "blur(8px)" }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              >
                <div className={styles.paperPlaneFlightInner}>
                  <div className={styles.paperPlane}>
                    <svg
                      viewBox="0 0 180 124"
                      className={styles.paperPlaneSvg}
                      role="presentation"
                    >
                      <defs>
                        <linearGradient id="plane-paper" x1="0%" x2="100%" y1="0%" y2="100%">
                          <stop offset="0%" stopColor="rgba(255,252,247,0.98)" />
                          <stop offset="100%" stopColor="rgba(241,221,198,0.98)" />
                        </linearGradient>
                        <linearGradient id="plane-shadow" x1="0%" x2="100%" y1="0%" y2="100%">
                          <stop offset="0%" stopColor="rgba(210,175,142,0.55)" />
                          <stop offset="100%" stopColor="rgba(176,130,91,0.18)" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M12 66L166 12L104 112L83 74L12 66Z"
                        fill="url(#plane-paper)"
                        stroke="rgba(180, 145, 109, 0.52)"
                        strokeWidth="2.5"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M83 74L104 112L92 70L166 12L83 74Z"
                        fill="url(#plane-shadow)"
                        opacity="0.75"
                      />
                      <path
                        d="M58 66L165 12L92 70"
                        fill="none"
                        stroke="rgba(174, 136, 98, 0.38)"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      <path
                        d="M82 74L62 58"
                        fill="none"
                        stroke="rgba(174, 136, 98, 0.34)"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>

                  {planeSparkles.map((sparkle) => (
                    <span
                      key={`${sparkle.left}-${sparkle.top}`}
                      className={styles.planeSparkle}
                      style={
                        {
                          left: sparkle.left,
                          top: sparkle.top,
                          animationDelay: `${sparkle.delay}s`,
                          animationDuration: `${sparkle.duration}s`
                        } satisfies CSSProperties
                      }
                    />
                  ))}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      ) : null}

      <div className={styles.container}>
        <div className={styles.stage}>
          <div className={styles.stageLight} />
          {isPhoneViewport ? (
            <div className={styles.mobileExperience}>
              <div
                className={styles.mobileSwiper}
                onScroll={(event) => {
                  const nextPane =
                    event.currentTarget.scrollLeft >
                    event.currentTarget.clientWidth / 2
                      ? 1
                      : 0;

                  if (nextPane !== activeMobilePane) {
                    setActiveMobilePane(nextPane);
                  }
                }}
              >
                <div className={`${styles.mobilePane} ${styles.mobilePaneLetter}`}>
                  {cardSceneContent}
                </div>
                <div className={`${styles.mobilePane} ${styles.mobilePaneBouquet}`}>
                  {bouquetSceneContent}
                </div>
              </div>

              <div className={styles.mobileIndicator} aria-hidden="true">
                <span
                  className={`${styles.mobileIndicatorDot} ${
                    activeMobilePane === 0 ? styles.mobileIndicatorDotActive : ""
                  }`}
                />
                <span
                  className={`${styles.mobileIndicatorDot} ${
                    activeMobilePane === 1 ? styles.mobileIndicatorDotActive : ""
                  }`}
                />
              </div>
            </div>
          ) : (
            <>
              {cardSceneContent}
              {bouquetSceneContent}
            </>
          )}
        </div>
      </div>

      <motion.div
        className={styles.floatingAction}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: showBouquet ? 1 : 0, y: showBouquet ? 0 : 16 }}
        transition={{ duration: reduceMotion ? 0 : 0.5, ease: "easeOut" }}
      >
        <Link href={builderPath} className={styles.orderButton}>
          {translations.openBouquet.order}
        </Link>
      </motion.div>
    </section>
  );
}
