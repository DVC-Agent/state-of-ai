"""November 19, 2026 figure refresh for the alternative visual report.

Updates figures that went stale after the October 16 evidence cut (Anthropic IPO and
S-1 figures, OpenAI's November round, November flagship prices, NVIDIA Q3 FY2027,
post-Q3 capex guidance, Ramp October data, Perplexity, Waymo, Meta Muse). It adds no
new sections or update blocks. Shared metric records live in facts-data.js and
narrative-data.js; this pass fixes the prose replicas the builders copy from the
preserved original.

Each pair is (old, new). Every old string must occur at least once, so a silent miss
fails the build instead of shipping a stale figure. Order matters: specific sentences
come before the short global replacements.
"""

COMMON = [
    ("$732.5B", "$730B"),
    ("~$745B", "~$740B"),
    ("$720–745B", "$720–740B"),
    ("$130-145B", "$135-145B"),
    ("$16.8B", "$16.96B"),
    ("?v=20261016-visual-final", "?v=20261119-visual"),
]

REPORT = [
    # Anthropic: IPO, S-1 run-rate and Q3 GAAP revenue.
    ("since superseded by the $65B Series H at $965B post-money on May 28, 2026.",
     "since superseded by the $65B Series H at $965B post-money on May 28, 2026, and by the November 18, 2026 IPO at $83 a share ($81.3B raised; about $1.5T fully diluted)."),
    ("$65B run-rate at end of July 2026 (reported Aug 17), up from $47B in May and the official $30B in April; Q3 2026 revenue $16.8B (Bloomberg, Oct 14)",
     "$81B run-rate at Oct 31, 2026 (amended S-1, Nov 10), up from $65B at end of July, $47B in May and the official $30B in April; Q3 2026 GAAP revenue $16.96B"),
    ('<span class="tabnum" style="color:#FFD720;font-weight:700;font-size:0.875rem">$65B</span>',
     '<span class="tabnum" style="color:#FFD720;font-weight:700;font-size:0.875rem">$81B</span>'),
    ("at a $65B+ run-rate (end of July 2026) that reported $16.8B of Q3 revenue (Bloomberg, Oct 14).",
     "at an $81B run-rate (October 31, 2026) that reported $16.96B of Q3 GAAP revenue (amended S-1, Nov 10)."),
    ('<span class="biz-margin-metric tabnum">$65B+ run-rate</span>',
     '<span class="biz-margin-metric tabnum">$81B run-rate</span>'),
    ("Reported end-Jul 2026 (Bloomberg), up from $47B in May and $30B official in Apr · Q3 revenue $16.8B, up ~45% QoQ (Bloomberg, Oct 14)",
     "Oct 31, 2026 per the amended S-1, up from $65B at end-July and $30B official in Apr · Q3 GAAP revenue $16.96B, GAAP operating loss $567M"),
    ("$65B+ run-rate at frontier", "$81B run-rate at frontier"),
    # OpenAI: November round.
    ("closed Mar 2026 at $852B post-money / $730B pre-money (SoftBank $30B + Amazon $50B + Nvidia $30B lead).",
     "closed Mar 2026 at $852B post-money / $730B pre-money (SoftBank $30B + Amazon $50B + Nvidia $30B lead). A further ~$11B first close came at $1.25T on Nov 6, 2026 (Bloomberg)."),
    # Ramp AI Index, October data.
    ('<span class="aug-card-num">43.8%</span>', '<span class="aug-card-num">44.8%</span>'),
    ("September Ramp sample; up 0.62 percentage points month over month.",
     "October Ramp sample (November 11 release)."),
    ("55.9%", "56.8%"),
    # November flagship prices: GPT-6.2 Astra and Claude Fable 5.2 at $8/$40.
    ('against <span class="tabnum" style="color:#FFD720">$10/$50</span> for Claude Fable 5.1 and GPT-6 Astra at the agentic frontier — a 100× spread',
     'against <span class="tabnum" style="color:#FFD720">$8/$40</span> for Claude Fable 5.2 and GPT-6.2 Astra at the agentic frontier — an 80× spread'),
    ("frontier-tier list prices rose to $10/$50 — the barbell",
     "frontier-tier list prices rose to $10/$50 before easing to $8/$40 in November — the barbell"),
    ("GPT-6 Astra and Claude Fable 5.1", "GPT-6.2 Astra and Claude Fable 5.2"),
    ('<p class="model-name">Claude Fable 5.1</p>', '<p class="model-name">Claude Fable 5.2</p>'),
    ('<p class="model-name">GPT-6 Astra</p>', '<p class="model-name">GPT-6.2 Astra</p>'),
    ('<p class="model-stat tabnum">$10 / $50</p>', '<p class="model-stat tabnum">$8 / $40</p>'),
    ("<strong>$10 / $50</strong><span>Astra · Fable</span>", "<strong>$8 / $40</strong><span>Astra · Fable</span>"),
    ('font-size:1.8rem;font-weight:800;display:block">$10 / $50</span>',
     'font-size:1.8rem;font-weight:800;display:block">$8 / $40</span>'),
    ('<span class="aug-card-num">$10 / $50</span>', '<span class="aug-card-num">$8 / $40</span>'),
    # Perplexity (DVC portfolio): ~$1B annualized revenue, CEO on November 16.
    ('data-tooltip="&gt;$750M annualized revenue (Aug 2026, per The Information), roughly tripled since the Feb 25 2026 Computer launch.',
     'data-tooltip="~$1B annualized revenue (Nov 16, 2026, per CEO Aravind Srinivas), up from &gt;$750M in August.'),
    ('<span class="tabnum" style="color:#4BB5AB;font-weight:700;font-size:0.875rem">&gt;$750M</span>',
     '<span class="tabnum" style="color:#4BB5AB;font-weight:700;font-size:0.875rem">~$1B</span>'),
    ("and Perplexity passed $750M of annualized revenue in August.",
     "and Perplexity reached about $1B of annualized revenue by November 16."),
    ('<p class="ar-card-stat tabnum">&gt;$750M annualized revenue (Aug 2026)</p>',
     '<p class="ar-card-stat tabnum">~$1B annualized revenue (Nov 16, 2026, CEO)</p>'),
    ("annualised revenue passed <strong>$750M</strong> by August 2026, roughly triple the start of the year",
     "annualised revenue reached about <strong>$1B</strong> by November 2026, up from $750M in August"),
    # Waymo rider-only miles.
    ("271M+ rider-only miles through June 2026.", "300M+ rider-only miles (Alphabet Q3, October 28, 2026)."),
    # Capex guidance after Q3 calls: Microsoft ~$170B, Meta $135-145B.
    ('data-color="#7FBA00" data-pct="24"', 'data-color="#7FBA00" data-pct="23"'),
    ("Q3 2026 revenue, up 45% sequentially; Q2 $11.6B and Q1 $4.7B in Reuters’ October 14 investor-day account. Adjusted profitability is not GAAP profitability. The prior $65B July run-rate is a different metric.",
     "Q3 2026 GAAP revenue from the amended S-1 (Nov 10), with a GAAP operating loss of $567M; Q2 $11.6B and Q1 $4.7B in Reuters’ October 14 investor-day account. The $81B run-rate at Oct 31 is a different metric."),
    ("Share of Ramp businesses paying Anthropic in September; OpenAI 40.6%.",
     "Share of Ramp businesses paying Anthropic in October; OpenAI 40.6%."),
    ('PROPRIETARY FRONTIER <span style="color:#6B7280;font-weight:500;text-transform:none;letter-spacing:0">— flagship set as of October 16, 2026',
     'PROPRIETARY FRONTIER <span style="color:#6B7280;font-weight:500;text-transform:none;letter-spacing:0">— flagship set as of October 16, 2026; Anthropic and OpenAI prices updated November 19'),
    ("Source: OpenAI, Anthropic and Google API pricing pages, Oct 16, 2026", "Source: OpenAI, Anthropic and Google API pricing pages, Oct 16 and Nov 19, 2026"),
    ("On current published list prices (October 2026)", "On current published list prices (November 2026)"),
    ('<p class="closing-date">October 2026</p>', '<p class="closing-date">November 2026</p>'),
    # Edition labels.
    ("State of AI — October 2026", "State of AI — November 2026"),
    ("Latest evidence · October 16, 2026", "Latest evidence · figures updated November 19, 2026"),
]

