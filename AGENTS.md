# AGENTS.md — 接手入口

京津冀政策情景快速评估平台。核心方法 **CIB（Cross-Impact Balance，交叉影响平衡）**：
政策 → 描述符 → 状态 → 两两影响打分（−3..+3）→ 筛自洽组合 → 转 GCAM-China / CHEER-CGE 参数。

平台是**纯离线单文件 HTML**：无后端、无构建工具链、不引任何外部库，双击即用。

## 第一步

**先读 `HANDOFF.md`**（同目录）。那里有：架构地图、红线、在途任务、踩坑清单（条条真踩过）、
关键文件路径表。它是本项目最完整的一份交接材料，别跳过。

## 三条命令

```bash
# 1. 跑自检（33 套）。这是唯一会因 ✗ 而失败的入口。
powershell -ExecutionPolicy Bypass -File platform/v1.5/tests/run_tests.ps1 -Prod

# 2. 只校验、不写文件（断言全过才继续）
python merge_v15.py --check

# 3. 分文件源码 → 单文件成品，并更新本仓库根 index.html（Pages 服务的那个）
python merge_v15.py
```

`merge_v15.py` 自己认布局，不用传路径：在仓库里跑就更新仓库，在工作区分文件副本里跑就写 `output/`。
断言失败即非零退出，且**失败发生在写任何文件之前**——不会留下半成品。

`highlights/` 是**生成物目录，不要手改**。改了平台源码就要重跑生成器，否则发布会被闸门挡住：

```bash
cd highlights && python build_highlights.py          # 重新生成
cd highlights && python build_highlights.py --check  # 校验是否过期，exit 1 = 过期
```

## 红线（违反会返工）

1. **分工**：本仓库是模型侧（描述符构建、参数翻译、一致性检验、平台开发）。
   数据集侧（政策事实采集编码核验、评分依据换源、政策库维护）不归这里，不要动。
2. **视觉规范已定稿**：纸白 `#FBFAF7` / 墨黑 `#1B1A17` / 靛青 `#2F4858` / 赭石 `#8C5A3C`；
   **弃用一切绿色**；字号 6 档 11/13/15/16/21/30；宋体只用于 ≥21px 标题。
3. **术语**：CIB（不写 CRB）；「情景簇」（不叫族/组）；打分 `0` = 「两者无直接关系」，**不是置信度低**。
4. **对外交付** `.docx`/`.xlsx`/`.html`，不发 `.txt`；代码少注释、像人写的。

## 改完必须做的四件事

1. 跑闸门 `run_tests.ps1 -Prod` → 必须 33/33；
2. 若动了平台源码 → 重跑 `build_highlights.py`；
3. `python merge_v15.py` → 重新打包（**不加参数也会更新仓库根 `index.html`**，
   那才是 Pages 真正服务的文件；历史上漏过这一步，网页显示 200 但内容还是旧的）；
4. 在 `README.md` 版本表加一行，并在 `platform/v1.5/src/app.js` 的 `CHANGELOG` 与 `VERSIONS` 补条目。

## 已知会骗人的地方

- **多数测试只打印 `✓/✗`，从不设非零退出码**。单跑一套看到「全过」只等于「没崩」。
  只有 `run_tests.ps1` 会数 ✗ 并因此失败——**别用 `$LASTEXITCODE` 判断自检结果**。
- 单跑一套时要 `cd platform/v1.5/tests`，再 `node test_xxx.js ../src/app.js`；
  `test_menu.js` 与 `test_doc.js` 必须传 `../index.html`；`test_gen_smoke.js` 传成品单文件。
  漏掉路径参数会让 20 多套同时抛 `ERR_INVALID_ARG_TYPE`，看着像全线崩溃，其实只是调用姿势错。
- **`run_tests.ps1` 刻意保持纯 ASCII**：Windows PowerShell 5.1 读无 BOM 的 `.ps1` 按 ANSI 解，
  中文会变成语法错误、整个闸门失效。要加中文提示请用 `[char]0xXXXX` 拼，或先补 BOM。
- 推送后 `git push` 在 pwsh 里常因 stderr 被标成 `NativeCommandError` 而显示 exit 1，
  **但推送已成功**。判断标准是 `git rev-parse HEAD` 与 `origin/main` 是否相等。
- Pages 有约 1 分钟延迟。推送后立刻取线上可能仍是上一版，**别在第一次就下「没生效」的结论**。

其余坑（headless 验证三连坑、断言作用域、自指数字、整行替换等）都在 `HANDOFF.md` 第 6 节。
