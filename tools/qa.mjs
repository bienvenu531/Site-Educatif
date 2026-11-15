/**
 * SepsHaness — contrôle qualité dans un vrai navigateur (CDP)
 * Usage : node tools/qa.mjs
 *
 * Prérequis : `node server.mjs` lancé dans un autre terminal, Chrome installé.
 * Le script : émule desktop 1440 / mobile 390 / petit mobile 360, mesure les
 * débordements horizontaux, relève les erreurs JavaScript, teste les
 * interactions clés (filtres, lecteur, quiz, leçon terminée, note, profil),
 * et enregistre des captures dans docs/apercus.
 *
 * Variables d'environnement : BASE_URL, CHROME_PATH.
 */
import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SORTIE = path.join(RACINE, "docs", "apercus");
const CHROME = process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = process.env.BASE_URL || "http://127.0.0.1:4180/";
const PORT_DEBUG = 9333;
const PROFIL = path.join(os.tmpdir(), "seps-qa-cdp-" + Date.now());

const LARGEURS = {
  desktop: { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false },
  mobile: { width: 390, height: 844, deviceScaleFactor: 2, mobile: true },
  petit: { width: 360, height: 780, deviceScaleFactor: 2, mobile: true }
};

const PAGES = [
  { nom: "accueil", url: "index.html" },
  { nom: "parcours", url: "parcours.html" },
  { nom: "cours", url: "cours.html" },
  { nom: "bibliotheque", url: "bibliotheque.html" },
  { nom: "lecon", url: "lecon.html?cours=math-college-fractions" },
  { nom: "espace-travail", url: "espace-travail.html" },
  { nom: "suivi", url: "suivi.html" },
  { nom: "profil", url: "profil.html" }
];

/** Pages autonomes : mesurées, mais sans capture dédiée. */
const PAGES_SECONDAIRES = [
  { nom: "mentions-legales", url: "mentions-legales.html" },
  { nom: "confidentialite", url: "confidentialite.html" },
  { nom: "cgu", url: "cgu.html" },
  { nom: "404", url: "404.html" }
];

const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const chrome = spawn(
  CHROME,
  [
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--no-first-run",
    "--disable-extensions",
    "--hide-scrollbars",
    "--remote-allow-origins=*",
    "--remote-debugging-port=" + PORT_DEBUG,
    "--user-data-dir=" + PROFIL,
    "about:blank"
  ],
  { stdio: "ignore" }
);

let socket = null;
let compteur = 0;
const attentes = new Map();
let evenements = [];

function envoyer(methode, parametres) {
  return new Promise((resoudre, rejeter) => {
    const identifiant = ++compteur;
    attentes.set(identifiant, { resoudre, rejeter });
    socket.send(JSON.stringify({ id: identifiant, method: methode, params: parametres || {} }));
  });
}

async function attendreChrome() {
  for (let essai = 0; essai < 120; essai += 1) {
    try {
      const reponse = await fetch(`http://127.0.0.1:${PORT_DEBUG}/json/version`);
      if (reponse.ok) return await reponse.json();
    } catch {
      /* Chrome démarre encore */
    }
    await pause(150);
  }
  throw new Error("Impossible de joindre Chrome en mode débogage.");
}

async function evaluer(expression) {
  const reponse = await envoyer("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true
  });
  if (reponse.exceptionDetails) {
    throw new Error(reponse.exceptionDetails.text || "Exception dans la page");
  }
  return reponse.result.value;
}

async function executer(script) {
  try {
    return await evaluer(`(() => { try { ${script} } catch (erreur) { return { erreur: erreur.message }; } })()`);
  } catch (erreur) {
    return { erreur: erreur.message };
  }
}

function erreursDepuis(liste) {
  const erreurs = [];
  for (const evenement of liste) {
    if (evenement.method === "Runtime.exceptionThrown") {
      const details = evenement.params.exceptionDetails || {};
      const description =
        (details.exception && details.exception.description) || details.text || "exception inconnue";
      erreurs.push(description.split("\n")[0].slice(0, 240));
    }
    if (evenement.method === "Runtime.consoleAPICalled" && evenement.params.type === "error") {
      const texte = (evenement.params.args || [])
        .map((argument) => argument.value || argument.description || "")
        .join(" ")
        .slice(0, 240);
      if (texte) erreurs.push("console.error : " + texte);
    }
  }
  return [...new Set(erreurs)];
}

