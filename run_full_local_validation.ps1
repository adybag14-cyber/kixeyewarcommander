param(
    [string]$NodeExe = "C:\Program Files\nodejs\node.exe",
    [switch]$SkipSoak
)

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

function Read-JsonSafe {
    param([string]$Path)
    if (!(Test-Path $Path)) { return $null }
    try {
        return (Get-Content -Path $Path -Raw | ConvertFrom-Json)
    } catch {
        return $null
    }
}

function Invoke-ValidationStep {
    param(
        [hashtable]$Step,
        [string]$NodePath,
        [string]$RootPath,
        [string]$ArtifactDir,
        [string]$SuiteId
    )

    $start = Get-Date
    $stdoutPath = Join-Path $ArtifactDir ("{0}__{1}__stdout.log" -f $SuiteId, $Step.id)
    $stderrPath = Join-Path $ArtifactDir ("{0}__{1}__stderr.log" -f $SuiteId, $Step.id)
    $exitCode = 0
    $errorMessage = $null

    $scriptPath = Join-Path $RootPath $Step.script
    if (!(Test-Path $scriptPath)) {
        return [pscustomobject]@{
            id = $Step.id
            type = $Step.type
            script = $Step.script
            startedAt = $start.ToString("o")
            endedAt = (Get-Date).ToString("o")
            durationSec = 0
            exitCode = 1
            status = "failed"
            error = "Missing script: $($Step.script)"
            copiedArtifacts = @()
            missingArtifacts = $Step.outputs
            stdoutLog = (Split-Path -Leaf $stdoutPath)
            stderrLog = (Split-Path -Leaf $stderrPath)
        }
    }

    try {
        switch ($Step.type) {
            "node" {
                & $NodePath $scriptPath 1> $stdoutPath 2> $stderrPath
                $exitCode = if ($LASTEXITCODE -eq $null) { 0 } else { [int]$LASTEXITCODE }
            }
            "powershell" {
                & powershell -NoProfile -ExecutionPolicy Bypass -File $scriptPath 1> $stdoutPath 2> $stderrPath
                $exitCode = if ($LASTEXITCODE -eq $null) { 0 } else { [int]$LASTEXITCODE }
            }
            default {
                throw "Unknown step type: $($Step.type)"
            }
        }
    } catch {
        $exitCode = 1
        $errorMessage = $_.Exception.Message
    }

    $copiedArtifacts = @()
    $missingArtifacts = @()
    foreach ($output in $Step.outputs) {
        $sourcePath = Join-Path $RootPath $output
        if (Test-Path $sourcePath) {
            $targetName = "{0}__{1}__{2}" -f $SuiteId, $Step.id, [System.IO.Path]::GetFileName($output)
            $targetPath = Join-Path $ArtifactDir $targetName
            Copy-Item -Path $sourcePath -Destination $targetPath -Force
            $item = Get-Item $targetPath
            $copiedArtifacts += [pscustomobject]@{
                source = $output
                target = $targetName
                bytes = $item.Length
                copiedAt = (Get-Date).ToString("o")
            }
        } else {
            $missingArtifacts += $output
        }
    }

    $end = Get-Date
    if ($missingArtifacts.Count -gt 0 -and $exitCode -eq 0) {
        $exitCode = 1
        if ([string]::IsNullOrWhiteSpace($errorMessage)) {
            $errorMessage = "Missing expected output(s): " + ($missingArtifacts -join ", ")
        }
    }

    return [pscustomobject]@{
        id = $Step.id
        type = $Step.type
        script = $Step.script
        startedAt = $start.ToString("o")
        endedAt = $end.ToString("o")
        durationSec = [Math]::Round(($end - $start).TotalSeconds, 2)
        exitCode = $exitCode
        status = $(if ($exitCode -eq 0) { "passed" } else { "failed" })
        error = $errorMessage
        copiedArtifacts = $copiedArtifacts
        missingArtifacts = $missingArtifacts
        stdoutLog = (Split-Path -Leaf $stdoutPath)
        stderrLog = (Split-Path -Leaf $stderrPath)
    }
}

