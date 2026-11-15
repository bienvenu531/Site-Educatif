/**
 * SepsHaness — vérification du site en production
 * Usage : node tools/verifier-prod.mjs
 *         node tools/verifier-prod.mjs --base https://bienvenueduc.com
 *
 * Contrôle, après mise en ligne :
 *  - la disponibilité des pages (y compris légales et 404) ;
 *  - la page 404 personnalisée réellement servie pour une URL inconnue ;
 *  - robots.txt, sitemap.xml et les URL qu'il déclare ;
 *  - les en-têtes de sécurité et l'absence de X-Powered-By ;
 *  - la redirection www → sans www ;
 *  - la fraîcheur des assets : le CDN et l'origine servent-ils bien les
 *    fichiers du dépôt (comparaison SHA-256) ?
 *
 * Sortie : code 1 si une erreur est détectée, 0 sinon.
 */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const arguments_ = process.argv.slice(2);
function option(nom, defaut) {
  const index = arguments_.indexOf(nom);
  return index !== -1 && arguments_[index + 1] ? arguments_[index + 1] : defaut;
}

const BASE = option("--base", process.env.BASE_URL || "https://bienvenueduc.com").replace(/\/$/, "");
const APEX = new URL(BASE).hostname.replace(/^www\./, "");

const resultats = [];
const erreurs = [];
const avertissements = [];

function ok(message) {
  resultats.push(message);
}
function erreur(message) {
  erreurs.push(message);
}
function avertir(message) {
  avertissements.push(message);
}

async function requete(url, options = {}) {
  const controleur = new AbortController();
  const minuterie = setTimeout(() => controleur.abort(), options.delai || 20000);
  try {
    const reponse = await fetch(url, {
      redirect: options.redirect || "follow",
      signal: controleur.signal,
      headers: { "user-agent": "SepsHaness-verificateur/1.0" }
    });
    const corps = options.binaire ? Buffer.from(await reponse.arrayBuffer()) : await reponse.text();
    return { statut: reponse.status, entetes: reponse.headers, corps, url: reponse.url };
  } finally {
    clearTimeout(minuterie);
  }
}

function estSucces(statut) {
  return statut >= 200 && statut < 300;
}

function empreinte(buffer) {
  return createHash("sha256").update(buffer).digest("hex").slice(0, 8);
}

function local(chemin) {
  return readFileSync(path.join(RACINE, chemin));
}

/* -------------------------------------------------------------------------
   1. Pages
   ------------------------------------------------------------------------- */
const PAGES = [
  "/",
  "/parcours.html",
  "/cours.html",
  "/bibliotheque.html",
  "/lecon.html?cours=math-college-fractions",
  "/lecon-math-college-fractions.html",
  "/espace-travail.html",
  "/suivi.html",
  "/profil.html",
  "/mentions-legales.html",
  "/confidentialite.html",
  "/cgu.html",
  "/404.html"
];

console.log("");
console.log(`  SepsHaness — vérification de ${BASE}`);
console.log("  " + "─".repeat(68));

for (const page of PAGES) {
  try {
    const reponse = await requete(BASE + page);
    if (estSucces(reponse.statut) && /SepsHaness/.test(reponse.corps)) {
      ok(`${page} → ${reponse.statut}`);
    } else if (estSucces(reponse.statut)) {
      erreur(`${page} → ${reponse.statut} mais la marque SepsHaness est absente`);
    } else {
      erreur(`${page} → ${reponse.statut}`);
    }
  } catch (probleme) {
    erreur(`${page} → ${probleme.name === "AbortError" ? "délai dépassé" : probleme.message}`);
  }
}

/* -------------------------------------------------------------------------
   2. Page 404 personnalisée
   ------------------------------------------------------------------------- */
try {
  const inconnue = `/__verification-inexistante-${Date.now()}.html`;
  const reponse = await requete(BASE + inconnue);
  if (reponse.statut !== 404) {
    erreur(`${inconnue} → ${reponse.statut} (404 attendu)`);
  } else if (!/Page introuvable/i.test(reponse.corps)) {
    erreur("URL inconnue → 404, mais la page personnalisée n'est pas servie");
  } else {
    ok("URL inconnue → 404 avec la page personnalisée");
  }
} catch (probleme) {
  erreur(`Test 404 : ${probleme.message}`);
}

/* -------------------------------------------------------------------------
   3. robots.txt et sitemap.xml
   ------------------------------------------------------------------------- */
