# H4 ｜ 描述符状态面板（区间／依据／已知值／分层档位）

## 解决什么问题

本方法的核心一屏。每个描述符的状态都挂取值区间，于是「高速／中速」这类定性标签落到具体数值范围上；区间可改、状态可增删、可重命名，改了以后原依据自动降为「已改」。依据徽标自己就是悬停锚点，说明文字挂在 data-tip 上，不占版面。「已知值」（原「数值锚定」独立卡片）也长在这里：填一个现实区间，检算时与它完全不相交的状态直接排除。状态勾选不是标签，而是划定可信范围——勾了的档位才是候选，枚举与检验只在范围内搜。

## 代码位置（v1.5 工作副本）

- HTML：`_src/v15/index.html` 第 168–200 行
- 逻辑：`_src/v15/src/app.js`

| 函数／常量 | 行号 |
|---|---|
| `RANGE_PRESET` | 479–499 |
| `RANGE_EVID` | 502–522 |
| `EVID_WORD` | 523–523 |
| `SCOPE_NAME` | 528–528 |
| `SCOPE_PRESET` | 533–543 |
| `SCOPE_NOTE` | 544–550 |
| `stateDefs` | 552–552 |
| `stateDefsScope` | 529–529 |
| `scopedDefs` | 530–530 |
| `defsOf` | 555–587 |
| `baseOf` | 590–590 |
| `clearScopeCache` | 591–593 |
| `setScope` | 594–598 |
| `dropScopeOverride` | 599–604 |
| `renderScopeBar` | 605–610 |
| `ST` | 613–613 |
| `rngTxt` | 614–618 |
| `rngIssues` | 621–631 |
| `editRange` | 632–632 |
| `addState` | 633–633 |
| `numOf` | 634–634 |
| `txtOf` | 635–635 |
| `saveRange` | 636–651 |
| `renState` | 652–663 |
| `delState` | 664–672 |
| `doAddState` | 673–681 |
| `attrEsc` | 684–689 |
| `renderStates` | 691–766 |
| `renderTree` | 382–433 |
| `toggleDetail` | 434–437 |
| `toggleNode` | 438–441 |
| `onSearch` | 442–442 |
| `setSearch` | 443–443 |
| `selDesc` | 444–448 |
| `tglState` | 454–463 |
| `selIdxOf` | 465–469 |
| `rangeSize` | 471–473 |
| `ancOf` | 843–843 |
| `ancTxt` | 844–847 |
| `parseAnc` | 848–856 |
| `setAnc` | 857–865 |
| `clearAnc` | 866–866 |
| `ancAllowed` | 872–882 |
| `ancConflicts` | 885–899 |
| `selRangeHTML` | 902–908 |
| `ancRowHTML` | 910–924 |
| `ancSummaryHTML` | 926–942 |
| `ancConflictHTML` | 945–951 |

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

本模块还调用了 11 个**没有随本目录切出**的辅助函数，直接拷走本目录跑不起来；
要跑请用完整平台，或连同下列调用一起取：

`TREE`　`after`　`allDescs`　`collapsed`　`dOf`　`expanded`　`nSel`　`names`　`searchQ`　`toast`　`xlPickHTML`

## 复用方式

1. 引入 `../_shared/base.css`（含 v1.5 全部设计令牌与基础组件）；
2. 把 `fragment.html` 粘进页面结构；
3. 引入 `logic.js`，在数据准备好之后调用其渲染入口。

> 本目录由 `build_highlights.py` 从源码切出，请勿手改——改平台源码后重新生成。
