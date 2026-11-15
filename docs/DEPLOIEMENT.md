# Déploiement — SepsHaness sur Hostinger

Ce document décrit la mise en ligne de **bienvenueduc.com** (hébergement Hostinger, Apache/LiteSpeed)
et la vérification qui suit. Le site est **100 % statique** : il n'y a ni build, ni base de données,
ni PHP. Déployer revient à copier des fichiers dans `public_html/`.

> **Règle d'or :** toute modification d'un fichier `assets/` doit être suivie de
> `npm run versionner` avant l'envoi. Les pages référencent `assets/…?v=<empreinte>` : sans cette
> étape, les navigateurs et le CDN continueront de servir l'ancienne version pendant des semaines.

---

## 1. Avant de déployer (2 minutes)

```powershell
npm run avant-mise-en-ligne
```

Cette commande :

1. met à jour les paramètres `?v=` des pages HTML (`tools/versionner.mjs`) ;
2. lance le contrôle complet (`tools/check.mjs`) : structure, liens, versions, syntaxe JS, données,
   `Store`, pages légales.

Attendu : `Résultat : SUCCÈS`. En cas d'échec, ne pas déployer.

Pour un contrôle visuel avant envoi (Chrome requis) :

```powershell
npm start            # dans un terminal : http://127.0.0.1:4173
npm run qa           # dans un autre : responsive, erreurs console, captures
```

---

## 2. Ce qu'il faut envoyer dans `public_html/`

À la racine du site :

| Fichier | Rôle |
|---|---|
| `index.html`, `parcours.html`, `cours.html`, `bibliotheque.html`, `lecon.html`, `espace-travail.html`, `suivi.html`, `profil.html` | pages de l'application |
| `mentions-legales.html`, `confidentialite.html`, `cgu.html` | pages légales |
| `404.html` | page d'erreur personnalisée |
| `robots.txt`, `sitemap.xml` | référencement |
| `.htaccess` | HTTPS, en-têtes de sécurité, cache, page 404 |

Puis le dossier `assets/` **en entier** (CSS, JS, images).

Un ZIP prêt à téléverser peut être généré à tout moment :

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File tools/preparer-zip.ps1
```

Il produit `dist/site-a-televerser.zip` (39 entrées, environ 180 Ko), avec les chemins en `/`,
le `.htaccess` inclus et sans `tools/`, `docs/`, `server.mjs`, `package.json` ni `README.md`.
Le script vérifie lui-même la présence du `.htaccess` et du dossier `assets/`.

> Si l'extracteur de Hostinger ignore le fichier caché `.htaccess`, téléversez-le séparément à la
> racine après extraction.

**Ne pas envoyer** : `tools/`, `docs/`, `package.json`, `server.mjs`, les fichiers de travail.
Le `.htaccess` les bloque déjà, mais autant ne pas les déposer.

> Le `.htaccess` est un fichier caché : activez « Afficher les fichiers cachés » dans le
> gestionnaire de fichiers Hostinger.

---

## 3. Sauvegarde obligatoire (5 minutes)

Dans **hPanel → Sites → Gérer → Fichiers → Gestionnaire de fichiers** :

1. Téléchargez et conservez une copie de `public_html/.htaccess` s'il existe ;
2. téléchargez `assets/js/app.js` et `assets/js/auth.js` s'ils existent encore ;
3. notez la date de la sauvegarde.

Un `.htaccess` fourni par Hostinger peut contenir des redirections ou des règles PHP.
**Ne l'écrasez pas à l'aveugle** : ouvrez-le, comparez, fusionnez si nécessaire (voir § 5).

Si un ancien `auth.js` ou un dossier `api/` traîne encore en production et n'est plus utilisé par
les pages, supprimez-les après vérification. Ils n'ont plus de rôle dans la version statique.

---

## 4. Envoi et purge du cache

1. **Téléversez** le contenu de `dist/site-a-televerser.zip` (ou les fichiers de la section 2)
   dans `public_html/`, puis utilisez **Extraire** et supprimez le ZIP.
2. **Écrasez** les anciens fichiers quand le gestionnaire le demande.
3. **Videz les caches** : hPanel → **Performance** → *Vider le cache* (site et CDN s'il est actif).
   Sans cette purge, le CDN Hostinger peut continuer à servir l'ancien `app.js` pendant plusieurs
   heures — c'est exactement ce qui a produit l'ancienne coquille « Excellence » en ligne.
4. Dans le navigateur : `Ctrl + F5`, ou testez en navigation privée.

---

## 5. Le fichier `.htaccess` en détail

| Règle | Effet |
|---|---|
| Redirection HTTPS + suppression du `www` | une seule adresse canonique `https://bienvenueduc.com` |
| `Strict-Transport-Security` | force le navigateur à rester en HTTPS |
| `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options` | protections standard |
| `Header unset X-Powered-By` | ne révèle plus la version de PHP |
| `ErrorDocument 404 /404.html` | page d'erreur cohérente |
| Cache : HTML `no-cache`, CSS/JS `1 an` | les URLs versionnées `?v=` peuvent être mises en cache longtemps |
| Compression | performance |
| Blocage `.env`, `.sql`, `.md`, archives, `tools/`, `docs/` | empêche le téléchargement de fichiers de travail |

