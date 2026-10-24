/* 第 7 步分组菜单结构测试：确认 17 块全部归类、组内不重不漏、导航与分组一致。
   这是纯结构校验（读 index.html），不做 DOM 渲染。 */
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

const sec = html.slice(html.indexOf('<section class="pane" id="p6">'), html.indexOf('</section>', html.indexOf('<section class="pane" id="p6">')));
const cards = [...sec.matchAll(/<div class="card" data-grp="([a-z]+)">\s*<h3>(.*?)</g)]
  .map(m => ({ g: m[1], t: m[2].trim() }));

console.log('=== 1. 卡片数量与归类 ===');
chk(cards.length === 17, '17 块全部带分组', cards.length + ' 块');

const names = cards.map(c => c.t);
chk(new Set(names).size === names.length, '无重复卡片', names.length + ' 个标题');

const want = {
  concl: ['检验结果', '矛盾组合与处理建议', '情景筛选'],
  rel: ['逐层求解', '稳健性检验', '集成与分歧'],
  struct: ['影响谱', '影响关系图', '影响路径分析', '主被动图', '相关性分析', '情景表', '情景地图'],
  out: ['时间轴', '生成结果与导出', '情景报告', '本次配置摘要'],
};

console.log('=== 2. 四组内容与顺序 ===');
Object.keys(want).forEach(g => {
  const got = cards.filter(c => c.g === g).map(c => c.t);
  const same = got.length === want[g].length && got.every((x, i) => x === want[g][i]);
  chk(same, g + ' 组 ' + want[g].length + ' 块', same ? '' : '实际 ' + JSON.stringify(got));
});

console.log('=== 3. 页面顺序按组连续 ===');
const seq = cards.map(c => c.g);
const runs = seq.filter((g, i) => i === 0 || g !== seq[i - 1]);
chk(runs.length === 4 && new Set(runs).size === 4, '四组各自连续、不交错', runs.join(' → '));

console.log('=== 4. 导航条 ===');
const tabs = [...sec.matchAll(/class="p6tab[^"]*" data-g="([a-z]+)"/g)].map(m => m[1]);
chk(tabs.length === 4, '四个标签', tabs.join(','));
chk(tabs.every(g => want[g]), '标签组名与卡片组名对应');
chk(/class="p6tab sel" data-g="concl"/.test(sec), '默认选中「结论」');
chk(sec.indexOf('p6allBtn') >= 0 && sec.indexOf('全部展开') >= 0, '有「全部展开」按钮');
chk(sec.indexOf('id="p6stat"') >= 0, '有检验状态提示位');

console.log('=== 5. 文案一致性 ===');
chk(sec.indexOf('下面的情景表与情景地图') < 0, '情景筛选不再说「下面的」表与地图');
chk(sec.indexOf('「结构」组里的情景表与情景地图') >= 0, '改为指向「结构」组');

console.log('=== 6. 交互逻辑 ===');
['function p6Apply', 'function p6Group', 'function p6All', 'function p6Status'].forEach(f => {
  chk(app.indexOf(f) >= 0, f + ' 存在');
});
chk(/p6Apply\(\); p6Status\(\);/.test(app), 'render 中调用分组与状态刷新');
chk(app.indexOf("sec.setAttribute('data-g'") >= 0, '分组写入 data-g');

console.log('=== 7. 关键元素未被属性破坏 ===');
['outPreview', 'fmtNote', 'finalSum', 'checkResult', 'confList'].forEach(id => {
  chk(html.indexOf('id="' + id + '"') >= 0, id + ' 存在');
});
const brokenQuote = /data-grp="[a-z]+>/.test(html);
chk(!brokenQuote, 'data-grp 属性引号完整');

console.log('');
console.log(bad === 0 ? '全部通过（0 项未通过）' : '未通过 ' + bad + ' 项');
process.exit(bad === 0 ? 0 : 1);
