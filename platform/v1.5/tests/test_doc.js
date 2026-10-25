/* 使用说明页（pdoc）结构测试：分区导航、八节、更新日志从模态改为页面内一节。
   纯结构校验（读 index.html + app.js），不渲染 DOM。
   调用：node test_doc.js v15/index.html
   容错：批量脚本按 test_* 约定喂的是 app.js，这里两种入参都接得住。 */
const fs = require('fs');
const pathMod = require('path');
let given = process.argv[2] || 'v15/index.html';
let htmlPath, dir;
if (/\.js$/.test(given)) {
  const appDir = pathMod.dirname(given);            // v15/src
  dir = pathMod.dirname(appDir);                    // v15
  htmlPath = pathMod.join(dir, 'index.html');
} else {
  htmlPath = given;
  dir = pathMod.dirname(given);                     // v15
}
const html = fs.readFileSync(htmlPath, 'utf8');
const app = fs.readFileSync(pathMod.join(dir, 'src', 'app.js'), 'utf8');
const css = fs.readFileSync(pathMod.join(dir, 'src', 'styles.css'), 'utf8');

const ok = (b) => (b ? '✓' : '✗');
let bad = 0;
const chk = (cond, label, extra) => {
  if (!cond) bad++;
  console.log('  ' + label + ':', ok(cond), extra === undefined ? '' : extra);
};

const doc = html.slice(html.indexOf('id="pdoc"'), html.indexOf('</section>', html.indexOf('id="pdoc"')));

console.log('=== 1. 侧栏分区导航 ===');
const nav = doc.slice(doc.indexOf('class="doc-nav"'), doc.indexOf('</nav>'));
const navGroups = [...nav.matchAll(/class="dn-g">([^<]+)</g)].map(m => m[1]);
chk(navGroups.length === 5, '侧栏五个分区标题', navGroups.join(' / '));
chk(JSON.stringify(navGroups) === JSON.stringify(['简介', '使用手册', '算法说明', '案例', '参考']),
  '分区名称与顺序固定');

const navLinks = [...nav.matchAll(/href="#(d\d+)"/g)].map(m => m[1]);
chk(navLinks.length === 7, '侧栏七个锚点', navLinks.join(','));
chk(JSON.stringify(navLinks) === JSON.stringify(['d1','d2','d3','d4','d5','d6','d7']),
  '锚点顺序为 d1…d7');

console.log('=== 2. 正文七节与分区标签 ===');
const heads = [...doc.matchAll(/<h2 id="(d\d)">([^<]+)</g)].map(m => ({ id: m[1], t: m[2].trim() }));
chk(heads.length === 7, '正文七个 h2', heads.map(h => h.id).join(','));
chk(JSON.stringify(heads.map(h => h.id)) === JSON.stringify(navLinks), '正文节次与侧栏锚点一一对应');
const bodyGroups = [...doc.matchAll(/class="dgrp"[^>]*>([^<]+)</g)].map(m => m[1]);
chk(JSON.stringify(bodyGroups) === JSON.stringify(navGroups), '正文分区标签与侧栏一致');

console.log('=== 3. 算法说明区切分依据 ===');
chk(doc.indexOf('class="dnote"') >= 0, '算法说明区有切分说明');
chk(/一个方法块 = 一段能独立讲清、也能独立验证的计算/.test(doc), '写明了切分依据');
const dnoteAt = doc.indexOf('class="dnote"');
const d3At = doc.indexOf('<h2 id="d3">');
const d2At = doc.indexOf('<h2 id="d2">');
chk(dnoteAt > d2At && dnoteAt < d3At, '切分说明位于「七步流程」与「判定与算法」之间');
chk(doc.indexOf('方法学') < 0, '不再自称「方法学」（名不副实：页内只讲平台怎么算）');
chk(/这里说明的是[\s\S]{0,20}平台怎么算/.test(doc), '写明本区只讲平台怎么算');
chk(/同行评议文献或真实历史数据/.test(doc), '写明依据来源要求（文献／历史数据，不以政策文本为据）');
chk(/待其定稿后另立一节/.test(doc), '写明评分规则定稿后另立一节');

