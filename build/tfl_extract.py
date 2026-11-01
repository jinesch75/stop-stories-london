"""TfL Unified API (Route/Sequence + StopPoints, downloaded into tfl/) -> network.json:
lines -> branch routes (ordered station keys) + stations (name, zone, lat/lon, naptan ids)."""
import json, os, re, html
SP = os.path.dirname(os.path.abspath(__file__)) + "/"
LINES = [("bakerloo","Bakerloo","#B36305"),("central","Central","#E32017"),("circle","Circle","#FFD300"),
 ("district","District","#00782A"),("hammersmith-city","Hammersmith & City","#F3A9BB"),("jubilee","Jubilee","#A0A5A9"),
 ("metropolitan","Metropolitan","#9B0056"),("northern","Northern","#000000"),("piccadilly","Piccadilly","#003688"),
 ("victoria","Victoria","#0098D4"),("waterloo-city","Waterloo & City","#95CDBA")]
CODE = {"bakerloo":"bak","central":"cen","circle":"cir","district":"dis","hammersmith-city":"ham","jubilee":"jub",
 "metropolitan":"met","northern":"nor","piccadilly":"pic","victoria":"vic","waterloo-city":"wac"}
def clean(n):
    n = html.unescape(n)
    n = re.sub(r"\s+Underground Station$", "", n)
    n = re.sub(r"\s*-\s*Underground$", "", n)
    n = re.sub(r"\s*\((?:[A-Za-z &-]+ lines?|Bakerloo|Circle Line|Dist&Picc Line|H&C Line|Central|Northern|Picc|Met)\)$", "", n, flags=re.I)
    n = re.sub(r"\s*\((?:H&C|Dist&Picc|Circle|Bakerloo)(?: Line)?\)$", "", n, flags=re.I)
    n = re.sub(r"\s*-\s*Underground$", "", n)
    return n.strip()
def is_sub(a, b):
    """True if list a appears as a contiguous run in b (or in reversed b)."""
    for B in (b, b[::-1]):
        for i in range(len(B) - len(a) + 1):
            if B[i:i+len(a)] == a: return True
    return False
stations, out = {}, {}
raw_names = {}
for lid, lname, col in LINES:
    for sp in json.load(open(SP + f"tfl/{lid}-stops.json")):
        zone = next((p["value"] for p in sp.get("additionalProperties", []) if p["key"] == "Zone"), "")
        raw_names[sp["id"]] = sp["commonName"]
        k = clean(sp["commonName"])
        st = stations.setdefault(k, {"name": k, "zone": zone, "ll": [round(sp["lat"], 6), round(sp["lon"], 6)], "ids": []})
        if sp["id"] not in st["ids"]: st["ids"].append(sp["id"])
    id2k = {i: k for k, s in stations.items() for i in s["ids"]}
    routes = []
    for d in ("out", "in"):
        for r in json.load(open(SP + f"tfl/{lid}-{d}.json"))["orderedLineRoutes"]:
            seq = [id2k[i] for i in r["naptanIds"]]
            seq = [k for j, k in enumerate(seq) if j == 0 or k != seq[j-1]]
            # keep a route only if no other route already covers all its stations (drops fast trains and short workings)
            if not any(set(seq) <= set(x) for x in routes):
                routes = [x for x in routes if not set(x) <= set(seq)] + [seq]
    out[lid] = {"id": lid, "code": CODE[lid], "name": lname, "color": col, "routes": routes}
for s in stations.values():
    z = s["zone"].replace("+", "/")
    s["zone"] = z
json.dump({"lines": out, "stations": stations}, open(SP + "network.json", "w"), ensure_ascii=False, indent=1)
if __name__ == "__main__":
    for lid, L in out.items():
        print(L["name"], len(L["routes"]))
        for r in L["routes"]: print("   ", r[0], "->", r[-1], len(r))
    print(len(stations), "stations")
    print([k for k in stations if "(" in k or "&" in k])
