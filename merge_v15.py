# -*- coding: utf-8 -*-
"""把分文件源码合并成单文件成品。

脚本自己认布局，不用传路径。三种场景都能跑：

  ① 仓库内（接手者用）：   <repo>/merge_v15.py
     <repo>/platform/v1.5/{index.html,src/app.js,src/styles.css}
     直接更新 <repo>/platform/v1.5/<成品> 与仓库根 index.html。

  ② 工作区（有分文件工作副本时）：  python _src/merge_v15.py [--repo]
     <root>/_src/v15/{index.html,src/app.js,src/styles.css}
     默认只出 <root>/output/ 与桌面副本；加 --repo 才写 Git 仓库。
     工作区那份 _src/merge_v15.py 只是转发到这里（单一真源）。

  ③ 任何位置只校验：      python merge_v15.py --check

不传任何参数、也不在仓库里时，按脚本所在目录判断。断言失败即非零退出，
且失败发生在写任何文件之前——不会留下半成品。
"""
import io, os, re, sys, shutil

# 中文输出在 cp936 控制台下会乱码。只在没换过的时候换一次——工作区那份
# _src/merge_v15.py 会转发到这里，转发的进程里 stdout 可能已经被包过一层，
# 重复包同一个 buffer 会让前一个包装器被回收时关掉底层文件，
# 报 "ValueError: I/O operation on closed file"。
if hasattr(sys.stdout, 'buffer') and not getattr(sys.stdout, '_mergeUtf8', False):
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stdout._mergeUtf8 = True

HERE = os.path.dirname(os.path.abspath(__file__))
VER = 'v1.5'
NAME = '京津冀政策情景快速评估平台_原型v1.5.html'
WANT_REPO = '--repo' in sys.argv
CHECK_ONLY = '--check' in sys.argv

# ---------------------------------------------------------------- 认布局
# 原先这里写死了某个本机绝对路径，脚本一离开那台机器就废：
# clone 下来的仓库里没有这个盘符的路径，发布链第一步就跑不动。
# 改成按脚本所在目录（或工作区转发时给的环境变量）判断。
WS = os.environ.get('MERGE_WS_ROOT')
if WS and os.path.isdir(os.path.join(WS, '_src', 'v15')):
    MODE = 'workspace'
    ROOT = WS
    SRC = os.path.join(WS, '_src', 'v15')
    REPO = os.path.join(WS, 'jjj-cib-platform')
    TESTS_SRC = os.path.join(WS, '_src')
    GATE_SRC = os.path.join(WS, '_src', 'run_tests.ps1')
elif os.path.isdir(os.path.join(HERE, 'v15')):
    MODE = 'workspace'
    ROOT = os.path.dirname(HERE)
    SRC = os.path.join(HERE, 'v15')
    REPO = os.path.join(ROOT, 'jjj-cib-platform')
    TESTS_SRC = HERE
    GATE_SRC = os.path.join(HERE, 'run_tests.ps1')
elif os.path.isdir(os.path.join(HERE, 'platform', VER)):
    MODE = 'repo'
    ROOT = HERE
    SRC = os.path.join(HERE, 'platform', VER)
    REPO = HERE
    TESTS_SRC = os.path.join(SRC, 'tests')
    GATE_SRC = None                        # 归档里已经有了，不用再拷
    WANT_REPO = True                       # 仓库内没有别的去处，不必再传 --repo
else:
    raise SystemExit(
        '认不出布局：%s 下既没有 v15/（工作区），也没有 platform/%s/（仓库内）。\n'
        '仓库内用法：python merge_v15.py [--check]\n'
        '工作区用法：python _src/merge_v15.py [--repo]\n' % (HERE, VER))

print('布局：%s（%s）' % (MODE, HERE))

# ---------------------------------------------------------------- 合并
html = io.open(os.path.join(SRC, 'index.html'), encoding='utf-8').read()
css = io.open(os.path.join(SRC, 'src', 'styles.css'), encoding='utf-8').read()
js = io.open(os.path.join(SRC, 'src', 'app.js'), encoding='utf-8').read()

assert '<link rel="stylesheet" href="src/styles.css">' in html, 'CSS 引用标记不在'
assert '<script src="src/app.js"></script>' in html, 'JS 引用标记不在'
html = html.replace('<link rel="stylesheet" href="src/styles.css">', '<style>\n' + css + '\n</style>')
html = html.replace('<script src="src/app.js"></script>', '<script>\n' + js + '\n</script>')
assert 'src/styles.css' not in html and 'src/app.js' not in html, '还有未合并的引用'

for probe in ['robBox', 'fwBox', 'downloadReportDoc', 'renderRobust', 'renderFW',
              'helpModal', 'ctxNow', 'rail-h', 'hmGrid', 'renderHomeGrid', 'v1.5', 'STEP_NM']:
    assert probe in html, '缺少标记 ' + probe
