const pool = require('../config/database');

const getStatistiques = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM livres) AS total_livres,
        (SELECT COUNT(*) FROM adherents) AS total_adherents,
        (SELECT COUNT(*)
         FROM emprunts
         WHERE date_retour IS NULL) AS emprunts_en_cours,
        (SELECT COUNT(*)
         FROM emprunts
         WHERE date_retour IS NULL
           AND date_retour_prevue < CURRENT_DATE) AS emprunts_en_retard
    `);

    const livrePlusEmprunte = await pool.query(`
      SELECT livres.id,
             livres.titre,
             COUNT(emprunts.id) AS nombre_emprunts
      FROM livres
      JOIN emprunts ON livres.id = emprunts.livre_id
      GROUP BY livres.id, livres.titre
      ORDER BY nombre_emprunts DESC
      LIMIT 1
    `);

    const adherentPlusActif = await pool.query(`
      SELECT adherents.id,
             adherents.nom,
             COUNT(emprunts.id) AS nombre_emprunts
      FROM adherents
      JOIN emprunts ON adherents.id = emprunts.adherent_id
      GROUP BY adherents.id, adherents.nom
      ORDER BY nombre_emprunts DESC
      LIMIT 1
    `);

    res.json({
      total_livres: Number(result.rows[0].total_livres),
      total_adherents: Number(result.rows[0].total_adherents),
      emprunts_en_cours: Number(result.rows[0].emprunts_en_cours),
      emprunts_en_retard: Number(result.rows[0].emprunts_en_retard),
      livre_plus_emprunte: livrePlusEmprunte.rows[0] || null,
      adherent_plus_actif: adherentPlusActif.rows[0] || null
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Erreur lors de la récupération des statistiques'
    });
  }
};

module.exports = {
  getStatistiques
};