# Operations for cuts.py (exec'd in its namespace: s, log, once, element_end, remove, replace, fold, norm ...).

def enc(text, tag='div', level=1):
    """Start index of the level-th enclosing <tag> element around a unique text."""
    idx = once(text)
    starts = [m.start() for m in re.finditer(r'<' + tag + r'(?=[\s>])', s[:idx])]
    found = 0
    for st in reversed(starts):
        if element_end(s, st) > idx:
            found += 1
            if found == level:
                return st
    raise AssertionError(f'no enclosing <{tag}> level {level} for {text[:60]!r}')


def cut_range(i, j, label):
    global s
    k = s.rfind('<!--', 0, i)
    if k >= 0 and s.find('-->', k) + 3 <= i and s[s.find('-->', k) + 3:i].strip() == '':
        i = k
    s = s[:i] + s[j:]
    log.append(f'removed: {label}')


def drop(text, label, tag='div', level=1):
    i = enc(text, tag, level)
    cut_range(i, element_end(s, i), label)


def wrap(i, j, summary, label):
    global s
    s = s[:i] + f'<details class="d-fold"><summary>{summary}</summary><div class="d-fold-body">' + s[i:j] + '</div></details>' + s[j:]
    log.append(f'folded: {label}')


# ============ G1 · move the unique facts out of the "Latest evidence" boxes, then remove all 13 boxes ============
# Ramp paid adoption (sec-2 box) -> the behaviour-layer callout in the same section.
replace('desktop conversations in March 2026, up <strong class="tabnum">55%</strong> year over year — but the scarce asset is the default workflow and the context that accumulates inside it, not the model behind the surface.',
        'desktop conversations in March 2026, up <strong class="tabnum">55%</strong> year over year. Paid adoption keeps widening: in Ramp’s October sample <strong class="tabnum">56.8%</strong> of businesses pay for AI, <strong class="tabnum">44.8%</strong> pay Anthropic and <strong class="tabnum">40.6%</strong> OpenAI, with overlap (<a href="https://ramp.com/data/ai-index-oct-2026" rel="noopener" target="_blank">Ramp AI Index</a>, Nov 11).',
        'G1+G4 · Ramp adoption into the behaviour-layer callout; thesis restatement dropped')
# MCP July 28 specification (sec-5 box) -> the MCP protocol card.
replace('<p class="aa-proto-desc">"The REST of AI" — how agents access external tools and data.',
        '<p class="aa-proto-desc">"The REST of AI" — how agents access external tools and data. The July 28 specification added a stateless core and authorization hardening.',
        'G1 · MCP spec into the MCP card')
# Rockwell survey (industrial box) -> the industrial explorer intro.
replace('<p>A historical 2025 industrial spending model.',
        '<p>Rockwell’s 2026 survey of 1,560 manufacturers in 17 countries finds <strong class="tabnum">59%</strong> actively using smart manufacturing and <strong class="tabnum">18%</strong> in pilots. A historical 2025 industrial spending model.',
        'G1 · Rockwell survey into the industrial intro')
# Q3 venture share (sec-12 box) -> the Pareto paragraph, which also labels the two periods.
replace('AI captured roughly <strong style="color:#E8E9ED">61%</strong> of all global VC in 2025.',
        'AI captured roughly <strong style="color:#E8E9ED">61%</strong> of all global VC in 2025, and 64% in Q3 2026 ($102B of $159B, Crunchbase).',
        'G1 · Q3 venture share into the multiples block; periods labelled')
n0 = s.count('<details class="evidence-update">')
while '<details class="evidence-update">' in s:
    i = s.index('<details class="evidence-update">')
    s = s[:i] + s[element_end(s, i):]
log.append(f'G1 · removed {n0} "Latest evidence" boxes')


# ============ G3 · a "Context and qualifications" block no longer repeats the sentence above it ============
def strip_prefix(body, lead):
    def nn(t):
        return re.sub(r'\s+([.,;:!?])', r'\1', re.sub(r'\s+', ' ', t)).strip()
    target = nn(norm(lead))
    if not nn(norm(body)).startswith(target):
        return None
    res, acc, done = [], '', False
    for m in re.finditer(r'<[^>]+>|[^<]+', body):
        tok = m.group(0)
        if done or tok.startswith('<'):
            res.append(tok)
            continue
        raw = html.unescape(tok)
        k = 0
        while k < len(raw) and len(nn(acc)) < len(target):
            acc += raw[k]
            k += 1
        if len(nn(acc)) >= len(target):
            done = True
            rest = raw[k:]
            res.append(html.escape(rest.lstrip(), quote=False) if rest.strip() else '')
    out = ''.join(res)
    for _ in range(3):
        out = re.sub(r'<(strong|em|span|b|i)\b[^>]*>\s*</\1>', '', out)
    return out


OPEN = '<details class="copy-detail"><summary>Context and qualifications</summary>'
pos, deduped, emptied = 0, 0, 0
while True:
    i = s.find(OPEN, pos)
    if i < 0:
        break
    j = element_end(s, i)
    head_end = i
    m = re.search(r'</(p|h3|h4|div)>\s*$', s[:head_end])
    if not m:
        pos = j
        continue
    tag = m.group(1)
    li = s.rfind('<' + tag, 0, m.start())
    lead_html = s[li:m.end()]
    body = s[i + len(OPEN):j - len('</details>')]
    new_body = strip_prefix(body, lead_html)
    if new_body is None:
        pos = j
        continue
    # the visible lead often carries a stray space before its full stop
    fixed_lead = re.sub(r'(\S) (\.)(?=\s*</)', r'\1\2', lead_html)
    if norm(new_body) == '':
        s = s[:li] + fixed_lead + s[j:]
        emptied += 1
        pos = li + len(fixed_lead)
    else:
        new_body = re.sub(r'^(\s*<p\b[^>]*>)\s*', r'\1', new_body)
        block = OPEN + new_body + '</details>'
        s = s[:li] + fixed_lead + block + s[j:]
        deduped += 1
        pos = li + len(fixed_lead) + len(block)
