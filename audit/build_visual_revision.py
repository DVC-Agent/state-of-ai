"""Edit the preserved visual report in place. Never substitute prose for a widget.
The original cover markup, canvases, diagrams and interaction IDs are invariants.
"""
from pathlib import Path
from copy import deepcopy
import subprocess,json,re,html
from bs4 import BeautifulSoup,Comment,Doctype

ROOT=Path(__file__).resolve().parent.parent
BASE=ROOT/"versions/pre-seven-chapters"
INPUTS=ROOT/"audit/inputs"
METRICS=json.loads(subprocess.check_output(["node","-e",
    "require('./facts-data.js');require('./narrative-data.js');require('./evidence-additions-data.js');console.log(JSON.stringify(NARRATIVE_DATA.metrics))"],cwd=ROOT))
def parse(text): return BeautifulSoup(text,"html.parser")
def fragment(text): return parse(text)
def set_text(el,text):
    if el:
        el.clear();el.append(text)
def cite(key):
    m=METRICS[key]
    return f'<a href="{html.escape(m["url"],quote=True)}" target="_blank" rel="noopener noreferrer">{html.escape(m["source"])}</a>'
def replace_inner(el,text):
    if el:
        el.clear();el.append(fragment(text))
def metric_html(key,cls=""):
    m=METRICS[key]
    return f'<span class="{cls}" data-visual-metric="{key}" title="{html.escape(m["period"]+". "+m["qualifier"],quote=True)}">{html.escape(m["display"])}</span>'

s=parse((BASE/"index.html").read_text())
evidence=parse((INPUTS/"audited-evidence.html").read_text())
cover_original=str(s.select_one("#sec-0"))
original_ids={x["id"] for x in s.select("[id]")}
widget_selectors=[
    "canvas",".mf-layer",".model-card",".ar-agent-card",".aa-layer",".pai-av-card",
    ".pai-treemap-cell",".inc-col-header",".eco-filter-btn",".rabbit-hole-toggle",
    ".mf-dep-btn",".mf-toggle-btn",".capex-tog","#hc-sankey-svg","#hc-loop-svg",
    "#robotics-river","#industrial-river",".outlook-card",".geo-map",".biz-pricing-landscape"
]
manifest={"report":{q:len(s.select(q)) for q in widget_selectors}}

# Retire accumulated editorial updates, not visual modules. Current sourced updates
# use the original plaque design and remain short; earlier release notes disappear.
for sec in list(s.select("section.section")):
    if sec["id"] in ["sec-0","sec-15"]: continue
    old=sec.select(".aug-block")
    for node in old: node.decompose()
    checked=evidence.select_one("#"+sec["id"])
    latest=checked.select(".aug-block") if checked else []
    if latest:
        chosen=deepcopy(latest[0])
        # Keep its data cards. Explanation goes underneath, not ahead of the graphic.
        for p in chosen.select(".aug-block-lede"):
            text=p.get_text(" ",strip=True)
            if len(text.split())>35:
                sentences=re.split(r"(?<=[.!?])\s+",text)
                set_text(p,sentences[0])
        target=sec.select_one(".section-headline") or sec.select_one(".container")
        if target.name.startswith("h"):target.insert_after(chosen)
        else:target.insert(0,chosen)
    for bridge in sec.select(".section-bridge"):bridge.decompose()

# Carry forward audited text inside structurally identical original components.
# This changes evidence, not layout, illustration, or interaction identities.
for selector in [".model-card",".pai-av-card",".pai-treemap-cell",".inc-cell",
                 ".mf-pill",".explosion-pill"]:
    old=s.select(selector); checked=evidence.select(selector)
    def identity(el):
        name=el.select_one(".model-name,.pai-av-name,.pai-treemap-name,.mf-pill-name,.explosion-pill-name")
        return name.get_text(" ",strip=True).lower() if name else el.get("data-company") or el.get("data-id")
    by_key={identity(el):el for el in checked if identity(el)}
    for node in old:
        audited=by_key.get(identity(node))
        if not audited:continue
        for attr in ["data-tip","data-tooltip","title"]:
            if audited.has_attr(attr):node[attr]=audited[attr]
        a=node.find_all(string=True);b=audited.find_all(string=True)
        if len(a)==len(b):
            for x,y in zip(a,b):
                if x.parent.name not in ["script","style"] and str(x).strip():
                    x.replace_with(str(y))

# The report stays graphic-first: explanatory prose is shortened, never cards,
# tables, charts, labels, control surfaces or the content of existing rabbit holes.
folded=0
for p in list(s.select("section.section p")):
    if p.find_parent(id="sec-0") or p.find_parent(id="sec-15"): continue
    if p.find_parent(["details"]) or p.find_parent(class_="rabbit-hole"): continue
    if any(p.find_parent(class_=c) for c in ["model-card","ar-agent-card","pai-av-card","aa-layer-detail","hc-block","mr","eco-card"]):continue
    text=p.get_text(" ",strip=True)
    if len(text.split())>55 and not p.select("canvas,svg,button,input"):
        sentences=re.split(r"(?<=[.!?])\s+",text)
        if len(sentences)<2:continue
        original=deepcopy(p)
        detail=s.new_tag("details",attrs={"class":"copy-detail"})
        summary=s.new_tag("summary");summary.string="Context and qualifications"
        detail.append(summary);detail.append(original)
        set_text(p,sentences[0])
        p.insert_after(detail);folded+=1

