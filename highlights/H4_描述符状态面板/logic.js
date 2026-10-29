/* H4 ｜ 描述符状态面板（区间／依据／已知值） ｜ 核心逻辑
   摘自 _src/v15/src/app.js，按声明整段切出，未作改写。
   下面每个函数在 app.js 里的位置见本目录 README。 */

const RANGE_PRESET={
  '经济增长速度':{'高速':[5.0,7.0,'%'],'中速':[3.5,5.0,'%'],'低速':[0,3.5,'%']},
  '人口空间分布与收缩态势':{'集聚增强':[-0.1,0.3,'%/年'],'平稳收缩':[-0.5,-0.1,'%/年'],'加速收缩':[-1.2,-0.5,'%/年']},
  '产业结构':{'加速服务化':[72,80,'%'],'稳步演进':[65,72,'%'],'转型滞后':[55,65,'%']},
  '一次能源结构':{'快速清洁化':[30,40,'%'],'目标节奏':[20,30,'%'],'推进迟缓':[10,20,'%']},
  '区域电力互济强度':{'强互济':[20,35,'%'],'规划节奏':[10,20,'%'],'弱互济':[0,10,'%']},
  '本地可再生能源开发规模':{'高开发':[35,50,'%'],'目标节奏':[20,35,'%'],'低开发':[10,20,'%']},
  '终端电气化率':{'高电气化':[40,55,'%'],'中电气化':[30,40,'%'],'低电气化':[20,30,'%']},
  '钢铁工艺路线':{'短流程与氢冶金为主':[30,50,'% 短流程'],'长流程为主':[5,30,'% 短流程']},
  '单位产品能耗限额强度':{'严格限额':[-20,-5,'%'],'现行标准':[-5,5,'%'],'宽松执行':[5,20,'%']},
  '工业节能改造强度':{'深入推进':[6,10,'%/年'],'按计划推进':[3,6,'%/年'],'推进缓慢':[0,3,'%/年']},
  '碳捕集利用与封存部署规模':{'大规模':[2000,5000,'万吨/年'],'中等':[500,2000,'万吨/年'],'小规模':[0,500,'万吨/年']},
  '碳移除规模':{'含工程化移除':[500,3000,'万吨/年'],'仅生态碳汇':[0,500,'万吨/年']},
  '建筑能效标准强度':{'超低能耗为主':[80,90,'%'],'现行标准递进':[72,80,'%'],'标准滞后':[60,72,'%']},
  '清洁取暖替代强度':{'全面替代':[95,100,'%'],'分步替代':[80,95,'%'],'局部替代':[60,80,'%']},
  '新能源汽车渗透强度':{'快速渗透':[45,65,'%'],'目标节奏':[20,45,'%'],'渗透迟缓':[5,20,'%']},
  '用水总量与结构':{'总量下降且再生水占比高':[-2.5,-0.5,'%/年'],'总量稳定':[-0.5,0.5,'%/年'],'总量增长':[0.5,2.5,'%/年']},
  '京津冀协同机制强度':{'协同强：目标趋同':[0,1,'百分点'],'协同中：维持现状档位差':[1,3,'百分点'],'协同弱：各走各的':[3,6,'百分点']},
  '研发与示范投入强度':{'大幅加码':[3.6,4.5,'% of GDP'],'稳定增长':[2.9,3.6,'% of GDP'],'投入收敛':[2.0,2.9,'% of GDP']},
  '碳价水平与碳市场覆盖':{'高位并扩围':[200,400,'元/吨'],'温和上行':[100,200,'元/吨'],'低位维持':[30,100,'元/吨']}
};

