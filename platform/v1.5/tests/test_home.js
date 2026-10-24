/* 首页测试：事实行的数字必须来自真实数据，不允许写死估算值。 */
const fs = require('fs');
const EL = {};
function mkEl(){return {innerHTML:'',textContent:'',value:'',style:{},dataset:{},files:[],checked:false,
  children:[],classList:{add(){},remove(){},toggle(){},contains(){return false;}},
  querySelector:()=>mkEl(),querySelectorAll:()=>[],
  appendChild(){},click(){},remove(){},parentElement:{children:[]},
  getBoundingClientRect:()=>({top:0,left:0,width:0,height:0}),addEventListener(){},setAttribute(){}};}
global.document = {getElementById:id=>{if(!EL[id])EL[id]=mkEl();return EL[id];},
  querySelector:()=>mkEl(),querySelectorAll:()=>[],createElement:()=>mkEl(),body:mkEl(),addEventListener(){}};
global.window = {scrollTo(){},addEventListener(){},localStorage:{getItem:()=>null,setItem(){}},
  innerHeight:900,innerWidth:1400,matchMedia:()=>({matches:false})};
global.localStorage = global.window.localStorage;
global.matchMedia = global.window.matchMedia;
global.alert = ()=>{}; global.FileReader = function(){}; global.Blob = function(){};
global.URL = {createObjectURL:()=>'',revokeObjectURL(){}}; global.setTimeout = f=>f();

const code = fs.readFileSync(process.argv[2] || 'v15/src/app.js', 'utf8');
let bad = 0;
const chk = (c, label, extra) => { if(!c) bad++; console.log('  ' + label + ':', c ? '✓' : '✗', extra === undefined ? '' : extra); };

eval(code + `
renderCmp();
const d = homeStatData();
const statsHtml = document.getElementById('homeStats').innerHTML;

console.log('=== 1. 旧演示数据已移除 ===');
chk(typeof SCEN === 'undefined', 'SCEN 常量已删');
chk(typeof pickScen === 'undefined', 'pickScen 已删');

console.log('=== 2. 事实行四项来自真实数据 ===');
const items = statsHtml.match(/<div title="[^"]*"><b>[^<]*<\\/b><span>[^<]*<\\/span><\\/div>/g) || [];
chk(items.length === 4, '事实项条数', items.length + ' 项');
chk(statsHtml.indexOf('>'+d.descs+'<') >= 0, '描述符数', d.descs);
chk(statsHtml.indexOf('>'+d.paths+'<') >= 0, '政策路径数', d.paths);
chk(statsHtml.indexOf('>'+d.states+'<') >= 0, '状态数', d.states);
chk(statsHtml.indexOf(fmtNum(d.combos)) >= 0, '组合数', fmtNum(d.combos));

console.log('=== 3. 数字按量级换算，不出现裸大数 ===');
chk(/[亿万]/.test(statsHtml), '亿/万格式', (statsHtml.match(/<b>[^<]*[亿万]<\\/b>/)||[''])[0]);
chk(statsHtml.indexOf('51656') < 0, '不出现未换算的大数');

console.log('=== 4. 写死的对比表已删，不再复活 ===');
// 旧 cmpBox 守卫恒假（index.html 里从来没有这个 id），整段模板在成品里从不渲染。
// 现已连同 rows 常量一并删除；这里守住它不会被重新写进来。
const cmpHtml = document.getElementById('cmpBox').innerHTML;
chk(cmpHtml === '', 'cmpBox 不再被写入', cmpHtml ? cmpHtml.slice(0, 40) : '空');
chk(code.indexOf('cmpBox') < 0, '源码里不再出现 cmpBox');
chk(code.indexOf('直接给模型填数') < 0, '写死的对比文案已清干净');

console.log('=== 5. 首页矩阵 ===');
const grid = document.getElementById('hmGrid');
const cells = (grid.innerHTML.match(/class="cell/g)||[]).length;
chk(cells === 81, '矩阵格数', cells);
chk((grid.innerHTML.match(/class="cell dg/g)||[]).length === 9, '对角格 9 个');
chk(typeof renderHomeGrid === 'function', 'renderHomeGrid 已定义');

console.log('');
console.log(bad === 0 ? '全部通过' : bad + ' 项未通过');
if(bad) process.exit(1);
`);
