/* H8 ｜ 四种形态的导出（配置／参数表／叙事／后验） ｜ 核心逻辑
   摘自 _src/v15/src/app.js，按声明整段切出，未作改写。
   下面每个函数在 app.js 里的位置见本目录 README。 */

const GEN_LABEL={config:'模型配置文件',table:'结构化参数表',narrative:'定性叙事',bayes:'贝叶斯概率分布'};

function genOf(){ return (genMode==='bayes'||useBayes)?'bayes':genMode; }

function genName(){ return GEN_LABEL[genOf()]; }

let expMode='mid';   // low=区间下界（保守） / mid=中点 / high=上界（加码）
function paramOf(d){
  const v=String((d&&d.v)||'').split(/[；;]/)[0].trim();
  return v||'（该描述符未注明模型变量）';
}

function expRows(){
  const names=expNames();
  return names.map(nm=>{
    const d=dOf(nm); if(!d) return null;
    /* 配置模式的 sel.desc.states 是有意留空的（空＝全档，见 cfgSyncToResearch），
       真正「你选的那组」在 cfgPick；研究模式仍按勾选的第一档。 */
    const st=(viewMode==='config'&&cfgPick[nm])?cfgPick[nm]:((sel.desc[nm].states||[])[0]||'');
    const defs=defsOf(nm), def=defs.filter(x=>x.n===st)[0]||null;
    const lo=(def&&def.lo!=null)?def.lo:null;
    const hi=(def&&def.hi!=null)?def.hi:null;
    const u=(def&&def.u)||'';
    let val=null;
    if(lo!=null||hi!=null){
      const L=(lo!=null?lo:hi), H=(hi!=null?hi:lo);
      val = expMode==='low'?L:(expMode==='high'?H:(L+H)/2);
      val=Math.round(val*1000)/1000;
    }
    return {desc:nm, param:paramOf(d), scope:rngScope||'region', year:2035, state:st,
      value:val, lo:lo, hi:hi, unit:u, ev:(def&&def.ev)||'',
      note: val==null?'该状态未定义数值区间，需人工给值':''};
  }).filter(Boolean);
}

function expLabel(){ return expMode==='low'?'区间下界（保守）':(expMode==='high'?'区间上界（加码）':'区间中点'); }

function multiPickNote(){
  const names=Object.keys(sel.desc).filter(nm=>selIdxOf(nm).length>1);
  if(!names.length) return '';
  return '注意：'+names.map(nm=>DSHORT[nm]||nm).join('、')+' 勾了多档（＝划定范围），'
    +'下面按每档的<b>第一档</b>取值导出。要按整个范围导出，请用「导出全部自洽情景」；'
    +'要导出某一档，请在该描述符下只勾那一档。';
}

