const pool = require('../config/database');

const getLivres = async (req, res) => {
  try {
    const { search = '', page = 1, limit = 10 } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const offset = (pageNumber - 1) * limitNumber;

    const searchValue = `%${search}%`;

    const countResult = await pool.query(
      `
      SELECT COUNT(*) AS total
      FROM livres
      JOIN auteurs ON livres.auteur_id = auteurs.id
      WHERE livres.titre ILIKE $1
         OR auteurs.nom ILIKE $1
      `,
      [searchValue]
    );

    const result = await pool.query(
      `
      SELECT livres.id,
             livres.titre,
             livres.annee_publication,
             livres.statut,
             auteurs.nom AS auteur
      FROM livres
      JOIN auteurs ON livres.auteur_id = auteurs.id
      WHERE livres.titre ILIKE $1
         OR auteurs.nom ILIKE $1
      ORDER BY livres.id
      LIMIT $2 OFFSET $3
      `,
      [searchValue, limitNumber, offset]
    );

    res.json({
      data: result.rows,
      page: pageNumber,
      limit: limitNumber,
      total: Number(countResult.rows[0].total)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Erreur lors de la récupération des livres'
    });
  }
};

const createLivre = async (req, res) => {
  try {
    const { titre, auteur_id, annee_publication } = req.body;

    if (!titre || !auteur_id) {
      return res.status(400).json({
        message: 'Le titre et l’auteur sont obligatoires'
      });
    }

    const result = await pool.query(
      `INSERT INTO livres (titre, auteur_id, annee_publication)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [titre, auteur_id, annee_publication]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Erreur lors de la création du livre'
    });
  }
};

const updateLivre = async (req, res) => {
  try {
    const { id } = req.params;
    const { titre, auteur_id, annee_publication } = req.body;

    if (!titre || !auteur_id) {
      return res.status(400).json({
        message: 'Le titre et l’auteur sont obligatoires'
      });
    }

    const result = await pool.query(
      `UPDATE livres
       SET titre = $1,
           auteur_id = $2,
           annee_publication = $3
       WHERE id = $4
       RETURNING *`,
      [titre, auteur_id, annee_publication, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Livre introuvable'
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Erreur lors de la modification du livre'
    });
  }
};

const deleteLivre = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM livres WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Livre introuvable'
      });
    }

    res.json({
      message: 'Livre supprimé avec succès'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Erreur lors de la suppression du livre'
    });
  }
};

module.exports = {
  getLivres,
  createLivre,
  updateLivre,
  deleteLivre
};