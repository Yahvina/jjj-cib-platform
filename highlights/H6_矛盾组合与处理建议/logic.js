/* H6 ｜ 矛盾组合与处理建议（闭环） ｜ 核心逻辑 */

/* ---- index.html 第 849-862 行 ---- */
const CONFS=[
  {id:'c1', a:'经济增长速度', as:'高速', b:'人口空间分布与收缩态势', bs:'加速收缩',
   why:'经济高速增长通常伴随人口净流入，与「加速收缩」难以并存。',
   sug:'把经济增长速度调为「中速」，或把人口改为「平稳收缩」。'},
  {id:'c2', a:'本地可再生能源开发规模', as:'高开发', b:'区域电力互济强度', bs:'弱互济',
   why:'本地高开发通常意味着对外来电依赖下降，与「弱互济」的路径方向不一致。',
   sug:'把区域电力互济改为「规划节奏」。'},
  {id:'c4', a:'单位产品能耗限额强度', as:'严格限额', b:'工业节能改造强度', bs:'推进缓慢',
   why:'限额收紧与改造迟缓作用于同一批工业企业的能耗，一紧一松，逻辑上不一致。',
   sug:'把工业节能改造强度调为「按计划推进」或「深入推进」。'},
  {id:'c3', a:'钢铁工艺路线', as:'长流程为主', b:'碳移除规模', bs:'仅生态碳汇',
   why:'长流程为主将推高工业排放，单靠生态碳汇难以抵消，净零路径走不通。',
   sug:'改为「短流程与氢冶金为主」，或把碳移除改为「含工程化移除」。'}
];

/* ---- index.html 第 863-885 行 ---- */
function confList(){
  el('confList', CONFS.map((c,i)=>{
    const done=applied.has(c.id), open=openConf===i;
    return `<div class="conf ${done?'done':''}">
      <div class="h">${done?'✓ 已采纳建议':'矛盾 '+(i+1)+'：'+c.a+'（'+c.as+'）与 '+c.b+'（'+c.bs+'）'}</div>
      <div>${c.why}</div>
      ${open?`<div class="sug"><b>建议：</b>${c.sug}</div>
        <div style="margin-top:9px;display:flex;gap:8px;">
          <button class="btn sm" onclick="applyFix('${c.id}')">${done?'撤销':'采纳建议并重新检验'}</button>
        </div>`:''}
      <div style="margin-top:8px;font-size:12px;">
        <span style="color:${done?'var(--ok)':'var(--pri)'};cursor:pointer;" onclick="toggleConf(${i})">
          ${open?'收起':'查看建议 ▼'}</span></div>
    </div>`;
  }).join('') || '<div class="dim">暂无矛盾项</div>');
}
function toggleConf(i){ openConf=openConf===i?null:i; render(); }
function applyFix(id){
  if(applied.has(id)) applied.delete(id); else applied.add(id);
  render();
  toast(applied.has(id)?'已采纳建议，重新检验完成':'已撤销，重新检验完成');
}
function timeline(){
