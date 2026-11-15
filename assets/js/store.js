/* ==========================================================================
   SepsHaness — Store
   Persistance locale (localStorage) de la progression et de l'espace de travail.
   API publique : window.Store (voir docs/CONTRAT.md §7).
   ========================================================================== */
(function () {
  "use strict";

  var CLE = "sepshaness.v1";
  var VERSION = 1;
  var abonnes = [];
  var etat = charger();

  /* ---------------------------------------------------------------------
     Utilitaires
     --------------------------------------------------------------------- */
  function estNombre(valeur) {
    return typeof valeur === "number" && isFinite(valeur);
  }

  function entier(valeur, defaut) {
    var nombre = Number(valeur);
    return isFinite(nombre) ? Math.round(nombre) : defaut;
  }

  function maintenant() {
    return new Date().toISOString();
  }

  function jourDe(date) {
    var d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return "";
    var mois = String(d.getMonth() + 1);
    var jour = String(d.getDate());
    return d.getFullYear() + "-" + (mois.length < 2 ? "0" + mois : mois) + "-" + (jour.length < 2 ? "0" + jour : jour);
  }

  function aujourdhui() {
    return jourDe(new Date());
  }

  function identifiant(prefixe) {
    return prefixe + "-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 7);
  }

  function copie(valeur) {
    return JSON.parse(JSON.stringify(valeur));
  }

  function etatParDefaut() {
    return {
      version: VERSION,
      profil: {
        pseudo: "",
        niveau: "college",
        objectifHebdo: 240,
        matieresPreferees: [],
        cree: maintenant()
      },
      lecons: {},
      quiz: {},
      notes: [],
      taches: [],
      objectifs: [],
      sessions: [],
      lectures: {},
      activite: [],
      badges: {},
      reglages: { theme: "clair" }
    };
  }

  function fusionner(base, sauvegarde) {
    if (!sauvegarde || typeof sauvegarde !== "object") return base;
    var resultat = base;
    Object.keys(base).forEach(function (cle) {
      if (sauvegarde[cle] === undefined) return;
      if (Array.isArray(base[cle])) {
        resultat[cle] = Array.isArray(sauvegarde[cle]) ? sauvegarde[cle] : base[cle];
      } else if (base[cle] && typeof base[cle] === "object") {
        resultat[cle] = Object.assign({}, base[cle], sauvegarde[cle] && typeof sauvegarde[cle] === "object" ? sauvegarde[cle] : {});
      } else {
        resultat[cle] = sauvegarde[cle];
      }
    });
    resultat.version = VERSION;
    return resultat;
  }

  function charger() {
    var base = etatParDefaut();
    try {
      var brut = window.localStorage.getItem(CLE);
      if (!brut) return base;
      return fusionner(base, JSON.parse(brut));
    } catch (erreur) {
      if (window.console && console.warn) console.warn("[SepsHaness] Sauvegarde locale illisible :", erreur);
      return base;
    }
  }

  function sauvegarder(silencieux) {
    try {
      window.localStorage.setItem(CLE, JSON.stringify(etat));
    } catch (erreur) {
      if (window.console && console.warn) console.warn("[SepsHaness] Impossible d'enregistrer :", erreur);
      return false;
    }
    if (!silencieux) notifier();
    return true;
  }

  function notifier() {
    abonnes.forEach(function (abonne) {
      try {
        abonne(etat);
      } catch (erreur) {
        if (window.console && console.error) console.error(erreur);
      }
    });
  }

  function enregistrerActivite() {
    var jour = aujourdhui();
    if (etat.activite.indexOf(jour) === -1) {
      etat.activite.push(jour);
      etat.activite.sort();
      if (etat.activite.length > 400) etat.activite = etat.activite.slice(-400);
    }
  }

  function donnees() {
    return window.APP_DATA || { cours: [], matieres: [], niveaux: [], badges: [] };
  }

  function coursDe(slug) {
    var app = donnees();
    return app.coursParSlug ? app.coursParSlug[slug] || null : null;
  }

  function leconVide() {
    return { statut: "jamais", score: null, minutes: 0, vues: 0, derniereVisite: null };
  }

  /* ---------------------------------------------------------------------
     Profil
     --------------------------------------------------------------------- */
  function profil() {
    return etat.profil;
  }

  function majProfil(modifications) {
    if (!modifications || typeof modifications !== "object") return profil();
    Object.keys(modifications).forEach(function (cle) {
      if (["pseudo", "niveau", "objectifHebdo", "matieresPreferees"].indexOf(cle) === -1) return;
      if (cle === "objectifHebdo") {
        etat.profil.objectifHebdo = Math.max(30, Math.min(3000, entier(modifications[cle], etat.profil.objectifHebdo)));
      } else if (cle === "matieresPreferees") {
        etat.profil.matieresPreferees = Array.isArray(modifications[cle]) ? modifications[cle].slice(0, 6) : [];
      } else {
        etat.profil[cle] = String(modifications[cle] == null ? "" : modifications[cle]).slice(0, 60);
      }
    });
    sauvegarder();
    return profil();
  }

  function initiales() {
    var pseudo = String(etat.profil.pseudo || "").trim();
    if (!pseudo) return "?";
    var morceaux = pseudo.split(/\s+/).filter(Boolean);
    if (morceaux.length === 1) return morceaux[0].slice(0, 2).toUpperCase();
    return (morceaux[0].charAt(0) + morceaux[morceaux.length - 1].charAt(0)).toUpperCase();
  }

  function niveauCourant() {
    var niveau = etat.profil.niveau;
    var niveauExiste = (donnees().niveaux || []).some(function (n) {
      return n.id === niveau;
    });
    return niveauExiste ? niveau : "college";
  }

  /* ---------------------------------------------------------------------
     Cours et quiz
     --------------------------------------------------------------------- */
  function lecon(slug) {
    var sauvegarde = etat.lecons[slug];
    if (!sauvegarde) return leconVide();
    return Object.assign(leconVide(), sauvegarde);
  }

  function marquerVue(slug) {
    if (!slug) return;
    var existante = etat.lecons[slug];
    if (!existante) existante = etat.lecons[slug] = leconVide();
    existante.vues = entier(existante.vues, 0) + 1;
    existante.derniereVisite = maintenant();
    if (existante.statut !== "termine") existante.statut = "en-cours";
    enregistrerActivite();
    sauvegarder();
  }

  function marquerTermine(slug, options) {
    if (!slug) return;
    var reglages = options || {};
    var existante = etat.lecons[slug];
    if (!existante) existante = etat.lecons[slug] = leconVide();
    existante.statut = "termine";
    existante.derniereVisite = maintenant();
    if (estNombre(reglages.score)) existante.score = Math.max(0, Math.min(100, Math.round(reglages.score)));
    if (isFinite(Number(reglages.minutes))) existante.minutes = entier(existante.minutes, 0) + Math.max(0, entier(reglages.minutes, 0));
    if (!existante.vues) existante.vues = 1;
    enregistrerActivite();
    sauvegarder();
  }

  function estTermine(slug) {
    return !!(etat.lecons[slug] && etat.lecons[slug].statut === "termine");
  }

  function enregistrerQuiz(slug, score, total) {
    if (!slug || !total) return;
    var pourcentage = Math.max(0, Math.min(100, Math.round((Number(score) / Number(total)) * 100)));
    var entree = etat.quiz[slug] || { meilleurScore: 0, tentatives: 0, historique: [] };
    entree.meilleurScore = Math.max(entier(entree.meilleurScore, 0), pourcentage);
    entree.tentatives = entier(entree.tentatives, 0) + 1;
    entree.historique.unshift({ score: Number(score), total: Number(total), pourcentage: pourcentage, date: maintenant() });
    if (entree.historique.length > 20) entree.historique = entree.historique.slice(0, 20);
    etat.quiz[slug] = entree;

    var existante = etat.lecons[slug] || (etat.lecons[slug] = leconVide());
    existante.score = entree.meilleurScore;
    enregistrerActivite();
    sauvegarder();
    return entree;
  }

  function quiz(slug) {
    var entree = etat.quiz[slug];
    if (!entree) return { meilleurScore: 0, tentatives: 0, historique: [] };
    return copie(entree);
  }

  function progressionMatiere(matiereId) {
    var app = donnees();
    var liste = (app.coursDeMatiere ? app.coursDeMatiere(matiereId) : []).filter(Boolean);
    var termines = liste.filter(function (c) {
      return estTermine(c.slug);
    }).length;
    return {
      termines: termines,
      total: liste.length,
      pourcentage: liste.length ? Math.round((termines / liste.length) * 100) : 0
    };
  }

  function progressionNiveau(niveauId) {
    var app = donnees();
    var liste = (app.coursDuNiveau ? app.coursDuNiveau(niveauId) : []).filter(Boolean);
    var termines = liste.filter(function (c) {
      return estTermine(c.slug);
    }).length;
    return {
      termines: termines,
      total: liste.length,
      pourcentage: liste.length ? Math.round((termines / liste.length) * 100) : 0
    };
  }

  function progressionGlobale() {
    var liste = (donnees().cours || []).filter(Boolean);
    var termines = liste.filter(function (c) {
      return estTermine(c.slug);
    }).length;
    return {
      termines: termines,
      total: liste.length,
      pourcentage: liste.length ? Math.round((termines / liste.length) * 100) : 0
    };
  }

  function progressionParcours(slugs) {
    var liste = (slugs || []).map(coursDe).filter(Boolean);
    var termines = liste.filter(function (c) {
      return estTermine(c.slug);
    }).length;
    return {
      termines: termines,
      total: liste.length,
      pourcentage: liste.length ? Math.round((termines / liste.length) * 100) : 0
    };
  }

  function derniereLecon() {
    var candidats = Object.keys(etat.lecons)
      .map(function (slug) {
        return { slug: slug, lecon: etat.lecons[slug], cours: coursDe(slug) };
      })
      .filter(function (element) {
        return element.cours && element.lecon.derniereVisite;
      })
      .sort(function (a, b) {
        return String(b.lecon.derniereVisite).localeCompare(String(a.lecon.derniereVisite));
      });
    return candidats.length ? candidats[0].cours : null;
  }

  function coursRecommande() {
    var app = donnees();
    var liste = (app.cours || []).filter(function (c) {
      return c && !estTermine(c.slug);
    });
    if (!liste.length) return null;

    var derniere = derniereLecon();
    if (derniere && !estTermine(derniere.slug)) return derniere;

    var niveau = niveauCourant();
    var duNiveau = liste.filter(function (c) {
      return c.niveau === niveau;
    });
    return duNiveau[0] || liste[0] || null;
  }

  /* ---------------------------------------------------------------------
     Temps et série
     --------------------------------------------------------------------- */
  function minutesTotales() {
    return etat.sessions.reduce(function (total, session) {
      return total + entier(session.minutes, 0);
    }, 0);
  }

  function serie() {
    var jours = {};
    etat.activite.forEach(function (jour) {
      if (jour) jours[jour] = true;
    });
    var curseur = new Date();
    curseur = new Date(curseur.getFullYear(), curseur.getMonth(), curseur.getDate());
    if (!jours[jourDe(curseur)]) curseur.setDate(curseur.getDate() - 1);
    var compte = 0;
    while (jours[jourDe(curseur)]) {
      compte += 1;
      curseur.setDate(curseur.getDate() - 1);
    }
    return compte;
  }

  function minutesParJour(nombreJours) {
    var total = Math.max(1, Math.min(31, entier(nombreJours, 7)));
    var parJour = {};
    etat.sessions.forEach(function (session) {
      var jour = session.date || jourDe(session.cree || new Date());
      parJour[jour] = (parJour[jour] || 0) + entier(session.minutes, 0);
    });
    var sortie = [];
    var base = new Date();
    base = new Date(base.getFullYear(), base.getMonth(), base.getDate());
    for (var i = total - 1; i >= 0; i -= 1) {
      var date = new Date(base.getFullYear(), base.getMonth(), base.getDate() - i);
      var cle = jourDe(date);
      sortie.push({
        date: cle,
        minutes: parJour[cle] || 0,
        label: date.toLocaleDateString("fr-FR", { weekday: "short" }),
        labelLong: date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })
      });
    }
    return sortie;
  }

  function minutesParMatiere() {
    var cumul = {};
    etat.sessions.forEach(function (session) {
      var matiereId = session.matiere || "autre";
      cumul[matiereId] = (cumul[matiereId] || 0) + entier(session.minutes, 0);
    });
    var total = Object.keys(cumul).reduce(function (somme, cle) {
      return somme + cumul[cle];
    }, 0);
    return Object.keys(cumul)
      .map(function (matiereId) {
        return {
          matiere: matiereId,
          minutes: cumul[matiereId],
          pourcentage: total ? Math.round((cumul[matiereId] / total) * 100) : 0
        };
      })
      .sort(function (a, b) {
        return b.minutes - a.minutes;
      });
  }

  function minutesSemaine() {
    var maintenantDate = new Date();
    var debut = new Date(maintenantDate.getFullYear(), maintenantDate.getMonth(), maintenantDate.getDate());
    var jourSemaine = debut.getDay() === 0 ? 7 : debut.getDay();
    debut.setDate(debut.getDate() - (jourSemaine - 1));
    var limite = jourDe(debut);
    return etat.sessions.reduce(function (total, session) {
      var jour = session.date || jourDe(session.cree || new Date());
      return jour >= limite ? total + entier(session.minutes, 0) : total;
    }, 0);
  }

  function estObjectifAtteint() {
    return minutesSemaine() >= entier(etat.profil.objectifHebdo, 240);
  }

  function moyenneQuiz() {
    var pourcentages = [];
    Object.keys(etat.quiz).forEach(function (slug) {
      (etat.quiz[slug].historique || []).forEach(function (entree) {
        if (estNombre(entree.pourcentage)) pourcentages.push(entree.pourcentage);
      });
    });
    if (!pourcentages.length) return null;
    var somme = pourcentages.reduce(function (total, valeur) {
      return total + valeur;
    }, 0);
    return Math.round(somme / pourcentages.length);
  }

  /* ---------------------------------------------------------------------
     Badges
     --------------------------------------------------------------------- */
  function badgesObtenus() {
    var app = donnees();
    var liste = app.badges || [];
    var termines = (app.cours || []).filter(function (c) {
      return estTermine(c.slug);
    });
    var matieresSuivies = {};
    termines.forEach(function (c) {
      matieresSuivies[c.matiere] = true;
    });
    var quizParfait = Object.keys(etat.quiz).some(function (slug) {
      return entier(etat.quiz[slug].meilleurScore, 0) >= 100;
    });
    var tachesFaites = etat.taches.filter(function (tache) {
      return tache.fait;
    }).length;
    var sessionLongue = etat.sessions.some(function (session) {
      return entier(session.minutes, 0) >= 25;
    });

    var conditions = {
      "premier-cours": termines.length >= 1,
      "cinq-cours": termines.length >= 5,
      "dix-cours": termines.length >= 10,
      "quiz-parfait": quizParfait,
      "serie-3": serie() >= 3,
      "deux-heures": minutesTotales() >= 120,
      "trois-matieres": Object.keys(matieresSuivies).length >= 3,
      "premiere-note": etat.notes.length >= 1,
      "cinq-taches": tachesFaites >= 5,
      "objectif-session": sessionLongue
    };

    var changements = false;
    var obtenus = [];
    liste.forEach(function (badge) {
      if (!conditions[badge.id]) return;
      obtenus.push(badge.id);
      if (!etat.badges[badge.id]) {
        etat.badges[badge.id] = maintenant();
        changements = true;
      }
    });
    if (changements) sauvegarder(true);
    return obtenus;
  }

  function badge(id) {
    var app = donnees();
    var definition = (app.badges || []).filter(function (b) {
      return b.id === id;
    })[0];
    if (!definition) return null;
    return Object.assign({}, definition, {
      obtenu: !!etat.badges[id],
      obtenuLe: etat.badges[id] || null
    });
  }

  /* ---------------------------------------------------------------------
     Documents
     --------------------------------------------------------------------- */
  function marquerDocumentLu(docId) {
    if (!docId) return;
    var lecture = etat.lectures[docId] || { vues: 0, derniereVisite: null };
    lecture.vues = entier(lecture.vues, 0) + 1;
    lecture.derniereVisite = maintenant();
    etat.lectures[docId] = lecture;
    enregistrerActivite();
    sauvegarder();
  }

  function documentLu(docId) {
    return !!etat.lectures[docId];
  }

  function documentsLus() {
    return Object.keys(etat.lectures).length;
  }

  /* ---------------------------------------------------------------------
     Notes
     --------------------------------------------------------------------- */
  function notes() {
    return copie(etat.notes);
  }

  function note(id) {
    var trouvee = etat.notes.filter(function (n) {
      return n.id === id;
    })[0];
    return trouvee ? copie(trouvee) : null;
  }

  function ajouterNote(donneesNote) {
    var source = donneesNote || {};
    var nouvelle = {
      id: identifiant("note"),
      titre: String(source.titre || "Note sans titre").slice(0, 120),
      contenu: String(source.contenu || "").slice(0, 20000),
      matiere: source.matiere || "",
      coursSlug: source.coursSlug || "",
      epingle: !!source.epingle,
      cree: maintenant(),
      maj: maintenant()
    };
    etat.notes.unshift(nouvelle);
    enregistrerActivite();
    sauvegarder();
    return copie(nouvelle);
  }

  function majNote(id, modifications) {
    var trouvee = etat.notes.filter(function (n) {
      return n.id === id;
    })[0];
    if (!trouvee) return null;
    var source = modifications || {};
    ["titre", "contenu", "matiere", "coursSlug"].forEach(function (cle) {
      if (source[cle] !== undefined) trouvee[cle] = String(source[cle]);
    });
    if (source.epingle !== undefined) trouvee.epingle = !!source.epingle;
    trouvee.maj = maintenant();
    sauvegarder();
    return copie(trouvee);
  }

  function supprimerNote(id) {
    var avant = etat.notes.length;
    etat.notes = etat.notes.filter(function (n) {
      return n.id !== id;
    });
    if (etat.notes.length !== avant) {
      sauvegarder();
      return true;
    }
    return false;
  }

  /* ---------------------------------------------------------------------
     Tâches
     --------------------------------------------------------------------- */
  function taches() {
    return copie(etat.taches);
  }

  function ajouterTache(donneesTache) {
    var source = donneesTache || {};
    var priorites = ["basse", "normale", "haute"];
    var nouvelle = {
      id: identifiant("tache"),
      titre: String(source.titre || "Tâche sans titre").slice(0, 160),
      matiere: source.matiere || "",
      coursSlug: source.coursSlug || "",
      echeance: source.echeance || "",
      priorite: priorites.indexOf(source.priorite) !== -1 ? source.priorite : "normale",
      fait: false,
      cree: maintenant(),
      faitLe: null
    };
    etat.taches.unshift(nouvelle);
    enregistrerActivite();
    sauvegarder();
    return copie(nouvelle);
  }

  function majTache(id, modifications) {
    var trouvee = etat.taches.filter(function (t) {
      return t.id === id;
    })[0];
    if (!trouvee) return null;
    var source = modifications || {};
    ["titre", "matiere", "coursSlug", "echeance", "priorite"].forEach(function (cle) {
      if (source[cle] !== undefined) trouvee[cle] = String(source[cle]);
    });
    if (source.fait !== undefined) {
      trouvee.fait = !!source.fait;
      trouvee.faitLe = trouvee.fait ? maintenant() : null;
    }
    sauvegarder();
    return copie(trouvee);
  }

  function basculerTache(id) {
    var trouvee = etat.taches.filter(function (t) {
      return t.id === id;
    })[0];
    if (!trouvee) return null;
    return majTache(id, { fait: !trouvee.fait });
  }

  function supprimerTache(id) {
    var avant = etat.taches.length;
    etat.taches = etat.taches.filter(function (t) {
      return t.id !== id;
    });
    if (etat.taches.length !== avant) {
      sauvegarder();
      return true;
    }
    return false;
  }

  /* ---------------------------------------------------------------------
     Objectifs
     --------------------------------------------------------------------- */
  function objectifs() {
    return copie(etat.objectifs);
  }

  function ajouterObjectif(donneesObjectif) {
    var source = donneesObjectif || {};
    var cible = entier(source.cible, 1);
    var nouveau = {
      id: identifiant("objectif"),
      titre: String(source.titre || "Objectif").slice(0, 160),
      cible: cible > 0 ? cible : 1,
      progression: 0,
      echeance: source.echeance || "",
      fait: false,
      cree: maintenant()
    };
    etat.objectifs.unshift(nouveau);
    enregistrerActivite();
    sauvegarder();
    return copie(nouveau);
  }

  function majObjectif(id, modifications) {
    var trouvee = etat.objectifs.filter(function (o) {
      return o.id === id;
    })[0];
    if (!trouvee) return null;
    var source = modifications || {};
    if (source.titre !== undefined) trouvee.titre = String(source.titre).slice(0, 160);
    if (source.echeance !== undefined) trouvee.echeance = String(source.echeance);
    if (source.cible !== undefined) trouvee.cible = Math.max(1, entier(source.cible, trouvee.cible));
    if (source.progression !== undefined) trouvee.progression = Math.max(0, entier(source.progression, 0));
    if (source.fait !== undefined) trouvee.fait = !!source.fait;
    if (trouvee.progression >= trouvee.cible) trouvee.fait = true;
    sauvegarder();
    return copie(trouvee);
  }

  function supprimerObjectif(id) {
    var avant = etat.objectifs.length;
    etat.objectifs = etat.objectifs.filter(function (o) {
      return o.id !== id;
    });
    if (etat.objectifs.length !== avant) {
      sauvegarder();
      return true;
    }
    return false;
  }

  /* ---------------------------------------------------------------------
     Sessions d'étude
     --------------------------------------------------------------------- */
  function journaliserSession(donneesSession) {
    var source = donneesSession || {};
    var minutes = Math.max(1, Math.min(600, entier(source.minutes, 0)));
    if (!minutes) return null;
    var session = {
      id: identifiant("session"),
      minutes: minutes,
      matiere: source.matiere || "",
      coursSlug: source.coursSlug || "",
      note: String(source.note || "").slice(0, 200),
      date: source.date || aujourdhui(),
      cree: maintenant()
    };
    etat.sessions.unshift(session);
    if (etat.sessions.length > 500) etat.sessions = etat.sessions.slice(0, 500);
    enregistrerActivite();
    sauvegarder();
    return copie(session);
  }

  function sessions(nombreMax) {
    var limite = entier(nombreMax, 0);
    var liste = etat.sessions.slice().sort(function (a, b) {
      return String(b.cree).localeCompare(String(a.cree));
    });
    return copie(limite > 0 ? liste.slice(0, limite) : liste);
  }

  function supprimerSession(id) {
    var avant = etat.sessions.length;
    etat.sessions = etat.sessions.filter(function (s) {
      return s.id !== id;
    });
    if (etat.sessions.length !== avant) {
      sauvegarder();
      return true;
    }
    return false;
  }

  /* ---------------------------------------------------------------------
     Réglages / export / import
     --------------------------------------------------------------------- */
  function reglages() {
    return { theme: etat.reglages.theme === "sombre" ? "sombre" : "clair", objectifHebdo: profil().objectifHebdo };
  }

  function majReglages(modifications) {
    var source = modifications || {};
    if (source.theme !== undefined) etat.reglages.theme = source.theme === "sombre" ? "sombre" : "clair";
    if (source.objectifHebdo !== undefined) {
      etat.profil.objectifHebdo = Math.max(30, Math.min(3000, entier(source.objectifHebdo, etat.profil.objectifHebdo)));
    }
    sauvegarder();
    return reglages();
  }

  function exportJSON() {
    return JSON.stringify(etat, null, 2);
  }

  function importJSON(texte) {
    try {
      var donneesImportees = JSON.parse(texte);
      if (!donneesImportees || typeof donneesImportees !== "object" || !donneesImportees.profil) return false;
      if (!Array.isArray(donneesImportees.notes) || !Array.isArray(donneesImportees.sessions)) return false;
      etat = fusionner(etatParDefaut(), donneesImportees);
      sauvegarder();
      return true;
    } catch (erreur) {
      return false;
    }
  }

  function reinitialiser() {
    etat = etatParDefaut();
    sauvegarder();
    return etat;
  }

  /* ---------------------------------------------------------------------
     Abonnement
     --------------------------------------------------------------------- */
  function subscribe(abonne) {
    if (typeof abonne !== "function") return function () {};
    abonnes.push(abonne);
    return function () {
      abonnes = abonnes.filter(function (element) {
        return element !== abonne;
      });
    };
  }

  window.Store = {
    CLE: CLE,
    VERSION: VERSION,
    get: function () {
      return etat;
    },
    save: function () {
      return sauvegarder();
    },
    subscribe: subscribe,
    reset: reinitialiser,
    exportJSON: exportJSON,
    importJSON: importJSON,

    profil: profil,
    majProfil: majProfil,
    initiales: initiales,
    niveauCourant: niveauCourant,

    lecon: lecon,
    marquerVue: marquerVue,
    marquerTermine: marquerTermine,
    estTermine: estTermine,
    enregistrerQuiz: enregistrerQuiz,
    quiz: quiz,
    progressionMatiere: progressionMatiere,
    progressionNiveau: progressionNiveau,
    progressionGlobale: progressionGlobale,
    progressionParcours: progressionParcours,
    derniereLecon: derniereLecon,
    coursRecommande: coursRecommande,

    serie: serie,
    minutesTotales: minutesTotales,
    minutesParJour: minutesParJour,
    minutesParMatiere: minutesParMatiere,
    minutesSemaine: minutesSemaine,
    estObjectifAtteint: estObjectifAtteint,
    moyenneQuiz: moyenneQuiz,

    badgesObtenus: badgesObtenus,
    badge: badge,

    marquerDocumentLu: marquerDocumentLu,
    documentLu: documentLu,
    documentsLus: documentsLus,

    notes: notes,
    note: note,
    ajouterNote: ajouterNote,
    majNote: majNote,
    supprimerNote: supprimerNote,

    taches: taches,
    ajouterTache: ajouterTache,
    majTache: majTache,
    basculerTache: basculerTache,
    supprimerTache: supprimerTache,

    objectifs: objectifs,
    ajouterObjectif: ajouterObjectif,
    majObjectif: majObjectif,
    supprimerObjectif: supprimerObjectif,

    journaliserSession: journaliserSession,
    sessions: sessions,
    supprimerSession: supprimerSession,

    reglages: reglages,
    majReglages: majReglages
  };
})();