WHATS_NEW = [
    ("Latest edition · October 16, 2026", "Latest edition · figures updated November 19, 2026"),
    ("State of AI — October 2026", "State of AI — November 2026"),
    ("?v=20261016-visual-final", "?v=20261119-visual"),
]

DECK = [
    # NVIDIA Q3 FY2027.
    ('<span class="sp-card-badge">Q2 FY27</span>', '<span class="sp-card-badge">Q3 FY27</span>'),
    ('<span class="sp-card-num tabnum">$96.2B</span>', '<span class="sp-card-num tabnum">$115.8B</span>'),
    ('data center <strong class="tabnum">$89.0B</strong>', 'data center <strong class="tabnum">$107.6B</strong>'),
    ("Vera Rubin is now in full production; Q3 FY27 guided to $108B ±2%, excluding China data-center compute.",
     "First Vera Rubin shipments; Q4 FY27 guided to $130B ±3%, with no China data-center compute assumed."),
    # November flagship prices.
    ('<span class="mb-model">Claude Fable 5.1 / Mythos 5.1</span><span class="mb-price tabnum">$10/$50</span>',
     '<span class="mb-model">Claude Fable 5.2 / Mythos 5.2</span><span class="mb-price tabnum">$8/$40</span>'),
    ("Sep 1, succeeding Fable 5 (Jun 9) · multi-day agentic tier. Mythos is restricted to Project Glasswing partners, not generally purchasable.",
     "Nov 9, succeeding Fable 5.1 (Sep 1) and cutting the tier from $10/$50 · multi-day agentic tier. Mythos is restricted to verified organisations, not generally purchasable."),
    ('<span class="mb-model">GPT-6 Astra</span><span class="mb-price tabnum">$10/$50</span>',
     '<span class="mb-model">GPT-6.2 Astra</span><span class="mb-price tabnum">$8/$40</span>'),
    ("GA Sep 4 · OpenAI’s top tier now matches Anthropic’s price point.",
     "Nov 17, 20% below GPT-6 Astra · OpenAI’s top tier still matches Anthropic’s price point."),
    ('<span class="mb-end-num tabnum">$10 / $50</span>', '<span class="mb-end-num tabnum">$8 / $40</span>'),
    ("PREMIUM MULTI-DAY AGENTIC (GPT-6 Astra, Claude Fable 5.1)", "PREMIUM MULTI-DAY AGENTIC (GPT-6.2 Astra, Claude Fable 5.2)"),
    ("Commodity inference collapsed while frontier list prices rose to $10/$50.",
     "Commodity inference collapsed while frontier list prices rose to $10/$50, then eased to $8/$40."),
    ('<span class="iframe-stat-num">$745B</span>', '<span class="iframe-stat-num">$740B</span>'),
    ("Model layer · October 2026 flagship set", "Model layer · November 2026 flagship set"),
    # Meta Muse accounts (Q3 call).
    ("the <strong>Muse</strong> agent (Sep 8, ~4M users)", "the <strong>Muse</strong> agent (Sep 8; 10M+ accounts by the Q3 call)"),
    # Capex.
    ('<span class="tog-val tabnum">~$175B</span>', '<span class="tog-val tabnum">~$170B</span>'),
]


def apply(text, pairs, label, common=True):
    """Strict pairs must match; COMMON replacements apply wherever they occur."""
    missing = [old for old, _ in pairs if old not in text]
    assert not missing, f"{label}: stale strings not found: {missing}"
    for old, new in pairs + (COMMON if common else []):
        text = text.replace(old, new)
    return text
