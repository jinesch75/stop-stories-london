const app = document.getElementById("app");
const nav = document.getElementById("nav");
const back = document.getElementById("back");
const sheet = document.getElementById("sheet");
const sheetCard = document.getElementById("sheetCard");
const bandTitle = document.getElementById("bandTitle");
const bandEyebrow = document.getElementById("bandEyebrow");
const bandTag = document.getElementById("bandTag");
const bandEl = document.querySelector(".band");
const langBar = document.getElementById("langBar");

const ordered = (R, dir) => (dir === "b" ? R.stops.slice().reverse() : R.stops).map(k => STOPS[k]);
const towards = (R, dir) => STOPS[dir === "a" ? R.stops[R.stops.length - 1] : R.stops[0]].name;

// Routes: "" home · lnor1 / lnor1-b list · lnor1-a-s7 detail (nor = Northern line, 1 = first branch route)
function parse(){
  const m = location.hash.slice(1).match(/^l([a-z]+\d+)(?:-(a|b))?(?:-s(\d+))?$/);
  if (m && LINES[m[1]]) return { line: m[1], dir: m[2] || "a", pos: m[3] ? +m[3] : null };
  return {};
}
const go = h => { location.hash = h; };

const ICON_BOOK = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v15H5.5A1.5 1.5 0 0 1 4 17.5zM20 5.5A1.5 1.5 0 0 0 18.5 4H13v15h5.5a1.5 1.5 0 0 0 1.5-1.5z"/></svg>';
const ICON_CHAT = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 12a8 8 0 0 1-11.5 7.2L4 20l1-4.2A8 8 0 1 1 20 12z"/></svg>';
const ICON_OUT = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>';
const ICON_PIN = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3"/><circle cx="12" cy="12" r="7"/></svg>';
const ICON_PLAY = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="4"/><circle cx="8.5" cy="8.5" r="1.3" fill="currentColor"/><circle cx="15.5" cy="15.5" r="1.3" fill="currentColor"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/></svg>';
const ICON_BRANCH = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="6" cy="5" r="2"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="7" r="2"/><path d="M6 7v10M18 9c0 5-12 3-12 8"/></svg>';
const ICON_CHEV = '<svg class="chev" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
const X_SVG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';

const LANG_NAMES = { en: "English", fr: "Français", de: "Deutsch" };
function flagSvg(l, id){
  const o = '<svg class="flag" viewBox="0 0 60 40" preserveAspectRatio="xMidYMid slice" aria-hidden="true">';
  if (l === "fr") return o + '<rect width="20" height="40" fill="#002654"/><rect x="20" width="20" height="40" fill="#fff"/><rect x="40" width="20" height="40" fill="#ED2939"/></svg>';
  if (l === "de") return o + '<rect width="60" height="14" fill="#000"/><rect y="13.3" width="60" height="13.4" fill="#DD0000"/><rect y="26.6" width="60" height="13.4" fill="#FFCE00"/></svg>';
  const c = "uk" + id;
  return '<svg class="flag" viewBox="0 0 60 30" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><clipPath id="' + c + '"><path d="M30,15h30v15zv15h-30zh-30v-15zv-15h30z"/></clipPath><rect width="60" height="30" fill="#012169"/><path d="M0,0L60,30M60,0L0,30" stroke="#fff" stroke-width="6"/><path d="M0,0L60,30M60,0L0,30" clip-path="url(#' + c + ')" stroke="#C8102E" stroke-width="4"/><path d="M30,0v30M0,15h60" stroke="#fff" stroke-width="10"/><path d="M30,0v30M0,15h60" stroke="#C8102E" stroke-width="6"/></svg>';
}

// Which lines serve each station (for "near me" and the quiz)
const STOP_LINES = {};
for (const id of TUBE_ORDER) for (const rid of TUBE[id].routes) {
  LINES[rid].stops.forEach((k, i) => { const arr = (STOP_LINES[k] ||= []); if (!arr.some(x => x.line === id)) arr.push({ line: id, no: rid, dir: "a", pos: i + 1 }); });
}
const fold = s => String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

// Line colours: --lc (line colour), --lc-ink (text on it), --route (readable accent, lighter in dark mode)
const darkQ = window.matchMedia ? matchMedia("(prefers-color-scheme: dark)") : { matches: false };
const lcStyle = id => { const T = TUBE[id]; return `--lc:${T.color};--lc-ink:${T.ink}`; };
function setLineColours(id){
  const st = document.documentElement.style;
  if (!id) { ["--lc","--lc-ink","--route","--route-soft"].forEach(p => st.removeProperty(p)); return; }
  const T = TUBE[id], acc = darkQ.matches ? T.accD : T.acc;
  st.setProperty("--lc", T.color); st.setProperty("--lc-ink", T.ink);
  st.setProperty("--route", acc);
  st.setProperty("--route-soft", `color-mix(in srgb, ${acc} ${darkQ.matches ? 22 : 13}%, var(--surface))`);
}
if (darkQ.addEventListener) darkQ.addEventListener("change", () => route());

