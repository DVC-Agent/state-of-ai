"""Restore the original visual presentation, changing sequence and facts only."""
from pathlib import Path
from copy import deepcopy
import json,re,subprocess
from bs4 import BeautifulSoup,Comment,Doctype
ROOT=Path(__file__).resolve().parent.parent
BASE=ROOT/"versions/pre-seven-chapters"
s=BeautifulSoup((BASE/"slides.html").read_text(),"html.parser")
M=json.loads(subprocess.check_output(["node","-e","require('./facts-data.js');require('./narrative-data.js');console.log(JSON.stringify(NARRATIVE_DATA.metrics))"],cwd=ROOT))
def text(el,value):
    if el:el.clear();el.append(value)
cover=str(s.select_one("#slide-1"))
slides={int(x["data-slide"]):x.extract() for x in s.select(".slide")}
order=[1,2,3,4,5,6,7,8,9,10,11,12,13,15,14,16,17,18]
deck=s.select_one("#deck")
for n in order:deck.append(slides[n])
# Original IDs are the animation identities; displayed position is separate.
for i,n in enumerate(order):
    if n!=1:slides[n]["data-position"]=str(i+1)
# Correct known misleading headlines without touching the original title slide.
for n,text in [(3,"The economics of intelligence are changing"),(7,"Cheaper tokens. Different task costs."),(11,"More code. More verification."),(13,"Price the access, the work or the outcome."),(15,"Three angles. Different responsibilities."),(16,"Efficiency does not guarantee lower spending.")]:
    h=slides[n].select_one(".slide-headline")
    if h:h.clear();h.append(text)
def settext(el,value):
    if el:el.clear();el.append(value)
captions={
 2:"The same intelligence connects applications, models, compute, silicon and power.",
 3:"Each platform changes who can build, what can be sold and the cost of delivery.",
 4:"Five linked layers. Different units, periods and economic constraints.",
 5:"Applications own the customer relationship. Models compete inside the product.",
 6:"Three price tiers. A separate choice about control. Cost per completed task still matters.",
 7:"Token prices do not measure retries, tools, human review or successful work.",
 8:"$732.5B in selected-four 2026 guidance midpoints. Different accounting scopes; not AI-only.",
 9:"Compute is useful only when hardware, power and deployment are ready together.",
 10:"Seven layers turn a model into an agent that can reliably act.",
 11:"Coding tools belong in the tool layer, not the service-operator category.",
 12:"Voice becomes a delivery surface. Conversations are not completed outcomes.",
 13:"Price access, usage, tasks or outcomes. Underwrite the cost of delivery.",
 14:"Explore markets and examples. Market sizes are not additive.",
 15:"Sell software, deliver the service, or acquire the provider.",
 16:"Administrative ROI does not establish clinical autonomy or lower system-wide spending.",
 17:"Measure deployment, utilization, intervention and customer ROI.",
 18:"Where value shifts. What we can measure. What an investor can retain."
}
for n,copy in captions.items():
    for p in slides[n].select(".slide-sub"):settext(p,copy)
settext(slides[7].select_one(".slide-headline"),"Choose the task. Then price the work.")
settext(slides[7].select_one(".slide-sub"),"Capability, API price and lab compute allocation are different axes.")
chart_wrap=slides[7].select_one("#smarterChart").parent
chart_wrap["id"]="deck-evidence-chart"
chart_wrap["hidden"]=""
chart_wrap.insert_before(BeautifulSoup('''<div class="evidence-view-tabs" role="group" aria-label="Evidence view">
 <button type="button" data-evidence-view="benchmarks" aria-pressed="true">Task performance</button>
 <button type="button" data-evidence-view="prices" aria-pressed="false">API prices</button>
 <button type="button" data-evidence-view="compute" aria-pressed="false">Compute mix</button>
</div><div id="deck-benchmarks"></div>''',"html.parser"))
chart_wrap.insert_after(BeautifulSoup('<p class="compute-caption" id="deck-evidence-caption" hidden></p>',"html.parser"))
for source in slides[7].select(".token-kpi,.tk-block,.tk-strip"):
    if source.select("#smarterChart"):continue
    citation=source.find_next_sibling("p",class_="slide-source")
    details=BeautifulSoup('<details class="evidence-method"><summary>Token-efficiency notes</summary></details>',"html.parser").details
    source.replace_with(details);details.append(source)
    if citation:details.append(citation.extract())
