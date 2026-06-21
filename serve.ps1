# Serve the current folder on port 8000.
# Tries Python, Python3, npx http-server, and falls back to built-in PowerShell server.
$port = 8000

$hasPython = $false
if (Get-Command python -ErrorAction SilentlyContinue) {
    # Test if Python is actually installed and not just the Microsoft Store shortcut
    $null = python -c "import sys" 2>&1
    if ($LASTEXITCODE -eq 0) {
        $hasPython = $true
    }
}

if ($hasPython) {
    Write-Host "Starting Python HTTP server on port $port..." -ForegroundColor Green
    python -m http.server $port
    exit $?
}

$hasPython3 = $false
if (Get-Command python3 -ErrorAction SilentlyContinue) {
    $null = python3 -c "import sys" 2>&1
    if ($LASTEXITCODE -eq 0) {
        $hasPython3 = $true
    }
}

if ($hasPython3) {
    Write-Host "Starting Python3 HTTP server on port $port..." -ForegroundColor Green
    python3 -m http.server $port
    exit $?
}

if (Get-Command npx -ErrorAction SilentlyContinue) {
    Write-Host "Starting http-server via npx on port $port..." -ForegroundColor Green
    npx http-server -p $port
    exit $?
}

# Fallback: Built-in PowerShell HTTP server
Write-Host "No Python or Node.js found. Starting built-in PowerShell HTTP server on port $port..." -ForegroundColor Yellow
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
try {
    $listener.Start()
    Write-Host "Server started successfully." -ForegroundColor Green
    Write-Host "Open your browser at: http://localhost:$port/" -ForegroundColor Cyan
    Write-Host "Press Ctrl+C to stop the server." -ForegroundColor Yellow
    
    $baseDir = (Get-Location).Path
    
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $urlPath = $request.Url.LocalPath
        if ($urlPath -eq "/") { $urlPath = "/index.html" }
        $decodedPath = [System.Uri]::UnescapeDataString($urlPath)
        $filePath = Join-Path $baseDir $decodedPath.TrimStart('/')
        
        # Security: Prevent directory traversal
        $fullPath = [System.IO.Path]::GetFullPath($filePath)
        if (-not $fullPath.StartsWith($baseDir, [System.StringComparison]::OrdinalIgnoreCase)) {
            $response.StatusCode = 403
            $bytes = [System.Text.Encoding]::UTF8.GetBytes("403 Forbidden")
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        }
        elseif (Test-Path $filePath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $extension = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = switch ($extension) {
                ".html" { "text/html; charset=utf-8" }
                ".htm"  { "text/html; charset=utf-8" }
                ".css"  { "text/css; charset=utf-8" }
                ".js"   { "application/javascript; charset=utf-8" }
                ".png"  { "image/png" }
                ".jpg"  { "image/jpeg" }
                ".jpeg" { "image/jpeg" }
                ".gif"  { "image/gif" }
                ".svg"  { "image/svg+xml" }
                ".pdf"  { "application/pdf" }
                ".json" { "application/json; charset=utf-8" }
                default { "application/octet-stream" }
            }
            $response.ContentType = $contentType
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $bytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $decodedPath")
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        }
        $response.Close()
    }
} catch {
    Write-Host "Error starting/running server: $_" -ForegroundColor Red
} finally {
    if ($null -ne $listener) {
        $listener.Stop()
    }
}