function setBand(mode, title, lineId){
  const isHome = mode === "home";
  bandEyebrow.textContent = lineId ? t("lineTowards", { l: lineLabel(lineId) }) : t("brand");
  bandTitle.textContent = title;
  bandEl.classList.toggle("on-line", !!lineId);
  setLineColours(lineId);
  document.querySelector('meta[name="theme-color"]').setAttribute("content", lineId ? TUBE[lineId].color : "#16201f");
  back.hidden = isHome;
  back.setAttribute("aria-label", t("back"));
  bandEl.classList.toggle("big", isHome);
  bandTag.hidden = !isHome; bandTag.textContent = t("tagline");
  langBar.hidden = !isHome || !LANG_READY;
  closeLangMenu();
  langBtn.innerHTML = flagSvg(LANG, "cur");
  langBtn.setAttribute("aria-label", t("language") + ": " + LANG_NAMES[LANG]);
  langMenu.querySelectorAll("[data-lang]").forEach(b => b.setAttribute("aria-checked", b.dataset.lang === LANG));
}

// "Bakerloo line", "ligne Elizabeth", "Weaver Line", "DLR"
const lineLabel = (id, lang = LANG) => id === "dlr" ? "DLR" : (UI[lang].lineName || UI.en.lineName).replace("{n}", TUBE[id].name);
const MODE_ORDER = ["tube", "elizabeth", "overground", "dlr"];
const lineBadge = (id, extra = "") => `<span class="mini-line" style="${lcStyle(id)}" title="${esc(lineLabel(id))}" aria-label="${esc(lineLabel(id))}"${extra}>${esc(TUBE[id].abbr)}</span>`;
const distTxt = d => d < 950 ? Math.round(d / 10) * 10 + " " + t("m") : (d / 1000).toFixed(1).replace(".", LANG === "en" ? "." : ",") + " " + t("km");
const lineRoute = x => `l${x.no}-${x.dir}-s${x.pos}`;
function resultRows(keys, dist){
  return keys.map(k => { const s = STOPS[k], ls = STOP_LINES[k] || [];
    return `<li><button class="res" data-go="${lineRoute(ls[0])}">
      <span class="res-name"><b>${esc(s.name)}</b><small>${esc(s.q)}${dist ? " · " + distTxt(dist[k]) : ""}</small></span>
      <span class="res-lines" aria-label="${esc(t("onLines"))}">${ls.map(x => lineBadge(x.line, ` data-go="${lineRoute(x)}"`)).join("")}</span>
    </button></li>`; }).join("");
}
function wireResults(box){
  box.querySelectorAll("[data-go]").forEach(el => el.addEventListener("click", ev => { ev.stopPropagation(); go(el.dataset.go); }));
}

function renderHome(){
  setBand("home", "Stop Stories", null);
  nav.hidden = true; app.classList.remove("has-acts", "stop-page"); stepNav = null;
  const tile = id => { const T = TUBE[id];
    return `<button class="tube-tile" data-tube="${esc(id)}" style="${lcStyle(id)}"><span class="bar" aria-hidden="true"></span><b>${esc(T.name)}</b></button>`; };
  const open = store("linesOpen") === "1";
  app.innerHTML = `
  <section class="view home">
    <hr class="home-rule">
    <div class="lines-card tube-card${open ? " open" : ""}">
      <button class="lines-toggle" id="linesToggle" aria-expanded="${open}" aria-controls="lineGrid">
        <span class="lt-text">${esc(t("choose"))}</span>${ICON_CHEV}
      </button>
      <div class="tube-groups" id="lineGrid"${open ? "" : " hidden"}>${MODE_ORDER.map(m => { const ids = TUBE_ORDER.filter(id => TUBE[id].mode === m);
        return ids.length ? `<p class="mode-label">${esc(t("mode_" + m))}</p><div class="tube-grid">${ids.map(tile).join("")}</div>` : ""; }).join("")}</div>
    </div>
    <hr class="home-rule mid-rule">
    <div class="finder">
      <div class="finder-btns" id="finderBtns">
        <button class="fbtn" id="nearBtn">${ICON_PIN}<span>${esc(t("nearShort"))}</span></button>
        <button class="fbtn play" id="playBtn">${ICON_PLAY}<span>${esc(t("playBtn"))}</span></button>
      </div>
      <div id="found" aria-live="polite"></div>
    </div>
    <hr class="home-rule after-grid">
    <footer class="home-foot">
      <nav class="foot-links"><a href="#about">${esc(t("aboutShort"))}</a><span aria-hidden="true">·</span><a href="mailto:${OWNER_EMAIL}?subject=Stop%20Stories%20London">${esc(t("contact"))}</a></nav>
      <span class="copy">© ${new Date().getFullYear()} Stop Stories</span>
    </footer>
  </section>`;
  app.querySelectorAll("[data-tube]").forEach(b => b.onclick = () => {
    const id = b.dataset.tube, rid = TUBE[id].routes.includes(store("route-" + id)) ? store("route-" + id) : TUBE[id].routes[0];
    go("l" + rid + "-" + (store("dir" + rid) || "a"));
  });
  // Fold-out line picker, as in the Luxembourg edition; the open/closed state is remembered
  const tog = document.getElementById("linesToggle"), grid = document.getElementById("lineGrid");
  tog.onclick = () => { const on = grid.hidden; grid.hidden = !on; tog.setAttribute("aria-expanded", on);
    tog.parentElement.classList.toggle("open", on); store("linesOpen", on ? "1" : "0"); };
  const found = document.getElementById("found");
  const show = html => { found.innerHTML = html; wireResults(found); };
  document.getElementById("playBtn").onclick = () => go("play");
  document.getElementById("nearBtn").onclick = () => {
    show(`<p class="note">${esc(t("locating"))}</p>`);
    locate(pos => {
      const d = {};
      for (const k of Object.keys(STOP_LINES)) if (STOPS[k].ll && STOPS[k].ll.length) d[k] = Math.min(...STOPS[k].ll.map(p => haversine(pos, p)));
      const near = Object.keys(d).filter(k => d[k] <= 2000).sort((a, b) => d[a] - d[b]).slice(0, 6);
      show((near.length ? `<p class="label">${esc(t("nearest"))}</p><ul class="results">${resultRows(near, d)}</ul>` : `<p class="note">${esc(t("locFar"))}</p>`)
        + `<p class="note loc-note">${esc(t("locPrivacy"))}</p>`);
    }, msg => show(`<p class="note">${esc(msg)}</p>`));
  };
}

