/*
 * Normaalwaarden NL – gegevens
 *
 * Referentiewaarden voor volwassenen, samengesteld uit openbare referentielijsten van
 * Nederlandse laboratoria (zie "Bronnen" op de site). De waarde onder `ref` is de waarde
 * die het best past bij de gangbare Nederlandse praktijk; afwijkende intervallen van
 * individuele laboratoria staan onder `spreiding`.
 *
 * Notatie: waarden zijn strings met decimale komma, zodat de weergave exact blijft
 * (bijv. "4,0"). R(lo, hi): beide grenzen = interval; alleen hi = "< hi"; alleen lo = "> lo".
 */
(function () {
  "use strict";

  const num = (s) => (s == null ? null : parseFloat(String(s).replace(/\u2212/g, "-").replace(/^\+/, "").replace(",", ".")));
  const R = (lo, hi) => ({ lo, hi, loN: num(lo), hiN: num(hi) });
  const ALL = (lo, hi) => ({ all: R(lo, hi) });
  const MV = (m, v) => ({ m: R(m[0], m[1]), v: R(v[0], v[1]) });

  const secties = [
    /* ------------------------------------------------------------------ BLOEDGAS */
    {
      id: "bloedgas",
      titel: "Bloedgas",
      kort: "Bloedgas",
      intro:
        "Arterieel bloedgas bij volwassenen. In Nederland worden pCO₂ en pO₂ uitgedrukt in kPa (niet mmHg); bij kPa-waarden staat de omrekening naar mmHg erbij voor het lezen van internationale literatuur. Intervallen verschillen per laboratorium en analyser – de spreiding tussen Nederlandse laboratoria staat onder ‘Details’.",
      groepen: [
        {
          titel: "Arterieel bloedgas",
          tests: [
            {
              id: "ph",
              naam: "pH",
              afk: "pH",
              eenheid: "–",
              ref: ALL("7,35", "7,45"),
              spreiding: "Alle geraadpleegde laboratoria: 7,35–7,45. Gelijk aan [H⁺] 35–45 nmol/L.",
              laag: "Acidemie (pH < 7,35): respiratoire acidose (hypoventilatie) en/of metabole acidose (lactaat, ketoacidose, nierfalen, diarree, intoxicaties). Bij pH < 7,20 is er sprake van ernstige acidemie.",
              hoog: "Alkalemie (pH > 7,45): respiratoire alkalose (hyperventilatie) en/of metabole alkalose (braken, diuretica, hypokaliëmie).",
              noot: "Een normale pH sluit een zuur-base-stoornis niet uit: bij een gemengde of volledig gecompenseerde stoornis kan de pH normaal zijn."
            },
            {
              id: "pco2",
              naam: "pCO₂ (arterieel)",
              afk: "PaCO₂",
              eenheid: "kPa",
              ref: ALL("4,7", "6,0"),
              spreiding:
                "Erasmus MC 4,0–6,4 · Deventer Ziekenhuis 4,2–6,2 · Zuyderland 4,7–6,4 · Franciscus 35–48 mmHg (≈ 4,7–6,4 kPa). De klassieke grenzen 35–45 mmHg (4,7–6,0 kPa) zijn hier als referentie aangehouden; veel laboratoria rapporteren een bovengrens tot 6,4 kPa.",
              hoog: "Hypercapnie (hypoventilatie): COPD, neuromusculaire ziekte, sedativa/opioïden, obesitas-hypoventilatie, uitputting, CZS-depressie. Ook compensatie van metabole alkalose.",
              laag: "Hypocapnie (hyperventilatie): angst/pijn, hypoxemie, longembolie, sepsis, salicylaten, zwangerschap, compensatie van metabole acidose.",
              noot: "Veneus pCO₂ ligt gemiddeld 0,5–0,8 kPa hoger dan arterieel (Erasmus MC veneus: 4,7–6,4 kPa)."
            },
            {
              id: "po2",
              naam: "pO₂ (arterieel)",
              afk: "PaO₂",
              eenheid: "kPa",
              ref: ALL("10,0", "13,3"),
              noCheckHoog: true,
              spreiding: "Erasmus MC 10,0–13,3 · Deventer Ziekenhuis 9,5–13,5 · Zuyderland 9,2–13,0 (kamerlucht, jonge volwassene).",
              laag: "Hypoxemie. PaO₂ < 8,0 kPa (60 mmHg) bij kamerlucht = respiratoire insufficiëntie (type 1 bij normale pCO₂, type 2 bij pCO₂ > 6,0 kPa). Oorzaken: ventilatie-perfusiemismatch, shunt, diffusiestoornis, hypoventilatie, grote hoogte.",
              hoog: "Alleen interpreteerbaar met de FiO₂: waarden boven het gebruikelijke bereik zijn normaal onder zuurstoftoediening. Gebruik de P/F-ratio.",
              noot: "De pO₂ daalt fysiologisch met de leeftijd; als vuistregel PaO₂ (kPa) ≈ 13,3 − 0,044 × leeftijd (jaren). Onder zuurstoftherapie: bereken P/F-ratio (pO₂/FiO₂, normaal > 53 kPa) – zie de bloedgas-interpretatie."
            },
            {
              id: "so2",
              naam: "Zuurstofsaturatie (arterieel)",
              afk: "SaO₂",
              eenheid: "%",
              ref: ALL("95", "100"),
              tekst: "95–99",
              spreiding: "Erasmus MC 0,95–0,99 (fractie) · Zuyderland 92–98 %.",
              laag: "Hypoxemie, CO- of methemoglobinevergiftiging (gemeten SaO₂ valt dan niet altijd lager uit; zie HbCO en MetHb).",
              noot: "De saturatie op het bloedgas is gemeten (co-oximetrie) en betrouwbaarder dan een pulsoximeter, vooral bij CO-intoxicatie."
            },
            {
              id: "hco3",
              naam: "Bicarbonaat (actueel)",
              afk: "HCO₃⁻",
              eenheid: "mmol/L",
              ref: ALL("22", "26"),
              spreiding: "Deventer Ziekenhuis 22–26 (art.) · Zuyderland 23–28 · Franciscus 22–29 (art.) · Erasmus MC (serum) 21–27.",
              laag: "Metabole acidose (of compensatie van chronische respiratoire alkalose).",
              hoog: "Metabole alkalose (of compensatie van chronische respiratoire acidose).",
              noot: "Op de bloedgasanalyser wordt HCO₃⁻ berekend uit pH en pCO₂ (Henderson–Hasselbalch)."
            },
            {
              id: "be",
              naam: "Base excess",
              afk: "BE",
              eenheid: "mmol/L",
              ref: ALL("−3,0", "+3,0"),
              spreiding: "Erasmus MC en Zuyderland −3,0 tot +3,0 · Deventer Ziekenhuis −2,5 tot +2,5.",
              laag: "Negatieve BE (base deficit): metabole acidose.",
              hoog: "Positieve BE: metabole alkalose.",
              noot: "Meet de metabole component onafhankelijk van pCO₂."
            },
            {
              id: "lactaat",
              naam: "Lactaat",
              afk: "Lac",
              eenheid: "mmol/L",
              ref: ALL("0,5", "1,7"),
              spreiding:
                "Erasmus MC: arterieel volbloed < 1,5 · veneus volbloed 0,5–1,7 · plasma 0,5–2,2 · Zuyderland 0,6–1,8 · Franciscus 0,5–2,2.",
              hoog:
                "Hyperlactatemie > 2 mmol/L; ≥ 4 mmol/L ernstig. Type A: shock/hypoperfusie, sepsis, hypoxie. Type B: metformine, thiamine-tekort, lever-/nierfalen, convulsies, maligniteit.",
              noot: "De lactaat-klaring (trend) is klinisch informatiever dan één enkele waarde. Afname zonder stuwing; direct analyseren of op ijs."
            },
            {
              id: "ag",
              naam: "Anion gap",
              afk: "AG",
              eenheid: "mmol/L",
              ref: ALL("8", "16"),
              tekst: "8–16 (zonder K⁺)",
              spreiding: "Erasmus MC (formule met K⁺: Na⁺ + K⁺ − HCO₃⁻ − Cl⁻): 13–17 mmol/L. Zonder K⁺ is de normaalwaarde methode- en laboratoriumafhankelijk.",
              hoog: "Verhoogd anion gap: lactaat, ketonen, nierfalen (fosfaat/sulfaat), intoxicaties (methanol, ethyleenglycol, salicylaten, paracetamol/5-oxoproline).",
              laag: "Hypoalbuminemie (corrigeer: AG + 0,25 × (44 − albumine in g/L)), paraproteïne, lithium/brom.",
              noot: "Bij een lage albumine onderschat de ongecorrigeerde anion gap een metabole acidose. Zie ‘Rekenhulpen’ voor de berekening inclusief delta-ratio."
            }
          ]
        },
        {
          titel: "Overige parameters op de bloedgasanalyser",
          tests: [
            {
              id: "bg_glucose",
              naam: "Glucose (bloedgas)",
              afk: "Glu",
              eenheid: "mmol/L",
              ref: ALL("4,0", "6,1"),
              tekst: "4,0–6,1 (nuchter)",
              spreiding: "Niet nuchter < 7,8 mmol/L. Zie ook ‘Glucose & diabetes’.",
              noot: "Volbloedmeting op de analyser kan enigszins afwijken van de laboratoriumuitslag in plasma."
            },
            {
              id: "bg_na",
              naam: "Natrium (bloedgas)",
              afk: "Na⁺",
              eenheid: "mmol/L",
              ref: ALL("135", "145"),
              noot: "Zie ‘Elektrolyten & mineralen’."
            },
            {
              id: "bg_k",
              naam: "Kalium (bloedgas)",
              afk: "K⁺",
              eenheid: "mmol/L",
              ref: ALL("3,5", "5,0"),
              noot: "Zie ‘Elektrolyten & mineralen’. Bloedgas-K⁺ is plasma-kalium (heparine) en dus iets lager dan serum-kalium; hemolyse geeft valselijk hoge waarden."
            },
            {
              id: "bg_ica",
              naam: "Geïoniseerd calcium",
              afk: "Ca²⁺",
              eenheid: "mmol/L",
              ref: ALL("1,15", "1,30"),
              spreiding: "Erasmus MC 1,15–1,29 · Zuyderland 1,11–1,30 · Franciscus 1,15–1,35.",
              laag: "Hypocalciëmie (massale transfusie met citraat, pancreatitis, hypoparathyreoïdie, alkalose).",
              hoog: "Hypercalciëmie (zie Calcium totaal).",
              noot: "Alkalose verlaagt het geïoniseerde calcium (meer binding aan albumine)."
            },
            {
              id: "hbco",
              naam: "Carboxyhemoglobine",
              afk: "HbCO",
              eenheid: "%",
              ref: ALL(null, "1,5"),
              tekst: "< 1,5 (niet-roker) · < 5 (roker) · < 9 (zware roker)",
              spreiding: "Erasmus MC (fractie): < 0,015 niet-rokers, < 0,050 rokers, < 0,090 zware rokers.",
              hoog: "Koolmonoxide-intoxicatie (rook, brand, uitlaatgassen, slecht afgestelde kachel).",
              noot: "Een pulsoximeter geeft bij CO-intoxicatie een valselijk normale saturatie. Bepaal HbCO met co-oximetrie op het bloedgas."
            },
            {
              id: "hbmet",
              naam: "Methemoglobine",
              afk: "MetHb",
              eenheid: "%",
              ref: ALL(null, "1,5"),
              spreiding: "Erasmus MC < 1,5 % · Zuyderland < 3,0 %.",
              hoog: "Verworven methemoglobinemie (nitraten, lokale anesthetica als prilocaïne/benzocaïne, dapson, nitroprusside) of congenitaal.",
              noot: "Saturatie op pulsoximeter wijkt af (neiging naar ± 85 %); bloed kan chocoladebruin zijn."
            }
          ]
        }
      ],
      voetnoot:
        "Veneus bloedgas (indicatief, literatuur – niet laboratoriumspecifiek): pH gemiddeld 0,03–0,04 lager en pCO₂ gemiddeld 0,5–0,8 kPa hoger dan arterieel; pO₂ veneus (ca. 4–6 kPa) is niet bruikbaar voor beoordeling van oxygenatie."
    },

    /* ------------------------------------------------------------------ ELEKTROLYTEN */
    {
      id: "elektrolyten",
      titel: "Elektrolyten & mineralen",
      kort: "Elektrolyten",
      intro: "Serum of plasma (afhankelijk van laboratorium). Eventuele leeftijds- of geslachtsafhankelijke grenzen staan bij Details.",
      groepen: [
        {
          titel: "Elektrolyten",
          tests: [
            {
              id: "na",
              naam: "Natrium",
              afk: "Na⁺",
              eenheid: "mmol/L",
              ref: ALL("135", "145"),
              spreiding: "SALT 134–146 · overige laboratoria 135–145.",
              laag: "Hyponatriëmie: SIADH, thiazide-diuretica, hartfalen, levercirrose, nefrotisch syndroom, hypovolemie, hypocortisolisme, hypothyreoïdie, polydipsie. Beoordeel altijd osmolaliteit en volumestatus.",
              hoog: "Hypernatriëmie: watertekort (onvoldoende intake, koorts, diabetes insipidus, osmotische diurese), zelden zoutoverschot.",
              noot: "Bij chronische hyponatriëmie niet sneller corrigeren dan ca. 8–10 mmol/L per 24 uur (risico op osmotische demyelinisatie). Bij hyperglycemie: gecorrigeerd natrium berekenen (zie Rekenhulpen)."
            },
            {
              id: "k",
              naam: "Kalium",
              afk: "K⁺",
              eenheid: "mmol/L",
              ref: ALL("3,5", "5,0"),
              spreiding: "Franciscus 3,5–5,1 · SALT 3,4–4,9 · SCAL (plasma) 3,5–4,8.",
              laag: "Hypokaliëmie: lis-/thiazidediuretica, braken, diarree, hyperaldosteronisme, insuline/β-agonisten, hypomagnesiëmie. Ernstig bij < 2,5–3,0 mmol/L of ECG-afwijkingen.",
              hoog: "Hyperkaliëmie: nierfalen, RAAS-remmers/kaliumsparende diuretica, acidose, rhabdomyolyse/tumorlyse, ziekte van Addison. ≥ 6,5 mmol/L of ECG-veranderingen: spoed.",
              noot: "Serumkalium ligt ca. 0,1–0,4 mmol/L hoger dan plasmakalium (trombocytenlyse). Pseudohyperkaliëmie bij hemolyse, trombocytose/leukocytose of vertraagde verwerking."
            },
            {
              id: "cl",
              naam: "Chloride",
              afk: "Cl⁻",
              eenheid: "mmol/L",
              ref: ALL("97", "107"),
              spreiding: "Zuyderland 96–107 · Franciscus 98–107.",
              hoog: "Hyperchloremische metabole acidose (diarree, renale tubulaire acidose, grote hoeveelheden NaCl 0,9 %).",
              laag: "Braken/maagzuurverlies (metabole alkalose), diuretica, SIADH.",
              noot: "Vooral nuttig voor de berekening van de anion gap."
            },
            {
              id: "bicarbonaat",
              naam: "Bicarbonaat (serum)",
              afk: "HCO₃⁻ / totaal CO₂",
              eenheid: "mmol/L",
              ref: ALL("22", "29"),
              spreiding: "SALT 22–29 (12–60 jaar), 23–31 (> 60 jaar) · Erasmus MC 21,0–27,0 · Zuyderland 23–28.",
              laag: "Metabole acidose; compensatie van respiratoire alkalose.",
              hoog: "Metabole alkalose; compensatie van respiratoire acidose.",
              noot: "Serumbicarbonaat is minder nauwkeurig dan de waarde uit een bloedgas (verlies van CO₂ in het monster)."
            },
            {
              id: "osm",
              naam: "Osmolaliteit",
              afk: "Osm",
              eenheid: "mosmol/kg",
              ref: ALL("275", "300"),
              spreiding: "Erasmus MC en Franciscus 275–300 · Zuyderland 275–295.",
              hoog: "Hypernatriëmie, hyperglycemie, uremie, intoxicaties met osmotisch actieve stoffen (ethanol, methanol, ethyleenglycol).",
              laag: "Hyponatriëmie (hypotone hyponatriëmie).",
              noot: "Gemeten minus berekende osmolaliteit (2 × Na⁺ + glucose + ureum) = osmolale gap; normaal < 10 mosmol/kg."
            }
          ]
        },
        {
          titel: "Calcium, fosfaat & magnesium",
          tests: [
            {
              id: "ca",
              naam: "Calcium (totaal)",
              afk: "Ca",
              eenheid: "mmol/L",
              ref: ALL("2,20", "2,65"),
              spreiding: "Zuyderland 2,20–2,60 · Franciscus 2,10–2,65 (12–60 jaar), 2,20–2,65 (> 60 jaar).",
              hoog: "Primaire hyperparathyreoïdie, maligniteit (PTHrP, botmetastasen, multipel myeloom), vitamine D-intoxicatie, thiazide, lithium, sarcoïdose, immobilisatie.",
              laag: "Hypoalbuminemie (pseudohypocalciëmie), vitamine D-tekort, hypoparathyreoïdie, nierfalen, pancreatitis, hypomagnesiëmie, massale transfusie.",
              noot: "Corrigeer voor albumine of meet het geïoniseerde calcium."
            },
            {
              id: "ca_corr",
              naam: "Calcium (gecorrigeerd voor albumine)",
              afk: "Ca corr.",
              eenheid: "mmol/L",
              ref: ALL("2,15", "2,65"),
              spreiding: "Franciscus 2,15–2,65.",
              noot: "Ca corr. = Ca + 0,02 × (40 − albumine in g/L). Onbetrouwbaar bij zeer lage albumine of ernstige ziekte; geïoniseerd calcium heeft dan de voorkeur."
            },
            {
              id: "ca_iono",
              naam: "Calcium (geïoniseerd)",
              afk: "Ca²⁺",
              eenheid: "mmol/L",
              ref: ALL("1,15", "1,30"),
              spreiding: "Erasmus MC 1,15–1,29 · Zuyderland 1,11–1,30 · Franciscus 1,15–1,35.",
              noot: "Heparine-bloed, anaëroob afgenomen. Zie ook ‘Bloedgas’."
            },
            {
              id: "fosfaat",
              naam: "Fosfaat (anorganisch)",
              afk: "PO₄",
              eenheid: "mmol/L",
              ref: ALL("0,80", "1,50"),
              spreiding: "Erasmus MC 0,8–1,4 (13–39 jaar), bij ouderen 0,75–1,33 (m) en 0,88–1,49 (v) · SALT 0,8–1,4 · Franciscus 0,74–1,52.",
              hoog: "Nierfalen, hypoparathyreoïdie, rhabdomyolyse/tumorlyse, vitamine D-overmaat.",
              laag: "Refeeding-syndroom, alcoholisme, hyperparathyreoïdie, vitamine D-tekort, acute respiratoire alkalose, insuline. Ernstig < 0,3–0,4 mmol/L.",
              noot: "Risico op refeeding-syndroom bij herstarten voeding na langdurig vasten."
            },
            {
              id: "mg",
              naam: "Magnesium",
              afk: "Mg²⁺",
              eenheid: "mmol/L",
              ref: ALL("0,70", "1,05"),
              spreiding: "Zuyderland 0,70–1,00 · Franciscus 0,66–1,07 · Spijkenisse MC 0,71–0,93.",
              laag: "PPI’s, diuretica, alcohol, diarree, onvoldoende intake, cisplatine; veroorzaakt refractaire hypokaliëmie/hypocalciëmie.",
              hoog: "Nierfalen, magnesiumtoediening (bijv. pre-eclampsie), laxantia/antacida met magnesium."
            }
          ]
        }
      ]
    },

    /* ------------------------------------------------------------------ NIER */
    {
      id: "nier",
      titel: "Nierfunctie",
      kort: "Nier",
      intro: "Kreatinine en eGFR worden in Nederland gerapporteerd in µmol/L en ml/min/1,73 m². Het kreatininereferentie-interval verschilt per methode (enzymatisch of Jaffé) en laboratorium.",
      groepen: [
        {
          titel: "Nierfunctie",
          tests: [
            {
              id: "kreat",
              naam: "Kreatinine",
              afk: "Kreat",
              eenheid: "µmol/L",
              ref: MV(["65", "105"], ["50", "90"]),
              spreiding:
                "Man/vrouw: Erasmus MC 65–115 / 55–90 · Zuyderland 70–110 / 55–95 · Franciscus en SALT 59–104 / 45–84 · SCAL/Spijkenisse 65–105 / 50–90.",
              hoog: "Verminderde nierfunctie (prerenaal, intrinsiek renaal, postrenaal); ook hoge spiermassa, rhabdomyolyse, trimethoprim/cimetidine (remmen tubulaire secretie).",
              laag: "Lage spiermassa (ouderen, cachexie, amputatie), zwangerschap.",
              noot: "Kreatinine stijgt pas bij een eGFR-daling van ca. 50 %; bij acute nierschade loopt de stijging achter op de werkelijke daling (KDIGO: stijging ≥ 26 µmol/L binnen 48 uur of ≥ 1,5 × basiswaarde)."
            },
            {
              id: "egfr",
              naam: "eGFR (CKD-EPI)",
              afk: "eGFR",
              eenheid: "ml/min/1,73 m²",
              ref: ALL("90", null),
              tekst: "> 90 (jonge volwassene) – daalt met leeftijd",
              noCheck: true,
              spreiding:
                "Franciscus (leeftijdsafhankelijk, man): 18–24 jr > 100 · 30–34 jr > 90 · 50–54 jr > 73 · 70–74 jr > 57 · ≥ 85 jr > 44; (vrouw): 18–24 jr > 94 · 50–54 jr > 70 · ≥ 85 jr > 43.",
              laag:
                "KDIGO-stadia (met ≥ 3 maanden bestaan): G1 ≥ 90 · G2 60–89 · G3a 45–59 · G3b 30–44 · G4 15–29 · G5 < 15 ml/min/1,73 m². Stadiëring altijd samen met albuminurie (A1–A3).",
              noot: "Controleer welke CKD-EPI-versie (2009 of 2021) uw laboratorium rapporteert; zie de rekenhulp. De eGFR is niet geldig bij acute nierschade, extreme spiermassa of zwangerschap."
            },
            {
              id: "ureum",
              naam: "Ureum",
              afk: "Ureum",
              eenheid: "mmol/L",
              ref: ALL("2,5", "7,5"),
              spreiding: "Zuyderland 3,5–7,5 · SALT 3,0–7,0 · SCAL 2,5–7,0 · Franciscus > 49 jaar: man 3,0–9,2, vrouw 3,5–7,2.",
              hoog: "Nierfunctiestoornis, dehydratie/prerenaal, gastro-intestinale bloeding, hoge eiwitinname, katabolisme (corticosteroïden, sepsis).",
              laag: "Lage eiwitinname, ernstige leverziekte, overhydratie, zwangerschap.",
              noot: "Ureum/kreatinine-verhouding helpt bij onderscheid tussen prerenale oorzaak en intrinsiek renaal. Let op: in Nederland ureum in mmol/L, niet BUN in mg/dL (zie Omrekenen)."
            },
            {
              id: "cysc",
              naam: "Cystatine C",
              afk: "Cys C",
              eenheid: "mg/L",
              ref: MV(["0,60", "1,03"], ["0,57", "0,90"]),
              noCheck: true,
              tekst: "Leeftijdsafhankelijk, zie details",
              spreiding:
                "Erasmus MC, man: 23–29 jr 0,60–1,03 · 40–49 jr 0,68–1,22 · 60–69 jr 0,77–1,42 · > 70 jr 0,82–1,53 · vrouw: 23–29 jr 0,57–0,90 · 40–49 jr 0,62–1,07 · 60–69 jr 0,66–1,26 · > 70 jr 0,68–1,36.",
              hoog: "Verminderde GFR; ook bij hoge ontstekingsactiviteit, schildklierfunctiestoornissen en corticosteroïden.",
              noot: "Nuttig wanneer kreatinine onbetrouwbaar is (extreme spiermassa, cachexie)."
            },
            {
              id: "urinezuur",
              naam: "Urinezuur",
              afk: "Urinezuur",
              eenheid: "mmol/L",
              ref: MV(["0,20", "0,42"], ["0,14", "0,34"]),
              spreiding: "Man 0,20–0,42 (Erasmus MC, SALT), 0,21–0,42 (Franciscus) · vrouw 0,12–0,34 (Erasmus MC), 0,14–0,34 (SALT), 0,15–0,35 (Franciscus).",
              hoog: "Jicht, nierinsufficiëntie, tumorlyse, diuretica, hoge purine-inname, psoriasis.",
              laag: "Xanthine-oxidasegebrek, allopurinol/febuxostat, SIADH, Fanconi.",
              noot: "Tijdens een acute jichtaanval kan het urinezuur normaal zijn."
            }
          ]
        }
      ]
    },

    /* ------------------------------------------------------------------ LEVER */
    {
      id: "lever",
      titel: "Lever, galwegen & pancreas",
      kort: "Lever / pancreas",
      intro: "Leverenzymen zijn methode- en geslachtsafhankelijk. Bij ALAT/ASAT/GGT worden in Nederland veelal IFCC-gestandaardiseerde methoden gebruikt (37 °C).",
      groepen: [
        {
          titel: "Lever & galwegen",
          tests: [
            {
              id: "alat",
              naam: "ALAT",
              afk: "ALT",
              eenheid: "U/L",
              ref: MV([null, "45"], [null, "34"]),
              spreiding: "Man < 45, vrouw < 34–35 (Erasmus MC, Franciscus, Zuyderland, SALT). SALT: 70–80 jaar < 40, > 80 jaar < 35.",
              hoog: "Hepatocellulaire schade: virale hepatitis, alcohol, MASLD, medicatie/toxiciteit (o.a. paracetamol), auto-immuun, ischemie, hemochromatose, ziekte van Wilson.",
              noot: "Specifieker voor lever dan ASAT. Bij ASAT/ALAT-ratio > 2 denken aan alcoholische leverziekte."
            },
            {
              id: "asat",
              naam: "ASAT",
              afk: "AST",
              eenheid: "U/L",
              ref: MV([null, "35"], [null, "31"]),
              spreiding: "Erasmus MC, Zuyderland, Franciscus: man < 35, vrouw < 31 · SALT: man < 35, vrouw < 30.",
              hoog: "Leverschade, maar ook spierschade (rhabdomyolyse), hartinfarct, hemolyse.",
              noot: "Minder lever-specifiek dan ALAT."
            },
            {
              id: "ggt",
              naam: "Gamma-GT",
              afk: "γ-GT",
              eenheid: "U/L",
              ref: MV([null, "55"], [null, "38"]),
              spreiding: "Erasmus MC en Zuyderland: man < 55, vrouw < 38.",
              hoog: "Cholestase, alcoholgebruik, enzyminductie (anti-epileptica, rifampicine), MASLD, galstenen.",
              noot: "Gevoelig maar weinig specifiek; nuttig om een verhoogd AF van lever/galweg-oorsprong te onderscheiden van bot."
            },
            {
              id: "af",
              naam: "Alkalische fosfatase",
              afk: "AF",
              eenheid: "U/L",
              ref: MV(["41", "115"], ["39", "98"]),
              spreiding:
                "Erasmus MC: man 41–115 (18–49 jr), 43–115 (≥ 50 jr); vrouw 39–98 (18–49 jr), 47–98 (≥ 50 jr) · Zuyderland: man < 115, vrouw < 98 · Franciscus 0–125.",
              hoog: "Cholestase (intra-/extrahepatisch), botziekten (Paget, metastasen, osteomalacie, fractuurherstel), zwangerschap (placentair), infiltratieve leverziekte.",
              laag: "Hypofosfatasie, zinktekort, ernstige anemie, coeliakie (zelden).",
              noot: "Combineren met GGT: beide verhoogd wijst op lever/galweg."
            },
            {
              id: "bili",
              naam: "Bilirubine (totaal)",
              afk: "Bili",
              eenheid: "µmol/L",
              ref: ALL(null, "17"),
              spreiding: "Erasmus MC < 17 · Zuyderland < 21 · SALT < 18.",
              hoog: "Ongeconjugeerd: hemolyse, ineffectieve erytropoëse, syndroom van Gilbert. Geconjugeerd: cholestase (galsteen, tumor), hepatitis, cirrose. Icterus zichtbaar vanaf ca. 40–50 µmol/L.",
              noot: "Bij geïsoleerd verhoogd (ongeconjugeerd) bilirubine zonder hemolyse en normale leverenzymen: denk aan Gilbert."
            },
            {
              id: "bili_c",
              naam: "Bilirubine (geconjugeerd/direct)",
              afk: "Bili dir.",
              eenheid: "µmol/L",
              ref: ALL(null, "5"),
              spreiding: "Erasmus MC < 5 (> 1 maand) · Franciscus < 8,6.",
              hoog: "Cholestase of hepatocellulaire schade."
            },
            {
              id: "alb",
              naam: "Albumine",
              afk: "Alb",
              eenheid: "g/L",
              ref: ALL("35", "50"),
              spreiding: "Zuyderland 35–50 · Franciscus 35–52 (19–59 jr), 32–46 (60–89 jr), 29–45 (> 90 jr).",
              laag: "Verminderde synthese (cirrose), verlies (nefrotisch syndroom, eiwitverliezende enteropathie, brandwonden), acute fase-reactie, malnutritie, hemodilutie.",
              hoog: "Dehydratie (relatief).",
              noot: "Albumine is een negatief acute-fasen-eiwit en daalt snel bij ernstige ziekte. Nodig voor correctie van calcium en anion gap."
            },
            {
              id: "eiwit",
              naam: "Totaal eiwit",
              afk: "TP",
              eenheid: "g/L",
              ref: ALL("60", "80"),
              spreiding: "Erasmus MC en Zuyderland 60–80.",
              hoog: "Hyperglobulinemie (paraproteïne, chronische ontsteking), dehydratie.",
              laag: "Hypoalbuminemie, hemodilutie."
            },
            {
              id: "nh3",
              naam: "Ammoniak",
              afk: "NH₃",
              eenheid: "µmol/L",
              ref: ALL("10", "45"),
              spreiding: "Erasmus MC < 45 · Zuyderland en Franciscus 10–45.",
              hoog: "Hepatische encefalopathie, ureumcyclusdefecten, valproaat, shunt.",
              noot: "Pre-analytiek is cruciaal: stuwing vermijden, monster direct op ijs naar het lab; anders valselijk hoog."
            },
            {
              id: "che",
              naam: "Cholinesterase",
              afk: "ChE",
              eenheid: "kU/L",
              ref: MV(["6,6", "13,9"], ["4,6", "11,6"]),
              spreiding: "Erasmus MC en Franciscus: man 6,6–13,9, vrouw 4,6–11,6 · Zuyderland 3000–9000 U/L (andere methode).",
              laag: "Verminderde leversynthese, organofosfaatvergiftiging, genetische varianten (verlengde werking succinylcholine).",
              noot: "Methode-afhankelijk."
            }
          ]
        },
        {
          titel: "Pancreas",
          tests: [
            {
              id: "amylase",
              naam: "α-Amylase",
              afk: "Amylase",
              eenheid: "U/L",
              ref: ALL(null, "107"),
              spreiding: "Erasmus MC en Zuyderland < 107 · Franciscus 25–107.",
              hoog: "Acute pancreatitis, parotitis, nierfalen, darmobstructie.",
              noot: "Lipase heeft de voorkeur bij verdenking op pancreatitis."
            },
            {
              id: "lipase",
              naam: "Lipase",
              afk: "Lipase",
              eenheid: "U/L",
              ref: ALL("13", "60"),
              spreiding: "Erasmus MC en Zuyderland 13–60 · Franciscus 8–78.",
              hoog: "Acute pancreatitis (diagnose bij > 3 × bovengrens van normaal in combinatie met klachten/beeldvorming), nierfalen, galwegobstructie.",
              noot: "Hoogte correleert niet met de ernst van de pancreatitis."
            }
          ]
        }
      ]
    },

    /* ------------------------------------------------------------------ HART & SPIER */
    {
      id: "hart",
      titel: "Hart & spier",
      kort: "Hart / spier",
      intro: "Cardiale biomarkers zijn assay-afhankelijk (hs-cTnT versus hs-cTnI). Gebruik altijd de beslisgrenzen van het eigen laboratorium en het lokale protocol.",
      groepen: [
        {
          titel: "Cardiale biomarkers",
          tests: [
            {
              id: "tnt",
              naam: "Troponine T (hooggevoelig)",
              afk: "hs-cTnT",
              eenheid: "ng/L",
              ref: ALL(null, "14"),
              spreiding:
                "Erasmus MC, Zuyderland: < 14 ng/L (99e percentiel, beide geslachten). Erasmus MC vermeldt daarnaast troponine I (andere assay): < 45 ng/L.",
              hoog:
                "Myocardschade: acuut myocardinfarct, myocarditis, longembolie, sepsis, tachyaritmie, hartfalen, nierinsufficiëntie (chronisch licht verhoogd), na reanimatie of cardioversie.",
              noot:
                "Geslachtsspecifiek 99e percentiel (Roche Elecsys): vrouw 9, man 16 ng/L. ESC 0/1-uurspad (hs-cTnT): uitsluiten bij 0 u < 5 ng/L; aantonen bij ≥ 52 ng/L; Δ 0–1 u < 3 uitsluiten, ≥ 5 aantonen. Beoordeel een stijging/daling (delta); een verhoogde waarde is niet gelijk aan myocardinfarct."
            },
            {
              id: "ntprobnp",
              naam: "NT-proBNP",
              afk: "NT-proBNP",
              eenheid: "ng/L",
              ref: ALL(null, "125"),
              spreiding: "Erasmus MC en Zuyderland < 125 ng/L (alle leeftijden).",
              hoog:
                "Hartfalen, atriumfibrilleren, longembolie, nierfunctiestoornis, hoge leeftijd, sepsis. Bij verdenking op acuut hartfalen: < 300 ng/L maakt acuut hartfalen onwaarschijnlijk; diagnostische grenzen (ESC) leeftijdsafhankelijk: < 50 jr > 450 · 50–75 jr > 900 · > 75 jr > 1800 ng/L.",
              noot: "Obesitas verlaagt, nierfunctiestoornis en hoge leeftijd verhogen de waarde. Sacubitril/valsartan beïnvloedt BNP, niet NT-proBNP."
            },
            {
              id: "bnp",
              naam: "BNP",
              afk: "BNP",
              eenheid: "pmol/L",
              ref: ALL(null, "30"),
              spreiding: "Franciscus < 30 pmol/L (≈ 104 ng/L).",
              hoog: "Hartfalen en overige oorzaken van verhoogde wandspanning.",
              noot: "In veel Nederlandse ziekenhuizen is NT-proBNP de standaard."
            },
            {
              id: "ck",
              naam: "Creatinekinase",
              afk: "CK",
              eenheid: "U/L",
              ref: MV([null, "171"], [null, "145"]),
              spreiding: "Erasmus MC en Zuyderland: man < 171, vrouw < 145 · SALT 170/145 · Franciscus man 0–200, vrouw 0–168.",
              hoog: "Rhabdomyolyse, spierziekten, intensieve inspanning, trauma/immobilisatie, statines, hartinfarct, epileptisch insult, intramusculaire injecties.",
              noot: "CK > 5 × bovengrens + myoglobinurie/nierfunctiestoornis: denk aan rhabdomyolyse. Bij statine-myopathie: CK > 10 × bovengrens → staken. Etnische verschillen (hogere CK bij mensen met Afrikaanse afkomst)."
            },
            {
              id: "ckmb",
              naam: "CK-MB (massa)",
              afk: "CK-MB",
              eenheid: "µg/L",
              ref: MV([null, "7,6"], [null, "4,7"]),
              spreiding: "Erasmus MC.",
              hoog: "Myocardschade (niet specifiek; troponine heeft de voorkeur).",
              noot: "Heeft zijn diagnostische rol voor myocardinfarct grotendeels verloren; vooral nuttig bij verdenking op re-infarct."
            },
            {
              id: "myo",
              naam: "Myoglobine",
              afk: "Myo",
              eenheid: "µg/L",
              ref: ALL(null, "76"),
              spreiding: "Erasmus MC < 76.",
              hoog: "Rhabdomyolyse, myocardschade, nierfunctiestoornis."
            },
            {
              id: "ldh",
              naam: "Lactaatdehydrogenase",
              afk: "LDH",
              eenheid: "U/L",
              ref: ALL(null, "248"),
              spreiding: "Erasmus MC en Franciscus < 248 · Zuyderland < 250.",
              hoog: "Hemolyse (ook in vitro), spier- of levercelschade, hartinfarct, longembolie, lymfoom/leukemie en andere maligniteiten, testiscarcinoom, pneumocystis-pneumonie.",
              noot: "Zeer aspecifiek; gebruikt voor prognose en follow-up (bijv. lymfoom) en als hemolyse-parameter (met haptoglobine)."
            }
          ]
        }
      ]
    },

    /* ------------------------------------------------------------------ ONTSTEKING */
    {
      id: "ontsteking",
      titel: "Ontstekingsparameters",
      kort: "Ontsteking",
      intro: "CRP en procalcitonine; bij de hematologie staan leukocyten met differentiatie.",
      groepen: [
        {
          titel: "Acute-fase-eiwitten",
          tests: [
            {
              id: "crp",
              naam: "C-reactief proteïne",
              afk: "CRP",
              eenheid: "mg/L",
              ref: ALL(null, "10"),
              spreiding: "Erasmus MC, Zuyderland, Spijkenisse MC: < 10 · Franciscus (> 17 jaar) 0–5 · SALT ≤ 5,0.",
              hoog:
                "Bacteriële infectie (stijgt na 6–12 uur, piek na 24–48 uur), weefselschade, reumatische ziekten, maligniteit. Virale infecties meestal beperkt verhoogd, maar kunnen hoog zijn.",
              noot: "Lage CRP sluit een bacteriële infectie in de eerste uren niet uit. Een snelle CRP-test (POCT) wordt in de huisartsenpraktijk gebruikt bij lagere luchtweginfecties."
            },
            {
              id: "pct",
              naam: "Procalcitonine",
              afk: "PCT",
              eenheid: "µg/L (= ng/mL)",
              ref: ALL(null, "0,05"),
              tekst: "< 0,05 (gezond) · beslisgrenzen zie details",
              spreiding:
                "Erasmus MC beslisgrenzen: < 0,25 bacteriële infectie onwaarschijnlijk · 0,25–0,50 niet uit te sluiten · > 0,50 zeer waarschijnlijk · > 2 groot risico op sepsis. Zuyderland referentie < 0,05 µg/L.",
              hoog: "Systemische bacteriële infectie/sepsis; ook trauma, chirurgie, nierfalen, kleincellig longcarcinoom.",
              noot: "Nuttig voor het stoppen van antibiotica (afnemend PCT). Stijgt sneller dan CRP (na 3–6 uur) en daalt ook sneller. Eenheden: µg/L = ng/mL."
            },
            {
              id: "bse",
              naam: "Bezinkingssnelheid (BSE)",
              afk: "BSE",
              eenheid: "mm/uur",
              ref: MV([null, "15"], [null, "20"]),
              tekst: "Man: ≤ 50 jr < 15 · > 50 jr < 20 | Vrouw: ≤ 50 jr < 20 · > 50 jr < 30",
              spreiding: "Erasmus MC, Zuyderland en SALT: man ≤ 50 jaar < 15, > 50 jaar < 20; vrouw ≤ 50 jaar < 20, > 50 jaar < 30.",
              hoog: "Reuma-/vaatziekten (polymyalgia reumatica, arteriitis temporalis), infectie, maligniteit (myeloom), anemie, zwangerschap, nierziekte.",
              noot: "Aspecifiek en traag; wordt grotendeels vervangen door CRP. Bij verdenking op arteriitis temporalis blijft de BSE waardevol."
            }
          ]
        }
      ]
    },

    /* ------------------------------------------------------------------ GLUCOSE */
    {
      id: "glucose",
      titel: "Glucose & diabetes",
      kort: "Glucose",
      intro: "Glucose in mmol/L en HbA1c in mmol/mol (IFCC). Het percentage (NGSP, 'DCCT') wordt in Nederland niet meer gebruikt – zie Omrekenen.",
      groepen: [
        {
          titel: "Glucosestofwisseling",
          tests: [
            {
              id: "gluc_n",
              naam: "Glucose (nuchter)",
              afk: "Glu nuchter",
              eenheid: "mmol/L",
              ref: ALL("4,0", "6,1"),
              spreiding: "Erasmus MC en SALT 4,0–6,1 · Franciscus en Zuyderland 4,0–6,4.",
              hoog:
                "Diagnostische grenzen (Erasmus MC): nuchter < 6,1 normaal · 6,1–6,9 gestoorde nuchtere glucose (IFG) · ≥ 7,0 diabetes mellitus. Willekeurig (niet nuchter) ≥ 11,1 mmol/L met klachten = diabetes.",
              laag: "Hypoglycemie < 3,9 mmol/L (alarmwaarde); < 3,0 mmol/L klinisch ernstig. Oorzaken: insuline/sulfonylureumderivaten, alcohol, insulinoom, sepsis, bijnierinsufficiëntie, leverfalen.",
              noot: "Capillaire (POCT) en veneuze volbloedwaarden wijken af van plasmaglucose; monsters in niet-gefluorideerde buizen verliezen glucose (glycolyse)."
            },
            {
              id: "gluc_nn",
              naam: "Glucose (niet nuchter)",
              afk: "Glu postprandiaal",
              eenheid: "mmol/L",
              ref: ALL(null, "7,8"),
              spreiding: "Erasmus MC: niet nuchter < 7,8 normaal · 7,8–11,0 gestoorde glucosetolerantie (IGT) · ≥ 11,1 diabetes mellitus. Franciscus 4,0–11,0 (algemeen).",
              noot: "Bij een orale glucosetolerantietest (OGTT): nuchter < 7,0 en na 2 uur < 7,8 (Franciscus)."
            },
            {
              id: "hba1c",
              naam: "HbA1c (IFCC)",
              afk: "HbA1c",
              eenheid: "mmol/mol",
              ref: ALL("20", "42"),
              spreiding: "Zuyderland en Franciscus 20–42 · Erasmus MC 26–42 · SALT (niet-diabeet) 29–42.",
              hoog:
                "Diabetes mellitus: HbA1c ≥ 48 mmol/mol (6,5 %) is de internationale (WHO/ADA) diagnostische grens; 42–47 verhoogd risico (prediabetes, WHO). Streefwaarden bij diabetes worden individueel bepaald (bij DM2 doorgaans ≈ 53 mmol/mol).",
              noot: "Onbetrouwbaar bij hemolytische anemie, recente bloeding of transfusie, ijzer- of B12-tekort, nierfalen en hemoglobinopathie (varianten)."
            },
            {
              id: "ketonen",
              naam: "Ketonen (β-hydroxyboterzuur)",
              afk: "BHB",
              eenheid: "mmol/L",
              ref: ALL("0,06", "0,20"),
              spreiding: "Erasmus MC β-hydroxyboterzuur 0,06–0,2 · Franciscus POCT-ketonen 0,0–0,6.",
              hoog: "Ketoacidose: diabetische (DKA), alcoholische, hongerketose. Bij diabetes: ≥ 1,5–3 mmol/L (POCT) is verdacht, ≥ 3 mmol/L = hoog risico op DKA.",
              noot: "Het ‘dipstick’-urineketon (acetoacetaat) onderschat β-hydroxyboterzuur."
            },
            {
              id: "cpep",
              naam: "C-peptide (nuchter)",
              afk: "C-peptide",
              eenheid: "nmol/L",
              ref: ALL("0,17", "0,66"),
              spreiding: "Zuyderland nuchter 0,17–0,66 (niet nuchter 0,50–3,00) · Franciscus 0,16–1,10.",
              hoog: "Insulineresistentie, insulinoom, sulfonylureumderivaten, nierfalen.",
              laag: "Type 1 diabetes, pancreasinsufficiëntie; laag C-peptide bij hypoglycemie = exogene insuline."
            }
          ]
        }
      ]
    },

    /* ------------------------------------------------------------------ LIPIDEN */
    {
      id: "lipiden",
      titel: "Lipiden",
      kort: "Lipiden",
      intro:
        "De hier getoonde waarden zijn streefwaarden zoals gerapporteerd door Nederlandse laboratoria. De behandeldoelen worden bepaald door het individuele cardiovasculaire risico (multidisciplinaire richtlijn CVRM, NHG-Standaard CVRM) en kunnen lager liggen.",
      groepen: [
        {
          titel: "Cholesterol en triglyceriden",
          tests: [
            {
              id: "chol",
              naam: "Totaal cholesterol",
              afk: "TC",
              eenheid: "mmol/L",
              ref: ALL(null, "5,0"),
              spreiding: "Franciscus streefwaarde < 5,0 · Zuyderland < 6,2 (streefwaarde < 5,0) · Erasmus MC rapporteert leeftijds-/geslachtsspecifieke populatie-intervallen (bijv. man 40–44 jr 3,6–6,9).",
              hoog: "Primaire (familiaire) hypercholesterolemie, hypothyreoïdie, nefrotisch syndroom, cholestase, dieet.",
              noot: "Niet-nuchter afname is acceptabel voor cholesterol en LDL-C."
            },
            {
              id: "ldl",
              naam: "LDL-cholesterol",
              afk: "LDL-C",
              eenheid: "mmol/L",
              ref: ALL(null, "3,0"),
              spreiding: "Franciscus en Zuyderland < 3,0 · SALT 1,4–4,0. Streefwaarden bij hoog risico of bestaand vaatlijden liggen lager – zie de richtlijn CVRM.",
              hoog: "Zie totaal cholesterol; familiaire hypercholesterolemie bij sterk verhoogd (> 5 mmol/L) en familiaire belasting.",
              noot: "Berekend (Friedewald/Martin) of direct gemeten; Friedewald is onbetrouwbaar bij triglyceriden > 4,5 mmol/L."
            },
            {
              id: "hdl",
              naam: "HDL-cholesterol",
              afk: "HDL-C",
              eenheid: "mmol/L",
              ref: MV(["1,0", null], ["1,2", null]),
              spreiding: "Franciscus en Zuyderland: man > 1,0, vrouw > 1,2 · SALT man 0,9–4,0, vrouw 1,1–4,0.",
              laag: "Metabool syndroom, roken, DM2, overgewicht, hypertriglyceridemie.",
              noot: "Een lage HDL is een risicomarker; verhoging door medicatie verbetert de uitkomst niet."
            },
            {
              id: "tg",
              naam: "Triglyceriden",
              afk: "TG",
              eenheid: "mmol/L",
              ref: ALL(null, "1,7"),
              spreiding: "Franciscus en Zuyderland < 1,7 · SALT (nuchter) 0,6–2,2.",
              hoog: "Overgewicht/metabool syndroom, diabetes, alcohol, nierfalen, hypothyreoïdie; bij > 10 mmol/L risico op acute pancreatitis.",
              noot: "Nuchter afnemen voor betrouwbare triglyceriden."
            },
            {
              id: "nonhdl",
              naam: "Non-HDL-cholesterol",
              afk: "non-HDL-C",
              eenheid: "mmol/L",
              ref: ALL(null, "3,8"),
              spreiding: "Franciscus < 3,8.",
              noot: "Totaal cholesterol minus HDL-cholesterol."
            },
            {
              id: "lpa",
              naam: "Lipoproteïne(a)",
              afk: "Lp(a)",
              eenheid: "nmol/L",
              ref: ALL(null, "75"),
              spreiding: "Erasmus MC en Zuyderland < 75 nmol/L (verhoogd risico bij > 75).",
              hoog: "Genetisch bepaald; onafhankelijke risicofactor voor atherosclerotische hart-vaatziekte en aortastenose.",
              noot: "Eenmalig bepalen is meestal voldoende (nauwelijks beïnvloedbaar door leefstijl)."
            },
            {
              id: "apob",
              naam: "Apolipoproteïne B",
              afk: "ApoB",
              eenheid: "g/L",
              ref: MV(["0,66", "1,33"], ["0,60", "1,17"]),
              spreiding: "Erasmus MC: man 0,66–1,33, vrouw 0,60–1,17 · gewenst < 0,90; verhoogd risico > 1,20.",
              hoog: "Vergroot aantal atherogene deeltjes."
            }
          ]
        }
      ]
    },

    /* ------------------------------------------------------------------ IJZER / ANEMIE */
    {
      id: "anemie",
      titel: "IJzer & bloedarmoede-onderzoek",
      kort: "IJzer / anemie",
      intro: "Hemoglobine staat in de sectie Hematologie. Hb wordt in Nederland uitgedrukt in mmol/L (niet g/dL).",
      groepen: [
        {
          titel: "IJzerstatus",
          tests: [
            {
              id: "ferritine",
              naam: "Ferritine",
              afk: "Ferritine",
              eenheid: "µg/L",
              ref: MV(["30", "240"], ["10", "140"]),
              spreiding:
                "Man/vrouw: Erasmus MC 30–240 / 10–140 · Franciscus 22–275 / 22–204 · Zuyderland man (> 15 jr) 30–400, vrouw 13–150 (15–60 jr) en 30–400 (> 60 jr) · SALT 30–409 / 30–175 (18–50 jr).",
              laag: "IJzertekort (specifiek). Ferritine < 30 µg/L maakt ijzergebrek waarschijnlijk; bij ontsteking, nierziekte of hartfalen kunnen hogere afkapwaarden (tot ca. 100 µg/L) gelden – grenzen verschillen per richtlijn.",
              hoog: "Acute-fase-reactie (ontsteking, infectie, maligniteit), leverziekte, hemochromatose/ijzerstapeling, alcohol, MASLD, hemofagocytaire lymfohistiocytose (zeer hoog).",
              noot: "Ferritine is een acute-fase-eiwit; bij verhoogd CRP is een normale waarde geen sluitend bewijs tegen ijzergebrek."
            },
            {
              id: "ijzer",
              naam: "IJzer (serum)",
              afk: "Fe",
              eenheid: "µmol/L",
              ref: MV(["10", "30"], ["9", "27"]),
              spreiding: "SALT: man 10–30, vrouw 9–27 · Zuyderland 11–30.",
              laag: "IJzergebrek, chronische ziekte (ontsteking).",
              hoog: "IJzerstapeling, hemolyse, recente ijzersuppletie, leverschade.",
              noot: "Grote dag-nachtvariatie; op zichzelf weinig bruikbaar zonder transferrine/ferritine."
            },
            {
              id: "transferrine",
              naam: "Transferrine",
              afk: "Tf",
              eenheid: "g/L",
              ref: ALL("2,0", "3,5"),
              spreiding: "Erasmus MC 2,0–3,5 · Zuyderland 1,90–3,20 · SALT 2,0–4,1.",
              laag: "Acute-fase-reactie, ondervoeding, leverziekte, ijzerstapeling.",
              hoog: "IJzergebrek, zwangerschap, oestrogeengebruik."
            },
            {
              id: "tsat",
              naam: "Transferrineverzadiging",
              afk: "TSAT",
              eenheid: "%",
              ref: MV(["20", "45"], ["15", "45"]),
              spreiding: "Erasmus MC: man 20–45, vrouw 15–45 · Zuyderland 16–45 · Franciscus < 50.",
              laag: "IJzergebrek (< 15–20 %).",
              hoog: "> 45 %: verdenking hemochromatose (bij persistent > 45 % + verhoogd ferritine: HFE-genotypering).",
              noot: "TSAT = ijzer (µmol/L) / (25 × transferrine in g/L) × 100 – zie Rekenhulpen."
            }
          ]
        },
        {
          titel: "Vitamine B12, foliumzuur & hemolyse",
          tests: [
            {
              id: "b12",
              naam: "Vitamine B12 (totaal)",
              afk: "B12",
              eenheid: "pmol/L",
              ref: ALL("145", "637"),
              spreiding: "Erasmus MC 145–637 · SALT 130–700. Een tekort wordt waarschijnlijk bij < ca. 150 pmol/L; bij 150–250 pmol/L ‘grijs gebied’ → methylmalonzuur (MMA) of actief B12 (holotranscobalamine) bepalen.",
              laag: "Pernicieuze anemie (auto-immuun gastritis), strikt veganistisch dieet, ileumresectie/Crohn, metformine, PPI’s/H2-blokkers, distomen- en lachgasgebruik (functioneel tekort).",
              noot: "Aan te vullen met MMA/homocysteïne bij twijfel. Waarden zijn immunoassay-afhankelijk."
            },
            {
              id: "folaat",
              naam: "Foliumzuur (serum)",
              afk: "Folaat",
              eenheid: "nmol/L",
              ref: ALL("5", "40"),
              spreiding: "Erasmus MC 5–40 · Franciscus 7,0–46,4 · Zuyderland 8,8–60,8 · SALT 5,0–23,0. Sterk methodeafhankelijk.",
              laag: "Onvoldoende intake (alcohol), malabsorptie, zwangerschap, methotrexaat, anticonvulsiva, hemolyse (verbruik).",
              noot: "Foliumzuur in erytrocyten (Erasmus MC 1187–2854 nmol/L) is minder wisselend dan serum."
            },
            {
              id: "mma",
              naam: "Methylmalonzuur",
              afk: "MMA",
              eenheid: "µmol/L",
              ref: ALL(null, "0,45"),
              spreiding: "Erasmus MC < 0,45 µmol/L · Zuyderland 50–340 nmol/L.",
              hoog: "Functioneel B12-tekort (ook bij normaal totaal B12), nierfunctiestoornis."
            },
            {
              id: "hcy",
              naam: "Homocysteïne",
              afk: "Hcy",
              eenheid: "µmol/L",
              ref: ALL(null, "15"),
              spreiding: "Erasmus MC < 15.",
              hoog: "B12-, foliaat- of B6-tekort, nierfunctiestoornis, hypothyreoïdie, genetische varianten (MTHFR, CBS)."
            },
            {
              id: "hapto",
              naam: "Haptoglobine",
              afk: "Hapto",
              eenheid: "g/L",
              ref: ALL("0,28", "2,00"),
              spreiding: "Erasmus MC 0,28–2,00 · Zuyderland 0,3–2,0 · Franciscus (> 60 jr) man 0,40–2,68, vrouw 0,63–2,73.",
              laag: "Intravasale hemolyse (haptoglobine wordt verbruikt) in combinatie met ↑LDH, ↑bilirubine, ↑reticulocyten; leverziekte.",
              hoog: "Acute-fase-reactie."
            },
            {
              id: "retic",
              naam: "Reticulocyten (absoluut)",
              afk: "Retic",
              eenheid: "×10⁹/L",
              ref: ALL("25", "100"),
              spreiding: "Zuyderland 25–100 · Erasmus MC 30–95 · Franciscus 25–120. Relatief: 5–25 ‰ (Zuyderland, Franciscus).",
              hoog: "Hemolyse, bloedingsherstel, behandeling van ijzer-/B12-/foliaattekort (reticulocytenrespons na 5–7 dagen).",
              laag: "Aplastische/hypoproliferatieve anemie, beenmergfalen, ijzer-/B12-tekort vóór behandeling, CKD (EPO-gebrek)."
            }
          ]
        }
      ]
    },

    /* ------------------------------------------------------------------ ENDOCRIEN */
    {
      id: "endocrien",
      titel: "Schildklier & endocrinologie",
      kort: "Endocrien",
      intro: "Hormoonbepalingen zijn sterk assay-afhankelijk (platform van de fabrikant). Gebruik bij twijfel altijd het interval op de eigen uitslag.",
      groepen: [
        {
          titel: "Schildklier",
          tests: [
            {
              id: "tsh",
              naam: "TSH",
              afk: "TSH",
              eenheid: "mU/L",
              ref: ALL("0,27", "4,20"),
              spreiding: "Zuyderland en SALT 0,27–4,2 · Franciscus 0,35–4,94.",
              hoog: "Primaire hypothyreoïdie (Hashimoto, thyreoïdectomie, jodiumtekort), herstelfase van thyreoïditis, onvoldoende levothyroxine; bij gebruik van biotine kunnen immunoassays verstoord raken.",
              laag: "Hyperthyreoïdie (Graves, toxisch adenoom, thyreoïditis), te hoge levothyroxine-dosis; centrale hypothyreoïdie (laag-normaal TSH met laag FT4); niet-thyroïdale ziekte, zwangerschap (eerste trimester).",
              noot: "TSH is de eerste test voor schildklierfunctie; bepaal FT4 bij afwijkend TSH of bij verdenking op centrale oorzaak."
            },
            {
              id: "ft4",
              naam: "Vrij T4",
              afk: "FT4",
              eenheid: "pmol/L",
              ref: ALL("11", "22"),
              spreiding: "Zuyderland 11–22 · Franciscus 9–19 (> 19 jaar). Sterk assay-afhankelijk.",
              hoog: "Hyperthyreoïdie, overmatige levothyroxine, amiodaron (vroeg), heparine (artefact in vitro).",
              laag: "Hypothyreoïdie, centrale hypothyreoïdie, ernstige niet-thyroïdale ziekte.",
              noot: "Bij verdenking op centrale hypothyreoïdie: TSH normaal of laag + FT4 laag."
            },
            {
              id: "atpo",
              naam: "Anti-TPO-antistoffen",
              afk: "anti-TPO",
              eenheid: "kU/L",
              ref: ALL(null, "35"),
              spreiding: "Zuyderland < 35.",
              hoog: "Auto-immuunthyreoïditis (Hashimoto), ziekte van Graves.",
              noot: "Positief bij ca. 10 % van gezonde vrouwen; voorspellend voor progressie naar hypothyreoïdie."
            }
          ]
        },
        {
          titel: "Overige endocrinologie",
          tests: [
            {
              id: "cortisol",
              naam: "Cortisol (ochtend, 08–09 uur)",
              afk: "Cortisol",
              eenheid: "nmol/L",
              ref: ALL("140", "690"),
              noCheck: true,
              tekst: "ca. 100–700 (assay-afhankelijk)",
              spreiding: "Zuyderland 08–09 uur 140–690 · Franciscus < 10 uur 101–536, > 17 uur 79–478.",
              laag: "Bijnierinsufficiëntie: ochtendcortisol < ca. 100 nmol/L maakt insufficiëntie zeer waarschijnlijk; > ca. 400–500 nmol/L sluit dit vrijwel uit (grenzen assayafhankelijk); tussenwaarden: synacthentest.",
              hoog: "Syndroom van Cushing (dag-nachtritme verdwenen), stress, oestrogeen (door CBG-stijging), orale anticonceptie.",
              noot: "Diurnale ritme: ’s avonds ca. 50 % van ochtendwaarde. Prednisolon geeft kruisreactie in veel assays."
            },
            {
              id: "pth",
              naam: "PTH (intact)",
              afk: "PTH",
              eenheid: "pmol/L",
              ref: ALL("1,6", "6,9"),
              spreiding: "Zuyderland 1,6–6,9 · Franciscus 1,6–7,2.",
              hoog: "Primaire hyperparathyreoïdie (hoog Ca), secundair (laag Ca / vitamine D-tekort / nierfalen), tertiair.",
              laag: "Hypoparathyreoïdie, hypercalciëmie door andere oorzaak (maligniteit): PTH ‘onderdrukt’."
            },
            {
              id: "vitd",
              naam: "Vitamine D (25-OH)",
              afk: "25-OH-D",
              eenheid: "nmol/L",
              ref: ALL("50", null),
              tekst: "≥ 50 (streef) · < 30 tekort",
              spreiding: "SALT > 50 nmol/L. Gezondheidsraad (2012): adequaat bij ≥ 30 nmol/L voor de algemene bevolking; streef ≥ 50 nmol/L bij 70+ en risicogroepen.",
              laag: "Onvoldoende zonlicht/huidpigmentatie, malabsorptie, nierziekte, lever, anticonvulsiva.",
              hoog: "Intoxicatie bij overdosering (> 250 nmol/L); hypercalciëmie.",
              noot: "Alleen bepalen bij een duidelijke indicatie (o.a. botziekte, malabsorptie); suppletiebeleid volgens Gezondheidsraad/Voedingscentrum en de geldende richtlijnen."
            },
            {
              id: "testo",
              naam: "Testosteron (totaal)",
              afk: "T",
              eenheid: "nmol/L",
              ref: MV(["6,7", "29"], ["0,1", "1,7"]),
              spreiding: "Zuyderland.",
              laag: "Hypogonadisme (primair/secundair), obesitas, opioïden, acute ziekte.",
              hoog: "Man: androgene stoornissen; vrouw: PCOS, bijnier-/ovariumtumor.",
              noot: "Ochtend-nuchter afnemen; bij twijfel herhalen. SHBG (man 10–57 nmol/L, vrouw 18–144 nmol/L, Zuyderland) beïnvloedt totaal testosteron."
            },
            {
              id: "hcg",
              naam: "hCG (niet-zwanger)",
              afk: "hCG",
              eenheid: "U/L",
              ref: MV([null, "3"], [null, "5"]),
              spreiding: "Zuyderland man < 3, vrouw < 5 · Erasmus MC man < 2,0, vrouw premenopauzaal < 1,0–7,0 (afhankelijk van assay).",
              hoog: "Zwangerschap (positief vanaf ca. 8–11 dagen na conceptie), molazwangerschap, hCG-producerende tumoren (germinaal, trofoblast).",
              noot: "Urine-zwangerschapstesten zijn gevoelig vanaf ca. 25 U/L."
            }
          ]
        }
      ]
    },

    /* ------------------------------------------------------------------ HEMATOLOGIE */
    {
      id: "hematologie",
      titel: "Hematologie (bloedbeeld)",
      kort: "Hematologie",
      intro:
        "Volbloed (EDTA). Nederlandse labs rapporteren Hb in mmol/L en hematocriet als fractie (L/L). WHO-anemiegrenzen: Hb < 8,1 mmol/L (man) en < 7,5 mmol/L (vrouw).",
      groepen: [
        {
          titel: "Rode cellen",
          tests: [
            {
              id: "hb",
              naam: "Hemoglobine",
              afk: "Hb",
              eenheid: "mmol/L",
              ref: MV(["8,5", "11,0"], ["7,5", "10,0"]),
              spreiding:
                "Certe, Zuyderland, Franciscus, SALT en NIV: man 8,5–11,0, vrouw 7,5–10,0 · Erasmus MC man 8,6–10,5, vrouw 7,5–9,5.",
              laag: "Anemie: bloedverlies, ijzer-/B12-/foliaattekort, chronische ziekte, hemolyse, beenmergfalen, nierziekte (EPO-tekort). Hemodilutie (zwangerschap, vochtbelasting).",
              hoog: "Polycythemie (polycythemia vera, secundair: hypoxie/COPD, roken, slaapapneu, testosteron, SGLT2-remmers), dehydratie.",
              noot: "1 g/dL = 0,6206 mmol/L. Bij acuut bloedverlies daalt het Hb pas na hemodilutie (uren)."
            },
            {
              id: "ht",
              naam: "Hematocriet",
              afk: "Ht",
              eenheid: "L/L",
              ref: MV(["0,40", "0,50"], ["0,35", "0,45"]),
              spreiding: "Certe man 0,40–0,50, vrouw 0,35–0,45 · Erasmus MC vrouw 0,36–0,46 · NIV man 0,41–0,51, vrouw 0,36–0,47.",
              laag: "Anemie, hemodilutie.",
              hoog: "Polycythemie, dehydratie."
            },
            {
              id: "ery",
              naam: "Erytrocyten",
              afk: "RBC",
              eenheid: "×10¹²/L",
              ref: MV(["4,4", "5,6"], ["3,9", "4,9"]),
              spreiding: "Erasmus MC · NIV man 4,4–5,8, vrouw 4,0–5,3 · Zuyderland man 4,5–5,5, vrouw 4,0–5,0."
            },
            {
              id: "mcv",
              naam: "MCV",
              afk: "MCV",
              eenheid: "fL",
              ref: ALL("80", "100"),
              spreiding: "Alle geraadpleegde laboratoria 80–100.",
              laag: "Microcytair: ijzergebrek, thalassemie, anemie bij chronische ziekte (soms), sideroblastaire anemie.",
              hoog: "Macrocytair: vitamine B12-/foliaattekort, alcohol, hypothyreoïdie, leverziekte, myelodysplasie, medicatie (methotrexaat, hydroxyureum, azathioprine), reticulocytose."
            },
            {
              id: "mch",
              naam: "MCH",
              afk: "MCH",
              eenheid: "fmol",
              ref: ALL("1,70", "2,10"),
              spreiding: "Zuyderland en Franciscus 1,70–2,10 (NIV: 1600–2100 amol)."
            },
            {
              id: "mchc",
              naam: "MCHC",
              afk: "MCHC",
              eenheid: "mmol/L",
              ref: ALL("19,3", "22,5"),
              spreiding: "Zuyderland 19,3–22,5 · Franciscus man 20,1–21,7, vrouw 19,7–21,5 · NIV 19–23."
            },
            {
              id: "rdw",
              naam: "RDW",
              afk: "RDW",
              eenheid: "%",
              ref: ALL("12,0", "16,0"),
              spreiding: "Erasmus MC 12,0–16,0 · Franciscus man 12,3–14,3, vrouw 12,4–15,1. Analyser-afhankelijk.",
              hoog: "Anisocytose: ijzergebrek, gemengd tekort, hemolyse, recente transfusie."
            }
          ]
        },
        {
          titel: "Witte cellen & bloedplaatjes",
          tests: [
            {
              id: "leuko",
              naam: "Leukocyten",
              afk: "WBC",
              eenheid: "×10⁹/L",
              ref: ALL("4,0", "10,0"),
              spreiding: "Zuyderland, SALT, Spijkenisse MC, NIV 4,0–10,0 · Erasmus MC 3,5–10,0.",
              hoog: "Leukocytose: bacteriële infectie, ontsteking, stress/corticosteroïden, roken, leukemie/myeloproliferatieve ziekte.",
              laag: "Leukopenie: virale infectie, medicatie (chemotherapie, clozapine, thyreostatica), beenmergfalen, auto-immuunziekten, hypersplenisme; absolute neutrofielen < 0,5 × 10⁹/L = ernstige neutropenie.",
              noot: "Gebruik de absolute telling (niet het percentage) bij het beoordelen van differentiatie."
            },
            {
              id: "neutro",
              naam: "Neutrofielen (absoluut)",
              afk: "Neutro",
              eenheid: "×10⁹/L",
              ref: ALL("2,0", "7,0"),
              spreiding: "Zuyderland 2,0–7,0 · Erasmus MC 1,4–8,0 · NIV 1,5–9,0. Percentage 40–80 % (Zuyderland).",
              hoog: "Bacteriële infectie, stress, corticosteroïden, roken.",
              laag: "Neutropenie (< 1,5 × 10⁹/L); ernstig < 0,5 × 10⁹/L: koortsende patiënt = spoed (febriele neutropenie).",
              noot: "Etnische neutropenie (Duffy-null) komt voor bij mensen van Afrikaanse of Midden-Oosterse afkomst; ondergrens ca. 1,0 × 10⁹/L."
            },
            {
              id: "lymfo",
              naam: "Lymfocyten (absoluut)",
              afk: "Lymfo",
              eenheid: "×10⁹/L",
              ref: ALL("1,0", "3,0"),
              spreiding: "Zuyderland 1,0–3,0 · NIV 1,0–4,0. Percentage 20–40 %.",
              hoog: "Virale infectie, CLL, kinkhoest.",
              laag: "Virale infectie (HIV), corticosteroïden, stress, immuunsuppressie."
            },
            {
              id: "mono",
              naam: "Monocyten (absoluut)",
              afk: "Mono",
              eenheid: "×10⁹/L",
              ref: ALL("0,2", "1,0"),
              spreiding: "Zuyderland 0,2–1,0 · NIV 0,2–0,8 · Erasmus MC 0,18–1,4 (> 18 jaar). Percentage 2–10 %.",
              hoog: "Chronische infectie (tbc), herstel, CMML, sarcoïdose."
            },
            {
              id: "eos",
              naam: "Eosinofielen (absoluut)",
              afk: "Eos",
              eenheid: "×10⁹/L",
              ref: ALL("0,02", "0,50"),
              spreiding: "Zuyderland 0,02–0,5 · Erasmus MC 0,04–0,60 · NIV < 0,4. Percentage 1–6 %.",
              hoog: "Allergie/atopie, astma, parasitose, medicatie (DRESS), eosinofiele aandoeningen, M. Addison, hematologische maligniteit."
            },
            {
              id: "baso",
              naam: "Basofielen (absoluut)",
              afk: "Baso",
              eenheid: "×10⁹/L",
              ref: ALL("0,02", "0,10"),
              spreiding: "Zuyderland 0,02–0,1 · Erasmus MC 0,04–0,2 · NIV < 0,2. Percentage 0–2 %."
            },
            {
              id: "trombo",
              naam: "Trombocyten",
              afk: "PLT",
              eenheid: "×10⁹/L",
              ref: ALL("150", "400"),
              spreiding: "Zuyderland, Franciscus, SALT, NIV 150–400 · Erasmus MC 150–370.",
              laag:
                "Trombocytopenie: ITP, medicatie (heparine – HIT, chemotherapie), beenmergfalen, hypersplenisme, DIC/TTP/HUS, pseudotrombopenie (EDTA-klontering – herhaal in citraatbuis). Bloedingsrisico neemt toe < 50 × 10⁹/L; spontane bloedingen < 10–20 × 10⁹/L.",
              hoog: "Reactief (infectie, ontsteking, ijzergebrek, na splenectomie), essentiële trombocytemie/myeloproliferatieve ziekte."
            },
            {
              id: "mpv",
              naam: "Gemiddeld trombocytenvolume",
              afk: "MPV",
              eenheid: "fL",
              ref: ALL("7", "11"),
              spreiding: "Erasmus MC 7–11.",
              hoog: "Verhoogde trombocytenaanmaak (ITP), macrotrombocytaire aandoeningen."
            }
          ]
        }
      ]
    },

    /* ------------------------------------------------------------------ STOLLING */
    {
      id: "stolling",
      titel: "Stolling",
      kort: "Stolling",
      intro: "Stollingsuitslagen zijn reagens- en analyser-specifiek. Gebruik altijd het referentie-interval van het eigen laboratorium.",
      groepen: [
        {
          titel: "Globale stollingstesten",
          tests: [
            {
              id: "inr",
              naam: "INR (protrombinetijd)",
              afk: "INR",
              eenheid: "–",
              ref: ALL(null, "1,15"),
              tekst: "< 1,15 (zonder VKA)",
              spreiding: "Zuyderland < 1,15 · Franciscus PT 10–13 s. Streefgebied bij vitamine K-antagonisten wordt bepaald door de trombosedienst (Zuyderland: intensiteitsgroep 1 = 2,0–3,0; groep 2 = 2,5–3,5).",
              hoog: "VKA-gebruik, leverfalen, vitamine K-tekort (malabsorptie, antibiotica, galwegobstructie), DIC, factor VII-tekort; directe orale anticoagulantia (DOAC’s) verhogen de INR variabel en onbetrouwbaar.",
              noot: "INR is niet geschikt voor monitoring van DOAC’s; bij leverziekte weerspiegelt INR de synthese-functie (maar niet het bloedingsrisico)."
            },
            {
              id: "aptt",
              naam: "APTT",
              afk: "APTT",
              eenheid: "s",
              ref: ALL("24", "33"),
              spreiding: "Zuyderland 24–33 · Franciscus 20–29. Therapeutisch bij ongefractioneerde heparine: 1,5–2,5 × de uitgangswaarde (Zuyderland).",
              hoog: "Heparine, lupus anticoagulans, factor VIII-/IX-/XI-/XII-tekort (hemofilie A/B), von Willebrand (secundair), DIC, leverziekte.",
              noot: "Een verlengde APTT bij een normale PT en bloedingsneiging: factor VIII/IX; zonder bloedingsneiging: factor XII of lupus anticoagulans."
            },
            {
              id: "fibr",
              naam: "Fibrinogeen",
              afk: "Fibrinogeen",
              eenheid: "g/L",
              ref: ALL("2,0", "4,0"),
              spreiding: "Franciscus en SALT 2,0–4,0 · Zuyderland 2,0–5,0.",
              laag: "DIC, ernstige leverziekte, massaal bloedverlies, hyperfibrinolyse, congenitale (a)fibrinogenemie, asparaginase. Ernstig < 1,0 g/L: substitutie overwegen.",
              hoog: "Acute-fase-reactie, zwangerschap, roken."
            },
            {
              id: "ddimeer",
              naam: "D-dimeer",
              afk: "D-dimeer",
              eenheid: "mg/L (FEU)",
              ref: ALL(null, "0,50"),
              tekst: "< 0,50 (≤ 50 jr) · leeftijd × 0,01 (> 50 jr)",
              spreiding:
                "Franciscus < 0,50 mg/L · Zuyderland ≤ 50 jaar < 500 µg/L; > 50 jaar leeftijd × 10 µg/L (bijv. 70 jaar → < 700 µg/L).",
              hoog: "Trombo-embolie (DVT, longembolie), DIC, infectie/sepsis, maligniteit, trauma/chirurgie, zwangerschap, hoge leeftijd, aortadissectie.",
              noot: "Alleen bruikbaar om trombo-embolie uit te sluiten bij een lage of matige klinische kans (Wells/YEARS). Let op de eenheid: FEU-assays versus DDU-assays (DDU-waarden zijn ongeveer de helft); leeftijdsgecorrigeerde afkap bij > 50 jaar."
            },
            {
              id: "tt",
              naam: "Trombinetijd",
              afk: "TT",
              eenheid: "s",
              ref: ALL("14,0", "21,0"),
              spreiding: "Zuyderland 14,0–21,0.",
              hoog: "Heparine, dabigatran, hypo-/dysfibrinogenemie, paraproteïne."
            }
          ]
        },
        {
          titel: "Stollingsfactoren & inhibitoren",
          tests: [
            {
              id: "factoren",
              naam: "Stollingsfactoren II, V, VII, IX, X, XI",
              afk: "Factoren",
              eenheid: "%",
              ref: ALL("70", "120"),
              spreiding: "Zuyderland: elk 70–120 %.",
              laag: "Aangeboren tekort, leverziekte, vitamine K-tekort/VKA (II, VII, IX, X), DIC."
            },
            {
              id: "f8",
              naam: "Factor VIII-activiteit",
              afk: "FVIII",
              eenheid: "%",
              ref: ALL("70", "150"),
              spreiding: "Zuyderland 70–150.",
              laag: "Hemofilie A, ziekte van von Willebrand type 3/2N.",
              hoog: "Acute-fase-reactie, zwangerschap, stress, hoge leeftijd, risicofactor voor veneuze trombose."
            },
            {
              id: "at",
              naam: "Antitrombine",
              afk: "AT",
              eenheid: "%",
              ref: ALL("80", "120"),
              spreiding: "Zuyderland 80–120.",
              laag: "Aangeboren tekort, leverziekte, nefrotisch syndroom, DIC, heparine (lichte daling), asparaginase."
            },
            {
              id: "protc",
              naam: "Proteïne C (activiteit)",
              afk: "Prot C",
              eenheid: "%",
              ref: ALL("70", "140"),
              spreiding: "Zuyderland 70–140.",
              laag: "Aangeboren tekort, leverziekte, VKA (daalt snel – bepalen vóór start of na staken), DIC."
            },
            {
              id: "prots",
              naam: "Proteïne S (vrij antigeen)",
              afk: "Prot S",
              eenheid: "%",
              ref: ALL("55", "120"),
              spreiding: "Zuyderland 55–120.",
              laag: "Aangeboren tekort, zwangerschap, oestrogeengebruik, leverziekte, VKA, acute trombose."
            }
          ]
        }
      ]
    },

    /* ------------------------------------------------------------------ VITAMINES */
    {
      id: "vitaminen",
      titel: "Vitaminen",
      kort: "Vitaminen",
      intro: "Vitamine D, B12 en foliumzuur staan elders (zie Schildklier & endocrinologie resp. IJzer & bloedarmoede-onderzoek). Vitaminebepalingen zijn sterk methodeafhankelijk; de spreiding tussen laboratoria is hier groot.",
      groepen: [
        {
          titel: "Vitamines",
          tests: [
            {
              id: "vit_a",
              naam: "Vitamine A (retinol)",
              afk: "Vit A",
              eenheid: "µmol/L",
              ref: ALL("1,0", "3,3"),
              spreiding: "SALT 1,0–3,3 · Franciscus 1,0–3,0 · Erasmus MC 1,0–4,2 · Zuyderland 1,05–2,8.",
              laag: "Malabsorptie, leverziekte, ondervoeding; nachtblindheid."
            },
            {
              id: "vit_e",
              naam: "Vitamine E (α-tocoferol)",
              afk: "Vit E",
              eenheid: "µmol/L",
              ref: ALL("17,6", "44,2"),
              spreiding: "Franciscus 17,6–44,2 · Erasmus MC 18,5–50,1 · Zuyderland 12,8–41,8 · SALT (> 18 jr) 12,8–39,5.",
              noot: "Hangt af van lipidenspiegel; bij hypercholesterolemie interpreteren t.o.v. lipiden."
            },
            {
              id: "vit_b1",
              naam: "Vitamine B1 (thiamine)",
              afk: "B1",
              eenheid: "nmol/L",
              ref: ALL("75", "185"),
              noCheck: true,
              tekst: "ca. 70–200 (methodeafh.)",
              spreiding: "Erasmus MC 70–140 · Franciscus 70–185 · SALT 75–200 · Zuyderland 100–230.",
              laag: "Alcoholisme, malnutritie, bariatrische chirurgie, hyperemesis; Wernicke–Korsakov (behandel op verdenking, niet pas na uitslag).",
              noot: "Bij verdenking op Wernicke-encefalopathie niet wachten op de uitslag."
            },
            {
              id: "vit_b6",
              naam: "Vitamine B6 (PLP)",
              afk: "B6",
              eenheid: "nmol/L",
              ref: ALL("35", "110"),
              spreiding: "Erasmus MC en Franciscus 35–110 · SALT 35–200 · Zuyderland 50–200.",
              laag: "Alcohol, isoniazide, malabsorptie.",
              hoog: "Overmatige suppletie (neuropathie bij langdurig hoge dosis)."
            }
          ]
        }
      ]
    },

    /* ------------------------------------------------------------------ EIWITTEN / IMMUNOLOGIE */
    {
      id: "immuno",
      titel: "Immunologie & eiwitten",
      kort: "Immunologie",
      intro: "Immunoglobulines, complement en eiwitspectrum.",
      groepen: [
        {
          titel: "Immunoglobulines & complement",
          tests: [
            {
              id: "igg",
              naam: "IgG",
              afk: "IgG",
              eenheid: "g/L",
              ref: ALL("7,0", "16,0"),
              spreiding: "Erasmus MC (> 16 jaar), Zuyderland, Franciscus (> 11 jaar): 7,0–16,0.",
              hoog: "Polyklonale hypergammaglobulinemie (chronische infectie, auto-immuun, leverziekte); monoklonaal (MGUS/myeloom).",
              laag: "Primaire/secundaire immuundeficiëntie, nefrotisch syndroom, eiwitverliezende enteropathie, myeloom (andere subklassen)."
            },
            {
              id: "iga",
              naam: "IgA",
              afk: "IgA",
              eenheid: "g/L",
              ref: ALL("0,7", "4,0"),
              spreiding: "Erasmus MC 0,76–3,90 (> 18 jaar) · Zuyderland 0,7–4,0.",
              laag: "Selectief IgA-deficiëntie (vaak asymptomatisch; kan coeliakie-serologie beïnvloeden → IgG-gebaseerde tests)."
            },
            {
              id: "igm",
              naam: "IgM",
              afk: "IgM",
              eenheid: "g/L",
              ref: ALL("0,45", "2,30"),
              spreiding: "Erasmus MC 0,45–2,30 · Zuyderland 0,40–2,30.",
              hoog: "Waldenström, acute infecties, auto-immuun."
            },
            {
              id: "ige",
              naam: "IgE (totaal)",
              afk: "IgE",
              eenheid: "kU/L",
              ref: ALL(null, "87"),
              spreiding: "Zuyderland < 87 (> 9 jaar).",
              hoog: "Atopie, parasitose, allergische bronchopulmonale aspergillose, hyper-IgE-syndroom."
            },
            {
              id: "c3",
              naam: "Complement C3",
              afk: "C3",
              eenheid: "g/L",
              ref: ALL("0,9", "1,8"),
              spreiding: "Erasmus MC, Franciscus, Zuyderland: 0,9–1,8.",
              laag: "SLE (actief), glomerulonefritis (postinfectieus, MPGN), erfelijk tekort, sepsis."
            },
            {
              id: "c4",
              naam: "Complement C4",
              afk: "C4",
              eenheid: "g/L",
              ref: ALL("0,1", "0,4"),
              spreiding: "Erasmus MC, Franciscus, Zuyderland: 0,1–0,4.",
              laag: "SLE, erfelijk angio-oedeem (C1-esteraseremmer-deficiëntie), immuuncomplexziekte."
            }
          ]
        },
        {
          titel: "Overige eiwitten",
          tests: [
            {
              id: "a1at",
              naam: "α1-Antitrypsine",
              afk: "AAT",
              eenheid: "g/L",
              ref: ALL("0,90", "2,00"),
              spreiding: "Erasmus MC, Franciscus, Zuyderland: 0,90–2,00.",
              laag: "α1-antitrypsinedeficiëntie (emfyseem op jonge leeftijd, leverziekte).",
              hoog: "Acute-fase-eiwit."
            },
            {
              id: "cerul",
              naam: "Ceruloplasmine",
              afk: "Ceruloplasmine",
              eenheid: "g/L",
              ref: MV(["0,15", "0,30"], ["0,16", "0,45"]),
              spreiding: "Erasmus MC en Zuyderland.",
              laag: "Ziekte van Wilson, ernstig leverfalen, malnutritie.",
              hoog: "Acute-fase, zwangerschap, oestrogeengebruik."
            },
            {
              id: "elfo",
              naam: "Eiwitspectrum (elektroforese)",
              afk: "EF",
              eenheid: "g/L",
              ref: ALL("35", "50"),
              tekst: "Albumine 35–50 · α1 1–4 · α2 4–10 · β 5–9 · γ 5–18",
              noCheck: true,
              spreiding: "Erasmus MC (g/L): totaal eiwit 60–80, albumine 35–50, α1-globuline 1–4, α2 4–10, β 5–9, γ 5–18.",
              hoog: "Monoklonale piek (MGUS, myeloom, Waldenström), polyklonale γ-vermeerdering (chronische ontsteking, leverziekte).",
              noot: "Bij een M-proteïne: kwantificeren en aanvullend immunofixatie en vrije lichte ketens."
            },
            {
              id: "flc",
              naam: "Vrije lichte ketens",
              afk: "FLC",
              eenheid: "mg/L",
              ref: ALL("0,26", "1,65"),
              tekst: "κ/λ-ratio 0,26–1,65 (nierfunctiestoornis 0,37–3,10)",
              noCheck: true,
              spreiding:
                "Erasmus MC (assay-gebonden): κ 3,3–19,4 · λ 5,7–26,3 · ratio 0,26–1,65 · bij nierfunctiestoornis ratio 0,37–3,10. Franciscus (nieuwe assay): κ 6,7–22,4 · λ 8,3–27,0 · ratio 0,31–1,56.",
              hoog: "Abnormale ratio: monoklonale gammopathie (myeloom, AL-amyloïdose, MGUS); beide verhoogd met normale ratio: nierfunctiestoornis.",
              noot: "Referentiewaarden verschillen sterk per assay: alleen interpreteren met de assay-specifieke grenzen."
            },
            {
              id: "b2m",
              naam: "β2-Microglobuline",
              afk: "β2-MG",
              eenheid: "mg/L",
              ref: ALL(null, "2,40"),
              tekst: "< 2,40 (< 60 jr) · < 3,00 (≥ 60 jr)",
              spreiding: "Zuyderland.",
              hoog: "Nierfunctiestoornis, multipel myeloom/lymfoom (prognostisch), chronische ontsteking."
            },
            {
              id: "ace",
              naam: "ACE (angiotensine-converterend enzym)",
              afk: "ACE",
              eenheid: "U/L",
              ref: ALL("12", "68"),
              spreiding: "Zuyderland 12–68 · Franciscus 20–70 · Erasmus MC 12–82 (genotype-gecorrigeerd: D/D 30–89, D/I 16–75, I/I 8–62).",
              hoog: "Sarcoïdose (matige sensitiviteit/specificiteit), ziekte van Gaucher, hyperthyreoïdie.",
              laag: "ACE-remmers.",
              noot: "Geen screeningstest voor sarcoïdose; diagnose berust op klinisch beeld, beeldvorming en histologie."
            }
          ]
        }
      ]
    },

    /* ------------------------------------------------------------------ TUMORMARKERS */
    {
      id: "tumor",
      titel: "Tumormarkers",
      kort: "Tumormarkers",
      intro:
        "Tumormarkers zijn niet geschikt voor screening of als enige diagnostische test; ze worden vooral gebruikt voor follow-up van een bekende maligniteit. Referentiewaarden zijn assayafhankelijk.",
      groepen: [
        {
          titel: "Tumormarkers",
          tests: [
            {
              id: "cea",
              naam: "CEA",
              afk: "CEA",
              eenheid: "µg/L",
              ref: ALL(null, "5,0"),
              tekst: "< 5,0 (niet-roker) · < 10 (roker)",
              spreiding: "Erasmus MC: niet-rokers < 5,0, rokers < 10,0 · Zuyderland: niet-rokers < 5,0, rokers < 6,5.",
              hoog: "Colorectaal carcinoom (follow-up), pancreas, long, mamma; niet-maligne: roken, ontsteking, leverziekte."
            },
            {
              id: "ca125",
              naam: "CA-125",
              afk: "CA-125",
              eenheid: "kU/L",
              ref: ALL(null, "35"),
              spreiding: "Erasmus MC en Zuyderland < 35 · Franciscus < 35.",
              hoog: "Ovariumcarcinoom (follow-up); ook endometriose, menstruatie, ascites, pleurale vloeistof, hartfalen."
            },
            {
              id: "ca199",
              naam: "CA 19-9",
              afk: "CA 19-9",
              eenheid: "kU/L",
              ref: ALL(null, "35"),
              spreiding: "Erasmus MC < 35 · Franciscus < 39 kE/L.",
              hoog: "Pancreas-/galwegcarcinoom; cholestase, pancreatitis. Niet bij Lewis-negatieve personen (geen CA 19-9 aanmaak)."
            },
            {
              id: "ca153",
              naam: "CA 15-3",
              afk: "CA 15-3",
              eenheid: "kU/L",
              ref: ALL(null, "30"),
              spreiding: "Erasmus MC < 30 · Zuyderland (vrouw) < 28 · Franciscus < 31.",
              hoog: "Gemetastaseerd mammacarcinoom (follow-up)."
            },
            {
              id: "afp",
              naam: "α-Foetoproteïne",
              afk: "AFP",
              eenheid: "µg/L",
              ref: ALL(null, "10"),
              spreiding: "Erasmus MC < 10 µg/L · Zuyderland < 5,8 kU/L · Franciscus < 7 IU/mL (ander eenheidssysteem).",
              hoog: "Hepatocellulair carcinoom, kiemceltumoren (non-seminoom), zwangerschap, chronische leverziekte/hepatitis (licht)."
            },
            {
              id: "psa",
              naam: "PSA (totaal)",
              afk: "PSA",
              eenheid: "µg/L",
              ref: ALL(null, "3,0"),
              tekst: "< 3,0 (Franciscus) – leeftijdsafhankelijk",
              noCheck: true,
              spreiding: "Zuyderland (leeftijdsafhankelijk): < 50 jr < 2,5 · 50–60 jr < 3,5 · 60–70 jr < 4,5 · > 70 jr < 6,5. Vrij/totaal-ratio > 0,15 (gunstiger).",
              hoog: "Prostaatcarcinoom, BPH, prostatitis, recente manipulatie (fietsen, ejaculatie, katheter, rectaal toucher/biopsie).",
              noot: "Interpretatie en beleid volgens de actuele NHG-/urologierichtlijn."
            }
          ]
        }
      ]
    },

    /* ------------------------------------------------------------------ OVERIG */
    {
      id: "overig",
      titel: "Overig",
      kort: "Overig",
      intro: "Medicatiespiegels en intoxicaties. Streefgebieden zijn indicatie- en assayafhankelijk; overleg bij twijfel met de ziekenhuisapotheker/klinisch farmacoloog.",
      groepen: [
        {
          titel: "Spiegels",
          tests: [
            {
              id: "lithium",
              naam: "Lithium",
              afk: "Li",
              eenheid: "mmol/L",
              ref: ALL("0,4", "0,8"),
              tekst: "0,4–0,8 (profylaxe) · 1,0–1,2 (acute manie)",
              spreiding: "Erasmus MC.",
              hoog:
                "Lithiumintoxicatie: tremor, ataxie, braken, verwardheid; gevaarlijk > 1,5 mmol/L. Risicofactoren: dehydratie, nierfunctiestoornis, NSAID’s, ACE-remmers/ARB’s, thiazide.",
              noot: "Dalspiegel 12 uur na de laatste inname."
            },
            {
              id: "alcohol",
              naam: "Alcohol (ethanol)",
              afk: "EtOH",
              eenheid: "‰",
              ref: ALL(null, "0,1"),
              spreiding: "Franciscus < 0,1 ‰.",
              hoog: "Wettelijke grens verkeer: 0,5 ‰ (bloedalcoholconcentratie; beginnende bestuurders 0,2 ‰).",
              noot: "1 ‰ = 1 g ethanol per kg bloed ≈ 21,7 mmol/L."
            }
          ]
        }
      ]
    }
  ];

  const bronnen = [
    {
      naam: "Erasmus MC – Afdeling Klinische Chemie: Referentie-intervallen (versie 1-9-2026)",
      url: "https://www.erasmusmc.nl/-/media/erasmusmc/pdf/2-themaoverstijgend/laboratoriumdiagnostiek/afdelingen/klinische-chemie/referentie-intervallen-akc-versie-september-2026.pdf"
    },
    {
      naam: "Franciscus Gasthuis & Vlietland – Klinisch Chemisch Laboratorium en Trombosedienst: Referentiewaardenlijst bloed (2023)",
      url: "https://verwijzers.franciscus.nl/uploads/2023-06/Referentiewaardenlijst%20Bloed%20.pdf"
    },
    {
      naam: "Zuyderland Medisch Centrum – KCHL: Referentiewaarden (25-03-2020)",
      url: "https://zuyderland.nl/wp-content/uploads/2020/03/Overzicht-referentiewaarden-KCHL-25-3-2020.pdf"
    },
    {
      naam: "SALT – Referentiewaarden (september 2024)",
      url: "https://www.salt.nl/wp-content/uploads/2024/10/Referentiewaarden_2024-09.pdf"
    },
    {
      naam: "Certe Bepalingenwijzer – Hemoglobine en Hematocriet",
      url: "https://bepalingenwijzer.certe.nl/determinations/1030297/hemoglobine"
    },
    {
      naam: "Deventer Ziekenhuis – Labgids: pH bloedgas arterieel (incl. pCO₂, pO₂, HCO₃⁻, BE, SO₂)",
      url: "https://labgids.dz.nl/item/ph-bloedgas-arterieel-6wWd"
    },
    {
      naam: "Nederlandse Internisten Vereniging (NIV) / Hematologie Nederland – Normaalwaarden (volledig bloedbeeld)",
      url: "https://hematologienederland.nl/patientinfo/diagnose-en-behandeling/normaalwaarden/"
    },
    {
      naam: "Spijkenisse Medisch Centrum – KCL Referentiewaarden (versie 60, 2019): ter vergelijking (o.a. kreatinine, ureum, kalium, magnesium)",
      url: "https://www.spijkenissemc.nl/wp-content/uploads/2019/05/Referentiewaarden-locatie-KCL-SMC-Versie-60.pdf"
    },
    {
      naam: "SCAL – Referentiewaarden (maart 2018): ter vergelijking (o.a. kreatinine, ureum, kalium)",
      url: "https://www.scal.nl/system/files/inline/Referentiewaarden%20versie%20website%20maart%202018_2.pdf"
    }
  ];

  window.NW_DATA = { secties, bronnen, num };
})();
