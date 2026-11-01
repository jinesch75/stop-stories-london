import sys, json, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import wp
L = json.load(open("list.json"))
titles = []
for v in L.values():
    for t in (v["title"], v["area"]):
        if t and t not in titles: titles.append(t)
done = json.load(open("pages.json")) if os.path.exists("pages.json") else {}
for i, t in enumerate(titles):
    if t in done: continue
    d = wp.api(action="query", prop="extracts|info", explaintext=1, titles=t, redirects=1, inprop="url")
    p = d["query"]["pages"][0]
    done[t] = {"title": p.get("title"), "url": p.get("fullurl"), "text": p.get("extract", "")}
    if i % 20 == 0:
        json.dump(done, open("pages.json", "w"), ensure_ascii=False); print(i, len(titles), flush=True)
json.dump(done, open("pages.json", "w"), ensure_ascii=False); print("done", len(done))
