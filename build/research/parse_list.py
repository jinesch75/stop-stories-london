import re, json
w = open("list.wiki").read()
rows = w.split("\n|-\n")
link = re.compile(r"\[\[([^\]|]+)(?:\|([^\]]+))?\]\]")
out = {}
for r in rows:
    m = re.search(r"!scope=row\|\s*\[\[([^\]|]+)\|([^\]]+)\]\]", r)
    if not m: continue
    title, name = m.group(1), re.sub(r"&nbsp;", " ", m.group(2))
    cells = re.split(r"\|\||\n\|", r[m.end():])
    links = [link.findall(c) for c in cells]
    borough = next((l[0][1] or l[0][0] for c, l in zip(cells, links) if l and "London Borough" in l[0][0] or (l and l[0][0] in ("City of London","City of Westminster","Royal Borough of Kensington and Chelsea","Royal Borough of Greenwich","Three Rivers District","Chiltern District","Epping Forest District","Watford","Buckinghamshire","Hertfordshire","Essex","Three Rivers"))), "")
    opened = re.search(r"\{\{dts\|[^}]*?\|(\d{4})", r)
    area = links[-1][0][0] if links[-1] else ""
    prev = cells[-3].strip() if len(cells) > 3 else ""
    out[name] = {"title": title, "borough": borough, "opened": opened.group(1) if opened else "", "area": area, "prev": re.sub(r"\{\{sort\|z\|\}\}|\{\{efn.*?\}\}|<ref.*?(/>|</ref>)", "", prev).strip()}
json.dump(out, open("list.json", "w"), indent=1, ensure_ascii=False)
print(len(out))
for k in list(out)[:8]: print(k, out[k])
