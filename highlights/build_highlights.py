# -*- coding: utf-8 -*-
"""从 v1.5 工作副本里切出亮点模块。

为什么要有这个脚本：上一版 highlights/ 是 2026-10-16 手工从 v1.0 切出来的，
切完之后平台改了四版，这些副本就没人管了——引用着已删的函数（pullDB、
applyFix、csvParam）、配着已经弃用的蓝绿配色、标着 v1.0 的行号。手工切一次
就必然过期，所以改成从源码切，并且带一个能失败的校验。

用法：
    python build_highlights.py            重新生成 highlights/ 下全部文件
    python build_highlights.py --check    只校验，与磁盘上的副本比对；
                                          有任何一处不一致或过期模块目录，退出码 1

--check 是给闸门用的：它把每个文件的应有内容在内存里算出来，逐字节比对。
改了源码却忘了重建，或者删了某个函数（锚点找不到就直接报错），它都会红。

设计约定
    1. 每个模块声明它要哪些「锚点」——HTML 用元素 id 或标题文字，JS 用函数名，
       CSS 用选择器关键字。源码里找不到锚点 = 报错退出，绝不静默跳过。
       这样「函数被删了副本文档还在引用」这件事在结构上不可能发生。
    2. 行号是切的时候现算的，不写死。
    3. 生成物里不含时间戳，--check 才能逐字节比对。
"""
import io
import os
import re
import sys

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)
ROOT = os.path.dirname(REPO)                      # 工作区根（repo 的上一级）
SRC = os.path.join(ROOT, '_src', 'v15')
HTML_SRC = os.path.join(SRC, 'index.html')
JS_SRC = os.path.join(SRC, 'src', 'app.js')
CSS_SRC = os.path.join(SRC, 'src', 'styles.css')
VER = 'v1.5'
CHECK = '--check' in sys.argv

CHECK_FAIL = []


# ---------------------------------------------------------------- 源码读取

def read(path):
    return io.open(path, encoding='utf-8').read()


HTML = read(HTML_SRC)
JS = read(JS_SRC)
CSS = read(CSS_SRC)
HTML_L = HTML.split('\n')
JS_L = JS.split('\n')
CSS_L = CSS.split('\n')


# ---------------------------------------------------------------- HTML 切片

def find_line(lines, needle, start=0):
    for i in range(start, len(lines)):
        if needle in lines[i]:
            return i
    raise SystemExit('锚点找不到（HTML）：%s' % needle)


def slice_tag(lines, start, tag):
    """从 start 行起，按 <tag>/</tag> 配对找到结束行。"""
    depth = 0
    started = False
    for i in range(start, len(lines)):
        o = len(re.findall(r'<%s\b' % tag, lines[i]))
        c = len(re.findall(r'</%s>' % tag, lines[i]))
        if o:
            depth += o
            started = True
        depth -= c
        if started and depth <= 0:
            return i
    raise SystemExit('标签没有闭合：%s（从第 %d 行起）' % (tag, start + 1))


def slice_by_id(lines, elem_id, tag='section'):
    i = find_line(lines, 'id="%s"' % elem_id)
    # id 可能出现在同一行更靠后的子元素上，往回收一步到本元素的开始标签
    while i >= 0 and ('<%s' % tag) not in lines[i]:
        i -= 1
    if i < 0:
        raise SystemExit('找不到 <%s id="%s">' % (tag, elem_id))
    return i, slice_tag(lines, i, tag)


def slice_card_by_heading(lines, heading):
    """先定位标题所在行，再往上找最近的 <div class="card"，然后配对 div。

    只认真正带 <h3 的那一行。「检验结果」这四个字在第 7 步的 h2 提示气泡里也出现过，
    按纯文本找会命中那行，然后往上摸到上一个卡片的开头——切出来的东西肉眼看不出错，
    只是少了两块。所以锚点必须落在元素上，不能落在词上。"""
    j = -1
    for i, line in enumerate(lines):
        if '<h3' in line and heading in line:
            j = i
            break
    if j < 0:
        raise SystemExit('找不到 <h3>%s 的卡片' % heading)
    i = j
    while i >= 0:
        if '<div class="card"' in lines[i]:
            break
        i -= 1
    if i < 0:
        raise SystemExit('「%s」所在行往上找不到 <div class="card">' % heading)
    return i, slice_tag(lines, i, 'div')


