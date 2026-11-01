# H4 ｜ 描述符状态面板（区间／依据／已知值）

## 解决什么问题

本方法的核心一屏。每个描述符的状态都挂取值区间，于是「高速／中速」这类定性标签落到具体数值范围上；区间可改、状态可增删、可重命名，改了以后原依据自动降为「已改」。依据徽标自己就是悬停锚点，说明文字挂在 data-tip 上，不占版面。「已知值」（原「数值锚定」独立卡片）也长在这里：填一个现实区间，检算时与它完全不相交的状态直接排除。状态勾选不是标签，而是划定可信范围——勾了的档位才是候选，枚举与检验只在范围内搜。

## 代码位置（v1.5 工作副本）

- HTML：`_src/v15/index.html` 第 192–217 行
- 逻辑：`_src/v15/src/app.js`

| 函数／常量 | 行号 |
|---|---|
| `RANGE_PRESET` | 549–574 |
| `RANGE_EVID` | 577–602 |
| `EVID_WORD` | 603–603 |
| `SCOPE_NAME` | 608–608 |
| `SCOPE_PRESET` | 613–623 |
| `SCOPE_NOTE` | 624–630 |
| `stateDefs` | 632–632 |
| `stateDefsScope` | 609–609 |
| `scopedDefs` | 610–610 |
| `defsOf` | 635–667 |
| `baseOf` | 670–670 |
| `clearScopeCache` | 671–673 |
| `setScope` | 674–678 |
| `dropScopeOverride` | 679–684 |
| `renderScopeBar` | 685–690 |
| `ST` | 693–693 |
| `rngTxt` | 694–698 |
| `rngIssues` | 701–711 |
| `editRange` | 712–712 |
| `addState` | 713–713 |
| `numOf` | 714–714 |
| `txtOf` | 715–715 |
| `saveRange` | 716–731 |
| `renState` | 732–743 |
| `delState` | 744–752 |
| `doAddState` | 753–761 |
| `attrEsc` | 771–776 |
| `renderStates` | 778–857 |
| `renderTree` | 408–460 |
| `toggleDetail` | 487–490 |
| `toggleNode` | 491–494 |
| `onSearch` | 495–495 |
| `setSearch` | 496–496 |
| `selDesc` | 497–510 |
| `tglState` | 516–525 |
| `selIdxOf` | 535–539 |
| `rangeSize` | 541–543 |
| `ancOf` | 1010–1010 |
| `ancTxt` | 1011–1014 |
| `parseAnc` | 1015–1023 |
| `setAnc` | 1024–1032 |
| `clearAnc` | 1033–1033 |
| `ancAllowed` | 1039–1049 |
| `ancConflicts` | 1052–1066 |
| `selRangeHTML` | 1069–1075 |
| `ancRowHTML` | 1077–1091 |
| `ancSummaryHTML` | 1093–1109 |
| `ancConflictHTML` | 1112–1118 |

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
