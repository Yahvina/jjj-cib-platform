/* H3 ｜ 各层差异预览 ｜ 核心逻辑
   摘自 _src/v15/src/app.js，按声明整段切出，未作改写。
   下面每个函数在 app.js 里的位置见本目录 README。 */

const LAYERS=[
  {k:'nation', n:'国家级', g:1, pop:'全国常住人口', eco:'全国 GDP 增速', fmt:'总量口径 · 给定'},
  {k:'region', n:'区域级', g:0, pop:'三地合计 10897 万', eco:'三地加权约 5.3%', fmt:'区域合计口径'},
  {k:'prov',   n:'省级',   g:0, pop:'北京 2180 万 / 天津 1363 万 / 河北 7354 万', eco:'5.4% / 4.8% / 5.6%', fmt:'分省口径'},
  {k:'city',   n:'市级',   g:0, pop:'河北 11 个地级市（合计 7354 万）', eco:'按各市公布值', fmt:'分市口径'}
];

function layerTable(){
  const on=[...document.querySelectorAll('[data-scale].sel')].map(x=>x.dataset.scale);
  if(!on.length){ document.getElementById('layerTable').innerHTML=
    '<div style="font-size:13px;color:var(--tx3);">尚未勾选任何层级</div>'; return; }
  let h=`<div class="crow hd" style="grid-template-columns:96px 1fr 1fr 1fr;">
    <div class="clbl" style="font-weight:400;color:var(--tx3);">层级</div>
    <div class="cell">人口（Population）</div><div class="cell">经济（GDP|MER）</div>
    <div class="cell" style="border-right:none;">口径</div></div>`;
  LAYERS.forEach(L=>{
    const active=on.indexOf(L.k)>=0;
    // 未勾选的层不整行压暗（那样读者不知道是不是坏了），只把层名标灰并加一个「未启用」标记
    h+=`<div class="crow" style="grid-template-columns:96px 1fr 1fr 1fr;">
      <div class="clbl"${active?'':' style="color:var(--tx3);"'}>${L.n}${active?'':'<span class="dim" style="font-size:11px;"> （未启用）</span>'}</div>
      <div class="cell">${L.pop}</div><div class="cell">${L.eco}</div>
      <div class="cell" style="border-right:none;">${L.fmt}</div></div>`;
  });
  const onNames=LAYERS.filter(L=>on.indexOf(L.k)>=0).map(L=>L.n);
  h+=`<div class="dim" style="padding:10px 14px 0;font-size:13px;">
    ${on.length>1?('本次参与跨层核对：'+onNames.join(' → ')+'。国家级为给定层，不参与枚举；相邻层级按取值区间核对——上级某档与下级某档区间完全不相交时，该下级档不进枚举。')
      :'只勾了一个层级，不做跨层核对。'}</div>`;
  document.getElementById('layerTable').innerHTML=h;
}

function tglScale(node){
  layeredResult=null;
  node.classList.toggle('sel');
  const c=node.querySelector('.chk');
  c.classList.toggle('on'); c.innerHTML=c.classList.contains('on')?TICK:'';
  render();
}

const rngTxt=x=>{
  if(x.lo===null||x.hi===null) return '<span class="rng none">区间未设</span>';
  const f=v=>Number.isInteger(v)?v:String(+v.toFixed(2));
  return `<span class="rng">${f(x.lo)} – ${f(x.hi)}${x.u?' '+x.u:''}</span>`;
};

const ST=nm=>defsOf(nm)

function defsOf(nm){
  const d=dOf(nm); if(!d) return [];
  if(!stateDefs[nm]){
    const p=RANGE_PRESET[nm]||{}, ek=(RANGE_EVID[nm]||{}).k||'example';
    stateDefs[nm]=d.s.map(s=>{
      const q=p[s];
      return {n:s, lo:q?q[0]:null, hi:q?q[1]:null, u:q?q[2]:'', ev:ek};
    });
    // 该描述符有省级预设的，一并建好覆盖
    const sp=SCOPE_PRESET[nm];
    if(sp){
      stateDefsScope[nm]={};
      Object.keys(sp).forEach(sc=>{
        stateDefsScope[nm][sc]={};
        Object.keys(sp[sc]).forEach(k=>{
          const v=sp[sc][k];
          stateDefsScope[nm][sc][k]={lo:v[0],hi:v[1],u:v[2]};
        });
      });
    }
  }
  if(rngScope==='region') return stateDefs[nm];
  const key=nm+'|'+rngScope;
  if(!scopedDefs[key]){
    const ov=(stateDefsScope[nm]||{})[rngScope]||{};
    scopedDefs[key]=stateDefs[nm].map(x=>{
      const o=ov[x.n];
      return o?{...x, lo:o.lo, hi:o.hi, u:o.u, ev:(o.ev||'scope'), scoped:true}
              :{...x, scoped:false};   // 没有省级口径的，沿用区域级
    });
  }
  return scopedDefs[key];
}
