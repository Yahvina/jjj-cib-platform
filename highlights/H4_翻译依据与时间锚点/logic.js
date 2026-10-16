/* H4 ｜ 描述符的翻译依据与时间锚点 ｜ 核心逻辑 */

/* ---- index.html 第 703-706 行 ---- */
function toggleDetail(id){
  if(expanded.has(id)) expanded.delete(id); else expanded.add(id);
  renderTree();
}

/* ---- index.html 第 724-745 行 ---- */
function renderStates(){
  const el=document.getElementById('statePanel'), names=Object.keys(sel.desc);
  if(!names.length){ el.innerHTML='<div class="empty">左侧勾选描述符后，这里显示它的状态选项</div>'; }
  else{
    el.innerHTML=names.map(nm=>{
      const d=dOf(nm), c=sel.desc[nm];
      return `<div class="stbox"><div class="hd">${nm}
        ${c.src?`<span class="src">来源：${c.src}</span>`:''}</div>`+
        d.s.map(s=>{const on=c.states.indexOf(s)>=0;
          return `<div class="strow" onclick="tglState('${nm}','${s}')">
            <span class="chk ${on?'on':''}">${on?TICK:''}</span><span>${s}</span></div>`;}).join('')
        +`</div>`;
    }).join('');
  }
  const outs=allDescs().filter(d=>d.t==='结果型');
  document.getElementById('outPanel').innerHTML=
    `<div class="stbox" style="margin-top:12px;">
      <div class="hd">模型输出预期 <span class="tag" style="font-size:10.5px;">结果型</span></div>
      <div style="padding:10px 12px;font-size:12.5px;color:var(--tx2);line-height:1.7;">
        ${outs.map(d=>`· <b style="color:var(--tx)">${d.n}</b>——${d.tr}`).join('<br>')}
      </div></div>`;
}

/* ---- index.html 第 773-783 行 ---- */
function expDetail(){
  const el=document.getElementById('expDetail');
  if(expertN===1){ el.innerHTML='<div class="note">单人判断：全部打分由一人完成，不产生分歧项。</div>'; return; }
  const n=nSel(), items=n>1?n*(n-1)/2:0;
  const dv=Math.max(1,Math.round(items*0.16));
  el.innerHTML=`<div class="note info">
    <b>${expertN} 人独立打分</b><br>
    待打分 ${items} 项，系统自动比对后预计标出 <b>${dv}</b> 项存疑项（打分差 ≥ 2）。<br>
    存疑项不计入最终矩阵，需人工确认后再合并。</div>`;
}
function scaleSum(){