const RANGE_EVID={
  '一次能源结构':{k:'direct',t:'北京可再生能源消费比重 2025 ≥14.4%、2030 25% 左右（碳达峰方案"二、主要目标"）；天津 2030 非化石力争 16%。「目标节奏」20–30% 的中点即 25%'},
  '钢铁工艺路线':{k:'direct',t:'河北电炉炼钢占比 2030 ≥15%、短流程炼钢产量占比 2025 ≥5%（河北省工业领域碳达峰实施方案）'},
  '单位产品能耗限额强度':{k:'direct',t:'2025 单位 GDP 能耗较 2020 下降 14%；河北工业增加值能耗降幅 ≥16.5%；高炉标杆工序能耗 361 kgce/t、标杆以上产能 >30%'},
  '区域电力互济强度':{k:'conv',t:'北京外调绿电 2030 力争 650 亿 kWh、2025 300 亿 kWh（十五五规划第十五篇第三章）；换算为占比需当年全社会用电量'},
  '本地可再生能源开发规模':{k:'conv',t:'北京 2026—2030 新增风光 2 GW；天津 2025 可再生装机 8 GW；河北绿电直连自用 ≥35%。三地口径与单位不一，需按辖区分别换算'},
  '碳移除规模':{k:'conv',t:'北京森林覆盖率 2030/2035 ≥45%、天津 2025 13.6% 且蓄积量 ≥550 万 m³；覆盖率≠碳汇量，需换算'},
  '建筑能效标准强度':{k:'conv',t:'数据中心 PUE ≤1.15（其他档 1.20/1.25/1.30）、2030 可再生利用 100%；公共机构单位面积能耗下降 5%。节能建筑占比无直接目标，需换算'},
  '产业结构':{k:'conv',t:'河北新建炼化成品油占原油加工量 ≤40%（2025）；三产占比无直接目标，需换算'},
  '京津冀协同机制强度':{k:'example',t:'政策原文仅给定性要求（"2030 协同能力显著提升"），明确未给数值；当前区间为自定义量表'},
  '碳捕集利用与封存部署规模':{k:'example',t:'现行数据集无 CCUS 规模目标，仅"支持产业培育"类表述'},
  '用水总量与结构':{k:'example',t:'现行数据集无用水总量目标'},
  '工业节能改造强度':{k:'example',t:'仅有技改补贴比例，无改造强度目标'},
  '清洁取暖替代强度':{k:'example',t:'仅有补贴比例，无清洁取暖率目标'},
  '新能源汽车渗透强度':{k:'example',t:'仅有购置补贴比例，无渗透率目标'},
  '研发与示范投入强度':{k:'example',t:'仅有单项资助额度，无研发强度目标'},
  '碳价水平与碳市场覆盖':{k:'example',t:'仅有配额管理制度描述，无价格目标'},
  '终端电气化率':{k:'example',t:'仅有家电补贴比例，无电气化率目标'},
  '经济增长速度':{k:'exo',t:'外生输入，由 SSP 情景给定，不由政策工具驱动'},
  '人口空间分布与收缩态势':{k:'exo',t:'外生输入，由 SSP 情景给定，不由政策工具驱动'}
};

const EVID_WORD={direct:'政策目标',conv:'需换算',example:'示例值',exo:'外生输入',user:'已改',scope:'本辖区口径'};

const SCOPE_NAME={region:'区域级（京津冀）',bj:'北京',tj:'天津',he:'河北'};

const SCOPE_PRESET={
  '产业结构':{
    bj:{'加速服务化':[84,92,'%'],'稳步演进':[76,84,'%'],'转型滞后':[65,76,'%']},
    tj:{'加速服务化':[68,76,'%'],'稳步演进':[60,68,'%'],'转型滞后':[50,60,'%']},
    he:{'加速服务化':[58,66,'%'],'稳步演进':[50,58,'%'],'转型滞后':[40,50,'%']}
  },
  '一次能源结构':{
    bj:{'快速清洁化':[28,36,'%'],'目标节奏':[21,28,'%'],'推进迟缓':[14,21,'%']},
    tj:{'快速清洁化':[20,28,'%'],'目标节奏':[14,20,'%'],'推进迟缓':[8,14,'%']}
  }
};

const SCOPE_NOTE={
  '产业结构|bj':'按北京现状（2025 年三产 85.99%，北京统计公报）设档，区域级区间不适用',
  '产业结构|tj':'按天津现状（2025 年三产 65.21%，天津统计公报）设档',
  '产业结构|he':'按河北现状（2025 年三产 55.1%，河北统计公报）设档',
  '一次能源结构|bj':'按北京 2025 ≥14.4%、2030 25% 左右（北京市碳达峰实施方案）设档，25% 落在「目标节奏」',
  '一次能源结构|tj':'按天津 2025 ≥11.7%、2030 ≥16%（津政发〔2022〕18 号）设档，16% 落在「目标节奏」'
};

