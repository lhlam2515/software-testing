param(
  [string]$JMeterHome = $env:JMETER_HOME
)

& (Join-Path $PSScriptRoot "Run-JMeter.ps1") `
    -Plan "23127543_Load_20260813.jmx" `
    -Label "endurance" `
    -Threads "100" `
    -RampUp "60" `
    -Duration "900" `
    -Loops "-1" `
    -ThinkTimeMs "250" `
    -JMeterHome $JMeterHome