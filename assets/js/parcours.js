/* ==========================================================================
   SepsHaness — page « Parcours »
   Parcours guidés, filtre par niveau, présentation des niveaux et matières.
   Données : APP_DATA ; progression : Store.
   ========================================================================== */
(function () {
  "use strict";

  var etat = { niveau: "" };
  var elements = {};

  function qs(selecteur) {
    return App.qs(selecteur);
  }

  function accorder(nombre, singulier, pluriel) {
    return nombre === 1 ? singulier : pluriel;
  }

  /* ---------------------------------------------------------------------
     Filtre par niveau
     --------------------------------------------------------------------- */
  function preparerFiltres() {
    var morceaux = ['<button class="puce-filtre" type="button" data-niveau="" aria-pressed="true">Tous</button>'];
    APP_DATA.niveaux.forEach(function (niveau) {
      morceaux.push(
        '<button class="puce-filtre" type="button" data-niveau="' +
          App.escape(niveau.id) +
          '" aria-pressed="false">' +
          App.escape(niveau.nom) +
          "</button>"
      );
    });
    elements.filtresNiveau.innerHTML = morceaux.join("");
  }

  function majBoutons() {
    App.qsa("[data-niveau]", elements.filtresNiveau).forEach(function (bouton) {
      var actif = (bouton.getAttribute("data-niveau") || "") === etat.niveau;
      bouton.setAttribute("aria-pressed", actif ? "true" : "false");
    });
  }

  /* ---------------------------------------------------------------------
     Parcours guidés
     --------------------------------------------------------------------- */
  function carteEtape(cours, index) {
    var fait = Store.estTermine(cours.slug);
    var matiere = APP_DATA.matiere(cours.matiere);
    return (
      '<li class="cat-etape' +
      (fait ? " cat-etape--terminee" : "") +
      '">' +
      '<span class="cat-etape__num" aria-hidden="true">' +
      (index + 1) +
      "</span>" +
      '<div class="cat-etape__corps">' +
      '<a class="cat-etape__titre" href="' +
      App.lienCours(cours.slug) +
      '">' +
      App.escape(cours.titre) +
      "</a>" +
      '<span class="cat-etape__meta">' +
      App.escape(matiere.nom) +
      " · " +
      App.escape(App.duree(cours.duree)) +
      "</span>" +
      "</div>" +
      (fait
        ? '<span class="cat-etape__statut" aria-hidden="true">' + App.icon("check", { taille: 15 }) + "</span>" +
          '<span class="sr-only">Étape terminée</span>'
        : "") +
      "</li>"
    );
  }

  function carteParcours(parcours) {
    var niveau = APP_DATA.niveau(parcours.niveau);
    var teinte = parcours.teinte || niveau.teinte || "indigo";
    var progression = Store.progressionParcours(
      parcours.etapes.map(function (etape) {
        return etape.slug;
      })
    );
    var termine = progression.total > 0 && progression.termines === progression.total;

    var prochaine = null;
    parcours.etapes.some(function (etape) {
      if (!Store.estTermine(etape.slug)) {
        prochaine = etape;
        return true;
      }
      return false;
    });
    if (!prochaine) prochaine = parcours.etapes[0] || null;

    var libelle = "Commencer";
    if (termine) libelle = "Revoir le parcours";
    else if (progression.termines > 0) libelle = "Continuer";

    var duree = parcours.dureeTotale ? App.duree(parcours.dureeTotale) : parcours.duree || "Durée à venir";

    var etapes;
    if (!parcours.etapes.length) {
      etapes = '<li class="cat-etape cat-etape--vide">Les leçons de ce parcours seront publiées prochainement.</li>';
    } else {
      etapes = parcours.etapes.map(carteEtape).join("");
    }

    var jauge = "";
    if (progression.total > 0) {
      jauge =
        '<div class="cat-jauge">' +
        '<div class="rangee rangee--entre">' +
        '<span class="micro texte-doux">Progression</span>' +
        '<span class="micro texte-doux">' +
        progression.termines +
        " / " +
        progression.total +
        " étapes · " +
        App.pourcentage(progression.pourcentage) +
        "</span>" +
        "</div>" +
        '<div class="jauge jauge--fine" role="progressbar" aria-label="Progression du parcours ' +
        App.escape(parcours.titre) +
        '" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' +
        progression.pourcentage +
        '" aria-valuetext="' +
        progression.termines +
        " étapes terminées sur " +
        progression.total +
        '">' +
        '<span class="jauge__remplissage" style="width:' +
        progression.pourcentage +
        '%"></span>' +
        "</div>" +
        "</div>";
    }

    var action = prochaine
      ? '<a class="btn btn--primaire btn--sm" href="' +
        App.lienCours(prochaine.slug) +
        '">' +
        App.icon("play", { taille: 15 }) +
        " " +
        libelle +
        "</a>"
      : '<span class="etiquette etiquette--neutre">Bientôt disponible</span>';

    return (
      '<article class="cat-parcours" data-teinte="' +
      App.escape(teinte) +
      '">' +
      '<div class="cat-parcours__haut">' +
      '<span class="cat-parcours__icone" aria-hidden="true">' +
      App.icon(parcours.icone || niveau.icone || "parcours", { taille: 24 }) +
      "</span>" +
      '<div class="cat-parcours__etiquettes">' +
      '<span class="etiquette etiquette--neutre">' +
      App.escape(niveau.nom) +
      "</span>" +
      '<span class="puce">' +
      App.icon("horloge", { taille: 14 }) +
      App.escape(duree) +
      "</span>" +
      "</div>" +
      "</div>" +
      '<h3 class="cat-parcours__titre">' +
      App.escape(parcours.titre) +
      "</h3>" +
      '<p class="cat-parcours__texte">' +
      App.escape(parcours.description || "") +
      "</p>" +
      (parcours.pourQui
        ? '<p class="cat-parcours__pourqui">' +
          App.icon("utilisateur", { taille: 16 }) +
          "<span><strong>Pour qui :</strong> " +
          App.escape(parcours.pourQui) +
          "</span></p>"
        : "") +
      '<ol class="cat-etapes">' +
      etapes +
      "</ol>" +
      '<div class="cat-parcours__pied">' +
      jauge +
      '<div class="cat-parcours__actions">' +
      action +
      "</div>" +
      "</div>" +
      "</article>"
    );
  }

  function rendreParcours() {
    var total = APP_DATA.parcours.length;
    var liste = APP_DATA.parcoursAvecCours().filter(function (parcours) {
      return !etat.niveau || parcours.niveau === etat.niveau;
    });
    var grille = elements.parcoursListe;
    grille.classList.toggle("cat-resultats--vide", liste.length === 0);

    if (!total) {
      grille.innerHTML = App.vide("Les parcours arrivent bientôt", {
        icone: "parcours",
        texte: "Les itinéraires guidés seront publiés prochainement. En attendant, le catalogue des cours est déjà accessible.",
        action: { href: "cours.html", libelle: "Ouvrir le catalogue" }
      });
    } else if (!liste.length) {
      grille.innerHTML =
        '<div class="etat-vide">' +
        '<div class="etat-vide__icone" aria-hidden="true">' +
        App.icon("parcours", { taille: 30 }) +
        "</div>" +
        '<p class="etat-vide__titre">Aucun parcours pour ce niveau</p>' +
        '<p class="etat-vide__texte">Les parcours de ce niveau sont en préparation. Affichez tous les parcours pour découvrir les autres itinéraires.</p>' +
        '<button class="btn btn--secondaire" type="button" id="cat-vider-filtres">Afficher tous les parcours</button>' +
        "</div>";
      var boutonVider = qs("#cat-vider-filtres");
      if (boutonVider) {
        boutonVider.addEventListener("click", function () {
          etat.niveau = "";
          majBoutons();
          rendreParcours();
        });
      }
    } else {
      grille.innerHTML = liste.map(carteParcours).join("");
      App.iconeDans(grille);
    }

    if (elements.compteParcours) {
      if (!total) {
        elements.compteParcours.textContent = "";
      } else if (etat.niveau) {
        elements.compteParcours.textContent =
          liste.length +
          " " +
          accorder(liste.length, "parcours", "parcours") +
          " sur " +
          total +
          " pour le niveau " +
          APP_DATA.niveau(etat.niveau).nom +
          ".";
      } else {
        elements.compteParcours.textContent =
          total + " " + accorder(total, "parcours guidé", "parcours guidés") + " · étapes et progression incluses.";
      }
    }
  }

  /* ---------------------------------------------------------------------
     Les quatre niveaux
     --------------------------------------------------------------------- */
  function carteNiveau(niveau) {
    var matieres = APP_DATA.matieresDuNiveau(niveau.id);
    var tuiles;
    if (matieres.length) {
      tuiles = matieres
        .map(function (matiere) {
          var nombre = APP_DATA.coursDuNiveau(niveau.id).filter(function (cours) {
            return cours.matiere === matiere.id;
          }).length;
          return (
            '<a class="tuile-matiere" data-teinte="' +
            App.escape(matiere.teinte) +
            '" href="cours.html?niveau=' +
            encodeURIComponent(niveau.id) +
            "&matiere=" +
            encodeURIComponent(matiere.id) +
            '">' +
            '<span class="tuile-matiere__icone" aria-hidden="true">' +
            App.icon(matiere.icone, { taille: 19 }) +
            "</span>" +
            '<span class="cat-tuile-texte">' +
            '<span class="tuile-matiere__nom">' +
            App.escape(matiere.nom) +
            "</span>" +
            '<span class="tuile-matiere__detail">' +
            nombre +
            " cours</span>" +
            "</span>" +
            "</a>"
          );
        })
        .join("");
    } else {
      tuiles = '<p class="petit texte-faible">Les matières de ce niveau seront précisées prochainement.</p>';
    }

    var points = (niveau.points || [])
      .map(function (point) {
        return '<li>' + App.icon("check", { taille: 14 }) + "<span>" + App.escape(point) + "</span></li>";
      })
      .join("");

    return (
      '<article class="carte-niveau" data-teinte="' +
      App.escape(niveau.teinte) +
      '">' +
      '<div class="carte-niveau__haut">' +
      '<span class="carte-niveau__icone" aria-hidden="true">' +
      App.icon(niveau.icone, { taille: 24 }) +
      "</span>" +
      "<div>" +
      "<h3>" +
      App.escape(niveau.nom) +
      "</h3>" +
      '<p class="carte-niveau__detail">' +
      App.escape([niveau.detail, niveau.ages].filter(Boolean).join(" · ")) +
      "</p>" +
      "</div>" +
      "</div>" +
      '<p class="carte__texte">' +
      App.escape(niveau.description || "") +
      "</p>" +
      (points ? '<ul class="cat-points">' + points + "</ul>" : "") +
      '<div class="cat-matieres-niveau">' +
      tuiles +
      "</div>" +
      '<a class="btn btn--secondaire btn--sm cat-niveau__lien" href="cours.html?niveau=' +
      encodeURIComponent(niveau.id) +
      '">' +
      App.icon("fleche-droite", { taille: 15 }) +
      " Explorer le niveau</a>" +
      "</article>"
    );
  }

  function rendreNiveaux() {
    var grille = elements.listeNiveaux;
    if (!grille) return;
    if (!APP_DATA.niveaux.length) {
      grille.classList.add("cat-resultats--vide");
      grille.innerHTML = App.vide("Les niveaux arrivent bientôt", {
        icone: "livre",
        texte: "La présentation des quatre niveaux sera publiée prochainement."
      });
      return;
    }
    grille.innerHTML = APP_DATA.niveaux.map(carteNiveau).join("");
    App.iconeDans(grille);
  }

  /* ---------------------------------------------------------------------
     Toutes les matières
     --------------------------------------------------------------------- */
  function rendreMatieres() {
    var grille = elements.listeMatieres;
    if (!grille) return;
    if (!APP_DATA.matieres.length) {
      grille.classList.add("cat-resultats--vide");
      grille.innerHTML = App.vide("Les matières arrivent bientôt", {
        icone: "filtre",
        texte: "La liste des matières sera publiée prochainement."
      });
      return;
    }

    grille.innerHTML = APP_DATA.matieres
      .map(function (matiere) {
        var listeCours = APP_DATA.coursDeMatiere(matiere.id);
        var progression = Store.progressionMatiere(matiere.id);
        var detail = listeCours.length + " cours";
        if (progression.termines > 0) {
          detail +=
            " · " +
            progression.termines +
            " " +
            accorder(progression.termines, "terminé", "terminés");
        }
        return (
          '<a class="tuile-matiere" data-teinte="' +
          App.escape(matiere.teinte) +
          '" href="cours.html?matiere=' +
          encodeURIComponent(matiere.id) +
          '">' +
          '<span class="tuile-matiere__icone" aria-hidden="true">' +
          App.icon(matiere.icone, { taille: 20 }) +
          "</span>" +
          '<span class="cat-tuile-texte">' +
          '<span class="tuile-matiere__nom">' +
          App.escape(matiere.nom) +
          "</span>" +
          '<span class="tuile-matiere__detail">' +
          detail +
          "</span>" +
          "</span>" +
          "</a>"
        );
      })
      .join("");
  }

  /* ---------------------------------------------------------------------
     Paramètres, événements, initialisation
     --------------------------------------------------------------------- */
  function brancherEvenements() {
    elements.filtresNiveau.addEventListener("click", function (evenement) {
      var bouton = evenement.target.closest("[data-niveau]");
      if (!bouton) return;
      etat.niveau = bouton.getAttribute("data-niveau") || "";
      majBoutons();
      rendreParcours();
    });
  }

  function initialiser() {
    if (!window.App || !window.APP_DATA || !window.Store) return;

    elements = {
      filtresNiveau: qs("#cat-filtres-niveau"),
      parcoursListe: qs("#cat-parcours-liste"),
      compteParcours: qs("#cat-compte-parcours"),
      listeNiveaux: qs("#cat-liste-niveaux"),
      listeMatieres: qs("#cat-liste-matieres")
    };

    if (!elements.filtresNiveau || !elements.parcoursListe) return;

    var niveau = App.param("niveau");
    if (
      niveau &&
      APP_DATA.niveaux.some(function (element) {
        return element.id === niveau;
      })
    ) {
      etat.niveau = niveau;
    }

    preparerFiltres();
    majBoutons();
    rendreParcours();
    rendreNiveaux();
    rendreMatieres();
    brancherEvenements();
  }

  App.onReady(initialiser);
})();
