# Copy this plugin into the DSH plugin directory and install its dependencies.
# Run from anywhere: the script resolves its own location.
$ErrorActionPreference = "Stop"

$source = Split-Path -Parent (Split-Path -Parent $PSCommandPath)
$target = Join-Path $env:USERPROFILE ".dsh\plugins\dsh-research-workbench"

Write-Output "source: $source"
Write-Output "target: $target"

if (-not (Test-Path (Join-Path $source "package.json"))) {
  Write-Error "run this from inside the plugin repository"
}

if (Test-Path $target) {
  Write-Output "removing the previous copy"
  Remove-Item $target -Recurse -Force
}
New-Item -ItemType Directory -Force -Path $target | Out-Null

foreach ($item in @("lib", "scripts", "client", "cordis.patch.yml", "package.json", "README.md", "LICENSE", "THIRD-PARTY-NOTICES.md", "requirements.txt")) {
  $from = Join-Path $source $item
  if (Test-Path $from) { Copy-Item $from -Destination $target -Recurse -Force }
}

Push-Location $target
try {
  npm install --ignore-scripts --omit=dev --no-audit --no-fund 2>&1 | Select-Object -Last 2
} finally { Pop-Location }

$entry = Join-Path $target "lib\index.js"
$url = "file:///" + ($entry -replace "\\", "/")
node -e "import(process.argv[1]).then(m => { console.log('plugin:', m.name ?? '(no name)'); console.log('apply :', typeof m.apply); }).catch(e => { console.log('LOAD FAILED:', e.message); process.exit(1) })" $url

Write-Output ""
Write-Output "installed. restart DSH for the client to load."