# =====================================================================
#  SepsHaness - prepare le ZIP a televerser dans public_html/
#  Usage : powershell -NoProfile -ExecutionPolicy Bypass -File tools/preparer-zip.ps1
#
#  Le ZIP contient uniquement les fichiers du site :
#  pages HTML, robots.txt, sitemap.xml, .htaccess et assets/.
#  Il exclut tools/, docs/, server.mjs, package.json et README.md.
# =====================================================================
$ErrorActionPreference = "Stop"

$racine = Split-Path -Parent $PSScriptRoot
$dossier = Join-Path $racine "dist"
$zip = Join-Path $dossier "site-a-televerser.zip"

New-Item -ItemType Directory -Force -Path $dossier | Out-Null
if (Test-Path $zip) { Remove-Item -LiteralPath $zip -Force }

$fichiers = Get-ChildItem -LiteralPath $racine -File | Where-Object {
  $_.Name -like "*.html" -or $_.Name -in @("robots.txt", "sitemap.xml", ".htaccess")
}

$dossierAssets = Join-Path $racine "assets"
if (-not (Test-Path -LiteralPath $dossierAssets)) { throw "Dossier assets/ introuvable." }

# Construction manuelle : les entrees ZIP doivent utiliser des « / », jamais des « \ »
# (Compress-Archive de Windows PowerShell ecrit des antislashs, illisibles pour
#  l'extracteur de Hostinger).
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$archive = [System.IO.Compression.ZipFile]::Open($zip, [System.IO.Compression.ZipArchiveMode]::Create)
try {
  foreach ($fichier in $fichiers) {
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
      $archive, $fichier.FullName, $fichier.Name,
      [System.IO.Compression.CompressionLevel]::Optimal
    ) | Out-Null
  }
  $assets = Get-ChildItem -LiteralPath $dossierAssets -Recurse -File
  foreach ($fichier in $assets) {
    $relatif = $fichier.FullName.Substring($racine.Length + 1).Replace("\", "/")
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
      $archive, $fichier.FullName, $relatif,
      [System.IO.Compression.CompressionLevel]::Optimal
    ) | Out-Null
  }
} finally {
  $archive.Dispose()
}

$archive = [System.IO.Compression.ZipFile]::OpenRead($zip)
$entrees = $archive.Entries.Count
$aHtaccess = @($archive.Entries | Where-Object { $_.FullName -eq ".htaccess" }).Count -gt 0
$aAssets = @($archive.Entries | Where-Object { $_.FullName -like "assets/*" }).Count
$aAntislash = @($archive.Entries | Where-Object { $_.FullName -like "*\*" }).Count
$archive.Dispose()

$taille = [math]::Round((Get-Item -LiteralPath $zip).Length / 1KB, 1)
if (-not $aHtaccess) { throw "Le .htaccess n'est pas dans le ZIP." }
if ($aAssets -eq 0) { throw "Le dossier assets/ n'est pas dans le ZIP." }
if ($aAntislash -gt 0) { throw "Chemins avec antislash detectes dans le ZIP." }

Write-Host ""
Write-Host "  SepsHaness - archive de mise en ligne"
Write-Host "  $zip"
Write-Host "  $entrees entrees, $aAssets fichiers assets, $taille Ko"
Write-Host "  Televersez ce ZIP dans public_html/, puis utilisez Extraire."
Write-Host ""
