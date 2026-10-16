/* H3 ｜ 三层差异预览与跨层约束 ｜ 核心逻辑 */

/* ---- index.html 第 556-561 行 ---- */
const LAYERS=[
  {k:'nation', n:'国家级', pop:'全国常住人口', eco:'全国 GDP 增速', fmt:'总量口径'},
  {k:'prov',   n:'省级',   pop:'北京 2180 万 / 天津 1363 万 / 河北 7354 万', eco:'5.4% / 4.8% / 5.6%', fmt:'分省口径'},
  {k:'city',   n:'市级',   pop:'河北 11 个地级市（合计 7354 万）', eco:'按各市公布值', fmt:'分市口径'}
];


/* ---- index.html 第 628-649 行 ---- */
function layerTable(){
  const on=[...document.querySelectorAll('[data-scale].sel')].map(x=>x.dataset.scale);
  if(!on.length){ document.getElementById('layerTable').innerHTML=
    '<div style="font-size:12.5px;color:var(--tx3);">尚未勾选任何层级</div>'; return; }
  let h=`<div class="crow hd" style="grid-template-columns:96px 1fr 1fr 1fr;">
    <div class="clbl" style="font-weight:400;color:var(--tx3);">层级</div>
    <div class="cell">人口（Population）</div><div class="cell">经济（GDP|MER）</div>
    <div class="cell" style="border-right:none;">口径</div></div>`;
  LAYERS.forEach(L=>{
    const active=on.indexOf(L.k)>=0;
    h+=`<div class="crow" style="grid-template-columns:96px 1fr 1fr 1fr;${active?'':'opacity:.4;'}">
      <div class="clbl">${L.n}</div>
      <div class="cell">${L.pop}</div><div class="cell">${L.eco}</div>
      <div class="cell" style="border-right:none;">${L.fmt}</div></div>`;
  });
  h+=`<div style="padding:11px 14px;font-size:12.5px;color:var(--tx2);background:var(--panel2);">
    跨层约束：${on.length>1?'省级人口加总须等于国家级；市级加总须等于省级；三处口径须一致。'
      :'只勾了一个层级，不做跨层核对——这与现有做法相同。'}</div>`;
  document.getElementById('layerTable').innerHTML=h;
}

/* ================= 步骤 2 ================= */
