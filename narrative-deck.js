(function() {
  'use strict';
  var slides=Array.from(document.querySelectorAll('.slide')),index=0;
  var reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  function activate(i) {
    index=Math.min(slides.length-1,Math.max(0,i));
    document.body.classList.toggle('is-cover',index===0);
    slides.forEach(function(s,k){s.classList.toggle('is-active',k===index);s.setAttribute('aria-hidden',String(k!==index));s.inert=k!==index;});
    document.getElementById('slideNum').textContent=index+1;
    document.getElementById('progressFill').style.width=((index+1)/slides.length*100)+'%';
    document.getElementById('deckChapter').textContent=slides[index].dataset.chapter||'State of AI';
    document.getElementById('deckPrev').disabled=index===0;
    document.getElementById('deckNext').disabled=index===slides.length-1;
    history.replaceState(null,'','#s'+(index+1));
    if (window.gsap) { if(window.__narrativeOpenerTimeline)window.__narrativeOpenerTimeline.kill();gsap.killTweensOf('#slide-2 *'); }
    if(index===1&&window.NARRATIVE_OPENER)window.NARRATIVE_OPENER();
    if(index===0&&window.gsap&&!reduced.matches)gsap.fromTo('.cover-block',{scaleY:.02,transformOrigin:'bottom'},{scaleY:1,stagger:.07,duration:.75,ease:'power3.out'});
  }
  function next(){activate(index+1);}function prev(){activate(index-1);}
  document.getElementById('deckNext').addEventListener('click',next);
  document.getElementById('deckPrev').addEventListener('click',prev);
  var begin=document.getElementById('deckBegin');if(begin)begin.addEventListener('click',next);
  var present=document.getElementById('fsToggle');
  function togglePresent(value){var active=value==null?!document.body.classList.contains('is-presenting'):value;document.body.classList.toggle('is-presenting',active);present.setAttribute('aria-pressed',String(active));present.textContent=active?(innerWidth<=768?'Exit':'Exit presentation'):'Present';}
  present.addEventListener('click',function(){togglePresent();});
  document.addEventListener('keydown',function(e){
    if(document.querySelector('dialog[open]')||e.target.closest('input,select,textarea,[contenteditable]'))return;
    if(e.key==='ArrowRight'||e.key==='PageDown'||(e.key===' '&&e.target===document.body)){e.preventDefault();next();}
    if(e.key==='ArrowLeft'||e.key==='PageUp'){e.preventDefault();prev();}
    if(e.key==='Home'){e.preventDefault();activate(0);}
    if(e.key==='End'){e.preventDefault();activate(slides.length-1);}
    if(e.key.toLowerCase()==='f')togglePresent();
    if(e.key==='Escape')togglePresent(false);
  });
  var touch=null;
  document.getElementById('deck').addEventListener('touchstart',function(e){if(e.target.closest('button,a,summary'))return;touch=e.touches[0]&&{x:e.touches[0].clientX,y:e.touches[0].clientY};},{passive:true});
  document.getElementById('deck').addEventListener('touchend',function(e){if(!touch)return;var t=e.changedTouches[0],dx=t.clientX-touch.x,dy=t.clientY-touch.y;touch=null;if(Math.abs(dx)>80&&Math.abs(dx)>Math.abs(dy)*1.5)(dx<0?next:prev)();},{passive:true});
  window.addEventListener('hashchange',function(){var m=location.hash.match(/^#s(\d+)$/);if(m&&+m[1]-1!==index)activate(+m[1]-1);});
  if(window.ATTACK_ANGLES)window.ATTACK_ANGLES.renderStage('deck-attack-angles');
  if(window.SERVICES_MATRIX)window.SERVICES_MATRIX.render('deck-services-map');
  if(window.bindExplorerTips)window.bindExplorerTips(document);
  var m=location.hash.match(/^#s(\d+)$/);activate(m?+m[1]-1:0);
  window.__deck={activate:activate,next:next,prev:prev,get index(){return index;},get total(){return slides.length;}};
})();
