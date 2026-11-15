/* ============================================================
   SepsHaness — données de cours STEM
   Mathématiques, sciences et informatique : 9 cours.
   Pousse dans window.REG.cours sans jamais écraser les autres fichiers.
   Aucune dépendance, aucun module ES : script classique.
   ============================================================ */

window.REG = window.REG || {};
window.REG.cours = (window.REG.cours || []).concat([

  /* ── 1. Mathématiques · primaire ─────────────────────────── */
  {
    slug: "math-primaire-decimaux",
    titre: "Les nombres décimaux",
    matiere: "mathematiques",
    niveau: "primaire",
    classe: "CM1 · CM2",
    duree: 30,
    difficulte: 1,
    resume: "Repérer la virgule, lire, écrire, comparer et additionner les nombres décimaux avec les dixièmes et les centièmes.",
    objectifs: [
      "Reconnaître un nombre décimal et nommer la valeur de chacun de ses chiffres.",
      "Lire et écrire un nombre décimal en chiffres et en lettres.",
      "Comparer et ranger des nombres décimaux.",
      "Poser et calculer une addition de nombres décimaux."
    ],
    prerequis: [
      "Connaître les nombres entiers et les unités de numération.",
      "Savoir poser une addition de nombres entiers."
    ],
    sections: [
      {
        titre: "Repérer la virgule et nommer les chiffres",
        blocs: [
          { type: "p", texte: "Un nombre entier s'écrit avec des chiffres, par exemple 12. Un nombre décimal s'écrit avec une virgule, par exemple 12,34. La virgule sépare deux parties : à gauche la **partie entière**, à droite la **partie décimale**. Dans 12,34, la partie entière est 12 et la partie décimale est 34." },
          { type: "p", texte: "Chaque position a un nom précis. Juste après la virgule se trouvent les **dixièmes** : 3,5 se lit « trois virgule cinq » et vaut 3 unités et 5 dixièmes. Viennent ensuite les **centièmes**, puis les **millièmes**." },
          {
            type: "tableau",
            entetes: ["Nombre", "Partie entière", "Partie décimale", "Lecture"],
            lignes: [
              ["3,5", "3", "5", "trois unités et cinq dixièmes"],
              ["12,34", "12", "34", "douze unités et trente-quatre centièmes"],
              ["0,07", "0", "07", "sept centièmes"],
              ["45,208", "45", "208", "quarante-cinq unités et deux cent huit millièmes"]
            ]
          },
          { type: "p", texte: "La virgule ne sépare pas les milliers : on n'écrit jamais 1,000 pour mille. Pour les grands nombres, on laisse un espace, comme dans 1 000. Enfin, multiplier un décimal par 10 décale la virgule d'un rang vers la droite : 3,5 × 10 = 35 ; multiplier par 100 la décale de deux rangs : 3,5 × 100 = 350." },
          { type: "encadre", titre: "À retenir", texte: "La virgule sépare la partie entière de la partie décimale. À droite de la virgule, on trouve les dixièmes, puis les centièmes, puis les millièmes." }
        ]
      },
      {
        titre: "Lire, écrire et décomposer",
        blocs: [
          { type: "p", texte: "Un même nombre décimal peut s'écrire de plusieurs façons. On peut le décomposer en additionnant sa partie entière et ses parts décimales." },
          { type: "liste", items: [
            "12,34 = 12 + 3/10 + 4/100",
            "12,34 = 12 + 0,3 + 0,04",
            "12,34 vaut aussi 1 234 centièmes."
          ] },
          { type: "p", texte: "Attention aux zéros ! Dans 3,07, le zéro est indispensable : il occupe la place des dixièmes. Sans lui, 3,7 est dix fois plus grand. En revanche, les zéros placés tout à droite après la virgule sont inutiles : 4,50 = 4,5 et 7,200 = 7,2." },
          { type: "exemple", titre: "Exemple guidé", texte: "Écris et décompose 45,208. Étape 1 — je repère les positions : 4 dizaines, 5 unités, 2 dixièmes, 0 centième, 8 millièmes. Étape 2 — j'écris la décomposition : 45,208 = 45 + 2/10 + 0/100 + 8/1000, soit 45 + 0,2 + 0,008. Étape 3 — en lettres : « quarante-cinq unités et deux cent huit millièmes »." }
        ]
      },
      {
        titre: "Comparer et ranger des nombres décimaux",
        blocs: [
          { type: "p", texte: "Pour comparer deux nombres décimaux, on ne compare pas les chiffres comme s'il s'agissait d'entiers : 5,72 n'est pas plus grand que 5,8 sous prétexte que 72 est plus grand que 8. On procède colonne par colonne, en partant de la gauche." },
          { type: "liste-num", items: [
            "Je compare les parties entières. Si elles sont différentes, la comparaison est terminée.",
            "Si les parties entières sont égales, je compare les chiffres des dixièmes.",
            "Je continue avec les centièmes, puis les millièmes, jusqu'à trouver une différence.",
            "Si un nombre a moins de chiffres après la virgule, je peux ajouter des zéros pour l'aligner : 7,4 = 7,40."
          ] },
          { type: "exemple", titre: "Exemple guidé", texte: "Range 5,72 ; 5,8 et 5,805 dans l'ordre croissant. Étape 1 — les trois nombres ont la même partie entière, 5. Étape 2 — je compare les dixièmes : 7 pour 5,72, 8 pour 5,8 et pour 5,805. Donc 5,72 est le plus petit. Étape 3 — entre 5,8 (soit 5,800) et 5,805, dixièmes et centièmes sont égaux, puis les millièmes diffèrent : 0 < 5. Résultat : 5,72 < 5,8 < 5,805." },
          { type: "p", texte: "Une fraction peut aider à comparer : 1/2 = 0,5 et 1/4 = 0,25. Repérer qu'un nombre est plus petit que 1, ou plus grand que 1, rend le classement plus rapide." }
        ]
      },
      {
        titre: "Additionner des nombres décimaux",
        blocs: [
          { type: "p", texte: "Pour poser une addition de nombres décimaux, la règle d'or est d'**aligner les virgules**. On complète ensuite chaque nombre avec des zéros pour remplir toutes les colonnes, puis on additionne comme avec des entiers en partant de la droite. La virgule du résultat se place dans la colonne des virgules." },
          { type: "exemple", titre: "Exemple guidé", texte: "Calcule 12,4 + 3,75. Étape 1 — j'aligne les virgules et je complète : 12,40 + 3,75. Étape 2 — centièmes : 0 + 5 = 5. Étape 3 — dixièmes : 4 + 7 = 11, j'écris 1 et je retiens 1. Étape 4 — unités : 2 + 3 + 1 (retenue) = 6. Étape 5 — dizaines : 1. Résultat : 16,15." },
          { type: "p", texte: "Une estimation permet de vérifier le résultat : 12,4 est proche de 12 et 3,75 proche de 4, donc la somme doit être proche de 16. Si je trouve 161,5, j'ai mal placé la virgule." },
          { type: "encadre", titre: "À retenir", texte: "Pour additionner des décimaux, on aligne les virgules, on complète avec des zéros et on place la virgule dans la colonne des virgules. On évalue l'ordre de grandeur pour contrôler le résultat." }
        ]
      }
    ],
    quiz: [
      { question: "Dans le nombre 27,4, quel est le chiffre des dixièmes ?", options: ["2", "4", "7", "0"], bonne: 1, explication: "Après la virgule, le premier chiffre est celui des dixièmes : c'est 4." },
      { question: "Quel nombre est égal à 6,50 ?", options: ["6,05", "60,5", "6,5", "0,65"], bonne: 2, explication: "Un zéro à la fin de la partie décimale ne change pas la valeur : 6,50 = 6,5." },
      { question: "Quel est le plus grand de ces nombres : 5,7 ; 5,68 ; 5,8 ; 5,79 ?", options: ["5,79", "5,7", "5,68", "5,8"], bonne: 3, explication: "5,8 vaut 5,80, donc ses dixièmes (8) dépassent ceux de 5,79 et de 5,7." },
      { question: "Combien vaut 1,2 + 0,75 ?", options: ["1,95", "1,82", "2,7", "1,075"], bonne: 0, explication: "On aligne les virgules : 1,20 + 0,75 = 1,95." }
    ],
    documents: [],
    tags: ["décimaux", "numération", "virgule"]
  },

  /* ── 2. Mathématiques · collège ──────────────────────────── */
  {
    slug: "math-college-fractions",
    titre: "Comprendre les fractions",
    matiere: "mathematiques",
    niveau: "college",
    classe: "6e",
    duree: 35,
    difficulte: 1,
    resume: "Comprendre ce que représente une fraction, simplifier, comparer et prendre une fraction d'une quantité avec des exemples concrets.",
    objectifs: [
      "Interpréter une fraction comme un partage de l'unité.",
      "Reconnaître et fabriquer des fractions égales.",
      "Simplifier une fraction en divisant par un même nombre.",
      "Comparer deux fractions et calculer une fraction d'une quantité."
    ],
    prerequis: [
      "Connaître les tables de multiplication.",
      "Savoir poser une division."
    ],
    sections: [
      {
        titre: "Une fraction, c'est un partage",
        blocs: [
          { type: "p", texte: "Une fraction s'écrit sous la forme a/b, avec b différent de 0. Le nombre du bas, le **dénominateur**, indique en combien de parts égales on partage l'unité. Le nombre du haut, le **numérateur**, indique combien de parts on prend." },
          { type: "p", texte: "Imagine un gâteau coupé en 4 parts égales. Si tu en manges 3, tu manges les trois quarts du gâteau, ce qui s'écrit 3/4. Le dénominateur 4 correspond au nombre de parts du gâteau, le numérateur 3 aux parts mangées." },
          { type: "p", texte: "Une fraction est aussi le résultat d'une division : 3/4 = 3 ÷ 4 = 0,75. Dire « trois quarts » ou « 0,75 » revient au même. Une fraction sert donc à écrire un quotient exact, même quand la division ne se termine pas : 1/3 = 0,333…" },
          {
            type: "tableau",
            entetes: ["Écriture", "Ce que ça veut dire", "Exemple concret"],
            lignes: [
              ["3/4", "3 parts sur 4 parts égales", "trois quarts d'un gâteau coupé en 4"],
              ["5/2", "5 demis, soit 2 unités et demie", "cinq demis d'heure, c'est 2 h 30"],
              ["1/3", "1 part sur 3 parts égales", "un tiers d'une tarte"],
              ["7/7", "7 parts sur 7, c'est l'unité entière", "un gâteau entier, c'est 1"]
            ]
          },
          { type: "encadre", titre: "À retenir", texte: "Le dénominateur indique en combien de parts égales on partage l'unité ; le numérateur indique combien de parts on prend. Une fraction est aussi un quotient : a/b = a ÷ b." }
        ]
      },
      {
        titre: "Fractions égales et simplification",
        blocs: [
          { type: "p", texte: "Si l'on multiplie le numérateur et le dénominateur par un même nombre non nul, on obtient une fraction égale. Prendre 1 part sur 2 ou 2 parts sur 4 revient au même : 1/2 = 2/4 = 3/6 = 50/100." },
          { type: "p", texte: "Réciproquement, si l'on divise le numérateur et le dénominateur par un même nombre, la fraction reste égale. Simplifier une fraction, c'est la diviser jusqu'à obtenir une fraction **irréductible**, c'est-à-dire que l'on ne peut plus simplifier." },
          { type: "exemple", titre: "Exemple guidé", texte: "Simplifie 42/56. Étape 1 — je cherche les diviseurs communs : 42 = 2 × 3 × 7 et 56 = 2 × 2 × 2 × 7. Étape 2 — les diviseurs communs sont 2 et 7, donc leur produit 14. Étape 3 — je divise en haut et en bas par 14 : 42 ÷ 14 = 3 et 56 ÷ 14 = 4. Résultat : 3/4. Étape 4 — je vérifie : 42/56 = 0,75 et 3/4 = 0,75." },
          { type: "p", texte: "On peut aussi simplifier étape par étape : 42/56 = 21/28 = 3/4. La fraction 3/4 est irréductible car 3 et 4 n'ont pas de diviseur commun autre que 1." },
          { type: "p", texte: "Attention : on ne simplifie jamais en soustrayant un même nombre. 42/56 n'est pas égal à (42 − 2)/(56 − 2) = 40/54. Seules la multiplication et la division par un même nombre non nul conservent la valeur d'une fraction." }
        ]
      },
      {
        titre: "Comparer des fractions",
        blocs: [
          { type: "p", texte: "Comparer deux fractions sert à savoir laquelle est la plus grande. Il existe plusieurs méthodes, à choisir selon les nombres en présence." },
          { type: "liste-num", items: [
            "Mêmes dénominateurs : on compare les numérateurs. 5/7 > 3/7, car on prend plus de parts de même taille.",
            "Mêmes numérateurs : la plus grande est celle qui a le plus petit dénominateur. 2/3 > 2/5, car des tiers sont plus grands que des cinquièmes.",
            "Dénominateurs différents : on écrit les fractions avec un même dénominateur, par exemple 12.",
            "On peut comparer à 1 : si le numérateur est plus petit que le dénominateur, la fraction est plus petite que 1 (3/8 < 1) ; s'il est plus grand, elle est plus grande que 1 (7/5 > 1)."
          ] },
          { type: "exemple", titre: "Exemple guidé", texte: "Compare 3/4 et 5/6. Étape 1 — je cherche un dénominateur commun : 12 convient car 4 × 3 = 12 et 6 × 2 = 12. Étape 2 — 3/4 = (3 × 3)/(4 × 3) = 9/12. Étape 3 — 5/6 = (5 × 2)/(6 × 2) = 10/12. Étape 4 — à dénominateur égal, je compare les numérateurs : 9 < 10, donc 3/4 < 5/6." },
          { type: "p", texte: "Une fraction dont le numérateur est égal au dénominateur vaut 1 : 4/4 = 1. Une fraction plus grande que 1 peut aussi s'écrire avec un nombre entier : 7/4 = 1 + 3/4 = 1,75." }
        ]
      },
      {
        titre: "Prendre une fraction d'une quantité",
        blocs: [
          { type: "p", texte: "Prendre une fraction d'une quantité, c'est la multiplier par cette fraction. Pour calculer a/b d'un nombre, on divise ce nombre par b, puis on multiplie le résultat par a. On peut aussi multiplier d'abord, puis diviser : le résultat est le même." },
          { type: "exemple", titre: "Exemple guidé", texte: "Dans un collège de 480 élèves, 3/5 sont demi-pensionnaires. Combien d'élèves cela représente-t-il ? Étape 1 — je cherche 1/5 des 480 élèves : 480 ÷ 5 = 96. Étape 2 — je multiplie par 3 pour obtenir 3/5 : 96 × 3 = 288. Étape 3 — je vérifie les 2/5 restants : 480 − 288 = 192, et 192 ÷ 96 = 2. Résultat : 288 élèves sont demi-pensionnaires." },
          { type: "p", texte: "Les fractions servent dans tous les domaines, et pas seulement en cuisine. En géométrie, l'aire d'un triangle se calcule avec la formule 1/2 × base × hauteur : pour un triangle de base 6 cm et de hauteur 4 cm, on obtient 1/2 × 6 × 4 = 12 cm². Le formulaire d'aires et de volumes rassemble ces formules." },
          { type: "encadre", titre: "À retenir", texte: "Prendre a/b d'une quantité revient à la diviser par b puis à multiplier le résultat par a. Pour contrôler, on estime : 3/5 de 480 est un peu plus de la moitié, donc proche de 300." }
        ]
      }
    ],
    quiz: [
      { question: "Quelle fraction représente 3 parts d'un gâteau coupé en 8 parts égales ?", options: ["8/3", "3/5", "3/8", "5/8"], bonne: 2, explication: "Le dénominateur est le nombre total de parts (8), le numérateur le nombre de parts prises (3)." },
      { question: "Quelle fraction est égale à 2/3 ?", options: ["4/6", "3/2", "2/5", "6/8"], bonne: 0, explication: "On multiplie le numérateur et le dénominateur par 2 : 2/3 = 4/6. La fraction 6/8 vaut 3/4." },
      { question: "Quelle est la forme irréductible de 18/24 ?", options: ["2/3", "9/12", "6/8", "3/4"], bonne: 3, explication: "On divise les deux nombres par leur plus grand diviseur commun, 6 : 18 ÷ 6 = 3 et 24 ÷ 6 = 4." },
      { question: "Combien vaut 3/4 de 32 ?", options: ["8", "24", "12", "28"], bonne: 1, explication: "On calcule 32 ÷ 4 = 8, puis 8 × 3 = 24." }
    ],
    documents: ["doc-formulaire-aires-volumes"],
    tags: ["fractions", "quotient", "simplification"]
  },

  /* ── 3. Mathématiques · lycée ────────────────────────────── */
  {
    slug: "math-lycee-fonctions-affines",
    titre: "Fonctions affines et droites",
    matiere: "mathematiques",
    niveau: "lycee",
    classe: "2de",
    duree: 45,
    difficulte: 2,
    resume: "Relier la formule f(x) = ax + b à une droite, comprendre le rôle de a et de b, et résoudre des problèmes concrets.",
    objectifs: [
      "Reconnaître une fonction affine et identifier a et b.",
      "Calculer l'image d'un nombre et retrouver un antécédent.",
      "Relier le coefficient directeur au sens de variation d'une droite.",
      "Modéliser une situation par une expression affine."
    ],
    prerequis: [
      "Savoir développer et réduire une expression littérale.",
      "Savoir placer un point dans un repère du plan."
    ],
    sections: [
      {
        titre: "La forme f(x) = ax + b",
        blocs: [
          { type: "p", texte: "Une **fonction affine** est une fonction qui a tout nombre x associe le nombre ax + b, où a et b sont deux nombres réels fixés. On note f(x) = ax + b. Le nombre a s'appelle le **coefficient directeur**, le nombre b l'**ordonnée à l'origine**." },
          { type: "p", texte: "Voici quelques exemples : f(x) = 2x + 3 avec a = 2 et b = 3 ; g(x) = −x + 5 avec a = −1 et b = 5 ; h(x) = 4 avec a = 0 et b = 4 (fonction constante) ; k(x) = 3x avec a = 3 et b = 0 (fonction linéaire). Une fonction linéaire est donc un cas particulier de fonction affine." },
          {
            type: "tableau",
            entetes: ["Fonction", "a", "b", "Nature"],
            lignes: [
              ["f(x) = 2x + 3", "2", "3", "affine, croissante"],
              ["g(x) = −x + 5", "−1", "5", "affine, décroissante"],
              ["h(x) = 4", "0", "4", "constante"],
              ["k(x) = 3x", "3", "0", "linéaire"]
            ]
          },
          { type: "p", texte: "Calculer une image est immédiat : pour f(x) = 2x + 3, l'image de 5 est f(5) = 2 × 5 + 3 = 13, et l'image de −2 est f(−2) = 2 × (−2) + 3 = −1." },
          { type: "encadre", titre: "À retenir", texte: "Une fonction affine s'écrit f(x) = ax + b. Le nombre a est le coefficient directeur, b l'ordonnée à l'origine. Tout accroissement de x de 1 fait varier f(x) de a." }
        ]
      },
      {
        titre: "Coefficient directeur et ordonnée à l'origine",
        blocs: [
          { type: "p", texte: "La représentation graphique d'une fonction affine est une **droite**. Le nombre b est la valeur de f en 0 : la droite coupe l'axe des ordonnées au point de coordonnées (0 ; b). Le nombre a mesure la pente de la droite : quand x augmente de 1, y augmente de a." },
          { type: "p", texte: "Si l'on connaît deux points A(xA ; yA) et B(xB ; yB) de la droite, avec xA différent de xB, le coefficient directeur vaut a = (yB − yA) / (xB − xA). C'est le rapport de l'accroissement vertical sur l'accroissement horizontal." },
          { type: "exemple", titre: "Exemple guidé", texte: "Détermine la fonction affine f telle que f(1) = 5 et f(4) = 11. Étape 1 — je calcule a : a = (11 − 5) / (4 − 1) = 6 / 3 = 2. Étape 2 — j'écris f(x) = 2x + b, puis j'utilise f(1) = 5 : 2 × 1 + b = 5, donc b = 3. Étape 3 — je vérifie avec f(4) : 2 × 4 + 3 = 11. Résultat : f(x) = 2x + 3." },
          { type: "p", texte: "Les fonctions affines modélisent de nombreuses situations : un abonnement de 10 € puis 0,20 € par minute s'écrit f(x) = 0,2x + 10, où b = 10 représente les frais fixes et a = 0,2 le prix d'une minute supplémentaire." }
        ]
      },
      {
        titre: "Sens de variation et signe",
        blocs: [
          { type: "p", texte: "Le signe de a donne le sens de variation de la fonction affine : si a > 0, la fonction est **strictement croissante** ; si a < 0, elle est **strictement décroissante** ; si a = 0, elle est constante. La droite monte, descend ou reste horizontale." },
          { type: "p", texte: "Pour étudier le signe de ax + b, on cherche d'abord la valeur qui l'annule : si a est différent de 0, l'équation ax + b = 0 a pour unique solution x = −b/a. La fonction change alors de signe en ce point." },
          { type: "exemple", titre: "Exemple guidé", texte: "Étudie le signe de f(x) = 2x − 6. Étape 1 — je résous 2x − 6 = 0, ce qui donne 2x = 6, donc x = 3. Étape 2 — comme a = 2 > 0, la fonction est croissante et elle est négative avant 3, positive après. Étape 3 — je vérifie avec deux valeurs : f(0) = −6 < 0 et f(5) = 4 > 0. Résultat : f(x) < 0 pour x < 3, f(x) = 0 pour x = 3, f(x) > 0 pour x > 3." },
          { type: "encadre", titre: "À retenir", texte: "Une fonction affine est croissante si a > 0 et décroissante si a < 0. Si a est différent de 0, elle ne s'annule qu'en un seul point : x = −b/a." }
        ]
      },
      {
        titre: "Résoudre et interpréter",
        blocs: [
          { type: "p", texte: "Résoudre l'équation f(x) = k revient à résoudre ax + b = k. Résoudre une inéquation comme f(x) < k revient à étudier le signe de ax + b − k. Comparer deux fonctions affines f et g revient à résoudre f(x) = g(x) puis à étudier le signe de f(x) − g(x) : graphiquement, l'intersection des deux droites donne le point d'égalité." },
          { type: "exemple", titre: "Exemple guidé", texte: "Deux agences de location proposent : agence A, 20 € puis 0,40 € par kilomètre ; agence B, 10 € puis 0,60 € par kilomètre. On note f(x) = 0,4x + 20 et g(x) = 0,6x + 10. Étape 1 — je résous f(x) = g(x) : 0,4x + 20 = 0,6x + 10, donc 10 = 0,2x et x = 50. Étape 2 — je vérifie : f(50) = 40 et g(50) = 40. Étape 3 — j'interprète : à 50 km, les deux agences coûtent 40 € ; en dessous de 50 km, l'agence B est moins chère ; au-delà, c'est l'agence A." },
          { type: "p", texte: "Une fonction affine se reconnaît aussi dans un tableau de valeurs : les accroissements de f(x) sont proportionnels aux accroissements de x. Si f(x) augmente toujours de 3 quand x augmente de 1, alors a = 3." },
          { type: "encadre", titre: "À retenir", texte: "Comparer deux fonctions affines, c'est résoudre une équation ou une inéquation du premier degré. L'intersection des droites donne le seuil à partir duquel l'une devient plus avantageuse que l'autre." }
        ]
      }
    ],
    quiz: [
      { question: "Quel est le coefficient directeur de la fonction f(x) = −3x + 7 ?", options: ["7", "3", "−7", "−3"], bonne: 3, explication: "Dans f(x) = ax + b, a est le nombre qui multiplie x : ici a = −3 et b = 7." },
      { question: "Pour f(x) = 2x − 5, quelle est l'image de 4 ?", options: ["−3", "3", "13", "8"], bonne: 1, explication: "f(4) = 2 × 4 − 5 = 8 − 5 = 3." },
      { question: "Une fonction affine dont le coefficient directeur est négatif est…", options: ["décroissante", "croissante", "constante", "nulle"], bonne: 0, explication: "Quand a < 0, la droite descend : la fonction est strictement décroissante." },
      { question: "La droite d'équation y = 5x + 2 coupe l'axe des ordonnées au point…", options: ["(2 ; 0)", "(0 ; 5)", "(0 ; 2)", "(5 ; 0)"], bonne: 2, explication: "L'ordonnée à l'origine est b = 2, donc la droite coupe l'axe des ordonnées en (0 ; 2)." }
    ],
    documents: ["doc-methode-resoudre-equation"],
    tags: ["fonctions", "droites", "coefficient directeur"]
  },

  /* ── 4. Sciences · primaire ─────────────────────────────── */
  {
    slug: "sci-primaire-etats-matiere",
    titre: "Les états de la matière",
    matiere: "sciences",
    niveau: "primaire",
    classe: "CM1",
    duree: 25,
    difficulte: 1,
    resume: "Reconnaître les trois états de la matière et comprendre les changements d'état de l'eau dans la vie quotidienne.",
    objectifs: [
      "Distinguer les états solide, liquide et gazeux.",
      "Nommer les changements d'état de l'eau.",
      "Expliquer ce qui se passe quand la glace fond ou quand l'eau bout."
    ],
    prerequis: [
      "Avoir déjà observé de la glace qui fond."
    ],
    sections: [
      {
        titre: "Trois états, trois façons d'occuper l'espace",
        blocs: [
          { type: "p", texte: "Autour de nous, la matière peut se présenter sous trois états : **solide**, **liquide** et **gazeux**. Un glaçon, un caillou ou une cuillère sont solides. L'eau d'un verre, le jus d'orange ou l'huile sont liquides. L'air qui remplit un ballon est un gaz." },
          {
            type: "tableau",
            entetes: ["État", "Forme", "Volume", "Exemples"],
            lignes: [
              ["Solide", "forme propre", "volume propre", "glaçon, caillou, cuillère"],
              ["Liquide", "prend la forme du récipient", "volume propre", "eau, jus, huile"],
              ["Gaz", "occupe tout l'espace disponible", "pas de volume propre", "air, vapeur d'eau"]
            ]
          },
          { type: "p", texte: "Un solide garde sa forme et son volume : un glaçon reste un glaçon. Un liquide garde son volume mais prend la forme du récipient : versée dans un verre, l'eau devient la forme du verre. Un gaz n'a ni forme ni volume propres : il se répand dans toute la pièce si l'on ouvre le gaz." },
          { type: "p", texte: "L'air est bien de la matière, même s'il est invisible. On peut le sentir quand le vent souffle, le peser dans un ballon et le comprimer dans une seringue dont on bouche l'ouverture." },
          { type: "encadre", titre: "À retenir", texte: "Un solide a une forme propre et un volume propre ; un liquide a un volume propre mais pas de forme propre ; un gaz n'a ni forme ni volume propres." }
        ]
      },
      {
        titre: "L'eau change d'état",
        blocs: [
          { type: "p", texte: "L'eau est la matière que l'on observe le plus souvent sous ses trois états : la glace (solide), l'eau du robinet (liquide) et la vapeur d'eau (gaz). Elle change d'état quand la température varie." },
          {
            type: "tableau",
            entetes: ["Changement d'état", "Sens", "Exemple"],
            lignes: [
              ["Fusion", "solide → liquide", "un glaçon fond dans un verre"],
              ["Solidification", "liquide → solide", "l'eau du congélateur devient de la glace"],
              ["Vaporisation", "liquide → gaz", "l'eau bout dans une casserole à 100 °C"],
              ["Condensation", "gaz → liquide", "la buée se forme sur un verre froid"]
            ]
          },
          { type: "p", texte: "La fusion de la glace commence à 0 °C, et l'eau se solidifie aussi à 0 °C. Sous la pression atmosphérique normale, l'eau bout à 100 °C. Le passage du liquide au gaz s'appelle la **vaporisation** : l'ébullition est une vaporisation rapide, l'évaporation une vaporisation lente, qui se produit à toute température, par exemple quand une flaque sèche." },
          { type: "p", texte: "Lors d'un changement d'état, la **masse** ne change pas : la glace fondue a la même masse que l'eau obtenue. Le volume, lui, peut varier : en gelant, l'eau augmente de volume, c'est pourquoi une bouteille pleine et fermée peut éclater au congélateur." },
          { type: "exemple", titre: "Exemple guidé", texte: "Pourquoi un verre d'eau froide se couvre-t-il de buée ? Étape 1 — l'air de la pièce contient de la vapeur d'eau invisible. Étape 2 — au contact du verre froid, cette vapeur se refroidit. Étape 3 — elle se condense en fines gouttelettes liquides : c'est la buée. Conclusion : la buée est de l'eau liquide, et non de la vapeur." },
          { type: "encadre", titre: "À retenir", texte: "Fusion, solidification, vaporisation et condensation sont les changements d'état de l'eau. La masse est conservée ; le volume peut changer." }
        ]
      },
      {
        titre: "Observer et mesurer en classe",
        blocs: [
          { type: "liste-num", items: [
            "Remplir un verre d'eau et repérer le niveau avec un trait.",
            "Ajouter un glaçon et mesurer la température de l'eau avec un thermomètre.",
            "Observer la fusion : la glace diminue, puis disparaît.",
            "Chauffer ensuite l'eau et attendre les premières grosses bulles."
          ] },
          { type: "p", texte: "Pendant la fusion de la glace pure, tant qu'il reste de la glace, la température reste à 0 °C. De même, pendant l'ébullition de l'eau pure, la température reste à 100 °C. Ces changements d'état se font donc à température constante, même si l'on continue à chauffer." },
          { type: "p", texte: "On retrouve ces changements d'état en cuisine : l'eau des pâtes bout, le beurre fond, la confiture refroidit et se fige. Si l'on refroidit de la vapeur d'eau, elle se condense en liquide ; si l'on refroidit encore, elle se solidifie." },
          { type: "p", texte: "Prudence : l'eau bouillante et la vapeur brûlent. On mesure toujours la température avec un thermomètre, jamais en touchant." }
        ]
      }
    ],
    quiz: [
      { question: "Dans quel état la matière a-t-elle une forme propre et un volume propre ?", options: ["liquide", "gazeux", "solide", "les trois états"], bonne: 2, explication: "Un solide garde sa forme et son volume ; un liquide n'a pas de forme propre et un gaz n'a ni forme ni volume propres." },
      { question: "Comment s'appelle le passage de l'état liquide à l'état gazeux ?", options: ["la fusion", "la vaporisation", "la solidification", "la condensation"], bonne: 1, explication: "La vaporisation transforme un liquide en gaz ; la condensation fait l'inverse." },
      { question: "À quelle température la glace fond-elle sous pression normale ?", options: ["100 °C", "10 °C", "−10 °C", "0 °C"], bonne: 3, explication: "La glace fond à 0 °C et l'eau se solidifie aussi à 0 °C." },
      { question: "La buée sur un verre froid est…", options: ["de l'eau liquide", "de la fumée", "de l'air", "de la vapeur visible"], bonne: 0, explication: "La vapeur d'eau de l'air se condense au contact du verre froid en fines gouttelettes d'eau liquide." }
    ],
    documents: [],
    tags: ["matière", "états", "eau", "changements d'état"]
  },

  /* ── 5. Sciences · collège ──────────────────────────────── */
  {
    slug: "sci-college-cellule",
    titre: "La cellule, unité du vivant",
    matiere: "sciences",
    niveau: "college",
    classe: "5e",
    duree: 40,
    difficulte: 2,
    resume: "Découvrir que tous les êtres vivants sont faits de cellules et comparer, au microscope, cellules animales et végétales.",
    objectifs: [
      "Définir la cellule comme la plus petite unité du vivant.",
      "Comparer une cellule animale et une cellule végétale.",
      "Suivre un protocole d'observation au microscope.",
      "Situer la cellule dans les niveaux d'organisation du vivant."
    ],
    prerequis: [
      "Savoir utiliser un microscope optique."
    ],
    sections: [
      {
        titre: "La cellule, unité de base du vivant",
        blocs: [
          { type: "p", texte: "Un être vivant est constitué de **cellules**. La cellule est la plus petite unité capable de réaliser les fonctions de la vie : se nourrir, grandir, se reproduire. Elle est délimitée par une **membrane plasmique** qui contrôle les échanges avec l'extérieur, et contient un **cytoplasme** et, le plus souvent, un **noyau**." },
          { type: "p", texte: "Le noyau renferme l'**information génétique**, portée par l'ADN, qui commande le fonctionnement de la cellule et se transmet lors de la division cellulaire. Chaque cellule provient d'une cellule préexistante : c'est la division cellulaire." },
          { type: "p", texte: "Il existe des êtres **unicellulaires**, formés d'une seule cellule (bactéries, paramécies, levures), et des êtres **pluricellulaires**, formés d'un très grand nombre de cellules (une plante, un être humain). Un être humain adulte compte environ trente mille milliards de cellules." },
          { type: "p", texte: "Les virus ne sont pas des cellules : ils ne peuvent pas se multiplier seuls et ne sont pas classés parmi les êtres vivants." },
          { type: "encadre", titre: "À retenir", texte: "La cellule est l'unité de base du vivant : elle est délimitée par une membrane, contient un cytoplasme et, le plus souvent, un noyau. Toute cellule provient d'une cellule préexistante." }
        ]
      },
      {
        titre: "Cellule animale et cellule végétale",
        blocs: [
          { type: "p", texte: "Les cellules animales et végétales partagent trois éléments : la membrane plasmique, le cytoplasme et le noyau. Elles sont dites **eucaryotes**." },
          {
            type: "tableau",
            entetes: ["Élément", "Cellule animale", "Cellule végétale"],
            lignes: [
              ["Membrane plasmique", "oui", "oui"],
              ["Cytoplasme", "oui", "oui"],
              ["Noyau", "oui", "oui"],
              ["Paroi rigide", "non", "oui"],
              ["Chloroplastes", "non", "oui (cellules chlorophylliennes)"],
              ["Grande vacuole", "rare", "oui"]
            ]
          },
          { type: "p", texte: "La cellule végétale possède en plus une **paroi** rigide faite de cellulose, qui lui donne sa forme, et souvent une grande **vacuole** remplie d'eau. Dans les parties vertes des plantes, elle contient aussi des **chloroplastes**." },
          { type: "p", texte: "Les chloroplastes renferment un pigment vert, la **chlorophylle**, qui capte la lumière et permet la **photosynthèse**. La plante fabrique alors de la matière organique à partir d'eau et de dioxyde de carbone, et rejette du dioxygène : 6 CO2 + 6 H2O → C6H12O6 + 6 O2, grâce à la lumière et à la chlorophylle." },
          { type: "p", texte: "Le cytoplasme contient divers organites où se déroulent de nombreuses réactions chimiques. La membrane plasmique est sélectivement perméable : elle laisse passer certaines substances et pas d'autres." },
          { type: "encadre", titre: "À retenir", texte: "Animaux et végétaux partagent membrane, cytoplasme et noyau ; seule la cellule végétale possède une paroi de cellulose et des chloroplastes." }
        ]
      },
      {
        titre: "Observer une cellule au microscope",
        blocs: [
          { type: "liste-num", items: [
            "Prélever un fragment très fin d'épiderme d'oignon, la peau qui se détache sous la tunique.",
            "Le déposer sur une lame, ajouter une goutte d'eau et éventuellement un colorant.",
            "Poser délicatement la lamelle en la faisant glisser pour éviter les bulles d'air.",
            "Placer la préparation sur la platine et régler l'éclairage.",
            "Mettre au point avec le plus petit objectif, puis passer à un grossissement plus fort.",
            "Dessiner ce que l'on observe et légender le noyau, la paroi et le cytoplasme."
          ] },
          { type: "p", texte: "Le grossissement total est le produit du grossissement de l'oculaire par celui de l'objectif. Avec un oculaire de 10 et un objectif de 40, on observe donc au grossissement 400." },
          { type: "p", texte: "Dans les cellules d'épiderme d'oignon, on distingue facilement la **paroi** et le **noyau**. Le cytoplasme est souvent peu visible car incolore ; un colorant permet de mieux le repérer. Le dessin d'observation doit être réaliste, tracé au crayon, avec un titre et une échelle." },
          { type: "p", texte: "On peut aussi observer des cellules vivantes de levure ou d'élodée, une plante aquatique dont les cellules laissent voir les chloroplastes et leur déplacement dans le cytoplasme." }
        ]
      },
      {
        titre: "De la cellule à l'organisme",
        blocs: [
          { type: "p", texte: "Les cellules s'associent en **tissus** ; les tissus forment des **organes** ; les organes forment des **appareils** ; l'ensemble constitue l'**organisme**. Cette organisation en niveaux successifs s'observe chez tous les êtres pluricellulaires." },
          { type: "liste", items: [
            "cellule musculaire → tissu musculaire → muscle → appareil locomoteur → organisme humain",
            "cellule du parenchyme → tissu chlorophyllien → feuille → plante entière",
            "cellule osseuse → tissu osseux → os → squelette → organisme humain"
          ] },
          { type: "p", texte: "Chez l'être humain, le tissu sanguin, le tissu musculaire et le tissu nerveux n'ont ni la même structure ni la même fonction : la spécialisation des cellules permet le partage du travail au sein de l'organisme." },
          { type: "exemple", titre: "Exemple guidé", texte: "Pourquoi une feuille est-elle verte ? Étape 1 — au microscope, les cellules de la feuille contiennent de petits organites verts : les chloroplastes. Étape 2 — ces organites contiennent de la chlorophylle, un pigment vert. Étape 3 — la chlorophylle capte la lumière nécessaire à la photosynthèse. Conclusion : la feuille est verte parce que ses cellules contiennent de nombreux chloroplastes." },
          { type: "encadre", titre: "À retenir", texte: "Du plus simple au plus complexe : cellule → tissu → organe → appareil → organisme. Chaque niveau est constitué des éléments du niveau précédent." }
        ]
      }
    ],
    quiz: [
      { question: "Quel élément est présent dans la cellule végétale mais absent de la cellule animale ?", options: ["le chloroplaste", "le noyau", "la membrane plasmique", "le cytoplasme"], bonne: 0, explication: "Noyau, membrane et cytoplasme existent dans les deux cellules ; le chloroplaste est propre aux cellules végétales chlorophylliennes." },
      { question: "Quelle est la fonction de la membrane plasmique ?", options: ["fabriquer la chlorophylle", "contenir l'information génétique", "contrôler les échanges entre la cellule et l'extérieur", "donner une forme rigide à la cellule"], bonne: 2, explication: "La membrane plasmique est sélectivement perméable : elle règle les entrées et les sorties. C'est la paroi qui assure la rigidité." },
      { question: "Quel est l'ordre correct, du plus simple au plus complexe ?", options: ["organe, cellule, tissu, organisme", "cellule, tissu, organe, organisme", "tissu, cellule, organe, organisme", "cellule, organe, tissu, organisme"], bonne: 1, explication: "Les cellules forment des tissus, les tissus des organes, et les organes constituent l'organisme." },
      { question: "Un grossissement de 10 × 40 correspond à…", options: ["× 50", "× 140", "× 4 000", "× 400"], bonne: 3, explication: "Le grossissement total est le produit des deux grossissements : 10 × 40 = 400." }
    ],
    documents: ["doc-protocole-cellule"],
    tags: ["cellule", "microscope", "tissus", "vivant"]
  },

  /* ── 6. Sciences · lycée ───────────────────────────────── */
  {
    slug: "sci-lycee-energie",
    titre: "Énergie et puissance",
    matiere: "sciences",
    niveau: "lycee",
    classe: "1re",
    duree: 45,
    difficulte: 3,
    resume: "Distinguer énergie et puissance, calculer ces grandeurs, puis appliquer le principe de conservation lors des transferts et conversions.",
    objectifs: [
      "Distinguer énergie et puissance et connaître leurs unités.",
      "Calculer une énergie cinétique et une énergie potentielle de pesanteur.",
      "Appliquer le principe de conservation de l'énergie à un système.",
      "Évaluer un rendement et identifier les pertes."
    ],
    prerequis: [
      "Savoir convertir une durée en secondes et une masse en kilogrammes.",
      "Connaître le sens des préfixes k, M et G."
    ],
    sections: [
      {
        titre: "Énergie et puissance, deux grandeurs différentes",
        blocs: [
          { type: "p", texte: "L'**énergie** est une grandeur qui mesure la capacité d'un système à produire un effet : mettre un objet en mouvement, chauffer, éclairer. Elle se mesure en **joules** (J). Un joule est une très petite quantité d'énergie : soulever une pomme de 100 g d'un mètre demande environ 1 J." },
          { type: "p", texte: "La **puissance** mesure la vitesse à laquelle l'énergie est transférée : c'est un débit d'énergie. Elle s'exprime en **watts** (W) : 1 W = 1 J/s. Une lampe de 10 W convertit ainsi 10 J d'énergie électrique en lumière et chaleur chaque seconde." },
          { type: "p", texte: "Pour une puissance constante, on a **E = P × t**, avec E en joules, P en watts et t en secondes. Attention aux conversions : 2 h = 7 200 s." },
          { type: "exemple", titre: "Exemple guidé", texte: "Une ampoule LED de 10 W reste allumée 2 h. Étape 1 — je convertis la durée : 2 h = 7 200 s. Étape 2 — je calcule en joules : E = 10 × 7 200 = 72 000 J, soit 72 kJ. Étape 3 — je vérifie en kilowattheures : 0,010 kW × 2 h = 0,02 kWh, et 0,02 × 3,6 × 10⁶ = 72 000 J. Résultat : l'ampoule a consommé 72 kJ." },
          {
            type: "tableau",
            entetes: ["Grandeur", "Symbole", "Unité", "Ce qu'elle mesure"],
            lignes: [
              ["Énergie", "E", "joule (J)", "capacité à produire un effet"],
              ["Puissance", "P", "watt (W)", "débit de transfert d'énergie"],
              ["Durée", "t", "seconde (s)", "temps du transfert"]
            ]
          },
          { type: "encadre", titre: "À retenir", texte: "L'énergie se mesure en joules, la puissance en watts. La relation de base est E = P × t : à puissance égale, une durée plus longue transfère plus d'énergie." }
        ]
      },
      {
        titre: "Énergies cinétique et potentielle",
        blocs: [
          { type: "p", texte: "L'**énergie cinétique** est l'énergie liée au mouvement : plus un objet est lourd et rapide, plus il en possède. On la calcule par **Ec = 1/2 × m × v²**, avec m en kilogrammes et v en mètres par seconde ; elle s'exprime en joules." },
          { type: "p", texte: "La vitesse intervient au carré : si la vitesse double, l'énergie cinétique est multipliée par 4. C'est pourquoi la distance de freinage d'un véhicule augmente fortement avec la vitesse." },
          { type: "exemple", titre: "Exemple guidé", texte: "Un cycliste et son vélo ont une masse totale de 80 kg. À 5,0 m/s, Ec = 0,5 × 80 × 5² = 1 000 J. À 10 m/s, Ec = 0,5 × 80 × 10² = 4 000 J. L'énergie cinétique a bien été multipliée par 4 quand la vitesse a doublé." },
          { type: "p", texte: "L'**énergie potentielle de pesanteur** dépend de la hauteur : **Epp = m × g × h**, avec g ≈ 9,81 N/kg sur Terre et h la hauteur en mètres mesurée par rapport à une référence choisie. Un sac de 5 kg monté de 2 m acquiert ainsi une énergie potentielle d'environ 5 × 9,81 × 2 ≈ 98 J." },
          { type: "p", texte: "Dans un système qui tombe ou qui remonte, énergie cinétique et énergie potentielle se convertissent l'une en l'autre. Si les frottements sont négligés, leur somme reste constante." },
          { type: "encadre", titre: "À retenir", texte: "Doubler la vitesse quadruple l'énergie cinétique. C'est pourquoi un choc à 50 km/h est bien plus violent qu'un choc à 25 km/h." }
        ]
      },
      {
        titre: "Conservation, transferts et conversions",
        blocs: [
          { type: "p", texte: "L'énergie ne se crée pas et ne se détruit pas : elle se **conserve**. Elle peut être **transférée** d'un système à un autre, par travail mécanique ou par chaleur, et **convertie** d'une forme en une autre." },
          { type: "p", texte: "Une éolienne convertit l'énergie cinétique du vent en énergie électrique ; une pile convertit de l'énergie chimique en énergie électrique ; un radiateur convertit de l'énergie électrique en chaleur ; une lampe convertit de l'énergie électrique en lumière et en chaleur." },
          { type: "p", texte: "On décrit ces conversions par une chaîne énergétique. Dans une centrale thermique : énergie chimique du combustible → énergie thermique de la vapeur → énergie mécanique de la turbine → énergie électrique de l'alternateur." },
          { type: "p", texte: "Une partie de l'énergie est toujours dissipée sous forme de chaleur vers l'extérieur : on dit que l'énergie se **dégrade**. Parler d'énergie « consommée » signifie en réalité qu'elle est convertie, puis partiellement dissipée." }
        ]
      },
      {
        titre: "Bilans, rendement et ordres de grandeur",
        blocs: [
          { type: "p", texte: "Pour un système, on écrit le bilan : énergie reçue = énergie utile + énergie perdue. Le **rendement** compare l'énergie utile à l'énergie reçue : **η = E utile / E reçue**. Il n'a pas d'unité, s'exprime en pourcentage et reste inférieur à 100 % pour toute machine réelle." },
          { type: "exemple", titre: "Exemple guidé", texte: "Un moteur électrique reçoit 500 J d'énergie électrique et fournit 400 J d'énergie mécanique utile. Étape 1 — je calcule les pertes : 500 − 400 = 100 J, dissipées en chaleur et par frottements. Étape 2 — je calcule le rendement : η = 400/500 = 0,80, soit 80 %. Étape 3 — en 2,0 s, la puissance absorbée vaut 500/2,0 = 250 W et la puissance utile 400/2,0 = 200 W." },
          {
            type: "tableau",
            entetes: ["Dispositif", "Puissance"],
            lignes: [
              ["Lampe LED", "9 W"],
              ["Four électrique", "2 kW"],
              ["Lave-linge", "2 kW"],
              ["Éolienne", "2 MW"],
              ["Centrale nucléaire", "1 GW"]
            ]
          },
          { type: "p", texte: "L'énergie d'un logement se facture en kilowattheures : 1 kWh = 3,6 × 10⁶ J = 3,6 MJ. Repérer les ordres de grandeur permet de déceler une erreur : un four ne consomme pas 2 W mais 2 000 W." },
          { type: "encadre", titre: "À retenir", texte: "Le rendement est le rapport de l'énergie utile à l'énergie reçue ; il est toujours inférieur à 100 % pour une machine réelle. Le reste est dissipé en chaleur, principalement." }
        ]
      }
    ],
    quiz: [
      { question: "Quelle est l'unité de l'énergie dans le Système international ?", options: ["le watt", "le newton", "le volt", "le joule"], bonne: 3, explication: "Le joule (J) mesure l'énergie ; le watt mesure une puissance." },
      { question: "Une lampe de 12 W allumée pendant 300 s consomme…", options: ["12 J", "300 J", "3 600 J", "1 200 J"], bonne: 2, explication: "E = P × t = 12 × 300 = 3 600 J." },
      { question: "Si la vitesse d'un véhicule double, son énergie cinétique…", options: ["est multipliée par 4", "double", "est divisée par 2", "ne change pas"], bonne: 0, explication: "L'énergie cinétique dépend du carré de la vitesse : 2² = 4." },
      { question: "Un moteur reçoit 600 J et fournit 420 J d'énergie utile. Son rendement est…", options: ["140 %", "70 %", "30 %", "42 %"], bonne: 1, explication: "η = 420/600 = 0,70, soit 70 %. Un rendement ne peut pas dépasser 100 %." }
    ],
    documents: ["doc-formulaire-energie-puissance"],
    tags: ["énergie", "puissance", "rendement", "conservation"]
  },

  /* ── 7. Informatique · collège ──────────────────────────── */
  {
    slug: "info-college-algorithmique",
    titre: "Premiers pas en algorithmique",
    matiere: "informatique",
    niveau: "college",
    classe: "4e",
    duree: 40,
    difficulte: 2,
    resume: "Écrire ses premiers algorithmes : instructions, variables, conditions et boucles, puis les tester sur un exemple de tri.",
    objectifs: [
      "Définir un algorithme et le distinguer d'un programme.",
      "Utiliser variables, affectations, conditions et boucles.",
      "Tracer l'exécution d'un algorithme pas à pas.",
      "Décrire un tri simple sur une liste de nombres."
    ],
    prerequis: [
      "Savoir comparer deux nombres entiers."
    ],
    sections: [
      {
        titre: "Un algorithme, c'est une recette",
        blocs: [
          { type: "p", texte: "Un **algorithme** est une suite finie d'instructions, précises et non ambiguës, qui transforme des données d'entrée en un résultat, en un nombre fini d'étapes. Une recette de cuisine est un algorithme : on part d'ingrédients, on suit des étapes dans l'ordre, on obtient un plat." },
          { type: "p", texte: "Un **programme** est la traduction d'un algorithme dans un langage que la machine sait exécuter, par exemple Scratch, Python ou du pseudo-code. Un même algorithme peut être traduit dans plusieurs langages." },
          { type: "p", texte: "Un algorithme doit être **fini** (il s'arrête au bout d'un nombre fini d'étapes), **précis** (chaque instruction n'a qu'un seul sens) et produire un **résultat** à partir de ses entrées. On l'écrit en trois temps : entrées, traitement, sorties." },
          { type: "code", langage: "text", texte: `Algorithme MoyenneTroisNotes
Entrées : note1, note2, note3
moyenne ← (note1 + note2 + note3) / 3
Afficher moyenne
Fin` },
          { type: "p", texte: "Ici, les entrées sont les trois notes, le traitement calcule leur moyenne, et la sortie est l'affichage du résultat." },
          { type: "encadre", titre: "À retenir", texte: "Un algorithme est une suite finie et précise d'instructions qui, à partir de données, produit un résultat. Un programme est sa traduction dans un langage exécutable." }
        ]
      },
      {
        titre: "Variables et affectation",
        blocs: [
          { type: "p", texte: "Une **variable** est une case mémoire à laquelle on donne un nom et qui contient une valeur. L'**affectation** consiste à placer une valeur dans une variable ; en pseudo-code, on note x ← 5 et on lit « x reçoit 5 ». Attention, ce n'est pas une égalité mathématique." },
          { type: "p", texte: "On distingue plusieurs types de valeurs : les entiers (42), les réels (3,14), les chaînes de caractères (« bonjour ») et les booléens (vrai, faux)." },
          { type: "liste", items: [
            "Affectation : x ← 3 donne la valeur 3 à la variable x.",
            "Calcul : y ← x + 2 range dans y la valeur de x augmentée de 2.",
            "Affichage : Afficher y montre la valeur contenue dans y."
          ] },
          { type: "p", texte: "L'ordre des instructions est essentiel : une variable lue avant d'avoir reçu de valeur provoque une erreur ou un résultat faux." },
          { type: "exemple", titre: "Exemple guidé", texte: "Exécutons pas à pas : a ← 4, puis b ← a + 1, puis a ← a × 2, puis Afficher a, b. Étape 1 — a reçoit 4. Étape 2 — b reçoit 4 + 1 = 5. Étape 3 — a reçoit son ancienne valeur multipliée par 2, donc 8 ; b ne change pas. Étape 4 — l'affichage donne 8 et 5." },
          { type: "tableau", entetes: ["Instruction", "a", "b"], lignes: [
            ["a ← 4", "4", "—"],
            ["b ← a + 1", "4", "5"],
            ["a ← a × 2", "8", "5"],
            ["Afficher a, b", "8", "5"]
          ] }
        ]
      },
      {
        titre: "Conditions et boucles",
        blocs: [
          { type: "p", texte: "Une **condition** permet d'exécuter un bloc seulement si un test est vrai. On utilise les opérateurs de comparaison =, ≠, <, >, ≤ et ≥, et les opérateurs logiques et, ou, non." },
          { type: "code", langage: "text", texte: `Si temperature > 30 Alors
    Afficher "Il fait chaud"
Sinon
    Afficher "Il fait bon"
Fin Si` },
          { type: "p", texte: "Une **boucle** répète des instructions. La boucle bornée est répétée un nombre connu de fois (« Pour i de 1 à 10 »). La boucle non bornée se répète tant qu'une condition est vraie (« Tant que ») : elle doit contenir une instruction qui fait évoluer la condition, sinon elle ne s'arrête jamais." },
          { type: "code", langage: "text", texte: `maximum ← n1
Pour i de 2 à 5
    Si ni > maximum Alors
        maximum ← ni
    Fin Si
Fin Pour
Afficher maximum` },
          { type: "p", texte: "Cet algorithme parcourt cinq nombres et garde dans maximum le plus grand rencontré. Pour le tester, on peut dérouler son exécution avec la liste 3 ; 9 ; 4 ; 7 ; 2 : maximum vaut successivement 3, puis 9, et reste 9 jusqu'à la fin." },
          { type: "p", texte: "Il ne faut pas confondre les trois structures de base : la **séquence** (instructions les unes après les autres), l'**alternative** (choix entre deux blocs) et la **boucle** (répétition). Tout algorithme peut s'écrire avec ces trois structures." },
          { type: "encadre", titre: "À retenir", texte: "Séquence, alternative et boucle sont les trois structures de base. Une boucle doit toujours pouvoir s'arrêter." }
        ]
      },
      {
        titre: "Trier une liste : le tri par sélection",
        blocs: [
          { type: "p", texte: "Trier une liste, c'est ranger ses éléments dans un ordre, par exemple croissant. Le **tri par sélection** répète l'opération suivante : chercher le plus petit élément non trié, puis l'échanger avec le premier élément non trié." },
          { type: "exemple", titre: "Exemple guidé", texte: "Trions la liste [5, 2, 4, 1] par sélection. Étape 1 — le plus petit de la liste est 1 ; je l'échange avec le 5 en tête : [1, 2, 4, 5]. Étape 2 — le plus petit de [2, 4, 5] est 2, déjà en place. Étape 3 — le plus petit de [4, 5] est 4, déjà en place. Étape 4 — la liste est triée. Résultat : [1, 2, 4, 5]." },
          { type: "p", texte: "Le tri par sélection ne demande pas d'étape pour la dernière position. Pour 10 nombres, il utilise environ 45 comparaisons : plus la liste est longue, plus il devient lent." },
          { type: "p", texte: "D'autres tris existent : le tri par insertion range chaque nouvel élément à sa place dans la partie déjà triée, et le tri fusion coupe la liste en deux avant de la reconstruire. Le mémo d'algorithmes compare ces méthodes." },
          { type: "encadre", titre: "À retenir", texte: "Trier, c'est ranger dans un ordre. Le tri par sélection répète : chercher le plus petit élément restant, l'échanger avec le premier non trié. Il est correct mais peu rapide sur les longues listes." }
        ]
      }
    ],
    quiz: [
      { question: "Qu'est-ce qu'un algorithme ?", options: ["une suite finie et précise d'instructions qui produit un résultat", "un langage de programmation", "un ordinateur", "un fichier de données"], bonne: 0, explication: "Un algorithme décrit des étapes de traitement ; le langage de programmation sert seulement à le traduire." },
      { question: "Quelle structure permet de répéter des instructions un certain nombre de fois ?", options: ["une affectation", "une déclaration", "un commentaire", "une boucle"], bonne: 3, explication: "La boucle répète un bloc ; l'affectation se contente de donner une valeur à une variable." },
      { question: "Après les instructions x ← 3 ; y ← x + 2 ; x ← x × 2, que valent x et y ?", options: ["x = 5 et y = 6", "x = 6 et y = 5", "x = 6 et y = 10", "x = 3 et y = 5"], bonne: 1, explication: "y reçoit 3 + 2 = 5, puis x reçoit son ancienne valeur multipliée par 2, soit 6." },
      { question: "Le tri par sélection consiste à…", options: ["couper la liste en deux", "compter les éléments", "chercher le plus petit élément restant puis l'échanger", "additionner tous les éléments"], bonne: 2, explication: "À chaque tour, on sélectionne le plus petit élément non trié et on le place à sa position définitive." }
    ],
    documents: ["doc-memo-algorithmique"],
    tags: ["algorithme", "variables", "boucles", "tri"]
  },

  /* ── 8. Informatique · lycée ────────────────────────────── */
  {
    slug: "info-lycee-python",
    titre: "Programmer en Python",
    matiere: "informatique",
    niveau: "lycee",
    classe: "2de",
    duree: 50,
    difficulte: 2,
    resume: "Écrire ses premiers programmes Python : variables, conditions, boucles, fonctions et listes, puis les tester pas à pas.",
    objectifs: [
      "Écrire et exécuter un programme Python simple.",
      "Utiliser variables, types et opérateurs.",
      "Maîtriser les instructions conditionnelles et les boucles.",
      "Définir et appeler une fonction qui traite une liste."
    ],
    prerequis: [
      "Savoir ce qu'est un algorithme."
    ],
    sections: [
      {
        titre: "Premier programme, variables et types",
        blocs: [
          { type: "p", texte: "Un programme Python s'écrit dans un fichier dont le nom se termine par .py, ou directement dans une console interactive. La fonction print affiche un résultat. Les blocs sont délimités par l'**indentation** : quatre espaces en début de ligne." },
          { type: "code", langage: "python", texte: `# Mon premier programme
nom = "Ada"
age = 36
print("Bonjour", nom, "!")
print("Dans deux ans, j'aurai", age + 2, "ans.")` },
          { type: "p", texte: "Une variable est un nom associé à une valeur. On distingue les types principaux : int pour un entier, float pour un réel, str pour une chaîne de caractères et bool pour un booléen, True ou False." },
          { type: "p", texte: "La fonction input renvoie toujours une chaîne : pour obtenir un nombre, il faut convertir avec int ou float, par exemple age = int(input('Quel âge ? '))." },
          { type: "p", texte: "Les opérateurs usuels sont +, −, *, /, // pour la division entière, % pour le reste et ** pour la puissance. Attention : / renvoie toujours un réel, donc 6 / 3 vaut 2.0 et non 2." },
          { type: "tableau", entetes: ["Type", "Exemple", "Remarque"], lignes: [
            ["int", "42", "opérations entières"],
            ["float", "3.14", "résultat approché"],
            ["str", "« bonjour »", "concaténation avec +"],
            ["bool", "True, False", "lié à and, or, not"]
          ] },
          { type: "encadre", titre: "À retenir", texte: "En Python, l'indentation de quatre espaces définit les blocs. Le signe = affecte une valeur, tandis que == teste une égalité." }
        ]
      },
      {
        titre: "Conditions et boucles",
        blocs: [
          { type: "p", texte: "Une **instruction conditionnelle** exécute un bloc si une condition est vraie, un autre sinon. On écrit if, elif et else, suivis de deux-points et d'un bloc indenté. Les comparaisons sont ==, !=, <, >, <= et >= ; on peut les combiner avec and, or et not." },
          { type: "code", langage: "python", texte: `age = int(input('Quel âge as-tu ? '))
if age >= 18:
    print("Tu es majeur.")
elif age >= 13:
    print("Tu es adolescent.")
else:
    print("Tu es un enfant.")` },
          { type: "p", texte: "La boucle **for** parcourt une séquence. La fonction range(1, 11) produit les entiers de 1 à 10 inclus. La boucle **while** répète un bloc tant qu'une condition reste vraie." },
          { type: "code", langage: "python", texte: `total = 0
for n in range(1, 11):
    total = total + n
print(total)  # 55` },
          { type: "p", texte: "Dans une boucle while, il faut modifier la variable testée, sinon la boucle ne s'arrête jamais. L'instruction break permet de sortir immédiatement d'une boucle." },
          { type: "code", langage: "python", texte: `n = 1
while n <= 64:
    n = n * 2
print(n)  # 128` },
          { type: "exemple", titre: "Exemple guidé", texte: "Déroulons la boucle while ci-dessus. Étape 1 — n vaut 1, la condition 1 <= 64 est vraie, n devient 2. Étape 2 — 2 <= 64 est vraie, n devient 4. Étape 3 — la valeur double à chaque tour : 8, 16, 32, puis 64. Étape 4 — 64 <= 64 est encore vraie, n devient 128 ; la condition 128 <= 64 est fausse, la boucle s'arrête et print affiche 128." },
          { type: "encadre", titre: "À retenir", texte: "for parcourt une séquence connue ; while répète tant qu'une condition est vraie. Le bloc indenté doit faire évoluer la condition vers la fin de la boucle." }
        ]
      },
      {
        titre: "Fonctions et listes",
        blocs: [
          { type: "p", texte: "Une **fonction** regroupe des instructions sous un nom. On la définit avec def, on indique ses paramètres entre parenthèses, et on renvoie un résultat avec return. Une fonction sans return renvoie None." },
          { type: "code", langage: "python", texte: `def moyenne(notes):
    """Renvoie la moyenne d'une liste de nombres."""
    if len(notes) == 0:
        return None
    return sum(notes) / len(notes)

notes = [12, 15, 9, 17]
print(moyenne(notes))  # 13.25` },
          { type: "p", texte: "Une **liste** est une suite ordonnée de valeurs, écrite entre crochets : notes = [12, 15, 9, 17]. Les indices commencent à 0 : notes[0] vaut 12 et notes[-1] vaut 17. La fonction len donne la longueur, et notes[1:3] découpe un sous-ensemble." },
          { type: "tableau", entetes: ["Expression", "Résultat"], lignes: [
            ["notes[0]", "12"],
            ["notes[-1]", "17"],
            ["len(notes)", "4"],
            ["notes[1:3]", "[15, 9]"],
            ["sum(notes)", "53"],
            ["max(notes)", "17"]
          ] },
          { type: "p", texte: "On peut construire une liste vide puis l'alimenter : resultats = [] puis resultats.append(15). La méthode append ajoute un élément en fin de liste." },
          { type: "p", texte: "Une fonction se documente avec une **docstring** entre triples guillemets, placée juste après la ligne def. Elle explique ce que fait la fonction et aide les autres programmeurs à la réutiliser." }
        ]
      },
      {
        titre: "Un exemple complet",
        blocs: [
          { type: "p", texte: "Construisons un programme qui compte les notes supérieures ou égales à 10." },
          { type: "code", langage: "python", texte: `notes = [12, 8, 15, 9, 17]
admis = 0
for note in notes:
    if note >= 10:
        admis = admis + 1
print("Notes au-dessus de 10 :", admis)  # 3` },
          { type: "p", texte: "La variable admis démarre à 0. À chaque tour, la condition note >= 10 est testée ; quand elle est vraie, admis augmente de 1. À la fin, admis vaut 3, car 12, 15 et 17 dépassent 10." },
          { type: "liste-num", items: [
            "Lire l'énoncé et reformuler ce qui est demandé.",
            "Identifier les entrées, les sorties et les contraintes.",
            "Écrire l'algorithme en pseudo-code.",
            "Coder en Python, en respectant l'indentation.",
            "Tester : cas normal, cas limite, liste vide."
          ] },
          { type: "p", texte: "Les erreurs fréquentes sont l'oubli d'indentation, l'usage de = au lieu de == et les conversions oubliées après input. Python affiche un message qui indique la ligne fautive : il faut le lire avant de corriger." },
          { type: "encadre", titre: "À retenir", texte: "Un programme se construit par étapes : écrire, exécuter, tester, corriger. Les messages d'erreur indiquent la ligne à relire." }
        ]
      }
    ],
    quiz: [
      { question: "Quel est le résultat de print(7 // 2) ?", options: ["3.5", "3", "4", "1"], bonne: 1, explication: "// donne la division entière : 7 divisé par 2 vaut 3, reste 1." },
      { question: "Quelle boucle parcourt les entiers de 1 à 10 inclus ?", options: ["for n in range(1, 11):", "for n in range(1, 10):", "for n in range(10):", "for n in range(11):"], bonne: 0, explication: "range(1, 11) s'arrête avant 11, donc il produit 1, 2, …, 10." },
      { question: "Que renvoie une fonction sans instruction return ?", options: ["0", "une chaîne vide", "None", "une erreur"], bonne: 2, explication: "En Python, une fonction qui ne renvoie rien explicitement renvoie la valeur spéciale None." },
      { question: "Quel est le résultat de len([12, 15, 9, 17]) ?", options: ["3", "5", "12", "4"], bonne: 3, explication: "len renvoie le nombre d'éléments de la liste, ici quatre." }
    ],
    documents: ["doc-memo-algorithmique"],
    tags: ["python", "programmation", "boucles", "fonctions"]
  },

  /* ── 9. Informatique · université ───────────────────────── */
  {
    slug: "info-univ-bases-donnees",
    titre: "Modèle relationnel et SQL",
    matiere: "informatique",
    niveau: "universite",
    classe: "L2",
    duree: 60,
    difficulte: 3,
    resume: "Comprendre le modèle relationnel, les clés et l'intégrité, puis interroger une base avec SELECT, JOIN et GROUP BY en SQL.",
    objectifs: [
      "Définir relation, attribut, tuple et schéma relationnel.",
      "Distinguer clé candidate, clé primaire et clé étrangère.",
      "Écrire des requêtes SELECT avec jointure et agrégats.",
      "Identifier les anomalies traitées par la normalisation."
    ],
    prerequis: [
      "Savoir ce qu'est une table de données.",
      "Connaître les bases de la logique des ensembles."
    ],
    sections: [
      {
        titre: "Du modèle relationnel aux tables",
        blocs: [
          { type: "p", texte: "Le modèle relationnel a été proposé par Edgar F. Codd en 1970. Les données y sont organisées en **relations**, que l'on représente par des **tables** : des lignes, les **tuples**, et des colonnes, les **attributs**." },
          { type: "p", texte: "Un attribut est associé à un **domaine**, c'est-à-dire l'ensemble de ses valeurs admissibles : INT, VARCHAR(50) ou DATE par exemple. Chaque ligne décrit une occurrence, chaque colonne une propriété. Le **schéma** d'une relation précise les attributs et leurs domaines, comme Etudiant(numero, nom, filiere)." },
          { type: "p", texte: "Contrairement à un tableur, une relation est un **ensemble** : l'ordre des lignes et des colonnes n'a pas de sens, et les doublons ne sont pas autorisés dans le modèle théorique. Chaque valeur est **atomique**, non décomposable : c'est la première forme normale." },
          { type: "tableau", entetes: ["Terme relationnel", "Terme courant", "Sens"], lignes: [
            ["relation", "table", "ensemble de tuples"],
            ["attribut", "colonne", "propriété d'un tuple"],
            ["tuple", "ligne", "une occurrence"],
            ["domaine", "type", "valeurs autorisées"],
            ["schéma", "en-tête", "description de la structure"]
          ] },
          { type: "encadre", titre: "À retenir", texte: "Une relation est un ensemble de tuples sur un schéma fixé. L'ordre des lignes et des colonnes n'a aucune signification pour le système de gestion de base de données." }
        ]
      },
      {
        titre: "Clés et contraintes d'intégrité",
        blocs: [
          { type: "p", texte: "Une **clé candidate** est un ensemble minimal d'attributs qui identifie chaque tuple de façon unique. La **clé primaire** est la clé candidate retenue par le concepteur : elle est unique et non nulle. Une **clé étrangère** est un attribut qui référence la clé primaire d'une autre relation et garantit l'**intégrité référentielle**." },
          { type: "p", texte: "Des contraintes assurent la cohérence des données : NOT NULL, UNIQUE, CHECK, PRIMARY KEY et FOREIGN KEY. Sans clé, une table peut contenir des redondances et des incohérences : mise à jour incomplète, perte d'information lors d'une suppression." },
          { type: "code", langage: "sql", texte: `CREATE TABLE Etudiant (
  numero   INT PRIMARY KEY,
  nom      VARCHAR(50) NOT NULL,
  filiere  VARCHAR(30)
);

CREATE TABLE Inscription (
  id_etud  INT REFERENCES Etudiant(numero),
  code_ue  CHAR(6),
  annee    INT,
  note     NUMERIC(4,2) CHECK (note BETWEEN 0 AND 20),
  PRIMARY KEY (id_etud, code_ue, annee)
);` },
          { type: "p", texte: "La clé de Inscription est composée de trois attributs : un étudiant peut suivre plusieurs UE, et la même UE peut être suivie plusieurs années. id_etud référence Etudiant.numero : une inscription ne peut pas désigner un étudiant inexistant." },
          { type: "p", texte: "Lors d'une suppression, le comportement se règle : ON DELETE CASCADE supprime les inscriptions liées, ON DELETE RESTRICT les refuse. Ce choix relève de la conception, pas du détail technique." },
          { type: "encadre", titre: "À retenir", texte: "La clé primaire identifie chaque ligne de façon unique et non nulle ; la clé étrangère relie deux relations et empêche de référencer une ligne inexistante." }
        ]
      },
      {
        titre: "SQL : SELECT, JOIN et GROUP BY",
        blocs: [
          { type: "p", texte: "SQL est le langage des bases de données relationnelles. On distingue le **DDL** (CREATE, ALTER, DROP), le **DML** (SELECT, INSERT, UPDATE, DELETE) et le **DCL** (GRANT, REVOKE). La requête SELECT est la plus utilisée." },
          { type: "code", langage: "sql", texte: `SELECT nom, filiere
FROM Etudiant
WHERE filiere = 'Informatique'
ORDER BY nom;

SELECT e.nom, AVG(i.note) AS moyenne
FROM Etudiant e
JOIN Inscription i ON i.id_etud = e.numero
WHERE i.annee = 2026
GROUP BY e.numero, e.nom
HAVING AVG(i.note) >= 10
ORDER BY moyenne DESC;` },
          { type: "p", texte: "L'ordre logique d'évaluation est : FROM, puis WHERE, puis GROUP BY, puis HAVING, puis SELECT, puis ORDER BY. Une condition sur une ligne va dans WHERE ; une condition sur un groupe, après agrégation, va dans HAVING." },
          { type: "p", texte: "Les agrégats COUNT, SUM, AVG, MIN et MAX calculent une valeur à partir de plusieurs lignes. Une jointure combine deux relations selon une condition de rapprochement ; la jointure externe gauche, LEFT JOIN, conserve aussi les lignes de gauche sans correspondance, complétées par NULL." },
          { type: "tableau", entetes: ["Clause", "Rôle"], lignes: [
            ["FROM", "choisit les relations sources"],
            ["WHERE", "filtre les lignes"],
            ["GROUP BY", "regroupe les lignes"],
            ["HAVING", "filtre les groupes"],
            ["SELECT", "projette les colonnes"],
            ["ORDER BY", "trie le résultat"]
          ] },
          { type: "p", texte: "Ainsi, LEFT JOIN permet de lister tous les étudiants, même ceux qui n'ont aucune inscription : leur note apparaît alors comme NULL." }
        ]
      },
      {
        titre: "Normalisation et qualité du schéma",
        blocs: [
          { type: "p", texte: "La **normalisation** décompose un schéma pour éviter les redondances et les anomalies d'insertion, de mise à jour et de suppression. On rappelle qu'une **dépendance fonctionnelle** X → Y signifie : des valeurs égales sur X imposent des valeurs égales sur Y." },
          { type: "liste-num", items: [
            "1FN : valeurs atomiques, sans listes répétées.",
            "2FN : 1FN et aucune dépendance partielle d'un attribut non clé vis-à-vis d'une partie de clé candidate.",
            "3FN : 2FN et aucune dépendance transitive, un attribut non clé ne dépend que de la clé.",
            "BCNF : forme renforcée où tout déterminant d'une dépendance est une clé candidate."
          ] },
          { type: "p", texte: "Exemple : Commande(num_cmd, client, adresse_client). L'adresse dépend du client et non du numéro de commande, donc de façon transitive. On décompose en Client(client, adresse_client) et Commande(num_cmd, client)." },
          { type: "exemple", titre: "Exemple guidé", texte: "Normalisons Inscription(id_etud, nom_etud, code_ue, libelle_ue, note), de clé (id_etud, code_ue). Étape 1 — nom_etud ne dépend que de id_etud : dépendance partielle, on crée Etudiant(id_etud, nom_etud). Étape 2 — libelle_ue ne dépend que de code_ue : on crée UE(code_ue, libelle_ue). Étape 3 — il reste Inscription(id_etud, code_ue, note), en 3FN. Chaque fait n'est plus stocké qu'une seule fois." },
          { type: "p", texte: "Normaliser ne signifie pas tout séparer : la décomposition doit rester **sans perte**, c'est-à-dire que l'on peut reconstruire les données par jointure, et préserver les dépendances. Un schéma trop décomposé multiplie les jointures et nuit aux performances." },
          { type: "encadre", titre: "À retenir", texte: "Normaliser, c'est décomposer un schéma pour que chaque fait n'y soit représenté qu'une fois. On vise au minimum la 3FN, en protégeant les dépendances par des clés." }
        ]
      }
    ],
    quiz: [
      { question: "Dans le modèle relationnel, une clé primaire doit être…", options: ["unique mais peut être nulle", "toujours numérique", "unique et non nulle", "composée de tous les attributs"], bonne: 2, explication: "La clé primaire identifie chaque tuple : deux lignes ne peuvent pas partager la même valeur, et cette valeur ne peut pas être nulle." },
      { question: "Quelle clause filtre les groupes après agrégation ?", options: ["WHERE", "GROUP BY", "ORDER BY", "HAVING"], bonne: 3, explication: "WHERE filtre les lignes avant le regroupement ; HAVING filtre les groupes une fois les agrégats calculés." },
      { question: "Que vérifie une contrainte de clé étrangère ?", options: ["que la valeur référencée existe dans la relation cible", "que la valeur est unique", "que la valeur est positive", "que la colonne n'est jamais nulle"], bonne: 0, explication: "L'intégrité référentielle impose que toute valeur de clé étrangère corresponde à une clé primaire existante." },
      { question: "Quelle forme normale élimine les dépendances transitives ?", options: ["la 1FN", "la 3FN", "la 2FN", "la BCNF uniquement"], bonne: 1, explication: "La 3FN exige la 2FN et interdit qu'un attribut non clé dépende d'un autre attribut non clé." }
    ],
    documents: ["doc-annale-sql-qcm"],
    tags: ["SQL", "modèle relationnel", "clés", "normalisation"]
  }
]);
