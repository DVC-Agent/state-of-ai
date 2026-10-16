"""Deterministic editorial build from the preserved latest GitHub design and audited modules.
Run from the repository root: python3 audit/build_narrative.py
Manual prose lives in narrative-body.html; all repeated metric renderings use narrative-data.js.
"""
from pathlib import Path
import subprocess, json, re, html
from copy import deepcopy
from bs4 import BeautifulSoup, Comment, Doctype

ROOT = Path(__file__).resolve().parent.parent
GITHUB = "backup/pre-narrative-github-20261016"
EVIDENCE = "backup/pre-narrative-preview-20261016"

def revision_file(ref, name):
    return subprocess.check_output(["git", "show", f"{ref}:{name}"], cwd=ROOT).decode()

def soup_at(ref, name="index.html"):
    return BeautifulSoup(revision_file(ref, name), "html.parser")

latest = BeautifulSoup((ROOT/"versions/pre-seven-chapters/index.html").read_text(),"html.parser")
cache=ROOT/"audit/retained-components.json"
if not cache.exists():
    audited=soup_at(EVIDENCE)
    health=audited.select_one("#sec-healthcare-ai")
    hc_blocks=health.select(".hc-block")
    preserved={
        "agent-stack":str(audited.select_one("#agent-stack-block")),
        "health-money":str(next(t for t in hc_blocks if t.select_one("#hc-sankey-svg"))),
        "health-patient":str(next(t for t in hc_blocks if t.select_one("#hc-loop-svg"))),
        "health-sheets":"".join(str(t) for t in health.select("#hc-bottom-sheet-backdrop,#hc-bottom-sheet"))
    }
    cache.write_text(json.dumps(preserved,indent=2))
else:
    preserved=json.loads(cache.read_text())
data = json.loads(subprocess.check_output(["node", "-e",
    "require('./facts-data.js');require('./narrative-data.js');console.log(JSON.stringify(globalThis.NARRATIVE_DATA))"], cwd=ROOT))
M = data["metrics"]
esc = lambda s: html.escape(str(s), quote=True)

def value(key):
    m = M[key]
    return f'<button type="button" class="inline-fact" data-fact="{key}"><span data-metric="{key}">{esc(m["display"])}</span></button>'

def card(key):
    m=M[key]
    return f'''<button type="button" class="metric-card" data-fact="{key}" aria-label="{esc(m["label"])}: {esc(m["display"])}. Open evidence.">
      <span class="metric-name">{esc(m["label"])}</span><span class="metric-value" data-metric="{key}">{esc(m["display"])}</span>
      <span class="metric-period">{esc(m["period"])}</span><span class="metric-qualifier">{esc(m["qualifier"])}</span>
      <span class="metric-open">Source and method ↗</span></button>'''

def cite(key):
    m=M[key]
    return f'<a class="inline-citation" href="{esc(m["url"])}" target="_blank" rel="noopener noreferrer">{esc(m["source"])}</a>'

def clean_fragment(tag):
    tag=deepcopy(tag)
    for script in tag.select("script"):
        script.decompose()
    for el in tag.select(".anim-fade,.anim-slide-up"):
        el["class"]=[c for c in el.get("class",[]) if c not in ("anim-fade","anim-slide-up")]
    return tag

stack=clean_fragment(BeautifulSoup(preserved["agent-stack"],"html.parser").select_one("#agent-stack-block"))
for el in stack.select(".aa-chip-dl"):
    el.decompose()
for chip in stack.select("[data-tip]"):
    # Vendor metrics drift independently. Keep names/roles, not stale download and funding badges.
    name=chip.get_text(" ",strip=True).replace("DVC","").strip()
    old=BeautifulSoup(chip["data-tip"],"html.parser").get_text(" ",strip=True)
    desc=old if not re.search(r"\d|[$€£]",old) else f"{name}: illustrative ecosystem example in this architectural layer."
    chip["data-tip"]=desc
    chip["tabindex"]="0"
    chip["title"]=desc
health_money=clean_fragment(BeautifulSoup(preserved["health-money"],"html.parser").select_one(".hc-block"))
health_patient=clean_fragment(BeautifulSoup(preserved["health-patient"],"html.parser").select_one(".hc-block"))
health_sheets=preserved["health-sheets"]
portfolio_root=latest.select_one("#sec-13")
portfolio="".join(str(clean_fragment(t)) for t in portfolio_root.select(".eco-filters,#eco-cloud-container"))
nav="".join(f'<a href="#{c["id"]}"><span>{i:02d}</span>{esc(c["title"])}</a>' for i,c in enumerate(data["chapters"],1))
body=(ROOT/"audit/narrative-body.html").read_text()
body=body.replace("Cursor's thin delivery margins are a reason to question comparisons with high-margin SaaS, not automatically evidence of an irrational multiple.",
    "A low revenue multiple at an inference-heavy tool such as Cursor need not imply cheapness: thin delivery margins can explain the discount to high-margin SaaS.")
