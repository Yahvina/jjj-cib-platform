// test_v162.js -- v1.6.2 情景配置主路径验收（口径统一 / 闸门降级 / 闸门出口 / 双向同步 / 生成方式 / 词表）
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
function setE(a, b, v){ cim[a+'>'+b] = {v:v, conf:'中', why:'', rev:false}; }
function fillAll(list, M){
  cim = {};
  list.forEach((s, si) => list.forEach((t, ti) => { if(s !== t) setE(s, t, M[si%3][ti%3]); }));
}
function resetCfg(names){
  cfgSel = {}; names.forEach(n => { if(polByName(n)) cfgSel[n] = 1; });
  cfgPick = {}; cfgClaim = {}; cfgTouched = {};
  cfgSaved = null; cfgRunInfo = null; cfgGateInfo = null; cfgResearchBase = null;
  cim = {}; cfgStep = 0; viewMode = 'config'; docPg = '';
}

console.log('=== 1. 范围不塌：3 变量 × 3 档 + 有梯度判断 -> checked===27 且 count>1 ===');
const P1 = ['工业差别电价','容量电价机制'];
resetCfg(P1);
const i1 = cfgInputNames();
chk(i1.length === 3, '两条政策命中 3 个参与变量', i1.join('/'));
chk(i1.every(nm => ST(nm).length === 3), '三个变量各 3 档', i1.map(nm=>ST(nm).length).join(','));
fillAll(i1, [[0,3,-3],[2,0,3],[-3,2,0]]);
i1.forEach(nm => { cfgPick[nm] = ST(nm)[0]; });
cfgRun();
chk(!!cimResult, 'cfgRun 出了结果', cimResult ? 'ds='+cimResult.ds.length : 'null');
chk(!!cimResult && cimResult.checked === 27, '本次检查 checked===27（不是塌成 1）', cimResult ? cimResult.checked : 'null');
chk(!!cimResult && cimResult.count > 1, '自洽组数 count>1', cimResult ? cimResult.count : 'null');
chk(!!cimResult && cimResult.space === 27, '组合空间 space===27', cimResult ? cimResult.space : 'null');

console.log();
console.log('=== 2. 结果页头条：组合空间读 space、检查读 checked、组数读 count ===');
cfgStep = 2; viewMode = 'config'; docPg = '';
renderConfigResult();
const sumTxt = document.getElementById('cfgResultSummary').innerHTML;
chk(sumTxt.indexOf(cimResult.space.toLocaleString()+' 种') >= 0, '组合空间印 space，不是 total', cimResult.space);
chk(sumTxt.indexOf(cimResult.checked.toLocaleString()+' 种') >= 0, '本次检查印 checked', cimResult.checked);

console.log();
console.log('=== 3. count>200 时结果页组数读 cimResult.count ===');
cimResult.count = 243; cimResult.consistent = new Array(200).fill([0,0,0]);
renderConfigResult();
const sumTxt3 = document.getElementById('cfgResultSummary').innerHTML;
chk(sumTxt3.indexOf('243') >= 0, '结果页组数印 count=243，不读 consistent.length', sumTxt3.indexOf('243'));

console.log();
console.log('=== 4. #cfgPick 说的是「你选的那组」 —— 不冲突 / 冲突在 N 个变量上 ===');
resetCfg(P1);
const i4 = cfgInputNames();
fillAll(i4, [[0,3,-3],[2,0,3],[-3,2,0]]);
i4.forEach(nm => { cfgPick[nm] = ST(nm)[0]; });
cfgRun();
cfgStep = 2; renderConfigResult();
const pickTxt = document.getElementById('cfgPick').innerHTML;
chk(pickTxt.indexOf('当前这套判断') >= 0, 'cfgPick 给的是「在你当前这套判断下」的结论', '');
chk(pickTxt.indexOf('没取到档位') < 0, '不说「还有 N 个变量没取到档位」', '');
chk((pickTxt.indexOf('不冲突') >= 0) || (pickTxt.indexOf('冲突在') >= 0), '给出不冲突/冲突在 N 个变量的结论', '');

