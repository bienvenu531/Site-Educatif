/**
 * SepsHaness — thème pour les pages autonomes (mentions légales, 404)
 * Applique le thème enregistré avant le rendu, sans dépendre du reste
 * de l'application. Ne fait rien si JavaScript ou le stockage sont absents.
 */
(function () {
  "use strict";

  try {
    var brut = window.localStorage.getItem("sepshaness.v1");
    if (!brut) return;
    var etat = JSON.parse(brut);
    var theme = etat && etat.reglages && etat.reglages.theme;
    if (theme === "sombre") {
      document.documentElement.setAttribute("data-theme", "sombre");
      document.documentElement.style.colorScheme = "dark";
    }
  } catch (erreur) {
    /* stockage indisponible ou contenu illisible : on garde le thème clair */
  }
})();
