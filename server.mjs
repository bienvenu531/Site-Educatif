/**
 * SepsHaness — serveur statique de développement
 * Aucune dépendance : node server.mjs
 * Options : --port 4173  (ou variable d'environnement PORT)
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RACINE = path.dirname(fileURLToPath(import.meta.url));

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".md": "text/markdown; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".woff2": "font/woff2"
};

function portDemande() {
  const indexOption = process.argv.indexOf("--port");
  const valeur = indexOption !== -1 ? process.argv[indexOption + 1] : process.env.PORT;
  const port = Number(valeur);
  return Number.isInteger(port) && port > 0 && port < 65536 ? port : 4173;
}

function pageErreur(code, message) {
  return `<!DOCTYPE html>
<html lang="fr"><head><meta charset="utf-8"><title>${code} — SepsHaness</title>
<link rel="stylesheet" href="/assets/css/base.css"></head>
<body><main id="contenu"><section class="section"><div class="conteneur">
<h1 class="titre-1">${code}</h1><p class="plomb">${message}</p>
<p><a class="btn btn--primaire" href="/index.html">Retour à l'accueil</a></p>
</div></section></main></body></html>`;
}

async function resoudre(cheminUrl) {
  let cheminDecode;
  try {
    cheminDecode = decodeURIComponent(cheminUrl.split("?")[0].split("#")[0]);
  } catch {
    return null;
  }
  const cible = path.resolve(RACINE, "." + path.posix.normalize("/" + cheminDecode));
  if (cible !== RACINE && !cible.startsWith(RACINE + path.sep)) return null;
  try {
    const infos = await stat(cible);
    if (infos.isDirectory()) {
      const index = path.join(cible, "index.html");
      const infosIndex = await stat(index).catch(() => null);
      return infosIndex && infosIndex.isFile() ? index : null;
    }
    return infos.isFile() ? cible : null;
  } catch {
    return null;
  }
}

const serveur = createServer(async (req, res) => {
  const methode = req.method || "GET";
  if (methode !== "GET" && methode !== "HEAD") {
    res.writeHead(405, { "Content-Type": "text/plain; charset=utf-8", Allow: "GET, HEAD" });
    res.end("Méthode non autorisée");
    return;
  }

  const fichier = await resoudre(req.url || "/");
  if (!fichier) {
    const corps = pageErreur(404, "Cette page n'existe pas. Le site est entièrement statique : vérifiez l'adresse.");
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8", "Content-Length": Buffer.byteLength(corps) });
    res.end(methode === "HEAD" ? undefined : corps);
    return;
  }

  try {
    const contenu = await readFile(fichier);
    res.writeHead(200, {
      "Content-Type": TYPES[path.extname(fichier).toLowerCase()] || "application/octet-stream",
      "Content-Length": contenu.length,
      "Cache-Control": "no-cache",
      "X-Content-Type-Options": "nosniff"
    });
    res.end(methode === "HEAD" ? undefined : contenu);
    console.log(`  ${methode} ${req.url} → 200`);
  } catch {
    const corps = pageErreur(500, "Lecture impossible du fichier demandé.");
    res.writeHead(500, { "Content-Type": "text/html; charset=utf-8" });
    res.end(methode === "HEAD" ? undefined : corps);
  }
});

const portInitial = portDemande();
let port = portInitial;
let tentatives = 0;

serveur.on("error", (erreur) => {
  if (erreur.code === "EADDRINUSE" && tentatives < 10) {
    tentatives += 1;
    port += 1;
    console.warn(`Port ${port - 1} occupé, essai sur ${port}…`);
    setTimeout(() => serveur.listen(port, "127.0.0.1"), 120);
    return;
  }
  console.error("Impossible de démarrer le serveur :", erreur.message);
  process.exitCode = 1;
});

serveur.listen(port, "127.0.0.1", () => {
  console.log("");
  console.log("  SepsHaness — serveur de développement");
  console.log(`  Adresse : http://127.0.0.1:${port}/`);
  console.log("  Dossier : " + RACINE);
  console.log("  Arrêt   : Ctrl+C");
  console.log("");
});