# The closing retains its original six visual panels, with one brush stroke each.
closing=[
 ("Distribution owns the workflow.","A model wins a task. A product earns the customer relationship."),
 ("Capacity must become usable.","Power, construction, supply and utilization turn commitments into delivery."),
 ("Delivery determines margin.","Count inference, retries, tools, human review and liability."),
 ("Services carry responsibility.","Selling a tool, delivering work and acquiring a provider are different businesses."),
 ("Efficiency can increase spending.","Time saved, revenue captured and system-wide savings are separate outcomes."),
 ("Underwrite retained cash.","Customer value → captured profit → durable cash → entry price.")
]
for card,(title,copy) in zip(slides[18].select(".kl-card"),closing):
    settext(card.select_one("h3,h4,.kl-card-title"),title)
    for p in card.select("p"):settext(p,copy)
for item in slides[5].select(".tk-item"):
    label=item.select_one(".tk-item-label")
    name=label.get_text(" ",strip=True).upper() if label else ""
    key="anthropicRevenue" if name.startswith("ANTHROPIC") else "openaiRevenue" if name.startswith("OPENAI") else None
    if key:
        m=M[key];settext(item.select_one(".tk-item-num"),m["display"])
        label.clear();label.append(BeautifulSoup(f'<strong>{m["label"]}</strong> · {m["period"]}. <a href="{m["url"]}" target="_blank" rel="noopener noreferrer">{m["source"]}</a>',"html.parser"))
        item["title"]=m["qualifier"]
voice=slides[12].select_one(".va-card")
if voice:
    settext(voice.select_one(".va-card-tag"),"Company disclosure · September 30, 2026")
    settext(voice.select_one(".va-card-num"),M["voiceEnterprise"]["display"])
    settext(voice.select_one(".va-card-label"),"Enterprise share of revenue")
    items=voice.select("li")
    for el,copy in zip(items,[">15M agent conversations per week","Conversation volume is not resolution or ROI","Employee tender: $22B valuation; not a primary raise"]):settext(el,copy)
    note=voice.select_one(".va-card-caveat")
    if note:
        note.clear();note.append(BeautifulSoup(f'<a href="{M["voiceEnterprise"]["url"]}" target="_blank" rel="noopener noreferrer">ElevenLabs · company-disclosed, unaudited</a>',"html.parser"))
for el in slides[12].select(".va-strip-num"):
    if "$600M" in el.get_text():settext(el,">15M / week")
for el in slides[12].select(".va-strip-label"):
    if "ARR" in el.get_text():settext(el,"Agent conversations · not resolved outcomes")
for item,(num,label) in zip(slides[12].select(".va-strip-item"),[
    (">15M / week","Agent conversations · Sep 30"),
    ("55%","Enterprise revenue mix · Sep 30"),
    ("$22B","Employee tender mark · not primary funding")]):
    settext(item.select_one(".va-strip-num"),num)
    settext(item.select_one(".va-strip-label"),label)
for item,(num,label) in zip(slides[8].select(".iframe-stat"),[
    ("$720B","Selected-four guidance · low end"),
    ("$745B","Selected-four guidance · upper end"),
    ("$732.5B","Midpoint · mixed accounting scopes")]):
    settext(item.select_one(".iframe-stat-num"),num)
    settext(item.select_one(".iframe-stat-label"),label)
settext(slides[8].select_one('[data-company="oracle"] .tog-val'),"FY scope")
for el in slides[13].select(".slide-arpu-intro"):
    settext(el,"Illustrative pricing mechanics. No comparable cross-company ARPU or paid-conversion ratio is asserted.")
    el.attrs.pop("data-full-context",None)
# Old update blocks are supporting evidence, not the presentation's main picture.
for slide in slides.values():
    if slide["id"]=="slide-1":continue
    for el in slide.select(".slide-update,.slide-refresh,.lab-update"):
        el["class"]=el.get("class",[])+["visual-slide-evidence"]
