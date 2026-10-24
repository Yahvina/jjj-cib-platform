# H5 ｜ 自洽情景的判断链

## 解决什么问题

回应「评分要有过程」。枚举状态组合（组合数超 20 万自动改固定种子抽样），逐组算每个状态的影响平衡值——它从其余状态承受到的总量，加粗者是本情景选定状态，▲ 是该描述符的最高分。选定状态是自己的影响平衡值里最高的那一项，且组合内无冲突，才判自洽。展开任一情景能看到它由哪些档位组成、逐条影响各打了几分、以及为什么判自洽。

## 代码位置（v1.5 工作副本）

- HTML：`_src/v15/index.html` 第 328–330、335–338 行
- 逻辑：`_src/v15/src/app.js`

| 函数／常量 | 行号 |
|---|---|
| `TICK` | 277–278 |
| `mulberry` | 3958–3965 |
| `cimSig` | 3967–3974 |
| `comboSample` | 3977–3998 |
| `buildIMP` | 4000–4024 |
| `evalCombo` | 4026–4039 |
| `cloneCim` | 4040–4048 |
| `enumCore` | 967–1047 |
| `runCIM` | 1049–1065 |
| `selectedCombo` | 1272–1277 |
| `checkSelected` | 1282–1302 |
| `checkResult` | 1315–1397 |
| `rangeStat` | 1305–1312 |
| `toggleAllScen` | 1314–1314 |
| `coFn` | 1438–1446 |
| `aliveTable` | 1449–1476 |
| `freqOf` | 1478–1490 |
| `scenCard` | 1398–1406 |
| `scenDetail` | 1407–1433 |
| `toggleScen` | 1434–1434 |
| `impactVal` | 827–837 |
| `pairIndexTable` | 957–964 |
| `p6Apply` | 4909–4919 |
| `p6Group` | 4920–4928 |
| `p6All` | 4929–4929 |
| `p6Status` | 4930–4936 |

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

## 复用方式

1. 引入 `../_shared/base.css`（含 v1.5 全部设计令牌与基础组件）；
2. 把 `fragment.html` 粘进页面结构；
3. 引入 `logic.js`，在数据准备好之后调用其渲染入口。

> 本目录由 `build_highlights.py` 从源码切出，请勿手改——改平台源码后重新生成。
