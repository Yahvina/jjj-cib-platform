// 验证矛盾组合：来自检验结果、不是写死的表；建议可共存的档位；采纳后真的改状态并重算
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
const A='产业结构', B='一次能源结构';
sel.desc={}; sel.desc[A]={states:[],src:''}; sel.desc[B]={states:[],src:''};
cim={}; cimKeys().forEach(k=>cim[k]={v:0,conf:'中',why:'',rev:true});
cim[A+'>'+B]={v:2,conf:'高',why:'',rev:true};
cim[B+'>'+A]={v:0,conf:'高',why:'',rev:true};

console.log('=== 1. 没跑检验时，不给假结论 ===');
cimResult=null;
console.log('  need=check:', confPairs().need==='check'?'✓':'✗');

console.log('=== 2. 矛盾来自自洽集，不是写死的表 ===');
const r=enumCore([A,B],null);
console.log('  自洽组数:', r.consistent.length);
const cons=new Set(r.consistent.map(cb=>cb.join(',')));
let bad=null;
for(let i=0;i<ST(A).length&&!bad;i++){
  for(let j=0;j<ST(B).length;j++){ if(!cons.has(i+','+j)){ bad=[i,j]; break; } }
}
cimResult={ds:[A,B], consistent:r.consistent, sampled:false, sizes:[ST(A).length,ST(B).length]};
sel.desc[A].states=[ST(A)[bad[0]]]; sel.desc[B].states=[ST(B)[bad[1]]];
const cf=confPairs();
console.log('  检出矛盾对:', cf.pairs.length, cf.pairs.length>=1?'✓':'✗');
const p=cf.pairs[0];
console.log('  矛盾内容:', A+'('+ST(A)[p.ai]+') × '+B+'('+ST(B)[p.bj]+')');

console.log('=== 3. 建议必须真的能共存 ===');
const okA=p.altA.every(k=>r.consistent.some(c=>c[0]===k&&c[1]===p.bj));
const okB=p.altB.every(k=>r.consistent.some(c=>c[0]===p.ai&&c[1]===k));
console.log('  A 的替代档:', p.altA.map(k=>ST(A)[k]).join(' / ')||'（无）', okA?'✓':'✗');
console.log('  B 的替代档:', p.altB.map(k=>ST(B)[k]).join(' / ')||'（无）', okB?'✓':'✗');
console.log('  至少一边有替代:', (p.altA.length+p.altB.length)>0?'✓':'✗');

console.log('=== 4. 采纳建议：真的改状态并重算 ===');
const target=(p.altA.length?[A,p.altA[0]]:[B,p.altB[0]]);
cimResult=null;
applyConfFix(target[0], target[1]);
console.log('  状态已改为:', JSON.stringify(sel.desc[target[0]].states), sel.desc[target[0]].states[0]===ST(target[0])[target[1]]?'✓':'✗');
console.log('  已重算:', cimResult?'✓':'✗');
console.log('  新结果不空:', cimResult&&cimResult.consistent.length>0?'✓':'✗');

console.log('=== 5. 没有自洽情景时，明确说无法判断 ===');
cimResult={ds:[A,B], consistent:[], sampled:false, sizes:[3,3]};
console.log('  need=empty:', confPairs().need==='empty'?'✓':'✗');
`;

eval(code + test);