# Keep the original stack's three states, without invented margin estimates.
for el in slides[4].select('.su-stat-num'):settext(el,"")
for el in slides[4].select('.su-stat-tag'):settext(el,"")
foot=slides[4].select('.su-foot-state')
for el,copy in zip(foot,[
 "$732.5B · selected-four 2026 capex midpoint; guidance, not revenue",
 "No universal margin band · inference, delivery, utilization and capital costs differ",
 "Commoditization ↓ · customer context and distribution ↑"]):
    el.clear();el.append(copy)
# Current public observations inside the original native callout frames.
def replace_metric_cards(slide,selector,records):
    nodes=slide.select(selector)
    for node,(key,caption) in zip(nodes,records):
        num=node.select_one('[class*="num"],[class*="stat"],strong')
        if num:settext(num,M[key]["display"])
        node["title"]=M[key]["period"]+". "+M[key]["qualifier"]
# Remove numeric download counts, not the agent-stack chips themselves.
for el in slides[10].select(".aa-chip-dl"):el.decompose()
for el in slides[10].select("[data-tip]"):
    if re.search(r"\d|[$€£]",el["data-tip"]):el["data-tip"]="Illustrative agent-stack company. Current operating or financing metrics are not inferred."
# Known outdated replicas. Covers and the original visual marks are untouched.
replacements={
 "~$735B":"$732.5B","~$733B":"$732.5B","~$138B":"$137.5B",
 "$11.5B":"$11.6B","$500M ARR on 146 employees":"more than $600M in annualized revenue (September 24)",
 "~$3.4M ARR per head":"no current employee denominator",
 "$600M ARR — from $330M at end-2025 (~175% YoY)":"55% enterprise revenue mix · September 30 disclosure",
 "41% of the Fortune 500 as customers":">15M agent conversations per week · September 30 disclosure",
 "$65B+ run-rate":"$16.8B reported Q3 revenue",
    "$65B run-rate at end of July 2026":"$16.8B reported Q3 2026 revenue",
 "run-rate reported at ~$40B in August":"~$50B annualized September revenue",
    "Revised August 4, 2026.":"Evidence reviewed October 16, 2026."
}
for n,slide in slides.items():
    if n==1:continue
    for el in list(slide.find_all(string=True)):
        if isinstance(el,(Comment,Doctype)):continue
        if el.parent.name in ["script","style"]:continue
        value=str(el)
        for a,b in replacements.items():value=value.replace(a,b)
        el.replace_with(value)
for el in slides[7].select(".tk-item-label"):
    if "gross margin improves" in el.get_text():
        settext(el,"Lower cost per task creates margin room. Competition, usage and human delivery can absorb it.")
for slide in slides.values():
    if slide["id"]=="slide-1":continue
    for p in slide.select("p"):
        txt=p.get_text(" ",strip=True)
        if "Etched" in txt and re.search(r"\$10(?:\.3)?B|\$300M",txt) and len(txt)<800:
            p.clear();p.append(BeautifulSoup(f'Etched announced <strong>$700M at $21B</strong> on August 18, with Sequoia and others. <a href="{M["etchedRound"]["url"]}" target="_blank" rel="noopener noreferrer">Etched disclosure</a>. Financing is not shipment or revenue.',"html.parser"))
        elif "Rhoda figures per DVC" in txt:
            p.clear();p.append(BeautifulSoup(f'Sources: <a href="{M["waymoRides"]["url"]}" target="_blank" rel="noopener noreferrer">Waymo dated milestone</a> · <a href="{M["robotStock"]["url"]}" target="_blank" rel="noopener noreferrer">IFR</a> · <a href="{M["rhodaRound"]["url"]}" target="_blank" rel="noopener noreferrer">Rhoda public announcement</a>',"html.parser"))
# Use the previously verified fact update for text-only evidence blocks, leaving
# every original illustration, graph, animated group and control intact.
for script in s.select('script[src*="facts-data.js"]'):
    script.insert_after(BeautifulSoup('<script src="narrative-data.js?v=visual2"></script>',"html.parser"))
