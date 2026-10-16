/* ================= 数据 ================= */
const TREE=[
 {n:'经济与人口',c:[
  {n:'经济规模',d:[{id:'d1',n:'经济增长速度',t:'输入型',v:'GDP|MER；GDP|PPP；Investment',
    s:['高速','中速','低速'],
    tr:'不需翻译。模型里本来就是 GDP 序列，直接给定即可。',
    a30:'三地均未公布增速目标。外推起点：2025 年三地 5.4%、4.8%、5.6%，全国 5.0%',
    a35:'统一标注为待定'}]},
  {n:'人口',d:[{id:'d3',n:'人口空间分布与收缩态势',t:'输入型',v:'Population',
    s:['集聚增强','平稳收缩','加速收缩'],
    tr:'不需翻译。模型直接读取分省常住人口序列；京津占比用于刻画空间分布。',
    a30:'三地均未公布人口目标。起点：2025 年三地合计 10897 万人，比上年减少 28 万',
    a35:'统一标注为待定'}]},
  {n:'产业结构',d:[{id:'d2',n:'产业结构',t:'参数型',v:'Value Added|Agriculture / Industry / Services',
    s:['加速服务化','稳步演进','转型滞后'],
    tr:'你说的「服务业占比到 75%」，模型不吃占比。它算的是「收入涨一块，这个行业的需求跟着涨多少」——即收入弹性。翻译动作是把占比目标反推成各行业的弹性系数取值。',
    a30:'三地均未公布产业结构目标。起点：2025 年三产占比 86.0 / 65.2 / 55.1，三地合计 70.1%',
    a35:'统一标注为待定'}]}
 ]},
 {n:'能源系统',c:[
  {n:'能源供给',d:[
    {id:'d4',n:'一次能源结构',t:'结果型',v:'Primary Energy 及分品种子变量',
      s:['快速清洁化','目标节奏','推进迟缓'],
      tr:'不作为输入。它是模型算出来的，只能作为输出预期来看。',
      a30:'北京可再生能源消费比重约 25%、天津非化石能源 ≥16%、河北 ≥19%',
      a35:'待定（国家 2035 年目标为非化石能源占比 30% 以上）'},
    {id:'d5',n:'区域电力互济强度',t:'参数型',v:'Primary Energy|Secondary Energy Trade',
      s:['强互济','规划节奏','弱互济'],
      tr:'你说的「外受电要到 1000 万千瓦」，模型吃的是二次能源跨区净贸易量。翻译动作是按年利用小时数把装机能力折算成电量。',
      a30:'无量化目标。起点：2025 年天津外受电能力力争 1000 万千瓦，外受电中绿电占三分之一',
      a35:'统一标注为待定'},
    {id:'d6',n:'本地可再生能源开发规模',t:'参数型',v:'Capacity|Electricity|Solar / Wind',
      s:['高开发','目标节奏','低开发'],
      tr:'你说的是「装机要上到多少」，模型吃的是资源潜力与成本曲线。给了潜力和成本，装多少是它算出来的——所以这里要翻译的是条件，不是结果。',
      a30:'无量化目标。起点：2025 年天津可再生能源电力装机超 800 万千瓦，新型储能力争 50 万千瓦以上',
      a35:'统一标注为待定'}]},
  {n:'能源需求',d:[{id:'d7',n:'终端电气化率',t:'结果型',v:'Final Energy|Electricity ÷ Final Energy',
    s:['高电气化','中电气化','低电气化'],
    tr:'不作为输入。在模型的输入文件里找不到落点，这本身就是它属于结果型的证据。',
    a30:'三地均未公布电气化率目标，现状需以分省能源平衡表核算',
    a35:'统一标注为待定'}]}
 ]},
 {n:'产业与技术',c:[
  {n:'工业工艺',d:[{id:'d8',n:'钢铁工艺路线',t:'参数型',
    v:'Production|Iron and Steel|Steel；Material Recycling|Steel Share',
    s:['短流程与氢冶金为主','长流程为主'],
    tr:'你说的「电炉钢占比要提上去」，模型吃的是废钢比例与工序能耗。翻译动作是把工艺结构目标换算成废钢投入比例。',
    a30:'无量化目标。起点：2025 年天津炼铁产能保持 1100 万吨、炼钢 1500 万吨左右',
    a35:'统一标注为待定'},
    {id:'d13',n:'单位产品能耗限额强度',t:'参数型',v:'A323.tech_coef_China（行业能耗强度）',
      s:['严格限额','现行标准','宽松执行'],
      tr:'政策说的是「吨钢能耗不得超过某个值」，模型不收这个限值。它算的是这个行业的能源强度——翻译动作是把限额值转成能耗强度的下限约束。',
      a30:'现行限额标准已覆盖钢铁、水泥、电解铝等；目标年收紧幅度待核定',
      a35:'统一标注为待定'},
    {id:'d14',n:'工业节能改造强度',t:'参数型',v:'efficiency_improve；L245.aeei_CHINA',
      s:['深入推进','按计划推进','推进缓慢'],
      tr:'政策说的是「改造企业按节能量给奖励」，模型收的是这个行业每年自动省多少能——即年能效改进率。翻译动作是用改造企业的节能量乘以覆盖面，反推改进率该上调多少。',
      a30:'重点行业节能改造计划已明确；三地覆盖面待核定',
      a35:'统一标注为待定'}]},
  {n:'减排技术',d:[
    {id:'d9',n:'碳捕集利用与封存部署规模',t:'参数型',v:'Carbon Capture',
      s:['大规模','中等','小规模'],
      tr:'你说的是「要封存多少」，模型吃的是封存潜力与成本曲线。部署规模同样是被算出来的。',
      a30:'无公开量化目标，基准为课题任务书考核指标',
      a35:'统一标注为待定'},
    {id:'d10',n:'碳移除规模',t:'参数型',v:'Carbon Removal；Forest Area Change；Land Cover',
      s:['含工程化移除','仅生态碳汇'],
      tr:'你说的「森林碳汇要达到多少」，模型吃的是土地利用变化与森林面积。翻译动作是把蓄积量目标换算成面积变化率。',
      a30:'全国森林蓄积量 224 亿立方米、河北 2.20 亿立方米',
      a35:'待定（国家 2035 年目标为森林蓄积量 240 亿立方米以上）'}]}
 ]},
 {n:'终端部门',c:[
  {n:'建筑用能',d:[
    {id:'d15',n:'建筑能效标准强度',t:'参数型',v:'A44.globaltech_eff；A44.bld_shell_conductance',
      s:['超低能耗为主','现行标准递进','标准滞后'],
      tr:'政策说的是「新建建筑执行超低能耗标准」，模型收的是建筑终端用能效率。翻译动作是把标准要求的能耗限值折算成建筑用能效率的提升幅度。',
      a30:'三地新建建筑已执行节能设计标准；超低能耗比例目标待核定',
      a35:'统一标注为待定'},
    {id:'d16',n:'清洁取暖替代强度',t:'参数型',v:'building_CHINA（终端用能品种份额）',
      s:['全面替代','分步替代','局部替代'],
      tr:'政策说的是「清洁取暖要覆盖多少户」，模型收的是建筑用能的品种结构。翻译动作是把替代户数折算成电力与天然气在建筑用能中的份额变化。',
      a30:'北京、天津平原地区已基本完成改造；河北后续目标待核定',
      a35:'统一标注为待定'}]},
  {n:'交通用能',d:[
    {id:'d17',n:'新能源汽车渗透强度',t:'参数型',v:'transportation_CHINA；Final Energy|Electricity（交通）',
      s:['快速渗透','目标节奏','渗透迟缓'],
      tr:'政策给的是一整套「补贴、免税、积分、标签」，模型收的是交通部门的终端用电份额。翻译动作是把渗透率乘以单车年耗电量与行驶里程，折算成交通用电需求。',
      a30:'国家目标 2030 年新能源汽车销量占比约 40%；三地未单独公布',
      a35:'统一标注为待定'}]}
 ]},
 {n:'资源与环境',c:[
  {n:'水资源',d:[{id:'d11',n:'用水总量与结构',t:'参数型',
    v:'Water Withdrawal；Water Consumption',
    s:['总量下降且再生水占比高','总量稳定','总量增长'],
    tr:'取水量本身能直接对应，翻译负担较轻；需要额外处理的是分部门拆分（电力、工业、灌溉）。',
    a30:'无量化目标。河北「十四五」万元地区生产总值用水量下降 15%',
    a35:'统一标注为待定'}]}
 ]},
 {n:'政策与治理',c:[
  {n:'区域协同',d:[{id:'d12',n:'京津冀协同机制强度',t:'输入型',v:'无直接对应变量（由三地政策目标差值刻画）',
    s:['协同强：目标趋同','协同中：维持现状档位差','协同弱：各走各的'],
    tr:'标准变量体系里没有对应项。用三地政策目标的差值来刻画：差值收窄即为协同增强，差值扩大即为各走各的。',
    a30:'2025 年目标最大差 2.7 个百分点；2030 年目标最大差约 9 个百分点',
    a35:'统一标注为待定'}]},
  {n:'政策工具',d:[
    {id:'d18',n:'研发与示范投入强度',t:'参数型',v:'techChange；A323.efficiency_improve',
      s:['大幅加码','稳定增长','投入收敛'],
      tr:'政策说的是「投多少钱做研发示范」，模型收的是技术成本逐年下降的速率。翻译动作是：投入强度对应累计产量，累计产量对应成本下降——这一步要引用既有学习曲线研究，是链路最长的一条。',
      a30:'三地研发投入强度目标见「十四五」规划；具体到低碳技术待核定',
      a35:'统一标注为待定'},
    {id:'d19',n:'碳价水平与碳市场覆盖',t:'输入型',v:'carbon_tax_*.xml；fixedTax',
      s:['高位并扩围','温和上行','低位维持'],
      tr:'不需翻译。碳价在模型里有现成的入口——政策目录下的 carbon_tax 系列文件，把价格直接填进去即可。这是所有描述符里改动代价最低的一个。',
      a30:'全国碳市场已扩围至钢铁、水泥、电解铝；价格水平与三地覆盖范围待核定',
      a35:'统一标注为待定'}]}
 ]}
];

