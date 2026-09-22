CREATE TABLE auteurs (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    nationalite VARCHAR(100)
);

CREATE TABLE adherents (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    contact VARCHAR(150) NOT NULL
);

CREATE TABLE livres (
    id SERIAL PRIMARY KEY,
    titre VARCHAR(200) NOT NULL,
    auteur_id INTEGER NOT NULL,
    annee_publication INTEGER,
    statut VARCHAR(20) NOT NULL DEFAULT 'disponible',

    CONSTRAINT fk_livre_auteur
        FOREIGN KEY (auteur_id)
        REFERENCES auteurs(id),

    CONSTRAINT check_statut_livre
        CHECK (statut IN ('disponible', 'emprunte'))
);

CREATE TABLE emprunts (
    id SERIAL PRIMARY KEY,
    adherent_id INTEGER NOT NULL,
    livre_id INTEGER NOT NULL,
    date_emprunt DATE NOT NULL DEFAULT CURRENT_DATE,
    date_retour_prevue DATE NOT NULL,
    date_retour DATE,

    CONSTRAINT fk_emprunt_adherent
        FOREIGN KEY (adherent_id)
        REFERENCES adherents(id),

    CONSTRAINT fk_emprunt_livre
        FOREIGN KEY (livre_id)
        REFERENCES livres(id)
);