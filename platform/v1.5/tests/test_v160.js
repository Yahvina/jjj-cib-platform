// test_v160.js -- v1.6.0 主界面三步流程冒烟
// 锁住：三步 section 存在、m[1] 是映射把握不是政策档位、N/A 不等于 0、
// 中档占比 >50% 拦截、区间口径不筛政策、政策主张壳与最终档人工可改，以及配置/研究模式 sel 快照往返。
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

console.log('=== 1. 顶部四栏导航与三步 section ===');
chk(/id="mainNav"/.test(html), '主界面导航存在');
['home','config','research','docs'].forEach(k=>{
  chk(html.indexOf('data-nav="'+k+'"') >= 0, '导航项 '+k);
});
['cfg0','cfg1','cfg2'].forEach(id=>{
  chk(html.indexOf('id="'+id+'"') >= 0, '三步 section '+id);
});
chk(html.indexOf('class="pane on" id="pcmp"') >= 0, '概览页保留且首屏默认');
chk(html.indexOf('class="pane docpg" id="pdoc"') >= 0
  && html.indexOf('class="pane docpg" id="pdis"') >= 0
  && html.indexOf('class="pane docpg" id="pver"') >= 0, '三个说明页保留 docpg 版式');

console.log();
console.log('=== 2. 三步区不出现方法词（留研究模式） ===');
const a0=html.indexOf('id="cfg0"');
const b0=html.indexOf('<!-- ============ 使用说明');
const cfgSlice = html.slice(a0, b0);
['CIB','交叉影响','打分矩阵','枚举','锚定','后验'].forEach(w=>{
  chk(cfgSlice.indexOf(w) < 0, '三步区不含「'+w+'」');
});

console.log();
console.log('=== 3. m[1] 是映射把握、不是政策档位 ===');
chk(POLICY.length > 0, '政策库非空', POLICY.length + ' 条');
const hasM1 = POLICY.some(p => (p.m||[]).some(x => x[1]));
chk(hasM1, '政策映射带 m[1] 把握位');
chk(typeof cfgBestConf === 'function', 'cfgBestConf 已定义');
const highM = POLICY.filter(p => (p.m||[]).some(x => x[1]==='高'))[0];
chk(cfgBestConf(highM.m) === '高', 'cfgBestConf 取到把握高');
chk(cfgConfCls('高')!=='rd' && cfgConfCls('低')==='rd', '映射把握色阶不冒充档位色');
const anyM2 = POLICY.some(p => (p.m||[]).some(x => x.length >= 3));
chk(anyM2, 'm 的第二位后是依据文本，不是档位');

console.log();
console.log('=== 4. N/A 不等于 0 ===');
sel.desc={};
['经济增长速度','人口空间分布与收缩态势','产业结构'].forEach(n=>{ sel.desc[n]={states:[ST(n)[0]],src:''}; });
const keys=Object.keys(sel.desc);
cim={};
keys.forEach(s=>keys.forEach(t=>{ if(s!==t) cim[s+'>'+t]={v:1,conf:'高',why:'',rev:false}; }));
delete cim[keys[0]+'>'+keys[1]];
const before = Object.keys(cim).length;
chk(typeof cfgHasScores === 'function' && cfgHasScores() === true, '有判断时 cfgHasScores=true');
const judged = cfgJudgedN();
chk(judged === before, '未判的格不计入判断数', judged + ' vs ' + before);
chk(typeof cfgUnverifiedCount === 'function', 'cfgUnverifiedCount 已定义');
chk(cfgUnverifiedCount() >= 1, '未判的格计为未验证', cfgUnverifiedCount());
chk(!cim[keys[0]+'>'+keys[1]], '未判的格不写 0');

console.log();
console.log('=== 5. 中档＝st[1]，占比 >50% 拦截 ===');
sel.desc={}; ['经济增长速度','产业结构'].forEach(n=>{ sel.desc[n]={states:[ST(n)[0]],src:''}; });
cfgSel={}; cfgSel[PALLC()[0].n]=1; cfgPick={}; cfgClaim={}; cfgTouched={};
chk(cfgMidInfo().t >= 1, '至少一个三档变量进入中档统计', cfgMidInfo().t);
const threeState = cfgInputNames().filter(nm => ST(nm).length===3);
threeState.forEach(nm=>{ cfgPick[nm]=ST(nm)[1]; });
const mid = cfgMidInfo();
chk(mid.n === threeState.length, '三档变量全部取中档', mid.n + ' / ' + mid.t);
chk(mid.ratio > 0.5, '中档占比过半数直接可判', Math.round(mid.ratio*100) + '%');
threeState.forEach(nm=>{ chk(cfgFinalOf(nm) === ST(nm)[1], '中档取 st[1]：'+nm); });
chk(code_has_expandV, 'expandV 仍在（未删）');

