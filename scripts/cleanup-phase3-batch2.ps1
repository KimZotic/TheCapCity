$ErrorActionPreference = "SilentlyContinue"
$root = Split-Path -Parent $PSScriptRoot
$files = @(
  "ARCHITECTURE.md","CHANGELOG.md","CURRENT_STATE.md","DECISIONS.md","HANDOFF_CURRENT.md","ROADMAP.md",
  "AP.md","ELOG.md","FF_CURRENT.md","IONS.md","NT_STATE.md","S.md","TECTURE.md","BATCH7_MANIFEST.txt"
)
foreach ($file in $files) { Remove-Item -LiteralPath (Join-Path $root $file) -Force -ErrorAction SilentlyContinue }
$dirs = @("acking","eckout","mmerce","rvices")
foreach ($dir in $dirs) { Remove-Item -LiteralPath (Join-Path $root $dir) -Recurse -Force -ErrorAction SilentlyContinue }
Write-Host "TCC cleanup complete. Canonical project continuity docs remain in /docs." -ForegroundColor Green
