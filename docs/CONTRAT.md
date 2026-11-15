# Contrat technique — SepsHaness (site éducatif)

Document de référence **obligatoire** pour tous les intervenants du projet.
Lire ce contrat en entier avant d'écrire une ligne. Il définit les fichiers, leur propriétaire,
le design system, le schéma de données et les API partagées.

---

## 1. Le produit

**SepsHaness** est un espace d'apprentissage en français pour les élèves (primaire, collège, lycée)
et les étudiants (université). Fonctionnalités :

- **Parcours** par niveau et par matière, avec progression.
- **Cours** consultables : objectifs, sections de cours, encadrés, exemples, quiz noté.
- **Bibliothèque de documents** : fiches, méthodes, formulaires, annales, cartes mentales — consultables
  dans un lecteur intégré (rendu Markdown).
- **Espace de travail** : notes personnelles, tâches, planning, minuteur de concentration, objectifs.
- **Suivi** : tableau de bord, progression par matière, temps d'étude, série de jours, scores de quiz, badges.
- **Profil** : niveau, objectif hebdomadaire, thème clair/sombre, export/import, réinitialisation.

Le site est **100 % statique**, sans dépendance externe, sans build, sans CDN : HTML + CSS + JavaScript
vanilla, données en fichiers JS, persistance en `localStorage`. Il doit fonctionner en ouvrant
`index.html` (`file://`) **et** via le petit serveur `node server.mjs`.
Un pré-rendu optionnel (`tools/prerendre.mjs`) écrit le catalogue dans le HTML avant déploiement ;
il ne change rien au fonctionnement ni à l'absence de build au runtime.

## 2. Arborescence et propriétaires

```
Espace sepsHaness/
├─ index.html                       LEAD            accueil
├─ parcours.html                    PAGES-A
├─ cours.html                       PAGES-A
├─ bibliotheque.html                PAGES-A
├─ lecon.html                       PAGES-B
├─ espace-travail.html              PAGES-B
├─ suivi.html                       PAGES-B
├─ profil.html                      PAGES-B
├─ mentions-legales.html            LEAD   (page autonome, ajout 15/11/2026)
├─ confidentialite.html             LEAD   (page autonome, ajout 15/11/2026)
├─ cgu.html                         LEAD   (page autonome, ajout 15/11/2026)
├─ 404.html                         LEAD   (page autonome, chemins absolus)
├─ robots.txt, sitemap.xml          LEAD   (référencement)
├─ .htaccess                        LEAD   (HTTPS, sécurité, cache, 404)
├─ server.mjs                       LEAD
├─ README.md                        LEAD
├─ docs/CONTRAT.md                  LEAD
├─ docs/DEPLOIEMENT.md              LEAD   (procédure Hostinger et recette)
├─ assets/
│  ├─ css/
│  │  ├─ base.css                   LEAD   (design system — NE PAS MODIFIER)
│  │  ├─ catalogue.css              PAGES-A
│  │  ├─ perso.css                  PAGES-B
│  │  └─ legal.css                  LEAD   (pages autonomes)
│  ├─ js/
│  │  ├─ markdown.js                LEAD   (mini moteur Markdown)
│  │  ├─ store.js                   LEAD   (localStorage + API progression)
│  │  ├─ app.js                     LEAD   (coquille, icônes, helpers, modale, toast)
│  │  ├─ theme.js                   LEAD   (thème des pages autonomes)
│  │  ├─ accueil.js                 LEAD
│  │  ├─ data/core.js               LEAD   (niveaux, matières, parcours, badges, témoignages)
│  │  ├─ data/cours-stem.js         CONTENU-STEM
│  │  ├─ data/cours-lettres.js      CONTENU-LETTRES
│  │  ├─ data/documents-stem.js     CONTENU-STEM
│  │  ├─ data/documents-lettres.js  CONTENU-LETTRES
│  │  ├─ data.js                    LEAD   (agrégation → window.APP_DATA)
│  │  ├─ parcours.js                PAGES-A
│  │  ├─ cours.js                   PAGES-A
│  │  ├─ bibliotheque.js            PAGES-A
│  │  ├─ lecon.js                   PAGES-B
│  │  ├─ espace-travail.js          PAGES-B
│  │  ├─ suivi.js                   PAGES-B
│  │  └─ profil.js                  PAGES-B
│  └─ img/favicon.svg               LEAD
└─ tools/ (vérifications)           LEAD
   ├─ check.mjs
   ├─ qa.mjs
   ├─ prerendre.mjs
   ├─ versionner.mjs
   ├─ verifier-prod.mjs
   └─ preparer-zip.ps1
```

