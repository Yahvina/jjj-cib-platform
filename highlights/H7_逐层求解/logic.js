/* H7 ｜ 逐层求解（下沉为折叠段） ｜ 核心逻辑
   摘自 _src/v15/src/app.js，按声明整段切出，未作改写。
   下面每个函数在 app.js 里的位置见本目录 README。 */

const LAYER_BUDGET=250000, LAYER_KEEP=80000;

function solveLayer(ds, scope, parents, cap){
  cap=cap||600;
  const sizes=ds.map(d=>ST(d).length);
  const IMP=buildIMP(ds,cim);
  const groups=(parents&&parents.length)?parents:[{path:[],scope:null,cb:null}];
  const space=sizes.reduce((a,b)=>a*b,1);
  const N=Math.min(space,LAYER_BUDGET);
  const sampled=space>N;
  const rnd=sampled?mulberry(20261017):null;
  const rr=mulberry(7);              // 蓄水池抽样用：超出保留上限时等概率替换，避免字典序偏置
  const consist=[]; let kept=0;
  let checked=0, incon=0;
  for(let c=0;c<N;c++){
    let x=sampled?Math.floor(rnd()*space):c;
    const cb=new Array(ds.length);
    for(let i=ds.length-1;i>=0;i--){ cb[i]=x%sizes[i]; x=Math.floor(x/sizes[i]); }
    checked++;
    if(evalCombo(IMP,sizes,cb)){
      kept++;
      if(consist.length<LAYER_KEEP) consist.push(cb);
      else{ const j=Math.floor(rr()*kept); if(j<LAYER_KEEP) consist[j]=cb; }
    }
    else incon++;
  }
  const depth=Math.min(3,ds.length);
  const buckets=new Map();
  consist.forEach(cb=>{
    let k=0;
    for(let i=0;i<depth;i++) k=k*sizes[i]+cb[i];
    let b=buckets.get(k); if(!b){ b=[]; buckets.set(k,b); }
    b.push(cb);
  });
  const out=[]; let dead=0, trunc=false;
  groups.forEach(par=>{
    /* 上级的 scope/cb 挂在本组 path 的最后一节——v1.3 之前这里读的是顶层字段，
       链式层级时恒为 undefined，上级约束从未真正传进 allowUnder（旧测试全零矩阵
       恰好掩盖了它）。现在统一从 path 末节取。 */
    const tail=(par.path&&par.path.length)?par.path[par.path.length-1]:null;
    const pscope=par.scope||(tail?tail.scope:null);
    const pcb=par.cb||(tail?tail.cb:null);
    const allowed=allowUnder(ds,scope,(pscope&&pcb)?{scope:pscope,cb:pcb}:null);
    if(allowed.some(a=>!a.length)){ dead++; return; }
    const am=allowed.map(a=>a.reduce((m,j)=>m|(1<<j),0));
    if(am.some(m=>!m)){ dead++; return; }
    const cands=[];
    const rec=(i,k)=>{
      if(i===depth){ const b=buckets.get(k); if(b) for(let t=0;t<b.length;t++) cands.push(b[t]); return; }
      let m=am[i];
      for(let j=0;m;j++,m>>=1){ if(m&1) rec(i+1,k*sizes[i]+j); }
    };
    rec(0,0);
    for(let t=0;t<cands.length;t++){
      const cb=cands[t];
      let ok=true;
      for(let i=depth;i<ds.length;i++){
        if(!((am[i]>>cb[i])&1)){ ok=false; break; }
      }
      if(!ok) continue;
      if(out.length<cap) out.push({path:par.path.concat([{scope:scope, cb:cb.slice()}])});
      else trunc=true;
    }
  });
  return {sols:out, checked:checked, incon:incon, dead:dead, groups:groups.length,
    truncated:trunc, sampled:sampled, space:space, consistN:kept};
}

function rangeOf(nm,scope){
  const base=baseOf(nm);
  if(scope==='region') return base;
  const ov=(stateDefsScope[nm]||{})[scope]||{};
  return base.map(x=>{ const o=ov[x.n]; return o?{...x,...o}:{...x}; });
}

