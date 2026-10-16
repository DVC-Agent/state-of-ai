/* Synchronize recurring explorer headlines with the same evidence records as the report and deck.
 * Dollar-flow models retain their historical inputs and are not re-inflated to the current year.
 */
(function(root){
  'use strict';
  var M=root.NARRATIVE_DATA.metrics;
  function bind(data,label,key) {
    var s=data.headlineStats.find(function(s){return s.label===label;});
    if(!s)return;
    var m=M[key];s.value=m.display;s.src=m.url;s.sub=m.period+'. '+m.qualifier;s.metricKey=key;
  }
  if(root.HEALTHCARE_DATA) {
    bind(root.HEALTHCARE_DATA,'US national health expenditure','healthSpending');
    bind(root.HEALTHCARE_DATA,'Self-reported healthcare AI ROI','healthRoi');
    // This tile reports only the group forecast; the combined record states both populations.
    var t=root.HEALTHCARE_DATA.headlineStats.find(function(s){return s.label==='2027 medical cost trend forecast';});
    if(t){t.value=M.healthTrend.display;t.sub=M.healthTrend.period+'. '+M.healthTrend.qualifier;t.src=M.healthTrend.url;t.metricKey='healthTrend';}
  }
  if(root.ROBOTICS_DATA) {
    bind(root.ROBOTICS_DATA,'Industrial robots installed','robotInstalls');
    bind(root.ROBOTICS_DATA,'China share of installs','robotChina');
    bind(root.ROBOTICS_DATA,'Industrial robots in operation','robotStock');
  }
  if(root.INDUSTRIAL_DATA) bind(root.INDUSTRIAL_DATA,'Smart manufacturing in use','industrialAdoption');
})(window);
