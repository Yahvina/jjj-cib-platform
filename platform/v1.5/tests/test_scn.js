// 验证情景库：命名保存、多套存储、载入、并排对比
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
const store = {};
global.window = { scrollTo() {}, addEventListener() {},
  localStorage: { getItem: (k) => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); } } };
global.localStorage = global.window.localStorage;
global.alert = () => {};
global.FileReader = function () {};
global.Blob = function () {};
global.URL = { createObjectURL: () => '', revokeObjectURL() {} };
global.setTimeout = (f) => f();

const code = fs.readFileSync(process.argv[2], 'utf8');

const test = `
render=function(){}; toast=function(){};
const SCN='jjj-cib-scn-v1';

console.log('=== 1. 空库 ===');
console.log('  初始为空:', JSON.stringify(scnAll())==='[]'?'✓':'✗');

console.log();
console.log('=== 2. 起名保存一套 ===');
sel.desc={}; sel.desc['经济增长速度']={states:['高速'],src:''};
sel.desc['产业结构']={states:['稳步演进'],src:''};
document.getElementById('scnName').value='高增长情景';
saveScn();
let a=scnAll();
console.log('  存了一套:', a.length===1?'✓':'✗');
console.log('  名字正确:', a[0]&&a[0].name==='高增长情景'?'✓':'✗');
console.log('  带时间戳:', a[0]&&typeof a[0].ts==='number'&&a[0].ts>0?'✓':'✗');
console.log('  带快照:', a[0]&&a[0].data&&a[0].data.desc?'✓':'✗');
console.log('  保存后清空输入框:', document.getElementById('scnName').value===''?'✓':'✗');

console.log();
console.log('=== 3. 多套存储、允许不同勾选 ===');
sel.desc={}; sel.desc['经济增长速度']={states:['低速'],src:''};
sel.desc['产业结构']={states:['转型滞后'],src:''};
document.getElementById('scnName').value='低增长情景';
saveScn();
a=scnAll();
console.log('  存了两套:', a.length===2?'✓':'✗');

console.log();
console.log('=== 4. 同名拦截 ===');
document.getElementById('scnName').value='高增长情景';
saveScn();
console.log('  同名不重复存:', scnAll().length===2?'✓':'✗');

console.log();
console.log('=== 5. 空名拦截 ===');
document.getElementById('scnName').value='   ';
saveScn();
console.log('  空名不存:', scnAll().length===2?'✓':'✗');

console.log();
console.log('=== 6. 载入一套，界面回到该套 ===');
sel.desc={};
loadScn(0);
console.log('  快照已写回 sel.desc:', Object.keys(sel.desc).length===2?'✓':'✗');
console.log('  速度回到「高速」:', sel.desc['经济增长速度']&&sel.desc['经济增长速度'].states[0]==='高速'?'✓':'✗');

console.log();
console.log('=== 7. 并排对比：一致项与差异项 ===');
const cmp=scnCompare(scnAll());
console.log('  含「并排对比」:', /并排对比/.test(cmp)?'✓':'✗');
console.log('  含两套名字:', (cmp.indexOf('高增长情景')>=0&&cmp.indexOf('低增长情景')>=0)?'✓':'✗');
console.log('  含描述符行:', cmp.indexOf('经济增长速度')>=0?'✓':'✗');
console.log('  差异项标 diff:', /class="diff"/.test(cmp)?'✓':'✗');

console.log();
console.log('=== 8. 一套时不显示对比，两套时才显示 ===');
const one=scnAll().slice(0,1);
console.log('  单套 scnCompare 仍可渲染:', scnCompare(one).indexOf('cmptab')>=0?'✓':'✗');

console.log();
console.log('=== 9. 不设限：一个档都不勾 ===');
sel.desc={}; 
document.getElementById('scnName').value='全放开';
saveScn();
const last=scnAll()[scnAll().length-1];
console.log('  空勾选存为「不设限」:', scnSelOf(last.data,'经济增长速度')==='不设限'?'✓':'✗');

console.log();
console.log('=== 10. 删除 ===');
const before=scnAll().length;
delScn(0);
console.log('  删掉一套:', scnAll().length===before-1?'✓':'✗');

console.log();
console.log('=== 11. 坏数据不崩 ===');
store['jjj-cib-scn-v1']='not json';
console.log('  坏 JSON 返回空数组:', JSON.stringify(scnAll())==='[]'?'✓':'✗');
store['jjj-cib-scn-v1']='{"a":1}';
console.log('  非数组返回空数组:', JSON.stringify(scnAll())==='[]'?'✓':'✗');
`;

eval(code + test);
