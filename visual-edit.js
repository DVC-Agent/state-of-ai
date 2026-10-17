(function(){
  'use strict';
  function init(){
    window.VISUAL_CHARTS.initPhysicalChart();
    window.EVIDENCE_VISUALS.mountBench(document.getElementById('model-task-picture'),false);
    var root=document.querySelector('.section--money-flow');
    if(root){
      root.querySelectorAll('.mf-toggle-btn').forEach(function(b){
        b.addEventListener('click',function(){
          var i=+b.dataset.lens;
          root.querySelectorAll('.mf-toggle-btn').forEach(function(x){x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b));});
          document.getElementById('mfYearToggle').dataset.activeIdx=String(i);
          root.querySelectorAll('[data-lenses]').forEach(function(x){x.textContent=JSON.parse(x.dataset.lenses)[i];});
        });
      });
      var journey=document.getElementById('mfJourneyOverlay');
      document.getElementById('mfJourneyBtn').addEventListener('click',function(){journey.classList.add('active');journey.style.display='flex';});
      document.getElementById('mfJourneyClose').addEventListener('click',function(){journey.classList.remove('active');journey.style.display='none';});
      journey.addEventListener('click',function(e){if(e.target===journey){journey.classList.remove('active');journey.style.display='none';}});
      document.addEventListener('keydown',function(e){if(e.key==='Escape'){journey.classList.remove('active');journey.style.display='none';}});
      function recalc(){
        var a=+document.getElementById('journeyInference').value,b=+document.getElementById('journeyHuman').value,c=+document.getElementById('journeyTools').value;
        [['Inference',a],['Human',b],['Tools',c]].forEach(function(x){document.getElementById('journey'+x[0]+'Out').textContent=x[1]+'¢';});
        [a,b,c,100-a-b-c].forEach(function(v,i){document.getElementById('journeyAmount'+i).textContent=v+'¢';});
      }
      ['journeyInference','journeyHuman','journeyTools'].forEach(function(id){document.getElementById(id).addEventListener('input',recalc);});
    }
    document.getElementById('visualExpandCopy').addEventListener('click',function(){document.querySelectorAll('.copy-detail').forEach(function(d){d.open=true;});});
    document.getElementById('visualCloseCopy').addEventListener('click',function(){document.querySelectorAll('.copy-detail').forEach(function(d){d.open=false;});});
    document.querySelectorAll('.nav-dot[tabindex]').forEach(function(el){el.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();el.click();}});});
    document.querySelectorAll('[data-visual-metric]').forEach(function(el){var m=NARRATIVE_DATA.metrics[el.dataset.visualMetric];if(m)el.textContent=m.display;});
    var routes={
      saas:{flow:['Software','Provider','Customer'],examples:'Harvey · Avoca · FleetWorks'},
      vertical:{flow:['AI + team','Outcome','Customer'],examples:'Crosby · Amperos · Doctronic'},
      rollup:{flow:['Acquire','Automate','Cash flow','Acquire'],examples:'Dwelly · Fura · Crete'}
    };
    document.querySelectorAll('#attack-angles-block .aa-col').forEach(function(col){
      var key=col.dataset.angle,route=routes[key];if(!route)return;
      var diagram=document.createElement('div');diagram.className='route-flow';diagram.setAttribute('aria-label',route.flow.join(' to '));
      route.flow.forEach(function(word,i){if(i){var arrow=document.createElement('i');arrow.textContent='→';diagram.appendChild(arrow);}var mark=document.createElement('span');mark.textContent=word;diagram.appendChild(mark);});
      col.querySelector('.aa-col-head').appendChild(diagram);
      var examples=document.createElement('p');examples.className='route-examples';examples.textContent=route.examples;diagram.after(examples);
      var rows=col.querySelector('.aa-rows'),detail=document.createElement('details'),summary=document.createElement('summary'),deep=document.createElement('dl');detail.className='route-depth';summary.textContent='Economics, fit and all examples';detail.appendChild(summary);deep.className='aa-rows';detail.appendChild(deep);
      Array.from(rows.children).slice(2).forEach(function(row){deep.appendChild(row);});rows.after(detail);
    });
    var context=document.querySelector('#attack-angles-block .aa-context');
    if(context){
      var notes=document.createElement('details'),label=document.createElement('summary');
      notes.className='route-framework';label.textContent='Framework, caveats and sources';notes.appendChild(label);
      context.before(notes);notes.appendChild(context);
      var note=document.querySelector('#attack-angles-block .aa-context-note');if(note)notes.appendChild(note);
    }
    var detail=document.getElementById('brushDetail');
    document.querySelectorAll('[data-brush-fact]').forEach(function(b){
      b.addEventListener('click',function(){var m=NARRATIVE_DATA.metrics[b.dataset.brushFact];detail.innerHTML='<strong>'+m.label+': '+m.display+'</strong> · '+m.period+'<br>'+m.qualifier+' <a href="'+m.url+'" target="_blank" rel="noopener noreferrer">'+m.source+' ↗</a>';});
    });
    var stories={
      control:['DeepSeek V4.1 Flash: MIT weights. Kimi K3 and GLM: check the exact artifact and license.','deepseek'],
      task:['Reasoning, output length, retries, tool calls and human review determine cost per completed task.','pricingFramework'],
      distribution:['DVC synthesis: the model supplies intelligence; runtime makes it act; distribution brings the customer.','serviceFramework']
    };
    document.querySelectorAll('[data-brush-story]').forEach(function(b){b.addEventListener('click',function(){var v=stories[b.dataset.brushStory],m=NARRATIVE_DATA.metrics[v[1]];detail.innerHTML=v[0]+' <a href="'+m.url+'" target="_blank" rel="noopener noreferrer">'+m.source+' ↗</a>';});});
    window.VISUAL_QA={metrics:function(){return Array.from(document.querySelectorAll('[data-visual-metric]')).filter(function(el){return el.textContent!==NARRATIVE_DATA.metrics[el.dataset.visualMetric].display;}).map(function(el){return el.dataset.visualMetric;});}};
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