async function preparerEcran(profilEcran) {
  await envoyer("Emulation.setDeviceMetricsOverride", LARGEURS[profilEcran]);
}

async function naviguer(url) {
  evenements = [];
  await envoyer("Page.navigate", { url: BASE + url });
  await pause(1050);
}

async function mesurer() {
  return evaluer(`(() => ({
    innerWidth: window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    h1: document.querySelectorAll("h1").length,
    entete: !!document.querySelector(".entete-site"),
    cartes: document.querySelectorAll(".carte-cours").length,
    pied: !!document.querySelector(".pied-site")
  }))()`);
}

async function capturer(nom, pleinePage, hauteurMax) {
  const options = { format: "png", captureBeyondViewport: !!pleinePage };
  if (pleinePage) {
    const dimensions = await evaluer(`(() => ({
      largeur: document.documentElement.clientWidth,
      hauteur: Math.min(document.documentElement.scrollHeight, ${hauteurMax || 2800})
    }))()`);
    options.clip = { x: 0, y: 0, width: dimensions.largeur, height: dimensions.hauteur, scale: 1 };
  }
  const image = await envoyer("Page.captureScreenshot", options);
  await writeFile(path.join(SORTIE, nom + ".png"), Buffer.from(image.data, "base64"));
  return nom + ".png";
}

const mesures = [];
const interactions = [];
const captures = [];

function noterInteraction(nom, reussi, detail) {
  interactions.push({ nom, reussi: !!reussi, detail: detail || "" });
}

/* -------------------------------------------------------------------------
   Phases
   ------------------------------------------------------------------------- */
async function phaseMesuresEtCaptures() {
  for (const page of PAGES) {
    // Desktop : mesure + capture pleine page
    await preparerEcran("desktop");
    await naviguer(page.url);
    const mesureDesk = await mesurer();
    mesureDesk.erreurs = erreursDepuis(evenements);
    mesures.push({ ecran: "desktop", page: page.nom, ...mesureDesk });
    captures.push(await capturer("desktop-" + page.nom, true, 2600));

    // Petit mobile 360 px : mesure seule
    await preparerEcran("petit");
    await naviguer(page.url);
    const mesurePetit = await mesurer();
    mesurePetit.erreurs = erreursDepuis(evenements);
    mesures.push({ ecran: "petit", page: page.nom, ...mesurePetit });

    // Mobile 390 px : mesure + capture
    await preparerEcran("mobile");
    await naviguer(page.url);
    const mesureMobile = await mesurer();
    mesureMobile.erreurs = erreursDepuis(evenements);
    mesures.push({ ecran: "mobile", page: page.nom, ...mesureMobile });
    captures.push(await capturer("mobile-" + page.nom, true, 2200));
  }

  // Thème sombre
  await preparerEcran("desktop");
  for (const cible of [
    { nom: "accueil", url: "index.html?theme=sombre" },
    { nom: "lecon", url: "lecon.html?cours=philo-lycee-conscience&theme=sombre" },
    { nom: "suivi", url: "suivi.html?theme=sombre" }
  ]) {
    await naviguer(cible.url);
    captures.push(await capturer("sombre-" + cible.nom, true, 2400));
  }
  await naviguer("index.html?theme=clair");
}

async function phasePagesSecondaires() {
  for (const page of PAGES_SECONDAIRES) {
    for (const ecran of ["desktop", "petit", "mobile"]) {
      await preparerEcran(ecran);
      await naviguer(page.url);
      const mesure = await mesurer();
      mesure.erreurs = erreursDepuis(evenements);
      mesures.push({ ecran, page: page.nom, ...mesure });
    }
  }
}

