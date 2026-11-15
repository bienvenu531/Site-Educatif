/* ==========================================================================
   SepsHaness — page d'accueil
   Rendu des blocs dynamiques à partir de APP_DATA et du Store.
   ========================================================================== */
(function () {
  "use strict";

  function rendreChiffres() {
    var cible = App.qs("#accueil-chiffres");
    if (!cible || !window.APP_DATA) return;
    var compteur = APP_DATA.compter();
    var donnees = [
      { valeur: compteur.cours, libelle: "cours complets", icone: "livre", teinte: "indigo" },
      { valeur: compteur.documents, libelle: "documents à consulter", icone: "bibliotheque", teinte: "cyan" },
      { valeur: compteur.matieres, libelle: "matières couvertes", icone: "sigma", teinte: "emerald" },
      { valeur: compteur.quiz, libelle: "questions de quiz corrigées", icone: "cible", teinte: "amber" }
    ];

    cible.innerHTML = donnees
      .map(function (element) {
        return (
          '<div class="chiffre" data-teinte="' + element.teinte + '">' +
          '<span class="chiffre__icone">' + App.icon(element.icone, { taille: 20 }) + "</span>" +
          "<div><span class=\"chiffre__valeur\">" + App.nombre(element.valeur) + "</span>" +
          '<span class="chiffre__libelle">' + App.escape(element.libelle) + "</span></div>" +
          "</div>"
        );
      })
      .join("");
  }

  function rendreReprise() {
    var section = App.qs("#accueil-reprise");
    var cible = App.qs("#accueil-reprise-contenu");
    if (!section || !cible || !window.Store) return;

    var progression = Store.progressionGlobale();
    if (!progression.termines) {
      section.hidden = true;
      return;
    }

    var recommande = Store.coursRecommande();
    var minutes = Store.minutesTotales();
    var serie = Store.serie();

    section.hidden = false;
    cible.innerHTML =
      '<div class="reprise">' +
      "<div class=\"reprise__texte\">" +
      '<span class="surtitre">Bon retour</span>' +
      "<h2>" + (recommande ? App.escape(recommande.titre) : "Votre progression vous attend") + "</h2>" +
      '<div class="reprise__meta">' +
      "<span>" + progression.termines + " cours terminé" + (progression.termines > 1 ? "s" : "") + " sur " + progression.total + "</span>" +
      "<span>" + App.duree(minutes) + " d'étude enregistrées</span>" +
      "<span>" + (serie > 1 ? "Série de " + serie + " jours" : "Nouvelle série à démarrer") + "</span>" +
      "</div></div>" +
      '<div class="reprise__actions">' +
      (recommande
        ? '<a class="btn btn--primaire" href="' + App.lienCours(recommande.slug) + '">Reprendre le cours</a>'
        : "") +
      '<a class="btn btn--secondaire" href="suivi.html">Voir mon suivi</a>' +
      "</div></div>";
  }

  function rendreNiveaux() {
    var cible = App.qs("#accueil-niveaux");
    if (!cible || !window.APP_DATA) return;

    if (!APP_DATA.niveaux.length) {
      cible.innerHTML = App.vide("Les niveaux arrivent bientôt", {
        icone: "livre",
        texte: "Les contenus sont en cours de rédaction.",
        action: { href: "cours.html", libelle: "Voir le catalogue" }
      });
      return;
    }

    cible.innerHTML = APP_DATA.niveaux
      .map(function (niveau) {
        var progression = Store.progressionNiveau(niveau.id);
        var listeMatieres = APP_DATA.matieresDuNiveau(niveau.id)
          .slice(0, 4)
          .map(function (matiere) {
            return '<span class="etiquette etiquette--neutre">' + App.escape(matiere.nom) + "</span>";
          })
          .join("");

        return (
          '<article class="carte-niveau" data-teinte="' + niveau.teinte + '">' +
          '<div class="carte-niveau__haut">' +
          '<span class="carte-niveau__icone">' + App.icon(niveau.icone, { taille: 23 }) + "</span>" +
          "<div><h3>" + App.escape(niveau.nom) + "</h3>" +
          '<span class="carte-niveau__detail">' + App.escape(niveau.detail) + " · " + App.escape(niveau.ages) + "</span></div>" +
          "</div>" +
          '<p class="petit texte-doux">' + App.escape(niveau.description) + "</p>" +
          '<div class="rangee rangee--enroule" style="gap:6px">' + listeMatieres + "</div>" +
          '<div class="pile pile--serre mt-2">' +
          '<div class="jauge jauge--fine"><span class="jauge__remplissage" style="width:' + progression.pourcentage + '%"></span></div>' +
          '<div class="rangee rangee--entre"><span class="micro texte-faible">' +
          progression.termines + " / " + progression.total + " cours" +
          "</span><a class=\"micro lien-fleche\" href=\"cours.html?niveau=" + encodeURIComponent(niveau.id) + "\">Explorer " +
          App.icon("fleche-droite", { taille: 14 }) + "</a></div>" +
          "</div></article>"
        );
      })
      .join("");
  }

  function rendreCours() {
    var cible = App.qs("#accueil-cours");
    if (!cible || !window.APP_DATA) return;

    var selection = APP_DATA.niveaux
      .map(function (niveau) {
        return APP_DATA.coursDuNiveau(niveau.id)[0];
      })
      .filter(Boolean);

    if (!selection.length) {
      selection = APP_DATA.cours.slice(0, 4);
    }

    if (!selection.length) {
      cible.innerHTML = App.vide("Le catalogue se prépare", {
        icone: "livre",
        texte: "Les cours sont en cours de rédaction. Revenez dans un instant.",
        action: { href: "cours.html", libelle: "Ouvrir le catalogue" }
      });
      return;
    }

    cible.innerHTML = selection.map(function (cours) {
      return App.carteCours(cours);
    }).join("");
  }

  function rendreDocuments() {
    var cible = App.qs("#accueil-documents");
    if (!cible || !window.APP_DATA) return;

    var selection = APP_DATA.documents.slice(0, 3);
    if (!selection.length) {
      cible.innerHTML = App.vide("La bibliothèque se prépare", {
        icone: "bibliotheque",
        texte: "Les documents sont en cours de rédaction.",
        action: { href: "bibliotheque.html", libelle: "Ouvrir la bibliothèque" }
      });
      return;
    }

    cible.innerHTML = selection
      .map(function (document) {
        var type = APP_DATA.typeDocument(document.type);
        var matiere = APP_DATA.matiere(document.matiere);
        return (
          '<a class="accueil-doc" href="' + App.lienDocument(document.id) + '" data-teinte="' + type.teinte + '">' +
          '<div class="accueil-doc__haut">' +
          '<span class="accueil-doc__type">' + App.icon(type.icone, { taille: 15 }) + App.escape(type.nom) + "</span>" +
          '<span class="etiquette etiquette--neutre">' + App.escape(matiere.nom) + "</span>" +
          "</div>" +
          "<h3>" + App.escape(document.titre) + "</h3>" +
          "<p>" + App.escape(document.description) + "</p>" +
          '<div class="accueil-doc__meta">' +
          "<span>" + App.escape(APP_DATA.niveau(document.niveau).nom) + "</span>" +
          "<span>" + App.nombre(document.pages) + " page" + (document.pages > 1 ? "s" : "") + "</span>" +
          "<span>Mis à jour le " + App.date(document.maj) + "</span>" +
          "</div></a>"
        );
      })
      .join("");
  }

  function rendreTemoignages() {
    var cible = App.qs("#accueil-temoignages");
    if (!cible || !window.APP_DATA) return;

    var liste = APP_DATA.temoignages || [];
    if (!liste.length) {
      cible.parentNode.hidden = true;
      return;
    }

    cible.innerHTML = liste
      .map(function (temoignage) {
        return (
          '<figure class="temoignage" data-teinte="' + (temoignage.teinte || "indigo") + '">' +
          '<span class="temoignage__guillemet">' + App.icon("bulle", { taille: 22 }) + "</span>" +
          '<blockquote class="temoignage__texte">« ' + App.escape(temoignage.texte) + " »</blockquote>" +
          '<figcaption class="temoignage__auteur">' +
          '<span class="avatar">' + App.escape(temoignage.initiales || "?") + "</span>" +
          "<div><strong>" + App.escape(temoignage.nom) + "</strong>" +
          "<small>" + App.escape(temoignage.role) + "</small></div>" +
          "</figcaption></figure>"
        );
      })
      .join("");
  }

  App.onReady(function () {
    if (!window.APP_DATA) return;
    rendreChiffres();
    rendreReprise();
    rendreNiveaux();
    rendreCours();
    rendreDocuments();
    rendreTemoignages();
  });
})();
