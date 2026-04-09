export const supportedLanguages = ["da", "en", "de"] as const;

export type LanguageCode = (typeof supportedLanguages)[number];

export const defaultLanguage: LanguageCode = "da";

const translations = {
  da: {
    languageLabel: "Sprog",
    languageNames: {
      da: "Dansk",
      en: "English",
      de: "Deutsch"
    },
    assetPrefixes: {
      background: "Bund",
      flower: "Blomst"
    },
    defaults: {
      cardTitle: "Til dig",
      cardMessage: "En lille buket til en, jeg holder af.",
      randomMessages: [
        "Jeg har plukket denne buket til dig.",
        "En lille buket til en, jeg holder af.",
        "Håber blomsterne gør din dag lidt finere.",
        "Denne buket er valgt med varme tanker."
      ]
    },
    hero: {
      eyebrow: "Personlige blomster med omtanke",
      title: "Byg din egen blomsterbuket",
      description: "Vælg bund, blomster og kort, og sammensæt en personlig buket på få minutter.",
      cta: "Byg din egen buket",
      metricsLabel: "Vigtige fordele",
      metrics: [
        {
          value: "1 bund",
          label: "vælg den grønne base der skal samle buketten"
        },
        {
          value: "6-9 blomster",
          label: "mix dine favoritter og vælg gerne den samme flere gange"
        },
        {
          value: "Et kort",
          label: "gør buketten mere personlig med en lille hilsen"
        }
      ]
    },
    randomShowcase: {
      newBouquet: "Ny buket",
      customizeBouquet: "Tilpas buketten"
    },
    builder: {
      step: "Trin",
      selected: "valgt",
      backgroundTitle: "Vælg bund",
      backgroundHelper:
        "Vælg den eller de grønne bunde, der skal samle buketten og give den fylde.",
      backgroundError: "Du skal vælge mindst 1 bund.",
      flowerTitle: "Vælg blomster",
      flowerHelper:
        "Vælg mellem 6 og 9 blomster. Den samme blomst kan lægges i buketten flere gange ved at trykke på plus.",
      flowerErrorMin: "Du skal vælge mindst {count} blomster.",
      flowerErrorMax: "Du kan højst vælge {count} blomster.",
      notSelectedYet: "Ikke valgt endnu",
      quantitySelected: "stk. valgt",
      removeOne: "Fjern en",
      addOne: "Tilføj en",
      cardTitle: "Tilføj et kort",
      cardReady: "Klar til hilsen",
      cardHelper:
        "Skriv en lille titel og en personlig tekst til den, der skal have buketten.",
      titleLabel: "Titel",
      titlePlaceholder: "Til dig",
      messageLabel: "Tekst",
      messagePlaceholder: "Skriv en lille hilsen",
      summaryReady: "Din buket er klar",
      summaryIncomplete: "Du mangler et par valg",
      summaryValid: "Du har valgt mindst 1 bund og mellem 6 og 9 blomster.",
      summaryInvalid: "Færdiggør både bund og blomster, før buketten er klar.",
      backgrounds: "Bunde",
      flowers: "Blomster",
      completeReady: "Klar buket",
      completeIncomplete: "Færdiggør valgene",
      digitalKicker: "Digital buket",
      digitalTitle: "Del kortet og buketten med animation",
      openDigital: "Åbn digital buket",
      copyLink: "Kopier link",
      linkCopied: "Link kopieret",
      linkCopyFailed: "Kunne ikke kopiere"
    },
    preview: {
      kicker: "Forhåndsvisning",
      ready: "Buketten er klar",
      current: "Din buket",
      emptyState: "Vælg mindst 1 bund for at se buketten.",
      backgrounds: "Bunde",
      flowers: "Blomster",
      card: "Kort",
      personalMessage: "Personlig hilsen",
      signature: "Med varme tanker",
      messagePlaceholder: "Skriv en lille hilsen til kortet."
    },
    footer: {
      description: "Byg en enkel buket med blomster, bund og en lille hilsen til en, du holder af."
    },
    openBouquet: {
      recipientKicker: "Til modtageren",
      order: "Bestil"
    }
  },
  en: {
    languageLabel: "Language",
    languageNames: {
      da: "Dansk",
      en: "English",
      de: "Deutsch"
    },
    assetPrefixes: {
      background: "Base",
      flower: "Flower"
    },
    defaults: {
      cardTitle: "For you",
      cardMessage: "A small bouquet for someone I care about.",
      randomMessages: [
        "I picked this bouquet for you.",
        "A small bouquet for someone I care about.",
        "I hope these flowers brighten your day.",
        "This bouquet was chosen with warm thoughts."
      ]
    },
    hero: {
      eyebrow: "Thoughtful flowers, made personal",
      title: "Build your own flower bouquet",
      description: "Choose the base, flowers and card, then compose a personal bouquet in minutes.",
      cta: "Build your own bouquet",
      metricsLabel: "Key details",
      metrics: [
        {
          value: "1 base",
          label: "choose the green base that brings the bouquet together"
        },
        {
          value: "6-9 flowers",
          label: "mix your favorites and reuse the same flower if you like"
        },
        {
          value: "A card",
          label: "make the bouquet more personal with a short note"
        }
      ]
    },
    randomShowcase: {
      newBouquet: "New bouquet",
      customizeBouquet: "Customize bouquet"
    },
    builder: {
      step: "Step",
      selected: "selected",
      backgroundTitle: "Choose base",
      backgroundHelper:
        "Choose one or more green bases to give the bouquet structure and fullness.",
      backgroundError: "You must choose at least 1 base.",
      flowerTitle: "Choose flowers",
      flowerHelper:
        "Choose between 6 and 9 flowers. You can add the same flower more than once by pressing plus.",
      flowerErrorMin: "You must choose at least {count} flowers.",
      flowerErrorMax: "You can choose at most {count} flowers.",
      notSelectedYet: "Not selected yet",
      quantitySelected: "pcs. selected",
      removeOne: "Remove one",
      addOne: "Add one",
      cardTitle: "Add a card",
      cardReady: "Ready for a note",
      cardHelper: "Write a short title and a personal message for the recipient.",
      titleLabel: "Title",
      titlePlaceholder: "For you",
      messageLabel: "Message",
      messagePlaceholder: "Write a short note",
      summaryReady: "Your bouquet is ready",
      summaryIncomplete: "A few choices are still missing",
      summaryValid: "You have selected at least 1 base and between 6 and 9 flowers.",
      summaryInvalid: "Finish both the base and flowers before the bouquet is ready.",
      backgrounds: "Bases",
      flowers: "Flowers",
      completeReady: "Bouquet ready",
      completeIncomplete: "Finish your choices",
      digitalKicker: "Digital bouquet",
      digitalTitle: "Share the card and bouquet with animation",
      openDigital: "Open digital bouquet",
      copyLink: "Copy link",
      linkCopied: "Link copied",
      linkCopyFailed: "Could not copy"
    },
    preview: {
      kicker: "Preview",
      ready: "The bouquet is ready",
      current: "Your bouquet",
      emptyState: "Choose at least 1 base to see the bouquet.",
      backgrounds: "Bases",
      flowers: "Flowers",
      card: "Card",
      personalMessage: "Personal note",
      signature: "With warm thoughts",
      messagePlaceholder: "Write a short note for the card."
    },
    footer: {
      description: "Build a simple bouquet with flowers, a base and a small note for someone you care about."
    },
    openBouquet: {
      recipientKicker: "For the recipient",
      order: "Order"
    }
  },
  de: {
    languageLabel: "Sprache",
    languageNames: {
      da: "Dansk",
      en: "English",
      de: "Deutsch"
    },
    assetPrefixes: {
      background: "Basis",
      flower: "Blume"
    },
    defaults: {
      cardTitle: "Für dich",
      cardMessage: "Ein kleiner Strauß für jemanden, der mir am Herzen liegt.",
      randomMessages: [
        "Ich habe diesen Strauß für dich gepflückt.",
        "Ein kleiner Strauß für jemanden, der mir am Herzen liegt.",
        "Ich hoffe, diese Blumen machen deinen Tag ein wenig schöner.",
        "Dieser Strauß wurde mit lieben Gedanken ausgewählt."
      ]
    },
    hero: {
      eyebrow: "Persönliche Blumen mit Gefühl",
      title: "Stelle deinen eigenen Blumenstrauß zusammen",
      description: "Wähle Basis, Blumen und Karte und gestalte in wenigen Minuten einen persönlichen Strauß.",
      cta: "Eigenen Strauß gestalten",
      metricsLabel: "Wichtige Details",
      metrics: [
        {
          value: "1 Basis",
          label: "wähle die grüne Basis, die den Strauß zusammenhält"
        },
        {
          value: "6-9 Blumen",
          label: "kombiniere deine Favoriten und nutze Blumen gern mehrfach"
        },
        {
          value: "Eine Karte",
          label: "mach den Strauß mit einer kurzen Nachricht persönlicher"
        }
      ]
    },
    randomShowcase: {
      newBouquet: "Neuer Strauß",
      customizeBouquet: "Strauß anpassen"
    },
    builder: {
      step: "Schritt",
      selected: "ausgewählt",
      backgroundTitle: "Basis wählen",
      backgroundHelper:
        "Wähle eine oder mehrere grüne Basen, die dem Strauß Form und Fülle geben.",
      backgroundError: "Du musst mindestens 1 Basis wählen.",
      flowerTitle: "Blumen wählen",
      flowerHelper:
        "Wähle zwischen 6 und 9 Blumen. Dieselbe Blume kann durch Plus mehrfach hinzugefügt werden.",
      flowerErrorMin: "Du musst mindestens {count} Blumen wählen.",
      flowerErrorMax: "Du kannst höchstens {count} Blumen wählen.",
      notSelectedYet: "Noch nicht ausgewählt",
      quantitySelected: "ausgewählt",
      removeOne: "Eine entfernen",
      addOne: "Eine hinzufügen",
      cardTitle: "Karte hinzufügen",
      cardReady: "Bereit für eine Nachricht",
      cardHelper: "Schreibe einen kurzen Titel und eine persönliche Nachricht für den Empfänger.",
      titleLabel: "Titel",
      titlePlaceholder: "Für dich",
      messageLabel: "Nachricht",
      messagePlaceholder: "Schreibe eine kurze Nachricht",
      summaryReady: "Dein Strauß ist fertig",
      summaryIncomplete: "Ein paar Auswahlen fehlen noch",
      summaryValid: "Du hast mindestens 1 Basis und zwischen 6 und 9 Blumen gewählt.",
      summaryInvalid: "Vervollständige Basis und Blumen, bevor der Strauß fertig ist.",
      backgrounds: "Basen",
      flowers: "Blumen",
      completeReady: "Strauß fertig",
      completeIncomplete: "Auswahl abschließen",
      digitalKicker: "Digitaler Strauß",
      digitalTitle: "Teile Karte und Strauß mit Animation",
      openDigital: "Digitalen Strauß öffnen",
      copyLink: "Link kopieren",
      linkCopied: "Link kopiert",
      linkCopyFailed: "Kopieren fehlgeschlagen"
    },
    preview: {
      kicker: "Vorschau",
      ready: "Der Strauß ist fertig",
      current: "Dein Strauß",
      emptyState: "Wähle mindestens 1 Basis, um den Strauß zu sehen.",
      backgrounds: "Basen",
      flowers: "Blumen",
      card: "Karte",
      personalMessage: "Persönliche Nachricht",
      signature: "Mit lieben Gedanken",
      messagePlaceholder: "Schreibe eine kurze Nachricht für die Karte."
    },
    footer: {
      description: "Stelle einen schlichten Strauß mit Blumen, Basis und einer kleinen Nachricht für einen lieben Menschen zusammen."
    },
    openBouquet: {
      recipientKicker: "Für den Empfänger",
      order: "Bestellen"
    }
  }
} as const;

export type Translations = (typeof translations)[LanguageCode];

export function getLanguage(value: string | null | undefined): LanguageCode {
  return supportedLanguages.includes(value as LanguageCode)
    ? (value as LanguageCode)
    : defaultLanguage;
}

export function getTranslations(language: LanguageCode) {
  return translations[language];
}

export function getDefaultBouquetCardTitle(language: LanguageCode) {
  return translations[language].defaults.cardTitle;
}

export function getDefaultBouquetCardMessage(language: LanguageCode) {
  return translations[language].defaults.cardMessage;
}

export function getRandomBouquetCardMessage(
  language: LanguageCode,
  random: () => number = Math.random
) {
  const messages = translations[language].defaults.randomMessages;

  return messages[Math.floor(random() * messages.length)] ?? messages[0];
}

export function replaceCount(template: string, count: number) {
  return template.replace("{count}", String(count));
}

export function localizeAssetLabel(label: string, language: LanguageCode) {
  if (label.startsWith("Bund ")) {
    return label.replace("Bund ", `${translations[language].assetPrefixes.background} `);
  }

  if (label.startsWith("Blomst ")) {
    return label.replace("Blomst ", `${translations[language].assetPrefixes.flower} `);
  }

  return label;
}