console.log();
console.log('=== 6. 区间口径不筛政策 ===');
chk(typeof SCOPE_NAME === 'object' && SCOPE_NAME.region, '区间口径表存在');
cfgSel={}; cfgSel[PALLC()[0].n]=1;
const nBefore=cfgChosen().length, scopeBefore=rngScope;
const arrBefore=cfgArr().length;
rngScope='bj';
chk(cfgChosen().length === nBefore, '改口径不改已选政策', cfgChosen().length);
chk(cfgArr().length === arrBefore, '改口径不改可选政策数', cfgArr().length);
rngScope=scopeBefore;

console.log();
console.log('=== 7. 政策主张壳与最终档人工可改 ===');
chk(Array.isArray(CFG_CLAIMS) && CFG_CLAIMS.join(',')==='未指定,提高,维持,降低', '政策主张四档壳', CFG_CLAIMS.join('/'));
chk(typeof cfgSetClaim === 'function' && typeof cfgSetPick === 'function', '人工改主张与最终档入口存在');
cfgSetClaim('经济增长速度','提高');
chk(cfgClaim['经济增长速度']==='提高', '政策主张可人工设定');
chk(cfgTouched['经济增长速度']!==1, '只改主张不算改档');
cfgSetPick('经济增长速度', 0);
chk(cfgTouched['经济增长速度']===1, '改最终档标记手动设定');
cfgSetPick('经济增长速度', 99);
chk(cfgTouched['经济增长速度']===1, '越界档位被忽略不报错');
chk(cfgWhyText('提高', ST('经济增长速度')[0], true, '中').indexOf('不是政策档位') >= 0, '取档依据写明映射把握不是档位');

console.log();
console.log('=== 8. 三步流程可走通 ===');
chk(typeof openConfig === 'function' && typeof openResearch === 'function', '两个入口都定义');
chk(typeof cfgGo === 'function' && typeof cfgRun === 'function', '下一步与生成结果入口存在');
chk(typeof renderConfigPolicy === 'function' && typeof renderConfigSetting === 'function' && typeof renderConfigResult === 'function', '三步渲染函数都存在');
viewMode='config'; docPg=''; cimResult=null; cfgRunInfo=null;
let ok=true; try{ renderConfigResult(); }catch(e){ ok=false; console.log(e.message); }
chk(ok, '第三步空结果不抛异常');
chk(document.getElementById('cfgResultSummary').innerHTML.indexOf('还没有生成结果') >= 0, '空结果有明确提示');

console.log();
console.log('=== 9. 配置流程与研究模式 sel 快照往返 ===');
const roundNames = PALLC().reduce((acc,p)=>{ (p.m||[]).forEach(x=>{ const d=dOf(x[0]); if(d&&d.t!=='结果型'&&acc.indexOf(x[0])<0) acc.push(x[0]); }); return acc; }, []);
const roundSnap = roundNames[0];
sel.desc = {};
sel.desc[roundSnap] = { states: [ST(roundSnap)[0]], src: '研究模式快照' };
const roundBefore = JSON.stringify(sel.desc);
cfgSaved=null; cfgSel={}; cfgPick={}; cfgClaim={}; cfgTouched={}; cfgDeptSel=[]; cim={};
for(const p of PALLC()){ cfgSel[p.n]=1; if(cfgInputNames().length>=2) break; }
chk(cfgInputNames().length>=2, '往返用例至少命中两个输入变量', cfgInputNames().length);
const roundSel=JSON.stringify(cfgSel), roundPickBefore=JSON.stringify(cfgPick);
let roundRun=true; try{ cfgRun(); }catch(e){ roundRun=false; console.log(e.message); }
chk(roundRun && !!cfgSaved, '生成结果时保存研究模式 sel 快照');
const roundCfg=JSON.stringify(sel.desc), roundPickAfter=JSON.stringify(cfgPick);
chk(JSON.stringify(cfgSel)===roundSel, '配置选择在生成结果后不变');
chk(roundPickAfter!==roundPickBefore, '生成结果写入最终档快照 cfgPick');
let roundBack=true; try{ openResearch(); }catch(e){ roundBack=false; console.log(e.message); }
chk(roundBack, '返回研究模式不抛异常');
chk(JSON.stringify(sel.desc)===roundBefore, '返回研究模式恢复原 sel 快照');
chk(cfgSaved===null, '快照恢复后清空，避免重复恢复');
chk(JSON.stringify(cfgSel)===roundSel && JSON.stringify(cfgPick)===roundPickAfter, '配置流程数据不被研究模式恢复污染');
chk(roundCfg!==JSON.stringify(sel.desc), '配置运行确实切换了 sel.desc（快照非空转）');

console.log('');
console.log(bad === 0 ? '全部通过' : bad + ' 项未通过');
if(bad) process.exit(1);
`;

eval(code + '\nconst code_has_expandV = ' + String(code.indexOf('expandV') >= 0) + ';\n' + test);