log.append(f'G3 · {deduped} blocks no longer repeat their lead; {emptied} empty blocks removed')


# ============ G2 · the fact-check trail leaves the text and becomes one method note at the end ============
g2 = [
    (r'\s*We no longer print[^.]*\.', ''),
    (r'; we no longer print[^.)]*', ''),
    (r'\s*Star count at peak is not printed:[^.]*\.', ''),
    (r'\s*The “100%” figures we previously printed are vendor claims we could not verify and are not literally checkable\.', ''),
    (r'\s*Exact fundraising, valuation and portfolio-client figures previously printed here were removed after the linked report became unavailable and could not be independently reproduced\.', ''),
]
total = 0
for pat, rep in g2:
    s, n = re.subn(pat, rep, s)
    total += n
s = re.sub(r'<p\b[^>]*>\s*</p>', '', s)
log.append(f'G2 · removed {total} fact-check sentences from the text')
METHOD = ('<section class="d-method"><div class="container"><details class="d-fold"><summary>Method and corrections</summary><div class="d-fold-body">'
          '<p>Figures we could not trace to a primary source or a named publication were removed rather than estimated: a single token cost-decline percentage, '
          'China’s capacity-addition and spare-capacity figures, the US power-shortfall estimate for 2028, the Pentagon vendor list and impact levels, peak GitHub-star '
          'counts, vendor claims of 100% AI-written code, two developer-employment percentages, the details of a source-code leak, the deployment-JV fundraising figures, '
          'an AUM concentration statistic and a month-gap between open and closed models. Earlier editions mixed primary marks, secondary prices, fiscal periods and '
          'annualized pace; this edition compares like with like and labels each metric.</p></div></details></div></section>')
fi = once('<footer class="site-footer')
s = s[:fi] + METHOD + s[fi:]
log.append('G2 · added the "Method and corrections" note before the footer')


# ============ Chapter 1 · AI stack ============
# 1.9 · Revenue: the three split figures, the "fastest-growing" note and their source move into the Application layer header.
drop('flows to inference &amp; infra</span>', '1.9 · revenue split row', 'div', 2)
drop('The application layer is the fastest-growing segment of AI revenue.</p>', '1.9 · fastest-growing note', 'div', 1)
drop('Source: company disclosures, press reports, DVC analysis.', '1.9 · revenue split source (re-added under the pills)', 'p', 1)
i = enc('>Top AI application companies by annualized recurring revenue</p>', 'p')
s = s[:i] + ('<p class="d-lede">Top AI application companies by annualized recurring revenue. The application layer is the fastest-growing segment of AI revenue; in every past computing wave it is where most value accrued.</p>'
             '<div class="d-statrow anim-fade">'
             '<div><strong class="tabnum">~$35B</strong><span>flows to inference and infrastructure: 30–75% of app revenue is consumed by compute</span></div>'
             '<div><strong class="tabnum">~$5–8B</strong><span>pure application layer, excluding OpenAI, Anthropic, Suno, Runway and ElevenLabs</span></div>'
             '<div><strong class="tabnum">~$1.1B</strong><span>generative media: Suno, Runway and ElevenLabs</span></div></div>') + s[element_end(s, i):]
log.append('1.9 · Application layer header now carries the split figures')
i = enc('<strong style="color:#E8E9ED">API-heavy</strong>', 'p') if s.count('<strong style="color:#E8E9ED">API-heavy</strong>') == 1 else enc('API-heavy</strong>', 'p')
j = element_end(s, i)
s = s[:j] + '<p class="d-note">Source: company disclosures, press reports, DVC analysis. “Pure application layer” = companies with own distribution, excluding model providers and generative media.</p>' + s[j:]
log.append('1.9 · split source placed under the pills')

# 1.1 · the three prices appear once (the circles); the Cost Collapse block goes.
drop('>THE COST COLLAPSE</h3>', '1.1 · The Cost Collapse block', 'div', 1)
# G4 · the Model Wars close with their own takeaway instead of restating the distribution thesis.
replace('Base generation is commoditizing.</strong> Value migrates to orchestration, inference optimization, and proprietary data.',
        'Route each step to the cheapest model that completes it.</strong> Pay for premium execution only where it raises the success rate.',
        'G4 · Model Wars closing takeaway')

# 1.4 · Benchmarks-are-dead callout (the different-jobs block already makes the point).
drop('Benchmarks are dead.</strong>', '1.4 · Benchmarks are dead callout', 'div', 1)

# 1.2 · Neolabs fold into one block.
i = enc('TALENT EXODUS</span></h3>', 'h3') if 'TALENT EXODUS</span></h3>' in s else None
k = s.rfind('<!--', 0, i)
if s[s.find('-->', k) + 3:i].strip() == '':
    i = k
j = element_end(s, enc('Source: TechCrunch, Bloomberg, WSJ, Wired, Reuters, Inc. Magazine', 'span'))
wrap(i, j, 'The neolabs: eight labs, $13B+ raised, mostly pre-revenue', '1.2 · Neolabs')

# T9 · Sora 2 leaves the model list (OpenAI announced its shutdown on March 24, 2026).
i = enc('<span class="mf-pill-name">Sora 2</span>', 'span', 1)
cut_range(i, element_end(s, i), 'T9 · Sora 2 pill')