**Chacun n'écrit que ses fichiers.** Ne jamais modifier un fichier d'un autre propriétaire, ni
`base.css`, `app.js`, `store.js`, `markdown.js`, `data.js`, `data/core.js`, `index.html`.

**Pré-rendu :** les blocs entre `<!-- prerendu:debut -->` et `<!-- prerendu:fin -->` de `cours.html`
et `bibliotheque.html` sont générés par `tools/prerendre.mjs`. Ne pas les modifier à la main :
modifier les données puis lancer `npm run prerendre`.

## 3. Conventions de code

- Encodage **UTF-8**, accentuation française correcte, `lang="fr"`.
- HTML5 sémantique : `header`, `nav`, `main`, `section`, `aside`, `footer`, `h1` unique par page,
  hiérarchie de titres continue.
- JS : modules IIFE (`(function () { ... })();`), `"use strict";`, pas de modules ES (pas de
  `type="module"`, le site doit marcher en `file://`). ES2020 maximum.
- Variables/classes CSS : noms français, kebab-case pour les classes, préfixe de page obligatoire
  pour tout style propre à une page (PAGES-A : `cat-`, PAGES-B : `perso-`).
- **Interdits** : framework, CDN, police distante, image distante, `innerHTML` avec des données
  utilisateur non échappées (utiliser `App.escape`), `alert`, `document.write`.
- Accessibilité : contrastes suffisants (les tokens sont prévus), `aria-label` sur les boutons
  icône seule, focus visible, modale fermable avec `Échap`, formulaires avec `<label>`.
- Responsive : testable à 360 px, 768 px, 1280 px. Pas de scroll horizontal.
- Argent/notes : écrire en français (ex. « 12 min », « 2 h 15 », « 75 % »).

## 4. Squelette HTML imposé

Toute page interne (`parcours`, `cours`, `bibliotheque`, `lecon`, `espace-travail`, `suivi`, `profil`) :

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Cours — SepsHaness</title>
  <meta name="description" content="…" />
  <link rel="icon" href="assets/img/favicon.svg" />
  <link rel="stylesheet" href="assets/css/base.css" />
  <link rel="stylesheet" href="assets/css/catalogue.css" />   <!-- ou perso.css -->
</head>
<body data-page="cours">                          <!-- identifiant de page pour le menu -->
  <div id="app-header"></div>
  <main id="contenu">
    <!-- contenu de la page -->
  </main>
  <div id="app-footer"></div>

  <script src="assets/js/markdown.js"></script>
  <script src="assets/js/data/core.js"></script>
  <script src="assets/js/data/cours-stem.js"></script>
  <script src="assets/js/data/cours-lettres.js"></script>
  <script src="assets/js/data/documents-stem.js"></script>
  <script src="assets/js/data/documents-lettres.js"></script>
  <script src="assets/js/data.js"></script>
  <script src="assets/js/store.js"></script>
  <script src="assets/js/app.js"></script>
  <script src="assets/js/cours.js"></script>       <!-- le JS de votre page -->