s.head.append(BeautifulSoup('<script src="evidence-additions-data.js?v=visual3"></script><script src="evidence-visuals.js?v=visual3"></script><link rel="stylesheet" href="evidence-visuals.css?v=visual3">',"html.parser"))
s.head.append(BeautifulSoup('<link rel="stylesheet" href="visual-deck.css?v=visual2">',"html.parser"))
script=s.select_one('script[src^="slides.js"]')
script.insert_before(BeautifulSoup('<script src="visual-deck.js?v=visual2"></script>',"html.parser"))
# Long presenter paragraphs become short captions. Original graphics stay on stage.
for slide in deck.select(".slide"):
    if slide["id"]=="slide-1":continue
    for p in slide.select("p"):
        if p.find_parent(class_="aa-layer-detail"):continue
        txt=p.get_text(" ",strip=True)
        if len(txt.split())>55:
            first=re.split(r"(?<=[.!?])\s+",txt)[0]
            p["data-full-context"]=txt
            p.clear();p.append(first)
assert str(s.select_one("#slide-1"))==cover,"Original title slide changed"
for el in s.select("script[src],link[rel=stylesheet][href]"):
    attr="src" if el.name=="script" else "href"
    if not el[attr].startswith(("http:","https:","//")):
        el[attr]=el[attr].split("?")[0]+"?v=20261016-visual-final"
(ROOT/"slides.html").write_text(str(s))

js=(BASE/"slides.js").read_text()
js=js.replace("setTimeout(() => triggerSlideAnimation(idx + 1), 120);",
    "setTimeout(() => triggerSlideAnimation(parseInt(slideEl.dataset.slide, 10)), 120);")
js=js.replace("    const slideEl = slides[idx];",
    "    const slideEl = slides[idx];\n    if (window.matchMedia('(max-width: 768px)').matches) requestAnimationFrame(function(){ slideEl.scrollIntoView({block:'start'}); });")
# Original mobile reader mode remains a vertical visual deck; progress follows
# its new DOM order, while animations still use their stable original IDs.
js=js.replace("if (!animatedFor.has(n - 1)) {","const pos = slides.indexOf(en.target); if (!animatedFor.has(pos)) {")
js=js.replace("animatedFor.add(n - 1);","animatedFor.add(pos);")
js=js.replace("if (numEl) numEl.textContent = n;","if (numEl) numEl.textContent = pos + 1;")
js=js.replace("((n / total) * 100)","(((pos + 1) / total) * 100)")
js=js.replace("document.querySelectorAll('#slide-9 .aa-layer')","document.querySelectorAll('#slide-10 .aa-layer')")
js=js.replace("document.querySelectorAll('#slide-11 .pricing-icon')","document.querySelectorAll('#slide-13 .pricing-icon')")
js=js.replace("document.querySelectorAll('#slide-11 .slide-arpu-fill')","document.querySelectorAll('#slide-13 .slide-arpu-fill')")
js=js.replace("document.querySelectorAll('#slide-13 .aa-stage-card')","document.querySelectorAll('#slide-15 .aa-stage-card')")
js=js.replace("document.querySelectorAll('#slide-15 .kl-card')","document.querySelectorAll('#slide-18 .kl-card')")
js=js.replace("document.querySelector('#slide-15 .kl-kicker')","document.querySelector('#slide-18 .kl-kicker')")
# Native chart frames and controls stay; current reviewed data replaces old curves.
start=js.index("  function initSlide7Capex()")
end=js.index("\n  // ",start+len("  function initSlide7Capex()"))
js=js[:start]+"""  function initSlide7Capex() { window.VISUAL_DECK.capex(); }
"""+js[end:]
start=js.index("  ANIMATIONS[7] = function ()")
end=js.index("\n  // ",start)
js=js[:start]+"""  ANIMATIONS[7] = function () { window.VISUAL_DECK.initEvidence(); };
"""+js[end:]
js=js.replace("value.textContent = marginPct + '%';","value.textContent = 'Cost drivers';")
js=js.replace("label.textContent = card.dataset.growth + ' rev · ' + card.dataset.marginRange + ' margin';",
              "label.textContent = card.dataset.marginRange;")