# 1.3 · Beyond text: one line per modality, the full wall on click.
pi = enc('Every modality now has its own model race.', 'p')
wi = element_end(s, pi)
wi = s.index('<div', wi)
wall = s[wi:element_end(s, wi)]
rows, n_models, n_code = [], 0, 0
for lab, inner in re.findall(r'<span[^>]*>([A-Z0-9][A-Z0-9 /]+)</span>\s*<div[^>]*>(.*?)</div>\s*</div>', wall, re.S):
    names = re.findall(r'class="mf-pill-name">([^<]+)<', inner)
    if names:
        more = f' + {len(names) - 3} more' if len(names) > 3 else ''
        label = lab.strip().title().replace("Tts", "TTS")
        if label == 'Code':
            label, n_code = 'Coding products', len(names)
        else:
            n_models += len(names)
        rows.append(f'<li><strong>{label}</strong><span>{html.escape(", ".join(names[:3]))}{more}</span></li>')
assert len(rows) >= 6, rows
src_i = enc('Source: Artificial Analysis, TTS-Arena2, VBench', 'span')
j = element_end(s, src_i)
total_models = len(re.findall(r'class="mf-pill-name"', wall))
s = (s[:wi] + '<ul class="d-modal-list anim-fade">' + ''.join(rows) + '</ul>'
     + f'<details class="d-fold"><summary>All {n_models} models across {len(rows) - 1} modalities, plus {n_code} coding products</summary><div class="d-fold-body">' + s[wi:j] + '</div></details>' + s[j:])
log.append(f'1.3 · Beyond text: {len(rows)} lines, {n_models} models + {n_code} coding products folded')

# 1.5 · Scaling laws, AI factory and inference power shift become three theses under the Training chart.
drop('THE FOUR SCALING LAWS OF AI</strong>', '1.5 · four scaling laws callout', 'div', 1)
drop('>THE AI FACTORY</h3>', '1.5 · AI factory block', 'div', 1)
drop('THE INFERENCE POWER SHIFT</h4>', '1.5 · inference power shift block', 'div', 1)
ci = enc('<canvas id="reasoningChart"', 'div')
j = element_end(s, ci) - len('</div>')
s = s[:j] + ('<ul class="d-theses">'
             '<li><strong>Scaling has four levers.</strong> Pre-training, post-training, test-time reasoning and agents all consume compute (Jensen Huang, Lex Fridman Podcast #494, Mar 2026).</li>'
             '<li><strong>Data centers are becoming AI factories.</strong> “Electrons go in, tokens come out”: capacity is now built for inference at scale (NVIDIA GTC 2025–2026).</li>'
             '<li><strong>Inference runs around the clock.</strong> Training clusters run in bursts; inference runs 24/7, so the shift redistributes power demand rather than reducing it (NVIDIA GTC 2026).</li>'
             '</ul>') + s[j:]
log.append('1.5 · three theses under the Training chart')

# 1.6 · NVIDIA spotlight and Power source timeline live in the Follow the Money stack.
drop('<div class="nvidia-inner"', '1.6 · NVIDIA spotlight', 'div', 2) if False else None
i = once('<div class="nvidia-spotlight')
cut_range(i, element_end(s, i), '1.6 · NVIDIA spotlight')
i = once('<div class="power-timeline')
cut_range(i, element_end(s, i), '1.6 · Power source timeline')

# 1.7 · Colossus, Microsoft/OpenAI and Groq are each told once (Coalitions and the big-tech rabbit holes).
drop('Capacity is not abstract capex — it sets the product.', '1.7 · Colossus paragraph in the capex explorer', 'div', 1)
drop('COMPUTE SCARCITY NOW BEATS IDEOLOGY</strong>', '1.7 · Compute scarcity callout', 'div', 2)
drop('SINGLE-CLOUD LOCK-IN IS GONE</strong>', '1.7 · Single-cloud lock-in callout', 'div', 2)
i = enc('Groq LPU → $20B non-exclusive technology licence', 'p')
cut_range(i, element_end(s, i), '1.7 · Groq licence paragraph (kept in the NVIDIA rabbit hole)')
replace('<span class="chip">Cerebras</span>', '<span class="chip">Cerebras</span><span class="chip">Groq LPU</span>', '1.7 · Groq stays as a challenger chip') if s.count('<span class="chip">Cerebras</span>') == 1 else None

# 1.8 · Electron gap keeps the consumption fact; the bottleneck sentence stays only in the geopolitics finale.
eg = s.index('THE ELECTRON GAP PARADOX</h4>')
starts = [m.start() for m in re.finditer(r'<div(?=[\s>])', s[:eg])]
bi = next(st for st in reversed(starts) if element_end(s, st) > eg)
bj = element_end(s, bi)
src = re.search(r'<span class="stat-source"[^>]*>Source: Brookings.*?</span>', s[bi:bj], re.S).group(0)
s = s[:bi] + ('<div class="callout-box anim-fade"><h4>THE ELECTRON GAP PARADOX</h4>'
              '<p>China generates substantially more electricity than the US and has been adding capacity at a rate the US has not matched; energy experts who visit describe power availability there as a “solved problem”. '
              'Yet the US consumes <strong>nearly 2× more data-center electricity</strong>.</p>' + src + '</div>') + s[bj:]
log.append('1.8 · Electron gap reduced to the consumption fact')

# 1.10 · DeepSeek: benchmarks only in the full story; the January 2025 market moves go.
s, n = re.subn(r'Matched OpenAI o1 on AIME 2024 \(<span class="tabnum">79\.8% vs 79\.2%</span>\), MATH-500 \(<span class="tabnum">97\.3% vs 96\.4%</span>\)\. ',
               'Matched OpenAI o1 on the main reasoning benchmarks (full story below). ', s)
assert n == 1
log.append('1.10 · DeepSeek benchmarks no longer repeated')
drop('Collateral Damage</strong>', '1.10 · DeepSeek collateral damage', 'div', 1)

