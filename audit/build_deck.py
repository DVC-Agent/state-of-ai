"""Build the deck on the same narrative spine and metric records as the report."""
from pathlib import Path
import subprocess,json,re,html
from copy import deepcopy
from bs4 import BeautifulSoup
ROOT=Path(__file__).resolve().parent.parent
baseline=BeautifulSoup((ROOT/"versions/pre-seven-chapters/slides.html").read_text(),"html.parser")
D=json.loads(subprocess.check_output(["node","-e","require('./facts-data.js');require('./narrative-data.js');console.log(JSON.stringify(NARRATIVE_DATA))"],cwd=ROOT))
M=D["metrics"];esc=lambda s:html.escape(str(s),quote=True)
def metric(k):
    m=M[k]
    return f'<button class="deck-metric" data-fact="{k}" type="button"><span>{esc(m["label"])}</span><strong data-metric="{k}">{esc(m["display"])}</strong><small>{esc(m["period"])}</small><em>{esc(m["qualifier"])}</em><span class="deck-source">{esc(m["source"])} ↗</span></button>'
def columns(items):
    return '<div class="deck-columns">'+"".join(f'<article><h3>{h}</h3><p>{p}</p></article>' for h,p in items)+'</div>'
slides=[]
cover=deepcopy(baseline.select_one("#slide-1"))
cover.select_one(".cover-title").string="State of AI"
cover.select_one(".cover-subtitle").string="The operating manual for the AI economy"
cover.select_one(".cover-tagline").string="From the supply chain of intelligence to the economics of work and investment returns."
cover.select_one(".cover-qr-url")["href"]="index.html"
cover.select_one(".cover-qr-url").string="Read and explore the report"
cover.select_one(".dive-deeper")["href"]="index.html"
cover.select_one(".cover-footer").clear()
cover.select_one(".cover-footer").append(BeautifulSoup('<button type="button" id="deckBegin">Begin →</button><span>Or press the right arrow</span>',"html.parser"))
cover.select_one(".cover-content").append(cover.select_one(".cover-footer").extract())
slides.append(str(cover))
opening=deepcopy(baseline.select_one("#slide-2"))
opening.select_one(".dive-deeper")["href"]="index.html#agentic"
opening.select_one(".opener-eyebrow").string="The interface becomes the workflow"
for t in opening.select("script"):t.decompose()
note=baseline.new_tag("p",attrs={"class":"scenario-label"})
note.string="A household scenario. Consequential actions require scoped permissions and approval."
opening.select_one(".slide-inner").append(note)
slides.append(str(opening))
def slide(chapter,title,lede,content,anchor,cls=""):
    n=len(slides)+1
    slides.append(f'''<section class="slide narrative-slide {cls}" data-slide="{n}" id="slide-{n}" data-chapter="{chapter}">
      <div class="slide-inner editorial-slide"><p class="deck-kicker">{chapter}</p><h2>{title}</h2><p class="deck-lede">{lede}</p>{content}
      <a class="dive-deeper" href="index.html#{anchor}">Explore this part of the report ↗</a></div></section>''')
slide("01 / AI stack","Intelligence has a supply chain.","Five layers. Different customers, cost structures and constraints.",
      '<div class="deck-stack">'+''.join(f'<a href="index.html#layer-{k}"><span>0{i}</span><strong>{h}</strong><small>{d}</small></a>' for i,(k,h,d) in enumerate([("energy","Energy","Deliver usable power"),("silicon","Silicon","Turn power into compute"),("cloud","Infrastructure","Sell available capacity"),("models","Models","Sell intelligence"),("applications","Applications","Own the workflow")],1))+'</div><p class="deck-bottom-line">A dollar can pass through several layers. Layer revenues are not an additive end-market total.</p>',"ai-stack")
slide("01 / AI stack","Power must arrive. Silicon must earn its place.","Announcements, usable capacity and recognized revenue are different evidence.",
      '<div class="deck-metric-grid">'+metric("energy2025")+metric("energy2030")+metric("nvidiaQuarter")+'</div>'+columns([("Energy","Grid access, equipment, permits and commissioning decide whether power is usable."),("Silicon","Compare the full system: memory, networking, software, utilization and supported workloads.")]),"silicon-evidence")
slide("01 / AI stack","Read the capex footnotes.","Selected-four calendar-2026 guidance is not a harmonized measure of AI spending.",
      '<div class="deck-head-stat">'+metric("capexTotal")+'</div><div class="deck-four-metrics">'+''.join(metric(k) for k in ["capexAmazon","capexAlphabet","capexMicrosoft","capexMeta"])+'</div>',"capex-evidence","deck-capex")