def html_block(spec):
    kind = spec['kind']
    if kind == 'section':
        i, j = slice_by_id(HTML_L, spec['id'])
    elif kind == 'card':
        i, j = slice_card_by_heading(HTML_L, spec['heading'])
    elif kind == 'details':
        i = find_line(HTML_L, 'id="%s"' % spec['id'])
        while i >= 0 and '<details' not in HTML_L[i]:
            i -= 1
        if i < 0:
            raise SystemExit('找不到 <details id="%s">' % spec['id'])
        j = slice_tag(HTML_L, i, 'details')
    else:
        raise SystemExit('未知的切片方式：%s' % kind)
    return i, j, '\n'.join(HTML_L[i:j + 1])


# ---------------------------------------------------------------- JS 切片

_OPEN = {'(': ')', '[': ']', '{': '}'}
_PREV_OK = set('([{,;:=!&|?+-*%<>~^')
# `/` 出现在这些词之后是正则字面量的开始，不是除法。
# 少了这一条，`return /[",\n]/.test(t)` 里的 `[` 会被当成数组下标推入栈，
# 括号配对从此错位——整个切片器就废了。
_PREV_WORD = frozenset((
    'return', 'typeof', 'instanceof', 'in', 'of', 'new', 'delete', 'void',
    'case', 'do', 'else', 'yield', 'await'))


def _is_regex_pos(s, i):
    """判断 s[i]=='/' 处是不是正则字面量的开始。"""
    k = i - 1
    while k >= 0 and s[k] in ' \t\r\n':
        k -= 1
    if k < 0:
        return True
    prev = s[k]
    if prev in _PREV_OK:
        return True
    if prev.isalnum() or prev in '_$':
        j = k
        while j >= 0 and (s[j].isalnum() or s[j] in '_$'):
            j -= 1
        return s[j + 1:k + 1] in _PREV_WORD
    return False


def scan_balanced(s, i):
    """s[i] 是开括号，返回与它配对的闭括号下标。按 JS 词法跳过字符串、
    模板串（含 ${} 嵌套）、注释与正则字面量。"""
    stack = []
    n = len(s)
    while i < n:
        c = s[i]
        if c == '\\':
            i += 2
            continue
        if c == '`':
            i += 1
            while i < n:
                if s[i] == '\\':
                    i += 2
                    continue
                if s[i] == '`':
                    i += 1
                    break
                if s[i] == '$' and i + 1 < n and s[i + 1] == '{':
                    i = scan_balanced(s, i + 1) + 1
                    continue
                i += 1
            continue
        if c in '"\'':
            q = c
            i += 1
            while i < n:
                if s[i] == '\\':
                    i += 2
                    continue
                if s[i] == q:
                    i += 1
                    break
                i += 1
            continue
        if c == '/' and i + 1 < n and s[i + 1] == '/':
            j = s.find('\n', i)
            i = n if j < 0 else j + 1
            continue
        if c == '/' and i + 1 < n and s[i + 1] == '*':
            j = s.find('*/', i)
            i = n if j < 0 else j + 2
            continue
        if c == '/':
            if _is_regex_pos(s, i):
                i += 1
                incls = False
                while i < n:
                    if s[i] == '\\':
                        i += 2
                        continue
                    if s[i] == '[':
                        incls = True
                    elif s[i] == ']':
                        incls = False
                    elif s[i] == '/' and not incls:
                        i += 1
                        break
                    elif s[i] == '\n':
                        break
                    i += 1
                continue
            i += 1
            continue
        if c in _OPEN:
            stack.append(_OPEN[c])
            i += 1
            continue
        if stack and c == stack[-1]:
            stack.pop()
            if not stack:
                return i
            i += 1
            continue
        i += 1
    raise SystemExit('括号不配对（从下标 %d 起）' % i)