function haversine([la1, lo1], [la2, lo2]){
  const R = 6371000, r = Math.PI / 180, dla = (la2 - la1) * r, dlo = (lo2 - lo1) * r;
  const a = Math.sin(dla / 2) ** 2 + Math.cos(la1 * r) * Math.cos(la2 * r) * Math.sin(dlo / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}
function locate(ok, fail){
  if (!navigator.geolocation) { fail(t("locUnsupported")); return; }
  navigator.geolocation.getCurrentPosition(
    p => ok([p.coords.latitude, p.coords.longitude]),
    e => fail(e.code === 1 ? t("locDenied") : t("locFail")),
    { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 });
}

const ICON_SWAP = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 4v15M3.5 15.5L7 19l3.5-3.5"/><path d="M17 20V5M13.5 8.5L17 5l3.5 3.5"/></svg>';
const routeName = (R, dir) => { const a = STOPS[R.stops[0]].name, b = STOPS[R.stops[R.stops.length - 1]].name;
  return (dir === "b" ? b + " – " + a : a + " – " + b) + (R.via ? " (" + t("via", { x: STOPS[R.via].name }) + ")" : ""); };
function renderList(r){
  const R = LINES[r.line], T = TUBE[R.line];
  const stops = ordered(R, r.dir);
  setBand("line", towards(R, r.dir), R.line);
  nav.hidden = true; app.classList.remove("has-acts", "stop-page"); stepNav = null;
  store("dir" + r.line, r.dir); store("route-" + R.line, r.line);
  const here = +(store("here-" + r.line + "-" + r.dir) || 0);
  const many = T.routes.length > 1;
  app.innerHTML = `
  <section class="view">
    <div class="route-card" role="group" aria-label="${esc(t("dir"))}">
      <div class="rc-stops">
        <div class="rc-row"><span class="rc-lab">${esc(t("fromL"))}</span><span class="rc-name">${esc(stops[0].name)}</span></div>
        <div class="rc-row"><span class="rc-lab">${esc(t("toL"))}</span><b class="rc-name">${esc(stops[stops.length - 1].name)}${R.via ? ` <small>(${esc(t("via", { x: STOPS[R.via].name }))})</small>` : ""}</b></div>
      </div>
      <button class="rc-swap" id="swapDir" aria-label="${esc(t("swap"))}" title="${esc(t("swap"))}">${ICON_SWAP}</button>
    </div>
    ${many ? `<button class="branch-btn" id="branchBtn">${ICON_BRANCH}<span>${esc(t("changeRoute"))}<small>${esc(t("routes", { n: T.routes.length }))}</small></span></button>` : ""}
    <p class="list-hint">${esc(t("listHint"))}</p>
    <ol class="stops">
      ${stops.map((s, i) => `
        <li class="stop${i === 0 || i === stops.length - 1 ? " end" : ""}${here === i + 1 ? " here" : ""}">
          <button data-pos="${i + 1}">
            <span class="dot" aria-hidden="true"></span>
            <span class="sname"><b>${esc(s.name)}</b><small>${esc(s.q)}${sHead(s) ? " · " + esc(sHead(s)) : ""}</small></span>
            ${here === i + 1 ? `<span class="here-tag">${esc(t("lastRead"))}</span>` : ""}
          </button>
        </li>`).join("")}
    </ol>
  </section>`;
  document.getElementById("swapDir").onclick = () => go(`l${r.line}-${r.dir === "a" ? "b" : "a"}`);
  if (many) document.getElementById("branchBtn").onclick = () => openBranches(R, r.dir);
  app.querySelectorAll("[data-pos]").forEach(b => b.onclick = () => go(`l${r.line}-${r.dir}-s${b.dataset.pos}`));
  const hereEl = app.querySelector(".stop.here");
  if (hereEl) hereEl.scrollIntoView({ block: "center" });
}

function openBranches(R, dir){
  lastFocus = document.activeElement;
  const T = TUBE[R.line];
  sheetCard.innerHTML = `
    <div class="sheet-head">
      <div><div class="label">${esc(lineLabel(R.line))}</div><h2 id="sheetTitle">${esc(t("chooseRoute"))}</h2></div>
      <button class="x" id="xBtn" aria-label="${esc(t("close"))}">${X_SVG}</button>
    </div>
    <ul class="branch-list">${T.routes.map(rid => { const X = LINES[rid];
      return `<li><button data-rid="${rid}" aria-current="${rid === R.no}"><span class="t">${esc(routeName(X, dir))}</span><span class="n">${esc(t("stationsN", { n: X.stops.length }))}</span></button></li>`; }).join("")}</ul>`;
  sheet.hidden = false;
  document.body.style.overflow = "hidden";
  document.getElementById("xBtn").onclick = closeSheet;
  sheetCard.querySelectorAll("[data-rid]").forEach(b => b.onclick = () => { closeSheet(); go(`l${b.dataset.rid}-${dir}`); });
  (sheetCard.querySelector('[aria-current="true"]') || document.getElementById("xBtn")).focus();
}

function renderStop(r){
  const R = LINES[r.line];
  const stops = ordered(R, r.dir);
  const pos = Math.min(Math.max(r.pos, 1), stops.length);
  const s = stops[pos - 1], next = stops[pos], prev = stops[pos - 2];
  setBand("line", towards(R, r.dir), R.line);
  store("here-" + r.line + "-" + r.dir, pos);
  const links = s.links || [];
  const prevLbl = prev ? t("prevStop", { x: prev.name }) : t("firstStop");
  const nextLbl = next ? t("nextStop", { x: next.name }) : t("endLine");
  app.innerHTML = `
  <section class="view stopv">
    <div class="sign">
      <button class="arrow back-arrow" id="prevBtn" ${prev ? "" : "disabled"} aria-label="${esc(prevLbl)}" title="${esc(prevLbl)}">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>
      </button>
      <div class="sign-mid">
        <span class="eyebrow">${esc(t("stopOf", { n: pos, m: stops.length }))} · ${esc(s.q)}</span>
        <h2>${esc(s.name)}</h2>
      </div>
      <button class="arrow fwd-arrow" id="nextBtn" ${next ? "" : "disabled"} aria-label="${esc(nextLbl)}" title="${esc(nextLbl)}">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>
      </button>
    </div>
    <article class="story">
      ${sHead(s) ? `<h3>${esc(sHead(s))}</h3>
      <p>${esc(sText(s))}</p>` : `<p class="nostory">${esc(t("noStory"))}</p>`}
      <div class="story-acts">
        <button class="act" id="readBtn" ${links.length ? "" : "disabled"}>${ICON_BOOK}<span>${esc(t("readMore"))}</span></button>
        <button class="act" id="improveBtn">${ICON_CHAT}<span>${esc(t("improve"))}</span></button>
      </div>
    </article>
  </section>`;
  nav.hidden = true; nav.innerHTML = "";
  app.classList.add("stop-page");
  fitTitle();
  document.getElementById("readBtn").onclick = () => openLinks(s);
  document.getElementById("improveBtn").onclick = () => openFeedback(r.line, r.dir, pos, s);
  const goPrev = () => prev && go(`l${r.line}-${r.dir}-s${pos - 1}`);
  const goNext = () => next && go(`l${r.line}-${r.dir}-s${pos + 1}`);
  document.getElementById("prevBtn").onclick = goPrev;
  document.getElementById("nextBtn").onclick = goNext;
  stepNav = { prev: goPrev, next: goNext };
  window.scrollTo(0, 0);
}

function renderAbout(){
  setBand("about", "Stop Stories", null);
  nav.hidden = true; app.classList.remove("has-acts", "stop-page"); stepNav = null;
  app.innerHTML = `<section class="view about-page">${ABOUT[LANG] || ABOUT.en}</section>`;
  app.querySelectorAll("[data-mail]").forEach(a => { a.href = "mailto:" + OWNER_EMAIL; a.textContent = OWNER_EMAIL; });
  window.scrollTo(0, 0);
}
const ABOUT = {
en: `
  <h2>About Stop Stories</h2>
  <p>Every station in London has a name, and most of those names hide a story: an Old English farmstead, a vanished inn, a royal park, a forgotten river, an old dock or a famous person. Stop Stories tells these stories in a few lines, short enough to read between two stations. It covers the Underground, the Elizabeth line, London Overground and the DLR.</p>
  <h3>Who is behind it</h3>
  <p>Stop Stories is a small private project. It is <b>not</b> an official app of Transport for London (TfL), and it is not connected with TfL or any railway operator.</p>
  <h3>Where the information comes from</h3>
  <p>The texts are written from public sources, mainly Wikipedia, and each station links to its sources under "Read more". Many London place names go back to Old English, and their exact meaning is sometimes disputed; where scholars are unsure, the text says so. Lines, stations and their locations come from TfL's open data (Unified API). Powered by TfL Open Data; contains OS data © Crown copyright and database rights 2016 and Geomni UK Map data © and database rights 2019.</p>
  <h3>Found a mistake?</h3>
  <p>Use "Help us improve" on any station, or write to <a data-mail></a>. Thank you!</p>`,
fr: `
  <h2>À propos de Stop Stories</h2>
  <p>Chaque station de Londres porte un nom, et la plupart de ces noms cachent une histoire\u00a0: une ferme anglo-saxonne, une auberge disparue, un parc royal, une rivière oubliée, un ancien dock ou un personnage célèbre. Stop Stories raconte ces histoires en quelques lignes, assez courtes pour être lues entre deux stations. L'application couvre le métro (Underground), l'Elizabeth line, le London Overground et le DLR.</p>
  <h3>Qui est derrière</h3>
  <p>Stop Stories est un petit projet privé. Ce n'est <b>pas</b> une application officielle de Transport for London (TfL), et il n'a aucun lien avec TfL ni avec un exploitant ferroviaire.</p>
  <h3>D'où viennent les informations</h3>
  <p>Les textes sont rédigés à partir de sources publiques, surtout Wikipédia, et chaque station renvoie à ses sources sous « En savoir plus ». Beaucoup de noms de lieux londoniens remontent au vieil anglais, et leur sens exact est parfois discuté ; quand les spécialistes hésitent, le texte le dit. Les lignes, les stations et leur emplacement proviennent des données ouvertes de TfL (Unified API). Powered by TfL Open Data ; contains OS data © Crown copyright and database rights 2016 and Geomni UK Map data © and database rights 2019.</p>
  <h3>Vous avez trouvé une erreur ?</h3>
  <p>Utilisez « Une erreur ? » sur n'importe quelle station, ou écrivez à <a data-mail></a>. Merci !</p>`,
de: `
  <h2>Über Stop Stories</h2>
  <p>Jede Station in London hat einen Namen, und hinter den meisten dieser Namen steckt eine Geschichte: ein angelsächsischer Hof, ein verschwundenes Gasthaus, ein königlicher Park, ein vergessener Fluss, ein altes Hafenbecken oder eine berühmte Person. Stop Stories erzählt diese Geschichten in wenigen Zeilen, kurz genug, um sie zwischen zwei Stationen zu lesen. Die App umfasst die U-Bahn (Underground), die Elizabeth line, die London Overground und die DLR.</p>
  <h3>Wer steckt dahinter</h3>
  <p>Stop Stories ist ein kleines privates Projekt. Es ist <b>keine</b> offizielle App von Transport for London (TfL) und steht weder mit TfL noch mit einem Bahnbetreiber in Verbindung.</p>
  <h3>Woher die Informationen stammen</h3>
  <p>Die Texte beruhen auf öffentlichen Quellen, vor allem auf Wikipedia, und jede Station verweist unter „Mehr erfahren“ auf ihre Quellen. Viele Londoner Ortsnamen gehen auf das Altenglische zurück, und ihre genaue Bedeutung ist manchmal umstritten; wo die Fachleute unsicher sind, sagt der Text das. Linien, Stationen und ihre Lage stammen aus den offenen Daten von TfL (Unified API). Powered by TfL Open Data; contains OS data © Crown copyright and database rights 2016 and Geomni UK Map data © and database rights 2019.</p>
  <h3>Einen Fehler gefunden?</h3>
  <p>Nutzen Sie „Fehler melden“ bei jeder Station oder schreiben Sie an <a data-mail></a>. Danke!</p>`
};

// Shrink a long station name until it fits between the arrows
function fitTitle(){
  const el = app.querySelector(".sign h2");
  if (!el) return;
  el.style.fontSize = ""; el.style.overflowWrap = "normal";
  let size = parseFloat(getComputedStyle(el).fontSize);
  while (el.scrollWidth > el.clientWidth + 1 && size > 18) { size -= 1; el.style.fontSize = size + "px"; }
  if (el.scrollWidth > el.clientWidth + 1) el.style.overflowWrap = "anywhere";
}
if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitTitle);
window.addEventListener("resize", fitTitle);

