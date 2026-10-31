# H8 ｜ 四种形态的导出（配置／参数表／叙事／后验）

## 解决什么问题

导出不是一个格式，是四种用途：模型配置文件（GCAM 真实 ScenarioComponents 结构、真实文件名；CHEER 侧标注 CSV→GDX 的转换路径）、结构化参数表、定性叙事稿、贝叶斯后验表。参数表带情景号（scenario,param,value）——CIB 求出的是一组互相咬合的自洽组合，导成一行一个参数等于把耦合又拆回独立参数，下游按行取值会读出彼此矛盾的组合。装配文件不确定的描述符会明确标注需人工补齐，不静默兜底。

## 代码位置（v1.5 工作副本）

- HTML：`_src/v15/index.html` 第 374–379 行
- 逻辑：`_src/v15/src/app.js`

| 函数／常量 | 行号 |
|---|---|
| `GEN_LABEL` | 274–274 |
| `genOf` | 275–275 |
| `genName` | 276–276 |
| `expMode` | 1783–1787 |
| `expRows` | 1796–1817 |
| `expLabel` | 1818–1818 |
| `multiPickNote` | 1821–1827 |
| `csvCell` | 1828–1831 |
| `paramOf` | 1784–1787 |
| `paramsCSV` | 1865–1882 |
| `setExpMode` | 1884–1884 |
| `downloadParams` | 1883–1883 |
| `downloadParamsBtn` | 2104–2104 |
| `narrText` | 1887–1908 |
| `bayesCSV` | 1909–1929 |
| `curScenInfo` | 1934–1945 |
| `tableCSV` | 1971–1995 |
| `genMain` | 1996–2002 |
| `genMainLabel` | 2003–2009 |
| `genSubHTML` | 2010–2023 |
| `renderOutBtns` | 2025–2028 |
| `syncGenOpts` | 2030–2038 |
| `renderGenOut` | 2039–2063 |
| `preview` | 1832–1864 |
| `xmlTag` | 2064–2080 |
| `xmlFile` | 2081–2096 |
| `download` | 2097–2103 |
| `downloadAll` | 2105–2118 |
| `dl` | 2119–2125 |
| `fmtTag` | 2126–2126 |
| `fmtNum` | 286–290 |

- 样式：本目录 `style.css`（摘录）；完整样式表见 `../_shared/base.css`

## 本目录文件

| 文件 | 内容 |
|---|---|
| `fragment.html` | 该模块的 HTML 片段 |
| `logic.js` | 该模块的 JS（整段切出，含依赖的数据常量） |
| `style.css` | 该模块相关样式摘录 |
| `README.md` | 本说明 |

## 依赖的平台状态（未随本模块导出）

`sel`、`curModel`、`cimResult`、`BAYES`、`useBayes`、`genMode`、`expertN`、`toast`、`render`

## 目录外的函数依赖

本模块还调用了 11 个**没有随本目录切出**的辅助函数，直接拷走本目录跑不起来；
要跑请用完整平台，或连同下列调用一起取：

`ST`　`cfgSrcLabel`　`checkSelected`　`computeBayes`　`dOf`　`defsOf`　`expNames`　`nowStr`　`provLines`　`selIdxOf`　`unknown`

## 复用方式

1. 引入 `../_shared/base.css`（含 v1.5 全部设计令牌与基础组件）；
2. 把 `fragment.html` 粘进页面结构；
3. 引入 `logic.js`，在数据准备好之后调用其渲染入口。

> 本目录由 `build_highlights.py` 从源码切出，请勿手改——改平台源码后重新生成。
