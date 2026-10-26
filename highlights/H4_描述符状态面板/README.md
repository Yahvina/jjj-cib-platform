# H4 ｜ 描述符状态面板（区间／依据／已知值）

## 解决什么问题

本方法的核心一屏。每个描述符的状态都挂取值区间，于是「高速／中速」这类定性标签落到具体数值范围上；区间可改、状态可增删、可重命名，改了以后原依据自动降为「已改」。依据徽标自己就是悬停锚点，说明文字挂在 data-tip 上，不占版面。「已知值」（原「数值锚定」独立卡片）也长在这里：填一个现实区间，检算时与它完全不相交的状态直接排除。状态勾选不是标签，而是划定可信范围——勾了的档位才是候选，枚举与检验只在范围内搜。

## 代码位置（v1.5 工作副本）

- HTML：`_src/v15/index.html` 第 170–202 行
- 逻辑：`_src/v15/src/app.js`

| 函数／常量 | 行号 |
|---|---|
| `RANGE_PRESET` | 487–507 |
| `RANGE_EVID` | 510–530 |
| `EVID_WORD` | 531–531 |
| `SCOPE_NAME` | 536–536 |
| `SCOPE_PRESET` | 541–551 |
| `SCOPE_NOTE` | 552–558 |
| `stateDefs` | 560–560 |
| `stateDefsScope` | 537–537 |
| `scopedDefs` | 538–538 |
| `defsOf` | 563–595 |
| `baseOf` | 598–598 |
| `clearScopeCache` | 599–601 |
| `setScope` | 602–606 |
| `dropScopeOverride` | 607–612 |
| `renderScopeBar` | 613–618 |
| `ST` | 621–621 |
| `rngTxt` | 622–626 |
| `rngIssues` | 629–639 |
| `editRange` | 640–640 |
| `addState` | 641–641 |
| `numOf` | 642–642 |
| `txtOf` | 643–643 |
| `saveRange` | 644–659 |
| `renState` | 660–671 |
| `delState` | 672–680 |
| `doAddState` | 681–689 |
| `attrEsc` | 692–697 |
| `renderStates` | 699–776 |
| `renderTree` | 382–433 |
| `toggleDetail` | 434–437 |
| `toggleNode` | 438–441 |
| `onSearch` | 442–442 |
| `setSearch` | 443–443 |
| `selDesc` | 444–448 |
| `tglState` | 454–463 |
| `selIdxOf` | 473–477 |
| `rangeSize` | 479–481 |
| `ancOf` | 853–853 |
| `ancTxt` | 854–857 |
| `parseAnc` | 858–866 |
| `setAnc` | 867–875 |
| `clearAnc` | 876–876 |
| `ancAllowed` | 882–892 |
| `ancConflicts` | 895–909 |
| `selRangeHTML` | 912–918 |
| `ancRowHTML` | 920–934 |
| `ancSummaryHTML` | 936–952 |
| `ancConflictHTML` | 955–961 |

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

本模块还调用了 10 个**没有随本目录切出**的辅助函数，直接拷走本目录跑不起来；
要跑请用完整平台，或连同下列调用一起取：

`TREE`　`after`　`allDescs`　`collapsed`　`dOf`　`expanded`　`nSel`　`names`　`searchQ`　`toast`

## 复用方式

1. 引入 `../_shared/base.css`（含 v1.5 全部设计令牌与基础组件）；
2. 把 `fragment.html` 粘进页面结构；
3. 引入 `logic.js`，在数据准备好之后调用其渲染入口。

> 本目录由 `build_highlights.py` 从源码切出，请勿手改——改平台源码后重新生成。
