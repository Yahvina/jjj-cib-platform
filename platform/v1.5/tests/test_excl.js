// 全局互斥对与孤立档位：判断来自自洽集、孤立与互斥不混淆、上限截断、抽样告警
// 这一套补的是一个真实缺口：exclPairs()（app.js:1495）在 2026-10-25 之前没有任何测试保护，
// 全部 29 套里 exclPairs/soloBox 命中 0 次，只有 test_conf.js 在测已被取代的 confPairs()。
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
cimKeys().forEach(k=>cim[k]={v:0,conf:'中',why:'',rev:true});

console.log('=== 1. 没跑检验时不给假结论 ===');
cimResult=null;
console.log('  need=check:', exclPairs().need==='check'?'✓':'✗');

console.log('=== 2. 自洽集为空时说无法判断 ===');
cimResult={ds:[A,B], consistent:[], sampled:false, sizes:[ST(A).length,ST(B).length]};
console.log('  need=empty:', exclPairs().need==='empty'?'✓':'✗');

console.log('=== 3. 只有一个描述符时说样本不够 ===');
cimResult={ds:[A], consistent:[[0]], sampled:false, sizes:[ST(A).length]};
console.log('  need=few:', exclPairs().need==='few'?'✓':'✗');

console.log('=== 4. 互斥对真的来自自洽集（不看用户选了什么） ===');
// 造一个可预期的矩阵：A 与 B 之间给一个强负向，制造出必然排除的组合
cim[A+'>'+B]={v:-3,conf:'高',why:'',rev:true};
cim[B+'>'+A]={v:0,conf:'高',why:'',rev:true};
const r=enumCore([A,B],null);
cimResult={ds:[A,B], consistent:r.consistent, sampled:false, sizes:[ST(A).length,ST(B).length]};
const ex=exclPairs();
const cons=new Set(r.consistent.map(cb=>cb.join(',')));
// 每一个报出来的互斥对，都必须真的从未在自洽集里出现过
const allAbsent=ex.pairs.every(p=>!cons.has(p.i===0?(p.ai+','+p.bj):(p.bj+','+p.ai)));
console.log('  自洽组数:', r.consistent.length, ' 互斥对数:', ex.pairs.length);
console.log('  每一对都确实从未共存:', allAbsent?'✓':'✗');
// 反方向：所有共存过的组合都不该被报成互斥
const coex=[];
for(let i=0;i<ST(A).length;i++) for(let j=0;j<ST(B).length;j++) if(cons.has(i+','+j)) coex.push(i+','+j);
const noFalsePos=ex.pairs.every(p=>!coex.includes(p.ai+','+p.bj));
console.log('  没有把"共存过"误报成互斥:', noFalsePos?'✓':'✗');

console.log('=== 5. 与用户手选状态无关（全局判定） ===');
sel.desc={};
sel.desc[A]={states:[],src:''}; sel.desc[B]={states:[],src:''};
const before=JSON.stringify(exclPairs().pairs.map(p=>[p.i,p.ai,p.j,p.bj]));
sel.desc[A].states=[ST(A)[0]]; sel.desc[B].states=[ST(B)[0]];
const after=JSON.stringify(exclPairs().pairs.map(p=>[p.i,p.ai,p.j,p.bj]));
console.log('  用户选中状态前后，互斥对完全相同:', before===after?'✓':'✗');

console.log('=== 6. 孤立档位：从未在任何自洽情景里出现过 ===');
// 手工造自洽集比碰运气稳：两档各只出现第 0 / 第 1 档，第 2 档必然成为孤立档位
const syn={ds:[A,B], sizes:[ST(A).length,ST(B).length], consistent:[[0,0],[1,1]], sampled:false};
cimResult=syn; const ex2=exclPairs();
const soloGot=(ex2.solo||[]).map(x=>[x.i,x.a]).sort((p,q)=>p[0]-q[0]||p[1]-q[1]);
const soloExpect=[[0,2],[1,2]];   // 第 2 档从未出现在 [[0,0],[1,1]] 里
console.log('  预期孤立档位:', JSON.stringify(soloExpect), ' 实得:', JSON.stringify(soloGot),
  JSON.stringify(soloGot)===JSON.stringify(soloExpect)?'✓':'✗');
console.log('  互斥对数为 2（(0,1) 与 (1,0) 各自从未共存）:', ex2.pairs.length===2?'✓':'✗');

console.log('=== 7. 孤立档位不在互斥对里重复计入 ===');
// exclPairs 的 a/b 循环对 alive 做了 continue，所以互斥对的每一端都必须"活着"
const allAlive=ex2.pairs.every(p=>{
  const aliveI=syn.consistent.some(cb=>cb[0]===p.ai);
  const aliveJ=syn.consistent.some(cb=>cb[1]===p.bj);
  return aliveI&&aliveJ;
});
console.log('  互斥对两端都不是孤立档位:', allAlive?'✓':'✗');
console.log('  互斥对里不出现孤立档位索引 2:', ex2.pairs.every(p=>p.ai!==2&&p.bj!==2)?'✓':'✗');