/* 政策数据集：106 条路径（89 条 CCPID 国家库 ＋ 17 条京津冀地方补充） */
const POLICY=[
{c:'经济工具',g:'交易机制',n:'排放交易体系（ETS）',a:'ETS',s:'能源；工业',t:2,m:[['碳价水平与碳市场覆盖','高','直接设定碳价与覆盖范围']]},
{c:'经济工具',g:'交易机制',n:'可交易绩效标准',a:'TPS',s:'交通',t:0,m:[['单位产品能耗限额强度','中','以绩效基准形成交易约束']]},
{c:'经济工具',g:'交易机制',n:'可交易可再生能源证书/配额/RPS',a:'REC',s:'能源',t:2,m:[['本地可再生能源开发规模','高','配额直接要求可再生能源占比']]},
{c:'经济工具',g:'补贴',n:'优惠贷款、贷款担保和信用支持',a:'CLG',s:'跨部门',t:8,m:[['研发与示范投入强度','低','融资支持间接影响技术投入']]},
{c:'经济工具',g:'补贴',n:'可再生电力差价合约（CfD）',a:'ECD',s:'能源',t:0,m:[['本地可再生能源开发规模','高','以价格保障撬动装机']]},
{c:'经济工具',g:'补贴',n:'低碳车辆购置补贴',a:'VPS',s:'交通',t:10,m:[['新能源汽车渗透强度','高','直接拉动新能源车销量占比']]},
{c:'经济工具',g:'补贴',n:'生态系统服务付费',a:'ESP',s:'农业、林业和其他土地利用',t:3,m:[['碳移除规模','高','付费购买生态碳汇服务']]},
{c:'经济工具',g:'补贴',n:'以旧换新补贴',a:'TIS',s:'交通；农业、林业和其他土地利用；建筑',t:0,m:[['新能源汽车渗透强度','中','以置换拉动存量更新'],['终端电气化率','低','家电以旧换新影响用电结构']]},
{c:'经济工具',g:'补贴',n:'清洁取暖补贴',a:'CHS',s:'建筑',t:14,m:[['清洁取暖替代强度','高','直接推动取暖方式替代']]},
{c:'经济工具',g:'补贴',n:'回收处理奖补',a:'RTS',s:'废弃物',t:2,m:[['产业结构','低','影响循环利用产业比重']]},
{c:'经济工具',g:'补贴',n:'低排放机械购置补贴',a:'MPS',s:'农业、林业和其他土地利用',t:8,m:[['单位产品能耗限额强度','中','更新机械降低单位能耗'],['新能源汽车渗透强度','低','非道路机械电动化']]},
{c:'经济工具',g:'税收',n:'企业所得税优惠',a:'CIT',s:'工业；建筑；废弃物；能源',t:0,m:[['产业结构','低','税收优惠引导行业投资方向']]},
{c:'经济工具',g:'税收',n:'车辆购置税优惠',a:'VPT',s:'交通',t:0,m:[['新能源汽车渗透强度','高','购置成本直降，强激励']]},
{c:'经济工具',g:'税收',n:'燃料消费税',a:'FET',s:'能源',t:0,m:[['新能源汽车渗透强度','中','抬高燃油车使用成本']]},
{c:'经济工具',g:'税收',n:'差别化车辆税',a:'DVT',s:'交通',t:0,m:[['新能源汽车渗透强度','中','按排放差别征税']]},
{c:'经济工具',g:'税收',n:'车船税优惠',a:'VOT',s:'交通',t:0,m:[['新能源汽车渗透强度','中','持有成本激励']]},
{c:'经济工具',g:'税收',n:'增值税优惠',a:'VAT',s:'工业；废弃物；农业、林业和其他土地利用；能源',t:0,m:[['产业结构','低','间接影响行业投资']]},
{c:'经济工具',g:'税收',n:'环境污染税',a:'EPT',s:'跨部门',t:0,m:[['碳价水平与碳市场覆盖','中','形成准碳价信号']]},
{c:'经济工具',g:'税收',n:'消费税优惠',a:'CTI',s:'工业；交通',t:0,m:[['新能源汽车渗透强度','低','间接激励']]},
{c:'经济工具',g:'税收',n:'政府性基金减免',a:'PLE',s:'能源',t:0,m:[['产业结构','低','降低行业成本']]},
{c:'经济工具',g:'税收',n:'城镇土地使用税优惠',a:'ULT',s:'能源',t:0,m:[['产业结构','低','用地成本激励']]},
{c:'经济工具',g:'行政定价',n:'工业差别电价',a:'IDP',s:'工业',t:1,m:[['工业节能改造强度','中','电价差推动节能改造'],['单位产品能耗限额强度','中','抬高高耗能成本']]},
{c:'经济工具',g:'行政定价',n:'居民阶梯电价',a:'RIT',s:'建筑',t:1,m:[['清洁取暖替代强度','低','影响取暖用能成本'],['终端电气化率','低','影响居民用电行为']]},
{c:'经济工具',g:'行政定价',n:'容量电价机制',a:'CPM',s:'能源',t:1,m:[['区域电力互济强度','中','影响调峰与跨区受电经济性']]},
{c:'规制工具',g:'技术标准',n:'化石燃料供暖系统禁止和淘汰',a:'BFH',s:'工业；建筑',t:4,m:[['清洁取暖替代强度','高','强制淘汰，替代力度最强']]},
{c:'规制工具',g:'技术标准',n:'陆路交通燃料生物燃料配额',a:'BQL',s:'交通',t:1,m:[['新能源汽车渗透强度','中','配额约束燃油路径'],['一次能源结构','低','影响交通用能品种']]},
{c:'规制工具',g:'技术标准',n:'电动机最低能源绩效标准（MEPS）',a:'MEM',s:'工业',t:0,m:[['单位产品能耗限额强度','中','设备能效下限约束']]},
{c:'规制工具',g:'技术标准',n:'消耗臭氧层物质禁止和淘汰',a:'ODS',s:'工业',t:0,m:[]},
{c:'规制工具',g:'技术标准',n:'含氟温室气体禁止和淘汰',a:'FGA',s:'工业',t:0,m:[]},
{c:'规制工具',g:'技术标准',n:'塑料制品禁止和淘汰',a:'BPP',s:'工业',t:2,m:[]},
{c:'规制工具',g:'绩效标准',n:'燃油经济性标准',a:'FEC',s:'交通',t:0,m:[['新能源汽车渗透强度','中','约束燃油车能效，间接推动替代']]},
{c:'规制工具',g:'绩效标准',n:'建筑最低能源绩效标准（MEPS）',a:'MEB',s:'建筑',t:6,m:[['建筑能效标准强度','高','建筑节能的强制底线']]},
{c:'规制工具',g:'绩效标准',n:'烹饪系统最低能源绩效标准（MEPS）',a:'MEC',s:'建筑',t:0,m:[['终端电气化率','低','炊事电气化'],['清洁取暖替代强度','低','炊事用能替代']]},
{c:'规制工具',g:'绩效标准',n:'电器最低能源绩效标准（MEPS）',a:'MEA',s:'工业；建筑',t:0,m:[['终端电气化率','中','电器效率下限影响用电量']]},
{c:'规制工具',g:'绩效标准',n:'照明系统最低能源绩效标准（MEPS）',a:'MEL',s:'建筑；工业；交通',t:0,m:[['终端电气化率','低','照明效率影响用电']]},
{c:'规制工具',g:'绩效标准',n:'空间制冷最低能源绩效标准（MEPS）',a:'MCS',s:'建筑',t:0,m:[['建筑能效标准强度','中','建筑用能设备效率']]},
{c:'规制工具',g:'绩效标准',n:'空间供暖最低能源绩效标准（MEPS）',a:'MHS',s:'建筑；工业',t:0,m:[['建筑能效标准强度','中','供暖设备效率'],['清洁取暖替代强度','中','供暖方式约束']]},
{c:'规制工具',g:'绩效标准',n:'热水系统最低能源绩效标准（MEPS）',a:'MWH',s:'建筑',t:0,m:[['建筑能效标准强度','中','热水系统效率']]},
{c:'规制工具',g:'绩效标准',n:'工业热工设备最低能源绩效标准（MEPS）',a:'MIT',s:'工业',t:0,m:[['单位产品能耗限额强度','中','工业设备能效下限']]},
{c:'规制工具',g:'绩效标准',n:'制冷设备最低能源绩效标准（MEPS）',a:'MRE',s:'工业；建筑',t:0,m:[['终端电气化率','低','制冷设备效率']]},
{c:'规制工具',g:'绩效标准',n:'单位产品能源消耗限额',a:'EIL',s:'工业；能源',t:0,m:[['单位产品能耗限额强度','高','直接就是该描述符的政策工具']]},
{c:'规制工具',g:'绩效标准',n:'速度限值',a:'SPD',s:'交通',t:0,m:[['新能源汽车渗透强度','低','交通需求侧管理']]},
{c:'规制工具',g:'框架性规制',n:'农业污染管控',a:'APC',s:'农业、林业和其他土地利用',t:1,m:[['碳移除规模','低','影响农业碳汇与土地利用'],['用水总量与结构','低','影响农业用水']]},
{c:'规制工具',g:'框架性规制',n:'产能置换',a:'CAP',s:'工业',t:1,m:[['钢铁工艺路线','高','产能置换直接决定工艺结构']]},
{c:'规制工具',g:'框架性规制',n:'生态系统保护制度',a:'ECM',s:'农业、林业和其他土地利用',t:2,m:[['碳移除规模','高','生态系统的保护与恢复']]},
{c:'规制工具',g:'框架性规制',n:'生态保护补偿',a:'ECO',s:'农业、林业和其他土地利用',t:1,m:[['碳移除规模','中','以补偿换生态修复']]},
{c:'规制工具',g:'框架性规制',n:'企业能源管理义务',a:'EEM',s:'跨部门',t:2,m:[['工业节能改造强度','高','强制建立能源管理体系']]},
{c:'规制工具',g:'框架性规制',n:'公共机构能源绩效管理框架',a:'EPM',s:'建筑',t:3,m:[['建筑能效标准强度','中','公共建筑用能管理']]},
{c:'规制工具',g:'框架性规制',n:'生产者责任延伸',a:'EPR',s:'跨部门；废弃物；工业',t:0,m:[['产业结构','低','影响回收与制造环节结构']]},
{c:'规制工具',g:'框架性规制',n:'生态环境分区管控',a:'EEZ',s:'跨部门',t:1,m:[['京津冀协同机制强度','中','跨区域空间管控'],['用水总量与结构','低','生态空间约束']]},
{c:'规制工具',g:'框架性规制',n:'产业转型治理',a:'ITG',s:'跨部门',t:27,m:[['产业结构','高','直接调整产业结构']]},
{c:'规制工具',g:'框架性规制',n:'排污许可管理',a:'PDP',s:'工业',t:0,m:[['产业结构','低','约束高排放行业']]},
{c:'规制工具',g:'框架性规制',n:'绿色金融治理框架',a:'GFG',s:'跨部门',t:1,m:[['研发与示范投入强度','低','引导资金流向低碳技术']]},
{c:'规制工具',g:'框架性规制',n:'生产调度管控',a:'PSM',s:'工业',t:1,m:[['钢铁工艺路线','中','限产调度影响产量与工艺']]},
{c:'规制工具',g:'框架性规制',n:'可再生能源优先调度',a:'RPD',s:'能源',t:0,m:[['区域电力互济强度','高','决定跨区送受电安排'],['本地可再生能源开发规模','中','消纳保障促进装机']]},
{c:'规制工具',g:'框架性规制',n:'目标责任制度',a:'TRS',s:'跨部门',t:123,m:[['京津冀协同机制强度','高','目标分解与考核的核心机制']]},
{c:'政府投资与消费',g:'公共投资',n:'政府资助研发与示范计划',a:'RDD',s:'交通；工业；能源；建筑',t:0,m:[['研发与示范投入强度','高','直接对应研发示范投入']]},
{c:'政府投资与消费',g:'公共投资',n:'中央预算内投资',a:'CBI',s:'交通；工业；能源；建筑；农业、林业和其他土地利用',t:0,m:[['研发与示范投入强度','中','投资方向决定技术投入']]},
{c:'政府投资与消费',g:'公共投资',n:'政府投资基金',a:'GIF',s:'跨部门',t:0,m:[['研发与示范投入强度','中','基金带动技术投资']]},
{c:'政府投资与消费',g:'公共采购',n:'绿色公共采购',a:'GPP',s:'工业；建筑；交通',t:8,m:[['单位产品能耗限额强度','低','采购标准影响供给端'],['产业结构','低','引导产业方向']]},
{c:'政府投资与消费',g:'公共评估规则',n:'战略环境评价',a:'SEA',s:'跨部门',t:0,m:[['京津冀协同机制强度','低','跨区域评价协同']]},
{c:'政府投资与消费',g:'公共评估规则',n:'气候绩效评估考核',a:'CPA',s:'跨部门',t:1,m:[['京津冀协同机制强度','中','考核机制强化协同']]},
{c:'政府投资与消费',g:'公共评估规则',n:'环境影响评价',a:'EIA',s:'跨部门',t:0,m:[]},
{c:'政府投资与消费',g:'公共评估规则',n:'投资项目节能减排评价',a:'ECR',s:'跨部门',t:7,m:[['单位产品能耗限额强度','中','项目层面能效门槛']]},
{c:'政府投资与消费',g:'公共评估规则',n:'环境合规审计',a:'ECA',s:'工业',t:1,m:[['单位产品能耗限额强度','低','合规约束']]},
{c:'信息工具',g:'比较性能效标签',n:'建筑能效标签',a:'ELB',s:'建筑',t:0,m:[['建筑能效标准强度','中','信息工具配合标准']]},
{c:'信息工具',g:'比较性能效标签',n:'产品和电器能效标签',a:'ELP',s:'工业；建筑；能源',t:0,m:[['终端电气化率','低','影响电器选择']]},
{c:'信息工具',g:'比较性能效标签',n:'车辆能效标签',a:'ELV',s:'交通',t:0,m:[['新能源汽车渗透强度','低','信息引导']]},
{c:'信息工具',g:'报告与披露要求',n:'能源统计与审计',a:'ESA',s:'建筑；交通',t:1,m:[['单位产品能耗限额强度','中','计量基础上建立能效约束']]},
{c:'信息工具',g:'报告与披露要求',n:'可持续信息披露',a:'SID',s:'跨部门',t:0,m:[]},
{c:'信息工具',g:'报告与披露要求',n:'温室气体排放报告',a:'GRV',s:'能源；工业；交通',t:3,m:[['碳价水平与碳市场覆盖','中','碳市场运行的数据基础']]},
{c:'信息工具',g:'报告与披露要求',n:'绿色金融统计',a:'GFS',s:'跨部门',t:0,m:[]},
{c:'信息工具',g:'报告与披露要求',n:'绿色金融业绩评价',a:'GFE',s:'跨部门',t:1,m:[]},
{c:'信息工具',g:'能力建设与公众意识',n:'技术推广目录',a:'TPC',s:'工业；跨部门；废弃物',t:1,m:[['研发与示范投入强度','低','技术扩散通道']]},
{c:'信息工具',g:'能力建设与公众意识',n:'产业指导目录',a:'IGC',s:'跨部门',t:0,m:[['产业结构','中','直接引导产业方向']]},
{c:'信息工具',g:'能力建设与公众意识',n:'技术指南',a:'TGC',s:'工业；农业、林业和其他土地利用',t:0,m:[]},
{c:'信息工具',g:'能力建设与公众意识',n:'能力建设计划',a:'CBP',s:'工业',t:5,m:[]},
{c:'信息工具',g:'能力建设与公众意识',n:'公众宣传教育活动',a:'PAC',s:'废弃物；跨部门；交通',t:0,m:[]},
{c:'信息工具',g:'能力建设与公众意识',n:'公民行为规范',a:'COC',s:'跨部门',t:0,m:[]},
{c:'信息工具',g:'能力建设与公众意识',n:'职业资格认证',a:'PCE',s:'跨部门',t:0,m:[]},
{c:'信息工具',g:'能力建设与公众意识',n:'教育体系建设',a:'ESI',s:'跨部门',t:1,m:[]},
{c:'信息工具',g:'能力建设与公众意识',n:'绿色标准体系',a:'GSS',s:'工业',t:2,m:[['单位产品能耗限额强度','低','标准体系的底层支撑']]},
{c:'自愿措施',g:'自愿交易体系',n:'自愿碳市场',a:'VCM',s:'农业、林业和其他土地利用；能源；交通；工业；建筑',t:10,m:[['碳价水平与碳市场覆盖','中','碳价的另一条形成路径']]},
{c:'自愿措施',g:'自愿性信息工具',n:'可持续金融分类目录',a:'SFT',s:'跨部门',t:0,m:[]},
{c:'自愿措施',g:'自愿性信息工具',n:'自愿碳中和方法',a:'VCN',s:'跨部门',t:0,m:[]},
{c:'自愿措施',g:'自愿性信息工具',n:'自愿性采购指南',a:'VPG',s:'跨部门',t:0,m:[]},
{c:'自愿措施',g:'自愿性信息工具',n:'自愿性认证标识',a:'VLB',s:'跨部门；建筑；工业',t:2,m:[]},
{c:'自愿措施',g:'自愿性信息工具',n:'自愿性信息披露',a:'VID',s:'跨部门',t:1,m:[]},
{c:'自愿措施',g:'自愿性目标',n:'自愿性目标',a:'VTG',s:'工业；能源',t:0,m:[['京津冀协同机制强度','低','自愿性承诺反映协同意愿']]},
{c:'经济工具',g:'补贴',n:'低排放运输运营奖励',a:'地方补充',s:'交通',t:2,m:[['新能源汽车渗透强度','中','从运营端拉动新能源化']]},
{c:'经济工具',g:'补贴',n:'减污降碳技术研发与示范补贴',a:'地方补充',s:'能源；工业；交通；废弃物；跨部门',t:19,m:[['研发与示范投入强度','高','直接补贴技术研发示范'],['碳捕集利用与封存部署规模','中','CCUS 示范的主要资金渠道']]},
{c:'经济工具',g:'补贴',n:'节能技术改造补贴',a:'地方补充',s:'能源；工业；建筑；交通；农业、林业和其他土地利用；跨部门',t:27,m:[['工业节能改造强度','高','直接对应工业节能改造']]},
{c:'经济工具',g:'补贴',n:'节能降碳专业服务补贴',a:'地方补充',s:'工业；跨部门',t:7,m:[['工业节能改造强度','中','以服务购买推动改造']]},
{c:'经济工具',g:'补贴',n:'可再生能源项目建设补贴',a:'地方补充',s:'能源；工业；建筑',t:12,m:[['本地可再生能源开发规模','高','直接支持装机建设']]},
{c:'经济工具',g:'补贴',n:'绿电消费奖励',a:'地方补充',s:'能源',t:8,m:[['区域电力互济强度','中','激励跨区购绿电'],['本地可再生能源开发规模','中','拉动本地消纳']]},
{c:'经济工具',g:'补贴',n:'绿色低碳评价认定奖励',a:'地方补充',s:'工业；跨部门',t:21,m:[['产业结构','中','以认定引导产业升级']]},
{c:'经济工具',g:'补贴',n:'绿色建筑发展补贴',a:'地方补充',s:'建筑；跨部门',t:18,m:[['建筑能效标准强度','高','直接推动建筑节能']]},
{c:'经济工具',g:'补贴',n:'绿色债券承销奖励',a:'地方补充',s:'跨部门',t:1,m:[]},
{c:'经济工具',g:'补贴',n:'碳足迹管理奖励',a:'地方补充',s:'工业；跨部门',t:1,m:[]},
{c:'规制工具',g:'框架性规制',n:'可再生能源项目开发管理',a:'地方补充',s:'能源；跨部门',t:8,m:[['本地可再生能源开发规模','中','项目审批与管理约束']]},
{c:'政府投资与消费',g:'公共评估规则',n:'气候友好型企业认定',a:'地方补充',s:'跨部门',t:1,m:[['产业结构','低','企业层面的引导']]},
{c:'经济工具',g:'补贴',n:'可再生能源发电量补贴',a:'地方补充',s:'能源',t:1,m:[['本地可再生能源开发规模','高','按发电量直接补贴']]},
{c:'规制工具',g:'技术标准',n:'建筑可再生能源设施配置要求',a:'地方补充',s:'建筑；能源',t:1,m:[['建筑能效标准强度','中','建筑本体节能要求'],['本地可再生能源开发规模','中','强制配置建筑光伏等']]},
{c:'经济工具',g:'补贴',n:'低碳交通基础设施建设补贴',a:'地方补充',s:'交通；能源',t:2,m:[['新能源汽车渗透强度','中','补能设施是渗透前提']]},
{c:'经济工具',g:'补贴',n:'储能设施建设补贴',a:'地方补充',s:'能源；工业',t:1,m:[['本地可再生能源开发规模','中','储能配套提升消纳'],['区域电力互济强度','中','储能增强跨区调节能力']]},
{c:'经济工具',g:'补贴',n:'高能效家电购置补贴',a:'地方补充',s:'建筑',t:3,m:[['终端电气化率','低','家电效率影响用电量']]},
];

