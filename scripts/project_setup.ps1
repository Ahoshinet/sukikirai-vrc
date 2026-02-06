Write-Host "Starting project setup..." -ForegroundColor Cyan

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Error: Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    exit 1
}
$nodeVersion = node -v
Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green

Write-Host "Installing dependencies..." -ForegroundColor Cyan

if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
    Write-Host "pnpm is not installed. Installing via npm..." -ForegroundColor Manager
    npm install -g pnpm
}

try {
    pnpm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Dependencies installed successfully via pnpm." -ForegroundColor Green
    } else {
        Write-Host "Warning: pnpm install completed with exit code $LASTEXITCODE" -ForegroundColor Yellow
    }
} catch {
    Write-Host "Error installing dependencies: $_" -ForegroundColor Red
    exit 1
}

Write-Host "Verifying Next.js setup..." -ForegroundColor Cyan
if (Test-Path "node_modules/next") {
    Write-Host "Next.js is installed in node_modules." -ForegroundColor Green
} else {
    Write-Host "Warning: Next.js was not found in node_modules. Please check package.json." -ForegroundColor Yellow
}

Write-Host "Setup complete!" -ForegroundColor Cyan