# 1.11 · Three-tier world (a rule rescinded in May 2025); the export-control timeline already records it.
i = once('<h3 class="subsection-title anim-fade" style="margin-top:3rem">THE THREE-TIER WORLD</h3>')
j = element_end(s, enc('Source: CSIS AI Diffusion', 'span'))
cut_range(i, j, '1.11 · Three-tier world')

# 1.12 · EU AI Act dates: the full timeline stays in its rabbit hole.
drop('Status (Aug 2026)</strong>', '1.12 · EU status paragraph', 'div', 1)


# ============ Chapter 2 · Agents ============
# 2.4 · Jensen's inference inflection and "cheaper AI != less spend" repeat chapter 1.
drop('THE INFERENCE INFLECTION POINT</h4>', '2.4 · Inference inflection callout', 'div', 2)
drop('CHEAPER AI ≠ LESS SPEND.</strong>', '2.4 · Cheaper AI callout', 'div', 1)

# 2.1 · Vibe coding: cards, the evidence toggle, the 42% bar and the orchestration callout stay; the rest folds.
ceiling = None
ci = enc('But the ceiling is rising faster than the floor.', 'div', 1)
ceiling = s[ci:element_end(s, ci)]
cut_range(ci, ci + len(ceiling), '2.1 · ceiling callout lifted (re-inserted after the 42% bar)')
bi = once('<div class="ar-stat-bar anim-fade"')
bj = element_end(s, bi)
s = s[:bj] + ceiling + s[bj:]
log.append('2.1 · ceiling callout now follows the 42% bar')
fi = s.rfind('<!-- Self-referential note -->', 0, once('Agents building agents:</strong>'))
fj = element_end(s, enc('How fast does open source move?', 'div', 1))
wrap(fi, fj, 'More on coding agents: code as a throwaway artifact, compute access in the Cursor deal, the governed agent stack, open-source speed', '2.1 · vibe coding detail')

# 2.2 · "Agents need bodies" folds into the household block.
hi = enc('ONE AGENT. ONE MAC MINI. ONE HOUSEHOLD.', 'h3')
hj = element_end(s, hi)
s = s[:hj] + ('<p class="d-lede anim-fade">The agent’s “body” is a dedicated, always-on machine with local files, apps and memory. Perplexity’s Personal Computer runs on a Mac mini with an audit trail and a kill switch; '
              'OpenClaw does the same as open source, through WhatsApp, Telegram, Slack or iMessage. Cloud still held 81.1% of agent market share in 2025. The day below is an illustrative community setup.</p>') + s[hj:]
log.append('2.2 · bodies intro added to the household block')
i = once('<div class="a2a-bodies anim-fade"')
cut_range(i, element_end(s, i), '2.2 · Agents need bodies block')

# 2.3 · The protocol stack joins "Three protocols"; payments stay with the wallets.
pi = once('<div class="aa-protocols anim-fade"')
pj = element_end(s, pi) - len('</div>')
s = s[:pj] + ('<p class="d-lede">Around the three protocols: identity and discovery (AGNTCY under the Linux Foundation, 75+ companies, cryptographic agent IDs), '
              'marketplaces (Google Cloud Agent Marketplace and Agent.ai, 1,300+ agents) and payment rails (Circle Nanopayments, Stripe x402; see agent wallets below). '
              'MCP now counts 10,000+ servers and was donated to the Agentic AI Foundation under the Linux Foundation.</p>') + s[pj:]
log.append('2.3 · identity, marketplaces and payments line added to Three protocols')
i = once('<div class="a2a-protocols anim-fade"')
cut_range(i, element_end(s, i), '2.3 · Emerging protocol stack block')

# 2.5 · Moltbook.
i = once('<div class="a2a-moltbook anim-fade"')
cut_range(i, element_end(s, i), '2.5 · Moltbook')

# 2.6 · Prompt injection is covered by the Vulnerability paradox.
drop('Prompt Injection</strong>', '2.6 · prompt-injection tile', 'div', 1)

# G4 · Anatomy's "So what?" keeps its own point (orchestration, context engineering) without the distribution refrain.
replace('The enduring advantage in agents will not come from having a model. It will come from orchestrating the full system around the model: memory, tools, workflows, reliability, and distribution.',
        'The enduring advantage in agents comes from the system around the model: memory, tools, workflows and reliability.',
        'G4 · So what? without the distribution refrain')


# ============ Chapter 3 · Business models ============
# 3.2 · One block: the three paradigms (with the AaaS step), then what each model earns per user.
ai = once('<div class="explosion-arpu anim-fade" id="arpu-block"')
aj = element_end(s, ai)
arpu = s[ai:aj]
h3 = '<h3 class="subsection-title" style="margin-bottom:0.5rem">PER-TOKEN BEATS PER-SEAT WHEN AI DOES THE WORK</h3>'
assert arpu.count(h3) == 1
k = arpu.index(h3) + len(h3)
m = re.match(r'\s*<p[^>]*>Subscription caps upside and mis-prices heavy users\.</p><details class="copy-detail">', arpu[k:])
assert m, arpu[k:k + 200]
dj = element_end(arpu, k + m.end() - len('<details class="copy-detail">'))
arpu = arpu[:arpu.index(h3)] + '<h4 class="d-subhead">What each model earns per user</h4>' + arpu[dj:]
s = s[:ai] + s[aj:]
k = s.rfind('<!--', 0, ai)
while k >= 0 and s[s.find('-->', k) + 3:ai].strip() == '':
    s = s[:k] + s[ai:]
    ai = k
    k = s.rfind('<!--', 0, ai)
log.append('3.2 · ARPU comparison lifted out of the per-seat block (its headline and lead dropped)')
pi = once('<div class="biz-pricing-landscape anim-fade">')
pj = element_end(s, pi) - len('</div>')
s = s[:pj] + ('<p class="d-lede"><strong>The next step, per Jensen Huang (GTC 2026):</strong> agentic AI as a service, priced per workflow completed. '
              'Seat → token → outcome → workflow.</p>') + s[pj:]
