# =====================================================================
# Vérification qualité du site — bienvenueduc.com
# Exécution :
#   powershell -NoProfile -ExecutionPolicy Bypass -File verifier-site.ps1
#   ... -BaseUrl "https://bienvenueduc.com"
# =====================================================================
param(
  [string]$BaseUrl = "https://bienvenueduc.com"
)

$ErrorActionPreference = "SilentlyContinue"
$ProgressPreference = "SilentlyContinue"

$resultats = New-Object System.Collections.Generic.List[object]

function Ajouter {
  param([string]$Nom, [bool]$Ok, [string]$Detail)
  $resultats.Add([pscustomobject]@{ Controle = $Nom; Ok = $Ok; Detail = $Detail })
}

function Lire-Reponse {
  param($Exception)
  $resp = $Exception.Response
  if (-not $resp) { return @{ Code = 0; Corps = ""; Entetes = @{} } }
  $code = [int]$resp.StatusCode
  $corps = ""
  try { $corps = $Exception.ErrorDetails.Message } catch { }
  if (-not $corps -and $resp.GetResponseStream) {
    try {
      $stream = $resp.GetResponseStream()
      $lecteur = New-Object System.IO.StreamReader($stream)
      $corps = $lecteur.ReadToEnd()
      $lecteur.Close()
    } catch { }
  }
  return @{ Code = $code; Corps = $corps; Entetes = $resp.Headers }
}

function Test-Page {
  param([string]$Nom, [string]$Url, [int]$Attendu = 200, [string]$Contient = "")
  try {
    $r = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 25
    $code = [int]$r.StatusCode
    $corps = [string]$r.Content
  } catch {
    $info = Lire-Reponse $_.Exception
    $code = $info.Code
    $corps = [string]$info.Corps
  }
  $ok = ($code -eq $Attendu)
  $detail = "HTTP $code"
  if ($ok -and $Contient) {
    $ok = $corps -match [regex]::Escape($Contient)
    if ($ok) { $detail += " + contenu attendu" } else { $detail += " ; contenu « $Contient » absent" }
  }
  Ajouter $Nom $ok $detail
}

function Test-Redirection {
  param([string]$Nom, [string]$Url, [string]$Cible)
  try {
    $r = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 20 -MaximumRedirection 0
    $code = [int]$r.StatusCode
    $loc = [string]$r.Headers["Location"]
  } catch {
    $info = Lire-Reponse $_.Exception
    $code = $info.Code
    $loc = [string]$info.Entetes["Location"]
  }
  $ok = ($code -ge 300 -and $code -lt 400) -and ($loc -match [regex]::Escape($Cible))
  Ajouter $Nom $ok ("HTTP {0} -> {1}" -f $code, $loc)
}

function Test-Entetes {
  param([string]$Nom, [string]$Url, [string[]]$Presents, [string[]]$Absents)
  try {
    $r = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 25
    $manquants = @()
    foreach ($h in $Presents) { if (-not $r.Headers[$h]) { $manquants += $h } }
    $restants = @()
    foreach ($h in $Absents) { if ($r.Headers[$h]) { $restants += $h } }
    $ok = ($manquants.Count -eq 0) -and ($restants.Count -eq 0)
    $detail = "HTTP $($r.StatusCode)"
    if ($manquants.Count) { $detail += " ; manquants : " + ($manquants -join ", ") }
    if ($restants.Count) { $detail += " ; à retirer : " + ($restants -join ", ") }
    if ($ok) { $detail += " ; tous présents" }
    Ajouter $Nom $ok $detail
  } catch {
    Ajouter $Nom $false "injoignable"
  }
}

Write-Host "Vérification de $BaseUrl" -ForegroundColor Cyan
Write-Host ("-" * 64)

Test-Page "Accueil accessible" "$BaseUrl/" 200
Test-Redirection "HTTP redirige vers HTTPS" "http://bienvenueduc.com/" "https://"
Test-Redirection "www redirige vers le domaine" "https://www.bienvenueduc.com/" "bienvenueduc.com"

Test-Page "Mentions légales" "$BaseUrl/mentions-legales.html" 200 "Mentions légales"
Test-Page "Politique de confidentialité" "$BaseUrl/confidentialite.html" 200 "confidentialité"
Test-Page "Conditions d’utilisation" "$BaseUrl/cgu.html" 200 "Conditions"
Test-Page "robots.txt" "$BaseUrl/robots.txt" 200 "Sitemap"
Test-Page "sitemap.xml" "$BaseUrl/sitemap.xml" 200 "<urlset"
Test-Page "Page 404 personnalisée" "$BaseUrl/page-qui-nexiste-pas" 404 "introuvable"

Test-Entetes "En-têtes de sécurité" "$BaseUrl/" `
  @("Strict-Transport-Security", "X-Content-Type-Options", "Referrer-Policy", "X-Frame-Options") `
  @("X-Powered-By")

Test-Page "app.js : liens légaux" "$BaseUrl/assets/js/app.js" 200 "mentions-legales.html"
Test-Page "auth.js : consentement" "$BaseUrl/assets/js/auth.js" 200 "register-consent"

try {
  $r = Invoke-WebRequest -Uri "$BaseUrl/api/data.php" -UseBasicParsing -TimeoutSec 30 -Headers @{ Accept = "application/json" }
  $j = $r.Content | ConvertFrom-Json
  $nb = @($j.cours).Count
  Ajouter "API de contenu" ($r.StatusCode -eq 200 -and $nb -ge 1) "$nb cours servis"
} catch {
  Ajouter "API de contenu" $false "injoignable"
}

$resultats | ForEach-Object {
  $puce = if ($_.Ok) { "[ OK ]" } else { "[FAIL]" }
  $couleur = if ($_.Ok) { "Green" } else { "Red" }
  Write-Host ("{0} {1,-36} {2}" -f $puce, $_.Controle, $_.Detail) -ForegroundColor $couleur
}

$total = $resultats.Count
$reussis = ($resultats | Where-Object { $_.Ok }).Count
Write-Host ("-" * 64)
$couleur = if ($reussis -eq $total) { "Green" } else { "Yellow" }
Write-Host ("Résultat : {0}/{1} contrôles réussis" -f $reussis, $total) -ForegroundColor $couleur
if ($reussis -lt $total) { exit 1 } else { exit 0 }