try {
  const robots = await requete(`${BASE}/robots.txt`);
  if (!estSucces(robots.statut)) erreur(`robots.txt → ${robots.statut}`);
  else if (!robots.corps.includes(`${BASE}/sitemap.xml`)) erreur("robots.txt : l'URL du sitemap est absente");
  else ok("robots.txt → 200 avec le sitemap");
} catch (probleme) {
  erreur(`robots.txt : ${probleme.message}`);
}

const urlsSitemap = [];
try {
  const sitemap = await requete(`${BASE}/sitemap.xml`);
  if (!estSucces(sitemap.statut)) {
    erreur(`sitemap.xml → ${sitemap.statut}`);
  } else {
    for (const correspondance of sitemap.corps.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      urlsSitemap.push(correspondance[1].trim());
    }
    if (!urlsSitemap.length) erreur("sitemap.xml : aucune URL déclarée");
    else ok(`sitemap.xml → 200 (${urlsSitemap.length} URL)`);
  }
} catch (probleme) {
  erreur(`sitemap.xml : ${probleme.message}`);
}

for (const url of urlsSitemap) {
  try {
    const reponse = await requete(url);
    if (!estSucces(reponse.statut)) erreur(`sitemap : ${url} → ${reponse.statut}`);
  } catch (probleme) {
    erreur(`sitemap : ${url} → ${probleme.message}`);
  }
}

/* -------------------------------------------------------------------------
   4. En-têtes de sécurité
   ------------------------------------------------------------------------- */
try {
  const accueil = await requete(`${BASE}/`);
  const attendus = [
    ["strict-transport-security", "Strict-Transport-Security (HSTS)"],
    ["x-content-type-options", "X-Content-Type-Options"],
    ["referrer-policy", "Referrer-Policy"],
    ["x-frame-options", "X-Frame-Options"],
    ["permissions-policy", "Permissions-Policy"]
  ];
  for (const [entete, libelle] of attendus) {
    if (accueil.entetes.get(entete)) ok(`En-tête ${libelle} présent`);
    else erreur(`En-tête ${libelle} absent`);
  }
  if (accueil.entetes.get("x-powered-by")) erreur(`X-Powered-By exposé (${accueil.entetes.get("x-powered-by")})`);
  else ok("X-Powered-By absent");
  if (!/text\/html/i.test(accueil.entetes.get("content-type") || "")) erreur("Content-Type de l'accueil incorrect");
} catch (probleme) {
  erreur(`En-têtes : ${probleme.message}`);
}

/* -------------------------------------------------------------------------
   5. Redirection www → sans www
   ------------------------------------------------------------------------- */
try {
  const reponse = await requete(`https://www.${APEX}/`, { redirect: "manual" });
  const destination = reponse.entetes.get("location") || "";
  if ([301, 302, 307, 308].includes(reponse.statut) && destination.includes(APEX) && !destination.includes(`www.${APEX}`)) {
    ok(`www.${APEX} → ${reponse.statut} vers ${destination}`);
  } else if (reponse.statut === 200) {
    erreur(`www.${APEX} répond 200 : aucune redirection (contenu dupliqué)`);
  } else {
    erreur(`www.${APEX} → ${reponse.statut} (redirection 301 attendue)`);
  }
} catch (probleme) {
  erreur(`Redirection www : ${probleme.message}`);
}

/* -------------------------------------------------------------------------
   6. Fraîcheur des assets (le point qui casse le site après déploiement)
   ------------------------------------------------------------------------- */
