// 对「单文件成品」做端到端冒烟：从 HTML 里抠出内联脚本，模拟点四个选项，
// 检查每种形态给出的预览与导出内容。这是唯一能覆盖成品（而非源码）的测法。
const fs = require('fs');

const html = fs.readFileSync(process.argv[2], 'utf8');
const m = html.match(/<script>\n([\s\S]*?)\n<\/script>/);
if (!m) {
  // 本测只对「合并后的单文件成品」有意义。批量跑 test_*.js 时会把它和源码级测试
  // 一起喂 v15/src/app.js —— 那种输入下没有内联脚本，明确跳过而不是报失败。
  console.log('跳过：输入不是单文件成品（没有内联 <script>），本测需传 output/*.html');
  console.log('用法：node test_gen_smoke.js "output/京津冀政策情景快速评估平台_原型v1.5.html"');
  process.exit(0);
}
const code = m[1];
console.log('内联脚本字符数:', code.length);

// 造一个能响应 [data-gen] 的 DOM 桩：四个选项节点各自带 dataset.gen
const OPTS = ['config', 'table', 'narrative', 'bayes'].map(g => {
  const el = {
    dataset: { gen: g }, _cls: new Set(), _chk: null, parentElement: { children: [] },
    classList: { add(c) { el._cls.add(c); }, remove(c) { el._cls.delete(c); }, toggle(c, on) { on ? el._cls.add(c) : el._cls.delete(c); }, contains(c) { return el._cls.has(c); } },
    querySelector() { return el._chk; },
  };
  el._chk = { _cls: new Set(), innerHTML: '', classList: { add(c) { el._chk._cls.add(c); }, remove(c) { el._chk._cls.delete(c); }, toggle(c, on) { on ? el._chk._cls.add(c) : el._chk._cls.delete(c); }, contains(c) { return el._chk._cls.has(c); } } };
  return el;
});
const SEL = { '[data-gen]': OPTS };

const EL = {};
function mkEl() {
  return { innerHTML: '', textContent: '', value: '', style: {}, dataset: {}, files: [], checked: false,
    children: [], classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
    querySelector: () => mkEl(), querySelectorAll: () => [],
    appendChild() {}, click() {}, remove() {}, parentElement: { children: [] },
    getBoundingClientRect: () => ({ top: 0, left: 0 }), addEventListener() {}, setAttribute() {} };
}
global.document = {
  getElementById: id => { if (!EL[id]) EL[id] = mkEl(); return EL[id]; },
  querySelector: () => mkEl(),
  querySelectorAll: sel => SEL[sel] || [],
  createElement: () => mkEl(), body: mkEl(), addEventListener() {}
};
global.window = { scrollTo() {}, addEventListener() {}, localStorage: { getItem: () => null, setItem() {} },
  innerHeight: 900, innerWidth: 1400, matchMedia: () => ({ matches: false }) };
global.localStorage = global.window.localStorage;
global.matchMedia = global.window.matchMedia;
global.alert = () => {}; global.FileReader = function () {}; global.Blob = function () {};
global.URL = { createObjectURL: () => '', revokeObjectURL() {} };
global.setTimeout = f => f();