</body>
</html>
```

`data-page` : `accueil`, `parcours`, `cours`, `bibliotheque`, `espace-travail`, `suivi`, `profil`.
`app.js` injecte l'en-tête (logo, menu actif, bascule de thème, avatar), le pied de page et les
icônes ; il applique le thème enregistré. Il s'exécute au `DOMContentLoaded` : toute page peut donc
utiliser `App` dès que son propre script s'exécute (ordre ci-dessus respecté).

Le second `<link>` CSS de chaque page doit exister (créer le fichier même minime).

## 5. Design system (`assets/css/base.css`) — inventaire utilisable

**Tokens** (à utiliser, jamais de couleur en dur) :

`--c-fond`, `--c-surface`, `--c-surface-2`, `--c-surface-3`, `--c-texte`, `--c-texte-doux`,
`--c-texte-faible`, `--c-bordure`, `--c-bordure-forte`, `--c-primaire`, `--c-primaire-fonce`,
`--c-primaire-doux`, `--c-sur-primaire`, `--c-accent`, `--c-succes`, `--c-succes-doux`,
`--c-alerte`, `--c-alerte-doux`, `--c-info`, `--c-info-doux`, teintes `--c-indigo`, `--c-violet`,
`--c-cyan`, `--c-emerald`, `--c-amber`, `--c-rose`, `--c-orange`, `--c-teal`, `--c-slate`
(+ variantes `-doux`), rayons `--rayon-sm/md/lg/xl/pilule`, ombres `--ombre-1/2/3`,
espacements `--e-1` à `--e-8`, largeurs `--largeur`, `--largeur-texte`, transitions `--transition`,
z-index `--z-entete`.

**Teinte d'un composant** : `data-teinte="indigo|violet|cyan|emerald|amber|rose|orange|teal|slate"`
sur un élément définit `--teinte` et `--teinte-doux` ; les composants ci-dessous l'utilisent
automatiquement (`--teinte` pour la couleur d'accent).

**Mise en page** : `.conteneur`, `.section`, `.section--alt`, `.section__entete`, `.section__titre`,
`.entete-page` (+ `__surtitre`, `__titre`, `__texte`, `__actions`), `.fil-ariane`, `.grille`,
`.grille--2`, `.grille--3`, `.grille--4`, `.grille--auto`, `.pile` (+ `--serre`, `--large`),
`.rangee` (+ `--entre`, `--centre`, `--enroule`), `.separateur`.

**Typographie** : `.titre-1`, `.titre-2`, `.titre-3`, `.titre-4`, `.surtitre`, `.plomb`, `.texte-doux`,
`.petit`, `.micro`, `.lien-fleche`, `.mono`.

**Boutons** : `.btn`, `.btn--primaire`, `.btn--secondaire`, `.btn--fantome`, `.btn--danger`,
`.btn--sm`, `.btn--lg`, `.btn--bloc`, `.btn--icone`, `[disabled]`, `.groupe-btn`.

**Étiquettes** : `.etiquette`, `.etiquette--succes`, `.etiquette--alerte`, `.etiquette--info`,
`.etiquette--neutre`, `.puce` (avec `data-icone`), `.puce--succes`.

**Cartes** : `.carte`, `.carte--cliquable`, `.carte__entete`, `.carte__titre`, `.carte__texte`,
`.carte__pied`, `.carte__icone`, `.carte__media`, `.carte-niveau`, `.carte-cours` (+ `__haut`,
`__icone`, `__niveau`, `__titre`, `__resume`, `__meta`, `__pied`, `__progression`), `.tuile-matiere`
(+ `__icone`, `__nom`, `__detail`), `.stat` (+ `__valeur`, `__libelle`, `__icone`), `.etat-vide`.

**Formulaires** : `.champ`, `.champ__label`, `.champ__aide`, `.saisie`, `.zone-texte`,
`.liste-deroulante`, `.case-a-cocher`, `.bascule`, `.groupe-champ`.
Recherche / filtres : `.barre-recherche`, `.puce-filtre` (`aria-pressed="true"` = actif), `.filtres`.

**Progression** : `.jauge` (piste), `.jauge__remplissage`, `.jauge--fine`, `.anneau` (cercle SVG animable).
**Onglets** : `.onglets` > `.onglet` (`aria-selected="true"` = actif), `.panneau` (`[hidden]`).
**Tableau** : `.tableau`, `.tableau th`, `.tableau td`, `.tableau--dense`.
**Divers** : `.badge-obtenu`, `.badge-verrouille`, `.boite-info`, `.boite-succes`, `.boite-alerte`,
`.sr-only`, `.texte-centre`, `.mt-0`…`.mt-4` (utilitaires d'espacement verticaux).

`app.js` fournit aussi les classes de la modale et du toast : utiliser `App.modal`, `App.toast`.

## 6. Données — schéma exact

Chaque fichier de données **pousse** dans des registres globaux, sans écraser les autres :

```js
window.REG = window.REG || {};
window.REG.cours = (window.REG.cours || []).concat([ /* vos cours */ ]);
```

`data.js` agrège tout dans `window.APP_DATA` et expose des aides (`APP_DATA.coursParSlug`,
`APP_DATA.getCours(slug)`, `APP_DATA.getDocument(id)`, `APP_DATA.matieresDuNiveau(id)`,
`APP_DATA.coursDuNiveau(id)`, `APP_DATA.coursDeMatiere(id)`, `APP_DATA.compter()` → `{cours, documents, niveaux, matieres}`).

### 6.1 Cours

```js
{
  slug: "math-college-fractions",          // unique, kebab-case, imposé par le contrat
  titre: "Comprendre les fractions",
  matiere: "mathematiques",                // id de matière (voir core.js)
  niveau: "college",                       // primaire | college | lycee | universite
  classe: "6e",                            // affichage libre : "CM1", "6e", "1re", "L2"…
  duree: 35,                               // minutes, entier
  difficulte: 1,                           // 1 = découverte, 2 = consolidation, 3 = approfondi
  resume: "Une phrase de 15 à 25 mots qui dit ce qu'on apprend et à quoi ça sert.",
  objectifs: ["...", "...", "..."],        // 3 à 4 objectifs, verbes à l'infinitif
  prerequis: ["..."],                      // 0 à 2 éléments, [] si aucun
  sections: [                              // 3 à 4 sections
    {
      titre: "Le numérateur et le dénominateur",
      blocs: [
        { type: "p", texte: "Le texte, avec **gras**, *italique*, `code` et [un lien](https://...)." },
        { type: "liste", items: ["...", "..."] },
        { type: "liste-num", items: ["...", "..."] },
        { type: "encadre", titre: "À retenir", texte: "L'idée clé en une ou deux phrases." },
        { type: "exemple", titre: "Exemple guidé", texte: "Étape 1… Étape 2…" },
        { type: "tableau", entetes: ["Mot", "Sens"], lignes: [["3/4", "trois quarts"]] },
        { type: "code", langage: "python", texte: "print('bonjour')" }
      ]
    }
  ],
  quiz: [                                  // 3 à 5 questions à choix unique
    { question: "…", options: ["…", "…", "…", "…"], bonne: 0, explication: "…" }
  ],
  documents: ["doc-fiche-figures-style"],  // ids de documents liés (facultatif, [])
  tags: ["fractions", "nombres"]           // 2 à 4 mots-clés
}
```

Règles de contenu : contenu **exact et vérifiable**, adapté au niveau indiqué, phrases courtes,
exemples concrets, pas de remplissage. Chaque cours : **au moins 3 sections et ~500 à 900 mots** au
total, 3 à 4 questions de quiz avec explication. Le champ `bonne` est l'**index** (0 à 3).

### 6.2 Document

```js
{
  id: "doc-formulaire-aires-volumes",
  titre: "Formulaire — aires et volumes",
  type: "formulaire",   // fiche | methode | formulaire | annale | carte | protocole
  matiere: "mathematiques",
  niveau: "college",
  classe: "6e à 3e",
  pages: 2,                                  // estimation de pages
  auteur: "Équipe pédagogique SepsHaness",
  maj: "2026-09-01",                         // AAAA-MM-JJ
  description: "Toutes les formules d'aires et de volumes du collège, avec unités et pièges.",
  tags: ["géométrie", "formules"],
  contenu: "## Aires\n\n| Figure | Formule |\n|---|---|\n| Carré | côté² |\n\n..."  // Markdown complet
}
```

Le contenu Markdown doit faire **40 à 90 lignes** et utiliser titres `##`/`###`, listes, tableaux,
formules en texte, encadrés `>`. Il est rendu par `MD.block()` (voir §9) : titres, gras, italique,
code inline, blocs de code, listes, tableaux, citations, liens, séparateurs.

