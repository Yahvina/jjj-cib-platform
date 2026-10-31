// test_demo.js -- 预置情景（P0-1）：三条真实政策 + 6 对判定 + 三个定档，一次跑到结果页
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

const test = `
const html = global.__HTML__;
let bad = 0;
const chk = (c, label, extra) => { if(!c) bad++; console.log('  ' + label + ':', c ? '✓' : '✗', extra === undefined ? '' : extra); };
render = function(){}; toast = function(){};

console.log('=== 1. 预置常量：三条政策真实存在，6 对判断带梯度 ===');
chk(!!DEMO_SCENARIO && Array.isArray(DEMO_SCENARIO.pol), 'DEMO_SCENARIO 存在');
const missPol = DEMO_SCENARIO.pol.filter(nm => !PALLC().some(p => p.n === nm));
chk(missPol.length === 0, '三条政策都在政策库里', missPol.join('/') || '3/3');
const vs = Object.keys(DEMO_SCENARIO.v).map(k => DEMO_SCENARIO.v[k]);
chk(vs.length === 6, '恰好 6 对判断（3 变量两两）', vs.length + ' 对');
chk(vs.some(v => v > 0) && vs.some(v => v < 0), '判断有正有负（不是一边倒）', vs.join(','));
chk(Object.keys(DEMO_SCENARIO.pick).length === 3, '三个变量各定一档', Object.keys(DEMO_SCENARIO.pick).length + ' 个');

console.log();
console.log('=== 2. 载入后一步到结果：gate 放行 + 出结论 ===');
cfgSel = {}; cfgPick = {}; cfgTouched = {}; cfgSaved = null; cfgRunInfo = null; cfgGateInfo = null;
cim = {}; cfgStep = 0; viewMode = 'config'; docPg = ''; demoActive = false;
cfgLoadScenario();
const ins = cfgInputNames();
chk(ins.length >= 3, '参与变量 ≥ 3 个', ins.length + ' 个：' + ins.join('/'));
const g = cfgGate(ins);
chk(g.ok === true, '闸门放行（ok===true）', JSON.stringify({ok:g.ok, hard:!!g.hard}));
chk(!!cimResult, 'cimResult 非空');
chk(cfgStep === 2, '载入后落在第 3 步（结果页）', 'cfgStep=' + cfgStep);
chk(demoActive === true, '标记为预置数据');

console.log();
console.log('=== 3. 有筛选才叫有信息量：0 < count < checked ===');
chk(cimResult.count > 0, 'count > 0（有自洽情景）', cimResult.count);
chk(cimResult.count < cimResult.checked, 'count < checked（确实筛掉了组合）', cimResult.count + ' / ' + cimResult.checked);
chk(cimResult.checked === cimResult.space, '本次是穷举（checked === space）', cimResult.checked + ' / ' + cimResult.space);

console.log();
console.log('=== 4. 预置标记会随用户改动消失 ===');
cfgSetPick(ins[0], String(ST(ins[0]).indexOf(cfgPick[ins[0]])));
chk(demoActive === false, '改一个档位后预置标记被摘掉');
demoActive = true; cimSelKey = ins[0] + '>' + ins[1];
setV(1);
chk(demoActive === false, '改一格判断后预置标记被摘掉');

console.log();
console.log('=== 5. 命名：首页入口叫「载入一套预置情景」，不再用「30 秒的例子」 ===');
chk(html.indexOf('载入一套预置情景') >= 0, '首页入口文案');
chk(html.indexOf('30 秒') < 0 && html.indexOf('示范情景') < 0, '旧的潦草说法已清干净');
chk(html.indexOf('载入预置情景') >= 0, '第 1 步按钮文案');

console.log();
console.log('=== 6. 第 2 步给进度而不是「够/不够」 ===');
cfgSel = {}; cfgPick = {}; cfgTouched = {}; cfgSaved = null; cfgRunInfo = null; cfgGateInfo = null;
cim = {}; cfgStep = 1; viewMode = 'config'; docPg = ''; demoActive = false;
cfgLoadScenario();
cfgStep = 1; viewMode = 'config';
const ins2 = cfgInputNames();
cim = {};                                  /* 清空判断，制造「已判 0 / N 对」 */
renderConfigSetting();
const statHtml = document.getElementById('cfgSettingStat').innerHTML;
chk(statHtml.indexOf('判断进度') >= 0, '统计条有「判断进度」');
chk(statHtml.indexOf('已判 ') >= 0 && statHtml.indexOf(' / ') >= 0 && statHtml.indexOf('%') >= 0,
  '形如「已判 0 / 6 对（0%）」', (statHtml.split('判断进度')[1] || '').slice(0, 28));
chk(statHtml.indexOf('够用') < 0 && statHtml.indexOf('不够') < 0, '不再出现「够/不够」');
chk(statHtml.indexOf('可以先出一版草稿') >= 0, '带一句「可以先出一版草稿」');

console.log();
console.log('=== 7. 补判断闭环：带意图进去，填完自动回结果页重跑 ===');
cfgLoadScenario();
cim = {};                                   /* 零判断 → 闸门硬拦 */
cfgRun();
const gi = cfgGateInfo || cfgGate(cfgInputNames());
chk(!!gi && gi.hard === true, '零判断被硬拦', gi ? String(gi.hard) : 'null');
cfgGotoFillMissing(gi);
renderFill();                        /* render 在本测试里被打桩，提示条单独渲染一次 */
chk(afterFill === 'cfg', '记住返回意图 afterFill=cfg', String(afterFill));
chk(cur === 4, '落到第 5 步（打分步）', 'cur=' + cur);
const fbHtml = document.getElementById('fillBar').innerHTML;
chk(fbHtml.indexOf('还差') >= 0, '提示条显示还差几对', (fbHtml.split('</b>')[0] || '').slice(-24));
const pairs = cfgFillMissing.slice();
pairs.forEach((pr, i) => { cimSelKey = pr[0] + '>' + pr[1]; setV(i % 2 ? 1 : 2); });
chk(pairs.length > 0 && afterFill === '', '填完自动摘掉意图（触发返回）');
chk(cfgStep === 2 && viewMode === 'config', '回到结果页', 'cfgStep=' + cfgStep);
chk(!!cfgRunInfo, '自动重跑并写出 cfgRunInfo');

console.log();
console.log('=== 8. 导出物带 provenance：版本 / 已判 / 穷举或抽样 ===');
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
console.log('=== 9. 首页术语就地悬停 ===');
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
