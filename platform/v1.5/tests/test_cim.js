// 用 DOM stub 加载平台代码，单独验证 CIB 一致性检验算法
const fs = require('fs');

function mkEl() {
  return {
    innerHTML: '', textContent: '', disabled: false, value: 'all',
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
/* ===== 测试 ===== */
const T=['经济增长速度','人口空间分布与收缩态势','产业结构'];
sel.desc={};
T.forEach(n=>{ sel.desc[n]={states:ST(n),src:''}; });
const kds=Object.keys(sel.desc);
cim={};
kds.forEach(s=>kds.forEach(t=>{ if(s!==t) cim[s+'>'+t]={v:0,conf:'低',why:'',rev:false}; }));
function setv(a,b,v){ cim[a+'>'+b]={v:v,conf:'高',why:'测试',rev:true}; }
setv('经济增长速度','产业结构',3);
setv('产业结构','经济增长速度',3);
setv('人口空间分布与收缩态势','经济增长速度',-3);
setv('经济增长速度','人口空间分布与收缩态势',-3);

console.log('描述符:', kds.join(' / '));
console.log('状态数:', kds.map(d=>ST(d).length).join(' / '));
runCIM();
console.log('组合空间:', cimResult.total);
console.log('实际检查:', cimResult.checked, cimResult.sampled?'(抽样)':'(全枚举)');
console.log('自洽情景:', cimResult.consistent.length, '组');
cimResult.consistent.slice(0,12).forEach((cb,i)=>{
  console.log('  ', kds.map((d,j)=>ST(d)[cb[j]]).join(' + '));
});
console.log('不自洽组合:', cimResult.inconsistent);
`;

eval(code + '\n' + test);
