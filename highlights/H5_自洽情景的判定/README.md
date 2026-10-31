# H5 ｜ 自洽情景的判断链

## 解决什么问题

回应「评分要有过程」。枚举状态组合（组合数超 20 万自动改固定种子抽样），逐组算每个状态的影响平衡值——它从其余状态承受到的总量，加粗者是本情景选定状态，▲ 是该描述符的最高分。选定状态是自己的影响平衡值里最高的那一项，且组合内无冲突，才判自洽。展开任一情景能看到它由哪些档位组成、逐条影响各打了几分、以及为什么判自洽。

## 代码位置（v1.5 工作副本）

- HTML：`_src/v15/index.html` 第 353–355、360–360 行
- 逻辑：`_src/v15/src/app.js`

| 函数／常量 | 行号 |
|---|---|
| `TICK` | 278–279 |
| `mulberry` | 5228–5235 |
| `cimSig` | 5237–5244 |
| `comboSample` | 5247–5268 |
| `buildIMP` | 5270–5294 |
| `evalCombo` | 5296–5309 |
| `cloneCim` | 5310–5318 |
| `enumCore` | 1099–1179 |
| `runCIM` | 1181–1201 |
| `selectedCombo` | 1410–1416 |
| `checkSelected` | 1422–1445 |
| `checkResult` | 1458–1538 |
| `rangeStat` | 1448–1455 |
| `toggleAllScen` | 1457–1457 |
| `coFn` | 1579–1587 |
| `aliveTable` | 1590–1617 |
| `freqOf` | 1619–1631 |
| `scenCard` | 1539–1547 |
| `scenDetail` | 1548–1574 |
| `toggleScen` | 1575–1575 |
| `impactVal` | 961–969 |
| `pairIndexTable` | 1089–1096 |
| `p6Apply` | 6584–6594 |
| `p6Group` | 6595–6603 |
| `p6All` | 6604–6604 |
| `p6Status` | 6605–6611 |

- 样式：本目录 `style.css`（摘录）；完整样式表见 `../_shared/base.css`

## 本目录文件

| 文件 | 内容 |
|---|---|
| `fragment.html` | 该模块的 HTML 片段 |
| `logic.js` | 该模块的 JS（整段切出，含依赖的数据常量） |
| `style.css` | 该模块相关样式摘录 |
| `README.md` | 本说明 |

## 依赖的平台状态（未随本模块导出）

`sel`、`cim`、`cimResult`、`filt`、`toast`、`render`

## 目录外的函数依赖

本模块还调用了 17 个**没有随本目录切出**的辅助函数，直接拷走本目录跑不起来；
要跑请用完整平台，或连同下列调用一起取：

`ST`　`TREE`　`ancAllowed`　`ancOf`　`computeBayes`　`defsOf`　`el`　`emptyState`　`expandV`　`nowStr`　`prepErr`　`presence`　`rangeSize`　`rngTxt`　`rows`　`seen`　`selIdxOf`

## 复用方式

1. 引入 `../_shared/base.css`（含 v1.5 全部设计令牌与基础组件）；
2. 把 `fragment.html` 粘进页面结构；
3. 引入 `logic.js`，在数据准备好之后调用其渲染入口。

> 本目录由 `build_highlights.py` 从源码切出，请勿手改——改平台源码后重新生成。
