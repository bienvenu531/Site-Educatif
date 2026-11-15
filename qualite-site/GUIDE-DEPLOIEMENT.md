# Guide de déploiement — qualité du site bienvenueduc.com

Ce dossier contient une première vague d'améliorations **prêtes à déployer**, sans toucher au code PHP
(que je n'ai pas). Tout a été vérifié localement : pages rendues dans Chrome, scripts contrôlés
syntaxiquement, contrôleurs de qualité testés sur le site en ligne.

> **État actuel du site (contrôle du 15/11/2026) : 3/13 contrôles réussis.**
> Après déploiement de ce dossier, l'objectif est **13/13**.

---

## 1. Ce que contient le dossier

```
qualite-site/
├─ a-televerser-a-la-racine/          → à déposer dans public_html/
│   ├─ mentions-legales.html
│   ├─ confidentialite.html
│   ├─ cgu.html
│   ├─ 404.html
│   ├─ robots.txt
│   ├─ sitemap.xml
│   └─ .htaccess
├─ b-remplacer-dans-assets-js/        → à déposer dans public_html/assets/js/
│   ├─ app.js
│   └─ auth.js
├─ c-outils/
│   └─ verifier-site.ps1              → contrôle automatique après déploiement
├─ apercus/                           → captures de contrôle (avant mise en ligne)
├─ GUIDE-DEPLOIEMENT.md               → ce document
└─ LIRE-MOI.md
```

Aucun fichier existant n'est écrasé sans sauvegarde : la procédure ci-dessous commence par elle.

---

## 2. Avant tout : sauvegarder (5 minutes)

Dans **hPanel → Sites → Gérer → Fichiers → Gestionnaire de fichiers** :

1. Téléchargez et conservez une copie de :
   - `public_html/.htaccess` (s'il existe) ;
   - `public_html/assets/js/app.js` ;
   - `public_html/assets/js/auth.js`.
2. Notez la date de la sauvegarde. En cas de problème, il suffit de remettre ces trois fichiers.

> Le `.htaccess` peut contenir des règles imposées par Hostinger (redirections, PHP, cache).
> **Ne l'écrasez pas à l'aveugle** : ouvrez-le et comparez avec celui fourni. Si Hostinger y a déjà
> des règles, fusionnez au lieu de remplacer (voir § 5).

---

## 3. Informations légales (déjà intégrées)

Les pages sont remplies avec les informations de l'éditeur :

- **Éditeur :** Bienvenu Aholou, personne physique
- **Adresse :** BP 00225, Abidjan, Côte d'Ivoire
- **Contact :** aholoubienvenu296@gmail.com
- **Directeur de la publication :** Bienvenu Aholou
- **Droit applicable :** droit ivoirien (tribunaux d'Abidjan)
- **Données personnelles :** loi ivoirienne n° 2013-450 du 19 juin 2013, ARTCI ; RGPD en complément pour les visiteurs de l'Union européenne

Deux améliorations possibles plus tard, sans urgence :

1. **Créer une adresse du domaine** (`contact@bienvenueduc.com`) dans hPanel → E-mails, puis remplacer
   l'adresse Gmail dans les pages. Une adresse professionnelle inspire davantage confiance.
2. **Ajouter un numéro RCCM** si vous immatriculez l'activité : il suffit de compléter la ligne
   « Immatriculation » dans `mentions-legales.html`.

---

## 4. Déploiement (15 minutes)

### 4.1 Fichiers à la racine

Le plus simple : téléversez **`zips/1-pages-web.zip`** dans `public_html/`, puis utilisez
l'action **Extraire** du gestionnaire de fichiers (veillez à être bien dans `public_html`).
Le ZIP contient les 6 fichiers à la racine ; **supprimez ensuite le ZIP** pour qu'il ne soit pas
téléchargeable. Les fichiers peuvent aussi être déposés un par un.

### 4.2 Scripts corrigés

Téléversez **`zips/3-scripts.zip`** dans `public_html/` et extrayez-le : il replace automatiquement
`assets/js/app.js` et `assets/js/auth.js`. Supprimez ensuite le ZIP.

Ces deux fichiers apportent :

- **pied de page membre** : colonne « Informations » avec les liens Mentions légales,
  Confidentialité, Conditions d'utilisation, + mention de l'hébergeur ;
- **page de connexion** : liens légaux dans le pied de page, **case de consentement** ajoutée au
  formulaire d'inscription (avec liens cliquables), blocage de l'inscription si elle n'est pas cochée ;
- correction de la formulation sur les données (« enregistrées dans votre compte » au lieu de
  « restent dans votre navigateur ») et de la coquille « acceder a cet espace ».

> Les deux scripts sont **rétro-compatibles** : aucune autre fonction n'a été modifiée. Ils ont été
> contrôlés avec `node --check` et testés dans Chrome (desktop 1440 px et mobile 390 px).

### 4.3 Vider les caches

hPanel → Performance → **Vider le cache** (et le cache CDN s'il est activé), puis rechargez le site
avec `Ctrl + F5`. Les assets sont servis avec un cache de 7 jours : sans purge, vous verriez
l'ancienne version.

---

## 5. Le fichier `.htaccess` : mode d'emploi

Le fichier fourni active :

| Règle | Effet |
|---|---|
| Redirection HTTPS + suppression du `www` | une seule adresse canonique `https://bienvenueduc.com` |
| `Strict-Transport-Security` | force le navigateur à rester en HTTPS |
| `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options` | protections standard |
| `Header unset X-Powered-By` | ne révèle plus la version de PHP |
| `ErrorDocument 404 /404.html` | page d'erreur soignée |
| Compression + cache | performance |
| Blocage `.env`, `.sql`, `.md`, archives… | empêche le téléchargement de fichiers sensibles |

**Si un `.htaccess` existait déjà** : copiez son contenu, puis ajoutez les blocs du fichier fourni
qui ne sont pas déjà présents. Les doublons de redirection sont sans gravité, mais un `RewriteRule`
mal fusionné peut casser le site : testez immédiatement après (voir § 6).

**HSTS** : la directive est volontairement sans `includeSubDomains`. Ne l'ajoutez que si tous vos
sous-domaines sont en HTTPS.

---

## 6. Recette après déploiement

### Automatique

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File c-outils/verifier-site.ps1
```

Attendu : **13/13**. Le script contrôle les pages légales, `robots.txt`, `sitemap.xml`, la 404
personnalisée, les redirections, les en-têtes de sécurité, la présence des correctifs dans
`app.js`/`auth.js` et l'API de contenu.

### Manuelle (5 minutes)

1. Ouvrez `https://bienvenueduc.com/mentions-legales.html`, puis les deux autres pages légales :
   mise en page correcte, liens du pied de page fonctionnels, aucun texte `à compléter`.
2. Page de connexion : les liens légaux apparaissent en bas ; onglet **Inscription** : la case de
   consentement est visible, l'inscription est bloquée si on ne la coche pas.
3. Connectez-vous : le pied de page des pages membres contient la colonne « Informations » et la
   mention « Hébergé par Hostinger International Ltd. ».
4. Test mobile (largeur 390 px) : pas de débordement horizontal.
5. `https://www.bienvenueduc.com` doit rediriger vers `https://bienvenueduc.com`.
6. Une URL inexistante doit afficher la page 404 personnalisée.

---

## 7. En cas de problème (retour arrière)

1. Remettez les trois fichiers sauvegardés (`app.js`, `auth.js`, `.htaccess`).
2. Supprimez les fichiers ajoutés (pages légales, `robots.txt`, `sitemap.xml`, `404.html`).
3. Videz le cache.

Aucune donnée utilisateur n'est concernée : ces changements sont uniquement des fichiers statiques.

---

## 8. Après le déploiement : les prochaines étapes

Ces points ne peuvent pas être traités sans le code PHP et la base de données. Ce sont les
suivants dans l'ordre de priorité :

1. **Synchroniser le dossier local avec la production** : récupérer `api/*.php`, le schéma SQL et
   les gabarits PHP, puis initialiser un dépôt Git. Aujourd'hui, le dossier `Espace sepsHaness`
   contient une version statique antérieure : un redéploiement écraserait le site actuel.
2. **Mot de passe oublié** : table de jetons à durée limitée, envoi d'e-mail, page de réinitialisation.
3. **Vérification de l'adresse e-mail** à l'inscription (lien de confirmation).
4. **Consentement côté serveur** : enregistrer la date et la version des CGU acceptées (preuve),
   et refuser l'inscription sans consentement dans `api/auth.php`.
5. **Limitation de débit** sur les endpoints de connexion et d'inscription (anti-force brute).
6. **SEO de contenu** : une page publique de présentation du catalogue (indexable) et un vrai
   sitemap enrichi, pour sortir du « mur de connexion ».
7. **Durcissement** : CSP adaptée (sans casser les scripts inline), HTTP/3, journalisation.

Ces évolutions sont à faire dans le code de production, avec sauvegarde et recette à chaque étape.