const stateDefs={};

const stateDefsScope={};

const scopedDefs={};

function defsOf(nm){
  const d=dOf(nm); if(!d) return [];
  if(!stateDefs[nm]){
    const p=RANGE_PRESET[nm]||{}, ek=(RANGE_EVID[nm]||{}).k||'example';
    stateDefs[nm]=d.s.map(s=>{
      const q=p[s];
      return {n:s, lo:q?q[0]:null, hi:q?q[1]:null, u:q?q[2]:'', ev:ek};
    });
    // 该描述符有省级预设的，一并建好覆盖
    const sp=SCOPE_PRESET[nm];
    if(sp){
      stateDefsScope[nm]={};
      Object.keys(sp).forEach(sc=>{
        stateDefsScope[nm][sc]={};
        Object.keys(sp[sc]).forEach(k=>{
          const v=sp[sc][k];
          stateDefsScope[nm][sc][k]={lo:v[0],hi:v[1],u:v[2]};
        });
      });
    }
  }
  if(rngScope==='region') return stateDefs[nm];
  const key=nm+'|'+rngScope;
  if(!scopedDefs[key]){
    const ov=(stateDefsScope[nm]||{})[rngScope]||{};
    scopedDefs[key]=stateDefs[nm].map(x=>{
      const o=ov[x.n];
      return o?{...x, lo:o.lo, hi:o.hi, u:o.u, ev:(o.ev||'scope'), scoped:true}
              :{...x, scoped:false};   // 没有省级口径的，沿用区域级
    });
  }
  return scopedDefs[key];
}

function baseOf(nm){ defsOf(nm); return stateDefs[nm]; }

function clearScopeCache(nm){
  Object.keys(scopedDefs).forEach(k=>{ if(k.indexOf(nm+'|')===0) delete scopedDefs[k]; });
}

function setScope(sc){
  if(!SCOPE_NAME[sc]) return;
  rngScope=sc; rngEdit=null; render();
  toast('区间视角已切换为「'+SCOPE_NAME[sc]+'」');
}

function dropScopeOverride(nm){
  if(rngScope==='region'){ toast('区域级是基准，不能在它自身清除'); return; }
  if(stateDefsScope[nm]&&stateDefsScope[nm][rngScope]) delete stateDefsScope[nm][rngScope];
  delete scopedDefs[nm+'|'+rngScope];
  render(); toast('「'+nm+'」已恢复为区域级口径');
}

function renderScopeBar(){
  const host=document.getElementById('scopeBtns'); if(!host) return;
  host.innerHTML=Object.keys(SCOPE_NAME).map(k=>
    `<button class="sbtn${rngScope===k?' on':''}" onclick="setScope('${k}')">${SCOPE_NAME[k]}</button>`
  ).join('');
}

const ST=nm=>defsOf(nm)

const rngTxt=x=>{
  if(x.lo===null||x.hi===null) return '<span class="rng none">区间未设</span>';
  const f=v=>Number.isInteger(v)?v:String(+v.toFixed(2));
  return `<span class="rng">${f(x.lo)} – ${f(x.hi)}${x.u?' '+x.u:''}</span>`;
};

function rngIssues(nm){
  const a=defsOf(nm).filter(x=>x.lo!==null&&x.hi!==null);
  if(a.length<2) return [];
  const b=a.slice().sort((p,q)=>p.lo-q.lo);
  const bad=[];
  for(let i=0;i<b.length-1;i++){
    if(b[i+1].lo>b[i].hi) bad.push(`${b[i].n} 与 ${b[i+1].n} 之间有空档`);
    else if(b[i+1].lo<b[i].hi) bad.push(`${b[i].n} 与 ${b[i+1].n} 区间重叠`);
  }
  return bad;
}

