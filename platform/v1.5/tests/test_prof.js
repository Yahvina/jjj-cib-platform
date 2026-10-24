// 验证影响谱：基准集、强制后的收缩、整行无解、状态被挤掉
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
global.setTimeout = (f) => f();

const code = fs.readFileSync(process.argv[2], 'utf8');

const test = `
render=function(){}; toast=function(){};
const A='一次能源结构', B='产业结构', C='终端电气化率';
sel.desc={};
[A,B,C].forEach(n=>{ sel.desc[n]={states:ST(n).slice(),src:''}; });
const zero=()=>{ cim={}; cimKeys().forEach(k=>cim[k]={v:0,conf:'低',why:'',rev:false}); };
const set=(a,b,v)=>{ cim[a+'>'+b]={v:v,conf:'中',why:'',rev:false}; };
console.log('状态数: A='+ST(A).length+' B='+ST(B).length+' C='+ST(C).length);

console.log();
console.log('=== 1. 全 0 矩阵：基准 27 组，强制后各 9 组，无状态被挤掉 ===');
zero();
let r=computeProfile();
console.log('  基准:', r.baseCount, '(应为 27)');
console.log('  行数:', r.rows.length, '(应为 9)');
const rA0=r.rows.find(x=>x.d===A&&x.i===0);
console.log('  强制 A 第 1 档 → 自洽', rA0.n, '组（应 9），挤掉', rA0.lose.length, '个状态（应 0）');
console.log('  判定:', (r.baseCount===27 && r.rows.length===9 && rA0.n===9 && rA0.lose.length===0)?'✓':'✗');

console.log();
console.log('=== 2. 让 A 第 1 档永远不是最优 → 强制它时无解 ===');
zero();
[A,B,C].forEach(d=>{
  cim[d+'>'+A]={v:0,conf:'中',why:'',rev:false,
    st:{'0_0':-3,'0_1':3,'1_0':-3,'1_1':3,'2_0':-3,'2_1':3}};
});
r=computeProfile();
const rowA0=r.rows.find(x=>x.d===A&&x.i===0);
console.log('  基准:', r.baseCount, '组（A 只能取第 2 档 → 应为 9）');
console.log('  强制 A 第 1 档 → 空集:', rowA0.empty?'是 ✓':'否 ✗');
console.log('  无解行数:', r.rows.filter(x=>x.empty).length, '（A 的第 1、3 档都不是最优 → 应 2）');

console.log();
console.log('=== 3. 强制某档会把别的档位挤掉 ===');
zero();
cim[A+'>'+B]={v:0,conf:'中',why:'',rev:false, st:{'0_0':3,'0_1':0,'0_2':-3}};
r=computeProfile();
console.log('  基准:', r.baseCount, '组（A 取第1档时只允许 B 第1档；其余 A 档全允许 → 应为 21）');
const ra0=r.rows.find(x=>x.d===A&&x.i===0);
console.log('  强制 A 第 1 档 → 自洽', ra0.n, '组（应 3）');
console.log('  被挤掉的状态:', ra0.lose.map(x=>x.nm).join(' / ')||'（无）');
console.log('  判定:', (r.baseCount===21 && ra0.n===3 && ra0.lose.length===2)?'✓':'✗');

console.log();
console.log('=== 4. 渲染 ===');
// 换成「A 第 1 档永远不是最优」的矩阵，确保有一行是空集
zero();
[A,B,C].forEach(d=>{
  cim[d+'>'+A]={v:0,conf:'中',why:'',rev:false,
    st:{'0_0':-3,'0_1':3,'1_0':-3,'1_1':3,'2_0':-3,'2_1':3}};
});
computeProfile();
const emptyIdx=profResult.rows.findIndex(x=>x.empty);
profileSel=(emptyIdx>=0?emptyIdx:0);
renderProf();
let h=document.getElementById('profBox').innerHTML||'';
console.log('  含表格:', /proftab/.test(h)?'✓':'✗', '| 含基准行:', /基准情景集/.test(h)?'✓':'✗');
console.log('  含无解提示:', /没有任何自洽情景/.test(h)?'✓（已选中行）':'—');
console.log('  含硬约束说明:', /硬约束/.test(h)?'✓':'✗');

console.log();
console.log('=== 5. 描述符不足时给出错误而非崩溃 ===');
sel.desc={}; sel.desc[A]={states:ST(A).slice(),src:''};
const e=computeProfile();
console.log('  返回错误:', e.err?('是（'+e.err+'）✓'):'否 ✗');
`;

eval(code + test);
