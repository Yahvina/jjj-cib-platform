// 验证多专家集成：矩阵引用切换、分歧识别、合并规则、裁定
const fs = require('fs');

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
render=function(){};                 // 屏蔽整页重绘

const DS=['经济增长速度','产业结构','人口空间分布与收缩态势'];
sel.desc={}; DS.forEach(n=>sel.desc[n]={states:ST(n).slice(), src:''});
expertN=3;
cim={};

/* ===== 1. 建立三份矩阵，第一份应当直接接管当前矩阵 ===== */
buildEns();
console.log('人数:', ens.people.length, '—', ens.people.map(p=>p.name).join(' / '));
console.log('第一份是否接管当前矩阵:', ens.people[0].cim===cim ? '是 ✓' : '否 ✗');
console.log('其余两份初始为空:', Object.keys(ens.people[1].cim).length===0 && Object.keys(ens.people[2].cim).length===0 ? '是 ✓' : '否 ✗');
console.log();

/* ===== 2. 各人分别打分 ===== */
const K1='经济增长速度>产业结构', K2='产业结构>经济增长速度', K3='经济增长速度>人口空间分布与收缩态势';
cim[K1]={v:3,conf:'高',why:'A 的判据',rev:true};
cim[K2]={v:3,conf:'高',why:'A 的判据',rev:true};
cim[K3]={v:-2,conf:'中',why:'A 的看法',rev:false};

setPerson(1);
console.log('切到 B 后 cim 是否就是 B 那一份:', cim===ens.people[1].cim ? '是 ✓' : '否 ✗');
console.log('B 初始条目数（应为 0）:', Object.keys(cim).length);
cim[K1]={v:-1,conf:'中',why:'B 的判据',rev:false};   // 与 A 差 4 → 分歧
cim[K2]={v:2,conf:'中',why:'B 的判据',rev:false};    // 与 A 差 1 → 一致
cim[K3]={v:-3,conf:'高',why:'B 的看法',rev:true};    // 与 A 差 1 → 一致

setPerson(2);
cim[K1]={v:2,conf:'低',why:'C 的判据',rev:false};    // 三人取值 3 / -1 / 2
console.log();

/* ===== 3. 分歧识别 ===== */
const st=ensStat();
console.log('可比条目:', st.multi, '(应为 3)');
console.log('完全一致:', st.agree, '(应为 2)');
console.log('存在分歧:', st.diff.length, '(应为 1)');
st.diff.forEach(d=>console.log('   分歧项:', d.k.replace('>',' → '),
  '| 各人取值', d.rec.map(r=>r.v).join(' / '), '| 极差', d.sp));
console.log('一致率:', st.rate + '%');
console.log();

/* ===== 4. A 的矩阵没有被污染 ===== */
setPerson(0);
console.log('切回 A，cim 是 A 那一份:', cim===ens.people[0].cim ? '是 ✓' : '否 ✗');
console.log('  A 的三条取值:', [K1,K2,K3].map(k=>cim[k].v).join(' / '), '(应为 3 / 3 / -2)');
console.log();

/* ===== 5. 合并 ===== */
ensMerge();
console.log('合并后切到合并结果:', ens.active===-1 ? '是 ✓' : '否 ✗');
console.log('合并条目数:', Object.keys(ens.merged).length);
console.log('  分歧项取值:', ens.merged[K1].v, '| 置信度', ens.merged[K1].conf,
  '| 已审', ens.merged[K1].rev, '(应取中位数 2、标低置信、未审)');
console.log('  一致项取值:', ens.merged[K2].v, '| 置信度', ens.merged[K2].conf,
  '(A3/B2 平均 2.5 → 四舍五入 3；含"高"→ 高)');
console.log('  一致项说明:', ens.merged[K2].why);
console.log();

/* ===== 6. 裁定后重合并 ===== */
arbit(K1, -1);
console.log('裁定为 -1 后：取值', ens.merged[K1].v, '| 置信度', ens.merged[K1].conf,
  '| 已审', ens.merged[K1].rev, '(应 -1 / 高 / true)');
console.log('  说明:', ens.merged[K1].why);
console.log();

/* ===== 7. 全部裁定为中位数 ===== */
ensRes={}; ensMerge();
arbitAllMed();
console.log('一键取中位数后，分歧项取值:', ens.merged[K1].v, '(应为 2)');
console.log('  说明:', ens.merged[K1].why);
console.log();

/* ===== 8. 清空矩阵不应切断引用 ===== */
setPerson(1);
const ref=ens.people[1].cim;
resetCim();
console.log('清空后 cim 是否仍是 B 那一份:', cim===ref ? '是 ✓' : '否 ✗（引用被切断）');
aiFill();
console.log('AI 预填后 cim 是否仍是 B 那一份:', cim===ref ? '是 ✓' : '否 ✗（引用被切断）');
console.log('  预填条目数:', Object.keys(cim).length);
console.log('  其余两位未受影响:', Object.keys(ens.people[0].cim).length + ' / ' + Object.keys(ens.people[2].cim).length);
console.log();

/* ===== 9. 单人模式下不应有多余状态 ===== */
dropEns();
console.log('退出多人模式:', ens===null ? '是 ✓' : '否 ✗');
console.log('崩溃检测: 已完整执行到结尾 ✓');
`;

eval(code + '\n' + test);
