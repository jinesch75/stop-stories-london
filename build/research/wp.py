"""Polite Wikipedia API helper (one request at a time, back-off on 429)."""
import json, time, urllib.request, urllib.parse, os
UA = "StopStoriesLondon/1.0 (https://github.com/jinesch75/stop-stories-london; jacquesbrosius@hotmail.com)"
def api(**p):
    p.update(format="json", formatversion="2")
    url = "https://en.wikipedia.org/w/api.php?" + urllib.parse.urlencode(p)
    for i in range(30):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=40) as r:
                d = json.loads(r.read()); time.sleep(4.0); return d
        except urllib.error.HTTPError as e:
            if e.code == 429: time.sleep(60); continue
            raise
    raise RuntimeError("rate limited " + url)