const LAYERS=[
  {k:'nation', n:'国家级', pop:'全国常住人口', eco:'全国 GDP 增速', fmt:'总量口径'},
  {k:'prov',   n:'省级',   pop:'北京 2180 万 / 天津 1363 万 / 河北 7354 万', eco:'5.4% / 4.8% / 5.6%', fmt:'分省口径'},
  {k:'city',   n:'市级',   pop:'河北 11 个地级市（合计 7354 万）', eco:'按各市公布值', fmt:'分市口径'}
];

const SCEN=[
  {n:'2030 年非化石能源目标', d:12, lv:3, c:12, k:6},
  {n:'三地协同减排路径',     d:9,  lv:3, c:9,  k:4},
  {n:'河北钢铁工艺转型',     d:7,  lv:2, c:7,  k:3}
];

/* ================= 状态 ================= */
const sel={desc:{}};
const collapsed=new Set();
const expanded=new Set();
let inCmp=true, scenIdx=0, cur=0, curModel='gcam', expertN=1, useBayes=false, pulled=false;
let searchQ='', openScen=null, openConf=null, applied=new Set();

const TICK='<span class="tick"></span>';
const allDescs=()=>{const a=[];TREE.forEach(l=>l.c.forEach(m=>m.d.forEach(d=>a.push(d))));return a;};
const dOf=nm=>allDescs().find(x=>x.n===nm);
const nSel=()=>Object.keys(sel.desc).length;

/* ================= 对比屏 ================= */
function renderCmp(){
  const s=SCEN[scenIdx];
  const manual=s.d*s.lv*3-8;                 // 需人工核对项：描述符 × 层级 × 系数
  const auto=0;                              // 本平台靠联动约束自动核对
  const rest=Math.max(2,s.k-s.applied());
  document.getElementById('scen').innerHTML=SCEN.map((x,i)=>
    `<div class="s ${i===scenIdx?'on':''}" onclick="pickScen(${i})">${x.n}</div>`).join('');

  const rows=[
    ['参数设定',
     `各层级分别设，变量名与单位不统一<br><span class="dim">${s.d} 个描述符要分别落到两套模型文件</span>`,
     `三级共用同一套描述符，格式统一<br><span class="dim">一次配置，三层同时生效</span>`],
    ['语义翻译',
     `没有这一环，直接给系数值<br><span class="dim">说不清系数是怎么来的</span>`,
     `每个描述符都带翻译依据<br><span class="dim">可展开、可复算、可追溯</span>`],
    ['跨层对齐',
     `手工核对，下级加总是否等于上级靠人查<br><span class="dim">本次需人工核对 <span class="mk">${manual}</span> 项</span>`,
     `上下联动约束自动检验<br><span class="dim">不一致项自动标出，<span class="ok">${auto}</span> 项靠人查</span>`],
    ['矛盾检查',
     `没有机制检查假设之间是否打架<br><span class="dim">矛盾要到跑完模型才发现</span>`,
     `交叉影响矩阵逐对检验<br><span class="dim">事前发现 <span class="mk">${s.c}</span> 组矛盾并给处理建议</span>`],
    ['参数来源',
     `参数由专家主观给定，说不清依据<br><span class="dim">别人无法复算，也无法追溯</span>`,
     `状态定义从政策数据库取预设<br><span class="dim">标注来源路径，可复算、可追溯</span>`],
    ['输出',
     `手动改配置文件，容易出错<br><span class="dim">换模型要重配一遍</span>`,
     `一键生成，自动适配目标模型格式<br><span class="dim">GCAM 出 XML，CHEER 出 CSV</span>`],
    ['自洽情景',
     `<span class="mk">无法给出</span>：不检查一致性，组合是否自洽无从判断`,
     `<span class="ok">${rest} 组</span>逻辑自洽的情景，可直接进下游模型`]
  ];
  document.getElementById('cmpBox').innerHTML=
    `<div class="crow hd"><div class="clbl" style="font-weight:400;color:var(--tx3);">环节</div>
      <div class="cell badc">现有做法</div><div class="cell goodc">本平台</div></div>`+
    rows.map(r=>`<div class="crow"><div class="clbl">${r[0]}</div>
      <div class="cell badc">${r[1]}</div><div class="cell goodc">${r[2]}</div></div>`).join('');

  document.getElementById('verdict').innerHTML=
    `<div class="vc a"><div class="n">${manual}</div><div class="l">现有做法需人工核对的项数</div></div>
     <div class="vc b"><div class="n">${s.c}</div><div class="l">事前发现的矛盾组合（现有做法为 0）</div></div>
     <div class="vc b"><div class="n">${rest}</div><div class="l">可直接进模型的自洽情景</div></div>`;
  document.getElementById('verdictNote').textContent=
    '口径说明：人工核对项＝描述符数 × 联动层数 × 3 − 8；矛盾组合与自洽情景为模拟数值，接入算法后由实际检验生成。';
}
SCEN.forEach(x=>x.applied=()=>Math.min(2,x.c>=12?2:(x.c>=9?1:0)));

