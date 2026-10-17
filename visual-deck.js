(function(){
  'use strict';
  // Restore the original interactive surface; shared facts update in place.
  var D=window.SLIDES_DATA,M=window.NARRATIVE_DATA.metrics;
  if(D){
    D.hyperscalerCapex.y2026=732.5;
    D.hyperscalerCapex.y2026Label='$732.5B';
    D.labLeadership.anthropic.runRate=M.anthropicRevenue.display+' reported Q3 revenue';
    D.labLeadership.openai.runRate=M.openaiRevenue.display+' annualized September pace';
    D.stackLayers[0].revenueLabel='Higgsfield annualized pace · September 29';
    D.stackLayers[2].revenue2026='$732.5B';
    D.vibeCoding.forEach(function(c){
      if(c.name==='Cursor'){c.stat='Inference-heavy tool';c.desc='Tool economics differ from high-margin SaaS. Not a service operator.';}
      if(c.name==='Claude Code'){c.stat='Model + coding surface';c.desc='Runtime, distribution and tool access matter alongside model capability.';}
      if(c.name==='Work + Codex'){c.stat='Platform distribution';c.desc='A coding surface inside a broader enterprise product.';}
      if(c.name==='Muse Spark'){c.name='Meta';c.stat='Muse Wonder';c.desc='October model release. No unverified price or weight-status inference.';}
    });
  }
  // Preserve the original barbell and all model-lane rows. The presentation
  // shows the relationship first; the release catalog opens on demand.
  var laneLabels=[
    'Astra · Fable',
    'Sol · Sonnet · Luna · Haiku',
    'DeepSeek · Kimi · GLM'
  ];
  document.querySelectorAll('#slide-6 .mb-lane').forEach(function(lane,i){
    var rows=Array.from(lane.querySelectorAll('.mb-row'));if(!rows.length)return;
    var notes=document.createElement('details'),summary=document.createElement('summary'),names=document.createElement('p');
    notes.className='model-lane-depth';summary.textContent='Models, pricing and release notes';notes.appendChild(summary);
    names.className='model-lane-names';names.textContent=laneLabels[i]||'Release-specific examples';
    rows[0].before(names);names.after(notes);rows.forEach(function(row){notes.appendChild(row);});
  });
  var chartA,chartB;
  function options(){return {responsive:true,maintainAspectRatio:false,plugins:{legend:{labels:{color:'#C8CCD4'}}},scales:{x:{ticks:{color:'#A0A8BC'},grid:{display:false}},y:{beginAtZero:true,ticks:{color:'#A0A8BC'},grid:{color:'rgba(255,255,255,.08)'}}}};}
  window.VISUAL_DECK={
    initEvidence:function(){
      var wrap=document.getElementById('deck-evidence-chart'),bench=document.getElementById('deck-benchmarks'),caption=document.getElementById('deck-evidence-caption');
      if(!wrap||wrap.dataset.initialized)return;wrap.dataset.initialized='true';
      EVIDENCE_VISUALS.mountBench(bench,true);
      function show(mode){
        document.querySelectorAll('[data-evidence-view]').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.evidenceView===mode));});
        bench.hidden=mode!=='benchmarks';wrap.hidden=mode==='benchmarks';caption.hidden=mode==='benchmarks';
        if(chartB){chartB.destroy();chartB=null;}
        if(mode==='prices'){
          caption.textContent='Standard USD per 1M input/output tokens. Short-context list prices are not cost per successful task. See model pricing details in the report.';
          window.VISUAL_DECK.prices();
        }else if(mode==='compute'){
          caption.innerHTML='Anthropic + OpenAI combined. September 13 analyst model. Both Q3 and Q4 2026 are estimates. Not a single-model training budget or a fall in absolute compute. <a href="'+EVIDENCE_ADDITIONS.compute.source+'" target="_blank" rel="noopener noreferrer">SemiAnalysis ↗</a>';
          chartB=new Chart(document.getElementById('smarterChart'),EVIDENCE_VISUALS.computeConfig(false));
        }
      }
      document.querySelectorAll('[data-evidence-view]').forEach(function(b){b.addEventListener('click',function(){show(b.dataset.evidenceView);});});
      show('benchmarks');
    },
    prices:function(){
      if(chartB)return;
      var el=document.getElementById('smarterChart');if(!el)return;
      var pairs=[M.priceSmall,M.priceWorkhorse,M.pricePremium].map(function(m){return m.display.match(/[\d.]+/g).map(Number);});
      chartB=new Chart(el,{type:'bar',data:{labels:['Small','Workhorse','Premium'],datasets:[
        {label:'Input · USD / 1M tokens',data:pairs.map(function(p){return p[0];}),backgroundColor:'#4CB5AB'},
        {label:'Output · USD / 1M tokens',data:pairs.map(function(p){return p[1];}),backgroundColor:'#9AA3B7'}]},options:options()});
    },
    capex:function(){
      if(chartA)return;
      var el=document.getElementById('slide7CapexChart');if(!el)return;
      var rows=NARRATIVE_DATA.capex,on=new Set(rows.map(function(r){return r.key;})),range=false;
      function data(){
        var ds=[{label:range?'Published guidance range · $B':'Guidance midpoint · $B',data:rows.map(function(r){return on.has(r.key)?(range?[r.low,r.high]:r.mid):null;}),backgroundColor:['#4CB5AB','#2280D6','#F3B7A8','#FFD821']}];
        if(range)ds.push({type:'line',label:'Point guidance · $B',showLine:false,pointRadius:5,pointBackgroundColor:'#FFFFFF',data:rows.map(function(r){return on.has(r.key)&&r.low===r.high?r.mid:null;})});
        return {labels:rows.map(function(r){return r.name;}),datasets:ds};
      }
      function update(){document.getElementById('slide7CapexTotalNum').textContent='$'+rows.reduce(function(s,r){return s+(on.has(r.key)?r.mid:0);},0).toLocaleString('en-US',{maximumFractionDigits:1})+'B';chartA.data=data();chartA.update();}
      chartA=new Chart(el,{type:'bar',data:data(),options:options()});
      document.querySelectorAll('#slide7CapexToggles [data-company]').forEach(function(b){
        var r=rows.find(function(r){return r.key===b.dataset.company;});
        if(!r){
          b.classList.remove('active');var v=b.querySelector('.tog-val');if(v)v.textContent='FY scope';
          var note=document.createElement('p');note.className='compute-caption';note.hidden=true;note.textContent='Oracle uses a different fiscal-year reporting period and is excluded from the selected-four calendar-year aggregate.';
          b.parentElement.after(note);b.setAttribute('aria-expanded','false');b.addEventListener('click',function(){note.hidden=!note.hidden;b.setAttribute('aria-expanded',String(!note.hidden));});return;
        }
        var v=b.querySelector('.tog-val');if(v)v.textContent='$'+r.mid+'B';
        b.addEventListener('click',function(){on.has(r.key)?on.delete(r.key):on.add(r.key);b.classList.toggle('active',on.has(r.key));update();});
      });
      var g=document.getElementById('slide7GapToggle');if(g){g.addEventListener('change',function(){range=g.checked;update();});var l=g.closest('.capex-gap-toggle');if(l){var t=l.querySelector('.gap-label');if(t)t.textContent='Show published guidance ranges';}}
      update();
    }
  };
})();
