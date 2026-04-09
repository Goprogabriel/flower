# Flower

Et lille blomsterunivers bygget i Next.js, hvor man kan:

- bygge sin egen buket med bund, blomster og kort
- dele en digital buket som deeplink
- aabne buketten i en animeret `open-buket` oplevelse

## Proev Siden

Live URL:

[https://goprogabriel.github.io/flower/](https://goprogabriel.github.io/flower/)

Direkte links:

- [Forside](https://goprogabriel.github.io/flower/)
- [Byg buket](https://goprogabriel.github.io/flower/byg-buket/)
- [Open buket](https://goprogabriel.github.io/flower/open-buket/)

## Hvad Det Er

Projektet er lavet som en let, delbar blomsterside med fokus paa:

- enkel buketbygger
- mobilvenligt layout
- personlige kortbeskeder
- deling via URL
- en separat animationsside til den digitale buket

## Lokal Udvikling

```bash
npm install
npm run dev
```

Appen koerer lokalt paa:

[http://localhost:3000](http://localhost:3000)

## GitHub Pages

Repo:

[https://github.com/Goprogabriel/flower](https://github.com/Goprogabriel/flower)

Projektet er klargjort til gratis hosting via GitHub Pages og bygger statisk til repo-stien `/flower`.

Saadan deployer du:

1. Push til `main`.
2. Gaa til `Settings > Pages`.
3. Vaelg `GitHub Actions` som source.
4. Vent paa workflowen `Deploy GitHub Pages`.

Workflowen bygger siden og publicerer `out/` automatisk.

## Tech

- Next.js App Router
- TypeScript
- Framer Motion
- statisk eksport til GitHub Pages

## Struktur

- `src/app`: routes, layouts og globale styles
- `src/components/builder`: buketbygger og preview
- `src/components/open-bouquet`: den delbare animationsside
- `src/components/sections`: forsidekomponenter
- `src/lib`: draft-logik, katalog og route-helpers
- `public/assets`: blomster- og bundbilleder