function csvCell(v){
  const t=(v==null?'':String(v));
  return /[",\n]/.test(t)?('"'+t.replace(/"/g,'""')+'"'):t;
}

function paramOf(d){
  const v=String((d&&d.v)||'').split(/[；;]/)[0].trim();
  return v||'（该描述符未注明模型变量）';
}

function paramsCSV(){
  const rows=expRows();
  let s='# 参数表 · 平台自动生成\n';
  s+='# 判断来源：'+cfgSrcLabel()+'\n';
  s+='# 取档方式：'+expLabel()+'；值只覆盖 2035 锚点，2025/2030 需按政策里程碑插值\n';
  s+='descriptor,param,scope,year,value,low,high,unit,state,evidence,note\n';
  rows.forEach(r=>{
    s+=[csvCell(r.desc),csvCell(r.param),csvCell(r.scope),r.year,
        r.value==null?'':r.value,r.lo==null?'':r.lo,r.hi==null?'':r.hi,csvCell(r.unit),
        csvCell(r.state),csvCell(r.ev),csvCell(r.note)].join(',')+'\n';
  });
  const mp=expNames().filter(nm=>selIdxOf(nm).length>1);
  if(mp.length){
    s+='# 注意：'+mp.map(nm=>nm).join('、')+' 勾了多档（＝划定范围），本表按每档的第一档取值。\n';
    s+='# 要按整个范围导出，请用「导出全部自洽情景」。\n';
  }
  return s;
}

function setExpMode(v){ expMode=v; render(); }

function downloadParams(){ dl(paramsCSV(),'csv','JJJ-CIB-参数表'); }

function downloadParamsBtn(){ downloadParams(); }

function narrText(){
  const rows=expRows();
  if(!rows.length) return '（还没有选描述符）';
  const sc=rows.map(r=>r.state).filter(Boolean);
  const note=multiPickNote();
  let s='【来源】\n'+provLines().join('\n')+'\n\n'
    +'【情景特征】\n本情景在'+rows.length+'个描述符上取了'+sc.length+'档，构成一组自洽的政策情景假设。'
    +'判断来自：'+cfgSrcLabel()+'。\n\n';
  if(note) s+='【注意】'+note.replace(/<[^>]+>/g,'')+'\n\n';
  s+='【逐项特征】\n';
  rows.forEach(r=>{
    s+='· '+r.desc+'：取「'+r.state+'」档';
    if(r.value==null) s+='（该档未设数值区间，需人工给档）';
    else{
      s+='，对应 '+r.value+(r.unit||'');
      if(r.lo!=null&&r.hi!=null) s+='（区间 '+r.lo+' – '+r.hi+(r.unit||'')+'）';
    }
    s+='。\n';
  });
  s+='\n【说明】\n以上为定性描述，不含模型可读的数值参数；要落到下游模型请改用「模型配置文件」或「结构化参数表」。';
  return s;
}

function bayesCSV(){
  if(!BAYES) computeBayes();
  const all=(BAYES&&BAYES.cells)?Object.keys(BAYES.cells):[];
  /* 只有配置模式才裁到本次参与集：那里载入 15 个变量后会把 210 对后验一并导出，
     跟结果页「本次 3 个变量」对不上。研究模式的贝叶斯表本来是全域的，保持原样。 */
  const names=(viewMode==='config'&&cimResult&&cimResult.ds&&cimResult.ds.length)?cimResult.ds:null;
  const keys=names?all.filter(k=>{
    const i=k.indexOf('>'); if(i<0) return true;
    return names.indexOf(k.slice(0,i))>=0 && names.indexOf(k.slice(i+1))>=0;
  }):all;
  let s='# 贝叶斯后验 · 每条判断的后验分布\n';
  provLines().forEach(l=>{ s+='# '+l+'\n'; });
  s+='# 先验 N(0, '+2.2+'²)，按置信度给噪声（高 .55 / 中 .85 / 低 1.25），网格积分得后验\n';
  s+='pair,observations,posterior_mean,sd,p05,p95,width,p_promote,p_suppress,p_flat\n';
  keys.forEach(k=>{
    const c=BAYES.cells[k];
    s+=[csvCell(k),c.n,c.mean.toFixed(3),c.sd.toFixed(3),c.lo.toFixed(3),c.hi.toFixed(3),
        (c.hi-c.lo).toFixed(3),c.pPos.toFixed(3),c.pNeg.toFixed(3),c.pFlat.toFixed(3)].join(',')+'\n';
  });
  return s;
}

function curScenInfo(){
  const ds=expNames();
  if(ds.length<2) return null;
  const sc=checkSelected(ds);
  if(sc.missing) return null;
  let idx=-1;
  if(cimResult&&cimResult.consistent){
    const key=sc.cb.join(',');
    idx=cimResult.consistent.findIndex(cb=>cb.join(',')===key);
  }
  return {id:'CUR'+(idx>=0?('-S'+(idx+1)):''), idx:idx, ok:sc.ok, n:ds.length};
}

function tableCSV(){
  const rows=expRows();
  const info=curScenInfo();
  let s='# 结构化参数表 · 平台自动生成\n';
  provLines().forEach(l=>{ s+='# '+l+'\n'; });
  s+='# 值只覆盖 2035 锚点\n';
  s+='# 同一 scenario 内的参数构成一组自洽组合；跨 scenario 混用会破坏一致性。\n';
  if(info){
    s+='# 本表全部行同属 '+info.id+'（'+info.n+' 个描述符的当前选择）';
    s+=info.idx>=0?('，已与一致性检验的第 '+(info.idx+1)+' 组自洽情景对上'):'，未出现在自洽情景清单中';
    s+='。\n';
    if(!info.ok){
      s+='# 注意：这组选择本身不自洽——至少有一个描述符的选定状态不是它的最高分。\n';
      s+='# 取用前请回到平台「检验与导出」核对，或改用清单里的某一组自洽情景。\n';
    }
  }else{
    s+='# 尚未选出足够的描述符，无法判定这组参数是否自洽。\n';
  }
  s+='scenario,param,value\n';
  rows.forEach(r=>{
    if(r.value==null) return;                  // 没数值的不进参数表，另行列出
    s+=[(info?info.id:'CUR'),csvCell(r.param),r.value].join(',')+'\n';
  });
  return s;
}

function genMain(){                              // 主按钮：按形态走
  const g=genOf();
  if(g==='bayes') dl(bayesCSV(),'csv','JJJ-CIB-贝叶斯后验');
  else if(g==='table') dl(tableCSV(),'csv','JJJ-CIB-结构化参数表');
  else if(g==='narrative') dl(narrText(),'txt','JJJ-CIB-情景叙事');
  else download();
}

function genMainLabel(){
  const g=genOf();
  return g==='bayes'?'导出贝叶斯后验'
    :g==='table'?'导出结构化参数表'
    :g==='narrative'?'导出情景叙事'
    :(curModel==='gcam'?'导出 XML 配置文件':'导出 CHEER 参数 CSV');
}

function genSubHTML(){                           // 副按钮：该形态下还该给什么
  const g=genOf();
  let h='';
  if(g!=='bayes') h+='<button class="btn" onclick="downloadParamsBtn()">导出参数表（含依据）</button>';
  if(g!=='table') h+='<button class="btn" onclick="downloadTableBtn()">导出结构化参数表</button>';
  if(g==='bayes'||g==='table') h+='<button class="btn" onclick="downloadAll()">导出全部自洽情景</button>';
  else h+='<span style="display:inline-flex;align-items:center;gap:6px;font-size:13px;color:var(--tx2);">'
    +'取档方式<select class="txt" style="width:auto;height:32px;" onchange="setExpMode(this.value)">'
    +'<option value="low"'+(expMode==='low'?' selected':'')+'>区间下界（保守）</option>'
    +'<option value="mid"'+(expMode==='mid'?' selected':'')+'>区间中点</option>'
    +'<option value="high"'+(expMode==='high'?' selected':'')+'>区间上界（加码）</option>'
    +'</select></span>';
  return h;
}

function renderOutBtns(){
  const box=document.getElementById('outBtns'); if(!box) return;
  box.innerHTML='<button class="btn pri" onclick="genMain()">'+genMainLabel()+'</button>'+genSubHTML();
}

function syncGenOpts(){                          // 载入存档后把高亮拉回 genMode 那一档
  const cur=genOf();
  document.querySelectorAll('[data-gen]').forEach(x=>{
    const on=(x.dataset.gen===cur);
    x.classList.toggle('sel',on);
    const c=x.querySelector('.chk'); if(!c) return;
    c.classList.toggle('on',on); c.innerHTML=on?TICK:'';
  });
}

function renderGenOut(){
  const g=genOf();
  syncGenOpts();
  const tag=document.getElementById('fmtTag'), note=document.getElementById('fmtNote'), pv=document.getElementById('outPreview');
  if(g==='narrative'){
    if(tag) tag.textContent='TXT';
    if(note) note.textContent='定性叙事：只说每个描述符取哪一档、大致落在什么范围，不含下游模型可直接读取的数值参数。';
    if(pv) pv.textContent=narrText();
  }else if(g==='bayes'){
    if(tag) tag.textContent='CSV（后验）';
    if(note) note.textContent='贝叶斯后验：每条交叉影响判断的先验—似然—后验过程与 90% 可信区间。'+(BAYES?('共 '+BAYES.n+' 条判断。'):'尚未运行，请先在第 7 步完成打分。');
    if(pv) pv.textContent=bayesCSV();
  }else if(g==='table'){
    if(tag) tag.textContent='CSV（参数）';
    if(note) note.textContent='结构化参数表：只给参数名与数值，取档方式见导出的表头注释。数值只覆盖 2035 锚点。';
    if(pv) pv.textContent=tableCSV();
  }else{
    if(tag) tag.textContent=fmtTag();
    if(note) note.textContent=curModel==='gcam'
      ? '按 GCAM-China 的 configuration.xml 结构书写：ScenarioComponents 区块内，以 Value 的 name 属性指向参数项，元素内容为文件相对路径。'
      : '按 CHEER-CGE 的接口书写：CSV 覆盖 run.gms 中的路径变量与情景开关，之后用 GDXXRW.EXE 转为 GDX。';
    if(pv) pv.textContent=preview().replace(/<[^>]+>/g,'');
  }
  renderOutBtns();
}

function preview(){
  const rows=expRows();
  if(curModel==='gcam'){
    let s='<span class="c">&lt;!-- 平台自动生成 · 写入 configuration.xml 的 ScenarioComponents --&gt;</span>\n';
    s+='<span class="c">&lt;!-- 取档方式：'+expLabel()+'；年份锚点 2035；参数值见同目录的参数表 CSV --&gt;</span>\n';
    s+='<span class="c">&lt;!-- '+rows.map(r=>r.desc+' → '+r.param+' = '+(r.value==null?'待人工给值':(r.value+' '+(r.unit||'')))).join('；')+' --&gt;</span>\n';
    const known=[], unknown=[];
    rows.forEach((r,ri)=>{
      const d=dOf(r.desc), f=xmlFile(d,ri);
      (f?known:unknown).push({r:r,d:d,f:f});
    });
    s+='&lt;<span class="k">ScenarioComponents</span>&gt;\n';
    known.slice(0,8).forEach(x=>{
      s+='  &lt;<span class="k">Value</span> <span class="at">name</span>=<span class="s">"'+xmlTag(x.d)+'"</span>&gt;'
        +x.f+'&lt;/<span class="k">Value</span>&gt;\n';
    });
    if(known.length>8) s+='  <span class="c">&lt;!-- 另有 '+(known.length-8)+' 项已确认 --&gt;</span>\n';
    s+='&lt;/<span class="k">ScenarioComponents</span>&gt;';
    if(unknown.length){
      s+='\n<span class="c">&lt;!-- 以下 '+unknown.length+' 个描述符平台无法确定装配文件，需人工补齐：'
        +unknown.map(x=>x.r.desc+'（'+x.r.param+'）').join('；')+' --&gt;</span>';
    }
    return s;
  }
  let s='<span class="c"># 平台自动生成 · CSV，之后由 GDXXRW.EXE 转为 GDX</span>\n';
  s+='<span class="c"># 取档方式：'+expLabel()+'；年份锚点 2035</span>\n';
  s+='param,scenario,value,unit,low,high,state,scope,year,note\n';
  rows.forEach(r=>{
    s+=[csvCell(r.param),csvCell(r.state),r.value==null?'':r.value,csvCell(r.unit),
        r.lo==null?'':r.lo,r.hi==null?'':r.hi,csvCell(r.state),r.scope,r.year,csvCell(r.note)].join(',')+'\n';
  });
  return s;
}

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
  return '（需人工确认装配文件）';   // 不静默兜底成碳价文件——宁可标出来
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
  return '';                          // 空字符串=平台不知道该挂哪个文件，导出时单独标出
}

