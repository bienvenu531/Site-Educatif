/**
 * SepsHaness — pré-rendu statique du catalogue et des leçons
 * Usage : node tools/prerendre.mjs            (écrit le HTML)
 *         node tools/prerendre.mjs --verifier (contrôle sans écrire)
 *
 * Le site reste 100 % statique et sans build : ce script ne fait que figer
 * dans le HTML ce que le navigateur afficherait à partir de
 * assets/js/data/*.js.
 *
 *   - cours.html et bibliotheque.html : les cartes du catalogue, entre les
 *     marqueurs <!-- prerendu:debut --> … <!-- prerendu:fin -->.
 *   - lecon-<slug>.html : une page complète par cours (19), générée avec le
 *     même rendu que le navigateur (assets/js/lecon-vue.js), pour que les
 *     moteurs et les visiteurs sans JavaScript lisent la leçon entière.
 *   - sitemap.xml : les URL des leçons, entre <!-- lecons:debut --> et
 *     <!-- lecons:fin -->.
 *
 * Les URL d'assets sont versionnées (?v=) ici même : le script est idempotent
 * et reste compatible avec tools/versionner.mjs.
 * Ne modifiez pas à la main les blocs générés.
 */
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const VERIFIER = process.argv.includes("--verifier");
const DOMAINE = "https://bienvenueduc.com";
/** Date portée par les leçons et le sitemap : à mettre à jour avec le contenu. */
const DATE_CONTENU = "2026-11-15";

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
  "assets/js/markdown.js",
  "assets/js/data/core.js",
  "assets/js/data/cours-stem.js",
  "assets/js/data/cours-lettres.js",
  "assets/js/data/documents-stem.js",
  "assets/js/data/documents-lettres.js",
  "assets/js/data.js",
  "assets/js/app.js",
  "assets/js/lecon-vue.js"
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

if (!contexte.LeconVue) {
  console.error("LeconVue introuvable après chargement de assets/js/lecon-vue.js.");
  process.exit(1);
}

const VUE = contexte.LeconVue.creer(APP, DATA);

/* -------------------------------------------------------------------------
   Versionnement des assets (même empreinte que tools/versionner.mjs)
   ------------------------------------------------------------------------- */
const empreintes = new Map();

function versionner(cheminRelatif) {
  if (!empreintes.has(cheminRelatif)) {
    const contenu = readFileSync(path.join(RACINE, cheminRelatif));
    empreintes.set(cheminRelatif, createHash("sha256").update(contenu).digest("hex").slice(0, 8));
  }
  return cheminRelatif + "?v=" + empreintes.get(cheminRelatif);
}

/* -------------------------------------------------------------------------
   Catalogue : cartes de cours et de documents
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
   Leçons : une page HTML complète par cours
   ------------------------------------------------------------------------- */
const SCRIPTS_LECON = [
  "assets/js/markdown.js",
  "assets/js/data/core.js",
  "assets/js/data/cours-stem.js",
  "assets/js/data/cours-lettres.js",
  "assets/js/data/documents-stem.js",
  "assets/js/data/documents-lettres.js",
  "assets/js/data.js",
  "assets/js/store.js",
  "assets/js/app.js",
  "assets/js/lecon-vue.js",
  "assets/js/lecon.js"
];

function donneesStructurees(cours) {
  const matiere = DATA.matiere(cours.matiere);
  const niveau = DATA.niveau(cours.niveau);
  const url = DOMAINE + "/" + VUE.fichier(cours);
  const donnees = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: cours.titre,
    description: VUE.descriptionSeo(cours),
    url: url,
    inLanguage: "fr",
    isAccessibleForFree: true,
    provider: { "@type": "Organization", name: "SepsHaness", url: DOMAINE + "/" },
    educationalLevel: niveau.nom,
    about: { "@type": "Thing", name: matiere.nom },
    timeRequired: "PT" + (Number(cours.duree) || 30) + "M",
    teaches: (cours.objectifs || []).slice(0, 4)
  };
  return JSON.stringify(donnees, null, 2).replace(/</g, "\\u003c");
}

function pageLecon(cours) {
  const fichier = VUE.fichier(cours);
  const titre = APP.escape(VUE.titreSeo(cours));
  const description = APP.escape(VUE.descriptionSeo(cours));
  const contenu = VUE.page(cours, {});
  const scripts = SCRIPTS_LECON.map((script) => `    <script src="${versionner(script)}"></script>`).join("\n");

  return `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${titre}</title>
    <meta name="description" content="${description}" />
    <meta name="theme-color" content="#4b52d6" />
    <link rel="canonical" href="${DOMAINE}/${fichier}" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="SepsHaness" />
    <meta property="og:title" content="${titre}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${DOMAINE}/${fichier}" />
    <link rel="icon" href="${versionner("assets/img/favicon.svg")}" />
    <link rel="stylesheet" href="${versionner("assets/css/base.css")}" />
    <link rel="stylesheet" href="${versionner("assets/css/perso.css")}" />
    <script type="application/ld+json">
${donneesStructurees(cours)}
    </script>
  </head>
  <body data-page="lecon" data-cours="${APP.escape(cours.slug)}">
    <div id="app-header"></div>
    <main id="contenu">
      <div id="lecon-racine">
${indenter(contenu, 8)}
      </div>
      <noscript>
        <p class="conteneur plomb mt-5">
          Le quiz interactif, la progression et le suivi demandent JavaScript ; la leçon reste
          entièrement lisible sans.
        </p>
      </noscript>
    </main>
    <div id="app-footer"></div>

${scripts}
  </body>
</html>
`;
}