### 6.3 Catalogue imposé (slugs et matières exacts)

**CONTENU-STEM** — 9 cours :

| slug | titre | matière | niveau | classe | durée | diff. |
|---|---|---|---|---|---|---|
| math-primaire-decimaux | Les nombres décimaux | mathematiques | primaire | CM1 · CM2 | 30 | 1 |
| math-college-fractions | Comprendre les fractions | mathematiques | college | 6e | 35 | 1 |
| math-lycee-fonctions-affines | Fonctions affines et droites | mathematiques | lycee | 2de | 45 | 2 |
| sci-primaire-etats-matiere | Les états de la matière | sciences | primaire | CM1 | 25 | 1 |
| sci-college-cellule | La cellule, unité du vivant | sciences | college | 5e | 40 | 2 |
| sci-lycee-energie | Énergie et puissance | sciences | lycee | 1re | 45 | 3 |
| info-college-algorithmique | Premiers pas en algorithmique | informatique | college | 4e | 40 | 2 |
| info-lycee-python | Programmer en Python | informatique | lycee | 2de | 50 | 2 |
| info-univ-bases-donnees | Modèle relationnel et SQL | informatique | universite | L2 | 60 | 3 |

**CONTENU-STEM** — 6 documents :

| id | titre | type | matière | niveau |
|---|---|---|---|---|
| doc-formulaire-aires-volumes | Formulaire — aires et volumes | formulaire | mathematiques | college |
| doc-methode-resoudre-equation | Méthode — résoudre une équation | methode | mathematiques | lycee |
| doc-protocole-cellule | Protocole — observer une cellule | protocole | sciences | college |
| doc-formulaire-energie-puissance | Formulaire — énergie et puissance | formulaire | sciences | lycee |
| doc-memo-algorithmique | Mémo — algorithmes et tris | fiche | informatique | lycee |
| doc-annale-sql-qcm | Annale — QCM SQL corrigé | annale | informatique | universite |

