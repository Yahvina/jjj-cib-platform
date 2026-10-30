/* H9 ｜ 选描述符：清单 + 抽屉（页面不再随选择变长） ｜ 核心逻辑
   摘自 _src/v15/src/app.js，按声明整段切出，未作改写。
   下面每个函数在 app.js 里的位置见本目录 README。 */

const sel={desc:{}};

function renderDescList(){
  renderP2Stat();
  const el=document.getElementById('descList'); if(!el) return;
  const names=Object.keys(sel.desc);
  if(!names.length){
    el.innerHTML='<div class="p2empty">还没有选描述符。点右上「＋ 添加描述符」，从树里挑。</div>';
    return;
  }
  el.innerHTML=names.map(nm=>{
    const c=sel.desc[nm], defs=defsOf(nm);
    const onN=defs.filter(s=>(c.states||[]).indexOf(s.n)>=0).length;
    const cur=(c.states||[]).length===1?c.states[0]:'';
    const bare=!(c.states||[]).length;
    return '<div class="drow">'
      +'<div class="dmain"><div class="dnm">'+attrEsc(nm)+'</div>'
      +'<div class="dmeta">'+(bare?'不设限（全 '+defs.length+' 档）':(onN+' / '+defs.length+' 档'))
      +(cur?'　<b>'+attrEsc(cur)+'</b>':'')+'</div></div>'
      +'<button class="btn sm" onclick="openDescDrawer(\''+nm+'\')">设置</button>'
      +'</div>';
  }).join('');
}

function renderP2Stat(){
  const el=document.getElementById('p2stat'); if(el) el.innerHTML=p2StatHTML();
}

function renderP2Drawer(){
  const el=document.getElementById('p2Drawer'); if(!el) return;
  if(!p2Drawer){ el.className='cfgdrawer'; el.innerHTML=''; return; }
  /* 勾选或改档都会触发整页 render，抽屉会重建——把滚动位置带过去，
     否则在树里连勾五个，每勾一次都跳回顶部。 */
  const keep=el.scrollTop;
  el.className='cfgdrawer on';
  if(p2Drawer.mode==='add'){
    el.innerHTML='<div class="drawer-h"><div><div class="drawer-k">添加描述符</div>'
      +'<b>从树里挑</b></div>'
      +'<button class="btn sm" onclick="closeP2Drawer()">关闭</button></div>'
      +'<div class="tools" style="margin-top:12px;">'
      +'<input class="txt" id="search" placeholder="搜索描述符或对应变量…" oninput="onSearch()">'
      +'<button class="btn sm" onclick="descSelAll()">全选</button>'
      +'<button class="btn sm" onclick="descClearAll()">清空</button>'
      +'<button class="btn sm" onclick="setSearch(\'\')">清除</button></div>'
      +'<div class="p2treecnt" id="treeCnt"></div>'
      +'<div class="tree" id="tree"></div>';
    renderTree();
  }else{
    const nm=p2Drawer.nm, names=Object.keys(sel.desc), i=names.indexOf(nm);
    el.innerHTML='<div class="drawer-h"><div><div class="drawer-k">状态设置</div>'
      +'<b>'+attrEsc(nm)+'</b></div>'
      +'<button class="btn sm" onclick="closeP2Drawer()">关闭</button></div>'
      +'<div class="p2nav"><button class="btn sm"'+(i<=0?' disabled':'')+' onclick="descStep(-1)">上一项</button>'
      +'<span class="p2navc">'+(i+1)+' / '+names.length+'</span>'
      +'<button class="btn sm"'+(i>=names.length-1?' disabled':'')+' onclick="descStep(1)">下一项</button></div>'
      +'<div id="statePanel"></div>';
    renderStates(nm);
  }
  if(keep) el.scrollTop=keep;
}

