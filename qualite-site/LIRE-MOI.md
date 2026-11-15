# Qualité — bienvenueduc.com (vague 1)

Dossier préparé le 15/11/2026. **Rien n'est encore en ligne** : ce sont des fichiers prêts à
téléverser depuis hPanel.

## Ce que ça corrige

| Problème constaté | Correction apportée |
|---|---|
| Aucune page légale (404 sur les 3) | Mentions légales, politique de confidentialité, CGU (RGPD/LCEN) |
| Aucun lien légal dans le site | Liens dans le pied de page membre **et** la page de connexion |
| Inscription sans consentement | Case à cocher obligatoire, avec liens vers les CGU et la confidentialité |
| Discours incohérent sur les données | Formulation alignée sur le fonctionnement réel (compte + synchronisation) |
| `robots.txt` et `sitemap.xml` absents | Les deux fichiers sont fournis |
| Erreur 404 brute | Page 404 soignée, cohérente avec l'identité |
| Pas de HSTS ni d'en-têtes de sécurité | `.htaccess` : HSTS, nosniff, Referrer-Policy, Permissions-Policy, X-Frame-Options |
| `www` et sans-`www` servis tous les deux | Redirection 301 vers l'adresse canonique |
| Version de PHP exposée (`X-Powered-By`) | En-tête retiré |

## Ce qu'il faut faire, dans l'ordre

1. **Sauvegarder** `.htaccess`, `assets/js/app.js`, `assets/js/auth.js` (guide § 2).
2. **Compléter** les champs « à compléter » dans les pages légales (guide § 3).
3. **Téléverser** `a-televerser-a-la-racine/` à la racine, remplacer les deux scripts (guide § 4).
4. **Vider le cache** Hostinger.
5. **Lancer la recette** : `c-outils/verifier-site.ps1` doit afficher **13/13** (guide § 6).

## Contenu

- `a-televerser-a-la-racine/` — 7 fichiers pour `public_html/`
- `b-remplacer-dans-assets-js/` — `app.js` et `auth.js` corrigés
- `c-outils/verifier-site.ps1` — contrôle automatique après déploiement
- `apercus/` — captures de contrôle (pages légales, 404, connexion desktop et mobile)
- `GUIDE-DEPLOIEMENT.md` — procédure détaillée, recette, retour arrière, suite

## Limite assumée

Le code PHP (`api/`, gabarits) n'est pas dans le dossier de projet local : le mot de passe oublié,
la vérification d'e-mail, le consentement côté serveur et la synchronisation du dépôt local avec la
production restent à faire dans le code de production (guide § 8).
