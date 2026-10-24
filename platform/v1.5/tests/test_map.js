// 验证情景地图：相似度、聚类、族的定义、热力图计数
const fs = require('fs');

const EL = {};
function mkEl() {
  return {
    innerHTML: '', textContent: '', disabled: false, value: '',
    style: {}, dataset: {}, files: [], checked: false,
    classList: { add() {}, remove() {}, toggle() {} },
    querySelector: () => mkEl(), querySelectorAll: () => [],
    appendChild() {}, click() {}, remove() {},
    parentElement: { children: [] },
    getBoundingClientRect: () => ({ top: 0, left: 0 }),
    addEventListener() {}
  };
}
global.document = {
  getElementById: (id) => { if (!EL[id]) EL[id] = mkEl(); return EL[id]; },
  querySelector: () => mkEl(), querySelectorAll: () => [],
  createElement: () => mkEl(), body: mkEl(), addEventListener() {}
};
global.window = { scrollTo() {}, addEventListener() {}, localStorage: { getItem: () => null, setItem() {} } };
global.localStorage = global.window.localStorage;
global.alert = () => {};
global.FileReader = function () {};
global.Blob = function () {};
global.URL = { createObjectURL: () => '', revokeObjectURL() {} };

const code = fs.readFileSync(process.argv[2], 'utf8');

const test = `
render=function(){};

/* ===== 1. 相似度 ===== */
console.log('相似度 [0,0,0] vs [0,0,0]:', scenSim([0,0,0],[0,0,0]), '(应为 1)');
console.log('相似度 [0,0,0] vs [0,0,1]:', scenSim([0,0,0],[0,0,1]).toFixed(3), '(应为 0.667)');
console.log('相似度 [0,0,0] vs [2,2,2]:', scenSim([0,0,0],[2,2,2]), '(应为 0)');
console.log();

/* ===== 2. 聚类：3 个描述符时允许差 1 个 ===== */
const DS=['经济增长速度','产业结构','人口空间分布与收缩态势'];
sel.desc={}; DS.forEach(n=>sel.desc[n]={states:ST(n).slice(), src:''});
cimResult={
  ds:DS.slice(),
  consistent:[[0,0,0],[0,0,1],[1,1,1],[1,1,2],[2,2,2]],
  total:100, checked:100, inconsistent:90
};
const cl=scenClusters();
console.log('描述符数:', cimResult.ds.length, '| 允许差异:', cl.allow, '(应为 1)');
console.log('聚类结果:', cl.groups.length, '个族');
cl.groups.forEach((g,i)=>console.log('   族'+(i+1)+':', g.map(k=>'['+cimResult.consistent[k].join(',')+']').join(' ')));
console.log();

/* ===== 3. 族的定义 ===== */
cl.groups.forEach((g,i)=>{
  console.log('族'+(i+1)+' 的定义:', familyDesc(g).join('　·　') || '（族内取值不一）');
});
console.log();

/* ===== 4. 渲染聚类图 ===== */
mapMode='cluster';
renderMap();
const fig=EL['mapFig'].innerHTML;
console.log('聚类图: 含 SVG', /<svg/.test(fig) ? '✓' : '✗',
  '| 点数', (fig.match(/<circle/g)||[]).length - 0, '| 含情景提示', /<title>情景 /.test(fig) ? '✓' : '✗');
console.log('  标签按钮:', (EL['mapTabs'].innerHTML.match(/<button/g)||[]).length, '个');
console.log();

/* ===== 5. 热力图计数 ===== */
cimResult.consistent=[[0,0,0],[0,0,1],[0,1,0],[1,1,1],[1,1,2],[2,2,2]];
mapMode='heat';
renderMap();
const hf=EL['mapFig'].innerHTML;
// 经济增长速度：0 出现 3 次 / 6，1 出现 2 次，2 出现 1 次
console.log('热力图: 含表格', /class="heat"/.test(hf) ? '✓' : '✗');
const titles=[...hf.matchAll(/title="([^"]+)"/g)].map(m=>m[1]);
console.log('  首行三格:');
titles.filter(t=>t.indexOf('经济增长速度')===0).forEach(t=>console.log('    ', t));
console.log('  "锁死"提示:', /被其他条件锁死/.test(hf) ? '有' : '无', '(本组数据无 100% 档位，应无)');
console.log();

/* ===== 6. 颜色插值 ===== */
const c0=heatColor(0), c5=heatColor(0.5), c1=heatColor(1);
console.log('颜色 0%:', c0.bg, '| 50%:', c5.bg, '| 100%:', c1.bg);
console.log('  0% 文字色:', c0.fg, '| 100% 文字色:', c1.fg, '(深色时应转白)');
console.log();

/* ===== 7. 全部同档位时应提示锁死 ===== */
cimResult.consistent=[[0,0,0],[0,0,0],[0,0,0]];
renderMap();
console.log('全同档位时提示锁死:', /被其他条件锁死/.test(EL['mapFig'].innerHTML) ? '✓' : '✗');
console.log('崩溃检测: 已完整执行到结尾 ✓');
`;

eval(code + '\n' + test);
