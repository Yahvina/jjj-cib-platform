# H8 ｜ 一键导出真实结构的模型配置

## 解决什么问题

导出的是 GCAM 真实的 ScenarioComponents 结构与真实文件名（socioeconomics_CHINA_SSP2.xml 等），不是自造格式；CHEER 侧标注 CSV→GDX 的转换路径。

## 代码位置（原 index.html）

- HTML：第 370–388 行、第 389–437 行
- 逻辑：第 909–933 行、第 933–977 行、第 977–978 行
- 样式：见本目录 `style.css`；完整设计令牌见 `../_shared/base.css`

## 本目录文件

| 文件 | 内容 |
|---|---|
| `fragment.html` | 该模块的 HTML 片段 |
| `logic.js` | 该模块的核心 JS（含依赖的数据常量） |
| `style.css` | 该模块相关样式 |
| `README.md` | 本说明 |

## 复用方式

1. 把 `../_shared/base.css` 引入页面；
2. 复制 `fragment.html` 到页面结构里；
3. 引入 `logic.js`，并在页面加载后调用模块的渲染入口。
