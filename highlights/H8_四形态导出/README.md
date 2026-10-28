# H8 ｜ 四种形态的导出（配置／参数表／叙事／后验）

## 解决什么问题

导出不是一个格式，是四种用途：模型配置文件（GCAM 真实 ScenarioComponents 结构、真实文件名；CHEER 侧标注 CSV→GDX 的转换路径）、结构化参数表、定性叙事稿、贝叶斯后验表。参数表带情景号（scenario,param,value）——CIB 求出的是一组互相咬合的自洽组合，导成一行一个参数等于把耦合又拆回独立参数，下游按行取值会读出彼此矛盾的组合。装配文件不确定的描述符会明确标注需人工补齐，不静默兜底。

## 代码位置（v1.5 工作副本）

- HTML：`_src/v15/index.html` 第 382–387 行
- 逻辑：`_src/v15/src/app.js`

| 函数／常量 | 行号 |
|---|---|
| `GEN_LABEL` | 274–274 |
| `genOf` | 275–275 |
| `genName` | 276–276 |
| `expMode` | 1649–1653 |
| `expRows` | 1654–1673 |
| `expLabel` | 1674–1674 |
| `multiPickNote` | 1677–1683 |
| `csvCell` | 1684–1687 |
| `paramOf` | 1650–1653 |
| `paramsCSV` | 1721–1737 |
| `setExpMode` | 1739–1739 |
| `downloadParams` | 1738–1738 |
| `downloadParamsBtn` | 1917–1917 |
| `narrText` | 1742–1761 |
| `bayesCSV` | 1762–1774 |
| `curScenInfo` | 1779–1790 |
| `tableCSV` | 1791–1814 |
| `genMain` | 1815–1821 |
| `genMainLabel` | 1822–1828 |
| `genSubHTML` | 1829–1842 |
| `renderOutBtns` | 1844–1847 |
| `syncGenOpts` | 1849–1857 |
| `renderGenOut` | 1858–1882 |
| `preview` | 1688–1720 |
| `xmlTag` | 1883–1899 |
| `xmlFile` | 1900–1915 |
| `download` | 1916–1916 |
| `downloadAll` | 1918–1931 |
| `dl` | 1932–1938 |
| `fmtTag` | 1939–1939 |
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

本模块还调用了 9 个**没有随本目录切出**的辅助函数，直接拷走本目录跑不起来；
要跑请用完整平台，或连同下列调用一起取：

`ST`　`checkSelected`　`computeBayes`　`dOf`　`defsOf`　`nSel`　`nowStr`　`selIdxOf`　`unknown`

## 复用方式

1. 引入 `../_shared/base.css`（含 v1.5 全部设计令牌与基础组件）；
2. 把 `fragment.html` 粘进页面结构；
3. 引入 `logic.js`，在数据准备好之后调用其渲染入口。

> 本目录由 `build_highlights.py` 从源码切出，请勿手改——改平台源码后重新生成。
