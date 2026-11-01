"""Find the Wikipedia article title for each new station (first candidate that exists), politely."""
import json, time, urllib.request, urllib.parse, sys, os
UA = "StopStoriesLondon/1.0 (https://github.com/jinesch75/stop-stories-london; jacquesbrosius@hotmail.com)"
D = os.path.dirname(os.path.abspath(__file__))
def exists(t):
    u = "https://en.wikipedia.org/wiki/" + urllib.parse.quote(t.replace(" ", "_"), safe="(),'&")
    for i in range(20):
        try:
            req = urllib.request.Request(u, headers={"User-Agent": UA}, method="HEAD")
            with urllib.request.urlopen(req, timeout=30) as r: time.sleep(2); return r.status == 200
        except urllib.error.HTTPError as e:
            if e.code == 404: time.sleep(2); return False
            if e.code == 429: time.sleep(30); continue
            raise
    raise RuntimeError("gave up " + t)
N = json.load(open(D + "/../network.json"))
L = json.load(open(D + "/list.json"))
modes = {}
for l in N["lines"].values():
    for r in l["routes"]:
        for k in r: modes.setdefault(k, set()).add(l["mode"])
outp = D + "/new_titles.json"
res = json.load(open(outp)) if os.path.exists(outp) else {}
for k in sorted(N["stations"]):
    if k in L or k in res: continue
    m = modes[k]
    cands = [f"{k} DLR station"] if m == {"dlr"} else []
    cands += [f"{k} railway station", f"{k} station", f"{k} DLR station", f"{k} railway station (England)", f"{k} railway station (London)"]
    res[k] = next((c for c in dict.fromkeys(cands) if exists(c)), "")
    json.dump(res, open(outp, "w"), indent=1, ensure_ascii=False); print(k, "->", res[k], flush=True)
