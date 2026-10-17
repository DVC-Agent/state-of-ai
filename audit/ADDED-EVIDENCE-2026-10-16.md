# Added evidence: benchmark leadership and compute workload mix

The two user-supplied graphics have been checked against their underlying public sources and recreated in the existing DVC visual system. They add no slide to the original 18-slide deck.

## Task-specific model performance

- **Primary table:** Google DeepMind’s October 2026 Gemini 4 Argon model card reproduces all 19 rows and all four model columns in the supplied image. The three missing results remain missing, not zero. [Google DeepMind model card](https://deepmind.google/models/model-cards/gemini-4-argon/).
- **Measurement limits:** The suite mixes public leaderboards, vendor system cards and self-computed evaluations, with different harnesses and reasoning settings. Score types include indices, F1, pass rates and partial scores, so no cross-row average or universal model ranking is computed. [Google DeepMind methodology](https://deepmind.google/models/evals-methodology/gemini-4-argon).
- **Narrative consequence:** “Different jobs. Different leaders.” Six representative task checks show the pattern; a switch reveals all 19 results. Clicking a score opens the relevant measurement caveat and methodology.
- **Important interpretation:** The 19.6% legal-benchmark score is not the share of legal work that can be automated. The widget states that qualification in the score readout, consistent with the benchmark-specific presentation in the [model card](https://deepmind.google/models/model-cards/gemini-4-argon/).

## Compute allocation

- **Primary origin:** SemiAnalysis, “Long Live the Short King: Why 4-hi HBM Wins,” September 13, 2026. The original chart is titled “Share of Frontier Lab Compute by Workload: Bandwidth-Bound Work Now Dominates” and explicitly covers Anthropic and OpenAI combined, not all frontier labs. [SemiAnalysis article](https://newsletter.semianalysis.com/p/long-live-the-short-king-why-4-hi).
- **Forecast markings:** The original marks both Q3 2026 and Q4 2026 with E. Social Capital’s simplified repost marks only Q4 as estimated; the recreated chart follows the original instead. [Primary chart](https://substackcdn.com/image/fetch/$s_!U8e4!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F0327e1f0-2057-4961-b0ba-d7eb63abac64_1935x1212.png) and [Social Capital repost](https://x.com/socialcapital/status/2107239666781208693).
- **Denominator:** The source measures modeled shares of total lab compute capacity, including inference, not a finished checkpoint’s training history or dollar spending. The underlying product is a demand-side analyst forecast model, not company-disclosed operating accounting. [SemiAnalysis Tokenomics Model](https://semianalysis.com/tokenomics-model/).

- **Q1 2024:** 67% pretraining, 4% post-training/RL and 29% inference ([primary chart](https://substackcdn.com/image/fetch/$s_!U8e4!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F0327e1f0-2057-4961-b0ba-d7eb63abac64_1935x1212.png)).
- **Q2 2026:** 13% pretraining, 50% post-training/RL and 37% inference ([primary chart](https://substackcdn.com/image/fetch/$s_!U8e4!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F0327e1f0-2057-4961-b0ba-d7eb63abac64_1935x1212.png)).
- **Q3 2026 E:** 10% pretraining, 53% post-training/RL and 37% inference ([primary chart](https://substackcdn.com/image/fetch/$s_!U8e4!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F0327e1f0-2057-4961-b0ba-d7eb63abac64_1935x1212.png)).
- **Q4 2026 E:** 7% pretraining, 55% post-training/RL and 38% inference ([primary chart](https://substackcdn.com/image/fetch/$s_!U8e4!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F0327e1f0-2057-4961-b0ba-d7eb63abac64_1935x1212.png)).

All values above are transcribed from the [primary SemiAnalysis chart](https://substackcdn.com/image/fetch/$s_!U8e4!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F0327e1f0-2057-4961-b0ba-d7eb63abac64_1935x1212.png). The full 12-quarter series is available on demand; published rounding produces 99% or 101% sums in some intermediate quarters ([primary chart](https://substackcdn.com/image/fetch/$s_!U8e4!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F0327e1f0-2057-4961-b0ba-d7eb63abac64_1935x1212.png)).

The narrative is “Training did not disappear. It changed shape.” Post-training is still training, and a lower pretraining share does not establish declining absolute pretraining compute. The source supports a change in workload composition, not a conclusion that 90% of compute serves paying customers. [SemiAnalysis workload discussion](https://newsletter.semianalysis.com/p/long-live-the-short-king-why-4-hi).

## Implementation

`evidence-additions-data.js` is the shared numeric record for both surfaces. The report adds a compact interactive benchmark comparison and reuses the original reasoning-chart canvas for the compute mix. The existing capability/cost slide switches between task performance, API prices and compute mix; the original chart canvas and older efficiency notes remain available.