// Swipe left/right (and arrow keys) to change station
let stepNav = null, touchX = null, touchY = null;
app.addEventListener("touchstart", e => { if (e.touches.length === 1) { touchX = e.touches[0].clientX; touchY = e.touches[0].clientY; } }, { passive: true });
app.addEventListener("touchend", e => {
  if (touchX === null || !stepNav || !sheet.hidden) return;
  const dx = e.changedTouches[0].clientX - touchX, dy = e.changedTouches[0].clientY - touchY;
  touchX = null;
  if (Math.abs(dx) > 60 && Math.abs(dx) > 2 * Math.abs(dy)) (dx < 0 ? stepNav.next : stepNav.prev)();
}, { passive: true });
document.addEventListener("keydown", e => {
  if (!stepNav || !sheet.hidden || /input|textarea/i.test(document.activeElement?.tagName || "")) return;
  if (e.key === "ArrowRight") stepNav.next(); else if (e.key === "ArrowLeft") stepNav.prev();
});

// ── Pop-ups: Read more, routes and feedback ─────────────────────────────
let lastFocus = null;
function closeSheet(){ sheet.hidden = true; document.body.style.overflow = ""; if (lastFocus) lastFocus.focus(); }
sheet.addEventListener("click", e => { if (e.target === sheet) closeSheet(); });
document.addEventListener("keydown", e => { if (e.key === "Escape" && !sheet.hidden) closeSheet(); });

