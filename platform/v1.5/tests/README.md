# 自检脚本（28 套）

对着**本目录上一级**的源码跑，不是对着仓库根的单文件成品。改动 `../src/` 后先跑这里，再重新打包。

## 跑法

在本目录下：

```powershell
# 源码级 25 套（三个特例见下）
Get-ChildItem test_*.js | ForEach-Object { node $_.Name ..\src\app.js }
```

三个必须换参数的特例：

| 脚本 | 该传什么 | 为什么 |
|---|---|---|
| `test_menu.js` | `..\index.html` | 它自己再读同目录的 `src/app.js`（见该文件 4–6 行） |
| `test_doc.js` | `..\index.html` | 验的是 HTML 结构（侧栏分区、八个锚点） |
| `test_gen_smoke.js` | `..\京津冀政策情景快速评估平台_原型v1.5.html` | 成品级：从单文件里抠内联脚本；输入不是成品时它会打印「跳过」并正常退出 |

一次跑全部（含三个特例）：

```powershell
$pass=0; $fail=@()
foreach($t in (Get-ChildItem test_*.js | Sort-Object Name)){
  $arg = "..\src\app.js"
  if($t.Name -in @('test_menu.js','test_doc.js')){ $arg = "..\index.html" }
  if($t.Name -eq 'test_gen_smoke.js'){ $arg = "..\京津冀政策情景快速评估平台_原型v1.5.html" }
  node $t.Name $arg *> $null
  if($LASTEXITCODE -eq 0){ $pass++ } else { $fail += $t.Name }
}
"PASS $pass / $($pass + $fail.Count)"; $fail
```

## 三个坑

**漏传参数会伪装成「全线崩溃」。** 每套脚本开头都是 `fs.readFileSync(process.argv[2], 'utf8')`，不带参数时 24 套会同时报
`TypeError [ERR_INVALID_ARG_TYPE]: The "path" argument must be of type string...`
只有 `test_home.js`、`test_menu.js` 有默认值所以「活着」——很容易误判成改坏了 24 个功能。看到这个错先检查调用姿势。

**自检脚本自己吞掉崩溃。** 2026-10-24 修复：`test_anc` / `test_evid` / `test_layered` / `test_scope` 四套把断言包在 try/catch 里，捕获到异常只打一行“崩溃检测”就结束，退出码仍为 0——引用到不存在的函数时，脚本看起来还是“全部通过”。现在 catch 里补了 `process.exit(1)`。批量跑时不要只看“没报错”，要看退出码。

**`test_gen_smoke.js` 的输入必须是打包后的单文件。** 它靠
`/<script>\n([\s\S]*?)\n<\/script>/` 从成品里抠脚本；喂源码会找不到并跳过。要真正验成品，必须传上面那个 `.html`。

## 与版本的关系

这 28 套是 **v1.5 期**写的，覆盖 v1.5 的功能。对着 v1.4 源码跑会有 5 套因功能尚未存在而失败（`test_doc` / `test_gen` /
`test_home` / `test_menu` / `test_zerosem`），**那是预期行为，不是回归**。历史版本因此不复制这份测试，统一挂在这里。