console.log();
console.log('=== 4b. 关闭政策详情必须触发整页重绘（抽屉由 render 管，只调 renderConfigPolicy 关不掉） ===');
{
  let rc = 0; const orig = render;
  render = function(){ rc++; return orig.apply(null, arguments); };
  cfgOpen = '某某政策'; cfgCloseDetail();
  chk(cfgOpen === null, 'closeDetail 清空 cfgOpen', String(cfgOpen));
  chk(rc > 0, 'closeDetail 触发整页 render（否则抽屉留在原地关不掉）', 'rc=' + rc);
  render = orig;
}

console.log();
console.log('=== 5. 配置模式只跑参与集：sel.desc 19 个变量时 cimResult.ds===cfgInputNames() ===');
resetCfg(P1);
const i5 = cfgInputNames();
fillAll(i5, [[0,3,-3],[2,0,3],[-3,2,0]]);
i5.forEach(nm => { cfgPick[nm] = ST(nm)[0]; });
sel.desc = {};
allDescs().forEach(d => { sel.desc[d.n] = {states:[], src:''}; });
cfgRun();
chk(!!cimResult && cimResult.ds.length === i5.length, '配置模式只检算参与集，不跑 19 个变量', cimResult ? cimResult.ds.length+' vs '+i5.length : 'null');

console.log();
console.log('=== 6. 同步双向可见：配置定档 -> 切换研究模式仍见档位 ===');
resetCfg(P1);
const i6 = cfgInputNames();
fillAll(i6, [[0,3,-3],[2,0,3],[-3,2,0]]);
i6.forEach((nm, k) => { cfgPick[nm] = ST(nm)[k % ST(nm).length]; });
cfgRun();
chk(!!cfgSaved, 'cfgRun 保存了研究模式快照', !!cfgSaved);
chk(i6.every(nm => { const st=((sel.desc[nm]||{}).states)||[]; return st.length === 0 || st[0] === cfgPick[nm]; }),
  '同步后 sel.desc 不塌成单档（states 保留/空=全档）', i6.map(nm=>JSON.stringify((sel.desc[nm]||{}).states)).join(' '));
openResearch();
// 走查/回跳后：研究模式的范围仍是全档，不能再被 cfgPick 合并塌成单档
chk(i6.every(nm => ((sel.desc[nm]||{}).states||[]).length !== 1), '回研究模式后范围不塌成单档', i6.map(nm=>JSON.stringify((sel.desc[nm]||{}).states)).join(' '));
openConfig();
chk(i6.every(nm => cfgPick[nm] === ST(nm)[k6Index(i6, nm)]), '切回配置 cfgPick 仍在', '');
// 往返后再点一次生成：枚举空间不能因为出入研究模式而塌成 1
cfgStep = 0; viewMode = 'config';
cfgRun();
chk(!!cimResult && cimResult.checked === 27, '往返后再生成 checked 仍===27，不塌成 1', cimResult ? cimResult.checked : 'null');
chk(!!cimResult && cimResult.space === 27, '往返后再生成 space 仍===27', cimResult ? cimResult.space : 'null');

function k6Index(list, nm){ return list.indexOf(nm); }

console.log();
console.log('=== 7. 无判断时 cfgGateHelpHTML 含一键去补，点击后 cur===4 ===');
resetCfg(P1); cim = {};
const i7 = cfgInputNames();
const g7 = cfgGate(i7);
chk(!g7.ok, '无判断时闸门拦', g7.why);
const h7 = cfgGateHelpHTML(g7);
chk(h7.indexOf('一键去补') >= 0, '闸门出口含「一键去补」按钮', '');
let clicked = true; try { cfgGotoFillMissing(g7); } catch(e) { clicked = false; console.log(e.message); }
chk(clicked, '一键去补不抛异常');
chk(cur === 4, '点击后 cur===4', cur);

