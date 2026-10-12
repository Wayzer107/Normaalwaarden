# Normaalwaarden NL

Naslagwerk (in het Nederlands) met referentiewaarden van **serum en bloedgas bij volwassenen**, volgens de
**Nederlandse laboratoriumpraktijk**: SI-eenheden (mmol/L, µmol/L, g/L), Hb in mmol/L, HbA1c in mmol/mol en
bloedgas in **kPa**.

Inhoud:

- 131 bepalingen in 16 categorieën (bloedgas, elektrolyten, nier, lever/pancreas, hart/spier, ontsteking, glucose,
  lipiden, ijzer/anemie, endocrinologie, hematologie, stolling, vitaminen, immunologie, tumormarkers, overig)
- per bepaling: representatief referentie-interval (man/vrouw waar relevant), **spreiding tussen Nederlandse
  laboratoria**, oorzaken van verhoogde/verlaagde waarden en praktische opmerkingen
- zoeken, geslachtsfilter, snelle waarde-check
- bloedgas-interpretatie (primaire stoornis, compensatie, anion gap, delta-ratio, P/F-ratio, A–a-gradiënt)
- rekenhulpen (eGFR CKD-EPI 2009/2021, gecorrigeerd calcium, osmolale gap, gecorrigeerd natrium, anion gap, TSAT)
- eenheden omrekenen (mmHg ↔ kPa, g/dL ↔ mmol/L, mg/dL ↔ µmol/L, HbA1c % ↔ mmol/mol, …)

> **Let op:** referentie-intervallen verschillen per laboratorium, analyser en methode. Het interval op de uitslag van
> het eigen laboratorium is altijd leidend. Dit is naslagmateriaal voor professionals en geen medisch hulpmiddel.

## Techniek

Statische site zonder build-stap en zonder externe afhankelijkheden (HTML, CSS, JavaScript). Werkt ook offline door
`index.html` te openen.

```
index.html          pagina
css/style.css       opmaak (licht/donker, responsief, printvriendelijk)
js/data.js          alle referentiewaarden en bronnen
js/calc.js          rekenfuncties (zonder DOM; getest met Node)
js/app.js           interface
tests/calc.test.js  unit tests voor de rekenfuncties
scripts/validate-data.js  controle van de datastructuur
```

Lokaal bekijken en testen:

```sh
npm run serve   # http://localhost:8000
npm test        # datavalidatie + unit tests
```

## Waarden aanpassen

Alle waarden staan in `js/data.js`. Een bepaling heeft de vorm:

```js
{
  id: "kreat", naam: "Kreatinine", afk: "Kreat", eenheid: "µmol/L",
  ref: MV(["65", "105"], ["50", "90"]),   // ALL(lo, hi) voor beide geslachten; null = open einde
  spreiding: "…verschillen per laboratorium…",
  hoog: "…", laag: "…", noot: "…"
}
```

Grenzen zijn strings met decimale komma, zodat de weergave exact blijft (`"4,0"`). Voer na een wijziging `npm test` uit.

## Publiceren (GitHub Pages)

De workflow `.github/workflows/pages.yml` test de site en publiceert deze bij elke push naar `main`.
Eenmalig instellen: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
