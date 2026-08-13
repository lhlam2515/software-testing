param(
  [string]$JMeterHome = $env:JMETER_HOME
)

& (Join-Path $PSScriptRoot "Run-JMeter.ps1") -Plan "23127543_Spike_20260813.jmx" -Label "spike" -Threads "50" -RampUp "8" -Duration "120" -Loops "1" -ThinkTimeMs "50" -JMeterHome $JMeterHome
