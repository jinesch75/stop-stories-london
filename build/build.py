"""Build the stand-alone Stop Stories London site into ../site.

Inputs (all in build/):
  network.json          lines, branch routes and stations (from tfl_extract.py, TfL Unified API)
  research/list.json    borough, Wikipedia article title per station (from Wikipedia's List of London Underground stations)
  stories_*.py          English texts: STORIES = {station: (head, text, [extra Wikipedia titles])}
  tr_fr.py, tr_de.py    translations: TR = {station: (head, text)}
  quiz.py               quiz questions (checked by quiz_check.py)
  src/                  style.css (Luxembourg base) + london.css, body.html, core.js, i18n.js, app.js
"""
import json, glob, os, re, time, importlib.util, urllib.parse
SP = os.path.dirname(os.path.abspath(__file__)) + "/"
OUT = os.path.join(SP, "..", "site") + "/"
OWNER_EMAIL = "jacquesbrosius@hotmail.com"

def load(path):
    spec = importlib.util.spec_from_file_location(os.path.basename(path)[:-3], path)
    m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m); return m

NET = json.load(open(SP + "network.json"))
WL = json.load(open(SP + "research/list.json"))
disp = lambda n: n.replace("St. ", "St ")

# ── Lines: display data and route order ─────────────────────────────────
TUBE_META = {  # abbr, ink on line colour, accent on white, accent on dark
 "bakerloo": ("BAK", "#fff", "#9a5306", "#e09a55"), "central": ("CEN", "#fff", "#c41c14", "#ff7a72"),
 "circle": ("CIR", "#1b1b1b", "#856600", "#ffd84d"), "district": ("DIS", "#fff", "#00782a", "#4cc472"),
 "hammersmith-city": ("H&C", "#1b1b1b", "#b0405f", "#f3a9bb"), "jubilee": ("JUB", "#111", "#5f666b", "#c4c9cc"),
 "metropolitan": ("MET", "#fff", "#9b0056", "#e86aa6"), "northern": ("NOR", "#fff", "#1b1b1b", "#c9c9c9"),
 "piccadilly": ("PIC", "#fff", "#003688", "#7aa5f0"), "victoria": ("VIC", "#fff", "#00739f", "#4cc3f0"),
 "waterloo-city": ("W&C", "#111", "#2e7d66", "#95cdba")}
# Branch routes in the order riders will look for them (index into tfl_extract's list), with a "via" when two routes share their ends
ROUTE_PLAN = {
 "central": [(2, None), (0, None), (4, "Newbury Park"), (1, None), (3, "Woodford")],
 "district": [(0, None), (3, None), (5, None), (6, None), (4, None), (1, None), (2, None)],
 "metropolitan": [(0, None), (1, None), (2, None), (3, None)],
 "northern": [(4, "Bank"), (5, "Charing Cross"), (2, "Bank"), (7, "Charing Cross"), (0, None), (1, None), (3, "Bank"), (6, "Charing Cross")],
 "piccadilly": [(2, None), (1, None), (0, None)],
}
TUBE, LINES = {}, {}
for lid, L in NET["lines"].items():
    abbr, ink, acc, accD = TUBE_META[lid]
    plan = ROUTE_PLAN.get(lid, [(i, None) for i in range(len(L["routes"]))])
    assert sorted(i for i, _ in plan) == list(range(len(L["routes"]))), lid
    rids = []
    for n, (i, via) in enumerate(plan, 1):
        rid = L["code"] + str(n)
        stops = [disp(k) for k in L["routes"][i]]
        if via: assert via in stops, (lid, via)
        LINES[rid] = {"no": rid, "line": lid, "stops": stops, **({"via": via} if via else {})}
        rids.append(rid)
    TUBE[lid] = {"name": L["name"], "abbr": abbr, "color": L["color"], "ink": ink, "acc": acc, "accD": accD, "routes": rids}
TUBE_ORDER = list(NET["lines"])

# ── Stations and stories ────────────────────────────────────────────────
STORIES = {}
for f in sorted(glob.glob(SP + "stories_*.py")):
    for k, v in load(f).STORIES.items():
        assert k not in STORIES, ("duplicate story", k, f)
        STORIES[k] = v
LONDONIST = {"bakerloo": "https://londonist.com/london/transport/bakerloo_etymology",
 "central": "https://londonist.com/london/transport/how-the-central-line-stations-got-their-names",
 "circle": "https://londonist.com/london/transport/how-the-circle-line-stations-got-their-names",
 "district": "https://londonist.com/london/transport/district-line-station-names",
 "hammersmith-city": "https://londonist.com/london/transport/hammersmith-city-line-tube-station-names",
 "jubilee": "https://londonist.com/london/transport/jubilee-stations-etymology",
 "metropolitan": "https://londonist.com/london/transport/metropolitan-line-stations-names-etymology",
 "northern": "https://londonist.com/london/transport/how-the-northern-line-stations-got-their-names",
 "piccadilly": "https://londonist.com/london/transport/piccadilly-line-stations-etymology",
 "victoria": "https://londonist.com/london/transport/how-the-victoria-line-stations-got-their-names",
 "waterloo-city": None}
