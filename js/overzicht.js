/* Normaalwaarden NL – compact overzicht van alle waarden */
(function () {
  "use strict";

  const D = window.NW_DATA;
  const C = window.NW_CALC;

  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function waardeCel(t) {
    const td = el("td", "v");
    if (t.tekst || t.ref.all) {
      td.textContent = t.tekst || C.refTekst(t.ref.all);
      if (t.mmhg) td.append(el("span", "mv mmhg", t.mmhg + " mmHg"));
      return td;
    }
    for (const [tag, r] of [["M", t.ref.m], ["V", t.ref.v]]) {
      const line = el("span", "mv");
      line.append(el("b", null, tag), " " + C.refTekst(r));
      td.append(line);
    }
    return td;
  }

  const host = document.getElementById("ov");
  D.secties.forEach((s) => {
    const sec = el("section", "ov-sec");
    sec.append(el("h2", null, s.titel));
    const tbl = el("table", "ov-tbl");
    const body = el("tbody");
    s.groepen.forEach((g) => {
      if (s.groepen.length > 1) {
        const tr = el("tr", "grp");
        const td = el("td", null, g.titel);
        td.colSpan = 3;
        tr.append(td);
        body.append(tr);
      }
      g.tests.forEach((t) => {
        const tr = el("tr");
        const th = el("th", null, t.naam);
        th.scope = "row";
        const eenheid = t.eenheid === "–" ? "" : t.eenheid;
        tr.append(th, waardeCel(t), el("td", "u", eenheid));
        body.append(tr);
      });
    });
    tbl.append(body);
    sec.append(tbl);
    host.append(sec);
  });

  document.getElementById("print").addEventListener("click", () => window.print());
  document.getElementById("theme").addEventListener("click", () => {
    const root = document.documentElement;
    const cur = root.getAttribute("data-theme");
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const next = (cur ? cur === "dark" : prefersDark) ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("nw-theme", next); } catch (e) { /* opslag niet beschikbaar */ }
  });
})();
