/* Public evidence checked October 16, 2026. Percentages are not interchangeable metrics. */
(function(root){
  'use strict';
  var modelCard='https://deepmind.google/models/model-cards/gemini-4-argon/';
  var methodology='https://deepmind.google/models/evals-methodology/gemini-4-argon';
  var computeSource='https://newsletter.semianalysis.com/p/long-live-the-short-king-why-4-hi';
  var models=['Gemini 4 Argon','GPT-6 Astra','Claude Fable 5.1','Claude Opus 5.5'];
  var rows=[
    ['Knowledge work','Vals Index',[68.9,63.1,65.8,67.0],'Vals AI. Composite index, not share of economic work automated.'],
    ['Knowledge work','AutomationBench',[51.3,41.4,31.4,42.5],'Zapier public leaderboard, private set. Benchmark score, not enterprise deployment success.'],
    ['Knowledge work','Vals Finance Agent v2',[65.4,53.5,58.9,58.6],'Vals AI. Multi-step financial research tasks.'],
    ['Knowledge work',"Harvey's Legal Agent Benchmark",[19.6,5.4,6.7,3.8],'Vals AI. Not the percentage of all legal work a model can automate.'],
    ['Agentic coding','DeepSWE v1.1',[77.9,74.1,67.4,74.2],'Argon self-computed with mini-swe. Astra leaderboard; Anthropic system cards. Harness and settings matter.'],
    ['Agentic coding','FrontierSWE v2',[55.0,65.5,56.3,62.3],'Proximal public leaderboard.'],
    ['Agentic coding','Vibe Code Bench',[91.9,89.6,90.3,90.3],'Vals AI public leaderboard.'],
    ['Agentic coding','Terminal-bench 4.0',[57.4,58.2,57.9,66.4],'Argon self-computed; rival results from official leaderboard. Highest reported thinking level.'],
    ['ML engineering','PostTrainBench',[45.3,44.3,40.2,49.3],'Self-computed for all models. v1.1, OpenCode harness, ten-hour single-H100 budget.'],
    ['Science and math','Terminal-Bench Science 0.1',[57.6,68.1,52.6,63.3],'Argon self-computed with 6× verifier timeout; other results from official leaderboard.'],
    ['Science and math','LABBench 2',[88.8,85.4,68.6,73.1],'Self-computed for all models, with terminal, bioinformatics tools and internet access.'],
    ['Science and math','RiemannBench',[76.0,72.0,65.6,69.6],'Surge public leaderboard.'],
    ['Long context','GraphWalks · up to 128K',[99.7,98.7,91.4,90.6],'BFS F1, not a task pass rate. All models self-computed; 650 items.'],
    ['Long context','GraphWalks · 256K–1M',[84.2,71.8,65.0,66.8],'BFS F1. All models self-computed; 200 problems.'],
    ['Computer use',"Agent's Last Exam",[39.5,34.2,null,38.2],'Pass rate. Argon self-computed with ALE-Claw and five-hour window. Missing Fable result is not zero.'],
    ['Computer use','OSWorld-2.0 · offline',[69.2,72.6,null,null],'Partial score, offline subset. Argon: maximum of three one-attempt runs. Anthropic combined online/offline results are not comparable and omitted.'],
    ['Multimodal','Chartography',[71.6,71.0,46.2,66.3],'Surge public leaderboard, without tools.'],
    ['Multimodal','LVBench',[91.7,87.5,79.7,83.7],'Self-computed without tools. Frame counts differ by model due to API limits.'],
    ['Cybersecurity','CWE-bench v1',[68.0,68.0,58.0,67.0],'Official leaderboard. This row ties; it does not establish a unique winner.']
  ].map(function(r){return {category:r[0],name:r[1],scores:r[2],method:r[3]};});
  var quarters=['Q1 2024','Q2 2024','Q3 2024','Q4 2024','Q1 2025','Q2 2025','Q3 2025','Q4 2025','Q1 2026','Q2 2026','Q3 2026 E','Q4 2026 E'];
  var pre=[67,63,57,55,53,50,40,32,23,13,10,7];
  var post=[4,5,6,7,9,14,24,36,42,50,53,55];
  var inference=[29,32,38,39,38,36,36,32,34,37,37,38];
  root.EVIDENCE_ADDITIONS={
    benchmarks:{models:models,rows:rows,source:modelCard,methodology:methodology,asOf:'October 2026 model-card table',defaultRows:[0,1,3,4,5,7]},
    compute:{
      quarters:quarters,pre:pre,post:post,inference:inference,defaultRows:[0,9,10,11],
      source:computeSource,modelSource:'https://semianalysis.com/tokenomics-model/',
      sourceImage:'https://substackcdn.com/image/fetch/$s_!U8e4!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F0327e1f0-2057-4961-b0ba-d7eb63abac64_1935x1212.png',
      vintage:'September 13, 2026 analyst model',
      scope:'Anthropic + OpenAI combined. Shares of lab compute capacity, including inference.',
      qualifier:'Modeled, not company-disclosed operating data. Both Q3 and Q4 2026 are marked E in the original. Rounded labels can sum to 99% or 101%. A shrinking share does not imply falling absolute pretraining compute.'
    }
  };
  if(root.NARRATIVE_DATA){
    var M=root.NARRATIVE_DATA.metrics;
    M.geminiBenchmarks={label:'Task-specific model comparison',display:'19 benchmark rows',period:'October 2026 model-card table',asOf:'2026-10-13',url:modelCard,source:'Google DeepMind',type:'vendor-compiled benchmark table',qualifier:'Vendor-selected suite. Mixed measurement sources, reasoning settings, harnesses and metrics. Missing results are not zero; no overall average is computed.'};
    M.computeMix={label:'Post-training / RL compute share',display:'53%',period:'Q3 2026 E · September 13 model vintage',asOf:'2026-09-13',url:computeSource,source:'SemiAnalysis Tokenomics Model',type:'analyst modeled estimate',qualifier:root.EVIDENCE_ADDITIONS.compute.scope+' '+root.EVIDENCE_ADDITIONS.compute.qualifier};
    M.computeForecast={label:'Pretraining share of lab compute',display:'7%',period:'Q4 2026 E · forecast',asOf:'2026-09-13',url:computeSource,source:'SemiAnalysis Tokenomics Model',type:'forecast',qualifier:root.EVIDENCE_ADDITIONS.compute.scope+' Not a measured current allocation or single-model training budget.'};
  }
})(typeof window!=='undefined'?window:globalThis);