function renderTree(){
  const el=document.getElementById('tree'); if(!el) return;   /* 树现在只在「添加描述符」抽屉里 */
  const q=searchQ.trim().toLowerCase();
  let h='', shown=0;
  TREE.forEach((l1,i1)=>{
    let buf='', cnt=0;
    l1.c.forEach((l2,i2)=>{
      let d3='';
      l2.d.forEach(d=>{
        const hit=!q||(d.n+d.v).toLowerCase().indexOf(q)>=0;
        if(!hit) return;
        cnt++;
        const dis=d.t==='结果型';
        const on=!!sel.desc[d.n];
        const cls=d.t==='输入型'?'in':(d.t==='参数型'?'par':'out');
        const openDetail=expanded.has(d.id);
        d3+=`<div class="tl3 ${dis?'dis':''}">
          <span class="chk ${on?'on':''}" data-id="${d.id}" onclick="${dis?'':`selDesc('${d.id}')`}">${on?TICK:''}</span>
          <span class="nm" onclick="toggleDetail('${d.id}')">${d.n}${dis?' <span class="dim">（不可作为输入）</span>':''}
            <span class="meta">${d.v}</span></span></div>`;
        if(openDetail){
          d3+=`<div class="detail"><div class="dhead">
            <span>翻译依据与时间锚点<span class="pill ${cls}" style="margin-left:10px;">${d.t}</span></span>
            <span style="cursor:pointer;color:var(--pri);font-weight:400;" onclick="toggleDetail('${d.id}')">收起 ▲</span></div>
            <div class="dbody">
              <div class="trbox"><span class="lb">语义翻译</span>${d.tr}</div>
              <div class="tl"><span class="yr">2025<br>参照年</span><span>现状值见右侧路径汇总</span></div>
              <div class="tl" style="margin-top:6px;"><span class="yr"><b>2030</b><br>政策锚点</span><span>${d.a30}</span></div>
              <div class="tl" style="margin-top:6px;"><span class="yr"><b>2035</b><br>情景锚点</span><span>${d.a35}</span></div>
            </div></div>`;
        }
      });
      if(d3){
        const k2=collapsed.has('m'+i1+'_'+i2);
        buf+=`<div class="tnode" style="border-top:1px solid var(--line2);">
          <div class="tl2" onclick="toggleNode('m${i1}_${i2}')">
            <span class="caret ${k2?'':'open'}">▶</span>${l2.n}</div>
          <div class="${k2?'hide':''}">${d3}</div></div>`;
      }
    });
    if(!buf) return;
    shown+=cnt;
    const k1=collapsed.has('n'+i1);
    h+=`<div class="tnode"><div class="tl1" onclick="toggleNode('n${i1}')">
      <span class="caret ${k1?'':'open'}">▶</span>${l1.n}
      <span class="pill" style="margin-left:auto;">一级</span></div>
      <div class="${k1?'hide':''}">${buf}</div></div>`;
  });
  el.innerHTML=h||'<div class="empty">没有匹配的描述符</div>';
  const cnt=document.getElementById('treeCnt');
  if(cnt) cnt.textContent=
    `共 ${allDescs().length} 个　·　已选 ${nSel()} 项${q?'（匹配 '+shown+' 个）':''}`;
}

function renderTreeCnt(){
  const cnt=document.getElementById('treeCnt');
  if(cnt) cnt.textContent=`共 ${allDescs().length} 个　·　已选 ${nSel()} 项`;
}

