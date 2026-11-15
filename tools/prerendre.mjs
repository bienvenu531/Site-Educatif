/**
 * SepsHaness — pré-rendu statique des catalogues
 * Usage : node tools/prerendre.mjs            (écrit le HTML)
 *         node tools/prerendre.mjs --verifier (contrôle sans écrire)
 *
 * Le site reste 100 % statique et sans build : ce script ne fait que figer
 * dans cours.html et bibliotheque.html les cartes générées à partir de
 * assets/js/data/*.js. Les robots et les navigateurs sans JavaScript voient
 * ainsi le catalogue complet ; le JavaScript remplace ensuite ce contenu par
 * les cartes interactives (filtres, progression, lecteur).
 *
 * Les fichiers concernés contiennent des marqueurs :
 *   <!-- prerendu:debut --> … <!-- prerendu:fin -->
 * Ne modifiez pas le contenu entre ces marqueurs à la main.
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const VERIFIER = process.argv.includes("--verifier");

/* -------------------------------------------------------------------------
   Chargement des données et de app.js dans un contexte minimal
   ------------------------------------------------------------------------- */
const contexte = {
  console,
  window: null,
  navigator: {},
  location: { search: "" },
  setTimeout,
  clearTimeout,
  localStorage: {
    getItem() {
      return null;
    },
    setItem() {},
    removeItem() {}
  },
  document: {
    readyState: "loading",
    addEventListener() {},
    removeEventListener() {},
    querySelector() {
      return null;
    },
    querySelectorAll() {
      return [];
    },
    createElement() {
      return { style: {}, setAttribute() {}, appendChild() {}, classList: { add() {}, remove() {} } };
    },
    documentElement: {
      getAttribute() {
        return null;
      },
      setAttribute() {},
      style: {},
      classList: { add() {}, remove() {} }
    },
    body: {
      getAttribute() {
        return "";
      }
    }
  }
};
contexte.window = contexte;
vm.createContext(contexte);

const FICHIERS = [
  "assets/js/data/core.js",
  "assets/js/data/cours-stem.js",
  "assets/js/data/cours-lettres.js",
  "assets/js/data/documents-stem.js",
  "assets/js/data/documents-lettres.js",
  "assets/js/data.js",
  "assets/js/app.js"
];

try {
  for (const fichier of FICHIERS) {
    vm.runInContext(readFileSync(path.join(RACINE, fichier), "utf8"), contexte, { filename: fichier });
  }
} catch (erreur) {
  console.error(`Impossible de charger les données : ${erreur.message}`);
  process.exit(1);
}

const APP = contexte.App;
const DATA = contexte.APP_DATA;

if (!APP || !DATA || !Array.isArray(DATA.cours) || !Array.isArray(DATA.documents)) {
  console.error("APP_DATA ou App introuvable après chargement des scripts.");
  process.exit(1);
}

/* -------------------------------------------------------------------------
   Génération des cartes
   ------------------------------------------------------------------------- */
const cartesCours = DATA.cours.map((cours) => APP.carteCours(cours)).join("\n");

function carteDocument(doc) {
  const type = DATA.typeDocument(doc.type);
  const matiere = DATA.matiere(doc.matiere);
  const niveau = DATA.niveau(doc.niveau);
  const pages = Number(doc.pages) || 0;
  const identite = [matiere.nom, niveau.nom, doc.classe].filter(Boolean).join(" · ");
  const pucePages = pages ? `<span class="puce">${pages} page${pages > 1 ? "s" : ""}</span>` : "";

  return (
    `<article class="carte" data-teinte="${APP.escape(type.teinte)}" data-doc="${APP.escape(doc.id)}">` +
    '<div class="carte__entete">' +
    `<span class="carte__icone" aria-hidden="true">${APP.icon(type.icone, { taille: 22 })}</span>` +
    `<span class="etiquette">${APP.escape(type.nom)}</span>` +
    "</div>" +
    `<h3 class="carte__titre"><a href="bibliotheque.html?doc=${encodeURIComponent(doc.id)}">${APP.escape(doc.titre)}</a></h3>` +
    `<p class="carte__texte">${APP.escape(doc.description || "")}</p>` +
    `<div class="carte__pied"><span class="puce">${APP.escape(identite)}</span>${pucePages}</div>` +
    "</article>"
  );
}