def extract_decl(name):
    starts = []
    for pat in ('function %s(' % name, 'function %s (' % name,
                '\nconst %s=' % name, '\nlet %s=' % name, '\nvar %s=' % name):
        k = JS.find(pat)
        if k >= 0:
            starts.append(k + (1 if pat.startswith('\n') else 0))
    if not starts:
        raise SystemExit('源码里找不到声明：%s（锚点失效，说明它被改名或删掉了）' % name)
    k = min(starts)
    m = re.compile(r'[\(\[\{]').search(JS, k)
    if not m:
        raise SystemExit('声明后找不到括号：%s' % name)
    end = scan_balanced(JS, m.start())
    if JS[m.start()] == '(':
        k2 = end + 1
        while k2 < len(JS) and JS[k2] in ' \t\r\n':
            k2 += 1
        # 箭头函数：`const f=(a)=>{...}` / `const f=a=>{...}`——闭括号后面跟的是
        # `=>`，这才是函数体。少了这一支，切出来只有形参列表，是个语法错的文件。
        if JS.startswith('=>', k2):
            k2 += 2
            while k2 < len(JS) and JS[k2] in ' \t\r\n':
                k2 += 1
            if k2 < len(JS) and JS[k2] == '{':
                end = scan_balanced(JS, k2)
            elif k2 < len(JS):
                # 表达式体箭头函数：吃到行尾（或逗号／分号）为止
                k3 = k2
                depth = 0
                while k3 < len(JS):
                    c = JS[k3]
                    if c in '([{':
                        depth += 1
                    elif c in ')]}':
                        if depth == 0:
                            break
                        depth -= 1
                    elif c == '\n' and depth == 0:
                        break
                    elif c == ';' and depth == 0:
                        break
                    k3 += 1
                end = k3 - 1
        elif k2 < len(JS) and JS[k2] == '{':
            end = scan_balanced(JS, k2)
    if end + 1 < len(JS) and JS[end + 1] == ';':
        end += 1
    line0 = JS[:k].count('\n') + 1
    line1 = JS[:end].count('\n') + 1
    return JS[k:end + 1], line0, line1


# ---------------------------------------------------------------- CSS 切片

def css_rules(text):
    """把样式表拆成顶层规则，@media 之类保留外壳。返回 [(prelude, body, 起始行)]。"""
    out = []
    i = 0
    n = len(text)
    line = 1
    while i < n:
        j = text.find('{', i)
        if j < 0:
            break
        prelude = text[i:j].strip()
        if prelude and not prelude.startswith('}'):
            # 找配对的 }
            k = j + 1
            depth = 1
            while k < n and depth:
                if text[k] == '{':
                    depth += 1
                elif text[k] == '}':
                    depth -= 1
                k += 1
            body = text[j + 1:k - 1]
            out.append((prelude, body, line))
            if prelude.startswith('@'):
                inner = css_rules(body)
                out.extend([(p, b, line) for p, b, _ in inner])
            for ch in text[i:k]:
                if ch == '\n':
                    line += 1
            i = k
        else:
            for ch in text[i:j + 1]:
                if ch == '\n':
                    line += 1
            i = j + 1
    return out


CSS_RULES = css_rules(CSS)


def css_block(keys):
    """按选择器关键字摘出相关规则；:root 永远带上（设计令牌）。"""
    keep = []
    seen = set()
    for prelude, body, line0 in CSS_RULES:
        hit = prelude.startswith(':root') or any(k in prelude for k in keys)
        if not hit:
            continue
        rule = '%s{%s}' % (prelude, body)
        if rule in seen:
            continue
        seen.add(rule)
        keep.append((line0, rule))
    keep.sort()
    return '\n\n'.join(r for _, r in keep)


# ---------------------------------------------------------------- 模块清单

