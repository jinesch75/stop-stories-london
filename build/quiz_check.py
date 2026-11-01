"""Check quiz.py against the English station texts: proof phrases verbatim, 4 distinct options,
guess answers = station names, one question per station, FR/DE complete. -v prints every question with its text."""
import importlib.util, glob, os, sys
SP = os.path.dirname(os.path.abspath(__file__)) + "/"
def load(p):
    s = importlib.util.spec_from_file_location(os.path.basename(p)[:-3], p); m = importlib.util.module_from_spec(s); s.loader.exec_module(m); return m
S = {}
OV = []
for f in sorted(glob.glob(SP + "stories_*.py")):
    m = load(f); S.update(getattr(m, "STORIES", {})); OV.append(getattr(m, "OVERRIDE", {}))
for ov in OV:   # same rule as build.py: overrides in file order, head/text None = keep
    for k, t in ov.items():
        h, x = t if isinstance(t, tuple) else (None, t)
        S[k] = (h or S[k][0], x or S[k][1], S[k][2])
qz = load(SP + "quiz.py"); err = []; ids = set(); stops = []
for q in qz.Q:
    i = q["id"]; assert i not in ids, i; ids.add(i)
    k = q["stop"]
    if k not in S: err.append((i, "unknown station", k)); continue
    stops.append(k)
    full = (S[k][0] + " " + S[k][1]).lower()
    for p in q["proof"]:
        if p.lower() not in full: err.append((i, "proof missing", p))
    opts = [q["a"]] + q["wrong"]
    if len(set(opts)) != 4: err.append((i, "options not 4 distinct"))
    if q["type"] == "guess":
        for o in opts:
            if o not in S: err.append((i, "not a station name", o))
        if q["a"] != k: err.append((i, "answer is not the station", q["a"]))
        for l in ("fr", "de"):
            if len(q[l]) != 2: err.append((i, l, "needs (q, ex)"))
    else:
        for l in ("fr", "de"):
            v = q[l]
            if len(v) != 4 or len(v[2]) != 3 or len(set([v[1]] + v[2])) != 4: err.append((i, l, "needs (q, a, [3 distinct wrong], ex)"))
    if "-v" in sys.argv:
        print(f"\n[{i}] {k}\n  TEXT: {S[k][0]} {S[k][1]}\n  Q: {q['q']}\n  A: {q['a']} | wrong: {q['wrong']}\n  EX: {q['ex']}")
for g in qz.GROUPS: assert g in ids, ("group for unknown id", g)
print(len(qz.Q), "questions;", sum(q["type"] == "guess" for q in qz.Q), "guess;", "repeated stations:", sorted({s for s in stops if stops.count(s) > 1}))
for e in err: print("ERR", e)
sys.exit(1 if err else 0)
