# 自检脚本（31 套）

对着**本目录上一级**的源码跑，不是对着仓库根的单文件成品。改动 `../src/` 后先跑这里，再重新打包。

## 跑法

**用统一闸门跑，不要逐套手跑。**

```powershell
powershell -File .\run_tests.ps1            # 源码级 30 套 + 成品级 1 套自动跳过
powershell -File .\run_tests.ps1 -Prod      # 另含成品冒烟（要先打包出单文件）
```

`run_tests.ps1` 是**唯一会因断言失败而非零退出的入口**：它收走每套输出、数 `✗`，任何一处 `✗` 或非零退出都让它自己 exit 1，并自动按规则喂参数（`test_menu.js` / `test_doc.js` 传 `..\index.html`，`test_gen_smoke.js` 传成品单文件）。

为什么不逐套手跑：**这些脚本大多只把断言打成 `✓`/`✗` 打印，从不让进程以非零码退出**。命令行看到的"全过"只等于"没崩"，`✗` 会被静默吞掉。逐套 `node test_x.js ..\src\app.js` 看不出真假。

闸门本身是 ASCII-only 的：Windows PowerShell 5.1 会把无 BOM 的 `.ps1` 按 ANSI 读，中文会解析失败、满屏 `Unexpected token`，闸门整体失效。所以不要往那个文件里加中文。

### 要手动跑单套时

```powershell
node test_excl.js ..\src\app.js          # 绝大多数套
node test_menu.js ..\index.html          # 特例
node test_doc.js ..\index.html           # 特例
node test_gen_smoke.js "..\京津冀政策情景快速评估平台_原型v1.5.html"   # 成品级
```

三个必须换参数的特例：

| 脚本 | 该传什么 | 为什么 |
|---|---|---|
| `test_menu.js` | `..\index.html` | 它自己再读同目录的 `src/app.js`（见该文件 4–6 行） |
| `test_doc.js` | `..\index.html` | 验的是 HTML 结构（侧栏分区、八个锚点） |
| `test_gen_smoke.js` | 上面的成品 `.html` | 成品级：从单文件里抠内联脚本；输入不是成品时它会打印「跳过」并正常退出 |

## 三个坑

**漏传参数会伪装成「全线崩溃」。** 每套脚本开头都是 `fs.readFileSync(process.argv[2], 'utf8')`，不带参数时 31 套里有 25 套会同时报
`TypeError [ERR_INVALID_ARG_TYPE]: The "path" argument must be of type string...`
另有 6 套有默认值所以「活着」（`test_doc` / `test_gen` / `test_home` / `test_menu` / `test_term` / `test_tip`）——很容易误判成「改坏了 25 个功能」。看到这个错先检查调用姿势。

**自检脚本自己吞掉崩溃。** 2026-10-24 修复：`test_anc` / `test_evid` / `test_layered` / `test_scope` 四套曾把断言包在 try/catch 里，捕获到异常只打一行「崩溃检测」就结束，退出码仍为 0——引用到不存在的函数时，脚本看起来还是「全部通过」。现在 catch 里补了 `process.exit(1)`。批量跑时不要只看「没报错」，要看退出码。

**`test_gen_smoke.js` 的输入必须是打包后的单文件。** 它靠
`/<script>\n([\s\S]*?)\n<\/script>/` 从成品里抠脚本；喂源码会找不到并跳过。要真正验成品，必须传上面那个 `.html`。

## 与版本的关系

这 31 套是 **v1.5 期**写的，覆盖 v1.5 的功能。对着 v1.4 源码跑会有 11 套失败（`test_anc` / `test_doc` / `test_excl` / `test_gen` /
`test_home` / `test_layered` / `test_menu` / `test_sel` / `test_term` / `test_tip` / `test_zerosem`；其中部分是断言不过、部分是引用到 v1.5 才有的函数而崩），**那是预期行为，不是回归**。历史版本因此不复制这份测试，统一挂在这里。