console.log();
console.log('=== 8. 第一步只到 1 个输入变量时有标红提示 ===');
viewMode = 'config'; docPg = '';   /* 第 7 组已切到研究模式，这里先复位 */
cfgSel = {}; cfgSel['排放交易体系（ETS）'] = 1;
renderConfigPolicy();
const statTxt = document.getElementById('cfgPolicyStat').innerHTML;
chk(cfgInputNames().length < 2, '该政策只覆盖 1 个输入变量', cfgInputNames().length);
chk(statTxt.indexOf('至少') >= 0 || statTxt.indexOf('不足') >= 0, '第一步标红提示变量不足', '');

console.log();
console.log('=== 9. 配置结果页 4 个形态选项 + genMainLabel 随形态变 ===');
cfgStep = 2; viewMode = 'config'; docPg = '';
const expTxt = document.getElementById('cfgExport').innerHTML;
chk((expTxt.match(/data-gen=/g)||[]).length === 4, 'config 结果页恰有 4 个 data-gen 选项', (expTxt.match(/data-gen=/g)||[]).length);
genMode = 'table';
chk(genMainLabel().indexOf('结构化参数表') >= 0, '切换 genMode 后 genMainLabel 变', genMainLabel());
genMode = 'config';

console.log();
console.log('=== 10. 按政策库载入相关变量：按钮名 / 真正进参与集 / 不写档位 ===');
chk(html.indexOf('按政策库载入相关变量') >= 0, '按钮文案是「按政策库载入相关变量」', '');
chk(html.indexOf('按政策库预填来源') < 0, '旧文案「按政策库预填来源」无残留', '');
resetCfg(P1);
sel.desc = {};
const covSeen = {}, covNames = [];
PALLC().forEach(p => (p.m || []).forEach(x => { if (!covSeen[x[0]]) { covSeen[x[0]] = x; covNames.push(x[0]); } }));
const wantIn = covNames.filter(nm => { const d = dOf(nm); return d && d.t !== '结果型'; });
const wantOut = covNames.filter(nm => { const d = dOf(nm); return d && d.t === '结果型'; });
applyPolicy();
chk(wantIn.every(nm => !!sel.desc[nm]), '政策命中的非结果型变量全部进入参与集', wantIn.length + ' 个');
chk(wantOut.every(nm => !sel.desc[nm]), '结果型不进参与集', wantOut.length + ' 个');
chk(Object.keys(sel.desc).length === wantIn.length, '空起点载入后参与集恰好等于命中非结果型',
  Object.keys(sel.desc).length + ' vs ' + wantIn.length);
chk(wantIn.every(nm => ((sel.desc[nm] || {}).states || []).length === 0), '只写来源不写 states（不当档位）', '');
chk(wantIn.every(nm => (sel.desc[nm].src || '').indexOf('档位待确认') >= 0), '来源标「档位待确认」', '');
chk(wantIn.every(nm => (sel.desc[nm].src || '').indexOf('依据强度') >= 0), '来源带依据强度', '');
const keepNm = wantIn[0];
sel.desc[keepNm] = { states: [ST(keepNm)[0]], src: '手工' };
applyPolicy();
chk(sel.desc[keepNm].states.length === 1 && sel.desc[keepNm].states[0] === ST(keepNm)[0],
  '已经划过的范围不被载入覆盖', JSON.stringify(sel.desc[keepNm].states));

console.log();
console.log('=== 10b. 载入 15 个变量后，四种导出只覆盖本次参与集 ===');
resetCfg(P1);
sel.desc = {};
applyPolicy();
const i10b = cfgInputNames();
chk(Object.keys(sel.desc).length > i10b.length, '参与集里还留着没进本次检算的变量',
  Object.keys(sel.desc).length + ' vs ' + i10b.length);
