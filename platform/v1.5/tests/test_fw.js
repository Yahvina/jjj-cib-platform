// 验证框架通用化：校验分支、切换、示例框架、导出往返、状态清空
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
const baseN=allDescs().length;
console.log('=== 0. 起始框架 ===');
console.log('  起始描述符数:', baseN, '(应 19)');

console.log();
console.log('=== 1. 非法输入逐一拒绝 ===');
console.log('  非 JSON:', applyFramework('not json').err?('✓（'+applyFramework('not json').err+'）'):'✗');
console.log('  不足 2 个:', applyFramework(JSON.stringify({descriptors:[{n:'a',t:'输入型',s:['x','y']}]})).err?('✓'):'✗');
console.log('  状态少于 2 个:', applyFramework(JSON.stringify({descriptors:[
    {n:'a',t:'输入型',s:['x','y']},{n:'b',t:'参数型',s:['只有一个']}]})).err?('✓'):'✗');
console.log('  类型非法:', applyFramework(JSON.stringify({descriptors:[
    {n:'a',t:'输入型',s:['x','y']},{n:'b',t:'结果型还是别的',s:['x','y']}]})).err?('✓'):'✗');
console.log('  重名:', applyFramework(JSON.stringify({descriptors:[
    {n:'a',t:'输入型',s:['x','y']},{n:'a',t:'参数型',s:['x','y']}]})).err?('✓'):'✗');

console.log();
console.log('=== 2. 合法导入：切框架、清状态 ===');
sel.desc={}; cim={};
const A='一次能源结构';
sel.desc[A]={states:ST(A).slice(),src:''};
cim[A+'>产业结构']={v:2,conf:'高',why:'',rev:true};
cimResult={x:1}; robResult={x:1};
const ok=applyFramework(JSON.stringify({name:'测试框架', descriptors:[
  {group:'g1',cat:'c1',id:'a',n:'描述甲',t:'输入型',v:'V1',s:['高一','低一'],
    r:{'高一':[1,2,'%'],'低一':[0,1,'%']}},
  {group:'g1',cat:'c1',id:'b',n:'描述乙',t:'参数型',v:'V2',s:['强','弱']},
  {group:'g2',cat:'c2',id:'c',n:'描述丙',t:'结果型',v:'V3',s:['高','中','低']}
]}));
console.log('  导入成功:', ok.ok?('✓（'+ok.n+' 个）'):'✗ '+ok.err);
console.log('  描述符数变为:', allDescs().length, '(应 3)');
console.log('  分组数:', TREE.length, '(应 2)');
console.log('  选择已清空:', (Object.keys(sel.desc).length===0)?'✓':'✗');
console.log('  打分已清空:', (Object.keys(cim).length===0)?'✓':'✗');
console.log('  结果已清空:', (cimResult===null&&robResult===null)?'✓':'✗');
console.log('  区间已带入:', (JSON.stringify(RANGE_PRESET['描述甲']['高一'])==='[1,2,"%"]')?'✓':'✗');

console.log();
console.log('=== 3. 导出往返 ===');
const exported=fwJSON('测试框架');
const back=JSON.parse(exported);
console.log('  导出描述符数:', back.descriptors.length, '(应 3)');
console.log('  导出含区间:', back.descriptors[0].r?('✓'):'✗');
const re=applyFramework(exported);
console.log('  再导入成功:', re.ok?('✓'):'✗');

console.log();
console.log('=== 4. 恢复京津冀框架 ===');
resetFramework();
console.log('  恢复后描述符数:', allDescs().length, '(应 19)');
console.log('  恢复后选择清空:', (Object.keys(sel.desc).length===0)?'✓':'✗');

console.log();
console.log('=== 5. 示例框架 ===');
loadDemoFramework();
console.log('  示例描述符数:', allDescs().length, '(应 5)');
const demoHasRange=allDescs().some(d=>RANGE_PRESET[d.n]);
console.log('  示例带区间:', demoHasRange?'✓':'✗');
resetFramework();
console.log('  再次恢复:', allDescs().length, '(应 19)');
`;

eval(code + test);