SPEC = [
    dict(
        dir='H1_首页一屏',
        no='H1', title='首页：一屏讲清定位',
        why='第一页要先讲清对方的问题，再讲自己做了什么。这一屏用一张交叉影响矩阵的结构示意图'
            '＋四个实时统计（描述符／政策路径／状态／组合数）代替空泛介绍，下方三段流程只说'
            '三件事：界定变量、两两判定、求取自洽情景。统计数字全部由 homeStatData() 现算，'
            '没有一个写死的估值——v1.2 之前首页那三个数字是估算的，已经删掉了。',
        need='一屏之内说明「这是什么方法、处理多大规模、按哪三步走」。',
        kind='section', id='pcmp',
        js=['HM_P', 'homeStatData', 'fmtNum', 'renderCmp', 'renderHomeGrid', 'enterWizard'],
        globals=['sel', 'TREE', 'POLICY', 'cimResult'],
        css=['.hero', '.fig', '.facts', '.quote', '.steps', '.foot', '.kicker', '.go',
             '.mwrap', '.mrow', '.ylab', '.xlab', '.mfoot', '.cap', '.cib', '.lead',
             '.mono', '.sp'],
    ),
    dict(
        dir='H2_政策库与映射',
        no='H2', title='政策库与映射（含政策依据补证）',
        why='把「手工逐条定义状态」换成「从政策库预填」，这是整个平台最直接的一个卖点。'
            '内置 106 条政策路径，逐条挂到描述符上，并标注置信度与依据；点开一条能看到'
            '工具级记录、涉及地区、《文件名》与用于核对的原文引文。政策侧的联网核实结果'
            '（文号＋关键条款＋官方原文链接）单独挂在 POLICY_VERIF 上，按条计数。',
        need='让「这个参数的依据」有出处可查，而不是专家拍一个数。',
        kind='section', id='p1',
        js=['POLICY', 'POLICY_EVID', 'POLICY_VERIF', 'PALLC', 'nSel', 'renderPolicy',
            'pickPolicy', 'polEvid', 'polEvidBlock', 'polSidePanel', 'verifBlock',
            'applyPolicy', 'uploadPolicy', 'prepErr'],
        globals=['sel', 'cimResult', 'toast', 'render'],
        css=['.policy', '.pol', '.verif', '.evi', '.map', '.side', '.tag'],
    ),
    dict(
        dir='H3_各层差异与约束前置',
        no='H3', title='各层差异预览与跨层约束前置',
        why='多尺度在界面上的落点。先把「同一套描述符在国家级／区域级／省级／市级口径不一样」'
            '摊开成一张表，再把跨层核对从「算完回头比」改成「选上层档位就立刻筛下层」：'
            '与上层方向相差 ≥2 档、或取值区间不相交的下层档位直接置灰，原因写在选项里。'
            '平台不替用户改档——档位冲突可能是真实的政策张力，上层改动后下层原选若不相容，'
            '只清空并说明原因，由用户重选。',
        need='跨层一致性要在选的时候就看得见，不能等检验跑完才发现上下打架。',
        kind='section', id='p0',
        js=['LAYERS', 'layerTable', 'tglScale', 'rangeOf', 'rngTxt', 'ST', 'defsOf',
            'XL_ORDER', 'XL_NAME', 'xlayers', 'xlAct', 'xlPickOf', 'xlReason', 'xlSet',
            'xlPickHTML', 'allowUnder'],
        globals=['sel', 'rngScope', 'toast', 'render'],
        css=['.grid2', '.opt', '.crow', '.clbl', '.cell', '.xl', '.dim', '.card', '.chk'],
    ),
    dict(
        dir='H4_描述符状态面板',
        no='H4', title='描述符状态面板（区间／依据／已知值／分层档位）',
        why='本方法的核心一屏。每个描述符的状态都挂取值区间，于是「高速／中速」这类定性标签'
            '落到具体数值范围上；区间可改、状态可增删、可重命名，改了以后原依据自动降为'
            '「已改」。依据徽标自己就是悬停锚点，说明文字挂在 data-tip 上，不占版面。'
            '「已知值」（原「数值锚定」独立卡片）也长在这里：填一个现实区间，检算时与它'
            '完全不相交的状态直接排除。状态勾选不是标签，而是划定可信范围——勾了的档位才是'
            '候选，枚举与检验只在范围内搜。',
        need='把「参数说不清依据」和「状态只是定性词」两个问题一起解决。',
        kind='section', id='p2',
        js=['RANGE_PRESET', 'RANGE_EVID', 'EVID_WORD', 'SCOPE_NAME', 'SCOPE_PRESET',
            'SCOPE_NOTE', 'stateDefs', 'stateDefsScope', 'scopedDefs', 'defsOf', 'baseOf',
            'clearScopeCache', 'setScope', 'dropScopeOverride', 'renderScopeBar', 'ST',
            'rngTxt', 'rngIssues', 'editRange', 'addState', 'numOf', 'txtOf', 'saveRange',
            'renState', 'delState', 'doAddState', 'attrEsc', 'renderStates', 'renderTree',
            'toggleDetail', 'toggleNode', 'onSearch', 'setSearch', 'selDesc', 'tglState',
            'selIdxOf', 'rangeSize', 'ancOf', 'ancTxt', 'parseAnc', 'setAnc', 'clearAnc',
            'ancAllowed', 'ancConflicts', 'selRangeHTML', 'ancRowHTML', 'ancSummaryHTML',
            'ancConflictHTML'],
        globals=['sel', 'rngScope', 'rngEdit', 'rngAdd', 'cimResult', 'BAYES', 'render'],
        css=['.tree', '.stbox', '.strow', '.chk', '.stnm', '.rng', '.evi', '.anc',
             '.scope', '.cus', '.empty', '.hd', '.src', '.side'],
    ),
    dict(
        dir='H5_自洽情景的判定',
        no='H5', title='自洽情景的判断链',
        why='回应「评分要有过程」。枚举状态组合（组合数超 20 万自动改固定种子抽样），'
            '逐组算每个状态的影响平衡值——它从其余状态承受到的总量，加粗者是本情景选定'
            '状态，▲ 是该描述符的最高分。选定状态是自己的影响平衡值里最高的那一项，'
            '且组合内无冲突，才判自洽。展开任一情景能看到它由哪些档位组成、逐条影响各'
            '打了几分、以及为什么判自洽。',
        need='不能只给一个「自洽 12 组」的数字，得能一路点到某条判断为什么这么打。',
        kind='card', heading='检验结果',
        js=['TICK', 'mulberry', 'cimSig', 'comboSample', 'buildIMP', 'evalCombo',
            'cloneCim', 'enumCore', 'runCIM', 'selectedCombo', 'checkSelected',
            'checkResult', 'rangeStat', 'toggleAllScen', 'coFn', 'aliveTable', 'freqOf',
            'scenCard', 'scenDetail', 'toggleScen', 'impactVal', 'pairIndexTable',
            'p6Apply', 'p6Group', 'p6All', 'p6Status'],
        globals=['sel', 'cim', 'cimResult', 'filt', 'toast', 'render'],
        css=['.scen', '.sccard', '.sctab', '.res', '.p6', '.solo'],
    ),
    dict(
        dir='H6_矛盾组合与处理建议',
        no='H6', title='矛盾组合与处理建议（闭环）',
        why='不只报矛盾，还要说清「为什么矛盾」「改成什么就不矛盾」「采纳后重跑」。'
            'v1.5 起不再只看用户选中的那几个档位，而是过所有描述符对，列出全部互斥对'
            '（上限 40 对，超出会标注已截断），另单列「孤立档位」。两者不同义：'
            '孤立档位是它自己站不住（任何自洽情景里都没出现），互斥对是两档各自都行、'
            '凑一起不行。建议是算出来的——从自洽集里找与其中一边共存过的另一档，'
            '点一下就真的改状态并重跑。',
        need='发现了矛盾还得能闭环，否则只是个报错框。',
        kind='card', heading='矛盾组合与处理建议',
        js=['exclPairs', 'confPairs', 'confList', 'toggleConf', 'applyConfFix',
            'coFn', 'aliveTable', 'freqOf', 'selectedCombo'],
        globals=['sel', 'cimResult', 'toast', 'render', 'cim'],
        css=['.conf', '.solo', '.res'],
    ),
    dict(
        dir='H7_逐层求解',
        no='H7', title='逐层求解（下沉为折叠段）',
        why='让跨层约束真正进入求解，而不只是事后比对。上级解出的每个自洽情景，其取值'
            '转成下级的约束：下级与它区间不相交的状态根本进不了枚举。上级定「目标节奏'
            '20–30%」，下级「快速清洁化 30–40%」就不会被算到。上级某情景若让下级完全'
            '无解，会单独计数——那不是程序出错，那就是结论。v1.5 把它的入口从常驻卡片'
            '改成默认收起的折叠段：不勾多层时整段不出现，能力一点没少。'
            '组合是否自洽只取决于组合自身，所以整层只判一次（25 万次预算，小空间精确、'
            '大空间固定种子抽样），再按各组允许集归桶筛选。',
        need='国家级、区域级、省级是嵌套的，下层取值必须真的受上层约束。',
        kind='details', id='layFold',
        js=['LAYER_BUDGET', 'rangeOf', 'solveLayer', 'allowUnder', 'runLayered',
            'renderLay', 'buildIMP', 'evalCombo', 'mulberry', 'comboSample', 'cloneCim',
            'ST', 'defsOf', 'rngTxt'],
        globals=['sel', 'cim', 'layeredResult', 'rngScope', 'toast', 'render'],
        css=['.lay', '.fold', '.foldbody', '.btn'],
    ),
    dict(
        dir='H8_四形态导出',
        no='H8', title='四种形态的导出（配置／参数表／叙事／后验）',
        why='导出不是一个格式，是四种用途：模型配置文件（GCAM 真实 ScenarioComponents '
            '结构、真实文件名；CHEER 侧标注 CSV→GDX 的转换路径）、结构化参数表、'
            '定性叙事稿、贝叶斯后验表。参数表带情景号（scenario,param,value）——'
            'CIB 求出的是一组互相咬合的自洽组合，导成一行一个参数等于把耦合又拆回'
            '独立参数，下游按行取值会读出彼此矛盾的组合。装配文件不确定的描述符会'
            '明确标注需人工补齐，不静默兜底。',
        need='求出来的自洽情景要能真的落到下游模型里，且不能把耦合拆散。',
        kind='card', heading='生成结果与导出',
        js=['GEN_LABEL', 'genOf', 'genName', 'expMode', 'expRows', 'expLabel',
            'multiPickNote', 'csvCell', 'paramOf', 'paramsCSV', 'setExpMode',
            'downloadParams', 'downloadParamsBtn', 'narrText', 'bayesCSV', 'curScenInfo',
            'tableCSV', 'genMain', 'genMainLabel', 'genSubHTML', 'renderOutBtns',
            'syncGenOpts', 'renderGenOut', 'preview', 'xmlTag', 'xmlFile', 'download',
            'downloadAll', 'dl', 'fmtTag', 'fmtNum'],
        globals=['sel', 'curModel', 'cimResult', 'BAYES', 'useBayes', 'genMode',
                 'expertN', 'toast', 'render'],
        css=['.out', '.fmtnote', '.tag', '.btn', '.opt', '.chk'],
    ),
]


