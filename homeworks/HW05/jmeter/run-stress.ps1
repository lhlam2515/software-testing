param(
  [string]$JMeterHome = $env:JMETER_HOME
)

& (Join-Path $PSScriptRoot "Run-JMeter.ps1") -Plan "23127543_Stress_20260813.jmx" -Label "stress" -Threads "30" -RampUp "90" -Duration "600" -Loops "3" -ThinkTimeMs "150" -JMeterHome $JMeterHome