/** Décale un bloc HTML de `niveau` espaces, lignes vides ignorées. */
function indenter(texte, niveau) {
  const espaces = " ".repeat(niveau);
  return texte
    .split("\n")
    .map((ligne) => (ligne.trim() ? espaces + ligne : ligne))
    .join("\n");
}

/* -------------------------------------------------------------------------
   Sitemap : bloc des leçons
   ------------------------------------------------------------------------- */
function blocSitemap() {
  const urls = DATA.cours
    .map((cours) => {
      return (
        "  <url>\n" +
        `    <loc>${DOMAINE}/${VUE.fichier(cours)}</loc>\n` +
        `    <lastmod>${DATE_CONTENU}</lastmod>\n` +
        "    <changefreq>monthly</changefreq>\n" +
        "    <priority>0.7</priority>\n" +
        "  </url>"
      );
    })
    .join("\n");
  return "<!-- lecons:debut -->\n" + urls + "\n  <!-- lecons:fin -->";
}

function preparerSitemap(html) {
  const marqueurs = /<!-- lecons:debut -->[\s\S]*?<!-- lecons:fin -->/;
  if (marqueurs.test(html)) return html.replace(marqueurs, () => blocSitemap());
  if (!html.includes("</urlset>")) throw new Error("sitemap.xml : balise </urlset> introuvable.");
  return html.replace("</urlset>", blocSitemap() + "\n</urlset>");
}

/* -------------------------------------------------------------------------
   Écriture ou vérification
   ------------------------------------------------------------------------- */
const PAGES = [
  { fichier: "cours.html", preparer: preparerCours, total: DATA.cours.length, unite: "cours" },
  { fichier: "bibliotheque.html", preparer: preparerBibliotheque, total: DATA.documents.length, unite: "documents" },
  { fichier: "sitemap.xml", preparer: preparerSitemap, total: DATA.cours.length, unite: "leçons" }
];

const lecons = DATA.cours.map((cours) => ({ fichier: VUE.fichier(cours), contenu: pageLecon(cours) }));

const liseré = "─".repeat(64);
console.log("");
console.log(`  SepsHaness — pré-rendu du catalogue et des leçons${VERIFIER ? " (contrôle)" : ""}`);
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

let leconsAJour = 0;
let leconsEcrites = 0;
const leconsObsoletes = [];

for (const lecon of lecons) {
  const chemin = path.join(RACINE, lecon.fichier);
  const existe = existsSync(chemin);

  if (!existe) {
    if (VERIFIER) {
      leconsObsoletes.push(lecon.fichier + " (absente)");
      continue;
    }
    writeFileSync(chemin, lecon.contenu, "utf8");
    leconsEcrites += 1;
    continue;
  }

  const actuel = readFileSync(chemin, "utf8");
  if (actuel === lecon.contenu) {
    leconsAJour += 1;
    continue;
  }
  if (VERIFIER) {
    leconsObsoletes.push(lecon.fichier);
    continue;
  }
  writeFileSync(chemin, lecon.contenu, "utf8");
  leconsEcrites += 1;
}

if (VERIFIER) {
  if (leconsObsoletes.length) {
    problemes += leconsObsoletes.length;
    console.error(`  ✗ ${lecons.length} leçons : ${leconsAJour} à jour, ${leconsObsoletes.length} à régénérer`);
    leconsObsoletes.slice(0, 6).forEach((fichier) => console.error(`      ${fichier}`));
    if (leconsObsoletes.length > 6) console.error(`      … et ${leconsObsoletes.length - 6} autre(s)`);
  } else {
    console.log(`  ✓ ${lecons.length} leçons pré-rendues à jour (lecon-<slug>.html)`);
  }
} else {
  console.log(
    `  ${leconsEcrites || leconsAJour ? "✓" : "·"} ${lecons.length} leçons : ${leconsAJour} à jour, ${leconsEcrites} écrite(s)`
  );
}

console.log("  " + liseré);
if (problemes) {
  console.log(`  ${problemes} fichier(s) à régénérer.`);
  process.exitCode = 1;
} else if (!VERIFIER) {
  console.log(ecrits || leconsEcrites ? `  ${ecrits + leconsEcrites} fichier(s) mis à jour.` : "  Aucun changement.");
} else {
  console.log("  Pré-rendu à jour.");
}
console.log("");
