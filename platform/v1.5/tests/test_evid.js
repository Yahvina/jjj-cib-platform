// 验证区间证据：覆盖完整性、初始化、人工改动后失效、报告带出
const fs = require('fs');

const EL = {};
function mkEl() {
  return {
    innerHTML: '', textContent: '', disabled: false, value: '',
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

const ALL=allDescs().map(d=>d.n);
console.log('=== 1. 证据覆盖 ===');
console.log('  描述符总数:', ALL.length);
const miss=ALL.filter(n=>!RANGE_EVID[n]);
console.log('  缺证据标注的:', miss.length?miss.join('、'):'无 ✓');

const cnt={direct:0,conv:0,example:0,exo:0};
ALL.forEach(n=>{ const k=(RANGE_EVID[n]||{}).k; cnt[k]=(cnt[k]||0)+1; });
console.log('  政策目标 '+cnt.direct+' / 需换算 '+cnt.conv+' / 示例值 '+cnt.example+' / 外生 '+cnt.exo);
console.log();

console.log('=== 2. 初始化时的证据继承 ===');
[['一次能源结构','direct'],['钢铁工艺路线','direct'],['单位产品能耗限额强度','direct'],
 ['产业结构','conv'],['建筑能效标准强度','conv'],
 ['工业节能改造强度','example'],['经济增长速度','exo']].forEach(([n,k])=>{
  const got=defsOf(n)[0].ev;
  console.log('  '+n.padEnd(12,'　')+' → '+got+(got===k?' ✓':' ✗（应 '+k+'）'));
});
console.log();

console.log('=== 3. 人工改区间后依据失效 ===');
const nm='一次能源结构';
sel.desc={}; sel.desc[nm]={states:ST(nm).slice(), src:''};
const s0=defsOf(nm)[0];
console.log('  改前 ev:', s0.ev, '| 区间', s0.lo+'–'+s0.hi);
document.getElementById('rlo').value=String(s0.lo);
document.getElementById('rhi').value=String(s0.hi);
document.getElementById('ru').value=s0.u||'';
saveRange(nm, s0.n);
console.log('  只点保存（值未变）→ ev:', defsOf(nm)[0].ev, (defsOf(nm)[0].ev==='direct'?'✓ 依据保留':'✗'));
document.getElementById('rhi').value=String(+s0.hi+5);
saveRange(nm, s0.n);
console.log('  改了上限 → ev:', defsOf(nm)[0].ev, (defsOf(nm)[0].ev==='user'?'✓ 标记为已改':'✗'));
console.log();

console.log('=== 4. 报告数据带出依据 ===');
cim={}; cimKeys().forEach(k=>cim[k]={v:0,conf:'低',why:'',rev:false});
const rep=reportData();
const withEv=rep.descriptors.filter(x=>x.evt);
console.log('  带依据文字的描述符:', withEv.length+' 个');
console.log('  例：'+withEv.slice(0,2).map(x=>x.name+'['+x.ev+']').join(' | '));
console.log('  依据文字样例:', (withEv[0]||{}).evt ? withEv[0].evt.slice(0,40)+'…' : '（无）');
console.log();

console.log('=== 5. 界面渲染 ===');
renderStates();
const h=document.getElementById('statePanel').innerHTML;
console.log('  证据徽标数:', (h.match(/class="evi/g)||[]).length, '（至少 1）');
console.log('  含「已改」标记:', /已改/.test(h)?'✓':'（本次选中的描述符未改动则不出现）');
`;

try {
  new Function(code + test)();
} catch (e) {
  console.log('崩溃检测：' + e.message);
  console.log(e.stack.split('\n').slice(0, 5).join('\n'));
  process.exit(1);
}
