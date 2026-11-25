/* Mechanical consolidation of inherited explorer data.
 * Historical model observations stay dated. Editorial change plaques retain only the latest entry.
 */
const fs=require('fs');
for (const [file,name] of [['robotics-data.js','ROBOTICS_DATA'],['industrial-data.js','INDUSTRIAL_DATA']]) {
  require('../'+file);
  const data=globalThis[name];
  const newest=(data.auditLog||[]).map(x=>x.date).sort().at(-1);
  data.auditLog=(data.auditLog||[]).filter(x=>x.date===newest);
  fs.writeFileSync(file,'/* Historical explanatory model. Latest evidence cut October 16, 2026. */\n(function(root){"use strict";var D='+JSON.stringify(data,null,2)+';root.'+name+'=D;})(typeof window!=="undefined"?window:globalThis);\n');
}
