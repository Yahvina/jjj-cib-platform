# H4 ｜ 描述符状态面板（区间／依据／已知值）

## 解决什么问题

本方法的核心一屏。每个描述符的状态都挂取值区间，于是「高速／中速」这类定性标签落到具体数值范围上；区间可改、状态可增删、可重命名，改了以后原依据自动降为「已改」。依据徽标自己就是悬停锚点，说明文字挂在 data-tip 上，不占版面。「已知值」（原「数值锚定」独立卡片）也长在这里：填一个现实区间，检算时与它完全不相交的状态直接排除。状态勾选不是标签，而是划定可信范围——勾了的档位才是候选，枚举与检验只在范围内搜。

## 代码位置（v1.5 工作副本）

- HTML：`_src/v15/index.html` 第 192–215 行
- 逻辑：`_src/v15/src/app.js`

| 函数／常量 | 行号 |
|---|---|
| `RANGE_PRESET` | 569–594 |
| `RANGE_EVID` | 597–622 |
| `EVID_WORD` | 623–623 |
| `SCOPE_NAME` | 628–628 |
| `SCOPE_PRESET` | 633–643 |
| `SCOPE_NOTE` | 644–650 |
| `stateDefs` | 652–652 |
| `stateDefsScope` | 629–629 |
| `scopedDefs` | 630–630 |
| `defsOf` | 655–687 |
| `baseOf` | 690–690 |
| `clearScopeCache` | 691–693 |
| `setScope` | 694–698 |
| `dropScopeOverride` | 699–704 |
| `renderScopeBar` | 705–710 |
| `ST` | 713–713 |
| `rngTxt` | 714–718 |
| `rngIssues` | 721–731 |
| `editRange` | 732–732 |
| `addState` | 733–733 |
| `numOf` | 734–734 |
| `txtOf` | 735–735 |
| `saveRange` | 736–751 |
| `renState` | 752–763 |
| `delState` | 764–772 |
| `doAddState` | 773–781 |
| `attrEsc` | 791–796 |
| `renderStates` | 798–877 |
| `renderTree` | 408–480 |
| `toggleDetail` | 507–510 |
| `toggleNode` | 511–514 |
| `onSearch` | 515–515 |
| `setSearch` | 516–516 |
| `selDesc` | 517–530 |
| `tglState` | 536–545 |
| `selIdxOf` | 555–559 |
| `rangeSize` | 561–563 |
| `ancOf` | 1030–1030 |
| `ancTxt` | 1031–1034 |
| `parseAnc` | 1035–1043 |
| `setAnc` | 1044–1052 |
| `clearAnc` | 1053–1053 |
| `ancAllowed` | 1059–1069 |
| `ancConflicts` | 1072–1086 |
| `selRangeHTML` | 1089–1095 |
| `ancRowHTML` | 1097–1111 |
| `ancSummaryHTML` | 1113–1129 |
| `ancConflictHTML` | 1132–1138 |

- 样式：本目录 `style.css`（摘录）；完整样式表见 `../_shared/base.css`

## 本目录文件

| 文件 | 内容 |
|---|---|
| `fragment.html` | 该模块的 HTML 片段 |
| `logic.js` | 该模块的 JS（整段切出，含依赖的数据常量） |
| `style.css` | 该模块相关样式摘录 |
| `README.md` | 本说明 |

## 依赖的平台状态（未随本模块导出）

`sel`、`rngScope`、`rngEdit`、`rngAdd`、`cimResult`、`BAYES`、`render`

## 目录外的函数依赖

本模块还调用了 12 个**没有随本目录切出**的辅助函数，直接拷走本目录跑不起来；
要跑请用完整平台，或连同下列调用一起取：

`TREE`　`after`　`allDescs`　`collapsed`　`dOf`　`expanded`　`nSel`　`renderDescList`　`renderP2Stat`　`renderTreeCnt`　`searchQ`　`toast`

## 复用方式

1. 引入 `../_shared/base.css`（含 v1.5 全部设计令牌与基础组件）；
2. 把 `fragment.html` 粘进页面结构；
3. 引入 `logic.js`，在数据准备好之后调用其渲染入口。

> 本目录由 `build_highlights.py` 从源码切出，请勿手改——改平台源码后重新生成。