# ---------------------------------------------------------------- 生成

def gen_module(spec):
    files = {}

    h0, h1, html = html_block(spec)
    files['fragment.html'] = (
        '<!-- %s ｜ %s ｜ 摘自 _src/v15/index.html 第 %d-%d 行 -->\n%s\n'
        % (spec['no'], spec['title'], h0 + 1, h1 + 1, html))

    parts = []
    locs = []
    for name in spec['js']:
        code, l0, l1 = extract_decl(name)
        parts.append(code)
        locs.append((name, l0, l1))
    files['logic.js'] = (
        '/* %s ｜ %s ｜ 核心逻辑\n'
        '   摘自 _src/v15/src/app.js，按声明整段切出，未作改写。\n'
        '   下面每个函数在 app.js 里的位置见本目录 README。 */\n\n%s\n'
        % (spec['no'], spec['title'], '\n\n'.join(parts)))

    files['style.css'] = (
        '/* %s ｜ %s ｜ 相关样式摘录\n'
        '   设计令牌（:root）永远带上；完整样式表见 ../_shared/base.css。 */\n\n%s\n'
        % (spec['no'], spec['title'], css_block(spec['css'])))

    rows = '\n'.join('| `%s` | %d–%d |' % (n, a, b) for n, a, b in locs)
    files['README.md'] = (
        '# %s ｜ %s\n\n'
        '## 解决什么问题\n\n%s\n\n'
        '## 代码位置（v1.5 工作副本）\n\n'
        '- HTML：`_src/v15/index.html` 第 %d–%d 行\n'
        '- 逻辑：`_src/v15/src/app.js`\n\n'
        '| 函数／常量 | 行号 |\n|---|---|\n%s\n\n'
        '- 样式：本目录 `style.css`（摘录）；完整样式表见 `../_shared/base.css`\n\n'
        '## 本目录文件\n\n'
        '| 文件 | 内容 |\n|---|---|\n'
        '| `fragment.html` | 该模块的 HTML 片段 |\n'
        '| `logic.js` | 该模块的 JS（整段切出，含依赖的数据常量） |\n'
        '| `style.css` | 该模块相关样式摘录 |\n'
        '| `README.md` | 本说明 |\n\n'
        '## 依赖的平台状态（未随本模块导出）\n\n'
        '%s\n\n'
        '## 复用方式\n\n'
        '1. 引入 `../_shared/base.css`（含 v1.5 全部设计令牌与基础组件）；\n'
        '2. 把 `fragment.html` 粘进页面结构；\n'
        '3. 引入 `logic.js`，在数据准备好之后调用其渲染入口。\n\n'
        '> 本目录由 `build_highlights.py` 从源码切出，请勿手改——改平台源码后重新生成。\n'
        % (spec['no'], spec['title'], spec['why'], h0 + 1, h1 + 1, rows,
           '、'.join('`%s`' % g for g in spec['globals'])))
    return files


