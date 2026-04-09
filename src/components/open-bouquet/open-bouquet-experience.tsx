"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
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

export function OpenBouquetExperience({
  backgrounds,
  flowers,
  cardTitle,
  cardMessage,
  builderPath
}: OpenBouquetExperienceProps) {
  const { language, translations, localizeLabel } = useLanguage();
  const prefersReducedMotion = useReducedMotion();
  const [isCardOpen, setIsCardOpen] = useState(prefersReducedMotion);
  const [showMessage, setShowMessage] = useState(prefersReducedMotion);
  const [showBouquet, setShowBouquet] = useState(prefersReducedMotion);

  useEffect(() => {
    if (prefersReducedMotion) {
      setIsCardOpen(true);
      setShowMessage(true);
      setShowBouquet(true);
      return;
    }

    setIsCardOpen(false);
    setShowMessage(false);
    setShowBouquet(false);

    const openTimer = window.setTimeout(() => setIsCardOpen(true), 450);
    const messageTimer = window.setTimeout(() => setShowMessage(true), 1080);
    const bouquetTimer = window.setTimeout(() => setShowBouquet(true), 1820);

    return () => {
      window.clearTimeout(openTimer);
      window.clearTimeout(messageTimer);
      window.clearTimeout(bouquetTimer);
    };
  }, [prefersReducedMotion]);

  const safeTitle = cardTitle.trim() || getDefaultBouquetCardTitle(language);
  const safeMessage = cardMessage.trim() || getDefaultBouquetCardMessage(language);

  return (
    <section className={styles.section}>
      <div className={styles.backgroundWash} />
      <div className={styles.backgroundGlow} />

      <div className={styles.container}>
        <div className={styles.stage}>
          <div className={styles.stageLight} />

          <motion.div
            className={styles.cardCluster}
            animate={
              showBouquet
                ? { x: -8, y: -10, rotate: -4 }
                : { x: 0, y: 8, rotate: -1.5 }
            }
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
          >
            <div className={styles.envelopeShadow} />
            <div className={styles.envelope}>
              <motion.div
                className={styles.envelopeFlap}
                animate={{ rotateX: isCardOpen ? -180 : 0 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.72, ease: [0.2, 0.8, 0.2, 1] }}
              />
              <div className={styles.envelopeBase} />

              <motion.div
                className={styles.letter}
                animate={
                  isCardOpen
                    ? { y: -168, rotate: -4, boxShadow: "0 28px 50px rgba(117, 85, 48, 0.18)" }
                    : { y: 52, rotate: 0, boxShadow: "0 12px 24px rgba(117, 85, 48, 0.08)" }
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
                      transition={{ duration: prefersReducedMotion ? 0 : 0.62, ease: "easeOut" }}
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

          <AnimatePresence initial={false}>
            {showBouquet ? (
              <motion.div
                className={styles.bouquetScene}
                initial={{
                  opacity: 0,
                  y: 72,
                  scale: 0.84,
                  filter: "blur(14px)"
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  filter: "blur(0px)"
                }}
                exit={{ opacity: 0, y: 24, scale: 0.96 }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.95,
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
                      <motion.div
                        key={`${flower.id}-${index}`}
                        className={styles.flowerLayer}
                        style={flowerSlots[index]}
                        initial={{ opacity: 0, y: 12, scale: 0.88 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                          delay: 0.18 + index * 0.06,
                          duration: prefersReducedMotion ? 0 : 0.42,
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
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      <motion.div
        className={styles.bottomAction}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: showBouquet ? 1 : 0, y: showBouquet ? 0 : 16 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.5, ease: "easeOut" }}
      >
        <div className={styles.bottomActionInner}>
          <Link href={builderPath} className={styles.orderButton}>
            {translations.openBouquet.order}
          </Link>
          <LanguageSwitcher />
        </div>
      </motion.div>
    </section>
  );
}