**HSTS** est volontairement sans `includeSubDomains`. Ne l'ajoutez que si tous vos sous-domaines
sont en HTTPS.

**404** : la page utilise des chemins absolus (`/assets/…`, `/index.html`). C'est indispensable :
Apache la sert en conservant l'URL demandée, donc un chemin relatif pointerait vers un mauvais
dossier.

---

## 6. Recette après déploiement

### Automatique

```powershell
npm run verifier:prod
```

Le script `tools/verifier-prod.mjs` contrôle :

- les 12 pages (dont légales et 404) ;
- la page 404 réellement servie pour une URL inconnue ;
- `robots.txt`, `sitemap.xml` et les URL qu'il déclare ;
- les en-têtes de sécurité et l'absence de `X-Powered-By` ;
- la redirection `www` → sans `www` ;
- **la fraîcheur des assets** : chaque `assets/…?v=…` est comparé (SHA-256) au fichier local, à
  l'origine **et** via le CDN ;
- la coquille `app.js` : présence de « SepsHaness », absence de « Excellence ».

Sortie attendue : `Résultat : SUCCÈS`. Si le script signale `CDN : … est périmé`, la cause est le
cache : repurgez dans hPanel, attendez quelques minutes, relancez.

### Manuelle (5 minutes)

1. `https://bienvenueduc.com/` en navigation privée : en-tête et pied de page affichent
   **SepsHaness** (jamais « Excellence »), les liens du menu fonctionnent.
2. Ouvrez `mentions-legales.html`, `confidentialite.html`, `cgu.html` : mise en page correcte,
   sommaire cliquable, aucun texte « à compléter ».
3. Pied de page de n'importe quelle page : colonne **Informations** avec les trois liens légaux,
   mention « Hébergé par Hostinger International Ltd. ».
4. `https://www.bienvenueduc.com` redirige vers `https://bienvenueduc.com`.
5. Une URL inexistante affiche la 404 personnalisée (et non la page Hostinger).
6. Mobile (390 px) : aucun débordement horizontal, y compris sur les pages légales.
7. `https://bienvenueduc.com/robots.txt` et `sitemap.xml` répondent 200.

---

## 7. En cas de problème (retour arrière)

1. Remettez les fichiers sauvegardés (`.htaccess`, `app.js`, etc.).
2. Supprimez les fichiers ajoutés si nécessaire (pages légales, `robots.txt`, `sitemap.xml`, `404.html`).
3. Videz le cache Hostinger.
4. Rechargez en navigation privée.

Aucune donnée utilisateur n'est concernée : tout est local au navigateur du visiteur.

---

## 8. Après chaque mise à jour

| Situation | Action |
|---|---|
| Modification d'un cours ou d'un document (`assets/js/data/*.js`) | `npm run avant-mise-en-ligne`, envoyer le fichier, purger le cache |
| Modification de `app.js`, `store.js`, CSS | idem : le `?v=` change, les navigateurs prennent la nouvelle version |
| Modification d'une page HTML | envoyer la page ; elle est en `no-cache`, aucun `?v=` à gérer |
| Ajout d'une page | l'ajouter aussi à `sitemap.xml` et, si publique, vérifier `robots.txt` |

Le numéro de version des assets n'est jamais saisi à la main : il est calculé à partir du contenu.
Deux fichiers identiques ont la même empreinte ; un fichier modifié change d'URL.

---

## 9. Points d'attention connus

- **CDN Hostinger** : après un envoi, l'ancienne version peut rester servie plusieurs heures.
  C'est la raison d'être du versionnement et de la purge. Le vérificateur le détecte.
- **Domaine et marque** : le site s'appelle désormais **SepsHaness** mais le domaine reste
  `bienvenueduc.com`. Toute décision de changement de domaine doit mettre à jour `.htaccess`,
  `sitemap.xml`, `robots.txt` et les balises `canonical`.
- **PHP hérité** : la version actuelle n'utilise plus de PHP ni de compte. Les anciens fichiers
  (`api/`, `auth.js`) sont inutiles et doivent être retirés après sauvegarde.