console.log('=== 7b. 孤立与互斥是两回事，同时存在时各自计数正确 ===');
confList();
const hs=EL['confList'].innerHTML;
console.log('  同时给出孤立档位块与互斥对:', (/class="soloBox"/.test(hs)&&/全部互斥对/.test(hs))?'✓':'✗');
console.log('  孤立档位数标注为 2:', /孤立档位（2 个）/.test(hs)?'✓':'✗');

console.log('=== 8. 抽样时给告警、精确时不告警 ===');
cimResult={ds:[A,B], consistent:r.consistent, sampled:true, sizes:[ST(A).length,ST(B).length]};
console.log('  sampled 透传为 true:', exclPairs().sampled===true?'✓':'✗');
cimResult.sampled=false;
console.log('  sampled 透传为 false:', exclPairs().sampled===false?'✓':'✗');

console.log('=== 9. 自洽组数透传给界面 ===');
cimResult={ds:[A,B], consistent:r.consistent, sampled:false, sizes:[ST(A).length,ST(B).length]};
console.log('  nCons 等于自洽组数:', exclPairs().nCons===r.consistent.length?'✓':'✗');

console.log('=== 10. 渲染：上限 40 对截断 ===');
// 5 个真实描述符、每个多档，自洽集只留 3 组对角组合 → 每对描述符 7 个组合互斥，10 对即 70 对，必然触发 40 对截断
// 注意：测试桩里 cimKeys() 返回空数组，必须用真实描述符名，不能靠 slice
const FIVE=['产业结构','一次能源结构','经济增长速度','人口空间分布与收缩态势','终端电气化率'];
const many={ds:FIVE, sizes:FIVE.map(d=>ST(d).length), sampled:false,
  consistent:[[0,0,0,0,0],[1,1,1,1,1],[2,2,2,2,2]]};
cimResult=many;
const ex3=exclPairs();
const expectPairs=FIVE.reduce((a,_,i)=>a+(i*(ST(FIVE[i]).length*ST(FIVE[i]).length-ST(FIVE[i]).length)),0);
console.log('  互斥对数超过 40:', ex3.pairs.length>40?('✓（'+ex3.pairs.length+' 对）'):('✗（只有 '+ex3.pairs.length+' 对）'));
confList();
const h10=EL['confList'].innerHTML;
console.log('  标注"此处列出最值得看的 40 对":', /此处列出最值得看的 40 对/.test(h10)?'✓':'✗');
console.log('  标注总对数:', new RegExp('共 '+ex3.pairs.length+' 对').test(h10)?'✓':'✗');
console.log('  互斥对措辞用"从未同时出现":', /从未同时出现/.test(h10)?'✓':'✗');
console.log('  写明"不再限于你手选的那一组":', /不再限于你手选的那一组/.test(h10)?'✓':'✗');
console.log('  列出条数不超过 40:', (h10.match(/class="conf"/g)||[]).length<=40?'✓':'✗');

console.log('=== 10b. 抽样时渲染给出"可能不全"告警 ===');
cimResult={ds:FIVE, sizes:FIVE.map(d=>ST(d).length), sampled:true,
  consistent:[[0,0,0,0,0],[1,1,1,1,1],[2,2,2,2,2]]};
confList();
const h10b=EL['confList'].innerHTML;
console.log('  告警"可能把没抽到误判成不可能":', /可能把"没抽到"误判成"不可能"/.test(h10b)?'✓':'✗');
cimResult={ds:FIVE, sizes:FIVE.map(d=>ST(d).length), sampled:false,
  consistent:[[0,0,0,0,0],[1,1,1,1,1],[2,2,2,2,2]]};
confList();
console.log('  精确抽样时不出现该告警:', !/可能把"没抽到"误判成"不可能"/.test(EL['confList'].innerHTML)?'✓':'✗');

console.log('=== 11. 渲染在无自洽情景时给可操作指引 ===');
cimResult={ds:[A,B], consistent:[], sampled:false, sizes:[ST(A).length,ST(B).length]};
confList();
const h2=EL['confList'].innerHTML;
console.log('  空态写明先复核打分/放宽锚定:', /复核打分矩阵|放宽锚定/.test(h2)?'✓':'✗');

console.log('=== 12. 未跑检验时给"去运行"的按钮，而不是假结论 ===');
cimResult=null;
confList();
const h3=EL['confList'].innerHTML;
console.log('  提示先运行检验:', /先运行一致性检验/.test(h3)?'✓':'✗');
console.log('  提供运行入口 runCIM:', /runCIM\(\)/.test(h3)?'✓':'✗');
`;

eval(code + test);