# Repeated headlines get corrected within their original visual containers.
set_text(s.select_one("#sec-1 .money-flow-subtitle"),"Five connected layers. Click through the companies, delivery costs and constraints.")
set_text(s.select_one("#sec-2 .section-headline"),"Revenue and adoption")
set_text(s.select_one("#sec-7 .section-headline"),"The infrastructure buildout")
set_text(s.select_one("#sec-12 .section-headline"),"Investing and valuations")
set_text(s.select_one("#sec-9 .section-headline"),"Business Models")
set_text(s.select_one("#sec-14 .outlook-intro"),"Investment hypotheses, not inevitable forecasts. Explore the evidence and test what must become true.")

company_keys={
    "OpenAI":"openaiRevenue","Anthropic":"anthropicRevenue","Claude":"anthropicRevenue",
    "Higgsfield":"higgsfieldRevenue","Lovable":"lovableRevenue","ElevenLabs":"voiceEnterprise",
    "Harvey":"harveyRound","Etched":"etchedRound","Rhoda":"rhodaRound","NVIDIA":"nvidiaQuarter",
}
for pill in s.select(".mf-pill,.explosion-pill"):
    name_el=pill.select_one(".mf-pill-name,.explosion-pill-name")
    if not name_el:continue
    name=name_el.get_text(" ",strip=True)
    key=company_keys.get(name)
    if key:
        val=pill.select_one(".mf-pill-val,.explosion-pill-val")
        if val:
            set_text(val,METRICS[key]["display"]);val["data-visual-metric"]=key
        m=METRICS[key];pill["data-tooltip"]=m["display"]+" · "+m["period"]+". "+m["qualifier"]
    elif pill.get("data-tooltip"):
        # Names and diagrams remain. Do not imply that an undated private metric
        # is a current financial disclosure.
        tip=pill["data-tooltip"]
        if re.search(r"~?\d+%?\s*GM|DVC estimate",tip):
            pill["data-tooltip"]=re.sub(r"(?:·|—)?[^·—]*?(?:GM|DVC estimate)[^·—]*","",tip).strip()
        # Do not restore an old private-company scoreboard as current data.
        val=pill.select_one(".mf-pill-val,.explosion-pill-val")
        if val and re.search(r"\d",val.get_text()):
            set_text(val,"Company example")
            pill["data-tooltip"]=name+": illustrative participant in the stack. No current financial metric is asserted here."

# The original stack controls are retained as three evidence lenses, rather
# than quietly replaying unsourced historical estimates as current observations.
lens_names=["Scale","Economics","Constraints"]
lens_values={
    "5":["higgsfieldRevenue","Delivery cost","Distribution"],
    "4":["anthropicRevenue","Serving + R&D","Capability / access"],
    "3":["capexTotal","Utilization + leases","Usable capacity"],
    "2":["nvidiaQuarter","Architecture + supply","Memory / software"],
    "1":["energy2025","Generation + grid","Connection / permits"],
}
for i,b in enumerate(s.select("#mfYearToggle .mf-toggle-btn")):
    set_text(b,lens_names[i]);b["data-lens"]=str(i)
    if i==0:b["class"]=["mf-toggle-btn","active"]
for layer in s.select(".mf-layer"):
    n=layer.get("data-layer");v=lens_values[n]
    rev=layer.select_one(".mf-layer-rev");rev.attrs.pop("data-years",None)
    rev["data-lenses"]=json.dumps([METRICS[v[0]]["display"],v[1],v[2]])
    set_text(rev,METRICS[v[0]]["display"])
    rev["title"]=METRICS[v[0]]["period"]+". "+METRICS[v[0]]["qualifier"]
    gm=layer.select_one(".mf-layer-gm")
    if gm:set_text(gm,["","Delivery","Serving","Asset use","Supply","Grid access"][6-int(n)] if False else "Inspect economics")
    tax=layer.select_one(".mf-ai-tax")
    if tax:set_text(tax,"Cost depends on workload")
for el in s.select("#sec-1 [data-years]"):
    # Deep historical estimates are retained as an explicitly illustrative
    # scenario, not auto-switched current market facts.
    el.attrs.pop("data-years",None)
for i,segment in enumerate(s.select(".mf-margin-segment span")):
    set_text(segment,["Delivery","Serving","Asset use","Supply","Grid"][i])