log.append('3.2 · paradigms block now carries the AaaS step; T17 · ARPU table dropped (eyeballs-vs-wallets keeps the direction)')
drop('>THE FOURTH MODEL: AaaS</h3>', '3.2 · AaaS block', 'div', 1)

# 3.3 · Margin squeeze joins the ad divide; Sora keeps its own short note.
replace('OpenAI</strong> — Launched ChatGPT ads Feb 2026.',
        'OpenAI</strong> — Projects ~$856B of compute and infrastructure spend through 2030 (FT, Sep 2026). Launched ChatGPT ads Feb 2026.',
        '3.3 · OpenAI spend projection moved into the ad divide')
i = once('<div class="biz-margin-section anim-fade">')
cut_range(i, element_end(s, i), '3.3 · Margin squeeze block')

# 3.1 · The founder takeaway copied from "Agents talking to agents" leaves Business Models.
bm = once('id="sec-9"')
ti = s.index('<div class="a2a-takeaway anim-fade"', bm)
assert ti < s.index('id="sec-services', bm)
cut_range(ti, element_end(s, ti), '3.1 · duplicated founder takeaway')


# ============ Chapter 5 · Healthcare ============
# 5.1 · The patient-event loop keeps its diagram; the list version of the loop and the 12 sourced cards fold.
i = once('<div aria-live="polite" class="hc-loop-fallback" id="hc-loop-fallback"></div>')
wrap(i, i + len('<div aria-live="polite" class="hc-loop-fallback" id="hc-loop-fallback"></div>'), 'The loop step by step', '5.1 · loop list version')
i = once('<div aria-label="Sourced callouts for this section" class="hc-loop-callouts" id="hc-loop-callouts"></div>')
wrap(i, i + len('<div aria-label="Sourced callouts for this section" class="hc-loop-callouts" id="hc-loop-callouts"></div>'),
     'Sourced callouts: workforce, rural funding, model infrastructure, revenue cycle, telehealth', '5.1 · loop callouts')


# ============ Chapter 6 · Robotics / Physical ============
# 6.1 · One block, brains then bodies: the three brain companies leave the humanoid tiers, the tiers join the brain race.
for name in ('<div class="pai-tier-card" data-tooltip="Skild AI: $1.8B raised.', '<div class="pai-tier-card" data-tooltip="Physical Intelligence: π0.7', '<div class="pai-tier-card pai-tier-card--dvc" data-tooltip="Rhoda AI (DVC portfolio)'):
    i = once(name)
    cut_range(i, element_end(s, i), '6.1 · duplicate tier card (' + name.split('="')[2].split(':')[0].split(' (')[0] + ')')
ti = enc('>HUMANOID TIER LIST</h3>', 'div', 1)
tj = element_end(s, ti)
tier = s[ti:tj]
h3m = re.search(r'<h3[^>]*>HUMANOID TIER LIST</h3>', tier)
tiers_inner = tier[h3m.end():-len('</div>')]
cut_range(ti, tj, '6.1 · humanoid tier list block (merged below)')
bi = enc('>THE ROBOT BRAIN RACE</h3>', 'div', 1)
bj = element_end(s, bi) - len('</div>')
s = s[:bj] + '<h4 class="d-subhead">Bodies: humanoid makers</h4>' + tiers_inner + s[bj:]
s = s.replace('<h3 class="subsection-title">THE ROBOT BRAIN RACE</h3>\n<p class="pai-block-sub">Foundation models powering physical AI</p>',
              '<h3 class="subsection-title">BRAINS AND BODIES</h3>\n<p class="pai-block-sub">Brains: the foundation models powering physical AI</p>', 1)
assert 'BRAINS AND BODIES' in s
log.append('6.1 · one Brains and bodies block')

# 6.2 · The $38T breakdown folds; the stat row above keeps the headline numbers.
oi = enc('>THE $38T OPPORTUNITY</h3>', 'div', 1)
oj = element_end(s, oi)
inner = s[oi:oj]
hm = re.search(r'<h3[^>]*>THE \$38T OPPORTUNITY</h3>\s*<p class="pai-block-sub">[^<]*</p>', inner)
s = s[:oi] + inner[:hm.start()] + ('<details class="d-fold"><summary>The $38T labour market by sector, and what is automatable</summary><div class="d-fold-body">'
                                   + inner[hm.end():-len('</div>')] + '</div></details></div>') + s[oj:]
log.append('6.2 · $38T breakdown folded')

# 6.3 · Robotaxi race: a three-row table up front, every player, chart and economics on click.
ri = enc('>THE ROBOTAXI RACE</h3>', 'div', 1)
rj = element_end(s, ri)
blk = s[ri:rj]
sub = re.search(r'<p class="pai-block-sub">[^<]*</p>', blk)
TABLE = ('<div class="d-table-wrap"><table class="d-table"><thead><tr><th scope="col"></th><th scope="col">Scale</th><th scope="col">Safety claim</th><th scope="col">Footprint</th></tr></thead><tbody>'
         '<tr><th scope="row">Waymo</th><td>14M+ rides in 2025 · ~500K a week · $126B valuation</td><td>95% fewer serious crashes</td><td>15 commercial US markets</td></tr>'
         '<tr><th scope="row">Tesla</th><td>~12B FSD miles (Q2 2026) · 1M unsupervised miles (Sep 2026)</td><td>8× safer than human drivers (Tesla data)</td><td>Austin since June 2025; Cybercab production from Q2 2026</td></tr>'
         '<tr><th scope="row">China</th><td>Baidu Apollo Go in 28 cities · Pony.ai 1,975 robotaxis (Jun 2026) · WeRide ~400 in the Middle East</td><td>—</td><td>First driverless permits (Baidu, Aug 2022); Dubai</td></tr>'
         '</tbody></table></div>')
