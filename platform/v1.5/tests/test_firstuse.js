// test_firstuse.js -- 首次使用体验与结果可读性（v2.2.x）
// 覆盖：第 2 步进度口径、补判断闭环、导出 provenance、首页术语悬停、预置情景已撤
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
    getBoundingClientRect: () => ({ top: 0, left: 0 }), addEventListener() {}, setAttribute() {},
    insertAdjacentHTML() {}
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
global.__APP_SRC__ = code;

const test = `
const html = global.__HTML__;
const src = global.__APP_SRC__ || '';
let bad = 0;
const chk = (c, label, extra) => { if(!c) bad++; console.log('  ' + label + ':', c ? '✓' : '✗', extra === undefined ? '' : extra); };
render = function(){}; toast = function(){};

/* 三条真实京津冀政策命中 3 个变量，用来造一个「有政策、档也定了」的配置状态。 */
const POLS3 = ['排放交易体系（ETS）','可交易可再生能源证书/配额/RPS','建筑最低能源绩效标准（MEPS）'];
function seed3(){
  cfgClaim={}; cfgPick={}; cfgTouched={}; cfgSuggest={}; cfgDefault={};
  cfgSaved=null; cfgRunInfo=null; cfgGateInfo=null; cfgFillMissing=[]; afterFill='';
  cim={}; cfgSel={};
  POLS3.forEach(n=>{ cfgSel[n]=1; });
  cfgStep=1; viewMode='config'; docPg='';
  cfgGo(1);
  cfgInputNames().forEach(nm=>{ const st=ST(nm); if(st.length){ cfgPick[nm]=st[1]||st[0]; cfgTouched[nm]=1; } });
}

console.log('=== 1. 预置情景已撤：入口、常量、函数都不在了 ===');
chk(html.indexOf('cfgLoadScenario') < 0, '首页与第一步没有载入入口');
chk(html.indexOf('预置情景') < 0, '界面文案里没有「预置情景」');
chk(/function cfgLoadScenario\\s*\\(/.test(src) === false, '源码里没有 cfgLoadScenario');
chk(/function cfgCoverAll\\s*\\(/.test(src) === false, '第一步那个「一次选到能出结果的规模」出口已删');

console.log();
console.log('=== 2. 第 2 步给进度而不是「够/不够」 ===');
seed3();
cim = {};
renderConfigSetting();
const statHtml = document.getElementById('cfgSettingStat').innerHTML;
chk(statHtml.indexOf('判断进度') >= 0, '统计条有「判断进度」');
chk(statHtml.indexOf('已判 0 ') >= 0 && statHtml.indexOf(' / ') >= 0 && statHtml.indexOf('%') >= 0,
  '形如「已判 0 / 3 对（0%）」', (statHtml.split('判断进度')[1] || '').slice(0, 26));
chk(statHtml.indexOf('够用') < 0 && statHtml.indexOf('不够') < 0, '不再出现「够/不够」');
chk(statHtml.indexOf('可以先出一版草稿') >= 0, '带一句「可以先出一版草稿」');

console.log();
console.log('=== 3. 已判口径：无序对，一对两向都判过也只算一对 ===');
seed3();
const ins3 = cfgInputNames();
const part0 = cfgParticipation(ins3);
chk(part0.pairN === 3, '3 个变量＝3 对（无序）', 'pairN=' + part0.pairN);
ins3.forEach(a=>ins3.forEach(b=>{ if(a!==b) cim[a+'>'+b]={v:2,conf:'中',why:''}; }));
renderConfigSetting();
const stat2 = document.getElementById('cfgSettingStat').innerHTML;
chk(stat2.indexOf('已判 3 / 3 对') >= 0, '双向都判满也只显示 3 / 3，不是 6 / 3',
  (stat2.split('判断进度')[1] || '').slice(0, 26));
chk(stat2.indexOf('200%') < 0, '没有超过 100% 的进度');

console.log();
console.log('=== 4. 补判断闭环：带意图进去，填完自动回结果页重跑 ===');
seed3();
cim = {};
cfgRun();
const gi = cfgGateInfo || cfgGate(cfgInputNames());
chk(!!gi && gi.hard === true, '零判断被硬拦', gi ? String(gi.hard) : 'null');
cfgGotoFillMissing(gi);
chk(afterFill === 'cfg', '记住返回意图 afterFill=cfg', String(afterFill));
chk(cur === 4, '落到第 5 步（打分步）', 'cur=' + cur);
chk(html.indexOf('fillBar') < 0, '补判断提示条整块已删（容器都不在页面里）');
const pairs = cfgFillMissing.slice();
pairs.forEach((pr, i) => { cimSelKey = pr[0] + '>' + pr[1]; setV(i % 2 ? 1 : 2); });
chk(pairs.length > 0 && afterFill === '', '填完自动摘掉意图（触发返回）');
chk(cfgStep === 2 && viewMode === 'config', '回到结果页', 'cfgStep=' + cfgStep);
chk(!!cfgRunInfo, '自动重跑并写出 cfgRunInfo');

console.log();
console.log('=== 5. 导出物带 provenance：版本 / 已判 / 穷举或抽样 ===');
const tc = tableCSV();
chk(tc.indexOf(appVer()) >= 0, '含平台版本号', appVer());
chk(tc.indexOf('已判') >= 0, '含已判对数');
chk(tc.indexOf('穷举') >= 0 || tc.indexOf('抽样') >= 0, '写明穷举还是抽样');
chk(tc.indexOf('判断来源') >= 0 && tc.indexOf('取档方式') >= 0, '含判断来源与取档方式');
const nt = narrText();
chk(nt.indexOf('【来源】') >= 0 && nt.indexOf(appVer()) >= 0, '叙事文件也带来源块');
const bx = bayesCSV();
chk(bx.indexOf(appVer()) >= 0 && bx.indexOf('已判') >= 0, '贝叶斯表也带来源块');

console.log();
console.log('=== 6. 两模式对应：切过去落在对应的那一步，结果不丢 ===');
chk(CFG2RES.join(',') === '1,4,6' && RES2CFG.join(',') === '0,0,1,1,1,1,2', '映射表',
  CFG2RES.join(',') + ' / ' + RES2CFG.join(','));
seed3();
cur = 0; cfgStep = 1; viewMode = 'config';
openResearch();
chk(cur === 4, '配置第 2 步 → 研究第 5 步（打分）', 'cur=' + cur);
chk(viewMode === 'research', '已经切到研究模式');
/* 造一份配置模式的结果，再从结果页切过去 */
seed3();
cfgInputNames().forEach(a=>cfgInputNames().forEach(b=>{ if(a!==b) cim[a+'>'+b]={v:1,conf:'中',why:''}; }));
cfgRun();
chk(cfgStep === 2 && !!cimResult, '配置模式跑到结果页', 'count=' + (cimResult && cimResult.count));
openResearch();
chk(cur === 6, '配置结果页 → 研究第 7 步（检验与导出）', 'cur=' + cur);
chk(!!cimResult && cimResult.checked === 27, '结果带过去了（没有因为切模式被清空）',
  cimResult ? (cimResult.checked + ' 种') : 'null');
backToConfig();
chk(cfgStep === 2, '研究第 7 步 → 回配置结果页', 'cfgStep=' + cfgStep);
cur = 4; backToConfig();
chk(cfgStep === 1, '研究第 5 步 → 回「确认设定」', 'cfgStep=' + cfgStep);
/* 描述符集合变了，旧结果必须作废 */
cfgSaved = {'随便一个不在结果里的变量': {states: []}};
cimResult = {ds: ['碳价水平与碳市场覆盖'], checked: 1, space: 1, count: 1, consistent: []};
restoreCfgSel();
chk(!cimResult, '参与变量变了就作废旧结果（不拿旧结果充数）');

console.log();
console.log('=== 7. 首页术语就地悬停 ===');
const leadAt = html.indexOf('<p class="lead">');
chk(leadAt >= 0 && html.slice(leadAt, leadAt + 500).indexOf('data-tip') >= 0, '.lead 里有 data-tip 锚点');
chk(html.indexOf('自洽＝在全部两两判定下') >= 0, '「自洽」有就地解释');
chk(html.indexOf('互不冲突＝自洽') >= 0, '入口卡里「互不冲突」有就地解释');
`;
try {
  new Function('global', code + '\n' + test)(global);
} catch (e) {
  console.log('崩溃检测：' + (e && e.message));
  process.exit(1);
}
