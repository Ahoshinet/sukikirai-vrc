Write-Output "Starting project setup..."

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Error "Error: Node.js is not installed. Please install Node.js first."
    exit 1
}
$nodeVersion = node -v
Write-Output "Node.js version: $nodeVersion"

Write-Output "Installing dependencies..."

# Check if pnpm is enabled/installed
if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
    Write-Output "pnpm is not found. Attempting to enable via corepack..."
    try {
        corepack enable pnpm
        Write-Output "Enabled pnpm via corepack."
    } catch {
        Write-Warning "Could not enable pnpm via corepack. Installing via npm..."
        npm install -g pnpm
    }
}

try {
    pnpm install --frozen-lockfile
    if ($LASTEXITCODE -eq 0) {
        Write-Output "Dependencies installed successfully via pnpm."
    } else {
        Write-Warning "pnpm install completed with exit code $LASTEXITCODE"
    }
} catch {
    Write-Error "Error installing dependencies: $_"
    exit 1
}

Write-Output "Verifying Next.js setup..."
try {
    $nextVersion = pnpm list next --depth 0
    if ($nextVersion -match "next") {
        Write-Output "Next.js is installed."
    } else {
        Write-Warning "Next.js might not be installed correctly. Please check package.json."
    }
} catch {
    Write-Warning "Could not verify Next.js installation."
}

Write-Output "Setup complete!"
