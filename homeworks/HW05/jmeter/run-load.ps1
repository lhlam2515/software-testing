param(
  [string]$JMeterHome = $env:JMETER_HOME
)

& (Join-Path $PSScriptRoot "Run-JMeter.ps1") -Plan "23127543_Load_20260813.jmx" -Label "load" -Threads "10" -RampUp "60" -Duration "300" -Loops "2" -ThinkTimeMs "250" -JMeterHome $JMeterHome
