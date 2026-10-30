/* 第 7 步分组菜单结构测试：确认 10 个明面块全部归类、组内不重不漏、导航与分组一致，
   外加默认收起的「分析工具箱」。这是纯结构校验（读 index.html），不做 DOM 渲染。
   2026-10-24 决策三：17 块 → 10 块 + 工具箱 3 块；四个 tab → 三个。 */
const fs = require('fs');
const path = process.argv[2] || 'v11/index.html';
const html = fs.readFileSync(path, 'utf8');
const app = fs.readFileSync(require('path').join(require('path').dirname(path), 'src/app.js'), 'utf8');

const ok = (b) => (b ? '✓' : '✗');
let bad = 0;
const chk = (cond, label, extra) => {
  if (!cond) bad++;
  console.log('  ' + label + ':', ok(cond), extra === undefined ? '' : extra);
};

// 标题里可能嵌动态标记（「生成结果与导出 <span class="tag" id="fmtTag">XML</span>」，
// 那个 XML 是随形态变的）。整块去掉这类 span，再剥剩下的标签，否则标题文本会
// 随当前形态漂移，断言值也跟着漂。
const clean = (s) => s.replace(/<span[^>]*class="tag"[^>]*>[\s\S]*?<\/span>/g, '').replace(/<[^>]*>/g, '').trim();
const sec = html.slice(html.indexOf('<section class="pane" id="p6">'), html.indexOf('</section>', html.indexOf('<section class="pane" id="p6">')));
const cards = [...sec.matchAll(/<div class="card" data-grp="([a-z]+)">\s*<h3>(.*?)<\/h3>/g)]
  .map(m => ({ g: m[1], t: clean(m[2]) }));

console.log('=== 1. 卡片数量与归类 ===');
chk(cards.length === 9, '9 个明面块全部带分组（矛盾组合移进抽屉）', cards.length + ' 块');

const names = cards.map(c => c.t);
chk(new Set(names).size === names.length, '无重复卡片', names.length + ' 个标题');

// 收敛后的三组：结论（结果是什么）/ 可靠性（信不信）/ 交付（怎么拿走）
const want = {
  concl: ['检验结果', '情景地图'],
  rel: ['稳健性检验', '集成与分歧', '相关性分析', '影响谱'],
  out: ['生成结果与导出', '情景报告', '本次配置摘要'],
};

console.log('=== 2. 三组内容与顺序 ===');
Object.keys(want).forEach(g => {
  const got = cards.filter(c => c.g === g).map(c => c.t);
  const same = got.length === want[g].length && got.every((x, i) => x === want[g][i]);
  chk(same, g + ' 组 ' + want[g].length + ' 块', same ? '' : '实际 ' + JSON.stringify(got));
});

console.log('=== 3. 页面顺序按组连续 ===');
const seq = cards.map(c => c.g);
const runs = seq.filter((g, i) => i === 0 || g !== seq[i - 1]);
chk(runs.length === 3 && new Set(runs).size === 3, '三组各自连续、不交错', runs.join(' → '));

