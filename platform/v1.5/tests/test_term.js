// test_term.js —— 术语口径自检：判定自洽的那个量只能叫「影响平衡值」
//
// 为什么单独建这一套：2026-10-24 的「less is more」整改里，有一条是把同一个量的
// 两个名字（旧文案一处叫「主动和」，指向还相反）统一为「影响平衡值」，并把
// 「主动和／被动和」限定给主被动图的两根轴。这条会影响报告与 PPT 的措辞。
//
// 但 28 套测试里没有一套读过这个术语——用负控把 app.js 里 9 处「影响平衡值」
// 全改成「影响平衡值X」，整套测试仍然全绿。也就是说这条交付物此前完全没被保护，
// 谁把措辞改回去都不会有人知道。这一套补上。
//
// 跑法：node test_term.js v15/src/app.js   （index.html 从同目录推）
// 失败即 exit 1——不要把它写成只打印 ✓/✗ 就完事，那正是它要防的毛病。

const fs = require('fs');
const path = require('path');

const appPath = process.argv[2] || 'v15/src/app.js';
const htmlPath = path.join(path.dirname(appPath), '..', 'index.html');
const app = fs.readFileSync(appPath, 'utf8');
const html = fs.readFileSync(htmlPath, 'utf8');

const TERM = '\u5f71\u54cd\u5e73\u8861\u503c';   // 影响平衡值
const ACT = '\u4e3b\u52a8\u548c';                 // 主动和
const PAS = '\u88ab\u52a8\u548c';                 // 被动和
const NOTSAME = '\u4e0d\u662f\u540c\u4e00\u4e2a\u6570'; // 不是同一个数

let bad = 0;
function ck(label, cond, extra) {
  const mk = cond ? '\u2713' : '\u2717';
  if (!cond) bad++;
  console.log('  ' + mk + ' ' + label + (extra ? '   ' + extra : ''));
}

console.log('=== 1. 术语表给出「影响平衡值」的定义 ===');
// index.html 术语表那一行：影响平衡值 -> 某状态受到的其余状态影响之和，平台据此判定自洽
const glossary = html.split('\n').find(l => l.indexOf(TERM) >= 0 && l.indexOf('<td>') >= 0);
ck('术语表有力平衡值条目', !!glossary);
if (glossary) ck('且定义在状态级（受到的其余状态影响之和）',
  glossary.indexOf('\u53d7\u5230\u7684\u5176\u4f59\u72b6\u6001\u5f71\u54cd\u4e4b\u548c') >= 0, glossary.trim().slice(0, 70));

console.log();
console.log('=== 2. 算法说明里的判据句读得通 ===');
// 「…其余状态影响之和即其影响平衡值」这句话在页面上出现多次（第 3 步的
// 提示气泡、算法说明正文、术语表），措辞略有差异，所以不挑某一行，而是要求
// 至少有一处把「定义」和「判据」放在同一句里讲完。判据的措辞有两版：
// 第 3 步气泡作「无冲突」，算法说明正文作「不与其他判断矛盾」，两版都算数。
const defLines = html.split('\n').filter(l => l.indexOf(TERM) >= 0 && l.indexOf('\u5176\u4f59\u72b6\u6001\u5f71\u54cd\u4e4b\u548c') >= 0);
ck('存在「其余状态影响之和即其影响平衡值」的定义句', defLines.length > 0, defLines.length + ' 处');
ck('至少一处同句讲完判据（最大 + 无冲突/不矛盾）',
  defLines.some(l => /\u6700\u5927/.test(l) && (/\u65e0\u51b2\u7a81/.test(l) || /\u4e0d\u4e0e\u5176\u4ed6\u5224\u65ad\u77db\u76fe/.test(l))));

console.log();
console.log('=== 3. 主动和／被动和 与影响平衡值必须被显式分开 ===');
ck('写明两者不是同一个数', html.indexOf(NOTSAME) >= 0);
// 该澄清句必须把「状态级」这个限定说清楚，否则读者仍会以为是一回事
const disamb = html.split('\n').find(l => l.indexOf(NOTSAME) >= 0);
if (disamb) {
  ck('澄清句点出状态级', disamb.indexOf('\u72b6\u6001\u7ea7') >= 0, '\u72b6\u6001\u7ea7');
  ck('澄清句点出描述符级两个总量', disamb.indexOf('\u63cf\u8ff0\u7b26\u7ea7') >= 0, '\u63cf\u8ff0\u7b26\u7ea7');
}