const linkList = links => `<ul>${links.map(l => `<li><a href="${esc(l.u)}" target="_blank" rel="noopener noreferrer">
        <span><span class="rt">${esc(l.t)}</span><span class="rs">${esc(l.s)}</span></span>${ICON_OUT}</a></li>`).join("")}</ul>`;
function openLinks(s){
  lastFocus = document.activeElement;
  sheetCard.innerHTML = `
    <div class="sheet-head">
      <div><div class="label">${esc(s.name)}</div><h2 id="sheetTitle">${esc(t("readMore"))}</h2></div>
      <button class="x" id="xBtn" aria-label="${esc(t("close"))}">${X_SVG}</button>
    </div>
    <section class="reading">${linkList(s.links || [])}</section>
    <p class="note" style="margin:0">${esc(t("linksNote"))}</p>`;
  sheet.hidden = false;
  document.body.style.overflow = "hidden";
  document.getElementById("xBtn").onclick = closeSheet;
  document.getElementById("xBtn").focus();
}

function openStory(k){
  lastFocus = document.activeElement;
  const s = STOPS[k], links = s.links || [], ls = STOP_LINES[k] || [];
  sheetCard.innerHTML = `
    <div class="sheet-head">
      <div><div class="label">${esc(s.q)}</div><h2 id="sheetTitle" class="story-title">${esc(s.name)}</h2>
        <div class="story-lines" aria-label="${esc(t("onLines"))}">${ls.map(x => lineBadge(x.line)).join("")}</div></div>
      <button class="x" id="xBtn" aria-label="${esc(t("close"))}">${X_SVG}</button>
    </div>
    <article class="story pop">
      ${sHead(s) ? `<h3>${esc(sHead(s))}</h3><p>${esc(sText(s))}</p>` : `<p class="nostory">${esc(t("noStory"))}</p>`}
    </article>
    ${links.length ? `<section class="reading"><p class="label">${esc(t("readMore"))}</p>${linkList(links)}</section>` : ""}
    <button class="btn primary sheet-close" id="xBtn2">${esc(t("gameBack"))}</button>`;
  sheet.hidden = false;
  document.body.style.overflow = "hidden";
  sheetCard.scrollTop = 0;
  document.getElementById("xBtn").onclick = closeSheet;
  document.getElementById("xBtn2").onclick = closeSheet;
  document.getElementById("xBtn").focus();
}