console.log('=== 4. 未实现的概念已删除 ===');
['share-weight', 'income-elasticity', '输入参数名', '报告变量名'].forEach(s => {
  chk(doc.indexOf(s) < 0, '说明页不再出现「' + s + '」');
});
chk(doc.indexOf('模型变量名') >= 0, '改为平台实际记录的「模型变量名」');

console.log('=== 5. 日志已从使用说明页拆出，各开一页 ===');
chk(html.indexOf('id="chgModal"') < 0, '模态 chgModal 已移除');
chk(doc.indexOf('id="d8"') < 0, '使用说明页不再有第八节（日志已迁出）');
chk(doc.indexOf('id="chgBody"') < 0, 'chgBody 不再挂在使用说明页');
chk(html.indexOf('id="pdis"') >= 0, '讨论日志页存在');
chk(html.indexOf('id="pver"') >= 0, '版本更新日志页存在');
chk(html.indexOf('id="disBody"') >= 0 && html.indexOf('id="verBody"') >= 0, '两页各有正文容器');
chk(html.indexOf('id="disNav"') >= 0 && html.indexOf('id="verNav"') >= 0, '两页各有侧栏容器');
// 三页共用一套版式（.docpg 前缀的网格与侧栏）。这层关系靠页面自己挂 class 名建立：
// 只断言样式里有 .docpg 选择器是不够的——选择器在而页面没挂类，版式就是死代码，
// 侧栏会塌成一行行链接。2026-10-25 修过一次这个错，这里把两半都钉住。
['pdoc', 'pdis', 'pver'].forEach(pg => {
  chk(new RegExp('class="pane docpg" id="' + pg + '"').test(html),
    pg + ' 页挂上了 docpg 类（版式才生效）');
});
chk(/\.docpg \.doc-cols\{display:grid;grid-template-columns:186px/.test(css),
  '侧栏是两栏网格（不是塌掉的一行行）');
chk(app.indexOf('function closeChangelog') < 0, 'closeChangelog 已删除');
chk(/function openChangelog\(\)/.test(app), 'openChangelog 保留');
chk(/function openDiscuss\(\)/.test(app), 'openDiscuss 存在');
chk(/openPage\('ver'\)/.test(app) && /openPage\('dis'\)/.test(app), '两个入口各自落到自己那页');
chk(/openPage\('doc'\)/.test(app), 'openDoc 落到使用说明页');
chk(/function renderDiscuss\(\)/.test(app), '讨论日志渲染函数存在');
chk(/function renderVersions\(\)/.test(app), '版本日志渲染函数存在');
chk(/const DOCPG_ID=\{doc:'pdoc',dis:'pdis',ver:'pver'\}/.test(app), '三个页面 id 集中一处映射');
chk(html.indexOf('onclick="openChangelog()"') >= 0, '顶栏「更新日志」图标指向 openChangelog');
chk(/onclick="closeMenu\(\);openDiscuss\(\)"/.test(html), '「讨论日志」有入口（更多菜单）');
chk(/onclick="closeMenu\(\);openChangelog\(\)"/.test(html), '「版本更新日志」有入口（更多菜单）');
chk(/renderChangelog\(\)/.test(app), 'render 中刷新两页内容');

console.log('=== 6. 影响面标记 ===');
chk(/e\.im\s*\?/.test(app), '渲染时按 im 标记取文案');
const ent = [...app.matchAll(/\{d:'(\d{4}-\d{2}-\d{2})',k:'([^']+)',x:'/g)];
chk(ent.length >= 28, '日志条目不少于 28 条', ent.length + ' 条');
const imCount = [...app.matchAll(/,im:1\}/g)].length;
chk(imCount >= 7, '至少 7 条标为「影响结果」', imCount + ' 条');
chk(app.indexOf("'影响面：影响结果——改动了判定输入，已有情景需重新检验'") >= 0, '影响结果文案存在');
chk(app.indexOf("'影响面：不动结果——重跑一遍结论一样'") >= 0, '不动结果文案存在');

