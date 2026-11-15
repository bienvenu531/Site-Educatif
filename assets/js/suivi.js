/* ==========================================================================
   SepsHaness — page Suivi (suivi.html)
   Tableau de bord : indicateurs, objectif hebdomadaire, progression par
   matière, graphique 7 jours, temps par matière, historique, quiz, badges
   et recommandations.
   API utilisées : App, Store, APP_DATA (voir docs/CONTRAT.md).
   ========================================================================== */
(function () {
  "use strict";

  var racine = null;

  /* ---------------------------------------------------------------------
     Helpers
     --------------------------------------------------------------------- */
  function echapper(texte) {
    return App.escape(texte);
  }

  function icone(nom, taille) {
    return App.icon(nom, { taille: taille || 18 });
  }

  function capitaliser(texte) {
    var valeur = String(texte || "");
    return valeur.charAt(0).toUpperCase() + valeur.slice(1);
  }

  function nomMatiere(id) {
    if (!id) return "Général";
    return window.APP_DATA ? APP_DATA.matiere(id).nom : String(id);
  }

  function jauge(pourcentage, libelle) {
    var valeur = Math.max(0, Math.min(100, Math.round(Number(pourcentage) || 0)));
    return (
      '<div class="jauge" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' +
      valeur +
      '" aria-label="' +
      echapper(libelle || "Progression") +
      '"><span class="jauge__remplissage" style="width:' +
      valeur +
      '%"></span></div>'
    );
  }

  function carteStat(teinte, nomIcone, valeur, libelle) {
    return (
      '<div class="stat" data-teinte="' +
      teinte +
      '"><span class="stat__icone" aria-hidden="true">' +
      icone(nomIcone, 20) +
      "</span>" +
      "<div>" +
      '<p class="stat__valeur">' +
      valeur +
      "</p>" +
      '<p class="stat__libelle">' +
      echapper(libelle) +
      "</p></div></div>"
    );
  }

  function joursRestantsSemaine() {
    var jour = new Date().getDay();
    var rang = jour === 0 ? 7 : jour;
    return 7 - rang;
  }

  /* ---------------------------------------------------------------------
     En-tête
     --------------------------------------------------------------------- */
  function htmlEntete() {
    var profil = Store.profil();
    var pseudo = String(profil.pseudo || "").trim();
    var dateJour = App.date(new Date(), { long: true });
    var titre = pseudo ? "Bonjour, " + pseudo : "Votre suivi";
    var invitation = pseudo
      ? ""
      : '<p class="perso-invitation">' +
        icone("info", 18) +
        '<span class="petit">Votre profil est encore vierge : <a href="profil.html">choisissez un pseudo et un objectif hebdomadaire</a> pour personnaliser ce tableau de bord.</span></p>';

    return (
      '<section class="entete-page"><div class="conteneur">' +
      '<nav class="fil-ariane" aria-label="Fil d\'Ariane">' +
      '<a href="index.html">Accueil</a><span class="fil-ariane__separateur" aria-hidden="true">/</span>' +
      '<span aria-current="page">Suivi</span></nav>' +
      '<div class="entete-page__inner"><div>' +
      '<span class="surtitre">Tableau de bord</span>' +
      '<h1 class="entete-page__titre">' + echapper(titre) + "</h1>" +
      '<p class="entete-page__texte">' + echapper(capitaliser(dateJour)) +
      " — progression, temps d'étude et résultats, calculés à partir de votre activité enregistrée dans ce navigateur.</p>" +
      "</div>" +
      '<div class="entete-page__actions">' +
      '<a class="btn btn--primaire" href="espace-travail.html">' + icone("espace", 18) + " Espace de travail</a>" +
      '<a class="btn btn--secondaire" href="cours.html">' + icone("livre", 18) + " Catalogue des cours</a>" +
      "</div></div>" +
      invitation +
      "</div></section>"
    );
  }

  /* ---------------------------------------------------------------------
     Indicateurs
     --------------------------------------------------------------------- */
  function htmlIndicateurs() {
    var progression = Store.progressionGlobale();
    var moyenne = Store.moyenneQuiz();
    var serie = Store.serie();
    return (
      '<div class="grille grille--4 perso-indicateurs">' +
      carteStat(
        "indigo",
        "livre",
        echapper(progression.termines + " / " + progression.total),
        "cours terminés"
      ) +
      carteStat("cyan", "horloge", echapper(App.duree(Store.minutesTotales())), "temps d'étude total") +
      carteStat(
        "orange",
        "feu",
        echapper(serie + (serie > 1 ? " jours" : " jour")),
        "série d'activité"
      ) +
      carteStat(
        "emerald",
        "trophee",
        moyenne === null ? "—" : echapper(App.pourcentage(moyenne)),
        "moyenne aux quiz"
      ) +
      "</div>"
    );
  }

  /* ---------------------------------------------------------------------
     Objectif hebdomadaire
     --------------------------------------------------------------------- */
  function htmlObjectifHebdo() {
    var profil = Store.profil();
    var objectif = Math.max(30, Number(profil.objectifHebdo) || 240);
    var semaine = Store.minutesSemaine();
    var pourcentage = objectif ? Math.round((semaine / objectif) * 100) : 0;
    var atteint = Store.estObjectifAtteint();
    var restants = joursRestantsSemaine();
    var resteMinutes = Math.max(0, objectif - semaine);

    var texte;
    if (atteint) {
      texte = "Objectif atteint, bravo ! Vous pouvez continuer au-delà de " + App.duree(objectif) + " cette semaine.";
    } else {
      texte =
        "Il vous reste " +
        App.duree(resteMinutes) +
        " d'étude pour atteindre votre objectif hebdomadaire.";
    }
    var texteJours =
      restants === 0
        ? "Dernier jour de la semaine."
        : "Il reste " + restants + " jour" + (restants > 1 ? "s" : "") + " dans la semaine.";

    return (
      '<section class="carte perso-hebdo" aria-labelledby="titre-hebdo">' +
      '<div class="carte__entete">' +
      '<h2 class="titre-3" id="titre-hebdo">Objectif de la semaine</h2>' +
      '<span class="etiquette ' +
      (atteint ? "etiquette--succes" : "etiquette--neutre") +
      '">' +
      (atteint ? icone("check", 13) + " Atteint" : "En cours") +
      "</span></div>" +
      '<p class="perso-hebdo__chiffres"><span class="perso-hebdo__valeur">' +
      echapper(App.duree(semaine)) +
      '</span><span class="texte-doux"> sur ' +
      echapper(App.duree(objectif)) +
      "</span></p>" +
      jauge(pourcentage, "Objectif hebdomadaire") +
      '<div class="rangee rangee--entre perso-hebdo__pied">' +
      '<span class="petit texte-doux">' + echapper(texte) + "</span>" +
      '<span class="micro texte-faible">' + echapper(texteJours) + "</span>" +
      "</div>" +
      '<a class="lien-fleche petit" href="espace-travail.html?onglet=minuteur">Lancer une session ' +
      icone("fleche-droite", 15) +
      "</a></section>"
    );
  }

  /* ---------------------------------------------------------------------
     Graphique 7 jours
     --------------------------------------------------------------------- */
  function htmlGraphique() {
    var jours = Store.minutesParJour(7);
    var maximum = jours.reduce(function (somme, jour) {
      return Math.max(somme, Number(jour.minutes) || 0);
    }, 0);

    if (!maximum) {
      return (
        '<div class="carte perso-graphique-carte">' +
        App.vide("Aucune session cette semaine", {
          icone: "graphique",
          texte: "Lancez le minuteur de concentration ou enregistrez une session depuis le planning pour voir apparaître vos temps d'étude.",
          action: { href: "espace-travail.html?onglet=minuteur", libelle: "Utiliser le minuteur" }
        }) +
        "</div>"
      );
    }

    var resume =
      "Temps d'étude des sept derniers jours : " +
      jours
        .map(function (jour) {
          return (
            jour.labelLong +
            " " +
            (jour.minutes ? App.duree(jour.minutes) : "aucune session")
          );
        })
        .join(", ") +
      ".";

    var barres = jours
      .map(function (jour) {
        var hauteur = Math.max(6, Math.round((jour.minutes / maximum) * 100));
        if (!jour.minutes) hauteur = 0;
        return (
          '<div class="perso-barre" title="' +
          echapper(jour.labelLong + " : " + (jour.minutes ? App.duree(jour.minutes) : "aucune session")) +
          '">' +
          '<div class="perso-barre__piste"><span class="perso-barre__remplissage" style="height:' +
          hauteur +
          '%"></span></div>' +
          '<span class="perso-barre__jour">' + echapper(jour.label) + "</span>" +
          '<span class="perso-barre__minutes">' +
          (jour.minutes ? echapper(App.duree(jour.minutes)) : "—") +
          "</span></div>"
        );
      })
      .join("");

    var tableau =
      '<details class="perso-graphique__repli">' +
      "<summary>Voir les valeurs sous forme de tableau</summary>" +
      '<div class="tableau-defilant"><table class="tableau tableau--dense">' +
      '<caption class="sr-only">Temps d\'étude des sept derniers jours</caption>' +
      "<thead><tr><th scope=\"col\">Jour</th><th scope=\"col\">Date</th><th scope=\"col\">Temps d'étude</th></tr></thead><tbody>" +
      jours
        .map(function (jour) {
          return (
            "<tr><td>" + echapper(capitaliser(jour.label)) + "</td><td>" +
            echapper(App.date(jour.date)) + "</td><td>" +
            (jour.minutes ? echapper(App.duree(jour.minutes)) : "Aucune session") +
            "</td></tr>"
          );
        })
        .join("") +
      "</tbody></table></div></details>";

    return (
      '<div class="carte perso-graphique-carte">' +
      '<div class="perso-graphique" role="img" aria-label="' + echapper(resume) + '">' +
      '<div class="perso-graphique__barres">' + barres + "</div></div>" +
      tableau +
      '<p class="micro texte-faible">Chaque barre représente le temps d\'étude enregistré sur une journée. Survolez une barre pour voir la valeur.</p>' +
      "</div>"
    );
  }

  /* ---------------------------------------------------------------------
     Progression par matière
     --------------------------------------------------------------------- */
  function htmlMatieres() {
    var lignes = [];
    (window.APP_DATA ? APP_DATA.matieres : []).forEach(function (matiere) {
      var progression = Store.progressionMatiere(matiere.id);
      if (!progression.total) return;
      lignes.push(
        '<div class="perso-matiere">' +
        '<span class="perso-matiere__icone" data-teinte="' + echapper(matiere.teinte) + '" aria-hidden="true">' +
        icone(matiere.icone, 20) +
        "</span>" +
        '<div class="perso-matiere__corps">' +
        '<div class="rangee rangee--entre perso-matiere__ligne">' +
        '<a class="perso-matiere__nom" href="cours.html?matiere=' + encodeURIComponent(matiere.id) + '">' +
        echapper(matiere.nom) +
        "</a>" +
        '<span class="petit texte-doux">' + progression.termines + " / " + progression.total +
        " cours</span></div>" +
        jauge(progression.pourcentage, "Progression en " + matiere.nom) +
        "</div>" +
        '<span class="perso-matiere__pct">' + progression.pourcentage + " %</span>" +
        '<a class="btn btn--sm btn--fantome" href="cours.html?matiere=' +
        encodeURIComponent(matiere.id) +
        '" aria-label="Voir les cours de ' + echapper(matiere.nom) + '">' +
        icone("fleche-droite", 16) +
        "</a></div>"
      );
    });

    if (!lignes.length) {
      return App.vide("Aucune matière disponible", {
        icone: "livre",
        texte: "Les cours n'ont pas encore été chargés. Revenez après l'ouverture d'une leçon ou parcourez le catalogue.",
        action: { href: "cours.html", libelle: "Parcourir le catalogue" }
      });
    }
    return '<div class="carte perso-matieres">' + lignes.join("") + "</div>";
  }

  /* ---------------------------------------------------------------------
     Temps par matière
     --------------------------------------------------------------------- */
  function htmlTempsMatieres() {
    var temps = Store.minutesParMatiere();
    if (!temps.length) {
      return App.vide("Aucun temps d'étude enregistré", {
        icone: "horloge",
        texte: "Les sessions d'étude apparaîtront ici dès que vous aurez utilisé le minuteur ou enregistré une session.",
        action: { href: "espace-travail.html?onglet=minuteur", libelle: "Ouvrir le minuteur" }
      });
    }
    return (
      '<div class="carte perso-temps">' +
      temps
        .map(function (element) {
          var matiere = window.APP_DATA ? APP_DATA.matiere(element.matiere) : { nom: element.matiere, icone: "livre", teinte: "slate" };
          return (
            '<div class="perso-temps__ligne">' +
            '<span class="perso-matiere__icone" data-teinte="' + echapper(matiere.teinte) + '" aria-hidden="true">' +
            icone(matiere.icone, 18) +
            "</span>" +
            '<div class="perso-temps__corps">' +
            '<div class="rangee rangee--entre"><span class="perso-temps__nom">' +
            echapper(element.matiere ? matiere.nom : "Autre") +
            "</span>" +
            '<span class="petit texte-doux">' + echapper(App.duree(element.minutes)) + "</span></div>" +
            jauge(element.pourcentage, "Part de temps en " + matiere.nom) +
            "</div>" +
            '<span class="perso-temps__pct">' + element.pourcentage + " %</span></div>"
          );
        })
        .join("") +
      "</div>"
    );
  }

  /* ---------------------------------------------------------------------
     Historique des sessions
     --------------------------------------------------------------------- */
  function htmlSessions() {
    var sessions = Store.sessions(10);
    if (!sessions.length) {
      return App.vide("Aucune session enregistrée", {
        icone: "horloge",
        texte: "Vos sessions d'étude apparaîtront ici. Utilisez le minuteur ou enregistrez une session depuis le planning.",
        action: { href: "espace-travail.html?onglet=planning", libelle: "Ouvrir le planning" }
      });
    }
    return (
      '<div class="tableau-defilant"><table class="tableau tableau--dense">' +
      '<caption class="sr-only">Dix dernières sessions d\'étude enregistrées</caption>' +
      '<thead><tr><th scope="col">Date</th><th scope="col">Matière</th><th scope="col">Durée</th><th scope="col">Note</th><th scope="col"><span class="sr-only">Supprimer</span></th></tr></thead><tbody>' +
      sessions
        .map(function (session) {
          return (
            "<tr><td>" + echapper(App.date(session.date)) + "</td>" +
            "<td>" + echapper(nomMatiere(session.matiere)) + "</td>" +
            "<td>" + echapper(App.duree(session.minutes)) + "</td>" +
            '<td class="perso-session-note">' + echapper(session.note || "—") + "</td>" +
            '<td class="texte-droite"><button type="button" class="btn btn--sm btn--fantome" data-session="' +
            echapper(session.id) +
            '" aria-label="Supprimer la session du ' + echapper(App.date(session.date)) + '">' +
            icone("poubelle", 15) +
            "</button></td></tr>"
          );
        })
        .join("") +
      "</tbody></table></div>" +
      '<p class="micro texte-faible mt-3">Les sessions supprimées ne sont plus comptées dans vos temps d\'étude.</p>'
    );
  }

  /* ---------------------------------------------------------------------
     Résultats de quiz
     --------------------------------------------------------------------- */
  function htmlQuiz() {
    var lignes = [];
    (window.APP_DATA ? APP_DATA.cours : []).forEach(function (cours) {
      var resultat = Store.quiz(cours.slug);
      if (!resultat.tentatives) return;
      lignes.push(
        '<tr>' +
        "<td>" +
        '<a href="' + App.lienCours(cours.slug) + '">' + echapper(cours.titre) + "</a>" +
        '<span class="micro texte-faible perso-quiz-matiere">' + echapper(nomMatiere(cours.matiere)) + "</span></td>" +
        "<td>" +
        '<div class="perso-quiz-score">' + jauge(resultat.meilleurScore, "Meilleur score") +
        '<span class="micro">' + Math.round(resultat.meilleurScore) + " %</span></div></td>" +
        "<td>" + resultat.tentatives + " tentative" + (resultat.tentatives > 1 ? "s" : "") + "</td>" +
        '<td class="texte-droite"><a class="btn btn--sm btn--secondaire" href="' +
        App.lienCours(cours.slug) + '">Revoir la leçon</a></td></tr>'
      );
    });

    if (!lignes.length) {
      return App.vide("Aucun quiz passé", {
        icone: "trophee",
        texte: "Terminez la lecture d'une leçon puis validez son quiz : vos scores et vos progrès apparaîtront ici.",
        action: { href: "cours.html", libelle: "Choisir une leçon" }
      });
    }
    return (
      '<div class="tableau-defilant"><table class="tableau">' +
      "<caption class=\"sr-only\">Résultats de quiz par cours</caption>" +
      '<thead><tr><th scope="col">Cours</th><th scope="col">Meilleur score</th><th scope="col">Tentatives</th><th scope="col"><span class="sr-only">Action</span></th></tr></thead><tbody>' +
      lignes.join("") +
      "</tbody></table></div>"
    );
  }

  /* ---------------------------------------------------------------------
     Badges
     --------------------------------------------------------------------- */
  function htmlBadges() {
    var badges = [];
    (window.APP_DATA ? APP_DATA.badges : []).forEach(function (definition) {
      var badge = Store.badge(definition.id);
      if (badge) badges.push(badge);
    });
    if (!badges.length) {
      return App.vide("Aucun badge à afficher", {
        icone: "medaille",
        texte: "Les badges récompensent votre régularité et vos progrès. Ils apparaîtront ici au fil de votre apprentissage."
      });
    }
    var obtenus = badges.filter(function (badge) {
      return badge.obtenu;
    }).length;

    return (
      '<p class="petit texte-doux perso-badges__compteur">' +
      obtenus + " badge" + (obtenus > 1 ? "s" : "") + " obtenu" + (obtenus > 1 ? "s" : "") +
      " sur " + badges.length + ".</p>" +
      '<div class="perso-badges">' +
      badges
        .map(function (badge) {
          return (
            '<div class="' + (badge.obtenu ? "badge-obtenu" : "badge-verrouille") +
            '" data-teinte="' + echapper(badge.teinte || "indigo") +
            '" title="' + echapper(badge.obtenu ? "Badge obtenu" : "Badge à débloquer") + '">' +
            '<span class="badge__icone" aria-hidden="true">' + icone(badge.icone, 22) + "</span>" +
            '<span class="badge__nom">' + echapper(badge.nom) + "</span>" +
            '<span class="perso-badge__description micro texte-faible">' + echapper(badge.description) + "</span>" +
            '<span class="sr-only">' + (badge.obtenu ? "Obtenu" : "Verrouillé") + "</span></div>"
          );
        })
        .join("") +
      "</div>"
    );
  }

  /* ---------------------------------------------------------------------
     Recommandations
     --------------------------------------------------------------------- */
  function htmlRecommandations() {
    var coursDisponibles = (window.APP_DATA ? APP_DATA.cours : []).filter(Boolean);
    if (!coursDisponibles.length) {
      return App.vide("Catalogue indisponible", {
        icone: "livre",
        texte: "Les cours ne sont pas encore chargés. Vous pourrez bientôt reprendre votre parcours.",
        action: { href: "cours.html", libelle: "Voir le catalogue" }
      });
    }

    var recommande = Store.coursRecommande();
    var niveauId = Store.niveauCourant();
    var niveau = window.APP_DATA ? APP_DATA.niveau(niveauId) : { nom: "votre niveau" };
    var suivants = (window.APP_DATA ? APP_DATA.coursDuNiveau(niveauId) : [])
      .filter(function (cours) {
        return cours && !Store.estTermine(cours.slug) && (!recommande || cours.slug !== recommande.slug);
      })
      .slice(0, 3);

    if (suivants.length < 3) {
      coursDisponibles.forEach(function (cours) {
        if (suivants.length >= 3) return;
        if (Store.estTermine(cours.slug)) return;
        if (recommande && cours.slug === recommande.slug) return;
        var dejaLa = suivants.some(function (element) {
          return element.slug === cours.slug;
        });
        if (!dejaLa) suivants.push(cours);
      });
    }

    if (!recommande && !suivants.length) {
      return (
        '<div class="boite-succes">' + icone("succes", 20) +
        '<div><p><strong>Tous les cours du catalogue sont terminés.</strong></p>' +
        '<p class="petit">Félicitations ! Revenez bientôt : de nouveaux contenus viendront enrichir le catalogue.</p></div></div>' +
        '<a class="btn btn--secondaire mt-4" href="cours.html">' + icone("livre", 18) + " Revoir les cours</a>"
      );
    }

    var cartes = "";
    if (recommande) {
      cartes +=
        '<div class="perso-reco-principal">' +
        '<p class="micro perso-reco__etiquette"><span class="etiquette etiquette--primaire">' +
        icone("etoile", 13) + " Recommandé pour vous</span></p>" +
        App.carteCours(recommande) +
        "</div>";
    }
    cartes += suivants
      .map(function (cours) {
        return App.carteCours(cours);
      })
      .join("");

    return (
      '<p class="petit texte-doux">Reprenez là où vous en étiez, avec d\'autres cours de ' +
      echapper(niveau.nom) + " pour continuer sur votre lancée.</p>" +
      '<div class="grille grille--auto perso-reco">' + cartes + "</div>"
    );
  }

  /* ---------------------------------------------------------------------
     Bloc de section
     --------------------------------------------------------------------- */
  function blocSection(identifiant, titre, nomIcone, contenu, lien) {
    return (
      '<section class="perso-suivi-bloc" aria-labelledby="' + identifiant + '">' +
      '<div class="section__entete">' +
      '<h2 class="section__titre" id="' + identifiant + '">' +
      icone(nomIcone, 20) +
      " " + echapper(titre) + "</h2>" +
      (lien
        ? '<a class="lien-fleche" href="' + lien.href + '">' + echapper(lien.libelle) + " " +
          icone("fleche-droite", 15) + "</a>"
        : "") +
      "</div>" +
      contenu +
      "</section>"
    );
  }

  /* ---------------------------------------------------------------------
     Rendu complet
     --------------------------------------------------------------------- */
  function rendre() {
    if (!racine) return;
    Store.badgesObtenus();

    racine.innerHTML =
      htmlEntete() +
      '<div class="conteneur section perso-suivi">' +
      htmlIndicateurs() +
      '<div class="perso-suivi-haut">' +
      htmlObjectifHebdo() +
      blocSection("titre-graphique", "Temps d'étude des 7 derniers jours", "graphique", htmlGraphique()) +
      "</div>" +
      blocSection("titre-matieres", "Progression par matière", "livre", htmlMatieres()) +
      '<div class="perso-suivi-deux">' +
      blocSection("titre-temps", "Temps par matière", "horloge", htmlTempsMatieres()) +
      blocSection("titre-badges", "Badges", "medaille", htmlBadges()) +
      "</div>" +
      blocSection("titre-sessions", "Historique des sessions", "calendrier", htmlSessions(), {
        href: "espace-travail.html?onglet=planning",
        libelle: "Planifier"
      }) +
      blocSection("titre-quiz", "Résultats des quiz", "trophee", htmlQuiz()) +
      blocSection("titre-reco", "Prochaines étapes", "fleche-droite", htmlRecommandations()) +
      "</div>";
  }

  /* ---------------------------------------------------------------------
     Actions
     --------------------------------------------------------------------- */
  function supprimerSession(identifiant) {
    var session = Store.sessions().filter(function (element) {
      return element.id === identifiant;
    })[0];
    App.confirmer({
      titre: "Supprimer la session",
      message: session
        ? "La session de " + App.duree(session.minutes) + " (" + nomMatiere(session.matiere) + ", " + App.date(session.date) + ") sera définitivement supprimée de votre historique."
        : "Cette session sera définitivement supprimée de votre historique.",
      libelleOk: "Supprimer",
      danger: true
    }).then(function (confirme) {
      if (!confirme) return;
      Store.supprimerSession(identifiant);
      App.toast("Session supprimée.", { type: "info" });
    });
  }

  function brancherActions() {
    racine.addEventListener("click", function (evenement) {
      var bouton = evenement.target.closest("[data-session]");
      if (!bouton) return;
      supprimerSession(bouton.getAttribute("data-session"));
    });
  }

  /* ---------------------------------------------------------------------
     Initialisation
     --------------------------------------------------------------------- */
  function initialiser() {
    racine = document.getElementById("suivi-racine");
    if (!racine) return;
    rendre();
    brancherActions();
    Store.subscribe(rendre);
  }

  App.onReady(initialiser);
})();
