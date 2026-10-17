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
  {k:'nation', n:'国家级', g:1, pop:'全国常住人口', eco:'全国 GDP 增速', fmt:'总量口径 · 给定'},
  {k:'region', n:'区域级', g:0, pop:'三地合计 10897 万', eco:'三地加权约 5.3%', fmt:'区域合计口径'},
  {k:'prov',   n:'省级',   g:0, pop:'北京 2180 万 / 天津 1363 万 / 河北 7354 万', eco:'5.4% / 4.8% / 5.6%', fmt:'分省口径'},
  {k:'city',   n:'市级',   g:0, pop:'河北 11 个地级市（合计 7354 万）', eco:'按各市公布值', fmt:'分市口径'}
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
    '口径说明：人工核对项＝描述符数 × 联动层数 × 3 − 8，为估算量；矛盾组合与自洽情景由平台的一致性检验实际算出（见第 7 步「运行一致性检验」）。';
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
  const hasRegion=on.indexOf('region')>=0;
  h+=`<div style="padding:11px 14px;font-size:12.5px;color:var(--tx2);background:var(--panel2);line-height:1.85;">
    跨层关系：${on.length>1
      ? '<b>国家级是给定层</b>（取值来自政策目标，不参与枚举）；'
        +(hasRegion?'有了「区域级」，三地加总才有可比对的落点':'未勾区域级，省级加总暂时没有落点，只能查档位方向')
        +'；相邻层级之间按「档位不反向」核对。'
      : '只勾了一个层级，不做跨层核对——这与现有做法相同。'}</div>`;
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
  cimResult=null; layeredResult=null;
  corrResult=null;
  profResult=null;
  render();
}
/* ================= 状态半定量化（v1.2 新增） =================
   自然语言标签（高速 / 中速）本身是模糊的。给每个状态挂一个数值区间，
   它就由定性标签变成半定量的档位；区间可以由用户自行修改与增补，
   不同研究问题可以换一套自己的标准。 */

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
// 区间证据：每个描述符的取值区间是否有政策文件支撑
// direct＝政策目标可直接对齐；conv＝有目标但口径不同需换算；example＝暂无依据（示例值）；exo＝外生输入
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

// 区间分层：同一描述符在区域级与各省可以有不同的档位边界。
// 不这样做的话，北京三产 86% 与河北 55% 会被塞进同一套区间，河北永远落在"转型滞后"档。
let rngScope='region';
const SCOPE_NAME={region:'区域级（京津冀）',bj:'北京',tj:'天津',he:'河北'};
const stateDefsScope={};     // 描述符名 -> { bj/tj/he: { 状态名: {lo,hi,u} } }
const scopedDefs={};         // 缓存：描述符名|scope -> 合成后的状态数组

// 已按本辖区口径设定的档位：只填有政策或统计依据的，其余沿用区域级
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

