param(
  [Parameter(ValueFromRemainingArguments = $true)]
  [string[]]$ExtraArgs
)

$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root
npm.cmd run verify @ExtraArgs
