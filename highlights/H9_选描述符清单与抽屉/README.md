# H9 ｜ 选描述符：清单 + 抽屉（页面不再随选择变长）

## 解决什么问题

原来左右两栏并置：左边描述符树固定 660px，右边每个已选描述符一整块状态设置（约 300px）。选 10 个时右栏到 3003px，左栏早在 660px 就滚完了，两栏彻底脱节，下面的「描述符框架」被顶到 3700px 处。现在主区只有一列：顶部一行「已选 N 个 · 应判 M 条」＋「添加描述符」，下面是清单，每个描述符一行（名称、档位覆盖、当前档、设置）。重内容进抽屉——点「添加」出搜索与树（可多选、可全选／清空），点行内「设置」出该描述符的状态面板，底部带「上一项／下一项」可连改。实测 10 个描述符整页 1381px，比原来短 2.7 倍，增长从「每多一个 +300px」变成「+52px」。点抽屉以外的空白处即可关闭。

## 代码位置（v1.5 工作副本）

- HTML：`_src/v15/index.html` 第 194–219 行
- 逻辑：`_src/v15/src/app.js`

| 函数／常量 | 行号 |
|---|---|
| `sel` | 263–263 |
| `renderDescList` | 830–850 |
| `renderP2Stat` | 827–829 |
| `renderP2Drawer` | 854–885 |
| `renderTree` | 383–435 |
| `renderTreeCnt` | 436–439 |
| `renderStates` | 736–815 |
| `descSelAll` | 444–455 |
| `descClearAll` | 456–461 |
| `descStep` | 886–891 |
| `openDescDrawer` | 851–851 |
| `openAddDrawer` | 852–852 |
| `closeP2Drawer` | 853–853 |
| `selDesc` | 472–485 |
| `tglState` | 491–500 |

- 样式：本目录 `style.css`（摘录）；完整样式表见 `../_shared/base.css`

## 本目录文件

| 文件 | 内容 |
|---|---|
| `fragment.html` | 该模块的 HTML 片段 |
| `logic.js` | 该模块的 JS（整段切出，含依赖的数据常量） |
| `style.css` | 该模块相关样式摘录 |
| `README.md` | 本说明 |

## 依赖的平台状态（未随本模块导出）

`sel`、`rngScope`、`render`、`TICK`

## 目录外的函数依赖

本模块还调用了 17 个**没有随本目录切出**的辅助函数，直接拷走本目录跑不起来；
要跑请用完整平台，或连同下列调用一起取：

`TREE`　`allDescs`　`ancConflictHTML`　`ancRowHTML`　`ancSummaryHTML`　`attrEsc`　`collapsed`　`defs`　`defsOf`　`expanded`　`nSel`　`p2StatHTML`　`rngIssues`　`rngTxt`　`searchQ`　`selRangeHTML`　`toast`

## 复用方式

1. 引入 `../_shared/base.css`（含 v1.5 全部设计令牌与基础组件）；
2. 把 `fragment.html` 粘进页面结构；
3. 引入 `logic.js`，在数据准备好之后调用其渲染入口。

> 本目录由 `build_highlights.py` 从源码切出，请勿手改——改平台源码后重新生成。
