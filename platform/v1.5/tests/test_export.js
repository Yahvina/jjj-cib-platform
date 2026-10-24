// 验证导出：数值来自状态区间、取档方式生效、不再出现"待定"、缺区间时明确标注
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
sel.desc[A]={states:['稳步演进'],src:''};   // 预设 [65,72] %
sel.desc[B]={states:['目标节奏'],src:''};   // 预设 [20,30] %
rngScope='region'; expMode='mid'; curModel='cheer';

console.log('=== 1. 取区间中点 ===');
let rows=expRows();
console.log('  条数', rows.length, rows.length===2?'✓':'✗');
console.log('  '+A+' =>', rows[0].value, '(', rows[0].lo, '~', rows[0].hi, rows[0].unit+')');
console.log('  中点正确:', rows[0].value===68.5&&rows[1].value===25?'✓':'✗');
console.log('  年份 2035:', rows.every(r=>r.year===2035)?'✓':'✗');

console.log('=== 2. 取档方式切换 ===');
expMode='low';  rows=expRows();
console.log('  下界:', rows[0].value, rows[1].value, (rows[0].value===65&&rows[1].value===20)?'✓':'✗');
expMode='high'; rows=expRows();
console.log('  上界:', rows[0].value, rows[1].value, (rows[0].value===72&&rows[1].value===30)?'✓':'✗');
expMode='mid';

console.log('=== 3. 值始终落在区间内 ===');
console.log('  ', rows.every(r=>r.value>=r.lo&&r.value<=r.hi)?'✓':'✗');

console.log('=== 4. 参数表 CSV ===');
const csv=paramsCSV();
console.log('  含表头:', csv.indexOf('descriptor,param,scope,year,value,low,high,unit')>=0?'✓':'✗');
console.log('  含描述符:', csv.indexOf(A)>=0&&csv.indexOf(B)>=0?'✓':'✗');
console.log('  含数值 68.5:', csv.indexOf('68.5')>=0?'✓':'✗');
console.log('  不含"待定":', csv.indexOf('待定')<0?'✓':'✗');

console.log('=== 5. CHEER CSV 预览 ===');
curModel='cheer';
const ch=preview();
console.log('  含实测值:', ch.indexOf('68.5')>=0?'✓':'✗');
console.log('  不含"待定":', ch.indexOf('待定')<0?'✓':'✗');
const plain=ch.replace(/<[^>]+>/g,'');
const body=plain.split('\\n').filter(l=>l.indexOf('param,scenario,')===0)[0]||'';
console.log('  列数 10:', body.split(',').length===10?'✓':'✗ ('+body.split(',').length+' 列)');

console.log('=== 6. GCAM 预览：已知装配文件 + 未确认项明确标出 ===');
sel.desc['钢铁工艺路线']={states:[ST('钢铁工艺路线')[0]],src:''};
curModel='gcam';
const g=preview();
console.log('  含 ScenarioComponents:', g.indexOf('ScenarioComponents')>=0?'✓':'✗');
console.log('  含参数值注释:', g.indexOf('= 68.5')>=0?'✓':'✗');
console.log('  已知项带文件路径:', g.indexOf('../input/')>=0?'✓':'✗');
console.log('  未确认项明确列出:', g.indexOf('需人工补齐')>=0?'✓':'✗');
console.log('  不再乱指 carbon_tax:', g.indexOf('carbon_tax')<0?'✓':'✗');

console.log('=== 7. 缺区间时明确标注，不编数 ===');
stateDefs[A]=[{n:'稳步演进',lo:null,hi:null,u:'',ev:'user'}];
const r2=expRows();
console.log('  值为空:', r2[0].value===null?'✓':'✗');
console.log('  标注"需人工给值":', r2[0].note.indexOf('需人工给值')>=0?'✓':'✗');
console.log('  CSV 不写假数:', paramsCSV().indexOf(',,')>=0?'✓ (空值单元格)':'—');
`;

eval(code + test);