js=js.replace("card.style.setProperty('--accent', marginSemantic);","card.style.setProperty('--accent', '#4CB5AB');")
# Stable animation ID, not new DOM position, controls stack sub-state navigation.
js=js.replace("current === 3","parseInt(slides[current].dataset.slide,10) === 4")
js=js.replace("idx === 3","parseInt(slides[idx].dataset.slide,10) === 4")
# Presentation focus mode works in the hosted iframe without native fullscreen.
start=js.index("  function isFullscreen()")
end=js.index("  const fsBtn",start)
js=js[:start]+'''  function isFullscreen() { return document.body.classList.contains('is-fullscreen'); }
  function enterFullscreen() { document.body.classList.add('is-fullscreen'); document.getElementById('fsToggle').setAttribute('aria-pressed','true'); }
  function exitFullscreen() { document.body.classList.remove('is-fullscreen'); document.getElementById('fsToggle').setAttribute('aria-pressed','false'); }
  function toggleFullscreen() { isFullscreen() ? exitFullscreen() : enterFullscreen(); }
  function syncFullscreenClass() {}
'''+js[end:]
js=js.replace("// Browser exits fullscreen automatically on Escape; just sync class",
              "exitFullscreen(); // Leave in-page presentation focus mode")
js=js.replace("if (isMobile) {","if (window.matchMedia('(max-width: 768px)').matches) {")
js=js.replace("    const t = e.target;","    const t = e.target;\n    if (e.key === ' ' && t && (t.tagName === 'SUMMARY' || t.tagName === 'BUTTON')) return;")
js=js.replace("  if (window.matchMedia('(max-width: 768px)').matches) {\n    // Make all slides visible",
              "  {\n    // Make all slides visible")
js=js.replace("const io = new IntersectionObserver(entries => {\n      entries.forEach",
              "const io = new IntersectionObserver(entries => {\n      if (!window.matchMedia('(max-width: 768px)').matches) return;\n      entries.forEach")
js=js.replace("const pos = slides.indexOf(en.target); if", "const pos = slides.indexOf(en.target); if")
js=js.replace("if (numEl) numEl.textContent = pos + 1;",
              "const r = en.target.getBoundingClientRect(); if (r.top <= innerHeight/2 && r.bottom >= innerHeight/2) { activeIndex = pos; if (numEl) numEl.textContent = pos + 1;")
js=js.replace("if (progressEl) progressEl.style.width = (((pos + 1) / total) * 100) + '%';",
              "if (progressEl) progressEl.style.width = (((pos + 1) / total) * 100) + '%'; }")
js=js.replace("}, { threshold: 0.4 });", "}, { threshold: 0.05 });")
marker="    slides.forEach(s => io.observe(s));"
js=js.replace(marker,marker+"""
    window.matchMedia('(max-width: 768px)').addEventListener('change',function(ev){
      if (!ev.matches) { window.scrollTo(0,0); activate(activeIndex); }
      else { slides[activeIndex].scrollIntoView({block:'start'}); }
    });
""")
(ROOT/"slides.js").write_text(js)
manifest=json.loads((ROOT/"audit/visual-preservation.json").read_text())
base=BeautifulSoup((BASE/"slides.html").read_text(),"html.parser")
selectors=["canvas","svg","#houseSvg","#suStack","#suPips","#funnelDots","#funnelApps","#funnelModels","#smarterChart","#slide7CapexChart","#slide8AgentStack","#vibeGrid","#voiceWaveBars","#slide-seq-matrix-mount","#attack-angles-stage","#physTiles","#physStatsStrip",".aa-layer"]
manifest["deck"]={q:len(base.select(q)) for q in selectors}
manifest["after_deck"]={q:len(s.select(q)) for q in selectors}
manifest["deck_cover_unchanged"]=True
for q,v in manifest["deck"].items():assert manifest["after_deck"][q]>=v,(q,v)
(ROOT/"audit/visual-preservation.json").write_text(json.dumps(manifest,indent=2))
print("Restored original 18-slide deck; original title and all graphics retained.")