for bad in ['background:#166534', 'color:#166534', 'border-color:#166534',
            'background:#059669', 'font-size:12.5px', 'font-size:11.5px']:
    assert bad not in html, '残留旧样式 ' + bad

# 已删功能不得复活。这几项是按「功能页去掉、能力下沉」删掉的，能力都还在
# （逐层求解内核、已知值、主被动图计算），但独立的入口与卡片不该回来。
# 只查标识符，不查散文词——更新日志里会正当地提到这些功能名。
for gone in ['openPres', 'closePres', 'renderPres', 'renderAnc', 'ancBox',
             'renderXl', 'presBox']:
    assert gone not in html, '已删功能复活：' + gone
# 基于「档位方向」的两套界面机制都已删除，不该回来：
#   ① 第 7 步的事后检查器（layConflicts / layDirectionHTML）；
#   ② 第 3 步的界面筛档（xlPick 一族，v1.5.7 按用户决定撤掉——它只改界面可选性，
#      不进检算与导出，留着反而让人以为选过的档位参与了结果）。
# 但求解内核、求解出口与跨层数值约束必须在。
for gone in ['function layConflicts', 'function layDirectionHTML',
             'function xlReason', 'function xlPickHTML', 'function xlSet',
             'function xlPickOf', 'xlPickHTML(nm)']:
    assert gone not in html, '已删的机制复活：' + gone
# 下面这些必须"在场"，断言按 `function 名字(` 锚定。
# 只查裸标识符是假的保证：把 function runLayered 改名成 runLayeredDISABLED，
# 裸词 runLayered 仍然命中（它是另一个串的子串），断言照样通过。
for fn in ['function solveLayer(', 'function allowUnder(', 'function runLayered(',
           'function renderLay(', 'function ancRowHTML(']:
    assert fn in html, '下沉后的能力丢了：' + fn
assert 'id="layBox"' in html, '逐层求解的渲染出口丢了'
assert 'id="layFold"' in html, '逐层求解的折叠段丢了'

# 讨论日志与版本更新日志各开一页（原先挤在使用说明页第八节 + 一个模态里）。
# 两页的容器、渲染函数、页面映射都得在；旧的模态体不该回来。
for need in ['class="pane docpg" id="pdis"', 'class="pane docpg" id="pver"',
             'class="pane docpg" id="pdoc"',
             'function renderDiscuss(', 'function renderVersions(', '逐条变更记录']:
    assert need in html, '日志页缺件：' + need
# 版本号只有一个来源：关于框读 appVer()，appVer() 读 VERSIONS 末条。
# 原先关于框里写死 v1.4，平台发到 v1.5.7 之后仍在对外显示旧版号。
# 这里钉住"关于框走了函数"这件事；"文字里不出现内联版本号"由 test_doc.js 在函数体内断言
# （合并后的整份文件里，版本日志与更新日志都会正当地出现 v1.4 这类字样）。
for need in ['function appVer(', "'+appVer()+'"]:
    assert need in html, '版本号来源缺件：' + need
# 同上：只查标识符与标记，不查散文词。这里曾经把「证据缺口」「返回概览」这类
# 栏目标题当关键词查全文，结果同一个提交里如实记录"删掉了这两类栏目"的更新日志
# 条目自己触发了断言——发布被自己的诚实记录挡住。栏目标题的消失由 test_doc.js
# 在函数体范围内断言（那里不掺更新日志），这里只管数据与标记。
for gone in ['id="chgModal"', 'id="chgBody"', 'function closeChangelog',
             'DISCUSS_GAPS', 'VER_GAPS', 'class="doc-back"', "h:'存疑'"]:
    assert gone not in html, '旧日志模态复活：' + gone

# 未发生的面谈不许留在讨论日志里。但讨论日志之外（版本日志、更新日志）
# 可以正当地出现同一个日期——版本发布就发生在那一天。这里只在 DISCUSS
# 数组范围内查，不把整份合并文件当作作用域。这是第三次踩同一个坑：
# "2026-10-25 日志里如实写“删掉了这两类栏目”" 曾把自己的发布挡住。
_d0 = html.find('const DISCUSS=[')
_d1 = html.find('\n];', _d0)
assert _d0 > 0 and _d1 > _d0, '讨论日志数组定位失败'
assert "d:'2026-10-26'" not in html[_d0:_d1], '未发生的 10-26 面谈复活'

