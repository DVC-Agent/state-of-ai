/* One compact view, exact data on interaction. Same evidence in report and deck. */
(function(root){
  'use strict';
  var D=root.EVIDENCE_ADDITIONS;
  function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function mountBench(el,compact){
    if(!el || el.dataset.benchMounted)return;el.dataset.benchMounted='true';
    var b=D.benchmarks,all=false;
    el.classList.add('benchmark-picture');
    el.innerHTML='<div class="evidence-picture-head"><div><h3>Different jobs. Different leaders.</h3><p>Task performance, not a universal model ranking.</p></div><button class="evidence-switch" type="button" aria-pressed="false">All 19 results</button></div><div class="bench-grid-scroll"><div class="bench-grid"></div></div><div class="bench-readout" aria-live="polite">Click a score for its measurement rules.</div><details class="evidence-method"><summary>How to read this comparison</summary><p>Google’s selected suite combines third-party leaderboards and vendor-computed results. Reasoning budgets, harnesses and even score types differ. Do not average the rows, treat a blank as zero, or translate a benchmark score into a share of an occupation automated.</p><p><a target="_blank" rel="noopener noreferrer" href="'+b.source+'">Google DeepMind model card ↗</a> · <a target="_blank" rel="noopener noreferrer" href="'+b.methodology+'">Evaluation methodology ↗</a></p></details>';
    var grid=el.querySelector('.bench-grid'),readout=el.querySelector('.bench-readout'),toggle=el.querySelector('.evidence-switch');
    function render(){
      var indexes=all?b.rows.map(function(_,i){return i;}):b.defaultRows;
      grid.innerHTML='<div class="bench-column-label">Benchmark</div>'+['Gemini<br>Argon','GPT-6<br>Astra','Claude<br>Fable','Claude<br>Opus'].map(function(n,i){return '<div class="bench-column-label" title="'+b.models[i]+'">'+n+'</div>';}).join('');
      indexes.forEach(function(index){
        var row=b.rows[index],max=Math.max.apply(null,row.scores.filter(function(v){return v!==null;}));
        var label=document.createElement('div');label.className='bench-row-label';label.textContent=row.name;grid.appendChild(label);
        row.scores.forEach(function(score,j){
          var cell=document.createElement('button');cell.type='button';cell.className='bench-score'+(score===max?' is-leading':'');
          cell.setAttribute('aria-label',row.name+', '+b.models[j]+': '+(score===null?'not reported':score.toFixed(1)+' percent'));
          cell.style.setProperty('--score',String((score===null?0:score)/100));
          cell.innerHTML='<span>'+(score===null?'Not reported':score.toFixed(1)+'%')+'</span>';
          cell.addEventListener('click',function(){readout.innerHTML='<strong>'+esc(row.name)+'</strong> · '+esc(b.models[j])+': '+(score===null?'not reported':score.toFixed(1)+'%')+'. '+esc(row.method)+' <a href="'+b.methodology+'" target="_blank" rel="noopener noreferrer">Method ↗</a>';});
          grid.appendChild(cell);
        });
      });
      toggle.textContent=all?'Six task checks':'All 19 results';toggle.setAttribute('aria-pressed',String(all));
      el.classList.toggle('is-full-bench',all);
    }
    toggle.addEventListener('click',function(){all=!all;render();});render();
  }
  function computeConfig(full){
    var c=D.compute,ii=full?c.quarters.map(function(_,i){return i;}):c.defaultRows;
    var colors=['#9AA3B7','#4CB5AB','#FFFFFF'],names=['Pretraining','Post-training / RL','Inference'];
    return {
      type:'bar',
      data:{labels:ii.map(function(i){return c.quarters[i];}),datasets:[c.pre,c.post,c.inference].map(function(series,j){
        return {label:names[j],data:ii.map(function(i){return series[i];}),backgroundColor:colors[j],borderColor:ii.map(function(i){return i>=10?'#FFFFFF':colors[j];}),borderWidth:ii.map(function(i){return i>=10?2:0;}),borderSkipped:false};
      })},
      options:{responsive:true,maintainAspectRatio:false,animation:{duration:650},interaction:{mode:'index',intersect:false},plugins:{
        legend:{position:'bottom',labels:{color:'#C8CCD4',padding:16,usePointStyle:true}},
        tooltip:{callbacks:{afterTitle:function(items){return items[0]&&ii[items[0].dataIndex]>=10?'Estimated quarter (E); September model vintage':'Analyst model, not a company disclosure';},label:function(ctx){return ctx.dataset.label+': '+ctx.raw+'%';}}}
      },
      scales:{x:{stacked:true,grid:{display:false},ticks:{color:'#A0A8BC',maxRotation:0,autoSkip:true}},y:{stacked:true,min:0,max:full?101:100,ticks:{color:'#A0A8BC',callback:function(v){return v+'%';}},grid:{color:'rgba(255,255,255,.08)'}}},
      },
      plugins:[{id:'computeLabels',afterDatasetsDraw:function(chart){
        if(ii.length>4)return;var ctx=chart.ctx;ctx.save();ctx.font='500 13px "Stabil Grotesk",sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
        chart.data.datasets.forEach(function(ds,j){if(!chart.isDatasetVisible(j))return;chart.getDatasetMeta(j).data.forEach(function(bar,k){var props=bar.getProps(['x','y','base'],true);if(Math.abs(props.base-props.y)<15)return;ctx.fillStyle='#1D253E';ctx.fillText(ds.data[k]+'%',props.x,(props.y+props.base)/2);});});ctx.restore();
      }}]
    };
  }
  root.EVIDENCE_VISUALS={mountBench:mountBench,computeConfig:computeConfig};
})(window);