**CONTENU-LETTRES** — 7 cours :

| slug | titre | matière | niveau | classe | durée | diff. |
|---|---|---|---|---|---|---|
| fra-primaire-lecture | Lire et comprendre un récit | francais | primaire | CE2 | 25 | 1 |
| fra-college-analyse-phrase | Analyser une phrase | francais | college | 5e | 35 | 1 |
| fra-lycee-dissertation | Construire une dissertation | francais | lycee | 1re | 55 | 3 |
| fra-univ-argumentation | Argumenter à l'université | francais | universite | L1 | 50 | 2 |
| hg-college-revolution | La Révolution française | histoire-geo | college | 4e | 40 | 2 |
| hg-lycee-guerre-froide | La guerre froide | histoire-geo | lycee | Terminale | 45 | 2 |
| philo-lycee-conscience | La conscience | philosophie | lycee | Terminale | 50 | 3 |

**CONTENU-LETTRES** — 3 cours (économie / langues) :

| slug | titre | matière | niveau | classe | durée | diff. |
|---|---|---|---|---|---|---|
| eco-lycee-marche | Le marché et les prix | economie | lycee | 1re | 40 | 2 |
| eco-univ-microeconomie | Le consommateur et l'offre | economie | universite | L1 | 55 | 3 |
| ang-college-present-simple | Present simple, mode d'emploi | langues | college | 5e | 30 | 1 |

**CONTENU-LETTRES** — 6 documents :

| id | titre | type | matière | niveau |
|---|---|---|---|---|
| doc-fiche-figures-style | Fiche — les figures de style | fiche | francais | college |
| doc-methode-commentaire-texte | Méthode — le commentaire de texte | methode | francais | lycee |
| doc-methode-dissertation | Méthode — la dissertation | methode | francais | lycee |
| doc-chronologie-revolution | Chronologie — la Révolution française | fiche | histoire-geo | college |
| doc-carte-guerre-froide | Carte mentale — la guerre froide | carte | histoire-geo | lycee |
| doc-notions-conscience | Fiche notions — la conscience | fiche | philosophie | lycee |

Total attendu : **19 cours, 12 documents**, sur les matières : `mathematiques`, `francais`,
`sciences`, `histoire-geo`, `informatique`, `philosophie`, `economie`, `langues`.

## 7. `Store` — persistance et progression (`assets/js/store.js`)

État persisté sous la clé `sepshaness.v1`. API (toutes synchrones) :