function download(){
  /* 来源块要在剥完标签之后拼：preview() 输出的是带 <span> 高亮的 XML，
     先拼注释会被 /<[^>]+>/ 一起删掉。 */
  const body=preview().replace(/<[^>]+>/g,'');
  const head=provLines().map(l=>'<!-- '+l+' -->').join('\n')+'\n';
  dl(head+body, curModel==='gcam'?'xml':'csv','JJJ-CIB-情景1');
}

function downloadAll(){
  if(!cimResult){ toast('先在第 7 步运行一致性检验'); return; }
  const kds=cimResult.ds;
  let txt='京津冀政策情景快速评估平台 — 自洽情景清单\n'
    +'生成时间：'+nowStr()+'\n'
    +'组合空间：'+cimResult.total+' 种，'+(cimResult.sampled?'随机抽样检查 ':'全枚举 ')
    +cimResult.checked+' 种\n'
    +'自洽情景：'+cimResult.consistent.length+' 组\n\n';
  cimResult.consistent.forEach((cb,i)=>{
    txt+='情景 '+(i+1)+'：'
      +kds.map((d,j)=>d+'＝'+(ST(d)[cb[j]]||'?')).join('；')+'\n';
  });
  dl(txt,'txt','JJJ-CIB-自洽情景清单');
}

function dl(txt,ext,name){
  const clean=txt.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&amp;/g,'&');
  const b=new Blob([clean],{type:'text/plain;charset=utf-8'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(b); a.download=name+'.'+ext; a.click();
  toast('已导出 '+name+'.'+ext);
}

function fmtTag(){ return curModel==='gcam'?'configuration.xml':'CSV → GDX'; }

function fmtNum(n){
  if(n>=1e8) return (n/1e8).toFixed(1)+' 亿';
  if(n>=1e4) return (n/1e4).toFixed(1)+' 万';
  return String(n);
}
