# Invoke cake build
& ($PSScriptRoot + "\_stdio\devops\cake\build.ps1") @args

Set-Location -LiteralPath $PSScriptRoot
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
