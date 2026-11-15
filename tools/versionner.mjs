/**
 * SepsHaness — versionnement des assets
 * Usage : node tools/versionner.mjs
 *
 * Ajoute (ou met à jour) un paramètre ?v=<empreinte> à chaque référence
 * `assets/...` des pages HTML : feuilles de style, scripts, favicon.
 * L'empreinte est le début du SHA-256 du fichier : dès qu'un asset change,
 * son URL change, ce qui rend le cache long du CDN et des navigateurs sûr.
 *
 * Le script est idempotent : relancé sans modification, il n'écrit rien.
 * À lancer avant chaque mise en ligne (voir docs/DEPLOIEMENT.md).
 */
import { createHash } from "node:crypto";
import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** src="assets/..." ou href="/assets/..." — la version existante est remplacée. */
const MOTIF = /((?:src|href)\s*=\s*")(\/?assets\/[^"?#]+)(?:\?v=[a-f0-9]+)?(")/g;

const pages = (await readdir(RACINE, { withFileTypes: true }))
  .filter((entree) => entree.isFile() && entree.name.endsWith(".html"))
  .map((entree) => entree.name)
  .sort();

const empreintes = new Map();
const manquants = new Set();

async function empreinte(cheminRelatif) {
  if (!empreintes.has(cheminRelatif)) {
    try {
      const contenu = await readFile(path.join(RACINE, cheminRelatif));
      empreintes.set(cheminRelatif, createHash("sha256").update(contenu).digest("hex").slice(0, 8));
    } catch {
      manquants.add(cheminRelatif);
      empreintes.set(cheminRelatif, null);
    }
  }
  return empreintes.get(cheminRelatif);
}

console.log("");
console.log("  SepsHaness — versionnement des assets");
console.log("  " + "─".repeat(66));

let pagesModifiees = 0;
let referencesTotal = 0;

for (const page of pages) {
  const fichier = path.join(RACINE, page);
  const html = await readFile(fichier, "utf8");

  const versions = new Map();
  let references = 0;

  for (const correspondance of html.matchAll(MOTIF)) {
    const url = correspondance[2];
    const chemin = url.replace(/^\//, "");
    references += 1;
    const valeur = await empreinte(chemin);
    if (valeur) versions.set(url, valeur);
  }

  referencesTotal += references;

  const resultat = html.replace(MOTIF, (tout, avant, url, apres) => {
    const valeur = versions.get(url);
    return valeur ? avant + url + "?v=" + valeur + apres : tout;
  });

  if (resultat !== html) {
    await writeFile(fichier, resultat, "utf8");
    pagesModifiees += 1;
    const nombre = [...resultat.matchAll(MOTIF)].length;
    console.log(`  ✓ ${page.padEnd(24)} ${nombre} référence(s) versionnée(s)`);
  } else {
    console.log(`  · ${page.padEnd(24)} déjà à jour`);
  }
}

console.log("  " + "─".repeat(66));

if (manquants.size) {
  console.error("  ✗ Fichier(s) référencé(s) mais introuvable(s) :");
  [...manquants].sort().forEach((chemin) => console.error("      " + chemin));
  process.exitCode = 1;
} else {
  console.log(`  ${pages.length} page(s), ${referencesTotal} référence(s), ${pagesModifiees} page(s) modifiée(s).`);
  console.log(pagesModifiees === 0 ? "  Aucun changement." : "  Terminé. Pensez à relancer le contrôle : npm test");
}
console.log("");
