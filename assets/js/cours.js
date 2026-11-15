/* ==========================================================================
   SepsHaness — page « Cours »
   Catalogue, recherche instantanée, filtres (niveau, matière), tri.
   Données : APP_DATA (data.js) ; progression : Store (store.js).
   ========================================================================== */
(function () {
  "use strict";

  var TRIS = ["pertinence", "duree", "titre", "niveau"];
  var NOMS_TRI = {
    pertinence: "Pertinence",
    duree: "Durée croissante",
    titre: "Titre A → Z",
    niveau: "Niveau"
  };
  var etat = { recherche: "", niveau: "", matiere: "", tri: "pertinence" };
  var minuteurRecherche = null;
  var elements = {};

  /* ---------------------------------------------------------------------
     Outils
     --------------------------------------------------------------------- */
  function qs(selecteur) {
    return App.qs(selecteur);
  }

  function normaliser(texte) {
    return String(texte == null ? "" : texte)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function estActif() {
    return !!(etat.recherche.trim() || etat.niveau || etat.matiere || etat.tri !== "pertinence");
  }

  function correspond(cours, mots) {
    if (!mots.length) return true;
    var champs = normaliser(
      [
        cours.titre,
        cours.resume,
        cours.classe,
        APP_DATA.matiere(cours.matiere).nom,
        APP_DATA.niveau(cours.niveau).nom,
        (cours.tags || []).join(" ")
      ].join(" ")
    );
    return mots.every(function (mot) {
      return champs.indexOf(mot) !== -1;
    });
  }

  function trier(liste) {
    var copie = liste.slice();
    if (etat.tri === "duree") {
      copie.sort(function (a, b) {
        return (Number(a.duree) || 0) - (Number(b.duree) || 0) || String(a.titre).localeCompare(String(b.titre), "fr");
      });
    } else if (etat.tri === "titre") {
      copie.sort(function (a, b) {
        return String(a.titre).localeCompare(String(b.titre), "fr");
      });
    } else if (etat.tri === "niveau") {
      copie.sort(function (a, b) {
        var ordreA = APP_DATA.ordreNiveaux[a.niveau];
        var ordreB = APP_DATA.ordreNiveaux[b.niveau];
        if (ordreA === undefined) ordreA = 99;
        if (ordreB === undefined) ordreB = 99;
        return ordreA - ordreB || String(a.titre).localeCompare(String(b.titre), "fr");
      });
    }
    return copie;
  }

  function filtrer() {
    var mots = normaliser(etat.recherche).trim().split(/\s+/).filter(Boolean);
    var liste = APP_DATA.cours.filter(function (cours) {
      if (etat.niveau && cours.niveau !== etat.niveau) return false;
      if (etat.matiere && cours.matiere !== etat.matiere) return false;
      return correspond(cours, mots);
    });
    return trier(liste);
  }

  /* ---------------------------------------------------------------------
     Barre de filtres
     --------------------------------------------------------------------- */
  function boutonsNiveau() {
    var morceaux = [
      '<button class="puce-filtre" type="button" data-niveau="" aria-pressed="true">Tous</button>'
    ];
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

  function boutonsMatiere() {
    var morceaux = [
      '<button class="puce-filtre" type="button" data-matiere="" aria-pressed="true">Toutes</button>'
    ];
    APP_DATA.matieres.forEach(function (matiere) {
      morceaux.push(
        '<button class="puce-filtre" type="button" data-matiere="' +
          App.escape(matiere.id) +
          '" aria-pressed="false">' +
          App.escape(matiere.nom) +
          "</button>"
      );
    });
    elements.filtresMatiere.innerHTML = morceaux.join("");
  }

  function majBoutons() {
    App.qsa("[data-niveau]", elements.filtresNiveau).forEach(function (bouton) {
      bouton.setAttribute("aria-pressed", (bouton.getAttribute("data-niveau") || "") === etat.niveau ? "true" : "false");
    });
    App.qsa("[data-matiere]", elements.filtresMatiere).forEach(function (bouton) {
      bouton.setAttribute("aria-pressed", (bouton.getAttribute("data-matiere") || "") === etat.matiere ? "true" : "false");
    });
  }

  function majResume() {
    if (!elements.resume) return;
    var morceaux = [];
    if (etat.recherche.trim()) morceaux.push("« " + etat.recherche.trim() + " »");
    if (etat.niveau) morceaux.push("niveau " + APP_DATA.niveau(etat.niveau).nom);
    if (etat.matiere) morceaux.push("matière " + APP_DATA.matiere(etat.matiere).nom);
    if (etat.tri !== "pertinence") morceaux.push("tri : " + NOMS_TRI[etat.tri]);
    elements.resume.textContent = morceaux.length
      ? "Filtres actifs : " + morceaux.join(" · ")
      : "Aucun filtre actif : tous les cours du catalogue sont affichés.";
  }

  function majCompteurs(total, liste) {
    var texteEntete;
    if (!total) texteEntete = "Aucun cours pour le moment";
    else if (total === 1) texteEntete = "1 cours au catalogue";
    else texteEntete = total + " cours au catalogue";
    if (elements.compteurEntete) elements.compteurEntete.textContent = texteEntete;

    if (!elements.compteResultats) return;
    if (!total) {
      elements.compteResultats.textContent = "Le catalogue ne contient aucun cours pour l'instant.";
    } else if (!liste.length) {
      elements.compteResultats.textContent = "Aucun cours ne correspond aux filtres sélectionnés.";
    } else if (liste.length === total) {
      elements.compteResultats.textContent = total + " cours disponibles, tous niveaux confondus.";
    } else {
      elements.compteResultats.textContent =
        liste.length + " cours sur " + total + " correspondent à votre recherche.";
    }
  }

  /* ---------------------------------------------------------------------
     Bandeau « Reprendre »
     --------------------------------------------------------------------- */
  function rendreReprendre() {
    var zone = elements.zoneReprendre;
    var contenu = elements.zoneReprendreContenu;
    if (!zone || !contenu) return;

    var recommande = Store.coursRecommande();
    var cours = recommande || APP_DATA.cours[0] || null;
    if (!cours) {
      zone.hidden = true;
      contenu.innerHTML = "";
      return;
    }

    var matiere = APP_DATA.matiere(cours.matiere);
    var niveau = APP_DATA.niveau(cours.niveau);
    var lecon = Store.lecon(cours.slug);
    var etiquette;
    if (lecon.statut === "termine") {
      etiquette = '<span class="etiquette etiquette--succes">' + App.icon("check", { taille: 13 }) + " Terminé</span>";
    } else if (lecon.statut === "en-cours") {
      etiquette = '<span class="etiquette etiquette--info">En cours</span>';
    } else {
      etiquette = '<span class="etiquette etiquette--neutre">À découvrir</span>';
    }

    var libelle = recommande ? "Reprendre ce cours" : "Revoir ce cours";
    var surtitre;
    var intro;
    if (!recommande) {
      surtitre = "Tout le catalogue est terminé, bravo";
      intro =
        "Vous avez terminé tous les cours du catalogue. Revoir un cours consolide durablement les acquis.";
    } else if (lecon.statut === "en-cours") {
      surtitre = "Reprendre où vous en étiez";
      intro =
        "Vous n'avez pas encore terminé ce cours : reprenez la leçon exactement là où vous l'avez laissée.";
    } else {
      surtitre = "Une suggestion pour commencer";
      intro =
        "Ce cours correspond à votre niveau. Lisez les objectifs, avancez section par section et vérifiez vos acquis avec le quiz : votre progression est enregistrée automatiquement.";
    }

    contenu.innerHTML =
      '<div class="cat-reprendre" data-teinte="' +
      App.escape(matiere.teinte) +
      '">' +
      '<span class="cat-reprendre__icone" aria-hidden="true">' +
      App.icon(matiere.icone, { taille: 26 }) +
      "</span>" +
      '<div class="cat-reprendre__corps">' +
      '<p class="surtitre">' +
      App.escape(surtitre) +
      "</p>" +
      '<h2 class="cat-reprendre__titre" id="cat-reprendre-titre">' +
      '<a href="' +
      App.lienCours(cours.slug) +
      '">' +
      App.escape(cours.titre) +
      "</a></h2>" +
      '<p class="cat-reprendre__texte">' +
      App.escape(cours.resume || "") +
      "</p>" +
      '<div class="rangee cat-reprendre__meta">' +
      etiquette +
      '<span class="puce">' +
      App.icon("livre", { taille: 14 }) +
      App.escape(niveau.nom) +
      "</span>" +
      '<span class="puce">' +
      App.icon("horloge", { taille: 14 }) +
      App.escape(App.duree(cours.duree)) +
      "</span>" +
      '<span class="puce">' +
      App.icon(matiere.icone, { taille: 14 }) +
      App.escape(matiere.nom) +
      "</span>" +
      "</div>" +
      '<p class="cat-reprendre__note petit texte-faible">' +
      App.escape(intro) +
      "</p>" +
      "</div>" +
      '<div class="cat-reprendre__action">' +
      '<a class="btn btn--primaire" href="' +
      App.lienCours(cours.slug) +
      '">' +
      App.icon("play", { taille: 16 }) +
      " " +
      App.escape(libelle) +
      "</a>" +
      "</div>" +
      "</div>";

    zone.hidden = false;
  }

  /* ---------------------------------------------------------------------
     Résultats
     --------------------------------------------------------------------- */
  function brancherCartes(grille) {
    App.qsa(".carte-cours", grille).forEach(function (carte) {
      var lien = carte.querySelector(".carte-cours__titre a");
      if (!lien) return;
      carte.classList.add("cat-carte-cliquable");
      carte.addEventListener("click", function (evenement) {
        if (evenement.target.closest("a, button")) return;
        var selection = window.getSelection ? String(window.getSelection()) : "";
        if (selection) return;
        window.location.href = lien.getAttribute("href");
      });
    });
  }

  function afficherResultats() {
    if (!elements.resultats) return;
    var total = APP_DATA.cours.length;
    var liste = filtrer();
    var grille = elements.resultats;
    grille.classList.toggle("cat-resultats--vide", liste.length === 0);

    if (!total) {
      grille.innerHTML = App.vide("Le catalogue se prépare", {
        icone: "livre",
        texte: "Les cours seront publiés ici très bientôt. En attendant, la bibliothèque et les parcours restent accessibles.",
        action: { href: "bibliotheque.html", libelle: "Ouvrir la bibliothèque" }
      });
    } else if (!liste.length) {
      grille.innerHTML =
        '<div class="etat-vide">' +
        '<div class="etat-vide__icone" aria-hidden="true">' +
        App.icon("recherche", { taille: 30 }) +
        "</div>" +
        '<p class="etat-vide__titre">Aucun cours ne correspond</p>' +
        '<p class="etat-vide__texte">Essayez un autre mot-clé, changez de niveau ou élargissez la matière sélectionnée.</p>' +
        '<button class="btn btn--secondaire" type="button" id="cat-vider-filtres">Effacer les filtres</button>' +
        "</div>";
      var boutonVider = qs("#cat-vider-filtres");
      if (boutonVider) boutonVider.addEventListener("click", reinitialiser);
    } else {
      grille.innerHTML = liste
        .map(function (cours) {
          return App.carteCours(cours);
        })
        .join("");
      App.iconeDans(grille);
      brancherCartes(grille);
    }

    majCompteurs(total, liste);
  }

  /* ---------------------------------------------------------------------
     Paramètres d'URL et réinitialisation
     --------------------------------------------------------------------- */
  function lireParametres() {
    var q = App.param("q");
    if (q) {
      etat.recherche = q;
      elements.recherche.value = q;
    }

    var niveau = App.param("niveau");
    if (
      niveau &&
      APP_DATA.niveaux.some(function (element) {
        return element.id === niveau;
      })
    ) {
      etat.niveau = niveau;
    }

    var matiere = App.param("matiere");
    if (
      matiere &&
      APP_DATA.matieres.some(function (element) {
        return element.id === matiere;
      })
    ) {
      etat.matiere = matiere;
    }

    var tri = App.param("tri");
    if (TRIS.indexOf(tri) !== -1) {
      etat.tri = tri;
      elements.tri.value = tri;
    }
  }

  function reinitialiser() {
    etat = { recherche: "", niveau: "", matiere: "", tri: "pertinence" };
    if (minuteurRecherche) {
      window.clearTimeout(minuteurRecherche);
      minuteurRecherche = null;
    }
    elements.recherche.value = "";
    elements.tri.value = "pertinence";
    majBoutons();
    majResume();
    afficherResultats();
    elements.recherche.focus();
  }

  /* ---------------------------------------------------------------------
     Événements
     --------------------------------------------------------------------- */
  function brancherEvenements() {
    elements.filtresNiveau.addEventListener("click", function (evenement) {
      var bouton = evenement.target.closest("[data-niveau]");
      if (!bouton) return;
      etat.niveau = bouton.getAttribute("data-niveau") || "";
      majBoutons();
      majResume();
      afficherResultats();
    });

    elements.filtresMatiere.addEventListener("click", function (evenement) {
      var bouton = evenement.target.closest("[data-matiere]");
      if (!bouton) return;
      etat.matiere = bouton.getAttribute("data-matiere") || "";
      majBoutons();
      majResume();
      afficherResultats();
    });

    elements.recherche.addEventListener("input", function (evenement) {
      etat.recherche = evenement.target.value;
      if (minuteurRecherche) window.clearTimeout(minuteurRecherche);
      minuteurRecherche = window.setTimeout(function () {
        minuteurRecherche = null;
        majResume();
        afficherResultats();
      }, 120);
    });

    elements.tri.addEventListener("change", function (evenement) {
      var tri = evenement.target.value;
      etat.tri = TRIS.indexOf(tri) !== -1 ? tri : "pertinence";
      majResume();
      afficherResultats();
    });

    elements.reinitialiser.addEventListener("click", reinitialiser);
  }

  /* ---------------------------------------------------------------------
     Initialisation
     --------------------------------------------------------------------- */
  function initialiser() {
    if (!window.App || !window.APP_DATA || !window.Store) return;

    elements = {
      compteurEntete: qs("#cat-compteur-cours-texte"),
      compteResultats: qs("#cat-compte-resultats"),
      resume: qs("#cat-resume-filtres"),
      recherche: qs("#cat-recherche"),
      tri: qs("#cat-tri"),
      filtresNiveau: qs("#cat-filtres-niveau"),
      filtresMatiere: qs("#cat-filtres-matiere"),
      reinitialiser: qs("#cat-reinitialiser"),
      resultats: qs("#cat-resultats"),
      zoneReprendre: qs("#cat-reprendre"),
      zoneReprendreContenu: qs("#cat-reprendre-contenu")
    };

    if (!elements.recherche || !elements.tri || !elements.filtresNiveau || !elements.filtresMatiere || !elements.resultats) {
      return;
    }

    boutonsNiveau();
    boutonsMatiere();
    lireParametres();
    majBoutons();
    majResume();
    rendreReprendre();
    afficherResultats();
    brancherEvenements();
  }

  App.onReady(initialiser);
})();