for segment in s.select(".mf-margin-segment small"):segment.decompose()
set_text(s.select_one(".mf-margin-label"),"Cost drivers")
drivers={
 "Traditional SaaS":("Low marginal delivery","A comparison, not an AI margin target"),
 "Perplexity":("Search + retrieval","Inference and content costs"),
 "OpenAI":("Serving + distribution","Partner gross/net treatment matters"),
 "Cursor":("Inference-heavy","Thin economics can explain a lower multiple"),
 "Higgsfield":("Video generation","Compute per delivered output"),
 "Lovable":("Iterative generation","Retries and completion rates"),
 "GitHub Copilot":("Bundle economics","Usage limits and heavy-user mix")
}
for row in s.select(".mf-margin-row"):
    cols=row.find_all("span",recursive=False)
    if len(cols)<3:continue
    name=cols[0].get_text(strip=True)
    driver,qual=drivers.get(name,("Company-specific","Inspect period, cost scope and accounting"))
    set_text(cols[1],driver);set_text(cols[2],qual)
for el in s.select(".mf-flow-label"):
    old=el.get_text(" ",strip=True)
    set_text(el,"Inference → serving infrastructure" if "inference" in old else
             "Serving → cloud capacity" if "cloud" in old else
             "Capacity → silicon and systems" if "GPU" in old else
             "485 TWh in 2025 → 950 TWh projected in 2030")
set_text(s.select_one(".mf-layer-capex"),"2026 guidance")
set_text(s.select_one(".mf-capex-ratio"),"Different scopes, not a revenue multiple")
for donut in s.select(".mf-donut-item"):
    # Original proportional diagram is retained as an explicitly assumed mix.
    for value in donut.select(".tabnum"):
        set_text(value,"Scenario")
donut=s.select_one(".mf-donut-item")
if donut:
    title=donut.find_previous(["h3","h4"]);set_text(title,"Illustrative capacity cost mix")

# Preserve the animated dollar journey with transparent adjustable assumptions.
set_text(s.select_one("#mfJourneyBtn"),"$1 Journey")
replace_inner(s.select_one(".mf-journey-title"),'Where can <span class="accent-gold">$1</span> go?')
journey=s.select_one(".mf-journey-inner")
assumptions=s.new_tag("div",attrs={"class":"journey-assumptions"})
assumptions.append(fragment('''<p>Illustrative application unit economics, not a measured industry margin.</p>
<label>Inference <input id="journeyInference" type="range" min="0" max="80" value="40"><output id="journeyInferenceOut">40¢</output></label>
<label>Human review and delivery <input id="journeyHuman" type="range" min="0" max="50" value="20"><output id="journeyHumanOut">20¢</output></label>
<label>Tools and support <input id="journeyTools" type="range" min="0" max="30" value="10"><output id="journeyToolsOut">10¢</output></label>'''))
journey.select_one(".mf-journey-title").insert_after(assumptions)
step_labels=["Inference","Human review and delivery","Tools and support","Gross contribution before overhead","Customer revenue"]
for i,step in enumerate(s.select(".mf-journey-step")):
    amount=step.select_one(".mf-journey-amount");amount["id"]="journeyAmount"+str(i)
    set_text(amount,["40¢","20¢","10¢","30¢","$1.00"][i])
    spans=step.find_all("span",recursive=False)
    if len(spans)>1:set_text(spans[-1],step_labels[i])
for i,arrow in enumerate(s.select(".mf-journey-arrow")):set_text(arrow,"=" if i==3 else "+")

# This original calculator remains a calculator, with the assumptions visible.
for block in s.select(".mf-depreciation,.mf-depreciation-box,.mf-dep-model"):
    note=s.new_tag("p",attrs={"class":"visual-method"})
    note.string="Scenario: $300K asset, $150K annual revenue, $45K other annual costs, zero residual value. Useful life changes accounting expense, not cash already spent."
    block.insert(0,note)
for row in s.select(".mf-dep-row"):
    cells=row.find_all("span",recursive=False)
    if len(cells)>1:set_text(cells[-1],"Expense timing, not cash savings")

# Source the chart frames rather than removing them. The chart and its hover/
# legend behavior remain the original components; inputs are reviewed series.
reason=s.select_one("#reasoningChart")
if reason:
    wrap=reason.find_parent(class_="chart-container")
    set_text(wrap.select_one("h3,h4"),"Training did not disappear. It changed shape.")
    replace_inner(wrap.select_one(".stat-source"),"Anthropic + OpenAI combined. September 13 analyst model; both Q3 and Q4 2026 are estimates. "+cite("computeMix"))
energy=s.select_one("#energyChart")
if energy:
    wrap=energy.find_parent(class_="chart-container")
    set_text(wrap.select_one("h3,h4"),"Data-center electricity: observed baseline and outlook")
    replace_inner(wrap.select_one(".stat-source"),"Global data centers, not AI-only. The 2030 point is a projection. "+cite("energy2025"))