```js
Store.get()                       // état complet (objet vivant, ne pas réassigner)
Store.save()                      // force l'écriture
Store.subscribe(fn)               // fn(état) à chaque changement
Store.reset()                     // remise à zéro
Store.exportJSON() / Store.importJSON(texte) -> bool

// Profil
Store.profil()                    // {pseudo, niveau, objectifHebdo, matieresPreferees, cree}
Store.majProfil(patch)
Store.initiales()                 // "AM" ou "?"
Store.niveauCourant()             // id du niveau choisi

// Cours / leçons
Store.lecon(slug)                 // {statut:"jamais"|"en-cours"|"termine", score, minutes, vues, derniereVisite}
Store.marquerVue(slug)            // enregistre une consultation
Store.marquerTermine(slug, {score, minutes})  // score 0-100 facultatif
Store.estTermine(slug)            // bool
Store.enregistrerQuiz(slug, score, total)     // historique + meilleur score
Store.quiz(slug)                  // {meilleurScore, tentatives, historique:[]}
Store.progressionMatiere(matiereId)   // {termines, total, pourcentage}
Store.progressionNiveau(niveauId)
Store.progressionGlobale()            // {termines, total, pourcentage}
Store.coursRecommande()               // cours non terminé (niveau du profil d'abord) ou null
Store.serie()                     // jours consécutifs d'activité (int)
Store.minutesTotales()
Store.minutesParJour(n)           // [{date:"AAAA-MM-JJ", minutes, label:"lun."}] du plus ancien à aujourd'hui
Store.minutesParMatiere()         // [{matiere, minutes, pourcentage}] trié décroissant
Store.moyenneQuiz()               // 0-100 ou null
Store.badgesObtenus()             // [id] — calculés, comparés à APP_DATA.badges
Store.badge(id)                   // {id, nom, description, icone, obtenu:bool}

// Espace de travail
Store.notes() / Store.ajouterNote({titre, contenu, matiere, epingle}) -> note
Store.majNote(id, patch) / Store.supprimerNote(id) / Store.note(id)
Store.taches() / Store.ajouterTache({titre, matiere, echeance, priorite}) -> tache
Store.majTache(id, patch) / Store.supprimerTache(id) / Store.basculerTache(id)
Store.objectifs() / Store.ajouterObjectif({titre, cible, echeance}) / Store.majObjectif(id, patch)
Store.supprimerObjectif(id)
Store.journaliserSession({minutes, matiere, coursSlug, note})   // met à jour sessions + minutes
Store.sessions(n)                 // n dernières sessions, plus récentes d'abord
Store.reglages() / Store.majReglages(patch)   // {theme:"clair"|"sombre", objectifHebdo}
Store.estObjectifAtteint()        // bool semaine en cours
Store.minutesSemaine()
```

## 8. `App` — coquille et helpers (`assets/js/app.js`)

```js
App.qs(sel, racine) / App.qsa(sel, racine)
App.el(tag, attrs?, enfants?)     // création DOM, attrs: class, text, html, dataset, on...
App.icon(nom, {taille, classe})   // -> chaîne SVG (voir liste §10)
App.iconeDans(racine)             // hydrate [data-icon]
App.escape(texte)                 // échappement HTML
App.md(texte)                     // Markdown bloc -> HTML
App.mdInline(texte)               // Markdown inline -> HTML
App.date(iso, {long})             // "12 nov. 2026"
App.relative(iso)                 // "il y a 3 jours"
App.duree(minutes)                // "1 h 15" | "35 min"
App.nombre(n)                     // séparateur d'espace fine
App.pourcentage(n)
App.toast(message, {type:"succes"|"info"|"erreur"})
App.modal({titre, contenu, actions:[{libelle, type, onClick, fermer}], taille:"md"|"lg"})
App.fermerModal() / App.modalOuverte()
App.confirmer({titre, message, libelleOk, libelleAnnuler}) -> Promise<bool>
App.lienCours(slug) / App.lienDocument(id)   // "lecon.html?cours=…" / "bibliotheque.html?doc=…"
App.param(nom)                    // valeur du paramètre d'URL
App.onReady(fn)                   // DOMContentLoaded déjà géré
App.vider(racine) / App.vide(texte)  // état vide standard
App.copier(texte)                 // presse-papiers avec repli
App.echapperAttribut(texte)
```

