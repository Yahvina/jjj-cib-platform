// 验证数值锚定：解析、状态排除、搜索空间收窄、是否真影响检算
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
toast=function(){};              // 屏蔽提示

const A='经济增长速度', B='产业结构', C='人口空间分布与收缩态势';
const DS=[A,B,C];
sel.desc={}; DS.forEach(n=>sel.desc[n]={states:ST(n).slice(), src:''});

console.log('=== 1. 解析 ===');
[[ '4.8','单值' ],['4.5~5.0','区间'],[ '-20~-5','负值区间' ],['','空（清除）'],['abc','非法']].forEach(([v,t])=>{
  const r=parseAnc(v);
  console.log('  '+t.padEnd(8,'　')+' '+(v||'（空）').padEnd(9)+' → '+(r?('['+r.lo+', '+r.hi+']'):'null'));
});
console.log();

console.log('=== 2. 锚定 4.8 于「经济增长速度」，哪些状态还可用 ===');
anchors={};
setAnc(A,'4.8');
console.log('  状态：'+ST(A).join(' / '));
console.log('  区间：'+defsOf(A).map(d=>d.n+'['+d.lo+','+d.hi+']').join(' '));
const al=ancAllowed(A);
console.log('  可用：'+al.map(j=>ST(A)[j]).join(' / ')+'　（应只剩「中速」——4.8 落在 3.5~5.0）');
console.log();

console.log('=== 3. 锚定 4.5~5.5 应保留两档 ===');
setAnc(A,'4.5~5.5');
console.log('  可用：'+ancAllowed(A).map(j=>ST(A)[j]).join(' / ')+'　（应为 高速 / 中速）');
console.log();

console.log('=== 4. 没有区间的状态不因锚定被否掉 ===');
setAnc(A,'99');                                  // 远离所有区间
console.log('  锚定 99（远超所有档）后可用数：'+ancAllowed(A).length+'　（应为 0）');
defsOf(A)[1].lo=null; defsOf(A)[1].hi=null;      // 抹掉「中速」的区间
console.log('  抹掉「中速」区间后再算：'+ancAllowed(A).map(j=>ST(A)[j]).join(' / ')+'　（应保留「中速」，缺依据不排除）');
console.log();

console.log('=== 5. 搜索空间收窄 ===');
anchors={};
ST(A).forEach((s,j)=>{});                        // 还原不动（defsOf 里已改，下面手动还原）
defsOf(A)[1].lo=3.5; defsOf(A)[1].hi=5.0;
cim={}; cimKeys().forEach(k=>cim[k]={v:0,conf:'低',why:'',rev:false});
runCIM();
console.log('  无锚定：组合空间 '+cimResult.total+' → 检查 '+cimResult.checked+'，自洽 '+cimResult.consistent.length);
const base=cimResult.total, baseOk=cimResult.consistent.length;

setAnc(A,'4.8');
runCIM();
console.log('  锚定后：组合空间 '+cimResult.total+' → 收窄为 '+cimResult.space+'，自洽 '+cimResult.consistent.length);
console.log('  （27 → 9 为正确；自洽数应同步下降，证明锚定进了检算而不是只改了显示）');
console.log();

console.log('=== 6. 锚定把所有状态排除时应直接拒算 ===');
let lastToast='';
toast=function(m){ lastToast=m; };
cimResult={space:9, total:27, consistent:[], ds:DS};   // 占位，看会不会被覆盖
anchors[A]={lo:99,hi:99};                              // 绕过 setAnc，避免它先清空结果
runCIM();
console.log('  提示：'+lastToast);
console.log('  结果未被覆盖：'+(cimResult && cimResult.space===9?'✓':'✗'));
clearAnc();
console.log();

console.log('=== 7. 渲染（已知值已下沉进状态面板）===');
setAnc(B,'70');
const h=ancRowHTML(B)+ancSummaryHTML();
console.log('  含输入框：'+(/<input/.test(h)?'✓':'✗'));
console.log('  含「收窄」说明：'+(/收窄/.test(h)?'✓':'✗'));
console.log('  含「完全不相交」判据：'+(/完全不相交/.test(h)?'✓':'✗'));
console.log('  含「全部清除」：'+(/全部清除/.test(h)?'✓':'✗'));
renderStates();
const hsp=document.getElementById('statePanel').innerHTML;
console.log('  状态面板里出现已知值行：'
  +((hsp.match(/class="ancrow/g)||[]).length+' 行 / '+Object.keys(sel.desc).length+' 个描述符'));

console.log('=== 8. 选中状态与已知值冲突 ===');
anchors={};
anchors[A]={lo:6,hi:6};
sel.desc[A].states=['高速'];
console.log('  相交时冲突数:', ancConflicts().length, ancConflicts().length===0?'✓':'✗');
sel.desc[A].states=['低速'];
const cf=ancConflicts();
console.log('  不相交时冲突数:', cf.length, cf.length===1?'✓':'✗');
console.log('  冲突描述:', cf.length?cf[0].nm+'「'+cf[0].st+'」':'—');
console.log('  冲突提示块出现：', /你选中的档与已知值不相容/.test(ancConflictHTML())?'✓':'✗');

console.log('=== 9. 全部状态被排除 → 直接报错，不会静默跑空 ===');
anchors[A]={lo:100,hi:110};
console.log('  可用状态数:', ancAllowed(A).length, ancAllowed(A).length===0?'✓':'✗');
const rd=enumCore([A,B,C],null);
console.log('  返回 dead 索引:', JSON.stringify(rd), rd.dead===0?'✓':'✗');
console.log('  面板提示“所有状态都排除了”:', /所有状态都被排除|一个可用状态都不剩/.test(ancSummaryHTML())?'✓':'✗');
console.log('  该描述符行标为 dead:', /ancrow on dead/.test(ancRowHTML(A))?'✓':'✗');
`;

try {
  new Function(code + test)();
} catch (e) {
  console.log('崩溃检测：' + e.message);
  console.log(e.stack.split('\n').slice(0, 4).join('\n'));
  process.exit(1);
}