for el in s.select("#sec-7 .capex-total-label"):set_text(el,"Calendar 2026 issuer guidance · different accounting scopes")
set_text(s.select_one("#capexTotalNum"),METRICS["capexTotal"]["display"])
for b in s.select("#capexToggles [data-company]"):
    k={"amazon":"capexAmazon","alphabet":"capexAlphabet","microsoft":"capexMicrosoft","meta":"capexMeta"}.get(b["data-company"])
    if k:set_text(b.select_one(".tog-val"),METRICS[k]["display"])
    elif b["data-company"]=="oracle":
        b["title"]="Oracle uses a different fiscal year; not included in the selected calendar-year aggregate."
        set_text(b.select_one(".tog-val"),"FY scope")
for counter in s.select("#sec-7 .nvidia-spotlight .stat-number"):
    counter.attrs.pop("data-target",None)

# Replace the old aggregate and speed scoreboard inside the same graphic frames.
speed=s.select_one(".explosion-speed")
if speed:
    labels=speed.select(".speed-label,.explosion-speed-label")
    values=speed.select(".speed-value,.speed-time,.explosion-speed-val")
    if not labels:labels=speed.find_all("span",class_=re.compile("label|name"))
    for el,t in zip(labels,["Anthropic Q1","Anthropic Q2","Anthropic Q3","Reported quarters"]):set_text(el,t)
    for el,t in zip(values,["$4.7B","$11.6B","$16.8B","2026"]):set_text(el,t)
    header=speed.select_one("h3,h4,.explosion-speed-title")
    if header:set_text(header,"Anthropic: reported quarterly revenue")
    speed["data-current-source"]=METRICS["anthropicRevenue"]["url"]

# Specific verified model families retain the original logos/cards/tooltips.
model_keys={"OpenAI":"pricePremium","Anthropic":"priceClaude","Google":"priceGemini",
            "Meta":"metaModels","DeepSeek":"deepseek","Kimi":"kimi","Moonshot":"kimi","Z.ai":"glm","GLM":"glm"}
for card in s.select(".model-card"):
    txt=card.get_text(" ",strip=True)
    key=next((v for k,v in model_keys.items() if k.lower() in txt.lower()),None)
    if key:
        m=METRICS[key]
        card["data-tip"]="<strong>"+html.escape(m["label"])+"</strong><br>"+html.escape(m["display"]+" · "+m["period"]+". "+m["qualifier"])+"<br>"+cite(key)
        val=card.select_one(".model-price,.model-param,.model-size,.model-meta")
        if val:set_text(val,m["display"])
        stat=card.select_one(".model-stat")
        if key in ["deepseek","kimi","glm","metaModels","priceGemini"]:set_text(stat,m["display"])
        if key=="pricePremium" and "Sol" in txt:
            set_text(card.select_one(".model-name"),"GPT-6.1 Sol / Luna")
            set_text(stat,"$2/$10 · $0.10/$0.50")
            card["data-tip"]="GPT-6.1 Sol: $2/$10. GPT-6 Luna: $0.10/$0.50. Standard input/output USD per 1M tokens. "+cite("priceWorkhorse")
        elif key=="priceClaude":
            if "Fable" in txt:
                set_text(stat,"$10 / $50")
            else:set_text(stat,"$4/$20 · $2/$10 · $0.10/$0.50")
        elif key=="metaModels" and "Open" in (card.select_one(".model-name").get_text() if card.select_one(".model-name") else ""):
            set_text(card.select_one(".model-name"),"Release-specific weights")
            set_text(stat,"Verify artifact and license")
            card["data-tip"]="A model-family or API announcement does not establish a downloadable weight artifact or its license. "+cite("metaModels")
    else:
        stat=card.select_one(".model-stat")
        if stat and re.search(r"\d",stat.get_text()):
            set_text(stat,"Release-specific")
            card["data-tip"]="Illustrative model-market participant. Do not infer a current benchmark, API price or weight license from an earlier release."
for p in s.select("#sec-3 p"):
    if "does not yet survive uncontaminated" in p.get_text():
        set_text(p,"Public benchmark proximity is not proof of parity on held-out tasks.")
    if "A 100× spread" in p.get_text():
        set_text(p,"Route routine steps to cheaper models. Reserve premium execution for steps where it improves cost per successful task.")
