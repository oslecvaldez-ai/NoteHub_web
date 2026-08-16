param (
    [string]$Path = "src/modules/notas"
)

if (-not (Test-Path $Path)) {
    Write-Host "La ruta '$Path' no existe." -ForegroundColor Red
    exit
}

$cleanName = ($Path -replace '[\\/]', '_').Trim('_')
$outputFile = "CONSOLIDADO_$cleanName.txt"

Write-Host "Empaquetando archivos de '$Path' en $outputFile..." -ForegroundColor Cyan

Get-ChildItem -Path $Path -Recurse -File -Include *.ts,*.tsx,*.js,*.jsx,*.css,*.json | ForEach-Object {
    "========================================`nFILE: $($_.FullName.Replace((Get-Location).Path, ''))`n========================================`n"
    Get-Content $_.FullName -Raw
    "`n`n"
} | Out-File -Encoding utf8 $outputFile

Write-Host "¡Listo! Archivo generado: $outputFile" -ForegroundColor Green