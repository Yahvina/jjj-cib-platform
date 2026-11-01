# H2 ｜ 政策库与映射（含政策依据补证）

## 解决什么问题

把「手工逐条定义状态」换成「从政策库预填」，这是整个平台最直接的一个卖点。内置 106 条政策路径，逐条挂到描述符上，并标注置信度与依据；点开一条能看到工具级记录、涉及地区、《文件名》与用于核对的原文引文。政策侧的联网核实结果（文号＋关键条款＋官方原文链接）单独挂在 POLICY_VERIF 上，按条计数。

## 代码位置（v1.5 工作副本）

- HTML：`_src/v15/index.html` 第 153–189 行
- 逻辑：`_src/v15/src/app.js`

| 函数／常量 | 行号 |
|---|---|
| `POLICY` | 146–253 |
| `POLICY_EVID` | 255–255 |
| `POLICY_VERIF` | 262–278 |
| `PALLC` | 3429–3429 |
| `nSel` | 306–306 |
| `renderPolicy` | 3479–3529 |
| `pickPolicy` | 3530–3530 |
| `polEvid` | 3532–3534 |
| `polEvidBlock` | 3576–3576 |
| `polSidePanel` | 3594–3634 |
| `verifBlock` | 3654–3662 |
| `applyPolicy` | 3667–3685 |
| `uploadPolicy` | 3686–3708 |
| `prepErr` | 3776–3781 |

- 样式：本目录 `style.css`（摘录）；完整样式表见 `../_shared/base.css`

## 本目录文件

| 文件 | 内容 |
|---|---|
| `fragment.html` | 该模块的 HTML 片段 |
| `logic.js` | 该模块的 JS（整段切出，含依赖的数据常量） |
| `style.css` | 该模块相关样式摘录 |
| `README.md` | 本说明 |

## 依赖的平台状态（未随本模块导出）

`sel`、`cimResult`、`toast`、`render`

## 目录外的函数依赖

本模块还调用了 13 个**没有随本目录切出**的辅助函数，直接拷走本目录跑不起来；
要跑请用完整平台，或连同下列调用一起取：

`allDescs`　`attrEsc`　`cimKeys`　`dOf`　`polDeptHit`　`polDeptList`　`polDeptTag`　`polDepts`　`polEvidFiles`　`polEvidMaps`　`polModelBlock`　`polTimeBlock`　`polUser`

## 复用方式

1. 引入 `../_shared/base.css`（含 v1.5 全部设计令牌与基础组件）；
2. 把 `fragment.html` 粘进页面结构；
3. 引入 `logic.js`，在数据准备好之后调用其渲染入口。

> 本目录由 `build_highlights.py` 从源码切出，请勿手改——改平台源码后重新生成。