console.log('=== 4. 导航条 ===');
const tabs = [...sec.matchAll(/class="p6tab[^"]*" data-g="([a-z]+)"/g)].map(m => m[1]);
chk(tabs.length === 3, '三个标签', tabs.join(','));
chk(tabs.every(g => want[g]), '标签组名与卡片组名对应');
chk(/class="p6tab sel" data-g="concl"/.test(sec), '默认选中「结论」');
// 徽章数字必须等于该组块数：写错了读者会以为有块没显示
const badge = {};
[...sec.matchAll(/class="p6tab[^"]*" data-g="([a-z]+)"[^>]*>[^<]+<span>(\d+)<\/span>/g)]
  .forEach(m => { badge[m[1]] = +m[2]; });
Object.keys(want).forEach(g => chk(badge[g] === want[g].length,
  g + ' 徽章 = ' + want[g].length, '实际 ' + badge[g]));
chk(sec.indexOf('p6allBtn') >= 0 && sec.indexOf('全部展开') >= 0, '有「全部展开」按钮');
chk(sec.indexOf('id="p6stat"') >= 0, '有检验状态提示位');

console.log('=== 5. 分析工具箱（默认收起）===');
chk(/<details class="card toolbox" id="toolBox">/.test(sec), '工具箱是 details 且默认收起（无 open）');
chk(sec.indexOf('id="toolBox"') >= 0 && sec.indexOf('分析工具箱') >= 0, '工具箱标题在位');
const tb = sec.slice(sec.indexOf('id="toolBox"'));
const tbCards = [...tb.matchAll(/<div class="card">\s*<h3>(.*?)<\/h3>/g)].map(m => m[1].trim());
chk(tbCards.length === 3, '工具箱内 3 块', tbCards.join(' / '));
['影响关系图', '影响路径分析', '情景表'].forEach(n =>
  chk(tbCards.indexOf(n) >= 0, '工具箱含「' + n + '」'));
// 工具箱里的块不能同时带 data-grp，否则会被分组开关的二选一逻辑藏掉
chk(!/class="card" data-grp/.test(tb), '工具箱内卡片不带 data-grp（不受分组开关管辖）');

console.log('=== 6. 已收敛掉的东西不该回来 ===');
// 逐层求解：常驻卡片撤掉，能力下沉进「检验结果」卡里一个默认收起的折叠段。
// 判据是「不再占一块 + 折叠默认收起 + 出口还在」，而不是「标识符消失」——
// 它现在是检验结果卡内部的一段，标识符本来就该在。
chk(!/data-grp="[a-z]+">\s*<h3>逐层求解<\/h3>/.test(sec), '逐层求解不再是独立卡片');
chk(/<details class="fold" id="layFold">/.test(sec), '逐层求解下沉为折叠段');
chk(!/<details class="fold" id="layFold" open>/.test(sec), '折叠段默认收起');
chk(sec.indexOf('id="layBox"') >= 0, '下沉后仍有渲染出口 layBox');
chk(app.indexOf('function renderLay') >= 0, '逐层求解的渲染函数仍在');
chk(app.indexOf('function runLayered') >= 0, '逐层求解的驱动器仍在（功能未删）');
// 事后检查器与界面筛档两套机制都已删除，这几个函数必须消失
chk(app.indexOf('function layConflicts') < 0, '事后检查器 layConflicts 已删');
chk(app.indexOf('function layDirectionHTML') < 0, '事后检查器 layDirectionHTML 已删');
// v1.5.7：第 3 步的界面筛档整块撤掉（它只改界面可选性、不进检算与导出）。
// 断言这些不回来；跨层数值约束由 allowUnder 承担，下面单独钉住。
['function xlReason', 'function xlPickHTML', 'function xlSet', 'function xlPickOf'].forEach(fn=>{
  chk(app.indexOf(fn) < 0, '界面筛档已撤：' + fn);
});
chk(app.indexOf('xlPickHTML(nm)') < 0, '状态卡里不再调用界面筛档');
chk(app.indexOf('function allowUnder') >= 0, '跨层数值约束（allowUnder）仍在');
// 主被动图：与影响关系图重复，删 UI 留引擎
chk(sec.indexOf('id="apFig"') < 0, '主被动图卡片已删');
chk(app.indexOf('function renderAP') >= 0, '主被动图引擎仍在（删 UI 不删引擎）');
// 情景筛选与时间轴并入别的块，不再是独立卡片
chk(sec.indexOf('id="p6Drawer"') >= 0, '情景筛选收进 #p6Drawer（静态页只有容器，内容由 renderP6Drawer 按模式渲染）');
chk(sec.indexOf("openP6Drawer('filter')") >= 0 && app.indexOf('function renderFilt') >= 0, '筛选引擎与入口仍在');
chk(!/data-grp="concl">\s*<h3>情景筛选/.test(sec), '情景筛选不再是独立卡片');
chk(sec.indexOf('id="timeline"') >= 0, '时间轴并入了本次配置摘要');
chk(!/<h3>时间轴<\/h3>/.test(sec), '时间轴不再是独立卡片');
// 结构组已整组撤销
chk(sec.indexOf('data-g="struct"') < 0, '「结构」组已撤销（不再是四个 tab）');
chk(app.indexOf("struct:'结构'") < 0, 'P6GNAME 里不再有 struct');

console.log('=== 7. 交互逻辑 ===');
['function p6Apply', 'function p6Group', 'function p6All', 'function p6Status'].forEach(f => {
  chk(app.indexOf(f) >= 0, f + ' 存在');
});
chk(/p6Apply\(\); p6Status\(\);/.test(app), 'render 中调用分组与状态刷新');
chk(app.indexOf("sec.setAttribute('data-g'") >= 0, '分组写入 data-g');

console.log('=== 8. 关键元素未被属性破坏 ===');
['outPreview', 'fmtNote', 'finalSum', 'checkResult'].forEach(id => {
  chk(html.indexOf('id="' + id + '"') >= 0, id + ' 存在');
});
chk(app.indexOf('id="confList"') >= 0, 'confList 由矛盾抽屉按需渲染');
const brokenQuote = /data-grp="[a-z]+>/.test(html);
chk(!brokenQuote, 'data-grp 属性引号完整');

console.log('');
console.log(bad === 0 ? '全部通过（0 项未通过）' : '未通过 ' + bad + ' 项');
process.exit(bad === 0 ? 0 : 1);