### Sources de vérité pour les libellés
`APP_DATA.niveaux`, `APP_DATA.matieres` : `{id, nom, description, icone, teinte}` (+ pour les niveaux :
`detail`, `ages`, `points[]`). Ne pas réinventer les noms : itérer sur ces tableaux.

## 9. `MD` — rendu Markdown (`assets/js/markdown.js`)

- `MD.inline(texte)` : `**gras**`, `*italique*`, `` `code` ``, `[lien](url)`, `==surligné==`.
- `MD.block(markdown)` : tout le reste — `##`/`###`/`####` titres, paragraphes, `-`/`*` listes,
  `1.` listes numérotées, tableaux `| a | b |`, blocs ` ```lang `, citations `>`, `---`,
  listes de définitions simples non nécessaires.
- Le résultat est du HTML sûr (échappe le texte, autorise uniquement `http(s)://` et `#` pour les liens).

## 10. Icônes disponibles (`App.icon`)

`accueil, parcours, livre, bibliotheque, espace, suivi, profil, recherche, filtre, fleche-droite,
fleche-gauche, fleche-haut, check, croix, plus, poubelle, crayon, horloge, calendrier, etoile, feu,
trophee, cible, sigma, globe, code, atome, bulle, graphique, monde, telecharger, lecteur, pause,
reinitialiser, soleil, lune, menu, fermer, info, alerte, succes, document, fiche, methode, annale,
formulaire, carte, tache, note, minuteur, objectif, loupe, chevron-bas, chevron-haut, lien, externe,
imprimer, partage, utilisateur, mail, play, medaille, courbe, filtre`

Utilisation : `element.innerHTML = App.icon("livre")` ou `<span data-icon="livre"></span>` puis
`App.iconeDans(racine)`.

## 11. Conventions de pages

| page | `data-page` | paramètres d'URL | contenu attendu |
|---|---|---|---|
| index.html | accueil | — | hero, chiffres, niveaux, cours phares, fonctionnalités, étapes, documents, témoignages, appel à l'action |
| parcours.html | parcours | `?niveau=` (facultatif) | parcours guidés + niveaux + matières + progression; filtre par niveau |
| cours.html | cours | `?matiere=` `?niveau=` `?q=` `?tri=` | recherche instantanée, filtres, tri, grille de cours, état vide, « continuer » |
| bibliotheque.html | bibliotheque | `?doc=` `?type=` `?matiere=` `?q=` | grille de documents, filtres, lecteur en modale (`?doc=id`), actions (marquer lu, copier, imprimer) |
| lecon.html | lecon | `?cours=slug` | fil d'Ariane, titre, méta, objectifs, sections rendues, quiz interactif noté, marquer terminé, cours liés, navigation précédent/suivant |
| espace-travail.html | espace-travail | `?onglet=notes|taches|planning|minuteur|objectifs` | notes CRUD, tâches CRUD + filtres, planning semaine, minuteur Pomodoro, objectifs |
| suivi.html | suivi | — | indicateurs, progression par matière, graphique 7 jours, temps par matière, historique sessions/quiz, badges, objectif hebdo |
| profil.html | profil | — | profil éditable, niveau, objectif hebdo, préférences (thème), export/import JSON, réinitialisation avec confirmation |

Toute page doit gérer **l'absence de données** (aucune note, aucun document filtré) avec un état vide
utile et un bouton d'action. Les données de progression sont **déjà calculées par `Store`** : ne pas
réimplémenter les règles.

## 12. Vérifications avant de rendre

1. `node --check assets/js/<vos fichiers>.js` → aucune erreur.
2. Tous les liens écrits en dur existent (pages, assets).
3. La page s'ouvre sans erreur console (vérifier avec `node --check` puis, si possible,
   `chrome --headless --dump-dom`).
4. Aucun fichier d'un autre propriétaire modifié (`git status` si dépôt).
5. Contenu 100 % français, sans faute, sans texte de remplissage type « lorem ipsum ».
6. Rapport final : fichiers créés, choix faits, points à vérifier.

## 13. Définition de « terminé »

Une page est terminée quand : le squelette §4 est respecté, la navigation fonctionne vers les autres
pages, les styles viennent de `base.css` (ou de votre CSS préfixé), le responsive tient à 360 px,
les données viennent de `APP_DATA`, l'état vide est géré, et `node --check` passe.