slide("01 / AI stack","Capability. Cost. Control.","Compare successful work, not only token sticker prices.",
      '<div class="deck-metric-grid">'+''.join(metric(k) for k in ["pricePremium","priceWorkhorse","priceSmall"])+'</div><div class="china-band"><span>Chinese open-weight competition</span><p><strong>DeepSeek V4.1 Flash:</strong> MIT weights. <strong>Kimi K3:</strong> weight-release and licensing checks. <strong>GLM-5.3 / Flash:</strong> verify the exact artifact and rights.</p><small>Prices are USD per 1M input/output tokens. Haiku has a 100K prompt threshold. Google launch pricing is temporary.</small></div>',"model-evidence")
slide("01 / AI stack","Demand is real. Denominators differ.","Quarterly revenue, annualized pace and contracted ARR are not interchangeable.",
      '<div class="deck-metric-grid">'+''.join(metric(k) for k in ["anthropicRevenue","openaiRevenue","higgsfieldRevenue"])+'</div><p class="deck-bottom-line">Do not rank these as like-for-like ARR or add them into an application-market total.</p>',"application-evidence")
slide("02 / Agentic revolution and stack","An agent is a loop with consequences.","Tools, context and verification turn a model response into completed work.",
      '<div class="deck-agent-loop">'+''.join(f'<span>{x}</span>' for x in ["Intent","Plan","Context","Execute","Verify","Recover"])+'</div><div class="deck-control"><strong>Control plane</strong><span>Identity · permissions · isolation · evaluations · audit trail · approval</span></div>'+columns([("Economic stack","Who supplies whom and where the revenue goes."),("Agentic stack","How UI, orchestration, memory, tools, models, observability and security work together.")]),"agent-architecture")
slide("02 / Agentic revolution and stack","More execution. More verification.","Coding and voice expose different versions of the same deployment problem.",
      columns([("Coding","Generate, test, review and deploy. Cursor and Devin are software tools, not outsourced service operators."),("Voice","Call, qualify, schedule and update systems. Latency, authentication and escalation decide whether it works.")])+'<div class="deck-metric-grid">'+metric("voiceEnterprise")+metric("voiceConversations")+metric("aiResearch")+'</div>',"agent-evidence")
slide("03 / Business Models","Price is not the business model.","Separate the billable unit, delivery responsibility and the cash required to grow.",
      columns([("Access","Subscription or seat. A predictable invoice can sit on top of variable serving costs."),("Consumption","Usage or transaction. Cost follows activity, but the buyer still needs a link to value."),("Work or outcome","Charge for completion. The vendor absorbs ambiguity, retries and failure cost.")])+'<div class="deck-rule"><strong>Revenue → gross profit → contribution → cash</strong><p>Inference, human review and support matter. No universal gross-margin or EBITDA band. Hybrid pricing can be a durable choice.</p></div>',"business-economics")
slide("04 / Services","Sell the tool. Sell the work. Buy the business.","Three market-entry routes, defined by the customer relationship and delivery responsibility.",
      '<div id="deck-attack-angles"></div>',"services-comparison","deck-services")
slide("04 / Services","Which work can change hands?","Explore the supporting opportunity map. Its market estimates have different scopes.",
      '<div id="deck-services-map"></div><p class="deck-bottom-line">A market-fit hypothesis, not an automation forecast. Harvey stays software; Fura is a rollup using FleetWorks.</p>',"services-map","deck-map")
slide("05 / Healthcare","Efficiency for whom? Savings for whom?","Administrative ROI does not establish clinical autonomy or lower system-wide spending.",
      '<div class="deck-metric-grid">'+''.join(metric(k) for k in ["healthRoi","healthRcmAutonomy","healthClinicalAutonomy"])+'</div><div class="deck-rule"><strong>Buyer ≠ user ≠ payer ≠ beneficiary</strong><p>Fee-for-service can turn better documentation and collection into higher captured revenue. Trace the cash recipient before claiming system savings.</p></div>',"health-money")
slide("06 / Robotics and Physical AI","Start with productive tasks, not robot shapes.","Model intelligence, equipment integration and operating performance are different businesses.",
      '<div class="deck-metric-grid">'+metric("robotStock")+metric("robotInstalls")+'</div>'+columns([("Intelligence","Rhoda: video-based robot intelligence, not a humanoid manufacturer."),("Deployment","Measure utilization, interventions, service costs and customer ROI."),("Explore","Separate robotics and industrial money rivers remain in the report. Their scopes are not additive.")]),"robotics-explorer")