function solveLayer(ds, scope, parents, cap){
  cap=cap||600;
  const sizes=ds.map(d=>ST(d).length);
  const IMP=buildIMP(ds,cim);
  const groups=(parents&&parents.length)?parents:[{path:[],scope:null,cb:null}];
  const space=sizes.reduce((a,b)=>a*b,1);
  const N=Math.min(space,LAYER_BUDGET);
  const sampled=space>N;
  const rnd=sampled?mulberry(20261017):null;
  const rr=mulberry(7);              // 蓄水池抽样用：超出保留上限时等概率替换，避免字典序偏置
  const consist=[]; let kept=0;
  let checked=0, incon=0;
  for(let c=0;c<N;c++){
    let x=sampled?Math.floor(rnd()*space):c;
    const cb=new Array(ds.length);
    for(let i=ds.length-1;i>=0;i--){ cb[i]=x%sizes[i]; x=Math.floor(x/sizes[i]); }
    checked++;
    if(evalCombo(IMP,sizes,cb)){
      kept++;
      if(consist.length<LAYER_KEEP) consist.push(cb);
      else{ const j=Math.floor(rr()*kept); if(j<LAYER_KEEP) consist[j]=cb; }
    }
    else incon++;
  }
  const depth=Math.min(3,ds.length);
  const buckets=new Map();
  consist.forEach(cb=>{
    let k=0;
    for(let i=0;i<depth;i++) k=k*sizes[i]+cb[i];
    let b=buckets.get(k); if(!b){ b=[]; buckets.set(k,b); }
    b.push(cb);
  });
  const out=[]; let dead=0, trunc=false;
  groups.forEach(par=>{
    /* 上级的 scope/cb 挂在本组 path 的最后一节——v1.3 之前这里读的是顶层字段，
       链式层级时恒为 undefined，上级约束从未真正传进 allowUnder（旧测试全零矩阵
       恰好掩盖了它）。现在统一从 path 末节取。 */
    const tail=(par.path&&par.path.length)?par.path[par.path.length-1]:null;
    const pscope=par.scope||(tail?tail.scope:null);
    const pcb=par.cb||(tail?tail.cb:null);
    const allowed=allowUnder(ds,scope,(pscope&&pcb)?{scope:pscope,cb:pcb}:null);
    if(allowed.some(a=>!a.length)){ dead++; return; }
    const am=allowed.map(a=>a.reduce((m,j)=>m|(1<<j),0));
    if(am.some(m=>!m)){ dead++; return; }
    const cands=[];
    const rec=(i,k)=>{
      if(i===depth){ const b=buckets.get(k); if(b) for(let t=0;t<b.length;t++) cands.push(b[t]); return; }
      let m=am[i];
      for(let j=0;m;j++,m>>=1){ if(m&1) rec(i+1,k*sizes[i]+j); }
    };
    rec(0,0);
    for(let t=0;t<cands.length;t++){
      const cb=cands[t];
      let ok=true;
      for(let i=depth;i<ds.length;i++){
        if(!((am[i]>>cb[i])&1)){ ok=false; break; }
      }
      if(!ok) continue;
      if(out.length<cap) out.push({path:par.path.concat([{scope:scope, cb:cb.slice()}])});
      else trunc=true;
    }
  });
  return {sols:out, checked:checked, incon:incon, dead:dead, groups:groups.length,
    truncated:trunc, sampled:sampled, space:space, consistN:kept};
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

function runLayered(){
  const order=xlayers().filter(s=>s!=='nation');     // 国家级是给定层，不参与枚举
  if(!order.length){ toast('第 1 步至少要勾一个参与求解的层级（区域 / 省 / 市）'); return; }
  const ds=Object.keys(sel.desc);
  const pe=prepErr(ds);
  if(pe){ toast(pe); return; }
  const layers=[]; let parents=null;
  layeredResult=null;
  const step=()=>{
    const scope=order[layers.length];
    setTimeout(()=>{
      const r=solveLayer(ds, scope, parents);
      layers.push({scope:scope, n:r.sols.length, checked:r.checked,
                   incon:r.incon, dead:r.dead, groups:r.groups, truncated:r.truncated,
                   sampled:r.sampled, space:r.space});
      parents=r.sols;
      if(!parents.length||layers.length===order.length){
        layeredResult={ds:ds.slice(), order:order.slice(), layers:layers,
          combos:parents?parents.length:0, final:parents||[], ts:nowStr()};
        render();
        toast('逐层求解完成：'+layers.map(x=>XL_NAME[x.scope]+' '+x.n+' 组'+(x.truncated?'+':'')).join(' → ')
          +(layers.some(x=>x.dead)?('（'+layers.reduce((a,x)=>a+x.dead,0)+' 个上级情景下级无解）'):'')
          +(layers.some(x=>x.sampled)?'　·　大空间层为抽样估计':''));
      }
      else step();
    }, 30);
  };
  step();
}

function renderLay(){
  const host=document.getElementById('layBox'); if(!host) return;
  const ds=Object.keys(sel.desc);
  const order=xlayers().filter(s=>s!=='nation');
  // 没勾多层时这一段没有意义，直接收起整段（连 summary 一起藏），不占读者注意力
  const fold=document.getElementById('layFold');
  const applicable=ds.length>=2&&order.length>=2;
  if(fold) fold.style.display=applicable?'':'none';
  if(!applicable){
    host.innerHTML='';
    if(fold&&/layFold/.test(fold.innerHTML)===false) fold.open=false;
    return;
  }
  if(!layeredResult){
    host.innerHTML='<div style="font-size:13px;line-height:1.85;">'
      +'<b>还没有逐层求解结果。</b>点下面的按钮，平台先解「'+XL_NAME[order[0]]+'」，'
      +'再把每个自洽情景的取值转成下一层的约束，逐层往下推。<br>'
      +'<span class="dim">求解顺序：'+order.map(s=>XL_NAME[s]).join(' → ')+'　·　描述符 '+ds.length+' 个</span>'
      +'<div style="margin-top:12px;"><button class="btn pri" onclick="runLayered()">运行逐层求解</button></div>'
      +'<div class="dim" style="font-size:13px;margin-top:9px;">'
      +'国家级是给定层（取值来自政策目标），不参与枚举；若第 1 步没有勾选区域/省/市中的任何一个，这里无法求解。</div></div>';
    return;
  }
  const R=layeredResult;
  let h='<div class="layflow">';
  R.layers.forEach((L,i)=>{
    h+='<div class="laynode"><div class="ln">'+XL_NAME[L.scope]+'</div>'
      +'<div class="lv">'+L.n.toLocaleString()+(L.truncated?'<i>+</i>':'')+' 组</div>'
      +'<div class="ls">检查 '+L.checked.toLocaleString()+(L.sampled?'（抽样）':'')
      +(L.dead?('　<span class="laywarn">'+L.dead+' 个上级无解</span>'):'')+'</div></div>';
    if(i<R.layers.length-1) h+='<div class="layarrow">→</div>';
  });
  h+='</div>';
  if(R.layers.some(x=>x.sampled)){
    h+='<div class="dim" style="font-size:13px;margin:6px 0 0;">'
      +'标注「抽样」的层组合空间超过 25 万，按固定种子抽样估计（自洽组合数是<b>下限</b>，'
      +'小空间层仍为精确枚举）。</div>';
  }
  h+=kv('最终跨层相容组合', '<span style="color:var(--pri);font-weight:600;">'+R.combos.toLocaleString()
    +(R.layers.some(x=>x.truncated)?'+':'')+' 条</span>', 'margin-top:4px');
  if(R.layers.some(x=>x.truncated)){
    h+='<div class="dim" style="font-size:13px;margin:6px 0 10px;">'
      +'带 + 号的层已达展示上限（600 组），实际数量可能更多。缩小描述符范围可得到完整结果。</div>';
  }
  if(R.combos){
    h+='<div style="margin-top:12px;font-size:13px;color:var(--tx3);">以下为跨层相容的组合，每条都记录了它在各层的取值：</div>';
    h+='<div style="margin-top:8px;">';
    R.final.slice(0,6).forEach((f,i)=>{
      const segs=f.path.map(p=>{
        const t=p.cb.map((v,j)=>(DSHORT[R.ds[j]]||R.ds[j])+'＝'+ST(R.ds[j])[v]).join('、');
        return '<b>'+XL_NAME[p.scope]+'</b>　'+t;
      }).join('<span class="laysep">→</span>');
      h+='<div class="layrow"><span class="layidx">#'+(i+1)+'</span><span>'+segs+'</span></div>';
    });
    h+='</div>';
    if(R.combos>6) h+='<div class="dim" style="font-size:13px;margin-top:7px;">此处显示前 6 条，共 '+R.combos+' 条（上限 600）。</div>';
  }else{
    h+='<div class="note" style="margin-top:10px;">没有找到跨层相容的组合。'
      +'常见原因是上级某层的区间设得比下级宽松太多，导致下级无解——可以切到第 3 步，'
      +'把相应层级的区间调一调，或者换几个描述符再试。</div>';
  }
  h+='<div style="margin-top:12px;display:flex;gap:10px;align-items:center;flex-wrap:wrap;">'
    +'<button class="btn sm" onclick="runLayered()">重新求解</button>'
    +'<span class="dim" style="font-size:13px;">计算时间 '+R.ts+'</span></div>';
  host.innerHTML=h;
}

function buildIMP(ds, M){
  const n=ds.length, sizes=ds.map(d=>ST(d).length), IMP=[];
  for(let k=0;k<n;k++){
    IMP[k]=[];
    for(let i=0;i<n;i++){
      if(k===i){ IMP[k][i]=null; continue; }
      const m=[];
      for(let a=0;a<sizes[k];a++){
        const row=[];
        for(let b=0;b<sizes[i];b++){
          const r=M[ds[k]+'>'+ds[i]];
          let v=0;
          if(r){
            const ov=r.st?r.st[a+'_'+b]:undefined;
            v=(typeof ov==='number')?ov:expandV(r.v,sizes[k],a,sizes[i],b);
          }
          row.push(v);
        }
        m.push(row);
      }
      IMP[k][i]=m;
    }
  }
  return IMP;
}

function evalCombo(IMP, sizes, idx){
  const n=idx.length;
  for(let i=0;i<n;i++){
    let mx=-1e9, pickv=0;
    for(let j=0;j<sizes[i];j++){
      let acc=0;
      for(let k=0;k<n;k++){ if(k!==i) acc+=IMP[k][i][idx[k]][j]; }
      if(j===idx[i]) pickv=acc;
      if(acc>mx) mx=acc;
    }
    if(pickv<mx-1e-6) return false;
  }
  return true;
}

function mulberry(a){
  return function(){
    a|=0; a=a+0x6D2B79F5|0;
    let t=Math.imul(a^a>>>15,1|a);
    t=t+Math.imul(t^t>>>7,61|t)^t;
    return ((t^t>>>14)>>>0)/4294967296;
  };
}

function comboSample(ds, cap, seed){
  const allowed=ds.map(d=>ancAllowed(d));
  if(allowed.some(a=>!a.length)) return {bad:true};
  const radix=allowed.map(a=>a.length);
  const space=radix.reduce((a,b)=>a*b,1);
  const out=[];
  if(space<=cap){
    for(let c=0;c<space;c++){
      let x=c; const idx=new Array(ds.length);
      for(let i=ds.length-1;i>=0;i--){ const r=radix[i]; idx[i]=allowed[i][x%r]; x=Math.floor(x/r); }
      out.push(idx);
    }
  }else{
    const rnd=mulberry(seed||1);
    for(let c=0;c<cap;c++){
      const idx=new Array(ds.length);
      for(let i=0;i<ds.length;i++) idx[i]=allowed[i][Math.floor(rnd()*radix[i])];
      out.push(idx);
    }
  }
  return {combos:out, space:space, sampled:space>cap};
}

function cloneCim(){
  const o={};
  Object.keys(cim).forEach(k=>{
    const c=cim[k]; if(!c) return;
    o[k]={v:c.v, conf:c.conf, rev:c.rev};
    if(c.st) o[k].st=Object.assign({},c.st);
  });
  return o;
}

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

const rngTxt=x=>{
  if(x.lo===null||x.hi===null) return '<span class="rng none">区间未设</span>';
  const f=v=>Number.isInteger(v)?v:String(+v.toFixed(2));
  return `<span class="rng">${f(x.lo)} – ${f(x.hi)}${x.u?' '+x.u:''}</span>`;
};
