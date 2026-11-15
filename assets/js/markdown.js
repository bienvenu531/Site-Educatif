/* ==========================================================================
   SepsHaness — mini moteur Markdown (aucune dépendance)
   MD.inline(texte)  -> HTML en ligne
   MD.block(markdown) -> HTML de bloc
   Le texte est toujours échappé avant la conversion.
   ========================================================================== */
(function () {
  "use strict";

  function echapper(texte) {
    return String(texte == null ? "" : texte)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function lienAutorise(url) {
    return /^(https?:\/\/|#|\/|\.\/|\.\.\/)/i.test(url);
  }

  /** Conversion en ligne : **gras**, *italique*, `code`, [lien](url), ==surligné== */
  function inline(texte) {
    var sortie = echapper(texte);

    // Code en ligne (protégé en premier)
    sortie = sortie.replace(/`([^`]+)`/g, function (m, code) {
      return "<code>" + code + "</code>";
    });

    // Liens Markdown
    sortie = sortie.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, function (m, libelle, url) {
      if (!lienAutorise(url)) return libelle;
      var externe = /^https?:\/\//i.test(url);
      return (
        '<a href="' +
        url +
        '"' +
        (externe ? ' target="_blank" rel="noopener noreferrer"' : "") +
        ">" +
        libelle +
        "</a>"
      );
    });

    // Gras puis italique (l'italique ne doit pas avaler les astérisques du gras)
    sortie = sortie.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    sortie = sortie.replace(/(^|[\s(«"'’])_([^_\n]+)_(?=$|[\s.,;:!?)»"'’])/g, "$1<em>$2</em>");
    sortie = sortie.replace(/(^|[\s(«"'’])\*([^*\n]+)\*(?=$|[\s.,;:!?)»"'’])/g, "$1<em>$2</em>");
    sortie = sortie.replace(/==([^=\n]+)==/g, "<mark>$1</mark>");

    return sortie;
  }

  function cellules(ligne) {
    var propre = ligne.trim();
    if (propre.charAt(0) === "|") propre = propre.slice(1);
    if (propre.charAt(propre.length - 1) === "|") propre = propre.slice(0, -1);
    return propre.split("|").map(function (c) {
      return c.trim();
    });
  }

  function estSeparateurTableau(ligne) {
    return /^\s*\|?[\s:-]*-[\s|:-]*\|?\s*$/.test(ligne) && ligne.indexOf("-") !== -1;
  }

  /** Conversion en blocs Markdown */
  function block(markdown) {
    var texte = String(markdown == null ? "" : markdown).replace(/\r\n?/g, "\n").replace(/\t/g, "    ");
    var lignes = texte.split("\n");
    var html = [];
    var i = 0;

    while (i < lignes.length) {
      var ligne = lignes[i];

      // Ligne vide
      if (/^\s*$/.test(ligne)) {
        i += 1;
        continue;
      }

      // Bloc de code ```
      var ouvertureCode = ligne.match(/^\s*```\s*([a-zA-Z0-9+#-]*)\s*$/);
      if (ouvertureCode) {
        var langage = ouvertureCode[1] || "";
        var code = [];
        i += 1;
        while (i < lignes.length && !/^\s*```\s*$/.test(lignes[i])) {
          code.push(lignes[i]);
          i += 1;
        }
        i += 1; // ferme le bloc
        var classe = langage ? ' class="langage-' + echapper(langage) + '"' : "";
        html.push("<pre><code" + classe + ">" + echapper(code.join("\n")) + "</code></pre>");
        continue;
      }

      // Titres
      var titre = ligne.match(/^\s*(#{1,6})\s+(.*)$/);
      if (titre) {
        var niveau = Math.min(6, titre[1].length + 1);
        html.push("<h" + niveau + ">" + inline(titre[2].trim()) + "</h" + niveau + ">");
        i += 1;
        continue;
      }

      // Séparateur
      if (/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(ligne)) {
        html.push("<hr />");
        i += 1;
        continue;
      }

      // Citation
      if (/^\s*>\s?/.test(ligne)) {
        var citation = [];
        while (i < lignes.length && /^\s*>\s?/.test(lignes[i])) {
          citation.push(lignes[i].replace(/^\s*>\s?/, ""));
          i += 1;
        }
        html.push("<blockquote>" + block(citation.join("\n")) + "</blockquote>");
        continue;
      }

      // Tableau
      if (ligne.trim().charAt(0) === "|" && i + 1 < lignes.length && estSeparateurTableau(lignes[i + 1])) {
        var entetes = cellules(ligne);
        i += 2;
        var corps = [];
        while (i < lignes.length && lignes[i].trim().charAt(0) === "|") {
          corps.push(cellules(lignes[i]));
          i += 1;
        }
        var tableau = ["<table><thead><tr>"];
        entetes.forEach(function (c) {
          tableau.push("<th>" + inline(c) + "</th>");
        });
        tableau.push("</tr></thead><tbody>");
        corps.forEach(function (ligneCel) {
          tableau.push("<tr>");
          for (var c = 0; c < entetes.length; c += 1) {
            tableau.push("<td>" + inline(ligneCel[c] || "") + "</td>");
          }
          tableau.push("</tr>");
        });
        tableau.push("</tbody></table>");
        html.push(tableau.join(""));
        continue;
      }

      // Listes
      var listeOrdonnee = /^\s*\d+[.)]\s+/.test(ligne);
      var listeSimple = /^\s*[-*+]\s+/.test(ligne);
      if (listeOrdonnee || listeSimple) {
        var balise = listeOrdonnee ? "ol" : "ul";
        var elements = [];
        while (i < lignes.length) {
          var courant = lignes[i];
          var correspond = listeOrdonnee ? /^\s*\d+[.)]\s+/ : /^\s*[-*+]\s+/;
          if (!correspond.test(courant)) {
            // ligne de continuation (indentée ou simple retour)
            if (/^\s{2,}\S/.test(courant) && elements.length) {
              elements[elements.length - 1] += " " + courant.trim();
              i += 1;
              continue;
            }
            break;
          }
          elements.push(courant.replace(correspond, ""));
          i += 1;
        }
        html.push("<" + balise + ">");
        elements.forEach(function (element) {
          html.push("<li>" + inline(element) + "</li>");
        });
        html.push("</" + balise + ">");
        continue;
      }

      // Paragraphe (lignes consécutives non vides)
      var paragraphe = [];
      while (i < lignes.length && !/^\s*$/.test(lignes[i])) {
        paragraphe.push(lignes[i].trim());
        i += 1;
      }
      html.push("<p>" + inline(paragraphe.join(" ")) + "</p>");
    }

    return html.join("\n");
  }

  window.MD = { inline: inline, block: block, echapper: echapper };
})();
