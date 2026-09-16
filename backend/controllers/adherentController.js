const pool = require('../config/database');

const getAdherents = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM adherents ORDER BY id'
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Erreur lors de la récupération des adhérents'
    });
  }
};

const createAdherent = async (req, res) => {
  try {
    const { nom, contact } = req.body;

    if (!nom || !contact) {
      return res.status(400).json({
        message: 'Le nom et le contact sont obligatoires'
      });
    }

    const result = await pool.query(
      `INSERT INTO adherents (nom, contact)
       VALUES ($1, $2)
       RETURNING *`,
      [nom, contact]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur lors de la création de l'adhérent"
    });
  }
};

const updateAdherent = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, contact } = req.body;

    if (!nom || !contact) {
      return res.status(400).json({
        message: 'Le nom et le contact sont obligatoires'
      });
    }

    const result = await pool.query(
      `UPDATE adherents
       SET nom = $1, contact = $2
       WHERE id = $3
       RETURNING *`,
      [nom, contact, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Adhérent introuvable'
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur lors de la modification de l'adhérent"
    });
  }
};

const deleteAdherent = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM adherents WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Adhérent introuvable'
      });
    }

    res.json({
      message: 'Adhérent supprimé avec succès'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur lors de la suppression de l'adhérent"
    });
  }
};

module.exports = {
  getAdherents,
  createAdherent,
  updateAdherent,
  deleteAdherent
};