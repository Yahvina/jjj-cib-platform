# 这是一份历史存档，不是现行测试

本目录保存的是 v1.2 时期（2026-10-17）的 16 套自检，仅供追溯，**请勿在此目录跑测试或据此判断平台现状**。

- 其中 6 套（`test_anc.js`、`test_evid.js`、`test_layered.js`、`test_pres.js`、`test_scope.js`、`test_xtab.js`）与现行版本已不一致——对应功能后来被下沉或删除（见仓库 [`HANDOFF.md`](../../HANDOFF.md) 第 6 节「能力下沉而非删除」）。
- **现行测试在** [`platform/v1.5/tests/`](../../platform/v1.5/tests/)（33 套 + 统一闸门 `run_tests.ps1`）。

跑法：

```bash
powershell -ExecutionPolicy Bypass -File platform/v1.5/tests/run_tests.ps1 -Prod
```

为什么它容易被误当成现行测试：[`docs/平台功能详解_v1.3.html`](../平台功能详解_v1.3.html) 里有一句「位置：仓库 docs/tests、platform/v1.x」，读起来像两者等价，其实前者是 v1.2 存档、后者才是现行。
