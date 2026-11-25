"""Structural invariants complement, never replace, real browser inspection."""
from pathlib import Path
from collections import Counter
from bs4 import BeautifulSoup
import subprocess, json, hashlib

R=Path(__file__).resolve().parent.parent
results={}
for name,cover in [("index.html","#sec-0"),("slides.html","#slide-1")]:
    base=BeautifulSoup((R/"versions/pre-seven-chapters"/name).read_text(),"html.parser")
    live=BeautifulSoup((R/name).read_text(),"html.parser")
    ids=lambda soup:{x["id"] for x in soup.select("[id]")}
    assert not ids(base)-ids(live),(name,"Missing original IDs",ids(base)-ids(live))
    assert str(base.select_one(cover))==str(live.select_one(cover)),(name,"Cover changed")
    duplicate=[k for k,n in Counter(x["id"] for x in live.select("[id]")).items() if n>1]
    assert not duplicate,(name,"Duplicate IDs",duplicate)
    missing=[]
    for x in live.select("[src],link[href]"):
        u=(x.get("src") or x.get("href")).split("?")[0].split("#")[0]
        if u and not u.startswith(("http:","https:","//","data:")) and not (R/u).exists():missing.append(u)
    assert not missing,(name,"Missing local assets",missing)
    results[name]={"all_original_ids_retained":True,"cover_exact":True,"duplicate_ids":0,"missing_local_assets":0,
                   "original_words":len(base.get_text(" ",strip=True).split()),"new_total_words_including_depth":len(live.get_text(" ",strip=True).split())}
report=BeautifulSoup((R/"index.html").read_text(),"html.parser")
assert len(report.select(".visual-chapter"))==7
assert [x["id"] for x in report.select(".visual-chapter")]==["sec-stack","sec-agents","sec-business","sec-services","sec-health","sec-physical","sec-investing"]
deck=BeautifulSoup((R/"slides.html").read_text(),"html.parser")
assert len(deck.select(".slide"))==18
assert [x["id"] for x in deck.select(".slide")]==[f"slide-{n}" for n in [1,2,3,4,5,6,7,8,9,10,11,12,13,15,14,16,17,18]]
manifest=json.loads((R/"audit/visual-preservation.json").read_text())
for surface in ["report","deck"]:
    for selector,count in manifest[surface].items():
        assert manifest["after_"+surface][selector]>=count,(surface,selector)
baseline=json.loads((R/"audit/inputs/original-source-sha256.json").read_text())
verified=0
for name,expected in baseline["files"].items():
    archived=R/"versions/pre-seven-chapters"/name
    assert archived.is_file(),("Backup missing",name)
    assert hashlib.sha256(archived.read_bytes()).hexdigest()==expected,("Backup modified",name)
    verified+=1
results["backup"]={"unchanged_original_files":verified}
extra=json.loads(subprocess.check_output(["node","-e","require('./facts-data.js');require('./narrative-data.js');require('./evidence-additions-data.js');console.log(JSON.stringify(EVIDENCE_ADDITIONS))"],cwd=R))
bench=extra["benchmarks"];compute=extra["compute"]
assert len(bench["rows"])==19
assert all(len(row["scores"])==4 for row in bench["rows"])
assert sum(v is None for row in bench["rows"] for v in row["scores"])==3
assert bench["rows"][3]["scores"]==[19.6,5.4,6.7,3.8]
assert bench["rows"][5]["scores"]==[55,65.5,56.3,62.3]
assert bench["rows"][18]["scores"][:2]==[68,68]
assert compute["quarters"][-2:]==["Q3 2026 E","Q4 2026 E"]
assert [compute[k][-1] for k in ["pre","post","inference"]]==[7,55,38]
assert [compute[k][-2] for k in ["pre","post","inference"]]==[10,53,37]
assert all(99<=sum(compute[k][i] for k in ["pre","post","inference"])<=101 for i in range(12))
results["added_evidence"]={"benchmark_rows":19,"score_cells":76,"missing_not_zero":3,"compute_quarters":12,"both_last_quarters_marked_E":True,"scope":compute["scope"],"source_vintage":compute["vintage"]}
results["graphics"]=manifest
results["limitations"]="DOM invariants are not browser rendering or factual verification. See browser QA evidence for rendered checks; historical source series retain their own dates and methods."
(R/"audit/visual-structural-results.json").write_text(json.dumps(results,indent=2))
print(json.dumps(results,indent=2))
