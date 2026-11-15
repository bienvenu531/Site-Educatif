/* ==========================================================================
   SepsHaness — page « Bibliothèque »
   Grille de documents, filtres, lecteur en modale (Markdown), actions
   copier / télécharger / imprimer et suivi des lectures.
   Données : APP_DATA ; lectures : Store.
   ========================================================================== */
(function () {
  "use strict";

  var etat = { recherche: "", type: "", matiere: "" };
  var elements = {};
  var minuteurRecherche = null;
  var rafraichissement = null;

  function qs(selecteur) {
    return App.qs(selecteur);
  }

  function accorder(nombre, singulier, pluriel) {
    return nombre === 1 ? singulier : pluriel;
  }

  function puceHtml(nomIcone, texte) {
    return '<span class="puce">' + App.icon(nomIcone, { taille: 14 }) + App.escape(texte) + "</span>";
  }

  /* ---------------------------------------------------------------------
     Filtres
     --------------------------------------------------------------------- */
  function boutonsType() {
    var morceaux = ['<button class="puce-filtre" type="button" data-type="" aria-pressed="true">Tous</button>'];
    APP_DATA.typesDocument.forEach(function (type) {
      morceaux.push(
        '<button class="puce-filtre" type="button" data-type="' +
          App.escape(type.id) +
          '" aria-pressed="false">' +
          App.escape(type.nom) +
          "</button>"
      );
    });
    elements.filtresType.innerHTML = morceaux.join("");
  }

  function boutonsMatiere() {
    var morceaux = ['<button class="puce-filtre" type="button" data-matiere="" aria-pressed="true">Toutes</button>'];
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
    App.qsa("[data-type]", elements.filtresType).forEach(function (bouton) {
      var actif = (bouton.getAttribute("data-type") || "") === etat.type;
      bouton.setAttribute("aria-pressed", actif ? "true" : "false");
    });
    App.qsa("[data-matiere]", elements.filtresMatiere).forEach(function (bouton) {
      var actif = (bouton.getAttribute("data-matiere") || "") === etat.matiere;
      bouton.setAttribute("aria-pressed", actif ? "true" : "false");
    });
  }

  function majResume() {
    if (!elements.resume) return;
    var morceaux = [];
    if (etat.recherche.trim()) morceaux.push("« " + etat.recherche.trim() + " »");
    if (etat.type) morceaux.push(APP_DATA.typeDocument(etat.type).nom);
    if (etat.matiere) morceaux.push(APP_DATA.matiere(etat.matiere).nom);
    elements.resume.textContent = morceaux.length
      ? "Filtres actifs : " + morceaux.join(" · ")
      : "Aucun filtre actif : tous les documents de la bibliothèque sont affichés.";
  }

  function filtrer() {
    var liste = APP_DATA.rechercherDocuments(etat.recherche).filter(function (doc) {
      if (etat.type && doc.type !== etat.type) return false;
      if (etat.matiere && doc.matiere !== etat.matiere) return false;
      return true;
    });
    liste.sort(function (a, b) {
      var dateA = String(a.maj || "");
      var dateB = String(b.maj || "");
      if (dateA !== dateB) return dateB.localeCompare(dateA);
      return String(a.titre || "").localeCompare(String(b.titre || ""), "fr");
    });
    return liste;
  }

  function majCompteurs(total, liste) {
    var lus = APP_DATA.documents.filter(function (doc) {
      return Store.documentLu(doc.id);
    }).length;

    if (elements.compteurEntete) {
      elements.compteurEntete.textContent = total
        ? total +
          " " +
          accorder(total, "document", "documents") +
          " · " +
          lus +
          " " +
          accorder(lus, "lu", "lus")
        : "Aucun document pour le moment";
    }

    if (!elements.compteResultats) return;
    if (!total) {
      elements.compteResultats.textContent = "La bibliothèque ne contient aucun document pour l'instant.";
    } else if (!liste.length) {
      elements.compteResultats.textContent = "Aucun document ne correspond aux filtres sélectionnés.";
    } else if (liste.length === total) {
      elements.compteResultats.textContent =
        total + " " + accorder(total, "document disponible", "documents disponibles") + ".";
    } else {
      elements.compteResultats.textContent =
        liste.length +
        " " +
        accorder(liste.length, "document", "documents") +
        " sur " +
        total +
        " correspondent à votre recherche.";
    }
  }

  /* ---------------------------------------------------------------------
     Cartes de documents
     --------------------------------------------------------------------- */
  function carteDocument(doc) {
    var type = APP_DATA.typeDocument(doc.type);
    var matiere = APP_DATA.matiere(doc.matiere);
    var niveau = APP_DATA.niveau(doc.niveau);
    var pages = Number(doc.pages) || 0;
    var lu = Store.documentLu(doc.id);

    var identite = [matiere.nom, niveau.nom, doc.classe].filter(Boolean).join(" · ");

    var indicateurLu = lu
      ? '<span class="cat-doc__lu">' + App.icon("check", { taille: 13 }) + "<span>Lu</span></span>"
      : "";

    var pucePages = pages
      ? puceHtml("document", pages + " " + accorder(pages, "page", "pages"))
      : "";

    return (
      '<article class="cat-doc" data-teinte="' +
      App.escape(type.teinte) +
      '" data-doc="' +
      App.escape(doc.id) +
      '">' +
      '<div class="cat-doc__haut">' +
      '<span class="cat-doc__icone" aria-hidden="true">' +
      App.icon(type.icone, { taille: 22 }) +
      "</span>" +
      '<div class="cat-doc__badges">' +
      '<span class="cat-doc__type">' +
      App.escape(type.nom) +
      "</span>" +
      indicateurLu +
      "</div>" +
      "</div>" +
      '<h3 class="cat-doc__titre">' +
      '<button class="cat-doc__ouvrir" type="button" data-doc-ouvrir="' +
      App.escape(doc.id) +
      '">' +
      App.escape(doc.titre) +
      "</button>" +
      "</h3>" +
      '<p class="cat-doc__texte">' +
      App.escape(doc.description || "") +
      "</p>" +
      '<div class="cat-doc__meta">' +
      puceHtml(matiere.icone, identite) +
      pucePages +
      "</div>" +
      '<div class="cat-doc__pied">' +
      '<span class="cat-doc__maj">' +
      App.icon("calendrier", { taille: 13 }) +
      " Mis à jour le " +
      App.escape(App.date(doc.maj)) +
      "</span>" +
      '<button class="btn btn--secondaire btn--sm" type="button" data-doc-ouvrir="' +
      App.escape(doc.id) +
      '">' +
      App.icon("lecteur", { taille: 14 }) +
      " Consulter</button>" +
      "</div>" +
      "</article>"
    );
  }

  function rendreDocuments() {
    if (!elements.resultats) return;
    var total = APP_DATA.documents.length;
    var liste = filtrer();
    var grille = elements.resultats;
    grille.classList.toggle("cat-resultats--vide", liste.length === 0);

    if (!total) {
      grille.innerHTML = App.vide("La bibliothèque est en cours de préparation", {
        icone: "bibliotheque",
        texte: "Fiches, méthodes, formulaires, annales et cartes mentales seront publiés ici prochainement. En attendant, explorez le catalogue des cours.",
        action: { href: "cours.html", libelle: "Explorer les cours" }
      });
    } else if (!liste.length) {
      grille.innerHTML =
        '<div class="etat-vide">' +
        '<div class="etat-vide__icone" aria-hidden="true">' +
        App.icon("recherche", { taille: 30 }) +
        "</div>" +
        '<p class="etat-vide__titre">Aucun document ne correspond</p>' +
        '<p class="etat-vide__texte">Essayez un autre mot-clé ou changez de type de document ou de matière.</p>' +
        '<button class="btn btn--secondaire" type="button" id="cat-vider-filtres">Effacer les filtres</button>' +
        "</div>";
      var boutonVider = qs("#cat-vider-filtres");
      if (boutonVider) boutonVider.addEventListener("click", reinitialiser);
    } else {
      grille.innerHTML = liste.map(carteDocument).join("");
      App.iconeDans(grille);
    }

    majCompteurs(total, liste);
  }

  /* ---------------------------------------------------------------------
     Lecteur (modale)
     --------------------------------------------------------------------- */
  function creerBouton(libelle, nomIcone, action) {
    var bouton = App.el("button", { class: "btn btn--secondaire btn--sm", type: "button" });
    bouton.innerHTML = App.icon(nomIcone, { taille: 16 }) + "<span>" + App.escape(libelle) + "</span>";
    bouton.addEventListener("click", action);
    return bouton;
  }

  function construireLecteur(doc) {
    var type = APP_DATA.typeDocument(doc.type);
    var matiere = APP_DATA.matiere(doc.matiere);
    var niveau = APP_DATA.niveau(doc.niveau);
    var pages = Number(doc.pages) || 0;

    var conteneur = App.el("div", { class: "cat-lecteur" });

    var entete = App.el("div", { class: "cat-lecteur__entete" });
    var etiquetteType = App.el("span", { class: "cat-etiquette-type", "data-teinte": type.teinte });
    etiquetteType.innerHTML = App.icon(type.icone, { taille: 15 }) + "<span>" + App.escape(type.nom) + "</span>";
    entete.appendChild(etiquetteType);

    var indicateurLu = App.el("span", { class: "etiquette etiquette--succes" });
    indicateurLu.innerHTML = App.icon("check", { taille: 13 }) + " Lu";
    entete.appendChild(indicateurLu);
    conteneur.appendChild(entete);

    var meta = App.el("div", { class: "cat-lecteur__meta" });
    var morceauxMeta = [puceHtml(matiere.icone, matiere.nom)];
    morceauxMeta.push(puceHtml(niveau.icone, [niveau.nom, doc.classe].filter(Boolean).join(" · ")));
    if (pages) morceauxMeta.push(puceHtml("document", pages + " " + accorder(pages, "page", "pages")));
    if (doc.maj) morceauxMeta.push(puceHtml("calendrier", "Mis à jour le " + App.date(doc.maj)));
    if (doc.auteur) morceauxMeta.push(puceHtml("utilisateur", doc.auteur));
    meta.innerHTML = morceauxMeta.join("");
    conteneur.appendChild(meta);

    if (doc.description) {
      conteneur.appendChild(App.el("p", { class: "cat-lecteur__description", text: doc.description }));
    }

    var actions = App.el("div", { class: "cat-lecteur__actions" });
    actions.appendChild(
      creerBouton("Copier le Markdown", "document", function () {
        copierMarkdown(doc);
      })
    );
    actions.appendChild(
      creerBouton("Télécharger .md", "telecharger", function () {
        telecharger(doc);
      })
    );
    actions.appendChild(creerBouton("Imprimer", "imprimer", imprimerDocument));
    conteneur.appendChild(actions);

    var corps = App.el("div", { class: "contenu-riche" });
    if (doc.contenu && String(doc.contenu).trim()) {
      corps.innerHTML = App.md(doc.contenu);
    } else {
      corps.innerHTML = '<p class="texte-doux">Le contenu de ce document est en cours de rédaction. Revenez bientôt pour le lire.</p>';
    }
    conteneur.appendChild(corps);

    return conteneur;
  }

  function ouvrirDocument(id) {
    var doc = APP_DATA.getDocument(id);
    if (!doc) {
      App.toast("Ce document est introuvable. Il a peut-être été renommé.", { type: "info" });
      return;
    }

    Store.marquerDocumentLu(doc.id);
    var contenu = construireLecteur(doc);
    App.modal({
      titre: doc.titre,
      contenu: contenu,
      taille: "lg",
      actions: [{ libelle: "Fermer", type: "secondaire" }]
    });
    App.iconeDans(contenu);
  }

  function copierMarkdown(doc) {
    if (!doc.contenu || !String(doc.contenu).trim()) {
      App.toast("Ce document n'a pas encore de contenu à copier.", { type: "info" });
      return;
    }
    App.copier(doc.contenu).then(function (reussi) {
      App.toast(
        reussi ? "Le Markdown du document est dans le presse-papiers." : "La copie n'est pas disponible dans ce navigateur.",
        { type: reussi ? "succes" : "erreur" }
      );
    });
  }

  function telecharger(doc) {
    if (!doc.contenu || !String(doc.contenu).trim()) {
      App.toast("Ce document n'a pas encore de contenu à télécharger.", { type: "info" });
      return;
    }
    try {
      var blob = new Blob([doc.contenu], { type: "text/markdown;charset=utf-8" });
      var url = URL.createObjectURL(blob);
      var lien = document.createElement("a");
      lien.href = url;
      lien.download = (doc.id || "document") + ".md";
      document.body.appendChild(lien);
      lien.click();
      document.body.removeChild(lien);
      window.setTimeout(function () {
        URL.revokeObjectURL(url);
      }, 1500);
      App.toast("Le fichier Markdown a été téléchargé.", { type: "succes" });
    } catch (erreur) {
      App.toast("Le téléchargement n'a pas pu démarrer.", { type: "erreur" });
    }
  }

  function imprimerDocument() {
    document.body.classList.add("cat--impression");
    var retire = false;
    function retirerClasse() {
      if (retire) return;
      retire = true;
      document.body.classList.remove("cat--impression");
      window.removeEventListener("afterprint", retirerClasse);
    }
    window.addEventListener("afterprint", retirerClasse);
    try {
      window.print();
    } catch (erreur) {
      /* impression indisponible : on retire simplement la classe */
    }
    window.setTimeout(retirerClasse, 3000);
  }

  /* ---------------------------------------------------------------------
     Aide
     --------------------------------------------------------------------- */
  function ouvrirAide() {
    App.modal({
      titre: "Comment fonctionne la bibliothèque",
      contenu:
        '<div class="pile cat-aide">' +
        '<p class="plomb">Tous les documents se lisent directement ici, sans quitter le site. Aucun fichier n\'est envoyé sur Internet.</p>' +
        "<ul>" +
        "<li><strong>Filtrer :</strong> cherchez par mot-clé, choisissez un type de document (fiche, méthode, formulaire, annale, carte mentale, protocole) et une matière.</li>" +
        "<li><strong>Consulter :</strong> ouvrez un document dans le lecteur intégré. Il est automatiquement marqué comme lu.</li>" +
        "<li><strong>Copier ou télécharger :</strong> récupérez le texte Markdown pour l'ajouter à vos notes ou le garder hors ligne.</li>" +
        "<li><strong>Imprimer :</strong> seul le document est imprimé, sans le menu ni les boutons.</li>" +
        "</ul>" +
        '<p class="petit texte-faible">Les documents marqués comme lus sont enregistrés uniquement dans votre navigateur.</p>' +
        "</div>",
      actions: [{ libelle: "J'ai compris", type: "primaire" }]
    });
  }

  /* ---------------------------------------------------------------------
     Paramètres, réinitialisation, événements
     --------------------------------------------------------------------- */
  function lireParametres() {
    var q = App.param("q");
    if (q) {
      etat.recherche = q;
      elements.recherche.value = q;
    }

    var type = App.param("type");
    if (
      type &&
      APP_DATA.typesDocument.some(function (element) {
        return element.id === type;
      })
    ) {
      etat.type = type;
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
  }

  function reinitialiser() {
    etat = { recherche: "", type: "", matiere: "" };
    if (minuteurRecherche) {
      window.clearTimeout(minuteurRecherche);
      minuteurRecherche = null;
    }
    elements.recherche.value = "";
    majBoutons();
    majResume();
    rendreDocuments();
    elements.recherche.focus();
  }

  function brancherEvenements() {
    elements.filtresType.addEventListener("click", function (evenement) {
      var bouton = evenement.target.closest("[data-type]");
      if (!bouton) return;
      etat.type = bouton.getAttribute("data-type") || "";
      majBoutons();
      majResume();
      rendreDocuments();
    });

    elements.filtresMatiere.addEventListener("click", function (evenement) {
      var bouton = evenement.target.closest("[data-matiere]");
      if (!bouton) return;
      etat.matiere = bouton.getAttribute("data-matiere") || "";
      majBoutons();
      majResume();
      rendreDocuments();
    });

    elements.recherche.addEventListener("input", function (evenement) {
      etat.recherche = evenement.target.value;
      if (minuteurRecherche) window.clearTimeout(minuteurRecherche);
      minuteurRecherche = window.setTimeout(function () {
        minuteurRecherche = null;
        majResume();
        rendreDocuments();
      }, 120);
    });

    elements.reinitialiser.addEventListener("click", reinitialiser);

    if (elements.aide) elements.aide.addEventListener("click", ouvrirAide);

    elements.resultats.addEventListener("click", function (evenement) {
      var bouton = evenement.target.closest("[data-doc-ouvrir]");
      if (bouton) {
        ouvrirDocument(bouton.getAttribute("data-doc-ouvrir"));
        return;
      }
      var carte = evenement.target.closest(".cat-doc");
      if (!carte) return;
      if (evenement.target.closest("a, button")) return;
      ouvrirDocument(carte.getAttribute("data-doc"));
    });
  }

  function surveillerFermeture() {
    if (!window.MutationObserver || !document.body) return;
    var observateur = new MutationObserver(function () {
      if (document.querySelector(".modale-voile")) return;
      if (rafraichissement) return;
      rafraichissement = window.setTimeout(function () {
        rafraichissement = null;
        rendreDocuments();
      }, 50);
    });
    observateur.observe(document.body, { childList: true });
  }

  /* ---------------------------------------------------------------------
     Initialisation
     --------------------------------------------------------------------- */
  function initialiser() {
    if (!window.App || !window.APP_DATA || !window.Store) return;

    elements = {
      compteurEntete: qs("#cat-compteur-doc-texte"),
      compteResultats: qs("#cat-compte-resultats"),
      resume: qs("#cat-resume-filtres"),
      recherche: qs("#cat-recherche"),
      filtresType: qs("#cat-filtres-type"),
      filtresMatiere: qs("#cat-filtres-matiere"),
      reinitialiser: qs("#cat-reinitialiser"),
      aide: qs("#cat-comment-ca-marche"),
      resultats: qs("#cat-resultats")
    };

    if (!elements.recherche || !elements.filtresType || !elements.filtresMatiere || !elements.resultats) {
      return;
    }

    boutonsType();
    boutonsMatiere();
    lireParametres();
    majBoutons();
    majResume();
    rendreDocuments();
    brancherEvenements();
    surveillerFermeture();

    var doc = App.param("doc");
    if (doc) ouvrirDocument(doc);
  }

  App.onReady(initialiser);
})();