def gen_index():
    items = []
    for s in SPEC:
        h0, h1, _ = html_block(s)
        items.append((s, h0 + 1, h1 + 1))
    blocks = []
    for s, a, b in items:
        blocks.append(
            '  <div class="item">\n'
            '    <div class="hd"><span class="no">%s</span><span class="nm">%s</span></div>\n'
            '    <p class="need">%s</p>\n'
            '    <p class="why">%s</p>\n'
            '    <div class="loc">_src/v15/index.html 第 %d–%d 行　·　app.js 里 %d 个声明</div>\n'
            '    <div class="files"><span>fragment.html</span><span>logic.js</span>'
            '<span>style.css</span><span>README.md</span></div>\n'
            '  </div>'
            % (s['no'], s['title'], s['need'], s['why'], a, b, len(s['js'])))
    return (
        '<!DOCTYPE html>\n<html lang="zh-CN">\n<head>\n<meta charset="UTF-8">\n'
        '<meta name="viewport" content="width=device-width,initial-scale=1">\n'
        '<title>平台亮点模块索引 · 京津冀政策情景快速评估平台 %s</title>\n'
        '<style>\n'
        ':root{--bg:#FBFAF7;--panel:#FFFFFF;--line:#E3DCD0;--line2:#EFEAE1;\n'
        '  --tx:#1B1A17;--tx2:#55504A;--tx3:#6E675D;\n'
        '  --pri:#2F4858;--pri-s:#ECF0F2;--pri-b:#C3D0D6;--wn:#8C5A3C;--wn-s:#F7F0E8;}\n'
        '*{box-sizing:border-box;margin:0;padding:0;}\n'
        'body{background:var(--bg);color:var(--tx);font-family:-apple-system,"Segoe UI",'
        '"Microsoft YaHei",sans-serif;font-size:14px;line-height:1.75;padding:36px 20px 64px;}\n'
        '.wrap{max-width:900px;margin:0 auto;}\n'
        'h1{font-size:21px;font-weight:600;letter-spacing:.2px;}\n'
        '.sub{color:var(--tx2);font-size:13.5px;margin-top:10px;}\n'
        '.meta{margin-top:14px;display:flex;gap:8px;flex-wrap:wrap;}\n'
        '.tag{font-size:11.5px;padding:3px 10px;border:1px solid var(--line);'
        'border-radius:99px;background:var(--panel);color:var(--tx2);}\n'
        '.tag.hi{color:var(--pri);border-color:var(--pri-b);background:var(--pri-s);}\n'
        'h2{font-size:15px;font-weight:600;margin:32px 0 12px;padding-bottom:8px;'
        'border-bottom:1px solid var(--line);}\n'
        '.item{background:var(--panel);border:1px solid var(--line);border-radius:6px;'
        'padding:16px 18px;margin-bottom:12px;}\n'
        '.item .hd{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;}\n'
        '.item .no{font-size:12px;font-weight:600;color:var(--pri);background:var(--pri-s);'
        'border:1px solid var(--pri-b);border-radius:4px;padding:1px 8px;}\n'
        '.item .nm{font-size:15px;font-weight:600;}\n'
        '.item .need{color:var(--wn);font-size:12.5px;margin-top:9px;}\n'
        '.item .why{color:var(--tx2);font-size:13px;margin-top:7px;}\n'
        '.item .loc{margin-top:10px;font-size:12.5px;color:var(--tx3);'
        'font-family:ui-monospace,Consolas,monospace;}\n'
        '.files{margin-top:9px;display:flex;gap:7px;flex-wrap:wrap;}\n'
        '.files span{font-size:11.5px;font-family:ui-monospace,Consolas,monospace;'
        'background:var(--line2);border-radius:4px;padding:2px 8px;color:var(--tx2);}\n'
        '.note{background:var(--pri-s);border:1px solid var(--pri-b);border-radius:6px;'
        'padding:13px 16px;font-size:13px;margin-top:16px;}\n'
        'code{font-family:ui-monospace,Consolas,monospace;background:var(--line2);'
        'padding:1px 5px;border-radius:3px;font-size:12.5px;}\n'
        '.foot{margin-top:26px;font-size:12.5px;color:var(--tx3);}\n'
        '</style>\n</head>\n<body>\n<div class="wrap">\n\n'
        '  <h1>平台亮点模块索引</h1>\n'
        '  <p class="sub">从 %s 工作副本（<code>_src/v15/</code>）里切出的可复用功能模块。'
        '每个模块单独成目录，含 HTML 片段、核心逻辑与样式摘录，可独立取用、按需拼装。'
        '全部由 <code>build_highlights.py</code> 生成，不是手工摘抄。</p>\n'
        '  <div class="meta">\n'
        '    <span class="tag hi">%d 个模块</span>\n'
        '    <span class="tag">公共样式 _shared/base.css</span>\n'
        '    <span class="tag">完整平台见 ../index.html</span>\n'
        '  </div>\n\n'
        '  <h2>模块清单</h2>\n\n%s\n\n'
        '  <div class="note">\n'
        '    <b>为什么是生成的</b>：上一版 8 个模块是 2026-10-16 手工从 v1.0 切的，'
        '切完之后平台又改了四版，副本就过期了——引用着已删的函数、配着弃用的配色、'
        '标着 v1.0 的行号。改成从源码切之后，模块里不可能出现源码里没有的东西：'
        '锚点找不到就直接报错。改了平台源码，跑 <code>python build_highlights.py</code> '
        '重新生成，跑 <code>python build_highlights.py --check</code> 检查是否过期。\n'
        '  </div>\n\n'
        '  <div class="foot">亮点模块　·　%s　·　2026-10-25　·　模型侧 · 清华大学</div>\n\n'
        '</div>\n</body>\n</html>\n'
        % (VER, VER, len(SPEC), '\n\n'.join(blocks), VER))


