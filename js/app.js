/* Normaalwaarden NL – interface */
(function () {
  "use strict";

  const D = window.NW_DATA;
  const C = window.NW_CALC;
  const $ = (sel, root) => (root || document).querySelector(sel);

  /* ------------------------------------------------------------ helpers */

  function el(tag, props, ...kids) {
    const n = document.createElement(tag);
    if (props) {
      for (const [k, v] of Object.entries(props)) {
        if (v == null || v === false) continue;
        if (k === "class") n.className = v;
        else if (k === "text") n.textContent = v;
        else if (k === "dataset") Object.assign(n.dataset, v);
        else if (k.startsWith("on") && typeof v === "function") n.addEventListener(k.slice(2), v);
        else n.setAttribute(k, v === true ? "" : v);
      }
    }
    for (const kid of kids.flat()) {
      if (kid == null || kid === false) continue;
      n.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
    }
    return n;
  }

  const svgChevron = () => {
    const ns = "http://www.w3.org/2000/svg";
    const s = document.createElementNS(ns, "svg");
    s.setAttribute("viewBox", "0 0 24 24");
    s.setAttribute("class", "chev");
    s.setAttribute("aria-hidden", "true");
    const p = document.createElementNS(ns, "path");
    p.setAttribute("d", "M6 9l6 6 6-6");
    p.setAttribute("fill", "none");
    p.setAttribute("stroke", "currentColor");
    p.setAttribute("stroke-width", "2");
    p.setAttribute("stroke-linecap", "round");
    p.setAttribute("stroke-linejoin", "round");
    s.append(p);
    return s;
  };

  /** Normaliseert tekst voor zoeken: kleine letters, geen diakrieten, subscripts → cijfers. */
  function norm(s) {
    const sub = { "₀": "0", "₁": "1", "₂": "2", "₃": "3", "₄": "4", "⁺": "", "⁻": "", "²": "2", "γ": "g", "α": "a", "β": "b", "κ": "k", "λ": "l" };
    return String(s)
      .toLowerCase()
      .replace(/[₀-₄⁺⁻²γαβκλ]/g, (c) => sub[c] || c)
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9% ]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  const SYN = {
    hb: "hemoglobine bloedarmoede anemie",
    ht: "hematocriet",
    ntprobnp: "bnp hartfalen brain natriuretic",
    tnt: "troponine hartinfarct myocardinfarct hstnt",
    ggt: "gamma gt glutamyltransferase",
    alat: "alt sgpt lever",
    asat: "ast sgot lever",
    af: "alkalische fosfatase alp",
    bili: "bilirubine geelzucht icterus",
    crp: "c reactief proteine ontsteking",
    kreat: "creatinine nier",
    egfr: "gfr nierfunctie ckd epi",
    ureum: "urea bun nier",
    na: "sodium hyponatriemie hypernatriemie",
    k: "potassium hyperkaliemie hypokaliemie",
    ca: "calcium hypercalciemie",
    pco2: "bloedgas co2 hypercapnie",
    po2: "bloedgas zuurstof hypoxemie",
    ph: "bloedgas zuur base acidose alkalose",
    hco3: "bloedgas bicarbonaat",
    be: "base excess bloedgas",
    lactaat: "lactate melkzuur sepsis",
    ag: "anion gap",
    tsh: "schildklier thyreoidea",
    ft4: "schildklier thyroxine vrij t4",
    hba1c: "diabetes glycohemoglobine suiker",
    gluc_n: "suiker diabetes",
    gluc_nn: "suiker diabetes",
    ferritine: "ijzer",
    ddimeer: "d dimeer trombose longembolie",
    inr: "pt protrombinetijd stolling antistolling trombosedienst",
    trombo: "bloedplaatjes platelets",
    leuko: "witte bloedcellen wbc",
    ery: "rode bloedcellen rbc",
    chol: "cholesterol lipiden",
    ldl: "cholesterol lipiden",
    hdl: "cholesterol lipiden",
    tg: "triglyceriden vetten",
    vitd: "vitamine d 25 oh",
    b12: "cobalamine vitamine",
    lithium: "spiegel",
    pct: "procalcitonine sepsis",
    ldh: "lactaatdehydrogenase ld",
    ck: "creatinekinase cpk rhabdomyolyse"
  };

  /* ------------------------------------------------------------ weergave referentie */

  function refTekst(r) {
    if (!r) return "";
    if (r.lo != null && r.hi != null) return /^[−+-]/.test(r.lo) || /^[−+-]/.test(r.hi) ? `${r.lo} tot ${r.hi}` : `${r.lo}–${r.hi}`;
    if (r.hi != null) return `< ${r.hi}`;
    if (r.lo != null) return `> ${r.lo}`;
    return "";
  }

  const fmtNum = (x) => {
    const r = Math.abs(x) >= 100 ? Math.round(x) : Math.round(x);
    return String(r);
  };

  function mmHgTekst(r) {
    if (!r) return "";
    const lo = r.loN != null ? fmtNum(C.kpaToMmHg(r.loN)) : null;
    const hi = r.hiN != null ? fmtNum(C.kpaToMmHg(r.hiN)) : null;
    if (lo && hi) return `≈ ${lo}–${hi} mmHg`;
    if (hi) return `≈ < ${hi} mmHg`;
    if (lo) return `≈ > ${lo} mmHg`;
    return "";
  }

  function buildRef(t) {
    const wrap = el("div", { class: "ref" });
    if (t.tekst) {
      wrap.append(el("span", { class: "val", text: t.tekst }));
    } else if (t.ref.all) {
      wrap.append(el("span", { class: "val", text: refTekst(t.ref.all) }));
      if (t.eenheid === "kPa") wrap.append(el("span", { class: "alt", text: mmHgTekst(t.ref.all) }));
    } else {
      wrap.append(
        el("span", { class: "val ref-m" }, el("span", { class: "tag", text: "M" }), refTekst(t.ref.m)),
        el("span", { class: "val ref-v" }, el("span", { class: "tag", text: "V" }), refTekst(t.ref.v))
      );
    }
    return wrap;
  }

  function buildDetail(t) {
    const d = el("div", { class: "detail" });
    const add = (cls, titel, tekst, full) => {
      if (!tekst) return;
      d.append(el("div", { class: "item" + (full ? " full" : "") }, el("h4", { class: cls, text: titel }), el("p", { text: tekst })));
    };
    add("hoog", "▲ Verhoogd / afwijkend hoog", t.hoog);
    add("laag", "▼ Verlaagd / afwijkend laag", t.laag);
    add("spr", "Spreiding Nederlandse laboratoria", t.spreiding, true);
    add("noot", "Opmerking", t.noot, true);
    if (!d.children.length) d.append(el("div", { class: "item full" }, el("p", { text: "Geen aanvullende toelichting." })));
    return d;
  }

  /* ------------------------------------------------------------ opbouw pagina */

  const state = { sex: "alle", q: "", open: false };
  const rows = []; // { node, test, sectie, hay }
  const sectionNodes = []; // { node, sectie, navLink, countEl, groupNodes }

  function renderContent() {
    const host = $("#content");
    const nav = $("#nav");
    let total = 0;

    D.secties.forEach((s) => {
      const sec = el("section", { class: "section", id: s.id, "aria-labelledby": s.id + "-h" });
      const countEl = el("span", { class: "count" });
      sec.append(el("h2", { class: "section-title", id: s.id + "-h" }, s.titel, countEl));
      if (s.intro) sec.append(el("p", { class: "intro", text: s.intro }));

      const groupNodes = [];
      s.groepen.forEach((g) => {
        const gWrap = el("div", { class: "group" });
        if (s.groepen.length > 1 || g.titel !== s.titel) gWrap.append(el("h3", { class: "group-title", text: g.titel }));
        const tbl = el("div", { class: "tbl" });
        tbl.append(
          el("div", { class: "tbl-head", "aria-hidden": "true" }, el("span", { text: "Bepaling" }), el("span", { text: "Referentie (volwassenen)" }), el("span", { text: "Eenheid" }), el("span"))
        );
        const gRows = [];
        g.tests.forEach((t) => {
          total++;
          const naamEl = el("div", { class: "naam" }, el("b", { text: t.naam }), t.afk && t.afk !== t.naam ? el("span", { class: "afk", text: t.afk }) : null);
          const sum = el("summary", null, naamEl, buildRef(t), el("div", { class: "eenheid", text: t.eenheid }), svgChevron());
          const row = el("details", { class: "row", id: "t-" + t.id }, sum, buildDetail(t));
          tbl.append(row);
          const hay = norm([t.naam, t.afk, t.id, SYN[t.id] || "", t.eenheid].join(" "));
          const rec = { node: row, test: t, sectie: s, hay, naamEl };
          rows.push(rec);
          gRows.push(rec);
        });
        gWrap.append(tbl);
        sec.append(gWrap);
        groupNodes.push({ node: gWrap, rows: gRows });
      });
      if (s.voetnoot) sec.append(el("p", { class: "footnote", text: s.voetnoot }));
      host.append(sec);

      const link = el("a", { href: "#" + s.id, text: s.kort || s.titel, dataset: { sec: s.id } });
      nav.append(link);
      sectionNodes.push({ node: sec, sectie: s, navLink: link, countEl, groupNodes });
    });

    const tools = el("a", { href: "#hulpmiddelen", text: "Hulpmiddelen", dataset: { sec: "hulpmiddelen" } });
    const bron = el("a", { href: "#bronnen", text: "Bronnen", dataset: { sec: "bronnen" } });
    nav.append(tools, bron);

    return total;
  }

  /* ------------------------------------------------------------ filteren */

  function highlight(rec, q) {
    // Alleen de naam markeren (eenvoudig en veilig)
    const b = rec.naamEl.querySelector("b");
    const text = rec.test.naam;
    b.textContent = "";
    if (!q) {
      b.textContent = text;
      return;
    }
    const nt = norm(text);
    const idx = nt.indexOf(q);
    // Index in genormaliseerde tekst komt alleen overeen als de lengtes gelijk blijven
    if (idx >= 0 && nt.length === text.length && norm(text.toLowerCase()) === nt) {
      b.append(text.slice(0, idx), el("mark", { text: text.slice(idx, idx + q.length) }), text.slice(idx + q.length));
    } else {
      b.textContent = text;
    }
  }

  function applyFilter() {
    const q = norm(state.q);
    const terms = q ? q.split(" ") : [];
    let shown = 0;
    sectionNodes.forEach((sn) => {
      const secMatch = q && norm(sn.sectie.titel + " " + (sn.sectie.kort || "")).includes(q);
      let secShown = 0;
      sn.groupNodes.forEach((gn) => {
        let gShown = 0;
        gn.rows.forEach((rec) => {
          const match = !terms.length || secMatch || terms.every((tm) => rec.hay.includes(tm));
          rec.node.hidden = !match;
          if (match) gShown++;
          highlight(rec, q && !secMatch ? q : "");
        });
        gn.node.hidden = gShown === 0;
        secShown += gShown;
      });
      sn.node.hidden = secShown === 0;
      sn.navLink.classList.toggle("hidden-nav", secShown === 0);
      sn.countEl.textContent = secShown ? `${secShown} ${secShown === 1 ? "bepaling" : "bepalingen"}` : "";
      shown += secShown;
    });
    $("#no-results").hidden = shown !== 0;
    $("#result-count").textContent = q ? `${shown} ${shown === 1 ? "resultaat" : "resultaten"} voor “${state.q.trim()}”` : "";
    // Bij actief zoeken met weinig resultaten automatisch uitklappen
    if (q && shown > 0 && shown <= 3) rows.forEach((r) => { if (!r.node.hidden) r.node.open = true; });
  }

  function setSex(sex) {
    state.sex = sex;
    document.body.dataset.sex = sex;
    document.querySelectorAll(".seg button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.sex === sex)));
    const cs = $("#check-sex");
    if (cs && sex !== "alle") cs.value = sex;
    runCheck();
  }

  function setupControls() {
    const q = $("#q");
    const mq = window.matchMedia ? window.matchMedia("(min-width: 681px)") : null;
    const setPh = () => { q.placeholder = mq && mq.matches ? "Zoek bepaling, afkorting of onderwerp (bijv. kalium, hs-cTnT, anemie)" : "Zoek bepaling…"; };
    setPh();
    if (mq && mq.addEventListener) mq.addEventListener("change", setPh);
    q.addEventListener("input", (e) => {
      state.q = e.target.value;
      applyFilter();
    });
    document.querySelectorAll(".seg button").forEach((b) => b.addEventListener("click", () => setSex(b.dataset.sex)));
    $("#toggle-all").addEventListener("click", (e) => {
      state.open = !state.open;
      rows.forEach((r) => { r.node.open = state.open; });
      e.currentTarget.setAttribute("aria-pressed", String(state.open));
      e.currentTarget.textContent = state.open ? "Alles inklappen" : "Alles uitklappen";
    });
    // Printen: alle details tonen
    let openBefore = null;
    window.addEventListener("beforeprint", () => {
      openBefore = rows.map((r) => r.node.open);
      rows.forEach((r) => { r.node.open = true; });
    });
    window.addEventListener("afterprint", () => {
      if (openBefore) rows.forEach((r, i) => { r.node.open = openBefore[i]; });
    });

    // Actieve sectie in navigatie
    if ("IntersectionObserver" in window) {
      const links = new Map();
      document.querySelectorAll("#nav a").forEach((a) => links.set(a.dataset.sec, a));
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) {
              links.forEach((a) => a.classList.remove("active"));
              const a = links.get(en.target.id);
              if (a) {
                a.classList.add("active");
                const nav = $("#nav");
                const left = a.offsetLeft - nav.clientWidth / 2 + a.clientWidth / 2;
                nav.scrollTo({ left, behavior: "smooth" });
              }
            }
          });
        },
        { rootMargin: "-25% 0px -65% 0px" }
      );
      document.querySelectorAll(".section, #hulpmiddelen, #bronnen").forEach((s) => io.observe(s));
    }

    // Thema
    $("#theme").addEventListener("click", () => {
      const root = document.documentElement;
      const cur = root.getAttribute("data-theme");
      const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      const isDark = cur ? cur === "dark" : prefersDark;
      const next = isDark ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("nw-theme", next); } catch (e) { /* opslag niet beschikbaar */ }
    });
  }

  /* ------------------------------------------------------------ waarde-check */

  const parseNum = (s) => {
    if (s == null) return NaN;
    const t = String(s).trim().replace(/\s+/g, "").replace(/\u2212/g, "-").replace(",", ".").replace(/^[<>≤≥]/, "");
    return t === "" ? NaN : Number(t);
  };

  const checkables = [];
  function setupCheck() {
    const list = $("#check-list");
    rows.forEach((r) => {
      const t = r.test;
      checkables.push(t);
      list.append(el("option", { value: t.naam }));
    });
    ["#check-test", "#check-sex", "#check-val"].forEach((id) => $(id).addEventListener("input", runCheck));
  }

  function findTest(name) {
    const n = norm(name);
    if (!n) return null;
    let hit = checkables.find((t) => norm(t.naam) === n);
    if (hit) return hit;
    const cand = checkables.filter((t) => norm(t.naam).startsWith(n) || norm(t.afk || "") === n);
    return cand.length === 1 ? cand[0] : null;
  }

  function status(r, v, strict) {
    if (!r) return null;
    if (r.loN != null && r.hiN != null) return v < r.loN ? "laag" : v > r.hiN ? "hoog" : "ok";
    if (r.hiN != null) return v >= r.hiN ? "hoog" : "ok";
    if (r.loN != null) return v <= r.loN ? "laag" : "ok";
    return null;
  }

  function runCheck() {
    const out = $("#check-out");
    out.textContent = "";
    const t = findTest($("#check-test").value);
    $("#check-unit").textContent = t ? `(${t.eenheid})` : "";
    const raw = $("#check-val").value;
    if (!t) {
      if ($("#check-test").value.trim()) out.append(el("p", { class: "mut", text: "Bepaling niet (eenduidig) herkend – kies een naam uit de lijst." }));
      return;
    }
    const v = parseNum(raw);
    if (Number.isNaN(v)) return;

    if (t.noCheck) {
      out.append(el("div", { class: "pill-row" }, el("span", { class: "mut", text: `${t.naam}: het referentie-interval is leeftijds- of methodeafhankelijk (${t.tekst || "zie details"}). Raadpleeg de details en uw eigen laboratorium.` })));
      return;
    }
    const sex = $("#check-sex").value;
    const r = t.ref.all || (sex === "v" ? t.ref.v : t.ref.m);
    let st = status(r, v);
    if (t.noCheckHoog && st === "hoog") st = "ok";
    const tekstRef = t.tekst && t.ref.all ? t.tekst : refTekst(r);
    const geslachtTxt = t.ref.all ? "" : sex === "v" ? " (vrouw)" : " (man)";
    const label = { laag: "Verlaagd", hoog: "Verhoogd", ok: "Binnen referentie" }[st];
    const vTxt = String(v).replace(".", ",");
    const row = el(
      "div",
      { class: "pill-row " + st },
      el("span", { class: "pill " + st, text: label }),
      el("span", {}, el("strong", { text: `${t.naam}: ${vTxt} ${t.eenheid}` }), ` – referentie${geslachtTxt} ${tekstRef} ${t.eenheid}`)
    );
    out.append(row);
    if (t.noCheckHoog && st === "ok" && r && r.hiN != null && v > r.hiN) {
      out.append(el("p", { class: "mut", text: "Een hogere pO₂ is niet afwijkend onder zuurstoftoediening; interpreteer met de FiO₂ (zie Bloedgas-interpretatie)." }));
    }
    const link = el("a", { href: "#t-" + t.id, text: "Naar details" });
    link.addEventListener("click", () => { const row = document.getElementById("t-" + t.id); if (row) { row.hidden = false; row.open = true; } });
    out.append(el("p", { class: "mut" }, link));
  }

  /* ------------------------------------------------------------ bloedgas-interpretatie */

  function numField(id, label, ph, opts = {}) {
    const input = el("input", { id, inputmode: "decimal", placeholder: ph || "", autocomplete: "off", "data-key": opts.key || id });
    const wrap = el("label", { class: "field" }, el("span", { text: label }));
    if (opts.unitSelect) {
      const sel = el("select", { id: id + "-u", "aria-label": label + " – eenheid" }, ...opts.unitSelect.map((u) => el("option", { value: u, text: u })));
      wrap.append(el("div", { class: "row2" }, input, sel));
    } else {
      wrap.append(input);
    }
    return wrap;
  }

  function setupBloedgas() {
    const form = $("#bg-form");
    form.append(
      numField("bg-ph", "pH", "7,40"),
      numField("bg-pco2", "pCO₂", "5,3", { unitSelect: ["kPa", "mmHg"] }),
      numField("bg-hco3", "HCO₃⁻ (mmol/L)", "leeg = berekend"),
      numField("bg-po2", "pO₂", "12,0", { unitSelect: ["kPa", "mmHg"] }),
      numField("bg-fio2", "FiO₂ (%)", "21"),
      numField("bg-na", "Na⁺ (mmol/L)", "140"),
      numField("bg-cl", "Cl⁻ (mmol/L)", "104"),
      numField("bg-alb", "Albumine (g/L)", "40"),
      numField("bg-lact", "Lactaat (mmol/L)", "1,0"),
      numField("bg-age", "Leeftijd (jaren)", "55")
    );
    $("#bg-fio2").value = "21";

    // pCO2- en pO2-eenheid synchroon houden
    const syncUnit = (from, to) => {
      $(from + "-u").addEventListener("change", () => {
        $(to + "-u").value = $(from + "-u").value;
        run();
      });
    };
    syncUnit("#bg-pco2", "#bg-po2");
    syncUnit("#bg-po2", "#bg-pco2");

    const run = () => {
      const unit = $("#bg-pco2-u").value;
      const toKpa = (v) => (Number.isNaN(v) ? NaN : unit === "mmHg" ? C.mmHgToKpa(v) : v);
      const g = (id) => parseNum($(id).value);
      const out = $("#bg-out");
      out.textContent = "";
      const ph = g("#bg-ph");
      const pco2 = toKpa(g("#bg-pco2"));
      if (Number.isNaN(ph) || Number.isNaN(pco2)) {
        out.append(el("p", { class: "bg-hint", text: "Vul minimaal pH en pCO₂ in. HCO₃⁻ wordt anders berekend; met Na⁺, Cl⁻ en albumine volgt de anion gap; met pO₂ en FiO₂ de oxygenatie." }));
        return;
      }
      if (ph < 6.5 || ph > 8.0 || pco2 <= 0 || pco2 > 30) {
        out.append(el("div", { class: "line let-op", text: "Controleer de invoer: de waarden liggen buiten het fysiologisch mogelijke bereik (let op de eenheid kPa/mmHg)." }));
        return;
      }
      const fio2raw = g("#bg-fio2");
      const res = C.interpreteerBloedgas({
        ph,
        pco2,
        hco3: g("#bg-hco3"),
        po2: toKpa(g("#bg-po2")),
        fio2: Number.isNaN(fio2raw) ? 0.21 : fio2raw > 1 ? fio2raw / 100 : fio2raw,
        na: g("#bg-na"),
        cl: g("#bg-cl"),
        alb: g("#bg-alb"),
        lactaat: g("#bg-lact"),
        leeftijd: g("#bg-age")
      });
      res.regels.forEach((r) => out.append(el("div", { class: "line " + r.soort, text: r.tekst })));
    };
    form.addEventListener("input", run);
    run();
  }

  /* ------------------------------------------------------------ rekenhulpen */

  const f1 = (x) => (Math.round(x * 10) / 10).toFixed(1).replace(".", ",");
  const f0 = (x) => String(Math.round(x));

  function kdigoStadium(egfr) {
    if (egfr >= 90) return "G1 (≥ 90)";
    if (egfr >= 60) return "G2 (60–89)";
    if (egfr >= 45) return "G3a (45–59)";
    if (egfr >= 30) return "G3b (30–44)";
    if (egfr >= 15) return "G4 (15–29)";
    return "G5 (< 15)";
  }

  const CALCS = [
    {
      titel: "eGFR (CKD-EPI)",
      velden: [
        { id: "kr", label: "Kreatinine (µmol/L)", ph: "85" },
        { id: "lt", label: "Leeftijd (jaren)", ph: "60" },
        { id: "gs", label: "Geslacht", select: [["m", "Man"], ["v", "Vrouw"]] }
      ],
      bereken: (v) => {
        if (!(v.kr > 0) || !(v.lt > 17)) return null;
        const vrouw = v.gs === "v";
        const e9 = C.ckdEpi(v.kr, v.lt, vrouw, 2009);
        const e21 = C.ckdEpi(v.kr, v.lt, vrouw, 2021);
        return [
          `<strong>${f0(e9)}</strong> ml/min/1,73 m² (CKD-EPI 2009) – ${kdigoStadium(e9)}`,
          `<strong>${f0(e21)}</strong> ml/min/1,73 m² (CKD-EPI 2021) – ${kdigoStadium(e21)}`
        ];
      },
      noot: "Controleer welke formule uw laboratorium rapporteert; de uitkomsten verschillen enkele ml/min. Niet geldig bij acute nierschade, extreme spiermassa of zwangerschap."
    },
    {
      titel: "Gecorrigeerd calcium",
      velden: [
        { id: "ca", label: "Calcium totaal (mmol/L)", ph: "2,05" },
        { id: "alb", label: "Albumine (g/L)", ph: "28" }
      ],
      bereken: (v) => {
        if (!(v.ca > 0) || !(v.alb > 0)) return null;
        const c = C.caCorrected(v.ca, v.alb);
        return [`<strong>${(Math.round(c * 100) / 100).toFixed(2).replace(".", ",")}</strong> mmol/L (referentie 2,15–2,65)`];
      },
      noot: "Ca + 0,02 × (40 − albumine). Onbetrouwbaar bij zeer lage albumine of acute ziekte: meet dan het geïoniseerd calcium."
    },
    {
      titel: "Osmolaliteit en osmolale gap",
      velden: [
        { id: "na", label: "Natrium (mmol/L)", ph: "138" },
        { id: "gl", label: "Glucose (mmol/L)", ph: "6" },
        { id: "ur", label: "Ureum (mmol/L)", ph: "5" },
        { id: "om", label: "Gemeten osm. (mosmol/kg) – optioneel", ph: "295" }
      ],
      bereken: (v) => {
        if (!(v.na > 0) || !(v.gl >= 0) || !(v.ur >= 0)) return null;
        const o = C.osmCalc(v.na, v.gl, v.ur);
        const res = [`Berekend: <strong>${f0(o)}</strong> mosmol/kg`];
        if (v.om > 0) {
          const gap = v.om - o;
          res.push(`Osmolale gap: <strong>${f0(gap)}</strong> mosmol/kg ${gap > 10 ? "(verhoogd: denk aan ethanol, methanol, ethyleenglycol, isopropanol)" : "(normaal < 10)"}`);
        }
        return res;
      },
      noot: "2 × Na⁺ + glucose + ureum."
    },
    {
      titel: "Natrium gecorrigeerd voor glucose",
      velden: [
        { id: "na", label: "Natrium (mmol/L)", ph: "128" },
        { id: "gl", label: "Glucose (mmol/L)", ph: "30" }
      ],
      bereken: (v) => {
        if (!(v.na > 0) || !(v.gl > 0)) return null;
        return [`Gecorrigeerd Na⁺: <strong>${f0(C.naCorrected(v.na, v.gl))}</strong> mmol/L`];
      },
      noot: "Na + 0,3 × (glucose − 5,5); benadering (≈ 1,6 mmol/L per 5,6 mmol/L glucose, Katz). Bij glucose > 22 mmol/L is een factor van ca. 0,4 realistischer."
    },
    {
      titel: "Anion gap + delta-ratio",
      velden: [
        { id: "na", label: "Natrium (mmol/L)", ph: "140" },
        { id: "cl", label: "Chloride (mmol/L)", ph: "104" },
        { id: "hc", label: "Bicarbonaat (mmol/L)", ph: "12" },
        { id: "alb", label: "Albumine (g/L) – optioneel", ph: "40" }
      ],
      bereken: (v) => {
        if (!(v.na > 0) || !(v.cl > 0) || !(v.hc > 0)) return null;
        const ag = C.anionGap(v.na, v.cl, v.hc);
        const res = [`Anion gap: <strong>${f1(ag)}</strong> mmol/L (referentie ca. 8–16, zonder K⁺)`];
        let basis = ag;
        if (v.alb > 0) {
          basis = C.anionGapCorrected(ag, v.alb);
          res.push(`Gecorrigeerd voor albumine: <strong>${f1(basis)}</strong> mmol/L`);
        }
        const dr = C.deltaRatio(basis, v.hc);
        if (dr != null && basis > 16) res.push(`Delta-ratio: <strong>${f1(dr)}</strong> (0,4–0,8 gemengd; 0,8–2 zuiver hoog-gap; > 2 bijkomende metabole alkalose)`);
        return res;
      },
      noot: "AG = Na⁺ − Cl⁻ − HCO₃⁻. Gecorrigeerd: + 0,25 × (44 − albumine in g/L). Delta-ratio = (AG − 12) / (24 − HCO₃⁻)."
    },
    {
      titel: "Transferrineverzadiging",
      velden: [
        { id: "fe", label: "IJzer (µmol/L)", ph: "12" },
        { id: "tf", label: "Transferrine (g/L)", ph: "2,8" }
      ],
      bereken: (v) => {
        if (!(v.fe > 0) || !(v.tf > 0)) return null;
        return [`TSAT: <strong>${f0(C.tsat(v.fe, v.tf))}</strong> % (referentie man 20–45, vrouw 15–45)`];
      },
      noot: "TSAT = ijzer / (25 × transferrine) × 100."
    }
  ];

  function setupCalcs() {
    const grid = $("#calc-grid");
    CALCS.forEach((c, ci) => {
      const out = el("div", { class: "out", role: "status", "aria-live": "polite" });
      const fields = el("div", { class: "fields" });
      c.velden.forEach((f) => {
        const id = `calc-${ci}-${f.id}`;
        let input;
        if (f.select) input = el("select", { id }, ...f.select.map(([v, l]) => el("option", { value: v, text: l })));
        else input = el("input", { id, inputmode: "decimal", placeholder: f.ph || "", autocomplete: "off" });
        fields.append(el("label", { class: "field" }, el("span", { text: f.label }), input));
      });
      const box = el("div", { class: "calc" }, el("h4", { text: c.titel }), fields, out, c.noot ? el("p", { class: "note", text: c.noot }) : null);
      const run = () => {
        const v = {};
        c.velden.forEach((f) => {
          const node = $("#calc-" + ci + "-" + f.id);
          v[f.id] = f.select ? node.value : parseNum(node.value);
        });
        out.textContent = "";
        const res = c.bereken(v);
        if (!res) {
          out.append(el("p", { class: "bg-hint", text: "Vul de velden in." }));
          return;
        }
        res.forEach((html) => {
          const p = el("p");
          // html bevat uitsluitend door ons gegenereerde <strong>-tags en getallen
          p.innerHTML = html;
          out.append(p);
        });
      };
      box.addEventListener("input", run);
      grid.append(box);
      run();
    });
  }

  /* ------------------------------------------------------------ omrekenen */

  function setupConv() {
    const host = $("#conv");
    const sel = el("select", { id: "conv-sel" }, ...C.OMREKENINGEN.map((o, i) => el("option", { value: String(i), text: `${o.naam}: ${o.van} ↔ ${o.naar}` })));
    const a = el("input", { id: "conv-a", inputmode: "decimal", autocomplete: "off", placeholder: "waarde" });
    const b = el("input", { id: "conv-b", inputmode: "decimal", autocomplete: "off", placeholder: "waarde" });
    const aL = el("span", { id: "conv-al" });
    const bL = el("span", { id: "conv-bl" });
    const note = el("p", { class: "conv-note", id: "conv-note" });

    const cur = () => C.OMREKENINGEN[Number(sel.value)];
    const fmt = (x) => {
      if (!Number.isFinite(x)) return "";
      const ax = Math.abs(x);
      const d = ax >= 100 ? 0 : ax >= 10 ? 1 : ax >= 1 ? 2 : 3;
      return String(Number(x.toFixed(d))).replace(".", ",");
    };
    const labels = () => {
      const d = cur();
      aL.textContent = d.van;
      bL.textContent = d.naar;
      note.textContent = d.custom
        ? "IFCC (mmol/mol) = (NGSP % − 2,15) × 10,929."
        : `1 ${d.van} = ${fmt(d.f)} ${d.naar}`;
    };
    sel.addEventListener("change", () => { labels(); a.dispatchEvent(new Event("input")); });
    a.addEventListener("input", () => {
      const v = parseNum(a.value);
      b.value = Number.isNaN(v) ? "" : fmt(C.converteer(cur(), v, "voor"));
    });
    b.addEventListener("input", () => {
      const v = parseNum(b.value);
      a.value = Number.isNaN(v) ? "" : fmt(C.converteer(cur(), v, "terug"));
    });

    host.append(
      el("div", { class: "conv-grid" },
        el("label", { class: "field" }, el("span", { text: "Omrekening" }), sel),
        el("label", { class: "field" }, el("span", {}, "Waarde in ", aL), a),
        el("div", { class: "conv-eq", "aria-hidden": "true", text: "⇄" }),
        el("label", { class: "field" }, el("span", {}, "Waarde in ", bL), b)
      ),
      note
    );

    // Compacte referentietabel van factoren
    const wrap = el("div", { class: "conv-wrap" });
    const tbl = el("table", { class: "conv-table" },
      el("thead", {}, el("tr", {}, el("th", { text: "Parameter" }), el("th", { text: "Van" }), el("th", { text: "Naar" }), el("th", { text: "× factor" }))),
      el("tbody", {}, ...C.OMREKENINGEN.map((o) => el("tr", {}, el("td", { text: o.naam }), el("td", { text: o.van }), el("td", { text: o.naar }), el("td", { text: o.custom ? "(x − 2,15) × 10,929" : fmt(o.f) }))))
    );
    wrap.append(tbl);
    host.append(el("details", {}, el("summary", { text: "Alle omrekenfactoren tonen" }), wrap));

    labels();
  }

  /* ------------------------------------------------------------ bronnen */

  function setupBronnen() {
    const ul = $("#src-list");
    D.bronnen.forEach((b) => ul.append(el("li", {}, el("a", { href: b.url, target: "_blank", rel: "noopener noreferrer", text: b.naam }))));
  }

  /* ------------------------------------------------------------ start */

  function init() {
    const total = renderContent();
    setupControls();
    setupCheck();
    setupBloedgas();
    setupCalcs();
    setupConv();
    setupBronnen();
    applyFilter();
    $("#result-count").dataset.total = String(total);
    const first = $("#nav a");
    if (first) first.classList.add("active");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
