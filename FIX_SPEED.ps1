# FIX_SPEED.ps1
# Right-click this file and select "Run with PowerShell" as Administrator.

Write-Host "--- REPAIRING ETHERNET SPEED (1.5 GBPS TARGET) ---" -ForegroundColor Cyan

# 1. Force Remove ANY External VMSwitch
$switches = Get-VMSwitch | Where-Object { $_.SwitchType -eq 'External' }
foreach ($sw in $switches) {
    Write-Host "Removing Switch: $($sw.Name)..."
    Remove-VMSwitch -Name $sw.Name -Force -ErrorAction SilentlyContinue
}

# 2. Reset Physical Adapter Settings
Write-Host "Resetting 'Ethernet' (Killer E3100G) settings..."
$adapter = "Ethernet"

# Disable Power Saving (Commonly causes 100MB fallback)
Set-NetAdapterAdvancedProperty -Name $adapter -DisplayName "Green Ethernet" -DisplayValue "Disabled" -ErrorAction SilentlyContinue
Set-NetAdapterAdvancedProperty -Name $adapter -DisplayName "Power Saving Mode" -DisplayValue "Disabled" -ErrorAction SilentlyContinue
Set-NetAdapterAdvancedProperty -Name $adapter -DisplayName "Energy-Efficient Ethernet" -DisplayValue "Disabled" -ErrorAction SilentlyContinue
Set-NetAdapterAdvancedProperty -Name $adapter -DisplayName "Gigabit Lite" -DisplayValue "Disabled" -ErrorAction SilentlyContinue

# Ensure Auto-Negotiation is on
Set-NetAdapterAdvancedProperty -Name $adapter -DisplayName "Speed & Duplex" -DisplayValue "Auto Negotiation" -ErrorAction SilentlyContinue

# 3. Disable Killer Services (Drivers remain, but software stack stops)
Write-Host "Stopping Killer Network services..."
Stop-Service "KNDBWM" -Force -ErrorAction SilentlyContinue # Killer Network Service
Stop-Service "Killer Selection Service" -Force -ErrorAction SilentlyContinue

# 4. Hard Reset Adapter (Cycle the Link)
Write-Host "Cycling Ethernet adapter (Wait 5 seconds)..."
Disable-NetAdapter -Name $adapter -Confirm:$false -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2
Enable-NetAdapter -Name $adapter -ErrorAction SilentlyContinue
Start-Sleep -Seconds 3

# 5. Check Final Link Speed
$final = Get-NetAdapter -Name $adapter
Write-Host "CURRENT LINK SPEED: $($final.LinkSpeed)" -ForegroundColor Cyan
if ($final.LinkSpeed -eq "100 Mbps") {
    Write-Host "WARNING: Still at 100 Mbps. This is almost certainly a HARDWARE issue." -ForegroundColor Red
    Write-Host "Please CHECK YOUR CABLE. 100 Mbps only needs 4 wires; 1 Gbps+ needs all 8 wires." -ForegroundColor Yellow
}
else {
    Write-Host "SUCCESS! Link speed is now: $($final.LinkSpeed)" -ForegroundColor Green
}

Write-Host "`n--- REPAIR COMPLETE ---"
pause
