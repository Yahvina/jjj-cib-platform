/* 状态设置区把解释性文字收进悬停提示：验证「藏起来但没丢」，以及属性转义。
   纯结构 + 真函数两条腿：
     - 结构：index.html 里第 3 步不再有可见的解释段落，文字挪进 data-tip
     - 动态：真调 renderStates()，确认卡片里不再单列依据行／页脚小字，徽标成了锚点
     - 转义：RANGE_EVID 里带 ASCII 双引号的条目必须被转义，否则属性提前闭合
   调用：node test_tip.js v15/index.html（也可喂 app.js，两种入参都接得住） */
const fs = require('fs');
const pathMod = require('path');

let given = process.argv[2] || 'v15/index.html';
let htmlPath, dir;
if (/\.js$/.test(given)) {
  dir = pathMod.dirname(pathMod.dirname(given));      // v15/src/app.js -> v15
  htmlPath = pathMod.join(dir, 'index.html');
} else {
  htmlPath = given;
  dir = pathMod.dirname(given);                       // v15
}
const html = fs.readFileSync(htmlPath, 'utf8');
const app  = fs.readFileSync(pathMod.join(dir, 'src', 'app.js'), 'utf8');
const css  = fs.readFileSync(pathMod.join(dir, 'src', 'styles.css'), 'utf8');

const ok = (b) => (b ? '✓' : '✗');
let bad = 0;
const chk = (cond, label, extra) => {
  if (!cond) bad++;
  console.log('  ' + label + ':', ok(cond), extra === undefined ? '' : extra);
};

// 第 3 步的 pane（p2）
const p2 = html.slice(html.indexOf('id="p2"'), html.indexOf('</section>', html.indexOf('id="p2"')));

console.log('=== 1. 静态：解释段落已从版面上收走 ===');
chk(p2.indexOf('class="hintline"') < 0, '第 3 步不再有可见的解释段落（hintline）');
chk(p2.indexOf('<b>结果型由模型算出，不能勾选</b>') < 0, '「结果型不能勾选」不再占一行');
chk(p2.indexOf('（含取值区间，可编辑）') < 0, '「含取值区间，可编辑」不再直接显示');

