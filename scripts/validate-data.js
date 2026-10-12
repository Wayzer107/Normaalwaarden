"use strict";
// Controleert de structuur en interne consistentie van js/data.js.
global.window = {};
require("../js/data.js");
const { secties, bronnen } = window.NW_DATA;

const fouten = [];
const ids = new Set();
let aantal = 0;

for (const s of secties) {
  if (!s.id || !s.titel) fouten.push(`sectie zonder id/titel: ${JSON.stringify(s.titel)}`);
  for (const g of s.groepen) {
    for (const t of g.tests) {
      aantal++;
      const w = `${s.id}/${t.id || "(geen id)"}`;
      if (!t.id) fouten.push(`${w}: id ontbreekt`);
      if (ids.has(t.id)) fouten.push(`${w}: dubbel id`);
      ids.add(t.id);
      if (!t.naam) fouten.push(`${w}: naam ontbreekt`);
      if (!t.eenheid) fouten.push(`${w}: eenheid ontbreekt`);
      if (!t.ref) { fouten.push(`${w}: ref ontbreekt`); continue; }
      const refs = t.ref.all ? [t.ref.all] : [t.ref.m, t.ref.v];
      if (!t.ref.all && (!t.ref.m || !t.ref.v)) fouten.push(`${w}: ref moet 'all' of 'm' en 'v' bevatten`);
      for (const r of refs.filter(Boolean)) {
        if (r.lo == null && r.hi == null) fouten.push(`${w}: interval zonder grenzen`);
        if (r.loN != null && Number.isNaN(r.loN)) fouten.push(`${w}: ondergrens niet numeriek (${r.lo})`);
        if (r.hiN != null && Number.isNaN(r.hiN)) fouten.push(`${w}: bovengrens niet numeriek (${r.hi})`);
        if (r.loN != null && r.hiN != null && !(r.loN < r.hiN)) fouten.push(`${w}: ondergrens ≥ bovengrens (${r.lo}–${r.hi})`);
      }
      if (!t.noCheck && !t.tekst && !t.spreiding && !t.hoog && !t.laag && !t.noot) fouten.push(`${w}: geen toelichting`);
    }
  }
}
for (const b of bronnen) if (!/^https:\/\//.test(b.url)) fouten.push(`bron zonder https-URL: ${b.naam}`);

if (fouten.length) {
  console.error(fouten.map((f) => "✗ " + f).join("\n"));
  process.exit(1);
}
console.log(`Data in orde: ${secties.length} secties, ${aantal} bepalingen, ${bronnen.length} bronnen.`);