function renderStates(only){
  const el=document.getElementById('statePanel'); if(!el) return;   /* 状态面板现在只在「设置」抽屉里 */
  const names = only ? [only] : (p2Drawer&&p2Drawer.mode==='edit' ? [p2Drawer.nm] : Object.keys(sel.desc));
  if(!names.length){ el.innerHTML='<div class="empty">左侧勾选描述符后，这里显示它的状态选项</div>'; }
  else{
    el.innerHTML=names.map(nm=>{
      const c=sel.desc[nm], defs=defsOf(nm);
      const bad=rngIssues(nm);
      const allOn=c.states.length>=defs.length;
      const ev=RANGE_EVID[nm]||{k:'example',t:''};
      const rows=defs.map(s=>{
        const on=c.states.indexOf(s.n)>=0, k=nm+'|'+s.n;
        const ed=(rngEdit===k);
        return `<div class="strow">
            <span class="chk rad ${on?'on':''}" onclick="tglState('${nm}','${s.n}')">${on?TICK:''}</span>
            <span class="stnm" onclick="tglState('${nm}','${s.n}')">${s.n}${s.custom?'<i class="cus">自定义</i>':''}${s.ev==='user'?'<i class="cus evu">已改</i>':''}</span>
            <span class="rngwrap" onclick="editRange('${nm}','${s.n}')" title="点此修改取值区间">${rngTxt(s)}</span>
          </div>`+
          (ed?`<div class="rngedit">
            <div class="re-row"><span class="re-lb">状态名</span>
              <input class="txt" id="rst" value="${s.n}" style="flex:1;"></div>
            <div class="re-row"><span class="re-lb">区间</span>
              <input class="txt" id="rlo" type="number" step="any" value="${s.lo===null?'':s.lo}" placeholder="下限" style="width:92px;">
              <span class="re-dash">–</span>
              <input class="txt" id="rhi" type="number" step="any" value="${s.hi===null?'':s.hi}" placeholder="上限" style="width:92px;">
              <input class="txt" id="ru" value="${s.u||''}" placeholder="单位，如 %" style="width:104px;"></div>
            ${ev.k!=='example'&&ev.k!=='exo'?`<div class="re-ev"><b>依据</b>　${ev.t}</div>`:''}
            <div class="re-row">
              <button class="btn sm pri" onclick="saveRange('${nm}','${s.n}')">保存</button>
              <button class="btn sm" onclick="renState('${nm}','${s.n}')">仅改状态名</button>
              ${s.custom?`<button class="btn sm danger" onclick="delState('${nm}','${s.n}')">删除</button>`:''}
              <button class="btn sm" onclick="editRange('${nm}','${s.n}')">取消</button></div>
          </div>`:'');
      }).join('');
      const addBox=(rngAdd===nm)?`<div class="rngedit">
            <div class="re-row"><span class="re-lb">新增</span>
              <input class="txt" id="nsn" placeholder="状态名称" style="flex:1;"></div>
            <div class="re-row"><span class="re-lb">区间</span>
              <input class="txt" id="nslo" type="number" step="any" placeholder="下限" style="width:92px;">
              <span class="re-dash">–</span>
              <input class="txt" id="nshi" type="number" step="any" placeholder="上限" style="width:92px;">
              <input class="txt" id="nsu" placeholder="单位" style="width:104px;"></div>
            <div class="re-row">
              <button class="btn sm pri" onclick="doAddState('${nm}')">添加</button>
              <button class="btn sm" onclick="addState('${nm}')">取消</button></div>
          </div>`:'';
      const snote=SCOPE_NOTE[nm+'|'+rngScope];
      const hasScope=defs.some(x=>x.scoped);
      const scopeTag=(rngScope!=='region')
        ? `<i class="evi ${hasScope?'scope':'example'}">${hasScope?('已按'+SCOPE_NAME[rngScope]+'口径'):'沿用区域级'}</i>`
        : '';
      /* 卡片里不再单列「依据行」与页脚小字：二者的内容都是解释性的，且与徽标重复。
         现在徽标自己就是悬停锚点，说明文字挂在它的 data-tip 上——
         本辖区口径优先，其次取档方式依据；再补「沿用区域级」这类口径说明。 */
      let evTip=snote||ev.t||'';
      if(rngScope!=='region'&&!hasScope){
        evTip+=(evTip?'；':'')+'本辖区暂无独立口径，沿用区域级区间。';
      }
      return `<div class="stbox"><div class="hd">${nm}
        ${c.src?`<span class="src">来源：${c.src}</span>`:''}
        <i class="evi tip wide ${ev.k}" tabindex="0" data-tip="${attrEsc(evTip)}">${EVID_WORD[ev.k]||''}</i>${scopeTag}</div>`
        +selRangeHTML(nm)+rows+addBox+ancRowHTML(nm)+
        `<div class="stfoot"><button class="btn sm" onclick="addState('${nm}')">＋ 自定义状态</button>
          <button class="btn sm" onclick="selAllState('${nm}')">${allOn?'清空勾选':'全选 '+defs.length+' 档'}</button>
          ${hasScope&&rngScope!=='region'?`<button class="btn sm" onclick="dropScopeOverride('${nm}')">恢复区域级</button>`:''}</div>`+
        (bad.length?`<div class="stbad">区间衔接提示：${bad.join('；')}</div>`:'')+
        `</div>`;
    }).join('')
      +ancConflictHTML()
      +ancSummaryHTML();
  }
  const outs=allDescs().filter(d=>d.t==='结果型');
  const outEl=document.getElementById('outPanel');
  if(outEl) outEl.innerHTML=
    `<div class="stbox" style="margin-top:12px;">
      <div class="hd">模型输出预期</div>
      <div style="padding:10px 12px;font-size:13px;color:var(--tx2);line-height:1.7;">
        ${outs.map(d=>`· <b style="color:var(--tx)">${d.n}</b>——${d.tr}`).join('<br>')}
      </div></div>`;
}