blk = (blk[:sub.end()] + TABLE + '<details class="d-fold"><summary>All robotaxi and trucking players, the Waymo chart and unit economics</summary><div class="d-fold-body">'
       + blk[sub.end():-len('</div>')] + '</div></details></div>')
s = s[:ri] + blk + s[rj:]
log.append('6.3 · robotaxi table up front, detail folded')


# ============ Figures that disagreed with the rest of the report ============
replace('<td class="accent-gold">$700B+ hyperscaler capex</td>', '<td class="accent-gold">$730B hyperscaler capex (2026 guidance)</td>', 'fix · dot-com table capex $730B')
replace('>FROM THE $700B SPRINT</span>', '>FROM THE $730B SPRINT</span>', 'fix · outlook eyebrow $730B')
replace('projecting <span class="tabnum">$130–145B</span> of 2026 CapEx including finance-lease principal (narrowed on Jul 29 from $125–145B',
        'projecting <span class="tabnum">$135–145B</span> of 2026 CapEx including finance-lease principal (narrowed on the Q3 call from $130–145B, itself narrowed on Jul 29 from $125–145B',
        'fix · Meta capex $135–145B')
replace('Ramp AI Index, Oct 2026 (Sep data)', 'Ramp AI Index, October 2026 data (Nov 11 release)', 'fix · Ramp label')


# Cache version for the D layer files after this round.
s = s.replace('design-d.css?v=d6', 'design-d.css?v=d9').replace('design-d.js?v=d6', 'design-d.js?v=d7')


# ============ Round 2 (Tony, Nov 25 13:43): 1.14, 1.15, 1.16, 1.18, 1.19, 2.9, 2.10, 6.5 ============
# 1.14 · The decorative world map goes; Sovereign players and the Bifurcation thesis cover the regions.
i = once('<div class="geo-map anim-fade"')
cut_range(i, element_end(s, i), '1.14 · world map')

# 1.15 · DeepSeek: one visible takeaway, the figures and the full story on click.
di = once('<div class="geo-deepseek anim-fade"')
ri = s.index('<div class="rabbit-hole', element_end(s, di))
assert 'DeepSeek: The Full Story' in s[ri:ri + 600]
rj = element_end(s, ri)
k = s.rfind('<!--', 0, di)
if s[s.find('-->', k) + 3:di].strip() == '':
    di = k
s = s[:di] + ('<p class="d-lede anim-fade">In January 2025 DeepSeek-R1 showed that efficiency gains, better architectures and RL-heavy post-training can narrow the frontier with much less capital than the market had assumed.</p>'
              '<details class="d-fold"><summary>DeepSeek, January 2025: the figures and the full story</summary><div class="d-fold-body">') + s[di:rj] + '</div></details>' + s[rj:]
log.append('1.15 · DeepSeek folded behind a one-line takeaway')

# 1.16 · Sovereign AI players: one line per region, the cards on click.
si = once('<div class="geo-sovereign-expanded anim-fade"')
sj = element_end(s, si)
REGIONS = ('<ul class="d-modal-list anim-fade">'
           '<li><strong>EU</strong><span>Regulation first: the AI Act has been in force since August 2024 and phases in through August 2028; Mistral is the sovereign champion.</span></li>'
           '<li><strong>Middle East</strong><span>From investor to operator: Saudi Humain (PIF) builds data centres and models; Abu Dhabi’s MGX backs OpenAI, xAI and Stargate. Sovereign funds put $66B into AI and digitalisation in 2025.</span></li>'
           '<li><strong>India</strong><span>From talent base to builder: about 19% of GitHub AI projects (2023 data); the IndiaAI Mission has 38,000+ GPUs on its national compute portal (March 2026).</span></li>'
           '<li><strong>China</strong><span>An ecosystem, not just chips: 1,112 generative-AI services filed (August 2026), 100M daily Doubao users and 59% of global robot installations in 2025.</span></li>'
           '</ul>')
s = s[:si] + REGIONS + '<details class="d-fold"><summary>Region by region: programmes, champions and sources</summary><div class="d-fold-body">' + s[si:sj] + '</div></details>' + s[sj:]
log.append('1.16 · Sovereign players as four region lines, cards folded')

# 1.18 · Stargate becomes one line in the Power section.
i = once('<div class="stargate-timeline anim-fade"')
cut_range(i, element_end(s, i), '1.18 · Stargate saga cards')
ei = enc('THE ELECTRON GAP PARADOX</h4>', 'div', 1)
ej = element_end(s, ei)
s = s[:ej] + ('<p class="d-lede anim-fade">Stargate shows the constraint in practice: a $500B joint venture of SoftBank, Oracle and OpenAI, slowed by delays and power procurement; '
              'the first 1.2 GW phase at Abilene is operational.</p>') + s[ej:]
log.append('1.18 · Stargate line added after the electron gap')

# 1.19 · Three pillars: the last "two exponentials" goes; the Vera Rubin + Groq figure matches the stack and NVIDIA's projection.
i = enc('Two exponentials colliding</strong>', 'li')
cut_range(i, element_end(s, i), '1.19 · two exponentials line')
replace('Vera Rubin + Groq LPU: 350× Hopper throughput</li>', 'Vera Rubin + Groq LPU: up to 35× throughput per MW (NVIDIA projection)</li>', '1.19 · 35× per MW, as in the stack')

# 2.9 · The roofing example stays only in the Spending divide, where it has a number.
drop('A roofing company is using AI agents', '2.9 · roofing callout in the household block', 'div', 1)

# 2.10 · The tweet quote under the agent stack.
i = once('<div class="asc-quote anim-fade"')
cut_range(i, element_end(s, i), '2.10 · digital-coworker quote')

