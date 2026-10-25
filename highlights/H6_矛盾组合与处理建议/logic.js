/* H6 ｜ 矛盾组合与处理建议（闭环） ｜ 核心逻辑
   摘自 _src/v15/src/app.js，按声明整段切出，未作改写。
   下面每个函数在 app.js 里的位置见本目录 README。 */

function exclPairs(){
  if(!cimResult) return {need:'check'};
  const r=cimResult;
  if(!r.consistent) return {need:'check'};
  if(!r.consistent.length) return {need:'empty'};
  const ds=r.ds, sz=r.sizes, n=ds.length;
  if(n<2) return {need:'few'};
  const cf=coFn(r), alive=aliveTable(r);
  const solo=[];
  ds.forEach((d,i)=>{ for(let a=0;a<sz[i];a++) if(!alive[i][a]) solo.push({i:i,a:a}); });
  const maxF=Math.max(1,r.consistent.length), out=[];
  for(let i=0;i<n;i++) for(let j=i+1;j<n;j++){
    for(let a=0;a<sz[i];a++){
      if(!alive[i][a]) continue;                 // 孤立档位不在"互斥对"里重复计入
      for(let b=0;b<sz[j];b++){
        if(!alive[j][b]) continue;
        if(cf.has(i,a,j,b)) continue;           // 共存过，不是矛盾
        const altA=[], altB=[];
        for(let k=0;k<sz[i];k++) if(k!==a&&alive[i][k]&&cf.has(i,k,j,b)) altA.push(k);
        for(let k=0;k<sz[j];k++) if(k!==b&&alive[j][k]&&cf.has(i,a,j,k)) altB.push(k);
        out.push({i:i, j:j, ai:a, bj:b, altA:altA, altB:altB,
          w:Math.min(freqOf(r,i,a),freqOf(r,j,b))/maxF});
      }
    }
  }
  out.sort((x,y)=>y.w-x.w);
  return {pairs:out, solo:solo, ds:ds, n:n, sampled:r.sampled, nCons:r.consistent.length};
}

function confPairs(){
  if(!cimResult) return {need:'check'};
  const ds=cimResult.ds, cons=cimResult.consistent;
  if(!cons.length) return {need:'empty'};
  const cb=selectedCombo(ds);
  if(cb.some(x=>x<0)) return {need:'missing'};
  const out=[];
  for(let i=0;i<ds.length;i++) for(let j=i+1;j<ds.length;j++){
    const ai=cb[i], bj=cb[j];
    if(cons.some(c=>c[i]===ai&&c[j]===bj)) continue;
    const altA=[], altB=[];
    for(let k=0;k<ST(ds[i]).length;k++){
      if(k!==ai && cons.some(c=>c[i]===k&&c[j]===bj)) altA.push(k);
    }
    for(let k=0;k<ST(ds[j]).length;k++){
      if(k!==bj && cons.some(c=>c[i]===ai&&c[j]===k)) altB.push(k);
    }
    out.push({i:i,j:j,ai:ai,bj:bj,altA:altA,altB:altB});
  }
  return {pairs:out, ds:ds, sampled:cimResult.sampled, n:cons.length};
}

