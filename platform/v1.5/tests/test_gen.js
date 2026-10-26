// 验证参数生成方式四选一：config / table / narrative / bayes
// 以及导出形态、旧存档兼容、HTML 选项数量
const fs = require('fs');
const path = require('path');

const EL = {};
function mkEl() {
  return {
    innerHTML: '', textContent: '', value: '', style: {}, dataset: {}, files: [], checked: false,
    classList: { add() {}, remove() {}, toggle() {} },
    querySelector: () => mkEl(), querySelectorAll: () => [],
    appendChild() {}, click() {}, remove() {}, parentElement: { children: [] },
    getBoundingClientRect: () => ({ top: 0, left: 0 }), addEventListener() {}, setAttribute() {}
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

const src = process.argv[2] || 'v15/src/app.js';
const code = fs.readFileSync(src, 'utf8');
const html = fs.readFileSync(path.join(path.dirname(src), '..', 'index.html'), 'utf8');

const test = `
render=function(){}; toast=function(){};
const A='产业结构', B='一次能源结构';
sel.desc={};
sel.desc[A]={states:['稳步演进'],src:''};   // 预设 [65,72] %
sel.desc[B]={states:['目标节奏'],src:''};   // 预设 [20,30] %
rngScope='region'; expMode='mid'; curModel='cheer'; useBayes=false;

console.log('=== 1. 默认形态为「模型配置文件」 ===');
console.log('  genMode:', genMode, genMode==='config'?'✓':'✗');
console.log('  genOf():', genOf(), genOf()==='config'?'✓':'✗');
console.log('  名称:', genName(), genName()==='模型配置文件'?'✓':'✗');

console.log('=== 2. 四种形态各自可选中 ===');
[['config','模型配置文件'],['table','结构化参数表'],['narrative','定性叙事'],['bayes','贝叶斯概率分布']].forEach(function(p){
  genMode=p[0]; useBayes=(p[0]==='bayes');
  const okName = genName()===p[1], okOf = genOf()===p[0];
  console.log('  '+p[0]+' => '+genName(), (okName&&okOf)?'✓':'✗');
});

console.log('=== 3. 结构化参数表：参数名与数值 + 情景标识 ===');
genMode='table'; useBayes=false;
const tc=tableCSV();
console.log('  含表头 scenario,param,value:', tc.indexOf('scenario,param,value')>=0?'✓':'✗');
console.log('  含数值 68.5 / 25:', (tc.indexOf('68.5')>=0&&tc.indexOf('25')>=0)?'✓':'✗');
console.log('  不含依据列:', tc.indexOf('unit')<0?'✓':'✗');
console.log('  取档方式写进注释:', tc.indexOf('取档方式')>=0?'✓':'✗');
console.log('  写明同组才自洽:', tc.indexOf('同一 scenario 内')>=0?'✓':'✗');
console.log('  每行都带情景标识:', tc.split('\\n').filter(l=>l&&l[0]!=='#').slice(1).every(l=>/^CUR/.test(l))?'✓':'✗');
console.log('  行数 2:', tc.split('\\n').filter(l=>l&&l[0]!=='#').length===3?'✓ (表头+2行)':'✗');

console.log('=== 4. 定性叙事：给档位与范围，不给模型参数 ===');
genMode='narrative';
const nt=narrText();
console.log('  含描述符名:', (nt.indexOf(A)>=0&&nt.indexOf(B)>=0)?'✓':'✗');
console.log('  含档位名:', (nt.indexOf('稳步演进')>=0&&nt.indexOf('目标节奏')>=0)?'✓':'✗');
console.log('  声明不含数值参数:', nt.indexOf('不含模型可读的数值参数')>=0?'✓':'✗');
console.log('  指向两种数值形态:', (nt.indexOf('模型配置文件')>=0&&nt.indexOf('结构化参数表')>=0)?'✓':'✗');

console.log('=== 5. 贝叶斯后验 CSV：10 列 ===');
genMode='bayes'; useBayes=true;
BAYES={n:2,matrix:{},ts:'',cells:{'a>b':{n:1,mean:0.5,sd:0.3,lo:0.1,hi:0.9,pPos:0.9,pNeg:0.05,pFlat:0.05}}};
const bc=bayesCSV();
const bHead=bc.split('\\n').filter(l=>l.indexOf('pair,')===0)[0]||'';
const bRow =bc.split('\\n').filter(l=>l.indexOf('a>b')===0)[0]||'';
console.log('  表头 10 列:', bHead.split(',').length===10?'✓ ('+bHead.split(',').length+')':'✗ ('+bHead.split(',').length+')');
console.log('  数据 10 列:', bRow.split(',').length===10?'✓ ('+bRow.split(',').length+')':'✗ ('+bRow.split(',').length+')');
console.log('  后验均值 0.500:', bRow.indexOf('0.500')>=0?'✓':'✗');
console.log('  写清先验与噪声:', bc.indexOf('先验')>=0&&bc.indexOf('网格积分')>=0?'✓':'✗');
console.log('  宽度列 =0.800:', bRow.indexOf('0.800')>=0?'✓':'✗');

console.log('=== 6. 主按钮文案随形态变 ===');
genMode='config'; useBayes=false; curModel='gcam';
console.log('  config+gcam:', genMainLabel(), genMainLabel().indexOf('XML')>=0?'✓':'✗');
curModel='cheer';
console.log('  config+cheer:', genMainLabel(), genMainLabel().indexOf('CSV')>=0?'✓':'✗');
genMode='table';     console.log('  table:', genMainLabel(), genMainLabel().indexOf('结构化参数表')>=0?'✓':'✗');
genMode='narrative'; console.log('  narrative:', genMainLabel(), genMainLabel().indexOf('情景叙事')>=0?'✓':'✗');
genMode='bayes';     console.log('  bayes:', genMainLabel(), genMainLabel().indexOf('贝叶斯后验')>=0?'✓':'✗');

console.log('=== 7. 副按钮按形态取舍，不重复给同一个东西 ===');
genMode='config'; useBayes=false;
const s1=genSubHTML();
console.log('  config 有参数表:', s1.indexOf('downloadParamsBtn')>=0?'✓':'✗');
console.log('  config 有结构化表:', s1.indexOf('downloadTableBtn')>=0?'✓':'✗');
console.log('  config 有取档方式:', s1.indexOf('setExpMode')>=0?'✓':'✗');
genMode='table';
const s2=genSubHTML();
console.log('  table 不重复给结构化表:', s2.indexOf('downloadTableBtn')<0?'✓':'✗');
console.log('  table 有全部自洽情景:', s2.indexOf('downloadAll')>=0?'✓':'✗');
genMode='bayes'; useBayes=true;
const s3=genSubHTML();
console.log('  bayes 不重复给参数表:', s3.indexOf('downloadParamsBtn')<0?'✓':'✗');

console.log('=== 8. 旧存档兼容：只有 bayes 布尔也能落到四档之一 ===');
const legacy1={desc:{},model:'gcam',exp:1,bayes:true};
genMode=legacy1.gen||(legacy1.bayes?'bayes':'config'); useBayes=!!legacy1.bayes;
console.log('  旧档 bayes=true =>', genOf(), genOf()==='bayes'?'✓':'✗');
const legacy2={desc:{},model:'gcam',exp:1,bayes:false};
genMode=legacy2.gen||(legacy2.bayes?'bayes':'config'); useBayes=!!legacy2.bayes;
console.log('  旧档 bayes=false =>', genOf(), genOf()==='config'?'✓':'✗');

console.log('=== 9. useBayes 直接置真时仍是贝叶斯（旧测试/旧代码路径） ===');
genMode='config'; useBayes=true;
console.log('  genOf():', genOf(), genOf()==='bayes'?'✓':'✗');
useBayes=false;

console.log('=== 10. syncGenOpts 存在且被 renderGenOut 调用 ===');
console.log('  function syncGenOpts:', (typeof syncGenOpts==='function')?'✓':'✗');
console.log('  renderGenOut 调用它:', (renderGenOut.toString().indexOf('syncGenOpts')>=0)?'✓':'✗');

console.log('=== 11. 快照与载入都带 gen 字段 ===');
console.log('  snapshot 含 gen:', (snapshot.toString().indexOf('gen:genMode')>=0)?'✓':'✗');
console.log('  loadCfg 恢复 gen:', ((loadCfg.toString()+applyCfg.toString()).indexOf('d.gen')>=0)?'✓':'✗');
console.log('  applyCfg 为共用入口:', (loadCfg.toString().indexOf('applyCfg(')>=0)?'✓':'✗');

console.log('=== 12. HTML 第 4 步恰有四个选项 ===');
console.log('  data-gen 计数 4:', (HTMLDATA.match(/data-gen=/g)||[]).length===4?'✓':'✗ ('+((HTMLDATA.match(/data-gen=/g)||[]).length)+')');
['config','table','narrative','bayes'].forEach(function(v){
  console.log('  含 '+v+':', HTMLDATA.indexOf('data-gen="'+v+'"')>=0?'✓':'✗');
});
console.log('  不再用旧分组 bayes:', HTMLDATA.indexOf("pick(this,'bayes')")<0?'✓':'✗');
`;

const HTMLDATA = html;
eval(code + test);