const cartesDocuments = DATA.documents.map(carteDocument).join("\n");

function blocPrerendu(cartes) {
  return (
    "<!-- prerendu:debut -->\n" +
    "<!-- Contenu généré par tools/prerendre.mjs : ne pas modifier à la main. -->\n" +
    cartes +
    "\n<!-- prerendu:fin -->"
  );
}

function remplacerGrille(html, cartes, nom) {
  const marqueurs = /<!-- prerendu:debut -->[\s\S]*?<!-- prerendu:fin -->/;
  if (marqueurs.test(html)) return html.replace(marqueurs, () => blocPrerendu(cartes));

  const vide = /(<div[^>]*id="cat-resultats"[^>]*>)\s*(<\/div>)/;
  if (!vide.test(html)) {
    throw new Error(`${nom} : conteneur #cat-resultats introuvable ou déjà rempli sans marqueurs.`);
  }
  return html.replace(vide, (tout, avant, apres) => `${avant}\n${blocPrerendu(cartes)}\n${apres}`);
}

function preparerCours(html) {
  const total = DATA.cours.length;
  html = remplacerGrille(html, cartesCours, "cours.html");
  html = html.replace(/(<span id="cat-compteur-cours-texte">)[\s\S]*?(<\/span>)/, (tout, avant, apres) => {
    return `${avant}${total} cours au catalogue${apres}`;
  });
  html = html.replace(/(<p class="section__texte" id="cat-compte-resultats"[^>]*>)[\s\S]*?(<\/p>)/, (tout, avant, apres) => {
    return `${avant}${total} cours disponibles, tous niveaux confondus.${apres}`;
  });
  return html;
}

function preparerBibliotheque(html) {
  const total = DATA.documents.length;
  html = remplacerGrille(html, cartesDocuments, "bibliotheque.html");
  html = html.replace(/(<span id="cat-compteur-doc-texte">)[\s\S]*?(<\/span>)/, (tout, avant, apres) => {
    return `${avant}${total} documents disponibles${apres}`;
  });
  html = html.replace(/(<p class="section__texte" id="cat-compte-resultats"[^>]*>)[\s\S]*?(<\/p>)/, (tout, avant, apres) => {
    return `${avant}${total} documents disponibles.${apres}`;
  });
  return html;
}

/* -------------------------------------------------------------------------
   Écriture ou vérification
   ------------------------------------------------------------------------- */
const PAGES = [
  { fichier: "cours.html", preparer: preparerCours, total: DATA.cours.length, unite: "cours" },
  { fichier: "bibliotheque.html", preparer: preparerBibliotheque, total: DATA.documents.length, unite: "documents" }
];

const liseré = "─".repeat(64);
console.log("");
console.log(`  SepsHaness — pré-rendu des catalogues${VERIFIER ? " (contrôle)" : ""}`);
console.log("  " + liseré);

let problemes = 0;
let ecrits = 0;

for (const page of PAGES) {
  const chemin = path.join(RACINE, page.fichier);
  const actuel = readFileSync(chemin, "utf8");

  let attendu;
  try {
    attendu = page.preparer(actuel);
  } catch (erreur) {
    console.error(`  ✗ ${page.fichier} : ${erreur.message}`);
    problemes += 1;
    continue;
  }

  if (VERIFIER) {
    if (actuel === attendu) {
      console.log(`  ✓ ${page.fichier.padEnd(18)} à jour (${page.total} ${page.unite})`);
    } else {
      console.error(`  ✗ ${page.fichier.padEnd(18)} obsolète — lancer node tools/prerendre.mjs`);
      problemes += 1;
    }
  } else if (actuel !== attendu) {
    writeFileSync(chemin, attendu, "utf8");
    ecrits += 1;
    console.log(`  ✓ ${page.fichier.padEnd(18)} écrit (${page.total} ${page.unite})`);
  } else {
    console.log(`  · ${page.fichier.padEnd(18)} déjà à jour (${page.total} ${page.unite})`);
  }
}

console.log("  " + liseré);
if (problemes) {
  console.log(`  ${problemes} page(s) à régénérer.`);
  process.exitCode = 1;
} else if (!VERIFIER) {
  console.log(ecrits ? `  ${ecrits} page(s) mise(s) à jour.` : "  Aucun changement.");
} else {
  console.log("  Pré-rendu à jour.");
}
console.log("");
