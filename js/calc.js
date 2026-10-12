/*
 * Normaalwaarden NL – rekenfuncties
 * Zuivere functies zonder DOM-afhankelijkheid (getest met Node, zie tests/calc.test.js).
 * Eenheden: Nederlandse praktijk (kPa, mmol/L, µmol/L, g/L).
 */
(function (root) {
  "use strict";

  const KPA_PER_MMHG = 0.133322;
  const MMHG_PER_KPA = 7.50062;

  const kpaToMmHg = (k) => k * MMHG_PER_KPA;
  const mmHgToKpa = (m) => m * KPA_PER_MMHG;

  /** Henderson–Hasselbalch: HCO3 (mmol/L) uit pH en pCO2 (kPa). */
  function hco3FromPhPco2(ph, pco2Kpa) {
    return 0.2303 * pco2Kpa * Math.pow(10, ph - 6.1);
  }

  /** Anion gap zonder kalium: Na − Cl − HCO3. */
  const anionGap = (na, cl, hco3) => na - cl - hco3;

  /** Albumine-gecorrigeerde anion gap (Figge): AG + 0,25 × (44 − albumine g/L). */
  const anionGapCorrected = (ag, albGperL) => ag + 0.25 * (44 - albGperL);

  /** Delta-ratio: (AG − 12) / (24 − HCO3). Alleen zinvol bij HCO3 < 24. */
  function deltaRatio(ag, hco3) {
    const dHco3 = 24 - hco3;
    if (dHco3 <= 0) return null;
    return (ag - 12) / dHco3;
  }

  /** Winter-formule: verwachte pCO2 (kPa) bij metabole acidose, ± 2 mmHg. */
  function wintersExpectedKpa(hco3) {
    const mid = mmHgToKpa(1.5 * hco3 + 8);
    const tol = mmHgToKpa(2);
    return { mid, lo: mid - tol, hi: mid + tol };
  }

  /** Verwachte pCO2 (kPa) bij metabole alkalose: 40 + 0,7 × (HCO3 − 24) mmHg, ± 5 mmHg. */
  function metAlkalosisExpectedKpa(hco3) {
    const mid = mmHgToKpa(40 + 0.7 * (hco3 - 24));
    const tol = mmHgToKpa(5);
    return { mid, lo: mid - tol, hi: mid + tol };
  }

  /**
   * Verwacht HCO3 bij primaire respiratoire stoornis (acuut en chronisch).
   * Acidose: +1 (acuut) resp. +3,5 (chronisch) mmol/L per +10 mmHg pCO2.
   * Alkalose: −2 (acuut) resp. −4 (chronisch) mmol/L per −10 mmHg pCO2.
   */
  function respExpectedHco3(pco2Kpa) {
    const d = kpaToMmHg(pco2Kpa) - 40;
    if (d >= 0) return { type: "acidose", acuut: 24 + 0.1 * d, chronisch: 24 + 0.35 * d };
    return { type: "alkalose", acuut: 24 + 0.2 * d, chronisch: 24 + 0.4 * d };
  }

  /** Alveolaire pO2 (kPa): FiO2 × (Pb − pH2O) − pCO2 / RQ. */
  function alveolarPo2(fio2, pco2Kpa, pbKpa, rq) {
    const pb = pbKpa == null ? 101.3 : pbKpa;
    const r = rq == null ? 0.8 : rq;
    return fio2 * (pb - 6.3) - pco2Kpa / r;
  }

  /** Bovengrens normale A–a-gradiënt (kPa): (leeftijd/4 + 4) mmHg. Geldt bij kamerlucht. */
  const aaGradientUpperKpa = (age) => mmHgToKpa(age / 4 + 4);

  /** Gecorrigeerd calcium: Ca + 0,02 × (40 − albumine). */
  const caCorrected = (ca, albGperL) => ca + 0.02 * (40 - albGperL);

  /** Berekende osmolaliteit: 2 × Na + glucose + ureum. */
  const osmCalc = (na, glucose, ureum) => 2 * na + glucose + ureum;

  /** Gecorrigeerd natrium bij hyperglycemie (≈ Katz: 0,3 mmol/L per mmol/L glucose > 5,5). */
  const naCorrected = (na, glucose) => na + 0.3 * (glucose - 5.5);

  /** Transferrineverzadiging (%) = ijzer / (25 × transferrine) × 100. */
  const tsat = (ijzerUmol, transferrineGperL) => (ijzerUmol / (25 * transferrineGperL)) * 100;

  /** CKD-EPI 2009 (zonder correctie voor etniciteit) en 2021 (race-vrij). Kreatinine in µmol/L. */
  function ckdEpi(kreatUmol, age, vrouw, versie) {
    const scr = kreatUmol / 88.4; // mg/dL
    const kappa = vrouw ? 0.7 : 0.9;
    const mn = Math.min(scr / kappa, 1);
    const mx = Math.max(scr / kappa, 1);
    if (versie === 2009) {
      const alpha = vrouw ? -0.329 : -0.411;
      return 141 * Math.pow(mn, alpha) * Math.pow(mx, -1.209) * Math.pow(0.993, age) * (vrouw ? 1.018 : 1);
    }
    const alpha = vrouw ? -0.241 : -0.302;
    return 142 * Math.pow(mn, alpha) * Math.pow(mx, -1.2) * Math.pow(0.9938, age) * (vrouw ? 1.012 : 1);
  }

  /** Tekstweergave van een referentie-interval {lo, hi} (strings met decimale komma). */
  function refTekst(r) {
    if (!r) return "";
    if (r.lo != null && r.hi != null) return /^[−+-]/.test(r.lo) || /^[−+-]/.test(r.hi) ? `${r.lo} tot ${r.hi}` : `${r.lo}–${r.hi}`;
    if (r.hi != null) return `< ${r.hi}`;
    if (r.lo != null) return `> ${r.lo}`;
    return "";
  }

  /* ------------------------------------------------------------ interpretatie */

  const GRENS = {
    phLaag: 7.35,
    phHoog: 7.45,
    pco2Laag: 4.7,
    pco2Hoog: 6.4,
    hco3Laag: 22,
    hco3Hoog: 26
  };

  const f1 = (x) => (Math.round(x * 10) / 10).toFixed(1).replace(".", ",");
  const f2 = (x) => (Math.round(x * 100) / 100).toFixed(2).replace(".", ",");
  const f0 = (x) => String(Math.round(x));

  /**
   * Interpreteert een arterieel bloedgas. Alle velden optioneel behalve pH en pCO2.
   * invoer: { ph, pco2 (kPa), hco3, po2 (kPa), fio2 (0–1), na, cl, alb (g/L), lactaat, leeftijd }
   * Geeft { regels: [{ soort: 'kop'|'ok'|'let-op'|'info', tekst }], hco3 }.
   */
  function interpreteerBloedgas(inv) {
    const regels = [];
    const add = (soort, tekst) => regels.push({ soort, tekst });
    let { ph, pco2, hco3 } = inv;
    if (!(ph > 0) || !(pco2 > 0)) {
      return { regels: [{ soort: "let-op", tekst: "Vul minimaal pH en pCO₂ in." }], hco3: null };
    }

    let hco3Bron = "gemeten";
    if (!(hco3 > 0)) {
      hco3 = hco3FromPhPco2(ph, pco2);
      hco3Bron = "berekend uit pH en pCO₂";
    }

    const acid = ph < GRENS.phLaag;
    const alk = ph > GRENS.phHoog;
    const metZuur = hco3 < GRENS.hco3Laag;
    const metBase = hco3 > GRENS.hco3Hoog;
    const resZuur = pco2 > GRENS.pco2Hoog;
    const resBase = pco2 < GRENS.pco2Laag;

    add("info", `pH ${f2(ph)} · pCO₂ ${f1(pco2)} kPa (${f0(kpaToMmHg(pco2))} mmHg) · HCO₃⁻ ${f1(hco3)} mmol/L (${hco3Bron})`);

    let primair = null; // 'metZuur' | 'resZuur' | 'metBase' | 'resBase' | null
    if (acid) {
      if (metZuur && resZuur) {
        add("kop", "Gemengde acidose: metabole én respiratoire acidose");
        add("info", "Zowel HCO₃⁻ is verlaagd als pCO₂ is verhoogd; er is geen sprake van compensatie, de pH daalt sterk.");
      } else if (metZuur) {
        primair = "metZuur";
        add("kop", "Metabole acidose");
      } else if (resZuur) {
        primair = "resZuur";
        add("kop", "Respiratoire acidose");
      } else {
        add("kop", "Acidemie met grenswaarden van pCO₂ en HCO₃⁻");
        add("let-op", "pCO₂ en HCO₃⁻ liggen beide binnen de referentie: controleer de invoer of overweeg een gemengde stoornis.");
      }
    } else if (alk) {
      if (metBase && resBase) {
        add("kop", "Gemengde alkalose: metabole én respiratoire alkalose");
      } else if (metBase) {
        primair = "metBase";
        add("kop", "Metabole alkalose");
      } else if (resBase) {
        primair = "resBase";
        add("kop", "Respiratoire alkalose");
      } else {
        add("kop", "Alkalemie met grenswaarden van pCO₂ en HCO₃⁻");
        add("let-op", "pCO₂ en HCO₃⁻ liggen beide binnen de referentie: controleer de invoer of overweeg een gemengde stoornis.");
      }
    } else if (metZuur && resBase) {
      // Beide kanten schuiven de pH tegengesteld; de kant van de pH wijst de primaire stoornis aan.
      primair = ph < 7.4 ? "metZuur" : "resBase";
      add("kop", primair === "metZuur"
        ? "Normale pH (acidotische kant): metabole acidose met respiratoire compensatie, of gemengde stoornis"
        : "Normale pH (alkalotische kant): respiratoire alkalose met metabole compensatie, of gemengde stoornis");
    } else if (metBase && resZuur) {
      primair = ph < 7.4 ? "resZuur" : "metBase";
      add("kop", primair === "resZuur"
        ? "Normale pH (acidotische kant): respiratoire acidose met metabole compensatie (bijv. COPD), of gemengde stoornis"
        : "Normale pH (alkalotische kant): metabole alkalose met respiratoire compensatie, of gemengde stoornis");
    } else if (metZuur || metBase || resZuur || resBase) {
      add("kop", "Normale pH met afwijkende pCO₂ of HCO₃⁻");
      add("info", "Mogelijk een gecompenseerde of gemengde stoornis; zie de verwachte compensatie hieronder en het klinisch beeld.");
    } else {
      add("ok", "Geen zuur-base-stoornis: pH, pCO₂ en HCO₃⁻ liggen binnen de referentie.");
    }

    // Compensatie
    if (primair === "metZuur") {
      const w = wintersExpectedKpa(hco3);
      const txt = `Verwachte pCO₂ bij adequate respiratoire compensatie (Winter): ${f1(w.lo)}–${f1(w.hi)} kPa.`;
      if (pco2 > w.hi + 1e-9) {
        add("let-op", `${txt} Gemeten pCO₂ ligt hoger: onvoldoende compensatie → bijkomende respiratoire acidose (vermoeidheid, ventilatiestoornis).`);
      } else if (pco2 < w.lo - 1e-9) {
        add("let-op", `${txt} Gemeten pCO₂ ligt lager: bijkomende respiratoire alkalose (bijv. sepsis, salicylaten, pijn, angst).`);
      } else {
        add("ok", `${txt} Gemeten pCO₂ ligt hierbinnen: adequate respiratoire compensatie.`);
      }
    } else if (primair === "metBase") {
      const w = metAlkalosisExpectedKpa(hco3);
      const txt = `Verwachte pCO₂ bij respiratoire compensatie: ca. ${f1(w.lo)}–${f1(w.hi)} kPa (compensatie bij metabole alkalose is beperkt en variabel).`;
      if (pco2 > w.hi + 1e-9) {
        add("let-op", `${txt} Gemeten pCO₂ ligt hoger: mogelijk bijkomende respiratoire acidose.`);
      } else if (pco2 < w.lo - 1e-9) {
        add("let-op", `${txt} Gemeten pCO₂ ligt lager: mogelijk bijkomende respiratoire alkalose.`);
      } else {
        add("ok", `${txt} Gemeten pCO₂ ligt hierbinnen.`);
      }
    } else if (primair === "resZuur" || primair === "resBase") {
      const e = respExpectedHco3(pco2);
      const txt = `Verwacht HCO₃⁻ bij deze pCO₂: acuut ca. ${f1(e.acuut)}, chronisch ca. ${f1(e.chronisch)} mmol/L.`;
      // t = positie van het gemeten HCO3 op de schaal acuut (0) → chronisch (1)
      const t = (hco3 - e.acuut) / (e.chronisch - e.acuut);
      if (t < -0.25) {
        add("let-op", `${txt} Gemeten HCO₃⁻ is ${primair === "resZuur" ? "lager" : "hoger"} dan bij een acute stoornis verwacht: bijkomende metabole ${primair === "resZuur" ? "acidose" : "alkalose"}.`);
      } else if (t > 1.25) {
        add("let-op", `${txt} Gemeten HCO₃⁻ is ${primair === "resZuur" ? "hoger" : "lager"} dan bij een chronische stoornis verwacht: bijkomende metabole ${primair === "resZuur" ? "alkalose" : "acidose"}.`);
      } else if (t <= 0.25) {
        add("info", `${txt} Gemeten HCO₃⁻ past bij een acute stoornis (renale compensatie nog niet op gang gekomen).`);
      } else if (t >= 0.75) {
        add("info", `${txt} Gemeten HCO₃⁻ past bij een chronische stoornis (compensatie na ≥ 3–5 dagen).`);
      } else {
        add("info", `${txt} Gemeten HCO₃⁻ ligt tussen acuut en chronisch: subacuut of acuut-op-chronisch (bijv. COPD-exacerbatie).`);
      }
    }

    // Anion gap
    const { na, cl, alb } = inv;
    if (na > 0 && cl > 0) {
      const ag = anionGap(na, cl, hco3);
      let agTekst = `Anion gap (Na⁺ − Cl⁻ − HCO₃⁻): ${f1(ag)} mmol/L (referentie ca. 8–16).`;
      let agVoorRatio = ag;
      if (alb > 0) {
        const agc = anionGapCorrected(ag, alb);
        agTekst += ` Gecorrigeerd voor albumine ${f0(alb)} g/L: ${f1(agc)} mmol/L.`;
        agVoorRatio = agc;
      }
      const hoog = agVoorRatio > 16;
      add(hoog ? "let-op" : "info", agTekst);
      if (metZuur || primair === "metZuur") {
        if (hoog) {
          add("info", "Verhoogd anion gap: denk aan lactaat, ketonen, nierfalen, intoxicaties (methanol, ethyleenglycol, salicylaten, 5-oxoproline).");
          const dr = deltaRatio(agVoorRatio, hco3);
          if (dr != null) {
            let duiding;
            if (dr < 0.4) duiding = "< 0,4: bijkomende hyperchloremische (normaal-gap) acidose";
            else if (dr < 0.8) duiding = "0,4–0,8: gemengde hoog- en normaal-gap acidose (of nierfalen)";
            else if (dr <= 2) duiding = "0,8–2: zuivere hoog-gap metabole acidose";
            else duiding = "> 2: bijkomende metabole alkalose (of chronische respiratoire acidose)";
            add("info", `Delta-ratio (ΔAG/ΔHCO₃⁻) = ${f1(dr)} → ${duiding}.`);
          }
        } else {
          add("info", "Normaal anion gap bij metabole acidose (hyperchloremisch): diarree, renale tubulaire acidose, grote hoeveelheden NaCl 0,9 %, ureterosigmoïdostomie.");
        }
      }
    }

    // Lactaat
    if (inv.lactaat > 0) {
      if (inv.lactaat >= 4) add("let-op", `Lactaat ${f1(inv.lactaat)} mmol/L: ernstige hyperlactatemie (≥ 4).`);
      else if (inv.lactaat > 2) add("let-op", `Lactaat ${f1(inv.lactaat)} mmol/L: hyperlactatemie (> 2).`);
      else add("ok", `Lactaat ${f1(inv.lactaat)} mmol/L: binnen de referentie (< 2).`);
    }

    // Oxygenatie
    if (inv.po2 > 0) {
      const fio2 = inv.fio2 > 0 ? inv.fio2 : 0.21;
      const pf = inv.po2 / fio2;
      const aKamerlucht = Math.abs(fio2 - 0.21) < 0.005;
      let o2 = `pO₂ ${f1(inv.po2)} kPa bij FiO₂ ${f0(fio2 * 100)} %. P/F-ratio ${f1(pf)} kPa (${f0(kpaToMmHg(pf))} mmHg; normaal > 53 kPa / 400 mmHg).`;
      if (pf <= 13.3) o2 += " P/F ≤ 13,3 kPa (100 mmHg): ernstige oxygenatiestoornis.";
      else if (pf <= 26.7) o2 += " P/F ≤ 26,7 kPa (200 mmHg): matig-ernstige oxygenatiestoornis.";
      else if (pf <= 40) o2 += " P/F ≤ 40 kPa (300 mmHg): milde oxygenatiestoornis.";
      add(pf <= 40 ? "let-op" : "ok", o2);
      if (pf <= 40) add("info", "De ARDS-criteria (Berlijn) gelden alleen bij beademing met PEEP ≥ 5 cmH₂O, acute presentatie, bilaterale infiltraten en niet volledig cardiaal te verklaren.");

      if (aKamerlucht && inv.po2 < 8.0) {
        add("let-op", `PaO₂ < 8,0 kPa bij kamerlucht: respiratoire insufficiëntie, ${pco2 > GRENS.pco2Hoog ? "type 2 (met hypercapnie)" : "type 1 (hypoxemisch)"}.`);
      }
      const pa = alveolarPo2(fio2, pco2);
      const aa = pa - inv.po2;
      let aaTekst = `Alveolaire pO₂ ${f1(pa)} kPa; A–a-gradiënt ${f1(aa)} kPa (${f0(kpaToMmHg(aa))} mmHg).`;
      if (inv.leeftijd > 0) {
        const bov = aaGradientUpperKpa(inv.leeftijd);
        aaTekst += ` Bovengrens normaal bij kamerlucht voor ${f0(inv.leeftijd)} jaar: ca. ${f1(bov)} kPa.`;
        if (aKamerlucht) {
          add(aa > bov ? "let-op" : "ok", aaTekst + (aa > bov ? " Verhoogde gradiënt → longparenchym-/shuntprobleem of VQ-mismatch." : " Normale gradiënt: past bij hypoventilatie (indien hypoxemisch) of hoogte."));
        } else {
          add("info", aaTekst + " Bij verhoogde FiO₂ zijn de normaalwaarden voor de gradiënt hoger en de berekening minder betrouwbaar.");
        }
      } else {
        add("info", aaTekst);
      }
    }

    return { regels, hco3 };
  }

  /* ------------------------------------------------------------ omrekeningen */

  /**
   * Omrekentabel: { id, naam, van, naar, f (factor van → naar), offset? }.
   * Voor niet-lineaire (HbA1c) is `custom` aanwezig met functies a2b en b2a.
   */
  const OMREKENINGEN = [
    { id: "pco2", naam: "pCO₂ / pO₂", van: "mmHg", naar: "kPa", f: KPA_PER_MMHG },
    { id: "hb", naam: "Hemoglobine", van: "g/dL", naar: "mmol/L", f: 0.6206 },
    { id: "kreat", naam: "Kreatinine", van: "mg/dL", naar: "µmol/L", f: 88.4 },
    { id: "gluc", naam: "Glucose", van: "mg/dL", naar: "mmol/L", f: 1 / 18.016 },
    { id: "ureum", naam: "Ureum", van: "BUN (mg/dL)", naar: "ureum (mmol/L)", f: 0.357 },
    { id: "chol", naam: "Cholesterol (totaal/LDL/HDL)", van: "mg/dL", naar: "mmol/L", f: 0.02586 },
    { id: "tg", naam: "Triglyceriden", van: "mg/dL", naar: "mmol/L", f: 0.01129 },
    { id: "ca", naam: "Calcium", van: "mg/dL", naar: "mmol/L", f: 0.2495 },
    { id: "mg", naam: "Magnesium", van: "mg/dL", naar: "mmol/L", f: 0.4114 },
    { id: "po4", naam: "Fosfaat", van: "mg/dL", naar: "mmol/L", f: 0.3229 },
    { id: "bili", naam: "Bilirubine", van: "mg/dL", naar: "µmol/L", f: 17.104 },
    { id: "alb", naam: "Albumine", van: "g/dL", naar: "g/L", f: 10 },
    { id: "urzuur", naam: "Urinezuur", van: "mg/dL", naar: "mmol/L", f: 0.05948 },
    { id: "lact", naam: "Lactaat", van: "mg/dL", naar: "mmol/L", f: 0.111 },
    { id: "fe", naam: "IJzer", van: "µg/dL", naar: "µmol/L", f: 0.1791 },
    { id: "vitd", naam: "Vitamine D (25-OH)", van: "ng/mL", naar: "nmol/L", f: 2.496 },
    { id: "b12", naam: "Vitamine B12", van: "pg/mL", naar: "pmol/L", f: 0.7378 },
    { id: "crp", naam: "CRP", van: "mg/dL", naar: "mg/L", f: 10 },
    { id: "testo", naam: "Testosteron", van: "ng/dL", naar: "nmol/L", f: 0.0347 },
    { id: "pth", naam: "PTH", van: "pg/mL", naar: "pmol/L", f: 0.1061 },
    { id: "ht", naam: "Hematocriet", van: "%", naar: "L/L", f: 0.01 },
    {
      id: "hba1c",
      naam: "HbA1c",
      van: "% (NGSP/DCCT)",
      naar: "mmol/mol (IFCC)",
      custom: { aNaarB: (x) => (x - 2.15) * 10.929, bNaarA: (y) => y / 10.929 + 2.15 }
    }
  ];

  function converteer(def, waarde, richting) {
    // richting: 'voor' (van → naar) of 'terug' (naar → van)
    if (def.custom) return richting === "terug" ? def.custom.bNaarA(waarde) : def.custom.aNaarB(waarde);
    return richting === "terug" ? waarde / def.f : waarde * def.f;
  }

  const api = {
    kpaToMmHg,
    mmHgToKpa,
    hco3FromPhPco2,
    anionGap,
    anionGapCorrected,
    deltaRatio,
    wintersExpectedKpa,
    metAlkalosisExpectedKpa,
    respExpectedHco3,
    alveolarPo2,
    aaGradientUpperKpa,
    caCorrected,
    osmCalc,
    naCorrected,
    tsat,
    ckdEpi,
    interpreteerBloedgas,
    OMREKENINGEN,
    converteer,
    refTekst
  };

  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.NW_CALC = api;
})(typeof window !== "undefined" ? window : globalThis);
