"""TfL Unified API (Route/Sequence + StopPoints, downloaded into tfl/) -> network.json:
lines (with mode) -> branch routes (ordered station keys) + stations (name, zone, coordinates of every
platform/station with that name, naptan ids). Stations with the same public name on different lines or
modes share one entry (and one story); they keep all their coordinates for "near me"."""
import json, os, re, html
SP = os.path.dirname(os.path.abspath(__file__)) + "/"
# id, display name, colour, mode, short code
LINES = [
 ("bakerloo","Bakerloo","#B36305","tube","bak"),("central","Central","#E32017","tube","cen"),("circle","Circle","#FFD300","tube","cir"),
 ("district","District","#00782A","tube","dis"),("hammersmith-city","Hammersmith & City","#F3A9BB","tube","ham"),("jubilee","Jubilee","#A0A5A9","tube","jub"),
 ("metropolitan","Metropolitan","#9B0056","tube","met"),("northern","Northern","#000000","tube","nor"),("piccadilly","Piccadilly","#003688","tube","pic"),
 ("victoria","Victoria","#0098D4","tube","vic"),("waterloo-city","Waterloo & City","#95CDBA","tube","wac"),
 ("elizabeth","Elizabeth","#6950A1","elizabeth","eli"),
 ("liberty","Liberty","#676767","overground","lib"),("lioness","Lioness","#F1B41C","overground","lio"),("mildmay","Mildmay","#437EC1","overground","mil"),
 ("suffragette","Suffragette","#39B97A","overground","suf"),("weaver","Weaver","#972861","overground","wea"),("windrush","Windrush","#EF4D5E","overground","win"),
 ("dlr","DLR","#00A4A7","dlr","dlr")]
RENAME = {"Euston": "Euston", "London Euston": "Euston", "London Liverpool Street": "Liverpool Street", "London Paddington": "Paddington",
          "New Cross ELL": "New Cross", "Custom House (for ExCel)": "Custom House", "Cutty Sark (for Maritime Greenwich)": "Cutty Sark",
          "Shepherds Bush": "Shepherd's Bush", "Queens Park": "Queen's Park", "Walthamstow Queens Road": "Walthamstow Queen's Road",
          "St. Paul's": "St Paul's", "King's Cross St. Pancras": "King's Cross St Pancras", "St. James's Park": "St James's Park",
          "St. John's Wood": "St John's Wood"}
def clean(n):
    n = html.unescape(n)
    n = re.sub(r"\s+(Underground|Rail|DLR) Station$", "", n)
    n = re.sub(r"\s*-\s*Underground$", "", n)
    n = re.sub(r"\s*\((?:[A-Za-z &-]+ lines?|Bakerloo|Circle Line|Dist&Picc Line|H&C Line|Central|Northern|Picc|Met)\)$", "", n, flags=re.I)
    n = re.sub(r"\s*\((?:H&C|Dist&Picc|Circle|Bakerloo)(?: Line)?\)$", "", n, flags=re.I)
    n = re.sub(r"\s*\((?:London|Berks)\)$", "", n)
    return RENAME.get(n.strip(), n.strip())
stations, out = {}, {}
for lid, lname, col, mode, code in LINES:
    id2k = {}
    for sp in json.load(open(SP + f"tfl/{lid}-stops.json")):
        zone = next((p["value"] for p in sp.get("additionalProperties", []) if p["key"] == "Zone"), "")
        k = clean(sp["commonName"]); id2k[sp["id"]] = k
        st = stations.setdefault(k, {"name": k, "zone": zone.replace("+", "/"), "ll": [], "ids": []})
        p = [round(sp["lat"], 6), round(sp["lon"], 6)]
        if all(abs(p[0] - q[0]) + abs(p[1] - q[1]) > 0.002 for q in st["ll"]): st["ll"].append(p)   # keep distinct locations only
        if sp["id"] not in st["ids"]: st["ids"].append(sp["id"])
    routes = []
    for d in ("out", "in"):
        for r in json.load(open(SP + f"tfl/{lid}-{d}.json"))["orderedLineRoutes"]:
            seq = [id2k[i] for i in r["naptanIds"]]
            seq = [k for j, k in enumerate(seq) if j == 0 or k != seq[j-1]]
            # keep a route only if no other route already covers all its stations (drops fast trains and short workings)
            if not any(set(seq) <= set(x) for x in routes):
                routes = [x for x in routes if not set(x) <= set(seq)] + [seq]
    out[lid] = {"id": lid, "code": code, "name": lname, "color": col, "mode": mode, "routes": routes}
json.dump({"lines": out, "stations": stations}, open(SP + "network.json", "w"), ensure_ascii=False, indent=1)
if __name__ == "__main__":
    for lid, L in out.items():
        print(L["name"], len(L["routes"]))
        for i, r in enumerate(L["routes"]): print("   ", i, r[0], "->", r[-1], len(r))
    print(len(stations), "stations")