async function phaseInteractions() {
  await preparerEcran("desktop");

  /* --- Catalogue : filtres et recherche --- */
  await naviguer("cours.html");
  const totalCours = await evaluer(`document.querySelectorAll(".carte-cours").length`);
  const filtreClique = await executer(`
    const bouton = document.querySelector('[data-niveau="lycee"]');
    if (!bouton) return false;
    bouton.click();
    return true;
  `);
  await pause(400);
  const apresFiltre = await evaluer(`document.querySelectorAll(".carte-cours").length`);
  noterInteraction(
    "Cours — filtre « Lycée »",
    filtreClique === true && apresFiltre > 0 && apresFiltre < totalCours,
    `${totalCours} → ${apresFiltre} cours`
  );

  await executer(`
    const bouton = [...document.querySelectorAll("button")].find((element) => /Réinitialiser/i.test(element.textContent));
    if (bouton) bouton.click();
  `);
  await pause(350);
  await executer(`
    const champ = document.querySelector(".barre-recherche input");
    if (!champ) return false;
    champ.value = "fraction";
    champ.dispatchEvent(new Event("input", { bubbles: true }));
    return true;
  `);
  await pause(450);
  const resultatsRecherche = await evaluer(`document.querySelectorAll(".carte-cours").length`);
  noterInteraction(
    "Cours — recherche « fraction »",
    resultatsRecherche === 1,
    `${resultatsRecherche} résultat(s)`
  );

  /* --- Bibliothèque : lecteur de document --- */
  await naviguer("bibliotheque.html");
  const lecteurClique = await executer(`
    const bouton = [...document.querySelectorAll("button, a")].find((element) => /Consulter/i.test(element.textContent));
    if (!bouton) return false;
    bouton.click();
    return true;
  `);
  await pause(600);
  const etatLecteur = await evaluer(`(() => {
    const modale = document.querySelector(".modale");
    return {
      present: !!modale,
      longueur: modale ? modale.textContent.length : 0,
      tableaux: modale ? modale.querySelectorAll("table").length : 0
    };
  })()`);
  noterInteraction(
    "Bibliothèque — lecteur Markdown",
    lecteurClique === true && etatLecteur.present && etatLecteur.longueur > 400,
    JSON.stringify(etatLecteur)
  );
  captures.push(await capturer("lecteur-document", false));
  await evaluer(`document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }))`);
  await pause(350);
  const modaleFermee = await evaluer(`!document.querySelector(".modale")`);
  noterInteraction("Bibliothèque — fermeture avec Échap", modaleFermee, "");

  /* --- Leçon : quiz puis marquage terminé --- */
  await naviguer("lecon.html?cours=math-college-fractions");
  const groupesQuiz = await executer(`
    const noms = [...new Set([...document.querySelectorAll('input[type="radio"]')].map((input) => input.name))];
    noms.forEach((nom) => {
      const premier = document.querySelector('input[type="radio"][name="' + nom + '"]');
      if (premier) premier.click();
    });
    const bouton = document.getElementById("quiz-valider");
    if (bouton) bouton.click();
    return { questions: noms.length, valide: !!bouton };
  `);
  await pause(700);
  const etatQuiz = await evaluer(`(() => {
    const sauvegarde = JSON.parse(localStorage.getItem("sepshaness.v1") || "{}");
    const entree = (sauvegarde.quiz || {})["math-college-fractions"];
    return {
      tentatives: entree ? entree.tentatives : 0,
      scoreAffiche: /\\d\\s*%/.test(document.body.innerText),
      corrections: document.querySelectorAll(".perso-quiz [class*='correct'], .perso-quiz [class*='juste'], .perso-quiz [class*='faux']").length
    };
  })()`);
  noterInteraction(
    "Leçon — quiz corrigé et enregistré",
    groupesQuiz && groupesQuiz.questions >= 3 && etatQuiz.tentatives >= 1 && etatQuiz.scoreAffiche,
    JSON.stringify({ ...groupesQuiz, ...etatQuiz })
  );

  const marque = await executer(`
    const bouton = [...document.querySelectorAll("button")].find((element) => /Marquer comme terminé/i.test(element.textContent));
    if (!bouton) return false;
    bouton.click();
    return true;
  `);
  await pause(800);
  const etatLecon = await evaluer(`(() => {
    const sauvegarde = JSON.parse(localStorage.getItem("sepshaness.v1") || "{}");
    return {
      lecon: (sauvegarde.lecons || {})["math-college-fractions"] || null,
      sessions: (sauvegarde.sessions || []).length,
      minutes: (sauvegarde.sessions || []).reduce((total, session) => total + session.minutes, 0)
    };
  })()`);
  noterInteraction(
    "Leçon — marquage terminé + temps enregistré",
    marque === true && etatLecon.lecon && etatLecon.lecon.statut === "termine" && etatLecon.sessions >= 1,
    JSON.stringify(etatLecon)
  );

  /* --- Espace de travail : création d'une note --- */
  await naviguer("espace-travail.html");
  await executer(`
    const bouton = [...document.querySelectorAll("button, a")].find((element) => /Nouvelle note/i.test(element.textContent));
    if (bouton) bouton.click();
  `);
  await pause(700);
  const noteSaisie = await executer(`
    const titre = document.getElementById("note-titre");
    const zone = document.querySelector("textarea.zone-texte, #note-contenu, textarea");
    if (!titre || !zone) return false;
    titre.value = "Note de contrôle qualité";
    titre.dispatchEvent(new Event("input", { bubbles: true }));
    zone.value = "Cette note a été créée automatiquement pour vérifier l'enregistrement local.";
    zone.dispatchEvent(new Event("input", { bubbles: true }));
    const formulaire = titre.closest("form");
    if (formulaire) {
      if (formulaire.requestSubmit) formulaire.requestSubmit();
      else formulaire.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    }
    return true;
  `);
  await pause(800);
  const etatNotes = await evaluer(`(() => {
    const sauvegarde = JSON.parse(localStorage.getItem("sepshaness.v1") || "{}");
    return { notes: (sauvegarde.notes || []).length, titre: (sauvegarde.notes || [])[0] ? sauvegarde.notes[0].titre : "" };
  })()`);
  noterInteraction(
    "Espace de travail — création d'une note",
    noteSaisie === true && etatNotes.notes >= 1,
    JSON.stringify(etatNotes)
  );
  captures.push(await capturer("espace-note", true, 2200));

  /* --- Profil : enregistrement du pseudo --- */
  await naviguer("profil.html");
  const profilEnregistre = await executer(`
    const champ = document.getElementById("profil-pseudo");
    const formulaire = document.getElementById("profil-form");
    if (!champ || !formulaire) return false;
    champ.value = "Amina (test QA)";
    champ.dispatchEvent(new Event("input", { bubbles: true }));
    if (formulaire.requestSubmit) formulaire.requestSubmit();
    else formulaire.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    return true;
  `);
  await pause(700);
  const etatProfil = await evaluer(`(() => {
    const sauvegarde = JSON.parse(localStorage.getItem("sepshaness.v1") || "{}");
    return {
      pseudo: (sauvegarde.profil || {}).pseudo || "",
      avatar: (document.getElementById("avatar-entete") || {}).textContent || ""
    };
  })()`);
  noterInteraction(
    "Profil — enregistrement du pseudo",
    profilEnregistre === true && etatProfil.pseudo === "Amina (test QA)",
    JSON.stringify(etatProfil)
  );

  /* --- Suivi : données remontées dans le tableau de bord --- */
  await naviguer("suivi.html");
  const etatSuivi = await evaluer(`(() => ({
    indicateurs: [...document.querySelectorAll(".stat__valeur")].map((element) => element.textContent.trim()),
    texte: document.body.innerText.slice(0, 4000)
  }))()`);
  const indicateursRemplis =
    etatSuivi.indicateurs.some((valeur) => /1\s*\/\s*19/.test(valeur)) ||
    /1\s*\/\s*19/.test(etatSuivi.texte);
  noterInteraction(
    "Suivi — tableau de bord alimenté",
    indicateursRemplis,
    JSON.stringify(etatSuivi.indicateurs)
  );
  captures.push(await capturer("suivi-rempli", true, 2600));
}

