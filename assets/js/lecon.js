/* ==========================================================================
   SepsHaness — page Leçon (lecon.html)
   Affiche un cours (?cours=slug) : fil d'Ariane, objectifs, sections, quiz
   corrigé, progression, cours liés et navigation précédent / suivant.
   API utilisées : App, Store, APP_DATA (voir docs/CONTRAT.md).
   ========================================================================== */
(function () {
  "use strict";

  var racine = null;
  var cours = null;
  var debut = 0;
  var questions = [];
  var quizValide = false;
  var dernierScore = null;
  var dernierEtatBouton = "";

  /* ---------------------------------------------------------------------
     Helpers
     --------------------------------------------------------------------- */
  function echapper(texte) {
    return App.escape(texte);
  }

  function icone(nom, taille) {
    return App.icon(nom, { taille: taille || 18 });
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

  function appreciation(pourcentage) {
    if (pourcentage >= 90) return "Excellent, le cours est maîtrisé.";
    if (pourcentage >= 70) return "Très bien : les idées principales sont acquises.";
    if (pourcentage >= 50) return "Bien : quelques points restent à revoir.";
    return "À retravailler : relisez le cours puis retentez le quiz.";
  }

  /* ---------------------------------------------------------------------
     Rendu des blocs de cours
     --------------------------------------------------------------------- */
  function rendreBloc(bloc) {
    var donnees = bloc || {};
    var type = donnees.type || "p";

    if (type === "liste" || type === "liste-num") {
      var balise = type === "liste-num" ? "ol" : "ul";
      var elements = (donnees.items || [])
        .map(function (item) {
          return "<li>" + App.mdInline(item) + "</li>";
        })
        .join("");
      return "<" + balise + (type === "liste-num" ? ' class="perso-liste-num"' : "") + ">" + elements + "</" + balise + ">";
    }

    if (type === "encadre") {
      return (
        '<aside class="perso-encadre" role="note">' +
        '<span class="perso-encadre__icone" aria-hidden="true">' +
        icone("info", 20) +
        "</span>" +
        '<div class="perso-encadre__corps">' +
        (donnees.titre ? '<p class="perso-encadre__titre">' + echapper(donnees.titre) + "</p>" : "") +
        '<p class="perso-encadre__texte">' +
        App.mdInline(donnees.texte || "") +
        "</p></div></aside>"
      );
    }

    if (type === "exemple") {
      return (
        '<aside class="perso-exemple" role="note">' +
        '<span class="perso-exemple__icone" aria-hidden="true">' +
        icone("crayon", 20) +
        "</span>" +
        '<div class="perso-exemple__corps">' +
        '<p class="perso-exemple__titre">' + echapper(donnees.titre || "Exemple guidé") + "</p>" +
        '<p class="perso-exemple__texte">' + App.mdInline(donnees.texte || "") + "</p>" +
        "</div></aside>"
      );
    }

    if (type === "tableau") {
      var entetes = donnees.entetes || [];
      var lignes = donnees.lignes || [];
      return (
        '<div class="tableau-defilant perso-tableau">' +
        '<table class="tableau">' +
        "<thead><tr>" +
        entetes
          .map(function (entete) {
            return '<th scope="col">' + App.mdInline(entete) + "</th>";
          })
          .join("") +
        "</tr></thead><tbody>" +
        lignes
          .map(function (ligne) {
            return (
              "<tr>" +
              (ligne || [])
                .map(function (cellule) {
                  return "<td>" + App.mdInline(cellule) + "</td>";
                })
                .join("") +
              "</tr>"
            );
          })
          .join("") +
        "</tbody></table></div>"
      );
    }

    if (type === "code") {
      return (
        '<div class="perso-code">' +
        '<div class="perso-code__entete"><span class="micro mono">' +
        echapper(donnees.langage || "code") +
        "</span></div>" +
        "<pre><code>" +
        echapper(donnees.texte || "") +
        "</code></pre></div>"
      );
    }

    return '<p class="perso-bloc-texte">' + App.mdInline(donnees.texte || "") + "</p>";
  }

  function rendreSections() {
    var sections = cours.sections || [];
    return sections
      .map(function (section, index) {
        var numero = index + 1;
        var identifiant = "section-" + numero;
        return (
          '<section class="perso-section" id="' +
          identifiant +
          '" aria-labelledby="titre-' +
          identifiant +
          '">' +
          '<h2 class="perso-section__titre" id="titre-' +
          identifiant +
          '">' +
          '<span class="perso-section__numero" aria-hidden="true">' +
          numero +
          "</span>" +
          echapper(section.titre || "Section " + numero) +
          "</h2>" +
          '<div class="perso-section__corps contenu-riche">' +
          (section.blocs || []).map(rendreBloc).join("") +
          "</div></section>"
        );
      })
      .join("");
  }

  /* ---------------------------------------------------------------------
     Objectifs et prérequis
     --------------------------------------------------------------------- */
  function rendreObjectifs() {
    var objectifs = cours.objectifs || [];
    if (!objectifs.length) return "";
    return (
      '<section class="carte perso-objectifs" id="objectifs" aria-labelledby="titre-objectifs">' +
      '<div class="carte__entete">' +
      '<h2 class="titre-3" id="titre-objectifs">Objectifs d\'apprentissage</h2>' +
      '<span class="carte__icone" data-teinte="emerald" aria-hidden="true">' +
      icone("cible", 22) +
      "</span></div>" +
      '<ul class="perso-objectifs__liste">' +
      objectifs
        .map(function (objectif) {
          return '<li class="perso-objectifs__element">' + App.mdInline(objectif) + "</li>";
        })
        .join("") +
      "</ul></section>"
    );
  }

  function rendrePrerequis() {
    var prerequis = cours.prerequis || [];
    if (!prerequis.length) return "";
    var texte =
      typeof prerequis === "string"
        ? prerequis
        : prerequis
            .map(function (element) {
              return App.mdInline(element);
            })
            .join(" · ");
    return (
      '<section class="carte perso-prerequis" aria-labelledby="titre-prerequis">' +
      '<h2 class="titre-4" id="titre-prerequis">' +
      icone("info", 17) +
      " Prérequis</h2>" +
      '<p class="petit texte-doux">' +
      texte +
      "</p></section>"
    );
  }

  /* ---------------------------------------------------------------------
     Quiz
     --------------------------------------------------------------------- */
  function rendreQuestion(question, index) {
    var options = (question.options || [])
      .map(function (option, position) {
        var identifiant = "quiz-q" + index + "-" + position;
        return (
          '<label class="perso-option" for="' +
          identifiant +
          '">' +
          '<input type="radio" id="' +
          identifiant +
          '" name="quiz-q' +
          index +
          '" value="' +
          position +
          '" />' +
          '<span class="perso-option__texte">' +
          App.mdInline(option) +
          "</span>" +
          '<span class="perso-option__marque" aria-hidden="true"></span>' +
          "</label>"
        );
      })
      .join("");

    return (
      '<fieldset class="perso-question" data-question="' +
      index +
      '">' +
      '<legend class="perso-question__legende">' +
      '<span class="perso-question__numero">Question ' +
      (index + 1) +
      "</span> " +
      echapper(question.question) +
      "</legend>" +
      '<div class="perso-options">' +
      options +
      "</div>" +
      '<div class="perso-question__retour" hidden></div>' +
      "</fieldset>"
    );
  }

  function rendreQuiz() {
    questions = cours.quiz || [];
    if (!questions.length) return "";
    return (
      '<section class="carte perso-quiz" id="quiz" aria-labelledby="titre-quiz">' +
      '<div class="carte__entete">' +
      '<div><h2 class="titre-3" id="titre-quiz">Quiz de vérification</h2>' +
      '<p class="petit texte-doux">' +
      questions.length +
      " question" +
      (questions.length > 1 ? "s" : "") +
      " · une seule bonne réponse par question.</p></div>" +
      '<span class="carte__icone" data-teinte="amber" aria-hidden="true">' +
      icone("trophee", 22) +
      "</span></div>" +
      '<form id="quiz-form" novalidate>' +
      questions.map(rendreQuestion).join("") +
      '<div class="perso-quiz__actions">' +
      '<button type="submit" class="btn btn--primaire" id="quiz-valider">' +
      icone("check", 18) +
      " Valider mes réponses</button>" +
      '<button type="button" class="btn btn--secondaire" id="quiz-recommencer" hidden>' +
      icone("reinitialiser", 18) +
      " Recommencer</button>" +
      "</div></form>" +
      '<div class="perso-quiz__resultat" id="quiz-resultat" aria-live="polite" tabindex="-1"></div>' +
      "</section>"
    );
  }

  function validerQuiz(evenement) {
    if (evenement) evenement.preventDefault();
    if (quizValide || !questions.length) return;
    var formulaire = document.getElementById("quiz-form");
    if (!formulaire) return;
    quizValide = true;

    var bonnes = 0;
    questions.forEach(function (question, index) {
      var champ = formulaire.querySelector('input[name="quiz-q' + index + '"]:checked');
      var valeur = champ ? Number(champ.value) : -1;
      var juste = valeur === question.bonne;
      if (juste) bonnes += 1;

      var fieldset = formulaire.querySelector('[data-question="' + index + '"]');
      if (!fieldset) return;
      fieldset.classList.add("perso-question--corrigee");

      Array.prototype.forEach.call(fieldset.querySelectorAll(".perso-option"), function (option, position) {
        var input = option.querySelector("input");
        if (input) input.disabled = true;
        option.classList.toggle("perso-option--bonne", position === question.bonne);
        option.classList.toggle("perso-option--mauvaise", position === valeur && !juste);
      });

      var retour = fieldset.querySelector(".perso-question__retour");
      if (!retour) return;
      retour.hidden = false;
      retour.className =
        "perso-question__retour " +
        (juste ? "perso-question__retour--juste" : "perso-question__retour--faux");
      var verdict = juste
        ? icone("succes", 18) + " Bonne réponse."
        : icone("croix", 18) +
          (valeur === -1 ? " Aucune réponse sélectionnée." : " Réponse incorrecte.") +
          " La bonne réponse est : <strong>" +
          echapper(question.options[question.bonne]) +
          "</strong>.";
      retour.innerHTML =
        '<p class="petit">' +
        verdict +
        "</p>" +
        (question.explication
          ? '<p class="petit perso-question__explication">' + App.mdInline(question.explication) + "</p>"
          : "");
    });

    var total = questions.length;
    var pourcentage = Math.round((bonnes / total) * 100);
    dernierScore = pourcentage;

    var boutonValider = document.getElementById("quiz-valider");
    if (boutonValider) boutonValider.disabled = true;
    var boutonRecommencer = document.getElementById("quiz-recommencer");
    if (boutonRecommencer) boutonRecommencer.hidden = false;

    var resultat = document.getElementById("quiz-resultat");
    if (resultat) {
      resultat.hidden = false;
      resultat.innerHTML =
        '<div class="perso-score ' +
        (pourcentage >= 70 ? "perso-score--bien" : "perso-score--faible") +
        '">' +
        '<span class="perso-score__valeur">' +
        pourcentage +
        " %</span>" +
        '<p class="perso-score__appreciation">' +
        echapper(appreciation(pourcentage)) +
        "</p>" +
        '<p class="petit texte-doux">' +
        bonnes +
        " bonne" +
        (bonnes > 1 ? "s" : "") +
        " réponse" +
        (bonnes > 1 ? "s" : "") +
        " sur " +
        total +
        ". Ce résultat est enregistré dans votre suivi.</p>" +
        "</div>";
      try {
        resultat.focus();
      } catch (erreur) {
        /* le focus est un confort, pas une obligation */
      }
    }

    Store.enregistrerQuiz(cours.slug, bonnes, total);
    majEtatProgression();
  }

  function recommencerQuiz() {
    var formulaire = document.getElementById("quiz-form");
    if (!formulaire) return;
    quizValide = false;

    Array.prototype.forEach.call(formulaire.querySelectorAll('input[type="radio"]'), function (input) {
      input.checked = false;
      input.disabled = false;
    });
    Array.prototype.forEach.call(formulaire.querySelectorAll(".perso-option"), function (option) {
      option.classList.remove("perso-option--bonne", "perso-option--mauvaise");
    });
    Array.prototype.forEach.call(formulaire.querySelectorAll(".perso-question"), function (question) {
      question.classList.remove("perso-question--corrigee");
    });
    Array.prototype.forEach.call(formulaire.querySelectorAll(".perso-question__retour"), function (retour) {
      retour.hidden = true;
      retour.innerHTML = "";
      retour.className = "perso-question__retour";
    });

    var boutonValider = document.getElementById("quiz-valider");
    if (boutonValider) boutonValider.disabled = false;
    var boutonRecommencer = document.getElementById("quiz-recommencer");
    if (boutonRecommencer) boutonRecommencer.hidden = true;
    var resultat = document.getElementById("quiz-resultat");
    if (resultat) {
      resultat.hidden = true;
      resultat.innerHTML = "";
    }
    dernierScore = null;
    var premier = formulaire.querySelector('input[type="radio"]');
    if (premier) premier.focus();
  }

  /* ---------------------------------------------------------------------
     Sommaire, progression, latéral
     --------------------------------------------------------------------- */
  function rendreSommaire() {
    var sections = cours.sections || [];
    var liens = sections
      .map(function (section, index) {
        return (
          '<li><a class="perso-sommaire__lien" href="#section-' +
          (index + 1) +
          '"><span class="perso-sommaire__numero">' +
          (index + 1) +
          ".</span> " +
          echapper(section.titre || "Section " + (index + 1)) +
          "</a></li>"
        );
      })
      .join("");
    if (cours.quiz && cours.quiz.length) {
      liens += '<li><a class="perso-sommaire__lien" href="#quiz">Quiz de vérification</a></li>';
    }
    return (
      '<nav class="carte perso-sommaire" aria-labelledby="titre-sommaire">' +
      '<h2 class="titre-4 perso-sommaire__titre" id="titre-sommaire">' +
      icone("livre", 17) +
      " Sommaire</h2>" +
      '<ol class="perso-sommaire__liste">' +
      liens +
      "</ol></nav>"
    );
  }

  function rendreDocuments() {
    var documents = window.APP_DATA ? APP_DATA.documentsDuCours(cours.slug) : [];
    if (!documents.length) return "";
    return (
      '<section class="carte perso-documents" aria-labelledby="titre-documents">' +
      '<h2 class="titre-4 perso-documents__titre" id="titre-documents">' +
      icone("bibliotheque", 17) +
      " Documents liés</h2>" +
      '<ul class="perso-documents__liste">' +
      documents
        .map(function (document) {
          var type = window.APP_DATA
            ? APP_DATA.typeDocument(document.type)
            : { nom: "Document", icone: "document" };
          return (
            '<li><a class="perso-document" href="' +
            App.lienDocument(document.id) +
            '">' +
            '<span class="perso-document__icone" aria-hidden="true">' +
            icone(type.icone, 17) +
            "</span>" +
            '<span class="perso-document__corps">' +
            '<span class="perso-document__titre">' +
            echapper(document.titre) +
            "</span>" +
            '<span class="micro texte-faible">' +
            echapper(type.nom) +
            (document.pages ? " · " + document.pages + " p." : "") +
            "</span></span></a></li>"
          );
        })
        .join("") +
      "</ul></section>"
    );
  }

  function htmlProgression() {
    var lecon = Store.lecon(cours.slug);
    var resultatQuiz = Store.quiz(cours.slug);
    var termine = lecon.statut === "termine";
    var enCours = lecon.statut === "en-cours";

    var etiquette = termine
      ? '<span class="etiquette etiquette--succes">' + icone("check", 13) + " Terminé</span>"
      : enCours
        ? '<span class="etiquette etiquette--info">En cours</span>'
        : '<span class="etiquette etiquette--neutre">À commencer</span>';

    var progression = termine ? 100 : resultatQuiz.meilleurScore || 0;
    var libelleJauge = termine
      ? "Cours terminé"
      : resultatQuiz.meilleurScore
        ? "Meilleur score au quiz"
        : "Progression dans la leçon";

    var details = [];
    if (resultatQuiz.tentatives) {
      details.push(
        '<li><span class="micro texte-faible">Meilleur score au quiz</span><span class="perso-progression__valeur">' +
          Math.round(resultatQuiz.meilleurScore) +
          " %</span></li>"
      );
      details.push(
        '<li><span class="micro texte-faible">Tentatives</span><span class="perso-progression__valeur">' +
          resultatQuiz.tentatives +
          "</span></li>"
      );
    }
    details.push(
      '<li><span class="micro texte-faible">Consultations</span><span class="perso-progression__valeur">' +
        lecon.vues +
        "</span></li>"
    );
    if (lecon.minutes) {
      details.push(
        '<li><span class="micro texte-faible">Temps de lecture cumulé</span><span class="perso-progression__valeur">' +
          App.duree(lecon.minutes) +
          "</span></li>"
      );
    }

    return (
      '<div class="carte__entete">' +
      '<h2 class="titre-4">Ma progression</h2>' +
      etiquette +
      "</div>" +
      jauge(progression, libelleJauge) +
      '<p class="micro texte-doux">' +
      echapper(libelleJauge) +
      "</p>" +
      '<ul class="perso-progression__details">' +
      details.join("") +
      "</ul>"
    );
  }

  function rendreProgression() {
    return (
      '<section class="carte perso-progression" id="lecon-progression" aria-labelledby="titre-progression">' +
      '<h2 class="sr-only" id="titre-progression">Ma progression sur cette leçon</h2>' +
      htmlProgression() +
      "</section>"
    );
  }

  function rendreAstuce() {
    return (
      '<section class="carte perso-astuce" aria-labelledby="titre-astuce">' +
      '<h2 class="titre-4 perso-astuce__titre" id="titre-astuce">' +
      icone("feu", 17) +
      " Conseil de méthode</h2>" +
      '<p class="petit texte-doux">Lisez une première fois le cours sans prendre de notes, puis relisez-le en surlignant les idées clés. Terminez par le quiz : chaque erreur vous indique la section à revoir.</p>' +
      '<p class="micro texte-faible">Durée estimée de la leçon : ' +
      App.duree(cours.duree) +
      ".</p></section>"
    );
  }

  /* ---------------------------------------------------------------------
     Bouton « Marquer comme terminé »
     --------------------------------------------------------------------- */
  function htmlBoutonTermine() {
    if (Store.estTermine(cours.slug)) {
      return (
        '<button type="button" class="btn btn--secondaire" disabled aria-label="Cette leçon est déjà terminée">' +
        icone("check", 18) +
        " Cours terminé</button>"
      );
    }
    return (
      '<button type="button" class="btn btn--primaire" id="bouton-termine">' +
      icone("check", 18) +
      " Marquer comme terminé</button>"
    );
  }

  function minutesDeLecture() {
    var ecoulees = Math.round((Date.now() - debut) / 60000);
    var minimum = 2;
    var maximum = Math.max(minimum, Math.round(Number(cours.duree) || 30) * 2);
    return Math.max(minimum, Math.min(maximum, ecoulees || minimum));
  }

  function marquerTermine() {
    if (!cours || Store.estTermine(cours.slug)) return;
    var minutes = minutesDeLecture();
    var score = dernierScore;
    if (score === null) {
      var lecon = Store.lecon(cours.slug);
      score = typeof lecon.score === "number" ? lecon.score : null;
    }
    var options = { minutes: minutes };
    if (score !== null && isFinite(score)) options.score = score;

    Store.marquerTermine(cours.slug, options);
    Store.journaliserSession({
      minutes: minutes,
      matiere: cours.matiere,
      coursSlug: cours.slug,
      note: "Lecture du cours"
    });
    App.toast(
      "Leçon terminée : " + App.duree(minutes) + " de lecture enregistrées dans votre suivi.",
      { type: "succes" }
    );
    majEtatProgression();
  }

  function brancherBoutonTermine() {
    var bouton = document.getElementById("bouton-termine");
    if (bouton) bouton.addEventListener("click", marquerTermine);
  }

  function majEtatProgression() {
    if (!cours) return;
    var html = htmlBoutonTermine();
    if (html !== dernierEtatBouton) {
      var zone = document.getElementById("lecon-action-termine");
      if (zone) {
        dernierEtatBouton = html;
        zone.innerHTML = html;
        brancherBoutonTermine();
      }
    }
    var progression = document.getElementById("lecon-progression");
    if (progression) progression.innerHTML =
      '<h2 class="sr-only" id="titre-progression">Ma progression sur cette leçon</h2>' + htmlProgression();
  }

  /* ---------------------------------------------------------------------
     Cours liés et navigation
     --------------------------------------------------------------------- */
  function rendreCoursLies() {
    var lies = window.APP_DATA ? APP_DATA.coursLies(cours.slug).slice(0, 3) : [];
    if (!lies.length) return "";
    return (
      '<section class="perso-lies" aria-labelledby="titre-lies">' +
      '<div class="section__entete"><h2 class="section__titre" id="titre-lies">Cours liés</h2>' +
      '<a class="lien-fleche" href="cours.html">Tout le catalogue ' +
      icone("fleche-droite", 16) +
      "</a></div>" +
      '<div class="grille grille--auto">' +
      lies
        .map(function (lie) {
          return App.carteCours(lie);
        })
        .join("") +
      "</div></section>"
    );
  }

  function rendreNavigation() {
    var liste = (window.APP_DATA && APP_DATA.cours) || [];
    var index = -1;
    liste.forEach(function (element, position) {
      if (element && element.slug === cours.slug) index = position;
    });
    var precedent = index > 0 ? liste[index - 1] : null;
    var suivant = index >= 0 && index < liste.length - 1 ? liste[index + 1] : null;

    var gauche = precedent
      ? '<a class="perso-nav__lien perso-nav__lien--precedent" href="' +
        App.lienCours(precedent.slug) +
        '"><span class="perso-nav__sens">' +
        icone("fleche-gauche", 16) +
        " Leçon précédente</span><span class=\"perso-nav__titre\">" +
        echapper(precedent.titre) +
        "</span></a>"
      : '<span class="perso-nav__vide" aria-hidden="true"></span>';
    var droite = suivant
      ? '<a class="perso-nav__lien perso-nav__lien--suivant" href="' +
        App.lienCours(suivant.slug) +
        '"><span class="perso-nav__sens">Leçon suivante ' +
        icone("fleche-droite", 16) +
        '</span><span class="perso-nav__titre">' +
        echapper(suivant.titre) +
        "</span></a>"
      : '<span class="perso-nav__vide" aria-hidden="true"></span>';

    return '<nav class="perso-nav" aria-label="Navigation entre les leçons">' + gauche + droite + "</nav>";
  }

  /* ---------------------------------------------------------------------
     En-tête de page
     --------------------------------------------------------------------- */
  function rendreEntete() {
    var matiere = APP_DATA.matiere(cours.matiere);
    var niveau = APP_DATA.niveau(cours.niveau);
    var difficulte = APP_DATA.libelleDifficulte(cours.difficulte);
    var nombre = cours.quiz ? cours.quiz.length : 0;

    return (
      '<section class="entete-page"><div class="conteneur">' +
      '<nav class="fil-ariane" aria-label="Fil d\'Ariane">' +
      '<a href="index.html">Accueil</a><span class="fil-ariane__separateur" aria-hidden="true">/</span>' +
      '<a href="cours.html">Cours</a><span class="fil-ariane__separateur" aria-hidden="true">/</span>' +
      '<a href="cours.html?matiere=' +
      encodeURIComponent(matiere.id) +
      '">' +
      echapper(matiere.nom) +
      '</a><span class="fil-ariane__separateur" aria-hidden="true">/</span>' +
      '<span aria-current="page">' +
      echapper(cours.titre) +
      "</span></nav>" +
      '<div class="entete-page__inner">' +
      "<div>" +
      '<div class="rangee perso-etiquettes">' +
      '<span class="etiquette" data-teinte="' +
      echapper(niveau.teinte) +
      '">' +
      echapper(niveau.nom) +
      "</span>" +
      '<a class="etiquette perso-etiquette-lien" data-teinte="' +
      echapper(matiere.teinte) +
      '" href="cours.html?matiere=' +
      encodeURIComponent(matiere.id) +
      '">' +
      icone(matiere.icone, 13) +
      " " +
      echapper(matiere.nom) +
      "</a>" +
      (cours.classe ? '<span class="etiquette etiquette--neutre">' + echapper(cours.classe) + "</span>" : "") +
      "</div>" +
      '<h1 class="entete-page__titre" id="lecon-titre">' +
      echapper(cours.titre) +
      "</h1>" +
      '<p class="entete-page__texte">' +
      echapper(cours.resume || "") +
      "</p>" +
      '<div class="rangee perso-meta">' +
      '<span class="puce">' +
      icone("horloge", 15) +
      " " +
      echapper(App.duree(cours.duree)) +
      "</span>" +
      '<span class="puce">' +
      icone("cible", 15) +
      " " +
      echapper(difficulte.nom) +
      "</span>" +
      '<span class="puce">' +
      icone("bulle", 15) +
      " " +
      nombre +
      " question" +
      (nombre > 1 ? "s" : "") +
      "</span>" +
      (cours.sections && cours.sections.length
        ? '<span class="puce">' + icone("livre", 15) + " " + cours.sections.length + " sections</span>"
        : "") +
      "</div></div>" +
      '<div class="entete-page__actions">' +
      '<div id="lecon-action-termine">' +
      htmlBoutonTermine() +
      "</div>" +
      '<a class="btn btn--secondaire" href="cours.html">' +
      icone("fleche-gauche", 18) +
      " Retour au catalogue</a>" +
      "</div></div></div></section>"
    );
  }

  function rendrePage() {
    dernierEtatBouton = htmlBoutonTermine();
    racine.innerHTML =
      rendreEntete() +
      '<div class="conteneur section perso-lecon">' +
      '<div class="perso-lecon__grille">' +
      '<div class="perso-lecon__principal">' +
      rendreObjectifs() +
      rendrePrerequis() +
      rendreSections() +
      rendreQuiz() +
      rendreCoursLies() +
      rendreNavigation() +
      "</div>" +
      '<aside class="perso-lecon__cote" aria-label="Repères de la leçon">' +
      rendreSommaire() +
      rendreDocuments() +
      rendreProgression() +
      rendreAstuce() +
      "</aside></div></div>";

    brancherBoutonTermine();
    brancherQuiz();
    brancherSommaire();
    App.iconeDans(racine);
  }

  /* ---------------------------------------------------------------------
     Liaisons
     --------------------------------------------------------------------- */
  function brancherQuiz() {
    var formulaire = document.getElementById("quiz-form");
    if (formulaire) formulaire.addEventListener("submit", validerQuiz);
    var boutonRecommencer = document.getElementById("quiz-recommencer");
    if (boutonRecommencer) boutonRecommencer.addEventListener("click", recommencerQuiz);
  }

  function brancherSommaire() {
    var liens = App.qsa(".perso-sommaire__lien", racine);
    liens.forEach(function (lien) {
      lien.addEventListener("click", function () {
        liens.forEach(function (autre) {
          autre.classList.remove("perso-sommaire__lien--actif");
          autre.removeAttribute("aria-current");
        });
        lien.classList.add("perso-sommaire__lien--actif");
        lien.setAttribute("aria-current", "true");
      });
    });
    if (liens.length) {
      liens[0].classList.add("perso-sommaire__lien--actif");
      liens[0].setAttribute("aria-current", "true");
    }
  }

  /* ---------------------------------------------------------------------
     État « cours introuvable »
     --------------------------------------------------------------------- */
  function rendreIntrouvable(slug) {
    var texte = slug
      ? "Aucun cours ne correspond à « " + slug + " ». Il a peut-être été renommé ou le lien est incomplet."
      : "Aucun cours n'a été indiqué dans le lien. Choisissez une leçon dans le catalogue pour commencer.";
    racine.innerHTML =
      '<section class="entete-page"><div class="conteneur">' +
      '<nav class="fil-ariane" aria-label="Fil d\'Ariane">' +
      '<a href="index.html">Accueil</a><span class="fil-ariane__separateur" aria-hidden="true">/</span>' +
      '<a href="cours.html">Cours</a><span class="fil-ariane__separateur" aria-hidden="true">/</span>' +
      '<span aria-current="page">Leçon introuvable</span></nav>' +
      '<h1 class="entete-page__titre">Leçon introuvable</h1>' +
      '<p class="entete-page__texte">' +
      echapper(texte) +
      "</p></div></section>" +
      '<div class="conteneur section perso-introuvable">' +
      App.vide("Cours introuvable", {
        icone: "livre",
        texte: "Parcourez le catalogue pour trouver une leçon adaptée à votre niveau et à vos révisions.",
        action: { href: "cours.html", libelle: "Parcourir le catalogue" }
      }) +
      "</div>";
    App.iconeDans(racine);
  }

  /* ---------------------------------------------------------------------
     Initialisation
     --------------------------------------------------------------------- */
  function initialiser() {
    racine = document.getElementById("lecon-racine");
    if (!racine) return;

    var slug = App.param("cours");
    cours = slug && window.APP_DATA ? APP_DATA.getCours(slug) : null;

    if (!cours) {
      rendreIntrouvable(slug);
      return;
    }

    document.title = cours.titre + " — SepsHaness";
    debut = Date.now();
    Store.marquerVue(cours.slug);
    rendrePage();
    Store.subscribe(majEtatProgression);
  }

  App.onReady(initialiser);
})();