fragments={"chapter-nav":nav,"agent-stack":str(stack),"health-money":str(health_money),"health-patient":str(health_patient),"health-sheets":health_sheets,"portfolio":portfolio}
for key,fragment in fragments.items(): body=body.replace("{{"+key+"}}",fragment)
body=re.sub(r"\{\{(value|metric|cite):([A-Za-z0-9]+)\}\}",lambda m:{"value":value,"metric":card,"cite":cite}[m[1]](m[2]),body)
assert "{{" not in body
hero=clean_fragment(latest.select_one("#sec-0"))
hero["id"]="top"
for a in hero.find_all("a",recursive=False): a.decompose()
for a in hero.select('a[href*="app.theoss.ai"]'): a.decompose()
for s in hero.find_all("style",recursive=False): s.decompose()
title=hero.select_one(".hero-title")
title.clear();title.append("State of AI")
subtitle=hero.select_one(".hero-subtitle")
if subtitle: subtitle.string="The operating manual for the AI economy"
tension=hero.select_one(".hero-tension")
if tension: tension.string="What intelligence runs on. How it becomes work. Where businesses and investors capture value."
note=latest.new_tag("p",attrs={"class":"edition-note"})
note.append(BeautifulSoup('Evidence cut: October 16, 2026. Read the main argument or open the evidence, company maps and interactive systems below. <a href="versions/pre-seven-chapters/index.html">Previous GitHub version</a> preserved.',"html.parser"))
hero.select_one(".hero-content").append(note)
mobile_brand=latest.new_tag("img",attrs={"class":"hero-mobile-brand","src":"assets/brand/dvc-horizontal.svg","alt":"Davidovs Venture Collective","width":"110","height":"40"})
hero.select_one(".hero-content").insert(0,mobile_brand)
head=deepcopy(latest.head)
for el in head.find_all("script"): el.decompose()
for el in head.select("#embed-mode-style"): el.decompose()
for el in head.find_all("link",rel="stylesheet"):
    if el.get("href","").startswith(("sec2","sec8","mobile")): el.decompose()
head.title.string="State of AI | DVC"
head.select_one('meta[name="description"]')["content"]="The AI economy in seven chapters: infrastructure, agents, business models, services, healthcare, physical AI and investment returns."
for name in ["narrative.css"]:
    head.append(BeautifulSoup(f'<link rel="stylesheet" href="{name}?v=20261016n">',"html.parser"))
for name in ["facts-data.js","narrative-data.js","services-matrix-data.js"]:
    head.append(BeautifulSoup(f'<script src="{name}?v=20261016n"></script>',"html.parser"))
