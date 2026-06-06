# Run this script to open the CulinaryDay AI preview in your default web browser
$previewPath = Join-Path $pwd.Path "preview.html"
if (Test-Path $previewPath) {
    Write-Host "Opening CulinaryDay AI Preview in your default browser..." -ForegroundColor Green
    Start-Process $previewPath
} else {
    Write-Error "Could not find preview.html. Please ensure you run this script from the project root directory."
}
