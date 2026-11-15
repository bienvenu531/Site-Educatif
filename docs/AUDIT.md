# Audit — SepsHaness / bienvenueduc.com

**Date :** 15 novembre 2026
**Périmètre :** dépôt local, site en production, rendu navigateur, SEO, accessibilité, performance,
sécurité, déploiement.
**Version auditée :** site publié automatiquement le 15 novembre 2026, après les passes
« qualité/déploiement » puis « contraste/pré-rendu ».

---

## 1. Synthèse

Le projet est **cohérent et fonctionnel** : les 12 pages se chargent sans erreur JavaScript, aucun
débordement horizontal n'est mesuré de 360 à 1440 px, les 9 parcours interactifs testés fonctionnent,
et le contrôle automatisé passe **30/30**. En production, la recette passe **24/24** depuis le
déploiement automatique du 15 novembre 2026 à 19:36.

Un point structurant reste ouvert : **le SEO des leçons**. Le catalogue est désormais **pré-rendu**
(19 cours et 12 documents dans le HTML, vérifiés sans JavaScript), mais `lecon.html` et
`parcours.html` restent rendus par JavaScript.

Le reste est propre : contenu vérifié (19 cours, 12 documents, 76 questions), aucun lien cassé,
**contraste corrigé** (`--c-texte-faible` #5f6a80, 5,04:1 minimum), thème sombre opérationnel,
fonctionnement en `file://`, pages légales complètes et liens de pied de page sur toutes les pages.
La mise en ligne (pages légales, 404, `robots.txt`, `sitemap.xml`, `.htaccess`, assets versionnés)
est **faite**.

---

## 2. Méthode

| Contrôle | Outil | Résultat |
|---|---|---|
| Structure, liens, versions, syntaxe, données, `Store`, SEO | `npm test` | **30 réussites, 0 erreur** |
| Pré-rendu du catalogue | `node tools/prerendre.mjs --verifier` | **19 cours et 12 documents à jour** |
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

### 3.2 Accessibilité — conforme

Contrôles :

- un seul `<h1>` par page, hiérarchie de titres, `lang="fr"` ;
- lien d'évitement, focus visible, navigation clavier ;
- **0 champ sans nom accessible**, **0 bouton ou lien sans nom**, **0 image sans `alt`**,
  **0 ID dupliqué**, aucun élément focusable dans un conteneur `aria-hidden` ;
- `prefers-reduced-motion` géré dans `base.css` ;
- tableaux légaux avec `<th scope="col">` et en-têtes explicites.

Contrastes (thème clair) :

| Jeton | Usage | Contraste | Seuil | Verdict |
|---|---|---|---|---|
| `--c-texte-faible` #5f6a80 | métadonnées, `.micro`, pied de page | **5,04:1** (fond) / **5,44:1** (carte) | 4,5:1 | conforme |
| `--c-texte-doux` #4a5468 | texte courant secondaire | 7,61:1 | 4,5:1 | conforme |
| `--c-texte` #13182a | texte principal | 16,33:1 | 4,5:1 | conforme |
| `--c-sur-primaire` sur `--c-primaire` | boutons primaires | 6,04:1 | 4,5:1 | conforme |

Tous les jetons du **thème sombre** passent (minimum 5,04:1).

La valeur `--c-texte-faible` a été corrigée le 15 novembre 2026 (#79839a → **#5f6a80**) et les
captures `docs/apercus/` ont été régénérées.

### 3.3 SEO — catalogue pré-rendu, leçons encore dynamiques

En place :

- titres et descriptions **uniques** sur les 12 pages, canonical sur 11 pages (la page `lecon.html`
  est volontairement exclue : son contenu dépend de `?cours=`) ;
- **catalogue pré-rendu** : `cours.html` contient dans son HTML les 19 cartes (titre, résumé, lien
  vers la leçon) et `bibliotheque.html` les 12 documents (titre, description, lien) ; vérifié avec
  JavaScript désactivé (19 cartes, liens corrects, largeur 336 px à 360 px) ;
- `robots.txt` avec sitemap, `sitemap.xml` valide (10 URL, fichiers présents) ;
- 404 personnalisée avec `noindex, follow` ;
- `meta description`, Open Graph sur les pages légales, `theme-color` cohérent.

Limites :

- `lecon.html` et `parcours.html` restent rendus par JavaScript : les 19 leçons ne sont pas dans le
  HTML et ne figurent pas dans le sitemap ; les moteurs doivent exécuter le script pour les indexer.
- Pas de données structurées (`Course`, `EducationalOrganization`), pas de `og:` sur les pages
  applicatives.

**Prochaine étape structurante :** générer une page HTML statique par leçon (à partir des mêmes
données), l'ajouter au sitemap et, si utile, un balisage `Course`. Le catalogue, lui, est fait.

### 3.4 Performance — correcte, perfectible

| Page | Poids brut | Poids gzip | Fichiers |
|---|---|---|---|
| accueil | 361,4 Ko | 101,1 Ko | 14 |
| cours | 394,6 Ko | 104,3 Ko | 14 |
| bibliothèque | 377,8 Ko | 104,1 Ko | 14 |
| leçon | 394,6 Ko | 106,7 Ko | 14 |
| espace de travail | 422,1 Ko | 112,0 Ko | 14 |
| mentions légales | 58,7 Ko | 13,6 Ko | 5 |
| 404 | 51,8 Ko | 11,5 Ko | 5 |

- Le pré-rendu ajoute **31 Ko brut / 2,7 Ko gzip** à `cours.html` et **11 Ko brut / 1,8 Ko gzip** à
  `bibliotheque.html` : négligeable après compression.
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
  `X-Frame-Options`, `X-Powered-By` retiré, dossiers `tools/`, `docs/`, `.git/` et `.vscode/`
  bloqués (403 vérifié), extensions sensibles refusées.
- **Pas de Content-Security-Policy.** Elle est possible car il n'y a aucun script inline :
  `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;
  object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'`.
  À tester avant activation (les styles inline des jauges nécessitent `'unsafe-inline'` en style).
- Résidus probables en production : `assets/js/auth.js` et un éventuel dossier `api/` de l'ancienne
  version avec comptes. À supprimer après sauvegarde ; ils ne sont plus appelés.

### 3.6 Déploiement et cache — conforme

Le dépôt est relié au **déploiement automatique Hostinger** : chaque push sur `main` publie le site
(publications constatées à 19:36 et 19:42, puis lors de la passe contraste/pré-rendu).
Vérifications :

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
- [docs/DEPLOIEMENT.md](DEPLOIEMENT.md) ajouté (sauvegarde, envoi, purge, recette, retour arrière,
  déploiement automatique).
- `docs/CONTRAT.md` mis à jour (pages autonomes, outils, `legal.css`, `theme.js`, pré-rendu).
- `tools/prerendre.mjs` : catalogue statique pour `cours.html` et `bibliotheque.html`, contrôle
  d'obsolescence intégré à `npm test`.
- Contraste corrigé dans `base.css` (`--c-texte-faible` #5f6a80) et captures régénérées.
- Dossier `qualite-site/` supprimé : il ciblait l'ancienne version « Excellence » avec comptes PHP
  et aurait régressé le site s'il avait été déployé.
- `.gitignore`, scripts npm (`qa`, `prerendre`, `versionner`, `verifier:prod`,
  `avant-mise-en-ligne`) ajoutés.

---

## 4. Actions réalisées dans cette passe

| Chantier | Livrables |
|---|---|
| **A — Cache et mise en ligne** | `tools/versionner.mjs`, `?v=<SHA-256>` sur 104 références applicatives (120 au total), `.htaccess` (HTTPS, HSTS, cache, 404, blocages), `tools/verifier-prod.mjs`, `npm run verifier:prod`, `tools/preparer-zip.ps1` (ZIP de 39 entrées, chemins normalisés), procédure de purge et recette |
| **B — Qualité et conformité** | `mentions-legales.html`, `confidentialite.html`, `cgu.html`, `404.html`, `robots.txt`, `sitemap.xml`, `assets/css/legal.css`, `assets/js/theme.js`, liens légaux dans le pied de page de toutes les pages, canonical, contrôles SEO automatisés |
| **C — Dépôt** | `README.md`, `docs/DEPLOIEMENT.md`, mise à jour du contrat, suppression de `qualite-site/`, `.gitignore`, scripts npm, métadonnées `package.json` |
| **D — Audit** | contrôle navigateur étendu aux pages légales et à la 404, mesures de poids, contrastes, audit DOM, test `file://`, thème sombre, ce rapport |
| **E — Contraste et pré-rendu** | `--c-texte-faible` #5f6a80 (5,04:1 minimum), `tools/prerendre.mjs` (19 cours + 12 documents dans le HTML), vérification sans JavaScript, captures régénérées |

---

## 5. Reste à faire, par priorité

La mise en ligne est faite (déploiement automatique, recette 24/24). Le contraste et le pré-rendu du
catalogue sont faits. Restent :

1. **Pré-rendre les leçons** : générer une page HTML par cours (à partir des mêmes données), les
   ajouter au sitemap et, si utile, un balisage `Course`. Le catalogue est déjà couvert.
2. **Ajouter la CSP** après test sur une préproduction ou en commentaire dans `.htaccess`.
3. **Décider de la marque et du domaine** : « SepsHaness » est le nom affiché, `bienvenueduc.com`
   reste l'adresse. Toute évolution doit mettre à jour canonical, sitemap, robots et `.htaccess`.
4. **Créer une adresse e-mail du domaine** (`contact@bienvenueduc.com`) pour remplacer le Gmail des
   pages légales, et compléter le RCCM si l'activité est immatriculée.
5. **Supprimer les résidus PHP** (`auth.js`, `api/`) en production, après sauvegarde.
6. **Minifier** CSS/JS à la mise en ligne et **découper** le chargement des données par page.
7. **Purger le cache Hostinger** une dernière fois si l'ancienne URL `/assets/js/app.js` sans `?v=`
   reste servie : sans effet sur les pages, mais cela évite toute confusion lors d'un contrôle.

---

## 6. Reproductibilité

```powershell
npm test                 # pré-rendu + 30 contrôles
npm start                # serveur local 127.0.0.1:4173
npm run qa               # 36 mesures, 22 captures, 9 interactions
npm run prerendre        # régénère le catalogue statique
npm run versionner       # met à jour les ?v= si un asset a changé
powershell -NoProfile -ExecutionPolicy Bypass -File tools/preparer-zip.ps1
npm run verifier:prod    # contrôle du site en ligne
```