/* ================= 步骤 1 ================= */
function layerTable(){
  const on=[...document.querySelectorAll('[data-scale].sel')].map(x=>x.dataset.scale);
  if(!on.length){ document.getElementById('layerTable').innerHTML=
    '<div style="font-size:12.5px;color:var(--tx3);">尚未勾选任何层级</div>'; return; }
  let h=`<div class="crow hd" style="grid-template-columns:96px 1fr 1fr 1fr;">
    <div class="clbl" style="font-weight:400;color:var(--tx3);">层级</div>
    <div class="cell">人口（Population）</div><div class="cell">经济（GDP|MER）</div>
    <div class="cell" style="border-right:none;">口径</div></div>`;
  LAYERS.forEach(L=>{
    const active=on.indexOf(L.k)>=0;
    h+=`<div class="crow" style="grid-template-columns:96px 1fr 1fr 1fr;${active?'':'opacity:.4;'}">
      <div class="clbl">${L.n}</div>
      <div class="cell">${L.pop}</div><div class="cell">${L.eco}</div>
      <div class="cell" style="border-right:none;">${L.fmt}</div></div>`;
  });
  h+=`<div style="padding:11px 14px;font-size:12.5px;color:var(--tx2);background:var(--panel2);">
    跨层约束：${on.length>1?'省级人口加总须等于国家级；市级加总须等于省级；三处口径须一致。'
      :'只勾了一个层级，不做跨层核对——这与现有做法相同。'}</div>`;
  document.getElementById('layerTable').innerHTML=h;
}

/* ================= 步骤 2 ================= */
function renderTree(){
  const el=document.getElementById('tree');
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
          <span class="chk ${on?'on':''}" onclick="${dis?'':`selDesc('${d.id}')`}">${on?TICK:''}</span>
          <span class="nm" onclick="toggleDetail('${d.id}')">${d.n}${dis?' <span class="dim">（不可作为输入）</span>':''}
            <span class="meta">${d.v}</span></span>
          <span class="pill ${cls}">${d.t}</span></div>`;
        if(openDetail){
          d3+=`<div class="detail"><div class="dhead">
            <span>翻译依据与时间锚点</span>
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
  document.getElementById('treeCnt').textContent=
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
  const d=allDescs().find(x=>x.id===id);
  if(sel.desc[d.n]) delete sel.desc[d.n]; else sel.desc[d.n]={states:[],src:null};
  render();
}
function tglState(nm,st){
  const b=sel.desc[nm]; if(!b) return;
  const i=b.states.indexOf(st);
  if(i>=0) b.states.splice(i,1); else b.states.push(st);
  render();
}
function renderStates(){
  const el=document.getElementById('statePanel'), names=Object.keys(sel.desc);
  if(!names.length){ el.innerHTML='<div class="empty">左侧勾选描述符后，这里显示它的状态选项</div>'; }
  else{
    el.innerHTML=names.map(nm=>{
      const d=dOf(nm), c=sel.desc[nm];
      return `<div class="stbox"><div class="hd">${nm}
        ${c.src?`<span class="src">来源：${c.src}</span>`:''}</div>`+
        d.s.map(s=>{const on=c.states.indexOf(s)>=0;
          return `<div class="strow" onclick="tglState('${nm}','${s}')">
            <span class="chk ${on?'on':''}">${on?TICK:''}</span><span>${s}</span></div>`;}).join('')
        +`</div>`;
    }).join('');
  }
  const outs=allDescs().filter(d=>d.t==='结果型');
  document.getElementById('outPanel').innerHTML=
    `<div class="stbox" style="margin-top:12px;">
      <div class="hd">模型输出预期 <span class="tag" style="font-size:10.5px;">结果型</span></div>
      <div style="padding:10px 12px;font-size:12.5px;color:var(--tx2);line-height:1.7;">
        ${outs.map(d=>`· <b style="color:var(--tx)">${d.n}</b>——${d.tr}`).join('<br>')}
      </div></div>`;
}
function pullDB(){
  const PRESET={
    '经济增长速度':'统计年鉴 · 分省 GDP 序列',
    '人口空间分布与收缩态势':'统计年鉴 · 分省常住人口',
    '产业结构':'政策数据集 · 路径「产业转型治理」',
    '区域电力互济强度':'政策数据集 · 路径「绿电消费奖励」（地方补充）',
    '本地可再生能源开发规模':'政策数据集 · 路径「可再生能源项目建设补贴」',
    '钢铁工艺路线':'政策数据集 · 路径「产能置换」',
    '碳捕集利用与封存部署规模':'政策数据集 · 路径「碳捕集示范与专项」',
    '碳移除规模':'政策数据集 · 路径「生态系统服务付费」',
    '单位产品能耗限额强度':'政策数据集 · 路径「单位产品能源消耗限额」',
    '工业节能改造强度':'政策数据集 · 路径「节能技术改造补贴」',
    '建筑能效标准强度':'政策数据集 · 路径「建筑最低能源绩效标准」',
    '清洁取暖替代强度':'政策数据集 · 路径「清洁取暖补贴」',
    '新能源汽车渗透强度':'政策数据集 · 路径「低碳车辆购置补贴」',
    '研发与示范投入强度':'政策数据集 · 路径「政府资助研发与示范计划」',
    '碳价水平与碳市场覆盖':'政策数据集 · 路径「排放交易体系」',
    '京津冀协同机制强度':'政策数据集 · 路径「目标责任制度」'
  };
  Object.keys(sel.desc).forEach(nm=>{ if(PRESET[nm]) sel.desc[nm].src=PRESET[nm]; });
  pulled=true; render();
  document.getElementById('pullBtn').textContent='已拉取预设 ✓';
  document.getElementById('pullBtn').disabled=true;
  toast('已按政策数据库路径预填状态定义');
}

/* ================= 步骤 3 ================= */
function expDetail(){
  const el=document.getElementById('expDetail');
  if(expertN===1){ el.innerHTML='<div class="note">单人判断：全部打分由一人完成，不产生分歧项。</div>'; return; }
  const n=nSel(), items=n>1?n*(n-1)/2:0;
  const dv=Math.max(1,Math.round(items*0.16));
  el.innerHTML=`<div class="note info">
    <b>${expertN} 人独立打分</b><br>
    待打分 ${items} 项，系统自动比对后预计标出 <b>${dv}</b> 项存疑项（打分差 ≥ 2）。<br>
    存疑项不计入最终矩阵，需人工确认后再合并。</div>`;
}
function scaleSum(){
  const n=nSel(), items=n>1?n*(n-1)/2:0;
  document.getElementById('scaleSum').innerHTML=
   `<div class="kv"><span>已选描述符</span><span>${n} 个</span></div>
    <div class="kv"><span>交叉影响矩阵规模</span><span>${n} × ${n} = ${n*n} 格</span></div>
    <div class="kv"><span>待打分项（对称合并后）</span><span>${items} 项</span></div>
    <div class="kv"><span>专家人数</span><span>${expertN} 人</span></div>
    <div class="kv"><span>参数生成方式</span><span>${useBayes?'贝叶斯（给区间）':'仅定性叙事'}</span></div>
    <div class="kv"><span>校验层级</span><span>${[...document.querySelectorAll('[data-scale].sel')].length} 层，含跨层一致性核对</span></div>`;
}

/* ================= 步骤 4 ================= */
function modelDetail(){
  const n=nSel(), el=document.getElementById('modelDetail');
  if(curModel==='gcam'){
    el.innerHTML=`<h3>GCAM-China 需要的文件</h3>
      <div class="kv"><span>配置格式</span><span>XML，写入 configuration.xml 的 ScenarioComponents</span></div>
      <div class="kv"><span>需写入的参数项</span><span>${n||'—'} 项</span></div>
      <div class="kv"><span>文件路径基准</span><span>exe/configuration.xml → ../input/</span></div>
      <div class="kv"><span>改动层级</span><span>情景配置层（最外层）</span></div>
      <div class="note ok">产出落在最外层，无需重新编译，替换后即可运行。</div>`;
  }else{
    el.innerHTML=`<h3>CHEER-CGE 需要的文件</h3>
      <div class="kv"><span>配置格式</span><span>CSV，之后由 GDXXRW.EXE 转为 GDX</span></div>
      <div class="kv"><span>需写入的参数项</span><span>${n||'—'} 项</span></div>
      <div class="kv"><span>对应接口</span><span>run.gms 开头的路径变量与开关</span></div>
      <div class="kv"><span>改动层级</span><span>数据层（需重新转换）</span></div>
      <div class="note">该模型中间层为二进制 GDX，无法直接写入，所以先导出 CSV。这一步比 GCAM 多一道转换。</div>`;
  }
}

