# H5 ｜ 自洽情景的判断链

## 解决什么问题

回应「评分要有过程」。枚举状态组合（组合数超 20 万自动改固定种子抽样），逐组算每个状态的影响平衡值——它从其余状态承受到的总量，加粗者是本情景选定状态，▲ 是该描述符的最高分。选定状态是自己的影响平衡值里最高的那一项，且组合内无冲突，才判自洽。展开任一情景能看到它由哪些档位组成、逐条影响各打了几分、以及为什么判自洽。

## 代码位置（v1.5 工作副本）

- HTML：`_src/v15/index.html` 第 349–351、356–356 行
- 逻辑：`_src/v15/src/app.js`

| 函数／常量 | 行号 |
|---|---|
| `TICK` | 303–304 |
| `mulberry` | 5261–5268 |
| `cimSig` | 5270–5277 |
| `comboSample` | 5280–5301 |
| `buildIMP` | 5303–5327 |
| `evalCombo` | 5329–5342 |
| `cloneCim` | 5343–5351 |
| `enumCore` | 1154–1234 |
| `runCIM` | 1236–1256 |
| `selectedCombo` | 1465–1471 |
| `checkSelected` | 1477–1500 |
| `checkResult` | 1513–1593 |
| `rangeStat` | 1503–1510 |
| `toggleAllScen` | 1512–1512 |
| `coFn` | 1634–1642 |
| `aliveTable` | 1645–1672 |
| `freqOf` | 1674–1686 |
| `scenCard` | 1594–1602 |
| `scenDetail` | 1603–1629 |
| `toggleScen` | 1630–1630 |
| `impactVal` | 1016–1024 |
| `pairIndexTable` | 1144–1151 |
| `p6Apply` | 6684–6694 |
| `p6Group` | 6695–6703 |
| `p6All` | 6704–6704 |
| `p6Status` | 6705–6711 |

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