function editRange(nm,s){ const k=nm+'|'+s; rngEdit=(rngEdit===k?null:k); rngAdd=null; renderStates(); }

function addState(nm){ rngAdd=(rngAdd===nm?null:nm); rngEdit=null; renderStates(); }

function numOf(id){ const v=parseFloat((document.getElementById(id)||{}).value); return isNaN(v)?null:v; }

function txtOf(id){ return ((document.getElementById(id)||{}).value||'').trim(); }

function saveRange(nm,s){
  const x=defsOf(nm).find(y=>y.n===s); if(!x) return;
  const nlo=numOf('rlo'), nhi=numOf('rhi'), nu=txtOf('ru');
  const changed=(nlo!==x.lo)||(nhi!==x.hi)||((nu||'')!==(x.u||''));
  x.lo=nlo; x.hi=nhi; x.u=nu;
  if(changed){ x.ev='user'; layeredResult=null; }   // 改过区间，原政策依据不再适用
  if(rngScope!=='region'){
    stateDefsScope[nm]=stateDefsScope[nm]||{};
    stateDefsScope[nm][rngScope]=stateDefsScope[nm][rngScope]||{};
    stateDefsScope[nm][rngScope][s]={lo:nlo,hi:nhi,u:nu,ev:'user'};
    delete scopedDefs[nm+'|'+rngScope];   // 下次按覆盖重建
  }
  rngEdit=null; render();
  toast(changed?('已更新「'+s+'」的区间（'+SCOPE_NAME[rngScope]+'），原依据标记为已改')
               :('已保存「'+s+'」'));
}

function renState(nm,old){
  const v=txtOf('rst'); if(!v||v===old){ rngEdit=null; renderStates(); return; }
  const x=baseOf(nm).find(y=>y.n===old); if(!x) return;
  x.n=v;
  Object.keys(stateDefsScope[nm]||{}).forEach(sc=>{
    const m=stateDefsScope[nm][sc];
    if(m[old]){ m[v]=m[old]; delete m[old]; }     // 辖区覆盖的键名一起改
  });
  clearScopeCache(nm);
  const c=sel.desc[nm]; if(c){ const i=c.states.indexOf(old); if(i>=0) c.states[i]=v; }
  rngEdit=null; render(); toast('已重命名为「'+v+'」');
}

function delState(nm,s){
  const a=baseOf(nm); const i=a.findIndex(x=>x.n===s); if(i<0) return;
  if(a.length<=1){ toast('至少保留一个状态'); return; }
  a.splice(i,1);
  Object.keys(stateDefsScope[nm]||{}).forEach(sc=>{ delete stateDefsScope[nm][sc][s]; });
  clearScopeCache(nm);
  const c=sel.desc[nm]; if(c){ const j=c.states.indexOf(s); if(j>=0) c.states.splice(j,1); }
  rngEdit=null; render(); toast('已删除状态「'+s+'」');
}

function doAddState(nm){
  const v=txtOf('nsn'); if(!v){ toast('请填写状态名称'); return; }
  const a=baseOf(nm);
  if(a.some(x=>x.n===v)){ toast('该名称已存在'); return; }
  a.push({n:v, lo:numOf('nslo'), hi:numOf('nshi'), u:txtOf('nsu'), custom:true,
          ev:(RANGE_EVID[nm]||{}).k||'example'});
  clearScopeCache(nm);
  rngAdd=null; render(); toast('已新增自定义状态「'+v+'」');
}

