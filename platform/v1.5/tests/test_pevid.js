// 验证政策证据：数据覆盖、字段、侧栏依据区块、统计与列表标记
const fs = require('fs');

const EL = {};
function mkEl() {
  const e = {
    innerHTML: '', textContent: '', value: '', style: {}, dataset: {}, files: [], checked: false,
    _cls: {},
    classList: {
      add(c) { e._cls[c] = true; }, remove(c) { delete e._cls[c]; },
      toggle(c, v) { if (v) e._cls[c] = true; else delete e._cls[c]; },
      contains(c) { return !!e._cls[c]; }
    },
    querySelector: () => mkEl(), querySelectorAll: () => [],
    appendChild() {}, click() {}, remove() {}, parentElement: { children: [] },
    getBoundingClientRect: () => ({ top: 0, left: 0 }), addEventListener() {}
  };
  return e;
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

console.log('=== 1. 数据覆盖 ===');
const keys=Object.keys(POLICY_EVID);
const polNames=POLICY.map(p=>p.n);
const hit=keys.filter(k=>polNames.indexOf(k)>=0);
console.log('  证据条目:', keys.length, '(应 58)');
console.log('  能对上政策库:', hit.length, '(应 57)');
console.log('  有法律文件:', keys.filter(k=>POLICY_EVID[k].f.length).length);
console.log('  有定量口径:', keys.filter(k=>POLICY_EVID[k].q.length).length);
console.log('  有数据侧实证描述符:', keys.filter(k=>POLICY_EVID[k].d.length).length);
console.log('  判定:', (keys.length===58 && hit.length===57)?'✓':'✗');

console.log();
console.log('=== 2. 字段形状 ===');
const bad=keys.filter(k=>{
  const e=POLICY_EVID[k];
  return !(e.n>0 && Array.isArray(e.f) && Array.isArray(e.q) && Array.isArray(e.d));
});
console.log('  形状异常的条目:', bad.length, '(应 0)');
console.log('  最长口径字符数:', Math.max.apply(null, keys.map(k=>(POLICY_EVID[k].q[0]||'').length)));
console.log('  判定:', bad.length===0?'✓':'✗');

console.log();
console.log('=== 3. 查询函数 ===');
const k1='排放交易体系（ETS）';
console.log('  已知路径返回对象:', polEvid({n:k1})?'✓':'✗');
console.log('  未知路径返回 null:', polEvid({n:'不存在的路径'})===null?'✓':'✗');

console.log();
console.log('=== 4. 侧栏依据区块（有证据） ===');
const p1=POLICY.find(p=>p.n===k1);
const blk=polEvidBlock(p1);
console.log('  含工具级记录:', /工具级记录/.test(blk)?'✓':'✗');
console.log('  含书名号文件:', /《/.test(blk)?'✓':'✗');
console.log('  含口径引文:', /“/.test(blk)?'✓':'✗');
console.log('  含边界说明:', /不能单独证明映射关系/.test(blk)?'✓':'✗');

console.log();
console.log('=== 5. 有实证的路径应显示比对 ===');
const kd=keys.find(k=>POLICY_EVID[k].d.length && polNames.indexOf(k)>=0);
const pd=POLICY.find(p=>p.n===kd);
const blk2=polEvidBlock(pd);
console.log('  路径:', kd);
console.log('  含「数据侧已实证」:', /数据侧已实证/.test(blk2)?'✓':'✗');
console.log('  含「一致」比对:', /一致 <b>/.test(blk2)?'✓':'✗');

console.log();
console.log('=== 6. 无证据路径应明确说明 ===');
const pn=POLICY.find(p=>!POLICY_EVID[p.n]);
console.log('  路径:', pn?pn.n:'（无）');
const blk3=pn?polEvidBlock(pn):'';
console.log('  含「尚无工具级记录」:', /尚无工具级记录/.test(blk3)?'✓':'✗');

console.log();
console.log('=== 7. 统计条与列表标记 ===');
sel.desc={}; sel.desc['一次能源结构']={states:ST('一次能源结构').slice(),src:''};
polSel=null;
renderPolicy();
const stat=document.getElementById('polStat').innerHTML||'';
console.log('  统计含「有工具级记录」:', /有工具级记录/.test(stat)?'✓':'✗');
console.log('  统计含「含定量口径」:', /含定量口径/.test(stat)?'✓':'✗');
const list=document.getElementById('polList').innerHTML||'';
const marks=(list.match(/class="pe"/g)||[]).length;
console.log('  列表中的「证」标记:', marks, '(应 57 上下)');
console.log('  判定:', (marks>=50 && marks<=58)?'✓':'✗');

console.log();
console.log('=== 8. 部门筛选 ===');
const depts=polDeptList();
console.log('  部门取值:', depts.join(' / '));
console.log('  部门数:', depts.length, '(应 7)');
console.log('  判定:', depts.length===7?'✓':'✗');
console.log('  含「能源」、不含「电力」:', (depts.indexOf('能源')>=0 && depts.indexOf('电力')<0)?'✓':'✗');
const cross=polDeptHit({s:'工业；建筑'},['建筑']);
console.log('  多部门政策命中其一部:', cross?'✓':'✗');
const none=polDeptHit({s:'交通'},['建筑']);
console.log('  不同部门不误命中:', none?'✗':'✓');
polDepts=['建筑']; renderPolicy();
const bList=document.getElementById('polList').innerHTML||'';
const bCount=(bList.match(/class="pitem/g)||[]).length;
const bShould=PALLC().filter(p=>polDeptHit(p,['建筑'])).length;
console.log('  只看建筑:', bCount, '条（应', bShould, '）');
console.log('  判定:', bCount===bShould?'✓':'✗');
polDepts=[]; renderPolicy();

console.log();
console.log('=== 9. 政策实施字段壳 ===');
const shell=polTimeBlock(POLICY[0]);
console.log('  含「政策实施」:', /政策实施/.test(shell)?'✓':'✗');
console.log('  含「起始年」与「执行率」:', (/起始年/.test(shell)&&/执行率/.test(shell))?'✓':'✗');
console.log('  无值时不编数:', /待补/.test(shell)?'✓':'✗');
const withYear=polTimeBlock({n:'x',year:2030,rate:0.5});
console.log('  有值时正常显示:', (/2030/.test(withYear)&&/0\.5/.test(withYear))?'✓':'✗');
`;

eval(code + test);