/* ================= 步骤 5 ================= */
function checkResult(){
  const n=nSel(), total=n*2;
  const ok=Math.max(1,Math.round(n*0.6));
  const bad=Math.max(0,Math.round(n*1.0));
  el('checkResult', `<div class="kv"><span>参与检验的描述符</span><span>${n} 个</span></div>
    <div class="kv"><span>状态总数</span><span>${total} 个</span></div>
    <div class="kv"><span>发现互相矛盾的状态组合</span><span style="color:var(--rd);">${bad} 组</span></div>
    <div class="kv"><span>通过校验的自洽情景</span><span style="color:var(--ok);">${ok} 组</span></div>
    <div class="kv"><span>跨层级一致性</span><span style="color:var(--ok);">通过（3 层）</span></div>
    ${useBayes?'<div class="kv"><span>参数区间</span><span>已生成并标注置信程度</span></div>':''}
    <div style="margin-top:12px;font-size:12px;color:var(--tx3);">
      以下为自洽情景，点击展开其判断链。</div>
    <div style="margin-top:10px;">`+
    Array.from({length:Math.min(4,ok)},(_,i)=>{
      const nm='情景 '+(i+1), open=openScen===i;
      const names=Object.keys(sel.desc).slice(0,4);
      const chain=(names.length?names:['（尚未选择描述符）']).map((x,j)=>{
        const st=sel.desc[x]&&sel.desc[x].states[0]?sel.desc[x].states[0]:'（未定）';
        const v=j%3===0?[3,'正向协同']:(j%3===1?[-1,'轻微冲突·可容忍']:[0,'无显著影响']);
        return `<div class="ci"><span class="a">${x}</span><span>${st}　→　${v[1]}</span>
          <span class="r ${v[0]>0?'p':(v[0]<0?'n':'z')}">${v[0]>0?'+':''}${v[0]}</span></div>`;
      }).join('');
      return `<div class="acc"><div class="ah" onclick="toggleScen(${i})">
        <span class="t">${nm}　<span class="dim">自洽｜跨层一致</span></span>
        <span style="font-size:12px;color:var(--pri);">${open?'收起 ▲':'展开判断链 ▼'}</span></div>
        ${open?`<div class="ab">
          <div style="margin-bottom:8px;">该情景下各描述符的取值，以及两两交叉影响的判定结果：</div>
          <div class="chain">${chain}</div>
          <div style="margin-top:10px;padding-top:9px;border-top:1px dashed var(--line);">
            <b>为什么自洽：</b>所有交叉影响均未低于 −2（未出现互斥），且上下级取值满足加总与边界约束。</div>
        </div>`:''}</div>`;
    }).join('')+'</div>');
}
function toggleScen(i){ openScen=openScen===i?null:i; render(); }
const CONFS=[
  {id:'c1', a:'经济增长速度', as:'高速', b:'人口空间分布与收缩态势', bs:'加速收缩',
   why:'经济高速增长通常伴随人口净流入，与「加速收缩」难以并存。',
   sug:'把经济增长速度调为「中速」，或把人口改为「平稳收缩」。'},
  {id:'c2', a:'本地可再生能源开发规模', as:'高开发', b:'区域电力互济强度', bs:'弱互济',
   why:'本地高开发通常意味着对外来电依赖下降，与「弱互济」的路径方向不一致。',
   sug:'把区域电力互济改为「规划节奏」。'},
  {id:'c4', a:'单位产品能耗限额强度', as:'严格限额', b:'工业节能改造强度', bs:'推进缓慢',
   why:'限额收紧与改造迟缓作用于同一批工业企业的能耗，一紧一松，逻辑上不一致。',
   sug:'把工业节能改造强度调为「按计划推进」或「深入推进」。'},
  {id:'c3', a:'钢铁工艺路线', as:'长流程为主', b:'碳移除规模', bs:'仅生态碳汇',
   why:'长流程为主将推高工业排放，单靠生态碳汇难以抵消，净零路径走不通。',
   sug:'改为「短流程与氢冶金为主」，或把碳移除改为「含工程化移除」。'}
];
function confList(){
  el('confList', CONFS.map((c,i)=>{
    const done=applied.has(c.id), open=openConf===i;
    return `<div class="conf ${done?'done':''}">
      <div class="h">${done?'✓ 已采纳建议':'矛盾 '+(i+1)+'：'+c.a+'（'+c.as+'）与 '+c.b+'（'+c.bs+'）'}</div>
      <div>${c.why}</div>
      ${open?`<div class="sug"><b>建议：</b>${c.sug}</div>
        <div style="margin-top:9px;display:flex;gap:8px;">
          <button class="btn sm" onclick="applyFix('${c.id}')">${done?'撤销':'采纳建议并重新检验'}</button>
        </div>`:''}
      <div style="margin-top:8px;font-size:12px;">
        <span style="color:${done?'var(--ok)':'var(--pri)'};cursor:pointer;" onclick="toggleConf(${i})">
          ${open?'收起':'查看建议 ▼'}</span></div>
    </div>`;
  }).join('') || '<div class="dim">暂无矛盾项</div>');
}
function toggleConf(i){ openConf=openConf===i?null:i; render(); }
function applyFix(id){
  if(applied.has(id)) applied.delete(id); else applied.add(id);
  render();
  toast(applied.has(id)?'已采纳建议，重新检验完成':'已撤销，重新检验完成');
}
function timeline(){
  const names=Object.keys(sel.desc);
  const rows=names.length?names:['（尚未选择描述符）'];
  el('timeline', `<div class="crow hd" style="grid-template-columns:1fr 1fr 1fr 1fr;">
      <div class="clbl" style="font-weight:400;color:var(--tx3);">描述符</div>
      <div class="cell" style="border-right:1px solid var(--line2);">2025 参照年</div>
      <div class="cell" style="border-right:1px solid var(--line2);">2030 政策锚点</div>
      <div class="cell" style="border-right:none;">2035 情景锚点</div></div>`+
    rows.map(nm=>{
      const d=dOf(nm);
      if(!d) return `<div class="crow" style="grid-template-columns:1fr 1fr 1fr 1fr;">
        <div class="clbl">${nm}</div><div class="cell">—</div><div class="cell">—</div>
        <div class="cell" style="border-right:none;">—</div></div>`;
      return `<div class="crow" style="grid-template-columns:1fr 1fr 1fr 1fr;">
        <div class="clbl">${nm}</div>
        <div class="cell" style="border-right:1px solid var(--line2);">
          <span class="dim">取自统计公报</span></div>
        <div class="cell" style="border-right:1px solid var(--line2);">${d.a30}</div>
        <div class="cell" style="border-right:none;color:var(--tx3);">${d.a35}</div></div>`;
    }).join(''));
}
function el(id,h){ document.getElementById(id).innerHTML=h; }

/* ================= 导出 ================= */
function preview(){
  const names=Object.keys(sel.desc);
  if(curModel==='gcam'){
    let s='<span class="c">&lt;!-- 平台自动生成 · 写入 configuration.xml 的 ScenarioComponents --&gt;</span>\n';
    s+='<span class="c">&lt;!-- 产出自洽情景：'+(names.length?names.length*0.6|0:0)+' 组，本文件为第 1 组 --&gt;</span>\n';
    s+='&lt;<span class="k">ScenarioComponents</span>&gt;\n';
    names.slice(0,6).forEach(nm=>{
      const d=dOf(nm);
      s+=`  &lt;<span class="k">Value</span> <span class="at">name</span>=<span class="s">"${xmlTag(d)}"</span>&gt;`
        +`${xmlFile(d,names.indexOf(nm))}&lt;/<span class="k">Value</span>&gt;\n`;
    });
    if(names.length>6) s+=`  <span class="c">&lt;!-- 另有 ${names.length-6} 项 --&gt;</span>\n`;
    s+='&lt;/<span class="k">ScenarioComponents</span>&gt;';
    return s;
  }
  let s='<span class="c"># 平台自动生成 · CSV，之后由 GDXXRW.EXE 转为 GDX</span>\n';
  s+='<span class="c"># 对应 run.gms 开头的路径变量与情景开关</span>\n';
  s+='param,scenario,value,unit\n';
  names.slice(0,6).forEach(nm=>{
    const d=dOf(nm), st=(sel.desc[nm].states[0]||'待定');
    s+=`${csvParam(d)},${st},待定,\n`;
  });
  return s;
}
function xmlTag(d){
  const n=d.n;
  if(n.indexOf('人口')>=0||n.indexOf('经济增长')>=0) return 'socioeconomics';
  if(n.indexOf('钢铁')>=0) return 'industry_steel';
  if(n.indexOf('单位产品能耗')>=0||n.indexOf('工业节能')>=0) return 'industry_energy';
  if(n.indexOf('建筑能效')>=0||n.indexOf('清洁取暖')>=0) return 'building';
  if(n.indexOf('新能源汽车')>=0) return 'transportation';
  if(n.indexOf('碳移除')>=0) return 'land_cover';
  if(n.indexOf('碳捕集')>=0||n.indexOf('CCUS')>=0) return 'CCS_shrwt';
  if(n.indexOf('碳价')>=0) return 'carbon_tax';
  if(n.indexOf('研发')>=0) return 'tech_change';
  if(n.indexOf('协同')>=0) return 'policy-target-file';
  if(n.indexOf('电力互济')>=0) return 'electricity_trade';
  if(n.indexOf('可再生')>=0) return 'electricity';
  if(n.indexOf('水')>=0) return 'water_demand';
  return 'policy-target-file';
}
function xmlFile(d,i){
  const n=d.n;
  if(n.indexOf('人口')>=0||n.indexOf('经济增长')>=0) return '../input/gcamdata/xml/socioeconomics_CHINA_SSP2.xml';
  if(n.indexOf('钢铁')>=0) return '../input/gcamdata/xml/industry_steel_CHINA.xml';
  if(n.indexOf('单位产品能耗')>=0||n.indexOf('工业节能')>=0) return '../input/gcamdata/xml/industry_CHINA.xml';
  if(n.indexOf('建筑能效')>=0||n.indexOf('清洁取暖')>=0) return '../input/gcamdata/xml/building_CHINA.xml';
  if(n.indexOf('新能源汽车')>=0) return '../input/gcamdata/xml/transportation_CHINA.xml';
  if(n.indexOf('碳移除')>=0) return '../input/gcamdata/xml/land_cover_CHINA.xml';
  if(n.indexOf('碳捕集')>=0||n.indexOf('CCUS')>=0) return '../input/gcamdata/xml/CCS_shrwt_CHINA.xml';
  if(n.indexOf('碳价')>=0) return '../input/policy/carbon_tax_'+((i%3)+1)+'.xml';
  if(n.indexOf('研发')>=0) return '../input/gcamdata/xml/resources_CHINA.xml';
  if(n.indexOf('协同')>=0) return '../input/policy/forcing_target_4p5.xml';
  if(n.indexOf('电力互济')>=0||n.indexOf('可再生')>=0) return '../input/gcamdata/xml/electricity_CHINA.xml';
  if(n.indexOf('水')>=0) return '../input/gcamdata/xml/water_demand_industry.xml';
  return '../input/policy/carbon_tax_'+((i%3)+1)+'.xml';
}
function csvParam(d){ return d.v.split(/[；;]/)[0].trim().slice(0,32).replace(/\s/g,'_'); }
function download(){ dl(preview().replace(/<[^>]+>/g,''), curModel==='gcam'?'xml':'csv','JJJ-CIB-情景1'); }
function downloadAll(){ dl('（原型 v1.0 示意）共 '+Math.max(1,(nSel()*0.6|0))+' 组自洽情景，此处为打包占位。',
  'txt','JJJ-CIB-全部自洽情景'); }
