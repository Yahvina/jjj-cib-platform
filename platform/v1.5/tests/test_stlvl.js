// 验证状态级精判：默认展开、精判覆盖、清除恢复、是否真影响检算
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

const A='经济增长速度', B='产业结构', C='人口空间分布与收缩态势';
const DS=[A,B,C];
sel.desc={}; DS.forEach(n=>sel.desc[n]={states:ST(n).slice(), src:''});
cim={};
cimKeys().forEach(k=>cim[k]={v:0,conf:'低',why:'',rev:false});

console.log('=== 1. 描述符级为 0 时，展开值全为 0 ===');
console.log('  A档0→B档0:', impactVal(A,0,B,0), '| A档2→B档2:', impactVal(A,2,B,2));
console.log();

console.log('=== 2. 改整体倾向为 +2 后的默认展开（3×3）===');
cim[A+'>'+B].v=2;
for(let i=0;i<3;i++){
  const row=[];
  for(let j=0;j<3;j++) row.push(impactVal(A,i,B,j).toFixed(0).padStart(3));
  console.log('  A档'+i+'：'+row.join(''));
}
console.log('  （第0档＝高档；对角应为 +2，反对角应为 -2）');
console.log();

console.log('=== 3. 状态级精判覆盖 ===');
cim[A+'>'+B].st={'0_0':3,'0_2':-3};
console.log('  A档0→B档0:', impactVal(A,0,B,0), '(精判，应 3)');
console.log('  A档0→B档2:', impactVal(A,0,B,2), '(精判，应 -3)');
console.log('  A档0→B档1:', impactVal(A,0,B,1).toFixed(0), '(未精判，应仍为默认 0)');
console.log('  A档2→B档2:', impactVal(A,2,B,2).toFixed(0), '(未精判，应仍为默认 2)');
console.log();

console.log('=== 4. 精判是否真的改变检算结果 ===');
delete cim[A+'>'+B].st;
cim[A+'>'+B].v=0;
runCIM();
const base=cimResult.consistent.length;
console.log('  无精判（全部 0）：自洽', base, '组 / 共', cimResult.total, '组');
cim[A+'>'+B].st={'0_1':-3,'0_2':-3};
runCIM();
const after=cimResult.consistent.length;
console.log('  加精判（A取档0 时压制 B 的档1/档2）：自洽', after, '组');
console.log('  结果是否改变:', base!==after?('是 ✓（'+base+' → '+after+'）'):'否（需检查）');
console.log();

console.log('=== 5. 清除精判后恢复 ===');
cimSelKey=A+'>'+B;
clearSt();
console.log('  st 是否已删除:', !cim[A+'>'+B].st ? '是 ✓' : '否 ✗');
console.log('  A档0→B档0 恢复默认:', impactVal(A,0,B,0), '(应 0)');
console.log();

console.log('=== 6. 侧栏渲染 ===');
cim[A+'>'+B].v=2;
cim[A+'>'+B].st={'1_1':3};
cimSelKey=A+'>'+B;
renderCim();
const side=EL['cimSide'].innerHTML;
console.log('  含「状态级精判」:', /状态级精判/.test(side)?'✓':'✗');
console.log('  含「已改 1 格」:', /已改 1 格/.test(side)?'✓':'✗');
console.log('  下拉框数量:', (side.match(/<select/g)||[]).length, '(应 9)');
console.log('  含恢复按钮:', /全部恢复默认展开/.test(side)?'✓':'✗');
console.log('  矩阵格含精判标记:', /stdot/.test(EL['cimGrid'].innerHTML)?'✓':'✗');
console.log();

console.log('=== 7. 精判后报告数据 ===');
const rd=reportData();
console.log('  stK:', rd.cim.stK, '| stC:', rd.cim.stC, '(应 1 / 1)');
console.log('  edges 带 stN:', rd.cim.edges.filter(e=>e.stN>0).length, '条');
console.log('崩溃检测: 已完整执行到结尾 ✓');
`;

eval(code + '\n' + test);
