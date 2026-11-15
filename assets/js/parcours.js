/* ==========================================================================
   SepsHaness — page « Parcours »
   Parcours guidés : progression personnelle, reprise, recherche, filtres,
   tri, programme détaillé, niveaux et matières.
   Données : APP_DATA ; progression : Store.
   ========================================================================== */
(function () {
  "use strict";

  var TRIS = ["conseille", "progression", "duree", "titre"];
  var NOMS_TRI = {
    conseille: "Ordre conseillé",
    progression: "Progression",
    duree: "Durée croissante",
    titre: "Titre A → Z"
  };
  var STATUTS = [
    { id: "", nom: "Tous" },
    { id: "a-commencer", nom: "À commencer" },
    { id: "en-cours", nom: "En cours" },
    { id: "termines", nom: "Terminés" }
  ];

  var etat = { niveau: "", statut: "", recherche: "", tri: "conseille" };
  var elements = {};
  var donnees = { parcours: [], infos: [], total: 0, cours: [], coursTotal: 0 };
  var indexParId = {};
  var minuteurRecherche = null;

  /* ---------------------------------------------------------------------
     Outils
     --------------------------------------------------------------------- */
  function qs(selecteur) {
    return App.qs(selecteur);
  }

  function echapper(texte) {
    return App.escape(texte);
  }

  function icone(nom, taille) {
    return App.icon(nom, { taille: taille || 18 });
  }

  function normaliser(texte) {
    return String(texte == null ? "" : texte)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function accorder(nombre, singulier, pluriel) {
    return nombre + " " + (nombre === 1 ? singulier : pluriel);
  }

  function mouvementReduit() {
    return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }

  function derniereVisite(info) {
    var derniere = "";
    info.etapes.forEach(function (etape) {
      var visite = Store.lecon(etape.slug).derniereVisite;
      if (visite && String(visite) > derniere) derniere = String(visite);
    });
    return derniere;
  }

  function nomStatut(id) {
    var trouve = STATUTS.filter(function (statut) {
      return statut.id === id;
    })[0];
    return trouve ? trouve.nom : "";
  }

  function correspondStatut(info, statut) {
    if (!statut) return true;
    if (statut === "a-commencer") return !info.commence;
    if (statut === "en-cours") return info.commence && !info.termine;
    if (statut === "termines") return info.termine;
    return true;
  }

  function estActif() {
    return !!(etat.recherche.trim() || etat.niveau || etat.statut || etat.tri !== "conseille");
  }

  /* ---------------------------------------------------------------------
     Analyse des parcours
     --------------------------------------------------------------------- */
  function analyser(parcours, ordre) {
    var etapes = (parcours.etapes || []).map(function (cours, index) {
      var lecon = Store.lecon(cours.slug);
      return {
        rang: index + 1,
        cours: cours,
        slug: cours.slug,
        matiere: APP_DATA.matiere(cours.matiere),
        fait: lecon.statut === "termine",
        visite: lecon.statut !== "jamais" || !!lecon.derniereVisite
      };
    });

    var progression = Store.progressionParcours(
      etapes.map(function (etape) {
        return etape.slug;
      })
    );

    var prochaineIndex = -1;
    etapes.forEach(function (etape, index) {
      if (prochaineIndex === -1 && !etape.fait) prochaineIndex = index;
    });

    var restant = 0;
    var matieres = [];
    var documents = [];
    var quiz = 0;

    etapes.forEach(function (etape) {
      if (!etape.fait) restant += Number(etape.cours.duree) || 0;
      if (matieres.indexOf(etape.cours.matiere) === -1) matieres.push(etape.cours.matiere);
      (etape.cours.documents || []).forEach(function (id) {
        var dejaLa = documents.some(function (document) {
          return document.id === id;
        });
        if (dejaLa) return;
        var document = APP_DATA.getDocument(id);
        if (document) documents.push(document);
      });
      quiz += (etape.cours.quiz || []).length;
    });

    var niveau = APP_DATA.niveau(parcours.niveau);
    var termine = progression.total > 0 && progression.termines === progression.total;
    var commence =
      progression.termines > 0 ||
      etapes.some(function (etape) {
        return etape.visite;
      });

    var texteRecherche = normaliser(
      [
        parcours.titre,
        parcours.description,
        parcours.pourQui,
        niveau.nom,
        (parcours.objectifs || []).join(" "),
        matieres
          .map(function (id) {
            return APP_DATA.matiere(id).nom;
          })
          .join(" "),
        etapes
          .map(function (etape) {
            return [etape.cours.titre, etape.cours.classe, etape.matiere.nom, (etape.cours.tags || []).join(" ")].join(" ");
          })
          .join(" ")
      ].join(" ")
    );

    return {
      parcours: parcours,
      etapes: etapes,
      niveau: niveau,
      ordre: ordre,
      progression: progression,
      prochaineIndex: prochaineIndex,
      prochaine: prochaineIndex >= 0 ? etapes[prochaineIndex] : null,
      restant: restant,
      matieres: matieres,
      documents: documents,
      quiz: quiz,
      dureeTotale: Number(parcours.dureeTotale) || 0,
      termine: termine,
      commence: commence,
      texteRecherche: texteRecherche
    };
  }

  function construire() {
    donnees.parcours = APP_DATA.parcoursAvecCours();
    donnees.infos = [];
    indexParId = {};
    donnees.parcours.forEach(function (parcours, ordre) {
      var info = analyser(parcours, ordre);
      donnees.infos.push(info);
      indexParId[parcours.id] = info;
    });
    donnees.total = donnees.infos.length;

    var union = {};
    donnees.infos.forEach(function (info) {
      info.etapes.forEach(function (etape) {
        union[etape.slug] = etape.cours;
      });
    });
    donnees.cours = Object.keys(union).map(function (slug) {
      return union[slug];
    });
    donnees.coursTotal = donnees.cours.length;
  }

  /* ---------------------------------------------------------------------
     En-tête : progression personnelle
     --------------------------------------------------------------------- */
  var RAYON_ANNEAU = 46;
  var CIRCONFERENCE = 2 * Math.PI * RAYON_ANNEAU;

  function htmlAnneau(pourcentage, libelle) {
    var valeur = Math.max(0, Math.min(100, Math.round(Number(pourcentage) || 0)));
    var decalage = CIRCONFERENCE * (1 - valeur / 100);
    return (
      '<div class="cat-anneau">' +
      '<svg viewBox="0 0 104 104" role="img" aria-label="' +
      echapper(libelle) +
      " : " +
      valeur +
      ' %">' +
      '<g transform="rotate(-90 52 52)">' +
      '<circle class="anneau__fond" cx="52" cy="52" r="' +
      RAYON_ANNEAU +
      '" fill="none" stroke-width="9"></circle>' +
      '<circle class="anneau__valeur" cx="52" cy="52" r="' +
      RAYON_ANNEAU +
      '" fill="none" stroke-width="9" stroke-linecap="round" stroke-dasharray="' +
      CIRCONFERENCE.toFixed(1) +
      '" stroke-dashoffset="' +
      decalage.toFixed(1) +
      '"></circle>' +
      "</g></svg>" +
      '<span class="cat-anneau__texte" aria-hidden="true"><strong>' +
      valeur +
      ' %</strong><span class="micro texte-faible">terminé</span></span>' +
      "</div>"
    );
  }

  function rendreHero() {
    var zone = elements.hero;
    if (!zone) return;

    var total = donnees.coursTotal;
    var termines = donnees.cours.filter(function (cours) {
      return Store.estTermine(cours.slug);
    }).length;
    var pourcentage = total ? Math.round((termines / total) * 100) : 0;
    var restant = donnees.cours.reduce(function (somme, cours) {
      return Store.estTermine(cours.slug) ? somme : somme + (Number(cours.duree) || 0);
    }, 0);
    var enCours = donnees.infos.filter(function (info) {
      return info.commence && !info.termine;
    }).length;
    var finis = donnees.infos.filter(function (info) {
      return info.termine;
    }).length;

    var reste;
    if (!total) reste = "Parcours à venir";
    else if (!restant) reste = "Tous les cours sont terminés";
    else reste = "≈ " + App.duree(restant) + " restantes";

    var parcoursEnCours = enCours ? accorder(enCours, "parcours en cours", "parcours en cours") : "Aucun parcours commencé";
    var parcoursFinis = finis ? accorder(finis, "parcours terminé", "parcours terminés") : "Objectif : la première étape";

    zone.innerHTML =
      '<div class="cat-hero__carte">' +
      '<div class="cat-hero__carte-haut">' +
      htmlAnneau(pourcentage, "Progression globale des parcours") +
      '<div class="cat-hero__carte-texte">' +
      '<p class="surtitre">Ma progression</p>' +
      '<p class="cat-hero__chiffre">' +
      termines +
      " / " +
      total +
      "</p>" +
      '<p class="micro texte-doux">cours des parcours terminés</p>' +
      '<p class="micro texte-faible">' +
      echapper(reste) +
      "</p>" +
      "</div>" +
      "</div>" +
      '<ul class="cat-hero__liste">' +
      "<li>" +
      icone("parcours", 16) +
      "<span>" +
      echapper(parcoursEnCours) +
      "</span></li>" +
      "<li>" +
      icone("succes", 16) +
      "<span>" +
      echapper(parcoursFinis) +
      "</span></li>" +
      "</ul>" +
      '<a class="btn btn--secondaire btn--sm btn--bloc" href="suivi.html">' +
      icone("suivi", 16) +
      " Voir mon suivi</a>" +
      "</div>";
  }

  /* ---------------------------------------------------------------------
     Reprendre un parcours
     --------------------------------------------------------------------- */
  function rendreReprendre() {
    var zone = elements.zoneReprendre;
    var section = elements.sectionReprendre;
    if (!zone || !section) return;

    var enCours = donnees.infos.filter(function (info) {
      return info.commence && !info.termine;
    });
    enCours.sort(function (a, b) {
      var ecart = b.progression.pourcentage - a.progression.pourcentage;
      if (ecart) return ecart;
      return derniereVisite(b) > derniereVisite(a) ? 1 : -1;
    });

    var info = enCours[0] || null;
    var mode = "reprendre";

    if (!info) {
      var niveauCourant = Store.niveauCourant();
      var aCommencer = donnees.infos.filter(function (element) {
        return !element.commence;
      });
      info =
        aCommencer.filter(function (element) {
          return element.parcours.niveau === niveauCourant;
        })[0] || aCommencer[0] || null;
      mode = "suggestion";
    }

    if (!info) {
      info =
        donnees.infos.filter(function (element) {
          return element.termine;
        })[0] || null;
      mode = "revoir";
    }

    if (!info) {
      section.hidden = true;
      zone.innerHTML = "";
      return;
    }

    var parcours = info.parcours;
    var cible = info.prochaine || info.etapes[0] || null;
    var href = cible ? App.lienCours(cible.cours.slug) : "cours.html";
    var teinte = parcours.teinte || info.niveau.teinte || "indigo";

    var surtitre = "Un point de départ recommandé";
    var libelle = "Commencer ce parcours";
    var intro;

    if (mode === "reprendre") {
      surtitre = "Reprendre où vous en étiez";
      libelle = "Continuer l'étape " + cible.rang;
      intro =
        "Prochaine étape : " +
        cible.cours.titre +
        ". Vous avez déjà terminé " +
        accorder(info.progression.termines, "étape", "étapes") +
        " sur " +
        info.progression.total +
        ".";
    } else if (mode === "suggestion") {
      intro =
        "Ce parcours correspond à votre niveau. Commencez par « " +
        (cible ? cible.cours.titre : parcours.titre) +
        " » : chaque étape terminée fait avancer votre progression, sans inscription.";
      if (cible && cible.rang > 1) libelle = "Ouvrir le parcours";
    } else {
      surtitre = "Tous vos parcours sont terminés";
      libelle = "Revoir le parcours";
      intro =
        "Bravo, vous avez terminé chaque parcours commencé. Revoir une étape consolide les acquis ; le catalogue propose aussi de nouveaux cours.";
    }

    var pourcentage = info.progression.pourcentage;
    var jauge = info.progression.total
      ? '<div class="jauge jauge--fine" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' +
        pourcentage +
        '" aria-label="Progression du parcours ' +
        echapper(parcours.titre) +
        '"><span class="jauge__remplissage" style="width:' +
        pourcentage +
        '%"></span></div>'
      : "";

    zone.innerHTML =
      '<div class="cat-reprendre" data-teinte="' +
      echapper(teinte) +
      '">' +
      '<span class="cat-reprendre__icone" aria-hidden="true">' +
      icone(parcours.icone || info.niveau.icone || "parcours", 26) +
      "</span>" +
      '<div class="cat-reprendre__corps">' +
      '<p class="surtitre">' +
      echapper(surtitre) +
      "</p>" +
      '<h3 class="cat-reprendre__titre"><a href="' +
      href +
      '">' +
      echapper(parcours.titre) +
      "</a></h3>" +
      '<p class="cat-reprendre__texte">' +
      echapper(intro) +
      "</p>" +
      '<div class="rangee cat-reprendre__meta">' +
      '<span class="puce">' +
      icone("livre", 14) +
      echapper(info.niveau.nom) +
      "</span>" +
      '<span class="puce">' +
      icone("horloge", 14) +
      App.duree(info.dureeTotale) +
      "</span>" +
      '<span class="puce">' +
      icone("tache", 14) +
      info.progression.termines +
      " / " +
      info.progression.total +
      " étapes</span>" +
      "</div>" +
      jauge +
      "</div>" +
      '<div class="cat-reprendre__action">' +
      '<a class="btn btn--primaire" href="' +
      href +
      '">' +
      icone("play", 16) +
      " " +
      echapper(libelle) +
      "</a>" +
      "</div></div>";

    section.hidden = false;
  }

  /* ---------------------------------------------------------------------
     Cartes de parcours
     --------------------------------------------------------------------- */
  function htmlEtape(info, etape) {
    var suivante = info.prochaineIndex === etape.rang - 1;
    var classes = "cat-etape";
    if (etape.fait) classes += " cat-etape--terminee";
    else if (suivante) classes += " cat-etape--suivante";
    else if (etape.visite) classes += " cat-etape--encours";

    var repere = "";
    if (suivante) {
      repere =
        '<span class="cat-etape__repere">' + (info.commence ? "Prochaine" : "À commencer") + "</span>";
    } else if (!etape.fait && etape.visite) {
      repere = '<span class="cat-etape__repere cat-etape__repere--encours">En cours</span>';
    } else if (etape.fait) {
      repere = '<span class="sr-only">Étape terminée</span>';
    }

    var questions = (etape.cours.quiz || []).length;
    var meta = echapper(etape.matiere.nom) + " · " + App.duree(etape.cours.duree);
    if (questions) meta += " · " + accorder(questions, "question", "questions");

    return (
      '<li class="' +
      classes +
      '">' +
      '<span class="cat-etape__num" aria-hidden="true">' +
      (etape.fait ? icone("check", 15) : etape.rang) +
      "</span>" +
      '<div class="cat-etape__corps">' +
      '<a class="cat-etape__titre" href="' +
      App.lienCours(etape.slug) +
      '">' +
      echapper(etape.cours.titre) +
      "</a>" +
      '<span class="cat-etape__meta">' +
      meta +
      "</span>" +
      "</div>" +
      repere +
      "</li>"
    );
  }

  function htmlSegments(info) {
    if (!info.etapes.length) return "";
    var parts = info.etapes.map(function (etape, index) {
      var classe = "cat-segments__part";
      if (etape.fait) classe += " cat-segments__part--faite";
      else if (index === info.prochaineIndex) classe += " cat-segments__part--suivante";
      return '<span class="' + classe + '"></span>';
    });
    return '<div class="cat-segments" aria-hidden="true">' + parts.join("") + "</div>";
  }

  function htmlCarte(info) {
    var parcours = info.parcours;
    var pourcentage = info.progression.pourcentage;
    var cible = info.termine ? info.etapes[0] || null : info.prochaine;
    var href = cible ? App.lienCours(cible.cours.slug) : "";
    var libelle = info.termine ? "Revoir le parcours" : info.commence ? "Continuer" : "Commencer";
    var iconeAction = info.termine ? "reinitialiser" : "play";
    var libelleComplet =
      (info.termine ? "Revoir" : info.commence ? "Continuer" : "Commencer") + " le parcours " + parcours.titre;
    var teinte = parcours.teinte || info.niveau.teinte || "indigo";

    var etapes = info.etapes.length
      ? '<ol class="cat-etapes">' +
        info.etapes
          .map(function (etape) {
            return htmlEtape(info, etape);
          })
          .join("") +
        "</ol>"
      : '<p class="cat-etape--vide">Les leçons de ce parcours seront publiées prochainement.</p>';

    var matieres = info.matieres
      .map(function (id) {
        var matiere = APP_DATA.matiere(id);
        return (
          '<span class="cat-matiere-puce" data-teinte="' +
          echapper(matiere.teinte) +
          '">' +
          icone(matiere.icone, 13) +
          echapper(matiere.nom) +
          "</span>"
        );
      })
      .join("");

    var action = href
      ? '<a class="btn btn--primaire btn--sm" data-lien-principal href="' +
        href +
        '" aria-label="' +
        echapper(libelleComplet) +
        '">' +
        icone(iconeAction, 15) +
        " " +
        echapper(libelle) +
        "</a>"
      : '<span class="etiquette etiquette--neutre">Bientôt disponible</span>';

    var programme = info.etapes.length
      ? '<button class="btn btn--secondaire btn--sm" type="button" data-programme="' +
        echapper(parcours.id) +
        '" aria-label="Voir le programme du parcours ' +
        echapper(parcours.titre) +
        '">' +
        icone("document", 15) +
        " Programme</button>"
      : "";

    var reste;
    if (!info.progression.total) reste = "Programme à venir";
    else if (info.termine) reste = "Parcours terminé";
    else if (info.restant) reste = "≈ " + App.duree(info.restant) + " restantes";
    else reste = "Dernière étape";

    var pourQui = parcours.pourQui
      ? '<p class="cat-parcours__pourqui">' +
        icone("utilisateur", 16) +
        "<span><strong>Pour qui :</strong> " +
        echapper(parcours.pourQui) +
        "</span></p>"
      : "";

    var progressionTexte = info.progression.total
      ? info.progression.termines + " / " + info.progression.total + " étapes · " + pourcentage + " %"
      : "Aucune étape publiée";

    return (
      '<article class="cat-parcours cat-parcours--cliquable" data-teinte="' +
      echapper(teinte) +
      '">' +
      '<div class="cat-parcours__haut">' +
      '<span class="cat-parcours__icone" aria-hidden="true">' +
      icone(parcours.icone || info.niveau.icone || "parcours", 24) +
      "</span>" +
      '<div class="cat-parcours__etiquettes">' +
      '<span class="cat-etiquette-niveau" data-teinte="' +
      echapper(info.niveau.teinte) +
      '">' +
      icone(info.niveau.icone, 14) +
      echapper(info.niveau.nom) +
      "</span>" +
      '<span class="puce">' +
      icone("horloge", 14) +
      App.duree(info.dureeTotale) +
      "</span>" +
      '<span class="puce">' +
      icone("parcours", 14) +
      accorder(info.etapes.length, "étape", "étapes") +
      "</span>" +
      "</div>" +
      "</div>" +
      '<h3 class="cat-parcours__titre">' +
      (href ? '<a href="' + href + '">' + echapper(parcours.titre) + "</a>" : echapper(parcours.titre)) +
      "</h3>" +
      '<p class="cat-parcours__texte">' +
      echapper(parcours.description || "") +
      "</p>" +
      (matieres ? '<div class="cat-parcours__matieres">' + matieres + "</div>" : "") +
      pourQui +
      etapes +
      '<div class="cat-parcours__pied">' +
      '<div class="cat-jauge" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' +
      pourcentage +
      '" aria-label="Progression du parcours ' +
      echapper(parcours.titre) +
      '" aria-valuetext="' +
      progressionTexte +
      '">' +
      '<div class="rangee rangee--entre"><span class="micro texte-doux">Progression</span><span class="micro texte-doux">' +
      progressionTexte +
      "</span></div>" +
      htmlSegments(info) +
      '<span class="micro texte-faible">' +
      echapper(reste) +
      "</span>" +
      "</div>" +
      '<div class="cat-parcours__actions">' +
      action +
      programme +
      "</div>" +
      "</div>" +
      "</article>"
    );
  }

  /* ---------------------------------------------------------------------
     Programme détaillé (modale)
     --------------------------------------------------------------------- */
  function ouvrirProgramme(id) {
    var info = indexParId[id];
    if (!info) return;

    var parcours = info.parcours;
    var cible = info.termine ? info.etapes[0] || null : info.prochaine;
    var href = cible ? App.lienCours(cible.cours.slug) : "";
    var libelle = info.termine ? "Revoir le parcours" : info.commence ? "Continuer" : "Commencer";

    var objectifs = (parcours.objectifs || [])
      .map(function (objectif) {
        return "<li>" + icone("check", 14) + "<span>" + echapper(objectif) + "</span></li>";
      })
      .join("");

    var etapes = info.etapes
      .map(function (etape) {
        return htmlEtape(info, etape);
      })
      .join("");

    var documents = info.documents
      .map(function (document) {
        var type = APP_DATA.typeDocument(document.type);
        return (
          '<a class="cat-document-lien" href="' +
          App.lienDocument(document.id) +
          '">' +
          icone(type.icone, 16) +
          "<span>" +
          echapper(document.titre) +
          '</span><span class="micro texte-faible">' +
          echapper(type.nom) +
          "</span></a>"
        );
      })
      .join("");

    var meta =
      '<div class="rangee cat-programme__meta">' +
      '<span class="cat-etiquette-niveau" data-teinte="' +
      echapper(info.niveau.teinte) +
      '">' +
      icone(info.niveau.icone, 14) +
      echapper(info.niveau.nom) +
      "</span>" +
      '<span class="puce">' +
      icone("horloge", 14) +
      App.duree(info.dureeTotale) +
      "</span>" +
      '<span class="puce">' +
      icone("tache", 14) +
      accorder(info.etapes.length, "étape", "étapes") +
      "</span>" +
      (parcours.rythme
        ? '<span class="puce">' + icone("calendrier", 14) + echapper(parcours.rythme) + "</span>"
        : "") +
      (info.quiz ? '<span class="puce">' + icone("succes", 14) + accorder(info.quiz, "question de quiz", "questions de quiz") + "</span>" : "") +
      "</div>";

    var contenu =
      '<div class="cat-programme" data-teinte="' +
      echapper(parcours.teinte || info.niveau.teinte || "indigo") +
      '">' +
      meta +
      '<p class="cat-programme__texte">' +
      echapper(parcours.description || "") +
      "</p>" +
      (parcours.pourQui
        ? '<p class="cat-parcours__pourqui">' +
          icone("utilisateur", 16) +
          "<span><strong>Pour qui :</strong> " +
          echapper(parcours.pourQui) +
          "</span></p>"
        : "") +
      (objectifs
        ? '<section class="cat-programme__bloc" aria-labelledby="cat-programme-objectifs"><h3 id="cat-programme-objectifs">À la fin de ce parcours</h3><ul class="cat-points">' +
          objectifs +
          "</ul></section>"
        : "") +
      '<section class="cat-programme__bloc" aria-labelledby="cat-programme-etapes"><h3 id="cat-programme-etapes">Le programme</h3><ol class="cat-etapes cat-programme__etapes">' +
      etapes +
      "</ol></section>" +
      (documents
        ? '<section class="cat-programme__bloc" aria-labelledby="cat-programme-documents"><h3 id="cat-programme-documents">Documents associés</h3><div class="cat-documents">' +
          documents +
          "</div></section>"
        : "") +
      '<div class="cat-programme__actions">' +
      (href
        ? '<a class="btn btn--primaire" href="' + href + '">' + icone("play", 16) + " " + echapper(libelle) + "</a>"
        : "") +
      "</div>" +
      "</div>";

    App.modal({
      titre: parcours.titre,
      taille: "lg",
      contenu: contenu,
      actions: [{ libelle: "Fermer", type: "secondaire" }]
    });
  }

  /* ---------------------------------------------------------------------
     Filtres et tri
     --------------------------------------------------------------------- */
  function preparerFiltres() {
    var morceaux = ['<button class="puce-filtre" type="button" data-niveau="" aria-pressed="true">Tous</button>'];
    APP_DATA.niveaux.forEach(function (niveau) {
      var nombre = donnees.infos.filter(function (info) {
        return info.parcours.niveau === niveau.id;
      }).length;
      morceaux.push(
        '<button class="puce-filtre" type="button" data-niveau="' +
          echapper(niveau.id) +
          '" aria-pressed="false">' +
          echapper(niveau.nom) +
          '<span class="cat-filtre__compte">' +
          nombre +
          "</span></button>"
      );
    });
    elements.filtresNiveau.innerHTML = morceaux.join("");

    elements.filtresStatut.innerHTML = STATUTS.map(function (statut) {
      var nombre = donnees.infos.filter(function (info) {
        return correspondStatut(info, statut.id);
      }).length;
      return (
        '<button class="puce-filtre" type="button" data-statut="' +
        echapper(statut.id) +
        '" aria-pressed="false">' +
        echapper(statut.nom) +
        '<span class="cat-filtre__compte">' +
        nombre +
        "</span></button>"
      );
    }).join("");
  }

  function majBoutons() {
    App.qsa("[data-niveau]", elements.filtresNiveau).forEach(function (bouton) {
      bouton.setAttribute("aria-pressed", (bouton.getAttribute("data-niveau") || "") === etat.niveau ? "true" : "false");
    });
    App.qsa("[data-statut]", elements.filtresStatut).forEach(function (bouton) {
      bouton.setAttribute("aria-pressed", (bouton.getAttribute("data-statut") || "") === etat.statut ? "true" : "false");
    });
  }

  function majCompte(liste) {
    if (!elements.compteParcours) return;
    if (!donnees.total) {
      elements.compteParcours.textContent = "Aucun parcours";
    } else if (estActif()) {
      elements.compteParcours.textContent = liste.length + " / " + donnees.total + " parcours";
    } else {
      elements.compteParcours.textContent = donnees.total + " parcours";
    }
  }

  function majResume(liste) {
    if (!elements.resume) return;

    if (!donnees.total) {
      elements.resume.textContent = "Les parcours guidés seront publiés prochainement.";
    } else if (!estActif()) {
      elements.resume.textContent =
        donnees.total +
        " parcours guidés · " +
        donnees.coursTotal +
        " cours · l'avancement est enregistré automatiquement.";
    } else {
      var morceaux = [];
      if (etat.recherche.trim()) morceaux.push("« " + etat.recherche.trim() + " »");
      if (etat.niveau) morceaux.push("niveau " + APP_DATA.niveau(etat.niveau).nom);
      if (etat.statut) morceaux.push("avancement : " + nomStatut(etat.statut));
      if (etat.tri !== "conseille") morceaux.push("tri : " + NOMS_TRI[etat.tri]);
      elements.resume.textContent =
        liste.length +
        " " +
        (liste.length > 1 ? "parcours affichés" : "parcours affiché") +
        " sur " +
        donnees.total +
        " · " +
        morceaux.join(" · ") +
        ".";
    }

    if (elements.reinitialiser) elements.reinitialiser.hidden = !estActif();
  }

  function trier(liste) {
    var copie = liste.slice();
    if (etat.tri === "progression") {
      copie.sort(function (a, b) {
        return b.progression.pourcentage - a.progression.pourcentage || a.ordre - b.ordre;
      });
    } else if (etat.tri === "duree") {
      copie.sort(function (a, b) {
        return a.dureeTotale - b.dureeTotale || a.ordre - b.ordre;
      });
    } else if (etat.tri === "titre") {
      copie.sort(function (a, b) {
        return String(a.parcours.titre).localeCompare(String(b.parcours.titre), "fr");
      });
    } else {
      var ordreNiveaux = APP_DATA.ordreNiveaux || {};
      copie.sort(function (a, b) {
        var ordreA = ordreNiveaux[a.parcours.niveau];
        var ordreB = ordreNiveaux[b.parcours.niveau];
        if (ordreA === undefined) ordreA = 99;
        if (ordreB === undefined) ordreB = 99;
        return ordreA - ordreB || a.ordre - b.ordre;
      });
    }
    return copie;
  }

  function infosFiltrees() {
    var mots = normaliser(etat.recherche).trim().split(/\s+/).filter(Boolean);
    var liste = donnees.infos.filter(function (info) {
      if (etat.niveau && info.parcours.niveau !== etat.niveau) return false;
      if (!correspondStatut(info, etat.statut)) return false;
      if (!mots.length) return true;
      return mots.every(function (mot) {
        return info.texteRecherche.indexOf(mot) !== -1;
      });
    });
    return trier(liste);
  }

  function majURL() {
    try {
      var parametres = new URLSearchParams(window.location.search);
      ["q", "niveau", "statut", "tri"].forEach(function (cle) {
        parametres.delete(cle);
      });
      if (etat.recherche.trim()) parametres.set("q", etat.recherche.trim());
      if (etat.niveau) parametres.set("niveau", etat.niveau);
      if (etat.statut) parametres.set("statut", etat.statut);
      if (etat.tri !== "conseille") parametres.set("tri", etat.tri);
      var requete = parametres.toString();
      window.history.replaceState(
        null,
        "",
        window.location.pathname + (requete ? "?" + requete : "") + window.location.hash
      );
    } catch (erreur) {
      /* file:// ou historique indisponible : l'état reste simplement en mémoire. */
    }
  }

  function lireParametres() {
    var recherche = App.param("q");
    if (recherche) {
      etat.recherche = recherche;
      elements.recherche.value = recherche;
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

    var statut = App.param("statut");
    if (
      statut &&
      STATUTS.some(function (element) {
        return element.id === statut;
      })
    ) {
      etat.statut = statut;
    }

    var tri = App.param("tri");
    if (TRIS.indexOf(tri) !== -1) {
      etat.tri = tri;
      elements.tri.value = tri;
    }
  }

  function reinitialiser(focus) {
    etat.niveau = "";
    etat.statut = "";
    etat.recherche = "";
    etat.tri = "conseille";
    if (minuteurRecherche) {
      window.clearTimeout(minuteurRecherche);
      minuteurRecherche = null;
    }
    if (elements.recherche) elements.recherche.value = "";
    if (elements.tri) elements.tri.value = "conseille";
    if (elements.effacer) elements.effacer.hidden = true;
    rendreParcours();
    if (focus && elements.recherche) elements.recherche.focus();
  }

  function rendreParcours() {
    var grille = elements.parcoursListe;
    if (!grille) return;

    var liste = infosFiltrees();
    grille.classList.toggle("cat-resultats--vide", liste.length === 0);

    if (!donnees.total) {
      grille.innerHTML = App.vide("Les parcours arrivent bientôt", {
        icone: "parcours",
        texte: "Les itinéraires guidés seront publiés prochainement. En attendant, le catalogue des cours est déjà accessible.",
        action: { href: "cours.html", libelle: "Ouvrir le catalogue" }
      });
    } else if (!liste.length) {
      grille.innerHTML =
        '<div class="etat-vide">' +
        '<div class="etat-vide__icone" aria-hidden="true">' +
        icone("recherche", 30) +
        "</div>" +
        '<p class="etat-vide__titre">Aucun parcours ne correspond</p>' +
        '<p class="etat-vide__texte">Essayez un autre mot-clé, changez de niveau ou d\'avancement, ou affichez tous les parcours.</p>' +
        '<button class="btn btn--secondaire" type="button" id="cat-vider-filtres">Afficher tous les parcours</button>' +
        "</div>";
      var boutonVider = qs("#cat-vider-filtres");
      if (boutonVider) {
        boutonVider.addEventListener("click", function () {
          reinitialiser(true);
        });
      }
    } else {
      grille.innerHTML = liste
        .map(function (info) {
          return htmlCarte(info);
        })
        .join("");
      App.iconeDans(grille);
    }

    majBoutons();
    majCompte(liste);
    majResume(liste);
    majURL();
    if (elements.effacer) elements.effacer.hidden = !etat.recherche;
  }

  /* ---------------------------------------------------------------------
     Niveaux
     --------------------------------------------------------------------- */
  function htmlNiveau(niveau) {
    var progression = Store.progressionNiveau(niveau.id);
    var coursNiveau = APP_DATA.coursDuNiveau(niveau.id);
    var matieres = APP_DATA.matieresDuNiveau(niveau.id).filter(function (matiere) {
      return coursNiveau.some(function (cours) {
        return cours.matiere === matiere.id;
      });
    });
    var pourcentage = progression.pourcentage;

    var tuiles = matieres.length
      ? matieres
          .map(function (matiere) {
            var nombre = coursNiveau.filter(function (cours) {
              return cours.matiere === matiere.id;
            }).length;
            return (
              '<a class="tuile-matiere" data-teinte="' +
              echapper(matiere.teinte) +
              '" href="cours.html?niveau=' +
              encodeURIComponent(niveau.id) +
              "&matiere=" +
              encodeURIComponent(matiere.id) +
              '">' +
              '<span class="tuile-matiere__icone" aria-hidden="true">' +
              icone(matiere.icone, 19) +
              "</span>" +
              '<span class="cat-tuile-texte">' +
              '<span class="tuile-matiere__nom">' +
              echapper(matiere.nom) +
              "</span>" +
              '<span class="tuile-matiere__detail">' +
              accorder(nombre, "cours", "cours") +
              "</span></span></a>"
            );
          })
          .join("")
      : '<p class="petit texte-faible">Les matières de ce niveau seront précisées prochainement.</p>';

    var points = (niveau.points || [])
      .map(function (point) {
        return "<li>" + icone("check", 14) + "<span>" + echapper(point) + "</span></li>";
      })
      .join("");

    var jauge = progression.total
      ? '<div class="jauge jauge--fine" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' +
        pourcentage +
        '" aria-label="Progression du niveau ' +
        echapper(niveau.nom) +
        '"><span class="jauge__remplissage" style="width:' +
        pourcentage +
        '%"></span></div>'
      : "";

    var detailProgression = progression.total
      ? accorder(progression.termines, "cours terminé", "cours terminés") +
        " sur " +
        progression.total +
        " · " +
        pourcentage +
        " %"
      : "Catalogue en préparation";

    return (
      '<article class="carte-niveau cat-niveau" data-teinte="' +
      echapper(niveau.teinte) +
      '">' +
      '<div class="carte-niveau__haut">' +
      '<span class="carte-niveau__icone" aria-hidden="true">' +
      icone(niveau.icone, 24) +
      "</span>" +
      "<div>" +
      "<h3>" +
      echapper(niveau.nom) +
      "</h3>" +
      '<p class="carte-niveau__detail">' +
      echapper([niveau.detail, niveau.ages].filter(Boolean).join(" · ")) +
      "</p>" +
      "</div>" +
      '<span class="cat-niveau__pct">' +
      pourcentage +
      " %</span>" +
      "</div>" +
      '<p class="carte__texte">' +
      echapper(niveau.description || "") +
      "</p>" +
      '<div class="cat-niveau__progression">' +
      '<p class="micro texte-doux">' +
      echapper(detailProgression) +
      "</p>" +
      jauge +
      "</div>" +
      (points ? '<ul class="cat-points">' + points + "</ul>" : "") +
      '<div class="cat-matieres-niveau">' +
      tuiles +
      "</div>" +
      '<div class="cat-niveau__pied">' +
      '<a class="btn btn--secondaire btn--sm" href="cours.html?niveau=' +
      encodeURIComponent(niveau.id) +
      '">' +
      icone("fleche-droite", 15) +
      " Explorer le niveau</a>" +
      '<button class="btn btn--fantome btn--sm" type="button" data-filtrer-niveau="' +
      echapper(niveau.id) +
      '" aria-label="Voir les parcours du niveau ' +
      echapper(niveau.nom) +
      '">' +
      icone("parcours", 15) +
      " Parcours</button>" +
      "</div></article>"
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
    grille.innerHTML = APP_DATA.niveaux
      .map(function (niveau) {
        return htmlNiveau(niveau);
      })
      .join("");
    App.iconeDans(grille);
  }

  /* ---------------------------------------------------------------------
     Matières
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
        var progression = Store.progressionMatiere(matiere.id);
        var documents = APP_DATA.documentsDeMatiere(matiere.id).length;
        var nbParcours = donnees.infos.filter(function (info) {
          return info.matieres.indexOf(matiere.id) !== -1;
        }).length;
        var pourcentage = progression.pourcentage;

        var detail = progression.total
          ? progression.termines + " / " + progression.total + " cours"
          : "Cours à venir";
        if (documents) detail += " · " + accorder(documents, "document", "documents");

        var jauge = progression.total
          ? '<span class="jauge jauge--fine cat-matiere__jauge" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' +
            pourcentage +
            '" aria-label="Progression en ' +
            echapper(matiere.nom) +
            '"><span class="jauge__remplissage" style="width:' +
            pourcentage +
            '%"></span></span>'
          : "";

        return (
          '<a class="cat-matiere" data-teinte="' +
          echapper(matiere.teinte) +
          '" href="cours.html?matiere=' +
          encodeURIComponent(matiere.id) +
          '">' +
          '<span class="cat-matiere__haut">' +
          '<span class="cat-matiere__icone" aria-hidden="true">' +
          icone(matiere.icone, 20) +
          "</span>" +
          '<span class="cat-matiere__pct">' +
          pourcentage +
          " %</span>" +
          "</span>" +
          '<span class="cat-matiere__nom">' +
          echapper(matiere.nom) +
          "</span>" +
          '<span class="cat-matiere__detail">' +
          echapper(detail) +
          "</span>" +
          jauge +
          (nbParcours
            ? '<span class="cat-matiere__parcours">' + accorder(nbParcours, "parcours guidé", "parcours guidés") + "</span>"
            : "") +
          "</a>"
        );
      })
      .join("");
    App.iconeDans(grille);
  }

  /* ---------------------------------------------------------------------
     Événements
     --------------------------------------------------------------------- */
  function brancherEvenements() {
    elements.filtresNiveau.addEventListener("click", function (evenement) {
      var bouton = evenement.target.closest("[data-niveau]");
      if (!bouton) return;
      etat.niveau = bouton.getAttribute("data-niveau") || "";
      rendreParcours();
    });

    elements.filtresStatut.addEventListener("click", function (evenement) {
      var bouton = evenement.target.closest("[data-statut]");
      if (!bouton) return;
      etat.statut = bouton.getAttribute("data-statut") || "";
      rendreParcours();
    });

    elements.recherche.addEventListener("input", function (evenement) {
      etat.recherche = evenement.target.value;
      if (elements.effacer) elements.effacer.hidden = !etat.recherche;
      if (minuteurRecherche) window.clearTimeout(minuteurRecherche);
      minuteurRecherche = window.setTimeout(function () {
        minuteurRecherche = null;
        rendreParcours();
      }, 140);
    });

    elements.recherche.addEventListener("keydown", function (evenement) {
      if (evenement.key === "Escape" && etat.recherche) {
        evenement.preventDefault();
        etat.recherche = "";
        elements.recherche.value = "";
        if (elements.effacer) elements.effacer.hidden = true;
        rendreParcours();
      }
    });

    if (elements.effacer) {
      elements.effacer.addEventListener("click", function () {
        etat.recherche = "";
        elements.recherche.value = "";
        elements.effacer.hidden = true;
        rendreParcours();
        elements.recherche.focus();
      });
    }

    elements.tri.addEventListener("change", function (evenement) {
      var tri = evenement.target.value;
      etat.tri = TRIS.indexOf(tri) !== -1 ? tri : "conseille";
      rendreParcours();
    });

    elements.reinitialiser.addEventListener("click", function () {
      reinitialiser(true);
    });

    elements.parcoursListe.addEventListener("click", function (evenement) {
      var boutonProgramme = evenement.target.closest("[data-programme]");
      if (boutonProgramme) {
        evenement.preventDefault();
        ouvrirProgramme(boutonProgramme.getAttribute("data-programme"));
        return;
      }

      var carte = evenement.target.closest(".cat-parcours");
      if (!carte || evenement.target.closest("a, button")) return;
      var selection = window.getSelection ? String(window.getSelection()) : "";
      if (selection) return;
      var lien = carte.querySelector("[data-lien-principal]");
      if (lien) window.location.href = lien.getAttribute("href");
    });

    if (elements.listeNiveaux) {
      elements.listeNiveaux.addEventListener("click", function (evenement) {
        var bouton = evenement.target.closest("[data-filtrer-niveau]");
        if (!bouton) return;
        etat.niveau = bouton.getAttribute("data-filtrer-niveau") || "";
        etat.statut = "";
        rendreParcours();
        var cible = qs("#cat-section-parcours");
        if (cible) {
          cible.scrollIntoView({
            behavior: mouvementReduit() ? "auto" : "smooth",
            block: "start"
          });
        }
      });
    }
  }

  /* ---------------------------------------------------------------------
     Initialisation
     --------------------------------------------------------------------- */
  function initialiser() {
    if (!window.App || !window.APP_DATA || !window.Store) return;

    elements = {
      hero: qs("#cat-hero-progression"),
      sectionReprendre: qs("#cat-section-reprendre"),
      zoneReprendre: qs("#cat-reprendre-zone"),
      compteParcours: qs("#cat-compte-parcours"),
      recherche: qs("#cat-recherche"),
      effacer: qs("#cat-effacer-recherche"),
      tri: qs("#cat-tri"),
      filtresNiveau: qs("#cat-filtres-niveau"),
      filtresStatut: qs("#cat-filtres-statut"),
      resume: qs("#cat-resume-filtres"),
      reinitialiser: qs("#cat-reinitialiser"),
      parcoursListe: qs("#cat-parcours-liste"),
      listeNiveaux: qs("#cat-liste-niveaux"),
      listeMatieres: qs("#cat-liste-matieres")
    };

    if (
      !elements.parcoursListe ||
      !elements.recherche ||
      !elements.tri ||
      !elements.filtresNiveau ||
      !elements.filtresStatut ||
      !elements.resume ||
      !elements.reinitialiser
    ) {
      return;
    }

    construire();
    preparerFiltres();
    lireParametres();
    majBoutons();
    rendreHero();
    rendreReprendre();
    rendreParcours();
    rendreNiveaux();
    rendreMatieres();
    brancherEvenements();
  }

  App.onReady(initialiser);
})();
