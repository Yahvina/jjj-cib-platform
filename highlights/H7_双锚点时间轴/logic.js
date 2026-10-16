/* H7 ｜ 双锚点时间轴 ｜ 核心逻辑 */

/* ---- index.html 第 885-906 行 ---- */
function timeline(){
  const names=Object.keys(sel.desc);
  const rows=names.length?names:['（尚未选择描述符）'];
  el('timeline', `<div class="crow hd" style="grid-template-columns:1fr 1fr 1fr 1fr;">
      <div class="clbl" style="font-weight:400;color:var(--tx3);">描述符</div>
      <div class="cell" style="border-right:1px solid var(--line2);">2025 参照年</div>
      <div class="cell" style="border-right:1px solid var(--line2);">2030 政策锚点</div>
      <div class="cell" style="border-right:none;">2035 情景锚点</div></div>`+
    rows.map(nm=>{
      const d=dOf(nm);
      if(!d) return `<div class="crow" style="grid-template-columns:1fr 1fr 1fr 1fr;">
        <div class="clbl">${nm}</div><div class="cell">—</div><div class="cell">—</div>
        <div class="cell" style="border-right:none;">—</div></div>`;
      return `<div class="crow" style="grid-template-columns:1fr 1fr 1fr 1fr;">
        <div class="clbl">${nm}</div>
        <div class="cell" style="border-right:1px solid var(--line2);">
          <span class="dim">取自统计公报</span></div>
        <div class="cell" style="border-right:1px solid var(--line2);">${d.a30}</div>
        <div class="cell" style="border-right:none;color:var(--tx3);">${d.a35}</div></div>`;
    }).join(''));
}
function el(id,h){ document.getElementById(id).innerHTML=h; }
