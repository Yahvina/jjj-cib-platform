# H8 ｜ 四种形态的导出（配置／参数表／叙事／后验）

## 解决什么问题

导出不是一个格式，是四种用途：模型配置文件（GCAM 真实 ScenarioComponents 结构、真实文件名；CHEER 侧标注 CSV→GDX 的转换路径）、结构化参数表、定性叙事稿、贝叶斯后验表。参数表带情景号（scenario,param,value）——CIB 求出的是一组互相咬合的自洽组合，导成一行一个参数等于把耦合又拆回独立参数，下游按行取值会读出彼此矛盾的组合。装配文件不确定的描述符会明确标注需人工补齐，不静默兜底。

## 代码位置（v1.5 工作副本）

- HTML：`_src/v15/index.html` 第 371–376 行
- 逻辑：`_src/v15/src/app.js`

| 函数／常量 | 行号 |
|---|---|
| `GEN_LABEL` | 273–273 |
| `genOf` | 274–274 |
| `genName` | 275–275 |
| `expMode` | 1648–1652 |
| `expRows` | 1653–1672 |
| `expLabel` | 1673–1673 |
| `multiPickNote` | 1676–1682 |
| `csvCell` | 1683–1686 |
| `paramOf` | 1649–1652 |
| `paramsCSV` | 1720–1736 |
| `setExpMode` | 1738–1738 |
| `downloadParams` | 1737–1737 |
| `downloadParamsBtn` | 1916–1916 |
| `narrText` | 1741–1760 |
| `bayesCSV` | 1761–1773 |
| `curScenInfo` | 1778–1789 |
| `tableCSV` | 1790–1813 |
| `genMain` | 1814–1820 |
| `genMainLabel` | 1821–1827 |
| `genSubHTML` | 1828–1841 |
| `renderOutBtns` | 1843–1846 |
| `syncGenOpts` | 1848–1856 |
| `renderGenOut` | 1857–1881 |
| `preview` | 1687–1719 |
| `xmlTag` | 1882–1898 |
| `xmlFile` | 1899–1914 |
| `download` | 1915–1915 |
| `downloadAll` | 1917–1930 |
| `dl` | 1931–1937 |
| `fmtTag` | 1938–1938 |
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
