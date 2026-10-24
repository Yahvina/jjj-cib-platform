// 验证状态半定量化：区间是否配全、衔接是否干净、增删改后状态列表是否同步
const fs = require('fs');

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
  getElementById: () => mkEl(), querySelector: () => mkEl(), querySelectorAll: () => [],
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
/* ===== 1. 区间是否配全 ===== */
const all=allDescs();
console.log('描述符总数:', all.length);
console.log('状态总数:', all.reduce((a,d)=>a+ST(d.n).length,0));
console.log();
let miss=[], nameBad=[], tie=[];
all.forEach(d=>{
  const defs=defsOf(d.n);
  if(defs.length!==d.s.length) nameBad.push(d.n);
  defs.forEach(x=>{ if(x.lo===null||x.hi===null) miss.push(d.n+' / '+x.n); });
  const bad=rngIssues(d.n);
  if(bad.length) tie.push(d.n+' → '+bad.join('；'));
});
console.log('状态数与原定义不一致:', nameBad.length? nameBad.join('、') : '无');
console.log('未配区间的状态:', miss.length? miss.join('、') : '无（全部已配）');
console.log('区间衔接问题:', tie.length? tie.join(' | ') : '无（各档首尾相接）');
console.log();

/* ===== 2. ST 与 defsOf 一致 ===== */
const inc = all.filter(d=>ST(d.n).join('|')!==d.s.join('|')).map(d=>d.n);
console.log('ST 与原状态名不一致:', inc.length? inc.join('、') : '无');
console.log();

/* ===== 3. 走真函数做增 / 改 / 删，验证同步 ===== */
render=function(){};                 // 屏蔽整页重绘
const VALS={};
global.document.getElementById=(id)=>{ const e=mkEl(); if(id in VALS) e.value=VALS[id]; return e; };

const nm='经济增长速度';
sel.desc={}; sel.desc[nm]={states:ST(nm).slice(), src:''};
console.log('初始  ST:', ST(nm).join(' / '), '| 已选:', sel.desc[nm].states.join(' / '));

// 新增自定义状态
VALS.nsn='超高速'; VALS.nslo='7'; VALS.nshi='9'; VALS.nsu='%';
doAddState(nm);
console.log('新增后 ST:', ST(nm).join(' / '), '| 数量一致:', ST(nm).length===defsOf(nm).length);

// 重命名一个已被选中的状态（同步逻辑最关键的一处）
const old=sel.desc[nm].states[0];
VALS.rst='高速增长';
renState(nm, old);
console.log('改名后 ST:', ST(nm).join(' / '));
console.log('改名后已选:', sel.desc[nm].states.join(' / '),
            '→', sel.desc[nm].states.indexOf('高速增长')>=0 ? '已同步 ✓' : '未同步 ✗');

// 删除一个状态
const before=sel.desc[nm].states.length;
delState(nm,'中速');
console.log('删除后 ST:', ST(nm).join(' / '));
console.log('删除后已选:', sel.desc[nm].states.join(' / '),
            '→', sel.desc[nm].states.indexOf('中速')<0 ? '已同步 ✓' : '未同步 ✗');

// 一直删到只剩一个，再删应当被拒绝
let guard=0;
while(defsOf(nm).length>1 && guard++<20){
  const last=defsOf(nm)[defsOf(nm).length-1];
  delState(nm, last.n);
}
const keep=ST(nm).slice();
delState(nm, ST(nm)[0]);
console.log('删到只剩一个:', keep.join(' / '));
console.log('再删一次后  :', ST(nm).join(' / '), '→',
  ST(nm).join('|')===keep.join('|') ? '已拒绝，状态保留 ✓' : '被误删 ✗');
console.log();

// 区间改了之后能不能被检出：故意制造重叠
defsOf(nm).forEach(y=>{ y.lo=null; y.hi=null; });
defsOf(nm).push({n:'乙', lo:4, hi:9, u:''});
defsOf(nm)[0].lo=0; defsOf(nm)[0].hi=6;
console.log('制造重叠后 rngIssues:', rngIssues(nm).join('；')||'（未检出，异常）');
console.log();

/* ===== 4. 区间是否真的进了报告 ===== */
sel.desc={}; sel.desc['产业结构']={states:['稳步演进'],src:'测试'};
cim={};
const rd=reportData();
const d0=rd.descriptors.find(x=>x.name==='产业结构');
console.log('报告中的状态对象:', JSON.stringify(d0.states.slice(0,2)));
`;

eval(code + '\n' + test);
