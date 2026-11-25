# Marahi Hanan — مراحي حنان

Projet universitaire pour une tahouna à El Alia, Bizerte : catalogue de grains, produits traditionnels et fruits secs, en français et en arabe tunisien.

## Dossiers

- `frontend/` : application React, styles, images et polices locales.
- `database/` : analyse, schéma SQL, données d’exemple et diagrammes.

## Lancer le frontend

```bash
cd frontend
npm ci
npm run dev
```

Pour générer la version statique :

```bash
npm run build
```

Le résultat se trouve dans `frontend/dist/`. Le routeur utilise des URL avec `#/`, compatibles avec un hébergement statique.

## Fonctionnalités

- Français et arabe, avec direction RTL.
- Modes clair et sombre, interface responsive.
- Catalogue, choix du poids et de la variété, panier.
- Démonstration des commandes, rendez-vous, compte et administration.

Les données de démonstration sont enregistrées dans le navigateur. Il n’y a pas encore de backend ni d’authentification réelle, et aucune commande ou aucun email n’est transmis au magasin.

Les images sont des visuels illustratifs issus des maquettes du projet. Voir `frontend/docs/ASSETS.txt` pour leur origine ainsi que les licences des icônes et des polices.
