# H4 ｜ 描述符状态面板（区间／依据／已知值）

## 解决什么问题

本方法的核心一屏。每个描述符的状态都挂取值区间，于是「高速／中速」这类定性标签落到具体数值范围上；区间可改、状态可增删、可重命名，改了以后原依据自动降为「已改」。依据徽标自己就是悬停锚点，说明文字挂在 data-tip 上，不占版面。「已知值」（原「数值锚定」独立卡片）也长在这里：填一个现实区间，检算时与它完全不相交的状态直接排除。状态勾选不是标签，而是划定可信范围——勾了的档位才是候选，枚举与检验只在范围内搜。

## 代码位置（v1.5 工作副本）

- HTML：`_src/v15/index.html` 第 193–218 行
- 逻辑：`_src/v15/src/app.js`

| 函数／常量 | 行号 |
|---|---|
| `RANGE_PRESET` | 524–544 |
| `RANGE_EVID` | 547–567 |
| `EVID_WORD` | 568–568 |
| `SCOPE_NAME` | 573–573 |
| `SCOPE_PRESET` | 578–588 |
| `SCOPE_NOTE` | 589–595 |
| `stateDefs` | 597–597 |
| `stateDefsScope` | 574–574 |
| `scopedDefs` | 575–575 |
| `defsOf` | 600–632 |
| `baseOf` | 635–635 |
| `clearScopeCache` | 636–638 |
| `setScope` | 639–643 |
| `dropScopeOverride` | 644–649 |
| `renderScopeBar` | 650–655 |
| `ST` | 658–658 |
| `rngTxt` | 659–663 |
| `rngIssues` | 666–676 |
| `editRange` | 677–677 |
| `addState` | 678–678 |
| `numOf` | 679–679 |
| `txtOf` | 680–680 |
| `saveRange` | 681–696 |
| `renState` | 697–708 |
| `delState` | 709–717 |
| `doAddState` | 718–726 |
| `attrEsc` | 736–741 |
| `renderStates` | 743–822 |
| `renderTree` | 383–435 |
| `toggleDetail` | 462–465 |
| `toggleNode` | 466–469 |
| `onSearch` | 470–470 |
| `setSearch` | 471–471 |
| `selDesc` | 472–485 |
| `tglState` | 491–500 |
| `selIdxOf` | 510–514 |
| `rangeSize` | 516–518 |
| `ancOf` | 975–975 |
| `ancTxt` | 976–979 |
| `parseAnc` | 980–988 |
| `setAnc` | 989–997 |
| `clearAnc` | 998–998 |
| `ancAllowed` | 1004–1014 |
| `ancConflicts` | 1017–1031 |
| `selRangeHTML` | 1034–1040 |
| `ancRowHTML` | 1042–1056 |
| `ancSummaryHTML` | 1058–1074 |
| `ancConflictHTML` | 1077–1083 |

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
