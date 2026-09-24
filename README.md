# Application de gestion d'une bibliothèque de quartier

Application web permettant de gérer les auteurs, les adhérents, les livres et les emprunts d'une bibliothèque de quartier.

## Démo en ligne

Application déployée sur Render :

https://bibliotheque-dev.onrender.com

## Technologies utilisées

* Node.js
* Express.js
* PostgreSQL
* HTML5
* CSS3
* JavaScript
* Git / GitHub
* Render

## Fonctionnalités

### Gestion des auteurs

* Ajouter un auteur
* Modifier un auteur
* Supprimer un auteur

### Gestion des adhérents

* Ajouter un adhérent
* Modifier un adhérent
* Supprimer un adhérent
* Consulter l'historique des emprunts d'un adhérent

### Gestion des livres

* Ajouter un livre
* Modifier un livre
* Supprimer un livre
* Rechercher un livre par titre ou par auteur
* Pagination des livres
* Gestion automatique de la disponibilité des livres

### Gestion des emprunts

* Créer un emprunt
* Enregistrer le retour d'un livre
* Consulter les emprunts
* Détecter les emprunts en retard

### Tableau de bord

* Nombre total de livres
* Nombre total d'adhérents
* Nombre d'emprunts en cours
* Nombre d'emprunts en retard
* Livre le plus emprunté
* Adhérent le plus actif

## Structure du projet

```text
bibliotheque/
│
├── backend/
│   ├── config/
│   │   ├── database.js
│   │   └── initDatabase.js
│   │
│   ├── controllers/
│   ├── middlewares/
│   ├── routes/
│   └── server.js
│
├── frontend/
│   ├── css/
│   ├── js/
│   └── index.html
│
├── schema.sql
├── package.json
├── package-lock.json
└── README.md
```

## Installation

### 1. Cloner le projet

```bash
git clone https://github.com/salem-devs/Bibliotheque_Dev.git
cd Bibliotheque_Dev
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d'environnement

Créer un fichier `.env` à la racine du projet :

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bibliotheque
DB_USER=postgres
DB_PASSWORD=1234
```

### 4. Démarrer l'application

En développement :

```bash
npm run dev
```

Pour démarrer l'application :

```bash
npm start
```

L'application sera accessible à :

```text
http://localhost:3000
```

## Base de données

Le projet utilise PostgreSQL.

Le fichier `schema.sql` contient la structure nécessaire à la création des tables :

* `auteurs`
* `adherents`
* `livres`
* `emprunts`

L'application initialise automatiquement la structure de la base de données au démarrage.

## API

Principales routes disponibles :

```text
GET    /api/auteurs
POST   /api/auteurs
PUT    /api/auteurs/:id
DELETE /api/auteurs/:id

GET    /api/adherents
POST   /api/adherents
PUT    /api/adherents/:id
DELETE /api/adherents/:id

GET    /api/livres
POST   /api/livres
PUT    /api/livres/:id
DELETE /api/livres/:id

GET    /api/emprunts
POST   /api/emprunts
PUT    /api/emprunts/:id

GET    /api/statistiques
```

## Déploiement

L'application est déployée sur Render.

Configuration du déploiement :

* Web Service : Node.js / Express
* Base de données : PostgreSQL
* Build Command : `npm install`
* Start Command : `npm start`

## Application en ligne

https://bibliotheque-dev.onrender.com

## Auteur

Salem KONGOLO

Projet réalisé dans le cadre de notre formation Full Stack — Akieni Academy.