/* -------------------------------------------------------------------------
   Exécution
   ------------------------------------------------------------------------- */
try {
  await mkdir(SORTIE, { recursive: true });
  await attendreChrome();
  const cibles = await (await fetch(`http://127.0.0.1:${PORT_DEBUG}/json/list`)).json();
  const cible = cibles.find((element) => element.type === "page");
  if (!cible) throw new Error("Aucun onglet Chrome disponible.");

  socket = new WebSocket(cible.webSocketDebuggerUrl);
  await new Promise((resoudre, rejeter) => {
    socket.onopen = resoudre;
    socket.onerror = () => rejeter(new Error("WebSocket CDP refusé."));
  });
  socket.onmessage = (message) => {
    const donnees = JSON.parse(message.data);
    if (donnees.id && attentes.has(donnees.id)) {
      const { resoudre, rejeter } = attentes.get(donnees.id);
      attentes.delete(donnees.id);
      if (donnees.error) rejeter(new Error(donnees.error.message));
      else resoudre(donnees.result);
      return;
    }
    if (donnees.method) evenements.push(donnees);
  };

  await envoyer("Page.enable");
  await envoyer("Runtime.enable");
  await phaseMesuresEtCaptures();
  await phasePagesSecondaires();
  await phaseInteractions();
} catch (erreur) {
  console.error("Échec du contrôle navigateur :", erreur.message);
  process.exitCode = 1;
} finally {
  try {
    if (socket) socket.close();
  } catch {
    /* ignoré */
  }
  chrome.kill();
  await pause(300);
}