def all_outputs():
    """返回 {相对路径: 内容}。"""
    out = {}
    for s in SPEC:
        for rel, body in gen_module(s).items():
            out['%s/%s' % (s['dir'], rel)] = body
    out['index.html'] = gen_index()
    out['_shared/base.css'] = (
        '/* v1.5 完整样式表（_src/v15/src/styles.css 原样拷贝）。\n'
        '   各模块的 demo 都依赖它，复用时整份拷走即可；\n'
        '   顶部 :root 是全部设计令牌。 */\n\n' + CSS)
    out['_shared/base.css.说明.txt'] = (
        '这是平台 %s 的完整样式表（原 _src/v15/src/styles.css）。\n'
        '各亮点模块都依赖它，复用时整份拷走即可；顶部 :root 是全部设计令牌。\n' % VER)
    return out


def write_all():
    for rel, body in all_outputs().items():
        path = os.path.join(HERE, rel.replace('/', os.sep))
        d = os.path.dirname(path)
        if d and not os.path.isdir(d):
            os.makedirs(d)
        io.open(path, 'w', encoding='utf-8', newline='\n').write(body)
    # 清掉过期模块目录（名字对不上的 H* 目录）
    want = set(s['dir'] for s in SPEC)
    removed = []
    for nm in sorted(os.listdir(HERE)):
        p = os.path.join(HERE, nm)
        if os.path.isdir(p) and re.match(r'^H\d+_', nm) and nm not in want:
            import shutil
            shutil.rmtree(p)
            removed.append(nm)
    return removed