model_intro=s.select_one("#sec-3 .section-intro")
if model_intro:
    following=model_intro.find_next_sibling()
    if following and "copy-detail" in following.get("class",[]):following.decompose()
    story=fragment('''<div class="model-brush-story" aria-label="Model economics: price, control and distribution">
      <div class="brush-thesis"><span>Commodity pricing</span><strong>One market. Different jobs.</strong><span>Premium execution</span></div>
      <div class="brush-price-field">
        <svg viewBox="0 0 1000 200" aria-hidden="true"><path d="M100 100H900" stroke="currentColor" stroke-width="2"/><circle cx="100" cy="100" r="72" fill="currentColor" opacity=".10"/><circle cx="550" cy="100" r="36" fill="currentColor" opacity=".10"/><circle cx="900" cy="100" r="72" fill="currentColor" opacity=".10"/></svg>
        <button type="button" class="brush-price brush-price--small" data-brush-fact="priceSmall"><small>Small</small><strong>$0.10 / $0.50</strong><span>Luna · Haiku</span></button>
        <button type="button" class="brush-price brush-price--workhorse" data-brush-fact="priceWorkhorse"><small>Workhorse</small><strong>$2 / $10</strong><span>Sol · Sonnet</span></button>
        <button type="button" class="brush-price brush-price--premium" data-brush-fact="pricePremium"><small>Premium</small><strong>$10 / $50</strong><span>Astra · Fable</span></button>
      </div>
      <div class="brush-foot">USD per 1M input / output tokens. Price is not performance.</div>
      <div class="brush-levers">
        <button type="button" data-brush-story="control"><span>Control</span><strong>Rent an API ↔ own the weights</strong><small>DeepSeek · Kimi · GLM</small></button>
        <button type="button" data-brush-story="task"><span>Economics</span><strong>Tokens → attempts → finished work</strong><small>Measure cost per success</small></button>
        <button type="button" data-brush-story="distribution"><span>Advantage</span><strong>Model → runtime → distribution</strong><small>The leaderboard is not the product</small></button>
      </div>
      <div class="brush-detail" id="brushDetail" aria-live="polite"><span>Click a price or a lever for the numbers, limits and evidence.</span></div>
    </div>''')
    model_intro.replace_with(story)
    bench=s.new_tag("div",attrs={"id":"model-task-picture"})
    s.select_one(".model-brush-story").insert_after(bench)
for dl in s.select(".aa-chip-dl"):dl.decompose()
for chip in s.select(".aa-tool-chip[data-tip]"):
    if re.search(r"\d|[$€£]",chip.get("data-tip","")):
        name=chip.get_text(" ",strip=True).replace("DVC","").strip()
        chip["data-tip"]=name+": original agent-stack example. Current operating metrics are not inferred from old downloads or financing."

# Keep healthcare graphics open by default and reuse current, synchronized data.
for key in ["healthRoi","healthSpending","robotStock","robotInstalls"]:
    pass
for el in s.select(".hc-hero p"):
    if "about $410B" in el.get_text():
        set_text(el,"A historical 2025 industrial spending model. Click the flows to explore buyers, cost pools and the AI opportunity.")

# Replace obsolete comparisons inside their existing visual frames.
speed=s.select_one(".explosion-speed")
if speed:
    rows=speed.find_all("div",recursive=False)[0].find_all("div",recursive=False)
    for row,label,num in zip(rows,["Q1 2026","Q2 2026","Q3 2026","Q1–Q3 total"],[4.7,11.6,16.8,33.1]):
        set_text(row.find("span",recursive=False),label)
        value=row.select_one(".tabnum")
        set_text(value,f"${num:g}B")
        value.parent["style"]=re.sub(r"width:\s*[\d.]+%",f"width:{num/33.1*100:.1f}%",value.parent.get("style",""))
    set_text(speed.select_one("p"),"Reported revenue, not ARR. Q1–Q3 total is the sum of the three reported quarters.")
    replace_inner(speed.select_one(".stat-source"),cite("anthropicRevenue"))
for card in s.select(".fcf-card"):
    name=card.select_one(".fcf-company").get_text(strip=True)
    key={"Amazon":"capexAmazon","Alphabet":"capexAlphabet","Microsoft":"capexMicrosoft","Meta":"capexMeta"}[name]
    mid={"Amazon":220,"Alphabet":200,"Microsoft":175,"Meta":137.5}[name]
    ring=card.select_one("canvas");ring["data-pct"]=str(round(mid/732.5*100));ring["data-prefix"]=""
    set_text(card.select_one(".fcf-from"),METRICS[key]["display"])
    set_text(card.select_one(".fcf-arrow"),"of")
    set_text(card.select_one(".fcf-to"),"$732.5B")
    set_text(card.select_one(".fcf-delta"),"Selected-four guidance share")
fcf=s.select_one(".fcf-cards")
if fcf:
    heading=fcf.find_previous(["h3","h4"])
    set_text(heading,"Who is funding the buildout?")
    note=s.new_tag("p",attrs={"class":"visual-method"})
    note.append(fragment("Calendar 2026 guidance midpoints, not free cash flow. Ring shares are rounded. "+cite("capexTotal")))
    fcf.insert_after(note)
    # Retire the old FCF explanatory caption in the same frame.
    for p in fcf.parent.select("p"):
        if p is not note and ("cash flow" in p.get_text().lower() or "FCF" in p.get_text()):
            set_text(p,"Capital commitments and cash generation must be underwritten separately.")

