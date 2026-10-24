// 锁定状态选择语义：单选、点已选取消、旧存档多选收敛、勾选不改变枚举空间
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
sel.desc={};
sel.desc[A]={states:[],src:''}; sel.desc[B]={states:[],src:''};
rngScope='region';

console.log('=== 1. 初始为空 ===');
console.log('  ', sel.desc[A].states.length===0?'✓':'✗');

console.log('=== 2. 勾一个 ===');
tglState(A, ST(A)[1]);
console.log('  选中:', JSON.stringify(sel.desc[A].states), sel.desc[A].states.length===1?'✓':'✗');

console.log('=== 3. 勾另一个：替换，不是追加 ===');
tglState(A, ST(A)[2]);
console.log('  选中:', JSON.stringify(sel.desc[A].states), (sel.desc[A].states.length===1&&sel.desc[A].states[0]===ST(A)[2])?'✓':'✗');

console.log('=== 4. 再点同一个：取消 ===');
tglState(A, ST(A)[2]);
console.log('  选中:', JSON.stringify(sel.desc[A].states), sel.desc[A].states.length===0?'✓':'✗');

console.log('=== 5. 切换状态会让下游结果失效 ===');
tglState(A, ST(A)[1]);
cimResult={fake:1}; BAYES={fake:1};
tglState(A, ST(A)[0]);
console.log('  cimResult 已清空:', cimResult===null?'✓':'✗', ' BAYES 已清空:', BAYES===null?'✓':'✗');

console.log('=== 6. 勾选不改变枚举空间（CIB 不预设取值） ===');
sel.desc[B].states=[ST(B)[0]];
const r=enumCore([A,B],null);
console.log('  sizes:', JSON.stringify(r.sizes), (r.sizes[0]===ST(A).length&&r.sizes[1]===ST(B).length)?'✓':'✗');

console.log('=== 7. 导出用当前选中状态 ===');
tglState(A, ST(A)[1]);
const rows=expRows();
console.log('  导出行状态:', rows[0].state, rows[0].state===ST(A)[1]?'✓':'✗');

console.log('=== 8. 旧存档多选收敛为第一个 ===');
localStorage.getItem=()=>JSON.stringify({desc:{[A]:{states:[ST(A)[0],ST(A)[1]],src:''}},model:'gcam',exp:1,bayes:false});
loadCfg();
console.log('  收敛后:', JSON.stringify(sel.desc[A].states), sel.desc[A].states.length===1?'✓':'✗');

console.log('=== 9. 你选的情景：自洽判定 ===');
sel.desc={}; sel.desc[A]={states:[],src:''}; sel.desc[B]={states:[],src:''};
cim={}; cimKeys().forEach(k=>cim[k]={v:0,conf:'中',why:'',rev:true});
tglState(A,ST(A)[0]); tglState(B,ST(B)[0]);
console.log('  全零矩阵判定为自洽:', checkSelected([A,B]).ok?'✓':'✗');

cim={}; cimKeys().forEach(k=>cim[k]={v:0,conf:'中',why:'',rev:true});
cim[A+'>'+B]={v:3,conf:'高',why:'',rev:true};
cim[B+'>'+A]={v:-3,conf:'高',why:'',rev:true};
const r1=enumCore([A,B],null);
const cons=new Set(r1.consistent.map(cb=>cb.join(',')));
let badCb=null;
for(let i=0;i<ST(A).length&&!badCb;i++){
  for(let j=0;j<ST(B).length;j++){ if(!cons.has(i+','+j)){ badCb=[i,j]; break; } }
}
if(badCb){
  sel.desc[A].states=[ST(A)[badCb[0]]]; sel.desc[B].states=[ST(B)[badCb[1]]];
  const s1=checkSelected([A,B]);
  const bad=s1.rows.filter(x=>x.gap>1e-6);
  console.log('  不自洽组合判定:', !s1.ok?'✓':'✗');
  console.log('  指出拖后腿项:', bad.length>0?'✓':'✗', '（'+bad.length+' 个）');
}else{ console.log('  未找到不自洽组合（跳过）✗'); }

console.log('=== 10. 有描述符没选状态 ===');
sel.desc[A].states=[];
console.log('  missing 计数:', checkSelected([A,B]).missing===1?'✓':'✗');
`;

eval(code + test);