def check():
    want = all_outputs()
    bad = []
    for rel, body in sorted(want.items()):
        path = os.path.join(HERE, rel.replace('/', os.sep))
        if not os.path.exists(path):
            bad.append('缺失：%s' % rel)
            continue
        cur = io.open(path, encoding='utf-8').read()
        if cur != body:
            bad.append('与源码不一致：%s' % rel)
    wantdirs = set(s['dir'] for s in SPEC)
    for nm in sorted(os.listdir(HERE)):
        p = os.path.join(HERE, nm)
        if os.path.isdir(p) and re.match(r'^H\d+_', nm) and nm not in wantdirs:
            bad.append('过期模块目录：%s' % nm)
    if bad:
        print('亮点模块已过期，共 %d 处：' % len(bad))
        for b in bad:
            print('  · ' + b)
        print('跑  python build_highlights.py  重新生成。')
        return 1
    print('亮点模块与源码一致：%d 个模块，%d 个文件。' % (len(SPEC), len(want)))
    return 0


if __name__ == '__main__':
    if CHECK:
        sys.exit(check())
    gone = write_all()
    print('已生成 %d 个亮点模块（%d 个文件）' % (len(SPEC), len(all_outputs())))
    for s in SPEC:
        h0, h1, _ = html_block(s)
        print('  %-4s %-30s index.html %4d-%4d 行，%2d 个声明'
              % (s['no'], s['title'], h0 + 1, h1 + 1, len(s['js'])))
    if gone:
        print('  已删除过期目录：%s' % '、'.join(gone))
