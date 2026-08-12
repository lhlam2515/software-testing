$ErrorActionPreference = 'Stop'

$baseDir = $PSScriptRoot
$plan = Join-Path $baseDir 'plans\23127543_Stress_20260811.jmx'
$jtl = Join-Path $baseDir 'results\23127543_Stress_20260811.jtl'
$report = Join-Path $baseDir 'reports\stress'

function Resolve-JMeterCommand {
  $cmd = Get-Command 'jmeter.bat' -ErrorAction SilentlyContinue
  if ($cmd) { return $cmd.Source }

  if ($env:JMETER_HOME) {
    $candidate = Join-Path $env:JMETER_HOME 'bin\jmeter.bat'
    if (Test-Path -LiteralPath $candidate) {
      return $candidate
    }
  }

  throw 'JMeter was not found. Install Apache JMeter and add jmeter.bat to PATH, or set JMETER_HOME to the JMeter installation directory.'
}

foreach ($dir in @((Split-Path -Parent $jtl), $report)) {
  New-Item -ItemType Directory -Force -Path $dir | Out-Null
}

$jmeter = Resolve-JMeterCommand

Write-Host "Running Stress plan: $plan"
Write-Host "Results: $jtl"
Write-Host "HTML report: $report"

$args = @(
  '-n'
  '-t', $plan
  '-l', $jtl
  '-e'
  '-o', $report
)

& $jmeter @args
$exitCode = $LASTEXITCODE
if ($exitCode -ne 0) {
  throw "JMeter exited with code $exitCode"
}
