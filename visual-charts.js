/* Original chart surfaces; reviewed inputs and no synthetic industry series. */
(function(root){
  'use strict';
  var M=root.NARRATIVE_DATA.metrics;
  function whenVisible(el,fn){
    if(!el)return;
    var obs=new IntersectionObserver(function(es){if(es.some(function(e){return e.isIntersecting;})){fn();obs.disconnect();}},{threshold:.1});
    obs.observe(el);
  }
  function frame(id){var c=document.getElementById(id);return c&&c.closest('.chart-container,.chart-card,.pai-chart-block,.capex-explorer');}
  function chart(id,config){
    var c=document.getElementById(id);
    whenVisible(c,function(){if(!Chart.getChart(c))new Chart(c,config);});
  }
  function options(unit){
    return {responsive:true,maintainAspectRatio:false,animation:{duration:700},
      plugins:{legend:{position:'bottom',labels:{color:'#C8CCD4',usePointStyle:true,padding:18}}},
      scales:{x:{grid:{display:false},ticks:{color:'#A0A8BC'}},y:{beginAtZero:true,grid:{color:'rgba(255,255,255,.08)'},ticks:{color:'#A0A8BC',callback:function(v){return v+unit;}}}}};
  }
  function source(el,key,copy){
    if(!el)return;var m=M[key];var note=el.querySelector('.stat-source');
    if(note)note.innerHTML=copy+' <a href="'+m.url+'" target="_blank" rel="noopener noreferrer">'+m.source+' ↗</a>';
  }
  root.VISUAL_CHARTS={
    initReasoningChart:function(){
      var el=frame('reasoningChart'),canvas=document.getElementById('reasoningChart'),c,full=false;
      if(!el||!canvas)return;
      el.classList.add('compute-picture');
      var h=el.querySelector('h3,h4');if(h)h.textContent='Training did not disappear. It changed shape.';
      source(el,'computeMix','Anthropic + OpenAI combined. September 13 analyst model; both Q3 and Q4 2026 are estimates, not company disclosures.');
      var controls=document.createElement('div');controls.className='compute-controls';
      controls.innerHTML='<span>OpenAI + Anthropic · modeled share of lab compute capacity</span><button type="button" class="evidence-switch" aria-pressed="false">Full timeline</button>';
      el.insertBefore(controls,canvas);
      var plot=document.createElement('div');plot.className='compute-plot';canvas.before(plot);plot.appendChild(canvas);
      var note=document.createElement('p');note.className='compute-caption';
      note.textContent='A smaller pretraining share does not prove falling absolute pretraining compute. Percentages are modeled; rounding can prevent exact 100% sums.';
      el.appendChild(note);
      controls.querySelector('button').addEventListener('click',function(e){full=!full;e.currentTarget.textContent=full?'Key quarters':'Full timeline';e.currentTarget.setAttribute('aria-pressed',String(full));if(c){c.destroy();c=new Chart(canvas,EVIDENCE_VISUALS.computeConfig(full));}});
      whenVisible(canvas,function(){c=new Chart(canvas,EVIDENCE_VISUALS.computeConfig(full));});
    },
    initCapexChart:function(){
      var canvas=document.getElementById('capexChart');if(!canvas)return;
      var active=new Set(root.NARRATIVE_DATA.capex.map(function(d){return d.key;})),showRange=false,c;
      var container=canvas.closest('.capex-explorer');
      var oracle=container.querySelector('[data-company="oracle"]');
      if(oracle){
        oracle.classList.remove('active');oracle.title='Different fiscal-year scope; click for why it is excluded.';var v=oracle.querySelector('.tog-val');if(v)v.textContent='FY scope';
        var scope=document.createElement('p');scope.className='compute-caption';scope.hidden=true;scope.textContent='Oracle uses a different fiscal-year reporting period. Its figure is not added to this selected-four calendar-year guidance comparison.';
        oracle.parentElement.after(scope);oracle.setAttribute('aria-expanded','false');
        oracle.addEventListener('click',function(){scope.hidden=!scope.hidden;oracle.setAttribute('aria-expanded',String(!scope.hidden));});
      }
      var gap=document.getElementById('gapToggle');if(gap){var label=container.querySelector('.gap-label');if(label)label.textContent='Show published guidance ranges';gap.addEventListener('change',function(){showRange=gap.checked;update();});}
      var colors=['#4CB5AB','#2280D6','#F3B7A8','#FFD821'];
      function data(){
        var rows=root.NARRATIVE_DATA.capex,ds=[{label:showRange?'Published guidance range ($B)':'2026 guidance midpoint ($B)',data:rows.map(function(d){return active.has(d.key)?(showRange?[d.low,d.high]:d.mid):null;}),backgroundColor:colors,borderWidth:0}];
        if(showRange)ds.push({type:'line',label:'Point guidance ($B)',showLine:false,pointRadius:5,pointBackgroundColor:'#FFFFFF',data:rows.map(function(d){return active.has(d.key)&&d.low===d.high?d.mid:null;})});
        return {labels:rows.map(function(d){return d.name;}),datasets:ds};
      }
      function update(){
        var sum=root.NARRATIVE_DATA.capex.filter(function(d){return active.has(d.key);}).reduce(function(n,d){return n+d.mid;},0);
        document.getElementById('capexTotalNum').textContent='$'+sum.toLocaleString('en-US',{maximumFractionDigits:1})+'B';
        if(c){c.data=data();c.update();}
      }
      container.querySelectorAll('[data-company]:not([data-company="oracle"])').forEach(function(b){b.setAttribute('aria-pressed','true');b.addEventListener('click',function(){var k=b.dataset.company;active.has(k)?active.delete(k):active.add(k);b.classList.toggle('active',active.has(k));b.setAttribute('aria-pressed',String(active.has(k)));update();});});
      source(container,'capexTotal','Selected four, calendar 2026 issuer guidance; $720–745B combined range. Different accounting scopes, not AI-only spending.');
      whenVisible(canvas,function(){c=new Chart(canvas,{type:'bar',data:data(),options:options('B')});});
      update();
    },
    initEnergyChart:function(){
      source(frame('energyChart'),'energy2025','IEA: all global data centers. 2025 actual; 2030 forecast. No interpolated observations.');
      chart('energyChart',{type:'bar',data:{labels:['2025 · actual','2030 · forecast'],datasets:[{label:'Global data-center electricity (TWh)',data:[485,950],backgroundColor:['#4CB5AB','rgba(76,181,171,.25)'],borderColor:'#4CB5AB',borderWidth:1}]},options:options(' TWh')});
    },
    initPhysicalChart:function(){
      var el=frame('pai-fsd-chart');
      if(el){var h=el.querySelector('h4');if(h)h.textContent='Deployment is not the same as supervised testing';var p=el.querySelector('.pai-chart-annotation');if(p)p.innerHTML='Waymo: <strong>~500,000 paid rides per week</strong> at the March 27 disclosure. Later market openings do not establish a newer ride tally. <a href="'+M.waymoRides.url+'" target="_blank" rel="noopener noreferrer">Dated disclosure ↗</a>';}
      chart('pai-fsd-chart',{type:'bar',data:{labels:['Waymo · March 2026'],datasets:[{label:'Paid driverless rides per week · dated milestone',data:[500000],backgroundColor:'#4CB5AB'}]},options:options('')});
    }
  };
})(window);