console.log('=== 2. 藏起来但没丢：文字都在 data-tip 里 ===');
chk(/class="tip[^"]*"[^>]*data-tip="[^"]*含取值区间，可编辑/.test(p2), '状态设置的提示含「含取值区间，可编辑」');
// B 方案（勾选＝划定可信范围）后，旧承诺「只用于定点检验与取档导出、不缩小搜索范围」
// 已不成立——勾选现在真的缩小枚举范围。这里改为核对新口径，而不是继续钉旧句子。
chk(p2.indexOf('只在这个范围里找自洽情景') >= 0, '提示已改为新口径（只在这个范围里找自洽情景）');
chk(p2.indexOf('勾选不缩小搜索范围') < 0, '旧承诺「勾选不缩小搜索范围」已撤除');
chk(p2.indexOf('结果型由模型算出') >= 0, '原文保留（结果型由模型算出）');
// 文字必须落在 data-tip 属性内，而不是又变成可见正文
const vis = p2.replace(/<[^>]*>/g, ' ');
chk(vis.indexOf('只在这个范围里找自洽情景') < 0, '该文字不在可见正文里（只在属性内）');
chk(vis.indexOf('结果型由模型算出') < 0, '「结果型由模型算出」也不在可见正文里');

console.log('=== 3. 锚点本身可发现：光标 help，且不加下划线 ===');
chk(/span\.tip\.quiet:hover/.test(css), '悬停时锚点文字加深（可发现的线索）');
chk(/\.tip\.quiet\{border-bottom:none;cursor:help;\}/.test(css), 'quiet 态无虚线下划线');
chk(/\.hd \.evi\.tip\{border-bottom:none;\}/.test(css), '证据徽标自己当锚点时也不加下划线');

console.log('=== 4. 气泡不被卡片裁掉 ===');
chk(/main \.stbox\{[^}]*overflow:visible/.test(css), '状态卡在 main 内改为 overflow:visible');

console.log('=== 5. 真函数：卡片里不再单列依据行与页脚小字 ===');
function mkEl() {
  return {
    innerHTML: '', textContent: '', value: '', style: {}, dataset: {}, files: [], checked: false,
    classList: { add() {}, remove() {}, toggle() {} },
    querySelector: () => mkEl(), querySelectorAll: () => [],
    appendChild() {}, click() {}, remove() {}, parentElement: { children: [] },
    getBoundingClientRect: () => ({ top: 0, left: 0 }), addEventListener() {}
  };
}
const EL = {};
global.document = {
  getElementById: (id) => { if (!EL[id]) EL[id] = mkEl(); return EL[id]; },
  querySelector: () => mkEl(), querySelectorAll: () => [],
  createElement: () => mkEl(), body: mkEl(), addEventListener() {}
};
global.window = { scrollTo() {}, addEventListener() {}, localStorage: { getItem: () => null, setItem() {} },
  matchMedia: () => ({ matches: false }) };
global.localStorage = global.window.localStorage;
global.alert = () => {};
global.FileReader = function () {};
global.Blob = function () {};
global.URL = { createObjectURL: () => '', revokeObjectURL() {} };

const test = `
render=function(){}; toast=function(){};
/* 挑一个依据文字里带 ASCII 双引号的描述符——它就是转义的正例 */
const Q = allDescs().map(d=>d.n).filter(n=>/"/.test((RANGE_EVID[n]||{}).t||''));
sel.desc={};
Q.forEach(n=>{ sel.desc[n]={states:ST(n).slice(), src:''}; });
renderStates();
const h=document.getElementById('statePanel').innerHTML;
globalThis.__h=h; globalThis.__Q=Q;
`;
eval(app + '\n' + test);

const h = globalThis.__h, Q = globalThis.__Q;
chk(h.indexOf('class="evline"') < 0, '卡片里不再有依据行（evline）');
chk(h.indexOf('class="sthint"') < 0, '卡片里不再有页脚小字（sthint）');
chk(h.indexOf('class="stfoot"') >= 0, '页脚按钮行保留（＋ 自定义状态）');
chk(/class="evi tip wide /.test(h), '证据徽标成了悬停锚点');
chk(h.indexOf('data-tip=') >= 0, '徽标带 data-tip');
// 只查徽标本身：区间编辑目标上那个短 title 是正当的，不该被这条断言误伤
const badge = (h.match(/<i class="evi[^>]*>/) || [''])[0];
chk(badge.indexOf('title="') < 0, '徽标不再用 title 承载长依据（改 data-tip）', badge.slice(0, 60) + '…');

console.log('=== 6. 属性转义：带双引号的依据不会把属性提前闭合 ===');
chk(Q.length > 0, '找得到带双引号的依据条目', Q.join('、'));
if (Q.length) {
  // 坏掉的属性会在第一个裸引号处截断，取到的值就不含引号之后的文字
  const m = h.match(/<i class="evi[^>]*data-tip="([^"]*)"/);
  chk(!!m, '徽标的 data-tip 可以被完整解析出来');
  const val = m ? m[1] : '';
  chk(val.indexOf('&quot;') >= 0, '原文的双引号被转成 &quot;');
  chk(val.indexOf('「目标节奏」') >= 0,
    '引号之后的文字仍在属性值内（一次能源结构）', val.slice(0, 42) + '…');
  chk(/^.+\u3002$|^.+$/.test(val) && val.length > 20, '属性值未被截断', '长度 ' + val.length);
}

console.log('=== 7. 该显示给用户的警告仍然可见（没被一起藏掉） ===');
chk(typeof ancConflictHTML === 'function', '冲突提示函数还在');
// 藏起来的只有解释性文字；这些提示是用户必须当场看见的诊断，不能改悬停
chk(/class="pwarn"/.test(app), '冲突提示用可见的 pwarn 块，不是悬停');
chk(/class="stbad"/.test(app), '区间衔接／锚定无解的诊断也是可见块');
chk(/class="ancrow/.test(app), '已知值输入行仍直接可见');

console.log('');
console.log(bad === 0 ? '全部通过（0 项未通过）' : '未通过 ' + bad + ' 项');
process.exit(bad === 0 ? 0 : 1);