/* -------------------------------------------------------------------------
   Rapport
   ------------------------------------------------------------------------- */
if (mesures.length) {
  console.log("");
  console.log("MESURES (débordement horizontal = scrollWidth > innerWidth)");
  console.log("Écran    | Page             | largeur | scrollWidth | h1 | cartes | en-tête | erreurs JS");
  console.log("---------|------------------|---------|-------------|----|--------|---------|-----------");
  for (const ligne of mesures) {
    console.log(
      [
        ligne.ecran.padEnd(8),
        ligne.page.padEnd(16),
        String(ligne.innerWidth).padEnd(7),
        String(ligne.scrollWidth).padEnd(11),
        String(ligne.h1).padEnd(2),
        String(ligne.cartes).padEnd(6),
        (ligne.entete ? "oui" : "NON").padEnd(7),
        ligne.erreurs.length ? ligne.erreurs.length + " ✗" : "0"
      ].join(" | ")
    );
  }

  const debordements = mesures.filter((ligne) => ligne.scrollWidth > ligne.innerWidth);
  const sansEnTete = mesures.filter((ligne) => !ligne.entete);
  const avecErreur = mesures.filter((ligne) => ligne.erreurs.length);

  console.log("");
  console.log("INTERACTIONS");
  for (const interaction of interactions) {
    console.log(`  ${interaction.reussi ? "✓" : "✗"} ${interaction.nom} — ${interaction.detail}`);
  }

  const interactionsEchouees = interactions.filter((interaction) => !interaction.reussi);
  console.log("");
  console.log(`Captures enregistrées : ${captures.length} (dans docs/apercus)`);
  console.log(`Débordements horizontaux : ${debordements.length}`);
  console.log(`En-têtes manquants : ${sansEnTete.length}`);
  console.log(`Pages avec erreur JavaScript : ${avecErreur.length}`);
  console.log(`Interactions en échec : ${interactionsEchouees.length}`);

  if (debordements.length || avecErreur.length || interactionsEchouees.length || sansEnTete.length) {
    console.log("");
    console.log("Détail des problèmes :");
    for (const ligne of debordements) {
      console.log(`  - ${ligne.ecran}/${ligne.page} : ${ligne.scrollWidth}px > ${ligne.innerWidth}px`);
    }
    for (const ligne of avecErreur) {
      console.log(`  - ${ligne.ecran}/${ligne.page} : ${ligne.erreurs.join(" | ")}`);
    }
    for (const interaction of interactionsEchouees) {
      console.log(`  - interaction : ${interaction.nom} (${interaction.detail})`);
    }
    process.exitCode = 1;
  } else {
    console.log("");
    console.log("Résultat : SUCCÈS — aucune erreur, aucun débordement, interactions fonctionnelles.");
  }
}
