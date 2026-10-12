"use strict";
const assert = require("node:assert/strict");
const C = require("../js/calc.js");

const close = (a, b, tol, msg) => assert.ok(Math.abs(a - b) <= tol, `${msg || ""} verwacht ${b}±${tol}, kreeg ${a}`);
let n = 0;
const t = (naam, fn) => { fn(); n++; console.log("ok -", naam); };

t("mmHg ↔ kPa", () => {
  close(C.mmHgToKpa(40), 5.333, 0.005, "40 mmHg");
  close(C.kpaToMmHg(13.3), 99.76, 0.05, "13,3 kPa");
});

t("Henderson–Hasselbalch: pH 7,40 / pCO2 5,3 kPa ≈ HCO3 24", () => {
  close(C.hco3FromPhPco2(7.4, 5.33), 24.3, 0.5);
});

t("Anion gap en albumine-correctie", () => {
  assert.equal(C.anionGap(140, 100, 24), 16);
  close(C.anionGapCorrected(12, 24), 17, 1e-9); // 12 + 0.25*(44-24) = 17
  close(C.anionGapCorrected(12, 44), 12, 1e-9);
});

t("Delta-ratio", () => {
  close(C.deltaRatio(24, 12), 1, 1e-9); // (24-12)/(24-12)
  assert.equal(C.deltaRatio(14, 26), null);
});

t("Winter: HCO3 12 → pCO2 ≈ 26 mmHg ≈ 3,5 kPa", () => {
  const w = C.wintersExpectedKpa(12);
  close(w.mid, 3.47, 0.02);
  close(w.hi - w.lo, 0.533, 0.01);
});

t("Gecorrigeerd calcium, osmolaliteit, natrium", () => {
  close(C.caCorrected(2.0, 30), 2.2, 1e-9);
  close(C.osmCalc(140, 5, 5), 290, 1e-9);
  close(C.naCorrected(130, 25.5), 136, 1e-9);
});

t("TSAT: ijzer 15 µmol/L, transferrine 2,5 g/L → 24%", () => {
  close(C.tsat(15, 2.5), 24, 1e-9);
});

t("CKD-EPI: kreatinine 80 µmol/L, man 50 jr", () => {
  // referentie: ca. 100 (2009) en 100 (2021)
  const e09 = C.ckdEpi(80, 50, false, 2009);
  const e21 = C.ckdEpi(80, 50, false, 2021);
  assert.ok(e09 > 95 && e09 < 105, `2009: ${e09}`);
  assert.ok(e21 > 95 && e21 < 108, `2021: ${e21}`);
});
t("CKD-EPI: kreatinine 150 µmol/L, vrouw 70 jr → ca. 30 (2009)", () => {
  const e = C.ckdEpi(150, 70, true, 2009);
  assert.ok(e > 28 && e < 36, `gevonden ${e}`);
});

t("Omrekeningen", () => {
  const g = (id) => C.OMREKENINGEN.find((o) => o.id === id);
  close(C.converteer(g("kreat"), 1, "voor"), 88.4, 1e-9);
  close(C.converteer(g("gluc"), 100, "voor"), 5.55, 0.01);
  close(C.converteer(g("hb"), 13, "voor"), 8.07, 0.01);
  close(C.converteer(g("hba1c"), 7, "voor"), 53.0, 0.1);
  close(C.converteer(g("hba1c"), 53, "terug"), 7.0, 0.01);
  close(C.converteer(g("chol"), 193, "voor"), 5.0, 0.02);
  close(C.converteer(g("vitd"), 20, "voor"), 49.9, 0.1);
});

const run = (inv) => C.interpreteerBloedgas(inv);
const tekst = (r) => r.regels.map((x) => x.tekst).join("\n");

t("Normaal bloedgas", () => {
  const r = run({ ph: 7.4, pco2: 5.3, hco3: 24 });
  assert.match(tekst(r), /Geen zuur-base-stoornis/);
});

t("Metabole acidose, adequaat gecompenseerd (DKA-achtig)", () => {
  // pH 7,20, HCO3 10, pCO2 = (1,5*10+8)*0,1333 = 3,07 kPa
  const r = run({ ph: 7.2, pco2: 3.1, hco3: 10, na: 135, cl: 98, alb: 40 });
  const x = tekst(r);
  assert.match(x, /Metabole acidose/);
  assert.match(x, /adequate respiratoire compensatie/);
  assert.match(x, /Verhoogd anion gap/);
  assert.match(x, /Delta-ratio/);
});

t("Metabole acidose met extra respiratoire acidose (onvoldoende compensatie)", () => {
  const r = run({ ph: 7.1, pco2: 5.5, hco3: 12 });
  assert.match(tekst(r), /onvoldoende compensatie/);
});

t("Acute respiratoire acidose", () => {
  // pCO2 9 kPa (67 mmHg): acuut HCO3 ≈ 26,7; chronisch ≈ 33
  const r = run({ ph: 7.25, pco2: 9.0, hco3: 26 });
  const x = tekst(r);
  assert.match(x, /Respiratoire acidose/);
  assert.match(x, /acute stoornis/);
});

t("Chronische respiratoire acidose (COPD)", () => {
  const r = run({ ph: 7.36, pco2: 8.5, hco3: 34 });
  const x = tekst(r);
  assert.match(x, /chronische stoornis/);
});

t("Metabole alkalose", () => {
  const r = run({ ph: 7.55, pco2: 6.0, hco3: 38 });
  assert.match(tekst(r), /Metabole alkalose/);
});

t("Respiratoire alkalose, acuut", () => {
  const r = run({ ph: 7.55, pco2: 3.0, hco3: 22 });
  const x = tekst(r);
  assert.match(x, /Respiratoire alkalose/);
  assert.match(x, /acute stoornis/);
});

t("HCO3 wordt berekend als niet ingevuld", () => {
  const r = run({ ph: 7.4, pco2: 5.3 });
  assert.match(tekst(r), /berekend uit pH en pCO₂/);
});

t("Oxygenatie: P/F en hypoxemie bij kamerlucht", () => {
  const r = run({ ph: 7.4, pco2: 4.0, hco3: 24, po2: 7.0, fio2: 0.21, leeftijd: 60 });
  const x = tekst(r);
  assert.match(x, /P\/F-ratio 33,3 kPa/);
  assert.match(x, /type 1/);
});

t("Onvoldoende invoer", () => {
  const r = run({ ph: 7.4 });
  assert.match(tekst(r), /minimaal pH en pCO₂/);
});

t("Weergave referentie-interval", () => {
  assert.equal(C.refTekst({ lo: "3,5", hi: "5,0" }), "3,5–5,0");
  assert.equal(C.refTekst({ lo: null, hi: "45" }), "< 45");
  assert.equal(C.refTekst({ lo: "90", hi: null }), "> 90");
  assert.equal(C.refTekst({ lo: "−3,0", hi: "+3,0" }), "−3,0 tot +3,0");
});

console.log(`\n${n} tests geslaagd`);
