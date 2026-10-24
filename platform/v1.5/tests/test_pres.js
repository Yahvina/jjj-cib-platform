// 验证演示模式：章节、可用性判断、翻页跳过、超 50 组提示、各章渲染
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
global.window = { scrollTo() {}, addEventListener() {}, localStorage: { getItem: () => null, setItem() {} } };
global.localStorage = global.window.localStorage;
global.alert = () => {};
global.FileReader = function () {};
global.Blob = function () {};
global.URL = { createObjectURL: () => '', revokeObjectURL() {} };

const code = fs.readFileSync(process.argv[2], 'utf8');

const test = `
render=function(){}; toast=function(){};
const A='一次能源结构', B='产业结构', C='终端电气化率';

console.log('=== 1. 章节结构 ===');
console.log('  章节数:', PRES.length, '(应 7)');
console.log('  顺序:', PRES.map(c=>c.t).join(' → '));
console.log('  判定:', (PRES.length===7 && PRES[0].t==='开场' && PRES[6].t==='跨层一致性')?'✓':'✗');

console.log();
console.log('=== 2. 没选描述符、没算情景时的可用性 ===');
sel.desc={}; cimResult=null;
console.log('  开场:', presAvail('about')?'可讲':'不可', '| 政策库:', presAvail('policy')?'可讲':'不可');
console.log('  矩阵:', presAvail('matrix')?'可讲 ✗':'不可 ✓');
console.log('  情景:', presAvail('scen')?'可讲 ✗':'不可 ✓');
console.log('  判定:', (!presAvail('matrix') && !presAvail('scen') && presAvail('about'))?'✓':'✗');

console.log();
console.log('=== 3. 选了 3 个描述符、未算情景 ===');
sel.desc={}; [A,B,C].forEach(n=>{ sel.desc[n]={states:ST(n).slice(),src:''}; });
console.log('  矩阵:', presAvail('matrix')?'可讲 ✓':'不可 ✗');
console.log('  情景:', presAvail('scen')?'可讲 ✗':'不可 ✓');

console.log();
console.log('=== 4. 翻页应跳过不可用章节 ===');
presI=2;                      // 政策库
presNext();
console.log('  选了 3 个描述符、未算情景：从「政策库」往后 →', PRES[presI].t, '(应到「交叉影响」)');
console.log('  判定:', PRES[presI].k==='matrix'?'✓':'✗');
presI=2; sel.desc={};          // 清空描述符，矩阵也变不可用
presNext();
console.log('  全部不可用：从「政策库」往后 →', PRES[presI].t, '(应跳过 4 章到「跨层一致性」)');
console.log('  判定:', PRES[presI].k==='xl'?'✓':'✗');
presPrev();
console.log('  再往前翻 →', PRES[presI].t, '(应回到「政策库」)');
[A,B,C].forEach(n=>{ sel.desc[n]={states:ST(n).slice(),src:''}; });

console.log();
console.log('=== 5. 打开演示：容器与导航 ===');
openPres();
const nav=document.getElementById('presNav').innerHTML;
const cnt=(nav.match(/class="pnav/g)||[]).length;
console.log('  容器 .on 类:', document.getElementById('pres').classList.contains('on')?'✓':'✗');
console.log('  导航按钮数:', cnt, '(应 7)');
console.log('  禁用按钮数:', (nav.match(/disabled/g)||[]).length, '(情景+单情景 2 个不可用 → 应 2)');

console.log();
console.log('=== 6. 各章渲染 ===');
function body(k){ presI=PRES.findIndex(c=>c.k===k); return presBody(k)||''; }
cim={}; cimKeys().forEach(k=>cim[k]={v:0,conf:'中',why:'',rev:false});
const about=body('about');
console.log('  开场含标题与三个要点:', /政策情景快速评估/.test(about) && /不做预测/.test(about) && /跨三个尺度/.test(about)?'✓':'✗');
const desc=body('desc');
console.log('  描述符表含三个变量:', [A,B,C].every(x=>desc.indexOf(x)>=0)?'✓':'✗', '| 含区间:', /prng/.test(desc)?'✓':'✗');
const pol=body('policy');
console.log('  政策库含 106 与映射:', /106/.test(pol) && /不在模型口径内/.test(pol)?'✓':'✗');
cim[A+'>'+B]={v:2,conf:'中',why:'',rev:false};
cim[B+'>'+C]={v:-3,conf:'低',why:'',rev:true};
const mat=body('matrix');
console.log('  矩阵含 +2 与 −3:', /\\+2/.test(mat) && /-3/.test(mat)?'✓':'✗', '| 含统计:', /低置信度/.test(mat)?'✓':'✗');

console.log();
console.log('=== 7. 情景页与超 50 组提示 ===');
cimResult={ds:[A,B,C], total:27, checked:27, inconsistent:2, consistent:[]};
for(let i=0;i<60;i++) cimResult.consistent.push([i%3,(i+1)%3,(i+2)%3]);
const scen=body('scen');
console.log('  含「超过 50 组」提示:', /超过 50 组/.test(scen)?'✓':'✗');
console.log('  含筛选建议:', /情景筛选/.test(scen)?'✓':'✗');
const one=body('one');
console.log('  单情景页含影响平衡:', /影响平衡/.test(one) && /▲/.test(one)?'✓':'✗');

console.log();
console.log('=== 8. 情景数 ≤ 50 时不应告警 ===');
cimResult.consistent=cimResult.consistent.slice(0,20);
const scen2=body('scen');
console.log('  含「超过 50 组」:', /超过 50 组/.test(scen2)?'存在 ✗':'无 ✓');

console.log();
console.log('=== 9. 跨层页 ===');
document.querySelectorAll=(sel)=>{
  if(sel==='[data-scale].sel') return ['nation','region','prov','city'].map(l=>({dataset:{scale:l}}));
  return [];
};
xlSel={}; xlSel[A]={nation:0,region:0,prov:2,city:2};
const xl=body('xl');
console.log('  含四层表头:', /国家级/.test(xl) && /区域级/.test(xl) && /市级/.test(xl)?'✓':'✗');
console.log('  检出冲突:', /相差 2 档/.test(xl)?'✓':'✗', '| 含德国软件对比:', /德国软件没有/.test(xl)?'✓':'✗');

console.log();
console.log('=== 10. 退出 ===');
closePres();
console.log('  容器 .on 类已移除:', document.getElementById('pres').classList.contains('on')?'✗':'✓');
`;

eval(code + test);