function descSelAll(){
  const n=allDescs().filter(d=>d.t!=='结果型').length;
  allDescs().filter(d=>d.t!=='结果型').forEach(d=>{
    if(!sel.desc[d.n]) sel.desc[d.n]={states:[],src:null};
  });
  document.querySelectorAll('#tree .chk[data-id]').forEach(chk=>{
    const d=allDescs().find(x=>x.id===chk.getAttribute('data-id'));
    if(d&&d.t!=='结果型'){ chk.classList.add('on'); chk.innerHTML=TICK; }
  });
  renderTreeCnt(); renderP2Stat(); renderDescList();
  toast('已把 '+n+' 个描述符全部加入参与集');
}

function descClearAll(){
  sel.desc={}; cimResult=null; BAYES=null; layeredResult=null; corrResult=null; profResult=null;
  document.querySelectorAll('#tree .chk.on').forEach(chk=>{ chk.classList.remove('on'); chk.innerHTML=''; });
  renderTreeCnt(); renderP2Stat(); renderDescList();
  toast('已清空，参与集为空');
}

function descStep(d){
  const names=Object.keys(sel.desc), i=names.indexOf(p2Drawer.nm)+d;
  if(i<0||i>=names.length) return;
  p2Drawer={mode:'edit',nm:names[i]};
  render();
}

function openDescDrawer(nm){ p2Drawer={mode:'edit',nm:nm}; render(); }

function openAddDrawer(){ p2Drawer={mode:'add'}; render(); }

function closeP2Drawer(){ p2Drawer=null; render(); }

function selDesc(id){
  const d=allDescs().find(x=>x.id===id); if(!d) return;
  const adding=!sel.desc[d.n];
  if(adding) sel.desc[d.n]={states:[],src:null}; else delete sel.desc[d.n];
  /* 在「添加描述符」抽屉里勾选时走轻量路径：只切勾选框、刷新统计与清单，
     不重建整页——原来每次勾选都 render()，树重建后滚动位置归零，勾一个就跳回顶部。 */
  if(p2Drawer&&p2Drawer.mode==='add'){
    const chk=document.querySelector('#tree .chk[data-id="'+id+'"]');
    if(chk){ chk.classList.toggle('on',adding); chk.innerHTML=adding?TICK:''; }
    renderTreeCnt(); renderP2Stat(); renderDescList();
    return;
  }
  render();
}

function tglState(nm,st){
  const b=sel.desc[nm]; if(!b) return;
  const cur=b.states||[];
  const i=cur.indexOf(st);
  b.states = (i>=0) ? cur.filter(x=>x!==st) : cur.concat([st]);
  cimResult=null; BAYES=null; layeredResult=null;
  corrResult=null;
  profResult=null;
  render();
}
