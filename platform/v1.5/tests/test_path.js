// 验证影响路径分析：链的强度取最弱环节、方向看负号奇偶、隐性关联识别
const fs = require('fs');

const EL = {};
function mkEl() {
  return {
    innerHTML: '', textContent: '', value: '', style: {}, dataset: {}, files: [], checked: false,
    classList: { add() {}, remove() {}, toggle() {} },
    querySelector: () => mkEl(), querySelectorAll: () => [],
    appendChild() {}, click() {}, remove() {}, parentElement: { children: [] },
    getBoundingClientRect: () => ({ top: 0, left: 0 }), addEventListener() {}
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
render=function(){}; toast=function(){};
const A='一次能源结构', B='产业结构', C='终端电气化率', D='碳价水平与碳市场覆盖';
sel.desc={};
[A,B,C,D].forEach(n=>{ sel.desc[n]={states:ST(n).slice(),src:''}; });
cim={}; cimKeys().forEach(k=>cim[k]={v:0,conf:'低',why:'',rev:false});
const set=(a,b,v)=>{ cim[a+'>'+b]={v:v,conf:'中',why:'',rev:false}; };

console.log('=== 1. 基本传导：A→B=+2, B→C=+3 ===');
set(A,B,2); set(B,C,3);
let ps=pathRanked(A,C);
console.log('  找到', ps.length, '条链（应为 1）');
console.log('  路径:', ps[0].nodes.join(' → '), '| 强度', ps[0].minAbs, '（应为 2，取最弱）', '| 方向', ps[0].dir);
console.log('  判定:', (ps.length===1 && ps[0].minAbs===2 && ps[0].dir==='pos')?'✓':'✗');
console.log();

console.log('=== 2. 方向：负号奇偶 ===');
set(B,C,-3);
ps=pathRanked(A,C);
console.log('  A→B=+2, B→C=−3 →', ps[0].dir, '（应为 neg）',
  (ps[0].dir==='neg')?'✓':'✗');
set(B,C,3); set(C,B,-3);
ps=pathRanked(A,B);
console.log('  双负链 A→C→B 存在时 A→B 直接边=0：链数', ps.length,
  '方向', ps.length?ps[0].dir:'—');
console.log();

console.log('=== 3. 三段的链（2 个中间环节）===');
set(C,D,1);
ps=pathRanked(A,D);
console.log('  A→B→C→D 找到', ps.length, '条 | 最长段数', ps.length?ps[0].len:0);
console.log('  应为 1 条、3 段；强度应取最弱 1：', ps.length? (ps[0].len===3 && ps[0].minAbs===1 ? '✓':'✗') : '✗');
console.log();

console.log('=== 4. 不超过 3 段：四段通路不应返回 ===');
set(D,A,0); set(A,B,2); set(B,C,3); set(C,D,1);
// 造 A→B→C→D→? 需要第 5 个节点；此处验证 A→D 不走重复节点
ps=pathRanked(A,D);
console.log('  A→D 返回', ps.length, '条，最长', ps.length?Math.max(...ps.map(x=>x.len)):0, '段（上限 3）',
  ps.length && Math.max(...ps.map(x=>x.len))<=3 ? '✓':'✗');
console.log();

console.log('=== 5. 无通路 ===');
cim={}; cimKeys().forEach(k=>cim[k]={v:0,conf:'低',why:'',rev:false});
console.log('  全 0 时 A→C 链数', pathRanked(A,C).length, '（应为 0）',
  pathRanked(A,C).length===0?'✓':'✗');
console.log();

console.log('=== 6. 隐性关联：直接为 0 但有间接通路 ===');
set(A,B,2); set(B,C,3);
console.log('  A→C 直接值', pv(A,C), '（应为 0）');
const hid=hiddenLinks();
const found=hid.find(x=>x.from===A && x.to===C);
console.log('  是否被列为隐性关联:', found? ('是（'+found.n+' 条链，最强 '+found.best.minAbs+'）') : '否');
console.log('  判定:', (pv(A,C)===0 && found) ? '✓':'✗');
console.log('  隐性关联总对数:', hid.length);
console.log();

console.log('=== 7. 直接判断填 0 但存在链时应提示 ===');
cim[A+'>'+C]={v:0,conf:'低',why:'',rev:false};
// 另造一对：C→A 直接为 0，但 C→D→A 有通路（D 已有边 C→D=1、需 D→A）
cim[C+'>'+A]={v:0,conf:'低',why:'',rev:false};
cim[D+'>'+A]={v:2,conf:'中',why:'',rev:false};
pathFrom=A; pathTo=C; renderPath();
const h=document.getElementById('pathBox').innerHTML||'';
console.log('  含提示语:', /这两个描述符其实有关系/.test(h) ? '✓' : '✗');
console.log('  含链数行:', /间接传导链/.test(h) ? '✓' : '✗');
console.log('  含隐性关联区:', /隐性关联/.test(h) ? '✓' : '✗');
console.log();

console.log('=== 8. 描述符不足 3 个时给出提示 ===');
sel.desc={}; sel.desc[A]={states:ST(A).slice(),src:''};
renderPath();
const h2=document.getElementById('pathBox').innerHTML||'';
console.log('  提示语:', /至少勾选三个描述符/.test(h2) ? '✓' : '✗');
`;

eval(code + test);
