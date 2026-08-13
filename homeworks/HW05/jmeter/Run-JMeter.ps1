param(
  [Parameter(Mandatory = $true)]
  [string]$Plan,
  [Parameter(Mandatory = $true)]
  [string]$Label,
  [string]$Threads = "1",
  [string]$RampUp = "1",
  [string]$Duration = "60",
  [string]$Loops = "1",
  [string]$ThinkTimeMs = "250",
  [string]$Protocol = "http",
  [string]$TargetHost = "localhost",
  [string]$Port = "3000",
  [string]$AdminEmail = "admin@eshop.com",
  [string]$AdminPassword = "Admin123!",
  [string]$TargetOrderStatus = "confirmed",
  [string]$DefaultOrderId = "1",
  [string]$JMeterHome = $env:JMETER_HOME
)

$ErrorActionPreference = "Stop"

function Resolve-JMeterHome {
  param([string]$ConfiguredHome)
  if ($ConfiguredHome -and (Test-Path (Join-Path $ConfiguredHome "bin\jmeter.bat"))) {
    return (Resolve-Path $ConfiguredHome).Path
  }
  $candidates = @(
    "C:\apache-jmeter-5.6.3",
    "C:\Tools\apache-jmeter-5.6.3",
    "C:\Program Files\Apache\JMeter"
  )
  foreach ($candidate in $candidates) {
    if (Test-Path (Join-Path $candidate "bin\jmeter.bat")) {
      return (Resolve-Path $candidate).Path
    }
  }
  throw "JMeter was not found. Set JMETER_HOME or update the candidate paths in Run-JMeter.ps1."
}

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$planPath = Join-Path $scriptRoot "plans\$Plan"
if (!(Test-Path $planPath)) { throw "Plan not found: $planPath" }

$jmeterHomeResolved = Resolve-JMeterHome -ConfiguredHome $JMeterHome
$jmeterBat = Join-Path $jmeterHomeResolved "bin\jmeter.bat"

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$labelDir = Join-Path (Join-Path $scriptRoot "results") $Label
New-Item -ItemType Directory -Force -Path $labelDir | Out-Null
$resultFile = Join-Path $labelDir "$Label-$timestamp.jtl"
$reportDir = Join-Path $labelDir "report-$timestamp"

$props = @(
  "-JPROTOCOL=$Protocol",
  "-JHOST=$TargetHost",
  "-JPORT=$Port",
  "-JADMIN_EMAIL=$AdminEmail",
  "-JADMIN_PASSWORD=$AdminPassword",
  "-JTARGET_ORDER_STATUS=$TargetOrderStatus",
  "-JDEFAULT_ORDER_ID=$DefaultOrderId",
  "-JTHREADS=$Threads",
  "-JRAMP_UP=$RampUp",
  "-JDURATION=$Duration",
  "-JLOOPS=$Loops",
  "-JTHINK_TIME_MS=$ThinkTimeMs"
)

& $jmeterBat -n -t $planPath -l $resultFile -e -o $reportDir @props
Write-Host "Results: $resultFile"
Write-Host "Report:  $reportDir"