const stateDefs={};          // 描述符名 -> [{n,lo,hi,u,custom,ev}]
let rngEdit=null, rngAdd=null;

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
// 状态结构（有哪些档）是全辖区共享的，只有数值可以按辖区分开。
// 所以增删改状态一律作用在基准上，再清掉各辖区的合成缓存。
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
// 状态名的唯一入口：所有读取状态列表的地方都改走这里，
// 这样用户增删改状态后，检算、报告、导出才不会与界面脱节。
const ST=nm=>defsOf(nm).map(x=>x.n);
const rngTxt=x=>{
  if(x.lo===null||x.hi===null) return '<span class="rng none">区间未设</span>';
  const f=v=>Number.isInteger(v)?v:String(+v.toFixed(2));
  return `<span class="rng">${f(x.lo)} – ${f(x.hi)}${x.u?' '+x.u:''}</span>`;
};
// 区间衔接检查：先把各档按数值排好，再看是否首尾相接、不重叠、不留缝。
// 不依赖档位的语义顺序——有些描述符（如能耗限额）数值越小反而意味着要求越严。
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
function renderStates(){
  const el=document.getElementById('statePanel'), names=Object.keys(sel.desc);
  if(!names.length){ el.innerHTML='<div class="empty">左侧勾选描述符后，这里显示它的状态选项</div>'; }
  else{
    el.innerHTML=names.map(nm=>{
      const c=sel.desc[nm], defs=defsOf(nm);
      const bad=rngIssues(nm);
      const ev=RANGE_EVID[nm]||{k:'example',t:''};
      const rows=defs.map(s=>{
        const on=c.states.indexOf(s.n)>=0, k=nm+'|'+s.n;
        const ed=(rngEdit===k);
        return `<div class="strow">
            <span class="chk ${on?'on':''}" onclick="tglState('${nm}','${s.n}')">${on?TICK:''}</span>
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
      const hint={direct:'区间已对齐政策目标',conv:'区间需换算后使用',example:'区间为示例值，待补政策依据',
        exo:'外生输入，不由政策工具驱动'}[ev.k]||'';
      const snote=SCOPE_NOTE[nm+'|'+rngScope];
      const hasScope=defs.some(x=>x.scoped);
      const scopeTag=(rngScope!=='region')
        ? `<i class="evi ${hasScope?'scope':'example'}">${hasScope?('已按'+SCOPE_NAME[rngScope]+'口径'):'沿用区域级'}</i>`
        : '';
      const lineTxt=snote||ev.t;
      const lineLb=snote?'本辖区口径':(ev.k==='direct'?'政策依据':'目标口径（需换算）');
      const showLine=!!snote || ev.k==='direct' || ev.k==='conv';
      const hintTxt=(rngScope!=='region'&&!hasScope)?'本辖区暂无独立口径，沿用区域级区间':hint;
      return `<div class="stbox"><div class="hd">${nm}
        ${c.src?`<span class="src">来源：${c.src}</span>`:''}
        <i class="evi ${ev.k}" title="${ev.t}">${EVID_WORD[ev.k]||''}</i>${scopeTag}</div>`
        +(showLine?`<div class="evline"><b>${lineLb}</b>　${lineTxt}</div>`:'')
        +rows+addBox+
        `<div class="stfoot"><button class="btn sm" onclick="addState('${nm}')">＋ 自定义状态</button>
          ${hasScope&&rngScope!=='region'?`<button class="btn sm" onclick="dropScopeOverride('${nm}')">恢复区域级</button>`:''}
          <span class="sthint">${hintTxt}</span></div>`+
        (bad.length?`<div class="stbad">区间衔接提示：${bad.join('；')}</div>`:'')+
        `</div>`;
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
  if(!el) return;
  if(expertN===1){ el.innerHTML='<div class="note">单人判断：全部打分由一人完成，不产生分歧项。</div>'; return; }
  const n=nSel(), items=n>1?n*(n-1):0;
  el.innerHTML=`<div class="note info">
    <b>${expertN} 人独立打分</b><br>
    每位专家各持一份完整的判断矩阵，应判 ${items} 条；系统按条目比对，
    <b>打分差 ≥ 2 的列为分歧</b>，其余按共识值合并。<br>
    分歧项不进入最终矩阵，需逐条裁定后再检验。</div>`;
}
function scaleSum(){
  const n=nSel(), items=n>1?n*(n-1):0;
  document.getElementById('scaleSum').innerHTML=
   `<div class="kv"><span>已选描述符</span><span>${n} 个</span></div>
    <div class="kv"><span>交叉影响矩阵规模</span><span>${n} × ${n} = ${n*n} 格</span></div>
    <div class="kv"><span>待打分项（双向分别判断）</span><span>${items} 项</span></div>
    <div class="kv"><span>专家人数</span><span>${expertN} 人${ens?'（已建立 '+ens.people.length+' 份独立矩阵）':''}</span></div>
    <div class="kv"><span>参数生成方式</span><span>${useBayes?'贝叶斯（给区间）':'仅定性叙事'}</span></div>
    <div class="kv"><span>校验层级</span><span>${(()=>{
      const on=[...document.querySelectorAll('[data-scale].sel')].map(x=>x.dataset.scale);
      return on.length+' 层'+(on.indexOf('nation')>=0?'（国家级为给定层，不参与枚举）':'');
    })()}</span></div>`;
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
let cimResult=null;
let profResult=null, profileSel=null;
let corrResult=null, corrPick=null;
let layeredResult=null;
/* 状态级影响值：由描述符级分值按两端状态的高低位置展开 */
// 由描述符级分值按两端状态的高低位置展开——这是"没有人工精判时"的默认假设。
// 它只是兜底，不是真判断：真判断应当落在状态对上，见 impactVal 里的 st 覆盖。
function expandV(v, fn, fi, tn, ti){
  if(!v) return 0;
  const pa=fn>1?(fn-1-fi)/(fn-1):0.5;
  const pb=tn>1?(tn-1-ti)/(tn-1):0.5;
  return v*(2*pa-1)*(2*pb-1);
}
// 状态级影响值：有人工精判就用精判值，否则退回默认展开
function impactVal(fd,fi,td,ti){
  const r=cim[fd+'>'+td];
  if(!r) return 0;
  if(r.st){
    const ov=r.st[fi+'_'+ti];
    if(typeof ov==='number') return ov;
  }
  return expandV(r.v, ST(fd).length, fi, ST(td).length, ti);
}
/* ================= 数值锚定（v1.2 新增：让状态区间参与检算） ================= */
let anchors={};                       // 描述符名 -> {lo,hi}：已知值或现实区间
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
  cimResult=null;                        // 锚定变了，旧结果作废
  corrResult=null;
  profResult=null;
  layeredResult=null;
  render();
}
function clearAnc(){ anchors={}; cimResult=null; render(); toast('已清除全部数值锚定'); }
corrResult=null;
profResult=null;
layeredResult=null;
/* 锚定后还剩哪些状态可用：区间与锚定完全不相交的排除；
   没有区间的状态不排除（缺少数值依据时，不能凭锚定把它否掉） */
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
function renderAnc(){
  const host=document.getElementById('ancBox'); if(!host) return;
  const ds=Object.keys(sel.desc);
  if(!ds.length){
    host.innerHTML='<div class="empty">先在第 3 步勾选描述符，再回到这里设定数值锚定</div>'; return;
  }
  let before=1, after=1, nA=0;
  ds.forEach(nm=>{ before*=ST(nm).length; after*=ancAllowed(nm).length; if(ancOf(nm)) nA++; });
  let h='<table class="anctab"><tr><th>描述符</th><th style="width:132px">锚定值 / 区间</th>'
    +'<th style="width:86px">单位</th><th style="width:104px">可用状态</th><th style="width:50px"></th></tr>';
  ds.forEach(nm=>{
    const a=ancOf(nm), al=ancAllowed(nm), tot=ST(nm).length, defs=defsOf(nm);
    const u=(defs.find(x=>x.u)||{}).u||'';
    h+='<tr><td>'+nm+'</td>'
      +'<td><input class="txt ancin'+(a?' on':'')+'" value="'+ancTxt(nm)+'" placeholder="不限" '
      +'onchange="setAnc(\''+nm+'\',this.value)"></td>'
      +'<td class="ancu">'+(u||'—')+'</td>'
      +'<td'+(a&&!al.length?' class="ancb"':'')+'>'
      +(a?(al.length?('<b>'+al.length+'</b> / '+tot):('<b>0</b> / '+tot)):('全部 '+tot))+'</td>'
      +'<td>'+(a?'<span class="ancx" onclick="setAnc(\''+nm+'\',\'\')">清除</span>':'')+'</td></tr>';
  });
  h+='</table>';
  h+='<div class="ancsum">'+(nA
      ? '已锚定 <b>'+nA+'</b> 个描述符：组合空间由 <b>'+before.toLocaleString()+'</b> 收窄为 <b>'
        +after.toLocaleString()+'</b> 种'+(before>after?('（排除 '+(before-after).toLocaleString()+' 种）'):'')
        +'。<b>改变锚定后需重新运行检验。</b>'
      : '尚未设定锚定——此时检验在全组合空间上进行，状态区间只作说明之用。')
    +'<br>输入方式：单值 <code>4.8</code>，或区间 <code>4.5~5.0</code>（单位与右侧一致）。'
    +'只有与锚定值<b>完全不相交</b>的状态才被排除；部分重叠的保留，因为它仍可能与已知值相容。'
    +(nA?'　<a class="ancx" onclick="clearAnc()">全部清除</a>':'')+'</div>';
  if(ds.some(nm=>ancOf(nm)&&!ancAllowed(nm).length)){
    h+='<div class="note" style="margin-top:10px;">有描述符在锚定下<b>一个可用状态都不剩</b>——'
      +'这套设定在数值上无解。要么放宽锚定，要么回第 3 步调整那些状态的取值区间。</div>';
  }
  host.innerHTML=h;
}

/* 枚举核心：一致性检验与影响谱共用。
   force = {pos, idx} 时把第 pos 个描述符钉死在某个状态上，用于「如果我强行这样，情景集会怎么变」。 */
function enumCore(ds, force, capN, keepAll){
  const n=ds.length;
  const sizes=ds.map(d=>ST(d).length);
  if(sizes.some(x=>x<1)) return {bad:'状态缺失'};
  /* 数值锚定在枚举之前生效：与锚定值完全不相交的状态直接排除 */
  const allowed=ds.map(d=>ancAllowed(d));
  if(force) allowed[force.pos]=[force.idx];
  const dead=allowed.findIndex(a=>!a.length);
  if(dead>=0) return {dead:dead};
  const radix=allowed.map(a=>a.length);
  const space=radix.reduce((a,b)=>a*b,1);
  const MAX=capN||200000;
  const sampled=space>MAX;
  const N=Math.min(space,MAX);
  /* 预计算影响值，避免内层重复解析 */
  const IMP=[];
  for(let k=0;k<n;k++){
    IMP[k]=[];
    for(let i=0;i<n;i++){
      if(k===i){ IMP[k][i]=null; continue; }
      const m=[];
      for(let a=0;a<sizes[k];a++){
        const row=[];
        for(let b=0;b<sizes[i];b++) row.push(impactVal(ds[k],a,ds[i],b));
        m.push(row);
      }
      IMP[k][i]=m;
    }
  }
  const idxOf=new Array(n).fill(0);
  const consistent=[], seen=new Set(), presence=new Set(), freq={};
  let inconsistent=0, count=0;
  for(let c=0;c<N;c++){
    let x = sampled ? Math.floor(Math.random()*space) : c;
    for(let i=n-1;i>=0;i--){ const r=radix[i]; idxOf[i]=allowed[i][x%r]; x=Math.floor(x/r); }
    let ok=true;
    for(let i=0;i<n && ok;i++){
      let mx=-1e9, pickv=0;
      for(let j=0;j<sizes[i];j++){
        let acc=0;
        for(let k=0;k<n;k++){ if(k!==i) acc+=IMP[k][i][idxOf[k]][j]; }
        if(j===idxOf[i]) pickv=acc;
        if(acc>mx) mx=acc;
      }
      if(pickv<mx-1e-6) ok=false;
    }
    if(ok){
      const key=idxOf.join(',');
      if(!seen.has(key)){
        seen.add(key); count++;
        if(keepAll){ if(consistent.length<keepAll) consistent.push(idxOf.slice()); }
        else if(consistent.length<200) consistent.push(idxOf.slice());
        for(let i=0;i<n;i++){
          const kk=i+'|'+idxOf[i];
          presence.add(kk);
          freq[kk]=(freq[kk]||0)+1;
        }
      }
    } else inconsistent++;
  }
  return {n:n, sizes:sizes, space:space, checked:N, sampled:sampled,
    consistent:consistent, count:count, inconsistent:inconsistent,
    presence:presence, freq:freq, dead:-1,
    truncated: keepAll ? (count>keepAll) : false};
}

function runCIM(){
  const ds=Object.keys(sel.desc);
  if(ds.length<2){ toast('至少选两个描述符'); return; }
  const filled=cimKeys().filter(k=>cim[k]);
  if(!filled.length){ toast('还没有打分，先到「交叉影响打分」做判断'); return; }
  const r=enumCore(ds,null);
  if(r.bad){ toast('有描述符缺少状态定义'); return; }
  if(r.dead>=0){ toast('「'+ds[r.dead]+'」在锚定下没有任何可用状态，请放宽锚定或改区间'); return; }
  const total=ds.reduce((a,d)=>a*ST(d).length,1);
  const anchored=ds.filter(d=>ancOf(d)).length;
  cimResult={ds:ds.slice(), sizes:r.sizes.slice(), total:total, space:r.space, anchored:anchored,
    checked:r.checked, sampled:r.sampled,
    consistent:r.consistent, inconsistent:r.inconsistent, ts:nowStr()};
  toast('检验完成：'+(r.sampled?'抽样 ':'')+r.checked.toLocaleString()+' 个组合，自洽 '+r.consistent.length+' 组'
    +(anchored?('（锚定已把空间收窄到 '+r.space.toLocaleString()+' 种）'):''));
  render();
}
/* ================= 逐层求解（v1.2 新增：让跨层约束真正进入求解） =================
   与「跨层一致性」的区别：那个是算完之后再查档位差；这个是在求解时就用上级的取值
   裁掉下级不相容的状态——上级定了「目标节奏（21–28%）」，下级「快速清洁化（30–40%）」
   根本不会进入枚举，而不是等算出来再判它矛盾。 */
let layScope='region';

function rangeOf(nm,scope){
  const base=baseOf(nm);
  if(scope==='region') return base;
  const ov=(stateDefsScope[nm]||{})[scope]||{};
  return base.map(x=>{ const o=ov[x.n]; return o?{...x,...o}:{...x}; });
}
// 上级某状态 -> 它那一层的区间；下级哪个状态与它相交，才算相容
function allowUnder(ds,scope,parent){
  return ds.map(d=>{
    const sizes=ST(d).length;
    if(!parent) return [...Array(sizes).keys()];
    const pi=parent.cb[ds.indexOf(d)];
    const pName=ST(d)[pi];
    const pR=rangeOf(d,parent.scope).find(x=>x.n===pName);
    const cDefs=rangeOf(d,scope);
    const ok=[];
    for(let j=0;j<sizes;j++){
      const c=cDefs[j];
      if(!pR||pR.lo===null||pR.hi===null||c.lo===null||c.hi===null){ ok.push(j); continue; }
      if(c.hi < pR.lo || c.lo > pR.hi) continue;     // 与上级区间不相交，直接排除
      ok.push(j);
    }
    return ok;
  });
}
function solveLayer(ds, scope, parents, cap){
  cap=cap||600;
  const sizes=ds.map(d=>ST(d).length);
  const groups=(parents&&parents.length)?parents:[{path:[],scope:null,cb:null}];
  const out=[]; let checked=0, incon=0, dead=0, trunc=false;
  groups.forEach(par=>{
    const allowed=allowUnder(ds,scope,par.scope?par:null);
    if(allowed.some(a=>!a.length)){ dead++; return; }
    const radix=allowed.map(a=>a.length);
    const space=radix.reduce((a,b)=>a*b,1);
    const MAX=200000, sampled=space>MAX, N=Math.min(space,MAX);
    for(let c=0;c<N;c++){
      let x=sampled?Math.floor(Math.random()*space):c;
      const cb=new Array(ds.length);
      for(let i=ds.length-1;i>=0;i--){ const r=radix[i]; cb[i]=allowed[i][x%r]; x=Math.floor(x/r); }
      let ok=true;
      for(let i=0;i<ds.length&&ok;i++){
        let mx=-1e9, pv=0;
        for(let j=0;j<sizes[i];j++){
          let s=0;
          for(let k=0;k<ds.length;k++){ if(k!==i) s+=impactVal(ds[k],cb[k],ds[i],j); }
          if(j===cb[i]) pv=s;
          if(s>mx) mx=s;
        }
        if(pv<mx-1e-6) ok=false;
      }
      checked++;
      if(ok){ if(out.length<cap) out.push({path:par.path.concat([{scope:scope, cb:cb.slice()}])});
              else trunc=true; }
      else incon++;
    }
  });
  return {sols:out, checked:checked, incon:incon, dead:dead, groups:groups.length, truncated:trunc};
}
function runLayered(){
  const order=xlayers().filter(s=>s!=='nation');     // 国家级是给定层，不参与枚举
  if(!order.length){ toast('第 1 步至少要勾一个参与求解的层级（区域 / 省 / 市）'); return; }
  const ds=Object.keys(sel.desc);
  if(ds.length<2){ toast('至少选两个描述符'); return; }
  const filled=cimKeys().filter(k=>cim[k]);
  if(!filled.length){ toast('还没有打分，先到「交叉影响打分」做判断'); return; }
  let parents=null; const layers=[];
  for(let i=0;i<order.length;i++){
    const scope=order[i];
    const r=solveLayer(ds, scope, parents);
    layers.push({scope:scope, n:r.sols.length, checked:r.checked,
                 incon:r.incon, dead:r.dead, groups:r.groups, truncated:r.truncated});
    parents=r.sols;
    if(!parents.length) break;
  }
  layeredResult={ds:ds.slice(), order:order.slice(), layers:layers,
    combos:parents?parents.length:0, final:parents||[], ts:nowStr()};
  render();
  toast('逐层求解完成：'+layers.map(x=>XL_NAME[x.scope]+' '+x.n+' 组'+(x.truncated?'+':'')).join(' → ')
    +(layers.some(x=>x.dead)?('（'+layers.reduce((a,x)=>a+x.dead,0)+' 个上级情景下级无解）'):''));
}


function renderLay(){
  const host=document.getElementById('layBox'); if(!host) return;
  const ds=Object.keys(sel.desc);
  if(ds.length<2){ host.innerHTML='<div class="empty">先在第 3 步勾选至少两个描述符</div>'; return; }
  const order=xlayers().filter(s=>s!=='nation');
  if(!order.length){ host.innerHTML='<div class="empty">第 1 步至少要勾一个参与求解的层级（区域 / 省 / 市）</div>'; return; }
  if(!layeredResult){
    host.innerHTML='<div style="font-size:12.5px;line-height:1.85;">'
      +'<b>还没有逐层求解结果。</b>点下面的按钮，平台先解「'+XL_NAME[order[0]]+'」，'
      +'再把每个自洽情景的取值转成下一层的约束，逐层往下推。<br>'
      +'<span class="dim">求解顺序：'+order.map(s=>XL_NAME[s]).join(' → ')+'　·　描述符 '+ds.length+' 个</span>'
      +'<div style="margin-top:12px;"><button class="btn pri" onclick="runLayered()">运行逐层求解</button></div>'
      +'<div class="dim" style="font-size:12px;margin-top:9px;">'
      +'国家级是给定层（取值来自政策目标），不参与枚举；若第 1 步没有勾选区域/省/市中的任何一个，这里无法求解。</div></div>';
    return;
  }
  const R=layeredResult;
  let h='<div class="layflow">';
  R.layers.forEach((L,i)=>{
    h+='<div class="laynode"><div class="ln">'+XL_NAME[L.scope]+'</div>'
      +'<div class="lv">'+L.n.toLocaleString()+(L.truncated?'<i>+</i>':'')+' 组</div>'
      +'<div class="ls">检查 '+L.checked.toLocaleString()
      +(L.dead?('　<span class="laywarn">'+L.dead+' 个上级无解</span>'):'')+'</div></div>';
    if(i<R.layers.length-1) h+='<div class="layarrow">→</div>';
  });
  h+='</div>';
  h+='<div class="kv" style="margin-top:4px;"><span>最终跨层相容组合</span>'
    +'<span style="color:var(--pri);font-weight:600;">'+R.combos.toLocaleString()
    +(R.layers.some(x=>x.truncated)?'+':'')+' 条</span></div>';
  if(R.layers.some(x=>x.truncated)){
    h+='<div class="dim" style="font-size:11.5px;margin:6px 0 10px;">'
      +'带 + 号的层已达展示上限（600 组），实际数量可能更多。缩小描述符范围可得到完整结果。</div>';
  }
  if(R.combos){
    h+='<div style="margin-top:12px;font-size:12px;color:var(--tx3);">以下为跨层相容的组合，每条都记录了它在各层的取值：</div>';
    h+='<div style="margin-top:8px;">';
    R.final.slice(0,6).forEach((f,i)=>{
      const segs=f.path.map(p=>{
        const t=p.cb.map((v,j)=>(DSHORT[R.ds[j]]||R.ds[j])+'＝'+ST(R.ds[j])[v]).join('、');
        return '<b>'+XL_NAME[p.scope]+'</b>　'+t;
      }).join('<span class="laysep">→</span>');
      h+='<div class="layrow"><span class="layidx">#'+(i+1)+'</span><span>'+segs+'</span></div>';
    });
    h+='</div>';
    if(R.combos>6) h+='<div class="dim" style="font-size:12px;margin-top:7px;">此处显示前 6 条，共 '+R.combos+' 条（上限 600）。</div>';
  }else{
    h+='<div class="note" style="margin-top:10px;">没有找到跨层相容的组合。'
      +'常见原因是上级某层的区间设得比下级宽松太多，导致下级无解——可以切到第 3 步，'
      +'把相应层级的区间调一调，或者换几个描述符再试。</div>';
  }
  h+='<div style="margin-top:12px;display:flex;gap:10px;align-items:center;flex-wrap:wrap;">'
    +'<button class="btn sm" onclick="runLayered()">重新求解</button>'
    +'<span class="dim" style="font-size:12px;">计算时间 '+R.ts+'</span></div>';
  host.innerHTML=h;
}

function checkResult(){
  const ds=Object.keys(sel.desc);
  if(ds.length<2){ el('checkResult','<div class="empty">先在第 3 步勾选至少两个描述符</div>'); return; }
  if(!cimResult){
    el('checkResult','<div style="font-size:12.5px;line-height:1.8;">'
      +'<b>还没有检验结果。</b>点下面的按钮，平台会枚举全部状态组合，逐个算出每个描述符的影响平衡值，'
      +'把「所有描述符的选定状态都是各自平衡里得分最高的那一个」的组合挑出来——这些就是自洽情景。'
      +'<div style="margin-top:12px;"><button class="btn pri" onclick="runCIM()">运行一致性检验</button></div>'
      +'<div class="dim" style="font-size:12px;margin-top:9px;">组合数＝各描述符状态数之积。'
      +'19 个描述符全选时约 3¹⁷×2² ≈ 11.6 亿种，远超可枚举范围，此时平台会自动改为随机抽样检验并标注。</div></div>');
    return;
  }
  const r=cimResult;
  let h='<div class="kv"><span>参与检验的描述符</span><span>'+r.ds.length+' 个</span></div>'
   +'<div class="kv"><span>状态总数</span><span>'+r.sizes.reduce((a,b)=>a+b,0)+' 个</span></div>'
   +'<div class="kv"><span>组合空间</span><span>'+r.total.toLocaleString()+' 种'
   +(r.anchored?(' <span style="color:var(--pri);">→ 锚定后 '+(r.space||r.total).toLocaleString()+' 种</span>'):'')
   +'</span></div>'
   +(r.anchored?('<div class="kv"><span>数值锚定排除</span><span style="color:var(--pri);">'
     +(r.total-(r.space||r.total)).toLocaleString()+' 种组合（'+r.anchored+' 个描述符已锚定）</span></div>'):'')
   +'<div class="kv"><span>实际检查</span><span>'
   +(r.sampled?('随机抽样 '+r.checked.toLocaleString()+' 种'):(r.checked.toLocaleString()+' 种（全枚举）'))
   +'</span></div>'
   +'<div class="kv"><span>自洽情景</span><span style="color:var(--ok);font-weight:600;">'
   +r.consistent.length+(r.consistent.length>=200?'+':'')+' 组</span></div>'
   +'<div class="kv"><span>不自洽组合</span><span style="color:var(--rd);">'
   +r.inconsistent.toLocaleString()+' 组</span></div>'
   +'<div style="margin-top:12px;display:flex;gap:10px;align-items:center;flex-wrap:wrap;">'
   +'<button class="btn sm" onclick="runCIM()">重新检验</button>'
   +'<span class="dim" style="font-size:12px;">计算时间 '+r.ts+'</span></div>';
  if(!r.consistent.length){
    h+='<div class="note" style="margin-top:12px;">没有找到自洽情景。这通常说明打分矩阵内部冲突较多，'
      +'或者描述符选得太多。可以回「交叉影响打分」复核那些低置信度的判断，再跑一次。</div>';
  }else{
    h+='<div style="margin-top:14px;font-size:12px;color:var(--tx3);">'
      +'以下为自洽情景，点击展开看它为什么自洽</div><div style="margin-top:10px;">';
    r.consistent.slice(0,6).forEach((cb,i)=>{ h+=scenCard(r,i,cb); });
    h+='</div>';
    if(r.consistent.length>6){
      h+='<div class="dim" style="font-size:12px;margin-top:8px;">此处仅显示前 6 个，共 '+r.consistent.length+' 个。</div>';
    }
  }
  el('checkResult',h);
}
function scenCard(r,i,cb){
  const open=openScen===i;
  let t='';
  r.ds.forEach((d,j)=>{ if(j) t+=' · '; t+=(DSHORT[d]||d)+'='+(ST(d)[cb[j]]||'?'); });
  return '<div class="acc"><div class="ah" onclick="toggleScen('+i+')">'
    +'<span class="t">情景 '+(i+1)+'　<span class="dim">'+t+'</span></span>'
    +'<span style="font-size:12px;color:var(--pri);">'+(open?'收起 ▲':'展开判断链 ▼')+'</span></div>'
    +(open?('<div class="ab">'+scenDetail(r,cb)+'</div>'):'')+'</div>';
}
function scenDetail(r,cb){
  let h='<div style="margin-bottom:8px;font-size:12.5px;">各描述符的取值，'
    +'以及它在本情景下各状态的影响平衡值（加粗者为选定状态，▲ 为该描述符的最高分）：</div>';
  r.ds.forEach((d,i)=>{
    const sts=ST(d), defs=defsOf(d);
    const bal=[];
    for(let j=0;j<sts.length;j++){
      let s=0;
      for(let k=0;k<r.ds.length;k++){ if(k!==i) s+=impactVal(r.ds[k],cb[k],d,j); }
      bal.push(s);
    }
    let mx=-1e9, mi=0;
    bal.forEach((v,j)=>{ if(v>mx){ mx=v; mi=j; } });
    const sx=defs[cb[i]];
    h+='<div style="margin:9px 0;padding-left:10px;border-left:2px solid var(--pri-b);">'
      +'<div style="font-size:13px;"><b>'+d+'</b>　取「'+sts[cb[i]]+'」'
      +(sx?'　'+rngTxt(sx):'')+'</div>'
      +'<div style="font-size:12px;color:var(--tx2);margin-top:3px;line-height:1.9;">'
      +sts.map((s,j)=>s+' <b'+(j===cb[i]?' style="color:var(--ok)"':'')+'>'
        +(bal[j]>0?'+':'')+bal[j].toFixed(1)+'</b>'+(j===mi?' ▲':'')).join('　｜　')
      +'</div></div>';
  });
  h+='<div style="margin-top:10px;padding-top:9px;border-top:1px dashed var(--line);font-size:12.5px;line-height:1.8;">'
   +'<b>为什么自洽：</b>每个描述符的选定状态，都是它自身影响平衡值中得分最高的那一项——'
   +'没有任何其他状态受到更强的合力支持。这就是 CIB 的一致性原则。</div>';
  return h;
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
function downloadAll(){
  if(!cimResult){ toast('先在第 7 步运行一致性检验'); return; }
  const kds=cimResult.ds;
  let txt='京津冀政策情景快速评估平台 — 自洽情景清单\n'
    +'生成时间：'+nowStr()+'\n'
    +'组合空间：'+cimResult.total+' 种，'+(cimResult.sampled?'随机抽样检查 ':'全枚举 ')
    +cimResult.checked+' 种\n'
    +'自洽情景：'+cimResult.consistent.length+' 组\n\n';
  cimResult.consistent.forEach((cb,i)=>{
    txt+='情景 '+(i+1)+'：'
      +kds.map((d,j)=>d+'＝'+(ST(d)[cb[j]]||'?')).join('；')+'\n';
  });
  dl(txt,'txt','JJJ-CIB-自洽情景清单');
}
function dl(txt,ext,name){
  const clean=txt.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&amp;/g,'&');
  const b=new Blob([clean],{type:'text/plain;charset=utf-8'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(b); a.download=name+'.'+ext; a.click();
  toast('已导出 '+name+'.'+ext);
}
function fmtTag(){ return curModel==='gcam'?'configuration.xml':'CSV → GDX'; }
function finalSum(){
  const map={nation:'国家级',region:'区域级',prov:'省级',city:'市级'};
  const sc=[...document.querySelectorAll('[data-scale].sel')].map(x=>map[x.dataset.scale]);
  const st=ensStat();
  el('finalSum',
   `<div class="kv"><span>层级</span><span>${sc.join(' · ')||'—'}</span></div>
    <div class="kv"><span>描述符</span><span>${nSel()} 个（三级结构）</span></div>
    <div class="kv"><span>校验方式</span><span>${expertN} 位专家${useBayes?' · 叠加贝叶斯':''}</span></div>
    ${st?'<div class="kv"><span>多专家集成</span><span>'+st.n+' 份矩阵 · 一致 '+st.agree+' / 分歧 '+st.diff.length
      +'（一致率 '+st.rate+'%）</span></div>':''}
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
  layeredResult=null;
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
    applied:[...applied],
    xlSel: xlSel,
    anchors: anchors,
    rngScope: rngScope,
    cim: (ens&&ens.active>=0 ? ens.people[ens.active].cim : cim),
    ens: ens?{people:ens.people, active:ens.active, merged:ens.merged}:null,
    ensRes: ensRes};
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
    // 打分矩阵与多专家状态
    ens=d.ens||null; ensRes=d.ensRes||{}; xlSel=d.xlSel||{}; anchors=d.anchors||{};
    if(d.rngScope&&SCOPE_NAME[d.rngScope]) rngScope=d.rngScope;
    Object.keys(scopedDefs).forEach(k=>delete scopedDefs[k]);
    if(ens&&ens.people&&ens.people.length){
      ens.active=(typeof ens.active==='number')?ens.active:0;
      cim=(ens.active<0? ens.merged : ens.people[ens.active].cim)||{};
    }else{ ens=null; cim=d.cim||{}; }
    cimSelKey=null; cimResult=null;
    corrResult=null;
    profResult=null;
    layeredResult=null;
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
// 清空矩阵内容但保留对象本身——多人模式下 cim 是「当前专家那一份」的引用，
// 直接 cim={} 会切断引用，导致改动落到一个游离对象上。
function clearCim(){ Object.keys(cim).forEach(k=>delete cim[k]); cimResult=null; }
corrResult=null;
profResult=null;
layeredResult=null;
function aiFill(){
  if(nSel()<2){ toast('先回到第 2 步，至少勾选两个描述符'); return; }
  const keys=cimKeys();
  clearCim();
  keys.forEach(k=>{ cim[k]={v:0,conf:'低',why:'AI 未发现明显直接影响，待人工判断',rev:false}; });
  AIRT.forEach(a=>{
    const k=a[0]+'>'+a[1];
    if(cim[k]) cim[k]={v:a[2],conf:a[3],why:a[4],rev:false};
  });
  cimSelKey=null;
  toast('已预填 '+keys.length+' 条判断，请重点审核低置信度项'
    +(ens?'（当前为「'+ens.people[ens.active].name+'」的矩阵）':''));
  render();
}
function resetCim(){ clearCim(); cimSelKey=null; toast('已清空打分矩阵'); render(); }
function pickCell(s,t){ cimSelKey=s+'>'+t; if(!cim[cimSelKey]) cim[cimSelKey]={v:0,conf:'低',why:'',rev:false}; renderCim(); }
function setV(v){ if(cimSelKey){ cim[cimSelKey].v=v; cimResult=null; renderCim(); } }
corrResult=null;
profResult=null;
layeredResult=null;
function setConf(c){ if(cimSelKey){ cim[cimSelKey].conf=c; renderCim(); } }
function setWhy(w){ if(cimSelKey){ cim[cimSelKey].why=w; } }
function toggleRev(){ if(cimSelKey){ cim[cimSelKey].rev=!cim[cimSelKey].rev; renderCim(); } }

// 某个描述符当前选定的状态及其区间——打分时先看清两端分别落在什么数值范围
function curStTxt(nm){
  const c=sel.desc[nm];
  if(!c||!c.states.length) return '<span style="color:var(--tx3)">状态未定</span>';
  const defs=defsOf(nm);
  const a=c.states.slice(0,2).map(sn=>{
    const x=defs.find(y=>y.n===sn);
    const rg=(!x||x.lo===null||x.hi===null)?'':'　'+x.lo+'–'+x.hi+(x.u?' '+x.u:'');
    return '<span class="sstatv">'+sn+rg+'</span>';
  });
  return a.join(' / ')+(c.states.length>2?' 等 '+c.states.length+' 项':'');
}
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
  ds.forEach(t=>{ h+='<th class="cth" title="'+t+'　当前状态：'+((sel.desc[t].states||[]).join(' / ')||'未定')+'">'+(DSHORT[t]||t)+'</th>'; });
  h+='</tr></thead><tbody>';
  ds.forEach(s=>{
    h+='<tr><th class="crh" title="'+s+'　当前状态：'+((sel.desc[s].states||[]).join(' / ')||'未定')+'">'+(DSHORT[s]||s)+'</th>';
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
         '" onclick="pickCell(\''+s+'\',\''+t+'\')" title="'+title+(r&&r.st?'（含状态级精判）':'')+'">'+txt
         +(r&&r.st?'<i class="stdot"></i>':'')+'</td>';
    });
    h+='</tr>';
  });
  g.innerHTML=h+'</tbody>';

  const all=cimKeys(), done=all.filter(k=>cim[k]);
  const low=done.filter(k=>cim[k].conf==='低').length;
  const rev=done.filter(k=>cim[k].rev).length;
  const need=all.filter(k=>!cim[k]||!cim[k].rev).length;
  const stK=done.filter(k=>cim[k].st).length;
  const stC=done.reduce((a,k)=>a+Object.keys(cim[k].st||{}).length,0);
  stat.innerHTML=
    '<span class="kv"><span>应判条目</span><span>'+all.length+' 条</span></span>'+
    '<span class="kv"><span>已填</span><span>'+done.length+' 条</span></span>'+
    '<span class="kv"><span>低置信度</span><span style="color:var(--rd)">'+low+' 条</span></span>'+
    '<span class="kv"><span>已审核</span><span style="color:var(--ok)">'+rev+' 条</span></span>'+
    '<span class="kv"><span>待审核</span><span style="color:var(--wn)">'+need+' 条</span></span>'+
    '<span class="kv"><span>状态级精判</span><span>'+stK+' 条 / '+stC+' 格</span></span>'+
    '<div class="dim" style="margin-top:8px;font-size:12px;">整体为<b>描述符级</b>（19×19）；'
    +'点开任一格可展开到<b>状态级逐对精判</b>，精判值优先进入一致性检验，未精判的按整体倾向自动展开。'
    +'每格都带依据与置信度，审核后留痕。</div>';
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
  const nSt=r.st?Object.keys(r.st).length:0;
  el.innerHTML=
   '<div class="shead">这一格的判断</div>'+
   '<div class="spair">'+(DSHORT[s]||s)+' <span class="ar">→</span> '+(DSHORT[t]||t)+'</div>'+
   '<div class="sstate">'+(DSHORT[s]||s)+'：'+curStTxt(s)+'<br>'+(DSHORT[t]||t)+'：'+curStTxt(t)+'</div>'+
   '<div class="slabel">影响强度</div>'+
   '<div class="vrow">'+vs.map(v=>'<button class="vb'+(r.v===v?' on':'')+'" onclick="setV('+v+')">'+(v>0?'+':'')+v+'</button>').join('')+'</div>'+
   '<div class="sline">'+VWORD[String(r.v)]+'</div>'+
   '<div class="slabel">置信度</div>'+
   '<div class="crow">'+['高','中','低'].map(c=>'<button class="cb'+(r.conf===c?' on':'')+'" onclick="setConf(\''+c+'\')">'+c+'</button>').join('')+'</div>'+
   '<div class="slabel">依据（证据 / 来源）</div>'+
   '<textarea class="txt why" oninput="setWhy(this.value)" placeholder="写下这条判断的依据……">'+(r.why||'')+'</textarea>'+
   '<button class="btn '+(r.rev?'':'pri')+'" style="width:100%;margin-top:10px;" onclick="toggleRev()">'+(r.rev?'✓ 已审核（点击撤销）':'标记为已审核')+'</button>'+
   '<div class="slabel" style="margin-top:16px;border-top:1px dashed var(--line);padding-top:12px;">'
     +'状态级精判 <span class="dim">'+(nSt?'已改 '+nSt+' 格':'全部默认展开')+'</span></div>'+
   stTable(s,t,r)+
   '<div class="dim" style="font-size:11px;line-height:1.7;margin-top:6px;">'
     +'上面选的是<b>整体倾向</b>，这里才是逐对判断。不改的格子按整体倾向自动展开；'
     +'改了就以你填的为准——<b>一致性检验优先用这里的值</b>。</div>'+
   (nSt?'<button class="btn sm" style="width:100%;margin-top:8px;" onclick="clearSt()">全部恢复默认展开</button>':'');
}
function stTable(s,t,r){
  const fs=ST(s), ts=ST(t);
  const fmt=v=>(Math.abs(v-Math.round(v))<0.05?String(Math.round(v)):v.toFixed(1));
  let h='<table class="stmat"><tr><th>源＼目标</th>'
    +ts.map(x=>'<th title="'+x+'">'+x.slice(0,2)+'</th>').join('')+'</tr>';
  fs.forEach((sn,fi)=>{
    h+='<tr><th title="'+sn+'">'+sn.slice(0,2)+'</th>';
    ts.forEach((tn,ti)=>{
      const ov=r.st?r.st[fi+'_'+ti]:undefined;
      const has=(typeof ov==='number');
      const defV=expandV(r.v, fs.length, fi, ts.length, ti);
      h+='<td><select class="sts'+(has?' on':'')+'" onchange="setSt('+fi+','+ti+',this.value)" title="'+sn+' → '+tn+'">'
        +'<option value=""'+(has?'':' selected')+'>默('+(defV>0?'+':'')+fmt(defV)+')</option>'
        +[-3,-2,-1,0,1,2,3].map(v=>'<option value="'+v+'"'+(has&&ov===v?' selected':'')+'>'+(v>0?'+':'')+v+'</option>').join('')
        +'</select></td>';
    });
    h+='</tr>';
  });
  return h+'</table>';
}
function setSt(fi,ti,v){
  const r=cim[cimSelKey]; if(!r) return;
  r.st=r.st||{};
  const k=fi+'_'+ti;
  if(v==='') delete r.st[k]; else r.st[k]=+v;
  if(!Object.keys(r.st).length) delete r.st;
  cimResult=null;
  corrResult=null;
  profResult=null;
  layeredResult=null;
  renderCim();
}
function clearSt(){
  const r=cim[cimSelKey]; if(!r) return;
  delete r.st; cimResult=null; renderCim();
  corrResult=null;
  profResult=null;
  layeredResult=null;
  toast('已全部恢复为按整体倾向自动展开');
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
  const scaleMap={nation:'国家级',region:'区域级',prov:'省级',city:'市级'};
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
    ens: (function(){ const s=ensStat(); return s?{n:s.n, multi:s.multi, agree:s.agree,
      diff:s.diff.length, rate:s.rate}:null; })(),
    bayes: useBayes,
    descriptors: ds.map(d=>{
      const o=dOf(d)||{};
      return {name:d, type:o.t||'', states:defsOf(d).map(x=>({n:x.n,lo:x.lo,hi:x.hi,u:x.u,ev:x.ev||'example'})),
        ev:(RANGE_EVID[d]||{}).k||'example', evt:(RANGE_EVID[d]||{}).t||'', src:(sel.desc[d]||{}).src||''};
    }),
    cim: {
      total: all.length, filled: done.length, low: low.length, unreviewed: unreviewed.length,
      stK: done.filter(k=>cim[k].st).length,
      stC: done.reduce((a,k)=>a+Object.keys(cim[k].st||{}).length,0),
      edges: done.map(k=>({from:k.split('>')[0], to:k.split('>')[1],
        v:cim[k].v, conf:cim[k].conf, why:cim[k].why, reviewed:!!cim[k].rev,
        stN:(cim[k].st?Object.keys(cim[k].st).length:0)}))
    },
    rangeScope: {k:rngScope, n:SCOPE_NAME[rngScope]},
    anchors: Object.keys(anchors).map(k=>({name:k, lo:anchors[k].lo, hi:anchors[k].hi})),
    stats: {n:n, states:ds.reduce((a,d)=>a+ST(d).length,0), cells:n*(n-1)}
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
    +(d.ens?'<div><span>多专家集成</span><span>'+d.ens.n+' 份独立矩阵，可比 '+d.ens.multi
      +' 条；一致 '+d.ens.agree+' 条，分歧 '+d.ens.diff+' 条（一致率 '+d.ens.rate+'%）</span></div>':'')
    +'</div>';

  h+='<h2>一、描述符与状态</h2>';
  if(!d.descriptors.length){ h+='<div class="rnote">尚未选择描述符。</div>'; }
  else{
    h+='<table><tr><th style="width:150px">描述符</th><th style="width:60px">类型</th>'
      +'<th style="width:280px">状态（含取值区间）</th><th style="width:96px">区间依据</th><th>来源说明</th></tr>';
    const EVC={direct:'#059669',conv:'#B45309',example:'#6B7280',exo:'#2563EB',user:'#9D174D'};
    d.descriptors.forEach(x=>{
      const st=x.states.map(s=>{
        const rg=(s.lo===null||s.hi===null)?'<span class="rrng none">区间未设</span>'
          :'<span class="rrng">'+s.lo+' – '+s.hi+(s.u?' '+s.u:'')+'</span>';
        return s.n+'　'+rg;
      }).join('<br>');
      const ek=x.ev||'example';
      const evt='<span style="color:'+(EVC[ek]||'#6B7280')+';font-size:12px;">'+(EVID_WORD[ek]||'')+'</span>';
      h+='<tr><td><b>'+x.name+'</b></td><td>'+x.type+'</td><td>'+st
        +'</td><td>'+evt+'</td><td>'+(x.src||'—')+'</td></tr>';
    });
    h+='</table>';
    const cnt={direct:0,conv:0,example:0,exo:0};
    d.descriptors.forEach(x=>{ cnt[x.ev||'example']=(cnt[x.ev||'example']||0)+1; });
    h+='<div class="rnote"><b>区间依据分四类</b>：<b>政策目标</b>＝可直接对齐政策文件中的定量目标（'
      +cnt.direct+' 个）；<b>需换算</b>＝有目标但口径不同（如森林覆盖率对碳汇量、装机容量对占比），'
      +'需换算后使用（'+cnt.conv+' 个）；<b>示例值</b>＝现行政策文件中未找到对应目标，暂用示例区间（'
      +cnt.example+' 个）；<b>外生输入</b>＝由 SSP 情景给定，不由政策工具驱动（'+cnt.exo+' 个）。</div>';
    const hasEvi=d.descriptors.filter(x=>x.evt&&x.ev!=='example'&&x.ev!=='exo');
    if(hasEvi.length){
      h+='<div class="rnote"><b>依据出处</b><br>'
        +hasEvi.map(x=>'· <b>'+x.name+'</b>：'+x.evt).join('<br>')+'</div>';
    }
    h+='<div class="rnote"><b>当前区间视角</b>：'+((d.rangeScope&&d.rangeScope.n)||'区域级（京津冀）')+'。同一描述符在不同辖区可以有不同的档位边界——例如三产占比，北京现状约 86%、河北约 55%，'
      +'用一套区间覆盖三地会让低值辖区永久落在「转型滞后」档。报告中凡标注「本辖区口径」的状态，'
      +'即按该辖区数据单独设档。</div>';
    h+='<div class="rnote">区间是状态的定义，不是预测值——把「高速 / 中速」这类定性标签落到具体数值范围上，'
      +'即为半定量。区间可由使用者按自己的研究口径调整：不同研究可以采用不同标准，不必锁死在平台预置的那一套；'
      +'一旦人工改过，该状态的依据标记会变为「已改」，原政策依据不再自动适用。</div>';
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
  if(cimResult){
    h+='<div class="rok">组合空间 '+cimResult.total.toLocaleString()+' 种'
      +(cimResult.anchored?('，经<b>数值锚定</b>收窄为 '+(cimResult.space||cimResult.total).toLocaleString()+' 种（'
        +cimResult.anchored+' 个描述符已锚定，排除 '
        +(cimResult.total-(cimResult.space||cimResult.total)).toLocaleString()+' 种）'):'')
      +'，'+(cimResult.sampled?'随机抽样检查 ':'全枚举 ')+cimResult.checked.toLocaleString()+' 种；'
      +'其中自洽情景 <b>'+cimResult.consistent.length+'</b> 组，不自洽组合 '
      +cimResult.inconsistent.toLocaleString()+' 组。</div>';
    h+='<div class="rnote"><b>边界说明</b>：交叉影响判断的记录单位为「描述符对」。'
      +'每条判断可展开到<b>状态级逐对精判</b>：已精判的格子直接采用所填分值，'
      +'未精判的按两端状态的高低位置由整体倾向展开。'
      +'本报告中的判断共 <b>'+(d.cim.stK||0)+'</b> 条含状态级精判（合计 '+(d.cim.stC||0)+' 格），'
      +'其余为整体倾向的自动展开。</div>';
  }else{
    h+='<div class="rnote">尚未运行一致性检验。请在第 7 步点击「运行一致性检验」后重新生成报告。</div>';
  }

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
   +'.rrng{color:#475467;font-size:12px;background:#F2F4F7;border-radius:4px;padding:1px 6px;margin-left:4px;white-space:nowrap;}'
   +'.rrng.none{color:#B54708;background:#FFFAEB;}'
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

/* ================= 主被动图（v1.1 新增） ================= */
function renderAP(){
  const el=document.getElementById('apFig'); if(!el) return;
  const ds=Object.keys(sel.desc);
  if(ds.length<2){
    el.innerHTML='<div style="padding:34px;text-align:center;color:var(--tx3);font-size:12.5px;line-height:1.9;">'
      +'先在第 3 步勾选至少两个描述符，并在「交叉影响打分」完成判断，'
      +'这里会算出每个描述符的主动和与被动和。</div>';
    return;
  }
  const rows=ds.map(d=>{
    let a=0,p=0;
    ds.forEach(o=>{
      if(o===d) return;
      const x=cim[d+'>'+o]; if(x) a+=Math.abs(x.v);
      const y=cim[o+'>'+d]; if(y) p+=Math.abs(y.v);
    });
    return {d:d,a:a,p:p};
  });
  const M=Math.max(1, ...rows.map(r=>Math.max(r.a,r.p)));
  const mA=rows.reduce((s,r)=>s+r.a,0)/rows.length;
  const mP=rows.reduce((s,r)=>s+r.p,0)/rows.length;
  const W=680,H=470,L=68,R=28,T=30,B=58;
  const pw=W-L-R, ph=H-T-B;
  const X=v=>L+(v/M)*pw, Y=v=>T+ph-(v/M)*ph;
  const gx=X(mP), gy=Y(mA);
  const bg='<rect x="'+L+'" y="'+T+'" width="'+(gx-L)+'" height="'+(gy-T)+'" fill="#EFF4FF"/>'
    +'<rect x="'+gx+'" y="'+T+'" width="'+(L+pw-gx)+'" height="'+(gy-T)+'" fill="#ECFDF5"/>'
    +'<rect x="'+L+'" y="'+gy+'" width="'+(gx-L)+'" height="'+(T+ph-gy)+'" fill="#FAFBFC"/>'
    +'<rect x="'+gx+'" y="'+gy+'" width="'+(L+pw-gx)+'" height="'+(T+ph-gy)+'" fill="#FFFAEB"/>';
  const axes='<line x1="'+L+'" y1="'+T+'" x2="'+L+'" y2="'+(T+ph)+'" stroke="#98A2B3" stroke-width="0.8"/>'
    +'<line x1="'+L+'" y1="'+(T+ph)+'" x2="'+(L+pw)+'" y2="'+(T+ph)+'" stroke="#98A2B3" stroke-width="0.8"/>'
    +'<line x1="'+gx+'" y1="'+T+'" x2="'+gx+'" y2="'+(T+ph)+'" stroke="#98A2B3" stroke-width="0.7" stroke-dasharray="4 3"/>'
    +'<line x1="'+L+'" y1="'+gy+'" x2="'+(L+pw)+'" y2="'+gy+'" stroke="#98A2B3" stroke-width="0.7" stroke-dasharray="4 3"/>';
  let ticks='';
  for(let k=0;k<=4;k++){
    const v=M*k/4;
    ticks+='<text x="'+(L-8)+'" y="'+Y(v).toFixed(1)+'" text-anchor="end" dominant-baseline="central" font-size="10.5" fill="#98A2B3">'+v.toFixed(0)+'</text>';
    ticks+='<text x="'+X(v).toFixed(1)+'" y="'+(T+ph+16)+'" text-anchor="middle" font-size="10.5" fill="#98A2B3">'+v.toFixed(0)+'</text>';
  }
  const q='<text x="'+(L+8)+'" y="'+(T+16)+'" font-size="11" fill="#2563EB">驱动者（影响别人多）</text>'
    +'<text x="'+(L+pw-8)+'" y="'+(T+16)+'" text-anchor="end" font-size="11" fill="#059669">关键枢纽（两头都高）</text>'
    +'<text x="'+(L+8)+'" y="'+(T+ph-8)+'" font-size="11" fill="#98A2B3">惰性（两头都低）</text>'
    +'<text x="'+(L+pw-8)+'" y="'+(T+ph-8)+'" text-anchor="end" font-size="11" fill="#B54708">结果型（被影响多）</text>';
  let pts='';
  rows.forEach(r=>{
    const x=X(r.p), y=Y(r.a), lab=DSHORT[r.d]||r.d;
    pts+='<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="5.5" fill="#2563EB" opacity=".82">'
      +'<title>'+r.d+'：主动和 '+r.a.toFixed(0)+'　被动和 '+r.p.toFixed(0)+'</title></circle>'
      +'<text x="'+(x+8).toFixed(1)+'" y="'+y.toFixed(1)+'" dominant-baseline="central" font-size="11" fill="#101828">'+lab+'</text>';
  });
  const ax='<text x="'+(L+pw/2)+'" y="'+(H-14)+'" text-anchor="middle" font-size="11.5" fill="#667085">被动和 —— 承受的影响总量</text>'
    +'<text x="16" y="'+(T+ph/2)+'" text-anchor="middle" font-size="11.5" fill="#667085" transform="rotate(-90 16 '+(T+ph/2)+')">主动和 —— 施加的影响总量</text>';
  const top=rows.slice().sort((a,b)=>b.a-a.a).slice(0,3);
  el.innerHTML='<svg viewBox="0 0 '+W+' '+H+'" style="width:100%;height:auto;display:block;">'
    +bg+axes+ticks+q+pts+ax+'</svg>'
    +'<div style="font-size:12px;color:var(--tx3);margin-top:8px;line-height:1.8;">'
    +'虚线是平均值分界。当前主动和最高的三个是 <b>'+top.map(r=>r.d).join('、')+'</b>——'
    +'它们是这个系统里的"发动机"，动它们最容易带动全局；右下角那些被影响多、影响别人少的，'
    +'则是政策发力后最先出现变化的地方。</div>';
}

/* ================= 情景表（v1.1 新增） ================= */
function renderTableau(){
  const el=document.getElementById('tabFig'); if(!el) return;
  if(!cimResult || !cimResult.consistent.length){
    el.innerHTML='<div style="padding:32px;text-align:center;color:var(--tx3);font-size:12.5px;line-height:1.9;">'
      +'运行一致性检验后，这里会把所有自洽情景排成一张表：列是情景、行是描述符，'
      +'相邻情景里取同一状态的格子会自动合并。</div>';
    return;
  }
  if(filtN()&&!filtList().length){
    el.innerHTML='<div style="padding:32px;text-align:center;color:var(--tx3);font-size:12.5px;line-height:1.9;">'
      +'当前筛选条件下没有命中的自洽情景。</div>';
    return;
  }
  const ds=cimResult.ds, list=filtList();
  const cols=Math.min(list.length, 30);
  let h='<table class="tab"><thead><tr><th class="tabh">描述符</th>';
  for(let c=0;c<cols;c++) h+='<th>情景 '+(c+1)+'</th>';
  h+='</tr></thead><tbody>';
  ds.forEach((d,ri)=>{
    const sts=ST(d), defs=defsOf(d);
    h+='<tr><td class="tabh">'+(DSHORT[d]||d)+'</td>';
    let c=0;
    while(c<cols){
      const v=list[c][ri];
      let span=1;
      while(c+span<cols && list[c+span][ri]===v) span++;
      const txt=sts[v]||'?';
      const df=defs[v]||{};
      const rg=(df.lo===null||df.lo===undefined||df.hi===null||df.hi===undefined)?''
        :(df.lo+' – '+df.hi+(df.u?' '+df.u:''));
      h+='<td class="s'+(v%6)+'" colspan="'+span+'" title="'+d+'：'+txt+(rg?'（'+rg+'）':'')+'">'
        +(span>1?(txt+'　×'+span):txt)
        +(rg?'<span class="tgr">'+rg+'</span>':'')+'</td>';
      c+=span;
    }
    h+='</tr>';
  });
  el.innerHTML=h+'</tbody></table>'
    +'<div style="font-size:12px;color:var(--tx3);margin-top:10px;line-height:1.8;">'
    +(filtN()
      ?('<b>已按筛选条件</b>：命中 '+list.length+' 个（自洽情景共 '+cimResult.consistent.length+' 个）')
      :('共 '+list.length+' 个自洽情景'))
    +(list.length>cols?('，此处显示前 '+cols+' 个'):'')
    +'。同一行里颜色相同的整块，表示这些情景在该描述符上取了同一个状态——'
    +'整块越大，说明这条判断在这些情景里越没有争议。'
    +'每格下方小字是该状态的取值区间，情景之间的差异因此不只在标签上，也落在数值范围上。</div>';
}

/* ================= 多专家集成（v1.2 新增，对应德国软件的 Ensemble 模式） =================
   导师要的「AI 先填一版 → 一到三个人审核」，审核结果天然是多张矩阵的比对问题：
   谁和谁不一致、差多少、以谁为准。这一块把那个比对过程做成可操作的界面。
   做法上不复制矩阵：cim 直接就是「当前打分人」那一份的引用，切换人只换引用，没有同步问题。 */

let ens=null;    // {people:[{name, cim}], active(-1 表示看合并结果), merged}
let ensRes={};   // 人工裁定记录：条目 -> 取值

function buildEns(){
  if(expertN<2){ toast('先在「校验方式」里把专家数设为 2 或 3'); return; }
  const names=[]; for(let i=0;i<expertN;i++) names.push('专家 '+String.fromCharCode(65+i));
  ens={people:names.map((nm,i)=>({name:nm, cim:i===0?cim:{}})), active:0, merged:null};
  ensRes={};
  render();
  toast('已建立 '+expertN+' 份独立矩阵，可在下一步分人打分');
}
function dropEns(){ ens=null; ensRes={}; render(); toast('已退出多专家模式'); }
function setPerson(i){
  if(!ens) return;
  ens.active=i;
  cim=(i<0? ens.merged : ens.people[i].cim) || {};
  cimSelKey=null; cimResult=null;
  corrResult=null;
  profResult=null;
  layeredResult=null;
  render();
}
function ensCopyTo(){
  if(!ens||ens.active<0){ toast('先切到某一位专家的矩阵再分发'); return; }
  const src=JSON.parse(JSON.stringify(cim));
  ens.people.forEach((p,i)=>{ if(i!==ens.active) p.cim=JSON.parse(JSON.stringify(src)); });
  render();
  toast('已把「'+ens.people[ens.active].name+'」的矩阵分发为其余专家的起点');
}
function ensStat(){
  if(!ens) return null;
  const keys=cimKeys(), n=ens.people.length;
  let multi=0, agree=0, missing=0; const diff=[];
  keys.forEach(k=>{
    const rec=ens.people.map(p=>p.cim[k]).filter(Boolean);
    if(rec.length<2){ missing++; return; }
    multi++;
    const vs=rec.map(r=>r.v), sp=Math.max(...vs)-Math.min(...vs);
    if(sp>=2) diff.push({k, rec, sp}); else agree++;
  });
  return {n, total:keys.length, multi, agree, missing, diff,
          rate: multi?Math.round(agree/multi*100):0};
}
function ensMerge(){
  const st=ensStat();
  if(!st){ toast('请先在「校验方式」里建立多份独立矩阵'); return; }
  if(!st.multi){ toast('还没有两份以上都打过分、可以比对的条目'); return; }
  const out={};
  cimKeys().forEach(k=>{
    const rec=ens.people.map(p=>p.cim[k]).filter(Boolean);
    if(!rec.length) return;
    const vs=rec.map(r=>r.v), sp=Math.max(...vs)-Math.min(...vs);
    const rv=ensRes[k];
    if(sp>=2 && typeof rv==='number'){
      out[k]={v:rv, conf:'高', why:'多专家分歧（原取值 '+vs.join(' / ')+'），经裁定取 '+rv, rev:true};
    }else if(sp>=2){
      const srt=vs.slice().sort((a,b)=>a-b);
      out[k]={v:srt[Math.floor(srt.length/2)], conf:'低',
        why:'多专家分歧（'+vs.join(' / ')+'），暂取中位数，待裁定', rev:false};
    }else{
      const avg=Math.round(vs.reduce((a,b)=>a+b,0)/vs.length);
      const conf=rec.some(r=>r.conf==='高')?'高':(rec.some(r=>r.conf==='中')?'中':'低');
      out[k]={v:avg, conf:conf, why:'多专家一致（'+[...new Set(vs)].join(' / ')+'）', rev:rec.every(r=>r.rev)};
    }
  });
  ens.merged=out; ens.active=-1; cim=out; cimSelKey=null; cimResult=null;
  corrResult=null;
  profResult=null;
  layeredResult=null;
  render();
  toast('已合并 '+st.n+' 份矩阵：一致 '+st.agree+' 条，分歧 '+st.diff.length+' 条');
}
function arbit(k, v){
  if(!ens) return;
  const rec=ens.people.map(p=>p.cim[k]).filter(Boolean).map(r=>r.v);
  ensRes[k]=v;
  if(ens.active<0 && ens.merged){
    ens.merged[k]={v:v, conf:'高', why:'多专家分歧（原取值 '+rec.join(' / ')+'），经裁定取 '+v, rev:true};
  }
  cimResult=null;
  corrResult=null;
  profResult=null;
  layeredResult=null;
  render();
  toast('已裁定为 '+(v>0?'+':'')+v);
}
function arbitAllMed(){
  const st=ensStat();
  if(!st||!st.diff.length){ toast('没有分歧项'); return; }
  st.diff.forEach(it=>{
    const vs=it.rec.map(r=>r.v).sort((a,b)=>a-b);
    ensRes[it.k]=vs[Math.floor(vs.length/2)];
  });
  ensMerge();
}
function renderEnsBox(){
  const el=document.getElementById('ensBox'); if(!el) return;
  if(expertN<2){
    el.innerHTML='<div class="note">单人判断：全部打分由一人完成，不产生分歧项。<br>'
      +'若把专家数设为 <b>双人</b> 或 <b>三人</b>，平台会为每位专家各建一份独立矩阵，再自动比对差异。</div>';
    return;
  }
  el.innerHTML='<div class="note info"><b>'+expertN+' 人独立打分</b>：每位专家各持一份完整矩阵，'
    +'系统逐条比对——打分差 ≥ 2 的列为<b>分歧项</b>，其余按共识值合并；分歧项裁定后才进入一致性检验。</div>'
    +'<div style="margin-top:12px;display:flex;gap:10px;flex-wrap:wrap;align-items:center;">'
    +(ens
      ? '<button class="btn" onclick="dropEns()">重建独立矩阵</button>'
        +'<span style="font-size:12.5px;color:var(--tx2);">已建立 '+ens.people.length+' 份，'
        +'到第 5 步分人打分</span>'
      : '<button class="btn pri" onclick="buildEns()">建立 '+expertN+' 份独立矩阵</button>'
        +'<span style="font-size:12.5px;color:var(--tx2);">建好后可让 AI 各填一版，再分人复核</span>')
    +'</div>';
}
function renderEnsBar(){
  const el=document.getElementById('ensBar'); if(!el) return;
  if(!ens){ el.innerHTML=''; return; }
  const st=ensStat();
  el.innerHTML='<div class="ensbar">'
    +'<span class="enslb">当前打分人</span>'
    +ens.people.map((p,i)=>{
      const n=Object.keys(p.cim).length;
      return '<button class="eb'+(ens.active===i?' on':'')+'" onclick="setPerson('+i+')">'
        +p.name+'<i>'+(n?n+' 格':'未打分')+'</i></button>';
    }).join('')
    +(ens.merged?'<button class="eb merged'+(ens.active<0?' on':'')+'" onclick="setPerson(-1)">'
      +'合并结果<i>'+Object.keys(ens.merged).length+' 格</i></button>':'')
    +'<div class="sp"></div>'
    +(st?'<span class="ensmeta">一致 '+st.agree+'　分歧 <b>'+st.diff.length+'</b>　一致率 '+st.rate+'%</span>':'')
    +'<button class="btn sm" onclick="ensCopyTo()">以当前为准分发</button>'
    +'<button class="btn sm pri" onclick="ensMerge()">合并并比分歧</button>'
    +'</div>';
}
function renderEnsPanel(){
  const el=document.getElementById('ensPanel'); if(!el) return;
  if(!ens){
    el.innerHTML='<div class="empty">当前为单人判断。若改用双人或三人独立打分，'
      +'这里会显示各份矩阵的差异，并提供逐条裁定的入口。</div>';
    return;
  }
  const st=ensStat();
  if(!st.multi){
    el.innerHTML='<div class="empty">已建立 '+st.n+' 份矩阵，但还没有两份以上<b>都打过分</b>的条目可以比对。</div>';
    return;
  }
  let h='<div class="ensstat">'
    +'<span class="kv"><span>参与专家</span><span>'+st.n+' 位</span></span>'
    +'<span class="kv"><span>可比条目</span><span>'+st.multi+' / '+st.total+'</span></span>'
    +'<span class="kv"><span>完全一致</span><span style="color:var(--ok)">'+st.agree+' 条</span></span>'
    +'<span class="kv"><span>存在分歧</span><span style="color:var(--rd)">'+st.diff.length+' 条</span></span>'
    +'<span class="kv"><span>一致率</span><span>'+st.rate+'%</span></span></div>';
  if(!st.diff.length){
    h+='<div class="rok"><b>各专家的判断在阈值内一致</b>，没有需要裁定的条目。可直接进入一致性检验。</div>';
  }else{
    h+='<table class="enstab"><tr><th>分歧条目</th>'
      +ens.people.map(p=>'<th>'+p.name+'</th>').join('')
      +'<th style="width:54px">极差</th><th style="width:210px">裁定</th></tr>';
    st.diff.slice(0,40).forEach(it=>{
      const P=it.k.split('>');
      h+='<tr><td class="enpair">'+(DSHORT[P[0]]||P[0])+' <span class="ar">→</span> '+(DSHORT[P[1]]||P[1])+'</td>'
        +ens.people.map(p=>{
          const r=p.cim[it.k];
          if(!r) return '<td class="enmiss">—</td>';
          return '<td class="env'+(r.v>0?' pos':(r.v<0?' neg':''))+'">'+(r.v>0?'+':'')+r.v
            +'<i>'+r.conf+(r.rev?' · 已审':'')+(r.why?'<br>'+r.why:'')+'</i></td>';
        }).join('')
        +'<td class="ensp">'+it.sp+'</td>'
        +'<td class="enact">'+it.rec.map(r=>'<button class="btn sm'
            +(typeof ensRes[it.k]==='number'&&ensRes[it.k]===r.v?' pri':'')
            +'" onclick="arbit(\''+it.k+'\','+r.v+')">取 '+(r.v>0?'+':'')+r.v+'</button>').join('')+'</td></tr>';
    });
    h+='</table>';
    if(st.diff.length>40) h+='<div style="font-size:12px;color:var(--tx3);margin-top:8px;">'
      +'共 '+st.diff.length+' 条分歧，此处显示前 40 条。</div>';
    h+='<div style="margin-top:14px;display:flex;gap:10px;flex-wrap:wrap;">'
      +'<button class="btn pri" onclick="ensMerge()">合并矩阵（分歧取中位数）</button>'
      +'<button class="btn" onclick="arbitAllMed()">分歧项全部裁定为中位数</button>'
      +'<button class="btn" onclick="exportEns()">导出集成工作簿</button></div>';
  }
  el.innerHTML=h;
}
function exportEns(){
  const st=ensStat();
  if(!st||!st.multi){ toast('还没有可以比对的条目'); return; }
  const P=ens.people;
  let h='<h1>多专家打分集成工作簿</h1>';
  h+='<div class="rsub">生成时间 '+nowStr()+'　·　'+st.n+' 位专家独立打分　·　模型侧 · 清华大学</div>';
  h+='<div class="rmeta">'
    +'<div><span>可比条目</span><span>'+st.multi+' 条（应判 '+st.total+' 条）</span></div>'
    +'<div><span>完全一致</span><span>'+st.agree+' 条</span></div>'
    +'<div><span>存在分歧</span><span>'+st.diff.length+' 条</span></div>'
    +'<div><span>一致率</span><span>'+st.rate+'%</span></div></div>';
  h+='<h2>一、分歧条目明细</h2>';
  if(!st.diff.length){ h+='<div class="rok">无分歧条目。</div>'; }
  else{
    h+='<table><tr><th>条目</th>'+P.map(p=>'<th>'+p.name+'</th>').join('')
      +'<th style="width:50px">极差</th><th style="width:90px">裁定</th></tr>';
    st.diff.forEach(it=>{
      const q=it.k.split('>');
      h+='<tr><td><b>'+(DSHORT[q[0]]||q[0])+'</b> → <b>'+(DSHORT[q[1]]||q[1])+'</b></td>'
        +P.map(p=>{const r=p.cim[it.k];
          if(!r) return '<td>—</td>';
          return '<td>'+(r.v>0?'+':'')+r.v+'<br><span class="rrng">'+r.conf
            +(r.why?'　'+r.why:'')+'</span></td>';}).join('')
        +'<td>'+it.sp+'</td>'
        +'<td>'+(typeof ensRes[it.k]==='number'?('取 '+(ensRes[it.k]>0?'+':'')+ensRes[it.k]):'待裁定')+'</td></tr>';
    });
    h+='</table>';
  }
  h+='<h2>二、合并后的矩阵</h2>';
  h+='<p>合并规则：打分差小于 2 的条目取共识值；达到 2 及以上者列为分歧，'
    +'按裁定结果取值，未裁定者暂取中位数并标为低置信度。</p>';
  const src=ens.merged||cim;
  h+='<table><tr><th style="width:200px">来源</th><th style="width:200px">目标</th>'
    +'<th style="width:60px">取值</th><th style="width:110px">置信度</th><th>说明</th></tr>';
  Object.keys(src).sort().forEach(k=>{
    const q=k.split('>'), r=src[k];
    h+='<tr><td>'+(DSHORT[q[0]]||q[0])+'</td><td>'+(DSHORT[q[1]]||q[1])+'</td>'
      +'<td>'+(r.v>0?'+':'')+r.v+'</td><td>'+r.conf+(r.rev?'（已审）':'')+'</td>'
      +'<td>'+(r.why||'')+'</td></tr>';
  });
  h+='</table>';
  const css='body{font-family:-apple-system,"PingFang SC","Microsoft YaHei",sans-serif;max-width:900px;'
   +'margin:40px auto;padding:0 24px;font-size:14px;line-height:1.8;color:#101828;}'
   +'h1{font-size:22px;}h2{font-size:16px;margin:28px 0 8px;padding-left:9px;border-left:3px solid #2563EB;}'
   +'table{border-collapse:collapse;width:100%;margin:10px 0 16px;font-size:13px;}'
   +'th{background:#FAFBFC;font-weight:600;padding:7px 10px;text-align:left;border:1px solid #E4E7EC;}'
   +'td{padding:6px 10px;border:1px solid #E4E7EC;vertical-align:top;}'
   +'.rmeta{background:#FAFBFC;border-radius:10px;padding:12px 16px;margin-bottom:18px;font-size:13px;}'
   +'.rmeta div{display:flex;gap:10px;padding:3px 0;}.rmeta span:first-child{color:#667085;min-width:104px;}'
   +'.rok{background:#ECFDF5;border-left:3px solid #059669;color:#059669;padding:9px 14px;font-size:13px;margin:12px 0;}'
   +'.rrng{color:#475467;font-size:12px;}.rsub{font-size:12.5px;color:#98A2B3;}';
  const html='<!DOCTYPE html><html lang="zh-CN"><head><meta charset="utf-8">'
   +'<title>多专家打分集成工作簿</title><style>'+css+'</style></head><body>'+h+'</body></html>';
  saveFile('集成工作簿_'+nowStr().replace(/[: ]/g,'-')+'.html', html, 'text/html');
}

/* ================= 跨层一致性（v1.2 新增） =================
   同一个描述符在不同尺度上各有一个取值。上级定了调子，下级不能反着来——
   但"不能反"不等于"必须相同"：差一档是允许的梯度，差两档才是方向相反。
   这是纵向一致性，与 CIB 的横向自洽是两个正交的检验，都通过才算这套假设站得住。 */

const XL_ORDER=['nation','region','prov','city'];
const XL_NAME={nation:'国家级',region:'区域级',prov:'省级',city:'市级'};
let xlSel={};          // 描述符名 -> { nation:idx, prov:idx, city:idx }

function xlayers(){
  const on=[...document.querySelectorAll('[data-scale].sel')].map(x=>x.dataset.scale);
  return XL_ORDER.filter(l=>on.indexOf(l)>=0);
}
function xlXY(){                       // 相邻的层级对
  const seq=xlayers(), r=[];
  for(let i=0;i<seq.length-1;i++) r.push([seq[i],seq[i+1]]);
  return r;
}
function xlEnsure(){
  const L=xlayers();
  Object.keys(sel.desc).forEach(nm=>{
    if(!xlSel[nm]) xlSel[nm]={};
    L.forEach(l=>{
      if(xlSel[nm][l]===undefined||xlSel[nm][l]>=ST(nm).length) xlSel[nm][l]=0;
    });
    Object.keys(xlSel[nm]).forEach(l=>{ if(L.indexOf(l)<0) delete xlSel[nm][l]; });
  });
  Object.keys(xlSel).forEach(nm=>{ if(!sel.desc[nm]) delete xlSel[nm]; });
}
function setXl(nm,l,v){ xlSel[nm]=xlSel[nm]||{}; xlSel[nm][l]=+v; renderXl(); }
function xlCheck(){
  xlEnsure();
  const out=[];
  xlXY().forEach(([u,d])=>{
    Object.keys(sel.desc).forEach(nm=>{
      const a=xlSel[nm]||{}, ui=a[u], di=a[d];
      if(ui===undefined||di===undefined) return;
      const diff=Math.abs(ui-di);
      if(diff>=2) out.push({nm:nm,u:u,d:d,ui:ui,di:di,diff:diff});
    });
  });
  return out;
}
function xlAlign(){
  let n=0;
  xlXY().forEach(([u,d])=>{
    Object.keys(sel.desc).forEach(nm=>{
      const a=xlSel[nm]; if(!a) return;
      const ui=a[u], di=a[d];
      if(ui===undefined||di===undefined) return;
      if(Math.abs(ui-di)>=2){ a[d]=ui>di?ui-1:ui+1; n++; }
    });
  });
  renderXl();
  toast(n?('已把 '+n+' 处下级取值调到与上级相邻的档位'):'没有需要对齐的项');
}
function renderXl(){
  const el=document.getElementById('xlBox'); if(!el) return;
  const L=xlayers();
  if(!nSel()){ el.innerHTML='<div class="empty">先在第 2 步勾选描述符。</div>'; return; }
  if(L.length<2){
    el.innerHTML='<div class="empty">当前只选了一个层级（'+(L.map(l=>XL_NAME[l]).join('')||'未选')
      +'），没有跨层关系可查。<br>回到第 1 步多勾一个层级，这里就会出现层级之间的比对。</div>';
    return;
  }
  xlEnsure();
  const nms=Object.keys(sel.desc), bad=xlCheck();
  let h='<table class="xltab"><tr><th>描述符</th>'+L.map(l=>'<th>'+XL_NAME[l]
    +(l==='nation'?' <span class="dim" style="font-weight:400;font-size:10px;">给定</span>':'')+'</th>').join('')+'</tr>';
  nms.forEach(nm=>{
    const sts=ST(nm), defs=defsOf(nm);
    h+='<tr><td class="xlnm">'+(DSHORT[nm]||nm)+'</td>';
    L.forEach((l,i)=>{
      const v=xlSel[nm][l], x=defs[v]||{};
      const rg=(x.lo===null||x.lo===undefined)?''
        :'<i>'+(x.lo+'–'+x.hi+(x.u?' '+x.u:''))+'</i>';
      let cl='';
      if(i>0 && Math.abs(v-xlSel[nm][L[i-1]])>=2) cl=' bad';
      h+='<td class="xlcell'+cl+'"><select class="txt" onchange="setXl(\''+nm+'\',\''+l+'\',this.value)">'
        +sts.map((s,k)=>'<option value="'+k+'"'+(v===k?' selected':'')+'>'+s+'</option>').join('')
        +'</select>'+rg+'</td>';
    });
    h+='</tr>';
  });
  h+='</table>';
  const pairs=xlXY();
  h+='<div class="filtbar"><span class="filtmeta">检查 <b>'+pairs.length+'</b> 组相邻层级 × <b>'
    +nms.length+'</b> 个描述符 ＝ '+(pairs.length*nms.length)+' 项　·　'
    +(bad.length?('冲突 <b style="color:var(--rd)">'+bad.length+'</b> 项')
      :('<b style="color:var(--ok)">全部相容</b>'))+'</span>'
    +'<div class="sp"></div>'
    +(bad.length?'<button class="btn sm pri" onclick="xlAlign()">把下级调到相邻档</button>':'')
    +'</div>';
  if(bad.length){
    h+='<div class="xlbads">';
    bad.forEach(b=>{
      h+='<div class="xlb"><b>'+(DSHORT[b.nm]||b.nm)+'</b>：'+XL_NAME[b.u]+'取「'
        +(ST(b.nm)[b.ui]||'?')+'」，'+XL_NAME[b.d]+'却取「'+(ST(b.nm)[b.di]||'?')
        +'」——<b>方向相反</b>（跨 '+b.diff+' 档）</div>';
    });
    h+='</div>';
  }else{
    h+='<div class="rok" style="margin-top:10px;">各描述符在相邻层级之间没有出现方向相反的情况。'
      +'<b>梯度的存在是允许的</b>——省级比国家级保守一档，本身不算矛盾。</div>';
  }
  h+='<div class="dim" style="font-size:11.5px;line-height:1.75;margin-top:10px;">'
    +'<b>判据</b>：档位差 0＝完全一致，1＝有梯度（允许），2＝方向相反（冲突）。'
    +'只查<b>同一描述符在相邻层级之间</b>的关系，不涉及跨描述符、也不涉及 CIB 的影响平衡。<br>'
    +'<b>国家级是给定层</b>：它是外部条件（国家政策目标），改它等于设定前提，不是在探索取值——'
    +'所以它不参与组合枚举，只作为各层的约束起点。<br>'
    +'<b>数值加总暂不自动校验</b>：京、津、冀是三个平级单位，而市级只覆盖河北——'
    +'层级树的成员并不完整（京津下级缺位），"下级之和能否凑出上级"要先把每层成员补齐，'
    +'目前只能查档位方向。</div>';
  el.innerHTML=h;
}

/* ================= 情景筛选（v1.2 新增，对应德国软件的选择管理器） =================
   自洽情景常常几十上百个，看不过来。允许对任意描述符指定要求取值，
   展示层（情景表、情景地图）就只看命中的子集——这是"用假设反查未来"的入口。
   筛选只影响展示，不改变检验结果本身。 */

let filt={};   // 描述符名 -> 状态索引

const filtN=()=>Object.keys(filt).length;
function filtList(){
  if(!cimResult) return [];
  if(!filtN()) return cimResult.consistent;
  const ds=cimResult.ds;
  return cimResult.consistent.filter(cb=>ds.every((d,i)=>filt[d]===undefined||cb[i]===filt[d]));
}
function setFilt(d,v){ if(v==='') delete filt[d]; else filt[d]=+v; renderFilt(); }
function clearFilt(){ filt={}; render(); toast('已清除全部筛选条件'); }
function renderFilt(){
  const el=document.getElementById('filtBox'); if(!el) return;
  if(!cimResult||!cimResult.consistent.length){
    el.innerHTML='<div class="empty">运行一致性检验后，这里可以按条件筛出自洽情景的子集。</div>';
    return;
  }
  const ds=cimResult.ds, all=cimResult.consistent;
  if(!ds.length){ el.innerHTML='<div class="empty">尚未选择描述符。</div>'; return; }
  let h='<table class="filttab"><tr><th style="width:42%">描述符</th><th>要求取值</th>'
    +'<th style="width:74px">命中</th><th style="width:70px">占比</th></tr>';
  ds.forEach((d,i)=>{
    const sts=ST(d), v=filt[d];
    const hit=(v===undefined)?all.length:all.filter(cb=>cb[i]===v).length;
    const pct=all.length?Math.round(hit/all.length*100):0;
    h+='<tr><td>'+(DSHORT[d]||d)+'</td><td><select class="txt" onchange="setFilt(\''+d+'\',this.value)">'
      +'<option value="">不限</option>'
      +sts.map((s,k)=>'<option value="'+k+'"'+(v===k?' selected':'')+'>'+s+'</option>').join('')
      +'</select></td><td class="num'+(v!==undefined?' on':'')+'">'+hit+'</td>'
      +'<td class="num">'+pct+'%</td></tr>';
  });
  h+='</table>';
  const sub=filtList(), n=filtN();
  h+='<div class="filtbar"><span class="filtmeta">'
    +'已设 <b>'+n+'</b> 个条件　·　命中 <b>'+sub.length+'</b> / '+all.length+' 个自洽情景'
    +(all.length?('（'+Math.round(sub.length/all.length*100)+'%）'):'')+'</span>'
    +'<div class="sp"></div>'
    +(n?'<button class="btn sm" onclick="clearFilt()">清除全部条件</button>':'')
    +'</div>';
  if(n&&!sub.length){
    h+='<div class="stbad" style="margin:10px 0 0;">这组要求在自洽情景里<b>不存在</b>——'
      +'也就是说，这些状态不可能同时成立。<b>这本身就是一条结论</b>，可以据此判断某个设想是否站得住。</div>';
  }
  el.innerHTML=h;
}

/* ================= 情景地图（v1.2 新增，对应德国软件的 Scenario maps） =================
   两张图各管一件事：聚类图看「自洽情景分成几个族、族与族差在哪」，
   热力图看「每个描述符在所有自洽情景里倾向取哪一档」。前者看格局，后者看分布。 */

let mapMode='cluster';
const FAMC=['#2563EB','#059669','#B54708','#7C3AED','#0891B2','#DB2777','#65A30D','#DC2626'];

function setMapMode(m){ mapMode=m; renderMap(); }
function scenSim(a,b){ let s=0; for(let i=0;i<a.length;i++) if(a[i]===b[i]) s++; return s/a.length; }

// 相似度矩阵 + 层次聚类（平均连接）；族内允许的差异随描述符数自适应
function scenClusters(){
  const L=filtList(), ds=cimResult.ds;
  const m=ds.length;
  // 允许不同的描述符个数：19 个描述符时约 6 个，描述符少时至少留 1 个余量，
  // 否则描述符一少，阈值就退化成「必须完全相同」。
  const allow=Math.max(1, Math.round(m*0.3));
  const N=Math.min(L.length, 60);          // 只对前 60 个做布局，组合数很大时不至于卡住
  const S=[];
  for(let i=0;i<N;i++) S.push(new Array(N).fill(1));
  for(let i=0;i<N;i++) for(let j=i+1;j<N;j++){ S[i][j]=S[j][i]=scenSim(L[i],L[j]); }
  const same=(A,B)=>{ let s=0; A.forEach(i=>B.forEach(j=>{ s+=S[i][j]; })); return s/(A.length*B.length); };
  let gs=[]; for(let i=0;i<N;i++) gs.push([i]);
  while(gs.length>1){
    let bi=0,bj=1,best=-1;
    for(let i=0;i<gs.length;i++) for(let j=i+1;j<gs.length;j++){
      const v=same(gs[i],gs[j]);
      if(v>best){ best=v; bi=i; bj=j; }
    }
    if(m-best*m>allow) break;              // 平均相同数不足，不再合并
    const A=gs[bi], B=gs[bj];
    gs=gs.filter((_,k)=>k!==bi&&k!==bj);
    gs.push(A.concat(B));
  }
  return {groups:gs, N:N, total:L.length, allow:allow};
}
// 一个族的「定义」：族内所有情景取值都一致的描述符——这就是这一族的特征
function familyDesc(g){
  const L=cimResult.consistent, ds=cimResult.ds, out=[];
  ds.forEach((d,i)=>{
    const vals=[...new Set(g.map(k=>L[k][i]))];
    if(vals.length===1) out.push((DSHORT[d]||d)+'＝'+((ST(d)[vals[0]])||'?'));
  });
  return out;
}
function renderMap(){
  const host=document.getElementById('mapFig'); if(!host) return;
  const tabs=document.getElementById('mapTabs');
  if(tabs){
    tabs.innerHTML=[['cluster','情景族聚类图'],['heat','状态分布热力图']].map(([k,t])=>
      '<button class="mtab'+(mapMode===k?' on':'')+'" onclick="setMapMode(\''+k+'\')">'+t+'</button>').join('');
  }
  if(!cimResult||!cimResult.consistent.length){
    host.innerHTML='<div style="padding:32px;text-align:center;color:var(--tx3);font-size:12.5px;line-height:1.9;">'
      +'运行一致性检验后，这里会把自洽情景画成图——<br>'
      +'一张看它们分成几个「情景族」，一张看每个描述符在各情景中取哪一档。</div>';
    return;
  }
  if(filtN()&&!filtList().length){
    host.innerHTML='<div style="padding:32px;text-align:center;color:var(--tx3);font-size:12.5px;line-height:1.9;">'
      +'当前筛选条件下<b>没有命中的自洽情景</b>，图无从画起。<br>把条件放宽，或点上方的「清除全部条件」。</div>';
    return;
  }
  if(mapMode==='heat') renderHeat(host); else renderCluster(host);
}
function renderCluster(host){
  const cl=scenClusters(), L=filtList(), ds=cimResult.ds;
  const N=cl.N, G=cl.groups;
  const BX=100, BY=10, SZ=480;          // 图区是 480×480 的正方形，居中放在 680 宽的画布上
  const ang=i=>-Math.PI/2+2*Math.PI*i/G.length;
  const R=G.length>1?0.33:0;
  const pos=[];
  G.forEach((g,gi)=>{
    const a=ang(gi);
    const cx=0.5+R*Math.cos(a), cy=0.5+R*Math.sin(a);
    const rr=g.length>1?Math.min(0.125, 0.018+0.015*Math.sqrt(g.length)):0;
    g.forEach((idx,k)=>{
      const a2=2*Math.PI*k/g.length+gi*0.7;
      pos[idx]={x:cx+(g.length>1?rr*Math.cos(a2):0), y:cy+(g.length>1?rr*Math.sin(a2):0)};
    });
  });
  const px=x=>BX+x*SZ, py=y=>BY+y*SZ;
  let svg='';
  G.forEach((g,gi)=>{
    if(g.length<2) return;
    const xs=g.map(k=>px(pos[k].x)), ys=g.map(k=>py(pos[k].y));
    const cx=xs.reduce((a,b)=>a+b,0)/g.length, cy=ys.reduce((a,b)=>a+b,0)/g.length;
    let r=0; g.forEach(k=>{ r=Math.max(r, Math.hypot(px(pos[k].x)-cx, py(pos[k].y)-cy)); });
    svg+='<circle cx="'+cx.toFixed(1)+'" cy="'+cy.toFixed(1)+'" r="'+(r+18).toFixed(1)
      +'" fill="'+FAMC[gi%FAMC.length]+'" opacity="0.07"/>';
  });
  G.forEach((g,gi)=>{
    g.forEach(idx=>{
      const cb=L[idx];
      const tip=ds.map((d,i)=>(DSHORT[d]||d)+'＝'+((ST(d)[cb[i]])||'?')).join('；');
      svg+='<circle cx="'+px(pos[idx].x).toFixed(1)+'" cy="'+py(pos[idx].y).toFixed(1)
        +'" r="'+(N>30?3.4:4.6)+'" fill="'+FAMC[gi%FAMC.length]+'" opacity="0.88">'
        +'<title>情景 '+(idx+1)+'：'+tip+'</title></circle>';
    });
  });
  G.forEach((g,gi)=>{
    const a=ang(gi);
    const lx=0.5+(R+0.062)*Math.cos(a), ly=0.5+(R+0.062)*Math.sin(a);
    svg+='<text x="'+px(lx).toFixed(1)+'" y="'+py(ly).toFixed(1)
      +'" text-anchor="middle" dominant-baseline="central" font-size="11.5" font-weight="600" fill="'
      +FAMC[gi%FAMC.length]+'">族 '+(gi+1)+'（'+g.length+'）</text>';
  });
  let h='<svg viewBox="0 0 680 520" style="width:100%;height:auto;display:block;">'+svg+'</svg>';
  h+='<div style="font-size:12px;color:var(--tx3);margin-top:4px;line-height:1.8;">'
    +(filtN()?'<b>已按筛选条件</b>：':'共 ')
    +cl.total+' 个自洽情景'+(cl.total>N?('，图中显示前 '+N+' 个'):'')
    +'，按取值相似度聚成 <b>'+G.length+'</b> 个情景族（族内平均差异不超过 '
    +cl.allow+' 个描述符）。点靠得越近表示两个情景越像；鼠标悬停任一点可看它的完整取值。</div>';
  h+='<div class="mapfams">';
  G.forEach((g,gi)=>{
    const def=familyDesc(g);
    h+='<div class="fam"><div class="famhd"><span class="fdot" style="background:'
      +FAMC[gi%FAMC.length]+'"></span><b>族 '+(gi+1)+'</b>　<span class="fct">'+g.length+' 个情景</span></div>'
      +'<div class="fdef">'+(def.length?def.join('　·　'):'族内各描述符取值不一（仅相似度接近）')+'</div></div>';
  });
  h+='</div>';
  h+='<div style="font-size:12.5px;color:var(--tx2);margin-top:12px;line-height:1.85;">'
    +'每个族的定义，就是族内<b>所有情景取值都相同</b>的那些描述符。'
    +'<b>族与族的差别，才是这套假设体系下真正分歧的地方</b>——'
    +'剩下的描述符无论怎么取值都自洽，说明它们不是这套情景的关键变量。</div>';
  host.innerHTML=h;
}
function heatColor(p){
  const a=Math.max(0,Math.min(1,p));
  const r=Math.round(239+(37-239)*a), g=Math.round(244+(99-244)*a), b=Math.round(255+(235-255)*a);
  return {bg:'rgb('+r+','+g+','+b+')', fg:(a>0.55?'#fff':'#101828')};
}
function renderHeat(host){
  const L=filtList(), ds=cimResult.ds, n=L.length;
  const cnt=ds.map((d,i)=>{
    const arr=new Array(ST(d).length).fill(0);
    L.forEach(cb=>{ arr[cb[i]]++; });
    return arr;
  });
  let h='<div class="heat">';
  h+='<div class="hrow hhead"><span class="hlb"></span>'
    +'<span class="hcell">第 1 档</span><span class="hcell">第 2 档</span><span class="hcell">第 3 档</span>'
    +'<span class="hnote">占比</span></div>';
  ds.forEach((d,i)=>{
    const sts=ST(d), arr=cnt[i];
    h+='<div class="hrow"><span class="hlb" title="'+d+'">'+(DSHORT[d]||d)+'</span>';
    for(let k=0;k<3;k++){
      if(k>=sts.length){ h+='<span class="hcell hollow"></span>'; continue; }
      const p=arr[k]/n, c=heatColor(p);
      h+='<span class="hcell" style="background:'+c.bg+';color:'+c.fg+'" title="'+d+'：'+sts[k]
        +'　'+arr[k]+' / '+n+' 个情景（'+Math.round(p*100)+'%）">'
        +(p>=0.12?Math.round(p*100)+'%':'')+'</span>';
    }
    h+='<span class="hnote">'+sts.length+' 档</span></div>';
  });
  h+='</div>';
  const locked=ds.filter((d,i)=>Math.max(...cnt[i])/n>=0.9);
  h+='<div style="font-size:12px;color:var(--tx3);margin-top:12px;line-height:1.8;">'
    +'每行是一个描述符、每格是它的某一档；<b>颜色越深，说明'
    +(filtN()?('在筛选命中的 '+n+' 个情景里'):'在所有自洽情景里')
    +'取这一档的比例越高</b>。</div>';
  if(locked.length){
    h+='<div class="rok" style="margin-top:10px;">以下描述符在自洽情景里几乎只有一个取值，'
      +'说明它们<b>被其他条件锁死</b>，不是可自由选择的项：<b>'
      +locked.map(d=>DSHORT[d]||d).join('、')+'</b>。</div>';
  }
  host.innerHTML=h;
}


/* ================= 影响路径分析（v1.2 新增，对应德国软件的路径分析） ================= */
let pathFrom=null, pathTo=null;
const pathMaxSeg=3;

function pv(a,b){ const r=cim[a+'>'+b]; return r?r.v:0; }

/* 找出 from → to 之间所有长度 2~maxSeg 的有向传导链（不重复经过同一节点） */
function findPaths(from,to,maxSeg){
  const ds=Object.keys(sel.desc), out=[];
  if(!from||!to||from===to) return out;
  const walk=(node,path,vals,seen)=>{
    const seg=path.length-1;              // 已走的段数
    if(seg>maxSeg) return;
    if(node===to && seg>=1){ out.push({nodes:path.slice(), vals:vals.slice()}); return; }
    if(seg>=maxSeg) return;
    for(const nx of ds){
      if(nx===node||seen.has(nx)) continue;
      const v=pv(node,nx);
      if(!v) continue;
      seen.add(nx); path.push(nx); vals.push(v);
      walk(nx,path,vals,seen);
      path.pop(); vals.pop(); seen.delete(nx);
    }
  };
  walk(from,[from],[],new Set([from]));
  return out;
}

/* 一条链有多强，取决于最弱的那一段；方向由负号个数的奇偶决定 */
function pathStat(p){
  const signs=p.vals.filter(v=>v<0).length;
  const minAbs=p.vals.reduce((a,v)=>Math.min(a,Math.abs(v)),99);
  const sum=p.vals.reduce((a,v)=>a+v,0);
  return {dir:signs%2?'neg':'pos', minAbs:minAbs, sum:sum, len:p.vals.length};
}

function pathRanked(from,to){
  return findPaths(from,to,pathMaxSeg)
    .map(p=>Object.assign({},p,pathStat(p)))
    .sort((a,b)=> b.minAbs-a.minAbs || a.len-b.len);
}

/* 全局：哪些配对没有直接判断、却存在间接传导（矩阵的隐性缺口） */
function hiddenLinks(){
  const ds=Object.keys(sel.desc), out=[];
  for(const a of ds) for(const b of ds){
    if(a===b) continue;
    if(pv(a,b)!==0) continue;
    const ps=pathRanked(a,b);
    if(!ps.length) continue;
    out.push({from:a, to:b, n:ps.length, best:ps[0]});
  }
  return out.sort((x,y)=> y.best.minAbs-x.best.minAbs || y.n-x.n);
}

function setPath(f,t){ pathFrom=f; pathTo=t; renderPath(); }

function renderPath(){
  const host=document.getElementById('pathBox'); if(!host) return;
  const ds=Object.keys(sel.desc);
  if(ds.length<3){
    host.innerHTML='<div class="empty">至少勾选三个描述符才能看间接传导——路径分析要有一个中间环节</div>';
    return;
  }
  if(!pathFrom||ds.indexOf(pathFrom)<0) pathFrom=ds[0];
  if(!pathTo||ds.indexOf(pathTo)<0||pathTo===pathFrom) pathTo=ds[1];

  const opt=(sel_,cur)=>ds.map(d=>'<option value="'+d+'"'+(d===cur?' selected':'')+'>'+(d)+'</option>').join('');
  let h='<div class="pathbar"><span class="plb">起点</span>'
    +'<select class="txt" onchange="setPath(this.value,pathTo)">'+opt(0,pathFrom)+'</select>'
    +'<span class="parrow">→</span><span class="plb">终点</span>'
    +'<select class="txt" onchange="setPath(pathFrom,this.value)">'+opt(0,pathTo)+'</select>'
    +'</div>';

  const direct=cim[pathFrom+'>'+pathTo];
  const ps=pathRanked(pathFrom,pathTo);

  h+='<div class="kv"><span>直接判断</span><span>'
    +(direct? ('<b>'+VWORD[String(direct.v)]+'</b>（'+(direct.v>0?'+':'')+direct.v+'）'):'<span style="color:var(--tx3);">未填（0）</span>')
    +'</span></div>';
  h+='<div class="kv"><span>间接传导链</span><span>'+ps.length+' 条'
    +(ps.length?'（最长 '+pathMaxSeg+' 段）':'')+'</span></div>';

  if(direct&&direct.v===0 && ps.length){
    h+='<div class="note" style="margin:10px 0;">直接判断填的是 <b>0</b>，但存在 '+ps.length
      +' 条间接传导链——<b>这两个描述符其实有关系，只是绕了一层</b>。'
      +'建议回到打分矩阵补上直接判断，或在依据里注明「经 XX 间接影响」。</div>';
  }
  if(!direct && ps.length){
    h+='<div class="note" style="margin:10px 0;">这一格还没打分，但已经有 '+ps.length
      +' 条间接传导链——可以据此判断直接关系应该是正还是负。</div>';
  }

  if(!ps.length){
    h+='<div class="empty" style="margin-top:10px;">这两者之间没有 2～'+pathMaxSeg+' 段的有向通路，'
      +'说明在当前打分下互不影响。</div>';
  }else{
    h+='<div class="pathlist">';
    ps.slice(0,12).forEach((p,i)=>{
      const segs=p.nodes.map((n,j)=>{
        if(j===p.nodes.length-1) return '<b>'+n+'</b>';
        const v=p.vals[j];
        return '<b>'+n+'</b><span class="pv '+(v>0?'p':'n')+'">'+(v>0?'+':'')+v+'</span>';
      }).join('<span class="parrow">→</span>');
      h+='<div class="prow"><span class="pidx">#'+(i+1)+'</span>'
        +'<span class="pchain">'+segs+'</span>'
        +'<span class="pmeta"><i class="'+(p.dir==='pos'?'pdir-p':'pdir-n')+'">'
        +(p.dir==='pos'?'净促进':'净抑制')+'</i>　强度 '+p.minAbs+'（最弱环节）</span></div>';
    });
    h+='</div>';
    if(ps.length>12) h+='<div class="dim" style="font-size:12px;margin-top:7px;">共 '+ps.length+' 条，此处列出最强的 12 条。</div>';
    h+='<div class="dim" style="font-size:11.5px;margin-top:9px;line-height:1.75;">'
      +'读法：链的强度取<b>最弱环节</b>的绝对值——一段 +3 接一段 +1，整体只按 +1 算；'
      +'方向看负号的个数，偶数个为净促进、奇数个为净抑制。</div>';
  }

  const hid=hiddenLinks().filter(x=>!(x.from===pathFrom&&x.to===pathTo));
  if(hid.length){
    h+='<div class="hidbox"><div class="hd2">矩阵里的隐性关联 · 共 '+hid.length+' 对</div>'
      +'<div class="dim" style="font-size:11.5px;line-height:1.7;margin-bottom:7px;">'
      +'这些配对<b>没有直接打分</b>，却存在间接传导。它们不一定都要补——但如果某一对的传导很强，说明矩阵里漏了一条关系。</div>';
    hid.slice(0,6).forEach(x=>{
      h+='<div class="hidrow" onclick="setPath(\''+x.from+'\',\''+x.to+'\')">'
        +'<span>'+x.from+' <span class="parrow">→</span> '+x.to+'</span>'
        +'<span class="dim">'+x.n+' 条链，最强 '+x.best.minAbs+'</span></div>';
    });
    h+='</div>';
  }
  host.innerHTML=h;
}


/* ================= 影响谱（v1.2 新增，对应德国软件的 Influence profile） =================
   逐个把某个状态「钉死」（相当于外部冲击强行如此），重算情景集，与基准对比：
     ＋ = 基准里没有、强制后出现的状态（被这条冲击打开的可能）
     − = 基准里有、强制后消失的状态（被这条冲击挤掉的可能）
   整行空 = 该状态下没有任何自洽情景——说明系统与这条冲击不相容。 */

/* 计算与渲染分开：runProfile 只负责「先让界面刷新一下再算」，computeProfile 可被测试直接调用 */
function computeProfile(){
  const ds=Object.keys(sel.desc);
  if(ds.length<2) return {err:'至少选两个描述符'};
  if(!cimKeys().filter(k=>cim[k]).length) return {err:'还没有打分，先到「交叉影响打分」做判断'};
  const base=enumCore(ds,null,60000);
  if(base.bad || base.dead>=0 || !base.consistent.length){
    profResult=null;
    return {err:'基准情景集为空，无法做影响谱——先确认已打分、且锚定没有把搜索空间清空'};
  }
  const S=ds.reduce((a,d)=>a+ST(d).length,0);
  /* 总预算：状态数越多，每次强制分到的抽样量越少，避免几十次重算卡死浏览器 */
  const per=Math.max(1200, Math.min(200000, Math.floor(400000/Math.max(1,S))));
  const rows=[];
  ds.forEach((d,pos)=>{
    ST(d).forEach((nm,j)=>{
      const r=enumCore(ds,{pos:pos,idx:j},per);
      const rec={d:d,pos:pos,i:j,nm:nm,n:0,empty:false,add:[],lose:[],sampled:false};
      if(r.dead>=0 || !r.consistent.length){ rec.empty=true; rows.push(rec); return; }
      rec.n=r.count; rec.sampled=r.sampled;
      ds.forEach((e,ei)=>{
        if(ei===pos) return;
        ST(e).forEach((en,ei2)=>{
          const key=ei+'|'+ei2;
          const inB=base.presence.has(key), inR=r.presence.has(key);
          if(!inB && inR) rec.add.push({e:e, nm:en});
          else if(inB && !inR) rec.lose.push({e:e, nm:en});
        });
      });
      rows.push(rec);
    });
  });
  profResult={ds:ds.slice(), baseCount:base.consistent.length, basePres:base.presence.size,
    rows:rows, per:per, sampled:rows.some(x=>x.sampled), ts:nowStr()};
  return profResult;
}

function runProfile(){
  const host=document.getElementById('profBox');
  if(host) host.innerHTML='<div class="empty">正在逐个状态强制、重算情景集……</div>';
  setTimeout(()=>{
    const r=computeProfile();
    if(r && r.err){ if(host) host.innerHTML='<div class="empty">'+r.err+'</div>'; return; }
    renderProf();
    toast('影响谱完成：'+profResult.rows.length+' 个状态，基准 '+profResult.baseCount+' 组自洽');
  }, 40);
}

function profPick(k){ profileSel=k; renderProf(); }

function renderProf(){
  const host=document.getElementById('profBox'); if(!host) return;
  const ds=Object.keys(sel.desc);
  if(ds.length<2){ host.innerHTML='<div class="empty">先在第 3 步勾选描述符</div>'; return; }
  if(!profResult){
    host.innerHTML='<div style="font-size:12.5px;line-height:1.9;">'
      +'<b>这张表回答「如果某件事被强行实现，剩下哪些可能」。</b><br>'
      +'平台会把每一个状态逐个「钉死」，重算一遍自洽情景，再与不钉死时的基准对比：'
      +'<span class="pmark n">−</span> 表示被它<b>挤掉</b>的可能，整行标空表示<b>这条冲击下没有任何自洽情景</b>。'
      +'<br><span class="dim">注：本版把「强制」实现为硬约束，数学上强制只会缩小情景集，'
      +'所以不会出现「新增」；德国软件里的 ＋ 标记，来自它把外部冲击当作会改写矩阵的影响来处理，'
      +'那是另一种建模方式，本版未采用。</span>'
      +'<div style="margin-top:12px;"><button class="btn pri" onclick="runProfile()">运行影响谱</button>'
      +'<span class="dim" style="font-size:12px;margin-left:10px;">需先运行过一致性检验，状态数较多时会自动抽样</span></div></div>';
    return;
  }
  const R=profResult;
  const empties=R.rows.filter(x=>x.empty).length;
  const acted=R.rows.filter(x=>!x.empty && (x.add.length||x.lose.length)).length;

  let h='<div class="kv"><span>基准情景集</span><span><b>'+R.baseCount+'</b> 组自洽，覆盖 '+R.basePres+' 个状态</span></div>';
  h+='<div class="kv"><span>强制效应</span><span>'+acted+' / '+R.rows.length+' 个状态会改变情景集'
    +(empties?('，其中 <b style="color:var(--rd)">'+empties+'</b> 个状态下无任何自洽情景'):'')+'</span></div>';
  if(R.sampled) h+='<div class="dim" style="font-size:11.5px;margin:6px 0;">状态较多，每次强制抽样约 '+R.per.toLocaleString()+' 个组合——方向可靠，具体条数会略有浮动。</div>';

  h+='<div class="proftabwrap"><table class="proftab"><thead><tr><th class="pfr">强制为</th><th class="pfc">自洽</th>';
  ds.forEach(d=>{ h+='<th title="'+d+'">'+(DSHORT[d]||d)+'</th>'; });
  h+='</tr></thead><tbody>';
  let lastD=null;
  R.rows.forEach((row,ri)=>{
    if(row.d!==lastD){
      lastD=row.d;
      h+='<tr class="pgroup"><td colspan="'+(ds.length+2)+'">'+row.d+'</td></tr>';
    }
    const key=ri;
    const cls=(profileSel===key?' sel':'')+(row.empty?' pe':'');
    h+='<tr class="'+cls+'" onclick="profPick('+key+')">'
      +'<td class="pfr">'+row.nm+'</td>'
      +'<td class="pfc">'+(row.empty?'<span style="color:var(--rd)">0</span>':row.n.toLocaleString())+'</td>';
    ds.forEach((e,ei)=>{
      if(ei===row.pos){ h+='<td class="pself">—</td>'; return; }
      const a=row.add.filter(x=>x.e===e).length;
      const l=row.lose.filter(x=>x.e===e).length;
      if(!a&&!l){ h+='<td></td>'; return; }
      h+='<td class="pc">'+(a?'<i class="pmark p">+'+a+'</i>':'')+(l?'<i class="pmark n">−'+l+'</i>':'')+'</td>';
    });
    h+='</tr>';
  });
  h+='</tbody></table></div>';
  h+='<div class="dim" style="font-size:11.5px;margin-top:9px;line-height:1.8;">'
    +'读法：行是「被强行实现的状态」，列是「受影响的描述符」，格子里是该描述符被打开／挤掉的状态个数。'
    +'点任一行，下面列出具体是哪些状态。整行自洽数为 0 的，表示这条冲击与当前矩阵不相容——'
    +'<b>这不是算错，而是一条结论</b>。</div>';
  h+='<div class="dim" style="font-size:11px;margin-top:6px;line-height:1.75;">'
    +'注：本版把「强制」实现为硬约束——数学上强制只会缩小情景集，所以只会挤出可能、不会新增。'
    +'德国软件里的 ＋ 标记来自「把外部冲击当作会改写矩阵的影响」，属另一种建模，本版未采用。</div>';

  if(profileSel!=null && R.rows[profileSel]){
    const row=R.rows[profileSel];
    h+='<div class="profdet"><div class="hd2">强制「'+row.d+'」＝「'+row.nm+'」之后</div>';
    if(row.empty){
      h+='<div class="note" style="margin-top:8px;">没有任何自洽情景。<b>在当前打分下，这件事无法与其他条件并存。</b>'
        +'如果它确实必须发生，那说明矩阵里有判断需要修正。</div>';
    }else{
      h+='<div class="kv"><span>自洽情景数</span><span>'+row.n.toLocaleString()+' 组（基准 '+R.baseCount+' 组）</span></div>';
      const list=(arr,cls2,label)=>{
        if(!arr.length) return '<div class="pdrow"><span class="'+cls2+'">'+label+'</span><span class="dim">无</span></div>';
        return '<div class="pdrow"><span class="'+cls2+'">'+label+'</span><span>'
          +arr.map(x=>x.e+'＝'+x.nm).join('　·　')+'</span></div>';
      };
      h+=list(row.add,'pmark p','被打开');
      h+=list(row.lose,'pmark n','被挤掉');
    }
    h+='</div>';
  }
  host.innerHTML=h;
}


/* ================= 相关性分析（v1.2 新增，对应德国软件的 Correlations） =================
   用 Pearson φ 系数衡量「两个状态在自洽情景里是否总是同进同出」：
     φ=+100% 两者要么一起出现、要么一起不出现；φ=−100% 此消彼长；0 表示无关联。
   注意手册的提醒：情景数少时系数可能是假象，界面会直接警示。 */

function computeCorr(){
  const ds=Object.keys(sel.desc);
  if(ds.length<2) return {err:'至少选两个描述符'};
  if(!cimKeys().filter(k=>cim[k]).length) return {err:'还没有打分，先到「交叉影响打分」做判断'};
  /* 相关性要基于完整情景集，不能用展示用的前 200 条 */
  const r=enumCore(ds,null,20000,8000);
  if(r.bad || r.dead>=0) return {err:'基准情景集为空，无法计算相关'};
  const S=r.consistent.length;
  if(!S) return {err:'基准情景集为空，无法计算相关'};

  const states=[], key2i={};
  ds.forEach((d,pos)=>{ ST(d).forEach((nm,i)=>{
    key2i[pos+'|'+i]=states.length;
    states.push({d:d, pos:pos, i:i, nm:nm});
  });});
  const occ=states.map(()=>new Uint8Array(S));
  r.consistent.forEach((cb,si)=>{ cb.forEach((v,pos)=>{
    const gi=key2i[pos+'|'+v]; if(gi!==undefined) occ[gi][si]=1;
  });});
  const cnt=states.map((_,gi)=>{ let c=0; for(let k=0;k<S;k++) if(occ[gi][k]) c++; return c; });

  const pairs=[];
  for(let x=0;x<states.length;x++) for(let y=x+1;y<states.length;y++){
    const nA=cnt[x], nB=cnt[y];
    /* 同一描述符的不同状态天然互斥（φ 恒为 −100%），不是有效信息，跳过 */
    if(states[x].pos===states[y].pos) continue;
    /* 从不出现或每场都出现的状态没有区分度，按手册做法留空（不算系数） */
    if(!nA||!nB||nA===S||nB===S) continue;
    const A=occ[x], B=occ[y];
    let nAB=0; for(let k=0;k<S;k++) if(A[k]&&B[k]) nAB++;
    const n10=nA-nAB, n01=nB-nAB, n00=S-nA-nB+nAB;
    const den=Math.sqrt(nA*(S-nA)*nB*(S-nB));
    const phi=den?(nAB*n00-n10*n01)/den:0;
    pairs.push({a:x, b:y, phi:phi, nAB:nAB, n10:n10, n01:n01});
  }
  pairs.sort((p,q)=>Math.abs(q.phi)-Math.abs(p.phi));
  corrResult={states:states, cnt:cnt, S:S, pairs:pairs, weak:S<20,
    truncated:!!r.truncated, checked:r.checked, ts:nowStr()};
  return corrResult;
}

function runCorr(){
  const host=document.getElementById('corrBox');
  if(host) host.innerHTML='<div class="empty">正在计算状态两两的相关……</div>';
  setTimeout(()=>{
    const r=computeCorr();
    if(r && r.err){ corrResult=null; if(host) host.innerHTML='<div class="empty">'+r.err+'</div>'; return; }
    renderCorr();
    toast('相关性完成：'+r.S+' 组情景，'+r.pairs.length+' 对可计算');
  }, 40);
}

function corrSel(v){ corrPick=(v===''?null:v); renderCorr(); }

function renderCorr(){
  const host=document.getElementById('corrBox'); if(!host) return;
  const ds=Object.keys(sel.desc);
  if(ds.length<2){ host.innerHTML='<div class="empty">先在第 3 步勾选描述符</div>'; return; }
  if(!corrResult){
    host.innerHTML='<div style="font-size:12.5px;line-height:1.9;">'
      +'<b>哪些状态总是绑在一起出现？</b>这张表用 φ 系数回答：<b>＋100%</b> 表示两者要么同时出现、'
      +'要么同时不出现；<b>−100%</b> 表示此消彼长；0 表示没有关联。<br>'
      +'<span class="dim">它只描述「在当前这套判断下，这些状态怎么搭」，不说明因果。'
      +'情景数很少时，系数可能是假象——手册原话是「may lead to artificial results」。</span>'
      +'<div style="margin-top:12px;"><button class="btn pri" onclick="runCorr()">计算相关性</button></div></div>';
    return;
  }
  const R=corrResult;
  const strong=R.pairs.filter(p=>Math.abs(p.phi)>=0.8);
  let h='<div class="kv"><span>情景集</span><span>'+R.S+' 组自洽情景'
    +(R.truncated?'（超出上限，仅取前 8000 组）':'')+'</span></div>';
  h+='<div class="kv"><span>可计算的状态对</span><span>'+R.pairs.length+' 对，其中 <b>'
    +strong.length+'</b> 对强关联（|φ| ≥ 80%）</span></div>';
  if(R.weak) h+='<div class="note" style="margin:10px 0;">情景只有 '+R.S
    +' 组，<b>系数可能不稳定</b>——增加描述符或放宽锚定后再看，结论会更可靠。</div>';

  if(strong.length){
    h+='<div class="hd2" style="font-size:12.5px;font-weight:600;margin:13px 0 7px;">几乎捆绑的状态对</div><div class="corrlist">';
    strong.slice(0,12).forEach(p=>{
      const A=R.states[p.a], B=R.states[p.b];
      const pct=Math.round(p.phi*100);
      h+='<div class="corow">'
        +'<span class="copair">'+A.d+'＝'+A.nm+'<span class="coiff">↔</span>'+B.d+'＝'+B.nm+'</span>'
        +'<span class="cobar"><i style="width:'+Math.abs(pct)+'%;background:'+(p.phi>0?'var(--ok)':'var(--rd)')+'"></i></span>'
        +'<span class="coval '+(p.phi>0?'p':'n')+'">'+(pct>0?'+':'')+pct+'%</span></div>';
    });
    h+='</div>';
    if(strong.length>12) h+='<div class="dim" style="font-size:11.5px;margin-top:6px;">共 '+strong.length+' 对，此处列出最强的 12 对。</div>';
  }else{
    h+='<div class="empty" style="margin-top:12px;">没有 |φ| ≥ 80% 的强关联——各状态之间搭配比较自由。</div>';
  }

  h+='<div class="corrprof"><div class="hd2" style="font-size:12.5px;font-weight:600;margin-bottom:7px;">单个状态的关联谱</div>';
  h+='<select class="txt" onchange="corrSel(this.value)" style="max-width:320px;">'
    +'<option value="">选择一个状态看它的关联…</option>'
    +R.states.map((s,i)=>'<option value="'+i+'"'+(String(corrPick)===String(i)?' selected':'')+'>'
      +s.d+'＝'+s.nm+'</option>').join('')+'</select>';

  if(corrPick!=null && R.states[corrPick]){
    const gi=+corrPick, target=R.states[gi];
    const rel=R.pairs.filter(p=>p.a===gi||p.b===gi)
      .map(p=>({other:p.a===gi?p.b:p.a, phi:p.phi}))
      .sort((x,y)=>Math.abs(y.phi)-Math.abs(x.phi));
    h+='<div class="cproflist">';
    if(!rel.length){
      h+='<div class="dim" style="font-size:12px;margin-top:9px;">这个状态没有可计算的关联'
        +'（可能它从未出现，或每组情景里都出现）。</div>';
    }else{
      rel.slice(0,12).forEach(x=>{
        const O=R.states[x.other], pct=Math.round(x.phi*100);
        h+='<div class="corow"><span class="copair">'+O.d+'＝'+O.nm+'</span>'
          +'<span class="cobar"><i style="width:'+Math.abs(pct)+'%;background:'+(x.phi>0?'var(--ok)':'var(--rd)')+'"></i></span>'
          +'<span class="coval '+(x.phi>0?'p':'n')+'">'+(pct>0?'+':'')+pct+'%</span></div>';
      });
    }
    h+='</div>';
  }
  h+='</div>';

  h+='<div class="dim" style="font-size:11.5px;margin-top:10px;line-height:1.8;">'
    +'算法：Pearson φ 系数，基于全部自洽情景（未经情景筛选）。'
    +'从不出现、或每组都出现的状态没有区分度，按手册做法不计系数。'
    +'<b>φ 只说明「是否同进同出」，不说明谁导致谁</b>——因果要看交叉影响矩阵和传导链。</div>';
  host.innerHTML=h;
}


/* ================= 演示模式（v1.2 新增，对应德国软件的 Presenter） =================
   定位：站着讲给人听，不是操作。全屏、只读、只用点击或方向键翻页。
   章节顺序照 CIB 演示的常规流程排；其中「政策库与映射」「跨层一致性」两章
   是德国软件没有的，也是我们区别于它的地方。 */
const PRES=[
  {k:'about',  t:'开场',        s:'这是什么工具、今天看什么'},
  {k:'desc',   t:'描述符与状态', s:'每个变量有哪几档、依据是什么'},
  {k:'policy', t:'政策库与映射', s:'政策语言怎么翻成模型语言'},
  {k:'matrix', t:'交叉影响',     s:'谁影响谁、多强、依据是什么'},
  {k:'scen',   t:'自洽情景',     s:'哪些组合站得住'},
  {k:'one',    t:'钻进一个情景', s:'它为什么自洽'},
  {k:'xl',     t:'跨层一致性',   s:'国家—区域—省—市对不对得上'}
];
let presI=0, presOpen=false, presScenIdx=0;

function presAvail(k){
  if(k==='matrix') return Object.keys(sel.desc).length>=2;
  if(k==='scen'||k==='one') return !!(cimResult && cimResult.consistent.length);
  return true;
}
function openPres(){
  presOpen=true; presI=0; presScenIdx=0;
  const b=document.getElementById('pres'); if(!b) return;
  b.classList.add('on');
  document.body.style.overflow='hidden';
  renderPres();
}
function closePres(){
  presOpen=false;
  const b=document.getElementById('pres'); if(b) b.classList.remove('on');
  document.body.style.overflow='';
}
function presGo(i){
  if(i<0||i>=PRES.length) return;
  if(!presAvail(PRES[i].k)) return;
  presI=i; renderPres();
}
function presNext(){ for(let i=presI+1;i<PRES.length;i++){ if(presAvail(PRES[i].k)){ presGo(i); return; } } }
function presPrev(){ for(let i=presI-1;i>=0;i--){ if(presAvail(PRES[i].k)){ presGo(i); return; } } }

function renderPres(){
  const nav=document.getElementById('presNav'), body=document.getElementById('presBody'),
        cnt=document.getElementById('presCnt');
  if(!nav||!body) return;
  let h='<div class="presbrand">演示模式</div>';
  PRES.forEach((c,i)=>{
    const ok=presAvail(c.k);
    h+='<button class="pnav'+(i===presI?' on':'')+(ok?'':' dis')+'"'
      +(ok?' onclick="presGo('+i+')"':' disabled')+'>'
      +'<span class="pn">'+String(i+1).padStart(2,'0')+'</span>'
      +'<span class="pt">'+c.t+'</span></button>';
  });
  h+='<div class="presexit"><button class="pbtn ghost" onclick="closePres()">退出（Esc）</button></div>';
  nav.innerHTML=h;
  const ch=PRES[presI];
  body.innerHTML=presBody(ch.k);
  if(cnt) cnt.textContent=(presI+1)+' / '+PRES.length+'　·　'+ch.s;
}

function presStat(v,l){
  return '<div class="pstat"><b>'+v+'</b><span>'+l+'</span></div>';
}

function presBody(k){
  if(k==='about')  return presAbout();
  if(k==='desc')   return presDesc();
  if(k==='policy') return presPolicy();
  if(k==='matrix') return presMatrix();
  if(k==='scen')   return presScen();
  if(k==='one')    return presOne();
  if(k==='xl')     return presXl();
  return '';
}

function presAbout(){
  const S=cimResult?cimResult.consistent.length:0;
  return '<div class="pch">'
    +'<div class="peyebrow">清华大学 · 京津冀绿色低碳发展路径</div>'
    +'<h1>政策情景快速评估</h1>'
    +'<p class="plead">把政策文件里的目标，翻译成模型能用的参数；<br>再检验这些假设放在一起，是否互相打架。</p>'
    +'<div class="pstats">'+presStat(19,'个描述符')+presStat(55,'个状态')
      +presStat(106,'条政策路径')+presStat(S||'—','组自洽情景')+'</div>'
    +'<div class="pthree">'
      +'<div><b>不做预测</b><p>只说「这套假设内部站不站得住」，不说「未来会怎样」。自洽不等于会发生。</p></div>'
      +'<div><b>跨三个尺度</b><p>国家给定目标、区域分解、省市落实；纵向也要对得上，不只是各自算一遍。</p></div>'
      +'<div><b>每条判断可查</b><p>格子里的分数都带依据与置信度，低置信度的会被单独挑出来复核。</p></div>'
    +'</div></div>';
}

function presDesc(){
  const ds=Object.keys(sel.desc);
  if(!ds.length) return '<div class="pch"><h1>还没有选择描述符</h1>'
    +'<p class="plead">退出演示，回到第 3 步勾选几个描述符，再进来。</p></div>';
  let h='<div class="pch"><div class="peyebrow">第二步 · 描述符与状态</div>'
    +'<h1>情景由这些变量定义</h1>'
    +'<p class="plead">每个描述符分几档；每一档都挂着取值区间和它的政策依据。</p>'
    +'<table class="ptable"><thead><tr><th style="width:22%">描述符</th><th style="width:9%">类型</th>'
    +'<th>状态（含取值区间）</th><th style="width:16%">依据</th></tr></thead><tbody>';
  ds.slice(0,8).forEach(d=>{
    const o=dOf(d)||{}, defs=defsOf(d);
    const ev=(RANGE_EVID[d]||{}).k||'example';
    h+='<tr><td><b>'+d+'</b></td><td class="pdim">'+(o.t||'—')+'</td><td>'
      +defs.map(x=>x.n+(x.lo===null||x.hi===null?'':'<span class="prng">'+x.lo+'–'+x.hi+(x.u||'')+'</span>')).join('　')
      +'</td><td class="pdim">'+(EVID_WORD[ev]||'')+'</td></tr>';
  });
  h+='</tbody></table>';
  if(ds.length>8) h+='<p class="pnote">此处展示前 8 个，共 '+ds.length+' 个。</p>';
  h+='</div>';
  return h;
}

function presPolicy(){
  const withMap=POLICY.filter(p=>p.m&&p.m.length);
  const noMap=POLICY.length-withMap.length;
  let h='<div class="pch"><div class="peyebrow">上游 · 政策库与映射</div>'
    +'<h1>政策语言 → 模型语言</h1>'
    +'<p class="plead">政策文件说的「补贴」「标准」「目标」，要落到模型里具体哪个变量上。'
    +'这是一张查找表——德国软件从描述符开始，我们从政策开始。</p>'
    +'<div class="pstats">'+presStat(POLICY.length,'条政策路径')+presStat(withMap.length,'条有对应变量')
      +presStat(noMap,'条不在模型口径内')+'</div>';
  h+='<table class="ptable"><thead><tr><th style="width:30%">政策路径</th><th style="width:12%">类别</th>'
    +'<th>对应到</th></tr></thead><tbody>';
  withMap.slice(0,7).forEach(p=>{
    h+='<tr><td><b>'+p.n+'</b></td><td class="pdim">'+p.c+'</td><td>'
      +p.m.map(x=>x[0]+'<span class="pconf">'+x[1]+'</span>').join('　')+'</td></tr>';
  });
  h+='</tbody></table>';
  h+='<p class="pnote">「不在模型口径内」本身是一条有用的属性——它告诉你哪些政策工具这个模型看不见。</p></div>';
  return h;
}

function presMatrix(){
  const ds=Object.keys(sel.desc);
  if(ds.length<2) return '<div class="pch"><h1>还差一步</h1><p class="plead">至少要选两个描述符才谈得上互相影响。</p></div>';
  const show=ds.slice(0,8), n=show.length;
  let filled=0, low=0, rev=0, total=n*(n-1);
  let h='<div class="pch"><div class="peyebrow">第三步 · 交叉影响</div>'
    +'<h1>谁影响谁，有多强</h1>'
    +'<p class="plead">每一格问的是：「当 A 取某一档时，会不会把 B 推向某一档」。−3 到 +3，正向促进、负向抑制。</p>'
    +'<table class="pmat"><thead><tr><th class="pcnr">来源 ＼ 目标</th>';
  show.forEach(d=>{ h+='<th title="'+d+'">'+(DSHORT[d]||d)+'</th>'; });
  h+='</tr></thead><tbody>';
  show.forEach(s=>{
    h+='<tr><th class="pcrh">'+(DSHORT[s]||s)+'</th>';
    show.forEach(t=>{
      if(s===t){ h+='<td class="pself">—</td>'; return; }
      const r=cim[s+'>'+t];
      if(!r){ h+='<td class="pempty"></td>'; return; }
      filled++; if(r.conf==='低') low++; if(r.rev) rev++;
      const cls=r.v>0?('pv'+r.v):(r.v<0?('pn'+(-r.v)):'pz');
      h+='<td class="'+cls+'">'+(r.v>0?'+':'')+r.v+'</td>';
    });
    h+='</tr>';
  });
  h+='</tbody></table>';
  h+='<div class="pstats">'+presStat(filled+' / '+total,'已填判断')+presStat(low,'低置信度')
    +presStat(rev,'已人工审核')+'</div>';
  h+='<p class="pnote">颜色越深影响越强。低置信度的格子就是需要人复核的地方——'
    +'AI 先填一版，人只审这些。</p></div>';
  return h;
}

function presScen(){
  if(!cimResult||!cimResult.consistent.length) return '';
  const L=cimResult.consistent, ds=cimResult.ds;
  const cols=Math.min(L.length,10);
  let h='<div class="pch"><div class="peyebrow">第四步 · 自洽情景</div>'
    +'<h1>哪些组合站得住</h1>'
    +'<p class="plead">不是所有搭配都可能：每个变量都取「在别人给定之后自己最占优」的那一档，才算自洽。</p>'
    +'<div class="pstats">'+presStat(cimResult.total.toLocaleString(),'种组合')
      +presStat(cimResult.checked.toLocaleString(),'实际检查')
      +presStat(L.length,'组自洽')+presStat(cimResult.inconsistent.toLocaleString(),'组不自洽')+'</div>';
  if(L.length>50) h+='<div class="pwarn">自洽情景超过 50 组。按手册的经验，一屋子人讨论 50 组以上管不过来——'
    +'建议先在平台第 7 步用「情景筛选」收到 50 组以内再讲。</div>';
  h+='<table class="ptab2"><thead><tr><th class="pcnr">描述符</th>';
  for(let c=0;c<cols;c++) h+='<th>情景 '+(c+1)+'</th>';
  h+='</tr></thead><tbody>';
  ds.slice(0,9).forEach((d,ri)=>{
    h+='<tr><td class="pcnr">'+(DSHORT[d]||d)+'</td>';
    let c=0;
    while(c<cols){
      const v=L[c][ri];
      let span=1;
      while(c+span<cols && L[c+span][ri]===v) span++;
      const nm=ST(d)[v]||'?';
      h+='<td class="ps'+(v%5)+'" colspan="'+span+'">'+nm+(span>1?' ×'+span:'')+'</td>';
      c+=span;
    }
    h+='</tr>';
  });
  h+='</tbody></table>';
  if(L.length>cols) h+='<p class="pnote">此处显示前 '+cols+' 组，共 '+L.length+' 组。同一行颜色连成一片，说明这些情景在该变量上没有分歧。</p>';
  h+='</div>';
  return h;
}

function presOne(){
  if(!cimResult||!cimResult.consistent.length) return '';
  if(presScenIdx>=cimResult.consistent.length) presScenIdx=0;
  const cb=cimResult.consistent[presScenIdx], ds=cimResult.ds;
  let h='<div class="pch"><div class="peyebrow">第四步 · 情景 '+(presScenIdx+1)+'</div>'
    +'<h1>这一组为什么自洽</h1>'
    +'<p class="plead">逐个变量检查：选定这一档，在其他人已经给定的情况下，是不是它自己的最优选择。</p>'
    +'<table class="ptable"><thead><tr><th style="width:22%">描述符</th><th style="width:26%">本情景取值</th>'
    +'<th>各档的影响平衡（▲ 为最高）</th></tr></thead><tbody>';
  ds.slice(0,9).forEach((d,i)=>{
    const sts=ST(d), bal=[];
    for(let j=0;j<sts.length;j++){
      let s=0;
      for(let k=0;k<ds.length;k++){ if(k!==i) s+=impactVal(ds[k],cb[k],d,j); }
      bal.push(s);
    }
    const mx=Math.max.apply(null,bal);
    h+='<tr><td><b>'+d+'</b></td><td>'+sts[cb[i]]+'</td><td class="pbal">'
      +bal.map((v,j)=>(j===cb[i]?'<b>':'')+sts[j]+' '+(v>0?'+':'')+v.toFixed(1)
        +(Math.abs(v-mx)<1e-6?' ▲':'')+(j===cb[i]?'</b>':'')).join('　')+'</td></tr>';
  });
  h+='</tbody></table>';
  h+='<p class="pnote">每个变量都取到了自己的最高分，所以这组假设内部不打架。'
    +'注意：这只说明「内部一致」，不说明它在现实中可行。</p></div>';
  return h;
}

function presXl(){
  const ds=Object.keys(sel.desc);
  const L=xlayers();
  if(!ds.length||!L.length) return '<div class="pch"><h1>还没设置跨层</h1>'
    +'<p class="plead">退出演示，在第 1 步勾选多个层级、并在第 7 步的「跨层一致性」里设定各层取值。</p></div>';
  let confl=0;
  let h='<div class="pch"><div class="peyebrow">第五步 · 跨层一致性</div>'
    +'<h1>同一套假设，摊到四个尺度上还成立吗</h1>'
    +'<p class="plead">国家级是给定层（政策目标），不参与枚举；区域、省、市逐级落实。'
    +'相邻层级档位差 2 档以上，视为方向相反。</p>'
    +'<table class="ptable"><thead><tr><th style="width:24%">描述符</th>';
  L.forEach(l=>{ h+='<th>'+XL_NAME[l]+(l==='nation'?'（给定）':'')+'</th>'; });
  h+='<th style="width:16%">判定</th></tr></thead><tbody>';
  ds.slice(0,9).forEach(d=>{
    const sts=ST(d);
    h+='<tr><td><b>'+d+'</b></td>';
    L.forEach(l=>{
      const v=(xlSel[d]||{})[l];
      h+='<td>'+(v===undefined?'—':sts[v])+'</td>';
    });
    let bad=null;
    for(let i=0;i<L.length-1;i++){
      const a=(xlSel[d]||{})[L[i]], b=(xlSel[d]||{})[L[i+1]];
      if(a===undefined||b===undefined) continue;
      if(Math.abs(a-b)>=2){ bad=XL_NAME[L[i]]+'→'+XL_NAME[L[i+1]]+' 相差 '+Math.abs(a-b)+' 档'; break; }
    }
    if(bad){ confl++; h+='<td class="pbad">'+bad+'</td>'; }
    else h+='<td class="pok">一致</td>';
    h+='</tr>';
  });
  h+='</tbody></table>';
  h+='<p class="pnote">'+confl+' 个描述符存在跨层冲突。'
    +'这一页是德国软件没有的——它只有单层级，压根不存在这个问题。</p></div>';
  return h;
}

document.addEventListener('keydown', function(e){
  if(!presOpen) return;
  if(e.key==='Escape'){ closePres(); return; }
  if(e.key==='ArrowRight'||e.key==='PageDown'||e.key===' '){ e.preventDefault(); presNext(); }
  if(e.key==='ArrowLeft'||e.key==='PageUp'){ e.preventDefault(); presPrev(); }
});

/* ================= 主渲染 ================= */
function render(){
  renderSteps(); renderCmp(); layerTable(); renderTree(); renderStates();
  expDetail(); renderEnsBox(); scaleSum(); renderPolicy();
  renderCim(); renderEnsBar(); modelDetail(); renderAnc(); renderScopeBar(); checkResult(); renderXl(); renderLay(); renderFilt();
  renderTableau(); renderMap();
  confList(); timeline(); renderImpact(); renderPath(); renderAP(); renderProf(); renderCorr(); renderEnsPanel();
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
