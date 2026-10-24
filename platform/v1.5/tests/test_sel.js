// 锁定状态选择语义：B 方案下勾选＝划定可信范围（可多选、可取消）、
// 旧存档多选不再收敛、勾选真的缩小枚举空间
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

console.log('=== 3. 勾另一个：追加进范围，不是替换 ===');
tglState(A, ST(A)[2]);
console.log('  选中:', JSON.stringify(sel.desc[A].states), (sel.desc[A].states.length===2&&sel.desc[A].states.indexOf(ST(A)[2])>=0)?'✓':'✗');

console.log('=== 4. 再点同一个：取消该档 ===');
tglState(A, ST(A)[2]);
console.log('  选中:', JSON.stringify(sel.desc[A].states), (sel.desc[A].states.length===1&&sel.desc[A].states[0]===ST(A)[1])?'✓':'✗');

console.log('=== 5. 切换状态会让下游结果失效 ===');
tglState(A, ST(A)[1]);
cimResult={fake:1}; BAYES={fake:1};
tglState(A, ST(A)[0]);
console.log('  cimResult 已清空:', cimResult===null?'✓':'✗', ' BAYES 已清空:', BAYES===null?'✓':'✗');

console.log('=== 6. 勾选真的缩小枚举空间（B 方案的核心回报） ===');
sel.desc[A].states=[ST(A)[0],ST(A)[1]];
sel.desc[B].states=[ST(B)[0]];
const r=enumCore([A,B],null);
// 注意：r.sizes 始终是全量档位数（导出与报告要用），被勾选收窄的是 r.space
console.log('  space 收窄为 2:', r.space===2?'✓':'✗', '(space='+r.space+')');
sel.desc[A].states=[];   // 一个都不勾＝不设限
const r0=enumCore([A,B],null);
console.log('  空选不设限:', r0.space===ST(A).length*1?'✓':'✗', '(space='+r0.space+')');
sel.desc[A].states=[ST(A)[1]];

console.log('=== 7. 导出用当前选中状态 ===');
const rows=expRows();
console.log('  导出行状态:', rows[0].state, rows[0].state===ST(A)[1]?'✓':'✗');

console.log('=== 8. 旧存档多选保留为范围（不再收敛成第一个） ===');
localStorage.getItem=()=>JSON.stringify({desc:{[A]:{states:[ST(A)[0],ST(A)[1]],src:''}},model:'gcam',exp:1,bayes:false});
loadCfg();
console.log('  保留:', JSON.stringify(sel.desc[A].states), sel.desc[A].states.length===2?'✓':'✗');

console.log('=== 9. 多选时改报「范围里有多少种自洽」 ===');
sel.desc={}; sel.desc[A]={states:[],src:''}; sel.desc[B]={states:[],src:''};
sel.desc[A].states=[ST(A)[0],ST(A)[1]]; sel.desc[B].states=[ST(B)[0]];
const cs=checkSelected([A,B]);
console.log('  返回范围模式:', cs.range?'✓':'✗', JSON.stringify(cs.multi||[]));
sel.desc[A].states=[ST(A)[0]];
console.log('  回到单档时不再报范围:', checkSelected([A,B]).range?'✗':'✓');

console.log('=== 10. 你选的情景：自洽判定 ===');
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

console.log('=== 11. 有描述符没选状态 ===');
sel.desc[A].states=[];
console.log('  missing 计数:', checkSelected([A,B]).missing===1?'✓':'✗');

console.log('=== 12. 「已勾范围」一行确实渲染出来 ===');
sel.desc[A].states=[ST(A)[0],ST(A)[1]];
const sh=selRangeHTML(A);
console.log('  含「已勾范围」:', sh.indexOf('已勾范围')>=0?'✓':'✗');
console.log('  报出 2 档:', sh.indexOf('<b>2</b>')>=0?'✓':'✗');
sel.desc[A].states=[];
const sh0=selRangeHTML(A);
console.log('  空选报「不设限」:', sh0.indexOf('不设限')>=0?'✓':'✗');

console.log('=== 13. 多选提示条 ===');
sel.desc[A].states=[ST(A)[0],ST(A)[1]];
const n13=multiPickNote();
console.log('  非空且点名该描述符:', (n13!==''&&(n13.indexOf(A)>=0||n13.indexOf(DSHORT[A]||A)>=0))?'✓':'✗', '「'+n13.slice(0,28)+'…」');
sel.desc[A].states=[ST(A)[0]];
console.log('  单档时不再提示:', multiPickNote()===''?'✓':'✗');
`;

eval(code + test);
