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

const validerAuteur = (req, res, next) => {
  const { nom } = req.body;

  if (!nom) {
    return res.status(400).json({
      message: 'Le nom de l’auteur est obligatoire'
    });
  }

  next();
};

const validerEmprunt = (req, res, next) => {
  const { adherent_id, livre_id, date_retour_prevue } = req.body;

  if (!adherent_id || !livre_id || !date_retour_prevue) {
    return res.status(400).json({
      message: 'L’adhérent, le livre et la date de retour prévue sont obligatoires'
    });
  }

  next();
};

module.exports = {
  validerAdherent,
  validerLivre,
  validerAuteur,
  validerEmprunt
};