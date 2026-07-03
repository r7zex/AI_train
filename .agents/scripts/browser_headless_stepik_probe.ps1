param(
    [int]$SnapshotLimit = 40
)

$ErrorActionPreference = "Stop"

$WorkspaceRoot = "C:\Users\User\PycharmProjects\AI_learn\AI_train"
$OutDir = Join-Path $WorkspaceRoot ".agents\browser_probe"
New-Item -ItemType Directory -Force -Path $OutDir | Out-Null

function Invoke-OpenClaw {
    param([string[]]$OpenClawArgs)

    $oldErrorActionPreference = $ErrorActionPreference
    $ErrorActionPreference = "Continue"
    try {
        $output = & openclaw @OpenClawArgs 2>$null
        $exitCode = $LASTEXITCODE
    }
    finally {
        $ErrorActionPreference = $oldErrorActionPreference
    }
    if ($exitCode -ne 0) {
        throw "openclaw $($OpenClawArgs -join ' ') failed with exit code ${exitCode}: $($output -join [Environment]::NewLine)"
    }
    return $output
}

function Get-BrowserTabs {
    $raw = Invoke-OpenClaw @("browser", "--json", "tabs")
    return ($raw -join [Environment]::NewLine | ConvertFrom-Json).tabs
}

function Find-TabByUrlPart {
    param(
        [object[]]$Tabs,
        [string]$UrlPart
    )

    return @($Tabs | Where-Object { $_.url -like "*$UrlPart*" } | Select-Object -First 1)[0]
}

Push-Location $WorkspaceRoot
try {
    Write-Output "[browser-probe] start: ensuring OpenClaw browser is running"
    Invoke-OpenClaw @("browser", "start") | Out-Null
    Start-Sleep -Seconds 2

    Write-Output "[browser-probe] doctor: checking browser-control and headless status"
    $doctorRaw = Invoke-OpenClaw @("browser", "--json", "doctor")
    $doctorText = $doctorRaw -join [Environment]::NewLine
    $doctor = $doctorText | ConvertFrom-Json
    $doctorText | Set-Content -LiteralPath (Join-Path $OutDir "doctor.json") -Encoding UTF8

    Write-Output "[browser-probe] tabs: listing current tabs"
    $tabs = @(Get-BrowserTabs)
    $catalog = Find-TabByUrlPart -Tabs $tabs -UrlPart "/catalog"
    if ($null -eq $catalog) {
        Write-Output "[browser-probe] open: https://stepik.org/catalog"
        Invoke-OpenClaw @("browser", "open", "https://stepik.org/catalog") | Out-Null
        Start-Sleep -Seconds 5
        $tabs = @(Get-BrowserTabs)
        $catalog = Find-TabByUrlPart -Tabs $tabs -UrlPart "/catalog"
    }

    $learn = Find-TabByUrlPart -Tabs $tabs -UrlPart "/learn"
    if ($null -eq $learn) {
        Write-Output "[browser-probe] open: https://stepik.org/learn"
        Invoke-OpenClaw @("browser", "open", "https://stepik.org/learn") | Out-Null
        Start-Sleep -Seconds 5
        $tabs = @(Get-BrowserTabs)
        $learn = Find-TabByUrlPart -Tabs $tabs -UrlPart "/learn"
    }

    if ($null -eq $catalog) {
        throw "Could not find or open Stepik catalog tab."
    }
    if ($null -eq $learn) {
        throw "Could not find or open Stepik learn tab."
    }

    $tabs | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath (Join-Path $OutDir "tabs.json") -Encoding UTF8

    $catalogTarget = $catalog.suggestedTargetId
    $learnTarget = $learn.suggestedTargetId

    Write-Output "[browser-probe] focus: catalog tab $catalogTarget"
    Invoke-OpenClaw @("browser", "focus", $catalogTarget) | Out-Null
    Start-Sleep -Seconds 1
    Write-Output "[browser-probe] snapshot: catalog"
    $catalogSnapshot = Invoke-OpenClaw @("browser", "snapshot", "--efficient", "--limit", "$SnapshotLimit")
    $catalogSnapshotText = $catalogSnapshot -join [Environment]::NewLine
    $catalogSnapshotText | Set-Content -LiteralPath (Join-Path $OutDir "catalog_snapshot.txt") -Encoding UTF8

    Write-Output "[browser-probe] focus: learn tab $learnTarget"
    Invoke-OpenClaw @("browser", "focus", $learnTarget) | Out-Null
    Start-Sleep -Seconds 1
    Write-Output "[browser-probe] snapshot: learn"
    $learnSnapshot = Invoke-OpenClaw @("browser", "snapshot", "--efficient", "--limit", "$SnapshotLimit")
    $learnSnapshotText = $learnSnapshot -join [Environment]::NewLine
    $learnSnapshotText | Set-Content -LiteralPath (Join-Path $OutDir "learn_snapshot.txt") -Encoding UTF8

    $report = [ordered]@{
        ok = $true
        browserRunning = [bool]$doctor.status.running
        headless = [bool]$doctor.status.headless
        headlessSource = [string]$doctor.status.headlessSource
        catalogTarget = [string]$catalogTarget
        catalogTitle = [string]$catalog.title
        catalogUrl = [string]$catalog.url
        learnTarget = [string]$learnTarget
        learnTitle = [string]$learn.title
        learnUrl = [string]$learn.url
        catalogShowsLoggedInHeader = ($catalogSnapshotText -match "Profile" -and $catalogSnapshotText -match "Activity")
        learnSnapshotShowsCourses = ($learnSnapshotText -match "Course cover" -or $learnSnapshotText -match "Stepik")
        artifacts = @{
            doctor = ".agents/browser_probe/doctor.json"
            tabs = ".agents/browser_probe/tabs.json"
            catalogSnapshot = ".agents/browser_probe/catalog_snapshot.txt"
            learnSnapshot = ".agents/browser_probe/learn_snapshot.txt"
        }
    }

    $reportJson = $report | ConvertTo-Json -Depth 8
    $reportJson | Set-Content -LiteralPath (Join-Path $OutDir "report.json") -Encoding UTF8
    Write-Output "[browser-probe] done: report follows"
    $reportJson
}
finally {
    Pop-Location
}