function openFeedback(rid, dir, pos, s){
  lastFocus = document.activeElement;
  const R = LINES[rid], T = TUBE[R.line];
  const to = towards(R, dir);
  const labels = t("issues");
  sheetCard.innerHTML = `
    <div class="fbs">
    <div class="sheet-head">
      <div><h2 id="sheetTitle">${esc(t("improve"))}</h2>
        <div class="fb-about"><span class="lineno" style="${lcStyle(R.line)}">${esc(T.name)}</span><span>${esc(s.name)} · ${esc(t("stopWord"))} ${pos}</span></div></div>
      <button class="x" id="xBtn" aria-label="${esc(t("close"))}">${X_SVG}</button>
    </div>
    <form id="fbForm" novalidate>
      <fieldset>
        <legend>${esc(t("wrong"))}</legend>
        <div class="chips">${labels.map((lab, i) => `<label class="chip"><input type="checkbox" name="issue" value="${i}"><span>${esc(lab)}</span></label>`).join("")}</div>
      </fieldset>
      <label class="flabel" for="fb-comment">${esc(t("comment"))}</label>
      <textarea id="fb-comment" name="comment" maxlength="1500" rows="3" placeholder="${esc(t("commentPh"))}"></textarea>
      <p class="err" id="fbErr" hidden>${esc(t("err"))}</p>
      <button type="submit" class="btn primary send" id="sendBtn">${esc(t("send"))}</button>
      <p class="fb-hint">${esc(t("sendHint", { e: OWNER_EMAIL }))}</p>
    </form>
    </div>`;
  sheet.hidden = false;
  document.body.style.overflow = "hidden";
  document.getElementById("xBtn").onclick = closeSheet;
  document.getElementById("xBtn").focus();
  const form = document.getElementById("fbForm");
  const err = document.getElementById("fbErr");
  form.addEventListener("change", () => err.hidden = true);
  form.addEventListener("submit", ev => {
    ev.preventDefault();
    const idx = [...form.querySelectorAll("input[name=issue]:checked")].map(i => +i.value);
    const entry = { line: lineLabel(R.line, "en"), dir, pos, stop: s.name, towards: to,
      issues: idx.map(i => UI.en.issues[i]), comment: form.comment.value.trim(), lang: LANG };
    if (!entry.issues.length && !entry.comment) { err.hidden = false; return; }
    location.href = `mailto:${OWNER_EMAIL}?subject=${encodeURIComponent("Stop Stories London feedback: " + entry.stop + " (" + entry.line + ")")}&body=${encodeURIComponent(feedbackText(entry))}`;
    showSent(entry);
  });
}

// Copy plain text, with a fallback for browsers that block the clipboard API
async function copyText(txt){
  try { await navigator.clipboard.writeText(txt); return true; } catch (e) {}
  try {
    const ta = document.createElement("textarea");
    ta.value = txt; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0"; ta.style.top = "0";
    document.body.appendChild(ta); ta.focus(); ta.select(); ta.setSelectionRange(0, txt.length);
    const ok = document.execCommand("copy"); ta.remove(); return ok;
  } catch (e) { return false; }
}

function feedbackText(e){
  return `Feedback on Stop Stories London
${e.line}, station ${e.pos}: ${e.stop} (towards ${e.towards})
Issues: ${e.issues.length ? e.issues.join(", ") : "none selected"}
Comment: ${e.comment || "(none)"}
App language: ${e.lang.toUpperCase()}`;
}

