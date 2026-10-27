// 验证稳健性检验：buildIMP/evalCombo 与 enumCore 判据一致、扰动轮次、确定性、过期提示
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
const keys=cimKeys();

function fill(seed){
  cim={};
  keys.forEach(k=>cim[k]={v:0,conf:'中',why:'',rev:true});
  cim[A+'>'+B]={v:3,conf:'高',why:'',rev:true};
  cim[B+'>'+A]={v:2,conf:'中',why:'',rev:true};
  cim[A+'>'+C]={v:-2,conf:'低',why:'',rev:false};
  cim[B+'>'+C]={v:1,conf:'中',why:'',rev:true};
  cim[C+'>'+A]={v:-1,conf:'高',why:'',rev:true};
  cim[C+'>'+B]={v:2,conf:'低',why:'',rev:false};
}

console.log('=== 1. 判据一致：evalCombo 全枚举应与 enumCore 相同 ===');
fill();
anchors={};
const e=enumCore([A,B,C],null);
const S=comboSample([A,B,C],10000,7);
let cnt=0;
S.combos.forEach(c=>{ if(evalCombo(buildIMP([A,B,C],cim),ST&&([A,B,C].map(x=>ST(x).length)),c)) cnt++; });
console.log('  enumCore 自洽:', e.consistent.length, ' evalCombo 自洽:', cnt, ' 全枚举:', S.combos.length);
console.log('  判定:', (e.consistent.length===cnt && S.combos.length===27)?'✓':'✗');

console.log();
console.log('=== 2. 无打分时报错 ===');
cim={};
let r=computeRobust(20, 7);
console.log('  返回:', r&&r.err?('是（'+r.err+'）✓'):'否 ✗');

console.log();
console.log('=== 3. 正常扰动：轮次、状态数、区间合法性 ===');
fill();
r=computeRobust(20, 42);
console.log('  无错误:', r.err?'✗':'✓');
console.log('  轮次:', r.R, '(应 20)');
console.log('  基准自洽:', r.baseCount, '(应 > 0)');
console.log('  状态行数:', r.states.length, '(应 9 = 3 描述符 × 3 档)');
const okRange=r.states.every(s=>s.rate>=0&&s.rate<=1);
console.log('  出现率都在 [0,1]:', okRange?'✓':'✗');
console.log('  自洽数区间有序:', (r.min<=r.avg&&r.avg<=r.max)?'✓':'✗');
console.log('  敏感判断已排序:', r.cells.every((c,i,a)=>i===0||a[i-1].flip>=c.flip)?'✓':'✗');

console.log();
console.log('=== 4. 同种子确定性 ===');
const r2=computeRobust(20, 42);
console.log('  两次自洽数序列一致:', (r.counts.join()===r2.counts.join())?'✓':'✗');

console.log();
console.log('=== 5. 打分改动后，稳健性结果应提示过期 ===');
fill();
computeRobust(10, 7);
renderRobust();
let h=document.getElementById('robBox').innerHTML||'';
console.log('  初次无过期提示:', /与当前判断不一致/.test(h)?'✗':'✓');
cim[A+'>'+B].v=1;
renderRobust();
h=document.getElementById('robBox').innerHTML||'';
console.log('  改动后出现过期提示:', /与当前判断不一致/.test(h)?'✓':'✗');

console.log();
console.log('=== 6. 轮次上限钳制 ===');
fill();
r=computeRobust(999, 7);
console.log('  请求 999 轮，实际:', r.R, '(应钳到 100)');
r=computeRobust(2, 7);
console.log('  请求 2 轮，实际:', r.R, '(应抬到 5)');
`;

eval(code + test);