wurl = lambda t: "https://en.wikipedia.org/wiki/" + urllib.parse.quote(t.replace(" ", "_"), safe="(),'&")
BOROUGH_FIX = {"City of Westminster": "Westminster"}
OUTSIDE = {"Amersham": "Buckinghamshire", "Chalfont & Latimer": "Buckinghamshire", "Chesham": "Buckinghamshire",
           "Chorleywood": "Hertfordshire", "Croxley": "Hertfordshire", "Moor Park": "Hertfordshire", "Rickmansworth": "Hertfordshire"}
STOPS, missing = {}, []
for raw, st in NET["stations"].items():
    k = disp(raw); w = WL[k]
    q = OUTSIDE.get(k) or BOROUGH_FIX.get(w["borough"], w["borough"])
    head, text, extra = STORIES.get(k, ("", "", []))
    if not head: missing.append(k)
    links = [{"t": t, "s": "Wikipedia", "u": wurl(t)} for t in extra]
    links.append({"t": w["title"][0].upper() + w["title"][1:], "s": "Wikipedia", "u": wurl(w["title"])})
    serving = [l for l in TUBE_ORDER if LONDONIST[l] and any(k in LINES[r]["stops"] for r in TUBE[l]["routes"])]
    if serving: links.append({"t": f"How the {TUBE[serving[0]]['name']} line stations got their names", "s": "Londonist", "u": LONDONIST[serving[0]]})
    STOPS[k] = {"name": k, "q": q, "zone": st["zone"], "head": head, "text": text, "links": links, "ll": st["ll"]}
unknown = [k for k in STORIES if k not in STOPS]
assert not unknown, ("stories for unknown stations", unknown)

def fr_typo(x):
    """French spacing: non-breaking space before : ; ? ! » and after «."""
    x = re.sub(r"[ \u00a0]*([:;?!»])", lambda m: "\u00a0" + m.group(1), x)
    return re.sub(r"«[ \u00a0]*", "«\u00a0", x)
TR = {"fr": {}, "de": {}}
for lang in TR:
    p = SP + f"tr_{lang}.py"
    if os.path.exists(p):
        for k, v in load(p).TR.items():
            assert k in STOPS, ("translation for unknown station", lang, k)
            TR[lang][k] = [fr_typo(x) for x in v] if lang == "fr" else list(v)
GAME = load(SP + "quiz.py").GAME if os.path.exists(SP + "quiz.py") else []

data = ("// Generated by build.py. Station texts written from public sources (see Read more links);\n"
        "// lines, stations and locations from TfL open data (Unified API, " + time.strftime("%d %B %Y") + ").\n"
        "const STOPS = " + json.dumps(dict(sorted(STOPS.items())), ensure_ascii=False) + ";\n"
        "const TUBE_ORDER = " + json.dumps(TUBE_ORDER) + ";\n"
        "const TUBE = " + json.dumps(TUBE, ensure_ascii=False) + ";\n"
        "const LINES = " + json.dumps(LINES, ensure_ascii=False) + ";\n"
        "const TR = " + json.dumps(TR, ensure_ascii=False) + ";\n"
        "const GAME = " + json.dumps(GAME, ensure_ascii=False) + ";\n")

src = lambda f: open(SP + "src/" + f, encoding="utf8").read()
fonts = '<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&family=Big+Shoulders+Text:wght@500;700;800&family=IBM+Plex+Mono:wght@500&display=swap">\n'
js = ("// ── Settings ──\n// Address that receives feedback from the \"Help us improve\" form.\nconst OWNER_EMAIL = " + json.dumps(OWNER_EMAIL) + ";\n\n"
      + data + "\n" + src("core.js") + "\n" + src("i18n.js") + "\n" + src("app.js"))
html = f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Stop Stories · London</title>
<meta name="description" content="The hidden story behind the next London Underground station: short stories behind the names of all {len(STOPS)} stations. An independent project, not affiliated with TfL.">
<meta name="theme-color" content="#16201f">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" href="icon-192.png" type="image/png">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<meta name="apple-mobile-web-app-title" content="Stop Stories">
<meta name="apple-mobile-web-app-capable" content="yes">
{fonts}<style>
{src("style.css")}
{src("london.css")}
</style>
</head>
<body>
{src("body.html")}
<script>
{js}</script>
</body>
</html>
'''
os.makedirs(OUT, exist_ok=True)
open(OUT + "index.html", "w", encoding="utf8").write(html)
sw = src("sw.js").replace("__VERSION__", "stop-stories-london-" + time.strftime("%Y%m%d-%H%M%S"))
open(OUT + "sw.js", "w", encoding="utf8").write(sw)
print("index.html", len(html.encode()), "bytes;", len(STOPS), "stations;", len(LINES), "routes;",
      "stories", len(STOPS) - len(missing), "/ missing", len(missing), "; FR", len(TR["fr"]), "DE", len(TR["de"]), "; quiz", len(GAME))