table=s.select_one("#sec-12 .valuation-table")
if table:
    heads=table.select("th")
    for h,t in zip(heads,["Company","Public transaction","Revenue observation","Comparability"]):set_text(h,t)
    body=table.select_one("tbody");body.clear()
    for company,key,rev,why in [
        ("Etched","etchedRound","Not disclosed here","Financing ≠ operating performance"),
        ("Higgsfield","higgsfieldRound",">$1B annualized pace · Sep 2026","Four weeks × 13; not booked annual revenue"),
        ("Harvey","harveyRound","No current ARR in announcement","Software, not a law firm"),
        ("Rhoda","rhodaRound","Not disclosed here","No valuation in company release"),
        ("ElevenLabs","elevenTender","55% enterprise revenue mix · Sep 2026","Secondary liquidity, not primary funding")]:
        m=METRICS[key]
        body.append(fragment(f'<tr><td>{company}</td><td>{metric_html(key)}<br><small>{html.escape(m["period"])}</small></td><td>{html.escape(rev)}</td><td>{html.escape(why)} {cite(key)}</td></tr>'))
    set_text(table.select_one(".stat-source"),"Dated transaction marks. No multiple is computed from mismatched periods, accounting scopes or undisclosed revenue.")
aum=s.select_one("#aumBars")
if aum:
    box=aum.parent
    set_text(box.select_one("h4"),"Selected financing checks · different transaction types")
    set_text(box.select_one("p"),"Amounts raised or tendered, not valuations, AUM, or operating revenue.")
    replace_inner(box.select_one(".stat-source")," · ".join(cite(k) for k in ["etchedRound","harveyRound","rhodaRound","higgsfieldRound","elevenTender"]))

# Long updates remain available without competing with the original diagrams.
for block in list(s.select(".aug-block")):
    if block.find_parent(id="sec-0") or block.find_parent(id="sec-15"):continue
    details=s.new_tag("details",attrs={"class":"evidence-update"})
    summary=s.new_tag("summary");summary.string="Latest evidence · October 16, 2026"
    details.append(summary)
    block.replace_with(details);details.append(block)
# A single concise caption introduces each visual scene.
captions={
 "sec-1":"Follow five layers, then inspect their companies and economics.",
 "sec-2":"Reported revenue, annualized pace and adoption measure different things.",
 "sec-4":"Agents turn intelligence into work. The constraint becomes reliable execution.",
 "sec-5":"A new software stack, from user interface to governed action.",
 "sec-6":"Code and voice show how the stack reaches the customer.",
 "sec-7":"Capital buys capacity. Power, supply and utilization determine what becomes usable.",
 "sec-8":"Measure productive deployment, not robot shape or fundraising.",
 "sec-9":"Who pays, what they buy, and what it costs to deliver.",
 "sec-10":"The model is one part of the system.",
 "sec-11":"Compute, energy and market access cross political borders.",
 "sec-12":"Customer value is not the same as investor return.",
 "sec-14":"Investment hypotheses, not inevitable forecasts."
}
for id,caption in captions.items():
    p=s.select_one("#"+id+" .section-intro")
    if p:set_text(p,caption)
# Old revision plaques are editorial history, not original visual modules.
for stamp in list(s.select("#sec-14 span")):
    if re.match(r"(REVISED|AUDITED|UPDATED)\s+(AUGUST|JULY|MAY)",stamp.get_text(strip=True)):
        parent=stamp.parent
        if parent.name=="div" and not parent.select("canvas,svg,button,input"):
            parent.decompose()
for p in list(s.select("#sec-7 p")):
    if "Latest reset" in p.get_text():
        set_text(p,"Selected issuers use different lease and reporting scopes. The comparison is calendar-year guidance, not AI revenue.")
        detail=p.find_next_sibling("details")
        if detail and "copy-detail" in detail.get("class",[]):detail.decompose()

# Restore the original service matrices rather than replacing them with prose.
services=s.new_tag("section",attrs={"class":"section section--dark visual-scene","id":"sec-services-visual"})
service_container=s.new_tag("div",attrs={"class":"container"})
services.append(service_container)
h=s.new_tag("h2",attrs={"class":"section-headline"});h.string="Three routes into services";service_container.append(h)
for sel in ["#attack-angles-block","#seq-matrix-block"]:
    el=s.select_one(sel)
    if el:service_container.append(el.extract())
for p in service_container.select("p"):
    if len(p.get_text(" ",strip=True).split())>45:
        set_text(p,"Sell the tool, deliver the service, or acquire the provider. Explore each market and company below.")

# Arrange original scenes into the approved seven-part path. IDs stay stable for
# every original control, tooltip, chart initializer and deck embed.
scenes={sec["id"]:sec.extract() for sec in s.select("section.section") if sec["id"] not in ["sec-0","sec-15"]}
scenes["sec-services"]=services
chapters=[
 ("stack","AI stack",["sec-1","sec-2","sec-3","sec-7","sec-10","sec-11"]),
 ("agents","Agentic revolution and stack",["sec-4","sec-5","sec-6"]),
 ("business","Business Models",["sec-9"]),
 ("services","Services",["sec-services"]),
 ("health","Healthcare",["sec-healthcare-ai"]),
 ("physical","Robotics / Physical",["sec-8","sec-industrial-ai"]),
 ("investing","Investing and valuations",["sec-12","sec-13","sec-14"]),
]
insert=s.select_one("#sec-0")
for n,(slug,title,ids) in enumerate(chapters,1):
    chapter=s.new_tag("article",attrs={"class":"visual-chapter","id":"sec-"+slug,"data-chapter":str(n)})
    label=s.new_tag("div",attrs={"class":"chapter-divider"})
    label.append(fragment(f'<span>{n:02d} / 07</span><h2>{html.escape(title)}</h2>'))
    chapter.append(label)
    for sid in ids:
        if sid in scenes:
            sec=scenes[sid]
            sec["class"]=sec.get("class",[])+["visual-scene"]
            chapter.append(sec)
    insert.insert_after(chapter);insert=chapter
