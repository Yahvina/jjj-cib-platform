// 验证逐层求解：上级约束下级、无解计数、路径完整
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
const A='一次能源结构', B='产业结构';
sel.desc={}; sel.desc[A]={states:ST(A).slice(),src:''}; sel.desc[B]={states:ST(B).slice(),src:''};
cim={}; cimKeys().forEach(k=>cim[k]={v:0,conf:'低',why:'',rev:false});

console.log('=== 1. 上级取值 -> 下级可用状态（一次能源结构）===');
console.log('  区域级区间:', rangeOf(A,'region').map(x=>x.n+'['+x.lo+','+x.hi+']').join(' '));
console.log('  北京区间  :', rangeOf(A,'bj').map(x=>x.n+'['+x.lo+','+x.hi+']').join(' '));
[[0,'快速清洁化'], [1,'目标节奏'], [2,'推进迟缓']].forEach(([i,nm])=>{
  const par={scope:'region', cb:[i]};
  const al=allowUnder([A],'bj',par)[0];
  console.log('  上级取「'+nm+'」→ 北京可用:', al.map(j=>ST(A)[j]).join(' / ')||'（无解）');
});
console.log();

console.log('=== 2. 上级「加速服务化」时，河北三产无解 ===');
console.log('  区域级产业结构:', rangeOf(B,'region').map(x=>x.n+'['+x.lo+','+x.hi+']').join(' '));
console.log('  河北产业结构  :', rangeOf(B,'he').map(x=>x.n+'['+x.lo+','+x.hi+']').join(' '));
[0,1,2].forEach(i=>{
  const al=allowUnder([B],'he',{scope:'region',cb:[i]})[0];
  console.log('  上级取「'+ST(B)[i]+'」→ 河北可用:', al.map(j=>ST(B)[j]).join(' / ')||'（无解）');
});
console.log();

console.log('=== 3. 单层求解（无上级）应等于普通检算 ===');
const r1=solveLayer([A,B],'region',null);
const tmpSave=cimResult;
runCIM();
const plain=cimResult.consistent.length;
console.log('  逐层求解区域级:', r1.sols.length, '组 | 普通 CIB 检算:', plain, '组', (r1.sols.length===plain?'✓ 一致':'✗ 不一致'));
cimResult=tmpSave;
console.log();

console.log('=== 4. 跑完整三层 ===');
xlayers=function(){ return ['region','prov','city']; };
runLayered();
const R=layeredResult;
console.log('  层级顺序:', R.order.map(s=>XL_NAME[s]).join(' → '));
R.layers.forEach(x=>{
  console.log('  '+XL_NAME[x.scope].padEnd(5,'　')+' 自洽 '+x.n+' 组 | 检查 '+x.checked+
    ' | 上级数 '+x.groups+(x.dead?(' | 无解上级 '+x.dead):''));
});
console.log('  最终组合:', R.combos, '条');
console.log('  路径完整性:', R.final.length?(
  R.final.every(f=>f.path.length===R.order.length)?'✓ 每条都是 '+R.order.length+' 层':'✗ 路径长度不齐'
):'（无组合）');
console.log();

console.log('=== 5. 无省级口径时退化为单层 ===');
const r2=solveLayer([A,B],'prov',[{path:[{scope:'region',cb:[1,0]}],scope:'region',cb:[1,0]}]);
console.log('  上级固定为 [目标节奏, 加速服务化] → 省级自洽:', r2.sols.length, '组');
const r3=solveLayer([A,B],'region',null);
console.log('  省级结果路径是否带上父层:', r2.sols[0].path.length===2?'✓ 两段路径':'✗');
`;

try { new Function(code + test)(); } catch (e) {
  console.log('崩溃检测：' + e.message);
  console.log(e.stack.split('\n').slice(0, 5).join('\n'));
}
