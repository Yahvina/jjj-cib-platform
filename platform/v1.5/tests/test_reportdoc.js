// 验证报告导出 Word：saveFile 被正确调用，内容包含报告主体，后缀 .doc
const fs = require('fs');

const EL = {};
function mkEl() {
  return {
    innerHTML: '', textContent: '', value: '', style: {}, dataset: {}, files: [], checked: false,
    classList: { add() {}, remove() {}, toggle() {} },
    querySelector: () => mkEl(), querySelectorAll: () => [],
    appendChild() {}, click() {}, remove() {}, parentElement: { children: [] },
    getBoundingClientRect: () => ({ top: 0, left: 0 }), addEventListener() {}
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
global.setTimeout = (f) => f();

const code = fs.readFileSync(process.argv[2], 'utf8');

const test = `
render=function(){};
let saved=null;
saveFile=function(name,content,mime){ saved={name:name,content:content,mime:mime}; };
toast=function(){};

const A='一次能源结构', B='产业结构';
sel.desc={};
[A,B].forEach(n=>{ sel.desc[n]={states:ST(n).slice(),src:'政策库'} ;});
cim={};
cim[A+'>'+B]={v:2,conf:'高',why:'测试依据',rev:true};
cim[B+'>'+A]={v:-1,conf:'中',why:'',rev:false};

console.log('=== 报告导出 Word ===');
downloadReportDoc();
console.log('  调用了 saveFile:', saved?'✓':'✗');
console.log('  文件名后缀 .doc:', saved&&/\\.doc$/.test(saved.name)?('✓（'+saved.name+'）'):'✗');
console.log('  MIME 为 msword:', saved&&saved.mime==='application/msword'?'✓':'✗');
console.log('  含 mso 命名空间:', saved&&/schemas-microsoft-com:office:word/.test(saved.content)?'✓':'✗');
console.log('  含报告标题:', saved&&/京津冀政策情景快速评估报告/.test(saved.content)?'✓':'✗');
console.log('  含描述符名:', saved&&saved.content.indexOf(A)>=0?'✓':'✗');
console.log('  含判断依据:', saved&&/测试依据/.test(saved.content)?'✓':'✗');
console.log('  含 Word 版式声明:', saved&&/mso 9/.test(saved.content)?'✓':'✗');
`;

eval(code + test);
