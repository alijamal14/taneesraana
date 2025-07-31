param(
    [string]$VersionType = "patch"
)

$SourcePath = "C:\Users\Administrator\source\repos\Websites\MK\TaneesRaana"
$DeployPath = "D:\iis\TaneesRaana"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Dr. Tanees Raana Website Deployment  " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Update version first
Write-Host "1. Updating version ($VersionType)..." -ForegroundColor Green
Set-Location $SourcePath
node update-version.js $VersionType

# Create deployment directory
if (!(Test-Path $DeployPath)) {
    New-Item -ItemType Directory -Path $DeployPath -Force
    Write-Host "Created deployment directory: $DeployPath" -ForegroundColor Yellow
}

Write-Host "2. Copying production files..." -ForegroundColor Green

# Files to deploy (exclude development files)
$FilesToDeploy = @(
    "index.html",
    "styles.css", 
    "script.js",
    "sw.js",
    "version.json"
)

# Copy files
$CopiedFiles = 0
foreach ($file in $FilesToDeploy) {
    $sourcePath = Join-Path $SourcePath $file
    if (Test-Path $sourcePath) {
        Copy-Item $sourcePath $DeployPath -Force
        Write-Host "   ✓ Copied: $file" -ForegroundColor Yellow
        $CopiedFiles++
    } else {
        Write-Host "   ⚠ Missing: $file" -ForegroundColor Red
    }
}

# Copy directories if they exist
$DirsToDeployy = @("images", "icons", "assets")
$CopiedDirs = 0
foreach ($dir in $DirsToDeployy) {
    $srcDir = Join-Path $SourcePath $dir
    $destDir = Join-Path $DeployPath $dir
    if (Test-Path $srcDir) {
        Copy-Item $srcDir $destDir -Recurse -Force
        Write-Host "   ✓ Copied directory: $dir" -ForegroundColor Yellow
        $CopiedDirs++
    }
}

Write-Host ""
Write-Host "3. Deployment Summary:" -ForegroundColor Green
Write-Host "   Files copied: $CopiedFiles" -ForegroundColor White
if ($CopiedDirs -gt 0) {
    Write-Host "   Directories copied: $CopiedDirs" -ForegroundColor White
}
Write-Host "   Deployment path: $DeployPath" -ForegroundColor White
Write-Host ""

# Test if website is accessible
Write-Host "4. Testing website accessibility..." -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri "http://localhost" -Headers @{"Host"="taneesraana.mk313.com"} -UseBasicParsing -TimeoutSec 10
    Write-Host "   ✓ Website is accessible (Status: $($response.StatusCode))" -ForegroundColor Green
    Write-Host "   ✓ Content length: $($response.Content.Length) bytes" -ForegroundColor Green
} catch {
    Write-Host "   ⚠ Website test failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "         DEPLOYMENT COMPLETED!         " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Website URL: http://taneesraana.mk313.com" -ForegroundColor Green
Write-Host "Deployment Path: $DeployPath" -ForegroundColor Yellow
Write-Host "Auto-update feature is active" -ForegroundColor Magenta
Write-Host ""

# Return to original directory
Set-Location $SourcePath
