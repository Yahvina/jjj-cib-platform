/* H11 ｜ 使用说明页：五区八节，侧栏标出读到哪 ｜ 核心逻辑
   摘自 _src/v15/src/app.js，按声明整段切出，未作改写。
   下面每个函数在 app.js 里的位置见本目录 README。 */

function openDoc(){ openPage('doc'); }

function docSpy(){
  const nav=document.getElementById('docNav');
  if(!nav||typeof nav.querySelectorAll!=='function'){ docSpyOff(); return; }
  if(docPg!=='doc'){ docSpyOff(); return; }
  const links=nav.querySelectorAll('a[href^="#d"]');
  if(!links||!links.length){ docSpyOff(); return; }
  const sy=window.scrollY||0, secs=[];
  for(let i=0;i<links.length;i++){
    const t=document.getElementById((links[i].getAttribute('href')||'').slice(1));
    if(t&&typeof t.getBoundingClientRect==='function') secs.push({a:links[i],top:t.getBoundingClientRect().top+sy});
  }
  if(!secs.length){ docSpyOff(); return; }
  docSpySecs=secs;                  /* render 后各节高度可能变，每次进来重算位置 */
  docSpyCur=null;                   /* 位置变了，逼下一笔画一次 */
  if(!docSpyOn){ window.addEventListener('scroll',docSpyPaint,{passive:true}); docSpyOn=true; }
  docSpyPaint();
}

function docSpyPaint(){
  if(!docSpySecs.length) return;
  const y=(window.scrollY||0)+DOC_LINE;
  let hit=docSpySecs[0].a;          /* 还没滚过任何一节时，停在第一节 */
  for(let i=0;i<docSpySecs.length;i++){
    if(docSpySecs[i].top<=y) hit=docSpySecs[i].a; else break;
  }
  if(hit===docSpyCur) return;       /* 没跨节就不动 DOM */
  docSpyCur=hit;
  for(let i=0;i<docSpySecs.length;i++) docSpySecs[i].a.classList.toggle('on', docSpySecs[i].a===hit);
}

function docSpyOff(){
  if(docSpyOn){ window.removeEventListener('scroll',docSpyPaint); docSpyOn=false; }
  /* 顺手把高亮摘掉：页面虽然已经隐藏，留着亮项会在下次进入时闪一下。 */
  for(let i=0;i<docSpySecs.length;i++) docSpySecs[i].a.classList.remove('on');
  docSpySecs=[]; docSpyCur=null;
}

function backToCmp(){ docPg=''; viewMode='home'; inCmp=true; render(); window.scrollTo({top:0,behavior:'smooth'}); }
