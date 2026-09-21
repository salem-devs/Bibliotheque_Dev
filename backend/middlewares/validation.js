const validerAdherent = (req, res, next) => {
  const { nom, contact } = req.body;

  if (!nom || !contact) {
    return res.status(400).json({
      message: 'Le nom et le contact sont obligatoires'
    });
  }

  next();
};

const validerLivre = (req, res, next) => {
  const { titre, auteur_id } = req.body;

  if (!titre || !auteur_id) {
    return res.status(400).json({
      message: 'Le titre et l’auteur sont obligatoires'
    });
  }

  next();
};

module.exports = {
  validerAdherent,
  validerLivre
};