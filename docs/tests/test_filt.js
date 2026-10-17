// 验证情景筛选：条件过滤、AND 组合、空结果、展示层是否跟随
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

const DS=['经济增长速度','产业结构','人口空间分布与收缩态势'];
sel.desc={}; DS.forEach(n=>sel.desc[n]={states:ST(n).slice(), src:''});
cimResult={
  ds:DS.slice(),
  consistent:[[0,0,0],[0,0,1],[0,1,0],[1,0,0],[1,1,1],[2,2,2],[2,2,0]],
  total:200, checked:200, inconsistent:193
};
filt={};

/* ===== 1. 无条件下等于全量 ===== */
console.log('无条件: 命中', filtList().length, '/', cimResult.consistent.length, '(应相等)');

/* ===== 2. 单条件 ===== */
setFilt('经济增长速度','0');
console.log('经济=高速(第1档): 命中', filtList().length, '(应为 3)');
setFilt('经济增长速度','');
console.log('清掉条件后:', filtList().length, '(应为 7)');

/* ===== 3. 多条件 AND ===== */
setFilt('经济增长速度','0');
setFilt('产业结构','0');
console.log('经济=高速 且 产业=加速服务化: 命中', filtList().length, '(应为 2)');

/* ===== 4. 空结果 ===== */
// 经济=高速 且 人口=加速收缩 —— 数据里没有这一组，应当是 0
setFilt('人口空间分布与收缩态势','2');
console.log('再加 人口=加速收缩: 命中', filtList().length, '(应为 0)');
renderFilt();
console.log('  空结果提示:', /不存在/.test(EL['filtBox'].innerHTML) ? '已提示 ✓' : '未提示 ✗');
console.log('  文案含「这本身就是一条结论」:', /这本身就是一条结论/.test(EL['filtBox'].innerHTML) ? '✓' : '✗');

/* ===== 5. 筛选后展示层是否跟随 ===== */
setFilt('人口空间分布与收缩态势','');
console.log('恢复到 2 个条件，命中', filtList().length);
renderTableau();
const tb=EL['tabFig'].innerHTML;
console.log('  情景表: 含「已按筛选条件」', /已按筛选条件/.test(tb) ? '✓' : '✗',
  '| 列数（情景数+表头）', (tb.match(/<th/g)||[]).length);
renderMap();
const mp=EL['mapFig'].innerHTML;
console.log('  情景地图: 含「已按筛选条件」', /已按筛选条件/.test(mp) ? '✓' : '✗');
mapMode='heat';
renderMap();
const ht=EL['mapFig'].innerHTML;
console.log('  热力图: 含「筛选命中的 2 个情景」', /筛选命中的 2 个情景/.test(ht) ? '✓' : '✗');

/* ===== 6. 清除 ===== */
clearFilt();
console.log('清除后: 条件数', filtN(), '| 命中', filtList().length, '(应为 0 / 7)');
console.log('崩溃检测: 已完整执行到结尾 ✓');
`;

eval(code + '\n' + test);
