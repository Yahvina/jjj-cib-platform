/* H3 ｜ 各层差异预览与跨层约束前置 ｜ 核心逻辑
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
    ${on.length>1?('本次参与跨层核对：'+onNames.join(' → ')+'。国家级为给定层，不参与枚举；相邻层级按「档位不反向」核对。')
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

function rangeOf(nm,scope){
  const base=baseOf(nm);
  if(scope==='region') return base;
  const ov=(stateDefsScope[nm]||{})[scope]||{};
  return base.map(x=>{ const o=ov[x.n]; return o?{...x,...o}:{...x}; });
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

const XL_ORDER=['nation','region','prov','city'];

const XL_NAME={nation:'国家级',region:'区域级',prov:'省级',city:'市级'};

function xlayers(){
  const on=[...document.querySelectorAll('[data-scale].sel')].map(x=>x.dataset.scale);
  return XL_ORDER.filter(l=>on.indexOf(l)>=0);
}

const xlAct=()=>xlayers().filter(s=>s!=='nation');

function xlPickOf(nm,scope){
  const act=xlAct(), i=act.indexOf(scope);
  if(i<0) return null;
  if(i===0){                        // 首层＝状态区选的那一档，不另存一份，避免两个真相
    const s=(sel.desc[nm]&&sel.desc[nm].states)||[];
    const j=s.length?ST(nm).indexOf(s[0]):-1;
    return j<0?null:j;
  }
  const p=xlPick[nm]||{};
  return (typeof p[scope]==='number')?p[scope]:null;
}

function xlReason(nm,upScope,ui,dnScope,di){
  if(ui===null||ui===undefined||di===null||di===undefined) return null;
  if(upScope===dnScope) return null;
  const st=ST(nm), un=st[ui], dn=st[di];
  if(un===undefined||dn===undefined) return null;
  const d=Math.abs(ui-di);
  if(d>=2) return '与'+XL_NAME[upScope]+'「'+un+'」方向相差 '+d+' 档';
  const pR=rangeOf(nm,upScope).find(x=>x.n===un);
  const cR=rangeOf(nm,dnScope).find(x=>x.n===dn);
  if(pR&&cR&&pR.lo!==null&&pR.hi!==null&&cR.lo!==null&&cR.hi!==null
     &&(cR.hi<pR.lo||cR.lo>pR.hi))
    return '与'+XL_NAME[upScope]+'「'+un+'」的取值区间不相交';
  return null;
}

function xlSet(nm,scope,v){
  xlPick[nm]=xlPick[nm]||{};
  if(v==='') delete xlPick[nm][scope]; else xlPick[nm][scope]=+v;
  /* 上层变了，下层原选可能已不相容——清掉并说清原因，不静默改档 */
  const act=xlAct(), i=act.indexOf(scope);
  let dropped=null;
  for(let k=i+1;k<act.length;k++){
    const dn=act[k], cur=xlPickOf(nm,dn);
    if(cur===null) continue;
    if(xlReason(nm,scope,xlPickOf(nm,scope),dn,cur)){
      dropped=XL_NAME[dn]+'原选的「'+ST(nm)[cur]+'」';
      delete xlPick[nm][dn];
    }
  }
  cimResult=null; BAYES=null; layeredResult=null; corrResult=null; profResult=null;
  render();
  toast(dropped?(XL_NAME[scope]+'改动后，'+dropped+'已不相容，已清空请重选'):'已记录'+XL_NAME[scope]+'档位');
}

function xlPickHTML(nm){
  const act=xlAct();
  if(act.length<2) return '';
  let h='';
  for(let i=1;i<act.length;i++){
    const scope=act[i], up=act[i-1];
    const ui=xlPickOf(nm,up), cur=xlPickOf(nm,scope);
    const tip=ui===null
      ? '先在'+XL_NAME[up]+'选一档，这里会按它筛出可用的档位。'
      : XL_NAME[up]+'已定「'+ST(nm)[ui]+'」：与它方向相差 ≥2 档、或取值区间不相交的档位已置灰。';
    h+='<div class="xlrow"><span class="xllb">'+XL_NAME[scope]+'</span>'
      +'<select class="txt xlsel" onchange="xlSet(\''+nm+'\',\''+scope+'\',this.value)">'
      +'<option value="">（不指定）</option>'
      +ST(nm).map((s,j)=>{
        const why=(ui===null)?null:xlReason(nm,up,ui,scope,j);
        return '<option value="'+j+'"'+(cur===j?' selected':'')
          +(why?' disabled':'')+'>'+s+(why?'（'+why+'，不可选）':'')+'</option>';
      }).join('')
      +'</select>'
      +'<span class="tip" tabindex="0" data-tip="'+attrEsc(tip)+'">?</span></div>';
  }
  return h;
}

function allowUnder(ds,scope,parent){
  return ds.map(d=>{
    const sizes=ST(d).length;
    if(!parent) return [...Array(sizes).keys()];
    const pi=parent.cb[ds.indexOf(d)];
    const pName=ST(d)[pi];
    const pR=rangeOf(d,parent.scope).find(x=>x.n===pName);
    const cDefs=rangeOf(d,scope);
    const ok=[];
    for(let j=0;j<sizes;j++){
      const c=cDefs[j];
      if(!pR||pR.lo===null||pR.hi===null||c.lo===null||c.hi===null){ ok.push(j); continue; }
      if(c.hi < pR.lo || c.lo > pR.hi) continue;     // 与上级区间不相交，直接排除
      ok.push(j);
    }
    return ok;
  });
}