nav=s.select_one(".sidebar-inner");nav.clear()
for n,(slug,title,_) in enumerate(chapters,1):
    dot=s.new_tag("div",attrs={"class":"nav-dot","data-section":slug,"role":"button","tabindex":"0","aria-label":title})
    span=s.new_tag("span");span.string=title;dot.append(span);nav.append(dot)

# One compact control strip, outside the original title slide.
tools=s.new_tag("div",attrs={"class":"visual-tools"})
tools.append(fragment('<button id="visualExpandCopy" type="button">Open supporting notes</button><button id="visualCloseCopy" type="button">Close supporting notes</button><a href="versions/pre-seven-chapters/index.html">Previous version</a>'))
s.select_one("#sec-0").insert_after(tools)
for script in s.select('script[src*="services-matrix-data"],script[src*="facts-data"]'):script.decompose()
s.head.append(fragment('<script src="facts-data.js?v=visual2"></script><script src="narrative-data.js?v=visual2"></script><script src="services-matrix-data.js?v=visual2"></script><script src="evidence-additions-data.js?v=visual3"></script><script src="evidence-visuals.js?v=visual3"></script><link rel="stylesheet" href="visual-edit.css?v=visual2"><link rel="stylesheet" href="evidence-visuals.css?v=visual3">'))
s.body.append(fragment('<script src="visual-edit.js?v=visual2"></script>'))
for script in s.select('script[src*="app.js"]'):
    script.insert_before(fragment('<script src="visual-charts.js?v=visual2"></script>'))
for script in s.select('script[src*="rivers-init.js"]'):
    script.insert_before(fragment('<script src="evidence-sync.js?v=visual2"></script>'))
for script in s.select("script:not([src])"):
    code=script.string
    if code and "var focusEl = document.getElementById(focusId);" in code:
        script.string=code.replace("if (focusEl) {","""if (focusEl) {
            var actualSection = focusEl.closest('.section');
            if (actualSection) {
              if (sec && sec !== actualSection) sec.classList.remove('embed-visible');
              actualSection.classList.add('embed-visible');
            }""")
# The datasets must precede the synchronizer; robot/industrial values are also
# synchronized in visual-edit.js before their DOMContentLoaded initializers.
for el in s.select("[data-years]"):el.attrs.pop("data-years",None)

# Update recurring, known numeric replicas without touching cover markup.
replacements={"~$735B":"$732.5B","~$750B":"$732.5B","~$733B":"$732.5B","945 TWh":"950 TWh"}
replacements.update({"$11.5B":"$11.6B","~$138B":"$137.5B","$500M ARR on 146 employees":">$600M annualized revenue · September 24 disclosure","~$3.4M ARR per head":"No current employee denominator"})
replacements[", displayed as about $733B"]=""
for text in list(s.find_all(string=True)):
    if isinstance(text,(Comment,Doctype)) or text.parent.name in ["script","style"]:continue
    if text.find_parent(id="sec-0"):continue
    v=str(text)
    for a,b in replacements.items():v=v.replace(a,b)
    text.replace_with(v)

# Retire superseded financing claims wherever the original repeats them.
for p in s.select("p,.sp-panel-body,.sp-card-body"):
    txt=p.get_text(" ",strip=True)
    if len(txt)>900:continue
    if "Etched" in txt and re.search(r"\$10(?:\.3)?B|\$300M",txt):
        replace_inner(p,"Etched announced $700M at $21B on August 18, 2026, with Sequoia and other investors. Financing is not operating revenue. "+cite("etchedRound"))
    if "Rhoda" in txt and re.search(r"\$[12]\.\dB",txt):
        replace_inner(p,"Rhoda announced a $450M Series A on March 10, 2026. The company release does not state a valuation. "+cite("rhodaRound"))

# Native copy folds do not contain any graphic or interactive surface.
assert all(not d.select("canvas,svg,input,button,.model-card,.mf-layer,.ar-agent-card,.pai-av-card") for d in s.select(".copy-detail"))
assert str(s.select_one("#sec-0"))==cover_original,"Title/cover changed"
for el in s.select("script[src],link[rel=stylesheet][href]"):
    attr="src" if el.name=="script" else "href"
    path=el[attr]
    if not path.startswith(("http:","https:","//")):
        el[attr]=path.split("?")[0]+"?v=20261016-visual-final"