function showSent(entry){
  const text = feedbackText(entry);
  sheetCard.innerHTML = `
    <div class="sheet-head">
      <div><div class="label">${esc(t("improve"))}</div><h2 id="sheetTitle">${esc(t("thanks"))}</h2></div>
      <button class="x" id="xBtn" aria-label="${esc(t("close"))}">${X_SVG}</button>
    </div>
    <p class="steps-intro">${esc(t("mailIntro"))}</p>
    <p class="note" style="margin:0 0 4px">${esc(t("byHand"))}</p>
    <ol class="steps">
      <li>${esc(t("step1"))}</li>
      <li>${esc(t("step2"))}<br><b class="addr">${esc(OWNER_EMAIL)}</b>
        <button class="btn small" id="copyAddr">${esc(t("copyAddr"))}</button></li>
      <li>${esc(t("step3"))}</li>
    </ol>
    <div class="msg" id="msgBox">${esc(text)}</div>
    <div class="actions">
      <button class="btn" id="copyAgain">${esc(t("copyMsg"))}</button>
      <button class="btn primary" id="closeBtn">${esc(t("done"))}</button>
    </div>`;
  document.getElementById("xBtn").onclick = closeSheet;
  document.getElementById("closeBtn").onclick = closeSheet;
  const ca = document.getElementById("copyAddr");
  ca.onclick = async () => { ca.textContent = (await copyText(OWNER_EMAIL)) ? t("addrCopied") : t("selectAbove"); };
  const cm = document.getElementById("copyAgain");
  cm.onclick = async () => {
    if (await copyText(text)) { cm.textContent = t("copied"); return; }
    const rg = document.createRange(); rg.selectNodeContents(document.getElementById("msgBox"));
    const sel = getSelection(); sel.removeAllRanges(); sel.addRange(rg); cm.textContent = t("selected");
  };
  document.getElementById("closeBtn").focus();
}

back.onclick = () => {
  const r = parse();
  if (r.pos) go(`l${r.line}-${r.dir}`); else go("");
};
// Language picker: a flag in the top right corner opens a small menu
const langBtn = document.getElementById("langBtn"), langMenu = document.getElementById("langMenu");
function closeLangMenu(){ langMenu.hidden = true; langBtn.setAttribute("aria-expanded", "false"); }
langMenu.querySelectorAll("[data-lang]").forEach(b => {
  b.innerHTML = flagSvg(b.dataset.lang, "m") + `<span>${LANG_NAMES[b.dataset.lang]}</span>`;
  b.onclick = () => { closeLangMenu(); if (b.dataset.lang !== LANG) setLang(b.dataset.lang); };
});
langBtn.onclick = ev => { ev.stopPropagation(); const open = langMenu.hidden; langMenu.hidden = !open; langBtn.setAttribute("aria-expanded", String(open)); };
document.addEventListener("click", ev => { if (!langMenu.hidden && !langBar.contains(ev.target)) closeLangMenu(); });
document.addEventListener("keydown", ev => { if (ev.key === "Escape" && !langMenu.hidden) { closeLangMenu(); langBtn.focus(); } });


