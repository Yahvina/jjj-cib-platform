/* H1 ｜ 功能对比首屏 ｜ 核心逻辑 */

/* ---- index.html 第 562-567 行 ---- */
const SCEN=[
  {n:'2030 年非化石能源目标', d:12, lv:3, c:12, k:6},
  {n:'三地协同减排路径',     d:9,  lv:3, c:9,  k:4},
  {n:'河北钢铁工艺转型',     d:7,  lv:2, c:7,  k:3}
];


/* ---- index.html 第 581-627 行 ---- */
function renderCmp(){
  const s=SCEN[scenIdx];
  const manual=s.d*s.lv*3-8;                 // 需人工核对项：描述符 × 层级 × 系数
  const auto=0;                              // 本平台靠联动约束自动核对
  const rest=Math.max(2,s.k-s.applied());
  document.getElementById('scen').innerHTML=SCEN.map((x,i)=>
    `<div class="s ${i===scenIdx?'on':''}" onclick="pickScen(${i})">${x.n}</div>`).join('');

  const rows=[
    ['参数设定',
     `各层级分别设，变量名与单位不统一<br><span class="dim">${s.d} 个描述符要分别落到两套模型文件</span>`,
     `三级共用同一套描述符，格式统一<br><span class="dim">一次配置，三层同时生效</span>`],
    ['语义翻译',
     `没有这一环，直接给系数值<br><span class="dim">说不清系数是怎么来的</span>`,
     `每个描述符都带翻译依据<br><span class="dim">可展开、可复算、可追溯</span>`],
    ['跨层对齐',
     `手工核对，下级加总是否等于上级靠人查<br><span class="dim">本次需人工核对 <span class="mk">${manual}</span> 项</span>`,
     `上下联动约束自动检验<br><span class="dim">不一致项自动标出，<span class="ok">${auto}</span> 项靠人查</span>`],
    ['矛盾检查',
     `没有机制检查假设之间是否打架<br><span class="dim">矛盾要到跑完模型才发现</span>`,
     `交叉影响矩阵逐对检验<br><span class="dim">事前发现 <span class="mk">${s.c}</span> 组矛盾并给处理建议</span>`],
    ['参数来源',
     `参数由专家主观给定，说不清依据<br><span class="dim">别人无法复算，也无法追溯</span>`,
     `状态定义从政策数据库取预设<br><span class="dim">标注来源路径，可复算、可追溯</span>`],
    ['输出',
     `手动改配置文件，容易出错<br><span class="dim">换模型要重配一遍</span>`,
     `一键生成，自动适配目标模型格式<br><span class="dim">GCAM 出 XML，CHEER 出 CSV</span>`],
    ['自洽情景',
     `<span class="mk">无法给出</span>：不检查一致性，组合是否自洽无从判断`,
     `<span class="ok">${rest} 组</span>逻辑自洽的情景，可直接进下游模型`]
  ];
  document.getElementById('cmpBox').innerHTML=
    `<div class="crow hd"><div class="clbl" style="font-weight:400;color:var(--tx3);">环节</div>
      <div class="cell badc">现有做法</div><div class="cell goodc">本平台</div></div>`+
    rows.map(r=>`<div class="crow"><div class="clbl">${r[0]}</div>
      <div class="cell badc">${r[1]}</div><div class="cell goodc">${r[2]}</div></div>`).join('');

  document.getElementById('verdict').innerHTML=
    `<div class="vc a"><div class="n">${manual}</div><div class="l">现有做法需人工核对的项数</div></div>
     <div class="vc b"><div class="n">${s.c}</div><div class="l">事前发现的矛盾组合（现有做法为 0）</div></div>
     <div class="vc b"><div class="n">${rest}</div><div class="l">可直接进模型的自洽情景</div></div>`;
  document.getElementById('verdictNote').textContent=
    '口径说明：人工核对项＝描述符数 × 联动层数 × 3 − 8；矛盾组合与自洽情景为模拟数值，接入算法后由实际检验生成。';
}
SCEN.forEach(x=>x.applied=()=>Math.min(2,x.c>=12?2:(x.c>=9?1:0)));

/* ================= 步骤 1 ================= */