# 6.5 · The portfolio founder's "once in the history of humanity" quote that opened the robotics section.
i = once('<div class="pai-quote-hero anim-fade"')
cut_range(i, element_end(s, i), '6.5 · Rhoda CPO quote')


# ============ Round 3 text fixes (Tony, Nov 25 16:21): T1 T5 T6 T8 T10 T13 T16 T18 T19 T20 T23 T26 T27 T29 T30 T31 T37 ============
# (T9, T12 and T17 live in the operations above.)
# T1 · Both labs on one labelled metric in the Applications layer; the quarterly $16.96B stays in Layer 4.
replace('<span class="mf-pill-val tabnum" data-visual-metric="openaiRevenue">~$50B</span>', '<span class="mf-pill-val tabnum">~$50B pace</span>', 'T1 · OpenAI pill labelled as annualized pace')
replace('<div class="mf-pill" data-tooltip="$16.96B · Q3 2026 GAAP revenue. From the amended S-1 (Nov 10); GAAP operating loss $567M. A reported quarter is not an exit run-rate; the separate $81B run-rate at Oct 31 is a different metric.">\n<span class="mf-pill-name">Anthropic</span>\n<span class="mf-pill-val tabnum" data-visual-metric="anthropicRevenue">$16.96B</span>',
        '<div class="mf-pill" data-tooltip="$81B run-rate at Oct 31, 2026 (amended S-1, Nov 10). A run-rate, not booked revenue; Q3 2026 GAAP revenue was $16.96B (Layer 4).">\n<span class="mf-pill-name">Anthropic</span>\n<span class="mf-pill-val tabnum">$81B run-rate</span>',
        'T1 · Anthropic pill on the same run-rate basis')

# T5 · DeepSeek reads as background; the Meta items are dated 2025; "IPO complete" goes.
s, n = re.subn(r'>THE DEEPSEEK DISRUPTION</h3>', '>DeepSeek, January 2025: background</h3>', s); assert n == 1
s, n = re.subn(r'(<strong[^>]*>Frontier Struggles &amp; the Brute-Force Pivot)(</strong>)', r'\1 (2025)\2', s); assert n == 1
s, n = re.subn(r'(<p[^>]*>)Llama 4 received poor reception', r'\1In 2025, Llama 4 received poor reception', s); assert n == 1
log.append('T5 · Meta items dated 2025')
cw = once('>CoreWeave</h3>')
m = re.compile(r'<span[^>]*>IPO complete</span>\s*').search(s, cw)
assert m and m.start() - cw < 400
s = s[:m.start()] + s[m.end():]
log.append('T5 · "IPO complete" removed from the CoreWeave card')

# T6 · xAI's enterprise reach now runs through Cursor.
replace('No enterprise AI playbook.', 'Grok has no enterprise playbook of its own; enterprise reach now comes through Cursor (about 60% of revenue from enterprise).', 'T6 · xAI enterprise line')

# T8 · Training chart caption names the metric and the model date (the JS caption is changed in visual-charts.js).
replace('Anthropic + OpenAI combined. September 13 analyst model; both Q3 and Q4 2026 are estimates.',
        'Modeled share of lab compute capacity, Anthropic + OpenAI combined. The SemiAnalysis model is dated September 13, before Q3 results; Q3 and Q4 2026 are model estimates.',
        'T8 · training chart caption')
s = s.replace('visual-charts.js?v=20261119-visual"', 'visual-charts.js?v=20261119-visual-d8"')

# T10 · The Cursor deal: SpaceX paid in stock; compute access was the draw.
replace('<p>Compute is the new acquisition currency.</p>', '<p>Compute access was part of the price.</p>', 'T10 · Cursor callout lead')
replace('The model layer is starting to buy the application layer, and the weapon is not cash, it is GPU access. The first time an infrastructure player has used compute itself as acquisition currency for an app-layer company. Expect more of these.',
        'SpaceX paid $60B in stock; the draw for Cursor was access to Colossus.', 'T10 · Cursor sentence')

# T13 · The auto-purchase card is honest about Amazon's position.
replace('<p>Agent orders from Amazon using its own account and crypto card. No human needed.</p>',
        '<p>Agent orders from Amazon using its own account and crypto card. In practice Amazon is updating its site code to deter outside AI agents.</p>', 'T13 · auto-purchase card')

# T16 · The daily-use figure matches its source.
replace('<strong class="tabnum">72%</strong> of developers who tried AI use it every day.',
        '<strong class="tabnum">73%</strong> of AI-assistant users use them daily (Stack Overflow 2026).', 'T16 · 73% daily use')

# T18 · One OpenAI weekly-user count across the report (the $51 Google ARPU left with the table).
replace('Across 1B+ weekly users that is', 'Across 1.2B+ weekly users (DevDay, Sep 29, 2026) that is', 'T18 · OpenAI weekly users')

# T19 · Business Models closes on its own conclusion instead of Sora.
drop('OpenAI killed Sora</strong>', 'T19 · Sora note', 'div', 1)
ci = enc('A new pattern: branding restraint.', 'div', 1)
cj = element_end(s, ci)
s = s[:cj] + ('<div class="callout-box anim-fade"><p><strong>Outcome pricing is the strategic direction and hybrid usage is the current commercial reality;</strong> '
              'subscriptions work as a revenue floor inside hybrid models.</p></div>') + s[cj:]
log.append('T19 · chapter takeaway added')

# T20 · Services states its three routes in plain words.
s, n = re.subn(r'(<p class="seq-matrix-intro"[^>]*>)Where AI autopilots are attacking services\. Tap any category for AI contenders, funding dates and sources\.</p>\s*<p[^>]*>This is where the agent control plane meets the P&amp;L\.</p><details class="copy-detail"><summary>Context and qualifications</summary><p[^>]*>Sell the tool, deliver the service, or acquire the provider\. Explore each market and company below\.</p></details>',
               r'\1AI enters services by three routes: sell the tool to the provider, deliver the service yourself, or acquire the provider. Tap any category for AI contenders, funding dates and sources.</p>', s)
