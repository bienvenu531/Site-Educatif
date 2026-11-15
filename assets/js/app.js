/* ==========================================================================
   SepsHaness — noyau applicatif
   Coquille (en-tête, pied de page), icônes, thème, helpers d'affichage.
   API publique : window.App (voir docs/CONTRAT.md §8).
   ========================================================================== */
(function () {
  "use strict";

  /* ---------------------------------------------------------------------
     Icônes (tracés 24 × 24, style trait)
     --------------------------------------------------------------------- */
  var ICONES = {
    accueil: '<path d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
    parcours: '<path d="M6 19V9a3 3 0 0 1 3-3h6a3 3 0 0 1 0 6H9"/><circle cx="6" cy="19" r="1.7"/><circle cx="18" cy="12" r="1.7"/>',
    livre: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 3H20v18H6.5A2.5 2.5 0 0 1 4 18.5v-13A2.5 2.5 0 0 1 6.5 3z"/>',
    bibliotheque: '<path d="M5 4h4v16H5zM11 4h4v16h-4zM18 5l3 15"/>',
    espace: '<rect x="3" y="5" width="18" height="11" rx="1.5"/><path d="M8 20h8M12 16v4"/>',
    suivi: '<path d="M4 19V5M4 19h16"/><path d="M7 15l4-5 3 3 5-7"/>',
    profil: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    recherche: '<circle cx="11" cy="11" r="7"/><path d="M16.5 16.5 21 21"/>',
    filtre: '<path d="M4 5h16l-6 8v6l-4 2v-8z"/>',
    "fleche-droite": '<path d="M5 12h14M13 6l6 6-6 6"/>',
    "fleche-gauche": '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    "fleche-haut": '<path d="M12 19V5M6 11l6-6 6 6"/>',
    check: '<path d="M5 13l4 4L19 7"/>',
    croix: '<path d="M6 6l12 12M18 6 6 18"/>',
    fermer: '<path d="M6 6l12 12M18 6 6 18"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    poubelle: '<path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13"/>',
    crayon: '<path d="M4 20h4L20 8l-4-4L4 16z"/><path d="M13 7l4 4"/>',
    horloge: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    calendrier: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    etoile: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
    feu: '<path d="M12 3c3 4 5 6.5 5 9.5a5 5 0 0 1-10 0C7 9.5 9 7 12 3z"/><path d="M12 20a2.5 2.5 0 0 1 0-5"/>',
    trophee: '<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H5v1a3 3 0 0 0 3 3M16 6h3v1a3 3 0 0 1-3 3"/><path d="M12 13v4M9 21h6M10 17h4"/>',
    cible: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4"/>',
    sigma: '<path d="M18 5H7l6 7-6 7h11"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14 0 18M12 3C9 6.5 9 17.5 12 21"/>',
    monde: '<circle cx="12" cy="12" r="9"/><path d="M3.5 9h17M3.5 15h17M12 3v18"/>',
    code: '<path d="M8 8l-5 4 5 4M16 8l5 4-5 4M14 5l-4 14"/>',
    atome: '<circle cx="12" cy="12" r="1.8"/><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-60 12 12)"/>',
    bulle: '<path d="M21 12a8 8 0 0 1-8 8H8l-5 3 1.5-5A8 8 0 1 1 21 12z"/>',
    graphique: '<path d="M4 20V4M4 20h16"/><path d="M8 16v-5M12 16V8M16 16v-3"/>',
    telecharger: '<path d="M12 4v11M8 11l4 4 4-4M5 20h14"/>',
    lecteur: '<path d="M8 5l11 7-11 7z" fill="currentColor" stroke="none"/>',
    play: '<path d="M8 5l11 7-11 7z" fill="currentColor" stroke="none"/>',
    pause: '<path d="M9 5v14M15 5v14"/>',
    reinitialiser: '<path d="M4 12a8 8 0 1 0 2.4-5.7"/><path d="M4 4v5h5"/>',
    soleil: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19"/>',
    lune: '<path d="M20 14A8 8 0 0 1 10 4a8 8 0 1 0 10 10z"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    alerte: '<path d="M12 3l9 17H3z"/><path d="M12 9v5M12 17h.01"/>',
    succes: '<circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/>',
    document: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
    fiche: '<rect x="5" y="4" width="14" height="16" rx="1.5"/><path d="M8 8h8M8 12h8M8 16h5"/>',
    methode: '<path d="M4 6l2 2 3-3M4 13l2 2 3-3M4 20l2 2 3-3M12 6h8M12 13h8M12 20h8"/>',
    annale: '<path d="M5 3h9l5 5v13H5z"/><path d="M14 3v5h5M9 14l2 2 4-4"/>',
    formulaire: '<rect x="5" y="4" width="14" height="16" rx="1.5"/><path d="M8 8h8M8 12h3M13 12h3M8 16h3M13 16h3"/>',
    carte: '<path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3z"/><path d="M9 3v15M15 6v15"/>',
    protocole: '<path d="M9 3h6M10 3v6l-4 8a2 2 0 0 0 1.8 3h8.4A2 2 0 0 0 18 17l-4-8V3"/><path d="M7 15h10"/>',
    tache: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 12l2 2 5-5"/>',
    note: '<path d="M5 3h10l4 4v14H5z"/><path d="M9 8h5M9 12h6M9 16h4"/>',
    minuteur: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2M9 2h6"/>',
    objectif: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none"/>',
    loupe: '<circle cx="11" cy="11" r="7"/><path d="M16.5 16.5 21 21"/>',
    "chevron-bas": '<path d="M6 9l6 6 6-6"/>',
    "chevron-haut": '<path d="M6 15l6-6 6 6"/>',
    lien: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3A4 4 0 0 0 13 5.3L11.5 7"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3A4 4 0 0 0 11 18.7L12.5 17"/>',
    externe: '<path d="M14 4h6v6M20 4l-9 9M18 14v5H5V6h5"/>',
    imprimer: '<path d="M7 8V3h10v5M7 17H5V9h14v8h-2"/><path d="M7 13h10v8H7z"/>',
    partage: '<path d="M12 16V4M8 8l4-4 4 4M5 14v6h14v-6"/>',
    utilisateur: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    mail: '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 7l9 6 9-6"/>',
    medaille: '<circle cx="12" cy="15" r="6"/><path d="M8 4l2 5M16 4l-2 5"/><path d="M12 12l1 2 2 .3-1.5 1.4.4 2-1.9-1-1.9 1 .4-2L9 14.3l2-.3z"/>',
    courbe: '<path d="M4 18l5-6 4 3 7-9"/>',
    etude: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5"/>'
  };

  /* ---------------------------------------------------------------------
     Icônes et création DOM
     --------------------------------------------------------------------- */
  function icone(nom, options) {
    var reglages = options || {};
    var contenu = ICONES[nom] || ICONES.document;
    var taille = reglages.taille || 20;
    return (
      '<svg class="icone' +
      (reglages.classe ? " " + reglages.classe : "") +
      '" width="' + taille + '" height="' + taille +
      '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
      contenu +
      "</svg>"
    );
  }

  function hydraterIcones(racine) {
    Array.prototype.forEach.call((racine || document).querySelectorAll("[data-icon]"), function (element) {
      var nom = element.getAttribute("data-icon");
      if (!nom || element.getAttribute("data-icon-fait")) return;
      element.innerHTML = icone(nom, {
        taille: Number(element.getAttribute("data-taille")) || 20,
        classe: element.getAttribute("data-classe") || ""
      });
      element.setAttribute("data-icon-fait", "1");
    });
  }

  function el(balise, attributs, enfants) {
    var element = document.createElement(balise);
    var reglages = attributs || {};
    Object.keys(reglages).forEach(function (cle) {
      var valeur = reglages[cle];
      if (valeur === undefined || valeur === null) return;
      if (cle === "class" || cle === "className") {
        element.setAttribute("class", valeur);
      } else if (cle === "text") {
        element.textContent = valeur;
      } else if (cle === "html") {
        element.innerHTML = valeur;
      } else if (cle === "dataset") {
        Object.keys(valeur).forEach(function (donnee) {
          element.dataset[donnee] = valeur[donnee];
        });
      } else if (cle === "on") {
        Object.keys(valeur).forEach(function (evenement) {
          element.addEventListener(evenement, valeur[evenement]);
        });
      } else if (cle === "for") {
        element.setAttribute("for", valeur);
      } else if (cle in element) {
        element[cle] = valeur;
      } else {
        element.setAttribute(cle, valeur);
      }
    });
    [].concat(enfants || []).forEach(function (enfant) {
      if (enfant === null || enfant === undefined) return;
      element.appendChild(typeof enfant === "string" ? document.createTextNode(enfant) : enfant);
    });
    return element;
  }

  function qs(selecteur, racine) {
    return (racine || document).querySelector(selecteur);
  }

  function qsa(selecteur, racine) {
    return Array.prototype.slice.call((racine || document).querySelectorAll(selecteur));
  }

  function escape(texte) {
    return String(texte == null ? "" : texte)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /* ---------------------------------------------------------------------
     Formatage
     --------------------------------------------------------------------- */
  function versDate(valeur) {
    if (!valeur) return null;
    if (valeur instanceof Date) return isNaN(valeur.getTime()) ? null : valeur;
    var texte = String(valeur);
    var simple = texte.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (simple) return new Date(Number(simple[1]), Number(simple[2]) - 1, Number(simple[3]));
    var date = new Date(texte);
    return isNaN(date.getTime()) ? null : date;
  }

  function date(valeur, options) {
    var reglages = options || {};
    var d = versDate(valeur);
    if (!d) return "—";
    return d.toLocaleDateString("fr-FR", {
      weekday: reglages.long ? "long" : undefined,
      day: "numeric",
      month: reglages.long ? "long" : "short",
      year: "numeric"
    });
  }

  function differenceJours(cible) {
    var d = versDate(cible);
    if (!d) return null;
    var base = new Date();
    var jourBase = new Date(base.getFullYear(), base.getMonth(), base.getDate());
    return Math.round((d.getTime() - jourBase.getTime()) / 86400000);
  }

  function relative(valeur) {
    var jours = differenceJours(valeur);
    if (jours === null) return "—";
    if (jours === 0) return "aujourd'hui";
    if (jours === 1) return "demain";
    if (jours === -1) return "hier";
    if (jours > 1 && jours <= 30) return "dans " + jours + " jours";
    if (jours < -1 && jours >= -30) return "il y a " + Math.abs(jours) + " jours";
    return date(valeur);
  }

  function echeance(valeur) {
    var jours = differenceJours(valeur);
    if (jours === null) return "";
    if (jours < 0) return "En retard de " + Math.abs(jours) + " j";
    if (jours === 0) return "Aujourd'hui";
    if (jours === 1) return "Demain";
    return date(valeur);
  }

  function duree(minutes) {
    var valeur = Math.max(0, Math.round(Number(minutes) || 0));
    if (valeur < 60) return valeur + " min";
    var heures = Math.floor(valeur / 60);
    var reste = valeur % 60;
    return reste ? heures + " h " + (reste < 10 ? "0" + reste : reste) : heures + " h";
  }

  function nombre(valeur) {
    try {
      return new Intl.NumberFormat("fr-FR").format(Number(valeur) || 0);
    } catch (erreur) {
      return String(valeur);
    }
  }

  function pourcentage(valeur) {
    return Math.round(Number(valeur) || 0) + " %";
  }

  /* ---------------------------------------------------------------------
     Notifications et modales
     --------------------------------------------------------------------- */
  function conteneurToasts() {
    var conteneur = qs("#toasts");
    if (!conteneur) {
      conteneur = el("div", { class: "toasts", id: "toasts", role: "status", "aria-live": "polite" });
      document.body.appendChild(conteneur);
    }
    return conteneur;
  }

  function toast(message, options) {
    var reglages = options || {};
    var type = reglages.type || "succes";
    var icones = { succes: "succes", info: "info", erreur: "alerte", alerte: "alerte" };
    var element = el("div", { class: "toast toast--" + type });
    element.innerHTML =
      '<span class="toast__icone">' + icone(icones[type] || "info", { taille: 18 }) + "</span>" +
      '<span class="toast__texte">' + escape(message) + "</span>";
    element.addEventListener("click", function () {
      retirer();
    });
    conteneurToasts().appendChild(element);

    var minuteur = window.setTimeout(retirer, 4200);
    function retirer() {
      window.clearTimeout(minuteur);
      element.classList.add("toast--sortie");
      window.setTimeout(function () {
        if (element.parentNode) element.parentNode.removeChild(element);
      }, 220);
    }
    return element;
  }

  var etatModale = { ouverte: false, focus: null, ecouteur: null, element: null };

  function fermerModal() {
    if (!etatModale.ouverte) return;
    var precedent = etatModale.focus;
    if (etatModale.ecouteur) document.removeEventListener("keydown", etatModale.ecouteur);
    var voile = qs(".modale-voile");
    if (voile && voile.parentNode) voile.parentNode.removeChild(voile);
    document.documentElement.classList.remove("modale-ouverte");
    etatModale = { ouverte: false, focus: null, ecouteur: null, element: null };
    if (precedent && precedent.focus) {
      try {
        precedent.focus();
      } catch (erreur) {
        /* ignoré */
      }
    }
  }

  function modal(options) {
    var reglages = options || {};
    fermerModal();
    var focusPrecedent = document.activeElement;

    var voile = el("div", { class: "modale-voile" });
    var boite = el("div", {
      class: "modale" + (reglages.taille === "lg" ? " modale--lg" : ""),
      role: "dialog",
      "aria-modal": "true",
      tabindex: "-1"
    });

    var identifiantTitre = "titre-modale-" + Date.now();
    boite.setAttribute("aria-labelledby", identifiantTitre);

    var entete = el("div", { class: "modale__entete" });
    entete.innerHTML =
      '<h2 class="modale__titre" id="' + identifiantTitre + '">' + escape(reglages.titre || "") + "</h2>";
    var boutonFermer = el("button", {
      class: "btn btn--icone btn--fantome modale__fermer",
      type: "button",
      "aria-label": "Fermer",
      html: icone("fermer", { taille: 20 })
    });
    boutonFermer.addEventListener("click", fermerModal);
    entete.appendChild(boutonFermer);

    var corps = el("div", { class: "modale__corps" });
    if (typeof reglages.contenu === "string") corps.innerHTML = reglages.contenu;
    else if (reglages.contenu) corps.appendChild(reglages.contenu);

    boite.appendChild(entete);
    boite.appendChild(corps);

    if (reglages.actions && reglages.actions.length) {
      var pied = el("div", { class: "modale__pied" });
      reglages.actions.forEach(function (action) {
        var bouton = el("button", {
          class: "btn " + (action.type === "primaire" ? "btn--primaire" : action.type === "danger" ? "btn--danger" : "btn--secondaire"),
          type: "button",
          text: action.libelle || "OK"
        });
        bouton.addEventListener("click", function () {
          var garder = false;
          if (typeof action.onClick === "function") garder = action.onClick(corps) === false;
          if (action.fermer === false) return;
          if (!garder) fermerModal();
        });
        pied.appendChild(bouton);
      });
      boite.appendChild(pied);
    }

    voile.appendChild(boite);
    document.body.appendChild(voile);
    document.documentElement.classList.add("modale-ouverte");

    voile.addEventListener("mousedown", function (evenement) {
      if (evenement.target === voile) fermerModal();
    });

    var ecouteur = function (evenement) {
      if (evenement.key === "Escape") {
        evenement.preventDefault();
        fermerModal();
      }
      if (evenement.key === "Tab") {
        var focusables = qsa(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
          boite
        ).filter(function (element) {
          return element.offsetParent !== null;
        });
        if (!focusables.length) return;
        var premier = focusables[0];
        var dernier = focusables[focusables.length - 1];
        if (evenement.shiftKey && document.activeElement === premier) {
          evenement.preventDefault();
          dernier.focus();
        } else if (!evenement.shiftKey && document.activeElement === dernier) {
          evenement.preventDefault();
          premier.focus();
        }
      }
    };
    document.addEventListener("keydown", ecouteur);

    etatModale = { ouverte: true, focus: focusPrecedent, ecouteur: ecouteur, element: boite };
    window.setTimeout(function () {
      var premier = qs('a[href], button:not([disabled]), textarea, input, select', boite);
      (premier || boite).focus();
    }, 30);

    return { element: boite, corps: corps, fermer: fermerModal };
  }

  function confirmer(options) {
    var reglages = options || {};
    return new Promise(function (resoudre) {
      var repondu = false;
      modal({
        titre: reglages.titre || "Confirmer",
        contenu: '<p class="plomb">' + escape(reglages.message || "Confirmer cette action ?") + "</p>",
        actions: [
          {
            libelle: reglages.libelleAnnuler || "Annuler",
            type: "secondaire",
            onClick: function () {
              repondu = true;
              resoudre(false);
            }
          },
          {
            libelle: reglages.libelleOk || "Confirmer",
            type: reglages.danger ? "danger" : "primaire",
            onClick: function () {
              repondu = true;
              resoudre(true);
            }
          }
        ]
      });
      var verifier = window.setInterval(function () {
        if (!etatModale.ouverte) {
          window.clearInterval(verifier);
          if (!repondu) resoudre(false);
        }
      }, 250);
    });
  }

  function majModalOuverte() {
    return etatModale.ouverte;
  }

  /* ---------------------------------------------------------------------
     Thème et coquille
     --------------------------------------------------------------------- */
  function appliquerTheme() {
    var reglages = window.Store ? Store.reglages() : { theme: "clair" };
    var theme = reglages.theme === "sombre" ? "sombre" : "clair";
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.style.colorScheme = theme === "sombre" ? "dark" : "light";
    majBoutonTheme();
  }

  function majBoutonTheme() {
    var bouton = qs("#bouton-theme");
    if (!bouton) return;
    var sombre = document.documentElement.getAttribute("data-theme") === "sombre";
    bouton.innerHTML = icone(sombre ? "soleil" : "lune", { taille: 19 });
    bouton.setAttribute("aria-label", sombre ? "Activer le thème clair" : "Activer le thème sombre");
    bouton.setAttribute("title", sombre ? "Thème clair" : "Thème sombre");
  }

  function basculerTheme() {
    var sombre = document.documentElement.getAttribute("data-theme") === "sombre";
    if (window.Store) Store.majReglages({ theme: sombre ? "clair" : "sombre" });
    document.documentElement.setAttribute("data-theme", sombre ? "clair" : "sombre");
    document.documentElement.style.colorScheme = sombre ? "light" : "dark";
    majBoutonTheme();
  }

  var LIENS_NAV = [
    { page: "accueil", libelle: "Accueil", href: "index.html", icone: "accueil" },
    { page: "parcours", libelle: "Parcours", href: "parcours.html", icone: "parcours" },
    { page: "cours", libelle: "Cours", href: "cours.html", icone: "livre" },
    { page: "bibliotheque", libelle: "Bibliothèque", href: "bibliotheque.html", icone: "bibliotheque" },
    { page: "espace-travail", libelle: "Espace de travail", href: "espace-travail.html", icone: "espace" },
    { page: "suivi", libelle: "Suivi", href: "suivi.html", icone: "suivi" }
  ];

  function lienLogo() {
    return (
      '<a class="logo" href="index.html" aria-label="SepsHaness — accueil">' +
      '<span class="logo__marque" aria-hidden="true">' +
      '<svg viewBox="0 0 40 40" width="38" height="38" role="img" aria-hidden="true">' +
      '<rect width="40" height="40" rx="12" fill="var(--c-primaire)"/>' +
      '<path d="M20 14.2c-2.5-1.5-5.9-1.9-8.8-1.9v12.4c2.9 0 6.3.4 8.8 1.9 2.5-1.5 5.9-1.9 8.8-1.9V12.3c-2.9 0-6.3.4-8.8 1.9z" fill="#fff"/>' +
      '<path d="M20 14.2v12.4" stroke="var(--c-primaire)" stroke-width="1.6" stroke-linecap="round"/>' +
      '</svg></span>' +
      '<span class="logo__texte"><strong>SepsHaness</strong><small>Apprendre, progresser</small></span>' +
      "</a>"
    );
  }

  function construireEntete() {
    var cible = qs("#app-header");
    if (!cible) return;
    var page = document.body.getAttribute("data-page") || "";
    var liens = LIENS_NAV.map(function (lien) {
      var actif = lien.page === page;
      return (
        '<a href="' + lien.href + '"' + (actif ? ' aria-current="page"' : "") + ">" +
        '<span class="nav-principale__icone" data-icon="' + lien.icone + '"></span>' +
        "<span>" + lien.libelle + "</span></a>"
      );
    }).join("");

    cible.innerHTML =
      '<header class="entete-site">' +
      '<div class="conteneur entete-site__inner">' +
      lienLogo() +
      '<nav class="nav-principale" id="nav-principale" aria-label="Navigation principale">' + liens + "</nav>" +
      '<div class="actions-entete">' +
      '<button type="button" class="btn btn--icone btn--fantome" id="bouton-theme" aria-label="Changer de thème"></button>' +
      '<a class="lien-profil" href="profil.html" aria-label="Mon profil" title="Mon profil">' +
      '<span class="avatar" id="avatar-entete">?</span>' +
      '<span class="lien-profil__texte">Mon profil</span></a>' +
      '<button type="button" class="btn btn--icone btn--fantome bouton-menu" id="bouton-menu" ' +
      'aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="nav-principale">' +
      icone("menu", { taille: 22 }) +
      "</button>" +
      "</div></div></header>";

    var boutonTheme = qs("#bouton-theme");
    if (boutonTheme) boutonTheme.addEventListener("click", basculerTheme);

    var boutonMenu = qs("#bouton-menu");
    var nav = qs("#nav-principale");
    if (boutonMenu && nav) {
      boutonMenu.addEventListener("click", function () {
        var ouvert = nav.classList.toggle("nav-principale--ouverte");
        boutonMenu.setAttribute("aria-expanded", ouvert ? "true" : "false");
        boutonMenu.setAttribute("aria-label", ouvert ? "Fermer le menu" : "Ouvrir le menu");
        boutonMenu.innerHTML = icone(ouvert ? "fermer" : "menu", { taille: 22 });
      });
      qsa("a", nav).forEach(function (lien) {
        lien.addEventListener("click", function () {
          nav.classList.remove("nav-principale--ouverte");
          boutonMenu.setAttribute("aria-expanded", "false");
        });
      });
    }

    majEntete();
    hydraterIcones(cible);
  }

  function majEntete() {
    var avatar = qs("#avatar-entete");
    if (avatar) {
      var profil = window.Store ? Store.profil() : { pseudo: "" };
      var initiales = window.Store ? Store.initiales() : "?";
      if (initiales === "?") {
        avatar.classList.add("avatar--icone");
        avatar.innerHTML = icone("utilisateur", { taille: 17 });
      } else {
        avatar.classList.remove("avatar--icone");
        avatar.textContent = initiales;
      }
      var lienProfil = avatar.closest(".lien-profil");
      if (lienProfil) {
        lienProfil.setAttribute("title", profil.pseudo ? "Profil de " + profil.pseudo : "Mon profil");
        lienProfil.setAttribute("aria-label", profil.pseudo ? "Profil de " + profil.pseudo : "Mon profil");
      }
    }
  }

  function construirePied() {
    var cible = qs("#app-footer");
    if (!cible) return;
    var compteur = window.APP_DATA ? APP_DATA.compter() : { cours: 0, documents: 0 };
    cible.innerHTML =
      '<footer class="pied-site">' +
      '<div class="conteneur">' +
      '<div class="pied-site__grille">' +
      '<div class="pied-site__colonne pied-site__marque">' +
      lienLogo() +
      '<p class="petit texte-doux">Un espace d\'apprentissage pour les élèves et les étudiants : cours, documents, espace de travail et suivi de progression.</p>' +
      '<p class="micro texte-faible">' + nombre(compteur.cours) + " cours · " + nombre(compteur.documents) + " documents · 4 niveaux</p>" +
      "</div>" +
      '<div class="pied-site__colonne"><h3 class="pied-site__titre">Apprendre</h3>' +
      '<a href="parcours.html">Parcours guidés</a><a href="cours.html">Catalogue des cours</a><a href="bibliotheque.html">Bibliothèque</a></div>' +
      '<div class="pied-site__colonne"><h3 class="pied-site__titre">Organiser</h3>' +
      '<a href="espace-travail.html">Espace de travail</a><a href="suivi.html">Suivi de progression</a><a href="profil.html">Mon profil</a></div>' +
      '<div class="pied-site__colonne"><h3 class="pied-site__titre">Bon à savoir</h3>' +
      '<p class="petit texte-doux">Progression et notes sont enregistrées uniquement dans votre navigateur.</p>' +
      '<p class="petit texte-doux">Aucun compte, aucune donnée envoyée sur Internet.</p></div>' +
      "</div>" +
      '<div class="pied-site__bas"><span>© 2026 SepsHaness — projet pédagogique</span>' +
      '<span>Fait avec soin, sans publicité.</span></div>' +
      "</div></footer>";
  }

  /* ---------------------------------------------------------------------
     Cartes de cours partagées
     --------------------------------------------------------------------- */
  function carteCours(cours, options) {
    if (!cours) return "";
    var reglages = options || {};
    var matiere = window.APP_DATA ? APP_DATA.matiere(cours.matiere) : { nom: cours.matiere, teinte: "indigo", icone: "livre" };
    var niveau = window.APP_DATA ? APP_DATA.niveau(cours.niveau) : { nom: cours.niveau, teinte: "indigo" };
    var difficulte = window.APP_DATA ? APP_DATA.libelleDifficulte(cours.difficulte) : { nom: "", teinte: "slate" };
    var etatLecon = window.Store ? Store.lecon(cours.slug) : { statut: "jamais" };
    var termine = etatLecon.statut === "termine";
    var enCours = etatLecon.statut === "en-cours";
    var score = etatLecon.score;

    var etiquette;
    if (termine) etiquette = '<span class="etiquette etiquette--succes">' + icone("check", { taille: 13 }) + " Terminé</span>";
    else if (enCours) etiquette = '<span class="etiquette etiquette--info">En cours</span>';
    else etiquette = '<span class="etiquette etiquette--neutre">À découvrir</span>';

    var bas;
    if (termine && score != null) {
      bas = '<div class="carte-cours__progression"><div class="jauge jauge--fine"><span class="jauge__remplissage" style="width:' + Math.round(score) + '%"></span></div><span class="micro texte-doux">Meilleur score : ' + Math.round(score) + " %</span></div>";
    } else if (enCours) {
      bas = '<div class="carte-cours__progression"><div class="jauge jauge--fine"><span class="jauge__remplissage" style="width:45%"></span></div><span class="micro texte-doux">Reprendre où vous en étiez</span></div>';
    } else {
      bas = '<div class="carte-cours__progression"><span class="micro texte-faible">' + (cours.quiz ? cours.quiz.length : 0) + " question" + (cours.quiz && cours.quiz.length > 1 ? "s" : "") + " de quiz</span></div>";
    }

    return (
      '<article class="carte-cours" data-teinte="' + escape(matiere.teinte) + '">' +
      '<div class="carte-cours__haut">' +
      '<span class="carte-cours__icone" aria-hidden="true">' + icone(matiere.icone, { taille: 22 }) + "</span>" +
      '<span class="carte-cours__niveau">' + escape(niveau.nom) + (cours.classe ? " · " + escape(cours.classe) : "") + "</span>" +
      "</div>" +
      '<h3 class="carte-cours__titre"><a href="lecon.html?cours=' + encodeURIComponent(cours.slug) + '">' + escape(cours.titre) + "</a></h3>" +
      '<p class="carte-cours__resume">' + escape(cours.resume || "") + "</p>" +
      '<div class="carte-cours__meta">' +
      '<span class="puce">' + icone("horloge", { taille: 14 }) + escape(duree(cours.duree)) + "</span>" +
      '<span class="puce">' + icone("cible", { taille: 14 }) + escape(difficulte.nom) + "</span>" +
      "</div>" +
      '<div class="carte-cours__pied">' + etiquette + bas + "</div>" +
      "</article>"
    );
  }

  /* ---------------------------------------------------------------------
     États vides
     --------------------------------------------------------------------- */
  function vide(titre, options) {
    var reglages = options || {};
    return (
      '<div class="etat-vide">' +
      '<div class="etat-vide__icone" aria-hidden="true">' + icone(reglages.icone || "info", { taille: 30 }) + "</div>" +
      '<p class="etat-vide__titre">' + escape(titre || "Rien à afficher") + "</p>" +
      (reglages.texte ? '<p class="etat-vide__texte">' + escape(reglages.texte) + "</p>" : "") +
      (reglages.action
        ? '<a class="btn btn--secondaire" href="' + escape(reglages.action.href || "#") + '">' + escape(reglages.action.libelle || "Continuer") + "</a>"
        : "") +
      "</div>"
    );
  }

  /* ---------------------------------------------------------------------
     Paramètres d'URL et liens
     --------------------------------------------------------------------- */
  function param(nom) {
    try {
      return new URLSearchParams(window.location.search).get(nom) || "";
    } catch (erreur) {
      var correspondance = new RegExp("[?&]" + nom + "=([^&]*)").exec(window.location.search);
      return correspondance ? decodeURIComponent(correspondance[1].replace(/\+/g, " ")) : "";
    }
  }

  function lienCours(slug) {
    return "lecon.html?cours=" + encodeURIComponent(slug || "");
  }

  function lienDocument(id) {
    return "bibliotheque.html?doc=" + encodeURIComponent(id || "");
  }

  function copier(texte) {
    var valeur = String(texte == null ? "" : texte);
    return new Promise(function (resoudre) {
      function repli() {
        try {
          var zone = el("textarea", { class: "sr-only" });
          zone.value = valeur;
          document.body.appendChild(zone);
          zone.select();
          var ok = document.execCommand("copy");
          document.body.removeChild(zone);
          resoudre(!!ok);
        } catch (erreur) {
          resoudre(false);
        }
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(valeur).then(function () {
          resoudre(true);
        }, repli);
      } else {
        repli();
      }
    });
  }

  /* ---------------------------------------------------------------------
     Initialisation
     --------------------------------------------------------------------- */
  function initialiser() {
    if (!qs(".lien-evitement")) {
      var evitement = el("a", { class: "lien-evitement", href: "#contenu", text: "Aller au contenu principal" });
      document.body.insertBefore(evitement, document.body.firstChild);
    }
    appliquerTheme();
    var themeDemande = param("theme");
    if (themeDemande === "sombre" || themeDemande === "clair") {
      if (window.Store) Store.majReglages({ theme: themeDemande });
      document.documentElement.setAttribute("data-theme", themeDemande);
      document.documentElement.style.colorScheme = themeDemande === "sombre" ? "dark" : "light";
      majBoutonTheme();
    }
    construireEntete();
    construirePied();
    hydraterIcones(document);
    if (window.Store) {
      Store.subscribe(function () {
        majEntete();
      });
    }
    document.addEventListener("click", function (evenement) {
      var nav = qs("#nav-principale");
      var bouton = qs("#bouton-menu");
      if (!nav || !bouton || !nav.classList.contains("nav-principale--ouverte")) return;
      if (nav.contains(evenement.target) || bouton.contains(evenement.target)) return;
      nav.classList.remove("nav-principale--ouverte");
      bouton.setAttribute("aria-expanded", "false");
      bouton.innerHTML = icone("menu", { taille: 22 });
    });
  }

  function onReady(fonction) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fonction);
    } else {
      fonction();
    }
  }

  window.App = {
    icones: ICONES,
    icon: icone,
    icone: icone,
    iconeDans: function (racine) {
      hydraterIcones(racine || document);
    },
    el: el,
    qs: qs,
    qsa: qsa,
    escape: escape,
    escapeAttribut: escape,
    md: function (texte) {
      return window.MD ? MD.block(texte) : escape(texte);
    },
    mdInline: function (texte) {
      return window.MD ? MD.inline(texte) : escape(texte);
    },
    date: date,
    relative: relative,
    echeance: echeance,
    duree: duree,
    nombre: nombre,
    pourcentage: pourcentage,
    toast: toast,
    modal: modal,
    fermerModal: fermerModal,
    modalOuverte: majModalOuverte,
    confirmer: confirmer,
    param: param,
    lienCours: lienCours,
    lienDocument: lienDocument,
    copier: copier,
    vide: vide,
    carteCours: carteCours,
    vider: function (racine) {
      if (racine) racine.innerHTML = "";
    },
    majEntete: majEntete,
    basculerTheme: basculerTheme,
    onReady: onReady
  };

  onReady(initialiser);
})();