const smoke = `
renderSteps=function(){}; renderCmp=function(){}; layerTable=function(){}; renderTree=function(){}; renderStates=function(){};
expDetail=function(){}; renderEnsBox=function(){}; scaleSum=function(){}; renderPolicy=function(){}; renderCim=function(){};
renderEnsBar=function(){}; modelDetail=function(){}; renderScopeBar=function(){}; checkResult=function(){};
renderLay=function(){}; renderFilt=function(){}; renderTableau=function(){}; renderMap=function(){};
confList=function(){}; timeline=function(){}; renderImpact=function(){}; renderPath=function(){}; renderAP=function(){};
renderProf=function(){}; renderCorr=function(){}; renderEnsPanel=function(){}; renderRobust=function(){}; renderFW=function(){};
renderBayes=function(){}; finalSum=function(){}; p6Apply=function(){}; p6Status=function(){};
renderConfigPolicy=function(){}; renderConfigSetting=function(){}; renderConfigResult=function(){};
document.getElementById('pcmp').classList.toggle=function(){};

let bad=0;
const chk=(c,label,extra)=>{ if(!c) bad++; console.log('  '+label+':', c?'✓':'✗', extra===undefined?'':extra); };

sel.desc={};
sel.desc['产业结构']={states:['稳步演进'],src:''};
sel.desc['一次能源结构']={states:['目标节奏'],src:''};
rngScope='region'; expMode='mid'; curModel='gcam';

console.log('=== A. 模拟点第 4 步四个选项 ===');
OPTS.forEach(function(node){
  pick(node,'gen');
  const g=node.dataset.gen;
  chk(genMode===g, '点 '+g+' 后 genMode='+genMode);
  chk(node._cls.has('sel'), g+' 高亮');
});
chk(OPTS.filter(o=>o._cls.has('sel')).length===1, '同时只有一档高亮',
  OPTS.filter(o=>o._cls.has('sel')).map(o=>o.dataset.gen).join(','));

console.log('=== B. 载入存档后高亮能拉回来（syncGenOpts） ===');
genMode='narrative'; useBayes=false;
syncGenOpts();
chk(OPTS.filter(o=>o._cls.has('sel')).map(o=>o.dataset.gen).join(',')==='narrative',
  '高亮回到 narrative', OPTS.filter(o=>o._cls.has('sel')).map(o=>o.dataset.gen).join(','));

console.log('=== C. 四种形态端到端出内容 ===');
genMode='table'; useBayes=false;
let t=tableCSV();
chk(t.indexOf('param,value')>=0 && t.indexOf('68.5')>=0, '参数表有表头与数值');

genMode='narrative'; useBayes=false;
let n=narrText();
chk(n.indexOf('产业结构')>=0 && n.indexOf('不含模型可读的数值参数')>=0, '叙事有项且声明无数值参数');

genMode='bayes'; useBayes=true;
sel.desc['产业结构']={states:['稳步演进'],src:''};
cim['产业结构>一次能源结构']={v:1,conf:'高',rev:true,note:''};
BAYES=null;
let bs=bayesCSV();
chk(bs.indexOf('pair,')>=0, '后验 CSV 有表头');

genMode='config'; useBayes=false;
GEN_LABEL && chk(genMainLabel().indexOf('XML')>=0, '配置档主按钮提 XML', genMainLabel());

console.log('=== D. renderGenOut 把内容写进三个 DOM 位 ===');
genMode='narrative'; useBayes=false; renderGenOut();
chk(document.getElementById('fmtTag').textContent==='TXT', 'fmtTag=TXT', document.getElementById('fmtTag').textContent);
chk(document.getElementById('outPreview').textContent.indexOf('情景特征')>=0, '预览是叙事稿');
chk(document.getElementById('outBtns').innerHTML.indexOf('genMain()')>=0, '按钮已重绘');

genMode='table'; useBayes=false; renderGenOut();
chk(document.getElementById('fmtTag').textContent==='CSV（参数）', 'fmtTag=CSV（参数）', document.getElementById('fmtTag').textContent);

genMode='config'; useBayes=false; renderGenOut();
chk(document.getElementById('outPreview').textContent.indexOf('ScenarioComponents')>=0, '配置档预览是 XML');

console.log('=== E. 报告数据带上形态名 ===');
genMode='bayes'; useBayes=true;
const rd=reportData();
chk(rd.gen==='bayes' && rd.genLabel==='贝叶斯概率分布', 'reportData 带 gen/genLabel', rd.gen+'/'+rd.genLabel);

console.log('=== F. 快照往返 ===');
genMode='table'; useBayes=false;
const snap=snapshot();
chk(snap.gen==='table', '快照存下 gen=table', snap.gen);

console.log('');
if(bad===0) console.log('== 单文件成品冒烟全部通过 ==');
else console.log('== 失败 '+bad+' 项 ==');
if(bad>0) process.exit(1);
`;

eval(code + smoke);
