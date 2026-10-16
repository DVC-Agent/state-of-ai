const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const ctx={};vm.createContext(ctx);
for(const f of ['facts-data.js','narrative-data.js','healthcare-data.js','robotics-data.js','industrial-data.js','services-matrix-data.js'])vm.runInContext(fs.readFileSync(f,'utf8'),ctx);
const D=ctx.NARRATIVE_DATA,M=D.metrics;
assert.equal(D.chapters.length,7);
assert.equal(D.capex.reduce((s,x)=>s+x.mid,0),732.5);
assert.equal(D.capex.reduce((s,x)=>s+x.low,0),720);
assert.equal(D.capex.reduce((s,x)=>s+x.high,0),745);
for(const [k,m] of Object.entries(M)){
  for(const field of ['label','display','period','asOf','url','source','type','qualifier'])assert.ok(m[field],`${k}.${field} missing`);
  assert.match(m.url,/^https:\/\//);
  assert.ok(m.asOf<='2026-10-16',`${k} future evidence date`);
}
for(const d of [ctx.ROBOTICS_DATA,ctx.INDUSTRIAL_DATA]){
  assert.ok(d.auditLog.length);
  assert.ok(d.auditLog.every(x=>x.date===d.auditLog[0].date));
}
for(const d of [ctx.HEALTHCARE_DATA,ctx.ROBOTICS_DATA,ctx.INDUSTRIAL_DATA]){
  for(const l of d.moneyLinksAB.concat(d.moneyLinksBC))assert.ok(Number.isFinite(l.value_b)&&l.value_b>=0,`Invalid flow ${l.id}`);
  for(const n of d.paymentChannels){
    const total=d.moneyLinksAB.filter(l=>l.source===n.id).reduce((s,l)=>s+l.value_b,0);
    if(n.value_b!=null)assert.ok(Math.abs(total-n.value_b)<.05,`Unbalanced buyer ${n.id}`);
  }
  for(const n of d.destinations){
    const a=d.moneyLinksAB.filter(l=>l.target===n.id).reduce((s,l)=>s+l.value_b,0);
    const b=d.moneyLinksBC.filter(l=>l.source===n.id).reduce((s,l)=>s+l.value_b,0);
    assert.ok(Math.abs(a-n.value_b)<.05&&Math.abs(b-n.value_b)<.05,`Unbalanced destination ${n.id}`);
  }
}
for(const r of ctx.SERVICES_MATRIX.rows||[]){
  for(const c of r.contenders||[])assert.ok(!c.f,'Historic funding total leaked into current services map');
}
for(const file of ['index.html','slides.html','whats-new.html']){
  const html=fs.readFileSync(file,'utf8');
  assert.ok(!html.includes('{{'),'Unresolved template token');
  assert.ok(!/aug-stamp|New Aug 3|Updated Aug 4|Earlier lens|recurring patch-notes/i.test(html),'Obsolete update plaque');
  for(const match of html.matchAll(/data-metric="([^"]+)"[^>]*>([^<]+)</g)){
    const [,key,value]=match;
    const decoded=value.replace(/&gt;/g,'>').replace(/&lt;/g,'<').replace(/&amp;/g,'&');
    assert.equal(decoded,M[key].display,`${file} ${key} mismatch`);
  }
}
assert.equal((fs.readFileSync('index.html','utf8').match(/class="narrative-chapter"/g)||[]).length,7);
assert.equal((fs.readFileSync('slides.html','utf8').match(/data-slide="/g)||[]).length,17);
console.log(`PASS: ${Object.keys(M).length} evidence records; 7 report chapters; 17 slides; capex bounds; latest-only explorer logs; bound report/deck/update figures.`);