manifest["after_report"]={q:len(s.select(q)) for q in widget_selectors}
manifest["copy_folds"]=folded
manifest["cover_unchanged"]=True
for q,n in manifest["report"].items():
    if q in [".capex-tog"]:continue
    assert manifest["after_report"][q]>=n,(q,n,manifest["after_report"][q])
(ROOT/"index.html").write_text(str(s))
(ROOT/"audit/visual-preservation.json").write_text(json.dumps(manifest,indent=2))
print("Restored original report graphics:",manifest["after_report"],"copy folds",folded)
notes_head=deepcopy(s.head)
notes_head.title.string="State of AI | Latest update"
notes=f'''<main class="container update-page"><a href="index.html">← Full report</a>
<p class="visual-method">Latest edition · October 16, 2026</p><h1>Original visuals.<br>A shorter path.</h1>
<div class="update-grid">
<article><h2>Picture first</h2><p>The original report graphics, interactive systems and 18-slide deck remain. Both title sections are unchanged. Supporting explanations open on demand.</p></article>
<article><h2>Two new evidence views</h2><p>Task-specific model comparisons and the shift toward post-training now share the capability/cost slide, alongside API prices. No additional slide is needed.</p></article>
<article><h2>Read the denominator</h2><p>The benchmark suite is vendor-selected. The compute model covers OpenAI and Anthropic combined, and marks both Q3 and Q4 2026 as estimates. Forecasts are not observations.</p></article>
</div><p><a href="{METRICS["geminiBenchmarks"]["url"]}" target="_blank" rel="noopener noreferrer">Google DeepMind model card ↗</a> · <a href="{METRICS["computeMix"]["url"]}" target="_blank" rel="noopener noreferrer">SemiAnalysis source ↗</a></p>
<p><a href="slides.html">Open the slides →</a> · <a href="versions/pre-seven-chapters/index.html">Preserved previous version →</a></p></main>'''
(ROOT/"whats-new.html").write_text(f'<!DOCTYPE html><html lang="en">{notes_head}<body>{notes}</body></html>')

# Restore the original application behavior with narrowly scoped replacements.
js=(BASE/"app.js").read_text()
for name,next_name in [("initReasoningChart","initCapexChart"),("initCapexChart","initFCFRings"),
                       ("initEnergyChart","initMoneyFlow")]:
    start=js.index("  function "+name+"()")
    end=js.index("  function "+next_name+"()",start)
    js=js[:start]+f"  function {name}() {{ window.VISUAL_CHARTS.{name}(); }}\n\n"+js[end:]
js=js.replace("    // Year toggle + scroll-driven year progression",
              "    // Year toggle + scroll-driven year progression")
marker="    const yearToggle = section.querySelector('.mf-year-toggle');"
# Preserve expansion and depreciation; new evidence lenses replace year estimates.
pos=js.index(marker)
pos=js.rfind("\n",0,js.rfind("const",0,pos))
js=js[:pos]+"\n    if (section.querySelector('[data-lenses]')) return;\n"+js[pos:]
js=js.replace("document.querySelectorAll('.section');",
              "document.querySelectorAll('#sec-0, .visual-chapter, #sec-15');")
js=js.replace("    document.addEventListener('keydown', (e) => {\n      if (e.key",
              "    document.addEventListener('keydown', (e) => {\n      if (e.target.closest('input,textarea,select,button,[contenteditable]')) return;\n      if (e.key")
inc=json.loads((INPUTS/"incumbents.json").read_text())
start=js.index("    const companyData = {",js.index("function initIncumbents"))
end=js.index("\n\n    let activeCompany",start)
js=js[:start]+"    const companyData = "+json.dumps(inc)+";"+js[end:]
# Ring values describe a dated comparison, never a fabricated current estimate.
js=js.replace("displayPct = '-' + Math.round(progress * 100) + '%';",
              "displayPct = (canvas.dataset.prefix || '') + Math.round(progress * 100) + '%';")
start=js.index("      const aumData = [")
end=js.index("      const maxAum",start)
rounds=[
 {"name":"Etched · Aug 2026","aum":.7,"color":"#4CB5AB"},
 {"name":"Harvey · Sep 2026","aum":.55,"color":"#4CB5AB"},
 {"name":"Rhoda · Mar 2026","aum":.45,"color":"#4CB5AB"},
 {"name":"Higgsfield · Aug 2026","aum":.4,"color":"#4CB5AB"},
 {"name":"ElevenLabs · Sep tender","aum":.3,"color":"#9AA3B7"}]
js=js[:start]+"      const aumData = "+json.dumps(rounds)+";\n"+js[end:]
js=js.replace("d.aum.toFixed(1) + 'T'","d.aum.toFixed(2) + 'B'")
(ROOT/"app.js").write_text(js)
physical=(BASE/"sec8.js").read_text()
start=physical.index("  function initFSDChart()")
end=physical.index("  function animateEconBars()",start)
physical=physical[:start]+"  function initFSDChart() { window.VISUAL_CHARTS.initPhysicalChart(); }\n\n"+physical[end:]
(ROOT/"sec8.js").write_text(physical)
