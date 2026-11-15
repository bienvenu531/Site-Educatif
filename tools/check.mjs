/**
 * SepsHaness — vérifications automatiques du projet
 * Usage : node tools/check.mjs
 *
 * Contrôle : structure des pages, fichiers référencés, syntaxe JS,
 * intégrité des données pédagogiques, rendu Markdown et API du Store.
 */
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const erreurs = [];
const avertissements = [];
const ok = [];

function erreur(message) {
  erreurs.push(message);
}
function avertir(message) {
  avertissements.push(message);
}
function valider(condition, message) {
  if (condition) {
    ok.push(message);
    return true;
  }
  erreur(message);
  return false;
}

function lire(cheminRelatif) {
  return readFileSync(path.join(RACINE, cheminRelatif), "utf8");
}

function existe(cheminRelatif) {
  return existsSync(path.join(RACINE, cheminRelatif));
}

/** Retire le paramètre de version d'une URL locale : assets/x.js?v=abc → assets/x.js */
function sansVersion(url) {
  return url.split("?")[0];
}

/** Échappement identique à App.escape, pour retrouver un texte dans le HTML généré. */
function echapperHtml(texte) {
  return String(texte == null ? "" : texte)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const empreintes = new Map();

/** Début du SHA-256 d'un fichier, tel qu'utilisé par tools/versionner.mjs. */
function empreinte(cheminRelatif) {
  if (!empreintes.has(cheminRelatif)) {
    empreintes.set(cheminRelatif, createHash("sha256").update(readFileSync(path.join(RACINE, cheminRelatif))).digest("hex").slice(0, 8));
  }
  return empreintes.get(cheminRelatif);
}

function fichiers(dossier, extensions) {
  const absolu = path.join(RACINE, dossier);
  if (!existsSync(absolu)) return [];
  const sortie = [];
  for (const entree of readdirSync(absolu, { withFileTypes: true })) {
    const relatif = path.posix.join(dossier, entree.name);
    if (entree.isDirectory()) sortie.push(...fichiers(relatif, extensions));
    else if (extensions.some((extension) => entree.name.endsWith(extension))) sortie.push(relatif);
  }
  return sortie;
}

/* -------------------------------------------------------------------------
   1. Pages HTML
   ------------------------------------------------------------------------- */
const PAGES = [
  { fichier: "index.html", page: "accueil", js: "assets/js/accueil.js" },
  { fichier: "parcours.html", page: "parcours", js: "assets/js/parcours.js" },
  { fichier: "cours.html", page: "cours", js: "assets/js/cours.js" },
  { fichier: "bibliotheque.html", page: "bibliotheque", js: "assets/js/bibliotheque.js" },
  { fichier: "lecon.html", page: "lecon", js: "assets/js/lecon.js" },
  { fichier: "espace-travail.html", page: "espace-travail", js: "assets/js/espace-travail.js" },
  { fichier: "suivi.html", page: "suivi", js: "assets/js/suivi.js" },
  { fichier: "profil.html", page: "profil", js: "assets/js/profil.js" }
];

const SCRIPTS_OBLIGATOIRES = [
  "assets/js/markdown.js",
  "assets/js/data/core.js",
  "assets/js/data/cours-stem.js",
  "assets/js/data/cours-lettres.js",
  "assets/js/data/documents-stem.js",
  "assets/js/data/documents-lettres.js",
  "assets/js/data.js",
  "assets/js/store.js",
  "assets/js/app.js"
];

const htmls = [];
for (const page of PAGES) {
  if (!existe(page.fichier)) {
    erreur(`Page manquante : ${page.fichier}`);
    continue;
  }
  htmls.push({ ...page, contenu: lire(page.fichier) });
}

let versionsOk = true;
let referencesVersionnees = 0;

for (const page of htmls) {
  const html = page.contenu;
  const nom = page.fichier;

  if (!/^<!DOCTYPE html>/i.test(html.trim())) erreur(`${nom} : déclaration <!DOCTYPE html> absente`);
  if (!/<html[^>]+lang="fr"/.test(html)) erreur(`${nom} : attribut lang="fr" absent`);
  if (!/<meta[^>]+charset="utf-8"/i.test(html)) erreur(`${nom} : meta charset utf-8 absent`);
  if (!/<meta[^>]+name="viewport"/.test(html)) erreur(`${nom} : meta viewport absent`);
  if (!/<main[^>]+id="contenu"/.test(html)) erreur(`${nom} : <main id="contenu"> absent`);
  if (!/<div[^>]+id="app-header"/.test(html)) erreur(`${nom} : #app-header absent`);
  if (!/<div[^>]+id="app-footer"/.test(html)) erreur(`${nom} : #app-footer absent`);
  if (!new RegExp(`data-page="${page.page}"`).test(html)) erreur(`${nom} : data-page="${page.page}" absent`);

  const h1 = (html.match(/<h1\b/g) || []).length;
  if (h1 !== 1) erreur(`${nom} : ${h1} balise(s) <h1> (une seule attendue)`);
  if (/<title>\s*<\/title>/.test(html)) erreur(`${nom} : <title> vide`);

  // Feuilles de style (les URL versionnées ?v=… sont ramenées au fichier)
  const css = [...html.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)].map((m) => sansVersion(m[1]));
  if (!css.includes("assets/css/base.css")) erreur(`${nom} : base.css non chargée`);
  for (const feuille of css) {
    if (!existe(feuille)) erreur(`${nom} : feuille de style introuvable → ${feuille}`);
  }

  // Scripts : présence, ordre, existence, script de page
  const scripts = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map((m) => sansVersion(m[1]));
  let position = -1;
  let ordreOk = true;
  for (const obligatoire of SCRIPTS_OBLIGATOIRES) {
    const index = scripts.indexOf(obligatoire);
    if (index === -1) {
      erreur(`${nom} : script obligatoire manquant → ${obligatoire}`);
      ordreOk = false;
      continue;
    }
    if (index < position) {
      erreur(`${nom} : ordre des scripts incorrect (${obligatoire})`);
      ordreOk = false;
    }
    position = index;
  }
  if (ordreOk) ok.push(`${nom} : socle de scripts complet et ordonné`);

  if (!scripts.includes(page.js)) erreur(`${nom} : script de page attendu → ${page.js}`);
  for (const script of scripts) {
    if (!existe(script)) erreur(`${nom} : script introuvable → ${script}`);
  }
  if (scripts.some((script) => /^(https?:)?\/\//.test(script))) {
    erreur(`${nom} : script externe détecté (interdit)`);
  }

  // Liens et ressources locales
  for (const correspondance of html.matchAll(/(?:href|src)="([^"#][^"]*)"/g)) {
    const cible = correspondance[1];
    if (/^https?:\/\/(www\.)?bienvenueduc\.com\//i.test(cible)) continue;
    if (/^(https?:|mailto:|tel:|data:|javascript:)/i.test(cible)) {
      if (/^https?:/i.test(cible)) avertir(`${nom} : lien externe → ${cible}`);
      continue;
    }
    const propre = cible.split("?")[0].split("#")[0];
    if (!propre || propre.startsWith("/")) continue;
    if (!existe(propre)) erreur(`${nom} : ressource introuvable → ${cible}`);
  }

  // Versionnement des assets : chaque ?v= doit correspondre au contenu du fichier.
  for (const correspondance of html.matchAll(/(?:src|href)="(\/?assets\/[^"]+)"/g)) {
    const reference = correspondance[1];
    const [chemin, version] = reference.split("?v=");
    const relatif = chemin.replace(/^\//, "");
    if (!version) {
      erreur(`${nom} : ressource non versionnée → ${reference} (lancer npm run versionner)`);
      versionsOk = false;
      continue;
    }
    if (!existe(relatif)) continue;
    const attendue = empreinte(relatif);
    if (version !== attendue) {
      erreur(`${nom} : version obsolète → ${reference} (attendu ?v=${attendue})`);
      versionsOk = false;
      continue;
    }
    referencesVersionnees += 1;
  }

  if (/lorem ipsum/i.test(html)) erreur(`${nom} : texte de remplissage « lorem ipsum »`);
}

if (htmls.length === PAGES.length) ok.push("Les 8 pages attendues sont présentes");
if (versionsOk && referencesVersionnees > 0) ok.push(`Assets versionnés et à jour (${referencesVersionnees} références)`);

/* -------------------------------------------------------------------------
   1 bis. Pages autonomes : mentions légales, confidentialité, CGU, 404
   ------------------------------------------------------------------------- */
const PAGES_AUTONOMES = ["mentions-legales.html", "confidentialite.html", "cgu.html", "404.html"];

for (const nom of PAGES_AUTONOMES) {
  if (!existe(nom)) {
    erreur(`Page autonome manquante : ${nom}`);
    continue;
  }
  const html = lire(nom);
  let valide = true;

  if (!/^<!DOCTYPE html>/i.test(html.trim())) { erreur(`${nom} : déclaration <!DOCTYPE html> absente`); valide = false; }
  if (!/<html[^>]+lang="fr"/.test(html)) { erreur(`${nom} : attribut lang="fr" absent`); valide = false; }
  if (!/<meta[^>]+charset="utf-8"/i.test(html)) { erreur(`${nom} : meta charset utf-8 absent`); valide = false; }
  if (!/<meta[^>]+name="viewport"/.test(html)) { erreur(`${nom} : meta viewport absent`); valide = false; }
  if (!/<main[^>]+id="contenu"/.test(html)) { erreur(`${nom} : <main id="contenu"> absent`); valide = false; }
  if ((html.match(/<h1\b/g) || []).length !== 1) { erreur(`${nom} : une seule balise <h1> attendue`); valide = false; }
  if (/<title>\s*<\/title>/.test(html)) { erreur(`${nom} : <title> vide`); valide = false; }
  if (!/SepsHaness/.test(html)) erreur(`${nom} : le nom « SepsHaness » est absent`);
  if (/lorem ipsum/i.test(html)) erreur(`${nom} : texte de remplissage « lorem ipsum »`);

  for (const correspondance of html.matchAll(/(?:src|href)="(\/?assets\/[^"]+)"/g)) {
    const reference = correspondance[1];
    const [chemin, version] = reference.split("?v=");
    const relatif = chemin.replace(/^\//, "");
    if (!version) { erreur(`${nom} : ressource non versionnée → ${reference}`); versionsOk = false; continue; }
    if (!existe(relatif)) { erreur(`${nom} : ressource introuvable → ${chemin}`); valide = false; continue; }
    if (version !== empreinte(relatif)) { erreur(`${nom} : version obsolète → ${reference}`); versionsOk = false; continue; }
    referencesVersionnees += 1;
  }

  // Liens internes des pages autonomes (les chemins absolus sont ceux de la 404).
  for (const correspondance of html.matchAll(/(?:href|src)="([^"#][^"]*)"/g)) {
    const cible = correspondance[1];
    if (/^(https?:|mailto:|tel:|data:|javascript:)/i.test(cible)) continue;
    if (/^\/?assets\//.test(cible)) continue;
    const chemin = cible.split("?")[0].split("#")[0].replace(/^\//, "") || "index.html";
    if (!existe(chemin)) {
      erreur(`${nom} : lien interne introuvable → ${cible}`);
      valide = false;
    }
  }

  // Servie pour n'importe quelle URL inexistante, la page 404 doit utiliser des chemins absolus.
  if (nom === "404.html") {
    for (const correspondance of html.matchAll(/(?:href|src)="(assets\/[^"]*)"/g)) {
      erreur(`404.html : chemin relatif interdit (la page est servie sous une autre URL) → ${correspondance[1]}`);
      valide = false;
    }
    if (!/<link[^>]+rel="canonical"[^>]+href="https:\/\/bienvenueduc\.com\/404\.html"/.test(html)) {
      avertir("404.html : canonical attendu vers https://bienvenueduc.com/404.html");
    }
  }

  if (valide) ok.push(`${nom} : page autonome conforme`);
}

// Le pied de page de toutes les pages applicatives renvoie vers les pages légales.
const APP_JS = lire("assets/js/app.js");
for (const lien of ["mentions-legales.html", "confidentialite.html", "cgu.html"]) {
  if (!APP_JS.includes(lien)) erreur(`app.js : lien légal absent du pied de page → ${lien}`);
}
if (["mentions-legales.html", "confidentialite.html", "cgu.html"].every((lien) => APP_JS.includes(lien))) {
  ok.push("Pied de page : liens vers les trois pages légales");
}

for (const fichier of ["robots.txt", "sitemap.xml", ".htaccess"]) {
  if (!existe(fichier)) erreur(`Fichier de mise en ligne manquant : ${fichier}`);
}

/* -------------------------------------------------------------------------
   1 ter. SEO et mise en ligne : titres, descriptions, canonical, sitemap
   ------------------------------------------------------------------------- */
const PAGES_SEO = readdirSync(RACINE).filter((fichier) => fichier.endsWith(".html")).sort();
const titres = new Map();
const descriptions = new Map();
let seoOk = true;

for (const nom of PAGES_SEO) {
  const html = lire(nom);

  const titre = ((html.match(/<title>([^<]*)<\/title>/i) || [])[1] || "").trim();
  if (!titre) {
    erreur(`${nom} : <title> absent`);
    seoOk = false;
  } else {
    if (titre.length > 70) avertir(`${nom} : <title> long (${titre.length} caractères) → ${titre}`);
    if (titres.has(titre)) {
      erreur(`${nom} : <title> identique à ${titres.get(titre)}`);
      seoOk = false;
    }
    titres.set(titre, nom);
  }

  const description = ((html.match(/<meta\s+name="description"\s+content="([^"]*)"/i) || [])[1] || "").trim();
  if (!description) {
    erreur(`${nom} : meta description absente`);
    seoOk = false;
  } else {
    if (description.length > 180) avertir(`${nom} : meta description longue (${description.length} caractères)`);
    if (descriptions.has(description)) {
      erreur(`${nom} : meta description identique à ${descriptions.get(description)}`);
      seoOk = false;
    }
    descriptions.set(description, nom);
  }

  // Une page de leçon dépend d'un paramètre ?cours= : pas de canonical statique fiable.
  if (nom !== "lecon.html" && !/<link[^>]+rel="canonical"/i.test(html)) {
    erreur(`${nom} : lien canonical absent`);
    seoOk = false;
  }

  if (nom === "404.html" && !/<meta[^>]+name="robots"[^>]+noindex/i.test(html)) {
    erreur("404.html : meta robots noindex absente");
    seoOk = false;
  }
}

if (seoOk) ok.push(`SEO : ${PAGES_SEO.length} pages, titres et descriptions uniques ; canonical présent (hors leçon)`);

// Sitemap : chaque URL déclarée doit correspondre à un fichier du dépôt.
const SITEMAP = lire("sitemap.xml");
const urlsDeclarees = [...SITEMAP.matchAll(/<loc>([^<]+)<\/loc>/g)].map((correspondance) => correspondance[1].trim());
if (!urlsDeclarees.length) erreur("sitemap.xml : aucune URL déclarée");
for (const url of urlsDeclarees) {
  if (!/^https:\/\/bienvenueduc\.com\//.test(url)) {
    erreur(`sitemap.xml : domaine inattendu → ${url}`);
    continue;
  }
  const chemin = url.replace("https://bienvenueduc.com/", "").split("?")[0].split("#")[0] || "index.html";
  if (!existe(chemin)) erreur(`sitemap.xml : fichier absent du dépôt → ${chemin}`);
}
if (urlsDeclarees.length && !erreurs.some((message) => message.startsWith("sitemap.xml"))) {
  ok.push(`sitemap.xml : ${urlsDeclarees.length} URL valides`);
}

const ROBOTS = lire("robots.txt");
if (!/^Sitemap:\s*https:\/\/bienvenueduc\.com\/sitemap\.xml/m.test(ROBOTS)) {
  erreur("robots.txt : ligne Sitemap absente ou incorrecte");
} else {
  ok.push("robots.txt : sitemap déclaré");
}

const HTACCESS = lire(".htaccess");
for (const motif of ["ErrorDocument 404 /404.html", "Strict-Transport-Security", "RewriteRule ^ https://bienvenueduc.com%{REQUEST_URI} [L,R=301]"]) {
  if (!HTACCESS.includes(motif)) erreur(`.htaccess : règle absente → ${motif}`);
}
if (HTACCESS.includes("ErrorDocument 404 /404.html")) ok.push(".htaccess : page 404, HTTPS et en-têtes configurés");

/* -------------------------------------------------------------------------
   1 quater. Pré-rendu des catalogues
   ------------------------------------------------------------------------- */
for (const [fichier, motif, attendu, libelle] of [
  ["cours.html", /class="carte-cours"/g, 19, "cours"],
  ["bibliotheque.html", /data-doc="/g, 12, "documents"]
]) {
  if (!existe(fichier)) continue;
  const html = lire(fichier);
  if (!html.includes("<!-- prerendu:debut -->") || !html.includes("<!-- prerendu:fin -->")) {
    erreur(`${fichier} : marqueurs de pré-rendu absents (lancer npm run prerendre)`);
    continue;
  }
  const nombre = (html.match(motif) || []).length;
  if (nombre !== attendu) {
    erreur(`${fichier} : ${nombre} ${libelle} pré-rendu(s), ${attendu} attendu(s) (lancer npm run prerendre)`);
  }
}
if (!erreurs.some((message) => message.includes("pré-rendu"))) {
  ok.push("Catalogue pré-rendu : 19 cours et 12 documents présents dans le HTML");
}

/* -------------------------------------------------------------------------
   2. Syntaxe JavaScript
   ------------------------------------------------------------------------- */
const fichiersJs = fichiers("assets/js", [".js"]).sort();
for (const fichier of fichiersJs) {
  const code = lire(fichier);
  try {
    new vm.Script(code, { filename: fichier });
  } catch (syntaxe) {
    erreur(`${fichier} : erreur de syntaxe — ${syntaxe.message}`);
  }
  if (/lorem ipsum/i.test(code)) erreur(`${fichier} : texte de remplissage « lorem ipsum »`);
}
ok.push(`${fichiersJs.length} fichiers JavaScript analysés`);

/* -------------------------------------------------------------------------
   3. Données, Markdown et Store (exécution en bac à sable)
   ------------------------------------------------------------------------- */
const CATALOGUE_COURS = [
  "math-primaire-decimaux",
  "math-college-fractions",
  "math-lycee-fonctions-affines",
  "sci-primaire-etats-matiere",
  "sci-college-cellule",
  "sci-lycee-energie",
  "info-college-algorithmique",
  "info-lycee-python",
  "info-univ-bases-donnees",
  "fra-primaire-lecture",
  "fra-college-analyse-phrase",
  "fra-lycee-dissertation",
  "fra-univ-argumentation",
  "hg-college-revolution",
  "hg-lycee-guerre-froide",
  "philo-lycee-conscience",
  "eco-lycee-marche",
  "eco-univ-microeconomie",
  "ang-college-present-simple"
];

const CATALOGUE_DOCUMENTS = [
  "doc-formulaire-aires-volumes",
  "doc-methode-resoudre-equation",
  "doc-protocole-cellule",
  "doc-formulaire-energie-puissance",
  "doc-memo-algorithmique",
  "doc-annale-sql-qcm",
  "doc-fiche-figures-style",
  "doc-methode-commentaire-texte",
  "doc-methode-dissertation",
  "doc-chronologie-revolution",
  "doc-carte-guerre-froide",
  "doc-notions-conscience"
];

function creerStockage() {
  const memoire = new Map();
  return {
    getItem: (cle) => (memoire.has(cle) ? memoire.get(cle) : null),
    setItem: (cle, valeur) => {
      memoire.set(cle, String(valeur));
    },
    removeItem: (cle) => {
      memoire.delete(cle);
    }
  };
}

const contexte = vm.createContext({
  console,
  JSON,
  Date,
  Math,
  Object,
  Array,
  String,
  Number,
  Boolean,
  RegExp,
  Promise,
  setInterval,
  clearInterval,
  setTimeout,
  clearTimeout
});
contexte.window = contexte;
contexte.localStorage = creerStockage();

const fichiersDonnees = [
  "assets/js/markdown.js",
  "assets/js/data/core.js",
  "assets/js/data/cours-stem.js",
  "assets/js/data/cours-lettres.js",
  "assets/js/data/documents-stem.js",
  "assets/js/data/documents-lettres.js",
  "assets/js/data.js"
];

for (const fichier of fichiersDonnees) {
  if (!existe(fichier)) {
    erreur(`Données : fichier manquant → ${fichier}`);
    continue;
  }
  try {
    vm.runInContext(lire(fichier), contexte, { filename: fichier });
  } catch (execution) {
    erreur(`${fichier} : erreur à l'exécution — ${execution.message}`);
  }
}

const APP = contexte.APP_DATA;
if (!APP) {
  erreur("APP_DATA n'a pas été construite (data.js non exécutable)");
} else {
  if (APP.erreurs && APP.erreurs.length) {
    APP.erreurs.forEach((message) => erreur(`Données : ${message}`));
  }

  const cours = APP.cours || [];
  const documents = APP.documents || [];
  const manquants = CATALOGUE_COURS.filter((slug) => !cours.some((c) => c.slug === slug));
  const superflus = cours.filter((c) => !CATALOGUE_COURS.includes(c.slug)).map((c) => c.slug);
  if (manquants.length) erreur(`Cours manquants (${manquants.length}) : ${manquants.join(", ")}`);
  if (superflus.length) avertir(`Cours hors catalogue : ${superflus.join(", ")}`);
  if (!manquants.length) ok.push(`${cours.length} cours présents, conformes au catalogue`);

  const docsManquants = CATALOGUE_DOCUMENTS.filter((id) => !documents.some((d) => d.id === id));
  if (docsManquants.length) erreur(`Documents manquants (${docsManquants.length}) : ${docsManquants.join(", ")}`);
  if (!docsManquants.length) ok.push(`${documents.length} documents présents, conformes au catalogue`);

  const matieresValides = new Set((APP.matieres || []).map((m) => m.id));
  const niveauxValides = new Set((APP.niveaux || []).map((n) => n.id));
  const typesValides = new Set(["fiche", "methode", "formulaire", "annale", "carte", "protocole"]);
  const typesBlocs = new Set(["p", "liste", "liste-num", "encadre", "exemple", "tableau", "code"]);

  function nombreMots(texte) {
    return String(texte || "")
      .replace(/[#*`>|\-]/g, " ")
      .split(/\s+/)
      .filter(Boolean).length;
  }

  function motsDuCours(c) {
    let total = nombreMots(c.titre) + nombreMots(c.resume);
    (c.objectifs || []).forEach((objectif) => (total += nombreMots(objectif)));
    (c.prerequis || []).forEach((prerequis) => (total += nombreMots(prerequis)));
    (c.sections || []).forEach((section) => {
      total += nombreMots(section.titre);
      (section.blocs || []).forEach((bloc) => {
        total += nombreMots(bloc.texte);
        (bloc.items || []).forEach((item) => (total += nombreMots(item)));
        (bloc.entetes || []).forEach((entete) => (total += nombreMots(entete)));
        (bloc.lignes || []).forEach((ligne) => ligne.forEach((cellule) => (total += nombreMots(cellule))));
      });
    });
    (c.quiz || []).forEach((question) => {
      total += nombreMots(question.question) + nombreMots(question.explication);
      (question.options || []).forEach((option) => (total += nombreMots(option)));
    });
    return total;
  }

  let motsTotal = 0;
  for (const c of cours) {
    const prefixe = `Cours ${c.slug || "?"}`;
    if (!c.slug || !c.titre) erreur(`${prefixe} : slug ou titre manquant`);
    if (!matieresValides.has(c.matiere)) erreur(`${prefixe} : matière invalide « ${c.matiere} »`);
    if (!niveauxValides.has(c.niveau)) erreur(`${prefixe} : niveau invalide « ${c.niveau} »`);
    if (!c.classe) erreur(`${prefixe} : classe manquante`);
    if (!(Number(c.duree) >= 10 && Number(c.duree) <= 180)) erreur(`${prefixe} : durée incohérente (${c.duree})`);
    if (![1, 2, 3].includes(Number(c.difficulte))) erreur(`${prefixe} : difficulté hors 1-3 (${c.difficulte})`);
    if (!c.resume || String(c.resume).length < 40) erreur(`${prefixe} : résumé absent ou trop court`);
    if (!Array.isArray(c.objectifs) || c.objectifs.length < 2) erreur(`${prefixe} : objectifs insuffisants`);
    if (!Array.isArray(c.tags) || c.tags.length < 2) avertir(`${prefixe} : moins de 2 tags`);
    if (!Array.isArray(c.sections) || c.sections.length < 3) {
      erreur(`${prefixe} : moins de 3 sections`);
    } else {
      c.sections.forEach((section, indexSection) => {
        if (!section.titre) erreur(`${prefixe} : section ${indexSection + 1} sans titre`);
        if (!Array.isArray(section.blocs) || !section.blocs.length) {
          erreur(`${prefixe} : section ${indexSection + 1} sans contenu`);
          return;
        }
        motsTotal += nombreMots(section.titre);
        section.blocs.forEach((bloc, indexBloc) => {
          const repere = `${prefixe} §${indexSection + 1}.${indexBloc + 1}`;
          if (!typesBlocs.has(bloc.type)) {
            erreur(`${repere} : type de bloc inconnu « ${bloc.type} »`);
            return;
          }
          if (bloc.type === "p") {
            if (!bloc.texte || nombreMots(bloc.texte) < 8) avertir(`${repere} : paragraphe très court`);
            motsTotal += nombreMots(bloc.texte);
          } else if (bloc.type === "liste" || bloc.type === "liste-num") {
            if (!Array.isArray(bloc.items) || bloc.items.length < 2) erreur(`${repere} : liste incomplète`);
            else bloc.items.forEach((item) => (motsTotal += nombreMots(item)));
          } else if (bloc.type === "encadre" || bloc.type === "exemple") {
            if (!bloc.texte) erreur(`${repere} : ${bloc.type} sans texte`);
            motsTotal += nombreMots(bloc.texte);
          } else if (bloc.type === "tableau") {
            if (!Array.isArray(bloc.entetes) || !Array.isArray(bloc.lignes) || !bloc.lignes.length) {
              erreur(`${repere} : tableau incomplet`);
            } else {
              bloc.lignes.forEach((ligne) => {
                if (ligne.length !== bloc.entetes.length) avertir(`${repere} : ligne de tableau de taille incohérente`);
              });
            }
          } else if (bloc.type === "code") {
            if (!bloc.texte) erreur(`${repere} : bloc de code vide`);
          }
        });
      });
    }
    const mots = motsDuCours(c);
    if (mots < 400) erreur(`${prefixe} : contenu trop court (≈${mots} mots, minimum 400)`);

    if (!Array.isArray(c.quiz) || c.quiz.length < 3) {
      erreur(`${prefixe} : moins de 3 questions de quiz`);
    } else {
      c.quiz.forEach((question, index) => {
        if (!question.question) erreur(`${prefixe} : question ${index + 1} sans intitulé`);
        if (!Array.isArray(question.options) || question.options.length !== 4) {
          erreur(`${prefixe} : question ${index + 1} doit avoir exactement 4 options`);
        }
        if (!Number.isInteger(question.bonne) || question.bonne < 0 || question.bonne > 3) {
          erreur(`${prefixe} : question ${index + 1} — index « bonne » invalide`);
        }
        if (!question.explication || String(question.explication).length < 15) {
          erreur(`${prefixe} : question ${index + 1} sans explication`);
        }
      });
      const indices = c.quiz.map((question) => question.bonne);
      if (indices.length >= 3 && new Set(indices).size < 3) {
        avertir(`${prefixe} : position des bonnes réponses peu variée (${indices.join(", ")})`);
      }
    }

    (c.documents || []).forEach((id) => {
      if (!documents.some((d) => d.id === id)) erreur(`${prefixe} : document lié introuvable « ${id} »`);
    });
  }
  if (cours.length) ok.push(`Contenu des cours vérifié (${cours.length} cours)`);

  const tousLesIndices = cours.flatMap((c) => (c.quiz || []).map((question) => question.bonne));
  if (tousLesIndices.length) {
    const partPremiere = tousLesIndices.filter((index) => index === 0).length / tousLesIndices.length;
    if (partPremiere > 0.4) {
      erreur(
        `Répartition des bonnes réponses déséquilibrée : ${Math.round(partPremiere * 100)} % en première position (maximum 40 %)`
      );
    } else {
      ok.push(
        `Quiz : ${tousLesIndices.length} questions, ${Math.round(partPremiere * 100)} % de bonnes réponses en première position`
      );
    }
  }

  for (const d of documents) {
    const prefixe = `Document ${d.id || "?"}`;
    if (!d.id || !d.titre) erreur(`${prefixe} : id ou titre manquant`);
    if (!typesValides.has(d.type)) erreur(`${prefixe} : type invalide « ${d.type} »`);
    if (!matieresValides.has(d.matiere)) erreur(`${prefixe} : matière invalide`);
    if (!niveauxValides.has(d.niveau)) erreur(`${prefixe} : niveau invalide`);
    if (!d.description || String(d.description).length < 40) erreur(`${prefixe} : description trop courte`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(d.maj))) erreur(`${prefixe} : date de mise à jour invalide`);
    if (!(Number(d.pages) >= 1)) erreur(`${prefixe} : nombre de pages invalide`);
    const lignes = String(d.contenu || "").split("\n").length;
    if (lignes < 35) erreur(`${prefixe} : contenu trop court (${lignes} lignes, minimum 40)`);
    if (!/^##\s+/m.test(String(d.contenu || ""))) erreur(`${prefixe} : contenu sans titre de niveau 2`);
  }
  if (documents.length) ok.push(`Contenu des documents vérifié (${documents.length} documents)`);

  if (!(APP.parcours || []).length) erreur("Aucun parcours défini");
  for (const p of APP.parcours || []) {
    if (!p.titre || !p.niveau) erreur(`Parcours ${p.id || "?"} incomplet`);
    if (!Array.isArray(p.cours) || p.cours.length < 2) erreur(`Parcours ${p.id} : moins de 2 cours`);
    (p.cours || []).forEach((slug) => {
      if (!cours.some((c) => c.slug === slug)) erreur(`Parcours ${p.id} : cours introuvable « ${slug} »`);
    });
  }
  if (APP.parcours && APP.parcours.length) ok.push(`${APP.parcours.length} parcours cohérents`);

  /* ---- Leçons pré-rendues : le contenu doit être dans le HTML ---- */
  const fichiersLecons = cours.map((c) => "lecon-" + encodeURIComponent(c.slug) + ".html");
  const pagesLecons = readdirSync(RACINE).filter((fichier) => /^lecon-.+\.html$/.test(fichier));
  const leconsManquantes = fichiersLecons.filter((fichier) => !existe(fichier));
  const leconsOrphelines = pagesLecons.filter((fichier) => !fichiersLecons.includes(fichier));
  if (leconsManquantes.length) {
    erreur(`Leçons pré-rendues manquantes (${leconsManquantes.length}) : ${leconsManquantes.join(", ")}`);
  }
  if (leconsOrphelines.length) {
    erreur(`Pages de leçon sans cours (${leconsOrphelines.length}) : ${leconsOrphelines.join(", ")}`);
  }

  let leconsValides = 0;
  for (const c of cours) {
    const fichier = "lecon-" + encodeURIComponent(c.slug) + ".html";
    if (!existe(fichier)) continue;
    const html = lire(fichier);
    let valide = true;
    const souci = (message) => {
      erreur(`${fichier} : ${message}`);
      valide = false;
    };

    if (!/^<!DOCTYPE html>/i.test(html.trim())) souci("déclaration <!DOCTYPE html> absente");
    if (!/<html[^>]+lang="fr"/.test(html)) souci('attribut lang="fr" absent');
    if (!/<meta[^>]+charset="utf-8"/i.test(html)) souci("meta charset utf-8 absent");
    if (!/<meta[^>]+name="viewport"/.test(html)) souci("meta viewport absent");
    if (!/<main[^>]+id="contenu"/.test(html)) souci('<main id="contenu"> absent');
    if (!/<div[^>]+id="app-header"/.test(html)) souci("#app-header absent");
    if (!/<div[^>]+id="app-footer"/.test(html)) souci("#app-footer absent");
    if (!/data-page="lecon"/.test(html)) souci('data-page="lecon" absent');
    if (!new RegExp('data-cours="' + c.slug + '"').test(html)) souci(`data-cours="${c.slug}" absent`);
    if ((html.match(/<h1\b/g) || []).length !== 1) souci("une seule balise <h1> attendue");
    if (!/<noscript>/.test(html)) souci("repli <noscript> absent");

    const canonical = `<link rel="canonical" href="https://bienvenueduc.com/${fichier}" />`;
    if (!html.includes(canonical)) souci(`canonical attendu → ${canonical}`);

    // Données structurées Course
    const blocJson = (html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/) || [])[1];
    if (!blocJson) {
      souci("données structurées (JSON-LD) absentes");
    } else {
      try {
        const donnees = JSON.parse(blocJson);
        if (donnees["@type"] !== "Course") souci('JSON-LD : "@type": "Course" attendu');
        if (donnees.name !== c.titre) souci("JSON-LD : name différent du titre du cours");
        if (donnees.url !== `https://bienvenueduc.com/${fichier}`) souci("JSON-LD : url incohérente");
        if (donnees.inLanguage !== "fr") souci('JSON-LD : inLanguage "fr" attendu');
      } catch (lecture) {
        souci(`JSON-LD illisible (${lecture.message})`);
      }
    }

    // Contenu réellement présent sans JavaScript
    const sections = c.sections || [];
    const sectionsRendues = (html.match(/<section class="perso-section"/g) || []).length;
    if (sectionsRendues !== sections.length) souci(`${sectionsRendues} sections rendues pour ${sections.length} attendues`);
    const quiz = c.quiz || [];
    const questionsRendues = (html.match(/<fieldset class="perso-question"/g) || []).length;
    if (questionsRendues !== quiz.length) souci(`${questionsRendues} questions rendues pour ${quiz.length} attendues`);
    const sectionAbsente = sections.find((section) => !html.includes(echapperHtml(section.titre)));
    if (sectionAbsente) souci(`titre de section absent du HTML → ${sectionAbsente.titre}`);
    if (!html.includes(echapperHtml(c.titre))) souci("titre du cours absent du HTML");
    if (/perso-option--bonne/.test(html)) souci("la bonne réponse est révélée dans le HTML statique");

    // Scripts et assets
    const scripts = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map((m) => sansVersion(m[1]));
    for (const obligatoire of SCRIPTS_OBLIGATOIRES) {
      if (!scripts.includes(obligatoire)) souci(`script obligatoire manquant → ${obligatoire}`);
    }
    const positionVue = scripts.indexOf("assets/js/lecon-vue.js");
    const positionLecon = scripts.indexOf("assets/js/lecon.js");
    if (positionVue === -1) souci("script manquant → assets/js/lecon-vue.js");
    else if (positionLecon === -1) souci("script manquant → assets/js/lecon.js");
    else if (positionVue > positionLecon) souci("lecon-vue.js doit précéder lecon.js");
    if (scripts.some((script) => /^(https?:)?\/\//.test(script))) souci("script externe détecté (interdit)");

    for (const correspondance of html.matchAll(/(?:src|href)="(\/?assets\/[^"]+)"/g)) {
      const reference = correspondance[1];
      const [chemin, version] = reference.split("?v=");
      const relatif = chemin.replace(/^\//, "");
      if (!version) souci(`ressource non versionnée → ${reference}`);
      else if (!existe(relatif)) souci(`ressource introuvable → ${chemin}`);
      else if (version !== empreinte(relatif)) souci(`version obsolète → ${reference}`);
    }

    for (const correspondance of html.matchAll(/(?:href|src)="([^"#][^"]*)"/g)) {
      const cible = correspondance[1];
      if (/^https?:\/\/(www\.)?bienvenueduc\.com\//i.test(cible)) continue;
      if (/^(https?:|mailto:|tel:|data:|javascript:)/i.test(cible)) continue;
      const propre = cible.split("?")[0].split("#")[0];
      if (!propre || propre.startsWith("/")) continue;
      if (!existe(propre)) souci(`lien interne introuvable → ${cible}`);
    }

    if (valide) leconsValides += 1;
  }

  if (!leconsManquantes.length && !leconsOrphelines.length && leconsValides === cours.length) {
    ok.push(`${cours.length} leçons pré-rendues conformes (contenu, canonical, JSON-LD, assets)`);
  }

  const leconDynamique = lire("lecon.html");
  if (!/<meta[^>]+name="robots"[^>]+content="noindex/i.test(leconDynamique)) {
    erreur('lecon.html : meta robots « noindex » attendue (page dynamique, doublon des pages pré-rendues)');
  } else {
    ok.push("lecon.html : noindex présent (les pages pré-rendues restent la référence)");
  }

  const scriptsLecon = [...leconDynamique.matchAll(/<script[^>]+src="([^"]+)"/g)].map((m) => sansVersion(m[1]));
  const positionVueLecon = scriptsLecon.indexOf("assets/js/lecon-vue.js");
  if (positionVueLecon === -1) {
    erreur("lecon.html : script manquant → assets/js/lecon-vue.js");
  } else if (positionVueLecon > scriptsLecon.indexOf("assets/js/lecon.js")) {
    erreur("lecon.html : lecon-vue.js doit précéder lecon.js");
  }

  /* ---- Markdown ---- */
  const MD = contexte.MD;
  if (!MD) {
    erreur("markdown.js : MD absent");
  } else {
    const inline = MD.inline("**gras** et *italique* et `code` et ==surligné== et [lien](https://exemple.fr)");
    if (!/<strong>gras<\/strong>/.test(inline)) erreur("MD.inline : gras non converti");
    if (!/<em>italique<\/em>/.test(inline)) erreur("MD.inline : italique non converti");
    if (!/<code>code<\/code>/.test(inline)) erreur("MD.inline : code non converti");
    if (!/<mark>surligné<\/mark>/.test(inline)) erreur("MD.inline : surlignage non converti");
    if (!/<a href="https:\/\/exemple.fr"/.test(inline)) erreur("MD.inline : lien non converti");
    if (!/&lt;script&gt;/.test(MD.inline("<script>alert(1)</script>"))) erreur("MD.inline : HTML non échappé");

    const bloc = MD.block("# Titre\n\n## Sous-titre\n\nUn paragraphe.\n\n- un\n- deux\n\n| A | B |\n|---|---|\n| 1 | 2 |\n\n```js\nconsole.log(1)\n```\n\n> citation");
    if (!/<h2>Titre<\/h2>/.test(bloc)) erreur("MD.block : titre non converti");
    if (!/<ul>/.test(bloc)) erreur("MD.block : liste non convertie");
    if (!/<table>/.test(bloc)) erreur("MD.block : tableau non converti");
    if (!/<pre><code class="langage-js">/.test(bloc)) erreur("MD.block : bloc de code non converti");
    if (!/<blockquote>/.test(bloc)) erreur("MD.block : citation non convertie");
    if (!erreurs.length) ok.push("Moteur Markdown opérationnel");
    if (!erreurs.length) ok.push(`Volume rédactionnel : environ ${Math.round(motsTotal)} mots (hors structure)`);
  }

  /* ---- Store ---- */
  try {
    vm.runInContext(lire("assets/js/store.js"), contexte, { filename: "assets/js/store.js" });
    const Store = contexte.Store;
    if (!Store) {
      erreur("store.js : Store absent");
    } else if (!APP.cours.length) {
      avertir("Tests fonctionnels du Store ignorés : aucune donnée de cours disponible");
    } else {
      const total = APP.cours.length;
      if (Store.progressionGlobale().total !== total) erreur("Store.progressionGlobale : total incorrect");
      if (Store.progressionGlobale().termines !== 0) erreur("Store.progressionGlobale : état initial non vide");

      Store.marquerVue(APP.cours[0].slug);
      if (Store.lecon(APP.cours[0].slug).statut !== "en-cours") erreur("Store.marquerVue : statut non mis à jour");

      Store.marquerTermine(APP.cours[0].slug, { minutes: 20 });
      if (Store.progressionGlobale().termines !== 1) erreur("Store.marquerTermine : progression non mise à jour");
      if (!Store.badgesObtenus().includes("premier-cours")) erreur("Store.badgesObtenus : badge « premier-cours » manquant");

      Store.enregistrerQuiz(APP.cours[0].slug, 3, 4);
      if (Store.quiz(APP.cours[0].slug).meilleurScore !== 75) erreur("Store.enregistrerQuiz : score incorrect");
      Store.enregistrerQuiz(APP.cours[0].slug, 4, 4);
      if (!Store.badgesObtenus().includes("quiz-parfait")) erreur("Store.badgesObtenus : badge « quiz-parfait » manquant");

      Store.journaliserSession({ minutes: 30, matiere: APP.cours[0].matiere, coursSlug: APP.cours[0].slug });
      if (Store.minutesTotales() !== 30) erreur("Store.journaliserSession : minutes non enregistrées");
      if (Store.minutesParJour(7).length !== 7) erreur("Store.minutesParJour : découpage incorrect");
      if (Store.serie() < 1) erreur("Store.serie : série non détectée");

      const note = Store.ajouterNote({ titre: "Note de test", contenu: "Contenu" });
      if (Store.notes().length !== 1) erreur("Store.ajouterNote : note non ajoutée");
      Store.majNote(note.id, { titre: "Note modifiée" });
      if (Store.note(note.id).titre !== "Note modifiée") erreur("Store.majNote : modification perdue");
      Store.supprimerNote(note.id);
      if (Store.notes().length !== 0) erreur("Store.supprimerNote : note non supprimée");

      const tache = Store.ajouterTache({ titre: "Tâche de test", echeance: "2026-12-01", priorite: "haute" });
      Store.basculerTache(tache.id);
      if (!Store.taches()[0].fait) erreur("Store.basculerTache : tâche non cochée");

      const objectif = Store.ajouterObjectif({ titre: "Objectif test", cible: 3 });
      Store.majObjectif(objectif.id, { progression: 3 });
      if (!Store.objectifs()[0].fait) erreur("Store.majObjectif : objectif atteint non marqué");

      const exporte = Store.exportJSON();
      if (!Store.importJSON(exporte)) erreur("Store.importJSON : import refusé");
      if (Store.minutesTotales() !== 30) erreur("Store.importJSON : données perdues");

      Store.majReglages({ theme: "sombre", objectifHebdo: 180 });
      if (Store.reglages().theme !== "sombre" || Store.reglages().objectifHebdo !== 180) {
        erreur("Store.majReglages : réglages non appliqués");
      }

      Store.reset();
      if (Store.progressionGlobale().termines !== 0 || Store.minutesTotales() !== 0) erreur("Store.reset : état non réinitialisé");

      if (!erreurs.some((message) => message.startsWith("Store."))) ok.push("Store : progression, badges, notes, tâches, objectifs, sessions et export vérifiés");
    }
  } catch (execution) {
    erreur(`store.js : erreur à l'exécution — ${execution.message}`);
  }
}

/* -------------------------------------------------------------------------
   4. Cohérence des fichiers / divers
   ------------------------------------------------------------------------- */
for (const fichier of ["assets/css/base.css", "assets/css/accueil.css", "assets/css/catalogue.css", "assets/css/perso.css", "assets/css/legal.css", "assets/img/favicon.svg", "docs/CONTRAT.md", "docs/DEPLOIEMENT.md", "server.mjs", "README.md"]) {
  if (!existe(fichier)) erreur(`Fichier attendu manquant : ${fichier}`);
}

const FICHIERS_OBLIGATOIRES_DATA = [
  "assets/js/data/core.js",
  "assets/js/data.js",
  "assets/js/markdown.js",
  "assets/js/store.js",
  "assets/js/app.js"
];
for (const fichier of FICHIERS_OBLIGATOIRES_DATA) {
  if (!existe(fichier)) erreur(`Fichier du socle manquant : ${fichier}`);
}

// Les données ne doivent pas utiliser de modules ES ni de dépendances externes
for (const fichier of fichiersDonnees) {
  if (!existe(fichier)) continue;
  const code = lire(fichier);
  if (/^\s*import\s/m.test(code) || /\bexport\s+(const|default|function)\b/.test(code)) {
    erreur(`${fichier} : module ES détecté (doit rester un script classique)`);
  }
  if (/\bfetch\s*\(/.test(code)) erreur(`${fichier} : fetch détecté (interdit en file://)`);
}

// Absence de polices ou images distantes
for (const fichier of [...fichiers("assets/css", [".css"]), "index.html"]) {
  if (!existe(fichier)) continue;
  const contenu = lire(fichier);
  if (/@import\s+url\(/i.test(contenu)) erreur(`${fichier} : @import distant détecté`);
  if (/url\(\s*["']?https?:/i.test(contenu)) erreur(`${fichier} : ressource distante détectée`);
}

/* -------------------------------------------------------------------------
   5. Rapport
   ------------------------------------------------------------------------- */
const liseré = "─".repeat(64);
console.log("");
console.log("SepsHaness — vérification du projet");
console.log(liseré);
console.log(`Réussites : ${ok.length}`);
ok.forEach((message) => console.log(`  ✓ ${message}`));

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
  console.log("Résultat : ÉCHEC");
  process.exitCode = 1;
} else {
  console.log("");
  console.log(liseré);
  console.log("Résultat : SUCCÈS — le projet est cohérent.");
}
