$ErrorActionPreference = 'Stop'

$jmeter = 'jmeter'
$plan = Join-Path $PSScriptRoot 'plans\23127543_Load_20260811.jmx'
$jtl = Join-Path $PSScriptRoot 'results\23127543_Load_20260811.jtl'
$report = Join-Path $PSScriptRoot 'reports\load'

if (-not (Get-Command $jmeter -ErrorAction SilentlyContinue)) {
  Write-Host 'TODO: JMeter not found on PATH. Install JMeter or update this script.'
  exit 1
}

Write-Host 'TODO - REQUIRES REAL EXECUTION. This script will run the Load plan only when you are ready.'
Write-Host "Plan: $plan"
Write-Host "JTL : $jtl"
Write-Host "Report: $report"

