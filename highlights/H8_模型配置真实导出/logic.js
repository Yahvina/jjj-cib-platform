/* H8 ｜ 一键导出真实结构的模型配置 ｜ 核心逻辑 */

/* ---- index.html 第 909-933 行 ---- */
function preview(){
  const names=Object.keys(sel.desc);
  if(curModel==='gcam'){
    let s='<span class="c">&lt;!-- 平台自动生成 · 写入 configuration.xml 的 ScenarioComponents --&gt;</span>\n';
    s+='<span class="c">&lt;!-- 产出自洽情景：'+(names.length?names.length*0.6|0:0)+' 组，本文件为第 1 组 --&gt;</span>\n';
    s+='&lt;<span class="k">ScenarioComponents</span>&gt;\n';
    names.slice(0,6).forEach(nm=>{
      const d=dOf(nm);
      s+=`  &lt;<span class="k">Value</span> <span class="at">name</span>=<span class="s">"${xmlTag(d)}"</span>&gt;`
        +`${xmlFile(d,names.indexOf(nm))}&lt;/<span class="k">Value</span>&gt;\n`;
    });
    if(names.length>6) s+=`  <span class="c">&lt;!-- 另有 ${names.length-6} 项 --&gt;</span>\n`;
    s+='&lt;/<span class="k">ScenarioComponents</span>&gt;';
    return s;
  }
  let s='<span class="c"># 平台自动生成 · CSV，之后由 GDXXRW.EXE 转为 GDX</span>\n';
  s+='<span class="c"># 对应 run.gms 开头的路径变量与情景开关</span>\n';
  s+='param,scenario,value,unit\n';
  names.slice(0,6).forEach(nm=>{
    const d=dOf(nm), st=(sel.desc[nm].states[0]||'待定');
    s+=`${csvParam(d)},${st},待定,\n`;
  });
  return s;
}
function xmlTag(d){

/* ---- index.html 第 933-977 行 ---- */
function xmlTag(d){
  const n=d.n;
  if(n.indexOf('人口')>=0||n.indexOf('经济增长')>=0) return 'socioeconomics';
  if(n.indexOf('钢铁')>=0) return 'industry_steel';
  if(n.indexOf('单位产品能耗')>=0||n.indexOf('工业节能')>=0) return 'industry_energy';
  if(n.indexOf('建筑能效')>=0||n.indexOf('清洁取暖')>=0) return 'building';
  if(n.indexOf('新能源汽车')>=0) return 'transportation';
  if(n.indexOf('碳移除')>=0) return 'land_cover';
  if(n.indexOf('碳捕集')>=0||n.indexOf('CCUS')>=0) return 'CCS_shrwt';
  if(n.indexOf('碳价')>=0) return 'carbon_tax';
  if(n.indexOf('研发')>=0) return 'tech_change';
  if(n.indexOf('协同')>=0) return 'policy-target-file';
  if(n.indexOf('电力互济')>=0) return 'electricity_trade';
  if(n.indexOf('可再生')>=0) return 'electricity';
  if(n.indexOf('水')>=0) return 'water_demand';
  return 'policy-target-file';
}
function xmlFile(d,i){
  const n=d.n;
  if(n.indexOf('人口')>=0||n.indexOf('经济增长')>=0) return '../input/gcamdata/xml/socioeconomics_CHINA_SSP2.xml';
  if(n.indexOf('钢铁')>=0) return '../input/gcamdata/xml/industry_steel_CHINA.xml';
  if(n.indexOf('单位产品能耗')>=0||n.indexOf('工业节能')>=0) return '../input/gcamdata/xml/industry_CHINA.xml';
  if(n.indexOf('建筑能效')>=0||n.indexOf('清洁取暖')>=0) return '../input/gcamdata/xml/building_CHINA.xml';
  if(n.indexOf('新能源汽车')>=0) return '../input/gcamdata/xml/transportation_CHINA.xml';
  if(n.indexOf('碳移除')>=0) return '../input/gcamdata/xml/land_cover_CHINA.xml';
  if(n.indexOf('碳捕集')>=0||n.indexOf('CCUS')>=0) return '../input/gcamdata/xml/CCS_shrwt_CHINA.xml';
  if(n.indexOf('碳价')>=0) return '../input/policy/carbon_tax_'+((i%3)+1)+'.xml';
  if(n.indexOf('研发')>=0) return '../input/gcamdata/xml/resources_CHINA.xml';
  if(n.indexOf('协同')>=0) return '../input/policy/forcing_target_4p5.xml';
  if(n.indexOf('电力互济')>=0||n.indexOf('可再生')>=0) return '../input/gcamdata/xml/electricity_CHINA.xml';
  if(n.indexOf('水')>=0) return '../input/gcamdata/xml/water_demand_industry.xml';
  return '../input/policy/carbon_tax_'+((i%3)+1)+'.xml';
}
function csvParam(d){ return d.v.split(/[；;]/)[0].trim().slice(0,32).replace(/\s/g,'_'); }
function download(){ dl(preview().replace(/<[^>]+>/g,''), curModel==='gcam'?'xml':'csv','JJJ-CIB-情景1'); }
function downloadAll(){ dl('（原型 v1.0 示意）共 '+Math.max(1,(nSel()*0.6|0))+' 组自洽情景，此处为打包占位。',
  'txt','JJJ-CIB-全部自洽情景'); }
function dl(txt,ext,name){
  const clean=txt.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&amp;/g,'&');
  const b=new Blob([clean],{type:'text/plain;charset=utf-8'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(b); a.download=name+'.'+ext; a.click();
  toast('已导出 '+name+'.'+ext);
}
function fmtTag(){ return curModel==='gcam'?'configuration.xml':'CSV → GDX'; }

/* ---- index.html 第 977-978 行 ---- */
function fmtTag(){ return curModel==='gcam'?'configuration.xml':'CSV → GDX'; }
function finalSum(){
