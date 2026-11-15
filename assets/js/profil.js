/* ==========================================================================
   SepsHaness — page Profil (profil.html)
   Profil éditable, préférences de thème, statistiques du compte et gestion
   des données locales : export JSON, copie, import contrôlé, réinitialisation.
   API utilisées : App, Store, APP_DATA (voir docs/CONTRAT.md).
   ========================================================================== */
(function () {
  "use strict";

  var racine = null;
  var texteImporte = "";

  /* ---------------------------------------------------------------------
     Helpers
     --------------------------------------------------------------------- */
  function echapper(texte) {
    return App.escape(texte);
  }

  function icone(nom, taille) {
    return App.icon(nom, { taille: taille || 18 });
  }

  function jourISO(valeur) {
    var date = valeur instanceof Date ? valeur : new Date(valeur);
    if (isNaN(date.getTime())) return "";
    var mois = String(date.getMonth() + 1);
    var jour = String(date.getDate());
    return (
      date.getFullYear() + "-" + (mois.length < 2 ? "0" + mois : mois) + "-" + (jour.length < 2 ? "0" + jour : jour)
    );
  }

  function message(identifiant, texte, type) {
    var zone = document.getElementById(identifiant);
    if (!zone) return;
    zone.hidden = false;
    zone.className = "perso-message perso-message--" + (type || "succes");
    zone.textContent = texte;
  }

  function viderMessage(identifiant) {
    var zone = document.getElementById(identifiant);
    if (!zone) return;
    zone.hidden = true;
    zone.className = "perso-message";
    zone.textContent = "";
  }

  /* ---------------------------------------------------------------------
     En-tête
     --------------------------------------------------------------------- */
  function htmlEntete() {
    return (
      '<section class="entete-page"><div class="conteneur">' +
      '<nav class="fil-ariane" aria-label="Fil d\'Ariane">' +
      '<a href="index.html">Accueil</a><span class="fil-ariane__separateur" aria-hidden="true">/</span>' +
      '<span aria-current="page">Mon profil</span></nav>' +
      '<div class="entete-page__inner">' +
      '<div class="perso-profil-entete">' +
      '<span class="perso-avatar" id="profil-avatar" aria-hidden="true">?</span>' +
      "<div>" +
      '<span class="surtitre">Mon compte</span>' +
      '<h1 class="entete-page__titre">Mon profil</h1>' +
      '<p class="entete-page__texte">Personnalisez votre expérience d\'apprentissage : niveau, objectif hebdomadaire, matières préférées et thème.</p>' +
      "</div></div>" +
      '<div class="entete-page__actions">' +
      '<a class="btn btn--secondaire" href="suivi.html">' + icone("suivi", 18) + " Voir mon suivi</a>" +
      '<a class="btn btn--secondaire" href="espace-travail.html">' + icone("espace", 18) + " Espace de travail</a>" +
      "</div></div></div></section>"
    );
  }

  /* ---------------------------------------------------------------------
     Formulaire de profil
     --------------------------------------------------------------------- */
  function htmlFormulaire() {
    var niveaux = (window.APP_DATA ? APP_DATA.niveaux : [])
      .map(function (niveau) {
        return (
          '<option value="' + echapper(niveau.id) + '">' + echapper(niveau.nom) +
          (niveau.detail ? " — " + echapper(niveau.detail) : "") + "</option>"
        );
      })
      .join("");

    var matieres = (window.APP_DATA ? APP_DATA.matieres : [])
      .map(function (matiere) {
        var identifiant = "matiere-" + matiere.id;
        return (
          '<label class="case-a-cocher perso-matiere-case" for="' + identifiant + '">' +
          '<input type="checkbox" id="' + identifiant + '" name="matieres" value="' + echapper(matiere.id) + '" />' +
          "<span>" + echapper(matiere.nom) + "</span></label>"
        );
      })
      .join("");

    return (
      '<form class="carte perso-form-profil" id="profil-form" novalidate>' +
      '<h2 class="titre-3">Informations personnelles</h2>' +
      '<div class="champ"><label class="champ__label" for="profil-pseudo">Pseudo</label>' +
      '<input class="saisie" id="profil-pseudo" maxlength="60" autocomplete="nickname" aria-describedby="profil-pseudo-aide" placeholder="Ex. Amina" />' +
      '<span class="champ__aide" id="profil-pseudo-aide">60 caractères maximum. Il s\'affiche dans l\'en-tête et sur votre suivi.</span></div>' +
      '<div class="groupe-champ">' +
      '<div class="champ"><label class="champ__label" for="profil-niveau">Niveau scolaire</label>' +
      '<select class="liste-deroulante" id="profil-niveau">' + niveaux + "</select></div>" +
      '<div class="champ"><label class="champ__label" for="profil-objectif">Objectif hebdomadaire (minutes)</label>' +
      '<input class="saisie" id="profil-objectif" type="number" min="30" max="3000" step="15" inputmode="numeric" aria-describedby="profil-objectif-aide" />' +
      '<span class="champ__aide" id="profil-objectif-aide">4 h = 240 min. Entre 30 et 3000 minutes.</span></div></div>' +
      '<fieldset class="champ perso-pref-matieres">' +
      '<legend class="champ__label">Matières préférées (6 maximum)</legend>' +
      '<div class="perso-matieres">' + matieres + "</div>" +
      '<span class="champ__aide" id="profil-matieres-aide">0 / 6 matières sélectionnées</span></fieldset>' +
      '<div class="rangee rangee--entre perso-form-profil__pied">' +
      '<p class="perso-message" id="profil-message" role="status" aria-live="polite" hidden></p>' +
      '<button type="submit" class="btn btn--primaire">' + icone("check", 18) + " Enregistrer mon profil</button>" +
      "</div></form>"
    );
  }

  function htmlPreferences() {
    return (
      '<section class="carte perso-preferences" aria-labelledby="titre-preferences">' +
      '<div class="carte__entete">' +
      '<h2 class="titre-3" id="titre-preferences">Préférences</h2>' +
      '<span class="carte__icone" data-teinte="violet" aria-hidden="true">' + icone("soleil", 22) + "</span></div>" +
      '<div class="rangee rangee--entre perso-preference">' +
      "<div>" +
      '<p class="perso-preference__titre">Thème sombre</p>' +
      '<p class="petit texte-doux">Basculez entre le thème clair et le thème sombre. Le choix est conservé.</p>' +
      "</div>" +
      '<label class="perso-bascule" for="profil-theme">' +
      '<span class="sr-only">Activer le thème sombre</span>' +
      '<input type="checkbox" class="bascule" id="profil-theme" aria-label="Activer le thème sombre" />' +
      "</label></div>" +
      '<p class="petit texte-faible perso-preferences__note">' + icone("info", 15) +
      " Le thème et l\'ensemble de vos données sont enregistrés uniquement dans le stockage local de ce navigateur. Aucune donnée n'est envoyée sur Internet.</p>" +
      "</section>"
    );
  }

  function htmlStatistiques() {
    return (
      '<section class="carte perso-stats-carte" aria-labelledby="titre-stats">' +
      '<h2 class="titre-3" id="titre-stats">Statistiques du compte</h2>' +
      '<div class="perso-stats" id="profil-stats"></div>' +
      "</section>"
    );
  }

  function htmlDonnees() {
    return (
      '<section class="carte perso-donnees" aria-labelledby="titre-donnees">' +
      '<h2 class="titre-3" id="titre-donnees">Données</h2>' +
      '<p class="petit texte-doux">Votre espace de travail vit dans ce navigateur. Exportez-le régulièrement pour ne rien perdre, ou importez une sauvegarde sur un autre appareil.</p>' +
      '<div class="groupe-btn perso-donnees__actions">' +
      '<button type="button" class="btn btn--secondaire" id="donnees-exporter">' + icone("telecharger", 17) + " Exporter (JSON)</button>" +
      '<button type="button" class="btn btn--secondaire" id="donnees-copier">' + icone("lien", 17) + " Copier le JSON</button>" +
      "</div>" +
      '<div class="separateur"></div>' +
      '<h3 class="titre-4">Importer une sauvegarde</h3>' +
      '<div class="champ"><label class="champ__label" for="donnees-fichier">Fichier JSON</label>' +
      '<input class="saisie perso-fichier" type="file" id="donnees-fichier" accept=".json,application/json" /></div>' +
      '<div class="champ"><label class="champ__label" for="donnees-texte">Ou collez le contenu JSON</label>' +
      '<textarea class="zone-texte perso-zone-courte" id="donnees-texte" rows="4" placeholder=\'{"version":1,"profil":{...}}\' spellcheck="false"></textarea>' +
      '<span class="champ__aide">L\'import remplace l\'intégralité de vos données actuelles, après confirmation.</span></div>' +
      '<p class="perso-message" id="donnees-message" role="status" aria-live="polite" hidden></p>' +
      '<button type="button" class="btn btn--primaire" id="donnees-importer">' + icone("telecharger", 17) + " Importer et remplacer</button>" +
      '<div class="separateur"></div>' +
      '<h3 class="titre-4">Réinitialiser</h3>' +
      '<p class="petit texte-doux">Efface définitivement toutes les données locales : profil, progression, notes, tâches, sessions et badges. Une double confirmation vous sera demandée.</p>' +
      '<button type="button" class="btn btn--danger" id="donnees-reinit">' + icone("poubelle", 17) + " Réinitialiser mes données</button>" +
      "</section>"
    );
  }

  /* ---------------------------------------------------------------------
     Remplissage et statistiques
     --------------------------------------------------------------------- */
  function majAvatar() {
    var avatar = document.getElementById("profil-avatar");
    if (avatar) avatar.textContent = Store.initiales();
  }

  function majLimiteMatieres() {
    var cases = App.qsa('input[name="matieres"]', racine);
    var cochees = cases.filter(function (caseMatiere) {
      return caseMatiere.checked;
    });
    cases.forEach(function (caseMatiere) {
      caseMatiere.disabled = !caseMatiere.checked && cochees.length >= 6;
    });
    var aide = document.getElementById("profil-matieres-aide");
    if (aide) {
      aide.textContent =
        cochees.length + " / 6 matières sélectionnées" + (cochees.length >= 6 ? " (limite atteinte)" : "");
    }
  }

  function remplirFormulaire() {
    var profil = Store.profil();
    var pseudo = document.getElementById("profil-pseudo");
    var niveau = document.getElementById("profil-niveau");
    var objectif = document.getElementById("profil-objectif");
    var theme = document.getElementById("profil-theme");

    if (pseudo) pseudo.value = profil.pseudo || "";
    if (niveau) niveau.value = profil.niveau || "college";
    if (objectif) objectif.value = profil.objectifHebdo || 240;
    if (theme) theme.checked = Store.reglages().theme === "sombre";

    var preferees = profil.matieresPreferees || [];
    App.qsa('input[name="matieres"]', racine).forEach(function (caseMatiere) {
      caseMatiere.checked = preferees.indexOf(caseMatiere.value) !== -1;
    });
    majLimiteMatieres();
    majAvatar();
  }

  function ligneStat(libelle, valeur) {
    return (
      '<div class="perso-stat"><span class="perso-stat__libelle">' + echapper(libelle) + "</span>" +
      '<span class="perso-stat__valeur">' + valeur + "</span></div>"
    );
  }

  function majStatistiques() {
    var zone = document.getElementById("profil-stats");
    if (!zone) return;
    var profil = Store.profil();
    var progression = Store.progressionGlobale();
    var badgesObtenus = Store.badgesObtenus();
    var totalBadges = (window.APP_DATA ? APP_DATA.badges : []).length;

    zone.innerHTML =
      ligneStat("Compte créé le", echapper(App.date(profil.cree))) +
      ligneStat("Cours terminés", progression.termines + " / " + progression.total) +
      ligneStat("Notes personnelles", Store.notes().length) +
      ligneStat("Tâches", Store.taches().length) +
      ligneStat("Sessions enregistrées", Store.sessions().length) +
      ligneStat("Documents lus", Store.documentsLus()) +
      ligneStat("Badges obtenus", badgesObtenus.length + " / " + totalBadges);
  }

  /* ---------------------------------------------------------------------
     Thème
     --------------------------------------------------------------------- */
  function appliquerThemeDepuisStore() {
    var sombreVoulu = Store.reglages().theme === "sombre";
    var sombreActuel = document.documentElement.getAttribute("data-theme") === "sombre";
    if (sombreVoulu !== sombreActuel) App.basculerTheme();
    var theme = document.getElementById("profil-theme");
    if (theme) {
      theme.checked = sombreVoulu;
      theme.setAttribute(
        "aria-label",
        sombreVoulu ? "Désactiver le thème sombre" : "Activer le thème sombre"
      );
    }
  }

  /* ---------------------------------------------------------------------
     Export / import / réinitialisation
     --------------------------------------------------------------------- */
  function nomFichierExport() {
    return "sepshaness-sauvegarde-" + jourISO(new Date()) + ".json";
  }

  function exporter() {
    var texte = Store.exportJSON();
    var nom = nomFichierExport();
    try {
      var blob = new Blob([texte], { type: "application/json;charset=utf-8" });
      if (window.URL && URL.createObjectURL) {
        var url = URL.createObjectURL(blob);
        var lien = document.createElement("a");
        lien.href = url;
        lien.download = nom;
        lien.rel = "noopener";
        document.body.appendChild(lien);
        lien.click();
        document.body.removeChild(lien);
        window.setTimeout(function () {
          URL.revokeObjectURL(url);
        }, 1500);
        App.toast("Sauvegarde téléchargée : " + nom, { type: "succes" });
        return;
      }
    } catch (erreur) {
      /* repli ci-dessous */
    }
    try {
      var lienData = document.createElement("a");
      lienData.href = "data:application/json;charset=utf-8," + encodeURIComponent(texte);
      lienData.download = nom;
      document.body.appendChild(lienData);
      lienData.click();
      document.body.removeChild(lienData);
      App.toast("Sauvegarde téléchargée : " + nom, { type: "succes" });
    } catch (erreur) {
      message("donnees-message", "Le téléchargement a échoué dans ce navigateur. Utilisez « Copier le JSON » à la place.", "erreur");
    }
  }

  function copierJSON() {
    App.copier(Store.exportJSON()).then(function (ok) {
      if (ok) App.toast("JSON de sauvegarde copié dans le presse-papiers.", { type: "succes" });
      else
        message(
          "donnees-message",
          "La copie automatique a été refusée par le navigateur. Sélectionnez le JSON dans la zone de texte après l'avoir exporté.",
          "erreur"
        );
    });
  }

  function lireFichier(fichier) {
    if (!fichier) return;
    var lecteur = new FileReader();
    lecteur.onload = function () {
      texteImporte = String(lecteur.result || "");
      var zoneTexte = document.getElementById("donnees-texte");
      if (zoneTexte) zoneTexte.value = texteImporte;
      viderMessage("donnees-message");
      message("donnees-message", "Fichier chargé. Cliquez sur « Importer et remplacer » pour appliquer la sauvegarde.", "info");
    };
    lecteur.onerror = function () {
      message("donnees-message", "Impossible de lire ce fichier. Vérifiez qu'il s'agit bien d'un fichier texte JSON.", "erreur");
    };
    lecteur.readAsText(fichier);
  }

  function importer() {
    var zoneTexte = document.getElementById("donnees-texte");
    var contenu = zoneTexte && zoneTexte.value.trim() ? zoneTexte.value.trim() : texteImporte.trim();
    if (!contenu) {
      message("donnees-message", "Choisissez un fichier JSON ou collez le contenu d'une sauvegarde avant d'importer.", "erreur");
      if (zoneTexte) zoneTexte.focus();
      return;
    }

    var donnees;
    try {
      donnees = JSON.parse(contenu);
    } catch (erreur) {
      message(
        "donnees-message",
        "Le texte fourni n'est pas un JSON valide. Vérifiez que vous avez collé le fichier complet, sans le modifier.",
        "erreur"
      );
      return;
    }
    if (!donnees || typeof donnees !== "object" || !donnees.profil) {
      message(
        "donnees-message",
        "Ce fichier ne ressemble pas à une sauvegarde SepsHaness : le bloc « profil » est absent.",
        "erreur"
      );
      return;
    }
    if (!Array.isArray(donnees.notes) || !Array.isArray(donnees.sessions)) {
      message(
        "donnees-message",
        "Sauvegarde incomplète : les listes « notes » et « sessions » sont nécessaires pour restaurer votre espace de travail.",
        "erreur"
      );
      return;
    }

    App.confirmer({
      titre: "Importer une sauvegarde",
      message:
        "L'import remplacera toutes vos données actuelles (progression, notes, tâches, sessions, profil). Continuer ?",
      libelleOk: "Remplacer mes données",
      danger: true
    }).then(function (confirme) {
      if (!confirme) return;
      var succes = Store.importJSON(contenu);
      if (!succes) {
        message(
          "donnees-message",
          "L'import a échoué : la sauvegarde n'a pas pu être appliquée. Vérifiez son contenu puis réessayez.",
          "erreur"
        );
        return;
      }
      texteImporte = "";
      if (zoneTexte) zoneTexte.value = "";
      var champFichier = document.getElementById("donnees-fichier");
      if (champFichier) champFichier.value = "";
      remplirFormulaire();
      majStatistiques();
      appliquerThemeDepuisStore();
      message("donnees-message", "Sauvegarde importée : votre espace de travail a été remplacé.", "succes");
      App.toast("Import terminé avec succès.", { type: "succes" });
    });
  }

  function reinitialiser() {
    App.confirmer({
      titre: "Réinitialiser vos données",
      message:
        "Cette action efface toute votre progression, vos notes, vos tâches, vos sessions et votre profil. Voulez-vous continuer ?",
      libelleOk: "Continuer",
      danger: true
    }).then(function (premiere) {
      if (!premiere) return;
      return App.confirmer({
        titre: "Confirmation définitive",
        message:
          "Dernière vérification : toutes vos données locales seront définitivement perdues. Confirmer la réinitialisation ?",
        libelleOk: "Tout effacer",
        libelleAnnuler: "Annuler",
        danger: true
      }).then(function (seconde) {
        if (!seconde) return;
        Store.reset();
        texteImporte = "";
        var zoneTexte = document.getElementById("donnees-texte");
        if (zoneTexte) zoneTexte.value = "";
        var champFichier = document.getElementById("donnees-fichier");
        if (champFichier) champFichier.value = "";
        remplirFormulaire();
        majStatistiques();
        appliquerThemeDepuisStore();
        viderMessage("profil-message");
        message(
          "donnees-message",
          "Vos données ont été réinitialisées. Votre espace de travail est de nouveau vide.",
          "succes"
        );
        App.toast("Données réinitialisées.", { type: "info" });
      });
    });
  }

  /* ---------------------------------------------------------------------
     Liaisons
     --------------------------------------------------------------------- */
  function brancherFormulaire() {
    var formulaire = document.getElementById("profil-form");
    if (!formulaire) return;

    App.qsa('input[name="matieres"]', racine).forEach(function (caseMatiere) {
      caseMatiere.addEventListener("change", majLimiteMatieres);
    });

    formulaire.addEventListener("submit", function (evenement) {
      evenement.preventDefault();
      var champPseudo = document.getElementById("profil-pseudo");
      var champNiveau = document.getElementById("profil-niveau");
      var champObjectif = document.getElementById("profil-objectif");
      var pseudo = champPseudo.value.trim();
      var objectif = Math.round(Number(champObjectif.value));

      if (pseudo.length > 60) {
        message("profil-message", "Le pseudo ne doit pas dépasser 60 caractères.", "erreur");
        champPseudo.focus();
        return;
      }
      if (!isFinite(objectif) || objectif < 30 || objectif > 3000) {
        message(
          "profil-message",
          "L'objectif doit être un nombre de minutes entre 30 et 3000 (4 h = 240 min).",
          "erreur"
        );
        champObjectif.focus();
        return;
      }

      var matieres = App.qsa('input[name="matieres"]:checked', racine)
        .map(function (caseMatiere) {
          return caseMatiere.value;
        })
        .slice(0, 6);

      Store.majProfil({
        pseudo: pseudo,
        niveau: champNiveau.value || "college",
        objectifHebdo: objectif,
        matieresPreferees: matieres
      });

      champPseudo.value = pseudo;
      champObjectif.value = objectif;
      majLimiteMatieres();
      message("profil-message", "Profil enregistré. Vos préférences sont prises en compte.", "succes");
      App.toast("Profil enregistré.", { type: "succes" });
      majAvatar();
      majStatistiques();
    });
  }

  function brancherPreferences() {
    var theme = document.getElementById("profil-theme");
    if (!theme) return;
    theme.addEventListener("change", function () {
      var sombreVoulu = theme.checked;
      var sombreActuel = document.documentElement.getAttribute("data-theme") === "sombre";
      if (sombreVoulu !== sombreActuel) App.basculerTheme();
      theme.setAttribute(
        "aria-label",
        sombreVoulu ? "Désactiver le thème sombre" : "Activer le thème sombre"
      );
      App.toast(sombreVoulu ? "Thème sombre activé." : "Thème clair activé.", { type: "info" });
    });
  }

  function brancherDonnees() {
    var boutonExporter = document.getElementById("donnees-exporter");
    if (boutonExporter) boutonExporter.addEventListener("click", exporter);

    var boutonCopier = document.getElementById("donnees-copier");
    if (boutonCopier) boutonCopier.addEventListener("click", copierJSON);

    var champFichier = document.getElementById("donnees-fichier");
    if (champFichier) {
      champFichier.addEventListener("change", function () {
        var fichier = champFichier.files && champFichier.files[0];
        if (fichier) lireFichier(fichier);
      });
    }

    var boutonImporter = document.getElementById("donnees-importer");
    if (boutonImporter) boutonImporter.addEventListener("click", importer);

    var boutonReinit = document.getElementById("donnees-reinit");
    if (boutonReinit) boutonReinit.addEventListener("click", reinitialiser);
  }

  /* ---------------------------------------------------------------------
     Initialisation
     --------------------------------------------------------------------- */
  function initialiser() {
    racine = document.getElementById("profil-racine");
    if (!racine) return;

    racine.innerHTML =
      htmlEntete() +
      '<div class="conteneur section perso-profil">' +
      '<div class="perso-profil-grille">' +
      '<div class="perso-profil-colonne">' +
      htmlFormulaire() +
      htmlPreferences() +
      "</div>" +
      '<div class="perso-profil-colonne">' +
      htmlStatistiques() +
      htmlDonnees() +
      "</div></div></div>";

    remplirFormulaire();
    majStatistiques();
    brancherFormulaire();
    brancherPreferences();
    brancherDonnees();

    Store.subscribe(function () {
      majStatistiques();
      majAvatar();
    });
  }

  App.onReady(initialiser);
})();
