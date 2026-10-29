# H4 ｜ 描述符状态面板（区间／依据／已知值）

## 解决什么问题

本方法的核心一屏。每个描述符的状态都挂取值区间，于是「高速／中速」这类定性标签落到具体数值范围上；区间可改、状态可增删、可重命名，改了以后原依据自动降为「已改」。依据徽标自己就是悬停锚点，说明文字挂在 data-tip 上，不占版面。「已知值」（原「数值锚定」独立卡片）也长在这里：填一个现实区间，检算时与它完全不相交的状态直接排除。状态勾选不是标签，而是划定可信范围——勾了的档位才是候选，枚举与检验只在范围内搜。

## 代码位置（v1.5 工作副本）

- HTML：`_src/v15/index.html` 第 179–204 行
- 逻辑：`_src/v15/src/app.js`

| 函数／常量 | 行号 |
|---|---|
| `RANGE_PRESET` | 489–509 |
| `RANGE_EVID` | 512–532 |
| `EVID_WORD` | 533–533 |
| `SCOPE_NAME` | 538–538 |
| `SCOPE_PRESET` | 543–553 |
| `SCOPE_NOTE` | 554–560 |
| `stateDefs` | 562–562 |
| `stateDefsScope` | 539–539 |
| `scopedDefs` | 540–540 |
| `defsOf` | 565–597 |
| `baseOf` | 600–600 |
| `clearScopeCache` | 601–603 |
| `setScope` | 604–608 |
| `dropScopeOverride` | 609–614 |
| `renderScopeBar` | 615–620 |
| `ST` | 623–623 |
| `rngTxt` | 624–628 |
| `rngIssues` | 631–641 |
| `editRange` | 642–642 |
| `addState` | 643–643 |
| `numOf` | 644–644 |
| `txtOf` | 645–645 |
| `saveRange` | 646–661 |
| `renState` | 662–673 |
| `delState` | 674–682 |
| `doAddState` | 683–691 |
| `attrEsc` | 694–699 |
| `renderStates` | 701–780 |
| `renderTree` | 383–435 |
| `toggleDetail` | 436–439 |
| `toggleNode` | 440–443 |
| `onSearch` | 444–444 |
| `setSearch` | 445–445 |
| `selDesc` | 446–450 |
| `tglState` | 456–465 |
| `selIdxOf` | 475–479 |
| `rangeSize` | 481–483 |
| `ancOf` | 931–931 |
| `ancTxt` | 932–935 |
| `parseAnc` | 936–944 |
| `setAnc` | 945–953 |
| `clearAnc` | 954–954 |
| `ancAllowed` | 960–970 |
| `ancConflicts` | 973–987 |
| `selRangeHTML` | 990–996 |
| `ancRowHTML` | 998–1012 |
| `ancSummaryHTML` | 1014–1030 |
| `ancConflictHTML` | 1033–1039 |

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

本模块还调用了 9 个**没有随本目录切出**的辅助函数，直接拷走本目录跑不起来；
要跑请用完整平台，或连同下列调用一起取：

`TREE`　`after`　`allDescs`　`collapsed`　`dOf`　`expanded`　`nSel`　`searchQ`　`toast`

## 复用方式

1. 引入 `../_shared/base.css`（含 v1.5 全部设计令牌与基础组件）；
2. 把 `fragment.html` 粘进页面结构；
3. 引入 `logic.js`，在数据准备好之后调用其渲染入口。

> 本目录由 `build_highlights.py` 从源码切出，请勿手改——改平台源码后重新生成。
