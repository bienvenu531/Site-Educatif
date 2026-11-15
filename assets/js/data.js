/* ==========================================================================
   SepsHaness — agrégation des données
   Les fichiers data/*.js poussent dans window.REG ; ce fichier construit
   window.APP_DATA : index, libellés et fonctions utilitaires.
   ========================================================================== */
(function () {
  "use strict";

  window.REG = window.REG || {};
  var R = window.REG;

  var erreurs = [];

  function tableau(valeur) {
    return Array.isArray(valeur) ? valeur : [];
  }

  /* ---------------------------------------------------------------------
     Dédoublonnage + contrôle minimal
     --------------------------------------------------------------------- */
  function indexerPar(liste, cle, etiquette) {
    var vu = {};
    var propre = [];
    tableau(liste).forEach(function (element) {
      if (!element) return;
      var identifiant = element[cle];
      if (!identifiant) {
        erreurs.push(etiquette + " sans champ « " + cle + " »");
        return;
      }
      if (vu[identifiant]) {
        erreurs.push("Doublon de " + etiquette + " : " + identifiant);
        return;
      }
      vu[identifiant] = true;
      propre.push(element);
    });
    return propre;
  }

  var niveauIds = {};
  var niveaux = indexerPar(R.niveaux, "id", "niveau");
  niveaux.forEach(function (niveau) {
    niveauIds[niveau.id] = true;
  });

  var matieres = indexerPar(R.matieres, "id", "matière");
  var matiereIds = {};
  matieres.forEach(function (matiere) {
    matiereIds[matiere.id] = true;
  });

  var cours = indexerPar(R.cours, "slug", "cours");
  var documents = indexerPar(R.documents, "id", "document");
  var parcours = indexerPar(R.parcours, "id", "parcours");

  cours.forEach(function (c) {
    if (!matiereIds[c.matiere]) erreurs.push("Cours " + c.slug + " : matière inconnue « " + c.matiere + " »");
    if (!niveauIds[c.niveau]) erreurs.push("Cours " + c.slug + " : niveau inconnu « " + c.niveau + " »");
    if (!tableau(c.sections).length) erreurs.push("Cours " + c.slug + " : aucune section");
  });

  documents.forEach(function (d) {
    if (!matiereIds[d.matiere]) erreurs.push("Document " + d.id + " : matière inconnue « " + d.matiere + " »");
    if (!niveauIds[d.niveau]) erreurs.push("Document " + d.id + " : niveau inconnu « " + d.niveau + " »");
  });

  if (erreurs.length && window.console && console.warn) {
    console.warn("[SepsHaness] Données :\n- " + erreurs.join("\n- "));
  }

  /* ---------------------------------------------------------------------
     Index
     --------------------------------------------------------------------- */
  var coursParSlug = {};
  cours.forEach(function (c) {
    coursParSlug[c.slug] = c;
  });

  var documentsParId = {};
  documents.forEach(function (d) {
    documentsParId[d.id] = d;
  });

  var niveauxParId = {};
  niveaux.forEach(function (n) {
    niveauxParId[n.id] = n;
  });

  var matieresParId = {};
  matieres.forEach(function (m) {
    matieresParId[m.id] = m;
  });

  /* ---------------------------------------------------------------------
     Libellés partagés
     --------------------------------------------------------------------- */
  var typesDocument = [
    { id: "fiche", nom: "Fiche", icone: "fiche", teinte: "indigo" },
    { id: "methode", nom: "Méthode", icone: "methode", teinte: "violet" },
    { id: "formulaire", nom: "Formulaire", icone: "formulaire", teinte: "cyan" },
    { id: "annale", nom: "Annale", icone: "annale", teinte: "amber" },
    { id: "carte", nom: "Carte mentale", icone: "carte", teinte: "emerald" },
    { id: "protocole", nom: "Protocole", icone: "protocole", teinte: "rose" }
  ];

  var typesParId = {};
  typesDocument.forEach(function (t) {
    typesParId[t.id] = t;
  });

  var niveauxDifficulte = [
    { valeur: 1, nom: "Découverte", teinte: "emerald" },
    { valeur: 2, nom: "Consolidation", teinte: "amber" },
    { valeur: 3, nom: "Approfondi", teinte: "rose" }
  ];

  var ordreNiveaux = {};
  niveaux.forEach(function (niveau, position) {
    ordreNiveaux[niveau.id] = position;
  });

  var datesDocuments = documents
    .map(function (d) {
      return d.maj || "";
    })
    .filter(Boolean)
    .sort();

  /* ---------------------------------------------------------------------
     Accès et calculs
     --------------------------------------------------------------------- */
  function getCours(slug) {
    return coursParSlug[slug] || null;
  }

  function getDocument(id) {
    return documentsParId[id] || null;
  }

  function matiere(id) {
    return (
      matieresParId[id] || {
        id: id || "inconnue",
        nom: id ? String(id) : "Matière",
        icone: "livre",
        teinte: "slate",
        description: ""
      }
    );
  }

  function niveau(id) {
    return (
      niveauxParId[id] || {
        id: id || "inconnu",
        nom: id ? String(id) : "Niveau",
        detail: "",
        ages: "",
        icone: "livre",
        teinte: "slate",
        description: "",
        points: [],
        matieres: []
      }
    );
  }

  function typeDocument(id) {
    return typesParId[id] || { id: id || "fiche", nom: "Document", icone: "document", teinte: "slate" };
  }

  function libelleDifficulte(difficulte) {
    var trouve = niveauxDifficulte.filter(function (n) {
      return n.valeur === Number(difficulte);
    })[0];
    return trouve || niveauxDifficulte[0];
  }

  function coursDuNiveau(niveauId) {
    return cours.filter(function (c) {
      return c.niveau === niveauId;
    });
  }

  function coursDeMatiere(matiereId) {
    return cours.filter(function (c) {
      return c.matiere === matiereId;
    });
  }

  function documentsDeMatiere(matiereId) {
    return documents.filter(function (d) {
      return d.matiere === matiereId;
    });
  }

  function documentsDuNiveau(niveauId) {
    return documents.filter(function (d) {
      return d.niveau === niveauId;
    });
  }

  function matieresDuNiveau(niveauId) {
    var niveauTrouve = niveauxParId[niveauId];
    var ids = niveauTrouve && tableau(niveauTrouve.matieres).length ? niveauTrouve.matieres : null;
    return matieres.filter(function (m) {
      if (ids) return ids.indexOf(m.id) !== -1;
      return cours.some(function (c) {
        return c.niveau === niveauId && c.matiere === m.id;
      });
    });
  }

  function documentsDuCours(slug) {
    var c = getCours(slug);
    if (!c) return [];
    return tableau(c.documents)
      .map(getDocument)
      .filter(Boolean);
  }

  function coursLies(slug) {
    var c = getCours(slug);
    if (!c) return [];
    return cours
      .filter(function (autre) {
        if (autre.slug === slug) return false;
        return autre.matiere === c.matiere || autre.niveau === c.niveau;
      })
      .sort(function (a, b) {
        var aMemeMatiere = a.matiere === c.matiere ? 0 : 1;
        var bMemeMatiere = b.matiere === c.matiere ? 0 : 1;
        if (aMemeMatiere !== bMemeMatiere) return aMemeMatiere - bMemeMatiere;
        return a.titre.localeCompare(b.titre, "fr");
      });
  }

  function parcoursAvecCours() {
    return parcours.map(function (p) {
      var etapes = tableau(p.cours)
        .map(function (slug) {
          return getCours(slug);
        })
        .filter(Boolean);
      return {
        id: p.id,
        titre: p.titre,
        description: p.description,
        niveau: p.niveau,
        teinte: p.teinte,
        icone: p.icone,
        duree: p.duree,
        pourQui: p.pourQui,
        etapes: etapes,
        dureeTotale: etapes.reduce(function (total, c) {
          return total + (Number(c.duree) || 0);
        }, 0)
      };
    });
  }

  function compter() {
    return {
      cours: cours.length,
      documents: documents.length,
      niveaux: niveaux.length,
      matieres: matieres.length,
      parcours: parcours.length,
      quiz: cours.reduce(function (total, c) {
        return total + tableau(c.quiz).length;
      }, 0)
    };
  }

  /** Recherche plein texte simple (titre, résumé, tags, matière) */
  function rechercherCours(termes) {
    var recherche = (termes || "").toLowerCase().trim();
    if (!recherche) return cours.slice();
    return cours.filter(function (c) {
      var champs = [c.titre, c.resume, c.classe, matiere(c.matiere).nom, niveau(c.niveau).nom]
        .concat(tableau(c.tags))
        .join(" ")
        .toLowerCase();
      return recherche.split(/\s+/).every(function (mot) {
        return champs.indexOf(mot) !== -1;
      });
    });
  }

  function rechercherDocuments(termes) {
    var recherche = (termes || "").toLowerCase().trim();
    if (!recherche) return documents.slice();
    return documents.filter(function (d) {
      var champs = [d.titre, d.description, d.classe, matiere(d.matiere).nom, niveau(d.niveau).nom]
        .concat(tableau(d.tags))
        .join(" ")
        .toLowerCase();
      return recherche.split(/\s+/).every(function (mot) {
        return champs.indexOf(mot) !== -1;
      });
    });
  }

  window.APP_DATA = {
    /* listes brutes */
    niveaux: niveaux,
    matieres: matieres,
    cours: cours,
    documents: documents,
    parcours: parcours,
    badges: tableau(R.badges),
    temoignages: tableau(R.temoignages),

    /* index */
    coursParSlug: coursParSlug,
    documentsParId: documentsParId,
    niveauxParId: niveauxParId,
    matieresParId: matieresParId,
    ordreNiveaux: ordreNiveaux,

    /* libellés */
    typesDocument: typesDocument,
    niveauxDifficulte: niveauxDifficulte,

    /* accès */
    getCours: getCours,
    getDocument: getDocument,
    matiere: matiere,
    niveau: niveau,
    typeDocument: typeDocument,
    libelleDifficulte: libelleDifficulte,
    coursDuNiveau: coursDuNiveau,
    coursDeMatiere: coursDeMatiere,
    documentsDeMatiere: documentsDeMatiere,
    documentsDuNiveau: documentsDuNiveau,
    matieresDuNiveau: matieresDuNiveau,
    documentsDuCours: documentsDuCours,
    coursLies: coursLies,
    parcoursAvecCours: parcoursAvecCours,
    rechercherCours: rechercherCours,
    rechercherDocuments: rechercherDocuments,
    compter: compter,

    /* métadonnées */
    derniereMaj: datesDocuments.length ? datesDocuments[datesDocuments.length - 1] : "",
    erreurs: erreurs,
    estPret: cours.length > 0
  };
})();
