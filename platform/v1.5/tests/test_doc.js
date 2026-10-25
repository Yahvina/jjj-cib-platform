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
const css = fs.readFileSync(pathMod.join(dir, 'src', 'styles.css'), 'utf8');
// 三个文档页共用一套 .docpg 版式，所以选择器是 .docpg 前缀而不是 #pdoc。
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

console.log('');
console.log(bad === 0 ? '全部通过（0 项未通过）' : '未通过 ' + bad + ' 项');
process.exit(bad === 0 ? 0 : 1);