console.log();
console.log('=== 4. 报告与界面里用的是统一后的名字 ===');
// 这里钉「完整句子」而不是只数次数：把术语改成「影响平衡值X」时，
// indexOf(影响平衡值) 仍然命中（子串），只数次数是抓不住的。所以对几处
// 关键出口各钉一句原文。
//
// 注意报告那段标题本身写作「影响平衡（描述符级）」——它把同一个来向影响
// 聚合到描述符层，靠括号里的限定语与状态级的「影响平衡值」区分。所以这里
// 只要求「标题含术语 + 带描述符级限定」，不要求它写成「影响平衡值」：
// 后者是另一种写法，不是缺陷，钉死反而会挡住正常的改写。
const h3Line = app.split('\n').find(l => l.indexOf('<h3>') >= 0 && l.indexOf('\u5f71\u54cd\u5e73\u8861') >= 0);
ck('报告里有「影响平衡」段落标题', !!h3Line, h3Line ? h3Line.trim().slice(0, 60) : '');
if (h3Line) ck('该标题带「描述符级」限定语（防与状态级混淆）',
  h3Line.indexOf('\u63cf\u8ff0\u7b26\u7ea7') >= 0);
const contracts = [
  ['术语表定义', '\u67d0\u72b6\u6001\u53d7\u5230\u7684\u5176\u4f59\u72b6\u6001\u5f71\u54cd\u4e4b\u548c\uff0c\u5e73\u53f0\u636e\u6b64\u5224\u5b9a\u81ea\u6d3d'],
  ['算法说明判据句', '\u5373\u5176<b>' + TERM + '</b>'],
  ['更新日志记录', '\u5224\u81ea\u6d3d\u7684\u91cf\u7edf\u4e00\u53eb\u300c' + TERM + '\u300d'],
];
const both = app + '\n' + html;
contracts.forEach(([label, s]) => {
  ck('原文句在位：' + label, both.indexOf(s) >= 0, s.slice(0, 46));
});
ck('app.js 里出现「影响平衡值」', app.indexOf(TERM) >= 0,
  '命中 ' + (app.split(TERM).length - 1) + ' 处');
const stale = TERM + 'X';   // 负控用的篡改形，防它被顺手提交
ck('没有被篡改的变体', app.indexOf(stale) < 0 && html.indexOf(stale) < 0);

console.log();
console.log('=== 5. 「主动和／被动和」只许出现在主被动图与更新日志里 ===');
// 旧毛病就是把判定用的量也写成主动和。所以这里把这两个词在 app.js 的每一处
// 出现都定位出来，要求它落在 renderAP 的函数体内或 CHANGELOG 数组内。
function span(src, startMarker, endMarker) {
  const s = src.indexOf(startMarker);
  if (s < 0) return null;
  const e = src.indexOf(endMarker, s + startMarker.length);
  return e < 0 ? [s, src.length] : [s, e];
}
const apSpan = span(app, 'function renderAP', '\nfunction ');
const chgSpan = span(app, 'const CHANGELOG', '\n];');
const allowed = [];
if (apSpan) allowed.push(apSpan);
if (chgSpan) allowed.push(chgSpan);

const lines = app.split('\n');
let outside = [];
lines.forEach((l, i) => {
  if (l.indexOf(ACT) < 0 && l.indexOf(PAS) < 0) return;
  // 行首偏移
  let off = 0;
  for (let k = 0; k < i; k++) off += lines[k].length + 1;
  const inAllowed = allowed.some(([s, e]) => off >= s && off <= e);
  if (!inAllowed) outside.push((i + 1) + ': ' + l.trim().slice(0, 70));
});
ck('renderAP 函数定位成功', !!apSpan);
ck('CHANGELOG 数组定位成功', !!chgSpan);
ck('两词未泄漏到图表与日志之外', outside.length === 0,
  outside.length ? '\n      ' + outside.join('\n      ') : '（0 处越界）');

console.log();
console.log('=== 6. 图表确实用这两个词标注两根轴 ===');
if (apSpan) {
  const ap = app.slice(apSpan[0], apSpan[1]);
  ck('renderAP 内同时出现主动和与被动和', ap.indexOf(ACT) >= 0 && ap.indexOf(PAS) >= 0);
} else {
  ck('renderAP 内同时出现主动和与被动和', false);
}

console.log();
if (bad) {
  console.log('\u5171 ' + bad + ' \u5904\u4e0d\u7b26\u5408\u3002');
  process.exit(1);
}
console.log('\u5168\u90e8\u7b26\u5408\u3002');
