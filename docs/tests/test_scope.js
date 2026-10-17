// 验证区间分层：区域级与省级口径互不污染、写入回落到正确层级
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
const rg=nm=>defsOf(nm).map(x=>x.lo+'-'+x.hi).join(' / ');

console.log('=== 1. 同一个描述符，四个视角的区间 ===');
const A='产业结构';
['region','bj','tj','he'].forEach(sc=>{ setScope(sc); console.log('  '+SCOPE_NAME[sc].padEnd(9,'　')+' '+rg(A)); });
console.log();

console.log('=== 2. 一次能源结构 ===');
const B='一次能源结构';
['region','bj','tj','he'].forEach(sc=>{ setScope(sc); console.log('  '+SCOPE_NAME[sc].padEnd(9,'　')+' '+rg(B)); });
console.log();

console.log('=== 3. 没有省级口径的描述符应沿用区域级 ===');
setScope('region'); const base=rg('工业节能改造强度');
setScope('bj');    const bjv=rg('工业节能改造强度');
const alt=defsOf('工业节能改造强度').every(x=>!x.scoped);
console.log('  区域级:', base);
console.log('  北京  :', bjv, (base===bjv&&alt?'✓ 完全沿用':'✗'));
console.log();

console.log('=== 4. 状态名在各视角下必须一致 ===');
setScope('region'); const s1=ST(A).join('|');
setScope('bj');     const s2=ST(A).join('|');
setScope('he');     const s3=ST(A).join('|');
console.log('  '+(s1===s2&&s2===s3?'✓ 一致：'+s1:'✗ 不一致'));
console.log();

console.log('=== 5. 改省级区间不应污染区域级 ===');
setScope('region'); const r0=defsOf(A)[0];
const rLo=r0.lo, rHi=r0.hi;
setScope('bj');
document.getElementById('rlo').value='88';
document.getElementById('rhi').value='96';
document.getElementById('ru').value='%';
saveRange(A, defsOf(A)[0].n);
console.log('  北京改后:', defsOf(A)[0].lo+'-'+defsOf(A)[0].hi);
setScope('region');
console.log('  切回区域级:', defsOf(A)[0].lo+'-'+defsOf(A)[0].hi,
  (defsOf(A)[0].lo===rLo&&defsOf(A)[0].hi===rHi?'✓ 未被污染':'✗ 被污染'));
setScope('tj');
console.log('  天津视角:', defsOf(A)[0].lo+'-'+defsOf(A)[0].hi, '(应仍是预设值 68-76)');
console.log();

console.log('=== 6. 恢复区域级 ===');
setScope('bj');
console.log('  恢复前:', defsOf(A)[0].lo+'-'+defsOf(A)[0].hi);
dropScopeOverride(A);
console.log('  恢复后:', defsOf(A)[0].lo+'-'+defsOf(A)[0].hi,
  (defsOf(A)[0].lo===rLo?'✓ 回到区域级':'✗'));
console.log();

console.log('=== 7. 增删状态应作用于所有视角 ===');
setScope('region');
const before=ST(A).length;
setScope('bj');
document.getElementById('nsn').value='测试档';
document.getElementById('nslo').value='95';
document.getElementById('nshi').value='99';
document.getElementById('nsu').value='%';
doAddState(A);
setScope('region');
console.log('  区域级状态数:', ST(A).length, '(原 '+before+')', (ST(A).length===before+1?'✓':'✗'));
setScope('tj');
console.log('  天津状态数:', ST(A).length, (ST(A).indexOf('测试档')>=0?'✓ 同步出现':'✗'));
setScope('region');
delState(A,'测试档');
console.log('  删除后区域级:', ST(A).length, (ST(A).length===before?'✓':'✗'));
setScope('he');
console.log('  天津/河北也删掉了:', (ST(A).indexOf('测试档')<0?'✓':'✗'));
setScope('region');
`;

try { new Function(code + test)(); } catch (e) {
  console.log('崩溃检测：' + e.message);
  console.log(e.stack.split('\n').slice(0, 5).join('\n'));
}
