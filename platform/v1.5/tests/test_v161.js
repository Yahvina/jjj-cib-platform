// test_v161.js -- v1.6.1 情景配置闸门/中档/同步验收（用例 A-H）
// 参数：index.html（app.js 从其同目录的 src/app.js 读）。
const fs = require('fs');
const path = require('path');

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
    getBoundingClientRect: () => ({ top: 0, left: 0 }), addEventListener() {}, setAttribute() {}
  };
  return e;
}
global.document = {
  getElementById: (id) => { if (!EL[id]) EL[id] = mkEl(); return EL[id]; },
  querySelector: () => mkEl(), querySelectorAll: () => [],
  createElement: () => mkEl(), body: mkEl(), addEventListener() {}
};
global.window = { scrollTo() {}, addEventListener() {}, localStorage: { getItem: () => null, setItem() {} },
  innerHeight: 900, innerWidth: 1400, matchMedia: () => ({ matches: false }) };
global.localStorage = global.window.localStorage;
global.matchMedia = global.window.matchMedia;
global.alert = () => {}; global.FileReader = function () {}; global.Blob = function () {};
global.URL = { createObjectURL: () => '', revokeObjectURL() {} }; global.setTimeout = (f) => f();

const htmlPath = process.argv[2] || 'v15/index.html';
const appPath = path.join(path.dirname(htmlPath), 'src', 'app.js');
global.__HTML__ = fs.readFileSync(htmlPath, 'utf8');
const code = fs.readFileSync(appPath, 'utf8');