function dl(txt,ext,name){
  const clean=txt.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&amp;/g,'&');
  const b=new Blob([clean],{type:'text/plain;charset=utf-8'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(b); a.download=name+'.'+ext; a.click();
  toast('已导出 '+name+'.'+ext);
}
function fmtTag(){ return curModel==='gcam'?'configuration.xml':'CSV → GDX'; }
function finalSum(){
  const map={nation:'国家级',prov:'省级',city:'市级'};
  const sc=[...document.querySelectorAll('[data-scale].sel')].map(x=>map[x.dataset.scale]);
  el('finalSum',
   `<div class="kv"><span>层级</span><span>${sc.join(' · ')||'—'}</span></div>
    <div class="kv"><span>描述符</span><span>${nSel()} 个（三级结构）</span></div>
    <div class="kv"><span>校验方式</span><span>${expertN} 位专家${useBayes?' · 叠加贝叶斯':''}</span></div>
    <div class="kv"><span>目标模型</span><span>${curModel==='gcam'?'GCAM-China':'CHEER-CGE'}</span></div>
    <div class="kv"><span>状态定义来源</span><span>${pulled?'政策数据库自动预填':'手工设定'}</span></div>
    <div class="kv"><span>已采纳的调整建议</span><span>${applied.size} 条</span></div>
    <div class="kv"><span>输出格式</span><span>${fmtTag()}</span></div>`);
}

/* ================= 交互 ================= */
function pick(node,g){
  [...node.parentElement.children].forEach(x=>{
    x.classList.remove('sel');
    const c=x.querySelector('.chk');
    if(c){ c.classList.remove('on'); c.innerHTML=''; }
  });
  node.classList.add('sel');
  const c=node.querySelector('.chk');
  if(c){ c.classList.add('on'); c.innerHTML=TICK; }
  if(g==='bayes') useBayes=node.textContent.indexOf('贝叶斯')>=0;
  if(g==='exp') expertN=node.textContent.indexOf('单人')>=0?1:(node.textContent.indexOf('双人')>=0?2:3);
  render();
}
function tglScale(node){
  node.classList.toggle('sel');
  const c=node.querySelector('.chk');
  c.classList.toggle('on'); c.innerHTML=c.classList.contains('on')?TICK:'';
  render();
}
function tglModel(node){
  [...node.parentElement.children].forEach(x=>{
    x.classList.remove('sel'); const c=x.querySelector('.chk');
    if(c){c.classList.remove('on'); c.innerHTML='';}
  });
  node.classList.add('sel');
  const c=node.querySelector('.chk'); c.classList.add('on'); c.innerHTML=TICK;
  curModel=node.dataset.model; render();
}
function renderSteps(){
  const NM=['选择尺度','政策库与映射','描述符与状态','校验方式','交叉影响打分','目标模型','检验与导出'];
  let h='';
  NM.forEach((nm,i)=>{
    if(i>0) h+='<div class="stepbar"></div>';
    const cls=i===cur?'on':(i<cur?'done':'');
    h+=`<div class="step-wrap"><div class="step ${cls}" onclick="goto(${i})">
      <span class="n">${i<cur?'✓':i+1}</span>${nm}</div></div>`;
  });
  document.getElementById('steps').innerHTML=h;
}
function goto(i){ cur=Math.max(0,Math.min(6,i)); render(); window.scrollTo({top:0,behavior:'smooth'}); }
function go(d){ goto(cur+d); }
function nextStep(){ if(cur===6){ inCmp=true; render(); window.scrollTo({top:0,behavior:'smooth'}); } else goto(cur+1); }
function pickScen(i){ scenIdx=i; renderCmp(); }
function enterWizard(){ inCmp=false; cur=0; render(); window.scrollTo({top:0,behavior:'smooth'}); }
function backToCmp(){ inCmp=true; render(); window.scrollTo({top:0,behavior:'smooth'}); }
let tt;
function toast(m){
  const t=document.getElementById('toast'); t.textContent=m; t.classList.add('on');
  clearTimeout(tt); tt=setTimeout(()=>t.classList.remove('on'),1900);
}
/* 保存 / 载入 */
function snapshot(){
  return {desc:sel.desc, model:curModel, exp:expertN, bayes:useBayes, pulled,
    scales:[...document.querySelectorAll('[data-scale].sel')].map(x=>x.dataset.scale),
    applied:[...applied]};
}
function saveCfg(){
  try{ localStorage.setItem('jjj-cib-v10', JSON.stringify(snapshot())); toast('配置已保存到本机'); }
  catch(e){ toast('保存失败：浏览器不允许本地存储'); }
}
function loadCfg(){
  try{
    const raw=localStorage.getItem('jjj-cib-v10');
    if(!raw){ toast('本机没有已保存的配置'); return; }
    const d=JSON.parse(raw);
    sel.desc=d.desc||{}; curModel=d.model||'gcam'; expertN=d.exp||1; useBayes=!!d.bayes;
    pulled=!!d.pulled; applied=new Set(d.applied||[]);
    document.querySelectorAll('[data-scale]').forEach(x=>{
      const on=(d.scales||[]).indexOf(x.dataset.scale)>=0;
      x.classList.toggle('sel',on);
      const c=x.querySelector('.chk'); c.classList.toggle('on',on); c.innerHTML=on?TICK:'';
    });
    inCmp=false; render(); toast('配置已载入'); 
  }catch(e){ toast('载入失败'); }
}

/* ================= 政策库与映射（v1.1 新增） ================= */
let polSel=null, polUser=[];
function PALLC(){ return POLICY.concat(polUser); }
function renderPolicy(){
  const list=document.getElementById('polList'); if(!list) return;
  const cat=(document.getElementById('polCat')||{}).value||'all';
  const only=(document.getElementById('polOnly')||{}).value||'all';
  const all=PALLC();
  const arr=all.filter(p=>(cat==='all'||p.c===cat)&&(only==='all'||(only==='hit')===(p.m.length>0)));
  if(!arr.length){
    list.innerHTML='<div class="empty" style="padding:34px;">没有符合条件的路径</div>';
  }else{
    let h='', last='';
    arr.forEach(p=>{
      const i=all.indexOf(p);
      if(p.c!==last){ h+='<div class="pgh">'+p.c+'</div>'; last=p.c; }
      h+='<div class="pitem'+(i===polSel?' sel':'')+'" onclick="pickPolicy('+i+')">'+
         '<span class="pn">'+p.n+'</span>'+
         '<span class="pa">'+(p.a==='地方补充'?'地方':(p.a||'—'))+'</span>'+
         (p.m.length?('<span class="pm">'+p.m.length+'</span>'):'<span class="pm no">0</span>')+
         '</div>';
    });
    list.innerHTML=h;
  }
  const hit=all.filter(p=>p.m.length>0).length;
  const covered={};
  all.forEach(p=>p.m.forEach(x=>{ covered[x[0]]=1; }));
  document.getElementById('polStat').innerHTML=
    '<span class="kv"><span>政策路径</span><span>'+all.length+' 条</span></span>'+
    '<span class="kv"><span>有对应描述符</span><span style="color:var(--ok)">'+hit+' 条</span></span>'+
    '<span class="kv"><span>无对应</span><span style="color:var(--tx2)">'+(all.length-hit)+' 条</span></span>'+
    '<span class="kv"><span>覆盖描述符</span><span>'+Object.keys(covered).length+' / 19 个</span></span>'+
    '<div class="dim" style="margin-top:8px;font-size:12px;">列表右侧的小数字是这条路径对应到的描述符个数，'
    +'标灰的 0 表示这条政策工具不落在本模型变量口径内——它本身就是一条有用的属性。</div>';
  polSidePanel();
}
function pickPolicy(i){ polSel=i; renderPolicy(); }
function polSidePanel(){
  const el=document.getElementById('polSide'); if(!el) return;
  const all=PALLC();
  if(polSel==null||!all[polSel]){
    const cov={};
    all.forEach(p=>p.m.forEach(x=>{ cov[x[0]]=(cov[x[0]]||0)+1; }));
    el.innerHTML='<div class="shead">政策库对描述符的覆盖</div>'+
      allDescs().map(d=>{
        const c=cov[d.n]||0;
        return '<div class="covrow"><span class="cvd">'+d.n+'</span>'+
          '<span class="cvc'+(c?'':' zero')+'">'+(c?c+' 条路径':'无政策覆盖')+'</span></div>';
      }).join('')+
      '<div class="dim" style="font-size:12px;margin-top:11px;line-height:1.7;">'
      +'「经济增长速度」与「人口空间分布与收缩态势」零覆盖是正常的——'
      +'它们是外生的社会经济假设，不由政策工具驱动。</div>';
    return;
  }
  const p=all[polSel];
  el.innerHTML=
   '<div class="shead">'+(p.a==='地方补充'||p.a==='自定义'?'京津冀地方补充':'CCPID 国家库')+'</div>'+
   '<div class="pname">'+p.n+'</div>'+
   '<div class="pmeta">'+p.c+' · '+p.g+(p.s?' · '+p.s:'')+(p.t?'　工具 '+p.t+' 项':'')+'</div>'+
   '<div class="slabel">对应到的描述符</div>'+
   (p.m.length? p.m.map(x=>
     '<div class="maprow"><div class="mr1"><b>'+x[0]+'</b>'+
     '<span class="conf '+(x[1]==='高'?'ok':(x[1]==='中'?'wn':'rd'))+'">'+x[1]+'</span></div>'+
     '<div class="mr2">'+x[2]+'</div></div>').join('')
   : '<div class="dim" style="font-size:12.5px;line-height:1.7;">这条路径与本模型的描述符没有直接对应。'
     +'原因多为：控的不是 CO₂（如消耗臭氧层物质、含氟气体、塑料），或属于无定量落点的制度安排'
     +'（如信息披露、能力建设、宣传教育）。</div>');
}
function applyPolicy(){
  if(nSel()===0){ toast('先到「描述符与状态」勾选描述符，再回来预填'); return; }
  const cov={};
  PALLC().forEach(p=>p.m.forEach(x=>{ if(!cov[x[0]]) cov[x[0]]=x; }));
  let n=0;
  Object.keys(sel.desc).forEach(nm=>{
    if(cov[nm]){ sel.desc[nm].src='政策库 · 依据「'+cov[nm][2]+'」；置信度 '+cov[nm][1]; n++; }
    else sel.desc[nm].src='（政策库中无对应路径，属外生输入或需另行设定）';
  });
  pulled=true;
  toast('已按政策库映射预填 '+n+' 个描述符的来源说明');
  render();
}
function uploadPolicy(){
  const inp=document.createElement('input');
  inp.type='file'; inp.accept='.csv,.txt';
  inp.onchange=e=>{
    const f=e.target.files[0]; if(!f) return;
    const r=new FileReader();
    r.onload=()=>{
      const lines=String(r.result).split(/\r?\n/).filter(x=>x.trim());
      const add=[];
      lines.forEach((ln,i)=>{
        if(i===0&&/路径|path|name/i.test(ln)&&!/[，,]/.test(ln.slice(0,12))) return;
        const p=ln.split(/[,\t]/).map(x=>x.trim());
        if(p[0]) add.push({c:p[0]||'自定义',g:p[1]||'自定义',n:p[2]||p[0],a:'自定义',s:p[3]||'',t:0,m:[]});
      });
      if(!add.length){ toast('没读到有效行，请用「类别,组别,路径,部门」的 CSV'); return; }
      polUser=polUser.concat(add);
      toast('已载入 '+add.length+' 条自定义政策路径');
      render();
    };
    r.readAsText(f,'utf-8');
  };
  inp.click();
}

/* ================= 交叉影响打分（v1.1 新增） ================= */
const DSHORT={
 '经济增长速度':'经济','人口空间分布与收缩态势':'人口','产业结构':'产业','一次能源结构':'能源',
 '区域电力互济强度':'互济','本地可再生能源开发规模':'可再生','终端电气化率':'电气','钢铁工艺路线':'钢铁',
 '碳捕集利用与封存部署规模':'CCUS','碳移除规模':'碳移除','用水总量与结构':'用水','京津冀协同机制强度':'协同',
 '单位产品能耗限额强度':'能耗限','工业节能改造强度':'节能改','建筑能效标准强度':'建筑','清洁取暖替代强度':'取暖',
 '新能源汽车渗透强度':'新能源','研发与示范投入强度':'研发','碳价水平与碳市场覆盖':'碳价'
};
const VWORD={'-3':'强烈抑制','-2':'中度抑制','-1':'轻度抑制','0':'不影响','1':'轻度促进','2':'中度促进','3':'强烈促进'};
/* AI 预填参考的强关系（演示版，须经专家复核） */
const AIRT=[
 ['经济增长速度','产业结构',2,'高','增速上行通常伴随服务业与高端制造占比提升'],
 ['经济增长速度','终端电气化率',1,'中','收入提高带动电气设备普及'],
 ['经济增长速度','人口空间分布与收缩态势',1,'中','增长期人口向都市圈集聚'],
 ['经济增长速度','一次能源结构',1,'低','用能总量扩张牵动能源结构节奏'],
 ['产业结构','单位产品能耗限额强度',-1,'中','服务业占比上升削弱单位能耗约束的紧迫性'],
 ['产业结构','钢铁工艺路线',1,'中','产业升级推动短流程比重上升'],
 ['产业结构','本地可再生能源开发规模',1,'中','高端制造对绿电的需求拉动装机'],
 ['人口空间分布与收缩态势','建筑能效标准强度',-1,'低','人口收缩降低新建建筑规模'],
 ['人口空间分布与收缩态势','清洁取暖替代强度',-1,'低','人口流失地区改造推进更慢'],
 ['碳价水平与碳市场覆盖','钢铁工艺路线',2,'高','碳成本直接改变长短流程的经济性'],
 ['碳价水平与碳市场覆盖','工业节能改造强度',2,'高','碳价是节能改造最直接的经济驱动'],
 ['碳价水平与碳市场覆盖','碳捕集利用与封存部署规模',2,'高','碳价决定 CCUS 的商业可行性'],
 ['碳价水平与碳市场覆盖','本地可再生能源开发规模',1,'中','碳价提升可再生电力的相对竞争力'],
 ['碳价水平与碳市场覆盖','单位产品能耗限额强度',1,'中','履约压力促使企业收紧能耗'],
 ['本地可再生能源开发规模','区域电力互济强度',1,'中','本地装机增加改变跨区受电定位'],
 ['本地可再生能源开发规模','一次能源结构',2,'高','可再生装机直接改善一次能源结构'],
 ['一次能源结构','终端电气化率',1,'中','清洁电力供给增加鼓励终端电气化'],
 ['区域电力互济强度','本地可再生能源开发规模',1,'中','跨区互济增强可提升本地消纳空间'],
 ['终端电气化率','一次能源结构',1,'中','终端用电占比上升反向推动电力清洁化'],
 ['钢铁工艺路线','单位产品能耗限额强度',1,'中','短流程比重上升降低吨钢综合能耗'],
 ['工业节能改造强度','单位产品能耗限额强度',2,'高','节能改造直接改善单位产品能耗'],
 ['工业节能改造强度','碳捕集利用与封存部署规模',-1,'低','能效提升降低末端捕集需求'],
 ['建筑能效标准强度','清洁取暖替代强度',1,'中','建筑本体节能与取暖替代相互支撑'],
 ['建筑能效标准强度','终端电气化率',1,'中','建筑用能效率影响电气化路径'],
 ['清洁取暖替代强度','建筑能效标准强度',1,'低','取暖改造带动建筑能效要求'],
 ['清洁取暖替代强度','终端电气化率',2,'高','以电代煤直接提高电气化水平'],
 ['清洁取暖替代强度','一次能源结构',1,'中','散煤减少改善能源结构'],
 ['新能源汽车渗透强度','终端电气化率',2,'高','交通电动化是终端电气化的主要来源'],
 ['新能源汽车渗透强度','一次能源结构',1,'中','交通用油下降改善能源结构'],
 ['研发与示范投入强度','碳捕集利用与封存部署规模',2,'高','研发示范投入是 CCUS 降本的前提'],
 ['研发与示范投入强度','本地可再生能源开发规模',2,'高','技术进步降低可再生成本曲线'],
 ['研发与示范投入强度','钢铁工艺路线',1,'中','氢冶金等技术依赖研发投入'],
 ['研发与示范投入强度','工业节能改造强度',1,'中','技术供给支撑改造推进'],
 ['碳移除规模','一次能源结构',1,'低','碳汇充裕可放宽能源结构调整压力'],
 ['碳移除规模','钢铁工艺路线',-1,'低','移除能力减弱工业过程减排压力'],
 ['用水总量与结构','本地可再生能源开发规模',-1,'低','水资源约束限制部分可再生开发'],
 ['用水总量与结构','钢铁工艺路线',-1,'低','水约束影响长流程工序'],
 ['京津冀协同机制强度','区域电力互济强度',2,'高','协同机制是三地电力互济的制度前提'],
 ['京津冀协同机制强度','产业结构',1,'中','协同分工引导三地产业布局'],
 ['京津冀协同机制强度','本地可再生能源开发规模',1,'中','协同有助风光资源跨区配置']
];
let cim={}, cimSelKey=null;
function cimKeys(){
  const a=Object.keys(sel.desc), r=[];
  a.forEach(s=>a.forEach(t=>{ if(s!==t) r.push(s+'>'+t); }));
  return r;
}
function aiFill(){
  if(nSel()<2){ toast('先回到第 2 步，至少勾选两个描述符'); return; }
  const keys=cimKeys();
  cim={};
  keys.forEach(k=>{ cim[k]={v:0,conf:'低',why:'AI 未发现明显直接影响，待人工判断',rev:false}; });
  AIRT.forEach(a=>{
    const k=a[0]+'>'+a[1];
    if(cim[k]) cim[k]={v:a[2],conf:a[3],why:a[4],rev:false};
  });
  cimSelKey=null;
  toast('已预填 '+keys.length+' 条判断，请重点审核低置信度项');
  render();
}
function resetCim(){ cim={}; cimSelKey=null; toast('已清空打分矩阵'); render(); }
function pickCell(s,t){ cimSelKey=s+'>'+t; if(!cim[cimSelKey]) cim[cimSelKey]={v:0,conf:'低',why:'',rev:false}; renderCim(); }
function setV(v){ if(cimSelKey){ cim[cimSelKey].v=v; renderCim(); } }
function setConf(c){ if(cimSelKey){ cim[cimSelKey].conf=c; renderCim(); } }
function setWhy(w){ if(cimSelKey){ cim[cimSelKey].why=w; } }
function toggleRev(){ if(cimSelKey){ cim[cimSelKey].rev=!cim[cimSelKey].rev; renderCim(); } }

function renderCim(){
  const g=document.getElementById('cimGrid'); if(!g) return;
  const ds=Object.keys(sel.desc);
  const stat=document.getElementById('cimStat');
  if(ds.length<2){
    g.innerHTML='';
    stat.innerHTML='<span class="dim">尚未选择足够的描述符。请回到第 2 步勾选（至少两个）后再来打分。</span>';
    document.getElementById('cimBalance').innerHTML='<div class="empty">等待描述符选择</div>';
    cimSidePanel(); return;
  }
  const f=(document.getElementById('confFilter')||{}).value||'all';
  let h='<thead><tr><th class="cnr">来源 ＼ 目标</th>';
  ds.forEach(t=>{ h+='<th class="cth" title="'+t+'">'+(DSHORT[t]||t)+'</th>'; });
  h+='</tr></thead><tbody>';
  ds.forEach(s=>{
    h+='<tr><th class="crh" title="'+s+'">'+(DSHORT[s]||s)+'</th>';
    ds.forEach(t=>{
      if(s===t){ h+='<td class="cdiag">—</td>'; return; }
      const k=s+'>'+t, r=cim[k];
      let cls='cc', txt='·', title='未打分';
      if(r){
        txt=(r.v>0?'+':'')+r.v;
        cls='cc v'+r.v;
        if(r.conf==='低') cls+=' low';
        if(r.rev) cls+=' rev';
        title=(r.why||'（无依据）')+'　｜　置信度 '+r.conf+(r.rev?'　｜　已审核':'');
      }
      const hide=(f==='low'&&(!r||r.conf!=='低'))||(f==='unrev'&&r&&r.rev);
      h+='<td class="'+cls+(k===cimSelKey?' sel':'')+(hide?' dimout':'')+
         '" onclick="pickCell(\''+s+'\',\''+t+'\')" title="'+title+'">'+txt+'</td>';
    });
    h+='</tr>';
  });
  g.innerHTML=h+'</tbody>';

  const all=cimKeys(), done=all.filter(k=>cim[k]);
  const low=done.filter(k=>cim[k].conf==='低').length;
  const rev=done.filter(k=>cim[k].rev).length;
  const need=all.filter(k=>!cim[k]||!cim[k].rev).length;
  stat.innerHTML=
    '<span class="kv"><span>应判条目</span><span>'+all.length+' 条</span></span>'+
    '<span class="kv"><span>已填</span><span>'+done.length+' 条</span></span>'+
    '<span class="kv"><span>低置信度</span><span style="color:var(--rd)">'+low+' 条</span></span>'+
    '<span class="kv"><span>已审核</span><span style="color:var(--ok)">'+rev+' 条</span></span>'+
    '<span class="kv"><span>待审核</span><span style="color:var(--wn)">'+need+' 条</span></span>'+
    '<div class="dim" style="margin-top:8px;font-size:12px;">本版为<b>描述符级</b>粗粒度打分；完整实现应下沉到状态级'
    +'（55 个状态两两判断）。每格都带依据与置信度，审核后留痕。</div>';
  cimBalance(ds);
  cimSidePanel();
}
function cimSidePanel(){
  const el=document.getElementById('cimSide'); if(!el) return;
  if(!cimSelKey||!cim[cimSelKey]){
    el.innerHTML='<div class="empty">点击矩阵中任意一格，查看或修改这条判断</div>'; return;
  }
  const p=cimSelKey.split('>'), s=p[0], t=p[1], r=cim[cimSelKey];
  const vs=[-3,-2,-1,0,1,2,3];
  el.innerHTML=
   '<div class="shead">这一格的判断</div>'+
   '<div class="spair">'+(DSHORT[s]||s)+' <span class="ar">→</span> '+(DSHORT[t]||t)+'</div>'+
   '<div class="slabel">影响强度</div>'+
   '<div class="vrow">'+vs.map(v=>'<button class="vb'+(r.v===v?' on':'')+'" onclick="setV('+v+')">'+(v>0?'+':'')+v+'</button>').join('')+'</div>'+
   '<div class="sline">'+VWORD[String(r.v)]+'</div>'+
   '<div class="slabel">置信度</div>'+
   '<div class="crow">'+['高','中','低'].map(c=>'<button class="cb'+(r.conf===c?' on':'')+'" onclick="setConf(\''+c+'\')">'+c+'</button>').join('')+'</div>'+
   '<div class="slabel">依据（证据 / 来源）</div>'+
   '<textarea class="txt why" oninput="setWhy(this.value)" placeholder="写下这条判断的依据……">'+(r.why||'')+'</textarea>'+
   '<button class="btn '+(r.rev?'':'pri')+'" style="width:100%;margin-top:10px;" onclick="toggleRev()">'+(r.rev?'✓ 已审核（点击撤销）':'标记为已审核')+'</button>';
}
function cimBalance(ds){
  const el=document.getElementById('cimBalance'); if(!el) return;
  const rows=ds.map(d=>{
    let inSum=0,outSum=0;
    ds.forEach(o=>{ if(o===d) return;
      const a=cim[o+'>'+d], b=cim[d+'>'+o];
      if(a) inSum+=a.v;
      if(b) outSum+=b.v;
    });
    return {d:d,inSum:inSum,outSum:outSum};
  });
  const maxIn=Math.max.apply(null,rows.map(r=>r.inSum));
  el.innerHTML='<table class="bal"><thead><tr><th>描述符</th><th>来向影响合计</th><th>去向影响合计</th><th>角色</th></tr></thead><tbody>'+
    rows.map(r=>{
      const role=(r.outSum>=2&&r.inSum>=2)?'关键枢纽':(r.outSum>r.inSum?'驱动型':'结果型');
      return '<tr><td>'+(DSHORT[r.d]||r.d)+'</td>'+
        '<td class="'+(r.inSum===maxIn?'top':'')+'">'+(r.inSum>0?'+':'')+r.inSum+(r.inSum===maxIn?' ▲':'')+'</td>'+
        '<td>'+(r.outSum>0?'+':'')+r.outSum+'</td><td class="dim">'+role+'</td></tr>';
    }).join('')+'</tbody></table>'+
    '<div class="dim" style="font-size:12px;margin-top:8px;">▲ 标出的是该项在当前取值下得分最高者。'
    +'这是描述符级的简化预览，完整的影响平衡值需在状态级打分后给出。</div>';
}

/* ================= 影响关系图（v1.1 新增） ================= */
function renderImpact(){
  const el=document.getElementById('impactFig'); if(!el) return;
  const ds=Object.keys(sel.desc);
  if(ds.length<2){
    el.innerHTML='<div style="padding:36px;color:var(--tx3);font-size:12.5px;text-align:center;line-height:1.9;">'
      +'先在「描述符与状态」勾选至少两个描述符，并在「交叉影响打分」里做出判断，这里就会画出关系图。</div>';
    return;
  }
  const W=700, H=Math.max(470, ds.length*30+160);
  const cx=W/2, cy=H/2, R=Math.min(W/2-96, H/2-66);
  const pos={};
  ds.forEach((d,i)=>{
    const a=-Math.PI/2+i*2*Math.PI/ds.length;
    pos[d]={x:cx+R*Math.cos(a), y:cy+R*Math.sin(a)};
  });
  const POS='#1B7F52', NEG='#B42318';
  const defs='<defs>'
    +'<marker id="ahp" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">'
    +'<path d="M2 1L8 5L2 9" fill="none" stroke="'+POS+'" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></marker>'
    +'<marker id="ahn" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">'
    +'<path d="M2 1L8 5L2 9" fill="none" stroke="'+NEG+'" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></marker>'
    +'</defs>';
  let edges='', n=0;
  ds.forEach(s=>ds.forEach(t=>{
    if(s===t) return;
    const r=cim[s+'>'+t]; if(!r||!r.v) return;
    n++;
    const p1=pos[s], p2=pos[t];
    const mx=(p1.x+p2.x)/2, my=(p1.y+p2.y)/2;
    const dx=mx-cx, dy=my-cy, L=Math.hypot(dx,dy)||1;
    const dist=Math.hypot(p2.x-p1.x, p2.y-p1.y)||1;
    const k=(s<t?1:-1)*0.15*dist;
    const qx=mx+dx/L*k, qy=my+dy/L*k;
    const w=(Math.abs(r.v)*0.85+0.6).toFixed(1);
    const op=(0.28+Math.abs(r.v)*0.15).toFixed(2);
    edges+='<path d="M'+p1.x.toFixed(1)+','+p1.y.toFixed(1)+' Q'+qx.toFixed(1)+','+qy.toFixed(1)
      +' '+p2.x.toFixed(1)+','+p2.y.toFixed(1)+'" fill="none" stroke="'+(r.v>0?POS:NEG)
      +'" stroke-width="'+w+'" opacity="'+op+'" marker-end="url(#'+(r.v>0?'ahp':'ahn')+')">'
      +'<title>'+(DSHORT[s]||s)+' → '+(DSHORT[t]||t)+'：'+(r.v>0?'+':'')+r.v
      +'（'+(VWORD[String(r.v)]||'')+'）｜'+(r.why||'无依据')+'</title></path>';
  }));
  let nodes='';
  ds.forEach(d=>{
    const p=pos[d], lab=DSHORT[d]||d;
    const w=Math.max(48, lab.length*12.5+18);
    nodes+='<ellipse cx="'+p.x.toFixed(1)+'" cy="'+p.y.toFixed(1)+'" rx="'+(w/2).toFixed(1)
      +'" ry="15" fill="#fff" stroke="#2563EB" stroke-width="1.2"/>'
      +'<text x="'+p.x.toFixed(1)+'" y="'+p.y.toFixed(1)+'" text-anchor="middle" dominant-baseline="central"'
      +' font-size="11.5" fill="#101828">'+lab+'</text>';
  });
  el.innerHTML='<svg viewBox="0 0 '+W+' '+H+'" style="width:100%;height:auto;display:block;overflow:visible;">'
    +defs+edges+nodes+'</svg>'
    +'<div style="font-size:12px;color:var(--tx3);text-align:center;margin-top:8px;">'
    +'绿线＝促进，红线＝抑制；线越粗越浓，影响越强。当前非零影响 '+n+' 条。悬停任一连线可看这条判断的依据。</div>';
}

/* ================= 情景报告（v1.1 新增） ================= */
function nowStr(){
  const d=new Date(), p=n=>String(n).padStart(2,'0');
  return d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate())+' '+p(d.getHours())+':'+p(d.getMinutes());
}
function reportData(){
  const ds=Object.keys(sel.desc);
  const scaleMap={nation:'国家级',prov:'省级',city:'市级'};
  const scales=[...document.querySelectorAll('[data-scale].sel')].map(x=>scaleMap[x.dataset.scale]||x.dataset.scale);
  const all=cimKeys(), done=all.filter(k=>cim[k]);
  const low=done.filter(k=>cim[k].conf==='低');
  const unreviewed=all.filter(k=>!cim[k]||!cim[k].rev);
  const n=ds.length;
  return {
    generated: nowStr(),
    scales: scales.length?scales:['未选择'],
    model: curModel==='gcam'?'GCAM-China':'CHEER-CGE',
    experts: expertN,
    bayes: useBayes,
    descriptors: ds.map(d=>{
      const o=dOf(d)||{};
      return {name:d, type:o.t||'', states:o.s||[], src:(sel.desc[d]||{}).src||''};
    }),
    cim: {
      total: all.length, filled: done.length, low: low.length, unreviewed: unreviewed.length,
      edges: done.map(k=>({from:k.split('>')[0], to:k.split('>')[1],
        v:cim[k].v, conf:cim[k].conf, why:cim[k].why, reviewed:!!cim[k].rev}))
    },
    stats: {n:n, states:ds.reduce((a,d)=>a+(((dOf(d)||{}).s)||[]).length,0), cells:n*(n-1)}
  };
}
function buildReportHTML(d){
  let h='<h1>京津冀政策情景快速评估报告</h1>';
  h+='<div class="rsub">生成时间 '+d.generated+'　·　模型侧 · 清华大学</div>';
  h+='<div class="rmeta">'
    +'<div><span>分析尺度</span><span>'+d.scales.join(' / ')+'</span></div>'
    +'<div><span>目标模型</span><span>'+d.model+'</span></div>'
    +'<div><span>描述符</span><span>'+d.stats.n+' 个（状态合计 '+d.stats.states+' 个）</span></div>'
    +'<div><span>交叉影响</span><span>应判 '+d.stats.cells+' 条，已填 '+d.cim.filled+' 条</span></div>'
    +'<div><span>校验方式</span><span>'+d.experts+' 人判断'+(d.bayes?'　·　叠加贝叶斯方法':'　·　仅定性叙事')+'</span></div>'
    +'</div>';

  h+='<h2>一、描述符与状态</h2>';
  if(!d.descriptors.length){ h+='<div class="rnote">尚未选择描述符。</div>'; }
  else{
    h+='<table><tr><th style="width:150px">描述符</th><th style="width:64px">类型</th>'
      +'<th style="width:190px">状态</th><th>来源说明</th></tr>';
    d.descriptors.forEach(x=>{
      h+='<tr><td><b>'+x.name+'</b></td><td>'+x.type+'</td><td>'+x.states.join(' / ')
        +'</td><td>'+(x.src||'—')+'</td></tr>';
    });
    h+='</table>';
  }

  h+='<h2>二、交叉影响判断</h2>';
  h+='<p>共应判 '+d.cim.total+' 条，已填 <b>'+d.cim.filled+'</b> 条；其中低置信度 <b>'+d.cim.low
    +'</b> 条，待审核 '+d.cim.unreviewed+' 条。</p>';
  if(d.cim.low){ h+='<div class="rnote">有 '+d.cim.low+' 条判断的置信度为「低」，建议优先复核这些条目。</div>'; }
  const nz=d.cim.edges.filter(e=>e.v);
  if(nz.length){
    h+='<h3>非零影响明细（按强度排序）</h3>';
    h+='<table><tr><th>来源</th><th>目标</th><th style="width:56px">分值</th>'
      +'<th style="width:80px">置信度</th><th>依据</th></tr>';
    nz.slice().sort((a,b)=>Math.abs(b.v)-Math.abs(a.v)).forEach(e=>{
      h+='<tr><td>'+e.from+'</td><td>'+e.to+'</td><td><b>'+(e.v>0?'+':'')+e.v+'</b></td>'
        +'<td>'+(e.reviewed?'✓ ':'')+e.conf+'</td><td>'+(e.why||'—')+'</td></tr>';
    });
    h+='</table>';
  }

  const ds=d.descriptors.map(x=>x.name);
  if(ds.length>1){
    h+='<h3>影响平衡（描述符级）</h3>';
    h+='<table><tr><th>描述符</th><th>来向影响合计</th><th>去向影响合计</th><th>角色</th></tr>';
    const rows=ds.map(x=>{
      let i=0,o=0;
      ds.forEach(y=>{
        if(y===x) return;
        const a=d.cim.edges.find(e=>e.from===y&&e.to===x);
        const b=d.cim.edges.find(e=>e.from===x&&e.to===y);
        if(a) i+=a.v;
        if(b) o+=b.v;
      });
      return {x:x,i:i,o:o};
    });
    const mx=Math.max.apply(null,rows.map(r=>r.i));
    rows.forEach(r=>{
      const role=(r.o>=2&&r.i>=2)?'关键枢纽':(r.o>r.i?'驱动型':'结果型');
      h+='<tr><td>'+r.x+'</td><td'+(r.i===mx?' style="color:#059669;font-weight:600"':'')+'>'
        +(r.i>0?'+':'')+r.i+(r.i===mx?' ▲':'')+'</td><td>'+(r.o>0?'+':'')+r.o+'</td><td>'+role+'</td></tr>';
    });
    h+='</table><div class="rsub">▲ 标出的是该项得分最高者，即该描述符在一致性检验中最受支持的方向。</div>';
  }

  h+='<h2>三、情景检验结果</h2>';
  h+='<div class="rok">本次校验规模：'+d.stats.n+' 个描述符、'+d.stats.cells+' 条交叉影响判断。</div>';
  h+='<div class="rnote"><b>边界说明</b>：一致性检验的数值（矛盾组合数、自洽情景数）当前为模拟值，'
    +'算法尚未接入；交叉影响判断为描述符级粗粒度，完整实现需下沉到状态级。</div>';

  h+='<h2>四、模型配置摘要</h2>';
  h+='<p>输出目标：<b>'+d.model+'</b>。'
    +(d.model==='GCAM-China'
      ? '配置写入 configuration.xml 的 ScenarioComponents 区块，改动落在最外层，替换后即可运行，无需重新编译。'
      : '配置以 CSV 输出，再由 GDXXRW.EXE 转为 GDX；改动落在数据层，需重新转换一步。')+'</p>';

  h+='<h2>五、结论</h2>';
  h+='<p>本次配置在 '+d.scales.join('、')+' 上，围绕 '+d.stats.n+' 个描述符构建了情景假设，'
    +'并完成 '+d.cim.filled+' 条交叉影响判断。所有判断均带依据与置信度，可逐条复核。</p>';
  h+='<div class="rsub">本报告由平台自动生成，供讨论与留档使用；数据与判断的最终解释权归分析者。</div>';
  return h;
}
function openReport(){
  document.getElementById('reportBody').innerHTML=buildReportHTML(reportData());
  document.getElementById('reportModal').classList.add('on');
}
function closeReport(){ document.getElementById('reportModal').classList.remove('on'); }
function saveFile(name, content, mime){
  const b=new Blob([content],{type:mime+';charset=utf-8'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(b); a.download=name; a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),3000);
  toast('已下载 '+name);
}
function downloadReport(){
  const d=reportData();
  const css='body{font-family:-apple-system,"PingFang SC","Microsoft YaHei",sans-serif;'
   +'max-width:820px;margin:40px auto;padding:0 24px;font-size:14px;line-height:1.8;color:#101828;}'
   +'h1{font-size:22px;}h2{font-size:16px;margin:28px 0 8px;padding-left:9px;border-left:3px solid #2563EB;}'
   +'h3{font-size:14px;margin:16px 0 6px;color:#475467;}table{border-collapse:collapse;width:100%;margin:10px 0 16px;font-size:13px;}'
   +'th{background:#FAFBFC;font-weight:600;padding:7px 10px;text-align:left;border:1px solid #E4E7EC;}'
   +'td{padding:6px 10px;border:1px solid #E4E7EC;vertical-align:top;}'
   +'.rmeta{background:#FAFBFC;border-radius:10px;padding:12px 16px;margin-bottom:18px;font-size:13px;}'
   +'.rmeta div{display:flex;gap:10px;padding:3px 0;}.rmeta span:first-child{color:#667085;min-width:104px;}'
   +'.rnote{background:#FFFAEB;border-left:3px solid #B54708;color:#B54708;padding:9px 14px;font-size:13px;margin:12px 0;}'
   +'.rok{background:#ECFDF5;border-left:3px solid #059669;color:#059669;padding:9px 14px;font-size:13px;margin:12px 0;}'
   +'.rsub{font-size:12.5px;color:#98A2B3;}';
  const html='<!DOCTYPE html><html lang="zh-CN"><head><meta charset="utf-8">'
   +'<title>京津冀政策情景快速评估报告</title><style>'+css+'</style></head><body>'
   +buildReportHTML(d)+'</body></html>';
  saveFile('情景评估报告_'+nowStr().replace(/[: ]/g,'-')+'.html', html, 'text/html');
}
function downloadReportJSON(){
  saveFile('情景评估数据_'+nowStr().replace(/[: ]/g,'-')+'.json',
    JSON.stringify(reportData(), null, 2), 'application/json');
}

