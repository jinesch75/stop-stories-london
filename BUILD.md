# Stop Stories London – source and build

The hidden story behind the next London Underground station: a phone web app (EN/FR/DE), one self-contained page.
An independent project, not affiliated with TfL. Feedback: jacquesbrosius@hotmail.com (set in `build/build.py`, `OWNER_EMAIL`).

## Deploy (Railway)
`site/` is what gets served. The root `package.json` runs `serve site`, so a Railway service pointed at this repo (branch `main`) needs no settings. Every push redeploys.

## Rebuild (run from `build/`)
```
python3 tfl_extract.py   # tfl/*.json (TfL Unified API) -> network.json (lines, branch routes, stations, zones, coordinates)
python3 build.py         # network.json + stories_*.py + tr_fr.py + tr_de.py + quiz.py + src/* -> ../site/index.html, ../site/sw.js
python3 quiz_check.py    # every quiz fact must appear verbatim in its station's text (-v prints all)
python3 shot.py home= list=lnor1-a   # optional: phone-size screenshots (Playwright + Chrome)
```
Refresh the network data: re-download `tfl/<line>-out.json`, `-in.json`, `-stops.json` from
`https://api.tfl.gov.uk/Line/<line>/Route/Sequence/outbound?serviceTypes=Regular` (and `inbound`) and `/Line/<line>/StopPoints`.

## Where things live
- `src/`: `style.css` (the Luxembourg Stop Stories look), `london.css` (line colours, line tiles, route chooser), `body.html`, `core.js`, `i18n.js` (UI strings EN/FR/DE), `app.js` (all screens: home, line, station, about, quiz, pop-ups).
- Stories: `stories_1..4.py` (English, alphabetical): `station: (head, text, [Wikipedia titles shown first under Read more])`. Each station also links its Wikipedia station article and the Londonist "How the … line stations got their names" article. An empty head and text shows "We haven't found the story behind this name yet."
- Translations: `tr_fr.py`, `tr_de.py`: `station: (head, text)`.
- Lines with branches: `ROUTE_PLAN` in `build.py` orders the routes and adds "via" where two routes share their ends (Northern: Bank / Charing Cross; Central: Hainault via Newbury Park / Woodford).
- `research/list.json`: borough, Wikipedia title, opening year and former names per station (parsed from Wikipedia's List of London Underground stations).
