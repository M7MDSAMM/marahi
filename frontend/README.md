# Marahi Hanan — مراحي حنان

Projet universitaire : une tahouna à El Alia, Bizerte. Interface React en français et en arabe, avec mode clair et sombre.

## Lancer le projet

Installer Node.js 20.19+ ou 22.12+, puis ouvrir un terminal dans ce dossier :

```bash
npm install
npm run dev
```

Ouvrir l’adresse affichée dans le terminal. Pour la version de production :

```bash
npm run build
npm run preview
```

## LAMPP

La version déjà construite se trouve dans `dist/`. Copier ce dossier de projet dans `/opt/lampp/htdocs/marahi-hanan`, démarrer Apache, puis ouvrir `http://localhost/marahi-hanan/`. Le petit `index.php` redirige uniquement vers `dist/`. Voir `LAMPP.txt` pour les étapes.

## Organisation

- `src/data.js` : produits, prix de démonstration et coordonnées du magasin.
- `src/i18n.js` : textes français et arabes.
- `src/store.jsx` : panier, commandes, langue, thème et stockage local.
- `src/components/` : en-tête, pied de page, cartes et éléments réutilisés.
- `src/pages/` : pages du site et administration.
- `src/styles.css` : couleurs, présentation, modes et tailles d’écran.
- `public/images/` : images extraites des références fournies.
- `public/fonts/` : polices et notices de licence.
- `docs/ANALYSE.txt` : analyse et périmètre en arabe.
- `docs/PROMPT.txt` : brief complet en arabe.

## Parcours

La navigation utilise des routes avec `#`, par exemple `/#/produits`, `/#/panier`, `/#/compte` et `/#/admin`. Cela facilite la mise en ligne d’une interface sans serveur.

Le catalogue comprend 12 produits, dont 6 céréales. Le prix affiché correspond au premier poids du produit. Les autres poids utilisent un calcul proportionnel simple. Les variétés n’ajoutent pas de supplément.

Pour ouvrir le compte démo, utiliser une adresse de test et un mot de passe d’au moins 8 caractères. Il n’y a pas de vérification du mot de passe, et il n’est jamais enregistré. Le formulaire d’inscription crée un profil local. L’administration est accessible par le lien du pied de page.

## Limites de la démonstration

Les données restent dans le navigateur : aucune commande, demande de rendez-vous ou message n’est transmis au magasin. Il n’y a ni backend, ni base de données, ni authentification réelle, ni séparation des commandes entre plusieurs utilisateurs du même appareil. La récupération du mot de passe ne transmet aucun email.

La page compte affiche les commandes créées sur l’appareil, à l’exclusion des deux exemples de départ. Le tableau de bord contient également un rendez-vous d’exemple. Les prix, descriptions, allergènes et frais de livraison doivent être vérifiés avant un usage commercial. Les coordonnées proviennent des maquettes.

La photo d’un produit peut être remplacée par une image JPG, PNG ou WEBP de moins de 750 Ko. Le navigateur peut limiter le stockage de plusieurs grandes images ; un message signale un problème de sauvegarde.

Le bouton WhatsApp ouvre la conversation ; l’utilisateur décide d’y envoyer un message. La carte ouvre une recherche d’El Alia, sans prétendre donner la position exacte du magasin.

Pour recommencer la démonstration, supprimer les données de ce site dans les outils du navigateur. Cela efface les modifications et rétablit les exemples au prochain chargement.

## Ensuite

Choisir le backend séparément, puis remplacer le stockage local par des requêtes à une API. Le serveur devra gérer les comptes, les autorisations, les prix finaux et les données partagées entre appareils.
