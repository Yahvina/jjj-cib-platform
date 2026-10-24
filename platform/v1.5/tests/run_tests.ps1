# run_tests.ps1 -- unified self-check entry point for the platform
#
# Why this exists: 23 of the 28 _src/test_*.js files only PRINT the assertion
# result as a check/cross mark; they never exit non-zero. So "28/28 passed"
# has only ever meant "28/28 did not crash". This script closes that gap: it
# captures each test's stdout, counts cross marks, and treats any cross mark or
# non-zero exit as a failure.
#
# IMPORTANT: this file is deliberately ASCII-only. Windows PowerShell 5.1 reads
# a BOM-less .ps1 as ANSI, which mangles any non-ASCII string into a parse
# error. Chinese text here would silently break the whole gate.
#
# Usage (from anywhere):
#   powershell -File run_tests.ps1            # test the workspace source v15/
#   powershell -File run_tests.ps1 -Repo      # test the repo archive copy
#   powershell -File run_tests.ps1 -Prod      # also run the built-file smoke test
#   powershell -File run_tests.ps1 -Quiet     # print failures only
#
# Exit code: 0 when everything passes, 1 otherwise.

param(
  [switch]$Repo,
  [switch]$Prod,
  [switch]$Quiet
)

[Console]::OutputEncoding = [Text.Encoding]::UTF8
$ErrorActionPreference = 'Continue'
$root = $PSScriptRoot
$CROSS = [string][char]0x2717   # the cross mark used by the tests

# The script runs from two different layouts and must work in both:
#   workspace : <root>/_src/run_tests.ps1      tests beside v15/
#   archive   : <repo>/platform/v1.5/tests/    tests beside src/
# Auto-detect instead of making the caller pass a flag, so the archived copy
# keeps working after the folder is moved or cloned elsewhere.
$isArchive = (-not (Test-Path (Join-Path $root 'v15'))) -and (Test-Path (Join-Path $root '..\src\app.js'))

# -Repo means "test the archived copy". That copy lives in the git repo, not
# beside this script, so resolve it explicitly -- the old code just used '..\'
# and produced a path that never existed, making -Repo fail from the workspace.
$repoRoot = $null
if ($Repo -and -not $isArchive) {
  $candRepo = Join-Path $root '..\jjj-cib-platform\platform\v1.5\tests'
  if (Test-Path (Join-Path $candRepo '..\src\app.js')) { $repoRoot = $candRepo }
  elseif (Test-Path (Join-Path $root '..\src\app.js')) { $repoRoot = $root }
}

if ($repoRoot) {
  $srcArg  = Join-Path $repoRoot '..\src\app.js'
  $htmlArg = Join-Path $repoRoot '..\index.html'
  $testDir = $repoRoot
} elseif ($Repo -or $isArchive) {
  $srcArg  = Join-Path $root '..\src\app.js'
  $htmlArg = Join-Path $root '..\index.html'
  $testDir = $root
} else {
  $srcArg  = Join-Path $root 'v15\src\app.js'
  $htmlArg = Join-Path $root 'v15\index.html'
  $testDir = $root
}
# The built file has a Chinese name; this script is ASCII-only, so locate the
# newest single-file build by pattern instead of pasting the name in. From the
# archive there is no output/ beside us, so -Prod is simply unavailable there.
$outDir  = Join-Path $root '..\output'
$prodArg = $null
if (Test-Path $outDir) {
  $cand = Get-ChildItem $outDir -Filter '*v1.5*.html' -File -ErrorAction SilentlyContinue |
          Sort-Object LastWriteTime -Descending | Select-Object -First 1
  if ($cand) { $prodArg = $cand.FullName }
}

# Which argument each test takes: source by default; the doc/menu tests need a
# built HTML file; the smoke test needs the single-file build.
function Get-TestArg([string]$name) {
  if ($name -eq 'test_doc.js' -or $name -eq 'test_menu.js') { return $htmlArg }
  if ($name -eq 'test_gen_smoke.js') { return $prodArg }
  return $srcArg
}

$allTests = Get-ChildItem (Join-Path $testDir 'test_*.js') | Sort-Object Name
$tests = $allTests
# A skipped test must never look like a passed one. Without -Prod the smoke test
# cannot run, so drop it from the run but remember it: the summary prints the
# skip count, otherwise "29/29 all passed" reads as if all 30 files ran.
$skipped = @()
if (-not $Prod) {
  $skipped = @($tests | Where-Object { $_.Name -eq 'test_gen_smoke.js' })
  $tests = $tests | Where-Object { $_.Name -ne 'test_gen_smoke.js' }
}

$pass = 0
$failed = @()

foreach ($t in $tests) {
  $arg = Get-TestArg $t.Name
  if (-not (Test-Path $arg)) {
    # The built file may legitimately be absent when -Prod is not given; only
    # report it when this run actually asked for it.
    $failed += [pscustomobject]@{ Name = $t.Name; Why = 'input not found: ' + $arg; Detail = @() }
    continue
  }
  $out  = (& node $t.FullName $arg 2>&1) -join "`n"
  $code = $LASTEXITCODE
  $bad  = ([regex]::Matches($out, [regex]::Escape($CROSS))).Count

  if ($code -ne 0 -or $bad -gt 0) {
    $why = @()
    if ($code -ne 0) { $why += 'exit=' + $code }
    if ($bad -gt 0)  { $why += 'cross x' + $bad }
    $lines = ($out -split "`n") | Where-Object { $_ -match [regex]::Escape($CROSS) } | Select-Object -First 6
    if (-not $lines) { $lines = ($out -split "`n") | Select-Object -Last 6 }
    $failed += [pscustomobject]@{ Name = $t.Name; Why = ($why -join ' '); Detail = $lines }
  } else {
    $pass++
    if (-not $Quiet) { Write-Host ('  ok   ' + $t.Name) }
  }
}

Write-Host ''
$total = $tests.Count
$where = if ($Repo -or $isArchive) { 'archive copy' } else { 'workspace source' }
$skipNote = ''
if ($skipped.Count -gt 0) {
  # ASCII-only script: build the wording from $skipped names, no non-ASCII literals.
  $skipNote = ' (+' + $skipped.Count + ' skipped, not run: ' + (($skipped | ForEach-Object { $_.Name }) -join ', ') + ')'
}
if ($failed.Count -eq 0) {
  Write-Host ('[' + $where + '] ' + $pass + '/' + $total + ' all passed (no cross marks, no non-zero exits)' + $skipNote)
  exit 0
} else {
  Write-Host ('[' + $where + '] ' + $pass + '/' + $total + ' passed, ' + $failed.Count + ' failed:' + $skipNote)
  foreach ($f in $failed) {
    Write-Host ('  FAIL ' + $f.Name + '   ' + $f.Why)
    foreach ($d in $f.Detail) { Write-Host ('       ' + $d.Trim()) }
  }
  exit 1
}