const test = `
const html = global.__HTML__;
let bad = 0;
const chk = (c, label, extra) => { if(!c) bad++; console.log('  ' + label + ':', c ? '✓' : '✗', extra === undefined ? '' : extra); };
const P = PALLC();
const polByName = (nm) => P.filter(p => p.n === nm)[0];
render = function(){}; toast = function(){};
function resetCfg(names){
  cfgSel = {}; names.forEach(n => { if(polByName(n)) cfgSel[n] = 1; });
  cfgPick = {}; cfgClaim = {}; cfgTouched = {}; cfgSaved = null; cfgRunInfo = null; cfgGateInfo = null;
  cim = {}; cfgStep = 0; viewMode = 'config'; docPg = '';
}
function setE(a, b, v){ cim[a+'>'+b] = {v:v, conf:'中', why:'', rev:false}; }
function fillAll(list, M){
  cim = {};
  list.forEach((s, si) => list.forEach((t, ti) => { if(s !== t) setE(s, t, M[si][ti]); }));
}

console.log('=== A. 真实政策组合能出结论 ===');
chk(P.length === 106, 'POLICY 是 106 条（从 PALLC 取）', P.length);
const A_NAMES = ['排放交易体系（ETS）', '可交易可再生能源证书/配额/RPS', '建筑最低能源绩效标准（MEPS）'];
A_NAMES.forEach(n => chk(!!polByName(n), 'PALLC 按名取到「'+n+'」'));
resetCfg(A_NAMES); cfgPick = {};
const aInputs2 = cfgInputNames();
chk(aInputs2.length >= 3, '三个政策命中 >=3 个参与变量', aInputs2.join('/'));
aInputs2.forEach(nm => { cfgPick[nm] = ST(nm)[0]; });
const A_M = [[0,2,-2],[2,0,2],[-2,2,0]];
fillAll(aInputs2, A_M);
const aGate = cfgGate(aInputs2);
chk(aGate.ok, '真实政策组合过闸门', aGate.why || '');
let aRun = true; try { cfgRun(); } catch(e) { aRun = false; console.log(e.message); }
chk(aRun, 'cfgRun 不抛异常');
chk(!!cimResult && cimResult.ds.length === aInputs2.length, '真实政策组合出结论');
chk(!!cimResult && cimResult.count > 0, '结论里自洽组数 > 0', cimResult ? cimResult.count : 'null');

console.log();
console.log('=== B. 无判断 -> 拒 + 还差哪几对清单 ===');
resetCfg(A_NAMES); cim = {};
const bInputs = cfgInputNames();
const bGate = cfgGate(bInputs);
chk(!bGate.ok, '无判断时闸门拒');
chk(bGate.why.indexOf('一条判断都没有') >= 0, '拒出原因是本次参与变量之间一条判断都没有', bGate.why);
chk(bGate.part.unjudged.length === bGate.part.pairN, '无判断时全部对都未判', bGate.part.unjudged.length+'/'+bGate.part.pairN);
const bHelp = cfgGateHelpHTML(bGate);
chk(bHelp.indexOf('还差 '+bGate.part.unjudged.length+' 对没判断') >= 0, '清单写明还差几对没判断');
chk(bHelp.indexOf('→') >= 0, '清单逐对列出');

console.log();
console.log('=== C. 全落基准档/无梯度 -> 拒 ===');
resetCfg(A_NAMES);
const cInputs = cfgInputNames();
cInputs.forEach(nm => { cfgPick[nm] = ST(nm)[0]; });
fillAll(cInputs, cInputs.map(() => cInputs.map(() => 0)));
const cGate = cfgGate(cInputs);
chk(!cGate.ok, '全 0 判断时闸门拒');
chk(!!cGate.flat || (cGate.ratio >= 0.999), '命中无梯度或几乎全自洽判据', cGate.why);

console.log();
console.log('=== H. enumCore 与 buildIMP 同 ds+cim 逐格相等 ===');
const HDS = ['经济增长速度','人口空间分布与收缩态势','产业结构'];
resetCfg(A_NAMES);
HDS.forEach(n => { sel.desc[n] = { states: ST(n).slice(), src: '' }; });
HDS.forEach(s => HDS.forEach(t => { if(s !== t) setE(s, t, ((s.length + t.length) % 5) - 2); }));
const hIMP = buildIMP(HDS, cim);
let hDiff = 0;
for(let k = 0; k < HDS.length; k++) for(let i = 0; i < HDS.length; i++){
  if(k === i) continue;
  for(let a = 0; a < ST(HDS[k]).length; a++) for(let b = 0; b < ST(HDS[i]).length; b++){
    if(Math.abs(impactVal(HDS[k], a, HDS[i], b) - hIMP[k][i][a][b]) > 1e-9) hDiff++;
  }
}
chk(hDiff === 0, 'enumCore 内建影响表与 buildIMP 逐格相等', hDiff + ' 处不同');
const hSizes = HDS.map(d => ST(d).length);
let hBrute = 0;
const hSpace = hSizes.reduce((a, b) => a * b, 1);
for(let c = 0; c < hSpace; c++){
  let x = c; const idx = [];
  for(let i = HDS.length - 1; i >= 0; i--){ const s = hSizes[i]; idx[i] = x % s; x = Math.floor(x / s); }
  if(evalCombo(hIMP, hSizes, idx)) hBrute++;
}
const hEnum = enumCore(HDS, null);
chk(hBrute === hEnum.count, '逐格枚举自洽数 = enumCore count', hBrute + ' vs ' + hEnum.count);

console.log();
console.log('=== D. A→B 单向 -> 放（防入度式误杀） ===');
resetCfg(A_NAMES);
const dInputs = cfgInputNames();
const DA = dInputs[0], DB = dInputs[1];
sel.desc = {}; sel.desc[DA] = { states: ST(DA).slice(), src: '' }; sel.desc[DB] = { states: ST(DB).slice(), src: '' };
cim = {}; setE(DA, DB, 3);
const dGate = cfgGate([DA, DB]);
chk(dGate.ok, 'A→B 单向过闸门（不被入度误杀）', dGate.why || '');
chk(cfgFlatVars([DA, DB]).length === 0, '单向时没有变量被误判为全自由', JSON.stringify(cfgFlatVars([DA, DB])));

console.log();
console.log('=== E. 研究模式有判断但本次参与变量无判断 -> 闸门仍关 ===');
resetCfg(A_NAMES);
const eInputs = cfgInputNames();
const eOthers = allDescs().map(d => d.n).filter(n => n !== eInputs[0] && eInputs.indexOf(n) < 0);
const eOutName = eOthers[0], eOutName2 = eOthers[1];
cim = {};
setE(eOutName, eOutName2, 3);
setE(eOutName2, eOutName, -2);
chk(cfgJudgedN() >= 2, '研究模式里确有别的判断', cfgJudgedN());
chk(cfgJudgedIn(eInputs) === 0, '本次参与变量之间没有判断', cfgJudgedIn(eInputs));
const eGate = cfgGate(eInputs);
chk(!eGate.ok, '本次参与变量无判断时闸门仍关', eGate.why);
chk(eGate.why.indexOf('一条判断都没有') >= 0, '原因是本次参与变量之间一条判断都没有', eGate.why);

console.log();
console.log('=== F. 两态变量未定档 -> 不落首档、被拦 ===');
resetCfg(A_NAMES);
const twoAll = allDescs().map(d => d.n).filter(nm => ST(nm).length === 2 && dOf(nm) && dOf(nm).t !== '结果型');
chk(twoAll.length >= 2, '存在两态变量（钢铁工艺路线/碳移除规模）', twoAll.join('/'));
const fNm = twoAll[0];
cfgPick = {}; delete cfgPick[fNm];
chk(cfgFinalOf(fNm) === '', '两态变量未定档不落首档', JSON.stringify(cfgFinalOf(fNm)));
// 用同时命中两个两态变量的政策组合，验证 cfgRun 被拦且报「还有 N 个变量没定档」
cfgNotice = '';
const fUnion = {};
P.forEach(p => (p.m||[]).forEach(x => { if(x[0] === '钢铁工艺路线' || x[0] === '碳移除规模') fUnion[p.n] = 1; }));
resetCfg(Object.keys(fUnion));
const fInputs = cfgInputNames();
chk(fInputs.length >= 2, '两态变量组合命中 >=2 个参与变量', fInputs.join('/'));
// 让闸门过（本次参与变量之间有判断），只留一个变量没定档
fillAll(fInputs, fInputs.map((_, si) => fInputs.map((__, ti) => (((si+ti) % 5) - 2))));
const fGate0 = cfgGate(fInputs);
chk(fGate0.ok, '构造场景：闸门先过', fGate0.why || '');
cfgPick = {}; fInputs.forEach((nm, i) => { if(i !== 0) cfgPick[nm] = ST(nm)[0]; });
const fSelBefore = JSON.stringify(sel.desc);
cfgRun();
chk(cfgRunInfo === null, '未定档时不出结果');
chk(cfgNotice.indexOf('没定档') >= 0, '被拦时提示还有变量没定档', cfgNotice);
chk(cfgSaved !== null && JSON.stringify(cfgSaved) === fSelBefore, '被拦前已保存研究模式快照');
chk(fInputs.every(nm => !!sel.desc[nm]), '被拦前参与集已同步进 sel.desc');

console.log();
console.log('=== G. 研究模式手动设过的变量，进出配置 -> 不丢 ===');
resetCfg(A_NAMES);
const gInputs = cfgInputNames();
gInputs.forEach(nm => { cfgPick[nm] = ST(nm)[ST(nm).length - 1]; });
const gPickSnap = JSON.stringify(cfgPick);
sel.desc = {}; sel.desc[gInputs[0]] = { states: [ST(gInputs[0])[0]], src: '研究模式' };
const gSelSnap = JSON.stringify(sel.desc);
fillAll(gInputs, [[0,2,-2],[2,0,2],[-2,2,0]]);
openConfig();
chk(cfgPick && JSON.stringify(cfgPick) === gPickSnap, '进配置后手动档位不丢');
openResearch();
chk(JSON.stringify(sel.desc) === gSelSnap, '回研究模式恢复原 sel 快照');
chk(cfgPick && JSON.stringify(cfgPick) === gPickSnap, '往返后 cfgPick 仍在');
const gMerge = gInputs.filter(nm => ST(nm).length > 1)[0];
sel.desc[gMerge] = { states: [ST(gMerge)[ST(gMerge).length - 1]], src: '研究模式手改' };
openConfig();
chk(cfgFinalOf(gMerge) === ST(gMerge)[ST(gMerge).length - 1], '研究模式改档合并回 cfgFinal', cfgFinalOf(gMerge));
chk(cfgTouched[gMerge] === 1, '合并回 cfgFinal 时标记手动设定');

console.log();
console.log(bad === 0 ? '全部通过' : bad + ' 项未通过');
if(bad) process.exit(1);
`;

eval(code + '\n' + test);
