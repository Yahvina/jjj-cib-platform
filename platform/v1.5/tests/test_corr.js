// 验证相关性：φ 系数数值、同描述符排除、无区分度跳过、弱样本提示
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
const st=(a,b,o)=>{ cim[a+'>'+b]={v:0,conf:'中',why:'',rev:false,st:o}; };
const find=(r,da,ia,db,ib)=>{
  const x=r.states.findIndex(s=>s.d===da&&s.i===ia);
  const y=r.states.findIndex(s=>s.d===db&&s.i===ib);
  const p=r.pairs.find(q=>(q.a===x&&q.b===y)||(q.a===y&&q.b===x));
  return p?Math.round(p.phi*100):null;
};

console.log('=== 1. 部分耦合：手算 φ 应为 +47% 与 −26% ===');
zero();
st(A,B,{'0_0':3,'0_1':0,'0_2':-3});
let r=computeCorr();
console.log('  情景数:', r.S, '(应 21)');
console.log('  可计算状态对:', r.pairs.length, '(应 27，只算跨描述符)');
console.log('  A第1档 ↔ B第1档:', find(r,A,0,B,0)+'%', '(手算 +47%)');
console.log('  A第1档 ↔ B第2档:', find(r,A,0,B,1)+'%', '(手算 −26%)');
console.log('  A第2档 ↔ B第2档:', find(r,A,1,B,1)+'%', '(手算 +9%)');
console.log('  判定:', (r.S===21 && r.pairs.length===27 &&
  find(r,A,0,B,0)===47 && find(r,A,0,B,1)===-26)?'✓':'✗');

console.log();
console.log('=== 2. 完全耦合：应出现 +100% 与 −100% ===');
zero();
[A,B,C].forEach(d=>{});
st(A,B,{'0_0':3,'0_1':-3,'0_2':-3,'1_0':-3,'1_1':-3,'1_2':3,'2_0':-3,'2_1':3,'2_2':-3});
r=computeCorr();
console.log('  情景数:', r.S, '(应 9)');
console.log('  A第1档 ↔ B第1档:', find(r,A,0,B,0)+'%', '(应 +100%)');
console.log('  A第1档 ↔ B第3档:', find(r,A,0,B,2)+'%', '(手算 −50%)');
console.log('  A第2档 ↔ B第3档:', find(r,A,1,B,2)+'%', '(应 +100%)');
const strong=r.pairs.filter(p=>Math.abs(p.phi)>=0.8);
console.log('  强关联对数:', strong.length, '(应 ≥ 2)');
console.log('  判定:', (r.S===9 && find(r,A,0,B,0)===100 && find(r,A,0,B,2)===-50
  && find(r,A,1,B,2)===100 && strong.length>=2)?'✓':'✗');

console.log();
console.log('=== 3. 同描述符内部配对不应出现 ===');
const sameDesc=r.pairs.some(p=>r.states[p.a].d===r.states[p.b].d);
console.log('  存在同描述符配对:', sameDesc?'是 ✗':'否 ✓');

console.log();
console.log('=== 4. 全零矩阵：各状态互不相关，φ 应全为 0 ===');
zero();
r=computeCorr();
const maxAbs=r.pairs.reduce((a,p)=>Math.max(a,Math.abs(p.phi)),0);
console.log('  情景数:', r.S, '(27)');
console.log('  可计算对数:', r.pairs.length, '(每档都出现在 9/27 组里 → 27 对)');
console.log('  最大 |φ|:', maxAbs.toFixed(3), '(应 0)');
console.log('  判定:', (r.S===27 && r.pairs.length===27 && maxAbs<1e-9)?'✓':'✗');

console.log();
console.log('=== 5. 小情景集会提示不稳定 ===');
zero();
st(A,B,{'0_0':3,'0_1':-3,'0_2':-3,'1_0':-3,'1_1':-3,'1_2':3,'2_0':-3,'2_1':3,'2_2':-3});
r=computeCorr();
corrPick=null; renderCorr();
let h=document.getElementById('corrBox').innerHTML||'';
console.log('  情景数', r.S, '→ weak 标记:', r.weak?'✓':'✗');
console.log('  含「可能不稳定」提示:', /可能不稳定/.test(h)?'✓':'✗');
console.log('  含强关联列表:', /几乎捆绑的状态对/.test(h)?'✓':'✗');

console.log();
console.log('=== 6. 关联谱（单个状态） ===');
corrPick=String(r.states.findIndex(s=>s.d===A&&s.i===0));
renderCorr();
h=document.getElementById('corrBox').innerHTML||'';
const bars=(h.match(/class="corow"/g)||[]).length;
console.log('  关联谱行数:', bars, '(应 > 0)');
console.log('  含百分比:', /[-+]?\\d+%/.test(h)?'✓':'✗');

console.log();
console.log('=== 7. 描述符不足时返回错误 ===');
sel.desc={}; sel.desc[A]={states:ST(A).slice(),src:''};
const e=computeCorr();
console.log('  返回错误:', e.err?('是（'+e.err+'）✓'):'否 ✗');
`;

eval(code + test);
