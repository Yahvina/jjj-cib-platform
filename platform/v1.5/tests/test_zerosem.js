// 验证「0 的语义」修正（10-21 录音 96-98 段导师当场纠正）：
//   0 ＝ 两者之间没有直接关系（是一个判断），不是「置信度低」；
//   置信度是另一条独立的轴；留空 ＝ 还没判，与填 0 不是一回事。
const fs = require('fs');

const EL = {};
function mkEl() {
  return {
    innerHTML: '', textContent: '', disabled: false, value: '',
    style: {}, dataset: {}, files: [], checked: false,
    classList: { add() {}, remove() {}, toggle() {} },
    querySelector: () => mkEl(), querySelectorAll: () => [],
    appendChild() {}, click() {}, remove() {},
    parentElement: { children: [] },
    getBoundingClientRect: () => ({ top: 0, left: 0 }),
    addEventListener() {}
  };
}
global.document = {
  getElementById: (id) => { if (!EL[id]) EL[id] = mkEl(); return EL[id]; },
  querySelector: () => mkEl(), querySelectorAll: () => [],
  createElement: () => mkEl(), body: mkEl(), addEventListener() {}
};
global.window = { scrollTo() {}, addEventListener() {}, localStorage: { getItem: () => null, setItem() {} } };
global.localStorage = global.window.localStorage;
global.alert = () => {};
global.FileReader = function () {};
global.Blob = function () {};
global.URL = { createObjectURL: () => '', revokeObjectURL() {} };

const code = fs.readFileSync(process.argv[2], 'utf8');