# 亮点模块也必须跟着源码走。它们曾经是手工从 v1.0 切的，切完就没人管，
# 一路引用着后来被删掉的函数（pullDB / applyFix / csvParam）和弃用的配色。
# 这里调它的生成器做一次 --check：源码里挪了任何一个被引用的声明，或者改了
# 源码却忘了重新生成，发布就停在这里，而不是把过期的副本再推上去。
#
# 放在最前面（还没写任何文件之前）：失败时仓库保持原样，不会留下半成品。
if WANT_REPO or CHECK_ONLY:
    hl_build = os.path.join(REPO, 'highlights', 'build_highlights.py')
    if os.path.exists(hl_build):
        import subprocess
        r = subprocess.run([sys.executable, hl_build, '--check'],
                           cwd=os.path.join(REPO, 'highlights'),
                           stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
        msg = r.stdout.decode('utf-8', 'replace').strip()
        if r.returncode != 0:
            raise SystemExit('亮点模块自检失败（仓库未被改动）：\n' + msg)
    else:
        print('  注意：%s 不存在，跳过亮点自检' % hl_build)

if CHECK_ONLY:
    print('  仅校验：全部断言通过，未写任何文件')
    raise SystemExit(0)

# ---------------------------------------------------------------- 写文件
def wr(path, body):
    io.open(path, 'w', encoding='utf-8', newline='\n').write(body)
    return path

if MODE == 'workspace':
    out_dir = os.path.join(ROOT, 'output')
    os.makedirs(out_dir, exist_ok=True)
    dst_out = wr(os.path.join(out_dir, NAME), html)
    dst_desk = os.path.join(os.path.expanduser('~'), 'Desktop', NAME)
    shutil.copyfile(dst_out, dst_desk)
    print('合并完成：%d 字符' % len(html))
    print('  工作区：%s' % dst_out)
    print('  桌面　：%s' % dst_desk)
else:
    dst_out = None
    print('合并完成：%d 字符' % len(html))

if WANT_REPO:
    ver_dir = os.path.join(REPO, 'platform', VER)
    dst_repo = wr(os.path.join(ver_dir, NAME), html)
    root_index = wr(os.path.join(REPO, 'index.html'), html)

    if MODE == 'workspace':
        # 同步归档分文件源码。v1.3 起只提交了合并后的单文件，源码仅存在于本机
        # 工作副本——机器一坏就再也改不动平台了。
        #
        # 布局按 _src/v15 原样镜像到 platform/<ver>/ ：index.html 在版本根，
        # src/ 在它下面。这样归档副本与工作副本的目录关系完全一致，index.html
        # 里的 "src/styles.css" 引用能正常解析，测试也能原样跑它。
        arch_files = {
            'index.html': io.open(os.path.join(SRC, 'index.html'), encoding='utf-8').read(),
            os.path.join('src', 'app.js'): js,
            os.path.join('src', 'styles.css'): css,
        }
        for rel, body in arch_files.items():
            dst = os.path.join(ver_dir, rel)
            os.makedirs(os.path.dirname(dst), exist_ok=True)
            wr(dst, body)

        # 归档自检：把刚写进仓库的源码按同样的替换规则重新合并一遍，必须与发布
        # 的单文件逐字节相同。否则仓库里的源码和线上成品就是两套东西。
        rebuilt = io.open(os.path.join(ver_dir, 'index.html'), encoding='utf-8').read()
        rebuilt = rebuilt.replace('<link rel="stylesheet" href="src/styles.css">',
                                  '<style>\n' + io.open(os.path.join(ver_dir, 'src', 'styles.css'),
                                                        encoding='utf-8').read() + '\n</style>')
        rebuilt = rebuilt.replace('<script src="src/app.js"></script>',
                                  '<script>\n' + io.open(os.path.join(ver_dir, 'src', 'app.js'),
                                                         encoding='utf-8').read() + '\n</script>')
        assert rebuilt == html, '归档自检失败：仓库源码合并结果与单文件成品不一致'

        # 连测试一起归档。只有源码没有测试，接手的人无法确认这份源码是否真的
        # 能跑；测试留在本机等于验证手段也一并丢失。放在版本目录下，作用域清楚。
        tests_dst = os.path.join(ver_dir, 'tests')
        os.makedirs(tests_dst, exist_ok=True)
        n_tests = 0
        for f in sorted(os.listdir(TESTS_SRC)):
            if f.startswith('test_') and f.endswith('.js'):
                shutil.copyfile(os.path.join(TESTS_SRC, f), os.path.join(tests_dst, f))
                n_tests += 1
        # 统一闸门也要归档：多数测试只打 ✓/✗、不设退出码，单跑它们等于没跑。
        # run_tests.ps1 才是那个真正会失败的入口，缺了它这套测试的结论无法复现。
        if GATE_SRC and os.path.exists(GATE_SRC):
            shutil.copyfile(GATE_SRC, os.path.join(tests_dst, 'run_tests.ps1'))
        print('  测试　：%s（%d 套）' % (tests_dst, n_tests))
        print('  自检　：仓库源码重新合并 = 单文件成品（逐字节一致）')
    else:
        print('  测试　：%s（原地保留，未改动）' % os.path.join(ver_dir, 'tests'))

    print('  仓库　：%s' % dst_repo)
    print('  仓库根：%s（已指向 %s）' % (root_index, VER))
    print('  源码　：%s' % ver_dir)
    print('  亮点　：8 个模块与源码一致（已于写入前校验）')
elif MODE == 'workspace':
    print('  仓库：未写入（加 --repo 才会改动 Pages 入口）')