options="".join(f'<option value="{c["id"]}">{i}. {esc(c["title"])}</option>' for i,c in enumerate(data["chapters"],1))
header=f'''<a class="skip-reading" href="#report-content">Skip to the report</a>
<header class="reading-header"><a class="reading-brand" href="#top" aria-label="State of AI, back to top"><img src="assets/brand/dvc-mono-horizontal-light.svg" width="96" height="32" alt="Davidovs Venture Collective"><span>State of AI</span></a>
<nav class="reading-actions" aria-label="Report controls"><div class="reading-mode" role="group" aria-label="Reading depth"><button type="button" data-reading-mode="read" aria-pressed="true">Reading path</button><button type="button" data-reading-mode="explore" aria-pressed="false">Explore all</button></div><a href="slides.html">Slides ↗</a><a class="backup-link" href="versions/pre-seven-chapters/index.html">Previous version</a><a class="updates-link" href="whats-new.html">Latest update</a></nav>
<select class="mobile-chapters" id="mobile-chapters" aria-label="Jump to chapter">{options}</select></header>
<div class="latest-edition">October 16, 2026 edition · Seven-part narrative · Evidence retains its own observation date.<a href="whats-new.html">What's changed</a></div>'''
dialog='''<dialog class="metric-dialog" id="metric-dialog" aria-label="Evidence detail"><button class="dialog-close" type="button">Close ✕</button><div class="metric-dialog-content"></div></dialog>'''
scripts=[
("https://cdn.jsdelivr.net/npm/d3@7",False),("https://cdn.jsdelivr.net/npm/d3-sankey@0.12.3/dist/d3-sankey.min.js",False),
("healthcare-data.js",True),("healthcare.js",True),("robotics-data.js",True),("industrial-data.js",True),("evidence-sync.js",True),
("portfolio-domains.js",True),("sec13.js",True),("attack-angles.js",True),("logo-names.js",True),
("company-domains.js",True),("logos.js",True),("money-river.js",True),("rivers-init.js",True),("narrative.js",True)]
footer='''<footer class="site-footer"><div class="container footer-inner"><p>© 2026 Davidovs Venture Collective. Evidence and models are point-in-time, not investment advice.</p><a href="versions/pre-seven-chapters/index.html">Preserved previous version</a><a href="whats-new.html">Latest edition notes</a></div></footer>'''
script_html="".join(f'<script src="{src}{"?v=20261016n" if local else ""}"></script>' for src,local in scripts)
output=f'<!DOCTYPE html><html lang="en">{head}<body>{header}{hero}{body}{footer}{dialog}{script_html}</body></html>'
# Sentence-case editorial copy, preserving source URLs, SVG geometry and company names.
out=BeautifulSoup(output,"html.parser")
out.select_one("#attack-angles-block")["data-aa-mode"]="stage"
for text in list(out.find_all(string=True)):
    if not isinstance(text,(Comment,Doctype)) and text.parent.name not in ("script","style"):
        text.replace_with(str(text).replace("—"," - ").replace("–","-"))
for a in out.select('a[href^="http"]'):
    a["target"]="_blank";a["rel"]="noopener noreferrer"
(ROOT/"index.html").write_text(str(out))
print(f"Built report: {len(out.select('.narrative-chapter'))} chapters, {len(out.select('details.rabbit-hole'))} rabbit holes, {len(out.select('[data-metric]'))} bound figure renderings.")
updates=f'''<header class="reading-header"><a class="reading-brand" href="index.html"><img src="assets/brand/dvc-mono-horizontal-light.svg" width="96" height="32" alt="Davidovs Venture Collective"><span>State of AI</span></a><nav class="reading-actions"><a href="index.html">Read the report</a><a href="slides.html">Slides</a><a href="versions/pre-seven-chapters/index.html">Previous version</a></nav></header>
<main class="edition-page"><p class="chapter-kicker">Latest edition / October 16, 2026</p><h1>One argument.<br>Seven chapters.</h1><p class="chapter-deck">The latest narrative and evidence update. Earlier editorial update plaques have been replaced, not accumulated.</p>
<div class="edition-changes">
<article><h2>A cleaner reading path</h2><p>The economic AI stack leads into the agentic stack, monetization, service-market entry, healthcare, physical deployment and investment returns. Clickable evidence and interactive systems remain beneath the main argument.</p></article>
<article><h2>One record for repeated figures</h2><p>Report text, slides, evidence cards and mouseovers use shared metric records. Historical baselines, forecasts, run-rates, reported revenue and transaction marks retain different labels and dates.</p></article>
<article><h2>Economics without invented margin bands</h2><p>No universal gross-margin or EBITDA target is assigned to AI SaaS, service operators or rollups. Capital requirements are described as cash flow, equity, debt, leases or working capital, not as a business-model label.</p></article>
<article><h2>Chinese open-weight competition</h2><p>DeepSeek, Kimi and GLM sit in the model comparison. Exact weight artifacts and licenses are distinguished from model-family announcements and API availability.</p></article>
<article><h2>Preserved exploration</h2><p>The services map, agent stack, healthcare money river and patient loop, robotics and industrial rivers, and existing DVC portfolio explorer remain accessible. All-open and reading-path controls let the reader choose the depth.</p></article>
</div><h2 class="edition-evidence-heading">Selected current evidence</h2><div class="metric-grid">{card("anthropicRevenue")}{card("openaiRevenue")}{card("higgsfieldRevenue")}{card("capexTotal")}{card("healthRoi")}{card("robotInstalls")}</div>
<p class="method-note">“Current” means the latest verified disclosure in this evidence cut, not that every observation occurred in October. The previous GitHub version and its slides are preserved unchanged. The deferred bear-case slide has not been built.</p>
<a class="edition-return" href="index.html">Read and explore the report →</a></main>'''
(ROOT/"whats-new.html").write_text(f'<!DOCTYPE html><html lang="en">{head}<body>{updates}{dialog}<script src="narrative.js?v=20261016n"></script></body></html>')