$resolvedNode = (Resolve-Path -Path $NodeExe).Path
if (!(Test-Path $resolvedNode)) {
    throw "Node executable not found: $NodeExe"
}
if ([System.IO.Path]::GetFileName($resolvedNode).ToLowerInvariant() -ne "node.exe") {
    throw "Resolved Node path is not node.exe: $resolvedNode"
}

$healthStatus = 0
try {
    $healthStatus = (Invoke-WebRequest -UseBasicParsing -TimeoutSec 5 "http://127.0.0.1:8089/").StatusCode
} catch {
    throw "Local server health check failed on 127.0.0.1:8089: $($_.Exception.Message)"
}
if ($healthStatus -ne 200) {
    throw "Local server health check returned non-200 status: $healthStatus"
}

$runStarted = Get-Date
$stamp = $runStarted.ToString("yyyyMMdd-HHmmss")
$suiteId = "local-validation-$stamp"
$artifactDir = Join-Path $PSScriptRoot ("artifacts\validation_runs\" + $suiteId)
New-Item -ItemType Directory -Force -Path $artifactDir | Out-Null

$steps = @(
    @{ id = "ws3_write_guard_fuzz"; type = "powershell"; script = "tmp_probe_write_guard_fuzz.ps1"; outputs = @("tmp_probe_write_guard_fuzz_results.json", "write_guard_fuzz_matrix.json") },
    @{ id = "ws4_upgrade_sanity"; type = "node"; script = "tmp_probe_upgrade_sanity.js"; outputs = @("tmp_probe_upgrade_sanity.json") },
    @{ id = "ws4_unit_production_direct"; type = "node"; script = "tmp_probe_unit_production_direct_action.js"; outputs = @("tmp_probe_unit_production_direct_action.json") },
    @{ id = "ws4_upgrade_world_roundtrip"; type = "node"; script = "tmp_probe_upgrade_world_roundtrip_dynamic.js"; outputs = @("tmp_probe_upgrade_world_roundtrip_dynamic.json") },
    @{ id = "ws4_barracks_training"; type = "node"; script = "tmp_probe_barracks_training.js"; outputs = @("tmp_probe_barracks_training.json") },
    @{ id = "ws2_worldmap_event_platoon_deep"; type = "node"; script = "tmp_probe_worldmap_event_platoon_deep.js"; outputs = @("tmp_probe_worldmap_event_platoon_deep.json") },
    @{ id = "ws2_worldmap_parity_matrix"; type = "node"; script = "tmp_probe_worldmap_parity_matrix.js"; outputs = @("tmp_probe_worldmap_parity_matrix.json") },
    @{ id = "ws5_ui_runtime_soak_10m"; type = "node"; script = "tmp_probe_ui_runtime_soak_10m.js"; outputs = @("ui_runtime_soak_results.json") }
)

if ($SkipSoak) {
    $steps = $steps | Where-Object { $_.id -ne "ws5_ui_runtime_soak_10m" }
}

$stepResults = @()
foreach ($step in $steps) {
    $result = Invoke-ValidationStep -Step $step -NodePath $resolvedNode -RootPath $PSScriptRoot -ArtifactDir $artifactDir -SuiteId $suiteId
    $stepResults += $result
}

$ws3 = Read-JsonSafe -Path (Join-Path $PSScriptRoot "tmp_probe_write_guard_fuzz_results.json")
$upSanity = Read-JsonSafe -Path (Join-Path $PSScriptRoot "tmp_probe_upgrade_sanity.json")
$prodDirect = Read-JsonSafe -Path (Join-Path $PSScriptRoot "tmp_probe_unit_production_direct_action.json")
$upWorld = Read-JsonSafe -Path (Join-Path $PSScriptRoot "tmp_probe_upgrade_world_roundtrip_dynamic.json")
$barracks = Read-JsonSafe -Path (Join-Path $PSScriptRoot "tmp_probe_barracks_training.json")
$wmDeep = Read-JsonSafe -Path (Join-Path $PSScriptRoot "tmp_probe_worldmap_event_platoon_deep.json")
$wmParity = Read-JsonSafe -Path (Join-Path $PSScriptRoot "tmp_probe_worldmap_parity_matrix.json")
$soak = Read-JsonSafe -Path (Join-Path $PSScriptRoot "ui_runtime_soak_results.json")

$ws3Pass = $false
if ($ws3 -and $ws3.summary) {
    $ws3Pass = [bool]$ws3.summary.allSafetyChecksPass -and [bool]$ws3.summary.replayMismatchEnforced
}

$ws4Pass = $false
if ($upSanity -and $upSanity.result -and $prodDirect -and $prodDirect.summary -and $upWorld -and $barracks) {
    $ws4Pass = [bool]$upSanity.result.ok -and `
        (@($upSanity.errors).Count -eq 0) -and `
        [bool]$prodDirect.summary.success -and `
        (@($prodDirect.errors).Count -eq 0) -and `
        [bool]$upWorld.directUpgrade.ok -and `
        (@($upWorld.errors).Count -eq 0) -and `
        [bool]$barracks.call1.ok -and `
        [bool]$barracks.call2.ok -and `
        (@($barracks.errors).Count -eq 0)
}

$ws2Pass = $false
if ($wmDeep -and $wmDeep.summary -and $wmParity -and $wmParity.summary) {
    $ws2Pass = ((@($wmDeep.pageErrors).Count -eq 0) -and `
        ($wmParity.summary.checksFailed -eq 0) -and `
        ($wmParity.summary.pageErrors -eq 0))
}

$ws5Pass = $true
if (-not $SkipSoak) {
    $ws5Pass = $false
    if ($soak -and $soak.summary) {
        $ws5Pass = [bool]$soak.summary.success -and `
            ($soak.summary.pageErrorCount -eq 0) -and `
            ($soak.summary.responseErr -eq 0)
    }
}

$knownNonFatalConsoleErrors = @()
$unclassifiedConsoleErrors = @()
if ($soak -and $soak.consoleErrors) {
    $grouped = @($soak.consoleErrors | Group-Object text | Sort-Object Count -Descending)
    foreach ($group in $grouped) {
        $row = [pscustomobject]@{
            count = $group.Count
            text = $group.Name
        }
        if ($group.Name -like "*embedded/ui/goldstore/storeicons/*") {
            $knownNonFatalConsoleErrors += $row
        } else {
            $unclassifiedConsoleErrors += $row
        }
    }
}

$allStepsPassed = (@($stepResults | Where-Object { $_.status -ne "passed" }).Count -eq 0)
$criticalPass = $allStepsPassed -and $ws3Pass -and $ws4Pass -and $ws2Pass -and $ws5Pass

$runEnded = Get-Date
$summary = [ordered]@{
    suiteId = $suiteId
    startedAt = $runStarted.ToString("o")
    endedAt = $runEnded.ToString("o")
    durationSec = [Math]::Round(($runEnded - $runStarted).TotalSeconds, 2)
    repoRoot = $PSScriptRoot
    artifactDir = $artifactDir
    nodeExe = $resolvedNode
    branch = ((git -C $PSScriptRoot rev-parse --abbrev-ref HEAD) | Select-Object -First 1).Trim()
    commit = ((git -C $PSScriptRoot rev-parse --short HEAD) | Select-Object -First 1).Trim()
    serverHealthStatus = $healthStatus
    skipSoak = [bool]$SkipSoak
    stepResults = $stepResults
    extracted = [ordered]@{
        ws3_write_guard = if ($ws3) { $ws3.summary } else { $null }
        ws4_upgrade_sanity = if ($upSanity) { $upSanity.result } else { $null }
        ws4_unit_production_direct = if ($prodDirect) { $prodDirect.summary } else { $null }
        ws4_upgrade_world_roundtrip = if ($upWorld) { $upWorld.directUpgrade } else { $null }
        ws4_barracks_training = if ($barracks) { [pscustomobject]@{ call1Ok = [bool]$barracks.call1.ok; call2Ok = [bool]$barracks.call2.ok; errors = @($barracks.errors).Count } } else { $null }
        ws2_worldmap_event_platoon_deep = if ($wmDeep) { $wmDeep.summary } else { $null }
        ws2_worldmap_parity_matrix = if ($wmParity) { $wmParity.summary } else { $null }
        ws5_ui_runtime_soak = if ($soak) { $soak.summary } else { $null }
    }
    gates = [ordered]@{
        ws3_save_write_integrity = $ws3Pass
        ws4_production_upgrade_queue = $ws4Pass
        ws2_worldmap_event_parity = $ws2Pass
        ws5_ui_runtime_stability = $ws5Pass
        all_steps_passed = $allStepsPassed
        critical_pass = $criticalPass
    }
    consoleErrorClassification = [ordered]@{
        knownNonFatal = $knownNonFatalConsoleErrors
        unclassified = $unclassifiedConsoleErrors
    }
}

$summaryJsonName = "full_validation_summary_{0}.json" -f $suiteId
$summaryMdName = "full_validation_summary_{0}.md" -f $suiteId
$summaryJsonPath = Join-Path $artifactDir $summaryJsonName
$summaryMdPath = Join-Path $artifactDir $summaryMdName

$summary | ConvertTo-Json -Depth 12 | Set-Content -Path $summaryJsonPath -Encoding UTF8

$md = @()
$md += "# Full Local Validation Summary ($suiteId)"
$md += ""
$md += "- Started: $($summary.startedAt)"
$md += "- Ended: $($summary.endedAt)"
$md += "- Duration: $($summary.durationSec)s"
$md += "- Branch: $($summary.branch)"
$md += "- Commit: $($summary.commit)"
$md += "- Node: $($summary.nodeExe)"
$md += "- Server health: $($summary.serverHealthStatus)"
$md += "- Artifacts: $artifactDir"
$md += ""
$md += "## Gates"
$md += "- WS3 Save/Write Integrity: $(if ($ws3Pass) { 'PASS' } else { 'FAIL' })"
$md += "- WS4 Production/Upgrade Queue: $(if ($ws4Pass) { 'PASS' } else { 'FAIL' })"
$md += "- WS2 Worldmap/Event Parity: $(if ($ws2Pass) { 'PASS' } else { 'FAIL' })"
$md += "- WS5 UI Runtime Stability: $(if ($ws5Pass) { 'PASS' } else { 'FAIL' })"
$md += "- All step executions: $(if ($allStepsPassed) { 'PASS' } else { 'FAIL' })"
$md += "- Critical overall: $(if ($criticalPass) { 'PASS' } else { 'FAIL' })"
$md += ""
$md += "## Step Results"
foreach ($step in $stepResults) {
    $line = "- $($step.id): $($step.status.ToUpper()) (exit=$($step.exitCode), duration=$($step.durationSec)s)"
    if ($step.error) {
        $line += " - $($step.error)"
    }
    $md += $line
}
$md += ""
$md += "## Runtime Error Classification"
if ($knownNonFatalConsoleErrors.Count -gt 0) {
    foreach ($row in $knownNonFatalConsoleErrors) {
        $md += "- Known non-fatal: $($row.count)x $($row.text)"
    }
} else {
    $md += "- Known non-fatal: none"
}
if ($unclassifiedConsoleErrors.Count -gt 0) {
    foreach ($row in $unclassifiedConsoleErrors) {
        $md += "- Unclassified: $($row.count)x $($row.text)"
    }
} else {
    $md += "- Unclassified: none"
}

$md -join [Environment]::NewLine | Set-Content -Path $summaryMdPath -Encoding UTF8

Write-Host ("SUITE_ID={0}" -f $suiteId)
Write-Host ("ARTIFACT_DIR={0}" -f $artifactDir)
Write-Host ("SUMMARY_JSON={0}" -f $summaryJsonName)
Write-Host ("SUMMARY_MD={0}" -f $summaryMdName)
Write-Host ("CRITICAL_PASS={0}" -f $criticalPass)

if (-not $criticalPass) {
    exit 2
}