// ---------- Quiz game ----------
const GAME_LEN = 5;
let GS = null; // current round, kept in memory so "Read the story" and Back return to the same question
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const gq = (q, part) => (q[LANG] || q.en)[part];
const stopRoute = k => { const x = (STOP_LINES[k] || [])[0]; return x ? lineRoute(x) : null; };
function newRound(){
  let seen = []; try { seen = JSON.parse(store("gameSeen") || "[]"); } catch (e) {}
  const usable = GAME.filter(q => stopRoute(q.s));
  let fresh = usable.filter(q => !seen.includes(q.id));
  if (fresh.length < GAME_LEN + 3) { seen = []; fresh = usable; }
  const pick = [], groups = new Set();
  const take = (list, max) => { for (const q of shuffle(list)) {
    if (pick.length >= max) return;
    if (pick.includes(q) || q.g.some(g => groups.has(g))) continue;
    pick.push(q); q.g.forEach(g => groups.add(g)); } };
  const fg = fresh.filter(q => q.t === "guess");
  take(fg.length >= 2 ? fg : usable.filter(q => q.t === "guess"), 2);   // 2 x "Guess the station" (start over when all were seen)
  take(fresh.filter(q => q.t === "quiz"), GAME_LEN);       // 3 x quiz
  take(usable, GAME_LEN);                                  // safety net
  store("gameSeen", JSON.stringify(seen.concat(pick.map(q => q.id))));
  const qs = shuffle(pick);
  return { qs, order: qs.map(() => shuffle([0, 1, 2, 3])), i: 0, score: 0, picked: null, done: false };
}
function renderGame(){
  if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
  setBand("about", t("gameTitle"), null);
  nav.hidden = true; app.classList.remove("has-acts", "stop-page"); stepNav = null;
  const best = +(store("gameBest") || 0);
  if (!GS) {
    app.innerHTML = `
    <section class="view game">
      <div class="game-card intro">
        <div class="game-icon" aria-hidden="true">${ICON_PLAY}</div>
        <h2>${esc(t("gameTitle"))}</h2>
        <p>${esc(t("gameIntro"))}</p>
        ${best ? `<p class="game-best">${esc(t("gameBest").replace("{n}", best))}</p>` : ""}
        <button class="btn primary" id="gameStart">${esc(t("gameStart"))}</button>
      </div>
    </section>`;
    document.getElementById("gameStart").onclick = () => { GS = newRound(); renderGame(); };
    return;
  }
  if (GS.done) {
    const n = GS.score, msg = t(n === GAME_LEN ? "gameMsg5" : n >= 4 ? "gameMsg4" : n >= 2 ? "gameMsg2" : "gameMsg0");
    app.innerHTML = `
    <section class="view game">
      <div class="game-card end">
        <p class="game-big">${esc(t("gameScore").replace("{n}", n).replace("{t}", GAME_LEN))}</p>
        <p class="game-msg">${esc(msg)}</p>
        ${best ? `<p class="game-best">${esc(t("gameBest").replace("{n}", best))}</p>` : ""}
        <button class="btn primary" id="gameAgain">${esc(t("gameAgain"))}</button>
      </div>
      <div class="game-card">
        <p class="label">${esc(t("gameStops"))}</p>
        <ul class="results">${GS.qs.map(q => { const k = q.s, s = STOPS[k], ls = STOP_LINES[k] || [];
          return `<li><button class="res" data-story="${esc(k)}"><span class="res-name"><b>${esc(s.name)}</b><small>${esc(s.q)}</small></span>
            <span class="res-lines">${ls.map(x => lineBadge(x.line)).join("")}</span></button></li>`; }).join("")}</ul>
      </div>
    </section>`;
    app.querySelectorAll("[data-story]").forEach(b => b.onclick = () => openStory(b.dataset.story));
    document.getElementById("gameAgain").onclick = () => { GS = newRound(); renderGame(); window.scrollTo(0, 0); };
    return;
  }
  const q = GS.qs[GS.i], opts = [gq(q, "a"), ...gq(q, "w")], ord = GS.order[GS.i];
  const answered = GS.picked !== null, right = answered && GS.picked === 0;
  const sname = STOPS[q.s].name;
  app.innerHTML = `
  <section class="view game">
    <div class="game-top">
      <span>${esc(t("gameQ").replace("{i}", GS.i + 1).replace("{n}", GAME_LEN))}</span>
      <span class="game-dots" aria-label="${esc(t("gameScoreLabel"))}: ${GS.score}">${GS.qs.map((_, j) => `<i class="${j < GS.i || (j === GS.i && answered) ? (GS.res?.[j] ? "ok" : "no") : j === GS.i ? "cur" : ""}"></i>`).join("")}</span>
    </div>
    <div class="game-card">
      <p class="game-kind">${esc(t(q.t === "guess" ? "gameGuess" : "gameQuiz"))}</p>
      <h2 class="game-q">${esc(gq(q, "q"))}</h2>
      <div class="game-opts">
        ${ord.map(o => `<button class="gopt${answered ? (o === 0 ? " right" : o === GS.picked ? " wrong" : " dim") : ""}" data-o="${o}"${answered ? " disabled" : ""}>${esc(opts[o])}${answered && o === 0 ? '<span class="gmark" aria-hidden="true">✓</span>' : answered && o === GS.picked ? '<span class="gmark" aria-hidden="true">✗</span>' : ""}</button>`).join("")}
      </div>
      <div class="game-fb" aria-live="polite">${answered ? `
        <p class="game-verdict ${right ? "ok" : "no"}">${esc(t(right ? "gameRight" : "gameWrong"))}${right ? "" : " " + esc(t("gameAnswerWas").replace("{a}", opts[0]))}</p>
        <p class="game-ex">${esc(gq(q, "x"))}</p>
        <div class="game-acts">
          <button class="btn" id="gameStory">${esc(t("gameRead"))}: ${esc(sname)}</button>
          <button class="btn primary" id="gameNext">${esc(t(GS.i + 1 < GAME_LEN ? "gameNext" : "gameSeeScore"))}</button>
        </div>` : ""}</div>
    </div>
  </section>`;
  // No highlight on an option just because the pointer happens to rest where the previous button was
  const optBox = app.querySelector(".game-opts");
  if (optBox) { optBox.classList.add("still"); const wake = () => { optBox.classList.remove("still"); window.removeEventListener("pointermove", wake); };
    setTimeout(() => window.addEventListener("pointermove", wake), 150); }
  app.querySelectorAll(".gopt:not([disabled])").forEach(b => b.onclick = () => {
    GS.picked = +b.dataset.o; (GS.res ||= [])[GS.i] = GS.picked === 0;
    if (GS.picked === 0) GS.score++;
    renderGame();
    const fb = app.querySelector(".game-fb"); if (fb) fb.scrollIntoView({ block: "nearest", behavior: "smooth" });
  });
  const st = document.getElementById("gameStory");
  if (st) st.onclick = () => openStory(q.s);
  const nx = document.getElementById("gameNext");
  if (nx) nx.onclick = () => {
    GS.i++; GS.picked = null;
    if (GS.i >= GAME_LEN) { GS.done = true; if (GS.score > best) store("gameBest", String(GS.score)); }
    renderGame(); window.scrollTo(0, 0);
  };
}

function route(){
  if (!sheet.hidden) closeSheet();
  if (location.hash === "#about") { renderAbout(); return; }
  if (location.hash === "#play") { renderGame(); window.scrollTo(0, 0); return; }
  const r = parse();
  if (!r.line) renderHome();
  else if (r.pos) renderStop(r);
  else renderList(r);
}
window.addEventListener("hashchange", route);
route();

// Offline: keep a copy of the app on the phone (only on the real website)
if ("serviceWorker" in navigator && location.protocol === "https:") {
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
}