fillAll(i10b, [[0,3,-3],[2,0,3],[-3,2,0]]);
/* 模拟「AI 预填过全部 15 个变量」：把参与集之外的对也填上，验导出是否仍只取本次 */
const all10 = Object.keys(sel.desc);
all10.forEach(a => all10.forEach(b => { if (a !== b && !cim[a+'>'+b]) cim[a+'>'+b] = {v:0, conf:'中', why:'', rev:false}; }));
i10b.forEach(nm => { cfgPick[nm] = ST(nm)[0]; });
cfgRun();
chk(!!cimResult, '导出前先有检算结果', cimResult ? 'ds=' + cimResult.ds.length : 'null');
const rows10 = expRows();
chk(rows10.length === i10b.length, '导出行数等于本次参与集', rows10.length + ' vs ' + i10b.length);
chk(rows10.every(r => !!r.state), '每行都有档位，不出现空档行', '');
chk(narrText().indexOf(i10b.length + '个描述符') >= 0, '叙事按参与集计数', '');
chk(narrText().indexOf('15个描述符') < 0, '叙事不再写 15 个描述符', '');
const bzRows = bayesCSV().split(String.fromCharCode(10)).filter(l => l && l[0] !== '#' && l.indexOf('pair,') !== 0);
chk(bzRows.length > 0 && bzRows.length <= i10b.length * (i10b.length - 1),
  '贝叶斯导出只含本次参与集的对', bzRows.length + ' 行 / 上限 ' + i10b.length * (i10b.length - 1));

console.log();
console.log('=== 11. 每个 .cfgrow 可见 pill ≤2，且不含常驻术语 ===');
resetCfg(P1);
const i11 = cfgInputNames();
i11.forEach(nm => { cfgPick[nm] = ST(nm)[0]; });
cfgStep = 1; viewMode = 'config'; docPg = '';
renderConfigSetting();
const rowTxt = document.getElementById('cfgSettingList').innerHTML;
const banned = ['按基准档','入边源变量','判定力','政策主张未指定'];
banned.forEach(w => chk(rowTxt.indexOf(w) < 0, '确认页可见处不含「'+w+'」', ''));
chk(rowTxt.indexOf('cfgwhy') < 0, 'cfgwhy 常驻说明已删', '');

console.log();
console.log('=== 12. 全自洽场景出结果 + 警示，不拦 ===');
resetCfg(P1);
const i12 = cfgInputNames();
fillAll(i12, [[0,0,0],[0,0,0],[0,0,0]]);
i12.forEach(nm => { cfgPick[nm] = ST(nm)[0]; });
cfgRun();
chk(!!cimResult, '全 0 判断场景照出结果，不拦', cimResult ? cimResult.count : 'null');
cfgStep = 2; renderConfigResult();
const sumTxt12 = document.getElementById('cfgResultSummary').innerHTML;
chk(sumTxt12.indexOf('筛') >= 0 || sumTxt12.indexOf('警示') >= 0 || sumTxt12.indexOf('不够') >= 0,
  '全自洽时结果页有警示文字', '');

console.log();
console.log('=== 13. 模式来回切保持位置 / 一键去补把参与变量带进研究模式 ===');
resetCfg(P1);
sel.desc = {};
cfgStep = 1; cur = 4;
openResearch();
chk(cur === 4, '切到研究模式保持原步骤（不回到第 1 步）', cur);
openConfig();
chk(cfgStep === 1, '切回配置保持原步骤（不回到第 1 步）', cfgStep);
cfgStep = 1;
const nBefore13 = nSel();
cfgGotoFillMissing();
chk(cur === 4, '去补后停在判断步（第 5 步）', cur);
chk(nSel() === cfgInputNames().length, '参与变量全部带进研究模式，不用重勾',
  nSel() + ' vs ' + cfgInputNames().length + '（原 ' + nBefore13 + '）');
chk(cfgInputNames().every(nm => !!sel.desc[nm]), '每个参与变量都在 sel.desc 里', '');
chk(cfgInputNames().every(nm => ((sel.desc[nm].states) || []).length === 0), '带进来的是全档，不预设档位', '');

console.log();
console.log(bad === 0 ? '全部通过' : bad + ' 项未通过');
if(bad) process.exit(1);
`;

eval(code + '\n' + test);
