# Blomster

Next.js landingpage med TypeScript og App Router som fundament for et blomsterunivers.

## Kom i gang

```bash
npm install
npm run dev
```

## Deploy til GitHub Pages

Projektet er klargjort til statisk eksport, saa det kan hostes gratis paa GitHub Pages.

1. Push repoet til GitHub.
2. Gaa til `Settings > Pages`.
3. Vaelg `GitHub Actions` som source.
4. Push til `main`, eller koer workflowen `Deploy GitHub Pages` manuelt.

Workflowen bygger siden statisk og publicerer mappen `out` til GitHub Pages.

## Struktur

- `src/app`: sider, layout og globale styles
- `src/components/layout`: header og footer
- `src/components/sections`: sideopdelte sektioner som hero og content blocks
- `src/components/ui`: genbrugelige UI-komponenter
- `src/content`: tekst og data til landingpagen
- `public/assets`: billeder, SVG'er og andre statiske filer