slide("07 / Investing and valuations","Useful AI is not enough.","A good capability, deployment, business and investment are separate filters.",
      '<div class="deck-return-chain">'+''.join(f'<span>{x}</span>' for x in ["Capability","Customer value","Captured profit and cash","Durability","Entry price"])+'</div>'+columns([("Applications and services","Retention, true delivery contribution, liability and the surplus the company retains."),("Rollups","Acquisition price, integration, organic cash conversion and debt service."),("Infrastructure and robotics","Utilization, deployment economics, capital needs and returns on invested capital.")]),"underwriting")
slide("07 / Investing and valuations","A financing mark is not a business model.","Dated public transactions, not live prices or proof of operating performance.",
      '<div class="deck-metric-grid">'+''.join(metric(k) for k in ["etchedRound","higgsfieldRound","harveyRound"])+'</div><p class="deck-bottom-line">Rhoda announced a <span data-metric="rhodaRound">'+esc(M["rhodaRound"]["display"])+'</span> without a valuation in its company release. No unsupported mark or mismatched revenue multiple is inserted.</p>',"valuation-evidence")
slide("07 / Investing and valuations","Follow the work. Follow the cash.","Then decide what to pay.",
      columns([("Keep the stack visible","The customer saving can become someone else's cost pressure."),("Own the real responsibility","Selling software, delivering the service and owning an acquired provider are different obligations."),("Underwrite retained value","Durable customer value matters. Durable profit and an attractive entry price decide the investment.")])+'<a class="deck-report-cta" href="index.html">Read the narrative. Open the rabbit holes. ↗</a>',"investing","deck-close")
count=len(slides)
head=deepcopy(baseline.head)
for t in head.find_all("script"):t.decompose()
head.title.string="State of AI | DVC presentation"
head.append(BeautifulSoup('<link rel="stylesheet" href="narrative-deck.css?v=20261016n">',"html.parser"))
for src in ["facts-data.js","narrative-data.js","services-matrix-data.js"]:
    head.append(BeautifulSoup(f'<script src="{src}?v=20261016n"></script>',"html.parser"))
chrome=f'''<div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div>
<a class="back-link" href="index.html">← Full report</a><button class="fs-toggle" id="fsToggle" type="button" aria-pressed="false">Present</button>
<div class="slide-counter"><span id="slideNum">1</span> / <span id="slideTotal">{count}</span></div>
<nav class="deck-nav" aria-label="Slide navigation"><button id="deckPrev" type="button" aria-label="Previous slide">←</button><span id="deckChapter">State of AI</span><button id="deckNext" type="button" aria-label="Next slide">→</button></nav>'''
dialog='<dialog class="metric-dialog" id="metric-dialog" aria-label="Evidence detail"><button class="dialog-close" type="button">Close ✕</button><div class="metric-dialog-content"></div></dialog>'
script_html=''.join(f'<script src="{x}"></script>' for x in [
    'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js','attack-angles.js?v=20261016n',
    'narrative.js?v=20261016n','narrative-opener.js?v=20261016n','narrative-deck.js?v=20261016n'])
(ROOT/"slides.html").write_text(f'<!DOCTYPE html><html lang="en">{head}<body data-narrative-deck>{chrome}<main class="deck" id="deck">{"".join(slides)}</main>{dialog}{script_html}</body></html>')
old_js=(ROOT/"versions/pre-seven-chapters/slides.js").read_text()
start=old_js.index("  ANIMATIONS[2] = function ()")
end=old_js.index("\n  // ─── SLIDE 2 — Tech cycles",start)
opener=old_js[start:end].replace("  ANIMATIONS[2] = function ()","window.NARRATIVE_OPENER = function ()",1)
opener=opener.replace("if (!window.gsap) {","if (!window.gsap || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {",1)
# Headline is legible while the cinematic sequence unfolds, rather than hidden for ten seconds.
opener=opener.replace("gsap.set(headline, { opacity: 0, y: 18 });","gsap.set(headline, { opacity: 1, y: 0 });")
opener=opener.replace("gsap.set(eyebrow, { opacity: 0, y: 8 });","gsap.set(eyebrow, { opacity: 1, y: 0 });")
opener=opener.replace("const tl = gsap.timeline();","const tl = window.__narrativeOpenerTimeline = gsap.timeline();")
opener=opener.replace("icons.forEach(el => el.classList.add('is-revealed'));",
    "icons.forEach(el => { el.classList.add('is-revealed'); el.style.opacity = 1; }); [outline,roof,ground].forEach(el => el && (el.style.strokeDashoffset = '0'));")
(ROOT/"narrative-opener.js").write_text("/* Preserved cinematic opener from GitHub 3742daa. */\n"+opener)
print(f"Built deck: {count} slides; all repeated figures use the shared evidence registry.")
