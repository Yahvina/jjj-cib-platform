// 验证贝叶斯后验：先验+似然更新、置信度影响区间宽度、分歧导致翻转概率、只用于展示与不确定性
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
const A='一次能源结构', B='产业结构', C='终端电气化率';
sel.desc={};
[A,B,C].forEach(n=>{ sel.desc[n]={states:ST(n).slice(),src:''}; });
const keys=cimKeys();

function fill(){
  cim={}; BAYES=null;
  keys.forEach(k=>cim[k]={v:0,conf:'中',why:'',rev:true});
  cim[A+'>'+B]={v:3,conf:'高',why:'',rev:true};
  cim[B+'>'+A]={v:2,conf:'中',why:'',rev:true};
  cim[A+'>'+C]={v:-2,conf:'低',why:'',rev:false};
  cim[C+'>'+A]={v:-1,conf:'高',why:'',rev:true};
}

console.log('=== 1. 单条高置信 +3：后验应显著为正，区间不含 0 ===');
const p1=posteriorOf([{v:3,conf:'高'}]);
console.log('  后验均值', p1.mean.toFixed(2), '90%区间', p1.lo.toFixed(2), '~', p1.hi.toFixed(2));
console.log('  均值>2:', p1.mean>2?'✓':'✗', ' 下界>0:', p1.lo>0?'✓':'✗', ' P(+)=', (p1.pPos*100).toFixed(0)+'%');

console.log('=== 2. 同分不同置信度：高置信区间必须更窄 ===');
const ph=posteriorOf([{v:2,conf:'高'}]);
const pl=posteriorOf([{v:2,conf:'低'}]);
const wh=ph.hi-ph.lo, wl=pl.hi-pl.lo;
console.log('  高置信宽', wh.toFixed(2), '低置信宽', wl.toFixed(2), wl>wh?'✓':'✗');

console.log('=== 3. 两位专家 +3 / -3：方向判不准，翻转概率应接近各半 ===');
const p3=posteriorOf([{v:3,conf:'高'},{v:-3,conf:'高'}]);
console.log('  均值', p3.mean.toFixed(2), 'P(+)', (p3.pPos*100).toFixed(0)+'%', 'P(-)', (p3.pNeg*100).toFixed(0)+'%');
console.log('  均值近似 0:', Math.abs(p3.mean)<0.6?'✓':'✗', ' 无方向占优:', Math.max(p3.pPos,p3.pNeg)<0.6?'✓':'✗');

console.log('=== 4. 两位专家同向 +2 / +3：后验应更集中，区间比单条窄 ===');
const p4=posteriorOf([{v:2,conf:'中'},{v:3,conf:'中'}]);
const p4s=posteriorOf([{v:2,conf:'中'}]);
console.log('  两条宽', (p4.hi-p4.lo).toFixed(2), '单条宽', (p4s.hi-p4s.lo).toFixed(2),
  (p4.hi-p4.lo)<(p4s.hi-p4s.lo)?'✓':'✗', ' 均值', p4.mean.toFixed(2));

console.log('=== 5. computeBayes 覆盖已打分条目，并给出矩阵 ===');
fill();
const R=computeBayes();
console.log('  条目数', R.n, '= 已打分', keys.length, R.n===keys.length?'✓':'✗');
console.log('  矩阵含 A>B:', typeof R.matrix[A+'>'+B]==='number'?'✓':'✗');
console.log('  均值落在 −3~3:', Object.values(R.matrix).every(v=>v>=-3.3&&v<=3.3)?'✓':'✗');

console.log('=== 6. 贝叶斯不进检算：impactVal 始终用状态级精判或展开，与开关无关 ===');
useBayes=false; BAYES=null;
const raw=impactVal(A,0,B,0);
useBayes=true; computeBayes();
const post=impactVal(A,0,B,0);
console.log('  关闭时', raw, '开启时', post, raw===post?'✓ 开关不改变检算':'✗',
  post!==R.matrix[A+'>'+B]?'✓ 仍是状态级值':'✗');

console.log('=== 7. 区间宽度排序与翻转计数 ===');
fill(); computeBayes();
const wid=bayesWidest(3);
console.log('  最宽三条:', wid.map(x=>x.k).join(' | '));
console.log('  宽度单调递减:', (wid[0].c.hi-wid[0].c.lo)>=(wid[2].c.hi-wid[2].c.lo)?'✓':'✗');
const fl=bayesFlipN(0.2);
console.log('  判不准条数(方向未达80%):', fl, fl>=1?'✓':'✗');
`;

eval(code + test);
