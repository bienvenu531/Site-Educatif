/* ---------------------------------------------------------------------------
   SepsHaness — cours « lettres » : français, histoire-géographie, philosophie,
   économie et langues. Propriétaire : CONTENU-LETTRES (voir docs/CONTRAT.md §6.3).
   Script classique (pas de module ES) : pousse dans window.REG.cours sans jamais
   écraser ce qu'un autre fichier de données a déjà enregistré.
   --------------------------------------------------------------------------- */
window.REG = window.REG || {};
window.REG.cours = (window.REG.cours || []).concat([
  {
    slug: "fra-primaire-lecture",
    titre: "Lire et comprendre un récit",
    matiere: "francais",
    niveau: "primaire",
    classe: "CE2",
    duree: 25,
    difficulte: 1,
    resume: "Apprendre à repérer les personnages, les lieux et les étapes d'une histoire pour mieux comprendre ce qu'on lit.",
    objectifs: [
      "Repérer les personnages et le lieu d'une histoire",
      "Retrouver le début, le milieu et la fin du récit",
      "Comprendre une information qui n'est pas écrite mot pour mot",
      "Raconter l'histoire avec ses propres mots"
    ],
    prerequis: [
      "Savoir lire seul un texte court",
      "Reconnaître les signes de ponctuation de la phrase"
    ],
    sections: [
      {
        titre: "Qui ? Où ? Quand ?",
        blocs: [
          { type: "p", texte: "Avant de lire une histoire en entier, on cherche trois informations de départ : **qui** fait l'histoire, **où** elle se passe et **quand** elle commence. Ces trois indices installent le décor." },
          { type: "p", texte: "Lis ce petit récit : « Ce matin-là, Lila sortit dans la cour avec son ballon. Le chien du voisin, un gros labrador noir, dormait près du portail. Lila compta jusqu'à trois et tira. Le ballon roula sous la voiture. Le chien ouvrit un œil, puis les deux. »" },
          { type: "liste", items: [
            "**Qui ?** Lila et le chien du voisin.",
            "**Où ?** Dans la cour, près du portail et d'une voiture.",
            "**Quand ?** Ce matin-là, au début de la journée."
          ] },
          { type: "p", texte: "On répond avec les mots du texte, puis on vérifie. Si le texte ne dit pas quelque chose, on ne l'invente pas. Lila a peut-être neuf ans, mais rien ne le prouve : ce n'est pas une information du récit." },
          { type: "encadre", titre: "À retenir", texte: "Pour comprendre un récit, je cherche d'abord qui, où et quand. Ces trois indices donnent le décor de l'histoire et m'aident à ne pas me perdre." }
        ]
      },
      {
        titre: "Le début, le milieu et la fin",
        blocs: [
          { type: "p", texte: "Une histoire avance dans le temps. On peut la découper en trois moments : le début présente les personnages et le lieu, le milieu montre une action ou un problème, la fin apporte une solution ou change quelque chose." },
          { type: "tableau", entetes: ["Moment", "Question à se poser", "Dans l'histoire de Lila"], lignes: [
            ["Début", "Qui est là ? Où ?", "Lila sort dans la cour avec son ballon"],
            ["Milieu", "Que se passe-t-il ?", "Elle tire et le ballon roule sous la voiture"],
            ["Fin", "Comment cela se termine-t-il ?", "Le chien se réveille"]
          ] },
          { type: "p", texte: "Des mots aident à suivre le temps : *d'abord*, *puis*, *ensuite*, *enfin*, *soudain*, *le lendemain*. Quand tu les rencontres, tu peux avancer ou reculer dans l'histoire sans te tromper." },
          { type: "p", texte: "Raconter avec ses propres mots, ce n'est pas réciter le texte par cœur. C'est dire l'essentiel dans l'ordre : d'abord Lila sort avec son ballon, puis elle tire, ensuite le ballon roule sous la voiture, enfin le chien se réveille." },
          { type: "exemple", titre: "Exemple guidé", texte: "Pour ranger les étapes, je relis et je souligne les mots de temps. « Ce matin-là » marque le début. « et tira » marque l'action. « puis les deux » marque la fin du passage. Je peux alors dire : au début, Lila joue dans la cour ; au milieu, elle tire au but ; à la fin, le chien se réveille." }
        ]
      },
      {
        titre: "Lire entre les lignes",
        blocs: [
          { type: "p", texte: "Tout n'est pas écrit. Parfois, le texte donne un indice et le lecteur comprend la suite : on dit qu'il fait une **inférence**. Comprendre un récit, c'est relier les phrases entre elles, pas seulement les lire une par une." },
          { type: "liste-num", items: [
            "Je lis la phrase : « Le chien ouvrit un œil, puis les deux. »",
            "Je me demande : que va-t-il se passer ensuite ?",
            "Je m'appuie sur ce que je sais : un chien réveillé peut se lever, aboyer ou courir.",
            "Je propose : le chien va probablement se lever et regarder le ballon."
          ] },
          { type: "p", texte: "Attention : une inférence doit rester **possible** avec le texte. « Le chien a mangé le ballon » n'est pas impossible, mais rien ne le dit. « Lila habite à Paris » ne peut pas se déduire : le texte ne parle ni de Paris ni de maison." },
          { type: "p", texte: "Pour vérifier une réponse, je cherche la phrase du texte qui la justifie. Si je ne trouve pas de phrase, je réponds que l'information n'est pas donnée. C'est une réponse juste, elle aussi." },
          { type: "encadre", titre: "À retenir", texte: "Lire, ce n'est pas seulement reconnaître des mots : c'est relier les mots entre eux pour comprendre ce qui n'est pas écrit." }
        ]
      }
    ],
    quiz: [
      { question: "Dans l'histoire, où se passe la scène ?", options: ["Dans un jardin public", "Dans une cour", "Dans une cuisine", "Dans une classe"], bonne: 1, explication: "Le texte dit « Lila sortit dans la cour » : la scène se passe dans une cour." },
      { question: "Quel animal apparaît dans le récit ?", options: ["Un chat", "Un oiseau", "Le chien du voisin", "Un cheval"], bonne: 2, explication: "Le texte parle du « chien du voisin », un gros labrador noir." },
      { question: "Quel mot indique le moment du début de l'histoire ?", options: ["Enfin", "Puis", "Soudain", "Ce matin-là"], bonne: 3, explication: "« Ce matin-là » situe l'histoire dans le temps, dès la première phrase." },
      { question: "Quelle information peut-on deviner sans qu'elle soit écrite ?", options: ["Le chien va probablement se lever", "Lila a exactement neuf ans", "Le ballon est neuf", "La voiture est rouge"], bonne: 0, explication: "Un chien qui ouvre les deux yeux va sans doute se lever : c'est une inférence possible. Les trois autres détails ne figurent pas dans le texte." }
    ],
    documents: [],
    tags: ["lecture", "récit", "compréhension"]
  },
  {
    slug: "fra-college-analyse-phrase",
    titre: "Analyser une phrase",
    matiere: "francais",
    niveau: "college",
    classe: "5e",
    duree: 35,
    difficulte: 1,
    resume: "Reconnaître le sujet, le verbe et les compléments d'une phrase pour l'analyser sans se tromper.",
    objectifs: [
      "Identifier le sujet et le verbe conjugué d'une phrase",
      "Distinguer complément d'objet direct et complément d'objet indirect",
      "Repérer les compléments circonstanciels",
      "Différencier une phrase simple d'une phrase complexe"
    ],
    prerequis: [
      "Reconnaître les classes de mots : nom, déterminant, adjectif, verbe",
      "Repérer le groupe sujet et le groupe verbal"
    ],
    sections: [
      {
        titre: "Le sujet et le verbe : le couple de base",
        blocs: [
          { type: "p", texte: "Analyser une phrase commence par une question simple : **où est le verbe conjugué ?** C'est lui qui donne le temps et la personne, et c'est lui qui commande l'accord du sujet. *Les élèves arrivent.* / *L'élève arrive.*" },
          { type: "p", texte: "On cherche ensuite de qui ou de quoi on parle : c'est le **sujet**. Pour le vérifier, on encadre le groupe avec « c'est … qui » : *Le chat de la voisine dort.* → *C'est le chat de la voisine qui dort.*" },
          { type: "liste", items: [
            "Le sujet commande l'accord du verbe en personne et en nombre.",
            "Le sujet peut être inversé : *Quand vient le printemps ?*",
            "Le sujet peut être un nom, un pronom, un infinitif ou une proposition : *Partir lui plaît.*"
          ] },
          { type: "p", texte: "Le sujet n'est donc pas toujours le premier mot de la phrase. Dans *Hier soir, les invités sont partis tard*, le sujet est *les invités*, et non *hier soir*, qui indique seulement le moment." },
          { type: "encadre", titre: "À retenir", texte: "On trouve le sujet en posant la question « qui est-ce qui ? » ou « qu'est-ce qui ? » devant le verbe, puis on vérifie avec l'encadrement « c'est … qui »." }
        ]
      },
      {
        titre: "Les compléments du verbe",
        blocs: [
          { type: "p", texte: "Certains verbes ne suffisent pas : ils réclament un complément. Ce complément fait partie du groupe verbal ; on ne peut ni le déplacer ni le supprimer sans rendre la phrase incomplète." },
          { type: "p", texte: "Le **complément d'objet direct (COD)** répond à la question *qui ?* ou *quoi ?* et n'est introduit par aucune préposition : *Le jardinier taille les rosiers.* → il taille **quoi ?** les rosiers. On peut le remplacer par *le, la, les* : *Le jardinier les taille.*" },
          { type: "p", texte: "Le **complément d'objet indirect (COI)** est introduit par une préposition, le plus souvent *à* ou *de* : *Il parle à son frère.* → il parle **à qui ?** à son frère. On peut le remplacer par *lui, leur, en, y* : *Il lui parle.*" },
          { type: "tableau", entetes: ["Test", "COD", "COI"], lignes: [
            ["Question posée", "qui ? quoi ?", "à qui ? à quoi ? de qui ? de quoi ?"],
            ["Préposition", "aucune", "à, de, avec, pour…"],
            ["Pronom de remplacement", "le, la, les", "lui, leur, en, y"],
            ["Exemple", "Elle regarde la mer.", "Elle pense à ses vacances."]
          ] },
          { type: "p", texte: "Attention aux verbes d'état : *être, sembler, paraître, devenir, rester, avoir l'air*. Ils ne prennent pas de COD mais un **attribut du sujet**, qui décrit le sujet et s'accorde avec lui : *Elle est médecin.*, *Ils semblent fatigués.* Même si l'on peut poser la question *quoi ?*, il n'y a pas d'objet." }
        ]
      },
      {
        titre: "Les compléments circonstanciels",
        blocs: [
          { type: "p", texte: "Les compléments circonstanciels précisent les **circonstances** de l'action : le temps, le lieu, la manière, le moyen, la cause, le but. Contrairement au COD, ils sont le plus souvent **déplaçables** et **supprimables**." },
          { type: "liste", items: [
            "**Temps** : quand ? combien de temps ? — *Hier soir, en deux heures.*",
            "**Lieu** : où ? — *Sur le tapis, dans la cour.*",
            "**Manière** : comment ? — *Avec soin, rapidement.*",
            "**Moyen** : avec quoi ? — *À vélo, par le train.*",
            "**Cause** : pourquoi ? — *À cause de la pluie.*",
            "**But** : dans quel but ? — *Pour gagner du temps.*"
          ] },
          { type: "p", texte: "Le test de suppression est décisif : *Le chat a renversé la soupe.* reste une phrase correcte, donc *sur le tapis* et *hier soir* sont circonstanciels. En revanche, *Le jardinier taille.* est incomplet : *les rosiers* est un COD, pas un complément circonstanciel." },
          { type: "p", texte: "Un même groupe peut changer de fonction selon la phrase. *Il court dans le parc* : *dans le parc* est circonstanciel de lieu. *Il va dans le parc* : le verbe *aller* exige ce groupe, qui est alors un complément essentiel, non supprimable sans rupture de sens." },
          { type: "encadre", titre: "À retenir", texte: "La fonction ne se devine pas : elle se prouve. Déplacer ou supprimer un groupe donne une bonne indication, mais c'est le sens du verbe qui tranche." }
        ]
      },
      {
        titre: "Phrase simple, phrase complexe",
        blocs: [
          { type: "p", texte: "On compte les **verbes conjugués**. Un seul verbe conjugué, même accompagné d'un infinitif ou d'un participe : la phrase est **simple**. *Il faut partir tôt.* → seul *faut* est conjugué." },
          { type: "p", texte: "Deux verbes conjugués ou plus : la phrase est **complexe** et contient autant de **propositions** que de verbes conjugués. Ces propositions sont reliées par **juxtaposition** (patine, virgule, point-virgule), **coordination** (*mais, ou, et, donc, or, ni, car*) ou **subordination** (*que, qui, quand, parce que…*)." },
          { type: "liste-num", items: [
            "Je souligne chaque verbe conjugué.",
            "J'écris une barre entre deux propositions.",
            "Je repère le mot qui les relie, ou la ponctuation."
          ] },
          { type: "exemple", titre: "Exemple guidé", texte: "Étudions : « Hier soir, le chat de ma voisine a renversé la soupe sur le tapis. » Étape 1 : un seul verbe conjugué (*a renversé*), donc phrase simple, une proposition. Étape 2 : sujet → c'est le chat de ma voisine qui… Étape 3 : *la soupe* répond à *a renversé quoi ?* sans préposition : COD. Étape 4 : *hier soir* et *sur le tapis* sont supprimables : compléments circonstanciels de temps et de lieu." }
        ]
      }
    ],
    quiz: [
      { question: "Dans « Le jardinier taille les rosiers », quelle est la fonction de « les rosiers » ?", options: ["Complément d'objet direct", "Complément d'objet indirect", "Complément circonstanciel de lieu", "Sujet"], bonne: 0, explication: "« les rosiers » répond à « taille quoi ? » sans préposition et peut être remplacé par « les » : c'est un COD." },
      { question: "Quelle phrase contient un complément d'objet indirect ?", options: ["Il mange une pomme.", "Il court très vite.", "Il parle à son frère.", "Il est fatigué."], bonne: 2, explication: "« à son frère » est introduit par la préposition « à » et se remplace par « lui » : c'est un COI." },
      { question: "Combien de propositions contient la phrase « Je pense que tu as raison » ?", options: ["Une", "Deux", "Trois", "Quatre"], bonne: 1, explication: "Il y a deux verbes conjugués, « pense » et « as », donc deux propositions reliées par la conjonction de subordination « que »." },
      { question: "Quel verbe est un verbe d'état ?", options: ["manger", "partir", "courir", "sembler"], bonne: 3, explication: "« sembler » exprime un état du sujet et appelle un attribut du sujet, jamais un COD." }
    ],
    documents: [],
    tags: ["grammaire", "phrase", "fonctions"]
  },
  {
    slug: "fra-lycee-dissertation",
    titre: "Construire une dissertation",
    matiere: "francais",
    niveau: "lycee",
    classe: "1re",
    duree: 55,
    difficulte: 3,
    resume: "Méthode complète pour analyser un sujet, bâtir un plan et rédiger une dissertation qui répond vraiment à la question posée.",
    objectifs: [
      "Analyser les mots-clés et les présupposés d'un sujet",
      "Formuler une problématique et un plan cohérent en deux ou trois parties",
      "Rédiger une introduction, des transitions et une conclusion",
      "Illustrer chaque argument par un exemple littéraire précis"
    ],
    prerequis: [
      "Connaître les genres littéraires et les objets d'étude de première",
      "Savoir citer et analyser brièvement un extrait d'œuvre"
    ],
    sections: [
      {
        titre: "Analyser le sujet, mot à mot",
        blocs: [
          { type: "p", texte: "L'épreuve écrite de français de première dure quatre heures et propose deux exercices au choix : le commentaire et la dissertation. La dissertation n'est pas un exposé libre sur une œuvre : c'est la réponse argumentée à une question précise." },
          { type: "p", texte: "La première étape consiste à souligner les **mots-clés**. Dans *Le théâtre est-il seulement un spectacle ?*, on repère trois mots : *théâtre*, *spectacle* et l'adverbe *seulement*, qui est décisif. Il ne demande pas si le théâtre est un spectacle (c'est une évidence) mais s'il se **réduit** à cela." },
          { type: "liste", items: [
            "Repérer le **verbe** du sujet : *peut-on*, *faut-il*, *est-il vrai que*… Il indique le type de réponse attendu.",
            "Dégager le **présupposé** : ce que le sujet tient déjà pour acquis.",
            "Réformuler le sujet en une phrase personnelle pour vérifier qu'on l'a compris.",
            "Délimiter le corpus possible : œuvres étudiées, genre, époque."
          ] },
          { type: "p", texte: "L'expression *dans quelle mesure* invite à mesurer et à nuancer : elle prépare un plan dialectique, jamais une réponse par oui ou par non. Une question fermée, elle, appelle une discussion avant de conclure par une position argumentée." }
        ]
      },
      {
        titre: "De la question à la problématique",
        blocs: [
          { type: "p", texte: "La **problématique** est la tension que le sujet fait apparaître. Elle ne se confond pas avec le sujet recopié, ni avec une question de cours du type « qu'est-ce que le théâtre ? ». Elle met en regard deux réponses possibles et demande laquelle est la plus juste, ou comment les concilier." },
          { type: "p", texte: "Une formule utile : « Le sujet suppose que… Or, si l'on admet que…, on peut soutenir que… Dès lors, dans quelle mesure… ? » Ce patron oblige à formuler la difficulté avant de la résoudre." },
          { type: "tableau", entetes: ["Ce qu'il faut éviter", "Ce qu'il faut produire"], lignes: [
            ["« Qu'est-ce que le théâtre ? »", "« Le théâtre, art de la représentation, ne se réduit-il pas aussi à un texte qui se lit et se pense ? »"],
            ["« Le théâtre est-il un spectacle ? »", "« En quoi la représentation est-elle nécessaire au théâtre sans pour autant l'y enfermer ? »"],
            ["Un constat général", "Une tension entre deux thèses défendables"]
          ] },
          { type: "p", texte: "La problématique doit rester **fidèle au sujet** : si elle parle de la lecture alors que le sujet porte sur la représentation, le hors-sujet guette. Le correcteur évalue d'abord la réponse à la question posée." }
        ]
      },
      {
        titre: "Choisir et remplir un plan",
        blocs: [
          { type: "p", texte: "Trois plans dominent. Le **plan dialectique** confronte une thèse, son antithèse et un dépassement. Le **plan thématique** organise la réflexion autour de deux ou trois aspects du sujet. Le **plan analytique** examine successivement les causes, les manifestations, les conséquences d'un phénomène littéraire." },
          { type: "p", texte: "Pour le sujet sur le théâtre, un plan dialectique tient en trois parties. **I.** Le théâtre est d'abord un spectacle : corps des acteurs, mise en scène, espace, lumière, public réuni. **II.** Mais l'œuvre théâtrale est aussi un texte : langue, répliques, dramaturgie, personnages, qu'on lit et qu'on étudie. **III.** Le spectacle est une lecture : la représentation actualise et interprète un texte, sans l'annuler." },
          { type: "liste", items: [
            "Chaque partie répond à une **thèse claire**, formulée en une phrase.",
            "Chaque sous-partie apporte **un argument et un exemple** analysé, pas une liste de titres.",
            "Chaque partie se termine par une **transition** qui annonce la suivante.",
            "Un plan « catalogue » (une partie par siècle, une partie par auteur) ne démontre rien."
          ] },
          { type: "p", texte: "Les exemples doivent être **précis** : auteur, œuvre, date si possible, et une courte citation correctement insérée. Une référence vague (« comme dans beaucoup de pièces classiques ») ne prouve rien et fait perdre des points." },
          { type: "encadre", titre: "À retenir", texte: "Une dissertation n'est pas la liste de tout ce que vous savez : c'est une démonstration qui répond, partie après partie, à une question posée." }
        ]
      },
      {
        titre: "Rédiger : introduction, paragraphes, conclusion",
        blocs: [
          { type: "p", texte: "L'introduction comporte quatre moments : une **amorce** (contexte littéraire ou actualité de la question), la **présentation du sujet** et de ses mots-clés, la **problématique**, puis l'**annonce du plan**. En dix à quinze lignes, elle doit déjà laisser deviner la réponse." },
          { type: "exemple", titre: "Exemple guidé", texte: "Amorce : « Depuis l'Antiquité, le théâtre rassemble un public autour d'acteurs qui incarnent des personnages sur scène. » Présentation : « Pourtant, l'œuvre dramatique est aussi un texte publié, lu et étudié. Le sujet demande si le théâtre n'est que cela : un spectacle. » Problématique : « En quoi la représentation est-elle nécessaire au théâtre sans pour autant en épuiser le sens ? » Annonce : « Nous verrons d'abord que le théâtre est un spectacle, puis qu'il est un texte, enfin que la représentation interprète ce texte. »" },
          { type: "p", texte: "Chaque paragraphe se construit en trois temps : une **phrase d'idée** qui affirme la thèse, un argument qui l'explique, un exemple analysé qui la prouve. La dernière phrase du paragraphe relie l'idée au sujet, pour éviter l'impression de catalogue." },
          { type: "p", texte: "La conclusion répond à la problématique en deux temps : un **bilan** qui rappelle le trajet du raisonnement, puis une **ouverture** qui prolonge la réflexion sans poser une question entièrement nouvelle. On ne rédige pas d'ouverture sur une autre œuvre non étudiée." },
          { type: "liste-num", items: [
            "15 minutes : lire le sujet, analyser les termes, noter les exemples au brouillon.",
            "20 minutes : formuler la problématique, arrêter le plan, écrire les idées de chaque sous-partie.",
            "2 h 30 : rédiger l'introduction, le développement, les transitions et la conclusion.",
            "20 à 25 minutes : relire pour l'orthographe, l'accord des citations et la cohérence du plan."
          ] }
        ]
      }
    ],
    quiz: [
      { question: "Que doit annoncer la dernière phrase de l'introduction ?", options: ["Le titre de l'œuvre étudiée", "La date de publication", "La citation qui sera utilisée", "Le plan, c'est-à-dire les parties dans l'ordre"], bonne: 3, explication: "L'introduction se termine par l'annonce du plan, qui permet au lecteur de suivre la démonstration." },
      { question: "Un plan dialectique comporte le plus souvent…", options: ["une seule partie très développée", "une thèse, une antithèse et un dépassement", "un résumé de l'œuvre", "trois exemples sans idée directrice"], bonne: 1, explication: "Le plan dialectique confronte une thèse à son contraire avant de proposer un dépassement qui répond au sujet." },
      { question: "Dans un plan thématique, les parties sont organisées…", options: ["autour des grands thèmes du sujet", "selon la longueur des citations", "par ordre de difficulté croissante", "par ordre alphabétique des auteurs"], bonne: 0, explication: "Le plan thématique découpe le sujet en aspects ou thèmes successifs, chacun constituant une partie." },
      { question: "Combien de temps dure l'épreuve écrite de français de première ?", options: ["3 heures", "2 heures", "4 heures", "5 heures"], bonne: 2, explication: "L'épreuve écrite anticipée de français dure quatre heures et propose commentaire ou dissertation au choix." }
    ],
    documents: ["doc-methode-dissertation"],
    tags: ["dissertation", "méthode", "argumentation"]
  },
  {
    slug: "fra-univ-argumentation",
    titre: "Argumenter à l'université",
    matiere: "francais",
    niveau: "universite",
    classe: "L1",
    duree: 50,
    difficulte: 2,
    resume: "Maîtriser la structure d'une argumentation académique : thèse, preuves, concessions, réfutation et usage critique des sources.",
    objectifs: [
      "Identifier la thèse, les arguments et les preuves d'un texte universitaire",
      "Construire un paragraphe argumentatif avec une règle de preuve explicite",
      "Répondre à une objection par la concession puis la réfutation",
      "Repérer et éviter les sophismes les plus courants"
    ],
    prerequis: [
      "Savoir lire un texte argumentatif en repérant sa structure",
      "Savoir citer une source et en donner la référence"
    ],
    sections: [
      {
        titre: "Qu'est-ce qu'argumenter à l'université ?",
        blocs: [
          { type: "p", texte: "Argumenter, ce n'est pas donner son avis : c'est soutenir une **thèse** par des **raisons** que d'autres peuvent examiner, discuter et contester. Une affirmation sans preuve reste une opinion, même brillante. Le critère universitaire n'est pas la force de la conviction, mais la solidité du lien entre ce qu'on avance et ce qui le justifie." },
          { type: "p", texte: "La tradition rhétorique distingue trois moyens de persuasion, analysés par Aristote dans la *Rhétorique* : le **logos**, la logique du raisonnement ; l'**ethos**, l'image de compétence que l'auteur donne de lui-même ; le **pathos**, les émotions du lecteur. Dans un travail académique, le logos doit dominer." },
          { type: "p", texte: "Un bon argument est **réfutable** : on doit pouvoir dire à quelles conditions il serait faux. « La lecture régulière améliore la syntaxe écrite des étudiants » est discutable et testable. « Il faut lire » est si vague qu'aucune observation ne peut le contredire — et donc ne peut le prouver." },
          { type: "liste", items: [
            "La **thèse** : la position défendue, formulée en une phrase claire.",
            "Les **arguments** : les raisons qui soutiennent la thèse.",
            "Les **preuves** : données, textes, exemples, résultats d'études.",
            "Les **objections** : les raisons de douter, qu'il faut traiter et non ignorer."
          ] },
          { type: "encadre", titre: "À retenir", texte: "Argumenter, c'est rendre son raisonnement vérifiable par un lecteur qui n'est pas d'accord au départ." }
        ]
      },
      {
        titre: "Le squelette d'un paragraphe argumentatif",
        blocs: [
          { type: "p", texte: "Stephen Toulmin propose dans *The Uses of Argument* (1958) une grille devenue classique pour analyser un raisonnement : elle distingue la thèse, les données, la garantie qui autorise le passage des données à la thèse, le soutien de cette garantie, le qualificateur et les conditions de réfutation." },
          { type: "tableau", entetes: ["Élément", "Fonction", "Exemple"], lignes: [
            ["Thèse (claim)", "Ce que l'on veut établir", "L'apprentissage des langues devrait commencer tôt"],
            ["Données", "Ce sur quoi l'on s'appuie", "Les jeunes enfants imitent mieux les sons nouveaux"],
            ["Garantie", "La règle qui relie données et thèse", "Or la prononciation s'acquiert surtout par imitation"],
            ["Soutien", "Ce qui justifie la garantie", "Travaux de phonétique et observations de terrain"],
            ["Qualificateur", "Le degré de certitude", "Dans la plupart des cas"],
            ["Réfutation", "Quand la thèse échoue", "Si l'enseignement est de mauvaise qualité"]
          ] },
          { type: "p", texte: "Un paragraphe académique suit souvent cet ordre : **phrase d'idée** (la thèse locale), **preuve** (donnée ou citation), **explicitation de la garantie** (« puisque… », « ce qui montre que… »), **nuance** (limite ou objection). La garantie est l'étape la plus souvent oubliée : sans elle, le lecteur doit deviner pourquoi la preuve prouve." },
          { type: "exemple", titre: "Exemple guidé", texte: "Thèse locale : « L'université doit enseigner explicitement la méthode de l'argumentation écrite. » Donnée : « Beaucoup d'étudiants de première année confondent l'exposé d'une opinion et la démonstration d'une thèse. » Garantie : « Or ces deux exercices exigent des opérations différentes : formuler une thèse réfutable, choisir des preuves, traiter une objection. » Nuance : « Cette difficulté ne vient pas seulement du lycée : les attendus universitaires sont rarement explicités. » Le paragraphe est complet : chaque affirmation est reliée à la suivante." }
        ]
      },
      {
        titre: "Concession et réfutation",
        blocs: [
          { type: "p", texte: "Concéder, c'est reconnaître la part de vérité d'une thèse adverse avant d'en marquer les limites. Loin d'affaiblir l'argumentation, la concession la rend crédible : elle montre que l'auteur a examiné les objections au lieu de les éviter." },
          { type: "liste", items: [
            "« Certes…, mais… » : accorde un point, puis limite sa portée.",
            "« Il est vrai que… toutefois… » : même mouvement, registre plus soutenu.",
            "« On objectera que… Or… » : expose l'objection avant de la traiter."
          ] },
          { type: "p", texte: "La réfutation porte sur le **raisonnement**, non sur la personne. On distingue la réfutation *ad rem*, qui attaque le fond (prémisse fausse, inférence invalide), et la réfutation *ad hominem*, qui vise l'auteur : c'est un sophisme, pas une objection." },
          { type: "p", texte: "Il faut aussi distinguer l'objection du contre-exemple. L'objection conteste un maillon du raisonnement ; le contre-exemple montre un cas où la conclusion échoue. Un contre-exemple unique suffit à ruiner une affirmation universelle, mais pas une affirmation statistique." },
          { type: "p", texte: "Concéder n'est pas capituler : on ne donne pas raison à l'adversaire, on **délimite** la validité de sa thèse. Une argumentation sans concession paraît dogmatique ; une argumentation qui concède tout n'argumente plus." }
        ]
      },
      {
        titre: "Sophismes et usage des sources",
        blocs: [
          { type: "p", texte: "Un **paralogisme** est un raisonnement faux sans intention de tromper ; un **sophisme** est un raisonnement faux destiné à convaincre par la ruse. Les deux se repèrent en reconstruisant explicitement les prémisses, puis en vérifiant si la conclusion en découle." },
          { type: "tableau", entetes: ["Sophisme", "Mécanisme", "Comment le repérer"], lignes: [
            ["Ad hominem", "Attaquer la personne au lieu de l'argument", "Remplacer l'auteur par sa thèse : la critique tient-elle ?"],
            ["Homme de paille", "Déformer la thèse adverse pour la réfuter", "Comparer la reformulation à la thèse d'origine"],
            ["Appel à l'autorité", "Prendre une citation pour une preuve", "L'auteur est-il compétent sur ce point précis ?"],
            ["Pente glissante", "Enchaîner des conséquences non démontrées", "Chaque étape est-elle vraiment nécessaire ?"],
            ["Généralisation hâtive", "Conclure d'un cas à tous les cas", "L'échantillon est-il représentatif ?"],
            ["Faux dilemme", "Ne proposer que deux options", "Existe-t-il une troisième possibilité ?"]
          ] },
          { type: "p", texte: "Citer un auteur n'est pas argumenter : une autorité n'est convaincante que si elle est compétente sur la question précise et si sa thèse est discutée. La citation doit être **commentée**, c'est-à-dire reliée à la démonstration." },
          { type: "p", texte: "L'usage des sources obéit à des règles simples : citer entre guillemets avec la référence complète (auteur, titre, date, page), paraphraser en indiquant la source, ne jamais présenter l'idée d'autrui comme la sienne. Le plagiat est une faute de méthode : il empêche le lecteur de vérifier ce qui est affirmé." }
        ]
      }
    ],
    quiz: [
      { question: "Que désigne le mot « logos » chez Aristote ?", options: ["L'image de l'orateur", "L'émotion du public", "La force du raisonnement", "Le volume de la voix"], bonne: 2, explication: "Le logos est le moyen de persuasion fondé sur le raisonnement, par opposition à l'ethos et au pathos." },
      { question: "Dans la grille de Toulmin, que désigne la « garantie » ?", options: ["La conclusion finale", "L'émotion du lecteur", "La bibliographie", "La règle qui autorise le passage des données à la thèse"], bonne: 3, explication: "La garantie est la règle implicite qui rend la preuve pertinente pour la thèse ; sans elle, le lien n'est pas démontré." },
      { question: "Qu'est-ce qu'une concession ?", options: ["Une erreur de raisonnement", "La reconnaissance d'une part de vérité chez l'adversaire", "Un abandon de la thèse", "Une citation sans référence"], bonne: 1, explication: "Concéder consiste à accorder un point limité pour mieux délimiter ensuite la portée de la thèse adverse." },
      { question: "Quel procédé attaque la personne plutôt que son argument ?", options: ["L'argument ad hominem", "La concession", "La paraphrase", "La réfutation ad rem"], bonne: 0, explication: "L'ad hominem est un sophisme : il disqualifie l'auteur au lieu d'examiner le raisonnement." }
    ],
    documents: ["doc-methode-dissertation"],
    tags: ["argumentation", "méthode", "rhétorique", "sources"]
  },
  {
    slug: "hg-college-revolution",
    titre: "La Révolution française",
    matiere: "histoire-geo",
    niveau: "college",
    classe: "4e",
    duree: 40,
    difficulte: 2,
    resume: "Comprendre les causes, les grandes étapes et l'héritage de la Révolution française, de la crise de 1789 au coup d'État de 1799.",
    objectifs: [
      "Situer les grandes étapes de la Révolution entre 1789 et 1799",
      "Expliquer les causes de la crise et le rôle des Lumières",
      "Décrire les transformations politiques et sociales de la France",
      "Relier les principes de 1789 à des règles encore en vigueur"
    ],
    prerequis: [
      "Connaître la monarchie absolue et la société d'ordres",
      "Lire une frise chronologique"
    ],
    sections: [
      {
        titre: "Une France en crise (1786-1789)",
        blocs: [
          { type: "p", texte: "À la fin du XVIIIe siècle, la société française est divisée en **trois ordres**. Le clergé et la noblesse sont privilégiés : ils ne paient pas certains impôts et possèdent des terres. Le tiers état, qui rassemble près de 98 % de la population, porte l'essentiel de l'impôt." },
          { type: "tableau", entetes: ["Ordre", "Qui ?", "Situation"], lignes: [
            ["Clergé", "Évêques, curés, moines", "Privilèges, dîme, grandes propriétés"],
            ["Noblesse", "Grande et petite noblesse", "Privilèges, droits seigneuriaux, impôts réduits"],
            ["Tiers état", "Paysans, artisans, bourgeois", "Impôts, corvées, aucune part au pouvoir politique"]
          ] },
          { type: "p", texte: "Le royaume est aussi en **crise financière** : l'État est endetté, notamment à cause de la guerre d'Amérique. Les mauvaises récoltes de 1788 font monter le prix du pain, principal aliment du peuple. Louis XVI, après avoir tenté des réformes, convoque les **États généraux** : la décision est prise en 1788 et l'ouverture a lieu le 5 mai 1789 à Versailles." },
          { type: "p", texte: "Partout, les Français rédigent des **cahiers de doléances** : ils y listent leurs plaintes et leurs espoirs devant l'impôt, la justice et les privilèges. Les idées des **Lumières** — Montesquieu sur la séparation des pouvoirs, Rousseau sur la souveraineté du peuple, Voltaire sur la tolérance — circulent et donnent un vocabulaire politique nouveau." }
        ]
      },
      {
        titre: "1789 : la monarchie se fissure",
        blocs: [
          { type: "p", texte: "Les députés du tiers état refusent de voter par ordre et se proclament **Assemblée nationale**. Le 20 juin 1789, ils jurent de ne pas se séparer avant d'avoir donné une constitution à la France : c'est le **Serment du Jeu de paume**." },
          { type: "p", texte: "Le 14 juillet 1789, une foule parisienne s'empare de la **Bastille**, forteresse royale qui symbolise l'arbitraire du pouvoir. Dans les semaines qui suivent, la **nuit du 4 août** abolit les privilèges, puis l'Assemblée adopte la **Déclaration des droits de l'homme et du citoyen** le 26 août : son article 1 proclame que « les hommes naissent et demeurent libres et égaux en droits »." },
          { type: "liste", items: [
            "5 mai 1789 : ouverture des États généraux à Versailles.",
            "20 juin 1789 : Serment du Jeu de paume.",
            "14 juillet 1789 : prise de la Bastille.",
            "4 août 1789 : abolition des privilèges.",
            "26 août 1789 : Déclaration des droits de l'homme et du citoyen.",
            "5-6 octobre 1789 : marche des femmes sur Versailles, retour forcé du roi à Paris.",
            "14 juillet 1790 : fête de la Fédération, célébration de l'unité nationale."
          ] },
          { type: "p", texte: "La monarchie devient **constitutionnelle** : la Constitution de septembre 1791 organise une souveraineté nationale exercée par une Assemblée, même si Louis XVI conserve le pouvoir exécutif. Les départements sont créés en 1790 et l'État civil est confié aux municipalités en 1792 : l'administration du pays est désormais rationalisée." }
        ]
      },
      {
        titre: "1792-1794 : la République, la guerre et la Terreur",
        blocs: [
          { type: "p", texte: "La guerre déclarée à l'Autriche le 20 avril 1792 aggrave tout. Le 10 août 1792, la monarchie tombe ; la victoire de **Valmy** (20 septembre 1792) sauve la Révolution. Le lendemain, 21 septembre 1792, l'Assemblée législative abolit la royauté : c'est la proclamation de la **République**." },
          { type: "p", texte: "Louis XVI est jugé et exécuté le 21 janvier 1793. L'Europe coalisée envahit la France, la Vendée se soulève : la République doit faire face à la guerre extérieure et aux révoltes intérieures. Le **Comité de salut public** instaure la **Terreur** en 1793-1794 : tribunal révolutionnaire, loi des suspects, exécutions massives et parfois sans preuves." },
          { type: "p", texte: "La période n'est pas seulement une violence : la Convention abolit l'esclavage dans les colonies par le décret du 4 février 1794, organise l'instruction publique, crée le système métrique et réorganise l'armée. Mais la Terreur divise les révolutionnaires eux-mêmes. Le 27 juillet 1794 (9 thermidor an II), Robespierre et ses proches sont arrêtés et exécutés : la Terreur s'achève." },
          { type: "encadre", titre: "À retenir", texte: "La Révolution ne se réduit pas à la Terreur : elle a détruit la société d'ordres et posé des principes — liberté, égalité, souveraineté nationale — qui structurent encore le droit français." }
        ]
      },
      {
        titre: "1795-1799 : le Directoire et l'arrivée de Bonaparte",
        blocs: [
          { type: "p", texte: "Après Thermidor, la bourgeoisie modérée reprend la main. La Constitution de l'an III (1795) installe le **Directoire** : cinq directeurs détiennent le pouvoir exécutif, face à deux assemblées. Le régime est instable, entre conspirations royalistes et agitation populaire, et continue les guerres de conquête." },
          { type: "p", texte: "Le général **Napoléon Bonaparte**, victorieux en Italie puis en Égypte, profite de cette instabilité. Le 18 brumaire an VIII (9 novembre 1799), il renverse le Directoire par un coup d'État militaire et installe le **Consulat** : la Révolution politique s'achève, mais son héritage est repris et codifié par l'Empire." },
          { type: "p", texte: "Cet héritage est considérable : abolition des privilèges et égalité devant la loi, souveraineté nationale, Déclaration des droits, unification du droit civil avec le **Code civil** promulgué en 1804, départements et système métrique. La Révolution est aussi devenue une référence politique disputée : chaque camp se réclame d'elle, ce qui en fait un événement fondateur du débat public français." },
          { type: "exemple", titre: "Exemple guidé", texte: "Analysons le 14 juillet 1789. Étape 1, le contexte : des troupes royales entourent Paris et le ministre Necker est renvoyé le 11 juillet. Étape 2, l'événement : la foule réclame des armes, prend les Invalides puis la Bastille, dont la garnison capitule. Étape 3, la portée : le roi recule et la Révolution paraît triompher ; la date devient fête nationale par la loi du 6 juillet 1880." }
        ]
      }
    ],
    quiz: [
      { question: "Quand les États généraux sont-ils ouverts à Versailles ?", options: ["Le 14 juillet 1789", "Le 5 mai 1789", "Le 4 août 1789", "Le 21 janvier 1793"], bonne: 1, explication: "Les États généraux sont ouverts le 5 mai 1789 ; la prise de la Bastille et l'abolition des privilèges viennent ensuite." },
      { question: "Que se passe-t-il la nuit du 4 août 1789 ?", options: ["Les privilèges sont abolis", "La République est proclamée", "Louis XVI est exécuté", "Le Directoire est instauré"], bonne: 0, explication: "La nuit du 4 août 1789 marque l'abolition des privilèges et des droits seigneuriaux par l'Assemblée." },
      { question: "Quel régime est proclamé le 21 septembre 1792 ?", options: ["La monarchie constitutionnelle", "Le Directoire", "Le Consulat", "La République"], bonne: 3, explication: "Le lendemain de la victoire de Valmy, l'Assemblée abolit la royauté : la République est proclamée." },
      { question: "Quel événement met fin au Directoire en 1799 ?", options: ["La mort de Robespierre", "La fête de la Fédération", "Le coup d'État du 18 brumaire", "Le sacre de Napoléon"], bonne: 2, explication: "Le coup d'État du 18 brumaire an VIII (9 novembre 1799) porte Bonaparte au pouvoir et installe le Consulat." }
    ],
    documents: ["doc-chronologie-revolution"],
    tags: ["Révolution", "1789", "France", "Lumières"]
  },
  {
    slug: "hg-lycee-guerre-froide",
    titre: "La guerre froide",
    matiere: "histoire-geo",
    niveau: "lycee",
    classe: "Terminale",
    duree: 45,
    difficulte: 2,
    resume: "Comprendre la guerre froide comme un affrontement global entre deux blocs, de 1947 à 1991, et ses étapes majeures.",
    objectifs: [
      "Situer les grandes phases de la guerre froide",
      "Expliquer les logiques idéologiques et militaires des deux blocs",
      "Analyser des crises majeures comme Berlin et Cuba",
      "Expliquer la sortie de la guerre froide et ses effets"
    ],
    prerequis: [
      "Connaître les conséquences de la Seconde Guerre mondiale",
      "Lire et interpréter une carte ou une affiche de propagande"
    ],
    sections: [
      {
        titre: "La rupture (1945-1947)",
        blocs: [
          { type: "p", texte: "En 1945, les Alliés ont vaincu l'Allemagne nazie mais ne s'accordent plus sur l'après-guerre. À la conférence de **Yalta** (février 1945), puis à **Potsdam** (juillet-août 1945), Staline, Roosevelt puis Truman et Churchill organisent l'Europe : la Pologne, l'Allemagne et les Balkans deviennent des points de friction." },
          { type: "p", texte: "Le 5 mars 1946, Churchill prononce à Fulton, aux États-Unis, un discours resté célèbre : « De Stettin, sur la Baltique, à Trieste, sur l'Adriatique, un rideau de fer est descendu à travers le continent. » L'expression **rideau de fer** désigne désormais la coupure de l'Europe entre Est et Ouest." },
          { type: "p", texte: "En 1947, la rupture devient officielle. Le 12 mars, le président Truman annonce devant le Congrès la doctrine du **containment** : contenir l'expansion communiste par l'aide économique et militaire. Le plan Marshall, annoncé le 5 juin 1947, finance la reconstruction de l'Europe de l'Ouest de 1948 à 1952. Staline riposte par le **Kominform** en septembre 1947 et refuse l'aide pour les pays de l'Est." },
          { type: "liste", items: [
            "Deux modèles politiques : démocratie libérale et pluralisme contre parti unique et planification.",
            "Deux modèles économiques : capitalisme de marché contre économie collectivisée.",
            "Deux modèles sociaux : société de consommation contre société encadrée."
          ] },
          { type: "encadre", titre: "À retenir", texte: "La guerre froide est un affrontement global mais sans guerre directe entre les deux superpuissances : il se joue par la dissuasion nucléaire, la propagande, l'espionnage et des conflits périphériques." }
        ]
      },
      {
        titre: "Deux blocs face à face",
        blocs: [
          { type: "p", texte: "Les alliances militaires dessinent deux camps. L'**OTAN** est créée le 4 avril 1949 à Washington ; le **pacte de Varsovie** est signé le 14 mai 1955, en réponse à l'entrée de la RFA dans l'OTAN. Chaque camp dispose de l'arme nucléaire : la **dissuasion** repose sur l'idée qu'aucun des deux ne peut gagner une guerre totale, ce que l'on appelle l'« équilibre de la terreur »." },
          { type: "p", texte: "L'Allemagne est le premier point de tension. Le **blocus de Berlin** (juin 1948 - mai 1949) vise à étouffer la ville ; les Alliés organisent un pont aérien et l'URSS échoue. En 1949 naissent la **RFA** à l'Ouest et la **RDA** à l'Est. Le 13 août 1961, la RDA construit le **mur de Berlin** pour empêcher ses habitants de fuir : il devient le symbole de la partition du monde." },
          { type: "p", texte: "La compétition est aussi culturelle et scientifique. La course à l'espace en est un terrain : le satellite **Spoutnik** est lancé par l'URSS le 4 octobre 1957, Youri **Gagarine** est le premier homme dans l'espace le 12 avril 1961, les Américains marchent sur la Lune avec **Apollo 11** les 20 et 21 juillet 1969. Le sport, le cinéma et la presse servent également la propagande." },
          { type: "p", texte: "Chaque bloc surveille l'autre : renseignement, écoutes, espions, et aussi alliances économiques (OCDE à l'Ouest, CAEM à l'Est). La guerre froide oppose donc deux organisations du monde." }
        ]
      },
      {
        titre: "Crises et détente (1950-1979)",
        blocs: [
          { type: "p", texte: "La **guerre de Corée** (1950-1953) est la première guerre « chaude » du conflit : la Corée du Nord, soutenue par la Chine et l'URSS, affronte la Corée du Sud et une coalition de l'ONU dominée par les États-Unis. L'armistice de 1953 laisse le pays divisé." },
          { type: "p", texte: "La **crise de Cuba** est le moment le plus dangereux : en octobre 1962, les États-Unis découvrent des rampes de missiles soviétiques sur l'île. Kennedy impose un blocus naval, le monde craint une guerre nucléaire. Khrouchtchev retire les missiles, l'URSS obtient le retrait des missiles américains de Turquie : après Cuba, une ligne directe est établie entre Washington et Moscou et le traité de Moscou limite les essais nucléaires en 1963." },
          { type: "p", texte: "La **détente** s'installe dans les années 1970 : accords SALT I sur les armements stratégiques en 1972, politique d'ouverture de Willy Brandt à l'Est (Ostpolitik), acte final de la conférence d'**Helsinki** le 1er août 1975, qui reconnaît les frontières européennes en échange d'engagements sur les droits de l'homme." },
          { type: "p", texte: "La détente est fragile. L'invasion soviétique de l'**Afghanistan** en décembre 1979 la brise : les États-Unis boycottent les Jeux olympiques de Moscou en 1980, l'URSS boycotte ceux de Los Angeles en 1984. Reagan relance la course aux armements, notamment avec l'Initiative de défense stratégique annoncée en 1983." }
        ]
      },
      {
        titre: "La fin de la guerre froide (1985-1991)",
        blocs: [
          { type: "p", texte: "Mikhaïl **Gorbatchev** devient secrétaire général du PCUS en mars 1985. Il lance la **glasnost** (transparence) et la **perestroïka** (restructuration) : ces réformes affaiblissent l'autorité du parti et libèrent la parole. Il multiplie les sommets avec Reagan, aboutit au traité **INF** sur les missiles intermédiaires en décembre 1987 et refuse d'intervenir militairement pour sauver les régimes communistes d'Europe de l'Est." },
          { type: "p", texte: "En 1989, des révolutions pacifiques renversent ces régimes. Le **mur de Berlin** tombe le 9 novembre 1989 ; la réunification allemande est réalisée le 3 octobre 1990, après le traité 2+4 du 12 septembre 1990. Le pacte de Varsovie est dissous en 1991, et l'URSS disparaît le 26 décembre 1991." },
          { type: "tableau", entetes: ["Phase", "Dates", "Repères"], lignes: [
            ["Rupture", "1945-1947", "Yalta, Fulton, doctrine Truman, plan Marshall"],
            ["Confrontation", "1948-1962", "Berlin, OTAN, Corée, mur de Berlin, Cuba"],
            ["Détente", "1963-1979", "SALT I, Ostpolitik, Helsinki"],
            ["Guerre fraîche", "1979-1985", "Afghanistan, course aux armements"],
            ["Fin", "1985-1991", "Gorbatchev, chute du mur, dissolution de l'URSS"]
          ] },
          { type: "exemple", titre: "Exemple guidé", texte: "Analysons le discours de Fulton (5 mars 1946). Étape 1, la nature : discours d'un ancien Premier ministre britannique, devant un public américain. Étape 2, l'idée principale : l'Europe est coupée par un « rideau de fer » et l'Ouest doit s'unir pour résister. Étape 3, la portée : le discours popularise la représentation d'un monde bipolaire et prépare la doctrine du containment de 1947." }
        ]
      }
    ],
    quiz: [
      { question: "Quel discours de 1946 popularise l'expression « rideau de fer » ?", options: ["Le discours de Fulton de Churchill", "La doctrine Truman", "Le rapport Khrouchtchev", "Le discours de Kennedy à Berlin"], bonne: 0, explication: "C'est à Fulton, le 5 mars 1946, que Churchill emploie l'image du rideau de fer pour décrire la coupure de l'Europe." },
      { question: "Quel événement marque le point culminant de la crise de Cuba ?", options: ["La construction du mur de Berlin", "Le blocus naval américain d'octobre 1962", "Le lancement de Spoutnik", "L'invasion de l'Afghanistan"], bonne: 1, explication: "En octobre 1962, Kennedy impose un blocus naval après la découverte des missiles soviétiques à Cuba." },
      { question: "Que prévoit l'acte final d'Helsinki du 1er août 1975 ?", options: ["La création de l'OTAN", "La dissolution du pacte de Varsovie", "La reconnaissance des frontières européennes contre des engagements sur les droits de l'homme", "Le retrait soviétique d'Afghanistan"], bonne: 2, explication: "L'acte final de la CSCE échange la reconnaissance des frontières issues de 1945 contre des engagements sur les droits humains." },
      { question: "Quand l'URSS disparaît-elle ?", options: ["Le 9 novembre 1989", "Le 3 octobre 1990", "Le 1er juillet 1991", "Le 26 décembre 1991"], bonne: 3, explication: "Le 26 décembre 1991, la démission de Gorbatchev et la dissolution de l'URSS mettent fin à la guerre froide." }
    ],
    documents: ["doc-carte-guerre-froide"],
    tags: ["guerre froide", "bipolarité", "URSS", "États-Unis"]
  },
  {
    slug: "philo-lycee-conscience",
    titre: "La conscience",
    matiere: "philosophie",
    niveau: "lycee",
    classe: "Terminale",
    duree: 50,
    difficulte: 3,
    resume: "Examiner la conscience comme capacité de se représenter et de se savoir, entre certitude de soi et puissance de l'inconscient.",
    objectifs: [
      "Distinguer conscience immédiate, conscience réfléchie et conscience morale",
      "Exposer l'argument du cogito chez Descartes",
      "Confronter la thèse freudienne de l'inconscient à l'idée d'une transparence à soi",
      "Construire une problématique sur la notion de conscience"
    ],
    prerequis: [
      "Savoir analyser un sujet de dissertation philosophique",
      "Avoir lu un court texte philosophique et savoir en dégager la thèse"
    ],
    sections: [
      {
        titre: "Trois sens du mot conscience",
        blocs: [
          { type: "p", texte: "Le mot **conscience** recouvre au moins trois réalités. La **conscience psychologique** est le fait de se rendre compte : je suis conscient du bruit ou de ce que je fais. La **conscience morale** est la capacité de juger le bien et le mal ; on dit d'un menteur qu'il a « mauvaise conscience ». La **conscience de soi** est le fait de se rapporter à soi comme à un sujet." },
          { type: "p", texte: "On distingue encore la conscience **immédiate**, qui accompagne l'action sans y réfléchir (je sais que je marche), et la conscience **réfléchie**, qui revient sur elle-même (je me demande pourquoi je marche). La seconde suppose la première sans s'y réduire." },
          { type: "p", texte: "Pour la phénoménologie, la conscience est d'abord **intentionnelle** : toute conscience est conscience *de quelque chose*. Husserl reprend cette idée en 1913 dans les *Idées directrices pour une phénoménologie* : se représenter un objet, c'est toujours se rapporter à lui d'une certaine manière. La conscience n'est donc pas une boîte fermée, mais une ouverture au monde." },
          { type: "encadre", titre: "À retenir", texte: "La conscience n'est pas une chose que l'on observe : c'est le fait de se rapporter à quelque chose et de s'y rapporter soi-même comme sujet." }
        ]
      },
      {
        titre: "Le cogito de Descartes",
        blocs: [
          { type: "p", texte: "Descartes cherche une certitude qui résiste à tout doute. Il imagine un doute **hyperbolique** : les sens trompent parfois, le rêve peut imiter la veille, un « malin génie » pourrait me tromper sur les mathématiques. Que reste-t-il quand tout est douteux ?" },
          { type: "p", texte: "Il reste que, pour douter, il faut penser, et que pour penser, il faut être. C'est l'argument du **cogito**, exposé en 1637 dans le *Discours de la méthode* (quatrième partie), puis en 1641 dans les *Méditations métaphysiques* : « Je pense, donc je suis ». Cette vérité résiste au doute parce que douter est encore une manière de penser." },
          { type: "p", texte: "Le cogito établit une **certitude d'existence**, non une connaissance complète de ce que je suis. Descartes précise que je sais que je suis une chose qui pense, mais que la nature de cette chose demeure à examiner. La conscience devient ainsi le point de départ de la philosophie moderne : le sujet est premier par rapport au monde." },
          { type: "p", texte: "Kant radicalise ce geste dans la *Critique de la raison pure* (1781) : « Le Je pense doit pouvoir accompagner toutes mes représentations. » La conscience de soi n'est pas un objet de l'expérience : elle est la condition qui la rend possible. Le « je » transcendantal est l'unité d'un sujet qui se sait en train de connaître." }
        ]
      },
      {
        titre: "L'inconscient freudien",
        blocs: [
          { type: "p", texte: "L'idée d'une conscience transparente à elle-même est contestée par Freud. Dans *L'interprétation des rêves* (1900), il montre que des pensées échappent à la conscience et se manifestent de façon déguisée : lapsus, oublis, symptômes, rêves. L'**inconscient** n'est pas une seconde conscience cachée, mais un ensemble de processus qui produisent des effets sans être présents à la conscience." },
          { type: "p", texte: "En 1923, dans *Le Moi et le Ça*, Freud construit la seconde topique : le **Ça**, réservoir des pulsions ; le **Moi**, instance de médiation avec la réalité ; le **Surmoi**, intériorisation des interdits. En 1917, dans *Une difficulté de la psychanalyse*, il résume la portée philosophique de sa découverte : « Le moi n'est pas maître dans sa propre maison. »" },
          { type: "p", texte: "Cette thèse ne date pas de Freud : Leibniz décrivait déjà, dans les *Nouveaux essais sur l'entendement humain* (rédigés en 1704, publiés en 1765), des **petites perceptions** qui existent dans l'esprit sans être aperçues. Freud en tire une conséquence pratique : la connaissance de soi n'est pas immédiate, elle exige un travail, l'analyse." },
          { type: "p", texte: "Les critiques sont nombreuses : certains contestent le caractère scientifique de l'hypothèse, faute de vérification expérimentale ; d'autres rappellent que l'inconscient freudien n'est pas le cerveau. Le débat porte donc sur un point précis : la conscience est-elle le **tout** de la vie psychique ?" }
        ]
      },
      {
        titre: "Conscience, autrui et responsabilité",
        blocs: [
          { type: "p", texte: "La conscience se forme aussi devant autrui. Dans la *Phénoménologie de l'esprit* (1807), Hegel montre que la conscience de soi se cherche dans une autre conscience et passe par un rapport de **reconnaissance** : je ne deviens sujet qu'en étant reconnu. Cette dépendance est une épreuve, dont témoigne la « conscience malheureuse »." },
          { type: "p", texte: "Sartre refuse l'idée d'une nature cachée derrière les actes : dans *L'existentialisme est un humanisme* (1946), il affirme que « l'existence précède l'essence ». La conscience est un projet, non une chose. Il analyse la **mauvaise foi** dans *L'Être et le Néant* (1943) : se mentir à soi-même en se déclarant prisonnier de sa nature pour fuir sa liberté." },
          { type: "p", texte: "Reste la question de l'identité personnelle. Locke, dans l'*Essai sur l'entendement humain* (1690), la lie à la mémoire : la personne est ce qui peut se reconnaître dans ses souvenirs. L'amnésie détruit-elle alors la personne ? La thèse montre en tout cas que la conscience est aussi un **récit** que l'on tient sur soi." },
          { type: "exemple", titre: "Exemple guidé", texte: "Analysons le sujet : « Peut-on être certain de ce que l'on pense ? » Étape 1, les termes : *certain* renvoie à une certitude indubitable ; *ce que l'on pense* désigne le contenu actuel de nos pensées. Étape 2, le présupposé : que la pensée serait immédiatement accessible. Étape 3, la problématique : la conscience immédiate garantit-elle la connaissance de soi ? Étape 4, un plan : I. la certitude du cogito ; II. les illusions et l'inconscient ; III. la connaissance de soi comme travail." }
        ]
      }
    ],
    quiz: [
      { question: "Dans quelle œuvre Descartes expose-t-il le cogito pour la première fois ?", options: ["Les Méditations métaphysiques de 1641", "L'Éthique de Spinoza", "Le Discours de la méthode de 1637", "La Phénoménologie de l'esprit de Hegel"], bonne: 2, explication: "Le « Je pense, donc je suis » apparaît dans la quatrième partie du Discours de la méthode (1637), avant les Méditations de 1641." },
      { question: "Que signifie « le moi n'est pas maître dans sa propre maison » (Freud, 1917) ?", options: ["Le sujet n'est pas entièrement transparent à lui-même", "Le moi domine l'inconscient", "La conscience est une illusion sans importance", "L'inconscient est un organe du cerveau"], bonne: 0, explication: "Freud souligne que des processus inconscients déterminent une part de nos pensées et de nos actes, sans que le moi les contrôle." },
      { question: "Que désigne la conscience réflexive ?", options: ["La conscience morale", "Le retour de la conscience sur elle-même", "La perception immédiate d'un objet", "La conscience que les autres ont de nous"], bonne: 1, explication: "La conscience réfléchie prend pour objet la conscience immédiate : elle se sait en train de percevoir ou de penser." },
      { question: "Pour Husserl, toute conscience est…", options: ["une substance matérielle", "une chose parmi les choses", "un organe du corps", "conscience de quelque chose"], bonne: 3, explication: "L'intentionnalité désigne le fait que la conscience se rapporte toujours à un objet, réel ou imaginaire." }
    ],
    documents: ["doc-notions-conscience"],
    tags: ["conscience", "inconscient", "cogito", "sujet"]
  },
  {
    slug: "eco-lycee-marche",
    titre: "Le marché et les prix",
    matiere: "economie",
    niveau: "lycee",
    classe: "1re",
    duree: 40,
    difficulte: 2,
    resume: "Comprendre comment l'offre et la demande fixent un prix, et pourquoi les marchés réels s'écartent parfois du modèle concurrentiel.",
    objectifs: [
      "Distinguer offre, demande et prix d'équilibre",
      "Distinguer un déplacement le long d'une courbe d'un déplacement de la courbe",
      "Calculer et interpréter une élasticité-prix",
      "Identifier les principales défaillances de marché"
    ],
    prerequis: [
      "Savoir lire un graphique en deux dimensions",
      "Connaître les notions de coût et de recette"
    ],
    sections: [
      {
        titre: "Le marché et ses conditions",
        blocs: [
          { type: "p", texte: "Un **marché** est un lieu, réel ou abstrait, où se rencontrent des offreurs et des demandeurs qui échangent un bien ou un service contre un prix. Le prix n'est pas une décision d'un acteur isolé : il est une information qui permet aux uns et aux autres de coordonner leurs projets." },
          { type: "p", texte: "Les économistes modélisent le marché parfait par la **concurrence pure et parfaite**, qui suppose cinq conditions. Ce modèle n'existe nulle part à l'état pur, mais il sert d'étalon pour analyser les écarts et les défauts des marchés réels." },
          { type: "liste", items: [
            "**Atomicité** : un très grand nombre d'acheteurs et de vendeurs, chacun trop petit pour influencer le prix.",
            "**Homogénéité** : les produits échangés sont identiques, donc substituables.",
            "**Libre entrée et sortie** : aucune barrière n'empêche de produire ou de cesser de produire.",
            "**Transparence** : l'information sur les prix et les produits est disponible pour tous.",
            "**Mobilité des facteurs** : le travail et le capital peuvent se déplacer librement."
          ] },
          { type: "p", texte: "Aucune de ces conditions n'est vérifiée dans le commerce d'un téléphone de marque, où la différenciation et la publicité jouent un rôle central. Le marché concurrentiel est donc un **modèle**, pas une description. Son intérêt est de montrer à quelles conditions le prix transmet correctement l'information." }
        ]
      },
      {
        titre: "L'offre et la demande",
        blocs: [
          { type: "p", texte: "La **loi de la demande** établit que, toutes choses égales par ailleurs, la quantité demandée diminue quand le prix augmente. La **loi de l'offre** établit l'inverse : la quantité offerte augmente quand le prix augmente, car les producteurs sont incités à produire davantage. L'expression « toutes choses égales par ailleurs » est essentielle : on ne compare des quantités qu'à prix changeant seul." },
          { type: "p", texte: "Il faut distinguer deux mouvements souvent confondus. Un **déplacement le long de la courbe** est provoqué par une variation du prix du bien lui-même. Un **déplacement de la courbe** est provoqué par un autre déterminant : revenus, goûts, prix des biens substituts ou complémentaires, anticipations, nombre de demandeurs — et, du côté de l'offre, coûts de production, technologie, taxes." },
          { type: "tableau", entetes: ["Déterminant", "Demande", "Offre"], lignes: [
            ["Hausse du revenu (bien normal)", "Augmente", "Inchangée"],
            ["Hausse du prix d'un bien substituable", "Augmente", "Inchangée"],
            ["Hausse du coût des matières premières", "Inchangée", "Diminue"],
            ["Progrès technique", "Inchangée", "Augmente"]
          ] },
          { type: "p", texte: "L'**élasticité-prix de la demande** mesure la sensibilité des quantités au prix : elle se calcule en divisant la variation relative des quantités par la variation relative du prix. Une demande est élastique si la valeur absolue dépasse 1 (produits de luxe, biens substituables), inélastique si elle est inférieure à 1 (médicaments, carburant à court terme)." }
        ]
      },
      {
        titre: "Le prix d'équilibre",
        blocs: [
          { type: "p", texte: "Le **prix d'équilibre** est celui pour lequel la quantité offerte égale la quantité demandée. Si le prix est trop bas, la demande dépasse l'offre : c'est une **pénurie**, et les acheteurs font monter le prix. S'il est trop haut, l'offre dépasse la demande : c'est un **excédent**, et les vendeurs baissent le prix." },
          { type: "tableau", entetes: ["Prix (€)", "Quantité demandée", "Quantité offerte"], lignes: [
            ["2", "90", "10"],
            ["3", "70", "30"],
            ["4", "50", "50"],
            ["5", "30", "70"],
            ["6", "10", "90"]
          ] },
          { type: "p", texte: "À 4 €, les quantités offertes et demandées sont égales : le marché est à l'équilibre. Si l'État fixe un **prix plafond** sous l'équilibre (2 €), la demande excède l'offre et une pénurie apparaît : c'est ce qui se produit avec un loyer encadré trop bas, qui réduit l'offre de logements. À l'inverse, un **prix plancher** au-dessus de l'équilibre crée un excédent, comme un salaire minimum très élevé peut créer du chômage." },
          { type: "encadre", titre: "À retenir", texte: "Le prix d'équilibre naît de la rencontre de l'offre et de la demande, non d'une décision." },
          { type: "exemple", titre: "Exemple guidé", texte: "Prenons le tableau ci-dessus. Étape 1 : je repère la ligne où les deux quantités sont égales → prix 4 €, quantité 50. Étape 2 : je vérifie le mécanisme. À 2 €, 90 unités sont demandées mais 10 seulement sont offertes : 80 acheteurs ne trouvent pas le bien. Étape 3 : les vendeurs constatent la file d'attente et augmentent leur prix ; à 3 €, la pénurie tombe à 40 unités ; à 4 €, elle disparaît. Le prix joue le rôle de signal et d'incitation." }
        ]
      },
      {
        titre: "Marchés réels et défaillances de marché",
        blocs: [
          { type: "p", texte: "Le marché concurrentiel ne produit pas toujours une allocation satisfaisante : c'est ce qu'on appelle une **défaillance de marché**. La plus connue est l'**externalité** : un effet de l'activité d'un agent sur un autre, sans compensation par le marché. La pollution d'une usine est une externalité négative ; la vaccination d'une population, une externalité positive." },
          { type: "liste", items: [
            "**Biens communs** : rivaux et non excluables (pêche, eau), menacés de surexploitation.",
            "**Biens publics** : non rivaux et non excluables (éclairage public), que le marché ne finance pas spontanément.",
            "**Monopole** : un seul vendeur fixe le prix au-dessus du coût marginal.",
            "**Asymétrie d'information** : une partie en sait plus que l'autre, ce qui peut chasser les bons produits du marché."
          ] },
          { type: "p", texte: "Ces défaillances justifient des interventions publiques : réglementation, taxation des externalités négatives, subventions aux externalités positives, autorités de concurrence. Mais l'intervention a elle-même un coût et peut échouer : c'est le problème de l'**échec de l'État**, qui doit être comparé aux défauts du marché." },
          { type: "p", texte: "Adam Smith, en 1776, décrivait dans les *Recherches sur la nature et les causes de la richesse des nations* un ordre qui s'établit sans qu'un acteur le décide, comme guidé par une « main invisible ». Les économistes contemporains en donnent une lecture plus précise : le prix agrège l'information dispersée des participants — à condition que le marché soit concurrentiel." }
        ]
      }
    ],
    quiz: [
      { question: "Que se passe-t-il si le prix est fixé sous le prix d'équilibre ?", options: ["L'offre devient supérieure à la demande", "La demande dépasse l'offre : il y a pénurie", "L'équilibre reste inchangé", "Les prix montent automatiquement"], bonne: 1, explication: "Sous le prix d'équilibre, la quantité demandée excède la quantité offerte : certaines demandes ne sont pas satisfaites." },
      { question: "Quel facteur déplace la courbe de demande ?", options: ["Une baisse du prix du bien lui-même", "Une hausse du prix du bien lui-même", "Un déplacement le long de la courbe", "Une hausse du revenu des consommateurs"], bonne: 3, explication: "Le revenu modifie la demande à prix constant : la courbe entière se déplace, contrairement au mouvement le long de la courbe." },
      { question: "Qu'est-ce qu'une externalité négative ?", options: ["Un effet de l'activité d'un agent sur un autre, sans compensation par le marché", "Une baisse des coûts de production", "Une taxe sur les bénéfices", "Un excédent de demande"], bonne: 0, explication: "L'externalité négative est un effet dommageable subi par un tiers sans que le marché le facture, comme la pollution." },
      { question: "Quelles sont deux conditions du modèle de concurrence pure et parfaite ?", options: ["Le monopole et l'entente", "La publicité et la différenciation", "L'atomicité et la libre entrée sur le marché", "La transparence et le protectionnisme"], bonne: 2, explication: "L'atomicité et la libre entrée font partie des cinq conditions du modèle, avec l'homogénéité, la transparence et la mobilité des facteurs." }
    ],
    documents: [],
    tags: ["offre", "demande", "prix", "marché"]
  },
  {
    slug: "eco-univ-microeconomie",
    titre: "Le consommateur et l'offre",
    matiere: "economie",
    niveau: "universite",
    classe: "L1",
    duree: 55,
    difficulte: 3,
    resume: "Fonder la demande sur les préférences du consommateur, puis expliquer comment coûts et profit déterminent l'offre sur un marché.",
    objectifs: [
      "Formaliser les préférences par une fonction d'utilité et des courbes d'indifférence",
      "Résoudre le programme du consommateur sous contrainte budgétaire",
      "Décomposer l'effet d'une variation de prix en effet de substitution et effet de revenu",
      "Dériver l'offre d'une firme à partir de ses coûts"
    ],
    prerequis: [
      "Maîtriser les dérivées partielles et l'optimisation sous contrainte",
      "Connaître les notions de coût total, coût moyen et coût marginal"
    ],
    sections: [
      {
        titre: "Préférences, utilité et courbes d'indifférence",
        blocs: [
          { type: "p", texte: "La théorie du consommateur part de ses **préférences** sur les paniers de biens. On les suppose **complètes** (tout couple de paniers est comparable), **transitives** (si A est préféré à B et B à C, alors A est préféré à C) et **monotones** (un peu plus d'un bien ne nuit jamais). Une fonction d'utilité représente ces préférences : elle attribue un nombre à chaque panier." },
          { type: "p", texte: "Les **courbes d'indifférence** relient les paniers procurant la même utilité. Leurs propriétés se déduisent des axiomes : elles sont décroissantes sous monotonie, elles ne se coupent jamais sous transitivité, elles sont convexes quand les préférences sont convexes (goût pour la diversité), et les courbes les plus éloignées de l'origine sont d'utilité plus élevée." },
          { type: "p", texte: "Le long d'une courbe d'indifférence, le **taux marginal de substitution** (TMS) mesure la quantité du bien 2 cédée pour une unité du bien 1 supplémentaire, à indifférence constante. Il est égal au rapport des utilités marginales : TMS = Um₁ / Um₂, et il décroît le long de la courbe, ce qui traduit la convexité." }
        ]
      },
      {
        titre: "La contrainte budgétaire et l'optimum",
        blocs: [
          { type: "p", texte: "Le consommateur dispose d'un revenu R et fait face aux prix p₁ et p₂. Sa **contrainte budgétaire** s'écrit p₁x₁ + p₂x₂ ≤ R. La droite frontière a pour pente −p₁/p₂, le prix relatif du bien 1 en unités du bien 2." },
          { type: "p", texte: "Le programme du consommateur est de maximiser U(x₁, x₂) sous cette contrainte. À l'**optimum intérieur**, la courbe d'indifférence est tangente à la droite de budget : TMS = p₁/p₂. Économiquement, il égalise le taux auquel il est prêt à substituer (son goût) et celui que le marché lui impose (les prix)." },
          { type: "code", langage: "text", texte: "max U(x1, x2)  sous  p1·x1 + p2·x2 = R\nL = U + λ (R - p1·x1 - p2·x2)\n∂L/∂x1 = ∂U/∂x1 - λ p1 = 0 ; ∂L/∂x2 = ∂U/∂x2 - λ p2 = 0\n⇒ (∂U/∂x1) / (∂U/∂x2) = p1 / p2   (TMS = prix relatif)" },
          { type: "p", texte: "Cette solution est la **demande marshallienne**. Elle est homogène de degré zéro en (p₁, p₂, R) : doubler les prix et le revenu ne change pas les quantités. Avec une fonction Cobb-Douglas, les dépenses consacrées à chaque bien sont des parts fixes du revenu." },
          { type: "exemple", titre: "Exemple guidé", texte: "Soit U = x₁x₂, p₁ = 2, p₂ = 1, R = 20. Étape 1, les utilités marginales : Um₁ = x₂ et Um₂ = x₁, donc TMS = x₂/x₁. Étape 2, la condition d'optimum : x₂/x₁ = p₁/p₂ = 2, soit x₂ = 2x₁. Étape 3, la contrainte : 2x₁ + 2x₁ = 20, donc x₁ = 5 et x₂ = 10. Étape 4, vérification : 2·5 + 10 = 20 et TMS = 10/5 = 2 = p₁/p₂ ; l'utilité atteinte est U = 50." }
        ]
      },
      {
        titre: "Effet de substitution et effet de revenu",
        blocs: [
          { type: "p", texte: "Une hausse du prix p₁ réduit la quantité demandée de bien 1. Cette baisse se décompose en deux effets. L'**effet de substitution** vient du prix relatif : le bien 1, devenu plus cher, est remplacé par le bien 2 à utilité constante. L'**effet de revenu** vient de la baisse du pouvoir d'achat : le revenu réel diminue." },
          { type: "p", texte: "La décomposition dépend de la compensation retenue. La compensation de **Slutsky** (1915) redonne le pouvoir d'achat nécessaire pour racheter le panier initial ; celle de **Hicks** place le consommateur sur la même courbe d'indifférence. Les deux donnent le même signe, mais des valeurs différentes." },
          { type: "p", texte: "L'effet de substitution est **toujours négatif** ou nul : quand un bien renchérit, on en consomme moins, à utilité donnée. L'effet de revenu est positif pour un bien **normal**, négatif pour un bien **inférieur**. Si l'effet de revenu négatif domine l'effet de substitution, la demande augmente quand le prix augmente : c'est le cas théorique du bien **Giffen**." },
          { type: "p", texte: "Cette décomposition éclaire la loi de la demande : elle résulte de deux effets dont l'un est toujours orienté dans le même sens. Elle explique aussi pourquoi l'élasticité-prix varie : à long terme, les substitutions sont plus faciles, donc la demande est plus élastique." }
        ]
      },
      {
        titre: "Du consommateur à l'offre : coûts et décision de produire",
        blocs: [
          { type: "p", texte: "L'**offre** ne vient pas du consommateur mais des firmes. Une firme transforme des facteurs de production en biens. On en déduit le coût total CT(q), le **coût moyen** CM = CT/q et le **coût marginal** Cm = dCT/dq, coût de la dernière unité produite." },
          { type: "p", texte: "Le profit s'écrit π(q) = p·q − CT(q). La condition du premier ordre, π′(q) = 0, donne p = Cm : la firme produit jusqu'à ce que le coût de la dernière unité égale son prix ; la condition du second ordre exige un coût marginal croissant. En concurrence parfaite, la firme est **preneuse de prix**." },
          { type: "p", texte: "La firme ne produit que si le prix couvre son **coût moyen variable**. En dessous, elle perd moins en fermant. Le **seuil de fermeture** est le minimum du coût moyen variable, le **seuil de rentabilité** celui du coût moyen. La courbe d'offre individuelle est la partie croissante du coût marginal au-dessus du minimum du coût moyen variable." },
          { type: "p", texte: "L'offre de marché est la **somme horizontale** des offres individuelles : pour chaque prix, on additionne les quantités offertes par les firmes. L'équilibre concurrentiel égalise offre et demande agrégées ; le **surplus du producteur** mesure alors la différence entre le prix reçu et le coût de production." },
          { type: "encadre", titre: "À retenir", texte: "La courbe d'offre résulte de la maximisation du profit, donc de la forme des coûts marginaux." }
        ]
      }
    ],
    quiz: [
      { question: "À l'optimum intérieur du consommateur, quelle égalité est vérifiée ?", options: ["U = R", "Um₁ = Um₂", "p₁ = p₂", "TMS = p₁/p₂"], bonne: 3, explication: "La tangente à la courbe d'indifférence a la même pente que la droite de budget : TMS = prix relatif." },
      { question: "Quel est le signe de l'effet de substitution quand un prix augmente ?", options: ["Positif", "Nul dans tous les cas", "Toujours négatif ou nul", "Il dépend du revenu"], bonne: 2, explication: "À utilité constante, un bien plus cher est toujours remplacé par les autres biens : l'effet de substitution est négatif." },
      { question: "Que fait une firme concurrentielle pour maximiser son profit ?", options: ["Elle produit tant que p > Cm puis s'arrête quand p = Cm", "Elle fixe un prix supérieur au marché", "Elle produit le maximum possible", "Elle égale son coût moyen au prix"], bonne: 0, explication: "La condition du premier ordre donne p = Cm ; au-delà, la dernière unité coûte plus qu'elle ne rapporte." },
      { question: "Quel est le seuil de fermeture d'une firme à court terme ?", options: ["Le minimum du coût total", "Le minimum du coût moyen variable", "Le minimum du coût moyen", "Le prix zéro"], bonne: 1, explication: "Sous le minimum du coût moyen variable, la firme perd moins en cessant de produire qu'en continuant." }
    ],
    documents: [],
    tags: ["microéconomie", "utilité", "coûts", "offre"]
  },
  {
    slug: "ang-college-present-simple",
    titre: "Present simple, mode d'emploi",
    matiere: "langues",
    niveau: "college",
    classe: "5e",
    duree: 30,
    difficulte: 1,
    resume: "Apprendre à former et à employer le present simple pour parler de ses habitudes, de ses goûts et de vérités générales.",
    objectifs: [
      "Former le present simple à la forme affirmative",
      "Écrire correctement la troisième personne du singulier",
      "Construire les formes négative et interrogative avec do et does",
      "Placer les adverbes de fréquence au bon endroit"
    ],
    prerequis: [
      "Connaître les pronoms personnels sujets",
      "Reconnaître la base verbale d'un verbe anglais"
    ],
    sections: [
      {
        titre: "Quand emploie-t-on le present simple ?",
        blocs: [
          { type: "p", texte: "Le **present simple** ne sert pas à décrire une action en train de se dérouler — pour cela, on emploie le present continuous. Il exprime ce qui est **habituel**, **répété** ou **toujours vrai** : les routines, les goûts, les horaires et les vérités générales." },
          { type: "liste", items: [
            "Une habitude : *I get up at seven every morning.* (Je me lève à sept heures chaque matin.)",
            "Une vérité générale : *Water boils at 100 °C at sea level.* (L'eau bout à 100 °C au niveau de la mer.)",
            "Un goût, une opinion : *She likes chocolate.* (Elle aime le chocolat.)",
            "Un horaire fixe : *The train leaves at 8:15.* (Le train part à 8 h 15.)"
          ] },
          { type: "p", texte: "On rencontre aussi le present simple avec les **verbes d'état** : *be, have, know, want, need, understand, believe, prefer, like*. Ils ne se mettent presque jamais au present continuous : on dit *I know the answer* et non *I am knowing the answer*." },
          { type: "encadre", titre: "À retenir", texte: "Le present simple décrit ce qui se répète ou ce qui est vrai en général, pas ce qui se passe au moment où l'on parle." }
        ]
      },
      {
        titre: "La forme affirmative et la troisième personne",
        blocs: [
          { type: "p", texte: "À la forme affirmative, on utilise la **base verbale**, sans auxiliaire. La seule difficulté est la **troisième personne du singulier** (he, she, it), qui prend un -s. Les autres personnes restent identiques : *I play, you play, we play, they play*, mais *he plays*." },
          { type: "tableau", entetes: ["Personne", "To work", "To go", "To study"], lignes: [
            ["I / you / we / they", "work", "go", "study"],
            ["he / she / it", "works", "goes", "studies"]
          ] },
          { type: "liste-num", items: [
            "Cas général : on ajoute **-s** → work → works, play → plays, read → reads.",
            "Verbes terminés par **-s, -sh, -ch, -x, -o** : on ajoute **-es** → watch → watches, wash → washes, fix → fixes, go → goes, do → does.",
            "Verbes terminés par une **consonne + y** : le y devient **-ies** → study → studies, carry → carries, fly → flies.",
            "Verbes terminés par une **voyelle + y** : on ajoute seulement **-s** → play → plays, enjoy → enjoys.",
            "Cas irréguliers : **have → has**, **be → is**, **can → can** (pas de -s)."
          ] },
          { type: "p", texte: "Attention : *does* et *goes* prennent -es parce qu'ils finissent par -o. *Have* devient *has* : *She has two brothers.* Et le verbe *be* ne suit pas la règle du -s, il se conjugue : *I am, you are, he is*." }
        ]
      },
      {
        titre: "Négation et interrogation",
        blocs: [
          { type: "p", texte: "Aux formes négative et interrogative, on utilise l'auxiliaire **do** (ou **does** à la troisième personne du singulier) suivi de la **base verbale**. L'auxiliaire porte la marque de la personne : le verbe principal, lui, reste à la base verbale." },
          { type: "tableau", entetes: ["Forme", "I / you / we / they", "he / she / it"], lignes: [
            ["Affirmative", "I like coffee.", "She likes coffee."],
            ["Négative", "I don't like coffee.", "She doesn't like coffee."],
            ["Interrogative", "Do you like coffee?", "Does she like coffee?"],
            ["Réponse courte", "Yes, I do. / No, I don't.", "Yes, she does. / No, she doesn't."]
          ] },
          { type: "liste", items: [
            "Correct : *He doesn't play tennis.* — Incorrect : *He doesn't plays tennis.*",
            "Correct : *Does she live in London?* — Incorrect : *Does she lives in London?*",
            "Correct : *They don't go to school on Sundays.* — Incorrect : *They not go…*"
          ] },
          { type: "p", texte: "Le -s de la troisième personne **disparaît** dès que *does* est présent, puisque c'est *does* qui porte la marque. C'est la faute la plus fréquente chez les élèves : on ne met jamais deux marques de personne dans la même phrase. Avec le verbe *be*, on ne prend pas d'auxiliaire : *She is not tired.*, *Is she tired?*" }
        ]
      },
      {
        titre: "Adverbes de fréquence et expressions de temps",
        blocs: [
          { type: "p", texte: "Les adverbes de fréquence se placent **avant le verbe principal** mais **après le verbe be** : *She always arrives early.* / *She is always early.* Cet ordre se retient facilement : l'adverbe se glisse entre le sujet et le verbe, sauf avec *be*." },
          { type: "tableau", entetes: ["Adverbe", "Fréquence approximative", "Exemple"], lignes: [
            ["always", "100 %", "He always does his homework."],
            ["usually", "environ 90 %", "We usually eat at seven."],
            ["often", "environ 70 %", "They often play football."],
            ["sometimes", "environ 50 %", "I sometimes walk to school."],
            ["rarely / seldom", "environ 10 %", "She rarely watches television."],
            ["never", "0 %", "He never drinks coffee."]
          ] },
          { type: "p", texte: "Les expressions de temps se placent en fin de phrase : *every day, every week, on Mondays, at the weekend, once a week, twice a month, three times a year*. Pour poser la question, on utilise **How often…?** : *How often do you play tennis? — Twice a week.*" },
          { type: "exemple", titre: "Exemple guidé", texte: "Transformer : *Léa (to go) to the market every Saturday.* Étape 1, la personne : *Léa* = *she*, donc troisième personne du singulier. Étape 2, le verbe *go* finit par -o : on ajoute -es → *goes*. Affirmative : *Léa goes to the market every Saturday.* Étape 3, la négative : l'auxiliaire *does* porte le -s, le verbe redevient *go* → *Léa doesn't go to the market every Saturday.* Étape 4, l'interrogative : *Does Léa go to the market every Saturday?* Réponse courte : *Yes, she does.*" }
        ]
      }
    ],
    quiz: [
      { question: "Choose the correct sentence.", options: ["She goes to school by bus.", "She gos to school by bus.", "She go to school by bus.", "She is go to school by bus."], bonne: 0, explication: "À la troisième personne du singulier, le verbe go prend -es : « she goes »." },
      { question: "Which negative sentence is correct?", options: ["He not like coffee.", "He don't like coffee.", "He doesn't likes coffee.", "He doesn't like coffee."], bonne: 3, explication: "L'auxiliaire does porte le -s, donc le verbe principal reste à la base verbale : doesn't like." },
      { question: "Which sentence places the adverb of frequency correctly?", options: ["She late always is.", "She always is late.", "She is always late.", "Always she is late."], bonne: 2, explication: "Avec le verbe be, l'adverbe de fréquence se place après le verbe : « She is always late »." },
      { question: "Complete: « ___ they live in London? »", options: ["Does", "Do", "Are", "Is"], bonne: 1, explication: "Avec they, on emploie l'auxiliaire do ; does ne sert qu'à la troisième personne du singulier." }
    ],
    documents: [],
    tags: ["grammaire", "présent", "anglais", "habitudes"]
  }
]);
