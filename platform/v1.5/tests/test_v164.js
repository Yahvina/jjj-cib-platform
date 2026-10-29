// test_v164.js -- 配置模式取档：下拉 value 语义、政策主张→建议档、一键取现状档
// 参数：app.js（不读 HTML）
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

const appPath = process.argv[2] || 'v15/src/app.js';
const code = fs.readFileSync(appPath, 'utf8');

const test = `
let bad = 0;
const chk = (c, label, extra) => { if (!c) bad++; console.log('  ' + label + ':', c ? '✓' : '✗', extra === undefined ? '' : extra); };
render = function () {}; toast = function () {};
const polByName = (nm) => PALLC().filter(p => p.n === nm)[0];
function resetCfg(names) {
  cfgSel = {}; (names || []).forEach(n => { if (polByName(n)) cfgSel[n] = 1; });
  cfgPick = {}; cfgClaim = {}; cfgTouched = {}; cfgSuggest = {}; cfgDefault = {};
  cfgSaved = null; cfgRunInfo = null; cfgGateInfo = null; cfgResearchBase = null;
  cim = {}; cfgStep = 0; viewMode = 'config'; docPg = '';
}
const P3 = ['工业差别电价', '容量电价机制'];
resetCfg(P3);
const i1 = cfgInputNames();

console.log('=== 1. 档位下拉按 value 取档（不再整体错一档）===');
const nm = i1[0];
cfgSetPick(nm, '0');
chk(cfgFinalOf(nm) === ST(nm)[0], 'value=0 → 第一档', cfgFinalOf(nm));
cfgSetPick(nm, '1');
chk(cfgFinalOf(nm) === ST(nm)[1], 'value=1 → 第二档', cfgFinalOf(nm));
cfgSetPick(nm, '-1');
chk(cfgFinalOf(nm) === '', '选回「请选择」→ 清空', '[' + cfgFinalOf(nm) + ']');

console.log();
console.log('=== 2. 政策主张 → 建议档，采纳前不落档 ===');
cfgSetClaim(nm, '提高');
chk(cfgSuggest[nm] === ST(nm)[0], '提高 → 第一档', cfgSuggest[nm]);
chk(cfgFinalOf(nm) === '', '采纳前最终档仍为空', '[' + cfgFinalOf(nm) + ']');
cfgAdoptSuggest(nm);
chk(cfgFinalOf(nm) === ST(nm)[0], '采纳后写入', cfgFinalOf(nm));
chk(cfgTouched[nm] === 1, '标记为已确认', '');
cfgSetClaim(nm, '降低');
chk(cfgSuggest[nm] === ST(nm)[ST(nm).length - 1], '降低 → 末档', cfgSuggest[nm]);
cfgSetClaim(nm, '维持');
chk(cfgSuggest[nm] === cfgBaseOf(nm), '维持 → 基准档', cfgSuggest[nm]);
cfgSetClaim(nm, '未指定');
chk(!cfgSuggest[nm], '未指定 → 不给建议', '');

console.log();
console.log('=== 3. 两档变量的主张映射 ===');
const two = allDescs().map(d => d.n).filter(n => ST(n).length === 2 && dOf(n) && dOf(n).t !== '结果型')[0];
cfgSetClaim(two, '提高'); chk(cfgSuggest[two] === ST(two)[0], '两档·提高 → 首档', cfgSuggest[two]);
cfgSetClaim(two, '降低'); chk(cfgSuggest[two] === ST(two)[1], '两档·降低 → 末档', cfgSuggest[two]);
cfgSetClaim(two, '维持'); chk(cfgSuggest[two] === cfgBaseOf(two), '两档·维持 → 现状档', cfgSuggest[two]);

console.log();
console.log('=== 4. 未定档一键取现状档 ===');
resetCfg(P3);
const i4 = cfgInputNames();
chk(i4.length >= 2, '参与变量至少两个', i4.length);
cfgFillDefault();
chk(i4.every(n => cfgFinalOf(n) === cfgBaseOf(n)), '全部未定档变量取现状档', '');
chk(i4.every(n => cfgDefault[n] === 1), '标为默认档，可与人工区分', '');
cfgSetPick(i4[0], '0');
cfgFillDefault();
chk(cfgFinalOf(i4[0]) === ST(i4[0])[0] && !cfgDefault[i4[0]], '已定档不被覆盖', cfgFinalOf(i4[0]));
chk(i4.slice(1).every(n => cfgDefault[n] === 1), '其余仍是默认档', '');

console.log();
console.log('=== 5. 不读依据强度当档位 ===');
const sg = code.slice(code.indexOf('function cfgSuggestOf'), code.indexOf('function cfgSetClaim'));
chk(sg.length > 0 && sg.indexOf('[1]') < 0, '建议档函数不读数组第二位（依据强度）', '');
chk(code.indexOf('cfgPick[nm] = cfgBestConf') < 0, '没有用映射把握写档位', '');
chk(typeof cfgSuggestOf === 'function', '建议档只由 cfgSuggestOf 产生', '');

console.log();
console.log('=== 6. 判断来源标签（单人 / 专家 / 合并）===');
ens = null; expertN = 1;
chk(cfgSrcLabel() === '单人', '没有多专家 → 单人', cfgSrcLabel());
expertN = 3;
ens = { people: [{ name: '专家 A', cim: {} }, { name: '专家 B', cim: {} }, { name: '专家 C', cim: {} }],
  active: 0, merged: null };
chk(cfgSrcLabel() === '专家 A', '看某位专家 → 用他的名字', cfgSrcLabel());
ens.active = -1; ens.merged = {};
chk(cfgSrcLabel() === '合并（3 份）', '合并结果 → 合并 N 份', cfgSrcLabel());
expertN = 5;
chk(cfgSrcLabel() === '合并（3 份）', '人数设置大于已建份数时按实际份数', cfgSrcLabel());
ens = null; expertN = 1;

console.log();
console.log('=== 7. 建完矩阵就地给「回情景配置」 ===');
resetCfg(P3);
expertN = 3;
ens = { people: [{ name: '专家 A', cim: {} }, { name: '专家 B', cim: {} }, { name: '专家 C', cim: {} }],
  active: 0, merged: null };
renderEnsBox();
chk((EL['ensBox'].innerHTML || '').indexOf('回情景配置') >= 0, '建立后话框里出现回配置入口', '');
resetCfg([]);
renderEnsBox();
chk((EL['ensBox'].innerHTML || '').indexOf('回情景配置') < 0, '没选政策时不显示回配置（没地方可回）', '');
ens = null; expertN = 1;

console.log();
console.log(bad === 0 ? '全部通过' : bad + ' 项未通过');
if (bad) process.exit(1);
`;

eval(code + '\n' + test);