assert n == 1
log.append('T20 · services intro rewritten')

# T23 · Dot-com table: one company's run-rate is named as such; adoption carries a source.
replace('<td class="accent-teal">$81B run-rate at frontier</td>', '<td class="accent-teal">Anthropic alone at an $81B run-rate (Oct 31, 2026)</td>', 'T23 · revenue row')
replace('<td class="accent-teal">53% of enterprises deploying</td>', '<td class="accent-teal">88% of organisations use AI in at least one function (McKinsey, Nov 2025)</td>', 'T23 · adoption row')

# T26 · The editor's note in hypothesis 13.
replace(' We removed the specific maternity-code and dollar estimates because the underlying payer publication could not be obtained.', '', 'T26 · editor note removed')

# T27 · Hypothesis 12: OpenClaw is an agent, not open weights; the unsupported half of the title goes.
s, n = re.subn(r'>Open Weights Lead on Scale and Ownability — Regulated Inference Stays Proprietary</h3>', '>Open Weights Lead on Scale and Ownability</h3>', s); assert n == 1
replace('DeepSeek, Llama, Qwen, OpenClaw — open-weight models look close to closed ones on public benchmarks;',
        'DeepSeek, Llama and Qwen open-weight models look close to closed ones on public benchmarks;', 'T27 · OpenClaw out of the open-weight list')
replace('NVIDIA called OpenClaw “as big as Linux.” ', '', 'T27 · Linux quote removed')
log.append('T27 · hypothesis 12 title shortened')

# T29 · The $430M is Ramp customers' spend, not the market.
replace('spent on foundation models Q4 2025 (+126% QoQ)<span class="ew-macro-src">Ramp</span>',
        'spent by Ramp customers on foundation models in Q4 2025 (+126% QoQ)<span class="ew-macro-src">Ramp</span>', 'T29 · Ramp scope')

# T30 · Each geographic share carries its own source.
s, n = re.subn(r'of AI deal value went to North America\. San Francisco Bay Area alone captured (<strong[^>]*>\$122B</strong>) — 75%\+ of all US AI funding\.',
               r'of AI deal value went to North America (OECD). The San Francisco Bay Area alone captured \1, more than 75% of US AI funding on Crunchbase’s count.', s)
assert n == 1
log.append('T30 · geographic shares sourced separately')

# T31 · The two sovereign-fund figures explain their scope.
s, n = re.subn(r'Sovereign Wealth Funds deployed (<strong[^>]*>\$46B</strong>) into AI ventures in 2025\.',
               r'Sovereign wealth funds put \1 into AI ventures in 2025 (EY); Global SWF counts $66B on a broader AI and digitalisation scope.', s)
assert n == 1
log.append('T31 · sovereign-fund scopes')

# T37 · Company names for company figures; one spelling per company and agency.
replace('>Claude</span>', '>Anthropic</span>', 'T37 · Anthropic, not Claude, in the revenue pills') if s.count('>Claude</span>') == 1 else None
s, n = re.subn(r'(<div class="ar-card-info">\s*<h3[^>]*>)Devin(</h3>\s*<p class="ar-card-stat tabnum">)\$48B valuation', r'\1Devin by Cognition\2Cognition $48B valuation', s); assert n == 1
log.append('T37 · Devin card names Cognition')
n = s.count('Nvidia'); s = s.replace('Nvidia', 'NVIDIA'); log.append(f'T37 · Nvidia → NVIDIA ({n})')
replace('SpaceX/xAI', 'SpaceX (xAI)', 'T37 · SpaceX (xAI)')
replace('Brookings puts DoD’s', 'Brookings puts the Pentagon’s', 'T37 · Pentagon')

# T17 (cont.) · With the ARPU table gone, the directional Counterpoint point is visible rather than folded.
s, n = re.subn(r'(<p[^>]*>)Eyeballs vs wallets\.</p>(<details class="copy-detail"><summary>Context and qualifications</summary><p[^>]*>)Counterpoint’s Q1 2026 model estimates materially higher revenue per user for Anthropic than OpenAI, Microsoft or Google\. ',
               r'\1<strong>Eyeballs vs wallets.</strong> Counterpoint’s Q1 2026 model estimates materially higher revenue per user for Anthropic than for OpenAI, Microsoft or Google.</p>\2', s)
assert n == 1
log.append('T17 · Counterpoint direction shown in the eyeballs-vs-wallets lead')


# ============ Notes toolbar (Tony, Nov 25 17:19): out of the cover, into the end-of-report note ============
ti = once('<div class="visual-tools">')
tools = s[ti:element_end(s, ti)]
s = s[:ti] + s[ti + len(tools):]
mi = once('<section class="d-method"><div class="container">')
mj = element_end(s, mi)
k = mj - len('</div></section>')
assert s[k:mj] == '</div></section>'
s = s[:k] + tools + s[k:]
log.append('notes toolbar moved from under the cover to the end-of-report method note')


# ============ Analytics (GA4, Tony chose B on Nov 25): load analytics.js after the D layer ============
replace('<script src="design-d.js?v=d7"></script>', '<script src="design-d.js?v=d7"></script><script src="analytics.js?v=a4"></script>', 'analytics.js loaded in <head>')


# Legacy anchor: the ARPU table left with T17; its id moves to the pricing-paradigms block so old #arpu-block links still land.
replace('<div class="biz-pricing-landscape anim-fade">', '<div class="biz-pricing-landscape anim-fade" id="arpu-block">', 'legacy anchor #arpu-block on the paradigms block')
