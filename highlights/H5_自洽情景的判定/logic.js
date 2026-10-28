/* H5 ｜ 自洽情景的判断链 ｜ 核心逻辑
   摘自 _src/v15/src/app.js，按声明整段切出，未作改写。
   下面每个函数在 app.js 里的位置见本目录 README。 */

const TICK='<span class="tick"></span>';
const allDescs=()=>{const a=[];TREE.forEach(l=>l.c.forEach(m=>m.d.forEach(d=>a.push(d))));return a;};

function mulberry(a){
  return function(){
    a|=0; a=a+0x6D2B79F5|0;
    let t=Math.imul(a^a>>>15,1|a);
    t=t+Math.imul(t^t>>>7,61|t)^t;
    return ((t^t>>>14)>>>0)/4294967296;
  };
}

function cimSig(){
  const s=[];
  Object.keys(cim).sort().forEach(k=>{
    const c=cim[k]; if(!c) return;
    s.push(k+':'+c.v+':'+c.conf+(c.st?(':'+Object.keys(c.st).sort().map(x=>x+'='+c.st[x]).join(',')):''));
  });
  return s.join('|');
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

function cloneCim(){
  const o={};
  Object.keys(cim).forEach(k=>{
    const c=cim[k]; if(!c) return;
    o[k]={v:c.v, conf:c.conf, rev:c.rev};
    if(c.st) o[k].st=Object.assign({},c.st);
  });
  return o;
}

function enumCore(ds, force, capN, keepAll){
  const n=ds.length;
  const sizes=ds.map(d=>ST(d).length);
  if(sizes.some(x=>x<1)) return {bad:'状态缺失'};
  /* 数值锚定在枚举之前生效：与锚定值完全不相交的状态直接排除 */
  const allowed=ds.map(d=>ancAllowed(d));
  /* 勾选＝划定可信范围：勾了的档位才是候选，枚举只在范围内找自洽情景。
     一个都没勾的描述符不设限（"全部档位都可能"），所以空选不会把空间清零。 */
  ds.forEach((d,i)=>{
    const picked=((sel.desc&&sel.desc[d]||{}).states)||[];
    if(picked.length) allowed[i]=allowed[i].filter(j=>picked.indexOf(ST(d)[j])>=0);
  });
  if(force) allowed[force.pos]=[force.idx];
  const dead=allowed.findIndex(a=>!a.length);
  if(dead>=0){
    /* 分清是锚定排空的还是勾选排空的——两种情况的补救办法不一样 */
    return {dead:dead, deadBy:(ancAllowed(ds[dead]).length?'sel':'anc')};
  }
  const radix=allowed.map(a=>a.length);
  const space=radix.reduce((a,b)=>a*b,1);
  const MAX=capN||200000;
  const sampled=space>MAX;
  const N=Math.min(space,MAX);
  /* 预计算影响值，避免内层重复解析 */
  const IMP=[];
  for(let k=0;k<n;k++){
    IMP[k]=[];
    for(let i=0;i<n;i++){
      if(k===i){ IMP[k][i]=null; continue; }
      const m=[];
      for(let a=0;a<sizes[k];a++){
        const row=[];
        for(let b=0;b<sizes[i];b++) row.push(impactVal(ds[k],a,ds[i],b));
        m.push(row);
      }
      IMP[k][i]=m;
    }
  }
  const idxOf=new Array(n).fill(0);
  const consistent=[], seen=new Set(), presence=new Set(), freq={};
  /* 「全局互斥对」要的数据：每一对描述符的每一组档位对，有没有在任何自洽情景里共存过。
     按对分片记一个字节，总容量是各对档位数之积的和（19 个描述符约两千字节）。
     必须在这里逐条累积，不能事后从 consistent 数组反推——那个数组有 200 组上限，会截断。 */
  const ptab=pairIndexTable(n,sizes), pseen=new Uint8Array(ptab.total);
  let inconsistent=0, count=0;
  for(let c=0;c<N;c++){
    let x = sampled ? Math.floor(Math.random()*space) : c;
    for(let i=n-1;i>=0;i--){ const r=radix[i]; idxOf[i]=allowed[i][x%r]; x=Math.floor(x/r); }
    let ok=true;
    for(let i=0;i<n && ok;i++){
      let mx=-1e9, pickv=0;
      for(let j=0;j<sizes[i];j++){
        let acc=0;
        for(let k=0;k<n;k++){ if(k!==i) acc+=IMP[k][i][idxOf[k]][j]; }
        if(j===idxOf[i]) pickv=acc;
        if(acc>mx) mx=acc;
      }
      if(pickv<mx-1e-6) ok=false;
    }
    if(ok){
      const key=idxOf.join(',');
      if(!seen.has(key)){
        seen.add(key); count++;
        if(keepAll){ if(consistent.length<keepAll) consistent.push(idxOf.slice()); }
        else if(consistent.length<200) consistent.push(idxOf.slice());
        for(let i=0;i<n;i++){
          const kk=i+'|'+idxOf[i];
          presence.add(kk);
          freq[kk]=(freq[kk]||0)+1;
          for(let j=i+1;j<n;j++)
            pseen[ptab.off[i*n+j]+idxOf[i]*ptab.wid[i*n+j]+idxOf[j]]=1;
        }
      }
    } else inconsistent++;
  }
  return {n:n, sizes:sizes, space:space, checked:N, sampled:sampled,
    consistent:consistent, count:count, inconsistent:inconsistent,
    presence:presence, freq:freq, dead:-1,
    ptab:ptab, pseen:pseen,
    truncated: keepAll ? (count>keepAll) : false};
}

function runCIM(){
  if(useBayes && !BAYES) computeBayes();
  const ds=Object.keys(sel.desc);
  const pe=prepErr(ds);
  if(pe){ toast(pe); return; }
  const r=enumCore(ds,null);
  if(r.bad){ toast('有描述符缺少状态定义'); return; }
  if(r.dead>=0){ toast('「'+ds[r.dead]+'」在锚定下没有任何可用状态，请放宽锚定或改区间'); return; }
  const total=ds.reduce((a,d)=>a*ST(d).length,1);
  const anchored=ds.filter(d=>ancOf(d)).length;
  cimResult={ds:ds.slice(), sizes:r.sizes.slice(), total:total, space:r.space, anchored:anchored,
    checked:r.checked, count:r.count, sampled:r.sampled,
    consistent:r.consistent, inconsistent:r.inconsistent, ts:nowStr()};
  toast('检验完成：'+(r.sampled?'抽样 ':'')+r.checked.toLocaleString()+' 个组合，自洽 '+r.consistent.length+' 组'
    +(anchored?('（锚定已把空间收窄到 '+r.space.toLocaleString()+' 种）'):''));
  render();
}

function selectedCombo(ds){
  return ds.map(d=>{
    const sn=((sel.desc[d]||{}).states||[])[0];
    return sn?ST(d).indexOf(sn):-1;
  });
}

function checkSelected(ds){
  const cb=selectedCombo(ds);
  const missing=cb.filter(x=>x<0).length;
  if(missing) return {missing:missing};
  const multi=ds.filter(d=>selIdxOf(d).length>1);
  if(multi.length) return {range:true, multi:multi, cb:cb};
  const IMP=buildIMP(ds,cim), sizes=ds.map(d=>ST(d).length), rows=[];
  let ok=true;
  ds.forEach((d,i)=>{
    let pick=0, mx=-1e9, mi=0;
    for(let j=0;j<sizes[i];j++){
      let acc=0;
      for(let k=0;k<ds.length;k++){ if(k!==i) acc+=IMP[k][i][cb[k]][j]; }
      if(j===cb[i]) pick=acc;
      if(acc>mx){ mx=acc; mi=j; }
    }
    if(pick<mx-1e-6) ok=false;
    rows.push({d:d, at:cb[i], pick:pick, max:mx, best:mi, gap:mx-pick});
  });
  return {ok:ok, rows:rows, cb:cb};
}

function checkResult(){
  const ds=Object.keys(sel.desc);
  if(ds.length<2){ el('checkResult','<div class="empty">先在第 3 步勾选至少两个描述符</div>'); return; }
  if(!cimResult){
    el('checkResult','<div style="font-size:13px;line-height:1.8;">'
      +'<b>还没有检验结果。</b>点下面的按钮，平台会枚举全部状态组合，逐个算出每个描述符的影响平衡值，'
      +'把「所有描述符的选定状态都是各自平衡里得分最高的那一个」的组合挑出来——这些就是自洽情景。'
      +'<div style="margin-top:12px;"><button class="btn pri" onclick="runCIM()">运行一致性检验</button></div>'
      +'<div class="dim" style="font-size:13px;margin-top:9px;">组合数＝各描述符状态数之积。'
      +'19 个描述符全选时约 3¹⁷×2² ≈ 5.17 亿种，远超可枚举范围，此时平台会自动改为随机抽样检验并标注。</div></div>');
    return;
  }
  const r=cimResult;
  let h=kv('参与检验的描述符', r.ds.length+' 个')
   +kv('状态总数', r.sizes.reduce((a,b)=>a+b,0)+' 个')
   +kv('组合空间', r.total.toLocaleString()+' 种'
   +(r.anchored?(' <span style="color:var(--pri);">→ 锚定后 '+(r.space||r.total).toLocaleString()+' 种</span>'):''))
   +(r.anchored?kv('数值锚定排除','<span style="color:var(--pri);">'
     +(r.total-(r.space||r.total)).toLocaleString()+' 种组合（'+r.anchored+' 个描述符已锚定）</span>'):'')
   +kv('实际检查', (r.sampled?('随机抽样 '+r.checked.toLocaleString()+' 种'):(r.checked.toLocaleString()+' 种（全枚举）')))
   +kv('自洽情景', '<span style="color:var(--ok);font-weight:600;">'
     +r.consistent.length+(r.consistent.length>=200?'+':'')+' 组</span>')
   +kv('不自洽组合', '<span style="color:var(--rd);">'+r.inconsistent.toLocaleString()+' 组</span>')
   +'<div style="margin-top:12px;display:flex;gap:10px;align-items:center;flex-wrap:wrap;">'
   +'<button class="btn sm" onclick="runCIM()">重新检验</button>'
   +'<span class="dim" style="font-size:13px;">计算时间 '+r.ts+'</span></div>';

  const sc=checkSelected(r.ds);
  if(sc.missing){
    h+='<div class="note" style="margin-top:12px;">还有 <b>'+sc.missing+'</b> 个描述符没勾状态。'
      +'不勾＝不设限（该描述符的全部档位都参与检验），所以检验照跑；'
      +'但要说清「你主张的那套情景自不自洽」，得先到第 3 步把它勾出来。</div>';
  }else if(sc.range){
    /* 多选＝划定范围：这时不存在"唯一那套情景"，改答"你划的这块范围里有多少真的成立" */
    const rs=rangeStat();
    h+='<div class="rrange" style="margin-top:12px;">'
      +'<b>你划定的范围：'+rs.n.toLocaleString()+' 种组合</b>'
      +'（勾了多档的描述符：'+sc.multi.map(d=>DSHORT[d]||d).join('、')+'）。<br>'
      +'其中 <b style="color:var(--ok);">'+rs.ok+' 组</b>是自洽的'
      +'（占本次检出的 '+rs.total+' 组自洽情景的 '
      +Math.round(rs.ok/Math.max(1,rs.total)*100)+'%）。'
      +(rs.ok?'':'<br><span style="color:var(--rd);">你划的这块范围里没有任何自洽情景——'
        +'说明这些档位的组合与当前打分矩阵不相容，需要放宽范围或复核相关判断。</span>')
      +'</div>';
  }else if(sc.ok){
    const idx=r.consistent.findIndex(cb=>cb.join(',')===sc.cb.join(','));
    h+='<div class="rok" style="margin-top:12px;"><b>你选的情景：自洽。</b>'
      +(idx>=0?('就是下面第 '+(idx+1)+' 个自洽情景；导出目标模型时用的就是这一组。')
        :'在本次抽样中未直接出现，但按当前打分它满足一致性判据。')+'</div>';
  }else{
    const bad=sc.rows.filter(x=>x.gap>1e-6).sort((a,b)=>b.gap-a.gap);
    h+='<div class="rnote" style="margin-top:12px;"><b>你选的情景：不自洽。</b>'
      +'有 '+bad.length+' 个描述符的选定状态不是自身的最高分：<br>'
      +bad.map(x=>'· '+x.d+'：取「'+ST(x.d)[x.at]+'」平衡 '+x.pick.toFixed(1)
        +'，而「'+ST(x.d)[x.best]+'」为 '+x.max.toFixed(1)+'（差 '+x.gap.toFixed(1)+'）').join('<br>')
      +'<br>要让它成立，至少把这些描述符改成括号里的高分档；或者回打分页复核相关判断。</div>';
  }
  if(!r.consistent.length){
    h+='<div class="note" style="margin-top:12px;">没有找到自洽情景。这通常说明打分矩阵内部冲突较多，'
      +'或者描述符选得太多。可以回「交叉影响打分」复核那些低置信度的判断，再跑一次。</div>';
  }else{
    const showN=allScen?r.consistent.length:Math.min(6,r.consistent.length);
    h+='<div style="margin-top:10px;">';
    r.consistent.slice(0,showN).forEach((cb,i)=>{ h+=scenCard(r,i,cb); });
    h+='</div>';
    if(r.consistent.length>6){
      h+='<div style="margin-top:9px;display:flex;gap:10px;flex-wrap:wrap;align-items:center;">'
        +'<button class="btn sm" onclick="toggleAllScen()">'
        +(allScen?('收起，只显示前 6 组'):('展开全部 '+r.consistent.length+' 组'))
        +'</button>'
        +'<button class="btn sm" onclick="downloadAll()">下载完整清单（csv）</button>'
        +'<span class="dim" style="font-size:13px;">组数多时展开会略慢，可先下载清单再挑。</span></div>';
    }else{
      h+='<div class="dim" style="font-size:13px;margin-top:8px;">'
        +'<button class="btn sm" onclick="downloadAll()">下载完整清单（csv）</button></div>';
    }
  }
  el('checkResult',h);
}

function rangeStat(){
  if(!cimResult) return null;
  const ds=cimResult.ds;
  const inRange=cimResult.consistent.filter(cb=>
    ds.every((d,i)=>{ const s=selIdxOf(d); return !s.length||s.indexOf(cb[i])>=0; }));
  return {n:rangeSize(ds), ok:inRange.length, total:cimResult.consistent.length,
    anySel:ds.some(d=>selIdxOf(d).length)};
}

function toggleAllScen(){ allScen=!allScen; render(); }

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

function scenCard(r,i,cb){
  const open=openScen===i;
  let t='';
  r.ds.forEach((d,j)=>{ if(j) t+=' · '; t+=(DSHORT[d]||d)+'='+(ST(d)[cb[j]]||'?'); });
  return '<div class="acc"><div class="ah" onclick="toggleScen('+i+')">'
    +'<span class="t">情景 '+(i+1)+'　<span class="dim">'+t+'</span></span>'
    +'<span style="font-size:13px;color:var(--pri);">'+(open?'收起 ▲':'展开判断链 ▼')+'</span></div>'
    +(open?('<div class="ab">'+scenDetail(r,cb)+'</div>'):'')+'</div>';
}

function scenDetail(r,cb){
  let h='<div style="margin-bottom:8px;font-size:13px;">各描述符的取值，'
    +'以及它在本情景下各状态的影响平衡值（加粗者为选定状态，▲ 为该描述符的最高分）：</div>';
  r.ds.forEach((d,i)=>{
    const sts=ST(d), defs=defsOf(d);
    const bal=[];
    for(let j=0;j<sts.length;j++){
      let s=0;
      for(let k=0;k<r.ds.length;k++){ if(k!==i) s+=impactVal(r.ds[k],cb[k],d,j); }
      bal.push(s);
    }
    let mx=-1e9, mi=0;
    bal.forEach((v,j)=>{ if(v>mx){ mx=v; mi=j; } });
    const sx=defs[cb[i]];
    h+='<div style="margin:9px 0;padding:9px 10px;border:1px solid var(--pri-b);border-radius:6px;">'
      +'<div style="font-size:13px;"><b>'+d+'</b>　取「'+sts[cb[i]]+'」'
      +(sx?'　'+rngTxt(sx):'')+'</div>'
      +'<div style="font-size:13px;color:var(--tx2);margin-top:3px;line-height:1.9;">'
      +sts.map((s,j)=>s+' <b'+(j===cb[i]?' style="color:var(--ok)"':'')+'>'
        +(bal[j]>0?'+':'')+bal[j].toFixed(1)+'</b>'+(j===mi?' ▲':'')).join('　｜　')
      +'</div></div>';
  });
  h+='<div style="margin-top:10px;padding-top:9px;border-top:1px dashed var(--line);font-size:13px;line-height:1.8;">'
   +'<b>为什么自洽：</b>每个描述符的选定状态，都是它自身影响平衡值中得分最高的那一项——'
   +'没有任何其他状态受到更强的合力支持。这就是 CIB 的一致性原则。</div>';
  return h;
}

function toggleScen(i){ openScen=openScen===i?null:i; render(); }

function impactVal(fd,fi,td,ti){
  const r=cim[fd+'>'+td];
  if(!r) return 0;
  if(r.st){
    const ov=r.st[fi+'_'+ti];
    if(typeof ov==='number') return ov;
  }
  return expandV(r.v, ST(fd).length, fi, ST(td).length, ti);
}

function pairIndexTable(n,sizes){
  const off=new Int32Array(n*n).fill(-1), wid=new Int32Array(n*n);
  let total=0;
  for(let i=0;i<n;i++) for(let j=i+1;j<n;j++){
    off[i*n+j]=total; wid[i*n+j]=sizes[i]*sizes[j]; total+=wid[i*n+j];
  }
  return {n:n, off:off, wid:wid, total:total};
}

function p6Apply(){
  const sec=document.getElementById('p6');
  if(!sec||typeof sec.setAttribute!=='function') return;
  sec.setAttribute('data-g', p6allOn?'all':p6grp);
  sec.classList.toggle('p6-all', p6allOn);
  const tabs=(sec.querySelectorAll?sec.querySelectorAll('.p6tab'):[]);
  for(let i=0;i<tabs.length;i++)
    tabs[i].classList.toggle('sel', !p6allOn && tabs[i].getAttribute('data-g')===p6grp);
  const b=document.getElementById('p6allBtn');
  if(b) b.textContent=p6allOn?'只看一组':'全部展开';
}

function p6Group(g){
  if(!P6GNAME[g]) return;
  p6grp=g; p6allOn=false; p6Apply();
  const sec=document.getElementById('p6');
  if(sec&&typeof sec.getBoundingClientRect==='function'&&window.scrollTo){
    const y=sec.getBoundingClientRect().top+(window.scrollY||0)-112;
    window.scrollTo({top:Math.max(0,y),behavior:'smooth'});
  }
}

function p6All(){ p6allOn=!p6allOn; p6Apply(); }

function p6Status(){
  const b=document.getElementById('p6stat');
  if(!b||typeof b.innerHTML!=='string') return;
  if(!cimResult){ b.textContent='尚未检验'; return; }
  b.innerHTML='已检验：自洽 <b>'+cimResult.consistent.length+'</b> 组 · 检查 '
    +cimResult.checked.toLocaleString()+' 组'+(cimResult.sampled?'（抽样）':'');
}