function attrEsc(s){
  return String(s===null||s===undefined?'':s)
    .replace(/\s+/g,' ').trim()
    .replace(/&/g,'&amp;').replace(/"/g,'&quot;')
    .replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function renderStates(only){
  const el=document.getElementById('statePanel'); if(!el) return;   /* 状态面板现在只在「设置」抽屉里 */
  const names = only ? [only] : (p2Drawer&&p2Drawer.mode==='edit' ? [p2Drawer.nm] : Object.keys(sel.desc));
  if(!names.length){ el.innerHTML='<div class="empty">左侧勾选描述符后，这里显示它的状态选项</div>'; }
  else{
    el.innerHTML=names.map(nm=>{
      const c=sel.desc[nm], defs=defsOf(nm);
      const bad=rngIssues(nm);
      const allOn=c.states.length>=defs.length;
      const ev=RANGE_EVID[nm]||{k:'example',t:''};
      const rows=defs.map(s=>{
        const on=c.states.indexOf(s.n)>=0, k=nm+'|'+s.n;
        const ed=(rngEdit===k);
        return `<div class="strow">
            <span class="chk rad ${on?'on':''}" onclick="tglState('${nm}','${s.n}')">${on?TICK:''}</span>
            <span class="stnm" onclick="tglState('${nm}','${s.n}')">${s.n}${s.custom?'<i class="cus">自定义</i>':''}${s.ev==='user'?'<i class="cus evu">已改</i>':''}</span>
            <span class="rngwrap" onclick="editRange('${nm}','${s.n}')" title="点此修改取值区间">${rngTxt(s)}</span>
          </div>`+
          (ed?`<div class="rngedit">
            <div class="re-row"><span class="re-lb">状态名</span>
              <input class="txt" id="rst" value="${s.n}" style="flex:1;"></div>
            <div class="re-row"><span class="re-lb">区间</span>
              <input class="txt" id="rlo" type="number" step="any" value="${s.lo===null?'':s.lo}" placeholder="下限" style="width:92px;">
              <span class="re-dash">–</span>
              <input class="txt" id="rhi" type="number" step="any" value="${s.hi===null?'':s.hi}" placeholder="上限" style="width:92px;">
              <input class="txt" id="ru" value="${s.u||''}" placeholder="单位，如 %" style="width:104px;"></div>
            ${ev.k!=='example'&&ev.k!=='exo'?`<div class="re-ev"><b>依据</b>　${ev.t}</div>`:''}
            <div class="re-row">
              <button class="btn sm pri" onclick="saveRange('${nm}','${s.n}')">保存</button>
              <button class="btn sm" onclick="renState('${nm}','${s.n}')">仅改状态名</button>
              ${s.custom?`<button class="btn sm danger" onclick="delState('${nm}','${s.n}')">删除</button>`:''}
              <button class="btn sm" onclick="editRange('${nm}','${s.n}')">取消</button></div>
          </div>`:'');
      }).join('');
      const addBox=(rngAdd===nm)?`<div class="rngedit">
            <div class="re-row"><span class="re-lb">新增</span>
              <input class="txt" id="nsn" placeholder="状态名称" style="flex:1;"></div>
            <div class="re-row"><span class="re-lb">区间</span>
              <input class="txt" id="nslo" type="number" step="any" placeholder="下限" style="width:92px;">
              <span class="re-dash">–</span>
              <input class="txt" id="nshi" type="number" step="any" placeholder="上限" style="width:92px;">
              <input class="txt" id="nsu" placeholder="单位" style="width:104px;"></div>
            <div class="re-row">
              <button class="btn sm pri" onclick="doAddState('${nm}')">添加</button>
              <button class="btn sm" onclick="addState('${nm}')">取消</button></div>
          </div>`:'';
      const snote=SCOPE_NOTE[nm+'|'+rngScope];
      const hasScope=defs.some(x=>x.scoped);
      const scopeTag=(rngScope!=='region')
        ? `<i class="evi ${hasScope?'scope':'example'}">${hasScope?('已按'+SCOPE_NAME[rngScope]+'口径'):'沿用区域级'}</i>`
        : '';
      /* 卡片里不再单列「依据行」与页脚小字：二者的内容都是解释性的，且与徽标重复。
         现在徽标自己就是悬停锚点，说明文字挂在它的 data-tip 上——
         本辖区口径优先，其次取档方式依据；再补「沿用区域级」这类口径说明。 */
      let evTip=snote||ev.t||'';
      if(rngScope!=='region'&&!hasScope){
        evTip+=(evTip?'；':'')+'本辖区暂无独立口径，沿用区域级区间。';
      }
      return `<div class="stbox"><div class="hd">${nm}
        ${c.src?`<span class="src">来源：${c.src}</span>`:''}
        <i class="evi tip wide ${ev.k}" tabindex="0" data-tip="${attrEsc(evTip)}">${EVID_WORD[ev.k]||''}</i>${scopeTag}</div>`
        +selRangeHTML(nm)+rows+addBox+ancRowHTML(nm)+
        `<div class="stfoot"><button class="btn sm" onclick="addState('${nm}')">＋ 自定义状态</button>
          <button class="btn sm" onclick="selAllState('${nm}')">${allOn?'清空勾选':'全选 '+defs.length+' 档'}</button>
          ${hasScope&&rngScope!=='region'?`<button class="btn sm" onclick="dropScopeOverride('${nm}')">恢复区域级</button>`:''}</div>`+
        (bad.length?`<div class="stbad">区间衔接提示：${bad.join('；')}</div>`:'')+
        `</div>`;
    }).join('')
      +ancConflictHTML()
      +ancSummaryHTML();
  }
  const outs=allDescs().filter(d=>d.t==='结果型');
  const outEl=document.getElementById('outPanel');
  if(outEl) outEl.innerHTML=
    `<div class="stbox" style="margin-top:12px;">
      <div class="hd">模型输出预期</div>
      <div style="padding:10px 12px;font-size:13px;color:var(--tx2);line-height:1.7;">
        ${outs.map(d=>`· <b style="color:var(--tx)">${d.n}</b>——${d.tr}`).join('<br>')}
      </div></div>`;
}

function renderTree(){
  const el=document.getElementById('tree'); if(!el) return;   /* 树现在只在「添加描述符」抽屉里 */
  const q=searchQ.trim().toLowerCase();
  let h='', shown=0;
  TREE.forEach((l1,i1)=>{
    let buf='', cnt=0;
    l1.c.forEach((l2,i2)=>{
      let d3='';
      l2.d.forEach(d=>{
        const hit=!q||(d.n+d.v).toLowerCase().indexOf(q)>=0;
        if(!hit) return;
        cnt++;
        const dis=d.t==='结果型';
        const on=!!sel.desc[d.n];
        const cls=d.t==='输入型'?'in':(d.t==='参数型'?'par':'out');
        const openDetail=expanded.has(d.id);
        d3+=`<div class="tl3 ${dis?'dis':''}">
          <span class="chk ${on?'on':''}" data-id="${d.id}" onclick="${dis?'':`selDesc('${d.id}')`}">${on?TICK:''}</span>
          <span class="nm" onclick="toggleDetail('${d.id}')">${d.n}${dis?' <span class="dim">（不可作为输入）</span>':''}
            <span class="meta">${d.v}</span></span></div>`;
        if(openDetail){
          d3+=`<div class="detail"><div class="dhead">
            <span>翻译依据与时间锚点<span class="pill ${cls}" style="margin-left:10px;">${d.t}</span></span>
            <span style="cursor:pointer;color:var(--pri);font-weight:400;" onclick="toggleDetail('${d.id}')">收起 ▲</span></div>
            <div class="dbody">
              <div class="trbox"><span class="lb">语义翻译</span>${d.tr}</div>
              <div class="tl"><span class="yr">2025<br>参照年</span><span>现状值见右侧路径汇总</span></div>
              <div class="tl" style="margin-top:6px;"><span class="yr"><b>2030</b><br>政策锚点</span><span>${d.a30}</span></div>
              <div class="tl" style="margin-top:6px;"><span class="yr"><b>2035</b><br>情景锚点</span><span>${d.a35}</span></div>
            </div></div>`;
        }
      });
      if(d3){
        const k2=collapsed.has('m'+i1+'_'+i2);
        buf+=`<div class="tnode" style="border-top:1px solid var(--line2);">
          <div class="tl2" onclick="toggleNode('m${i1}_${i2}')">
            <span class="caret ${k2?'':'open'}">▶</span>${l2.n}</div>
          <div class="${k2?'hide':''}">${d3}</div></div>`;
      }
    });
    if(!buf) return;
    shown+=cnt;
    const k1=collapsed.has('n'+i1);
    h+=`<div class="tnode"><div class="tl1" onclick="toggleNode('n${i1}')">
      <span class="caret ${k1?'':'open'}">▶</span>${l1.n}
      <span class="pill" style="margin-left:auto;">一级</span></div>
      <div class="${k1?'hide':''}">${buf}</div></div>`;
  });
  el.innerHTML=h||'<div class="empty">没有匹配的描述符</div>';
  const cnt=document.getElementById('treeCnt');
  if(cnt) cnt.textContent=
    `共 ${allDescs().length} 个　·　已选 ${nSel()} 项${q?'（匹配 '+shown+' 个）':''}`;
}

function toggleDetail(id){
  if(expanded.has(id)) expanded.delete(id); else expanded.add(id);
  renderTree();
}

function toggleNode(id){
  if(collapsed.has(id)) collapsed.delete(id); else collapsed.add(id);
  renderTree();
}

function onSearch(){ searchQ=document.getElementById('search').value; renderTree(); }

function setSearch(v){ document.getElementById('search').value=v; searchQ=v; renderTree(); }

function selDesc(id){
  const d=allDescs().find(x=>x.id===id); if(!d) return;
  const adding=!sel.desc[d.n];
  if(adding) sel.desc[d.n]={states:[],src:null}; else delete sel.desc[d.n];
  /* 在「添加描述符」抽屉里勾选时走轻量路径：只切勾选框、刷新统计与清单，
     不重建整页——原来每次勾选都 render()，树重建后滚动位置归零，勾一个就跳回顶部。 */
  if(p2Drawer&&p2Drawer.mode==='add'){
    const chk=document.querySelector('#tree .chk[data-id="'+id+'"]');
    if(chk){ chk.classList.toggle('on',adding); chk.innerHTML=adding?TICK:''; }
    renderTreeCnt(); renderP2Stat(); renderDescList();
    return;
  }
  render();
}

function tglState(nm,st){
  const b=sel.desc[nm]; if(!b) return;
  const cur=b.states||[];
  const i=cur.indexOf(st);
  b.states = (i>=0) ? cur.filter(x=>x!==st) : cur.concat([st]);
  cimResult=null; BAYES=null; layeredResult=null;
  corrResult=null;
  profResult=null;
  render();
}

function selIdxOf(nm){
  const cur=((sel.desc[nm]||{}).states)||[];
  const st=ST(nm);
  return cur.map(s=>st.indexOf(s)).filter(j=>j>=0);
}

function rangeSize(ds){
  return ds.reduce((a,d)=>{ const k=selIdxOf(d).length; return a*(k||ST(d).length); }, 1);
}

function ancOf(nm){ return anchors[nm]||null; }

function ancTxt(nm){
  const a=ancOf(nm); if(!a) return '';
  return a.lo===a.hi ? String(a.lo) : a.lo+'~'+a.hi;
}

function parseAnc(v){
  const t=String(v||'').replace(/\s+/g,'');
  if(!t) return null;
  const p=t.split(/[~～至到]/).filter(x=>x!=='');
  const a=parseFloat(p[0]); if(isNaN(a)) return null;
  const b=p.length>1?parseFloat(p[1]):a;
  if(isNaN(b)) return null;
  return {lo:Math.min(a,b), hi:Math.max(a,b)};
}

function setAnc(nm, v){
  const a=parseAnc(v);
  if(a) anchors[nm]=a; else delete anchors[nm];
  cimResult=null; BAYES=null;                        // 锚定变了，旧结果作废
  corrResult=null;
  profResult=null;
  layeredResult=null;
  render();
}

function clearAnc(){ anchors={}; cimResult=null; BAYES=null; render(); toast('已清除全部数值锚定'); }

function ancAllowed(nm){
  const st=ST(nm), defs=defsOf(nm), a=ancOf(nm), out=[];
  for(let j=0;j<st.length;j++){
    if(!a){ out.push(j); continue; }
    const d=defs[j];
    if(!d || d.lo===null || d.hi===null || d.lo===undefined || d.hi===undefined){ out.push(j); continue; }
    if(d.hi < a.lo || d.lo > a.hi) continue;
    out.push(j);
  }
  return out;
}

function ancConflicts(){
  const out=[];
  Object.keys(sel.desc).forEach(nm=>{
    const a=ancOf(nm); if(!a) return;
    const defs=defsOf(nm);
    /* 多选后要逐档核对：勾了三档里有一档与已知值不相交，也得报出来，
       不能只看第一档。 */
    (((sel.desc[nm]||{}).states)||[]).forEach(sn=>{
      const d=defs.filter(x=>x.n===sn)[0];
      if(!d||d.lo===null||d.hi===null||d.lo===undefined||d.hi===undefined) return;
      if(d.hi<a.lo||d.lo>a.hi) out.push({nm:nm, st:sn, lo:d.lo, hi:d.hi, u:d.u||''});
    });
  });
  return out;
}

function selRangeHTML(nm){
  const k=selIdxOf(nm).length, tot=ST(nm).length;
  if(!k) return '<div class="selrow"><span class="slab">已勾范围</span>'
    +'<span class="sval">不设限（全部 '+tot+' 档都参与检验）</span></div>';
  return '<div class="selrow on"><span class="slab">已勾范围</span>'
    +'<span class="sval"><b>'+k+'</b> / '+tot+' 档</span></div>';
}

function ancRowHTML(nm){
  const a=ancOf(nm), defs=defsOf(nm);
  const u=(defs.find(x=>x.u)||{}).u||'';
  const tot=ST(nm).length, al=ancAllowed(nm);
  const dead=!!a&&!al.length;
  return `<div class="ancrow${a?' on':''}${dead?' dead':''}">`
    +`<span class="alab">已知值</span>`
    +`<input class="txt ancin${a?' on':''}" value="${ancTxt(nm)}" placeholder="不限，如 4.8 或 4.5~5.0"`
    +` onchange="setAnc('${nm}',this.value)">`
    +`<span class="aunit">${u||'—'}</span>`
    +`<span class="acnt">${a?(dead?('<b>0</b> / '+tot):('<b>'+al.length+'</b> / '+tot)):('全部 '+tot)}</span>`
    +(a?`<span class="ancx" onclick="setAnc('${nm}','')">清除</span>`:'')
    +`</div>`
    +(dead?`<div class="stbad">锚定把这个描述符的所有状态都排除了——检验会直接报错，请放宽已知值或改区间。</div>`:'');
}

function ancSummaryHTML(){
  const ds=Object.keys(sel.desc);
  if(!ds.length) return '';
  let before=1, after=1, nA=0;
  ds.forEach(nm=>{ before*=ST(nm).length; after*=ancAllowed(nm).length; if(ancOf(nm)) nA++; });
  if(!nA) return '';
  const deadOnes=ds.filter(nm=>ancOf(nm)&&!ancAllowed(nm).length);
  let h=`<div class="ancsum">已给 <b>${nA}</b> 个描述符设定已知值：组合空间由 <b>${before.toLocaleString()}</b> 收窄为 <b>${after.toLocaleString()}</b> 种`;
  if(before>after) h+=`（排除 ${(before-after).toLocaleString()} 种）`;
  h+=`。<b>改变已知值后需重新运行检验。</b>　<a class="ancx" onclick="clearAnc()">全部清除</a>`;
  h+=`<br>只有与已知值<b>完全不相交</b>的状态才被排除；部分重叠的保留，因为它仍可能与已知值相容。</div>`;
  if(deadOnes.length){
    h+=`<div class="note" style="margin-top:10px;">有描述符在已知值下<b>一个可用状态都不剩</b>——`
      +`这套设定在数值上无解。要么放宽已知值，要么调整那些状态的取值区间。</div>`;
  }
  return h;
}

function ancConflictHTML(){
  const cf=ancConflicts();
  if(!cf.length) return '';
  return '<div class="pwarn"><b>你选中的档与已知值不相容：</b>'
    +cf.map(x=>x.nm+'「'+x.st+' '+x.lo+'–'+x.hi+(x.u?' '+x.u:'')+'」vs 已知值 '+ancTxt(x.nm)).join('；')
    +'。检验时这些状态不会被考虑——请改选状态、放宽已知值，或确认已知值本身有误。</div>';
}
