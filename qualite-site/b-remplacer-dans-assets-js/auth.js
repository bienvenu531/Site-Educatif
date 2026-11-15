/* Inscription et connexion à l'espace Excellence. */
(function () {
  "use strict";

  var token = "";
  var message = document.getElementById("auth-message");
  var tabLogin = document.getElementById("tab-login");
  var tabRegister = document.getElementById("tab-register");
  var panelLogin = document.getElementById("panel-login");
  var panelRegister = document.getElementById("panel-register");

  function afficherMessage(texte, type) {
    message.textContent = texte;
    message.dataset.type = type || "error";
    message.hidden = false;
  }

  function changerOnglet(inscription) {
    tabLogin.classList.toggle("is-active", !inscription);
    tabRegister.classList.toggle("is-active", inscription);
    tabLogin.setAttribute("aria-selected", inscription ? "false" : "true");
    tabRegister.setAttribute("aria-selected", inscription ? "true" : "false");
    panelLogin.hidden = inscription;
    panelRegister.hidden = !inscription;
    message.hidden = true;
    (inscription ? document.getElementById("register-name") : document.getElementById("login-email")).focus();
  }

  function demander(action, options) {
    return fetch("/api/auth.php?action=" + encodeURIComponent(action), options || {})
      .then(function (reponse) {
        return reponse.json().catch(function () { return {}; }).then(function (contenu) {
          if (!reponse.ok) throw new Error(contenu.error || "Le service de compte ne répond pas.");
          return contenu;
        });
      });
  }

  function traiterFormulaire(formulaire, action) {
    formulaire.addEventListener("submit", function (evenement) {
      evenement.preventDefault();
      if (!formulaire.reportValidity()) return;

      var champs = new FormData(formulaire);
      var donnees = {
        name: champs.get("name"),
        email: champs.get("email"),
        password: champs.get("password")
      };
      if (action === "register" && donnees.password !== champs.get("confirm")) {
        afficherMessage("Les deux mots de passe ne sont pas identiques.");
        document.getElementById("register-confirm").focus();
        return;
      }
      if (action === "register") {
        var consentement = formulaire.querySelector("#register-consent");
        if (consentement && !consentement.checked) {
          afficherMessage("Pour créer ton compte, accepte les conditions d’utilisation et la politique de confidentialité.");
          consentement.focus();
          return;
        }
      }

      var bouton = formulaire.querySelector(".auth-submit");
      var texteInitial = bouton.querySelector("span").textContent;
      bouton.disabled = true;
      bouton.querySelector("span").textContent = action === "login" ? "Connexion…" : "Création…";
      message.hidden = true;

      var jeton = token ? Promise.resolve(token) : demander("csrf").then(function (reponse) {
        token = reponse.csrf_token || "";
        return token;
      });

      jeton
        .then(function (valeur) {
          return demander(action, {
            method: "POST",
            credentials: "same-origin",
            headers: { "Content-Type": "application/json", "X-CSRF-Token": valeur },
            body: JSON.stringify(donnees)
          });
        })
        .then(function (reponse) {
          token = reponse.csrf_token || "";
          try {
            window.localStorage.setItem("excellence.accountId", String(reponse.user.id));
          } catch (erreur) {
            console.warn("[Excellence] Le stockage local est indisponible.", erreur);
          }
          window.location.replace("/");
        })
        .catch(function (erreur) {
          afficherMessage(erreur.message || "Une erreur est survenue. Réessaie.");
          bouton.disabled = false;
          bouton.querySelector("span").textContent = texteInitial;
        });
    });
  }

  tabLogin.addEventListener("click", function () { changerOnglet(false); });
  tabRegister.addEventListener("click", function () { changerOnglet(true); });
  traiterFormulaire(document.getElementById("form-login"), "login");
  traiterFormulaire(document.getElementById("form-register"), "register");

  demander("me", { credentials: "same-origin", cache: "no-store" })
    .then(function (reponse) {
      token = reponse.csrf_token || "";
      if (reponse.authenticated) window.location.replace("/");
    })
    .catch(function () {
      afficherMessage("Le service de compte n’est pas encore accessible. Réessaie dans un instant.");
    });

  /* --- Qualité : liens légaux et consentement (sans modifier le gabarit) --- */
  (function () {
    var style = document.createElement("style");
    style.textContent =
      ".auth-footer{flex-wrap:wrap;gap:.4rem 1rem;text-align:center}" +
      ".auth-footer__legal{display:flex;flex-wrap:wrap;gap:.35rem .9rem;justify-content:center;font-size:.84rem}" +
      ".auth-footer__legal a{color:inherit;text-decoration:underline;text-underline-offset:2px}" +
      ".auth-form .auth-consent{display:flex;gap:.55rem;align-items:flex-start;margin:.15rem 0 1rem;font-size:.89rem;line-height:1.5;color:#4a5a55;font-weight:400}" +
      ".auth-consent input{width:1.05rem;height:1.05rem;margin:.15rem 0 0;accent-color:#18836f;flex:none}" +
      ".auth-consent a{color:#126d5c}";
    document.head.appendChild(style);

    var pied = document.querySelector(".auth-footer");
    if (pied && !pied.querySelector(".auth-footer__legal")) {
      var legal = document.createElement("span");
      legal.className = "auth-footer__legal";
      legal.innerHTML =
        '<a href="mentions-legales.html">Mentions légales</a>' +
        '<a href="confidentialite.html">Confidentialité</a>' +
        '<a href="cgu.html">Conditions d’utilisation</a>';
      pied.appendChild(legal);
    }

    var formRegister = document.getElementById("form-register");
    if (formRegister && !document.getElementById("register-consent")) {
      var bouton = formRegister.querySelector(".auth-submit");
      var ligne = document.createElement("label");
      ligne.className = "auth-consent";
      ligne.setAttribute("for", "register-consent");
      ligne.innerHTML =
        '<input type="checkbox" id="register-consent" name="consent" value="oui" required />' +
        '<span>J’accepte les <a href="cgu.html">conditions d’utilisation</a> et la ' +
        '<a href="confidentialite.html">politique de confidentialité</a>. ' +
        'Je peux supprimer mon compte à tout moment.</span>';
      formRegister.insertBefore(ligne, bouton);
    }
  })();
})();
