# H4 ｜ 描述符状态面板（区间／依据／已知值）

## 解决什么问题

本方法的核心一屏。每个描述符的状态都挂取值区间，于是「高速／中速」这类定性标签落到具体数值范围上；区间可改、状态可增删、可重命名，改了以后原依据自动降为「已改」。依据徽标自己就是悬停锚点，说明文字挂在 data-tip 上，不占版面。「已知值」（原「数值锚定」独立卡片）也长在这里：填一个现实区间，检算时与它完全不相交的状态直接排除。状态勾选不是标签，而是划定可信范围——勾了的档位才是候选，枚举与检验只在范围内搜。

## 代码位置（v1.5 工作副本）

- HTML：`_src/v15/index.html` 第 179–211 行
- 逻辑：`_src/v15/src/app.js`

| 函数／常量 | 行号 |
|---|---|
| `RANGE_PRESET` | 488–508 |
| `RANGE_EVID` | 511–531 |
| `EVID_WORD` | 532–532 |
| `SCOPE_NAME` | 537–537 |
| `SCOPE_PRESET` | 542–552 |
| `SCOPE_NOTE` | 553–559 |
| `stateDefs` | 561–561 |
| `stateDefsScope` | 538–538 |
| `scopedDefs` | 539–539 |
| `defsOf` | 564–596 |
| `baseOf` | 599–599 |
| `clearScopeCache` | 600–602 |
| `setScope` | 603–607 |
| `dropScopeOverride` | 608–613 |
| `renderScopeBar` | 614–619 |
| `ST` | 622–622 |
| `rngTxt` | 623–627 |
| `rngIssues` | 630–640 |
| `editRange` | 641–641 |
| `addState` | 642–642 |
| `numOf` | 643–643 |
| `txtOf` | 644–644 |
| `saveRange` | 645–660 |
| `renState` | 661–672 |
| `delState` | 673–681 |
| `doAddState` | 682–690 |
| `attrEsc` | 693–698 |
| `renderStates` | 700–777 |
| `renderTree` | 383–434 |
| `toggleDetail` | 435–438 |
| `toggleNode` | 439–442 |
| `onSearch` | 443–443 |
| `setSearch` | 444–444 |
| `selDesc` | 445–449 |
| `tglState` | 455–464 |
| `selIdxOf` | 474–478 |
| `rangeSize` | 480–482 |
| `ancOf` | 852–852 |
| `ancTxt` | 853–856 |
| `parseAnc` | 857–865 |
| `setAnc` | 866–874 |
| `clearAnc` | 875–875 |
| `ancAllowed` | 881–891 |
| `ancConflicts` | 894–908 |
| `selRangeHTML` | 911–917 |
| `ancRowHTML` | 919–933 |
| `ancSummaryHTML` | 935–951 |
| `ancConflictHTML` | 954–960 |

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
