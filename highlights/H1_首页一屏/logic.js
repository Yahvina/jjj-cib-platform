/* H1 ｜ 首页：一屏讲清定位 ｜ 核心逻辑
   摘自 _src/v15/src/app.js，按声明整段切出，未作改写。
   下面每个函数在 app.js 里的位置见本目录 README。 */

const HM_P=[
  [0,0,0, 0,0,0, 0,0,0],
  [0,0,0, 2,0,0, 0,0,0],
  [0,0,0, 0,0,1, 0,0,0],
  [0,0,2, 0,0,0, 0,0,0],
  [0,0,0, 0,0,0, 0,-1,0],
  [0,1,0, 0,0,0, 0,0,0],
  [0,0,0, 0,0,-2,0,0,0],
  [0,0,0, 0,0,0, 0,0,-1],
  [0,0,0, 0,1,0, 0,0,0]
];

function homeStatData(){
  const all=PALLC();
  let maps=0;
  all.forEach(p=>(p.m||[]).forEach(x=>{ maps++; }));
  let descs=0, states=0, combos=1;
  TREE.forEach(g=>g.c.forEach(c=>c.d.forEach(d=>{
    descs++; states+=d.s.length; combos*=d.s.length;
  })));
  return {paths:all.length, maps:maps,
          descs:descs, states:states, combos:combos};
}

function fmtNum(n){
  if(n>=1e8) return (n/1e8).toFixed(1)+' 亿';
  if(n>=1e4) return (n/1e4).toFixed(1)+' 万';
  return String(n);
}

function renderCmp(){
  const d=homeStatData();
  const box=document.getElementById('homeStats');
  if(box) box.innerHTML=[
    [d.descs, '个描述符', '政策要设定的量，共 '+d.states+' 个状态'],
    [d.paths, '条政策路径', '其中 '+d.maps+' 条已挂到描述符'],
    [d.states, '个状态', '每个描述符 2–3 个档位'],
    [fmtNum(d.combos), '种组合', '枚举后逐组检验，保留自洽的']
  ].map(x=>'<div title="'+x[2]+'"><b>'+x[0]+'</b><span>'+x[1]+'</span></div>').join('');

  renderHomeGrid();
}

function renderHomeGrid(){
  const g=document.getElementById('hmGrid');
  if(!g||!g.children||!g.appendChild) return;
  if(g.dataset&&g.dataset.done) return;
  if(g.dataset) g.dataset.done='1';
  const cls={2:'p2',1:'p1','-1':'n1','-2':'n2'};
  let h='';
  for(let r=0;r<9;r++)for(let c=0;c<9;c++){
    const v=HM_P[r][c], d=(r===c);
    h+='<div class="cell '+(d?'dg':(cls[v]||''))+'" data-r="'+r+'" data-c="'+c+
       '" data-v="'+v+'" data-d="'+(d?1:0)+'"></div>';
  }
  g.innerHTML=h;
  const cells=[...g.children], out=document.getElementById('hmRead');
  const HOME=out?out.innerHTML:'';
  cells.forEach(el=>{
    el.addEventListener('mouseenter',function(){
      const r=+el.dataset.r, c=+el.dataset.c;
      cells.forEach(x=>x.classList.toggle('hl',+x.dataset.r===r||+x.dataset.c===c));
      el.classList.add('on');
      if(!out) return;
      if(el.dataset.d==='1'){ out.textContent='对角：描述符对自身，不计入判定'; return; }
      const v=+el.dataset.v, sign=v>0?'+':(v<0?'−':'0');
      out.innerHTML='行 '+String(r+1).padStart(2,'0')+' × 列 '+String(c+1).padStart(2,'0')
        +'　判定 <b>'+(v===0?'0':sign+Math.abs(v))+'</b>';
    });
    el.addEventListener('mouseleave',function(){
      cells.forEach(x=>x.classList.remove('hl','on'));
      if(out) out.innerHTML=HOME;
    });
  });
}

function enterWizard(ev){
  const go=()=>{ docPg=''; viewMode='research'; inCmp=false; cur=0; render(); window.scrollTo({top:0,behavior:'smooth'}); };
  if(!ev||!ev.currentTarget||matchMedia('(prefers-reduced-motion:reduce)').matches){ go(); return; }
  const b=ev.currentTarget.getBoundingClientRect();
  const cx=b.left+b.width/2, cy=b.top+b.height/2;
  const rad=Math.hypot(Math.max(cx,innerWidth-cx),Math.max(cy,innerHeight-cy));
  const cover=document.createElement('div');
  cover.className='wf';
  cover.style.left=cx+'px'; cover.style.top=cy+'px';
  document.body.appendChild(cover);
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    cover.style.width=(rad*2)+'px'; cover.style.height=(rad*2)+'px';
  }));
  setTimeout(()=>{
    go();
    cover.style.width='0px'; cover.style.height='0px';
    setTimeout(()=>cover.remove(),400);
  },380);
}
