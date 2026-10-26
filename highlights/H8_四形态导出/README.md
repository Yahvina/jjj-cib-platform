# H8 ｜ 四种形态的导出（配置／参数表／叙事／后验）

## 解决什么问题

导出不是一个格式，是四种用途：模型配置文件（GCAM 真实 ScenarioComponents 结构、真实文件名；CHEER 侧标注 CSV→GDX 的转换路径）、结构化参数表、定性叙事稿、贝叶斯后验表。参数表带情景号（scenario,param,value）——CIB 求出的是一组互相咬合的自洽组合，导成一行一个参数等于把耦合又拆回独立参数，下游按行取值会读出彼此矛盾的组合。装配文件不确定的描述符会明确标注需人工补齐，不静默兜底。

## 代码位置（v1.5 工作副本）

- HTML：`_src/v15/index.html` 第 373–378 行
- 逻辑：`_src/v15/src/app.js`

| 函数／常量 | 行号 |
|---|---|
| `GEN_LABEL` | 273–273 |
| `genOf` | 274–274 |
| `genName` | 275–275 |
| `expMode` | 1650–1654 |
| `expRows` | 1655–1674 |
| `expLabel` | 1675–1675 |
| `multiPickNote` | 1678–1684 |
| `csvCell` | 1685–1688 |
| `paramOf` | 1651–1654 |
| `paramsCSV` | 1722–1738 |
| `setExpMode` | 1740–1740 |
| `downloadParams` | 1739–1739 |
| `downloadParamsBtn` | 1918–1918 |
| `narrText` | 1743–1762 |
| `bayesCSV` | 1763–1775 |
| `curScenInfo` | 1780–1791 |
| `tableCSV` | 1792–1815 |
| `genMain` | 1816–1822 |
| `genMainLabel` | 1823–1829 |
| `genSubHTML` | 1830–1843 |
| `renderOutBtns` | 1845–1848 |
| `syncGenOpts` | 1850–1858 |
| `renderGenOut` | 1859–1883 |
| `preview` | 1689–1721 |
| `xmlTag` | 1884–1900 |
| `xmlFile` | 1901–1916 |
| `download` | 1917–1917 |
| `downloadAll` | 1919–1932 |
| `dl` | 1933–1939 |
| `fmtTag` | 1940–1940 |
| `fmtNum` | 285–289 |

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
