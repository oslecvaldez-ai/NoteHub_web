param (
    [switch]$ToFile
)

$items = Get-ChildItem -Recurse -Depth 4 | Where-Object { 
    $_.FullName -notmatch 'node_modules|dist|dist-electron|\.git' 
} | Resolve-Path -Relative

if ($ToFile) {
    $items | Out-File -Encoding utf8 "ESTRUCTURA_PROYECTO.txt"
    Write-Host "Estructura guardada en ESTRUCTURA_PROYECTO.txt" -ForegroundColor Green
} else {
    $items
}