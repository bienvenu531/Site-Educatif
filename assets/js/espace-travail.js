/* ==========================================================================
   SepsHaness — page Espace de travail (espace-travail.html)
   Cinq outils synchronisés par Store : notes, tâches, planning 7 jours,
   minuteur de concentration et objectifs.
   API utilisées : App, Store, APP_DATA (voir docs/CONTRAT.md).
   ========================================================================== */
(function () {
  "use strict";

  var racine = null;
  var ongletActif = "notes";
  var rechercheNotes = "";
  var noteEnCours = null;
  var creationNote = false;
  var filtreTaches = "toutes";
  var suppressionTache = null;
  var minuteur = null;

  var ONGLETS = [
    { id: "notes", libelle: "Notes", icone: "note" },
    { id: "taches", libelle: "Tâches", icone: "tache" },
    { id: "planning", libelle: "Planning", icone: "calendrier" },
    { id: "minuteur", libelle: "Minuteur", icone: "minuteur" },
    { id: "objectifs", libelle: "Objectifs", icone: "objectif" }
  ];

  var PRIORITES = [
    { id: "basse", nom: "Basse", etiquette: "etiquette--neutre", poids: 1 },
    { id: "normale", nom: "Normale", etiquette: "etiquette--info", poids: 2 },
    { id: "haute", nom: "Haute", etiquette: "etiquette--alerte", poids: 3 }
  ];

  /* ---------------------------------------------------------------------
     Helpers généraux
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

  function jourISO(valeur) {
    var date = valeur instanceof Date ? valeur : new Date(valeur);
    if (isNaN(date.getTime())) return "";
    var mois = String(date.getMonth() + 1);
    var jour = String(date.getDate());
    return (
      date.getFullYear() +
      "-" +
      (mois.length < 2 ? "0" + mois : mois) +
      "-" +
      (jour.length < 2 ? "0" + jour : jour)
    );
  }

  function aujourdhuiISO() {
    return jourISO(new Date());
  }

  function nomMatiere(id) {
    if (!id) return "Général";
    return window.APP_DATA ? APP_DATA.matiere(id).nom : String(id);
  }

  function optionsMatieres(selection, libelleAucune) {
    var choix = libelleAucune === undefined ? "Aucune matière" : libelleAucune;
    return (
      '<option value="">' + echapper(choix) + "</option>" +
      (window.APP_DATA ? APP_DATA.matieres : [])
        .map(function (matiere) {
          return (
            '<option value="' +
            echapper(matiere.id) +
            '"' +
            (matiere.id === selection ? " selected" : "") +
            ">" +
            echapper(matiere.nom) +
            "</option>"
          );
        })
        .join("")
    );
  }

  function priorite(id) {
    var trouvee = PRIORITES.filter(function (element) {
      return element.id === id;
    })[0];
    return trouvee || PRIORITES[1];
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

  function etatVideListe(nomIcone, titre, texte, action) {
    return (
      '<div class="etat-vide">' +
      '<div class="etat-vide__icone" aria-hidden="true">' +
      icone(nomIcone, 30) +
      "</div>" +
      '<p class="etat-vide__titre">' +
      echapper(titre) +
      "</p>" +
      '<p class="etat-vide__texte">' +
      echapper(texte) +
      "</p>" +
      (action
        ? '<button type="button" class="btn btn--secondaire" data-action="' +
          action.action +
          '">' +
          action.libelle +
          "</button>"
        : "") +
      "</div>"
    );
  }

  function afficherMessage(id, texte, type) {
    var zone = document.getElementById(id);
    if (!zone) return;
    zone.hidden = false;
    zone.className = "perso-message perso-message--" + (type || "succes");
    zone.textContent = texte;
  }

  function extrait(texte, longueur) {
    var propre = String(texte || "").replace(/\s+/g, " ").trim();
    if (propre.length <= longueur) return propre;
    return propre.slice(0, longueur).replace(/\s+\S*$/, "") + "…";
  }

  /* ---------------------------------------------------------------------
     Structure de la page
     --------------------------------------------------------------------- */
  function rendreEntete() {
    return (
      '<section class="entete-page"><div class="conteneur">' +
      '<nav class="fil-ariane" aria-label="Fil d\'Ariane">' +
      '<a href="index.html">Accueil</a><span class="fil-ariane__separateur" aria-hidden="true">/</span>' +
      '<span aria-current="page">Espace de travail</span></nav>' +
      '<div class="entete-page__inner"><div>' +
      '<span class="surtitre">Organiser</span>' +
      '<h1 class="entete-page__titre">Espace de travail</h1>' +
      '<p class="entete-page__texte">Notes, tâches, planning, minuteur et objectifs : tout ce qu\'il faut pour organiser vos révisions. Vos données restent dans ce navigateur.</p>' +
      "</div>" +
      '<div class="entete-page__actions">' +
      '<a class="btn btn--secondaire" href="suivi.html">' + icone("suivi", 18) + " Voir mon suivi</a>" +
      '<a class="btn btn--secondaire" href="cours.html">' + icone("livre", 18) + " Parcourir les cours</a>" +
      "</div></div></div></section>"
    );
  }

  function rendreOnglets() {
    return (
      '<div class="onglets perso-onglets" role="tablist" aria-label="Outils de l\'espace de travail">' +
      ONGLETS.map(function (onglet) {
        var actif = onglet.id === ongletActif;
        return (
          '<button type="button" class="onglet" role="tab" id="onglet-' +
          onglet.id +
          '" data-onglet="' +
          onglet.id +
          '" aria-controls="panneau-' +
          onglet.id +
          '" aria-selected="' +
          (actif ? "true" : "false") +
          '" tabindex="' +
          (actif ? "0" : "-1") +
          '">' +
          icone(onglet.icone, 17) +
          " " +
          onglet.libelle +
          "</button>"
        );
      }).join("") +
      "</div>"
    );
  }

  function rendrePanneaux() {
    return (
      '<section class="panneau perso-panneau" role="tabpanel" id="panneau-notes" data-panneau="notes" aria-labelledby="onglet-notes" hidden></section>' +
      '<section class="panneau perso-panneau" role="tabpanel" id="panneau-taches" data-panneau="taches" aria-labelledby="onglet-taches" hidden></section>' +
      '<section class="panneau perso-panneau" role="tabpanel" id="panneau-planning" data-panneau="planning" aria-labelledby="onglet-planning" hidden></section>' +
      '<section class="panneau perso-panneau" role="tabpanel" id="panneau-minuteur" data-panneau="minuteur" aria-labelledby="onglet-minuteur" hidden></section>' +
      '<section class="panneau perso-panneau" role="tabpanel" id="panneau-objectifs" data-panneau="objectifs" aria-labelledby="onglet-objectifs" hidden></section>'
    );
  }

  /* ---------------------------------------------------------------------
     Onglets
     --------------------------------------------------------------------- */
  function activerOnglet(id, deplacerFocus) {
    var existe = ONGLETS.some(function (onglet) {
      return onglet.id === id;
    });
    ongletActif = existe ? id : "notes";

    App.qsa("[data-onglet]", racine).forEach(function (bouton) {
      var actif = bouton.getAttribute("data-onglet") === ongletActif;
      bouton.setAttribute("aria-selected", actif ? "true" : "false");
      bouton.setAttribute("tabindex", actif ? "0" : "-1");
      if (actif && deplacerFocus) bouton.focus();
    });
    App.qsa("[data-panneau]", racine).forEach(function (panneau) {
      var actif = panneau.getAttribute("data-panneau") === ongletActif;
      panneau.hidden = !actif;
    });
    rafraichirTout();
  }

  function brancherOnglets() {
    var boutons = App.qsa("[data-onglet]", racine);
    boutons.forEach(function (bouton, index) {
      bouton.addEventListener("click", function () {
        activerOnglet(bouton.getAttribute("data-onglet"), false);
      });
      bouton.addEventListener("keydown", function (evenement) {
        var cible = null;
        if (evenement.key === "ArrowRight") cible = boutons[(index + 1) % boutons.length];
        else if (evenement.key === "ArrowLeft") cible = boutons[(index - 1 + boutons.length) % boutons.length];
        else if (evenement.key === "Home") cible = boutons[0];
        else if (evenement.key === "End") cible = boutons[boutons.length - 1];
        if (!cible) return;
        evenement.preventDefault();
        activerOnglet(cible.getAttribute("data-onglet"), true);
      });
    });
  }

  /* ---------------------------------------------------------------------
     Notes
     --------------------------------------------------------------------- */
  function construirePanneauNotes() {
    var panneau = document.getElementById("panneau-notes");
    if (!panneau) return;
    panneau.innerHTML =
      '<div class="perso-notes">' +
      '<div class="perso-notes__colonne">' +
      '<div class="perso-notes__barre">' +
      '<div class="barre-recherche">' +
      icone("loupe", 18) +
      '<input type="search" id="notes-recherche" placeholder="Rechercher une note" aria-label="Rechercher une note" autocomplete="off" />' +
      "</div>" +
      '<button type="button" class="btn btn--primaire" id="notes-nouvelle">' +
      icone("plus", 18) +
      " Nouvelle note</button>" +
      "</div>" +
      '<div id="notes-liste" class="perso-notes__liste" aria-live="polite"></div>' +
      "</div>" +
      '<div id="notes-editeur" class="perso-editeur"></div>' +
      "</div>";

    var recherche = document.getElementById("notes-recherche");
    recherche.addEventListener("input", function () {
      rechercheNotes = recherche.value;
      majListeNotes();
    });
    document.getElementById("notes-nouvelle").addEventListener("click", nouvelleNote);
    document.getElementById("notes-liste").addEventListener("click", function (evenement) {
      var bouton = evenement.target.closest("[data-note], [data-action]");
      if (!bouton) return;
      var action = bouton.getAttribute("data-action");
      if (action === "notes-nouvelle") {
        nouvelleNote();
        return;
      }
      var identifiant = bouton.getAttribute("data-note");
      if (identifiant) ouvrirNote(identifiant);
    });

    majListeNotes();
    rendreEditeur();
  }

  function noteElement(note) {
    var actif = note.id === noteEnCours && !creationNote;
    return (
      '<button type="button" class="perso-note' +
      (actif ? " perso-note--actif" : "") +
      '" data-note="' +
      echapper(note.id) +
      '"' +
      (actif ? ' aria-current="true"' : "") +
      ">" +
      '<span class="perso-note__haut">' +
      (note.epingle
        ? '<span class="perso-note__epingle" title="Note épinglée" aria-hidden="true">' + icone("etoile", 13) + "</span>"
        : "") +
      '<span class="perso-note__titre">' +
      echapper(note.titre) +
      "</span>" +
      (note.epingle ? '<span class="sr-only">(note épinglée)</span>' : "") +
      "</span>" +
      '<span class="micro texte-faible">' +
      echapper(nomMatiere(note.matiere)) +
      " · " +
      echapper(App.relative(note.maj)) +
      "</span>" +
      '<span class="perso-note__extrait">' +
      echapper(extrait(note.contenu, 110) || "Note vide") +
      "</span></button>"
    );
  }

  function majListeNotes() {
    var liste = document.getElementById("notes-liste");
    if (!liste) return;
    var toutes = Store.notes().slice().sort(function (a, b) {
      if (!!a.epingle !== !!b.epingle) return a.epingle ? -1 : 1;
      return String(b.maj).localeCompare(String(a.maj));
    });
    var recherche = rechercheNotes.trim().toLowerCase();
    var filtrees = toutes.filter(function (note) {
      if (!recherche) return true;
      var contenu = [note.titre, note.contenu, nomMatiere(note.matiere)].join(" ").toLowerCase();
      return contenu.indexOf(recherche) !== -1;
    });

    if (!toutes.length) {
      liste.innerHTML = etatVideListe(
        "note",
        "Aucune note pour l'instant",
        "Créez votre première note pour garder une trace de vos idées, définitions ou questions.",
        { action: "notes-nouvelle", libelle: icone("plus", 16) + " Nouvelle note" }
      );
      return;
    }
    if (!filtrees.length) {
      liste.innerHTML = etatVideListe(
        "loupe",
        "Aucun résultat",
        "Aucune note ne correspond à cette recherche. Essayez un autre mot-clé.",
        { action: "notes-nouvelle", libelle: "Créer une note" }
      );
      return;
    }
    liste.innerHTML = filtrees.map(noteElement).join("");
  }

  function nouvelleNote() {
    noteEnCours = null;
    creationNote = true;
    rendreEditeur();
    majListeNotes();
    var titre = document.getElementById("note-titre");
    if (titre) titre.focus();
  }

  function ouvrirNote(identifiant) {
    var note = Store.note(identifiant);
    if (!note) return;
    noteEnCours = identifiant;
    creationNote = false;
    rendreEditeur();
    majListeNotes();
  }

  function rendreEditeur() {
    var editeur = document.getElementById("notes-editeur");
    if (!editeur) return;

    var note = null;
    if (!creationNote && noteEnCours) note = Store.note(noteEnCours);
    if (!creationNote && !note) {
      noteEnCours = null;
      editeur.innerHTML =
        '<div class="perso-editeur__vide">' +
        '<span class="perso-editeur__icone" aria-hidden="true">' + icone("note", 28) + "</span>" +
        '<p class="titre-4">Sélectionnez une note</p>' +
        '<p class="petit texte-doux">Choisissez une note dans la liste ou créez-en une nouvelle pour commencer à écrire.</p>' +
        '<button type="button" class="btn btn--secondaire" id="notes-nouvelle-vide">' +
        icone("plus", 16) +
        " Nouvelle note</button>" +
        "</div>";
      var boutonVide = document.getElementById("notes-nouvelle-vide");
      if (boutonVide) boutonVide.addEventListener("click", nouvelleNote);
      return;
    }

    var estNouvelle = !note;
    var donnees = note || { titre: "", contenu: "", matiere: "", epingle: false, cree: null, maj: null };

    editeur.innerHTML =
      '<form class="perso-form-note" id="note-form" novalidate>' +
      '<div class="rangee rangee--entre">' +
      '<h2 class="titre-3">' + (estNouvelle ? "Nouvelle note" : "Modifier la note") + "</h2>" +
      '<span class="micro texte-faible">' +
      (estNouvelle
        ? "Brouillon non enregistré"
        : "Modifiée " + echapper(App.relative(donnees.maj)) + " · créée le " + echapper(App.date(donnees.cree))) +
      "</span></div>" +
      '<div class="champ"><label class="champ__label" for="note-titre">Titre</label>' +
      '<input class="saisie" id="note-titre" maxlength="120" value="' +
      echapper(donnees.titre) +
      '" placeholder="Titre de la note" /></div>' +
      '<div class="champ"><label class="champ__label" for="note-matiere">Matière</label>' +
      '<select class="liste-deroulante" id="note-matiere">' +
      optionsMatieres(donnees.matiere, "Aucune matière") +
      "</select></div>" +
      '<div class="champ"><label class="champ__label" for="note-contenu">Contenu</label>' +
      '<textarea class="zone-texte" id="note-contenu" maxlength="20000" placeholder="Vos idées, définitions, formules, questions à poser…">' +
      echapper(donnees.contenu) +
      "</textarea>" +
      '<div class="rangee rangee--entre"><span class="champ__aide">Texte libre, conservé dans ce navigateur.</span>' +
      '<span class="champ__aide" id="note-compteur">' + donnees.contenu.length + " caractères</span></div></div>" +
      '<div class="groupe-btn perso-form-note__actions">' +
      '<button type="submit" class="btn btn--primaire">' + icone("check", 17) + " Enregistrer</button>" +
      (estNouvelle
        ? '<button type="button" class="btn btn--secondaire" id="note-annuler">Annuler</button>'
        : '<button type="button" class="btn btn--secondaire" id="note-epingler">' +
          icone("etoile", 17) +
          " " +
          (donnees.epingle ? "Désépingler" : "Épingler") +
          "</button>" +
          '<button type="button" class="btn btn--danger" id="note-supprimer">' +
          icone("poubelle", 17) +
          " Supprimer</button>") +
      "</div></form>";

    var formulaire = document.getElementById("note-form");
    var zoneCompteur = document.getElementById("note-compteur");
    var champContenu = document.getElementById("note-contenu");
    if (champContenu && zoneCompteur) {
      champContenu.addEventListener("input", function () {
        zoneCompteur.textContent = champContenu.value.length + " caractères";
      });
    }

    formulaire.addEventListener("submit", function (evenement) {
      evenement.preventDefault();
      var titre = document.getElementById("note-titre").value.trim() || "Note sans titre";
      var matiere = document.getElementById("note-matiere").value;
      var contenu = document.getElementById("note-contenu").value;

      if (noteEnCours && !creationNote) {
        Store.majNote(noteEnCours, { titre: titre, matiere: matiere, contenu: contenu });
        App.toast("Note enregistrée.", { type: "succes" });
      } else {
        var nouvelle = Store.ajouterNote({
          titre: titre,
          matiere: matiere,
          contenu: contenu,
          epingle: false
        });
        noteEnCours = nouvelle.id;
        creationNote = false;
        App.toast("Note créée.", { type: "succes" });
        majListeNotes();
      }
      rendreEditeur();
    });

    var boutonAnnuler = document.getElementById("note-annuler");
    if (boutonAnnuler) {
      boutonAnnuler.addEventListener("click", function () {
        creationNote = false;
        noteEnCours = null;
        rendreEditeur();
        majListeNotes();
      });
    }

    var boutonEpingler = document.getElementById("note-epingler");
    if (boutonEpingler) {
      boutonEpingler.addEventListener("click", function () {
        var courante = Store.note(noteEnCours);
        if (!courante) return;
        Store.majNote(noteEnCours, { epingle: !courante.epingle });
        App.toast(courante.epingle ? "Note désépinglée." : "Note épinglée en tête de liste.", {
          type: "info"
        });
        rendreEditeur();
      });
    }

    var boutonSupprimer = document.getElementById("note-supprimer");
    if (boutonSupprimer) {
      boutonSupprimer.addEventListener("click", function () {
        App.confirmer({
          titre: "Supprimer la note",
          message: "Cette note sera définitivement supprimée de votre espace de travail.",
          libelleOk: "Supprimer",
          danger: true
        }).then(function (confirme) {
          if (!confirme) return;
          Store.supprimerNote(noteEnCours);
          noteEnCours = null;
          creationNote = false;
          App.toast("Note supprimée.", { type: "info" });
          rendreEditeur();
        });
      });
    }
  }

  /* ---------------------------------------------------------------------
     Tâches
     --------------------------------------------------------------------- */
  function construirePanneauTaches() {
    var panneau = document.getElementById("panneau-taches");
    if (!panneau) return;

    var filtres = [
      { id: "toutes", libelle: "Toutes" },
      { id: "a-faire", libelle: "À faire" },
      { id: "faites", libelle: "Faites" },
      { id: "retard", libelle: "En retard" }
    ];

    panneau.innerHTML =
      '<form class="carte perso-form-tache" id="taches-form" novalidate>' +
      '<h2 class="titre-3">Ajouter une tâche</h2>' +
      '<div class="groupe-champ">' +
      '<div class="champ perso-champ-titre"><label class="champ__label" for="tache-titre">Titre</label>' +
      '<input class="saisie" id="tache-titre" maxlength="160" placeholder="Ex. Réviser les fractions pour le contrôle" /></div>' +
      '<div class="champ"><label class="champ__label" for="tache-matiere">Matière</label>' +
      '<select class="liste-deroulante" id="tache-matiere">' + optionsMatieres("", "Aucune matière") + "</select></div>" +
      '<div class="champ"><label class="champ__label" for="tache-echeance">Échéance</label>' +
      '<input class="saisie" type="date" id="tache-echeance" /></div>' +
      '<div class="champ"><label class="champ__label" for="tache-priorite">Priorité</label>' +
      '<select class="liste-deroulante" id="tache-priorite">' +
      PRIORITES.slice()
        .reverse()
        .map(function (element) {
          return (
            '<option value="' + element.id + '"' + (element.id === "normale" ? " selected" : "") + ">" + element.nom + "</option>"
          );
        })
        .join("") +
      "</select></div></div>" +
      '<div class="rangee rangee--entre perso-form-tache__pied">' +
      '<p class="perso-message" id="taches-message" role="status" aria-live="polite"></p>' +
      '<button type="submit" class="btn btn--primaire">' + icone("plus", 18) + " Ajouter la tâche</button>" +
      "</div></form>" +
      '<div class="rangee rangee--entre perso-taches__barre">' +
      '<div class="filtres" role="group" aria-label="Filtrer les tâches">' +
      filtres
        .map(function (filtre) {
          return (
            '<button type="button" class="puce-filtre" data-filtre="' +
            filtre.id +
            '" aria-pressed="' +
            (filtre.id === filtreTaches ? "true" : "false") +
            '">' +
            filtre.libelle +
            "</button>"
          );
        })
        .join("") +
      "</div>" +
      '<p class="petit texte-doux" id="taches-compteur" aria-live="polite"></p>' +
      "</div>" +
      '<div id="taches-liste" class="perso-taches" aria-live="polite"></div>';

    var formulaire = document.getElementById("taches-form");
    formulaire.addEventListener("submit", function (evenement) {
      evenement.preventDefault();
      var titre = document.getElementById("tache-titre").value.trim();
      if (!titre) {
        afficherMessage("taches-message", "Donnez un titre à la tâche avant de l'ajouter.", "erreur");
        document.getElementById("tache-titre").focus();
        return;
      }
      Store.ajouterTache({
        titre: titre,
        matiere: document.getElementById("tache-matiere").value,
        echeance: document.getElementById("tache-echeance").value,
        priorite: document.getElementById("tache-priorite").value
      });
      formulaire.reset();
      filtreTaches = "toutes";
      App.qsa("[data-filtre]", panneau).forEach(function (bouton) {
        bouton.setAttribute("aria-pressed", bouton.getAttribute("data-filtre") === "toutes" ? "true" : "false");
      });
      majTaches();
      afficherMessage("taches-message", "Tâche ajoutée à votre liste.", "succes");
      App.toast("Tâche ajoutée.", { type: "succes" });
      document.getElementById("tache-titre").focus();
    });

    App.qsa("[data-filtre]", panneau).forEach(function (bouton) {
      bouton.addEventListener("click", function () {
        filtreTaches = bouton.getAttribute("data-filtre");
        App.qsa("[data-filtre]", panneau).forEach(function (autre) {
          autre.setAttribute("aria-pressed", autre === bouton ? "true" : "false");
        });
        majTaches();
      });
    });

    document.getElementById("taches-liste").addEventListener("click", function (evenement) {
      var bouton = evenement.target.closest("[data-action]");
      if (!bouton) return;
      var action = bouton.getAttribute("data-action");
      var identifiant = bouton.getAttribute("data-tache");
      if (action === "basculer") {
        suppressionTache = null;
        Store.basculerTache(identifiant);
      } else if (action === "supprimer") {
        suppressionTache = identifiant;
        majTaches();
      } else if (action === "annuler-suppression") {
        suppressionTache = null;
        majTaches();
      } else if (action === "confirmer-suppression") {
        suppressionTache = null;
        Store.supprimerTache(identifiant);
        App.toast("Tâche supprimée.", { type: "info" });
      } else if (action === "nouvelle-tache") {
        var champ = document.getElementById("tache-titre");
        if (champ) champ.focus();
      } else if (action === "filtre-toutes") {
        var boutonToutes = panneau.querySelector('[data-filtre="toutes"]');
        if (boutonToutes) boutonToutes.click();
      }
    });

    majTaches();
  }

  function poidsPriorite(id) {
    return priorite(id).poids;
  }

  function trierTaches(liste) {
    return liste.slice().sort(function (a, b) {
      if (!!a.fait !== !!b.fait) return a.fait ? 1 : -1;
      var echeanceA = a.echeance || "9999-12-31";
      var echeanceB = b.echeance || "9999-12-31";
      if (echeanceA !== echeanceB) return echeanceA < echeanceB ? -1 : 1;
      var poidsA = poidsPriorite(a.priorite);
      var poidsB = poidsPriorite(b.priorite);
      if (poidsA !== poidsB) return poidsB - poidsA;
      return String(a.titre).localeCompare(String(b.titre), "fr");
    });
  }

  function tacheElement(tache) {
    var faite = !!tache.fait;
    var aujourd = aujourdhuiISO();
    var enRetard = !faite && !!tache.echeance && tache.echeance < aujourd;
    var pourAujourdhui = !faite && tache.echeance === aujourd;
    var classes = "perso-tache";
    if (faite) classes += " perso-tache--faite";
    if (enRetard) classes += " perso-tache--retard";
    if (pourAujourdhui) classes += " perso-tache--jour";
    var priorit = priorite(tache.priorite);
    var echeanceTexte = tache.echeance ? App.echeance(tache.echeance) : "Sans échéance";

    var confirmation =
      suppressionTache === tache.id
        ? '<span class="perso-confirmation"><span class="micro">Supprimer ?</span>' +
          '<button type="button" class="btn btn--sm btn--danger" data-action="confirmer-suppression" data-tache="' +
          echapper(tache.id) +
          '">Oui</button>' +
          '<button type="button" class="btn btn--sm btn--fantome" data-action="annuler-suppression">Non</button></span>'
        : '<button type="button" class="btn btn--sm btn--fantome perso-tache__supprimer" data-action="supprimer" data-tache="' +
          echapper(tache.id) +
          '" aria-label="Supprimer la tâche : ' +
          echapper(tache.titre) +
          '">' +
          icone("poubelle", 16) +
          "</button>";

    return (
      '<article class="' + classes + '">' +
      '<button type="button" class="perso-tache__bascule" data-action="basculer" data-tache="' +
      echapper(tache.id) +
      '" aria-pressed="' +
      (faite ? "true" : "false") +
      '" aria-label="' +
      (faite ? "Rouvrir la tâche : " : "Marquer comme faite : ") +
      echapper(tache.titre) +
      '">' +
      (faite ? icone("check", 15) : "") +
      "</button>" +
      '<div class="perso-tache__corps">' +
      '<p class="perso-tache__titre">' + echapper(tache.titre) + "</p>" +
      '<div class="rangee perso-tache__meta">' +
      (tache.matiere
        ? '<span class="etiquette etiquette--neutre">' + echapper(nomMatiere(tache.matiere)) + "</span>"
        : "") +
      '<span class="etiquette ' + priorit.etiquette + '">Priorité ' + echapper(priorit.nom.toLowerCase()) + "</span>" +
      '<span class="perso-tache__echeance' +
      (enRetard ? " perso-tache__echeance--retard" : "") +
      (pourAujourdhui ? " perso-tache__echeance--jour" : "") +
      '">' +
      icone("calendrier", 13) +
      " " +
      echapper(echeanceTexte) +
      "</span></div></div>" +
      '<div class="perso-tache__actions">' + confirmation + "</div>" +
      "</article>"
    );
  }

  function majTaches() {
    var liste = document.getElementById("taches-liste");
    var compteur = document.getElementById("taches-compteur");
    if (!liste) return;
    var aujourd = aujourdhuiISO();
    var toutes = Store.taches();

    var aFaire = toutes.filter(function (tache) {
      return !tache.fait;
    }).length;
    var enRetard = toutes.filter(function (tache) {
      return !tache.fait && !!tache.echeance && tache.echeance < aujourd;
    }).length;

    if (compteur) {
      compteur.textContent =
        toutes.length +
        " tâche" + (toutes.length > 1 ? "s" : "") +
        " · " + aFaire + " à faire" +
        (enRetard ? " · " + enRetard + " en retard" : "");
    }

    var filtrees = toutes.filter(function (tache) {
      if (filtreTaches === "a-faire") return !tache.fait;
      if (filtreTaches === "faites") return !!tache.fait;
      if (filtreTaches === "retard") return !tache.fait && !!tache.echeance && tache.echeance < aujourd;
      return true;
    });

    if (!toutes.length) {
      liste.innerHTML = etatVideListe(
        "tache",
        "Aucune tâche",
        "Ajoutez votre première tâche avec le formulaire ci-dessus : devoirs, révisions, exercices à rendre.",
        { action: "nouvelle-tache", libelle: icone("plus", 16) + " Ajouter une tâche" }
      );
      return;
    }
    if (!filtrees.length) {
      var messageFiltre =
        filtreTaches === "retard"
          ? "Aucune tâche en retard. Vous êtes à jour !"
          : filtreTaches === "faites"
            ? "Aucune tâche n'est encore terminée."
            : "Aucune tâche à faire pour le moment.";
      liste.innerHTML = etatVideListe("tache", "Aucune tâche dans ce filtre", messageFiltre, {
        action: "filtre-toutes",
        libelle: "Voir toutes les tâches"
      });
      return;
    }
    liste.innerHTML = trierTaches(filtrees).map(tacheElement).join("");
  }

  /* ---------------------------------------------------------------------
     Planning 7 jours
     --------------------------------------------------------------------- */
  function construirePanneauPlanning() {
    var panneau = document.getElementById("panneau-planning");
    if (!panneau) return;
    panneau.innerHTML =
      '<div class="rangee rangee--entre perso-planning__entete">' +
      "<div><h2 class=\"titre-3\">Les 7 prochains jours</h2>" +
      '<p class="petit texte-doux">Retrouvez les tâches à rendre et les sessions d\'étude enregistrées, jour par jour.</p></div>' +
      '<a class="btn btn--secondaire" href="espace-travail.html?onglet=taches">' + icone("tache", 17) + " Gérer les tâches</a>" +
      "</div>" +
      '<div id="planning-grille" class="perso-planning" aria-live="polite"></div>';

    document.getElementById("planning-grille").addEventListener("click", function (evenement) {
      var bouton = evenement.target.closest("[data-session-date]");
      if (!bouton) return;
      ouvrirModalSession(bouton.getAttribute("data-session-date"));
    });

    majPlanning();
  }

  function majPlanning() {
    var grille = document.getElementById("planning-grille");
    if (!grille) return;

    var maintenant = new Date();
    var base = new Date(maintenant.getFullYear(), maintenant.getMonth(), maintenant.getDate());
    var taches = Store.taches();
    var sessions = Store.sessions();
    var minutesParJour = {};
    Store.minutesParJour(7).forEach(function (jour) {
      minutesParJour[jour.date] = jour.minutes;
    });

    var cartes = [];
    for (var index = 0; index < 7; index += 1) {
      var date = new Date(base.getFullYear(), base.getMonth(), base.getDate() + index);
      var cle = jourISO(date);
      var libelle = date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });

      var tachesJour = trierTaches(
        taches.filter(function (tache) {
          return tache.echeance === cle;
        })
      );
      var sessionsJour = sessions.filter(function (session) {
        var jourSession = session.date || (session.cree || "").slice(0, 10);
        return jourSession === cle;
      });
      var retards = [];
      if (index === 0) {
        retards = trierTaches(
          taches.filter(function (tache) {
            return !tache.fait && !!tache.echeance && tache.echeance < cle;
          })
        ).slice(0, 4);
      }

      var contenu = "";
      if (retards.length) {
        contenu +=
          '<div class="perso-jour__groupe"><p class="perso-jour__label perso-jour__label--alerte">En retard</p><ul class="perso-jour__liste">' +
          retards
            .map(function (tache) {
              return (
                '<li class="perso-jour__tache perso-jour__tache--retard">' +
                icone("alerte", 14) +
                "<span>" + echapper(tache.titre) + "</span></li>"
              );
            })
            .join("") +
          "</ul></div>";
      }
      if (tachesJour.length) {
        contenu +=
          '<div class="perso-jour__groupe"><p class="perso-jour__label">Tâches</p><ul class="perso-jour__liste">' +
          tachesJour
            .map(function (tache) {
              return (
                '<li class="perso-jour__tache' +
                (tache.fait ? " perso-jour__tache--faite" : "") +
                '">' +
                icone(tache.fait ? "check" : "tache", 14) +
                "<span>" + echapper(tache.titre) + "</span></li>"
              );
            })
            .join("") +
          "</ul></div>";
      }
      if (sessionsJour.length) {
        contenu +=
          '<div class="perso-jour__groupe"><p class="perso-jour__label">Sessions d\'étude</p><ul class="perso-jour__liste">' +
          sessionsJour
            .map(function (session) {
              return (
                '<li class="perso-jour__session" title="' +
                echapper(session.note || nomMatiere(session.matiere)) +
                '"><span class="perso-jour__duree">' +
                echapper(App.duree(session.minutes)) +
                "</span><span>" +
                echapper(nomMatiere(session.matiere)) +
                "</span></li>"
              );
            })
            .join("") +
          "</ul></div>";
      }
      if (!contenu) {
        contenu = '<p class="perso-jour__vide micro texte-faible">Aucune activité prévue.</p>';
      }

      var totalMinutes = minutesParJour[cle] || 0;
      cartes.push(
        '<article class="perso-jour' + (index === 0 ? " perso-jour--aujourdhui" : "") + '">' +
        '<header class="perso-jour__entete"><div>' +
        '<p class="perso-jour__nom">' + (index === 0 ? "Aujourd'hui" : echapper(capitaliser(libelle))) + "</p>" +
        '<p class="micro texte-faible">' + echapper(App.date(cle)) + "</p></div>" +
        '<span class="etiquette ' + (totalMinutes ? "etiquette--info" : "etiquette--neutre") + '" title="Temps d\'étude enregistré">' +
        icone("horloge", 13) + " " + echapper(App.duree(totalMinutes)) + "</span></header>" +
        '<div class="perso-jour__corps">' + contenu + "</div>" +
        '<button type="button" class="btn btn--sm btn--secondaire perso-jour__ajouter" data-session-date="' +
        cle +
        '">' + icone("plus", 16) + " Ajouter une session</button></article>"
      );
    }
    grille.innerHTML = cartes.join("");
  }

  function ouvrirModalSession(dateISO) {
    var contenu = document.createElement("div");
    contenu.className = "pile perso-modal-session";
    contenu.innerHTML =
      '<div class="champ"><label class="champ__label" for="session-minutes">Durée (minutes)</label>' +
      '<input class="saisie" type="number" id="session-minutes" min="1" max="600" step="5" value="30" inputmode="numeric" aria-describedby="session-minutes-aide" />' +
      '<span class="champ__aide" id="session-minutes-aide">Entre 1 et 600 minutes.</span></div>' +
      '<div class="champ"><label class="champ__label" for="session-matiere">Matière</label>' +
      '<select class="liste-deroulante" id="session-matiere">' + optionsMatieres("", "Aucune matière") + "</select></div>" +
      '<div class="champ"><label class="champ__label" for="session-note">Note (facultatif)</label>' +
      '<input class="saisie" id="session-note" maxlength="200" placeholder="Ex. Révision du chapitre 2" /></div>' +
      '<p class="perso-message" id="session-message" role="alert" aria-live="assertive" hidden></p>' +
      '<p class="micro texte-faible">Session datée du ' + echapper(App.date(dateISO, { long: true })) + ".</p>";

    App.modal({
      titre: "Ajouter une session d'étude",
      contenu: contenu,
      actions: [
        { libelle: "Annuler", type: "secondaire" },
        {
          libelle: "Enregistrer",
          type: "primaire",
          onClick: function (corps) {
            var champMinutes = corps.querySelector("#session-minutes");
            var champMatiere = corps.querySelector("#session-matiere");
            var champNote = corps.querySelector("#session-note");
            var zoneErreur = corps.querySelector("#session-message");
            var minutes = Number(champMinutes.value);

            function refuser(texte) {
              if (zoneErreur) {
                zoneErreur.hidden = false;
                zoneErreur.className = "perso-message perso-message--erreur";
                zoneErreur.textContent = texte;
              }
              return false;
            }

            if (!isFinite(minutes) || minutes < 1 || minutes > 600) {
              return refuser("Indiquez une durée valide, entre 1 et 600 minutes.");
            }
            Store.journaliserSession({
              minutes: Math.round(minutes),
              matiere: champMatiere.value,
              note: champNote.value.trim(),
              date: dateISO
            });
            App.toast("Session de " + App.duree(minutes) + " enregistrée.", { type: "succes" });
            return true;
          }
        }
      ]
    });
  }

  /* ---------------------------------------------------------------------
     Minuteur de concentration
     --------------------------------------------------------------------- */
  function construirePanneauMinuteur() {
    var panneau = document.getElementById("panneau-minuteur");
    if (!panneau) return;
    var circonference = (2 * Math.PI * 96).toFixed(2);

    panneau.innerHTML =
      '<div class="perso-minuteur">' +
      '<div class="perso-minuteur__visuel">' +
      '<div class="perso-minuteur__cadran" id="minuteur-cadran">' +
      '<svg class="anneau perso-minuteur__anneau" viewBox="0 0 220 220" width="220" height="220" aria-hidden="true" focusable="false">' +
      '<circle class="perso-anneau__fond" cx="110" cy="110" r="96" fill="none" stroke-width="12" />' +
      '<circle class="perso-anneau__valeur" id="minuteur-anneau" cx="110" cy="110" r="96" fill="none" stroke-width="12" stroke-dasharray="' +
      circonference +
      '" stroke-dashoffset="0" />' +
      "</svg>" +
      '<div class="perso-minuteur__centre">' +
      '<span class="surtitre" id="minuteur-phase">Concentration</span>' +
      '<span class="perso-minuteur__temps" id="minuteur-temps" role="timer" aria-live="off">25:00</span>' +
      '<span class="micro texte-faible" id="minuteur-sous-titre">Travail</span>' +
      "</div></div>" +
      '<p class="perso-message perso-minuteur__message" id="minuteur-message" role="status" aria-live="polite" hidden></p>' +
      '<div class="groupe-btn perso-minuteur__commandes">' +
      '<button type="button" class="btn btn--primaire btn--lg" id="minuteur-demarrer">' + icone("play", 20) + " Démarrer</button>" +
      '<button type="button" class="btn btn--secondaire" id="minuteur-reinit">' + icone("reinitialiser", 18) + " Réinitialiser</button>" +
      "</div>" +
      '<p class="micro texte-faible texte-centre">Une session de travail terminée est enregistrée automatiquement dans votre suivi.</p>' +
      "</div>" +
      '<div class="perso-minuteur__reglages">' +
      '<h2 class="titre-4">Réglages</h2>' +
      '<div class="groupe-champ">' +
      '<div class="champ"><label class="champ__label" for="minuteur-travail">Travail (minutes)</label>' +
      '<input class="saisie" type="number" id="minuteur-travail" min="1" max="120" step="1" value="25" inputmode="numeric" /></div>' +
      '<div class="champ"><label class="champ__label" for="minuteur-pause">Pause (minutes)</label>' +
      '<input class="saisie" type="number" id="minuteur-pause" min="1" max="60" step="1" value="5" inputmode="numeric" /></div>' +
      "</div>" +
      '<div class="champ"><label class="champ__label" for="minuteur-matiere">Matière travaillée</label>' +
      '<select class="liste-deroulante" id="minuteur-matiere">' + optionsMatieres("", "Aucune matière") + "</select></div>" +
      '<button type="button" class="btn btn--secondaire btn--bloc perso-minuteur__manuel" id="minuteur-manuel">' +
      icone("plus", 18) + " Enregistrer manuellement</button>" +
      '<div class="separateur"></div>' +
      '<h2 class="titre-4">Sessions du jour</h2>' +
      '<div id="minuteur-historique" class="perso-minuteur__historique" aria-live="polite"></div>' +
      "</div></div>";

    initialiserMinuteur();
  }

  function lireDuree(phase) {
    var champ = document.getElementById(phase === "travail" ? "minuteur-travail" : "minuteur-pause");
    var valeur = champ ? Math.round(Number(champ.value)) : NaN;
    if (!isFinite(valeur) || valeur < 1) valeur = phase === "travail" ? 25 : 5;
    var maximum = phase === "travail" ? 120 : 60;
    return Math.min(maximum, valeur);
  }

  function initialiserMinuteur() {
    minuteur = {
      phase: "travail",
      restant: lireDuree("travail") * 60,
      duree: lireDuree("travail") * 60,
      actif: false,
      interval: null,
      termine: false
    };

    var bouton = document.getElementById("minuteur-demarrer");
    if (bouton) bouton.addEventListener("click", basculerMinuteur);
    var reinit = document.getElementById("minuteur-reinit");
    if (reinit) reinit.addEventListener("click", reinitialiserMinuteur);
    var manuel = document.getElementById("minuteur-manuel");
    if (manuel) {
      manuel.addEventListener("click", function () {
        ouvrirModalSession(aujourdhuiISO());
      });
    }

    ["minuteur-travail", "minuteur-pause"].forEach(function (id) {
      var champ = document.getElementById(id);
      if (!champ) return;
      champ.addEventListener("change", function () {
        if (minuteur.actif) {
          champ.value = String(minuteur.phase === "travail" ? lireDuree("travail") : lireDuree("pause"));
          return;
        }
        var phaseChamp = id === "minuteur-travail" ? "travail" : "pause";
        champ.value = String(lireDuree(phaseChamp));
        if (phaseChamp === minuteur.phase) {
          minuteur.duree = lireDuree(phaseChamp) * 60;
          minuteur.restant = minuteur.duree;
          majAffichageMinuteur();
        }
      });
    });

    majAffichageMinuteur();
    majHistoriqueMinuteur();
    majBoutonMinuteur();
  }

  function majAffichageMinuteur() {
    var zoneTemps = document.getElementById("minuteur-temps");
    var zonePhase = document.getElementById("minuteur-phase");
    var sousTitre = document.getElementById("minuteur-sous-titre");
    var anneau = document.getElementById("minuteur-anneau");
    if (!zoneTemps || !minuteur) return;

    var minutes = Math.floor(Math.max(0, minuteur.restant) / 60);
    var secondes = Math.max(0, minuteur.restant) % 60;
    zoneTemps.textContent =
      (minutes < 10 ? "0" : "") + minutes + ":" + (secondes < 10 ? "0" : "") + secondes;
    if (zonePhase) zonePhase.textContent = minuteur.phase === "travail" ? "Concentration" : "Pause";
    if (sousTitre) sousTitre.textContent = minuteur.phase === "travail" ? "Travail" : "Récupération";
    if (anneau) {
      var circonference = 2 * Math.PI * 96;
      var ratio = minuteur.duree ? Math.max(0, Math.min(1, minuteur.restant / minuteur.duree)) : 0;
      anneau.setAttribute("stroke-dasharray", circonference.toFixed(2));
      anneau.setAttribute("stroke-dashoffset", (circonference * ratio).toFixed(2));
    }
  }

  function majBoutonMinuteur() {
    var bouton = document.getElementById("minuteur-demarrer");
    if (!bouton || !minuteur) return;
    if (minuteur.actif) {
      bouton.innerHTML = icone("pause", 20) + " Mettre en pause";
      bouton.classList.remove("btn--primaire");
      bouton.classList.add("btn--secondaire");
    } else if (minuteur.termine) {
      bouton.innerHTML = icone("play", 20) + " Continuer";
      bouton.classList.add("btn--primaire");
      bouton.classList.remove("btn--secondaire");
    } else if (minuteur.restant < minuteur.duree) {
      bouton.innerHTML = icone("play", 20) + " Reprendre";
      bouton.classList.add("btn--primaire");
      bouton.classList.remove("btn--secondaire");
    } else {
      bouton.innerHTML = icone("play", 20) + " Démarrer";
      bouton.classList.add("btn--primaire");
      bouton.classList.remove("btn--secondaire");
    }
  }

  function desactiverReglages(desactiver) {
    ["minuteur-travail", "minuteur-pause"].forEach(function (id) {
      var champ = document.getElementById(id);
      if (champ) champ.disabled = desactiver;
    });
  }

  function basculerMinuteur() {
    if (!minuteur) return;
    if (minuteur.actif) {
      window.clearInterval(minuteur.interval);
      minuteur.interval = null;
      minuteur.actif = false;
      majBoutonMinuteur();
      return;
    }
    if (minuteur.restant <= 0) {
      minuteur.restant = minuteur.duree;
      majAffichageMinuteur();
    }
    minuteur.actif = true;
    minuteur.termine = false;
    var cadran = document.getElementById("minuteur-cadran");
    if (cadran) cadran.classList.remove("perso-minuteur__cadran--fini");
    var message = document.getElementById("minuteur-message");
    if (message) message.hidden = true;
    desactiverReglages(true);
    majBoutonMinuteur();
    minuteur.interval = window.setInterval(ticMinuteur, 1000);
  }

  function ticMinuteur() {
    if (!minuteur || !minuteur.actif) return;
    minuteur.restant -= 1;
    if (minuteur.restant <= 0) {
      minuteur.restant = 0;
      majAffichageMinuteur();
      finPhaseMinuteur();
      return;
    }
    majAffichageMinuteur();
  }

  function finPhaseMinuteur() {
    window.clearInterval(minuteur.interval);
    minuteur.interval = null;
    minuteur.actif = false;
    minuteur.termine = true;

    var dureeMinutes = Math.round(minuteur.duree / 60);
    var phaseTerminee = minuteur.phase;
    var cadran = document.getElementById("minuteur-cadran");
    if (cadran) cadran.classList.add("perso-minuteur__cadran--fini");
    desactiverReglages(false);

    var zoneMessage = document.getElementById("minuteur-message");

    if (phaseTerminee === "travail") {
      Store.journaliserSession({
        minutes: dureeMinutes,
        matiere: document.getElementById("minuteur-matiere").value,
        note: "Session de concentration (minuteur)"
      });
      if (zoneMessage) {
        zoneMessage.hidden = false;
        zoneMessage.className = "perso-message perso-message--succes perso-minuteur__message";
        zoneMessage.textContent =
          "Session de " + dureeMinutes + " min terminée et enregistrée. Une pause de " + lireDuree("pause") + " min est proposée.";
      }
      App.toast("Session de concentration enregistrée : " + App.duree(dureeMinutes) + ".", {
        type: "succes"
      });
      minuteur.phase = "pause";
    } else {
      if (zoneMessage) {
        zoneMessage.hidden = false;
        zoneMessage.className = "perso-message perso-message--info perso-minuteur__message";
        zoneMessage.textContent =
          "Pause terminée. Vous pouvez relancer une session de " + lireDuree("travail") + " min quand vous êtes prêt.";
      }
      App.toast("Pause terminée.", { type: "info" });
      minuteur.phase = "travail";
    }
    minuteur.duree = lireDuree(minuteur.phase) * 60;
    minuteur.restant = minuteur.duree;
    majBoutonMinuteur();
    majAffichageMinuteur();
  }

  function reinitialiserMinuteur() {
    if (!minuteur) return;
    window.clearInterval(minuteur.interval);
    minuteur.interval = null;
    minuteur.actif = false;
    minuteur.termine = false;
    minuteur.phase = "travail";
    minuteur.duree = lireDuree("travail") * 60;
    minuteur.restant = minuteur.duree;
    var cadran = document.getElementById("minuteur-cadran");
    if (cadran) cadran.classList.remove("perso-minuteur__cadran--fini");
    var message = document.getElementById("minuteur-message");
    if (message) message.hidden = true;
    desactiverReglages(false);
    majBoutonMinuteur();
    majAffichageMinuteur();
  }

  function majHistoriqueMinuteur() {
    var zone = document.getElementById("minuteur-historique");
    if (!zone) return;
    var aujourd = aujourdhuiISO();
    var sessions = Store.sessions().filter(function (session) {
      var jour = session.date || (session.cree || "").slice(0, 10);
      return jour === aujourd;
    });
    if (!sessions.length) {
      zone.innerHTML =
        '<p class="micro texte-faible">Aucune session enregistrée aujourd\'hui. Lancez le minuteur ou utilisez « Enregistrer manuellement ».</p>';
      return;
    }
    var total = sessions.reduce(function (somme, session) {
      return somme + (Number(session.minutes) || 0);
    }, 0);
    zone.innerHTML =
      '<p class="petit texte-doux">Total aujourd\'hui : <strong>' +
      echapper(App.duree(total)) +
      "</strong></p>" +
      '<ul class="perso-historique">' +
      sessions
        .slice(0, 6)
        .map(function (session) {
          return (
            '<li class="perso-historique__item"><span class="perso-historique__duree">' +
            echapper(App.duree(session.minutes)) +
            "</span><span class=\"perso-historique__corps\"><span>" +
            echapper(nomMatiere(session.matiere)) +
            "</span>" +
            (session.note ? '<span class="micro texte-faible">' + echapper(session.note) + "</span>" : "") +
            "</span></li>"
          );
        })
        .join("") +
      "</ul>";
  }

  /* ---------------------------------------------------------------------
     Objectifs
     --------------------------------------------------------------------- */
  function construirePanneauObjectifs() {
    var panneau = document.getElementById("panneau-objectifs");
    if (!panneau) return;
    panneau.innerHTML =
      '<form class="carte perso-form-objectif" id="objectifs-form" novalidate>' +
      '<h2 class="titre-3">Nouvel objectif</h2>' +
      '<p class="petit texte-doux">Fixez-vous une cible concrète : nombre d\'exercices, de fiches relues ou de chapitres terminés.</p>' +
      '<div class="groupe-champ">' +
      '<div class="champ perso-champ-titre"><label class="champ__label" for="objectif-titre">Titre</label>' +
      '<input class="saisie" id="objectif-titre" maxlength="160" placeholder="Ex. Terminer 10 exercices sur les fractions" /></div>' +
      '<div class="champ"><label class="champ__label" for="objectif-cible">Cible (nombre)</label>' +
      '<input class="saisie" type="number" id="objectif-cible" min="1" max="9999" step="1" value="5" inputmode="numeric" /></div>' +
      '<div class="champ"><label class="champ__label" for="objectif-echeance">Échéance</label>' +
      '<input class="saisie" type="date" id="objectif-echeance" /></div></div>' +
      '<div class="rangee rangee--entre"><p class="perso-message" id="objectifs-message" role="status" aria-live="polite"></p>' +
      '<button type="submit" class="btn btn--primaire">' + icone("plus", 18) + " Ajouter l'objectif</button></div>" +
      "</form>" +
      '<div id="objectifs-liste" class="perso-objectifs" aria-live="polite"></div>';

    document.getElementById("objectifs-form").addEventListener("submit", function (evenement) {
      evenement.preventDefault();
      var titre = document.getElementById("objectif-titre").value.trim();
      var cible = Math.round(Number(document.getElementById("objectif-cible").value));
      if (!titre) {
        afficherMessage("objectifs-message", "Donnez un titre à votre objectif.", "erreur");
        document.getElementById("objectif-titre").focus();
        return;
      }
      if (!isFinite(cible) || cible < 1) {
        afficherMessage("objectifs-message", "La cible doit être un nombre supérieur ou égal à 1.", "erreur");
        document.getElementById("objectif-cible").focus();
        return;
      }
      Store.ajouterObjectif({
        titre: titre,
        cible: cible,
        echeance: document.getElementById("objectif-echeance").value
      });
      evenement.target.reset();
      document.getElementById("objectif-cible").value = "5";
      afficherMessage("objectifs-message", "Objectif créé. Bon travail !", "succes");
      App.toast("Objectif ajouté.", { type: "succes" });
      document.getElementById("objectif-titre").focus();
    });

    document.getElementById("objectifs-liste").addEventListener("click", function (evenement) {
      var bouton = evenement.target.closest("[data-action]");
      if (!bouton) return;
      var action = bouton.getAttribute("data-action");
      if (action === "objectif-focus") {
        var champTitre = document.getElementById("objectif-titre");
        if (champTitre) champTitre.focus();
        return;
      }
      var identifiant = bouton.getAttribute("data-objectif");
      var objectif = Store.objectifs().filter(function (element) {
        return element.id === identifiant;
      })[0];
      if (!objectif) return;

      if (action === "plus") {
        Store.majObjectif(identifiant, { progression: objectif.progression + 1 });
      } else if (action === "moins") {
        Store.majObjectif(identifiant, { progression: Math.max(0, objectif.progression - 1) });
      } else if (action === "atteint") {
        Store.majObjectif(identifiant, { progression: objectif.cible });
        App.toast("Objectif atteint : " + objectif.titre + ".", { type: "succes" });
      } else if (action === "supprimer") {
        App.confirmer({
          titre: "Supprimer l'objectif",
          message: "L'objectif « " + objectif.titre + " » sera retiré de votre liste.",
          libelleOk: "Supprimer",
          danger: true
        }).then(function (confirme) {
          if (!confirme) return;
          Store.supprimerObjectif(identifiant);
          App.toast("Objectif supprimé.", { type: "info" });
        });
      }
    });

    majObjectifs();
  }

  function objectifElement(objectif) {
    var pourcentage = objectif.cible
      ? Math.min(100, Math.round((objectif.progression / objectif.cible) * 100))
      : 0;
    var fait = !!objectif.fait || objectif.progression >= objectif.cible;
    var echeanceTexte = objectif.echeance ? App.echeance(objectif.echeance) : "Sans échéance";
    var echeancePassee = !fait && objectif.echeance && objectif.echeance < aujourdhuiISO();

    return (
      '<article class="perso-objectif' + (fait ? " perso-objectif--fait" : "") + '">' +
      '<div class="rangee rangee--entre perso-objectif__entete">' +
      '<h3 class="perso-objectif__titre">' + echapper(objectif.titre) + "</h3>" +
      '<span class="etiquette ' +
      (fait ? "etiquette--succes" : echeancePassee ? "etiquette--alerte" : "etiquette--neutre") +
      '">' +
      (fait ? icone("check", 13) + " " : "") +
      echapper(fait ? "Atteint" : echeanceTexte) +
      "</span></div>" +
      '<div class="perso-objectif__jauge">' + jauge(pourcentage, "Progression de l'objectif") +
      '<div class="rangee rangee--entre"><span class="petit texte-doux">' +
      objectif.progression + " / " + objectif.cible +
      '</span><span class="petit texte-doux">' + pourcentage + " %</span></div></div>" +
      '<div class="groupe-btn perso-objectif__actions">' +
      '<button type="button" class="btn btn--sm btn--secondaire" data-action="plus" data-objectif="' +
      echapper(objectif.id) + '" aria-label="Augmenter la progression de ' + echapper(objectif.titre) + '">+1</button>' +
      '<button type="button" class="btn btn--sm btn--secondaire" data-action="moins" data-objectif="' +
      echapper(objectif.id) + '" aria-label="Diminuer la progression de ' + echapper(objectif.titre) + '">−1</button>' +
      '<button type="button" class="btn btn--sm btn--secondaire" data-action="atteint" data-objectif="' +
      echapper(objectif.id) + '"' + (fait ? " disabled" : "") + ">Atteint</button>" +
      '<button type="button" class="btn btn--sm btn--danger" data-action="supprimer" data-objectif="' +
      echapper(objectif.id) + '" aria-label="Supprimer l\'objectif : ' + echapper(objectif.titre) + '">' +
      icone("poubelle", 15) + "</button></div></article>"
    );
  }

  function majObjectifs() {
    var liste = document.getElementById("objectifs-liste");
    if (!liste) return;
    var objectifs = Store.objectifs();
    if (!objectifs.length) {
      liste.innerHTML = etatVideListe(
        "objectif",
        "Aucun objectif",
        "Fixez-vous une cible mesurable (10 exercices, 3 fiches relues, un chapitre terminé) et suivez votre progression.",
        { action: "objectif-focus", libelle: icone("plus", 16) + " Créer un objectif" }
      );
      return;
    }
    liste.innerHTML = objectifs.map(objectifElement).join("");
  }

  /* ---------------------------------------------------------------------
     Rafraîchissement global
     --------------------------------------------------------------------- */
  function rafraichirTout() {
    majListeNotes();
    majTaches();
    majPlanning();
    majHistoriqueMinuteur();
    majObjectifs();
  }

  /* ---------------------------------------------------------------------
     Initialisation
     --------------------------------------------------------------------- */
  function initialiser() {
    racine = document.getElementById("espace-racine");
    if (!racine) return;

    var ongletDemande = App.param("onglet");
    var ongletConnu = ONGLETS.some(function (onglet) {
      return onglet.id === ongletDemande;
    });
    ongletActif = ongletConnu ? ongletDemande : "notes";

    racine.innerHTML =
      rendreEntete() +
      '<div class="conteneur section perso-espace">' +
      rendreOnglets() +
      rendrePanneaux() +
      "</div>";

    construirePanneauNotes();
    construirePanneauTaches();
    construirePanneauPlanning();
    construirePanneauMinuteur();
    construirePanneauObjectifs();
    brancherOnglets();

    Store.subscribe(function () {
      majListeNotes();
      majTaches();
      majPlanning();
      majHistoriqueMinuteur();
      majObjectifs();
    });

    activerOnglet(ongletActif, false);
  }

  App.onReady(initialiser);
})();
