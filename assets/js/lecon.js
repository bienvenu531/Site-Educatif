/* ==========================================================================
   SepsHaness — page Leçon (lecon.html et lecon-<slug>.html)
   Affiche un cours : fil d'Ariane, objectifs, sections, quiz corrigé,
   progression, cours liés et navigation précédent / suivant.
   Le rendu HTML est délégué à assets/js/lecon-vue.js (partagé avec le
   pré-rendu) ; ce fichier ne gère que l'interactivité et le Store.
   Cours affiché : ?cours=slug, ou l'attribut data-cours de la page statique.
   ========================================================================== */
(function () {
  "use strict";

  var racine = null;
  var cours = null;
  var vue = null;
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
     Quiz
     --------------------------------------------------------------------- */
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
     Progression
     --------------------------------------------------------------------- */
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
     Rendu de la page
     --------------------------------------------------------------------- */
  function rendrePage() {
    dernierEtatBouton = htmlBoutonTermine();
    racine.innerHTML = vue.page(cours, {
      actionTermine: dernierEtatBouton,
      progressionHtml: htmlProgression()
    });

    brancherBoutonTermine();
    brancherQuiz();
    brancherSommaire();
    App.iconeDans(racine);
  }

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

    if (!window.LeconVue) {
      racine.innerHTML =
        '<div class="conteneur section"><h1 class="titre-2">Leçon indisponible</h1>' +
        '<p class="plomb">Le module de rendu des leçons n\'a pas pu être chargé.</p></div>';
      return;
    }

    // Page dynamique (?cours=slug) ou page pré-rendue (data-cours="slug").
    var slug = App.param("cours") || document.body.getAttribute("data-cours") || "";
    cours = slug && window.APP_DATA ? APP_DATA.getCours(slug) : null;

    if (!cours) {
      rendreIntrouvable(slug);
      return;
    }

    vue = LeconVue.creer(App, APP_DATA);
    questions = cours.quiz || [];
    document.title = cours.titre + " — SepsHaness";
    debut = Date.now();
    Store.marquerVue(cours.slug);
    rendrePage();
    Store.subscribe(majEtatProgression);
  }

  App.onReady(initialiser);
})();
