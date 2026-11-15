/* ==========================================================================
   SepsHaness — données de référence
   Niveaux, matières, parcours guidés, badges, retours d'usage.
   Ne contient pas les cours ni les documents (fichiers dédiés).
   ========================================================================== */
(function () {
  "use strict";

  window.REG = window.REG || {};

  /* ---------------------------------------------------------------------
     Niveaux
     --------------------------------------------------------------------- */
  window.REG.niveaux = [
    {
      id: "primaire",
      nom: "Primaire",
      detail: "Du CP au CM2",
      ages: "6 – 11 ans",
      teinte: "amber",
      icone: "crayon",
      description:
        "Des leçons courtes, très illustrées, pour consolider la lecture, le calcul et la découverte du monde.",
      points: ["Leçons de 20 à 30 minutes", "Exercices guidés pas à pas", "Fiches à imprimer pour réviser"],
      matieres: ["mathematiques", "francais", "sciences"]
    },
    {
      id: "college",
      nom: "Collège",
      detail: "De la 6e à la 3e",
      ages: "11 – 15 ans",
      teinte: "indigo",
      icone: "livre",
      description:
        "Le socle du brevet : méthodes claires, fiches de révision et quiz pour vérifier les acquis.",
      points: ["Méthodes pas à pas", "Fiches de révision prêtes à l'emploi", "Quiz corrigés par chapitre"],
      matieres: ["mathematiques", "francais", "sciences", "histoire-geo", "informatique", "langues"]
    },
    {
      id: "lycee",
      nom: "Lycée",
      detail: "De la 2de à la Terminale",
      ages: "15 – 18 ans",
      teinte: "violet",
      icone: "parcours",
      description:
        "Approfondir, structurer sa pensée et se préparer aux épreuves du baccalauréat avec des parcours ciblés.",
      points: ["Cours approfondis par spécialité", "Méthodes d'examen (dissertation, commentaire)", "Annales et formulaires"],
      matieres: ["mathematiques", "francais", "sciences", "histoire-geo", "philosophie", "economie", "informatique", "langues"]
    },
    {
      id: "universite",
      nom: "Université",
      detail: "Licence et Master",
      ages: "18 ans et +",
      teinte: "teal",
      icone: "etude",
      description:
        "Des supports académiques exigeants : cours structurés, bibliographies, annales et entraînement à l'argumentation.",
      points: ["Cours structurés niveau licence", "Documents et annales corrigées", "Espace de travail pour organiser ses révisions"],
      matieres: ["informatique", "economie", "francais", "histoire-geo", "mathematiques"]
    }
  ];

  /* ---------------------------------------------------------------------
     Matières
     --------------------------------------------------------------------- */
  window.REG.matieres = [
    {
      id: "mathematiques",
      nom: "Mathématiques",
      icone: "sigma",
      teinte: "indigo",
      description: "Nombres, calcul, géométrie, fonctions et raisonnement."
    },
    {
      id: "francais",
      nom: "Français",
      icone: "livre",
      teinte: "rose",
      description: "Lecture, langue, expression écrite et méthodes d'examen."
    },
    {
      id: "sciences",
      nom: "Sciences",
      icone: "atome",
      teinte: "emerald",
      description: "Sciences de la vie, physique et chimie, démarche scientifique."
    },
    {
      id: "histoire-geo",
      nom: "Histoire-Géographie",
      icone: "globe",
      teinte: "amber",
      description: "Repères chronologiques, cartes, territoires et sociétés."
    },
    {
      id: "informatique",
      nom: "Informatique",
      icone: "code",
      teinte: "cyan",
      description: "Algorithmique, programmation Python, données et bases de données."
    },
    {
      id: "philosophie",
      nom: "Philosophie",
      icone: "bulle",
      teinte: "violet",
      description: "Notions, problématisation et argumentation philosophique."
    },
    {
      id: "economie",
      nom: "Économie",
      icone: "graphique",
      teinte: "orange",
      description: "Marchés, agents, mécanismes économiques et enjeux contemporains."
    },
    {
      id: "langues",
      nom: "Langues",
      icone: "monde",
      teinte: "teal",
      description: "Anglais : grammaire, vocabulaire et expression."
    }
  ];

  /* ---------------------------------------------------------------------
     Parcours guidés — chaque cours doit exister (catalogue du contrat §6.3)
     --------------------------------------------------------------------- */
  window.REG.parcours = [
    {
      id: "parcours-fondamentaux-primaire",
      titre: "Bien démarrer au primaire",
      description:
        "Trois leçons pour consolider la lecture, les nombres décimaux et la découverte de la matière, avec des fiches à imprimer.",
      niveau: "primaire",
      teinte: "amber",
      icone: "crayon",
      duree: "1 h 20",
      rythme: "3 séances de 25 à 30 min",
      pourQui: "Élèves de CM1 et CM2, parents qui accompagnent les devoirs",
      objectifs: [
        "Lire un récit court et en dégager les informations essentielles.",
        "Comparer, ranger et calculer avec des nombres décimaux.",
        "Reconnaître les trois états de la matière dans des situations du quotidien."
      ],
      cours: ["fra-primaire-lecture", "math-primaire-decimaux", "sci-primaire-etats-matiere"]
    },
    {
      id: "parcours-reussir-college",
      titre: "Réussir le collège",
      description:
        "Fractions, analyse de phrase, cellule et Révolution française : les fondations du brevet, matière par matière.",
      niveau: "college",
      teinte: "indigo",
      icone: "livre",
      duree: "2 h 30",
      rythme: "4 séances de 35 à 40 min",
      pourQui: "Élèves de 6e à la 3e qui veulent des bases solides",
      objectifs: [
        "Simplifier, comparer et additionner des fractions.",
        "Repérer le sujet, le verbe et les compléments d'une phrase.",
        "Expliquer le rôle de la cellule et de ses organites.",
        "Situer les grandes étapes de la Révolution française et leurs effets."
      ],
      cours: ["math-college-fractions", "fra-college-analyse-phrase", "sci-college-cellule", "hg-college-revolution"]
    },
    {
      id: "parcours-preparer-bac",
      titre: "Préparer le baccalauréat",
      description:
        "Fonctions affines, dissertation, guerre froide et conscience : un parcours pour structurer les épreuves du bac.",
      niveau: "lycee",
      teinte: "violet",
      icone: "trophee",
      duree: "3 h 15",
      rythme: "4 séances de 45 à 55 min",
      pourQui: "Élèves de 1re et de Terminale en voie générale",
      objectifs: [
        "Relier une fonction affine à sa droite et à son coefficient directeur.",
        "Construire une dissertation : problématique, plan et transitions.",
        "Analyser les grandes phases de la guerre froide.",
        "Problématiser la notion de conscience et l'illustrer par des exemples."
      ],
      cours: ["math-lycee-fonctions-affines", "fra-lycee-dissertation", "hg-lycee-guerre-froide", "philo-lycee-conscience"]
    },
    {
      id: "parcours-numerique",
      titre: "Comprendre le numérique",
      description:
        "De l'algorithme au modèle relationnel : les concepts informatiques essentiels, du collège à la licence.",
      niveau: "college",
      teinte: "cyan",
      icone: "code",
      duree: "2 h 30",
      rythme: "3 séances de 40 à 60 min",
      pourQui: "Curieux du code, élèves de 4e, étudiants de L1 et L2",
      objectifs: [
        "Décrire un algorithme simple avec des instructions, des tests et des boucles.",
        "Écrire et exécuter un programme Python qui manipule des données.",
        "Modéliser une base de données et écrire des requêtes SQL."
      ],
      cours: ["info-college-algorithmique", "info-lycee-python", "info-univ-bases-donnees"]
    },
    {
      id: "parcours-methode-universite",
      titre: "Méthode et argumentation à l'université",
      description:
        "Argumenter, modéliser et analyser : trois cours pour réussir ses premières années de licence en sciences humaines et économie.",
      niveau: "universite",
      teinte: "teal",
      icone: "etude",
      duree: "2 h 45",
      rythme: "3 séances de 50 à 60 min",
      pourQui: "Étudiants de L1 et L2 en lettres, économie, informatique",
      objectifs: [
        "Construire une argumentation universitaire claire et sourcée.",
        "Analyser les arbitrages d'un consommateur avec les outils microéconomiques.",
        "Interroger une base de données relationnelle avec SQL."
      ],
      cours: ["fra-univ-argumentation", "eco-univ-microeconomie", "info-univ-bases-donnees"]
    },
    {
      id: "parcours-langues-lettres",
      titre: "Langues et lettres, du collège au lycée",
      description:
        "Renforcer sa grammaire anglaise et son expression écrite française, du présent simple à la dissertation.",
      niveau: "lycee",
      teinte: "rose",
      icone: "monde",
      duree: "2 h 00",
      rythme: "3 séances de 30 à 55 min",
      pourQui: "Élèves de 5e, 1re, et toute personne qui veut écrire mieux",
      objectifs: [
        "Employer le présent simple avec les bonnes marques de personne et de temps.",
        "Analyser la structure d'une phrase pour améliorer son expression.",
        "Organiser une dissertation en trois parties argumentées."
      ],
      cours: ["ang-college-present-simple", "fra-college-analyse-phrase", "fra-lycee-dissertation"]
    },
    {
      id: "parcours-energie-decider",
      titre: "L'énergie : mesurer, modéliser, décider",
      description:
        "Trois cours complémentaires pour comprendre l'énergie, la quantifier et éclairer les choix économiques qui l'entourent.",
      niveau: "lycee",
      teinte: "orange",
      icone: "courbe",
      duree: "2 h 10",
      rythme: "3 séances de 40 à 45 min",
      pourQui: "Élèves de 2de et 1re intéressés par les sciences, l'économie et les enjeux climatiques",
      objectifs: [
        "Exploiter une relation linéaire pour lire et représenter des données.",
        "Calculer une énergie et une puissance, puis comparer des consommations.",
        "Comprendre comment l'offre et la demande déterminent un prix."
      ],
      cours: ["math-lycee-fonctions-affines", "sci-lycee-energie", "eco-lycee-marche"]
    }
  ];

  /* ---------------------------------------------------------------------
     Badges — l'état « obtenu » est calculé par store.js
     --------------------------------------------------------------------- */
  window.REG.badges = [
    {
      id: "premier-cours",
      nom: "Premier pas",
      icone: "etoile",
      teinte: "amber",
      description: "Terminer un premier cours."
    },
    {
      id: "cinq-cours",
      nom: "En route",
      icone: "fleche-droite",
      teinte: "indigo",
      description: "Terminer 5 cours."
    },
    {
      id: "dix-cours",
      nom: "Studieux",
      icone: "medaille",
      teinte: "violet",
      description: "Terminer 10 cours."
    },
    {
      id: "quiz-parfait",
      nom: "Sans faute",
      icone: "succes",
      teinte: "emerald",
      description: "Obtenir 100 % à un quiz."
    },
    {
      id: "serie-3",
      nom: "Régularité",
      icone: "feu",
      teinte: "orange",
      description: "Travailler 3 jours d'affilée."
    },
    {
      id: "deux-heures",
      nom: "Deux heures bien investies",
      icone: "horloge",
      teinte: "cyan",
      description: "Cumuler 2 heures d'étude enregistrées."
    },
    {
      id: "trois-matieres",
      nom: "Esprit curieux",
      icone: "globe",
      teinte: "teal",
      description: "Suivre des cours dans au moins 3 matières différentes."
    },
    {
      id: "premiere-note",
      nom: "Mémoire vive",
      icone: "note",
      teinte: "rose",
      description: "Créer une première note dans l'espace de travail."
    },
    {
      id: "cinq-taches",
      nom: "Organisé",
      icone: "tache",
      teinte: "slate",
      description: "Terminer 5 tâches de son planning."
    },
    {
      id: "objectif-session",
      nom: "Concentration",
      icone: "minuteur",
      teinte: "indigo",
      description: "Enregistrer une session d'au moins 25 minutes au minuteur."
    }
  ];

  /* ---------------------------------------------------------------------
     Retours d'usage — exemples illustratifs (site de démonstration)
     --------------------------------------------------------------------- */
  window.REG.temoignages = [
    {
      nom: "Amina",
      role: "Terminale générale",
      initiales: "A",
      teinte: "violet",
      texte:
        "Les fiches de méthode m'ont servi pour la dissertation : la structure est expliquée étape par étape, avec un exemple entièrement rédigé."
    },
    {
      nom: "Karim",
      role: "Étudiant en L1 économie",
      initiales: "K",
      teinte: "teal",
      texte:
        "J'utilise l'espace de travail pour mes notes de cours et le suivi pour voir où passe mon temps d'étude. Le tableau de bord est très lisible."
    },
    {
      nom: "Une professeure de collège",
      role: "Mathématiques, 5e",
      initiales: "P",
      teinte: "indigo",
      texte:
        "Je recommande la bibliothèque pour les formulaires et les protocoles : les documents sont prêts, il suffit de les imprimer pour la classe."
    }
  ];
})();
