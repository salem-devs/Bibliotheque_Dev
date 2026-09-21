const pool = require('../config/database');

const getEmprunts = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT emprunts.id,
             adherents.nom AS adherent,
             livres.titre AS livre,
             emprunts.date_emprunt,
             emprunts.date_retour_prevue,
             emprunts.date_retour
      FROM emprunts
      JOIN adherents ON emprunts.adherent_id = adherents.id
      JOIN livres ON emprunts.livre_id = livres.id
      ORDER BY emprunts.id
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Erreur lors de la récupération des emprunts'
    });
  }
};

const createEmprunt = async (req, res) => {
  const client = await pool.connect();

  try {
    const { adherent_id, livre_id, date_retour_prevue } = req.body;

    if (!adherent_id || !livre_id || !date_retour_prevue) {
      return res.status(400).json({
        message: 'L’adhérent, le livre et la date de retour prévue sont obligatoires'
      });
    }

    await client.query('BEGIN');

    const livreResult = await client.query(
      'SELECT * FROM livres WHERE id = $1 FOR UPDATE',
      [livre_id]
    );

    if (livreResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        message: 'Livre introuvable'
      });
    }

    if (livreResult.rows[0].statut === 'emprunte') {
      await client.query('ROLLBACK');
      return res.status(400).json({
        message: 'Ce livre est déjà emprunté'
      });
    }

    const empruntResult = await client.query(
      `
      INSERT INTO emprunts
        (adherent_id, livre_id, date_retour_prevue)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [adherent_id, livre_id, date_retour_prevue]
    );

    await client.query(
      `UPDATE livres
       SET statut = 'emprunte'
       WHERE id = $1`,
      [livre_id]
    );

    await client.query('COMMIT');

    res.status(201).json(empruntResult.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);

    res.status(500).json({
      message: 'Erreur lors de la création de l’emprunt'
    });
  } finally {
    client.release();
  }
};

const retournerEmprunt = async (req, res) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;

    await client.query('BEGIN');

    const empruntResult = await client.query(
      'SELECT * FROM emprunts WHERE id = $1 FOR UPDATE',
      [id]
    );

    if (empruntResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        message: 'Emprunt introuvable'
      });
    }

    const emprunt = empruntResult.rows[0];

    if (emprunt.date_retour !== null) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        message: 'Cet emprunt est déjà retourné'
      });
    }

    await client.query(
      `
      UPDATE emprunts
      SET date_retour = CURRENT_DATE
      WHERE id = $1
      `,
      [id]
    );

    await client.query(
      `
      UPDATE livres
      SET statut = 'disponible'
      WHERE id = $1
      `,
      [emprunt.livre_id]
    );

    await client.query('COMMIT');

    res.json({
      message: 'Livre retourné avec succès'
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);

    res.status(500).json({
      message: 'Erreur lors du retour du livre'
    });
  } finally {
    client.release();
  }
};

const getEmpruntsEnCours = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT emprunts.id,
             adherents.nom AS adherent,
             livres.titre AS livre,
             emprunts.date_emprunt,
             emprunts.date_retour_prevue
      FROM emprunts
      JOIN adherents ON emprunts.adherent_id = adherents.id
      JOIN livres ON emprunts.livre_id = livres.id
      WHERE emprunts.date_retour IS NULL
      ORDER BY emprunts.date_retour_prevue
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Erreur lors de la récupération des emprunts en cours'
    });
  }
};

const getEmpruntsEnRetard = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT emprunts.id,
             adherents.nom AS adherent,
             livres.titre AS livre,
             emprunts.date_emprunt,
             emprunts.date_retour_prevue
      FROM emprunts
      JOIN adherents ON emprunts.adherent_id = adherents.id
      JOIN livres ON emprunts.livre_id = livres.id
      WHERE emprunts.date_retour IS NULL
        AND emprunts.date_retour_prevue < CURRENT_DATE
      ORDER BY emprunts.date_retour_prevue
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Erreur lors de la récupération des emprunts en retard'
    });
  }
};

const getHistoriqueAdherent = async (req, res) => {
  try {
    const { adherentId } = req.params;

    const result = await pool.query(
      `
      SELECT emprunts.id,
             livres.titre AS livre,
             emprunts.date_emprunt,
             emprunts.date_retour_prevue,
             emprunts.date_retour
      FROM emprunts
      JOIN livres ON emprunts.livre_id = livres.id
      WHERE emprunts.adherent_id = $1
      ORDER BY emprunts.date_emprunt DESC
      `,
      [adherentId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Erreur lors de la récupération de l’historique'
    });
  }
};

module.exports = {
  getEmprunts,
  createEmprunt,
  retournerEmprunt,
  getEmpruntsEnCours,
  getEmpruntsEnRetard,
  getHistoriqueAdherent
};