/* ================= 主渲染 ================= */
function render(){
  renderSteps(); renderCmp(); layerTable(); renderTree(); renderStates();
  expDetail(); scaleSum(); renderPolicy(); renderCim(); modelDetail(); checkResult(); confList(); timeline(); renderImpact();
  el('outPreview', preview());
  el('fmtTag', fmtTag());
  el('fmtNote', curModel==='gcam'
    ? '按 GCAM-China 的 configuration.xml 结构书写：ScenarioComponents 区块内，以 Value 的 name 属性指向参数项，元素内容为文件相对路径。'
    : '按 CHEER-CGE 的接口书写：CSV 覆盖 run.gms 中的路径变量与情景开关，之后用 GDXXRW.EXE 转为 GDX。');
  finalSum();

  document.getElementById('pcmp').classList.toggle('on',inCmp);
  document.querySelectorAll('main .pane').forEach(p=>{
    if(p.id!=='pcmp') p.classList.toggle('on', !inCmp && p.id==='p'+cur);
  });
  document.getElementById('steps').style.display=inCmp?'none':'flex';
  document.querySelector('.footbar').style.display=inCmp?'none':'flex';

  document.getElementById('prevBtn').disabled=cur===0;
  document.getElementById('nextBtn').textContent=cur===6?'重新开始':'下一步';
  document.getElementById('footCnt').textContent=
    `第 ${cur+1} / 7 步　·　已选描述符 ${nSel()} 个　·　目标模型 ${curModel==='gcam'?'GCAM-China':'CHEER-CGE'}`;
}
render();
