/* H10 ｜ 九个工具收进一个工作台（正文只留结论） ｜ 核心逻辑
   摘自 _src/v15/src/app.js，按声明整段切出，未作改写。
   下面每个函数在 app.js 里的位置见本目录 README。 */

function openAdv(tab){ advOpen=true; advTab=tab||advTab||'filter'; render(); }

function closeAdv(){ advOpen=false; render(); }

function advGo(t){ advTab=t; render(); }

function renderAdv(){
  const m=document.getElementById('advModal'); if(!m) return;
  m.classList.toggle('on',advOpen);
  const nav=document.getElementById('advNav'); if(!nav) return;
  let h='';
  ADV_TABS.forEach(t=>{
    if(!t[1]){ h+='<div class="advgrp">'+t[0]+'</div>'; return; }
    h+='<button class="advtab'+(advTab===t[0]?' on':'')+'" onclick="advGo(\''+t[0]+'\')">'+t[1]+'</button>';
  });
  nav.innerHTML=h;
  document.querySelectorAll('#advModal .advpane').forEach(p=>{
    p.classList.toggle('on',p.getAttribute('data-t')===advTab);
  });
}

const ADV_TABS=[
  ['深挖',null],
  ['filter','情景筛选'],
  ['conf','矛盾组合'],
  ['可靠性',null],
  ['robust','稳健性检验'],
  ['ens','集成与分歧'],
  ['corr','相关性分析'],
  ['prof','影响谱'],
  ['工具箱',null],
  ['impactFig','影响关系图'],
  ['path','影响路径分析'],
  ['tabFig','情景表'],
];
