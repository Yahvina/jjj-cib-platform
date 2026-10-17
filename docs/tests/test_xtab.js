// 验证跨层一致性：层级读取、冲突判定（跨两档）、对齐修复、单层提示
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
let LAYERS_ON = ['nation', 'prov', 'city'];
global.document = {
  getElementById: (id) => { if (!EL[id]) EL[id] = mkEl(); return EL[id]; },
  querySelector: () => mkEl(),
  querySelectorAll: (sel) => (sel === '[data-scale].sel'
    ? LAYERS_ON.map(l => ({ dataset: { scale: l } })) : []),
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

const DS=['产业结构','碳价水平与碳市场覆盖'];
sel.desc={}; DS.forEach(n=>sel.desc[n]={states:ST(n).slice(), src:''});

console.log('=== 1. 层级与层级对 ===');
console.log('  层:', xlayers().join(' / '));
console.log('  相邻层级对:', xlXY().map(p=>p.map(x=>XL_NAME[x]).join('→')).join('　'));
console.log();

console.log('=== 2. 初始化 ===');
xlEnsure();
DS.forEach(n=>console.log('  '+n+':', JSON.stringify(xlSel[n])));
console.log();

console.log('=== 3. 梯度允许（逐级递增 0/1/2）===');
setXl('碳价水平与碳市场覆盖','nation',0);
setXl('碳价水平与碳市场覆盖','prov',1);
setXl('碳价水平与碳市场覆盖','city',2);
console.log('  冲突数:', xlCheck().length, '(应 0——相邻对差都是 1)');
console.log();

console.log('=== 4. 方向相反（国0/省0/市2）===');
setXl('碳价水平与碳市场覆盖','prov',0);
setXl('碳价水平与碳市场覆盖','city',2);
const b=xlCheck();
console.log('  冲突数:', b.length, '(应 1)');
if(b.length){
  console.log('  冲突项:', b[0].nm, '|', XL_NAME[b[0].u]+'取「'+ST(b[0].nm)[b[0].ui]+'」',
    'vs', XL_NAME[b[0].d]+'取「'+ST(b[0].nm)[b[0].di]+'」| 差', b[0].diff, '档');
}
console.log();

console.log('=== 5. 一键对齐 ===');
xlAlign();
console.log('  市级取值:', xlSel['碳价水平与碳市场覆盖'].city, '(应由 2 调到 1)');
console.log('  冲突数:', xlCheck().length, '(应 0)');
console.log();

console.log('=== 6. 双层 / 单层 ===');
LAYERS_ON=['nation','prov'];
console.log('  只选两层:', xlXY().map(p=>p.map(x=>XL_NAME[x]).join('→')).join('　'));
LAYERS_ON=['prov'];
renderXl();
console.log('  只选一层提示:', /没有跨层关系可查/.test(EL['xlBox'].innerHTML)?'✓':'✗');
console.log();

console.log('=== 7. 渲染 ===');
LAYERS_ON=['nation','prov','city'];
setXl('产业结构','city',2);
renderXl();
const h=EL['xlBox'].innerHTML;
console.log('  表格:', /xltab/.test(h)?'✓':'✗', '| 下拉框:', (h.match(/<select/g)||[]).length, '(应 6)');
console.log('  冲突格标红:', /xlcell bad/.test(h)?'✓':'✗');
console.log('  判据说明:', /档位差 0＝完全一致/.test(h)?'✓':'✗');
console.log('  加总前提说明:', /层结构并不同构/.test(h)?'✓':'✗');
console.log('  对齐按钮:', /把下级调到相邻档/.test(h)?'✓':'✗');
console.log();

console.log('=== 8. 描述符变化后清理 ===');
delete sel.desc['碳价水平与碳市场覆盖'];
xlEnsure();
console.log('  已删描述符是否清理:', xlSel['碳价水平与碳市场覆盖']===undefined?'✓':'✗');
console.log('崩溃检测: 已完整执行到结尾 ✓');
`;

eval(code + '\n' + test);