console.log('=== 7. 样式与旧样式残留 ===');
// 三个文档页共用一套 .docpg 版式，所以选择器是 .docpg 前缀而不是 #pdoc。
// css 已在文件开头读入。
chk(/\.docpg \.doc-nav \.dn-g\{/.test(css), '侧栏分区标题样式存在');
chk(/\.docpg \.doc-body \.dgrp\{/.test(css), '正文分区标签样式存在');
chk(/\.chgb \.chgi\{/.test(css), '影响面样式存在');
chk(/\.chgb \.chgi\.h\{/.test(css), '影响面「影响结果」有区分样式');
chk(/\.docpg \.doc-nav \.dn-g\{display:none;\}/.test(css), '窄屏隐藏侧栏分区标题');
chk(css.indexOf('.chgintro') < 0, '旧模态引导文案样式已清理');

console.log('=== 8. 侧栏「当前读到哪一节」高亮 ===');
chk(html.indexOf('id="docNav"') >= 0, '侧栏挂了 id="docNav"（脚本要能拿到它）');
chk(/\.docpg \.doc-nav a\.on\{/.test(css), '高亮态样式存在');
chk(/\.docpg \.doc-nav a\.on::before\{/.test(css), '高亮不只靠变色：另有竖线标记');
chk(/function docSpy\(/.test(app), 'docSpy 函数存在');
chk(/const DOC_LINE=96;/.test(app), '判定线是常量');
chk(app.indexOf('new IntersectionObserver') < 0, '不用 IntersectionObserver（rootMargin 百分比在矮视口算成负带、像素版在无头下投递不稳）');
chk(/addEventListener\('scroll',docSpyPaint,\{passive:true\}\)/.test(app), '滚动监听带 passive');
chk(/if\(hit===docSpyCur\) return;/.test(app), '没跨节就不动 DOM（滚动里不重排）');
chk(/a\.classList\.toggle\('on',/.test(app), '只切 class，不重建节点');
chk(app.indexOf('requestAnimationFrame') < 0 || /docSpyRaf/.test(app) === false, '滚动路径不依赖 rAF（无头下 rAF 只触发一次，验不了）');
// 三页共用高亮：不再有「仅文档页」的布尔开关，改成判当前开的是哪一页。
chk(/if\(docPg!=='doc'\)\{ docSpyOff\(\); return; \}/.test(app), '不在使用说明页就断监听');
chk(/function docSpyOff\(\)/.test(app) && /removeEventListener\('scroll',docSpyPaint\)/.test(app), '断开时真的移除监听');
chk(/window\.addEventListener\('resize',\(\)=>\{ if\(docPg\) docSpy\(\); \}\)/.test(app), '视口变化时重算各节位置');
chk(/docSpy\(\);\s*$/m.test(app), 'render 末尾调用 docSpy');

console.log('=== 9. 界面删掉的解释性话语已在使用说明页安家 ===');
// 用户 m07935：界面上收进悬停/删掉的那些解释，必须在使用说明页里找得到——
// 否则「界面清爽」就变成「说明凭空消失」。这一组按主题断言，防回归。
const RESTORED = [
  ['可信范围本就不止一档', '第 3 步：勾选＝可信范围（可多档）'],
  ['一个都不勾＝不设限', '第 3 步：不设限的含义'],
  ['双人', '第 4 步：多人矩阵'],
  ['分人复核', '第 4 步：各填一版再复核'],
  ['上行是影响分', '第 5 步：格内怎么读'],
  ['浅黄描边', '第 5 步：低置信描边'],
  ['置信度只表示对这条判断有多大把握', '第 5 步：置信度与分数无关'],
  ['状态级逐对精判', '第 5 步：整体倾向 vs 逐对精判'],
  ['同一行里颜色相同的整块', '第 7 步：情景表同色格子'],
  ['链的强度取最弱环节', '算法说明：传导链强度取最弱环节'],
  ['may lead to artificial results', '算法说明：情景数少的告警'],
  ['Influence profile', '算法说明：影响谱的德国对应物'],
  ['给结论上保险', '算法说明：稳健性在做什么'],
  ['浅色行', '算法说明：稳健性里浅色行的含义'],
  ['一个已知值都不填时', '跨层与锚定：不填已知值时的组合空间'],
  ['整体倾向', '第 5 步：精判表里「默(x)」的展开依据'],
];
RESTORED.forEach(([needle, label]) => {
  chk(doc.indexOf(needle) >= 0, '手册载有：' + label);
});
// 三条被收进悬停的说明，正文（界面）里可以没有，但手册必须有对应主题节。
['影响路径与传导链', '相关性分析', '影响谱'].forEach(t => {
  chk(doc.indexOf('<h3>' + t + '</h3>') >= 0, '算法说明新增一节：' + t);
});

console.log('=== 10. 自陈性栏目已移除且不许回来 ===');
// 用户 m08696：平台要开源对外，证据缺口/存疑这两类「自曝其短」的栏目不做记录。
// 断言范围要挑准，否则会误报：
//   · 数据源（DISCUSS_GAPS / VER_GAPS / DISCUSS_WHO）在 app.js 里查全文——
//     删掉就该一处不剩。
//   · 渲染文案只在 renderDiscuss / renderVersions 两个函数体里查——
//     CHANGELOG 讲这一批改了什么，「证据缺口」这四个字出现在那里是对的，
//     查全文会把「如实记录自己删过什么」判成违规。
function body(fnName) {
  const s = app.indexOf('function ' + fnName + '(');
  if (s < 0) return '';
  const e = app.indexOf('\nfunction ', s + 1);
  return app.slice(s, e < 0 ? app.length : e);
}
const disFn = body('renderDiscuss'), verFn = body('renderVersions');
[
  ['DISCUSS_GAPS', '存疑与缺口的数据'],
  ['VER_GAPS', '证据缺口的数据'],
  ['DISCUSS_WHO', '发言人对照说明'],
].forEach(([tok, label]) => {
  chk(app.indexOf(tok) < 0, label + '（' + tok + '）已从 app.js 删除');
});
chk(disFn.indexOf('存疑与缺口') < 0 && disFn.indexOf('DISCUSS_GAPS') < 0, '讨论页不再渲染「存疑与缺口」');
chk(verFn.indexOf('证据缺口') < 0 && verFn.indexOf('VER_GAPS') < 0, '版本页不再渲染「证据缺口」');
chk(disFn.indexOf('if(it.src)') < 0, '讨论页不再渲染逐条「依据」行');
chk(disFn.indexOf('依据说明') < 0, '讨论页不再渲染「依据说明」小字');
chk(html.indexOf('doc-back') < 0, '三页的「返回概览」链接已删除');
chk(html.indexOf('按面谈顺序') < 0, '讨论页「按面谈顺序…」说明段已删除');
chk(app.indexOf("h:'存疑'") < 0, '讨论日志各场不再有「存疑」小节');
const disSpanA = app.slice(app.indexOf('const DISCUSS=['),
  app.indexOf('\n];', app.indexOf('const DISCUSS=[')));
// 日期只在讨论日志数据里查。VERSIONS 里会如实写「原讨论日志里 2026-10-26 那场是排期、
// 已整场删除」——那是版本记录，留着是对的。（同一条纪律：消失类断言不查散文。）
chk(disSpanA.indexOf('2026-10-26') < 0, '尚未发生的 10-26 场次已删除');
chk(disSpanA.indexOf(',src:') < 0, '讨论日志各场不再有「依据」字段');
chk((disSpanA.match(/,t:'面谈'/g) || []).length === 5, '五场面谈标题统一为「面谈」',
  (disSpanA.match(/,t:'[^']*'/g) || []).join(' '));
// 逐条变更记录是版本页最要紧的一段（「这次改动要不要重跑情景」的依据），
// 读法收进悬停可以，整段丢掉不行。
chk(verFn.indexOf('逐条变更记录') >= 0, '逐条变更记录仍在版本页（只是读法收进悬停）');
chk(verFn.indexOf('chgrow') >= 0 && verFn.indexOf('影响面') >= 0, '逐条变更记录仍带「影响面」标记');
chk(/<h2 id="vlog"><span class="tip wide"/.test(app), '「逐条变更记录」的读法挂在悬停上');

console.log('=== 11. 版本号只有一个来源，且按时间排列 ===');
// 用户 m09855：点「关于」显示的还是 v1.4。根因是关于框里把版本号写死成字符串，
// 从 v1.4 起没人再改过——加版本条目不会带着它一起走。
// 判据不是「不许出现 v1.4 这四个字」（版本日志里如实记录 v1.4 是对的），
// 而是「关于框必须走 appVer()，不许内联版本字面量」。
function fnBody(name) {
  const s = app.indexOf('function ' + name + '(');
  if (s < 0) return '';
  const e = app.indexOf('\nfunction ', s + 1);
  return app.slice(s, e < 0 ? app.length : e);
}
const aboutFn = fnBody('aboutApp');
chk(aboutFn.length > 0, 'aboutApp 函数体定位成功');
chk(/function appVer\(\)/.test(app), '版本号取值函数 appVer() 存在');
chk(/VERSIONS\[VERSIONS\.length-1\]/.test(app), 'appVer() 从版本数组末条取号（单一来源）');
chk(aboutFn.indexOf("appVer()") >= 0, '关于框的版本号取自 appVer()');
chk(!/·\s*v1\.\d/.test(aboutFn), '关于框里不再内联版本字面量',
  (aboutFn.match(/·\s*v1\.\d[\w.]*/g) || []).join(' '));
// 版本数组必须按时间从旧到新。renderVersions 是按数组顺序渲染、不做排序的，
// 数组排错，页面上就直接错——v1.5.6 曾经排在 v1.5.5 前面。
const verSpan2 = app.slice(app.indexOf('const VERSIONS=['),
  app.indexOf('\n];', app.indexOf('const VERSIONS=[')));
const vseq = [...verSpan2.matchAll(/\{v:'(v[\d.]+)',d:'(\d{4}-\d{2}-\d{2})'/g)].map(m => ({ v: m[1], d: m[2] }));
chk(vseq.length >= 8, '版本数组条目解析成功', vseq.length + ' 条');
const sorted = vseq.every((x, i) => i === 0 || vseq[i - 1].d <= x.d);
chk(sorted, '版本数组按日期从旧到新排列',
  vseq.filter((x, i) => i > 0 && vseq[i - 1].d > x.d).map(x => vseq[vseq.indexOf(x) - 1].v + '>' + x.v).join(' '));
// 只查日期是不够的：同一天会发好几个小版本（v1.5.5 / v1.5.6 / v1.5.7 都是 10-25），
// 本次要修的那个错正是同一天内的乱序——v1.5.6 排在 v1.5.5 前面，日期检查完全看不出来。
// 所以同日组内还要按版本号大小比一遍。
const vnum = (s) => s.replace(/^v/, '').split('.').map(Number);
const cmpVer = (a, b) => {
  const p = vnum(a), q = vnum(b);
  for (let k = 0; k < Math.max(p.length, q.length); k++) {
    if ((p[k] || 0) !== (q[k] || 0)) return (p[k] || 0) - (q[k] || 0);
  }
  return 0;
};
const sameDayBad = vseq.filter((x, i) =>
  i > 0 && vseq[i - 1].d === x.d && cmpVer(vseq[i - 1].v, x.v) > 0);
chk(sameDayBad.length === 0, '同一天内的小版本按版本号从旧到新排列',
  sameDayBad.map(x => vseq[vseq.indexOf(x) - 1].v + '>' + x.v).join(' '));
chk(vseq[vseq.length - 1].v === 'v1.5.8', '末条即当前版本', vseq[vseq.length - 1].v);

console.log('');
console.log(bad === 0 ? '全部通过（0 项未通过）' : '未通过 ' + bad + ' 项');
process.exit(bad === 0 ? 0 : 1);