const test = `
render=function(){};
const A='经济增长速度', B='产业结构', C='人口空间分布与收缩态势';
const DS=[A,B,C];
let bad=0;
function ck(label,cond,extra){
  console.log('  '+(cond?'✓':'✗')+' '+label+(extra!==undefined?('　'+extra):''));
  if(!cond) bad++;
}
function setup(){ sel.desc={}; DS.forEach(n=>sel.desc[n]={states:ST(n).slice(),src:''}); cim={}; cimSelKey=null; }

console.log('=== 1. 0 的措辞与「无关」而非「没把握」 ===');
setup();
ck('VWORD[0] 是「无直接关系」', VWORD['0']==='无直接关系', VWORD['0']);
ck('VWORD[0] 不再叫「不影响」', VWORD['0']!=='不影响');
ck('其余档位措辞未被动到', VWORD['3']==='强烈促进'&&VWORD['-3']==='强烈抑制');

console.log();
console.log('=== 2. 点空白格不再自动写 0/低 ===');
setup();
cimSelKey=A+'>'+B;
ck('点之前该格无记录', !cim[A+'>'+B]);
pickCell(A,B);
ck('pickCell 后仍未创建记录（只选中）', !cim[A+'>'+B], '键: '+cimSelKey);
const sideEmpty=EL['cimSide'].innerHTML;
ck('侧栏说明「这一格还没有判断」', /还没有判断/.test(sideEmpty));
ck('侧栏出现影响强度按钮', /class="vb/.test(sideEmpty));
ck('侧栏此时不给置信度按钮', !/class="cb/.test(sideEmpty));
ck('侧栏不再重复 0 的语义，改指图例', !/没把握/.test(sideEmpty)&&/图例/.test(sideEmpty));

console.log();
console.log('=== 3. 选一个分值才算「已判」，0 也是正式判断 ===');
setup();
cimSelKey=A+'>'+B;
setV(0);
ck('选 0 后才有记录', !!cim[A+'>'+B]);
ck('  分值为 0', cim[A+'>'+B].v===0);
ck('  未自动标成低置信', cim[A+'>'+B].conf!=='低', 'conf='+cim[A+'>'+B].conf);
ck('  不计入「低置信度」', reportData().cim.low===0);
const side0=EL['cimSide'].innerHTML;
ck('侧栏显示「无直接关系」', /无直接关系/.test(side0));
ck('侧栏此时才给置信度按钮', /class="cb/.test(side0));
ck('0 按钮带解释性 title', /没有直接关系/.test(side0));
console.log('  报告统计: 已判', reportData().cim.filled, '| 判为 0', reportData().cim.zero,
  '| 未判', reportData().cim.unfilled, '| 低置信', reportData().cim.low);

console.log();
console.log('=== 4. 0 与「低置信」是两条独立的轴 ===');
setup();
cimSelKey=A+'>'+B; setV(0); setConf('高');
ck('判 0 + 高置信 可以共存', cim[A+'>'+B].v===0&&cim[A+'>'+B].conf==='高');
console.log('  侧栏:', /强烈|中度|轻度|无直接关系/.test(EL['cimSide'].innerHTML)?'含措辞 ✓':'✗');
setup();
cimSelKey=A+'>'+B; setV(2); setConf('低');
ck('判 +2 + 低置信 也可以共存', cim[A+'>'+B].v===2&&cim[A+'>'+B].conf==='低');
ck('低置信计数只看 conf', reportData().cim.low===1&&reportData().cim.zero===0);

console.log();
console.log('=== 5. 「未判」与「判为 0」在统计与渲染上分开 ===');
setup();
// 三条：一条判 0、一条判 +2、一条留空
cimSelKey=A+'>'+B; setV(0);
cimSelKey=B+'>'+C; setV(2);
const rd=reportData();
ck('应判 6 条（3×2）', rd.cim.total===6, 'total='+rd.cim.total);
ck('已判 2 条', rd.cim.filled===2, 'filled='+rd.cim.filled);
ck('未判 4 条', rd.cim.unfilled===4&&rd.cim.total-rd.cim.filled===4, 'unfilled='+rd.cim.unfilled);
ck('判为 0 恰好 1 条', rd.cim.zero===1, 'zero='+rd.cim.zero);
renderCim();
const grid=EL['cimGrid'].innerHTML;
ck('未判格渲染为「·」', /cc"[^>]*>·</.test(grid)||/>·</.test(grid));
ck('判 0 的格显示 0', /v0/.test(grid));
ck('统计区单列「其中判为 0」', /其中判为 0/.test(EL['cimStat'].innerHTML));
ck('统计区用「已判」而非「已填」', /已判/.test(EL['cimStat'].innerHTML));
ck('图例点明「·」与 0 是两回事', /还没判/.test(EL['cimStat'].innerHTML)&&/没有直接关系/.test(EL['cimStat'].innerHTML));

console.log();
console.log('=== 6. 清空一格可回到「未判」 ===');
setup();
cimSelKey=A+'>'+B; setV(0);
ck('清空前有记录', !!cim[A+'>'+B]);
clearCell();
ck('清空后记录消失（回到未判，而非变成 0）', !cim[A+'>'+B]);
ck('清空后统计里未判数回升', reportData().cim.unfilled===6);

console.log();
console.log('=== 7. AI 预填只写真有判断的条目，其余留空 ===');
setup();
aiFill();
const rdA=reportData();
const aiN=rdA.cim.filled;
ck('预填条数 = AIRT 中命中的条数', aiN===AIRT.filter(a=>DS.indexOf(a[0])>=0&&DS.indexOf(a[1])>=0&&a[0]!==a[1]).length,
  'filled='+aiN);
ck('预填条数远小于应判总数（不再填满）', aiN<rdA.cim.total&&rdA.cim.unfilled>0,
  aiN+' / '+rdA.cim.total);
ck('预填的条目都带 AI 标记', Object.keys(cim).every(k=>cim[k].ai===true));
ck('不再出现「未发现明显直接影响」的伪判断',
  !Object.keys(cim).some(k=>/未发现明显直接影响/.test(cim[k].why||'')));
ck('预填条目没有凭空产生的 0/低',
  Object.keys(cim).every(k=>cim[k].v!==0||!/未发现/.test(cim[k].why||'')));
renderCim();
ck('网格里出现空白格「·」', />·</.test(EL['cimGrid'].innerHTML));
console.log('  预填 '+aiN+' 条，留空 '+rdA.cim.unfilled+' 条待人工判断');

console.log();
console.log('=== 8. 报告正文不再把两件事并成一句 ===');
setup();
cimSelKey=A+'>'+B; setV(0);
const rpt=buildReportHTML(reportData());
ck('报告区分「已判 / 未判」', /已判/.test(rpt)&&/未判/.test(rpt));
ck('报告单列「判为 0」', /判为 0/.test(rpt));
ck('报告声明未判≠判为 0', /不是一回事/.test(rpt));
ck('报告 meta 行含未判条数', /应判 \\d+ 条，已判 \\d+ 条，未判 \\d+ 条/.test(rpt));
const fl=presMatrix();
ck('影响谱区分空白格与 0 格', /空白格子表示还没有判断/.test(fl)&&/没有直接关系/.test(fl));

console.log();
console.log('=== 9. 路径分析的措辞不再把「未判」说成「0」 ===');
setup();
cimSelKey=A+'>'+B;
// 未判时：直接判断应显示「未判断」，不能显示「未填（0）」
pathFrom=A; pathTo=B; renderPath();
const pb=(()=>{ // renderPath 写进 pathBox
  return document.getElementById('pathBox').innerHTML;
})();
ck('未判时显示「未判断」而非「未填（0）」', /未判断/.test(pb)&&!/未填（0）/.test(pb));

console.log();
console.log(bad===0 ? '全部通过 ✓' : ('有 '+bad+' 项未通过 ✗'));
console.log('崩溃检测: 已完整执行到结尾 ✓');
`;

eval(code + '\n' + test);
