/* ============================================================
   SepsHaness — données de documents STEM
   Fiches, méthodes, formulaires, protocole et annale : 6 documents.
   Pousse dans window.REG.documents sans écraser les autres fichiers.
   Aucune dépendance, aucun module ES : script classique.
   ============================================================ */

window.REG = window.REG || {};
window.REG.documents = (window.REG.documents || []).concat([

  /* ── 1. Formulaire — aires et volumes ───────────────────── */
  {
    id: "doc-formulaire-aires-volumes",
    titre: "Formulaire — aires et volumes",
    type: "formulaire",
    matiere: "mathematiques",
    niveau: "college",
    classe: "6e à 3e",
    pages: 2,
    auteur: "Équipe pédagogique SepsHaness",
    maj: "2026-09-01",
    description: "Toutes les formules d'aires et de volumes du collège, avec les unités, les conversions et les pièges à éviter.",
    tags: ["géométrie", "formules", "unités"],
    contenu: `## Les aires des figures planes

L'aire mesure la surface d'une figure. Elle s'exprime en unités carrées.

### Figures de base

| Figure | Formule | Remarque |
|---|---|---|
| Carré | côté × côté = c² | c est la longueur d'un côté |
| Rectangle | longueur × largeur = L × l | |
| Triangle | (base × hauteur) / 2 | la hauteur est perpendiculaire à la base |
| Parallélogramme | base × hauteur | même formule que le rectangle |
| Losange | (grande diagonale × petite diagonale) / 2 | |
| Trapèze | ((petite base + grande base) / 2) × hauteur | |
| Disque | π × rayon² ≈ 3,14 × r² | périmètre : 2 × π × r |

### Unités d'aire

| Unité | Valeur en m² |
|---|---|
| 1 km² | 1 000 000 m² |
| 1 m² | 100 dm² |
| 1 dm² | 100 cm² |
| 1 cm² | 100 mm² |

Chaque marche du tableau multiplie par 100 : 1 m² = 10 000 cm².

## Les volumes des solides

| Solide | Formule | Remarque |
|---|---|---|
| Cube | côté³ = c³ | |
| Pavé droit | longueur × largeur × hauteur = L × l × h | |
| Cylindre | π × rayon² × hauteur | base circulaire |
| Prisme droit | aire de la base × hauteur | |
| Pyramide | (aire de la base × hauteur) / 3 | |
| Cône | (π × rayon² × hauteur) / 3 | |
| Sphère | (4/3) × π × rayon³ | |

### Unités de volume

| Unité | Valeur en dm³ |
|---|---|
| 1 m³ | 1 000 dm³ |
| 1 dm³ | 1 000 cm³ |
| 1 cm³ | 1 000 mm³ |

Chaque marche multiplie par 1 000.

### Contenances

| Contenance | Volume |
|---|---|
| 1 L | 1 dm³ |
| 1 mL | 1 cm³ |
| 1 hL | 100 L = 100 dm³ |

## Méthode de calcul

1. Repérer la figure ou le solide et les longueurs données.
2. Convertir toutes les longueurs dans la même unité.
3. Choisir la formule correspondante.
4. Calculer et écrire l'unité au carré ou au cube.

## Les pièges à éviter

> Il ne faut pas confondre aire et périmètre : le périmètre est une longueur, l'aire une surface.

- On écrit l'unité au carré pour une aire, au cube pour un volume.
- La hauteur d'un triangle peut être extérieure au triangle.
- La formule du disque utilise le rayon, pas le diamètre : r = d / 2.
- Les longueurs doivent être converties dans la même unité avant tout calcul.

### Exemple guidé

Un rectangle mesure 12 cm sur 0,5 dm. Sa longueur est 12 cm et sa largeur vaut 5 cm, donc son aire est 12 × 5 = 60 cm².

## À retenir

- Aire : unité au carré (cm², m²).
- Volume : unité au cube (cm³, m³).
- 1 L = 1 dm³ et 1 mL = 1 cm³.`
  },

  /* ── 2. Méthode — résoudre une équation ─────────────────── */
  {
    id: "doc-methode-resoudre-equation",
    titre: "Méthode — résoudre une équation",
    type: "methode",
    matiere: "mathematiques",
    niveau: "lycee",
    classe: "2de à Terminale",
    pages: 3,
    auteur: "Équipe pédagogique SepsHaness",
    maj: "2026-09-15",
    description: "Méthode pas à pas pour résoudre une équation du premier ou du second degré, avec vérification et cas particuliers.",
    tags: ["équations", "méthode", "algèbre"],
    contenu: `## Ce qu'est une équation

Une équation est une égalité contenant une inconnue, souvent notée x. Résoudre l'équation, c'est trouver toutes les valeurs qui rendent l'égalité vraie.

### Le principe de l'équilibre

> On peut ajouter, soustraire, multiplier ou diviser par un même nombre non nul les deux membres d'une équation sans changer ses solutions.

- On ajoute ou retranche la même quantité aux deux membres.
- On multiplie ou divise les deux membres par un même nombre non nul.
- On développe et on réduit chaque membre avant de résoudre.

## Équation du premier degré

Une équation du premier degré se ramène à la forme ax + b = 0 avec a ≠ 0.

### Méthode en quatre étapes

1. Développer et réduire les deux membres.
2. Regrouper les termes en x dans un membre et les constantes dans l'autre.
3. Diviser par le coefficient de x.
4. Vérifier la solution dans l'équation de départ.

### Exemple guidé

Résoudre 3(x + 2) = 5x − 4.

- Étape 1 : 3x + 6 = 5x − 4.
- Étape 2 : 3x − 5x = −4 − 6, donc −2x = −10.
- Étape 3 : x = (−10) / (−2) = 5.
- Étape 4 : 3 × (5 + 2) = 21 et 5 × 5 − 4 = 21. La solution est x = 5.

## Cas particuliers

| Équation | Forme obtenue | Solutions |
|---|---|---|
| 2x + 3 = 2x + 7 | 3 = 7 (faux) | aucune |
| 2x + 3 = 2x + 3 | 0 = 0 (vrai) | tout réel |
| 0x = 5 | 0 = 5 (faux) | aucune |

## Équations produit et second degré

Une équation produit A × B = 0 est vraie si A = 0 ou B = 0 : c'est la propriété utilisée après une factorisation.

Pour une équation du second degré ax² + bx + c = 0, on calcule le discriminant Δ = b² − 4ac, puis :

- si Δ > 0, deux solutions : x = (−b − √Δ) / (2a) et x = (−b + √Δ) / (2a) ;
- si Δ = 0, une solution double : x = −b / (2a) ;
- si Δ < 0, aucune solution réelle.

### Exemple guidé

Résoudre x² − 5x + 6 = 0.

- a = 1, b = −5, c = 6.
- Δ = (−5)² − 4 × 1 × 6 = 25 − 24 = 1.
- √Δ = 1, donc x = (5 − 1) / 2 = 2 et x = (5 + 1) / 2 = 3.
- Vérification : 2² − 5 × 2 + 6 = 0 et 3² − 5 × 3 + 6 = 0.

## Vérifier et conclure

> Une solution n'est valable que si elle vérifie l'équation de départ : la vérification fait partie de la méthode.

- Toujours contrôler le résultat en remplaçant x.
- Ne jamais diviser par une expression qui peut être nulle.
- Conclure par une phrase claire : « La solution est x = … » ou « L'équation n'a pas de solution ».`
  },

  /* ── 3. Protocole — observer une cellule ────────────────── */
  {
    id: "doc-protocole-cellule",
    titre: "Protocole — observer une cellule",
    type: "protocole",
    matiere: "sciences",
    niveau: "college",
    classe: "5e",
    pages: 2,
    auteur: "Équipe pédagogique SepsHaness",
    maj: "2026-10-02",
    description: "Protocole complet pour préparer et observer des cellules végétales au microscope, avec sécurité et compte rendu d'observation.",
    tags: ["microscope", "cellule", "protocole", "observation"],
    contenu: `## Objectif

Observer des cellules végétales d'épiderme d'oignon au microscope optique, puis réaliser un dessin légendé.

## Matériel

- Un oignon frais.
- Une lame et une lamelle.
- Une pince fine et un scalpel, ou des ciseaux fins.
- Une pipette et un verre d'eau.
- Un colorant, par exemple du rouge neutre ou du lugol.
- Un microscope optique et son éclairage.

## Sécurité

> Le scalpel coupe : on le manipule toujours lame posée sur la table, en éloignant la main.

- Ne jamais regarder le Soleil à travers l'oculaire.
- Manipuler les lames par les bords pour éviter les éclats.
- Signaler tout bris de verre à l'enseignant.
- Se laver les mains après l'expérience.

## Préparation de la lame

1. Détacher une fine pellicule d'épiderme sur la face interne d'une écaille d'oignon.
2. Déposer le fragment bien à plat au centre de la lame.
3. Ajouter une goutte d'eau, ou une goutte de colorant.
4. Poser la lamelle en la faisant glisser à 45° pour chasser les bulles.
5. Éponger l'excédent de liquide avec un papier absorbant.

## Réglages du microscope

| Étape | Action | Repère |
|---|---|---|
| 1 | Allumer et régler la lumière | image uniformément éclairée |
| 2 | Placer la lame sur la platine | objet au centre du faisceau |
| 3 | Mettre au point avec l'objectif ×4 | image nette à faible grossissement |
| 4 | Passer à l'objectif ×10 puis ×40 | utiliser la vis micrométrique |
| 5 | Noter le grossissement total | oculaire × objectif |

Le grossissement total est le produit du grossissement de l'oculaire par celui de l'objectif : 10 × 40 = 400.

### Ce que l'on observe

On repère une paroi épaisse et un noyau arrondi dans chaque cellule de l'épiderme.

## Dessin d'observation

- Travailler au crayon à papier, sans gommer les traits déjà tracés.
- Représenter les formes réelles sans les inventer.
- Légender avec des traits horizontaux, sans traverser le dessin.
- Indiquer la paroi, le noyau et le cytoplasme quand ils sont visibles.
- Ajouter un titre et le grossissement utilisé.

## Critères de réussite

> Un bon compte rendu montre ce que l'on a réellement vu, avec la bonne échelle.

| Critère | Attendu |
|---|---|
| Préparation | lame propre, sans bulle |
| Observation | image nette et centrée |
| Dessin | formes fidèles, traits fins |
| Légendes | correctes et complètes |

## À retenir

- L'épiderme d'oignon est un tissu végétal simple à observer.
- La cellule végétale possède une paroi visible au microscope.`
  },

  /* ── 4. Formulaire — énergie et puissance ───────────────── */
  {
    id: "doc-formulaire-energie-puissance",
    titre: "Formulaire — énergie et puissance",
    type: "formulaire",
    matiere: "sciences",
    niveau: "lycee",
    classe: "1re et Terminale",
    pages: 2,
    auteur: "Équipe pédagogique SepsHaness",
    maj: "2026-10-20",
    description: "Formules d'énergie cinétique, potentielle et électrique, conversions d'unités et calcul de rendement, avec des exemples chiffrés.",
    tags: ["énergie", "puissance", "formules", "unités"],
    contenu: `## Grandeurs et unités

L'énergie se mesure en joules (J), la puissance en watts (W).

| Grandeur | Symbole | Unité | Définition |
|---|---|---|---|
| Énergie | E | joule (J) | capacité à produire un effet |
| Puissance | P | watt (W) | énergie transférée par seconde |
| Durée | t | seconde (s) | temps du transfert |
| Masse | m | kilogramme (kg) | quantité de matière |
| Vitesse | v | mètre par seconde (m/s) | distance parcourue par seconde |

## Formules de base

- Énergie et puissance : E = P × t et P = E / t.
- Énergie cinétique : Ec = 1/2 × m × v².
- Énergie potentielle de pesanteur : Epp = m × g × h, avec g ≈ 9,81 N/kg.
- Énergie électrique : E = P × t, avec P en watt et t en seconde.
- Rendement : η = E utile / E absorbée = P utile / P absorbée.

> Utiliser les bonnes unités : m en kg, v en m/s, h en m, P en W et t en s.

## Conversions utiles

| Conversion | Valeur |
|---|---|
| 1 kJ | 1 000 J |
| 1 MJ | 1 000 000 J |
| 1 kWh | 3,6 × 10⁶ J = 3,6 MJ |
| 1 kW | 1 000 W |
| 1 MW | 1 000 000 W |
| 1 h | 3 600 s |

## Exemple guidé

Un moteur reçoit une puissance de 500 W pendant 2 h. Quelle énergie a-t-il absorbée ?

- Étape 1 : convertir la durée, 2 h = 7 200 s.
- Étape 2 : appliquer E = P × t = 500 × 7 200 = 3 600 000 J.
- Étape 3 : convertir en kWh, 3 600 000 / 3 600 000 = 1 kWh.
- Le moteur a absorbé 1 kWh, soit 3,6 MJ.

### Vérifier un calcul

1. Vérifier les unités avant de calculer.
2. Estimer l'ordre de grandeur du résultat attendu.
3. Comparer l'estimation et le résultat calculé.

## Ordres de grandeur

| Dispositif | Puissance |
|---|---|
| Lampe LED | 9 W |
| Ordinateur portable | 60 W |
| Four électrique | 2 kW |
| Éolienne | 2 MW |
| Centrale nucléaire | 1 GW |

## Pièges à éviter

- Ne pas confondre puissance et énergie : un appareil puissant consomme vite, un appareil peu puissant consomme lentement.
- Ne pas oublier de convertir les heures en secondes dans la formule E = P × t.
- Un rendement supérieur à 100 % est impossible.
- La vitesse intervient au carré dans l'énergie cinétique.

## À retenir

> L'énergie se conserve : elle change de forme et une partie se dissipe toujours en chaleur.`
  },

  /* ── 5. Mémo — algorithmes et tris ──────────────────────── */
  {
    id: "doc-memo-algorithmique",
    titre: "Mémo — algorithmes et tris",
    type: "fiche",
    matiere: "informatique",
    niveau: "lycee",
    classe: "2de",
    pages: 3,
    auteur: "Équipe pédagogique SepsHaness",
    maj: "2026-11-05",
    description: "Mémo des structures algorithmiques de base et des tris classiques, avec leur complexité et les erreurs fréquentes à éviter.",
    tags: ["algorithme", "tri", "complexité", "pseudo-code"],
    contenu: `## Les trois structures de base

| Structure | Rôle | Exemple |
|---|---|---|
| Séquence | exécuter les instructions dans l'ordre | lire, calculer, afficher |
| Alternative | choisir un bloc selon un test | Si … Alors … Sinon … |
| Boucle | répéter un bloc | Pour i de 1 à n |

> Tout algorithme peut s'écrire avec des séquences, des alternatives et des boucles.

### Séquences et affectations

- Une variable est une case mémoire nommée.
- L'affectation range une valeur dans une variable : x ← 5.
- L'ordre des instructions change le résultat.

### Alternatives

> Si note >= 10 Alors
> afficher « admis »
> Sinon
> afficher « refusé »
> Fin Si

### Boucles

> Pour i de 1 à 10
> afficher i
> Fin Pour
>
> Tant que n < 100
> n ← n * 2
> Fin Tant que

Une boucle Tant que doit faire évoluer sa condition, sinon elle ne s'arrête jamais.

## Les tris classiques

| Algorithme | Principe | Complexité |
|---|---|---|
| Tri par sélection | chercher le minimum restant et l'échanger | en n² |
| Tri par insertion | insérer chaque élément dans la partie triée | en n² |
| Tri fusion | couper la liste en deux puis fusionner | en n log n |

### Tri par sélection en pseudo-code

> Pour i de 1 à n - 1
> min ← i
> Pour j de i + 1 à n
> si t[j] < t[min] alors min ← j
> Fin Pour
> échanger t[i] et t[min]
> Fin Pour

## Comparer les tris

- Le tri par sélection fait environ n² / 2 comparaisons.
- Le tri par insertion est rapide sur une liste déjà presque triée.
- Le tri fusion est efficace sur les grandes listes mais demande de la mémoire supplémentaire.

## Méthode pour concevoir un algorithme

1. Identifier les entrées et les sorties attendues.
2. Écrire les étapes en français, puis en pseudo-code.
3. Dérouler l'exécution sur un petit exemple.
4. Tester les cas limites, comme une liste vide.

## Erreurs fréquentes

- Oublier d'initialiser une variable avant de la lire.
- Écrire une condition toujours vraie dans une boucle Tant que.
- Confondre = (affectation) et == (test) dans un langage de programmation.
- Tester seulement un cas favorable au lieu des cas limites.

> Un algorithme se vérifie en déroulant son exécution ligne par ligne, avec un tableau de valeurs.`
  },

  /* ── 6. Annale — QCM SQL corrigé ────────────────────────── */
  {
    id: "doc-annale-sql-qcm",
    titre: "Annale — QCM SQL corrigé",
    type: "annale",
    matiere: "informatique",
    niveau: "universite",
    classe: "L2",
    pages: 4,
    auteur: "Équipe pédagogique SepsHaness",
    maj: "2026-11-10",
    description: "Six questions de QCM SQL niveau L2, avec corrigé justifié, barème indicatif et conseils de révision pour l'examen.",
    tags: ["SQL", "QCM", "annale", "révision"],
    contenu: `## Consignes

Durée conseillée : 30 minutes. Une seule réponse juste par question. Barème indicatif : 1 point par bonne réponse, sans point négatif.

## Questions

### Question 1

Quel mot-clé choisit les colonnes à afficher ?

- A. FROM
- B. SELECT
- C. WHERE
- D. ORDER BY

### Question 2

Quelle clause filtre les lignes avant regroupement ?

- A. HAVING
- B. WHERE
- C. GROUP BY
- D. LIMIT

### Question 3

Que fait COUNT(*) ?

- A. compte les lignes
- B. additionne les valeurs
- C. trie les lignes
- D. supprime les doublons

### Question 4

Une clé primaire peut-elle contenir la valeur NULL ?

- A. oui, toujours
- B. non, jamais
- C. seulement pour une clé composite
- D. cela dépend du SGBD

### Question 5

Quelle jointure conserve les lignes sans correspondance à gauche ?

- A. INNER JOIN
- B. LEFT JOIN
- C. CROSS JOIN
- D. SELF JOIN

### Question 6

Quelle forme normale interdit les dépendances partielles ?

- A. 1FN
- B. 2FN
- C. 3FN
- D. BCNF

## Corrigé

| Question | Réponse | Justification |
|---|---|---|
| 1 | B | SELECT projette les colonnes demandées. |
| 2 | B | WHERE filtre les lignes avant GROUP BY. |
| 3 | A | COUNT compte les lignes du groupe. |
| 4 | B | Une clé primaire est unique et non nulle. |
| 5 | B | LEFT JOIN complète par NULL les lignes sans correspondance. |
| 6 | B | La 2FN supprime les dépendances partielles. |

## Méthode pour écrire une requête

1. Identifier les tables utiles dans le FROM.
2. Ajouter les jointures et leurs conditions ON.
3. Filtrer les lignes avec WHERE avant de regrouper.
4. Appliquer GROUP BY puis HAVING sur les groupes.
5. Projeter les colonnes dans SELECT et trier avec ORDER BY.

## Conseils de révision

> Relire une requête dans l'ordre FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY évite la plupart des erreurs.

- Réviser la différence entre WHERE et HAVING.
- Savoir écrire une jointure sur deux tables avec une condition ON.
- Vérifier le type des colonnes dans les tables.
- S'entraîner sur des schémas simples : étudiants, inscriptions, notes.`
  }
]);
