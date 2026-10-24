# H8 ｜ 四种形态的导出（配置／参数表／叙事／后验）

## 解决什么问题

导出不是一个格式，是四种用途：模型配置文件（GCAM 真实 ScenarioComponents 结构、真实文件名；CHEER 侧标注 CSV→GDX 的转换路径）、结构化参数表、定性叙事稿、贝叶斯后验表。参数表带情景号（scenario,param,value）——CIB 求出的是一组互相咬合的自洽组合，导成一行一个参数等于把耦合又拆回独立参数，下游按行取值会读出彼此矛盾的组合。装配文件不确定的描述符会明确标注需人工补齐，不静默兜底。

## 代码位置（v1.5 工作副本）

- HTML：`_src/v15/index.html` 第 382–387 行
- 逻辑：`_src/v15/src/app.js`

| 函数／常量 | 行号 |
|---|---|
| `GEN_LABEL` | 273–273 |
| `genOf` | 274–274 |
| `genName` | 275–275 |
| `expMode` | 1645–1649 |
| `expRows` | 1650–1669 |
| `expLabel` | 1670–1670 |
| `multiPickNote` | 1673–1679 |
| `csvCell` | 1680–1683 |
| `paramOf` | 1646–1649 |
| `paramsCSV` | 1717–1733 |
| `setExpMode` | 1735–1735 |
| `downloadParams` | 1734–1734 |
| `downloadParamsBtn` | 1913–1913 |
| `narrText` | 1738–1757 |
| `bayesCSV` | 1758–1770 |
| `curScenInfo` | 1775–1786 |
| `tableCSV` | 1787–1810 |
| `genMain` | 1811–1817 |
| `genMainLabel` | 1818–1824 |
| `genSubHTML` | 1825–1838 |
| `renderOutBtns` | 1840–1843 |
| `syncGenOpts` | 1845–1853 |
| `renderGenOut` | 1854–1878 |
| `preview` | 1684–1716 |
| `xmlTag` | 1879–1895 |
| `xmlFile` | 1896–1911 |
| `download` | 1912–1912 |
| `downloadAll` | 1914–1927 |
| `dl` | 1928–1934 |
| `fmtTag` | 1935–1935 |
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

## 复用方式

1. 引入 `../_shared/base.css`（含 v1.5 全部设计令牌与基础组件）；
2. 把 `fragment.html` 粘进页面结构；
3. 引入 `logic.js`，在数据准备好之后调用其渲染入口。

> 本目录由 `build_highlights.py` 从源码切出，请勿手改——改平台源码后重新生成。
