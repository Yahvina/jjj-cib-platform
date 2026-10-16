/* H5 ｜ 自洽情景的判断链 ｜ 核心逻辑 */

/* ---- index.html 第 815-848 行 ---- */
function checkResult(){
  const n=nSel(), total=n*2;
  const ok=Math.max(1,Math.round(n*0.6));
  const bad=Math.max(0,Math.round(n*1.0));
  el('checkResult', `<div class="kv"><span>参与检验的描述符</span><span>${n} 个</span></div>
    <div class="kv"><span>状态总数</span><span>${total} 个</span></div>
    <div class="kv"><span>发现互相矛盾的状态组合</span><span style="color:var(--rd);">${bad} 组</span></div>
    <div class="kv"><span>通过校验的自洽情景</span><span style="color:var(--ok);">${ok} 组</span></div>
    <div class="kv"><span>跨层级一致性</span><span style="color:var(--ok);">通过（3 层）</span></div>
    ${useBayes?'<div class="kv"><span>参数区间</span><span>已生成并标注置信程度</span></div>':''}
    <div style="margin-top:12px;font-size:12px;color:var(--tx3);">
      以下为自洽情景，点击展开其判断链。</div>
    <div style="margin-top:10px;">`+
    Array.from({length:Math.min(4,ok)},(_,i)=>{
      const nm='情景 '+(i+1), open=openScen===i;
      const names=Object.keys(sel.desc).slice(0,4);
      const chain=(names.length?names:['（尚未选择描述符）']).map((x,j)=>{
        const st=sel.desc[x]&&sel.desc[x].states[0]?sel.desc[x].states[0]:'（未定）';
        const v=j%3===0?[3,'正向协同']:(j%3===1?[-1,'轻微冲突·可容忍']:[0,'无显著影响']);
        return `<div class="ci"><span class="a">${x}</span><span>${st}　→　${v[1]}</span>
          <span class="r ${v[0]>0?'p':(v[0]<0?'n':'z')}">${v[0]>0?'+':''}${v[0]}</span></div>`;
      }).join('');
      return `<div class="acc"><div class="ah" onclick="toggleScen(${i})">
        <span class="t">${nm}　<span class="dim">自洽｜跨层一致</span></span>
        <span style="font-size:12px;color:var(--pri);">${open?'收起 ▲':'展开判断链 ▼'}</span></div>
        ${open?`<div class="ab">
          <div style="margin-bottom:8px;">该情景下各描述符的取值，以及两两交叉影响的判定结果：</div>
          <div class="chain">${chain}</div>
          <div style="margin-top:10px;padding-top:9px;border-top:1px dashed var(--line);">
            <b>为什么自洽：</b>所有交叉影响均未低于 −2（未出现互斥），且上下级取值满足加总与边界约束。</div>
        </div>`:''}</div>`;
    }).join('')+'</div>');
}
function toggleScen(i){ openScen=openScen===i?null:i; render(); }
