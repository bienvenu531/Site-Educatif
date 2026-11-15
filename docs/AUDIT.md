# Audit — SepsHaness / bienvenueduc.com

**Date :** 15 novembre 2026
**Périmètre :** dépôt local, site en production, rendu navigateur, SEO, accessibilité, performance,
sécurité, déploiement.
**Version auditée :** commit `41c071d`, déployé automatiquement le 15 novembre 2026 à 19:36.

---

## 1. Synthèse

Le projet est **cohérent et fonctionnel** : les 12 pages se chargent sans erreur JavaScript, aucun
débordement horizontal n'est mesuré de 360 à 1440 px, les 9 parcours interactifs testés fonctionnent,
et le contrôle automatisé passe **29/29**. En production, la recette passe **24/24** depuis le
déploiement automatique du 15 novembre 2026 à 19:36.

Deux points restent ouverts :

1. **Le contraste du texte secondaire** en thème clair : `--c-texte-faible` (#79839a) atteint
   **3,52:1** sur le fond et **3,80:1** sur les cartes, sous le seuil WCAG AA de 4,5:1.
2. **Le SEO du catalogue** : les cours, documents et leçons sont rendus par JavaScript. Les pages
   HTML ne contiennent que la coquille, ce qui limite l'indexation du contenu.

Le reste est propre : contenu vérifié (19 cours, 12 documents, 76 questions), aucun lien cassé,
thème sombre opérationnel, fonctionnement en `file://`, pages légales complètes et liens de pied de
page sur toutes les pages. La mise en ligne (pages légales, 404, `robots.txt`, `sitemap.xml`,
`.htaccess`, assets versionnés) est **faite**.

---

## 2. Méthode

| Contrôle | Outil | Résultat |
|---|---|---|
| Structure, liens, versions, syntaxe, données, `Store`, SEO | `npm test` (`tools/check.mjs`) | **29 réussites, 0 erreur** |
| Rendu navigateur, responsive, erreurs console, interactions | `npm run qa` (`tools/qa.mjs`, Chrome/CDP) | **36 mesures, 0 problème ; 9/9 interactions** |
| Accessibilité DOM (IDs, labels, boutons, liens) | audit CDP ad hoc | **0 anomalie** |
| Thème sombre des pages autonomes | audit CDP ad hoc | **fonctionnel** |
| Fonctionnement `file://` | Chrome headless | **fonctionnel** |
| Poids et compression des pages | mesure locale + gzip | voir § 3.4 |
| Contrastes des jetons | calcul WCAG | 1 écart en thème clair |
| Site en production | `npm run verifier:prod` | **24 réussites / 0 erreur** (déploiement automatique du 15/11 à 19:36) |

Limites : pas de Lighthouse ni d'axe-core (non installés), pas de test sur appareil physique, pas de
test de charge ni de test d'intrusion. Les mesures sont faites dans Chrome sur Windows.

---

## 3. Constats détaillés

### 3.1 Fonctionnel et navigateur — conforme

- 12 pages mesurées à **1440 px, 390 px et 360 px** : `scrollWidth == innerWidth` partout.
- **0 erreur JavaScript** sur les 36 chargements.
- En-tête et pied de page présents sur toutes les pages.
- Interactions validées : filtre « Lycée » (19 → 7 cours), recherche « fraction » (1 résultat),
  lecteur Markdown, fermeture par `Échap`, quiz corrigé et enregistré, leçon terminée avec temps,
  création de note, enregistrement du profil, tableau de bord alimenté.
- `index.html`, `suivi.html` et `confidentialite.html` s'ouvrent aussi en **`file://`**, avec les
  assets versionnés (`?v=…`) : la contrainte du contrat est respectée.
- Les pages légales et la 404 ont été ajoutées au contrôle navigateur.

### 3.2 Accessibilité — un écart de contraste

Conforme :

- un seul `<h1>` par page, hiérarchie de titres, `lang="fr"` ;
- lien d'évitement, focus visible, navigation clavier ;
- **0 champ sans nom accessible**, **0 bouton ou lien sans nom**, **0 image sans `alt`**,
  **0 ID dupliqué**, aucun élément focusable dans un conteneur `aria-hidden` ;
- `prefers-reduced-motion` géré dans `base.css` ;
- tableaux légaux avec `<th scope="col">` et en-têtes explicites.

Écart :

| Jeton | Usage | Contraste | Seuil | Verdict |
|---|---|---|---|---|
| `--c-texte-faible` #79839a | métadonnées, `.micro`, pied de page | **3,52:1** (fond) / **3,80:1** (carte) | 4,5:1 | **À corriger** |
| `--c-texte-doux` #4a5468 | texte courant secondaire | 7,61:1 | 4,5:1 | conforme |
| `--c-texte` #13182a | texte principal | 16,33:1 | 4,5:1 | conforme |
| `--c-sur-primaire` sur `--c-primaire` | boutons primaires | 6,04:1 | 4,5:1 | conforme |

Tous les jetons du **thème sombre** passent (minimum 5,04:1).

**Correction proposée :** remplacer `--c-texte-faible: #79839a` par **`#5f6a80`**
(5,04:1 sur le fond, 5,44:1 sur les cartes) dans `assets/css/base.css`. Ce changement touche le
design system : il doit être validé visuellement, puis les captures `docs/apercus/` régénérées.

### 3.3 SEO — socle en place, contenu dépendant de JavaScript

En place :

- titres et descriptions **uniques** sur les 12 pages, canonical sur 11 pages (la page `lecon.html`
  est volontairement exclue : son contenu dépend de `?cours=`) ;
- `robots.txt` avec sitemap, `sitemap.xml` valide (10 URL, fichiers présents) ;
- 404 personnalisée avec `noindex, follow` ;
- `meta description`, Open Graph sur les pages légales, `theme-color` cohérent.

Limites :

- `cours.html`, `bibliotheque.html`, `parcours.html` et `lecon.html` n'affichent leur contenu
  qu'après exécution du JavaScript. Le HTML ne contient pas la liste des 19 cours ni le texte des
  leçons ; les moteurs doivent rendre la page pour l'indexer.
- Les 19 leçons ne figurent pas dans le sitemap (URL à paramètre, contenu non pré-rendu).
- Pas de données structurées (`Course`, `EducationalOrganization`), pas de `og:` sur les pages
  applicatives.

**Recommandation structurante :** générer à la mise en ligne des pages HTML statiques par cours
(ou au moins une page catalogue pré-rendue) à partir des données `assets/js/data/*.js`. C'est le
chantier qui aurait le plus d'effet sur le référencement.

### 3.4 Performance — correcte, perfectible

| Page | Poids brut | Poids gzip | Fichiers |
|---|---|---|---|
| accueil | 361,4 Ko | 101,1 Ko | 14 |
| cours | 363,7 Ko | 101,6 Ko | 14 |
| leçon | 394,6 Ko | 106,7 Ko | 14 |
| espace de travail | 422,1 Ko | 112,0 Ko | 14 |
| mentions légales | 58,7 Ko | 13,6 Ko | 5 |
| 404 | 51,8 Ko | 11,5 Ko | 5 |

- 18 fichiers JS (478,8 Ko) et 5 fichiers CSS (110,5 Ko) au total.
- **Toutes les pages applicatives chargent les 5 fichiers de données** (~205 Ko brut : cours et
  documents des deux domaines), même `profil.html` ou `espace-travail.html`.
- Aucune requête externe, aucune police distante : bon pour la confidentialité et la latence.
- Le `.htaccess` prévu compresse et met en cache les assets versionnés un an, HTML en `no-cache`.

**Recommandations :** découper le chargement des données selon la page (le catalogue n'est pas
nécessaire au profil ni au minuteur), minifier CSS/JS à la mise en ligne (gain ~25-35 % avant gzip),
et envisager `defer` n'est pas nécessaire (scripts en fin de `body`).

### 3.5 Sécurité — bon socle, CSP à ajouter

- Site statique : pas de serveur applicatif, pas de base de données, pas de formulaire envoyé.
- Rendu Markdown échappé (`MD.inline` testé avec `<script>`), pas d'injection `innerHTML` non
  échappée dans les données utilisateur.
- `.htaccess` prêt : HTTPS forcé, HSTS, `nosniff`, `Referrer-Policy`, `Permissions-Policy`,
  `X-Frame-Options`, `X-Powered-By` retiré, dossiers `tools/` et `docs/` bloqués, extensions
  sensibles refusées.
- **Pas de Content-Security-Policy.** Elle est possible car il n'y a aucun script inline :
  `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;
  object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'`.
  À tester avant activation (les styles inline des jauges nécessitent `'unsafe-inline'` en style).
- Résidus probables en production : `assets/js/auth.js` et un éventuel dossier `api/` de l'ancienne
  version avec comptes. À supprimer après sauvegarde ; ils ne sont plus appelés.

### 3.6 Déploiement et cache — conforme

Le dépôt est relié au **déploiement automatique Hostinger** : le push du commit `41c071d` a publié
le site le **15 novembre 2026 à 19:36** (`Last-Modified` identique sur toutes les pages). Vérifications :

- pages légales, 404, `robots.txt`, `sitemap.xml` → 200 ; URL inconnue → 404 avec la page
  personnalisée ;
- en-têtes HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`,
  `Permissions-Policy` présents ; `X-Powered-By` absent ;
- `www` → **301** vers l'apex ; assets versionnés (13/13) identiques au dépôt (SHA-256),
  `app.js?v=…` porte bien la coquille SepsHaness ;
- `tools/`, `docs/`, `package.json`, `server.mjs`, `.gitignore` → **403** ;
- `npm run verifier:prod` : **24/24**.

L'ancienne URL `/assets/js/app.js` sans `?v=` a pu rester en cache CDN à certains moments ; les pages
ne l'utilisent plus, le versionnement rend ce résidu inoffensif. Une purge Hostinger reste recommandée
après un déploiement important pour les visiteurs qui auraient d'anciennes pages en cache.

### 3.7 Contenu et qualité — conforme

- 19 cours et 12 documents conformes au catalogue du contrat.
- 76 questions de quiz, explications présentes, 25 % de bonnes réponses en première position
  (anti-biais).
- ~14 761 mots de contenu pédagogique hors structure.
- `Store` vérifié : progression, badges, notes, tâches, objectifs, sessions, export/import.
- Aucun « lorem ipsum », aucun « à compléter », aucun texte « Excellence » restant.

### 3.8 Documentation et maintenance — corrigé

- `README.md` réécrit (présentation, stack, démarrage, scripts, structure, déploiement, contact).
- [docs/DEPLOIEMENT.md](DEPLOIEMENT.md) ajouté (sauvegarde, envoi, purge, recette, retour arrière).
- `docs/CONTRAT.md` mis à jour (pages autonomes, outils, `legal.css`, `theme.js`).
- Dossier `qualite-site/` supprimé : il ciblait l'ancienne version « Excellence » avec comptes PHP
  et aurait régressé le site s'il avait été déployé.
- `.gitignore`, scripts npm (`qa`, `versionner`, `verifier:prod`, `avant-mise-en-ligne`) ajoutés.

---

## 4. Actions réalisées dans cette passe

| Chantier | Livrables |
|---|---|
| **A — Cache et mise en ligne** | `tools/versionner.mjs`, `?v=<SHA-256>` sur 104 références applicatives (120 au total), `.htaccess` (HTTPS, HSTS, cache, 404, blocages), `tools/verifier-prod.mjs`, `npm run verifier:prod`, `tools/preparer-zip.ps1` (ZIP de 39 entrées, chemins normalisés), procédure de purge et recette |
| **B — Qualité et conformité** | `mentions-legales.html`, `confidentialite.html`, `cgu.html`, `404.html`, `robots.txt`, `sitemap.xml`, `assets/css/legal.css`, `assets/js/theme.js`, liens légaux dans le pied de page de toutes les pages, canonical, contrôles SEO automatisés |
| **C — Dépôt** | `README.md`, `docs/DEPLOIEMENT.md`, mise à jour du contrat, suppression de `qualite-site/`, `.gitignore`, scripts npm, métadonnées `package.json` |
| **D — Audit** | contrôle navigateur étendu aux pages légales et à la 404, mesures de poids, contrastes, audit DOM, test `file://`, thème sombre, ce rapport |

---

## 5. Reste à faire, par priorité

La mise en ligne est faite (commit `41c071d`, publié le 15/11 à 19:36, recette 24/24). Restent :

1. **Corriger le contraste** de `--c-texte-faible` (#5f6a80), régénérer les captures, revérifier.
2. **Pré-rendre le catalogue** (au moins `cours.html`) et, à terme, générer une page HTML par leçon
   pour sortir du rendu 100 % JavaScript côté SEO.
3. **Ajouter la CSP** après test sur une préproduction ou en commentaire dans `.htaccess`.
4. **Décider de la marque et du domaine** : « SepsHaness » est le nom affiché, `bienvenueduc.com`
   reste l'adresse. Toute évolution doit mettre à jour canonical, sitemap, robots et `.htaccess`.
5. **Créer une adresse e-mail du domaine** (`contact@bienvenueduc.com`) pour remplacer le Gmail des
   pages légales, et compléter le RCCM si l'activité est immatriculée.
6. **Supprimer les résidus PHP** (`auth.js`, `api/`) en production, après sauvegarde.
7. **Minifier** CSS/JS à la mise en ligne et **découper** le chargement des données par page.
8. **Purger le cache Hostinger** une dernière fois si l'ancienne URL `/assets/js/app.js` sans `?v=`
   reste servie : sans effet sur les pages, mais cela évite toute confusion lors d'un contrôle.

---

## 6. Reproductibilité

```powershell
npm test                 # 29 contrôles
npm start                # serveur local 127.0.0.1:4173
npm run qa               # 36 mesures, 22 captures, 9 interactions
npm run versionner       # met à jour les ?v= si un asset a changé
powershell -NoProfile -ExecutionPolicy Bypass -File tools/preparer-zip.ps1
npm run verifier:prod    # contrôle du site en ligne
```
