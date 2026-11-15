/* ==========================================================================
   SepsHaness — rendu des leçons (partagé navigateur / pré-rendu)
   Ce module ne touche ni au DOM ni au Store : il produit des chaînes HTML à
   partir d'un cours et de APP_DATA. Il est utilisé par :
     - assets/js/lecon.js    (page lecon.html?cours=… et lecon-<slug>.html) ;
     - tools/prerendre.mjs   (génération des pages lecon-<slug>.html).
   API : window.LeconVue.creer(App, APP_DATA)
   ========================================================================== */
(function (global) {
  "use strict";

  /** Tronque proprement un texte à `max` caractères (mot entier + points de suspension). */
  function tronquer(texte, max) {
    var valeur = String(texte == null ? "" : texte);
    if (valeur.length <= max) return valeur;
    var coupe = valeur.slice(0, max - 1);
    var espace = coupe.lastIndexOf(" ");
    if (espace > max * 0.6) coupe = coupe.slice(0, espace);
    return coupe.replace(/[.,;:!?\s]+$/, "") + "…";
  }

  function creer(App, DATA) {
    if (!App) throw new Error("LeconVue : App est requis.");
    DATA = DATA || {};

    /* ---------------------------------------------------------------------
       Helpers
       --------------------------------------------------------------------- */
    function echapper(texte) {
      return App.escape(texte);
    }

    function icone(nom, taille) {
      return App.icon(nom, { taille: taille || 18 });
    }

    function mdInline(texte) {
      return App.mdInline(texte == null ? "" : texte);
    }

    function matiereDe(cours) {
      return DATA.matiere
        ? DATA.matiere(cours.matiere)
        : { id: cours.matiere, nom: cours.matiere, icone: "livre", teinte: "indigo" };
    }

    function niveauDe(cours) {
      return DATA.niveau ? DATA.niveau(cours.niveau) : { nom: cours.niveau, teinte: "indigo" };
    }

    function difficulteDe(cours) {
      return DATA.libelleDifficulte ? DATA.libelleDifficulte(cours.difficulte) : { nom: "Découverte" };
    }

    /* ---------------------------------------------------------------------
       Rendu des blocs de cours
       --------------------------------------------------------------------- */
    function bloc(donnees) {
      var contenu = donnees || {};
      var type = contenu.type || "p";

      if (type === "liste" || type === "liste-num") {
        var balise = type === "liste-num" ? "ol" : "ul";
        var elements = (contenu.items || [])
          .map(function (item) {
            return "<li>" + mdInline(item) + "</li>";
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
          (contenu.titre ? '<p class="perso-encadre__titre">' + echapper(contenu.titre) + "</p>" : "") +
          '<p class="perso-encadre__texte">' +
          mdInline(contenu.texte || "") +
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
          '<p class="perso-exemple__titre">' + echapper(contenu.titre || "Exemple guidé") + "</p>" +
          '<p class="perso-exemple__texte">' + mdInline(contenu.texte || "") + "</p>" +
          "</div></aside>"
        );
      }

      if (type === "tableau") {
        var entetes = contenu.entetes || [];
        var lignes = contenu.lignes || [];
        return (
          '<div class="tableau-defilant perso-tableau">' +
          '<table class="tableau">' +
          "<thead><tr>" +
          entetes
            .map(function (entete) {
              return '<th scope="col">' + mdInline(entete) + "</th>";
            })
            .join("") +
          "</tr></thead><tbody>" +
          lignes
            .map(function (ligne) {
              return (
                "<tr>" +
                (ligne || [])
                  .map(function (cellule) {
                    return "<td>" + mdInline(cellule) + "</td>";
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
          echapper(contenu.langage || "code") +
          "</span></div>" +
          "<pre><code>" +
          echapper(contenu.texte || "") +
          "</code></pre></div>"
        );
      }

      return '<p class="perso-bloc-texte">' + mdInline(contenu.texte || "") + "</p>";
    }

    function sections(cours) {
      var liste = cours.sections || [];
      return liste
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
            (section.blocs || []).map(bloc).join("") +
            "</div></section>"
          );
        })
        .join("");
    }

    /* ---------------------------------------------------------------------
       Objectifs et prérequis
       --------------------------------------------------------------------- */
    function objectifs(cours) {
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
            return '<li class="perso-objectifs__element">' + mdInline(objectif) + "</li>";
          })
          .join("") +
        "</ul></section>"
      );
    }

    function prerequis(cours) {
      var prerequis = cours.prerequis || [];
      if (!prerequis.length) return "";
      var texte =
        typeof prerequis === "string"
          ? prerequis
          : prerequis
              .map(function (element) {
                return mdInline(element);
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
       Quiz : le formulaire ne contient jamais la bonne réponse
       --------------------------------------------------------------------- */
    function question(questionCours, index) {
      var options = (questionCours.options || [])
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
            mdInline(option) +
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
        echapper(questionCours.question) +
        "</legend>" +
        '<div class="perso-options">' +
        options +
        "</div>" +
        '<div class="perso-question__retour" hidden></div>' +
        "</fieldset>"
      );
    }

    function quiz(cours) {
      var questions = cours.quiz || [];
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
        questions.map(question).join("") +
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

    /* ---------------------------------------------------------------------
       Sommaire, documents, cours liés, navigation
       --------------------------------------------------------------------- */
    function sommaire(cours) {
      var liste = cours.sections || [];
      var liens = liste
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

    function documents(cours) {
      var liste = DATA.documentsDuCours ? DATA.documentsDuCours(cours.slug) : [];
      if (!liste.length) return "";
      return (
        '<section class="carte perso-documents" aria-labelledby="titre-documents">' +
        '<h2 class="titre-4 perso-documents__titre" id="titre-documents">' +
        icone("bibliotheque", 17) +
        " Documents liés</h2>" +
        '<ul class="perso-documents__liste">' +
        liste
          .map(function (document) {
            var type = DATA.typeDocument ? DATA.typeDocument(document.type) : { nom: "Document", icone: "document" };
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

    function coursLies(cours) {
      var lies = DATA.coursLies ? DATA.coursLies(cours.slug).slice(0, 3) : [];
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

    function navigation(cours) {
      var liste = (DATA.cours || []).slice();
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

    function astuce(cours) {
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
       En-tête, progression, page complète
       --------------------------------------------------------------------- */
    function entete(cours, options) {
      var reglages = options || {};
      var matiere = matiereDe(cours);
      var niveau = niveauDe(cours);
      var difficulte = difficulteDe(cours);
      var nombre = cours.quiz ? cours.quiz.length : 0;
      var retourHref = reglages.retourHref || "cours.html";
      var retourLibelle = reglages.retourLibelle || "Retour au catalogue";

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
        (reglages.actionTermine ? '<div id="lecon-action-termine">' + reglages.actionTermine + "</div>" : "") +
        '<a class="btn btn--secondaire" href="' +
        echapper(retourHref) +
        '">' +
        icone("fleche-gauche", 18) +
        " " +
        echapper(retourLibelle) +
        "</a>" +
        "</div></div></div></section>"
      );
    }

    /** Repli sans JavaScript : la carte de progression est remplacée par le Store. */
    function progressionStatique() {
      return (
        '<div class="carte__entete"><h2 class="titre-4">Ma progression</h2>' +
        '<span class="etiquette etiquette--neutre">À commencer</span></div>' +
        '<p class="petit texte-doux">Votre progression, vos scores au quiz et votre temps de lecture sont enregistrés dans ce navigateur, sans compte.</p>'
      );
    }

    /**
     * Contenu complet de #lecon-racine.
     * options.actionTermine : HTML du bouton « Marquer comme terminé » (vide = statique).
     * options.progressionHtml : contenu de la carte de progression (vide = repli statique).
     */
    function page(cours, options) {
      var reglages = options || {};
      var progression = reglages.progressionHtml == null ? progressionStatique() : reglages.progressionHtml;

      return (
        entete(cours, reglages) +
        '<div class="conteneur section perso-lecon">' +
        '<div class="perso-lecon__grille">' +
        '<div class="perso-lecon__principal">' +
        objectifs(cours) +
        prerequis(cours) +
        sections(cours) +
        quiz(cours) +
        coursLies(cours) +
        navigation(cours) +
        "</div>" +
        '<aside class="perso-lecon__cote" aria-label="Repères de la leçon">' +
        sommaire(cours) +
        documents(cours) +
        '<section class="carte perso-progression" id="lecon-progression" aria-labelledby="titre-progression">' +
        '<h2 class="sr-only" id="titre-progression">Ma progression sur cette leçon</h2>' +
        progression +
        "</section>" +
        astuce(cours) +
        "</aside></div></div>"
      );
    }

    /* ---------------------------------------------------------------------
       Métadonnées de la page statique
       --------------------------------------------------------------------- */
    function titreSeo(cours) {
      return (cours.titre || "Leçon") + " — SepsHaness";
    }

    function descriptionSeo(cours) {
      var base = String(cours.resume || "").replace(/\s+/g, " ").trim();
      var complement =
        "Cours de " +
        matiereDe(cours).nom +
        " (" +
        niveauDe(cours).nom +
        ") : objectifs, cours détaillé, exemples et quiz corrigé.";
      if (base.length < 90) base = base ? base + " " + complement : complement;
      return tronquer(base, 180);
    }

    /** Chemin public de la page pré-rendue d'un cours. */
    function fichier(cours) {
      return "lecon-" + encodeURIComponent(cours.slug) + ".html";
    }

    return {
      bloc: bloc,
      sections: sections,
      objectifs: objectifs,
      prerequis: prerequis,
      quiz: quiz,
      sommaire: sommaire,
      documents: documents,
      coursLies: coursLies,
      navigation: navigation,
      astuce: astuce,
      entete: entete,
      page: page,
      titreSeo: titreSeo,
      descriptionSeo: descriptionSeo,
      fichier: fichier
    };
  }

  global.LeconVue = { creer: creer, tronquer: tronquer };
})(typeof window !== "undefined" ? window : this);