function confList(){
  const r=exclPairs();
  if(r.need==='check'){
    el('confList','<div class="dim" style="line-height:1.9;">矛盾是从<b>检验结果</b>里算出来的，先运行一致性检验。'
      +'<div style="margin-top:10px;"><button class="btn sm pri" onclick="runCIM()">运行一致性检验</button></div></div>');
    return;
  }
  if(r.need==='empty'){
    el('confList','<div class="dim">当前没有任何自洽情景，无法判断“哪两个状态不能并存”。先复核打分矩阵，或放宽锚定后重跑检验。</div>');
    return;
  }
  if(r.need==='few'){
    el('confList','<div class="dim">至少选两个描述符才能判断“哪两档不能并存”。</div>');
    return;
  }
  const solo=(r.solo||[]);
  let head='';
  if(solo.length){
    head='<div class="soloBox"><b>孤立档位（'+solo.length+' 个）</b>：'
      +'这些档位在任何自洽情景里都<b>没出现过</b>——不是和谁冲突，而是它自己就站不住。'
      +solo.map(x=>'<br>· '+(DSHORT[r.ds[x.i]]||r.ds[x.i])+'：'+ST(r.ds[x.i])[x.a]).join('')
      +'</div>';
  }
  if(!r.pairs.length){
    el('confList', head+'<div class="dim" style="line-height:1.9;">'
      +'全部档位对都能共存，<b>没有互斥对</b>——这套判断体系里没有互相矛盾的要求。</div>');
    return;
  }
  el('confList', head
    + r.pairs.slice(0,40).map((p,idx)=>{
    const dA=r.ds[p.i], dB=r.ds[p.j];
    const sA=ST(dA)[p.ai], sB=ST(dB)[p.bj];
    const open=openConf===idx;
    const altA=p.altA.map(k=>'<button class="btn sm" onclick="applyConfFix(\''+dA+'\','+k+')">'+ST(dA)[k]+'</button>').join(' ');
    const altB=p.altB.map(k=>'<button class="btn sm" onclick="applyConfFix(\''+dB+'\','+k+')">'+ST(dB)[k]+'</button>').join(' ');
    return '<div class="conf">'
      +'<div class="h">互斥 '+(idx+1)+'：'+dA+'（'+sA+'）× '+dB+'（'+sB+'）</div>'
      +'<div>在本次检出的 '+r.nCons+' 组自洽情景里，这两档<b>各自都出现过，却从未同时出现</b>。'
      +(r.sampled?'（结果来自抽样：可能把"没抽到"误判成"不可能"，档位对数量多时请以方向为准。）':'')+'</div>'
      +(open?('<div class="sug"><b>可以这样改（点了会真的改状态并重算）：</b><br>'
        +(altA?('把「'+dA+'」改成：'+altA):('「'+dA+'」没有任何一档能与「'+sB+'」共存，需改另一边或复核打分'))
        +'<br>'
        +(altB?('把「'+dB+'」改成：'+altB):('「'+dB+'」没有任何一档能与「'+sA+'」共存，需改另一边或复核打分'))
        +'</div>'):'')
      +'<div style="margin-top:8px;font-size:13px;">'
      +'<span style="color:var(--pri);cursor:pointer;" onclick="toggleConf('+idx+')">'
      +(open?'收起':'查看可替换的档位 ▼')+'</span></div></div>';
  }).join('')
  +(r.pairs.length>40?('<div class="dim" style="margin-top:9px;">共 '+r.pairs.length+' 对，此处列出最值得看的 40 对。</div>'):''));
}

function toggleConf(i){ openConf=openConf===i?null:i; render(); }

function applyConfFix(nm, idx){
  if(!sel.desc[nm]||idx===undefined||idx===null||idx<0) return;
  /* 采纳建议＝把这一档设成唯一的可信范围。多选语义下必须覆盖而不是追加，
     否则原来勾的两档会一起留下来，用户以为是"改成了"，其实范围反而变宽。 */
  sel.desc[nm].states=[ST(nm)[idx]];
  cimResult=null; BAYES=null; layeredResult=null; corrResult=null; profResult=null;
  openConf=null;
  runCIM();
  toast('已把「'+nm+'」改为「'+ST(nm)[idx]+'」并重新检验');
}

function coFn(r){
  const n=r.ds.length, sz=r.sizes;
  if(r.ptab&&r.pseen){
    const t=r.ptab;
    return {has:function(i,a,j,b){ return !!r.pseen[t.off[i*n+j]+a*sz[j]+b]; }};
  }
  const cons=r.consistent;
  return {has:function(i,a,j,b){ return cons.some(c=>c[i]===a&&c[j]===b); }};
}

function aliveTable(r){
  const n=r.ds.length, sz=r.sizes, out=[];
  if(r.presence){
    for(let i=0;i<n;i++){
      const a=[]; for(let j=0;j<sz[i];j++) a.push(r.presence.has(i+'|'+j));
      out.push(a);
    }
    return out;
  }
  const cf=coFn(r);
  for(let i=0;i<n;i++){
    const a=[];
    for(let j=0;j<sz[i];j++){
      let any=false;
      for(let k=0;k<n&&!any;k++){
        if(k===i) continue;
        for(let b=0;b<sz[k];b++){
          const lo=Math.min(i,k), hi=Math.max(i,k);
          const aa=(i<k)?j:b, bb=(i<k)?b:j;
          if(cf.has(lo,aa,hi,bb)){ any=true; break; }
        }
      }
      a.push(any);
    }
    out.push(a);
  }
  return out;
}

function freqOf(r,i,a){
  if(r.freq&&r.freq[i+'|'+a]!=null) return r.freq[i+'|'+a];
  const cf=coFn(r); let c=0;
  for(let k=0;k<r.ds.length;k++){
    if(k===i) continue;
    for(let b=0;b<r.sizes[k];b++){
      const lo=Math.min(i,k), hi=Math.max(i,k);
      const aa=(i<k)?a:b, bb=(i<k)?b:a;
      if(cf.has(lo,aa,hi,bb)) c++;
    }
  }
  return c;
}

function selectedCombo(ds){
  return ds.map(d=>{
    const sn=((sel.desc[d]||{}).states||[])[0];
    return sn?ST(d).indexOf(sn):-1;
  });
}