try {
  const accueil = await requete(`${BASE}/`);
  const references = [];
  for (const correspondance of accueil.corps.matchAll(/(?:src|href)="(assets\/[^"]+)"/g)) {
    references.push(correspondance[1]);
  }

  let comparees = 0;
  for (const reference of references) {
    const [chemin, version] = reference.split("?v=");
    if (!version) {
      erreur(`Asset non versionné dans le HTML : ${reference}`);
      continue;
    }
    let fichierLocal;
    try {
      fichierLocal = local(chemin.replace(/^\//, ""));
    } catch {
      avertir(`Asset absent du dépôt local : ${chemin}`);
      continue;
    }
    const attendue = empreinte(fichierLocal);
    if (version !== attendue) {
      erreur(`HTML : ${chemin} référence ?v=${version}, le dépôt contient ?v=${attendue}`);
      continue;
    }

    const gabarit = `${BASE}/${chemin.replace(/^\//, "")}`;
    // a) Contenu réellement déployé à l'origine (paramètre anti-cache).
    let origine;
    try {
      origine = await requete(`${gabarit}?v=${version}&cb=${Date.now()}`, { binaire: true });
    } catch (probleme) {
      erreur(`Origine inaccessible : ${chemin} (${probleme.message})`);
      continue;
    }
    if (!estSucces(origine.statut)) {
      erreur(`Origine : ${chemin} → ${origine.statut}`);
      continue;
    }
    if (empreinte(origine.corps) !== attendue) {
      erreur(`Origine : ${chemin} ne correspond pas au dépôt (déploiement incomplet ?)`);
      continue;
    }

    // b) Contenu servi par le CDN sur l'URL normale.
    let servi;
    try {
      servi = await requete(`${gabarit}?v=${version}`, { binaire: true });
    } catch (probleme) {
      erreur(`CDN inaccessible : ${chemin} (${probleme.message})`);
      continue;
    }
    if (!estSucces(servi.statut)) {
      erreur(`CDN : ${chemin} → ${servi.statut}`);
      continue;
    }
    if (empreinte(servi.corps) !== attendue) {
      avertir(`CDN : ${chemin} est périmé (${empreinte(servi.corps)} au lieu de ${attendue}) → vider le cache Hostinger`);
      continue;
    }
    comparees += 1;
  }

  if (comparees === references.length && references.length) {
    ok(`Assets : ${comparees} fichier(s) versionné(s), identiques au dépôt, servis à jour`);
  }
} catch (probleme) {
  erreur(`Contrôle des assets : ${probleme.message}`);
}

/* -------------------------------------------------------------------------
   7. Contrôle de marque (l'ancienne coquille « Excellence » ne doit plus sortir)
   ------------------------------------------------------------------------- */
try {
  // On contrôle l'URL réellement chargée par les pages (avec ?v=…), pas
  // l'ancienne URL non versionnée qui peut rester en cache CDN sans être utilisée.
  const accueil = await requete(`${BASE}/`);
  const reference = (accueil.corps.match(/src="(assets\/js\/app\.js[^"]*)"/) || [])[1];
  const url = reference ? `${BASE}/${reference}` : `${BASE}/assets/js/app.js?cb=${Date.now()}`;
  const script = await requete(url, { binaire: true });
  const texte = script.corps.toString("utf8");

  if (!estSucces(script.statut)) {
    erreur(`app.js → ${script.statut}`);
  } else if (/Excellence/.test(texte)) {
    erreur(`app.js servi (${reference || "URL directe"}) contient encore « Excellence » : cache périmé`);
  } else if (!/SepsHaness/.test(texte)) {
    erreur("app.js servi ne contient pas « SepsHaness »");
  } else {
    ok(`app.js servi : coquille SepsHaness à jour (${reference || "URL directe"})`);
  }

  // L'ancienne URL non versionnée peut rester en cache : information seulement,
  // les pages ne l'utilisent plus.
  if (reference) {
    try {
      const brut = await requete(`${BASE}/assets/js/app.js`, { binaire: true });
      if (estSucces(brut.statut) && /Excellence/.test(brut.corps.toString("utf8"))) {
        avertir("L'URL non versionnée /assets/js/app.js est encore en cache (sans effet : les pages chargent ?v=…). Une purge la rafraîchira.");
      }
    } catch {
      /* ignoré */
    }
  }
} catch (probleme) {
  erreur(`app.js : ${probleme.message}`);
}

/* -------------------------------------------------------------------------
   8. Rapport
   ------------------------------------------------------------------------- */
const liseré = "─".repeat(68);
console.log(liseré);
console.log(`Réussites : ${resultats.length}`);
resultats.forEach((message) => console.log(`  ✓ ${message}`));

if (avertissements.length) {
  console.log("");
  console.log(`Avertissements : ${avertissements.length}`);
  avertissements.forEach((message) => console.log(`  ! ${message}`));
}

if (erreurs.length) {
  console.log("");
  console.log(`Erreurs : ${erreurs.length}`);
  erreurs.forEach((message) => console.log(`  ✗ ${message}`));
  console.log(liseré);
  console.log("Résultat : ÉCHEC — voir docs/DEPLOIEMENT.md");
  process.exitCode = 1;
} else {
  console.log("");
  console.log(liseré);
  console.log("Résultat : SUCCÈS — le site en ligne est à jour.");
}
