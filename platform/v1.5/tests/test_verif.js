// 验证映射补证：POLICY_VERIF 数据完整性、键名合法性、升高条目合法性、侧栏渲染
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
global.alert = () => {}; global.FileReader = function () {}; global.Blob = function () {};
global.URL = { createObjectURL: () => '', revokeObjectURL() {} };
global.setTimeout = (f) => f();

const code = fs.readFileSync(process.argv[2], 'utf8');
const test = `
render=function(){}; toast=function(){};

console.log('=== 1. 数据规模与字段完整性 ===');
const keys=Object.keys(POLICY_VERIF);
console.log('  补证条数:', keys.length, '(应 >= 15)', keys.length>=15?'✓':'✗');
const bad=[];
keys.forEach(k=>{
  const v=POLICY_VERIF[k];
  if(!v.f||!v.no||!v.d||!v.q||!v.u) bad.push(k+' 缺字段');
  if(v.st!=='升高'&&v.st!=='维持') bad.push(k+' st 非法');
  if(!/^https:\\/\\//.test(v.u)) bad.push(k+' u 非官方链接');
});
console.log('  字段齐全且 st/链接合法:', bad.length?('✗ '+bad.join('；')):'✓');

console.log();
console.log('=== 2. 键名合法性：路径与描述符都必须真实存在 ===');
const paths=PALLC(), names=paths.map(p=>p.n);
const descs=allDescs().map(d=>d.n);
const badKeys=keys.filter(k=>{
  const sp=k.split('|');
  return names.indexOf(sp[0])<0 || descs.indexOf(sp[1])<0;
});
console.log('  非法键:', badKeys.length?('✗ '+badKeys.join('；')):'无 ✓');

console.log();
console.log('=== 3. 升高条目：原映射存在且原置信度不是高 ===');
const badUp=[];
keys.forEach(k=>{
  const v=POLICY_VERIF[k];
  if(v.st!=='升高') return;
  const sp=k.split('|');
  const p=paths.find(q=>q.n===sp[0]);
  const m=p&&p.m.find(x=>x[0]===sp[1]);
  if(!m) badUp.push(k+' 原映射不存在');
  else if(m[1]==='高') badUp.push(k+' 原本就是高，不能再升');
});
console.log('  非法升高:', badUp.length?('✗ '+badUp.join('；')):'无 ✓');

console.log();
console.log('=== 4. 升高条目数 ===');
const upN=keys.filter(k=>POLICY_VERIF[k].st==='升高').length;
console.log('  升高:', upN, '条 / 维持:', keys.length-upN, '条');

console.log();
console.log('=== 5. 侧栏渲染补证区块 ===');
const upKey=keys.find(k=>POLICY_VERIF[k].st==='升高');
const upPath=upKey.split('|')[0];
const pi=paths.findIndex(p=>p.n===upPath);
polSel=pi; renderPolicy();
const side=document.getElementById('polSide').innerHTML||'';
console.log('  选中路径:', upPath);
console.log('  含补证徽标:', /补证成立 · 置信度升高/.test(side)?'✓':'✗');
console.log('  含文号:', side.indexOf(POLICY_VERIF[upKey].no.slice(0,8))>=0?'✓':'✗');
console.log('  含原文链接:', /查看政策原文/.test(side)?'✓':'✗');

console.log();
console.log('=== 6. 统计条含补证计数 ===');
const stat=document.getElementById('polStat').innerHTML||'';
console.log('  含联网补证:', /联网补证/.test(stat)?'✓':'✗');
`;

eval(code + test);
